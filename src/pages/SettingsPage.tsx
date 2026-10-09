import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sliders, 
  Lock, 
  Palette, 
  Puzzle, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  FileText, 
  Zap, 
  AlertOctagon,
  Check,
  RotateCcw,
  Sparkles,
  Server,
  Activity
} from 'lucide-react';
import { 
  UserSettings, 
  getSettings, 
  saveSettings, 
  resetSettingsToDefault, 
  SETTINGS_CHANGE_EVENT,
  WarningThreshold,
  ScanMode,
  ThemeMode,
  TextSizeMode 
} from '../services/settings.js';
import { getScanHistory, clearScanHistory, checkSystemHealth } from '../services/api.js';
import { Language, DICTIONARY } from '../utils/i18n.js';

interface SettingsPageProps {
  language: Language;
  onNavigate: (tab: string) => void;
  initialSection?: 'security' | 'scanning' | 'privacy' | 'appearance' | 'extension' | 'about';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  language,
  onNavigate,
  initialSection = 'security',
}) => {
  const [activeSection, setActiveSection] = useState<'security' | 'scanning' | 'privacy' | 'appearance' | 'extension' | 'about'>(initialSection);
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());
  
  // Feedback states
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [saveErrorNotice, setSaveErrorNotice] = useState<string | null>(null);

  // History stats
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showResetSettingsModal, setShowResetSettingsModal] = useState(false);

  // Modals for About Section
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [showThreatModelModal, setShowThreatModelModal] = useState(false);

  // Extension testing states
  const [isExtensionDetected, setIsExtensionDetected] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [testingHealth, setTestingHealth] = useState<boolean>(false);
  const [healthLatencyMs, setHealthLatencyMs] = useState<number | null>(null);
  const [extensionInstallTab, setExtensionInstallTab] = useState<'chrome' | 'edge'>('chrome');

  const t = DICTIONARY[language] || DICTIONARY.en;

  // Initialize and track settings changes
  useEffect(() => {
    setHistoryCount(getScanHistory().length);

    // Check extension availability honestly
    if (typeof window !== 'undefined') {
      const isDetected = Boolean((window as any).__CLYRIXA_INTERCEPTOR_ACTIVE);
      setIsExtensionDetected(isDetected);
    }

    const handleSettingsUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsUpdate);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsUpdate);
  }, []);

  const triggerFeedback = (message: string, isError = false) => {
    if (isError) {
      setSaveErrorNotice(message);
      setTimeout(() => setSaveErrorNotice(null), 4000);
    } else {
      setSaveSuccessNotice(message);
      setTimeout(() => setSaveSuccessNotice(null), 3500);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    try {
      const updated = saveSettings({ [key]: value });
      setSettings(updated);
      triggerFeedback('Preference saved');
    } catch (err: any) {
      triggerFeedback(err?.message || 'Could not save setting.', true);
    }
  };

  const handleClearHistory = () => {
    try {
      const erased = clearScanHistory();
      setHistoryCount(0);
      setShowClearHistoryModal(false);
      triggerFeedback(`Successfully cleared ${erased} scan history record${erased === 1 ? '' : 's'}.`);
    } catch {
      triggerFeedback('Failed to erase scan history.', true);
    }
  };

  const handleResetDefaults = () => {
    try {
      const reset = resetSettingsToDefault();
      setSettings(reset);
      setShowResetSettingsModal(false);
      triggerFeedback('All settings restored to system defaults.');
    } catch {
      triggerFeedback('Failed to restore defaults.', true);
    }
  };

  const handleTestBackend = async () => {
    setTestingHealth(true);
    const start = performance.now();
    try {
      const result = await checkSystemHealth();
      const end = performance.now();
      setHealthLatencyMs(Math.round(end - start));
      setHealthData(result);
      triggerFeedback('Backend health query successful.');
    } catch {
      triggerFeedback('Could not connect to Clyrixa scanning engine.', true);
    } finally {
      setTestingHealth(false);
    }
  };

  const sections = [
    { id: 'security', label: 'Security & Protection', icon: Shield, desc: 'Heuristic thresholds & pre-flight defense' },
    { id: 'scanning', label: 'Scan Preferences', icon: Sliders, desc: 'Default tools, telemetry & explanations' },
    { id: 'privacy', label: 'Privacy & Scan History', icon: Lock, desc: 'Local audit trail, query sanitization & data policies' },
    { id: 'appearance', label: 'Appearance & Accessibility', icon: Palette, desc: 'Theme, text scale & reduced motion' },
    { id: 'extension', label: 'Browser Extension', icon: Puzzle, desc: 'Installation instructions & connectivity test' },
    { id: 'about', label: 'About CLYRIXA', icon: Info, desc: 'Version, threat model & safety disclaimer' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#244155] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#28D7E5] tracking-wider uppercase mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>CLYRIXA SYSTEM PREFERENCES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F7FC] tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#A8BBCB] mt-1 max-w-2xl">
            Personalize your protection, privacy, and scanning experience.
          </p>
        </div>

        {/* Global Action / Notification */}
        <div className="flex items-center gap-3">
          {saveSuccessNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35CFA6]/15 border border-[#35CFA6]/40 text-[#35CFA6] text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccessNotice}</span>
            </div>
          )}

          {saveErrorNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6378]/15 border border-[#FF6378]/40 text-[#FF6378] text-xs font-semibold animate-in fade-in">
              <AlertTriangle className="w-4 h-4" />
              <span>{saveErrorNotice}</span>
            </div>
          )}

          <button
            onClick={() => setShowResetSettingsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10283A] border border-[#244155] text-xs text-[#A8BBCB] hover:text-[#F2F7FC] hover:border-[#28D7E5] transition-colors cursor-pointer"
            title="Reset settings to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-1">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-1.5 scrollbar-none" aria-label="Settings Sections">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink ${
                    isActive 
                      ? 'bg-[#153348] border border-[#28D7E5]/50 shadow-md text-[#28D7E5]' 
                      : 'bg-[#0B1F30] border border-[#244155]/60 text-[#A8BBCB] hover:text-[#F2F7FC] hover:bg-[#10283A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-[#28D7E5]' : 'text-[#A8BBCB]'}`} />
                  <div>
                    <span className="font-semibold text-xs block text-inherit">
                      {sec.label}
                    </span>
                    <span className="text-[11px] text-[#A8BBCB]/70 hidden lg:block leading-tight mt-0.5">
                      {sec.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Info Box in Sidebar */}
          <div className="hidden lg:block mt-6 p-4 rounded-xl bg-[#0B1F30] border border-[#244155] text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#F2F7FC] text-[11px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#28D7E5]" />
              <span>Core Principle</span>
            </div>
            <p className="text-[11px] text-[#A8BBCB] leading-relaxed">
              Detect → Explain → Protect → Recover. Settings empower you to configure advisory sensitivity without undermining essential security verifications.
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* ==================== A. SECURITY & PROTECTION ==================== */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F7FC] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#28D7E5]" />
                    <span>Security & Threat Protection</span>
                  </h2>
                  <p className="text-xs text-[#A8BBCB] mt-1">
                    Control sensitivity thresholds for suspicious link warnings, high-risk banners, and external link departure checks.
                  </p>
                </div>

                {/* 1. Suspicious-Link Warnings */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC] flex items-center gap-2">
                        <span>Suspicious-Link Warnings</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${settings.suspiciousLinkWarnings ? 'bg-[#35CFA6]/20 text-[#35CFA6]' : 'bg-[#FF6378]/20 text-[#FF6378]'}`}>
                          {settings.suspiciousLinkWarnings ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        When enabled, Clyrixa triggers advisory notices for low and moderate risk anomalies (e.g., brand-adjacent keywords, newly registered TLDs, and obscured redirect hops).
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.suspiciousLinkWarnings}
                        onChange={(e) => updateSetting('suspiciousLinkWarnings', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>

                  {!settings.suspiciousLinkWarnings && (
                    <div className="p-3 rounded-lg bg-[#FF6378]/10 border border-[#FF6378]/30 text-[11px] text-[#FF6378] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>What changes:</strong> Mild suspicion and low-confidence flags will not display intrusive warnings in summary previews. High and Critical verified malicious links remain strictly flagged.
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. High-Risk Link Warnings Threshold */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#F2F7FC]">
                      High-Risk Link Warning Preference
                    </h3>
                    <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                      Configure how the system responds when a URL is identified as High Risk or Critical Risk (e.g. typosquatting, credential harvesting, or direct IP spoofing).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      {
                        value: 'always_warn',
                        title: 'Always Warn (Banner)',
                        desc: 'Prominent color-coded danger alert with full heuristic breakdown.',
                      },
                      {
                        value: 'block_modal',
                        title: 'Block Interstitial Modal',
                        desc: 'Require explicit user acknowledgment before allowing any inspection interaction.',
                      },
                      {
                        value: 'silent_log',
                        title: 'Streamlined Notice',
                        desc: 'Minimal danger chip with logged findings, avoiding large warning banners.',
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateSetting('highRiskWarningThreshold', option.value as WarningThreshold)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          settings.highRiskWarningThreshold === option.value
                            ? 'bg-[#153348] border-[#28D7E5] text-[#F2F7FC] shadow-sm'
                            : 'bg-[#071521] border-[#244155] text-[#A8BBCB] hover:border-[#28D7E5]/50 hover:text-[#F2F7FC]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-[#F2F7FC]">{option.title}</span>
                            {settings.highRiskWarningThreshold === option.value && (
                              <Check className="w-3.5 h-3.5 text-[#28D7E5]" />
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed opacity-80">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-[#A8BBCB] bg-[#071521] p-3 rounded-lg border border-[#244155]">
                    <span className="text-[#35CFA6] font-semibold">Security Guarantee: </span>
                    User preference never converts a confirmed high-risk link into a safe result. Dangerous verdicts remain accurately categorized in accordance with cybersecurity threat models.
                  </div>
                </div>

                {/* 3. Before-Opening Warning Preference */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC] flex items-center gap-2">
                        <span>Pre-Flight External Departure Advisory</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${settings.beforeOpeningWarning ? 'bg-[#35CFA6]/20 text-[#35CFA6]' : 'bg-[#A8BBCB]/20 text-[#A8BBCB]'}`}>
                          {settings.beforeOpeningWarning ? 'ACTIVE' : 'OFF'}
                        </span>
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        Prompt with an explicit confirmation dialog before leaving the Clyrixa platform when clicking the "Proceed to Destination" action on inspected clean links.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.beforeOpeningWarning}
                        onChange={(e) => updateSetting('beforeOpeningWarning', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-[#A8BBCB]/70">
                    Note: This feature manages link departure links inside the Clyrixa web portal. System-wide click interception across arbitrary websites requires the Clyrixa Chromium Extension.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== B. SCAN PREFERENCES ==================== */}
          {activeSection === 'scanning' && (
            <div className="space-y-6">
              <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F7FC] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#28D7E5]" />
                    <span>Scan Preferences & Diagnostic Explanations</span>
                  </h2>
                  <p className="text-xs text-[#A8BBCB] mt-1">
                    Configure the initial mode for the scanner tool, technical breakdown visibility, and review grounded telemetry definitions.
                  </p>
                </div>

                {/* 1. Default Scan Mode */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <h3 className="text-sm font-bold text-[#F2F7FC]">
                    Default Tool Mode
                  </h3>
                  <p className="text-xs text-[#A8BBCB]">
                    Choose the tool presented first whenever opening the Scanner view.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { id: 'url', label: 'URL Inspection', desc: 'Single URL & domain safety check' },
                      { id: 'message', label: 'Message & SMS Analysis', desc: 'Scan SMS, emails, or urgent texts' },
                      { id: 'qr', label: 'QR Code Decryption', desc: 'Decode QR image client-side' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => updateSetting('defaultScanMode', mode.id as ScanMode)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          settings.defaultScanMode === mode.id
                            ? 'bg-[#153348] border-[#28D7E5] text-[#F2F7FC]'
                            : 'bg-[#071521] border-[#244155] text-[#A8BBCB] hover:text-[#F2F7FC]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-[#F2F7FC]">{mode.label}</span>
                          {settings.defaultScanMode === mode.id && (
                            <Check className="w-3.5 h-3.5 text-[#28D7E5]" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#A8BBCB] block leading-tight">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Detailed Explanations Toggle */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC]">
                        Detailed Heuristic Evidence Breakdown
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        Toggle between showing concise executive verdicts vs. expanding all underlying heuristic findings, redirect steps, and threat provider tables by default.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.detailedExplanations}
                        onChange={(e) => updateSetting('detailedExplanations', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#244155]">
                    <div>
                      <h4 className="text-xs font-semibold text-[#F2F7FC]">
                        Display Technical Rule Identifiers
                      </h4>
                      <p className="text-[11px] text-[#A8BBCB] mt-0.5">
                        Show standardized rule codes (e.g. <code>RULE-NET-TLS-02</code>, <code>RULE-BRAND-PUNY-01</code>) on findings cards.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.showTechnicalSourceRules}
                        onChange={(e) => updateSetting('showTechnicalSourceRules', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>
                </div>

                {/* 3. Scan Status Telemetry Integrity Disclosure */}
                <div className="p-5 rounded-xl bg-[#071521] border border-[#244155] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F2F7FC] uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-[#28D7E5]" />
                    <span>Telemetry Integrity & Status Standards</span>
                  </div>
                  <p className="text-xs text-[#A8BBCB]">
                    Clyrixa enforces clear distinctions between live intelligence, simulated test scenarios, and inconclusive verdicts:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-[#10283A] border border-[#244155]">
                      <span className="font-semibold text-[#35CFA6] block text-xs">Live Telemetry Scan</span>
                      <span className="text-[11px] text-[#A8BBCB] leading-tight block mt-0.5">
                        Dynamic heuristic evaluation executed in real-time across domain, redirect hops, and connected threat feeds.
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#10283A] border border-[#244155]">
                      <span className="font-semibold text-[#28D7E5] block text-xs">Deterministic Demo Scenarios</span>
                      <span className="text-[11px] text-[#A8BBCB] leading-tight block mt-0.5">
                        Hardcoded test fixtures (marked with <code>isDemo: true</code>) for reproducible training. Never disguised as live scans.
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#10283A] border border-[#244155]">
                      <span className="font-semibold text-[#F6C453] block text-xs">Inconclusive Results</span>
                      <span className="text-[11px] text-[#A8BBCB] leading-tight block mt-0.5">
                        Unverified domains or insufficient telemetry. Clyrixa never treats missing data as proof that a URL is safe.
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#10283A] border border-[#244155]">
                      <span className="font-semibold text-[#FF6378] block text-xs">Unavailable / Error State</span>
                      <span className="text-[11px] text-[#A8BBCB] leading-tight block mt-0.5">
                        Timeouts or unconfigured external services are flagged honestly without asserting clean status.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== C. PRIVACY & SCAN HISTORY ==================== */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F7FC] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#35CFA6]" />
                    <span>Privacy & Scan History Governance</span>
                  </h2>
                  <p className="text-xs text-[#A8BBCB] mt-1">
                    Control what gets stored locally on your device, manage session history, and review our architecture privacy disclosures.
                  </p>
                </div>

                {/* 1. Save Scan History Toggle */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC] flex items-center gap-2">
                        <span>Save Future Scans to Local History</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${settings.saveScanHistory ? 'bg-[#35CFA6]/20 text-[#35CFA6]' : 'bg-[#FF6378]/20 text-[#FF6378]'}`}>
                          {settings.saveScanHistory ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        When enabled, reports for future scans are saved to this browser session so you can revisit findings under the Audit Trail tab.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.saveScanHistory}
                        onChange={(e) => updateSetting('saveScanHistory', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>

                  {!settings.saveScanHistory && (
                    <div className="p-3 rounded-lg bg-[#071521] border border-[#244155] text-[11px] text-[#A8BBCB]">
                      <strong>Enforcement confirmed:</strong> Disabling this option prevents future scan outcomes from being saved to local browser storage. Existing history remains until explicitly cleared below.
                    </div>
                  )}
                </div>

                {/* 2. Redact Sensitive Query Parameters */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC]">
                        Client-Side Query Parameter Redaction
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        Automatically strip authentication tokens, passwords, OTPs, and session identifiers (e.g. <code>?token=xyz</code>) before storing scan records or displaying URLs in diagnostic logs.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.redactQueryParams}
                        onChange={(e) => updateSetting('redactQueryParams', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>
                </div>

                {/* 3. Clear Scan History Action */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#F2F7FC]">
                      Erase Stored Scan History
                    </h3>
                    <p className="text-xs text-[#A8BBCB] mt-0.5">
                      Currently storing <strong className="text-[#28D7E5]">{historyCount}</strong> scan report{historyCount === 1 ? '' : 's'} in this local browser profile.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowClearHistoryModal(true)}
                    disabled={historyCount === 0}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                      historyCount > 0 
                        ? 'bg-[#FF6378]/20 border border-[#FF6378]/50 text-[#FF6378] hover:bg-[#FF6378]/30' 
                        : 'bg-[#153348] border border-[#244155] text-[#A8BBCB]/50 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Scan History</span>
                  </button>
                </div>

                {/* 4. Privacy & Data Architecture Details */}
                <div className="p-5 rounded-xl bg-[#071521] border border-[#244155] space-y-3">
                  <h4 className="text-xs font-bold text-[#F2F7FC] uppercase tracking-wider">
                    Transparent Data Architecture
                  </h4>
                  <ul className="space-y-2 text-xs text-[#A8BBCB] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#35CFA6] mt-0.5 font-bold">✓</span>
                      <span><strong>Local Storage:</strong> Scan history is stored strictly on your local browser device under <code>clyrixa_scan_history</code>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#35CFA6] mt-0.5 font-bold">✓</span>
                      <span><strong>In-Flight Scans:</strong> Submitted URLs and texts are transmitted via secure HTTPS to the Clyrixa backend (<code>/api/scan</code>) for heuristic and AI analysis.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#35CFA6] mt-0.5 font-bold">✓</span>
                      <span><strong>External Threat Providers:</strong> Google Safe Browsing, VirusTotal, and urlscan.io are queried server-side only when API keys are configured and user consent is active.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ==================== D. APPEARANCE & ACCESSIBILITY ==================== */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F7FC] flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#8B7CFF]" />
                    <span>Appearance & Accessibility</span>
                  </h2>
                  <p className="text-xs text-[#A8BBCB] mt-1">
                    Customize color themes, typography scale, and animation preferences across the Clyrixa user interface.
                  </p>
                </div>

                {/* 1. Theme Mode */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <h3 className="text-sm font-bold text-[#F2F7FC]">
                    Interface Theme
                  </h3>
                  <p className="text-xs text-[#A8BBCB]">
                    Select high-contrast dark cybersecurity palette, clean daylight theme, or synchronize with system appearance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { id: 'dark', label: 'Dark Cyber (#07131F)', desc: 'High-contrast SOC defense palette' },
                      { id: 'light', label: 'Light Mode', desc: 'Clear high-contrast light theme' },
                      { id: 'system', label: 'System Default', desc: 'Matches device OS preference' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => updateSetting('theme', th.id as ThemeMode)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                          settings.theme === th.id
                            ? 'bg-[#153348] border-[#28D7E5] text-[#F2F7FC] shadow-sm'
                            : 'bg-[#071521] border-[#244155] text-[#A8BBCB] hover:text-[#F2F7FC]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-[#F2F7FC]">{th.label}</span>
                          {settings.theme === th.id && (
                            <Check className="w-3.5 h-3.5 text-[#28D7E5]" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#A8BBCB] block">{th.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Text Sizing */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <h3 className="text-sm font-bold text-[#F2F7FC]">
                    Typography Sizing
                  </h3>
                  <p className="text-xs text-[#A8BBCB]">
                    Adjust root typography scale for enhanced readability across scan telemetry and guidance notes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { id: 'small', label: 'Compact (14px)', desc: 'Dense data display for analysts' },
                      { id: 'medium', label: 'Standard (16px)', desc: 'Default balanced proportions' },
                      { id: 'large', label: 'Elevated (18px)', desc: 'Enhanced legibility scale' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => updateSetting('textSize', sz.id as TextSizeMode)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                          settings.textSize === sz.id
                            ? 'bg-[#153348] border-[#28D7E5] text-[#F2F7FC] shadow-sm'
                            : 'bg-[#071521] border-[#244155] text-[#A8BBCB] hover:text-[#F2F7FC]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-[#F2F7FC]">{sz.label}</span>
                          {settings.textSize === sz.id && (
                            <Check className="w-3.5 h-3.5 text-[#28D7E5]" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#A8BBCB] block">{sz.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Reduced Motion & Accessibility Standards */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC]">
                        Reduced Motion
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        Disable pulse effects, radar spin gauges, and layout transitions for vestibular motion sensitivity.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#244155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after after:w-5 after:transition-all peer-checked:bg-[#28D7E5]"></div>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-[#244155] text-xs text-[#A8BBCB] space-y-1">
                    <span className="font-semibold text-[#F2F7FC] block">Accessibility Commitment:</span>
                    <p className="text-[11px] leading-relaxed">
                      Clyrixa does not rely on color alone to indicate severity. Every finding combines iconography, numeric risk scores (0–100), and textual verdict classifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== E. BROWSER EXTENSION ==================== */}
          {activeSection === 'extension' && (
            <div className="space-y-6">
              <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F7FC] flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-[#28D7E5]" />
                    <span>Clyrixa Browser Extension Integration</span>
                  </h2>
                  <p className="text-xs text-[#A8BBCB] mt-1">
                    Real-time link click interception directly inside your Chromium desktop browser before navigation occurs.
                  </p>
                </div>

                {/* 1. Detection Status Card */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#A8BBCB] uppercase tracking-wider">
                      Extension Content-Script Status
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                      isExtensionDetected 
                        ? 'bg-[#35CFA6]/20 text-[#35CFA6] border border-[#35CFA6]/40' 
                        : 'bg-[#F6C453]/20 text-[#F6C453] border border-[#F6C453]/40'
                    }`}>
                      {isExtensionDetected ? 'ACTIVE & DETECTED' : 'NOT DETECTED ON THIS PAGE'}
                    </span>
                  </div>

                  <p className="text-xs text-[#F2F7FC] leading-relaxed">
                    {isExtensionDetected ? (
                      'The Clyrixa Manifest V3 interceptor script is active in your browser session. Navigation clicks on external links will be evaluated in real time.'
                    ) : (
                      'Extension status cannot be verified from this page. Browser extensions run in an isolated sandboxed execution context and do not expose external identification to web origins unless loaded in unpacked developer mode.'
                    )}
                  </p>
                </div>

                {/* 2. Step-by-Step Installation Guides */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#244155] pb-3">
                    <h3 className="text-sm font-bold text-[#F2F7FC]">
                      Installation Instructions
                    </h3>
                    <div className="flex items-center gap-1 bg-[#071521] p-0.5 rounded-lg border border-[#244155] text-xs">
                      <button
                        onClick={() => setExtensionInstallTab('chrome')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          extensionInstallTab === 'chrome' ? 'bg-[#153348] text-[#28D7E5] font-semibold' : 'text-[#A8BBCB]'
                        }`}
                      >
                        Google Chrome / Brave
                      </button>
                      <button
                        onClick={() => setExtensionInstallTab('edge')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          extensionInstallTab === 'edge' ? 'bg-[#153348] text-[#28D7E5] font-semibold' : 'text-[#A8BBCB]'
                        }`}
                      >
                        Microsoft Edge
                      </button>
                    </div>
                  </div>

                  {extensionInstallTab === 'chrome' ? (
                    <ol className="space-y-2.5 text-xs text-[#A8BBCB] list-decimal list-inside leading-relaxed">
                      <li>Open Google Chrome or Brave browser.</li>
                      <li>In the URL navigation bar, navigate to: <code className="bg-[#071521] px-1.5 py-0.5 rounded text-[#28D7E5] font-mono">chrome://extensions</code></li>
                      <li>In the upper-right corner of the extensions manager, toggle on <strong>Developer mode</strong>.</li>
                      <li>Click the <strong>Load unpacked</strong> button that appears in the top-left toolbar.</li>
                      <li>Select the <code className="bg-[#071521] px-1.5 py-0.5 rounded text-[#28D7E5] font-mono">extension</code> folder located inside the Clyrixa project directory.</li>
                      <li>The <strong>Clyrixa — Real-Time Link Protection</strong> extension is now loaded. Click the puzzle icon in Chrome to pin it to your toolbar.</li>
                    </ol>
                  ) : (
                    <ol className="space-y-2.5 text-xs text-[#A8BBCB] list-decimal list-inside leading-relaxed">
                      <li>Open Microsoft Edge.</li>
                      <li>In the URL navigation bar, navigate to: <code className="bg-[#071521] px-1.5 py-0.5 rounded text-[#28D7E5] font-mono">edge://extensions</code></li>
                      <li>In the left sidebar menu, enable the <strong>Developer mode</strong> toggle.</li>
                      <li>Click <strong>Load unpacked</strong> in the top toolbar.</li>
                      <li>Select the <code className="bg-[#071521] px-1.5 py-0.5 rounded text-[#28D7E5] font-mono">extension</code> folder from this repository.</li>
                      <li>Confirm the extension appears in your active extension list.</li>
                    </ol>
                  )}
                </div>

                {/* 3. Live Backend Engine Ping / Connection Test */}
                <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#F2F7FC]">
                        Scan Engine Connectivity Health-Check
                      </h3>
                      <p className="text-xs text-[#A8BBCB] mt-0.5">
                        Test connection latency between browser clients and the Clyrixa threat intelligence API (<code>/api/health</code>).
                      </p>
                    </div>

                    <button
                      onClick={handleTestBackend}
                      disabled={testingHealth}
                      className="px-4 py-2 rounded-xl bg-[#153348] border border-[#28D7E5]/50 text-xs font-semibold text-[#28D7E5] hover:bg-[#28D7E5] hover:text-[#071521] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
                      <span>{testingHealth ? 'Pinging Engine...' : 'Test Connection'}</span>
                    </button>
                  </div>

                  {healthData && (
                    <div className="p-4 rounded-xl bg-[#071521] border border-[#244155] text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[#35CFA6] font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Connected to Clyrixa Threat Engine</span>
                        </span>
                        {healthLatencyMs !== null && (
                          <span className="font-mono text-[11px] text-[#A8BBCB]">
                            Latency: {healthLatencyMs}ms
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                        <div className="p-2 rounded bg-[#10283A]">
                          <span className="text-[#A8BBCB] block text-[10px]">API Version</span>
                          <span className="text-[#F2F7FC] font-mono font-semibold">{healthData.version || '1.0.0'}</span>
                        </div>
                        <div className="p-2 rounded bg-[#10283A]">
                          <span className="text-[#A8BBCB] block text-[10px]">Gemini AI</span>
                          <span className={healthData.geminiConfigured ? 'text-[#35CFA6] font-semibold' : 'text-[#F6C453]'}>
                            {healthData.geminiConfigured ? 'ACTIVE' : 'LOCAL FALLBACK'}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[#10283A]">
                          <span className="text-[#A8BBCB] block text-[10px]">Safe Browsing</span>
                          <span className={healthData.gsbConfigured ? 'text-[#35CFA6] font-semibold' : 'text-[#A8BBCB]'}>
                            {healthData.gsbConfigured ? 'CONNECTED' : 'UNCONFIGURED'}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[#10283A]">
                          <span className="text-[#A8BBCB] block text-[10px]">VirusTotal</span>
                          <span className={healthData.vtConfigured ? 'text-[#35CFA6] font-semibold' : 'text-[#A8BBCB]'}>
                            {healthData.vtConfigured ? 'CONNECTED' : 'UNCONFIGURED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-[#A8BBCB] leading-relaxed bg-[#071521] p-3 rounded-lg border border-[#244155]">
                    <strong>Grounded Scope Disclaimer: </strong>
                    The Clyrixa extension intercepts hyperlinks clicked in supported desktop Chromium browsers. It does not automatically intercept WhatsApp mobile apps, SMS messages, or outside native applications.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== F. ABOUT CLYRIXA ==================== */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F7FC] flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#28D7E5]" />
                    <span>About CLYRIXA</span>
                  </h2>
                  <p className="text-xs text-[#A8BBCB] mt-1">
                    System specifications, architecture threat modeling, and security principles.
                  </p>
                </div>

                {/* Brand & Identity */}
                <div className="p-6 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#071521] border border-[#28D7E5]/50 flex items-center justify-center text-[#28D7E5]">
                      <Shield className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#F2F7FC] tracking-wider">CLYRIXA</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#153348] border border-[#28D7E5]/40 text-[#28D7E5] font-mono">
                          v1.0.0
                        </span>
                      </div>
                      <p className="text-xs text-[#28D7E5] font-medium tracking-tight">
                        Click Before You Trust.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#A8BBCB] leading-relaxed">
                    CLYRIXA is a context-aware phishing detection, link protection, and cyber safety intelligence platform developed for Track 02 — Cyber Security. Built on a deterministic 4-stage pipeline:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#071521] border border-[#244155] text-center">
                      <span className="text-[#28D7E5] block font-bold">STAGE 1</span>
                      <span className="text-[#F2F7FC] text-[11px]">DETECT</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#071521] border border-[#244155] text-center">
                      <span className="text-[#8B7CFF] block font-bold">STAGE 2</span>
                      <span className="text-[#F2F7FC] text-[11px]">EXPLAIN</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#071521] border border-[#244155] text-center">
                      <span className="text-[#35CFA6] block font-bold">STAGE 3</span>
                      <span className="text-[#F2F7FC] text-[11px]">PROTECT</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#071521] border border-[#244155] text-center">
                      <span className="text-[#F6C453] block font-bold">STAGE 4</span>
                      <span className="text-[#F2F7FC] text-[11px]">RECOVER</span>
                    </div>
                  </div>
                </div>

                {/* Policy & Governance Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#F2F7FC] uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#28D7E5]" />
                        <span>Privacy Policy & Handling</span>
                      </h4>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        Learn how Clyrixa processes telemetry, anonymizes query parameters, and maintains minimal retention.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowPrivacyPolicyModal(true)}
                      className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1 cursor-pointer self-start"
                    >
                      <span>Read Privacy Disclosure</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0B1F30] border border-[#244155] space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#F2F7FC] uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#35CFA6]" />
                        <span>Security Threat Model</span>
                      </h4>
                      <p className="text-xs text-[#A8BBCB] mt-1 leading-relaxed">
                        Review our STRIDE threat taxonomy, homoglyph attack resistance, and heuristic fail-safe boundaries.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowThreatModelModal(true)}
                      className="text-xs text-[#35CFA6] hover:underline flex items-center gap-1 cursor-pointer self-start"
                    >
                      <span>View Threat Architecture</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Grounded Security Disclaimer */}
                <div className="p-4 rounded-xl bg-[#071521] border border-[#244155] text-xs text-[#A8BBCB] flex items-start gap-3">
                  <AlertOctagon className="w-4 h-4 text-[#F6C453] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F2F7FC] block mb-0.5">Mandatory Security Disclaimer</span>
                    <p className="text-[11px] leading-relaxed">
                      “Security scans provide risk indicators, not a guarantee of safety.” Phishing tactics evolve continuously. Always verify the domain in your browser's address bar before providing credentials, authentication codes, or banking information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ==================== CONFIRMATION DIALOG: CLEAR HISTORY ==================== */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1F30] border border-[#FF6378]/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF6378]/10 border border-[#FF6378]/30 flex items-center justify-center text-[#FF6378] mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#F2F7FC]">
                Erase Local Scan History?
              </h3>
              <p className="text-xs text-[#A8BBCB] mt-1.5 leading-relaxed">
                This will permanently delete <strong className="text-[#F2F7FC]">{historyCount}</strong> scan records cached in this browser session. This operation cannot be reversed.
              </p>
            </div>

            <div className="bg-[#071521] border border-[#244155] rounded-xl p-3 text-[11px] text-[#A8BBCB]">
              <span className="text-[#FF6378] font-semibold block mb-0.5">Scope of Deletion:</span>
              <span>Only records stored locally in your browser (<code>clyrixa_scan_history</code>) will be removed. Scheduled incident consultation appointments in Firestore are preserved.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-[#153348] border border-[#244155] text-xs font-semibold text-[#F2F7FC] hover:border-[#28D7E5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl bg-[#FF6378] text-[#071521] text-xs font-bold hover:bg-[#FF6378]/90 transition-all cursor-pointer"
              >
                Yes, Erase Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CONFIRMATION DIALOG: RESET SETTINGS ==================== */}
      {showResetSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1F30] border border-[#244155] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#153348] border border-[#28D7E5]/30 flex items-center justify-center text-[#28D7E5] mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#F2F7FC]">
                Restore Default Preferences?
              </h3>
              <p className="text-xs text-[#A8BBCB] mt-1.5 leading-relaxed">
                This will reset all warning thresholds, scan preferences, typography scale, and theme modes to Clyrixa standard defaults.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#153348] border border-[#244155] text-xs font-semibold text-[#F2F7FC] hover:border-[#28D7E5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-all cursor-pointer"
              >
                Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: PRIVACY POLICY ==================== */}
      {showPrivacyPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0B1F30] border border-[#244155] rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#071521] border-b border-[#244155] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#28D7E5]" />
                <h3 className="text-sm font-bold text-[#F2F7FC]">
                  Clyrixa Privacy Principles & Data Governance
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyPolicyModal(false)}
                className="text-[#A8BBCB] hover:text-[#F2F7FC] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#A8BBCB] leading-relaxed">
              <p>
                <strong>1. Data Minimization by Design:</strong> Clyrixa analyzes destination hyperlinks and text structures for malicious patterns. We do not inspect personal browsing histories, stored cookies, or unrelated website contents.
              </p>
              <p>
                <strong>2. Parameter Masking:</strong> Sensitive URL query parameters (such as <code className="text-[#28D7E5]">token</code>, <code className="text-[#28D7E5]">code</code>, <code className="text-[#28D7E5]">password</code>, and <code className="text-[#28D7E5]">key</code>) are masked prior to persistent recording or transmission to threat databases.
              </p>
              <p>
                <strong>3. Client-Side Decryption:</strong> QR codes are processed entirely client-side using JavaScript canvas and matrix decoding. The raw image data never leaves your device.
              </p>
              <p>
                <strong>4. Third-Party Intelligence Providers:</strong> When external lookup is enabled, domain hashes or URLs are queried against Google Safe Browsing, VirusTotal, and urlscan.io in compliance with their respective developer privacy policies.
              </p>
              <p>
                <strong>5. User Rights:</strong> You may erase your local scan history at any time using the Clear Scan History feature in these Settings.
              </p>
            </div>

            <div className="px-6 py-3 bg-[#071521] border-t border-[#244155] flex justify-end">
              <button
                onClick={() => setShowPrivacyPolicyModal(false)}
                className="px-4 py-2 rounded-xl bg-[#28D7E5] text-[#071521] text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THREAT MODEL ==================== */}
      {showThreatModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0B1F30] border border-[#244155] rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#071521] border-b border-[#244155] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#35CFA6]" />
                <h3 className="text-sm font-bold text-[#F2F7FC]">
                  Clyrixa Security Threat Model & Bounds
                </h3>
              </div>
              <button
                onClick={() => setShowThreatModelModal(false)}
                className="text-[#A8BBCB] hover:text-[#F2F7FC] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#A8BBCB] leading-relaxed">
              <p>
                <strong>Architecture Scope:</strong> The platform operates as a pre-flight inspection gate for end-users facing deceptive links across messaging platforms, corporate emails, and search results.
              </p>
              <p>
                <strong>Primary Attack Vectors Countered:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Subdomain Camouflage:</strong> (e.g. <code>paypal.com.fraud-site.tk</code>)</li>
                <li><strong>Homoglyph / Punycode IDN Abuse:</strong> Cyrillic lookalike letters imitating Latin brands.</li>
                <li><strong>Shortener Chaining:</strong> Bitly, TinyURL, or nested shorteners hiding credential harvesters.</li>
                <li><strong>Direct IP Hosts:</strong> Unregistered raw numeric IP destinations masquerading as services.</li>
                <li><strong>Urgent Social Engineering SMS:</strong> Fake KYC, lottery rewards, and bank suspension messages.</li>
              </ul>
              <p>
                <strong>Fail-Safe Principle:</strong> In the event of service timeouts or incomplete threat database responses, Clyrixa emits an <em>INCONCLUSIVE</em> classification. Missing telemetry is never asserted as proof of legitimacy.
              </p>
            </div>

            <div className="px-6 py-3 bg-[#071521] border-t border-[#244155] flex justify-end">
              <button
                onClick={() => setShowThreatModelModal(false)}
                className="px-4 py-2 rounded-xl bg-[#35CFA6] text-[#071521] text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
