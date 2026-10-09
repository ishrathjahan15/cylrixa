import { ScanResult, MessageAnalysisResult } from '../../shared/types.js';
import { getSettings } from './settings.js';

const API_BASE = '';

export async function scanUrl(url: string, consentExternal = false, language = 'en', demoScenario?: string): Promise<ScanResult> {
  const response = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      consentExternalProviders: consentExternal,
      language,
      demoScenario,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export async function analyzeMessage(message: string): Promise<MessageAnalysisResult> {
  const response = await fetch(`${API_BASE}/api/analyze-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export async function checkSystemHealth(): Promise<{
  status: string;
  version: string;
  geminiConfigured: boolean;
  gsbConfigured: boolean;
  vtConfigured: boolean;
  urlscanConfigured: boolean;
}> {
  const response = await fetch(`${API_BASE}/api/health`);
  return response.json();
}

// Local history helpers
const HISTORY_KEY = 'clyrixa_scan_history';

function sanitizeUrlForLocalStore(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const sensitiveKeys = ['token', 'key', 'auth', 'password', 'pass', 'session', 'secret', 'code', 'otp', 'access_token', 'jwt'];
    parsed.searchParams.forEach((_, key) => {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        parsed.searchParams.set(key, '[REDACTED]');
      }
    });
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

export function saveScanToHistory(scan: ScanResult): boolean {
  try {
    const settings = getSettings();
    // 1. Check if user permitted history saving
    if (!settings.saveScanHistory) {
      return false;
    }

    // 2. Sanitize URL if redact query params is enabled
    const processedScan: ScanResult = settings.redactQueryParams ? {
      ...scan,
      url: sanitizeUrlForLocalStore(scan.url),
      normalizedUrl: sanitizeUrlForLocalStore(scan.normalizedUrl || scan.url),
    } : scan;

    const existing = getScanHistory();
    // Prepend and keep latest 30 scans
    const updated = [processedScan, ...existing.filter(s => s.scanId !== processedScan.scanId)].slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.warn('Failed saving to history', err);
    return false;
  }
}

export function getScanHistory(): ScanResult[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearScanHistory(): number {
  try {
    const current = getScanHistory();
    const count = current.length;
    localStorage.removeItem(HISTORY_KEY);
    return count;
  } catch {
    localStorage.removeItem(HISTORY_KEY);
    return 0;
  }
}
