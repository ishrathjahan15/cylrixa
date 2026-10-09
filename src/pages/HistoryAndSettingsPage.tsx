import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Eye, 
  Activity, 
  Lock, 
  RefreshCw,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { ScanResult } from '../../shared/types.js';
import { getScanHistory, clearScanHistory, checkSystemHealth } from '../services/api.js';
import { DICTIONARY, Language } from '../utils/i18n.js';
import { SettingsPage } from './SettingsPage.js';
import { getSettings } from '../services/settings.js';

interface HistoryAndSettingsPageProps {
  onSelectReport: (scan: ScanResult) => void;
  language: Language;
  onNavigate?: (tab: string) => void;
  initialTab?: 'history' | 'settings';
}

export const HistoryAndSettingsPage: React.FC<HistoryAndSettingsPageProps> = ({ 
  onSelectReport,
  language,
  onNavigate,
  initialTab = 'history',
}) => {
  const [viewMode, setViewMode] = useState<'history' | 'settings'>(initialTab);
  const [historyList, setHistoryList] = useState<ScanResult[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const t = DICTIONARY[language] || DICTIONARY.en;

  useEffect(() => {
    loadHistory();
    fetchHealth();
  }, []);

  const loadHistory = () => {
    setHistoryList(getScanHistory());
  };

  const fetchHealth = async () => {
    setIsRefreshingHealth(true);
    try {
      const data = await checkSystemHealth();
      setHealthStatus(data);
    } catch {
      // Offline or network error
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  const handleClear = () => {
    const confirmPrompt = language === 'te' 
      ? 'మీ బ్రౌజర్ సెషన్‌లో నిల్వ చేయబడిన అన్ని స్కాన్ నివేదికలను క్లియర్ చేయాలా?'
      : language === 'hi'
      ? 'क्या आप अपने ब्राउज़र सत्र से सभी सहेजे गए स्कैन इतिहास को साफ़ करना चाहते हैं?'
      : `Clear all ${historyList.length} stored scan reports from your local browser session?`;

    if (confirm(confirmPrompt)) {
      clearScanHistory();
      setHistoryList([]);
    }
  };

  if (viewMode === 'settings') {
    return (
      <div className="space-y-4">
        {/* Sub-navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0B1F30] border border-[#244155]">
            <button
              onClick={() => setViewMode('history')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#A8BBCB] hover:text-[#F2F7FC] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Trail & History</span>
            </button>
            <button
              onClick={() => setViewMode('settings')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#153348] text-[#28D7E5] border border-[#28D7E5]/40 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Settings & Preferences</span>
            </button>
          </div>
        </div>

        <SettingsPage 
          language={language} 
          onNavigate={onNavigate || (() => {})} 
        />
      </div>
    );
  }

  const filteredHistory = historyList.filter((item) => {
    if (filter === 'clean') return item.status === 'LOW_RISK';
    if (filter === 'threats') return item.status === 'HIGH_RISK' || item.status === 'CRITICAL_RISK';
    if (filter === 'moderate') return item.status === 'MODERATE_RISK';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      {/* Sub-navigation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#244155] pb-4">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0B1F30] border border-[#244155]">
          <button
            onClick={() => setViewMode('history')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#153348] text-[#28D7E5] border border-[#28D7E5]/40 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & History ({historyList.length})</span>
          </button>
          <button
            onClick={() => setViewMode('settings')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#A8BBCB] hover:text-[#F2F7FC] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings & Preferences</span>
          </button>
        </div>

        <button
          onClick={() => setViewMode('settings')}
          className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>Configure Privacy & Warnings</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#153348] border border-[#28D7E5]/40 text-xs text-[#28D7E5] mb-4">
          <History className="w-3.5 h-3.5" />
          <span>{language === 'te' ? 'స్థానిక ఆడిట్ రికార్డులు & పాలన' : language === 'hi' ? 'स्थानीय ऑडिट ट्रेल और डेटा शासन' : 'Local Audit Trail & Governance'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F7FC] tracking-tight mb-2">
          {t.historyTitle}
        </h1>
        <p className="text-sm text-[#A8BBCB]">
          {t.historySub}
        </p>
      </div>

      {/* SCAN HISTORY TABLE */}
      <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#244155] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#A8BBCB]">
              {language === 'te' ? 'రిస్క్ ప్రకారం ఫిల్టర్ చేయండి:' : language === 'hi' ? 'जोखिम अनुसार फ़िल्टर करें:' : 'Filter by Risk:'}
            </span>
            <div className="flex items-center gap-1 bg-[#0B1F30] p-1 rounded-lg border border-[#244155] text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${filter === 'all' ? 'bg-[#153348] text-[#28D7E5] font-semibold' : 'text-[#A8BBCB]'}`}
              >
                {t.filterAll} ({historyList.length})
              </button>
              <button
                onClick={() => setFilter('threats')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${filter === 'threats' ? 'bg-[#153348] text-[#FF6378] font-semibold' : 'text-[#A8BBCB]'}`}
              >
                {t.filterThreats}
              </button>
              <button
                onClick={() => setFilter('clean')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${filter === 'clean' ? 'bg-[#153348] text-[#35CFA6] font-semibold' : 'text-[#A8BBCB]'}`}
              >
                {t.filterClean}
              </button>
            </div>
          </div>

          {historyList.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded bg-[#0B1F30] border border-[#244155] text-xs text-[#FF6378] hover:bg-[#FF6378]/10 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.btnClearHistory}</span>
            </button>
          )}
        </div>

        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.scanId}
                className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#28D7E5]/50 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.status === 'LOW_RISK' ? 'bg-[#35CFA6]/20 text-[#35CFA6]' :
                      item.status === 'MODERATE_RISK' ? 'bg-[#F6C453]/20 text-[#F6C453]' :
                      'bg-[#FF6378]/20 text-[#FF6378]'
                    }`}>
                      {item.status.replace('_', ' ')} ({item.riskScore}/100)
                    </span>
                    <span className="text-xs text-[#A8BBCB] font-mono">{item.hostname}</span>
                    <span className="text-[11px] text-[#A8BBCB]">
                      {new Date(item.scannedAt).toLocaleDateString()} {new Date(item.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#F2F7FC] truncate max-w-lg">{item.url}</p>
                </div>

                <button
                  onClick={() => onSelectReport(item)}
                  className="px-4 py-2 rounded-lg bg-[#153348] border border-[#28D7E5]/60 text-xs font-semibold text-[#28D7E5] hover:bg-[#28D7E5] hover:text-[#071521] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.btnViewReport}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-[#A8BBCB]">
            {t.noHistory}
          </div>
        )}
      </div>

      {/* PRIVACY & AUDIT SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F2F7FC]">
              <Lock className="w-4 h-4 text-[#35CFA6]" />
              <span>{t.privacySettingsTitle}</span>
            </div>
            <p className="text-xs text-[#A8BBCB] leading-relaxed">
              Protection thresholds, client-side query sanitization, and history saving preferences are governed via the unified Settings & Preferences panel.
            </p>
          </div>

          <div className="pt-3 border-t border-[#244155] flex items-center justify-between text-xs">
            <span className="text-[#35CFA6] font-mono text-[11px]">SINGLE SOURCE OF TRUTH</span>
            <button
              onClick={() => setViewMode('settings')}
              className="px-3.5 py-1.5 rounded-lg bg-[#153348] border border-[#28D7E5]/40 text-[#28D7E5] text-xs font-semibold hover:bg-[#28D7E5] hover:text-[#071521] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open Settings</span>
            </button>
          </div>
        </div>

        {/* System Connector Status */}
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F2F7FC]">
              <Activity className="w-4 h-4 text-[#28D7E5]" />
              <span>{t.engineStatusTitle}</span>
            </div>
            <button
              onClick={fetchHealth}
              disabled={isRefreshingHealth}
              className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingHealth ? 'animate-spin' : ''}`} />
              <span>{language === 'te' ? 'రిఫ్రెష్' : language === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-[#10283A] border border-[#244155]">
              <span className="text-[#A8BBCB]">{language === 'te' ? 'స్థానిక విశ్లేషణ ఇంజిన్' : language === 'hi' ? 'स्थानीय विश्लेषण इंजन' : 'Local Heuristic Baseline'}</span>
              <span className="text-[#35CFA6] font-mono font-semibold">{language === 'te' ? 'నిరంతరం సక్రియంగా ఉంది' : language === 'hi' ? 'सदा सक्रिय' : 'ALWAYS ACTIVE'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#10283A] border border-[#244155]">
              <span className="text-[#A8BBCB]">{t.connectorGemini}</span>
              <span className={`font-mono font-semibold ${healthStatus?.geminiConfigured ? 'text-[#35CFA6]' : 'text-[#F6C453]'}`}>
                {healthStatus?.geminiConfigured 
                  ? (language === 'te' ? 'కనెక్ట్ చేయబడింది' : language === 'hi' ? 'कनेक्टेड' : 'CONNECTED') 
                  : (language === 'te' ? 'స్థానిక మోడ్ సక్రియం' : language === 'hi' ? 'स्थानीय मोड सक्रिय' : 'LOCAL FALLBACK ACTIVE')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#10283A] border border-[#244155]">
              <span className="text-[#A8BBCB]">{t.connectorSafeBrowsing}</span>
              <span className={`font-mono font-semibold ${healthStatus?.gsbConfigured ? 'text-[#35CFA6]' : 'text-[#9BAABD]'}`}>
                {healthStatus?.gsbConfigured 
                  ? (language === 'te' ? 'కనెక్ట్ చేయబడింది' : language === 'hi' ? 'कनेक्टेड' : 'CONNECTED') 
                  : (language === 'te' ? 'కాన్ఫిగర్ కాలేదు' : language === 'hi' ? 'कॉन्फ़िगर नहीं' : 'NOT CONFIGURED')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#10283A] border border-[#244155]">
              <span className="text-[#A8BBCB]">{t.connectorVirusTotal}</span>
              <span className={`font-mono font-semibold ${healthStatus?.vtConfigured ? 'text-[#35CFA6]' : 'text-[#9BAABD]'}`}>
                {healthStatus?.vtConfigured 
                  ? (language === 'te' ? 'కనెక్ట్ చేయబడింది' : language === 'hi' ? 'कनेक्टेड' : 'CONNECTED') 
                  : (language === 'te' ? 'కాన్ఫిగర్ కాలేదు' : language === 'hi' ? 'कॉन्फ़िगर नहीं' : 'NOT CONFIGURED')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
