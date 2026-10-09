import React from 'react';
import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface FooterProps {
  onNavigate: (tab: string) => void;
  language: Language;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language, isAdmin = false }) => {
  const t = DICTIONARY[language] || DICTIONARY.en;

  const capabilities = language === 'te' ? [
    'సబ్‌డొమైన్ & హోమోగ్రాఫ్ మోసాల గుర్తింపు',
    'బ్రాండ్ నకిలీల స్వయంచాలక పోలిక',
    'యూనికోడ్ / సిరిల్లిక్ ఐడీఎన్ దుర్వినియోగం',
    'URL షార్ట్‌నర్ నిజమైన గమ్యస్థాన తనిఖీ',
    'సందేశంలో ఒత్తిడి & ఓటీపీ గుర్తింపు',
    'బ్రౌజర్‌లోనే క్లయింట్-సైడ్ QR కోడ్ డీకోడింగ్'
  ] : language === 'hi' ? [
    'सबडोमेन और होमोग्राफ धोखे की पहचान',
    'ब्रांड प्रतिरूपण का स्वचालित मिलान',
    'यूनिकोड / सिरिलिक आईडीएन दुरुपयोग',
    'URL शॉर्टनर वास्तविक गंतव्य निरीक्षण',
    'संदेश तात्कालिकता और ओटीपी पहचान',
    'ब्राउज़र में क्लाइंट-साइड क्यूआर कोड डिकोडिंग'
  ] : [
    'Subdomain & Homoglyph Deception',
    'Brand Impersonation Matching',
    'Punycode / Cyrillic IDN Abuse',
    'URL Shortener Endpoint Inspection',
    'Message Urgency & OTP Extraction',
    'Client-Side QR Code Decryption'
  ];

  return (
    <footer className="bg-[#0B1F30] border-t border-[#244155] text-xs text-[#A8BBCB] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-[#10283A] border border-[#28D7E5]/50 flex items-center justify-center text-[#28D7E5]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#F2F7FC] tracking-wider">CLYRIXA</span>
            </div>
            <p className="text-xs leading-relaxed mb-4 text-[#A8BBCB]">
              {t.footerMission}
            </p>
            <div className="text-[11px] text-[#28D7E5] font-mono">
              DETECT → EXPLAIN → PROTECT → RECOVER
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[#F2F7FC] font-semibold text-xs uppercase tracking-wider mb-3">
              {t.footerCapabilities}
            </h4>
            <ul className="space-y-2 text-xs">
              {capabilities.map((cap, i) => (
                <li key={i}>{cap}</li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-[#F2F7FC] font-semibold text-xs uppercase tracking-wider mb-3">
              {t.footerModules}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('scanner')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {t.navScanner}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('protection')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {t.navProtection}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {t.navLearn}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recovery')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {t.navRecovery}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {t.navHistory}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {t.navAppointments}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                  {language === 'te' ? 'సెట్టింగ్‌లు & ప్రాధాన్యతలు' : language === 'hi' ? 'सेटिंग्स और प्राथमिकताएं' : 'Settings & Preferences'}
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button onClick={() => onNavigate('admin')} className="hover:text-[#28D7E5] transition-colors cursor-pointer text-left">
                    {t.navAdmin}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-[#F2F7FC] font-semibold text-xs uppercase tracking-wider mb-3">
              {t.footerTrackNotice}
            </h4>
            <div className="bg-[#10283A] border border-[#244155] rounded-lg p-3 text-[11px] leading-relaxed">
              <span className="text-[#28D7E5] font-semibold block mb-1">
                TRACK 02 — CYBER SECURITY
              </span>
              {t.footerTrackText}
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-[#244155] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A8BBCB]">
          <p>
            {t.footerCopyright}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#35CFA6]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.footerSsrf}
            </span>
            <span className="flex items-center gap-1.5 text-[#28D7E5]">
              <Lock className="w-3.5 h-3.5" />
              {t.footerPrivacy}
            </span>
            <span className="flex items-center gap-1.5 text-[#A8BBCB]">
              <Eye className="w-3.5 h-3.5" />
              Manifest V3
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
