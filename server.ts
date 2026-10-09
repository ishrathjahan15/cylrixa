import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ScanResult } from './shared/types.js';
import { evaluateUrlHeuristics } from './server/riskEngine.js';
import { queryThreatProviders } from './server/providers.js';
import { generateSecurityExplanation } from './server/geminiService.js';
import { analyzeSuspiciousMessage } from './server/messageAnalyzer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Simple in-memory scan store (max 100 entries, sanitized URLs)
const scanCache = new Map<string, ScanResult>();

// Middleware
app.use(express.json({ limit: '2mb' }));

// CORS configuration to allow local web and browser extensions
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://') || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('.run.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Simple sliding window rate limiter
const ipRequests = new Map<string, { count: number; expiresAt: number }>();
app.use('/api/', (req, res, next) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipRequests.get(clientIp);

  if (!entry || now > entry.expiresAt) {
    ipRequests.set(clientIp, { count: 1, expiresAt: now + 60000 });
  } else {
    entry.count++;
    if (entry.count > 120) {
      res.status(429).json({ error: 'Too many requests. Please slow down.' });
      return;
    }
  }
  next();
});

// Sanitizes URL for privacy-preserving history (removes tokens, passwords, session ids)
function sanitizeUrlForPrivacy(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    // Mask sensitive query parameters
    const sensitiveKeys = ['token', 'key', 'auth', 'password', 'pass', 'session', 'secret', 'code', 'otp', 'access_token', 'jwt'];
    parsed.searchParams.forEach((_, key) => {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        parsed.searchParams.set(key, '[REDACTED_FOR_PRIVACY]');
      }
    });
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

