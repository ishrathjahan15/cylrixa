/**
 * Clyrixa — Context-Aware Phishing Detection, Real-Time Link Protection & Cyber Safety Platform
 * Track 02 — Cyber Security: Phishing & Malicious Link Detection
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { LandingPage } from './pages/LandingPage.js';
import { ScannerPage } from './pages/ScannerPage.js';
import { ResultsDashboard } from './pages/ResultsDashboard.js';
import { LinkProtectionPage } from './pages/LinkProtectionPage.js';
import { LearningCentre } from './pages/LearningCentre.js';
import { RecoveryAssistant } from './pages/RecoveryAssistant.js';
import { HistoryAndSettingsPage } from './pages/HistoryAndSettingsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage.js';
import { AdminPortalPage } from './pages/AdminPortalPage.js';
import { AuthModal } from './components/AuthModal.js';
import { ScanResult } from '../shared/types.js';
import { scanUrl, saveScanToHistory } from './services/api.js';
import { Language } from './utils/i18n.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isAdminEmail } from './services/firebase.js';
import { getSettings, applyThemeAndAccessibility } from './services/settings.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('clyrixa_lang') as Language;
      if (saved === 'en' || saved === 'te' || saved === 'hi') return saved;
    } catch {}
    return 'en';
  });
  const [currentScanResult, setCurrentScanResult] = useState<ScanResult | null>(null);

  // Initialize theme & typography scale on mount
  useEffect(() => {
    applyThemeAndAccessibility(getSettings());
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdmin(Boolean(user && isAdminEmail(user.email)));
    });
    return () => unsub();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('clyrixa_lang', lang);
    } catch {}

    // If an active scan is present, re-evaluate or update explanation in the new language
    if (currentScanResult) {
      scanUrl(
        currentScanResult.normalizedUrl || currentScanResult.url, 
        false, 
        lang, 
        currentScanResult.demoScenarioId
      ).then(updated => {
        setCurrentScanResult(updated);
      }).catch(err => {
        console.error('Error refreshing scan in new language:', err);
      });
    }
  };

  // Handle URL inspect parameter (e.g. from extension: ?inspect=https://...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inspectTarget = urlParams.get('inspect');
    if (inspectTarget) {
      handleDirectScan(inspectTarget);
    }
  }, []);

  const handleDirectScan = async (url: string) => {
    try {
      const result = await scanUrl(url, false, language);
      handleScanComplete(result);
    } catch (err) {
      console.error('Failed direct scan:', err);
      setActiveTab('scanner');
    }
  };

  const handleScanComplete = (result: ScanResult) => {
    setCurrentScanResult(result);
    saveScanToHistory(result);
    setActiveTab('dashboard');
  };

  const handleSelectDemoScenario = async (scenarioId: string) => {
    try {
      const result = await scanUrl('', false, language, scenarioId);
      handleScanComplete(result);
    } catch (err) {
      console.error('Failed loading demo scenario:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#071521] text-[#F2F7FC] flex flex-col font-sans selection:bg-[#28D7E5]/30 selection:text-[#28D7E5]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={handleLanguageChange}
        onSelectDemoScenario={handleSelectDemoScenario}
        hasScanResult={Boolean(currentScanResult)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onAnalyzeUrl={(url) => {
              handleDirectScan(url);
            }}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectDemo={handleSelectDemoScenario}
            language={language}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerPage
            onScanComplete={handleScanComplete}
            language={language}
          />
        )}

        {activeTab === 'dashboard' && currentScanResult && (
          <ResultsDashboard
            scanResult={currentScanResult}
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {activeTab === 'protection' && (
          <LinkProtectionPage 
            language={language} 
          />
        )}

        {activeTab === 'learn' && (
          <LearningCentre 
            language={language} 
          />
        )}

        {activeTab === 'recovery' && (
          <RecoveryAssistant 
            language={language} 
          />
        )}

        {activeTab === 'history' && (
          <HistoryAndSettingsPage
            onSelectReport={(scan) => {
              setCurrentScanResult(scan);
              setActiveTab('dashboard');
            }}
            language={language}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            language={language}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentBookingPage
            language={language}
            onNavigate={(tab) => setActiveTab(tab)}
            onAnalyzeUrl={(url) => handleDirectScan(url)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortalPage
            language={language}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={(tab) => setActiveTab(tab)} 
        language={language}
        isAdmin={isAdmin}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onSuccess={() => {
          if (auth.currentUser && isAdminEmail(auth.currentUser.email)) {
            setActiveTab('admin');
          }
        }}
      />
    </div>
  );
}
