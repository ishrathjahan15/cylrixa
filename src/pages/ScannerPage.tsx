import React, { useState, useRef } from 'react';
import { 
  Search, 
  MessageSquare, 
  QrCode, 
  AlertTriangle, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clipboard, 
  Trash2, 
  Upload, 
  ShieldAlert,
  Loader2,
  ExternalLink
} from 'lucide-react';
import jsQR from 'jsqr';
import { scanUrl, analyzeMessage } from '../services/api.js';
import { getSettings } from '../services/settings.js';
import { ScanResult, MessageAnalysisResult } from '../../shared/types.js';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface ScannerPageProps {
  onScanComplete: (result: ScanResult) => void;
  language: Language;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  onScanComplete,
  language,
}) => {
  const [activeMode, setActiveMode] = useState<'url' | 'message' | 'qr'>(() => {
    try {
      return getSettings().defaultScanMode;
    } catch {
      return 'url';
    }
  });
  const t = DICTIONARY[language] || DICTIONARY.en;
  
  // URL Mode state
  const [urlInput, setUrlInput] = useState('');
  const [consentExternal, setConsentExternal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Message Mode state
  const [messageInput, setMessageInput] = useState('');
  const [isMessageAnalyzing, setIsMessageAnalyzing] = useState(false);
  const [messageResult, setMessageResult] = useState<MessageAnalysisResult | null>(null);

  // QR Mode state
  const [qrDecodedUrl, setQrDecodedUrl] = useState('');
  const [qrError, setQrError] = useState('');
  const [qrProcessing, setQrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample test fixtures
  const sampleLinks = language === 'te' ? [
    { label: 'అధికారిక లింక్ (GitHub)', url: 'https://github.com/clyrixa/security', type: 'clean' },
    { label: 'PayPal సబ్‌డొమైన్ మోసం (.tk)', url: 'https://paypal.com.account-verify.tk/auth/signin?token=928471', type: 'danger' },
    { label: 'టైపోస్క్వాటింగ్ (paypa1)', url: 'https://paypa1-security-update.xyz/login?ref=urgent', type: 'danger' },
    { label: 'URL షార్ట్‌నర్ (bit.ly)', url: 'https://bit.ly/3xSampleShortener', type: 'warn' },
    { label: 'ప్రత్యక్ష IP హోస్ట్', url: 'http://185.193.66.45/secure/login.php', type: 'danger' },
  ] : language === 'hi' ? [
    { label: 'प्रामाणिक लिंक (GitHub)', url: 'https://github.com/clyrixa/security', type: 'clean' },
    { label: 'PayPal सबडोमेन धोखा (.tk)', url: 'https://paypal.com.account-verify.tk/auth/signin?token=928471', type: 'danger' },
    { label: 'टाइपोस्कॉटिंग (paypa1)', url: 'https://paypa1-security-update.xyz/login?ref=urgent', type: 'danger' },
    { label: 'URL शॉर्टनर (bit.ly)', url: 'https://bit.ly/3xSampleShortener', type: 'warn' },
    { label: 'प्रत्यक्ष आईपी होस्ट', url: 'http://185.193.66.45/secure/login.php', type: 'danger' },
  ] : [
    { label: 'Legitimate (GitHub)', url: 'https://github.com/clyrixa/security', type: 'clean' },
    { label: 'PayPal Spoof (.tk)', url: 'https://paypal.com.account-verify.tk/auth/signin?token=928471', type: 'danger' },
    { label: 'Typosquatting (paypa1)', url: 'https://paypa1-security-update.xyz/login?ref=urgent', type: 'danger' },
    { label: 'URL Shortener (bit.ly)', url: 'https://bit.ly/3xSampleShortener', type: 'warn' },
    { label: 'Direct IP Host', url: 'http://185.193.66.45/secure/login.php', type: 'danger' },
  ];

  const sampleMessages = language === 'te' ? [
    {
      label: 'నకిలీ బ్యాంక్ KYC హెచ్చరిక',
      text: 'ప్రియమైన కస్టమర్, మీ బ్యాంక్ ఖాతా 24 గంటల్లో నిలిపివేయబడుతుంది. వెంటనే PAN అప్‌డేట్ చేసి KYC పూర్తి చేయండి: https://sbikyc-verify-identity.top/login.php'
    },
    {
      label: 'అత్యవసర కార్డు గడువు & OTP SMS',
      text: 'అత్యవసర భద్రతా హెచ్చరిక: మీ డెబిట్ కార్డు సస్పెండ్ చేయబడింది. కార్డును అన్‌ఫ్రీజ్ చేయడానికి OTP సమర్పించండి: https://update-card-details.xyz'
    },
    {
      label: 'లక్కీ డ్రా బహుమతి వల',
      text: 'అభినందనలు! మీరు రూ. 50,000 లక్కీ డ్రా గెలుచుకున్నారు. లింక్ గడువు ముగిసేలోపు రివార్డ్ పొందండి: https://bit.ly/claim-diwali-prize'
    }
  ] : language === 'hi' ? [
    {
      label: 'नकली बैंक KYC चेतावनी',
      text: 'प्रिय ग्राहक, आपका बैंक खाता 24 घंटे में ब्लॉक कर दिया जाएगा। पैन कार्ड अपडेट करके तुरंत KYC पूरा करें: https://sbikyc-verify-identity.top/login.php'
    },
    {
      label: 'तात्कालिक कार्ड और OTP अलर्ट',
      text: 'सुरक्षा चेतावनी: आपका डेबिट कार्ड निलंबित है। कार्ड सक्रिय करने के लिए तुरंत ओटीपी दर्ज करें: https://update-card-details.xyz'
    },
    {
      label: 'लकी ड्रा नकद पुरस्कार झांसा',
      text: 'बधाई! आपने 50,000 रुपये का नकद पुरस्कार जीता है। लिंक समाप्त होने से पहले दावा करें: https://bit.ly/claim-diwali-prize'
    }
  ] : [
    {
      label: 'Fake SBI / Bank KYC Alert',
      text: 'Dear Customer, your SBI YONO account will be blocked today within 24 hours. Please complete your KYC verification immediately by updating PAN details at: https://sbikyc-verify-identity.top/login.php'
    },
    {
      label: 'Urgent OTP & Card Expiry SMS',
      text: 'Urgent security alert: Your debit card ending in 4192 is suspended. Call or visit https://update-card-details.xyz to submit OTP and unfreeze card before midnight.'
    },
    {
      label: 'Lottery Prize Lure',
      text: 'Congratulations! You have won Rs 50,000 in Diwali Lucky Draw. Claim your cash reward before link expires: https://bit.ly/claim-diwali-prize'
    }
  ];

  const loadingStages = language === 'te' ? [
    'URL నిర్మాణాన్ని ప్రమాణీకరిస్తోంది & విశ్లేషిస్తోంది...',
    'యూనికోడ్, హోమోగ్రాఫ్‌లు మరియు బ్రాండ్ మోసాలను పరిశీలిస్తోంది...',
    'TLD కీర్తి మరియు క్రెడెన్షియల్ హార్వెస్టింగ్ సంకేతాలను లెక్కిస్తోంది...',
    'విశ్వసనీయ థ్రెట్ ఇంటెలిజెన్స్ మూలాలను ప్రశ్నిస్తోంది...',
    'జెమిని AI సహాయంతో భద్రతా వివరణను సంశ్లేషణ చేస్తోంది...',
  ] : language === 'hi' ? [
    'URL संरचना का मानकीकरण और विश्लेषण जारी...',
    'यूनिकोड, होमोग्राफ और ब्रांड प्रतिरूपण की जांच...',
    'TLD प्रतिष्ठा और क्रेडेंशियल चोरी के संकेतों का मूल्यांकन...',
    'थ्रेट इंटेलिजेंस स्रोतों से मिलान किया जा रहा है...',
    'जेमिनी AI द्वारा सुरक्षा विवरण और मार्गदर्शन तैयार किया जा रहा है...',
  ] : [
    'Canonicalizing and normalizing URL structure...',
    'Checking for punycode, homoglyphs, and brand impersonation...',
    'Evaluating TLD reputation and credential harvesting signals...',
    'Querying configured threat intelligence feeds...',
    'Synthesizing contextual safety explanation...',
  ];

  // URL Scanner submit
  const handleUrlScan = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || urlInput.trim();

    if (!targetUrl) {
      setErrorMsg(language === 'te' ? 'దయచేసి సరైన వెబ్ చిరునామాను నమోదు చేయండి.' : language === 'hi' ? 'कृपया एक वैध वेब पता दर्ज करें।' : 'Please enter or paste a valid web address.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setLoadingStage(0);

    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 400);

    try {
      const result = await scanUrl(targetUrl, consentExternal, language);
      clearInterval(stageInterval);
      setIsLoading(false);
      onScanComplete(result);
    } catch (err: unknown) {
      clearInterval(stageInterval);
      setIsLoading(false);
      setErrorMsg(err instanceof Error ? err.message : (language === 'te' ? 'స్కాన్ విఫలమైంది. దయచేసి URL ను తనిఖీ చేయండి.' : language === 'hi' ? 'स्कैन विफल रहा। कृपया URL प्रारूप जांचें।' : 'Scan failed. Please check the URL format and try again.'));
    }
  };

  // Message Analyzer submit
  const handleMessageAnalyze = async () => {
    if (!messageInput.trim()) return;

    setIsMessageAnalyzing(true);
    setErrorMsg('');
    setMessageResult(null);

    try {
      const res = await analyzeMessage(messageInput.trim());
      setMessageResult(res);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Message analysis encountered an error.');
    } finally {
      setIsMessageAnalyzing(false);
    }
  };

  // QR Code Image decoder
  const handleQrUpload = (file: File) => {
    setQrError('');
    setQrDecodedUrl('');
    setQrProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setQrError('Failed creating canvas context.');
          setQrProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        setQrProcessing(false);

        if (code && code.data) {
          setQrDecodedUrl(code.data);
        } else {
          setQrError('No valid QR matrix detected in uploaded image. Please ensure the QR code is clear and well-lit.');
        }
      };
      img.onerror = () => {
        setQrProcessing(false);
        setQrError('Could not process image file.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        setErrorMsg('');
      }
    } catch {
      // Permission denied or unavailable
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#F2F7FC] tracking-tight mb-2">
          {t.scannerTitle}
        </h1>
        <p className="text-sm text-[#A8BBCB]">
          {t.scannerSub}
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#0B1F30] border border-[#244155] rounded-xl mb-8">
        <button
          onClick={() => setActiveMode('url')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMode === 'url'
              ? 'bg-[#153348] text-[#28D7E5] border border-[#28D7E5]/40 shadow-sm'
              : 'text-[#A8BBCB] hover:text-[#F2F7FC]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{t.tabUrl}</span>
        </button>

        <button
          onClick={() => setActiveMode('message')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMode === 'message'
              ? 'bg-[#153348] text-[#28D7E5] border border-[#28D7E5]/40 shadow-sm'
              : 'text-[#A8BBCB] hover:text-[#F2F7FC]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.tabMessage}</span>
        </button>

        <button
          onClick={() => setActiveMode('qr')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeMode === 'qr'
              ? 'bg-[#153348] text-[#28D7E5] border border-[#28D7E5]/40 shadow-sm'
              : 'text-[#A8BBCB] hover:text-[#F2F7FC]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{t.tabQr}</span>
        </button>
      </div>

      {/* MODE 1: URL Scanner */}
      {activeMode === 'url' && (
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleUrlScan} className="space-y-4">
            <div>
              <label htmlFor="url-field" className="block text-xs font-semibold text-[#A8BBCB] mb-2 uppercase tracking-wider">
                {t.destWebAddress}
              </label>
              <div className="flex items-center gap-2 bg-[#0B1F30] border border-[#244155] rounded-lg px-3 py-2.5 focus-within:border-[#28D7E5] transition-all">
                <Search className="w-5 h-5 text-[#28D7E5] shrink-0" />
                <input
                  id="url-field"
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="https://example.com/login"
                  className="w-full bg-transparent border-none text-[#F2F7FC] text-sm focus:outline-none"
                  disabled={isLoading}
                />
                {urlInput ? (
                  <button
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="p-1 text-[#A8BBCB] hover:text-[#F2F7FC]"
                    title="Clear input"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="p-1 text-[#28D7E5] hover:text-[#35CFA6]"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* External Lookup Consent Toggle */}
            <div className="flex items-start gap-3 bg-[#0B1F30]/60 border border-[#244155]/60 rounded-lg p-3 text-xs text-[#A8BBCB]">
              <input
                id="consent-external"
                type="checkbox"
                checked={consentExternal}
                onChange={(e) => setConsentExternal(e.target.checked)}
                className="mt-0.5 rounded border-[#244155] text-[#28D7E5] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="consent-external" className="cursor-pointer">
                <span className="text-[#F2F7FC] font-medium block">
                  {t.consentCheckbox}
                </span>
                <span className="text-[11px] text-[#A8BBCB]">
                  {t.consentDesc}
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#A8BBCB]">
                {t.activeLanguageLabel} <strong className="text-[#28D7E5] uppercase">{language}</strong>
              </span>
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-sm hover:bg-[#35CFA6] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-[#28D7E5]/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.btnAnalyzing}</span>
                  </>
                ) : (
                  <>
                    <span>{t.btnExecuteScan}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading Progress State */}
          {isLoading && (
            <div className="bg-[#0B1F30] border border-[#244155] rounded-lg p-4 space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#28D7E5]">Deep Investigation in Progress</span>
                <span className="text-[#A8BBCB]">Stage {loadingStage + 1} of {loadingStages.length}</span>
              </div>
              <div className="w-full bg-[#153348] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#28D7E5] h-full transition-all duration-300"
                  style={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#F2F7FC] font-mono">
                → {loadingStages[loadingStage]}
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-[#FF6378]/10 border border-[#FF6378]/30 rounded-lg p-3 text-xs text-[#FF6378] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sample Links Shelf */}
          <div className="border-t border-[#244155] pt-4">
            <span className="text-xs text-[#A8BBCB] block mb-2 font-medium">
              {t.quickTestFixtures}
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleLinks.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setUrlInput(item.url);
                    handleUrlScan(undefined, item.url);
                  }}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
                    item.type === 'clean'
                      ? 'bg-[#35CFA6]/10 border-[#35CFA6]/30 text-[#35CFA6] hover:bg-[#35CFA6]/20'
                      : item.type === 'warn'
                      ? 'bg-[#F6C453]/10 border-[#F6C453]/30 text-[#F6C453] hover:bg-[#F6C453]/20'
                      : 'bg-[#FF6378]/10 border-[#FF6378]/30 text-[#FF6378] hover:bg-[#FF6378]/20'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Suspicious Message Analyzer */}
      {activeMode === 'message' && (
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 shadow-xl space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#A8BBCB] mb-2 uppercase tracking-wider">
              {t.msgPasteLabel}
            </label>
            <textarea
              rows={5}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={t.msgPlaceholder}
              className="w-full bg-[#0B1F30] border border-[#244155] rounded-lg p-3 text-sm text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5] transition-all resize-y"
            />
          </div>

          {/* Sample Messages */}
          <div>
            <span className="text-xs text-[#A8BBCB] block mb-2 font-medium">
              {t.sampleScenariosLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleMessages.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessageInput(s.text)}
                  className="text-xs px-2.5 py-1 rounded bg-[#0B1F30] border border-[#244155] text-[#F2F7FC] hover:border-[#28D7E5] transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleMessageAnalyze}
              disabled={isMessageAnalyzing || !messageInput.trim()}
              className="px-6 py-2.5 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-sm hover:bg-[#35CFA6] disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isMessageAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.btnAnalyzing}</span>
                </>
              ) : (
                <>
                  <span>{t.btnAnalyzeMsgLinks}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Message Results Breakdown */}
          {messageResult && (
            <div className="border-t border-[#244155] pt-6 space-y-6 animate-fadeIn">
              {/* Context Summary Banner */}
              <div className={`p-4 rounded-lg border ${
                messageResult.urgencyLevel === 'CRITICAL' ? 'bg-[#FF6378]/10 border-[#FF6378]' :
                messageResult.urgencyLevel === 'HIGH' ? 'bg-[#FF9866]/10 border-[#FF9866]' :
                'bg-[#F6C453]/10 border-[#F6C453]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F2F7FC] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Psychological Urgency Tier: {messageResult.urgencyLevel}
                  </span>
                  <span className="text-xs text-[#A8BBCB]">
                    {messageResult.extractedUrls.length} Link(s) Extracted
                  </span>
                </div>
                <p className="text-xs text-[#F2F7FC] leading-relaxed">
                  {messageResult.aiContextSummary}
                </p>
              </div>

              {/* Detected Warning Indicators */}
              {messageResult.detectedIndicators.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-[#A8BBCB] mb-3">
                    Highlighted Psychological Coercion Triggers:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {messageResult.detectedIndicators.map((ind, i) => (
                      <div key={i} className="bg-[#0B1F30] border border-[#244155] rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#FF6378] font-bold uppercase tracking-wider text-[10px]">
                            {ind.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-[#A8BBCB] bg-[#10283A] px-1.5 py-0.5 rounded">
                            {ind.severity}
                          </span>
                        </div>
                        <p className="text-[#F2F7FC] font-mono text-[11px] mb-1 bg-[#10283A] p-1 rounded">
                          "{ind.phrase}"
                        </p>
                        <p className="text-[11px] text-[#A8BBCB]">
                          {ind.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted URLs List */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#A8BBCB] mb-3">
                  Extracted Destination Links:
                </h4>
                {messageResult.scannedUrls.length > 0 ? (
                  <div className="space-y-3">
                    {messageResult.scannedUrls.map((scanned, idx) => (
                      <div key={idx} className="bg-[#0B1F30] border border-[#244155] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              scanned.status === 'LOW_RISK' ? 'bg-[#35CFA6]/20 text-[#35CFA6]' :
                              scanned.status === 'MODERATE_RISK' ? 'bg-[#F6C453]/20 text-[#F6C453]' :
                              'bg-[#FF6378]/20 text-[#FF6378]'
                            }`}>
                              {scanned.status.replace('_', ' ')} ({scanned.riskScore}/100)
                            </span>
                            <span className="text-xs text-[#A8BBCB] font-mono">{scanned.hostname}</span>
                          </div>
                          <p className="text-xs text-[#F2F7FC] truncate max-w-md">{scanned.url}</p>
                        </div>
                        <button
                          onClick={() => onScanComplete(scanned)}
                          className="px-4 py-1.5 rounded bg-[#153348] border border-[#28D7E5] text-[#28D7E5] text-xs font-semibold hover:bg-[#28D7E5] hover:text-[#071521] transition-all cursor-pointer whitespace-nowrap"
                        >
                          View Full Report →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#A8BBCB] italic">No clickable hyperlinks detected in this message.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: QR Code Decoder (Quishing) */}
      {activeMode === 'qr' && (
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 shadow-xl space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#F2F7FC] mb-1">
              {t.qrDecoderTitle}
            </h3>
            <p className="text-xs text-[#A8BBCB] max-w-md mx-auto">
              {t.qrDecoderDesc}
            </p>
          </div>

          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#244155] hover:border-[#28D7E5] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#0B1F30]/50"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleQrUpload(file);
              }}
            />
            <div className="w-12 h-12 rounded-full bg-[#153348] text-[#28D7E5] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#F2F7FC] mb-1">
              {t.qrUploadPrompt}
            </p>
            <p className="text-xs text-[#A8BBCB]">
              {t.qrUploadSub}
            </p>
          </div>

          {qrProcessing && (
            <div className="flex items-center justify-center gap-2 text-xs text-[#28D7E5]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.btnAnalyzing}</span>
            </div>
          )}

          {qrError && (
            <div className="bg-[#FF6378]/10 border border-[#FF6378]/30 rounded-lg p-3 text-xs text-[#FF6378] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{qrError}</span>
            </div>
          )}

          {qrDecodedUrl && (
            <div className="bg-[#0B1F30] border border-[#28D7E5] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#35CFA6] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.qrDecodedSuccess}
                </span>
                <span className="text-[11px] text-[#A8BBCB]">Zero Auto-Navigation</span>
              </div>
              <div className="bg-[#10283A] p-2.5 rounded border border-[#244155]">
                <code className="text-xs text-[#28D7E5] font-mono break-all">{qrDecodedUrl}</code>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setUrlInput(qrDecodedUrl);
                    setActiveMode('url');
                    handleUrlScan(undefined, qrDecodedUrl);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t.btnSubmitToSafety}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