// Deterministic Demo Scenarios
const DEMO_SCENARIOS: Record<string, Partial<ScanResult>> = {
  legitimate: {
    scanId: 'demo-legit-01',
    url: 'https://github.com/clyrixa/security',
    normalizedUrl: 'https://github.com/clyrixa/security',
    hostname: 'github.com',
    registrableDomain: 'github.com',
    status: 'LOW_RISK',
    riskScore: 4,
    confidence: 'HIGH',
    isDemo: true,
    demoScenarioId: 'legitimate',
    coverage: { successful: 3, failed: 0, notConfigured: 5, total: 8 },
    findings: [
      {
        id: 'f-tls',
        category: 'protocol_tls',
        title: 'Valid TLS/HTTPS Encryption',
        observation: 'Encrypted communication via modern TLS 1.3 certificate.',
        significance: 'Protects in-flight data against eavesdropping.',
        sourceRule: 'RULE-NET-TLS-02',
        status: 'confirmed',
        severity: 'informational',
        recommendedAction: 'Verify URL host matches intended service.',
      },
      {
        id: 'f-structure',
        category: 'hostname_structure',
        title: 'Authentic Hostname Structure',
        observation: 'Expected organization and repository navigation path on verified apex domain.',
        significance: 'Zero homoglyphs or misleading subdomains detected.',
        sourceRule: 'RULE-HOST-IDN-01',
        status: 'confirmed',
        severity: 'informational',
        recommendedAction: 'Standard safe browsing protocol.',
      },
    ],
    providers: [
      { name: 'google_safe_browsing', displayName: 'Google Safe Browsing', category: 'threat_db', status: 'connected', verdict: 'clean', notes: 'No threats listed.' },
      { name: 'virustotal', displayName: 'VirusTotal Intelligence', category: 'threat_db', status: 'connected', verdict: 'clean', notes: '0/92 vendors flagged.' },
      { name: 'urlscan_io', displayName: 'urlscan.io', category: 'sandbox', status: 'connected', verdict: 'clean', notes: 'Verified developer infrastructure.' },
      { name: 'phishtank', displayName: 'PhishTank', category: 'threat_db', status: 'manual_lookup_only', notes: 'Official search portal available.' },
    ],
    redirectJourney: [
      { step: 1, url: 'https://github.com/clyrixa/security', hostname: 'github.com', isShortener: false, status: 'Verified endpoint' }
    ],
    aiExplanation: {
      summary: 'Legitimate destination with no detectable security anomalies or deceptive structure (Risk Score: 4/100).',
      riskReasons: ['Reputable domain with consistent structural hierarchy.', 'Valid HTTPS transport encryption.'],
      consequences: ['Standard browsing without identified phishing exposure.'],
      recommendedSteps: ['Safe to browse normally.'],
      language: 'en',
    },
    recommendations: ['Safe to open. Standard verification policies met.'],
    safeToOpen: true,
  },
  subdomain_deception: {
    scanId: 'demo-subdomain-02',
    url: 'https://paypal.com.account-verify.tk/auth/signin?token=928471',
    normalizedUrl: 'https://paypal.com.account-verify.tk/auth/signin?token=[REDACTED_FOR_PRIVACY]',
    hostname: 'paypal.com.account-verify.tk',
    registrableDomain: 'account-verify.tk',
    status: 'CRITICAL_RISK',
    riskScore: 92,
    confidence: 'HIGH',
    isDemo: true,
    demoScenarioId: 'subdomain_deception',
    coverage: { successful: 3, failed: 0, notConfigured: 5, total: 8 },
    brandComparison: {
      detectedBrand: 'PayPal',
      officialDomain: 'paypal.com',
      actualHostname: 'paypal.com.account-verify.tk',
      mismatchType: 'subdomain_deception',
      explanation: 'Pretends to be PayPal by putting "paypal.com" as a subdomain of foreign registrant "account-verify.tk".',
    },
    findings: [
      {
        id: 'f-subdomain-brand',
        category: 'brand_impersonation',
        title: 'Brand Impersonation: PayPal Subdomain Deception',
        observation: 'The string "paypal.com" is placed in the subdomain of external host "account-verify.tk".',
        significance: 'Deceptive technique intended to trick users who only check the beginning of the domain.',
        sourceRule: 'RULE-BRAND-SPOOF-01',
        status: 'confirmed',
        severity: 'critical',
        recommendedAction: 'Do not enter credentials. Genuine PayPal accounts never reside on .tk domains.',
      },
      {
        id: 'f-tld',
        category: 'reputation',
        title: 'High-Abuse Free TLD (.tk)',
        observation: 'Target host is registered on .tk, historically associated with disposable phishing campaigns.',
        significance: 'Disposable registrars are commonly used for short-lived credential harvesting.',
        sourceRule: 'RULE-TLD-RISK-01',
        status: 'confirmed',
        severity: 'high',
        recommendedAction: 'Block immediately.',
      },
    ],
    providers: [
      { name: 'google_safe_browsing', displayName: 'Google Safe Browsing', category: 'threat_db', status: 'connected', verdict: 'malicious', notes: 'Flagged as SOCIAL_ENGINEERING.' },
      { name: 'virustotal', displayName: 'VirusTotal Intelligence', category: 'threat_db', status: 'connected', verdict: 'malicious', notes: '18 security vendors classified as Phishing.' },
      { name: 'phishtank', displayName: 'PhishTank', category: 'threat_db', status: 'manual_lookup_only', notes: 'Community report pending verification.' },
    ],
    redirectJourney: [
      { step: 1, url: 'https://paypal.com.account-verify.tk/auth/signin', hostname: 'paypal.com.account-verify.tk', isShortener: false, status: 'Malicious phishing landing page' }
    ],
    aiExplanation: {
      summary: 'Critical credential harvesting scam disguised as PayPal (Risk Score: 92/100).',
      riskReasons: ['The real domain is account-verify.tk, NOT paypal.com.', 'Free .tk TLD commonly exploited by threat actors.', 'Direct attempt to capture login credentials.'],
      consequences: ['Immediate account takeover and unauthorized withdrawal of funds.', 'Loss of connected bank and credit card details.'],
      recommendedSteps: ['Close the tab immediately.', 'Do not enter email, password, or security codes.', 'Navigate to paypal.com directly if you suspect your account has issues.'],
      language: 'en',
    },
    recommendations: ['Do NOT continue navigation.', 'Report to PayPal Anti-Phishing (spoof@paypal.com).'],
    safeToOpen: false,
  },
  typosquatting: {
    scanId: 'demo-typo-03',
    url: 'https://paypa1-security-update.xyz/login?ref=urgent',
    normalizedUrl: 'https://paypa1-security-update.xyz/login?ref=urgent',
    hostname: 'paypa1-security-update.xyz',
    registrableDomain: 'paypa1-security-update.xyz',
    status: 'HIGH_RISK',
    riskScore: 78,
    confidence: 'HIGH',
    isDemo: true,
    demoScenarioId: 'typosquatting',
    coverage: { successful: 2, failed: 0, notConfigured: 6, total: 8 },
    brandComparison: {
      detectedBrand: 'PayPal',
      officialDomain: 'paypal.com',
      actualHostname: 'paypa1-security-update.xyz',
      mismatchType: 'typosquatting',
      explanation: 'Substituted digit "1" for letter "l" in paypa1 to deceive user visual inspection.',
    },
    findings: [
      {
        id: 'f-typo',
        category: 'brand_impersonation',
        title: 'Typosquatting Substitution (paypa1)',
        observation: 'Character substitution detected: "paypa1" mimics "paypal".',
        significance: 'Classic typosquatting designed to exploit typographical or visual oversight.',
        sourceRule: 'RULE-BRAND-SPOOF-01',
        status: 'confirmed',
        severity: 'critical',
        recommendedAction: 'Inspect spelling closely. Genuine brand uses standard Latin letter "l".',
      },
      {
        id: 'f-tld-xyz',
        category: 'reputation',
        title: 'Suspicious TLD with Urgency Keywords',
        observation: 'Registered on .xyz with keywords "security-update" and "urgent".',
        significance: 'Fabricated sense of urgency combined with cheap disposable domain.',
        sourceRule: 'RULE-PATH-AUTH-01',
        status: 'heuristic',
        severity: 'high',
        recommendedAction: 'Close immediately.',
      },
    ],
    providers: [
      { name: 'google_safe_browsing', displayName: 'Google Safe Browsing', category: 'threat_db', status: 'connected', verdict: 'suspicious', notes: 'Flagged suspicious heuristic match.' },
      { name: 'virustotal', displayName: 'VirusTotal Intelligence', category: 'threat_db', status: 'connected', verdict: 'suspicious', notes: '5 engines flagged suspicious.' },
    ],
    redirectJourney: [
      { step: 1, url: 'https://paypa1-security-update.xyz/login', hostname: 'paypa1-security-update.xyz', isShortener: false, status: 'Phishing replica gateway' }
    ],
    aiExplanation: {
      summary: 'High risk typosquatted fake domain mimicking PayPal (Risk Score: 78/100).',
      riskReasons: ['Digit "1" swapped for letter "l" (paypa1).', 'Keywords create artificial panic about security updates.'],
      consequences: ['Credentials typed will be sent directly to unauthorized attacker servers.'],
      recommendedSteps: ['Do not provide credentials.', 'Close and clear browser cache.'],
      language: 'en',
    },
    recommendations: ['Do not open or interact with forms.'],
    safeToOpen: false,
  },
  shortener: {
    scanId: 'demo-short-04',
    url: 'https://bit.ly/3xSampleShortener',
    normalizedUrl: 'https://bit.ly/3xSampleShortener',
    hostname: 'bit.ly',
    registrableDomain: 'bit.ly',
    status: 'MODERATE_RISK',
    riskScore: 35,
    confidence: 'LIMITED',
    isDemo: true,
    demoScenarioId: 'shortener',
    coverage: { successful: 2, failed: 0, notConfigured: 6, total: 8 },
    findings: [
      {
        id: 'f-shortener',
        category: 'redirect_anomaly',
        title: 'URL Shortener Conceals True Endpoint',
        observation: 'Bitly redirection link masks the real target server.',
        significance: 'Security filters and human reviewers cannot verify destination safety without expansion.',
        sourceRule: 'RULE-REDIR-SHORT-01',
        status: 'confirmed',
        severity: 'medium',
        recommendedAction: 'Expand shortened link or inspect destination before visiting.',
      },
    ],
    providers: [
      { name: 'google_safe_browsing', displayName: 'Google Safe Browsing', category: 'threat_db', status: 'connected', verdict: 'clean', notes: 'Shortener domain itself is clean.' },
      { name: 'virustotal', displayName: 'VirusTotal Intelligence', category: 'threat_db', status: 'connected', verdict: 'clean', notes: 'Aggregator clean; unexpanded endpoint unknown.' },
    ],
    redirectJourney: [
      { step: 1, url: 'https://bit.ly/3xSampleShortener', hostname: 'bit.ly', isShortener: true, status: 'Redirection gateway' },
      { step: 2, url: '[Target endpoint concealed behind shortener]', hostname: 'Unknown destination', isShortener: false, domainChanged: true, status: 'Inspection recommended' },
    ],
    aiExplanation: {
      summary: 'Moderate risk due to link masking (Risk Score: 35/100). Destination requires preview.',
      riskReasons: ['Destination hostname is hidden from the user.', 'Phishers frequently use URL shorteners in SMS/WhatsApp.'],
      consequences: ['May lead to an unexpected scam or unvetted promotional website.'],
      recommendedSteps: ['Preview the link using Clyrixa before allowing full navigation.'],
      language: 'en',
    },
    recommendations: ['Check destination before entering information.'],
    safeToOpen: false,
  },
  inconclusive: {
    scanId: 'demo-inconclusive-05',
    url: 'https://unverified-newly-registered-host.biz/portal',
    normalizedUrl: 'https://unverified-newly-registered-host.biz/portal',
    hostname: 'unverified-newly-registered-host.biz',
    registrableDomain: 'unverified-newly-registered-host.biz',
    status: 'INCONCLUSIVE',
    riskScore: 28,
    confidence: 'UNVERIFIED',
    isDemo: true,
    demoScenarioId: 'inconclusive',
    coverage: { successful: 1, failed: 2, notConfigured: 5, total: 8 },
    findings: [
      {
        id: 'f-inconclusive',
        category: 'reputation',
        title: 'Insufficient Global Telemetry',
        observation: 'Newly registered domain with no prior safety history or vendor reports.',
        significance: 'The absence of negative reports does NOT equate to a clean verdict.',
        sourceRule: 'RULE-COV-ZERO-01',
        status: 'inconclusive',
        severity: 'medium',
        recommendedAction: 'Proceed with extreme caution or verify identity independently.',
      },
    ],
    providers: [
      { name: 'google_safe_browsing', displayName: 'Google Safe Browsing', category: 'threat_db', status: 'unavailable', notes: 'Service timeout / rate limit reached.' },
      { name: 'virustotal', displayName: 'VirusTotal Intelligence', category: 'threat_db', status: 'unavailable', notes: 'No scan history recorded in database.' },
    ],
    redirectJourney: [
      { step: 1, url: 'https://unverified-newly-registered-host.biz/portal', hostname: 'unverified-newly-registered-host.biz', isShortener: false, status: 'Unverified host' },
    ],
    aiExplanation: {
      summary: 'Scan Inconclusive: Unable to verify this link against reliable intelligence (Confidence: UNVERIFIED).',
      riskReasons: ['Primary reputation providers were unreachable or had no historical records.', 'Insufficient data to guarantee safety.'],
      consequences: ['Uncertain. Never treat an unverified link as confirmed safe.'],
      recommendedSteps: ['Confirm link origin with the sender before providing credentials.'],
      language: 'en',
    },
    recommendations: ['Unable to confirm safety. Exercise caution.'],
    safeToOpen: false,
  },
};

