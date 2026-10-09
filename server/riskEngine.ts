import { ScanResult, Finding, BrandComparison, RiskLevel, ConfidenceLevel, LinkHop } from '../shared/types.js';

interface BrandProfile {
  name: string;
  officialDomains: string[];
  keywords: string[];
}

const KNOWN_BRANDS: BrandProfile[] = [
  { name: 'PayPal', officialDomains: ['paypal.com', 'paypal.me'], keywords: ['paypal', 'pay-pal', 'paypa1'] },
  { name: 'Microsoft', officialDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'login.microsoftonline.com'], keywords: ['microsoft', 'micros0ft', 'office365', 'outlook', 'onedrive'] },
  { name: 'Google', officialDomains: ['google.com', 'accounts.google.com', 'gmail.com'], keywords: ['google', 'gmail', 'g00gle', 'googl'] },
  { name: 'Apple', officialDomains: ['apple.com', 'icloud.com'], keywords: ['apple', 'icloud', 'appl-id', 'appleid'] },
  { name: 'Netflix', officialDomains: ['netflix.com'], keywords: ['netflix', 'netfIix', 'netf-lix'] },
  { name: 'Amazon', officialDomains: ['amazon.com', 'amazon.co.uk', 'amazon.in'], keywords: ['amazon', 'amaz0n', 'amazn'] },
  { name: 'Chase Bank', officialDomains: ['chase.com'], keywords: ['chase', 'chasebank', 'jpmorganchase'] },
  { name: 'State Bank of India (SBI)', officialDomains: ['onlinesbi.sbi', 'sbi.co.in'], keywords: ['onlinesbi', 'sbi-yono', 'sbi-card', 'sbikyc'] },
  { name: 'HDFC Bank', officialDomains: ['hdfcbank.com'], keywords: ['hdfc', 'hdfcbank', 'netbanking-hdfc'] },
  { name: 'Meta / Instagram', officialDomains: ['instagram.com', 'facebook.com', 'meta.com'], keywords: ['instagram', 'facebook', 'meta-support', 'fb-verify'] },
  { name: 'Binance', officialDomains: ['binance.com'], keywords: ['binance', 'binance-wallet', 'binance-login'] },
  { name: 'Steam', officialDomains: ['steampowered.com', 'steamcommunity.com'], keywords: ['steamcommunity', 'steampowered', 'steam-gift'] },
  { name: 'DHL Express', officialDomains: ['dhl.com'], keywords: ['dhl-tracking', 'dhl-delivery', 'dhl-express'] },
  { name: 'USPS', officialDomains: ['usps.com'], keywords: ['usps-tracking', 'usps-package', 'us-postal'] },
];

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly', 'rb.gy', 'shorturl.at', 'tiny.cc', 'bl.ink'
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'work', 'buzz', 'fit', 'country', 'tk', 'ml', 'ga', 'cf', 'gq', 'cam', 'monster', 'rest', 'sbs', 'click', 'cfd'
]);

const CREDENTIAL_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'verify', 'verification', 'update-billing', 'secure-account',
  'account-suspended', 'kyc', 'otp', 'unlock', 'password-reset', 'confirm-identity', 'auth-token', 'security-alert'
];

// SSRF checks to prevent malicious backend requests
export function isPrivateOrReservedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower.endsWith('.local') || lower.endsWith('.internal')) {
    return true;
  }

  // IPv4 regex check
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const octets = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
    if (octets.some(o => o < 0 || o > 255)) return true;

    // Loopback 127.0.0.0/8
    if (octets[0] === 127) return true;
    // 0.0.0.0/8
    if (octets[0] === 0) return true;
    // Private RFC 1918
    if (octets[0] === 10) return true;
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
    if (octets[0] === 192 && octets[1] === 168) return true;
    // Link-local 169.254.0.0/16
    if (octets[0] === 169 && octets[1] === 254) return true;
    // Broadcast
    if (octets[0] === 255 && octets[1] === 255 && octets[2] === 255 && octets[3] === 255) return true;
  }

  // IPv6 loopback
  if (lower === '::1' || lower === '[::1]' || lower.startsWith('fe80:')) {
    return true;
  }

  return false;
}

