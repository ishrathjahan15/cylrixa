import { MessageAnalysisResult, ScanResult, FindingSeverity } from '../shared/types.js';
import { evaluateUrlHeuristics } from './riskEngine.js';
import { queryThreatProviders } from './providers.js';
import { generateSecurityExplanation } from './geminiService.js';

interface UrgencyRule {
  pattern: RegExp;
  reason: string;
  type: 'urgency' | 'credential_pressure' | 'financial_lure' | 'otp_request' | 'impersonation';
  severity: FindingSeverity;
}

const URGENCY_RULES: UrgencyRule[] = [
  {
    pattern: /(immediately|within \d+ hours?|urgent action required|account will be (suspended|blocked|terminated)|today only|before midnight)/i,
    reason: 'Artificial time pressure designed to bypass critical thinking and provoke hasty action.',
    type: 'urgency',
    severity: 'high',
  },
  {
    pattern: /(share otp|send (otp|pin|password)|enter (otp|pin)|verify your 2fa|provide cvv)/i,
    reason: 'Explicit request for one-time verification code or secret PIN. Authentic institutions never request OTPs via outbound messages.',
    type: 'otp_request',
    severity: 'critical',
  },
  {
    pattern: /(kyc (pending|update|mandatory)|pan card linked|aadhaar update|sim (blocked|deactivated)|electricity will be disconnected)/i,
    reason: 'Classic administrative intimidation tactic threatening service disruption unless immediate link action is taken.',
    type: 'credential_pressure',
    severity: 'high',
  },
  {
    pattern: /(congratulations|won (lottery|\$|rs|inr|cash)|claim your prize|free gift|unclaimed reward|tax refund)/i,
    reason: 'Unsolicited financial lure promising unexpected windfall to entice user into clicking.',
    type: 'financial_lure',
    severity: 'high',
  },
  {
    pattern: /(dear customer|dear user|official notice|security department|fraud detection team)/i,
    reason: 'Generic salutation mimicking official institutional communication without verifiable personal identifier.',
    type: 'impersonation',
    severity: 'medium',
  },
];

export async function analyzeSuspiciousMessage(messageText: string): Promise<MessageAnalysisResult> {
  const text = messageText.trim();

  // 1. URL extraction regex (safely matches standard web URLs)
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+|www\.[^\s<>"'{}|\\^`]+|[a-zA-Z0-9-]+\.(?:com|org|net|in|io|xyz|top|site|info|online|tk|buzz|work)[^\s<>"'{}|\\^`]*)/gi;
  const rawMatches = text.match(urlRegex) || [];
  
  // Deduplicate and normalize
  const extractedUrls = Array.from(new Set(rawMatches)).map(u => {
    if (!/^https?:\/\//i.test(u)) {
      return 'https://' + u;
    }
    return u;
  });

  // 2. Identify contextual warning indicators
  const detectedIndicators: MessageAnalysisResult['detectedIndicators'] = [];

  for (const rule of URGENCY_RULES) {
    const match = text.match(rule.pattern);
    if (match) {
      detectedIndicators.push({
        type: rule.type,
        phrase: match[0],
        reason: rule.reason,
        severity: rule.severity,
      });
    }
  }

  // Determine urgency level
  let urgencyLevel: MessageAnalysisResult['urgencyLevel'] = 'LOW';
  const hasCritical = detectedIndicators.some(d => d.severity === 'critical');
  const hasHigh = detectedIndicators.some(d => d.severity === 'high');
  if (hasCritical) {
    urgencyLevel = 'CRITICAL';
  } else if (hasHigh) {
    urgencyLevel = 'HIGH';
  } else if (detectedIndicators.length > 0) {
    urgencyLevel = 'MEDIUM';
  }

  // 3. Scan extracted URLs
  const scannedUrls: ScanResult[] = [];
  for (const url of extractedUrls) {
    try {
      const heuristics = evaluateUrlHeuristics(url);
      const { providers, additionalFindings } = await queryThreatProviders({
        url: heuristics.parsedUrl.href,
        hostname: heuristics.parsedUrl.hostname,
        consentExternal: false, // Default to local for batch message checks
      });

      const allFindings = [...heuristics.findings, ...additionalFindings];
      const aiExplanation = await generateSecurityExplanation({
        url: heuristics.parsedUrl.href,
        hostname: heuristics.parsedUrl.hostname,
        status: heuristics.status,
        riskScore: heuristics.riskScore,
        findings: allFindings,
        brandComparison: heuristics.brandComparison,
        language: 'en',
      });

      scannedUrls.push({
        scanId: 'msg-' + Math.random().toString(36).substring(2, 10),
        url,
        normalizedUrl: heuristics.parsedUrl.href,
        hostname: heuristics.parsedUrl.hostname,
        registrableDomain: heuristics.parsedUrl.hostname,
        status: heuristics.status,
        riskScore: heuristics.riskScore,
        confidence: heuristics.confidence,
        scannedAt: new Date().toISOString(),
        coverage: {
          successful: 1,
          failed: 0,
          notConfigured: providers.filter(p => p.status === 'not_configured').length,
          total: providers.length + 1,
        },
        brandComparison: heuristics.brandComparison,
        findings: allFindings,
        providers,
        redirectJourney: heuristics.redirectJourney,
        aiExplanation,
        recommendations: aiExplanation.recommendedSteps,
        safeToOpen: heuristics.status === 'LOW_RISK',
      });
    } catch (err) {
      console.warn(`Failed scanning extracted URL ${url}:`, err);
    }
  }

  let aiContextSummary = `Analyzed message containing ${extractedUrls.length} extracted link(s). `;
  if (urgencyLevel === 'CRITICAL' || urgencyLevel === 'HIGH') {
    aiContextSummary += 'Strong psychological coercion detected: Message employs artificial urgency or credential requests typical of social engineering.';
  } else {
    aiContextSummary += 'Standard message indicators observed. Please review the destination links carefully.';
  }

  return {
    originalMessage: text,
    extractedUrls,
    urgencyLevel,
    detectedIndicators,
    scannedUrls,
    aiContextSummary,
  };
}
