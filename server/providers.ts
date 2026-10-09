import { ProviderResult, Finding } from '../shared/types.js';

interface ProviderQueryOptions {
  url: string;
  hostname: string;
  consentExternal: boolean;
}

export async function queryThreatProviders(options: ProviderQueryOptions): Promise<{
  providers: ProviderResult[];
  additionalFindings: Finding[];
}> {
  const { url, hostname, consentExternal } = options;
  const providers: ProviderResult[] = [];
  const additionalFindings: Finding[] = [];

  const encodedUrl = encodeURIComponent(url);
  const encodedHost = encodeURIComponent(hostname);

  // 1. Google Safe Browsing
  const gsbKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!gsbKey) {
    providers.push({
      name: 'google_safe_browsing',
      displayName: 'Google Safe Browsing',
      category: 'threat_db',
      status: 'not_configured',
      externalLookupUrl: `https://transparencyreport.google.com/safe-browsing/search?url=${encodedUrl}`,
      notes: 'No GOOGLE_SAFE_BROWSING_API_KEY configured. Use official lookup link for manual verification.',
    });
  } else if (!consentExternal) {
    providers.push({
      name: 'google_safe_browsing',
      displayName: 'Google Safe Browsing',
      category: 'threat_db',
      status: 'unavailable',
      notes: 'User privacy policy: External third-party lookup consent not granted.',
    });
  } else {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${gsbKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          client: { clientId: 'clyrixa-security', clientVersion: '1.0.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as { matches?: Array<{ threatType: string }> };
        if (data.matches && data.matches.length > 0) {
          const threats = data.matches.map(m => m.threatType).join(', ');
          providers.push({
            name: 'google_safe_browsing',
            displayName: 'Google Safe Browsing',
            category: 'threat_db',
            status: 'connected',
            verdict: 'malicious',
            lastObserved: new Date().toISOString(),
            notes: `Confirmed threat detected: ${threats}`,
          });

          additionalFindings.push({
            id: 'gsb-confirmed-threat',
            category: 'threat_intel',
            title: 'Google Safe Browsing Match',
            observation: `Classified as unsafe by Google Safe Browsing: ${threats}.`,
            significance: 'Verified threat listing confirming active distribution of malware or credential deception.',
            sourceRule: 'THREAT-INTEL-GSB-01',
            status: 'confirmed',
            severity: 'critical',
            recommendedAction: 'Block immediately. Do not bypass under any circumstance.',
          });
        } else {
          providers.push({
            name: 'google_safe_browsing',
            displayName: 'Google Safe Browsing',
            category: 'threat_db',
            status: 'connected',
            verdict: 'clean',
            lastObserved: new Date().toISOString(),
            notes: 'No matches found in Google threat lists.',
          });
        }
      } else {
        providers.push({
          name: 'google_safe_browsing',
          displayName: 'Google Safe Browsing',
          category: 'threat_db',
          status: 'error',
          notes: `API returned HTTP ${res.status}`,
        });
      }
    } catch {
      providers.push({
        name: 'google_safe_browsing',
        displayName: 'Google Safe Browsing',
        category: 'threat_db',
        status: 'unavailable',
        notes: 'Request timed out or network error.',
      });
    }
  }

  // 2. VirusTotal
  const vtKey = process.env.VIRUSTOTAL_API_KEY;
  if (!vtKey) {
    providers.push({
      name: 'virustotal',
      displayName: 'VirusTotal Intelligence',
      category: 'threat_db',
      status: 'not_configured',
      externalLookupUrl: `https://www.virustotal.com/gui/home/url`,
      notes: 'No VIRUSTOTAL_API_KEY configured. Official multi-engine database lookup available manually.',
    });
  } else if (!consentExternal) {
    providers.push({
      name: 'virustotal',
      displayName: 'VirusTotal Intelligence',
      category: 'threat_db',
      status: 'unavailable',
      notes: 'External transmission not permitted by user preference.',
    });
  } else {
    try {
      const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
        headers: { 'x-apikey': vtKey },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const vtData = (await res.json()) as {
          data?: {
            attributes?: {
              last_analysis_stats?: { malicious: number; suspicious: number; harmless: number };
              last_analysis_date?: number;
            };
          };
        };
        const stats = vtData.data?.attributes?.last_analysis_stats;
        if (stats && (stats.malicious > 0 || stats.suspicious > 0)) {
          providers.push({
            name: 'virustotal',
            displayName: 'VirusTotal Intelligence',
            category: 'threat_db',
            status: 'connected',
            verdict: stats.malicious > 0 ? 'malicious' : 'suspicious',
            lastObserved: vtData.data?.attributes?.last_analysis_date
              ? new Date(vtData.data.attributes.last_analysis_date * 1000).toISOString()
              : new Date().toISOString(),
            notes: `${stats.malicious} engine(s) flagged as malicious, ${stats.suspicious} as suspicious.`,
          });

          additionalFindings.push({
            id: 'virustotal-detection',
            category: 'threat_intel',
            title: 'VirusTotal Multi-Engine Detection',
            observation: `${stats.malicious} security vendor(s) reported this URL as malicious.`,
            significance: 'Multiple independent commercial antivirus and threat feeds identified malicious behavior.',
            sourceRule: 'THREAT-INTEL-VT-01',
            status: 'confirmed',
            severity: stats.malicious >= 3 ? 'critical' : 'high',
            recommendedAction: 'Abstain from visiting. Multi-engine consensus indicates high probability of harm.',
          });
        } else {
          providers.push({
            name: 'virustotal',
            displayName: 'VirusTotal Intelligence',
            category: 'threat_db',
            status: 'connected',
            verdict: 'clean',
            notes: '0 vendors flagged this URL in latest dataset.',
          });
        }
      } else {
        providers.push({
          name: 'virustotal',
          displayName: 'VirusTotal Intelligence',
          category: 'threat_db',
          status: 'unavailable',
          notes: `HTTP ${res.status}: URL may not be in VT cache yet.`,
        });
      }
    } catch {
      providers.push({
        name: 'virustotal',
        displayName: 'VirusTotal Intelligence',
        category: 'threat_db',
        status: 'unavailable',
        notes: 'Lookup timed out.',
      });
    }
  }

  // 3. urlscan.io
  const urlscanKey = process.env.URLSCAN_API_KEY;
  providers.push({
    name: 'urlscan_io',
    displayName: 'urlscan.io Sandbox',
    category: 'sandbox',
    status: urlscanKey ? 'connected' : 'manual_lookup_only',
    externalLookupUrl: `https://urlscan.io/search/#${encodedHost}`,
    notes: urlscanKey
      ? 'Configured for passive sandbox telemetry.'
      : 'Manual lookup available on urlscan.io public portal.',
  });

  // 4. Cisco Talos Intelligence
  providers.push({
    name: 'cisco_talos',
    displayName: 'Cisco Talos Intelligence',
    category: 'reputation',
    status: 'manual_lookup_only',
    externalLookupUrl: `https://talosintelligence.com/reputation_center/lookup?search=${encodedHost}`,
    notes: 'Direct web lookup available for IP, network owner, and reputation tier.',
  });

  // 5. Trend Micro Site Safety Center
  providers.push({
    name: 'trend_micro',
    displayName: 'Trend Micro Site Safety',
    category: 'reputation',
    status: 'manual_lookup_only',
    externalLookupUrl: `https://global.sitesafety.trendmicro.com/`,
    notes: 'Reputation categorization portal for consumer and enterprise safety checks.',
  });

  // 6. PhishTank
  providers.push({
    name: 'phishtank',
    displayName: 'PhishTank Community Database',
    category: 'threat_db',
    status: 'manual_lookup_only',
    externalLookupUrl: `https://phishtank.org/`,
    notes: 'Community-verified phishing reports repository.',
  });

  // 7. URLVoid
  providers.push({
    name: 'urlvoid',
    displayName: 'URLVoid Domain Reputation',
    category: 'reputation',
    status: 'manual_lookup_only',
    externalLookupUrl: `https://www.urlvoid.com/scan/${encodedHost}/`,
    notes: 'Aggregated domain blacklist and IP reputation verification.',
  });

  return { providers, additionalFindings };
}