export function extractRegistrableDomain(hostname: string): string {
  const parts = hostname.toLowerCase().split('.');
  if (parts.length <= 2) return hostname.toLowerCase();

  // Handle multi-part suffixes like .co.uk, .com.au, .co.in
  const secondLast = parts[parts.length - 2];
  if (['co', 'com', 'org', 'net', 'edu', 'gov'].includes(secondLast) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

export function evaluateUrlHeuristics(rawInput: string): {
  parsedUrl: URL;
  findings: Finding[];
  brandComparison?: BrandComparison;
  riskScore: number;
  confidence: ConfidenceLevel;
  status: RiskLevel;
  redirectJourney: LinkHop[];
} {
  let urlStr = rawInput.trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }

  const parsedUrl = new URL(urlStr);
  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullPath = pathname + search;
  const registrableDomain = extractRegistrableDomain(hostname);

  const findings: Finding[] = [];
  let scoreAccumulator = 0;
  let brandComparison: BrandComparison | undefined;

  // 1. SSRF / Local IP check
  if (isPrivateOrReservedHost(hostname)) {
    findings.push({
      id: 'ssrf-internal-host',
      category: 'hostname_structure',
      title: 'Restricted Internal or Loopback Destination',
      observation: `Hostname "${hostname}" resolves to a local, private, or reserved network space.`,
      significance: 'Legitimate internet websites do not direct users to unroutable internal subnets or loopback addresses.',
      sourceRule: 'RULE-SEC-SSRF-01',
      status: 'confirmed',
      severity: 'critical',
      recommendedAction: 'Do not proceed. This may be an attempt to target local device services or internal network interfaces.',
    });
    scoreAccumulator += 85;
  }

  // 2. Protocol & TLS observation
  if (parsedUrl.protocol === 'http:') {
    findings.push({
      id: 'protocol-insecure-http',
      category: 'protocol_tls',
      title: 'Unencrypted HTTP Protocol',
      observation: 'Connection uses plain HTTP with no TLS/SSL transport encryption.',
      significance: 'Data transmitted across this link can be intercepted or altered by intermediate network actors.',
      sourceRule: 'RULE-NET-TLS-01',
      status: 'confirmed',
      severity: 'medium',
      recommendedAction: 'Avoid entering sensitive credentials or payment cards over plain HTTP.',
    });
    scoreAccumulator += 20;
  } else {
    findings.push({
      id: 'protocol-https-active',
      category: 'protocol_tls',
      title: 'Standard HTTPS Transport Encryption',
      observation: 'Connection uses TLS transport layer security (HTTPS).',
      significance: 'Protects transmission against eavesdropping, but does NOT guarantee website legitimacy (phishers routinely obtain free certificates).',
      sourceRule: 'RULE-NET-TLS-02',
      status: 'confirmed',
      severity: 'informational',
      recommendedAction: 'Remember that a padlock icon indicates encrypted communication, not verified trustworthy identity.',
    });
  }

  // 3. Punycode / Internationalized Domain Name (IDN) homoglyph check
  if (hostname.includes('xn--') || /[^\u0000-\u007F]/.test(hostname)) {
    findings.push({
      id: 'punycode-homoglyph',
      category: 'hostname_structure',
      title: 'Punycode or Non-ASCII Unicode Characters Detected',
      observation: `Hostname contains internationalized representation: "${hostname}".`,
      significance: 'Attackers commonly register Cyrillic or Greek characters that look visually identical to Latin characters (e.g., Cyrillic "а" instead of Latin "a").',
      sourceRule: 'RULE-HOST-IDN-01',
      status: 'confirmed',
      severity: 'high',
      recommendedAction: 'Carefully inspect the raw ASCII representation for homoglyph substitution.',
    });
    scoreAccumulator += 35;
  }

  // 4. IP address used directly as hostname
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    findings.push({
      id: 'ip-as-hostname',
      category: 'hostname_structure',
      title: 'Raw IP Address in Navigation Target',
      observation: `Direct IP address utilized instead of a registered domain name (${hostname}).`,
      significance: 'Standard consumer and commercial services use branded domain names; direct IP navigation is frequently used in phishing relays and command servers.',
      sourceRule: 'RULE-HOST-IP-01',
      status: 'confirmed',
      severity: 'high',
      recommendedAction: 'Exercise high caution. Legitimate companies almost never ask users to log into numerical IP addresses.',
    });
    scoreAccumulator += 30;
  }

  // 5. Brand impersonation & Typosquatting checks
  for (const brand of KNOWN_BRANDS) {
    const isOfficial = brand.officialDomains.some(d => registrableDomain === d || hostname.endsWith('.' + d));

    if (!isOfficial) {
      // Check if brand keyword is in hostname or subdomain
      const foundKeyword = brand.keywords.find(kw => hostname.includes(kw));
      if (foundKeyword) {
        let mismatchType: BrandComparison['mismatchType'] = 'keyword_stuffing';
        let detail = `Domain contains "${foundKeyword}" but registrable domain is "${registrableDomain}".`;

        if (hostname.startsWith(foundKeyword + '.') || hostname.includes('.' + foundKeyword + '.')) {
          mismatchType = 'subdomain_deception';
          detail = `Deceptive subdomain structure: "${foundKeyword}" is prepended to foreign host "${registrableDomain}".`;
        } else if (foundKeyword.includes('0') || foundKeyword.includes('1') || foundKeyword.includes('-')) {
          mismatchType = 'typosquatting';
          detail = `Typosquatted representation intended to resemble legitimate brand "${brand.name}".`;
        }

        brandComparison = {
          detectedBrand: brand.name,
          officialDomain: brand.officialDomains[0],
          actualHostname: hostname,
          mismatchType,
          explanation: detail,
        };

        findings.push({
          id: `brand-impersonation-${brand.name.toLowerCase().replace(/\s+/g, '-')}`,
          category: 'brand_impersonation',
          title: `Brand Impersonation Signal: ${brand.name}`,
          observation: detail,
          significance: `The link claims or suggests association with ${brand.name}, but the true owning domain is "${registrableDomain}". Official domain is "${brand.officialDomains[0]}".`,
          sourceRule: 'RULE-BRAND-SPOOF-01',
          status: 'confirmed',
          severity: 'critical',
          recommendedAction: `Do not log in or provide data. Navigate to the verified official portal (${brand.officialDomains[0]}) manually in a new tab.`,
        });
        scoreAccumulator += 50;
        break;
      }
    }
  }

  // 6. Suspicious TLD check
  const tld = hostname.split('.').pop() || '';
  if (SUSPICIOUS_TLDS.has(tld)) {
    findings.push({
      id: 'suspicious-tld-reputation',
      category: 'reputation',
      title: `High-Abuse Top-Level Domain (.${tld})`,
      observation: `Domain is registered under .${tld}, a TLD with historically high volume of spam and disposable phishing campaigns.`,
      significance: 'Low registration cost and lax registrar verification make these TLDs popular with temporary attack infrastructure.',
      sourceRule: 'RULE-TLD-RISK-01',
      status: 'heuristic',
      severity: 'medium',
      recommendedAction: 'Verify source authenticity through an alternate verified communication channel.',
    });
    scoreAccumulator += 15;
  }

  // 7. Excessive subdomain nesting (>3 levels)
  const subdomainCount = hostname.split('.').length;
  if (subdomainCount >= 4) {
    findings.push({
      id: 'excessive-subdomains',
      category: 'hostname_structure',
      title: 'Deeply Nested Subdomain Chain',
      observation: `Hostname possesses ${subdomainCount} distinct levels (${hostname}).`,
      significance: 'Attackers frequently chain subdomains to push the true registrable domain out of sight on mobile URL bars.',
      sourceRule: 'RULE-HOST-DEPTH-01',
      status: 'heuristic',
      severity: 'medium',
      recommendedAction: 'Read the hostname backwards from the rightmost dot to identify the actual domain owner.',
    });
    scoreAccumulator += 15;
  }

  // 8. Credential & Financial urgency keywords in path/query
  const matchedCredWords = CREDENTIAL_KEYWORDS.filter(kw => fullPath.includes(kw) || hostname.includes(kw));
  if (matchedCredWords.length > 0) {
    const isKnownMajor = ['google.com', 'microsoft.com', 'apple.com', 'github.com', 'amazon.com', 'paypal.com'].includes(registrableDomain);
    if (!isKnownMajor) {
      findings.push({
        id: 'credential-harvesting-pattern',
        category: 'content_context',
        title: 'Authentication / Verification Harvesting Keywords',
        observation: `URL contains sensitive authentication keywords: ${matchedCredWords.slice(0, 4).join(', ')}.`,
        significance: 'Phishing kits commonly emulate sign-in, KYC, or account-unlock gateways to harvest user credentials and two-factor codes.',
        sourceRule: 'RULE-PATH-AUTH-01',
        status: 'heuristic',
        severity: matchedCredWords.length >= 2 ? 'high' : 'medium',
        recommendedAction: 'Never submit one-time passcodes (OTPs), PINs, or card CVVs unless you initiated the transaction directly.',
      });
      scoreAccumulator += matchedCredWords.length >= 2 ? 30 : 15;
    }
  }

  // 9. Shortener detection
  const isShortener = KNOWN_SHORTENERS.has(hostname) || KNOWN_SHORTENERS.has(registrableDomain);
  const redirectJourney: LinkHop[] = [
    {
      step: 1,
      url: urlStr,
      hostname,
      isShortener,
      status: 'Initial observed entry point',
    }
  ];

  if (isShortener) {
    findings.push({
      id: 'url-shortener-masking',
      category: 'redirect_anomaly',
      title: 'URL Shortener / Obfuscation Service',
      observation: `The link routes through a URL shortening service (${hostname}).`,
      significance: 'Shortened URLs conceal the ultimate destination, bypass basic keyword filters, and prevent inspection before click.',
      sourceRule: 'RULE-REDIR-SHORT-01',
      status: 'confirmed',
      severity: 'medium',
      recommendedAction: 'Expand shortened URLs to evaluate the real endpoint before visiting.',
    });
    scoreAccumulator += 20;

    // Simulated safe hop visualization
    redirectJourney.push({
      step: 2,
      url: `[Unresolved destination behind ${hostname}]`,
      hostname: 'Destination hidden by shortener',
      isShortener: false,
      domainChanged: true,
      status: 'Inspection recommended before proceeding',
    });
  }

  // Calculate final score & status
  // Capped at 100
  const normalizedScore = Math.min(100, Math.max(0, scoreAccumulator));

  let status: RiskLevel = 'LOW_RISK';
  if (normalizedScore >= 80) {
    status = 'CRITICAL_RISK';
  } else if (normalizedScore >= 50) {
    status = 'HIGH_RISK';
  } else if (normalizedScore >= 20) {
    status = 'MODERATE_RISK';
  } else {
    status = 'LOW_RISK';
  }

  // Determine confidence based on check depth
  let confidence: ConfidenceLevel = 'MODERATE';
  if (findings.length >= 3 || normalizedScore >= 50) {
    confidence = 'HIGH';
  } else if (normalizedScore < 20) {
    confidence = 'LIMITED'; // Because no threat intel check has run yet
  }

  return {
    parsedUrl,
    findings,
    brandComparison,
    riskScore: normalizedScore,
    confidence,
    status,
    redirectJourney,
  };
}
