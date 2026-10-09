import React, { useState } from 'react';
import { 
  Chrome, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Info, 
  Play, 
  RotateCcw
} from 'lucide-react';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface LinkProtectionPageProps {
  language: Language;
}

export const LinkProtectionPage: React.FC<LinkProtectionPageProps> = ({ language }) => {
  // Simulator state
  const [simState, setSimState] = useState<'idle' | 'scanning' | 'clean_pass' | 'threat_blocked'>('idle');
  const [simActiveUrl, setSimActiveUrl] = useState('');
  const [simStatusMsg, setSimStatusMsg] = useState('');
  const [simOverride, setSimOverride] = useState(false);
  const t = DICTIONARY[language] || DICTIONARY.en;

  const testLinks = [
    {
      title: language === 'te' ? 'అధికారిక డెవలపర్ సర్వీస్' : language === 'hi' ? 'प्रामाणिक डेवलपर सेवा' : 'Legitimate Developer Service',
      url: 'https://github.com/clyrixa/security',
      type: 'clean',
      desc: language === 'te' ? 'ప్రామాణిక TLS ఎన్‌క్రిప్షన్‌తో కూడిన అధికారిక డొమైన్. ఆటోమేటిక్‌గా కొనసాగుతుంది.' : language === 'hi' ? 'मानक TLS एन्क्रिप्शन के साथ प्रामाणिक डोमेन संरचना। स्वचालित रूप से पास होना चाहिए।' : 'Authentic domain structure with standard TLS encryption. Should pass automatically.',
    },
    {
      title: language === 'te' ? 'PayPal సబ్‌డొమైన్ మోసం' : language === 'hi' ? 'PayPal सबडोमेन धोखा' : 'PayPal Subdomain Deception',
      url: 'https://paypal.com.account-verify.tk/auth/signin?token=928471',
      type: 'critical',
      desc: language === 'te' ? 'విదేశీ .tk రిజిస్ట్రార్‌లో paypal.com సబ్‌డొమైన్‌గా ఉంచబడింది. తక్షణమే నిరోధించబడుతుంది!' : language === 'hi' ? 'विदेशी रजिस्ट्रार .tk पर paypal.com को सबडोमेन के रूप में रखा गया है। तुरंत अवरुद्ध किया जाएगा!' : 'Deceptively places paypal.com as a subdomain of foreign registrant .tk. Must be blocked!',
    },
    {
      title: language === 'te' ? 'టైపోస్క్వాటింగ్ బ్రాండ్ (paypa1)' : language === 'hi' ? 'टाइपोस्कॉटेड ब्रांड (paypa1)' : 'Typosquatted Brand (paypa1)',
      url: 'https://paypa1-security-update.xyz/login?ref=urgent',
      type: 'high',
      desc: language === 'te' ? '.xyz TLD పై "l" బదులు అంకె "1" మార్చబడింది. హెచ్చరికను ప్రేరేపిస్తుంది.' : language === 'hi' ? '.xyz TLD पर अक्षर "l" के बदले अंक "1" प्रतिस्थापित। नेविगेशन रोकता है और चेतावनी देता है।' : 'Substituted digit "1" for letter "l" on .xyz TLD. Halts navigation and triggers warning.',
    },
    {
      title: language === 'te' ? 'URL షార్ట్‌నర్ (దాచిన గమ్యస్థానం)' : language === 'hi' ? 'URL शॉर्टनर (छिपा हुआ गंतव्य)' : 'URL Shortener (Hidden Target)',
      url: 'https://bit.ly/3xSampleShortener',
      type: 'moderate',
      desc: language === 'te' ? 'బిట్లీ రీడైరెక్ట్ వెనుక నిజమైన గమ్యాన్ని దాచిపెడుతుంది. సమీక్ష కోసం ఆపుతుంది.' : language === 'hi' ? 'बिटली रीडायरेक्ट के पीछे वास्तविक गंतव्य को छिपाता है। समीक्षा के लिए रोकता है।' : 'Obfuscates real destination behind Bitly redirect. Pauses navigation for user review.',
    },
  ];

  const handleSimulateClick = (url: string, type: string) => {
    setSimActiveUrl(url);
    setSimState('scanning');
    setSimOverride(false);
    setSimStatusMsg(
      language === 'te'
        ? 'క్లైరిక్సా కంటెంట్ స్క్రిప్ట్ క్లిక్‌ను అడ్డుకుంది. ముందస్తు నావిగేషన్ తనిఖీ అభ్యర్థన పంపుతోంది...'
        : language === 'hi'
        ? 'क्लेरिक्स कंटेंट स्क्रिप्ट ने क्लिक इंटरसेप्ट किया। पूर्व-नेविगेशन निरीक्षण अनुरोध भेज रहा है...'
        : 'Clyrixa Content Script intercepted click. Sending pre-navigation inspection request...'
    );

    setTimeout(() => {
      if (type === 'clean') {
        setSimState('clean_pass');
        setSimStatusMsg(
          language === 'te'
            ? 'రిస్క్ అంచనా: LOW_RISK (4/100). ఎటువంటి ముప్పు కనుగొనబడలేదు. గమ్యస్థానానికి నేరుగా కొనసాగుతోంది.'
            : language === 'hi'
            ? 'जोखिम मूल्यांकन: LOW_RISK (4/100)। कोई ज्ञात खतरा नहीं मिला। गंतव्य पर स्वचालित रूप से जारी।'
            : 'Risk assessment: LOW_RISK (4/100). No known threat detected. Proceeding to destination automatically.'
        );
      } else {
        setSimState('threat_blocked');
        setSimStatusMsg(
          type === 'critical'
            ? language === 'te'
              ? 'CRITICAL_RISK (92/100): ఫిషింగ్ & బ్రాండ్ మోసం గుర్తించబడింది! నావిగేషన్ నిలిపివేయబడింది.'
              : language === 'hi'
              ? 'CRITICAL_RISK (92/100): फ़िशिंग और ब्रांड प्रतिरूपण पाया गया! नेविगेशन रोक दिया गया।'
              : 'CRITICAL_RISK (92/100): Phishing & Brand Impersonation detected! Navigation paused. Interstitial warning triggered.'
            : language === 'te'
            ? 'HIGH/MODERATE RISK: అనుమానాస్పద సంకేతాలు గుర్తించబడ్డాయి. నావిగేషన్ నిలిపివేయబడింది.'
            : language === 'hi'
            ? 'HIGH/MODERATE RISK: भ्रामक विशेषताएं पहचानी गईं। नेविगेशन रोक दिया गया।'
            : 'HIGH/MODERATE RISK: Deceptive attributes identified. Halting navigation.'
        );
      }
    }, 1200);
  };

  const resetSimulator = () => {
    setSimState('idle');
    setSimActiveUrl('');
    setSimStatusMsg('');
    setSimOverride(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#153348] border border-[#28D7E5]/40 text-xs text-[#28D7E5] mb-4">
          <Chrome className="w-3.5 h-3.5" />
          <span>Chromium Manifest V3 Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F2F7FC] tracking-tight mb-3">
          {t.protectionTitle}
        </h1>
        <p className="text-sm text-[#A8BBCB] leading-relaxed">
          {t.protectionSub}
        </p>
      </div>

      {/* INTERACTIVE IN-BROWSER SIMULATOR */}
      <div className="bg-[#10283A] border-2 border-[#28D7E5]/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#244155] pb-4">
          <div>
            <span className="text-xs font-mono text-[#28D7E5] uppercase tracking-wider block mb-1">
              Interactive Test Environment
            </span>
            <h2 className="text-xl font-bold text-[#F2F7FC]">
              {t.simulatorHeader}
            </h2>
          </div>
          <button
            onClick={resetSimulator}
            className="self-start sm:self-auto px-3 py-1.5 rounded bg-[#0B1F30] border border-[#244155] text-xs text-[#A8BBCB] hover:text-[#F2F7FC] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.btnResetDemo}</span>
          </button>
        </div>

        <p className="text-xs text-[#A8BBCB]">
          {t.simulatorSub}
        </p>

        {/* Clickable links testbed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testLinks.map((link, idx) => (
            <div
              key={idx}
              className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4 flex flex-col justify-between hover:border-[#28D7E5] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#F2F7FC]">{link.title}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    link.type === 'clean' ? 'bg-[#35CFA6]/20 text-[#35CFA6]' :
                    link.type === 'critical' ? 'bg-[#FF6378]/20 text-[#FF6378]' :
                    link.type === 'high' ? 'bg-[#FF9866]/20 text-[#FF9866]' :
                    'bg-[#F6C453]/20 text-[#F6C453]'
                  }`}>
                    {link.type.toUpperCase()}
                  </span>
                </div>
                <code className="text-[11px] text-[#28D7E5] block font-mono truncate mb-2">
                  {link.url}
                </code>
                <p className="text-[11px] text-[#A8BBCB] mb-3 leading-relaxed">
                  {link.desc}
                </p>
              </div>

              <button
                onClick={() => handleSimulateClick(link.url, link.type)}
                className="w-full py-2 rounded-lg bg-[#153348] border border-[#28D7E5]/60 text-xs font-bold text-[#28D7E5] hover:bg-[#28D7E5] hover:text-[#071521] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{t.btnSimulateClick}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Live Simulator Viewport / Response Box */}
        {simState !== 'idle' && (
          <div className="mt-6 border border-[#244155] rounded-xl bg-[#071521] p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between text-xs border-b border-[#244155] pb-2">
              <span className="font-semibold text-[#A8BBCB] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#28D7E5]" />
                Simulated Browser Viewport Interception
              </span>
              <span className="font-mono text-[#28D7E5] text-[11px]">
                {simState === 'scanning' ? 'ANALYZING...' : simState.toUpperCase()}
              </span>
            </div>

            {/* In-page overlay simulation */}
            {simState === 'scanning' && (
              <div className="bg-[#0B1F30] border border-[#28D7E5] rounded-lg p-4 flex items-center gap-3 animate-pulse">
                <div className="w-4 h-4 border-2 border-[#28D7E5] border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="text-xs">
                  <strong className="text-[#28D7E5] block">CLYRIXA SHIELD ACTIVE</strong>
                  <span className="text-[#F2F7FC]">{simStatusMsg}</span>
                </div>
              </div>
            )}

            {/* Low Risk Navigation Pass */}
            {simState === 'clean_pass' && (
              <div className="bg-[#35CFA6]/10 border border-[#35CFA6] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-[#35CFA6] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>POLICY SATISFIED: Clean Destination Verified</span>
                </div>
                <p className="text-xs text-[#F2F7FC]">{simStatusMsg}</p>
                <div className="text-[11px] text-[#A8BBCB] bg-[#10283A] p-2 rounded font-mono break-all">
                  → Browser continues automatically to: {simActiveUrl}
                </div>
              </div>
            )}

            {/* Threat Blocked / Warning Interstitial */}
            {simState === 'threat_blocked' && (
              <div className="bg-[#FF6378]/10 border-2 border-[#FF6378] rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2 text-[#FF6378] font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>AUTOMATIC NAVIGATION HALTED BY CLYRIXA</span>
                </div>
                <p className="text-xs text-[#F2F7FC] leading-relaxed">{simStatusMsg}</p>

                <div className="bg-[#10283A] p-3 rounded text-xs space-y-1">
                  <span className="text-[#A8BBCB] block text-[11px]">Blocked Target:</span>
                  <code className="text-[#FF6378] font-mono break-all block">{simActiveUrl}</code>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={resetSimulator}
                    className="px-4 py-2 rounded-lg bg-[#35CFA6] text-[#071521] text-xs font-bold hover:bg-[#28D7E5] cursor-pointer"
                  >
                    Return to Safety (Recommended)
                  </button>

                  <button
                    onClick={() => setSimOverride(true)}
                    className="px-4 py-2 rounded-lg bg-[#153348] border border-[#244155] text-xs font-semibold text-[#A8BBCB] hover:text-[#FF6378] cursor-pointer"
                  >
                    Deliberate Override...
                  </button>
                </div>

                {simOverride && (
                  <div className="mt-2 p-3 bg-[#0B1F30] border border-[#FF6378] rounded text-xs text-[#FF6378] space-y-2">
                    <p>
                      <strong>Warning:</strong> Overriding security protection may expose you to immediate credential theft or phishing malware.
                    </p>
                    <a
                      href={simActiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-[#FF6378] text-[#071521] rounded font-bold text-[11px]"
                    >
                      Proceed Anyway at Your Own Risk
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEP-BY-STEP INSTALLATION GUIDE (Chrome & Edge) */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#28D7E5] uppercase tracking-wider block mb-1">
            Unpacked Extension Deployment
          </span>
          <h2 className="text-2xl font-bold text-[#F2F7FC]">
            How to Load Clyrixa in Chrome & Microsoft Edge
          </h2>
          <p className="text-xs text-[#A8BBCB] mt-1">
            The project repository includes a complete, fully functioning <code className="text-[#28D7E5]">/extension</code> folder configured with Manifest V3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Chrome / Brave Instructions */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F2F7FC]">
              <Chrome className="w-4 h-4 text-[#28D7E5]" />
              <span>Google Chrome & Brave Browser</span>
            </div>
            <ol className="space-y-2.5 text-[#A8BBCB] list-decimal list-inside leading-relaxed">
              <li>Open Chrome and navigate to <code className="text-[#28D7E5] bg-[#071521] px-1 py-0.5 rounded">chrome://extensions</code></li>
              <li>Toggle on <strong>Developer mode</strong> in the top-right corner.</li>
              <li>Click the <strong>Load unpacked</strong> button on the top-left toolbar.</li>
              <li>Select the <code className="text-[#28D7E5] bg-[#071521] px-1 py-0.5 rounded">extension</code> folder from this project directory.</li>
              <li>The <strong>Clyrixa — Real-Time Link Protection</strong> extension is now running!</li>
            </ol>
          </div>

          {/* Microsoft Edge Instructions */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F2F7FC]">
              <ExternalLink className="w-4 h-4 text-[#35CFA6]" />
              <span>Microsoft Edge</span>
            </div>
            <ol className="space-y-2.5 text-[#A8BBCB] list-decimal list-inside leading-relaxed">
              <li>Open Edge and navigate to <code className="text-[#35CFA6] bg-[#071521] px-1 py-0.5 rounded">edge://extensions</code></li>
              <li>Toggle on <strong>Developer mode</strong> in the left sidebar menu.</li>
              <li>Click <strong>Load unpacked</strong> button.</li>
              <li>Choose the <code className="text-[#35CFA6] bg-[#071521] px-1 py-0.5 rounded">extension</code> folder.</li>
              <li>Pin the Clyrixa shield icon for convenient link status access.</li>
            </ol>
          </div>
        </div>

        {/* Permissions & Architectural Limitations Disclosure */}
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-5 space-y-3 text-xs">
          <h4 className="font-bold text-[#F2F7FC] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#28D7E5]" />
            <span>Permissions & Scope Transparency (Honest Engineering)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#A8BBCB] leading-relaxed">
            <div>
              <strong className="text-[#F2F7FC] block mb-1">What the extension intercepts:</strong>
              Clicks on external HTTP/HTTPS hyperlinks in supported desktop browser tabs.
            </div>
            <div>
              <strong className="text-[#F2F7FC] block mb-1">What the extension cannot intercept:</strong>
              Links clicked inside native mobile apps (e.g. WhatsApp, Instagram app, native email clients) that open outside the browser.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