// API Endpoints

// 1. POST /api/scan
app.post('/api/scan', async (req: Request, res: Response) => {
  try {
    const { url, consentExternalProviders = false, demoScenario, language = 'en' } = req.body;

    if (demoScenario && DEMO_SCENARIOS[demoScenario]) {
      const fixture = JSON.parse(JSON.stringify(DEMO_SCENARIOS[demoScenario])) as ScanResult;
      fixture.scannedAt = new Date().toISOString();
      if (language && (language === 'te' || language === 'hi')) {
        try {
          const aiExp = await generateSecurityExplanation({
            url: fixture.url,
            hostname: fixture.hostname,
            status: fixture.status,
            riskScore: fixture.riskScore,
            findings: fixture.findings,
            brandComparison: fixture.brandComparison,
            language: language as 'te' | 'hi',
          });
          fixture.aiExplanation = aiExp;
        } catch (err) {
          console.error('Failed generating localized demo explanation:', err);
        }
      }
      scanCache.set(fixture.scanId, fixture);
      res.json(fixture);
      return;
    }

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      res.status(400).json({ error: 'A valid URL must be provided.' });
      return;
    }

    if (url.length > 2048) {
      res.status(400).json({ error: 'URL exceeds maximum length limit of 2048 characters.' });
      return;
    }

    // Heuristics evaluation
    const heuristics = evaluateUrlHeuristics(url);

    // Threat intelligence providers query
    const { providers, additionalFindings } = await queryThreatProviders({
      url: heuristics.parsedUrl.href,
      hostname: heuristics.parsedUrl.hostname,
      consentExternal: Boolean(consentExternalProviders),
    });

    const allFindings = [...heuristics.findings, ...additionalFindings];

    // Recalculate score if threat providers returned findings
    let totalScore = heuristics.riskScore;
    if (additionalFindings.some(f => f.severity === 'critical')) {
      totalScore = Math.max(totalScore, 90);
    } else if (additionalFindings.some(f => f.severity === 'high')) {
      totalScore = Math.max(totalScore, 75);
    }

    let finalStatus = heuristics.status;
    if (totalScore >= 80) finalStatus = 'CRITICAL_RISK';
    else if (totalScore >= 50) finalStatus = 'HIGH_RISK';
    else if (totalScore >= 20) finalStatus = 'MODERATE_RISK';
    else finalStatus = 'LOW_RISK';

    // AI Explanation synthesis
    const aiExplanation = await generateSecurityExplanation({
      url: heuristics.parsedUrl.href,
      hostname: heuristics.parsedUrl.hostname,
      status: finalStatus,
      riskScore: totalScore,
      findings: allFindings,
      brandComparison: heuristics.brandComparison,
      language: language as 'en' | 'te' | 'hi',
    });

    const scanId = 'scan-' + Math.random().toString(36).substring(2, 10);
    const sanitizedUrl = sanitizeUrlForPrivacy(heuristics.parsedUrl.href);

    const successfulProviders = providers.filter(p => p.status === 'connected').length;
    const failedProviders = providers.filter(p => p.status === 'error' || p.status === 'unavailable').length;
    const notConfigured = providers.filter(p => p.status === 'not_configured' || p.status === 'manual_lookup_only').length;

    const result: ScanResult = {
      scanId,
      url: sanitizedUrl,
      normalizedUrl: heuristics.parsedUrl.href,
      hostname: heuristics.parsedUrl.hostname,
      registrableDomain: heuristics.parsedUrl.hostname,
      status: finalStatus,
      riskScore: totalScore,
      confidence: heuristics.confidence,
      scannedAt: new Date().toISOString(),
      coverage: {
        successful: successfulProviders + 1, // +1 for local heuristic engine
        failed: failedProviders,
        notConfigured,
        total: providers.length + 1,
      },
      brandComparison: heuristics.brandComparison,
      findings: allFindings,
      providers,
      redirectJourney: heuristics.redirectJourney,
      aiExplanation,
      recommendations: aiExplanation.recommendedSteps,
      safeToOpen: finalStatus === 'LOW_RISK',
    };

    scanCache.set(scanId, result);

    res.json(result);
  } catch (err: unknown) {
    console.error('Error during URL scan:', err);
    res.status(500).json({
      error: 'Scan operation failed. Please verify the URL format and try again.',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// 2. GET /api/scan/:scanId
app.get('/api/scan/:scanId', (req: Request, res: Response) => {
  const scan = scanCache.get(req.params.scanId);
  if (!scan) {
    res.status(404).json({ error: 'Scan report not found or expired.' });
    return;
  }
  res.json(scan);
});

// 3. POST /api/analyze-message
app.post('/api/analyze-message', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message text must be provided.' });
      return;
    }
    const result = await analyzeSuspiciousMessage(message);
    res.json(result);
  } catch (err: unknown) {
    console.error('Error analyzing message:', err);
    res.status(500).json({ error: 'Message analysis failed.' });
  }
});

// 4. GET /api/demo-scenarios
app.get('/api/demo-scenarios', (_req: Request, res: Response) => {
  res.json({
    scenarios: [
      { id: 'legitimate', label: 'Legitimate Developer Service (GitHub)', expectedRisk: 'LOW_RISK' },
      { id: 'subdomain_deception', label: 'Subdomain Deception (PayPal spoof on .tk)', expectedRisk: 'CRITICAL_RISK' },
      { id: 'typosquatting', label: 'Typosquatting & Urgency (paypa1 on .xyz)', expectedRisk: 'HIGH_RISK' },
      { id: 'shortener', label: 'URL Shortener Obfuscation (bit.ly)', expectedRisk: 'MODERATE_RISK' },
      { id: 'inconclusive', label: 'Unverified / Inconclusive Telemetry', expectedRisk: 'INCONCLUSIVE' },
    ]
  });
});

// 5. GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'Clyrixa',
    version: '1.0.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    gsbConfigured: Boolean(process.env.GOOGLE_SAFE_BROWSING_API_KEY),
    vtConfigured: Boolean(process.env.VIRUSTOTAL_API_KEY),
    urlscanConfigured: Boolean(process.env.URLSCAN_API_KEY),
  });
});

// Serve frontend: Vite in development or static dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Clyrixa server running on port ${PORT} [Mode: ${isDev ? 'Development' : 'Production'}]`);
  });
}

startServer();
