import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Globe, User as UserIcon, LogOut, Calendar, Lock, Sliders } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, logoutUser, isAdminEmail } from '../services/firebase.js';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onSelectDemoScenario: (id: string) => void;
  hasScanResult: boolean;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onSelectDemoScenario,
  hasScanResult,
  onOpenAuthModal,
}) => {
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  const t = DICTIONARY[language] || DICTIONARY.en;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const isUserAdmin = Boolean(currentUser && isAdminEmail(currentUser.email));

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'scanner', label: t.navScanner },
    { id: 'dashboard', label: t.navDashboard, disabled: !hasScanResult },
    { id: 'protection', label: t.navProtection },
    { id: 'learn', label: t.navLearn },
    { id: 'recovery', label: t.navRecovery },
    { id: 'history', label: t.navHistory },
    { id: 'appointments', label: t.navAppointments },
    ...(isUserAdmin ? [{ id: 'admin', label: t.navAdmin }] : []),
  ];

  const demoScenarios = [
    { id: 'legitimate', label: language === 'te' ? 'అధికారిక GitHub లింక్' : language === 'hi' ? 'प्रामाणिक GitHub लिंक' : 'Authentic GitHub Link', tag: t.tagClean },
    { id: 'subdomain_deception', label: language === 'te' ? 'PayPal సబ్‌డొమైన్ మోసం (.tk)' : language === 'hi' ? 'PayPal सबडोमेन धोखा (.tk)' : 'PayPal Subdomain Deception (.tk)', tag: t.tagCritical },
    { id: 'typosquatting', label: language === 'te' ? 'PayPal టైపోస్క్వాటింగ్ (paypa1 on .xyz)' : language === 'hi' ? 'PayPal टाइपोस्कॉटिंग (paypa1 on .xyz)' : 'PayPal Typosquatting (paypa1 on .xyz)', tag: t.tagHigh },
    { id: 'shortener', label: language === 'te' ? 'Bitly దాచిన రీడైరెక్షన్' : language === 'hi' ? 'Bitly छुपा पुनर्निर्देशन' : 'Bitly Concealed Redirection', tag: t.tagModerate },
    { id: 'inconclusive', label: language === 'te' ? 'ధృవీకరించబడని అనిశ్చిత డొమైన్' : language === 'hi' ? 'असत्यापित अनिर्णायक डोमेन' : 'Unverified / Inconclusive Domain', tag: t.tagInconclusive },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071521]/95 backdrop-blur-md border-b border-[#244155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0B1F30] border border-[#28D7E5]/50 flex items-center justify-center text-[#28D7E5] group-hover:border-[#28D7E5] transition-all">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" stroke="#35CFA6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-wider text-[#F2F7FC]">CLYRIXA</span>
              <span className="text-[10px] text-[#28D7E5] border border-[#28D7E5]/30 rounded px-1.5 py-0.2 font-mono">v1.0</span>
            </div>
            <p className="text-[11px] text-[#A8BBCB] tracking-tight">{t.brandTagline}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled) setActiveTab(item.id);
              }}
              disabled={item.disabled}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#153348] text-[#28D7E5] border border-[#28D7E5]/40 shadow-sm'
                  : item.disabled
                  ? 'text-[#A8BBCB]/40 cursor-not-allowed'
                  : 'text-[#A8BBCB] hover:text-[#F2F7FC] hover:bg-[#0B1F30]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Demo Scenarios Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-[#10283A] border border-[#244155] text-[#F2F7FC] hover:border-[#28D7E5] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#28D7E5]" />
              <span className="hidden sm:inline">{t.demoScenarios}</span>
            </button>

            {showDemoMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-[#0B1F30] border border-[#244155] rounded-lg shadow-2xl py-2 z-50"
                onMouseLeave={() => setShowDemoMenu(false)}
              >
                <div className="px-3 py-1 border-b border-[#244155] text-[11px] text-[#A8BBCB] font-medium">
                  {t.loadDemoHeader}
                </div>
                {demoScenarios.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      onSelectDemoScenario(demo.id);
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F2F7FC] hover:bg-[#10283A] flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate pr-2">{demo.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      demo.tag === 'Clean' ? 'bg-[#35CFA6]/20 text-[#35CFA6]' :
                      demo.tag === 'Critical' ? 'bg-[#FF6378]/20 text-[#FF6378]' :
                      demo.tag === 'High' ? 'bg-[#FF9866]/20 text-[#FF9866]' :
                      'bg-[#F6C453]/20 text-[#F6C453]'
                    }`}>
                      {demo.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#10283A] border border-[#244155] rounded-lg p-1 text-xs shadow-inner" role="group" aria-label="Language selector">
            <div className="pl-1.5 pr-0.5 text-[#28D7E5] hidden sm:flex items-center" title="Select language">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-[#153348] text-[#28D7E5] font-bold shadow-sm border border-[#28D7E5]/40' 
                  : 'text-[#A8BBCB] hover:text-[#F2F7FC] hover:bg-[#0B1F30]'
              }`}
              title="English"
              aria-pressed={language === 'en'}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'te' 
                  ? 'bg-[#153348] text-[#28D7E5] font-bold shadow-sm border border-[#28D7E5]/40' 
                  : 'text-[#A8BBCB] hover:text-[#F2F7FC] hover:bg-[#0B1F30]'
              }`}
              title="తెలుగు (Telugu)"
              aria-pressed={language === 'te'}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                language === 'hi' 
                  ? 'bg-[#153348] text-[#28D7E5] font-bold shadow-sm border border-[#28D7E5]/40' 
                  : 'text-[#A8BBCB] hover:text-[#F2F7FC] hover:bg-[#0B1F30]'
              }`}
              title="हिन्दी (Hindi)"
              aria-pressed={language === 'hi'}
            >
              हिन्दी
            </button>
          </div>

          {/* User Auth Control */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#10283A] border border-[#244155] hover:border-[#28D7E5] transition-colors cursor-pointer text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#153348] border border-[#28D7E5] flex items-center justify-center text-[#28D7E5] font-bold text-[11px]">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden md:inline font-medium text-[#F2F7FC] max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-[#0B1F30] border border-[#244155] rounded-lg shadow-2xl py-2 z-50"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-[#244155]">
                    <p className="text-xs font-semibold text-[#F2F7FC] truncate">
                      {currentUser.displayName || 'Security Lead'}
                    </p>
                    <p className="text-[11px] text-[#A8BBCB] font-mono truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('appointments');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F2F7FC] hover:bg-[#10283A] flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#28D7E5]" />
                    <span>{t.myBookings}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F2F7FC] hover:bg-[#10283A] flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#28D7E5]" />
                    <span>{language === 'te' ? 'సెట్టింగ్‌లు & ప్రాధాన్యతలు' : language === 'hi' ? 'सेटिंग्स और प्राथमिकताएं' : 'Settings & Preferences'}</span>
                  </button>
                  {isUserAdmin && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#28D7E5] hover:bg-[#10283A] flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#28D7E5]" />
                      <span>{t.navAdmin}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#FF6378] hover:bg-[#10283A] flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.btnSignOut}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.btnSignIn}</span>
            </button>
          )}

          {/* Mobile Menu trigger */}
          <div className="xl:hidden">
            <button
              onClick={() => setActiveTab(activeTab === 'appointments' ? 'scanner' : 'appointments')}
              className="p-2 rounded bg-[#10283A] border border-[#244155] text-[#28D7E5] cursor-pointer"
              title="Toggle mobile view"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="xl:hidden flex overflow-x-auto gap-2 px-4 py-2 bg-[#0B1F30] border-t border-[#244155]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (!item.disabled) setActiveTab(item.id);
            }}
            disabled={item.disabled}
            className={`whitespace-nowrap px-3 py-1 text-xs rounded transition-all cursor-pointer ${
              activeTab === item.id
                ? 'bg-[#153348] text-[#28D7E5] font-bold border border-[#28D7E5]/30'
                : item.disabled
                ? 'text-[#A8BBCB]/40 cursor-not-allowed'
                : 'text-[#A8BBCB] hover:text-[#F2F7FC]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
