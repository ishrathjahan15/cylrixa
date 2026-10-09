/**
 * Clyrixa User Settings & Preference Management Service
 * Single source of truth for user preferences, persistence, and reactive updates.
 */

export type WarningThreshold = 'always_warn' | 'block_modal' | 'silent_log';
export type ScanMode = 'url' | 'message' | 'qr';
export type ThemeMode = 'system' | 'dark' | 'light';
export type TextSizeMode = 'small' | 'medium' | 'large';

export interface UserSettings {
  // A. Security & Protection
  suspiciousLinkWarnings: boolean;
  highRiskWarningThreshold: WarningThreshold;
  beforeOpeningWarning: boolean;

  // B. Scan Preferences
  defaultScanMode: ScanMode;
  detailedExplanations: boolean;
  showTechnicalSourceRules: boolean;

  // C. Privacy & Scan History
  saveScanHistory: boolean;
  redactQueryParams: boolean;

  // D. Appearance & Accessibility
  theme: ThemeMode;
  textSize: TextSizeMode;
  reducedMotion: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  suspiciousLinkWarnings: true,
  highRiskWarningThreshold: 'always_warn',
  beforeOpeningWarning: true,
  defaultScanMode: 'url',
  detailedExplanations: true,
  showTechnicalSourceRules: true,
  saveScanHistory: true,
  redactQueryParams: true,
  theme: 'dark',
  textSize: 'medium',
  reducedMotion: false,
};

const SETTINGS_STORAGE_KEY = 'clyrixa_user_settings';
export const SETTINGS_CHANGE_EVENT = 'clyrixa:settings-changed';

/**
 * Retrieve current settings merged with default fallback values.
 */
export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.warn('Error reading Clyrixa settings from storage:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save user settings, apply DOM enhancements, and notify listeners.
 */
export function saveSettings(updates: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const next: UserSettings = {
    ...current,
    ...updates,
  };

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Failed writing Clyrixa settings to localStorage:', err);
    throw new Error('Failed to persist settings to local browser storage.');
  }

  // Apply visual settings to DOM
  applyThemeAndAccessibility(next);

  // Dispatch change notification
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: next })
    );
  }

  return next;
}

/**
 * Reset all settings back to default configuration.
 */
export function resetSettingsToDefault(): UserSettings {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch {}
  applyThemeAndAccessibility(DEFAULT_SETTINGS);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: DEFAULT_SETTINGS })
    );
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Synchronize DOM attributes (theme, font scale, reduced motion) with settings.
 */
export function applyThemeAndAccessibility(settings: UserSettings): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 1. Theme application
  let effectiveTheme: 'dark' | 'light' = 'dark';
  if (settings.theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    effectiveTheme = prefersDark ? 'dark' : 'light';
  } else {
    effectiveTheme = settings.theme;
  }
  root.setAttribute('data-theme', effectiveTheme);
  if (effectiveTheme === 'light') {
    root.classList.add('theme-light');
    root.classList.remove('theme-dark');
  } else {
    root.classList.add('theme-dark');
    root.classList.remove('theme-light');
  }

  // 2. Text Size application
  root.setAttribute('data-text-size', settings.textSize);

  // 3. Reduced Motion application
  root.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');
}

/**
 * Helper to check if history saving is enabled
 */
export function isHistorySavingEnabled(): boolean {
  return getSettings().saveScanHistory;
}
