import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  QrCode, 
  MessageSquare, 
  Chrome, 
  Zap, 
  Lock, 
  Sparkles
} from 'lucide-react';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface LandingPageProps {
  onAnalyzeUrl: (url: string) => void;
  onNavigate: (tab: string) => void;
  onSelectDemo: (id: string) => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeUrl,
  onNavigate,
  onSelectDemo,
  language,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const t = DICTIONARY[language] || DICTIONARY.en;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg(language === 'te' ? 'దయచేసి సరైన వెబ్ లింక్‌ను నమోదు చేయండి.' : language === 'hi' ? 'कृपया एक वैध वेब लिंक दर्ज करें।' : 'Please enter or paste a valid web link.');
      return;
    }
    setErrorMsg('');
    onAnalyzeUrl(inputUrl.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        setErrorMsg('');
      }
    } catch {
      // Clipboard permission denied or unavailable
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#28D7E5]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10283A] border border-[#244155] text-xs text-[#28D7E5] mb-6 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#35CFA6]" />
            <span>{t.trackBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F2F7FC] tracking-tight leading-tight mb-6">
            {t.heroHeadline1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28D7E5] via-[#35CFA6] to-[#8B7CFF]">
              {t.heroHeadline2}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#A8BBCB] max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.heroSubtext}
          </p>

          {/* Main Input Form */}
          <form 
            onSubmit={handleQuickSubmit}
            className="max-w-2xl mx-auto bg-[#10283A] border border-[#244155] rounded-xl p-2 shadow-2xl focus-within:border-[#28D7E5] transition-all mb-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 flex-1 w-full px-3 py-2">
                <Search className="w-5 h-5 text-[#28D7E5] shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={t.urlPlaceholder}
                  className="w-full bg-transparent border-none text-[#F2F7FC] placeholder-[#A8BBCB]/60 text-sm focus:outline-none"
                />
                {inputUrl ? (
                  <button
                    type="button"
                    onClick={() => setInputUrl('')}
                    className="text-xs text-[#A8BBCB] hover:text-[#F2F7FC] px-1"
                  >
                    {t.btnClear}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="text-xs text-[#28D7E5] hover:underline px-1 shrink-0"
                  >
                    {t.btnPaste}
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-sm hover:bg-[#35CFA6] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#28D7E5]/20 shrink-0 cursor-pointer"
              >
                <span>{t.btnAnalyzeLink}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {errorMsg && (
            <p className="text-xs text-[#FF6378] font-medium mb-4 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}

          {/* Quick Alternative Modes */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#A8BBCB] mb-6">
            <span>{t.orAnalyzeWith}</span>
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0B1F30] border border-[#244155] text-[#F2F7FC] hover:border-[#28D7E5] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#28D7E5]" />
              <span>{t.btnSuspiciousMsg}</span>
            </button>
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0B1F30] border border-[#244155] text-[#F2F7FC] hover:border-[#28D7E5] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#35CFA6]" />
              <span>{t.btnQrCode}</span>
            </button>
          </div>

          {/* Privacy Notice Banner */}
          <div className="max-w-xl mx-auto text-[11px] text-[#A8BBCB]/80 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#35CFA6]" />
            <span>
              {t.privacyNotice}
            </span>
          </div>
        </div>
      </section>

      {/* 4-Stage Architecture Pipeline */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#28D7E5] tracking-wider uppercase">
            {t.stagesHeaderTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F7FC] mt-2">
            {t.stagesHeaderSub}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stage 1 */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 relative group hover:border-[#28D7E5] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#153348] border border-[#244155] flex items-center justify-center text-[#28D7E5] mb-4 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-[#F2F7FC] mb-2 flex items-center gap-2">
              <span>{t.stage1Title}</span>
            </h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed">
              {t.stage1Desc}
            </p>
          </div>

          {/* Stage 2 */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 relative group hover:border-[#35CFA6] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#153348] border border-[#244155] flex items-center justify-center text-[#35CFA6] mb-4 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-[#F2F7FC] mb-2">
              {t.stage2Title}
            </h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed">
              {t.stage2Desc}
            </p>
          </div>

          {/* Stage 3 */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 relative group hover:border-[#8B7CFF] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#153348] border border-[#244155] flex items-center justify-center text-[#8B7CFF] mb-4 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-[#F2F7FC] mb-2">
              {t.stage3Title}
            </h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed">
              {t.stage3Desc}
            </p>
          </div>

          {/* Stage 4 */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-6 relative group hover:border-[#FF9866] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#153348] border border-[#244155] flex items-center justify-center text-[#FF9866] mb-4 font-mono font-bold">
              04
            </div>
            <h3 className="text-base font-bold text-[#F2F7FC] mb-2">
              {t.stage4Title}
            </h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed">
              {t.stage4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars: Analyze, Understand, Protect */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-[#10283A] text-[#28D7E5] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F2F7FC] mb-2">{t.pillar1Title}</h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed mb-4">
              {t.pillar1Desc}
            </p>
            <ul className="text-xs text-[#F2F7FC] space-y-1.5 border-t border-[#244155] pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#35CFA6]" />
                {t.pillar1P1}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#35CFA6]" />
                {t.pillar1P2}
              </li>
            </ul>
          </div>

          <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-[#10283A] text-[#35CFA6] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F2F7FC] mb-2">{t.pillar2Title}</h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed mb-4">
              {t.pillar2Desc}
            </p>
            <ul className="text-xs text-[#F2F7FC] space-y-1.5 border-t border-[#244155] pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#35CFA6]" />
                {t.pillar2P1}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#35CFA6]" />
                {t.pillar2P2}
              </li>
            </ul>
          </div>

          <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-[#10283A] text-[#8B7CFF] flex items-center justify-center mb-4">
              <Chrome className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F2F7FC] mb-2">{t.pillar3Title}</h3>
            <p className="text-xs text-[#A8BBCB] leading-relaxed mb-4">
              {t.pillar3Desc}
            </p>
            <ul className="text-xs text-[#F2F7FC] space-y-1.5 border-t border-[#244155] pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#35CFA6]" />
                {t.pillar3P1}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#35CFA6]" />
                {t.pillar3P2}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Browser Extension CTA Card */}
      <section className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-gradient-to-r from-[#10283A] via-[#153348] to-[#10283A] border border-[#28D7E5]/40 rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#28D7E5]/20 text-[#28D7E5] text-xs font-semibold mb-3">
                <Chrome className="w-3.5 h-3.5" />
                <span>{t.extensionCtaBadge}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F2F7FC] mb-2">
                {t.extensionCtaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#A8BBCB] max-w-lg leading-relaxed">
                {t.extensionCtaDesc}
              </p>
            </div>
            <button
              onClick={() => onNavigate('protection')}
              className="px-6 py-3 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-xs sm:text-sm hover:bg-[#35CFA6] transition-all whitespace-nowrap shadow-lg shadow-[#28D7E5]/20 cursor-pointer"
            >
              {t.extensionCtaBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Cyber Advisory & Appointment Booking CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-[#0B1F30] border border-[#244155] hover:border-[#28D7E5]/50 transition-colors rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10283A] border border-[#35CFA6]/40 flex items-center justify-center text-[#35CFA6] shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#35CFA6] uppercase tracking-wider">
                {language === 'te' ? 'సైబర్ సలహా డెస్క్' : language === 'hi' ? 'साइबर सलाह डेस्क' : 'Incident Advisory Desk'}
              </span>
              <h3 className="text-xl font-bold text-[#F2F7FC] mt-0.5 mb-1">
                {t.bookingTitle}
              </h3>
              <p className="text-xs text-[#A8BBCB] max-w-lg leading-relaxed">
                {t.bookingSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="px-5 py-2.5 rounded-lg bg-[#153348] border border-[#28D7E5]/50 text-[#28D7E5] hover:bg-[#28D7E5] hover:text-[#071521] font-bold text-xs transition-all whitespace-nowrap cursor-pointer shadow-md"
          >
            {t.bookConsultationBtn}
          </button>
        </div>
      </section>
    </div>
  );
};

