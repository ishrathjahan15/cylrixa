/**
 * Clyrixa Extension — Background Service Worker (Manifest V3)
 */

const DEFAULT_BACKEND_URL = 'http://localhost:3000';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache
const scanCache = new Map();

// Initialize extension settings upon install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['protectionEnabled', 'backendUrl', 'autoOpenLowRisk'], (items) => {
    chrome.storage.local.set({
      protectionEnabled: items.protectionEnabled ?? true,
      backendUrl: items.backendUrl ?? DEFAULT_BACKEND_URL,
      autoOpenLowRisk: items.autoOpenLowRisk ?? true,
      statsScanned: 0,
      statsBlocked: 0,
    });
  });
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_LINK') {
    handleLinkCheck(request.url)
      .then(result => sendResponse(result))
      .catch(err => {
        sendResponse({
          status: 'INCONCLUSIVE',
          riskScore: 30,
          error: err.message || 'Scan timeout or connection error',
        });
      });
    return true; // Keep channel open for async response
  }

  if (request.type === 'GET_STATUS') {
    chrome.storage.local.get(['protectionEnabled', 'backendUrl', 'autoOpenLowRisk', 'statsScanned', 'statsBlocked'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

async function handleLinkCheck(rawUrl) {
  // Check in-memory cache first
  const cached = scanCache.get(rawUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Retrieve backend configuration
  const settings = await new Promise(resolve => {
    chrome.storage.local.get(['protectionEnabled', 'backendUrl'], resolve);
  });

  if (!settings.protectionEnabled) {
    return { status: 'LOW_RISK', riskScore: 0, bypassed: true };
  }

  const backendUrl = settings.backendUrl || DEFAULT_BACKEND_URL;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${backendUrl}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: rawUrl, source: 'browser_extension' }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    const data = await response.json();

    // Update stats
    chrome.storage.local.get(['statsScanned', 'statsBlocked'], (st) => {
      const statsScanned = (st.statsScanned || 0) + 1;
      const statsBlocked = (data.status === 'HIGH_RISK' || data.status === 'CRITICAL_RISK')
        ? (st.statsBlocked || 0) + 1
        : (st.statsBlocked || 0);
      chrome.storage.local.set({ statsScanned, statsBlocked });
    });

    // Cache result
    scanCache.set(rawUrl, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.warn('[Clyrixa SW] Backend connection failed, performing lightweight local assessment:', err);
    // Lightweight local fallback so users are still warned if obvious phishing occurs
    return performLocalFallbackScan(rawUrl);
  }
}

function performLocalFallbackScan(urlStr) {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    
    // Quick heuristics
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz'];
    const hasSuspiciousTld = suspiciousTlds.some(t => host.endsWith(t));
    const isIpHost = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
    const isPaypalSpoof = host.includes('paypal') && !host.endsWith('paypal.com') && !host.endsWith('paypal.me');
    const isGoogleSpoof = host.includes('google') && !host.endsWith('google.com');

    if (isPaypalSpoof || isGoogleSpoof || (isIpHost && hasSuspiciousTld)) {
      return {
        status: 'CRITICAL_RISK',
        riskScore: 88,
        hostname: host,
        url: urlStr,
        findings: [{
          title: 'Brand Impersonation or High-Risk Hostname Pattern',
          observation: `Host "${host}" matches offline deception signatures.`,
          severity: 'critical'
        }],
        recommendations: ['Do not visit. Potential phishing destination.'],
      };
    }

    if (hasSuspiciousTld || isIpHost) {
      return {
        status: 'MODERATE_RISK',
        riskScore: 45,
        hostname: host,
        url: urlStr,
        findings: [{
          title: 'Unverified Top-Level Domain or Numerical IP Destination',
          observation: `Host "${host}" exhibits higher risk structural traits.`,
          severity: 'medium'
        }],
        recommendations: ['Exercise caution before providing confidential details.'],
      };
    }

    return {
      status: 'INCONCLUSIVE',
      riskScore: 25,
      hostname: host,
      url: urlStr,
      findings: [{
        title: 'Backend Unreachable — Limited Local Evaluation Only',
        observation: 'The full Clyrixa threat intelligence server could not be reached.',
        severity: 'informational'
      }],
      recommendations: ['Verify website identity independently.'],
    };
  } catch {
    return {
      status: 'INCONCLUSIVE',
      riskScore: 20,
      url: urlStr,
      findings: [],
      recommendations: ['Malformed URL format.'],
    };
  }
}
