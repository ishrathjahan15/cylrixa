import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Globe, 
  Layers, 
  Share2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { ScanResult, Finding, ProviderResult } from '../../shared/types.js';
import { DICTIONARY, Language } from '../utils/i18n.js';
import { getSettings, SETTINGS_CHANGE_EVENT, UserSettings } from '../services/settings.js';

interface ResultsDashboardProps {
  scanResult: ScanResult;
  onNavigate: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  scanResult,
  onNavigate,
  language,
  onLanguageChange,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());
  const [showPreflightModal, setShowPreflightModal] = useState(false);
  const [showDetailedFindings, setShowDetailedFindings] = useState(() => getSettings().detailedExplanations);

  React.useEffect(() => {
    const handleSettingsChange = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
        setShowDetailedFindings(e.detail.detailedExplanations);
      }
    };
    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChange);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChange);
  }, []);

  const t = DICTIONARY[language] || DICTIONARY.en;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL_RISK':
        return { text: '#FF6378', bg: 'rgba(255, 99, 120, 0.15)', border: '#FF6378' };
      case 'HIGH_RISK':
        return { text: '#FF9866', bg: 'rgba(255, 152, 102, 0.15)', border: '#FF9866' };
      case 'MODERATE_RISK':
        return { text: '#F6C453', bg: 'rgba(246, 196, 83, 0.15)', border: '#F6C453' };
      case 'LOW_RISK':
        return { text: '#35CFA6', bg: 'rgba(53, 207, 166, 0.15)', border: '#35CFA6' };
      default:
        return { text: '#9BAABD', bg: 'rgba(155, 170, 189, 0.15)', border: '#9BAABD' };
    }
  };

  const statusStyle = getStatusColor(scanResult.status);

  const handleCopy = (text: string, isHost: boolean) => {
    navigator.clipboard.writeText(text);
    if (isHost) {
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleDownloadSanitizedJson = () => {
    const reportData = {
      product: 'Clyrixa Security Intelligence',
      scanId: scanResult.scanId,
      scannedAt: scanResult.scannedAt,
      hostname: scanResult.hostname,
      sanitizedUrl: scanResult.url,
      verdict: scanResult.status,
      riskScore: scanResult.riskScore,
      confidence: scanResult.confidence,
      brandComparison: scanResult.brandComparison,
      findings: scanResult.findings,
      providers: scanResult.providers,
      recommendations: scanResult.recommendations,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clyrixa-report-${scanResult.hostname.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Demo Data Banner if demo */}
      {scanResult.isDemo && (
        <div className="bg-[#153348] border-l-4 border-[#28D7E5] p-3 rounded-r-lg flex items-center justify-between text-xs">
          <span className="text-[#F2F7FC] font-semibold">
            DEMO DATA — NOT A LIVE SCAN: Deterministic test scenario demonstrating security heuristics.
          </span>
          <span className="text-[10px] bg-[#10283A] text-[#28D7E5] px-2 py-0.5 rounded font-mono">
            {scanResult.demoScenarioId}
          </span>
        </div>
      )}

      {/* VERDICT HEADER CARD */}
      <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-[#0B1F30] border border-[#244155] rounded-xl text-center">
            <span className="text-xs font-semibold text-[#A8BBCB] uppercase tracking-wider mb-2">
              {t.riskScoreTitle}
            </span>
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              {/* Circular Gauge Background */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#153348"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={statusStyle.text}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * scanResult.riskScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-[#F2F7FC] tracking-tight">
                  {scanResult.riskScore}
                </span>
                <span className="text-[10px] text-[#A8BBCB] font-mono">/ 100</span>
              </div>
            </div>

            {/* Verdict Badge */}
            <div
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-1"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
              }}
            >
              {scanResult.status.replace('_', ' ')}
            </div>

            {/* Confidence info */}
            <div className="mt-3 flex items-center gap-3 text-[11px] text-[#A8BBCB]">
              <span>Confidence: <strong className="text-[#F2F7FC]">{scanResult.confidence}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Checks: <strong className="text-[#F2F7FC]">{scanResult.coverage.successful}/{scanResult.coverage.total}</strong></span>
            </div>
          </div>

          {/* Right: Destination Details & Metadata */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#A8BBCB] uppercase tracking-wider">
                  {t.targetDestination}
                </span>
                <span className="text-[10px] text-[#A8BBCB]">
                  Scanned {new Date(scanResult.scannedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#0B1F30] border border-[#244155] rounded-lg p-2.5">
                <code className="text-xs text-[#28D7E5] font-mono flex-1 break-all select-all">
                  {scanResult.url}
                </code>
                <button
                  onClick={() => handleCopy(scanResult.url, false)}
                  className="p-1.5 text-[#A8BBCB] hover:text-[#F2F7FC] transition-colors shrink-0"
                  title="Copy destination link"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-[#35CFA6]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Normalized Host Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0B1F30] border border-[#244155] rounded-lg p-3">
                <span className="text-[#A8BBCB] block text-[11px] mb-1">{t.assessedHostname}</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#F2F7FC] font-semibold truncate pr-2">
                    {scanResult.hostname}
                  </span>
                  <button
                    onClick={() => handleCopy(scanResult.hostname, true)}
                    className="text-[#28D7E5] hover:underline text-[11px] shrink-0"
                  >
                    {copiedHost ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-[#0B1F30] border border-[#244155] rounded-lg p-3">
                <span className="text-[#A8BBCB] block text-[11px] mb-1">{t.navRecommendation}</span>
                <span className={`font-semibold ${scanResult.safeToOpen ? 'text-[#35CFA6]' : 'text-[#FF6378]'}`}>
                  {scanResult.safeToOpen ? t.cleanRec : t.dangerRec}
                </span>
              </div>
            </div>

            {/* Quick Summary Text */}
            <p className="text-xs text-[#A8BBCB] leading-relaxed pt-1">
              {scanResult.aiExplanation?.summary || 'Standard heuristics evaluation complete. Review specific evidence items below.'}
            </p>
          </div>
        </div>
      </div>

      {/* BRAND COMPARISON CARD (If brand mismatch detected) */}
      {scanResult.brandComparison && (
        <div className="bg-[#FF6378]/10 border-2 border-[#FF6378] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FF6378] font-bold text-sm tracking-wide uppercase">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t.brandImpersonationTitle}</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#FF6378]/20 text-[#FF6378] font-mono">
              {scanResult.brandComparison.mismatchType.replace('_', ' ')}
            </span>
          </div>

          <p className="text-xs text-[#F2F7FC] leading-relaxed">
            {scanResult.brandComparison.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-[#0B1F30] border border-[#244155] rounded-lg p-3">
              <span className="text-[#A8BBCB] block text-[11px] mb-1">{t.claimedBrand}</span>
              <strong className="text-[#35CFA6] text-sm block">
                {scanResult.brandComparison.detectedBrand}
              </strong>
              <span className="text-[#A8BBCB] text-[11px] mt-1 block">
                {t.verifiedPortal}{' '}
                <a
                  href={`https://${scanResult.brandComparison.officialDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#28D7E5] underline"
                >
                  {scanResult.brandComparison.officialDomain}
                </a>
              </span>
            </div>

            <div className="bg-[#0B1F30] border border-[#FF6378]/50 rounded-lg p-3">
              <span className="text-[#A8BBCB] block text-[11px] mb-1">{t.actualHostname}</span>
              <strong className="text-[#FF6378] text-sm block font-mono">
                {scanResult.brandComparison.actualHostname}
              </strong>
              <span className="text-[#FF6378] text-[11px] mt-1 block">
                {t.unrelatedWarning} {scanResult.brandComparison.detectedBrand}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI-POWERED SAFETY GUIDANCE PANEL */}
      {scanResult.aiExplanation && (
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#244155] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#28D7E5]" />
              <h3 className="text-sm font-bold text-[#F2F7FC] uppercase tracking-wider">
                {t.guidanceTitle}
              </h3>
            </div>
            {/* Inline Language Switcher */}
            <div className="flex items-center gap-1 bg-[#10283A] p-0.5 rounded border border-[#244155] text-xs">
              <span className="text-[10px] text-[#A8BBCB] px-1.5">{t.activeLanguageLabel}</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-[#153348] text-[#28D7E5] font-bold' : 'text-[#A8BBCB]'}`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('te')}
                className={`px-2 py-0.5 rounded ${language === 'te' ? 'bg-[#153348] text-[#28D7E5] font-bold' : 'text-[#A8BBCB]'}`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-[#153348] text-[#28D7E5] font-bold' : 'text-[#A8BBCB]'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: What could happen */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#FF9866] uppercase tracking-wider block">
                {t.consequencesTitle}
              </span>
              <ul className="space-y-1.5 text-xs text-[#F2F7FC]">
                {scanResult.aiExplanation.consequences.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#FF9866] mt-0.5">▪</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Recommended immediate steps */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#35CFA6] uppercase tracking-wider block">
                {t.actionsTitle}
              </span>
              <ul className="space-y-1.5 text-xs text-[#F2F7FC]">
                {scanResult.aiExplanation.recommendedSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#35CFA6] mt-0.5">✓</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* LINK JOURNEY TIMELINE (Hop 1 -> Hop 2 -> Destination) */}
      <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8BBCB] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#28D7E5]" />
          <span>{t.journeyTitle}</span>
        </h3>

        <div className="space-y-3">
          {scanResult.redirectJourney.map((hop, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#153348] border border-[#28D7E5] flex items-center justify-center text-xs font-mono text-[#28D7E5] shrink-0 mt-0.5">
                {hop.step}
              </div>
              <div className="bg-[#0B1F30] border border-[#244155] rounded-lg p-3 flex-1 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[#F2F7FC] font-semibold truncate pr-2">
                    {hop.hostname}
                  </span>
                  {hop.isShortener && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6C453]/20 text-[#F6C453] font-mono">
                      URL Shortener
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#A8BBCB] truncate mb-1">{hop.url}</p>
                {hop.status && (
                  <p className="text-[11px] text-[#28D7E5]">{hop.status}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EVIDENCE CARDS: SPECIFIC SECURITY FINDINGS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F2F7FC]">
              {t.findingsTitle} ({scanResult.findings.length})
            </h3>
            <button
              onClick={() => setShowDetailedFindings(!showDetailedFindings)}
              className="text-[11px] px-2 py-0.5 rounded bg-[#10283A] border border-[#244155] text-[#28D7E5] hover:border-[#28D7E5] transition-colors cursor-pointer"
            >
              {showDetailedFindings ? 'Switch to Concise View' : 'Show Full Technical Evidence'}
            </button>
          </div>
          <span className="text-xs text-[#A8BBCB]">Grounded Heuristic Evidence</span>
        </div>

        {showDetailedFindings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scanResult.findings.map((f) => (
              <div
                key={f.id}
                className={`bg-[#10283A] border rounded-xl p-5 space-y-3 transition-all ${
                  f.severity === 'critical' ? 'border-[#FF6378]/60 bg-[#FF6378]/5' :
                  f.severity === 'high' ? 'border-[#FF9866]/60 bg-[#FF9866]/5' :
                  f.severity === 'medium' ? 'border-[#F6C453]/60 bg-[#F6C453]/5' :
                  'border-[#244155]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    f.severity === 'critical' ? 'bg-[#FF6378]/20 text-[#FF6378]' :
                    f.severity === 'high' ? 'bg-[#FF9866]/20 text-[#FF9866]' :
                    f.severity === 'medium' ? 'bg-[#F6C453]/20 text-[#F6C453]' :
                    'bg-[#35CFA6]/20 text-[#35CFA6]'
                  }`}>
                    {f.severity}
                  </span>
                  {settings.showTechnicalSourceRules && (
                    <span className="text-[10px] text-[#A8BBCB] font-mono">{f.sourceRule}</span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F2F7FC] mb-1">{f.title}</h4>
                  <p className="text-xs text-[#A8BBCB] leading-relaxed">{f.observation}</p>
                </div>

                <div className="border-t border-[#244155] pt-2 text-[11px] space-y-1">
                  <p className="text-[#F2F7FC]">
                    <strong className="text-[#A8BBCB]">Significance:</strong> {f.significance}
                  </p>
                  <p className="text-[#28D7E5]">
                    <strong>Action:</strong> {f.recommendedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-4 text-xs text-[#A8BBCB] flex items-center justify-between">
            <span>Concise summary active based on your Scan Preferences ({scanResult.findings.length} technical heuristics evaluated).</span>
            <button
              onClick={() => setShowDetailedFindings(true)}
              className="text-[#28D7E5] underline cursor-pointer"
            >
              Expand details
            </button>
          </div>
        )}
      </div>

      {/* THREAT PROVIDERS STATUS MATRIX */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8BBCB]">
              {t.providersTitle}
            </h3>
            <p className="text-[11px] text-[#A8BBCB]">
              Audited integration statuses. Unconfigured services provide manual lookup routes.
            </p>
          </div>
          <span className="text-xs text-[#35CFA6] font-mono">
            {scanResult.providers.filter(p => p.status === 'connected').length} Connected / {scanResult.providers.length} Registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scanResult.providers.map((p, i) => (
            <div key={i} className="bg-[#10283A] border border-[#244155] rounded-lg p-3 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[#F2F7FC] truncate pr-1">{p.displayName}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    p.status === 'connected' ? 'bg-[#35CFA6]/20 text-[#35CFA6]' :
                    p.status === 'manual_lookup_only' ? 'bg-[#28D7E5]/20 text-[#28D7E5]' :
                    'bg-[#9BAABD]/20 text-[#9BAABD]'
                  }`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-[#A8BBCB] mb-2">{p.notes}</p>
              </div>

              {p.externalLookupUrl && (
                <a
                  href={p.externalLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#28D7E5] hover:underline pt-2 border-t border-[#244155]"
                >
                  <span>Manual Portal Lookup</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTEXTUAL ACTIONS PANEL */}
      <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('scanner')}
            className="px-4 py-2 rounded-lg bg-[#153348] border border-[#244155] text-xs font-semibold text-[#F2F7FC] hover:border-[#28D7E5] transition-colors cursor-pointer"
          >
            {t.btnScanAnother}
          </button>

          <button
            onClick={handleDownloadSanitizedJson}
            className="px-4 py-2 rounded-lg bg-[#0B1F30] border border-[#244155] text-xs font-semibold text-[#28D7E5] hover:border-[#28D7E5] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.btnExportJson}</span>
          </button>

          <button
            onClick={() => onNavigate('recovery')}
            className="px-4 py-2 rounded-lg bg-[#FF9866]/20 border border-[#FF9866]/50 text-xs font-semibold text-[#FF9866] hover:bg-[#FF9866]/30 transition-colors cursor-pointer"
          >
            {t.btnAlreadyClicked}
          </button>
        </div>

        {scanResult.safeToOpen ? (
          settings.beforeOpeningWarning ? (
            <button
              onClick={() => setShowPreflightModal(true)}
              className="px-5 py-2 rounded-lg bg-[#35CFA6] text-[#071521] text-xs font-bold hover:bg-[#28D7E5] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.btnProceedWebsite}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <a
              href={scanResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-[#35CFA6] text-[#071521] text-xs font-bold hover:bg-[#28D7E5] transition-all flex items-center gap-1.5"
            >
              <span>{t.btnProceedWebsite}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )
        ) : (
          <span className="text-xs text-[#FF6378] font-semibold italic">
            {t.navBlockedPolicy}
          </span>
        )}
      </div>

      {/* Pre-Flight External Link Interstitial Modal */}
      {showPreflightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1F30] border border-[#244155] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#28D7E5]">
              <Shield className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-[#F2F7FC]">
                Pre-Flight Link Safety Advisory
              </h3>
            </div>

            <p className="text-xs text-[#A8BBCB] leading-relaxed">
              You have enabled <strong>Before-Opening Warning Preference</strong> in Settings. You are preparing to navigate away from Clyrixa to an external third-party destination:
            </p>

            <div className="bg-[#071521] border border-[#244155] rounded-lg p-3 text-xs space-y-1">
              <span className="text-[10px] text-[#A8BBCB] uppercase tracking-wider block">Target Hostname</span>
              <span className="font-mono text-[#28D7E5] font-bold block truncate">{scanResult.hostname}</span>
              <div className="text-[11px] text-[#A8BBCB] flex items-center gap-2 pt-1 border-t border-[#244155]">
                <span>Evaluated Risk Score:</span>
                <strong className={scanResult.status === 'LOW_RISK' ? 'text-[#35CFA6]' : 'text-[#FF6378]'}>
                  {scanResult.riskScore} / 100 ({scanResult.status})
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-[#A8BBCB] italic">
              Security scans provide risk indicators, not an absolute guarantee of future safety. Do not enter passwords if the domain does not match your expected portal.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPreflightModal(false)}
                className="px-3.5 py-2 rounded-lg bg-[#153348] border border-[#244155] text-xs font-semibold text-[#F2F7FC] hover:border-[#28D7E5] cursor-pointer"
              >
                Cancel & Stay Safe
              </button>
              <button
                onClick={() => {
                  setShowPreflightModal(false);
                  window.open(scanResult.url, '_blank', 'noopener,noreferrer');
                }}
                className="px-4 py-2 rounded-lg bg-[#35CFA6] text-[#071521] text-xs font-bold hover:bg-[#28D7E5] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Destination</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
