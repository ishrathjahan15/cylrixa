export type Language = 'en' | 'te' | 'hi';

export interface Translations {
  // Navbar
  brandTagline: string;
  navHome: string;
  navScanner: string;
  navDashboard: string;
  navProtection: string;
  navLearn: string;
  navRecovery: string;
  navHistory: string;
  navAppointments: string;
  navAdmin: string;
  btnSignIn: string;
  btnSignUp: string;
  btnSignOut: string;
  bookingTitle: string;
  bookingSubtitle: string;
  bookConsultationBtn: string;
  myBookings: string;
  demoScenarios: string;
  loadDemoHeader: string;
  tagClean: string;
  tagCritical: string;
  tagHigh: string;
  tagModerate: string;
  tagInconclusive: string;

  // Hero / Landing
  trackBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtext: string;
  urlPlaceholder: string;
  btnAnalyzeLink: string;
  btnPaste: string;
  btnClear: string;
  orAnalyzeWith: string;
  btnSuspiciousMsg: string;
  btnQrCode: string;
  privacyNotice: string;
  stagesHeaderTitle: string;
  stagesHeaderSub: string;

  // 4 Stages
  stage1Title: string;
  stage1Desc: string;
  stage2Title: string;
  stage2Desc: string;
  stage3Title: string;
  stage3Desc: string;
  stage4Title: string;
  stage4Desc: string;

  // Pillars
  pillar1Title: string;
  pillar1Desc: string;
  pillar1P1: string;
  pillar1P2: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar2P1: string;
  pillar2P2: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar3P1: string;
  pillar3P2: string;

  // Extension CTA
  extensionCtaBadge: string;
  extensionCtaTitle: string;
  extensionCtaDesc: string;
  extensionCtaBtn: string;

  // Scanner Page
  scannerTitle: string;
  scannerSub: string;
  tabUrl: string;
  tabMessage: string;
  tabQr: string;
  destWebAddress: string;
  consentCheckbox: string;
  consentDesc: string;
  activeLanguageLabel: string;
  btnExecuteScan: string;
  btnAnalyzing: string;
  quickTestFixtures: string;
  msgPasteLabel: string;
  msgPlaceholder: string;
  sampleScenariosLabel: string;
  btnAnalyzeMsgLinks: string;
  qrDecoderTitle: string;
  qrDecoderDesc: string;
  qrUploadPrompt: string;
  qrUploadSub: string;
  qrDecodedSuccess: string;
  btnSubmitToSafety: string;

  // Dashboard Page
  riskScoreTitle: string;
  targetDestination: string;
  assessedHostname: string;
  navRecommendation: string;
  cleanRec: string;
  dangerRec: string;
  brandImpersonationTitle: string;
  claimedBrand: string;
  actualHostname: string;
  verifiedPortal: string;
  unrelatedWarning: string;
  guidanceTitle: string;
  consequencesTitle: string;
  actionsTitle: string;
  journeyTitle: string;
  findingsTitle: string;
  providersTitle: string;
  btnScanAnother: string;
  btnExportJson: string;
  btnAlreadyClicked: string;
  btnProceedWebsite: string;
  navBlockedPolicy: string;

  // Link Protection Page
  protectionTitle: string;
  protectionSub: string;
  simulatorHeader: string;
  simulatorSub: string;
  btnResetDemo: string;
  btnSimulateClick: string;
  loadUnpackedTitle: string;
  loadUnpackedSub: string;

  // Learn Page
  learnTitle: string;
  learnSub: string;
  quizTitle: string;
  quizSub: string;
  btnSubmitQuiz: string;
  btnRetryQuiz: string;

  // Recovery Page
  recoveryTitle: string;
  recoverySub: string;
  containmentChecklistTitle: string;
  emergencyHelplinesTitle: string;

  // History Page
  historyTitle: string;
  historySub: string;
  filterAll: string;
  filterThreats: string;
  filterClean: string;
  btnClearHistory: string;
  privacySettingsTitle: string;
  engineStatusTitle: string;

  // Footer
  footerMission: string;
  footerCapabilities: string;
  footerModules: string;
  footerTrackNotice: string;
  footerTrackText: string;
  footerCopyright: string;
  footerSsrf: string;
  footerPrivacy: string;

  // Extended Quiz & Learn
  academyBadge: string;
  module1Title: string;
  module1Desc: string;
  module2Title: string;
  module2Desc: string;
  module3Title: string;
  module3Desc: string;
  quizScoreText: string;

  // Extended Recovery
  recoveryBadge: string;
  scenario1Title: string;
  scenario1Summary: string;
  scenario2Title: string;
  scenario2Summary: string;
  scenario3Title: string;
  scenario3Summary: string;
  scenario4Title: string;
  scenario4Summary: string;
  scenario5Title: string;
  scenario5Summary: string;
  helplineDesc: string;

  // Extended History & Settings
  historySubtitle: string;
  recordCount: string;
  colTargetUrl: string;
  colRiskScore: string;
  colAssessedHost: string;
  colTime: string;
  colAction: string;
  btnViewReport: string;
  noHistory: string;
  privacySetting1Title: string;
  privacySetting1Desc: string;
  privacySetting2Title: string;
  privacySetting2Desc: string;
  connectorSafeBrowsing: string;
  connectorVirusTotal: string;
  connectorGemini: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    // Navbar
    brandTagline: 'Click Before You Trust',
    navHome: 'Home',
    navScanner: 'Scanner',
    navDashboard: 'Investigation Report',
    navProtection: 'Link Protection',
    navLearn: 'Learn',
    navRecovery: 'Recovery Assistant',
    navHistory: 'History & Settings',
    navAppointments: 'Consultations',
    navAdmin: 'Admin Portal',
    btnSignIn: 'Sign In',
    btnSignUp: 'Sign Up',
    btnSignOut: 'Sign Out',
    bookingTitle: 'Cyber Security Expert Consultation',
    bookingSubtitle: 'Schedule a 1-on-1 session with our incident response team to audit suspicious links, analyze phishing campaigns, or review corporate defenses.',
    bookConsultationBtn: 'Book Security Consultation',
    myBookings: 'My Scheduled Consultations',
    demoScenarios: 'Demo Scenarios',
    loadDemoHeader: 'Load Pre-Configured Test Case',
    tagClean: 'Clean',
    tagCritical: 'Critical',
    tagHigh: 'High',
    tagModerate: 'Moderate',
    tagInconclusive: 'Inconclusive',

    // Hero / Landing
    trackBadge: 'Track 02: Phishing & Malicious Link Detection',
    heroHeadline1: "Don't Just Click.",
    heroHeadline2: "Know What's Behind the Link.",
    heroSubtext: 'Every link has a story. Clyrixa inspects structural deception, brand typosquatting, and threat intelligence before navigation—protecting you from credential theft and phishing traps.',
    urlPlaceholder: 'Paste any link to analyze (e.g. https://...)',
    btnAnalyzeLink: 'Analyze Link',
    btnPaste: 'Paste',
    btnClear: 'Clear',
    orAnalyzeWith: 'Or analyze with:',
    btnSuspiciousMsg: 'Suspicious Message Text',
    btnQrCode: 'QR Code (Quishing)',
    privacyNotice: 'Zero telemetry of passwords or tokens. Local analysis runs instantly without logging private session parameters.',
    stagesHeaderTitle: 'Four-Stage Protection Lifecycle',
    stagesHeaderSub: 'How Clyrixa Defends Your Navigation',

    // 4 Stages
    stage1Title: 'DETECT',
    stage1Desc: 'Scrutinizes hostname depth, punycode Cyrillic homoglyphs, brand spoofing, and URL shortening tricks.',
    stage2Title: 'EXPLAIN',
    stage2Desc: 'Synthesizes plain-language explanations in English, Telugu, or Hindi using grounded server-side Gemini intelligence.',
    stage3Title: 'PROTECT',
    stage3Desc: 'Manifest V3 extension halts navigation before the browser visits high-risk destinations, allowing low-risk clicks through.',
    stage4Title: 'RECOVER',
    stage4Desc: 'If credentials or OTPs were already submitted, provides an emergency step-by-step triage checklist and cyber helpline links.',

    // Pillars
    pillar1Title: 'Multi-Engine Intelligence',
    pillar1Desc: 'Combines deterministic local heuristics with optional connectors to Google Safe Browsing, VirusTotal, and urlscan.io sandbox.',
    pillar1P1: 'Truth in reporting: Never claims unconfigured tools ran',
    pillar1P2: 'SSRF-isolated destination inspection',
    pillar2Title: 'Explainable AI Scoring',
    pillar2Desc: 'Scoring is derived strictly from real evidence. Gemini turns technical telemetry into clear, jargon-free consequences.',
    pillar2P1: 'Multilingual: English, Telugu, Hindi',
    pillar2P2: 'Deterministic fallback when offline',
    pillar3Title: 'Real-Time Extension',
    pillar3Desc: 'Click-interception content script halts dangerous navigations before you land on fake banking or phishing portals.',
    pillar3P1: 'Zero-lag automatic pass for clean links',
    pillar3P2: 'Interstitials for high & critical risk',

    // Extension CTA
    extensionCtaBadge: 'Manifest V3 Ready',
    extensionCtaTitle: 'Get Pre-Navigation Protection on Chrome & Edge',
    extensionCtaDesc: 'Install our lightweight browser extension to evaluate links right as you click them across supported web pages. Try our in-browser extension simulator or load the unpacked folder.',
    extensionCtaBtn: 'Explore Extension Hub',

    // Scanner Page
    scannerTitle: 'Security Scanner',
    scannerSub: 'Choose an inspection mode below to reveal threat signals, deceptive patterns, and brand impersonation.',
    tabUrl: 'Analyze URL',
    tabMessage: 'Suspicious Message',
    tabQr: 'QR Code (Quishing)',
    destWebAddress: 'Destination Web Address',
    consentCheckbox: 'Permit live external threat intelligence queries (Google Safe Browsing & VirusTotal)',
    consentDesc: 'When disabled, Clyrixa runs purely local explainable heuristics without sending query targets to external vendor services.',
    activeLanguageLabel: 'Active language:',
    btnExecuteScan: 'Execute Deep Scan',
    btnAnalyzing: 'Analyzing...',
    quickTestFixtures: 'Quick Test Fixtures (Safe Demonstrations):',
    msgPasteLabel: 'Paste SMS, WhatsApp, or Email Text',
    msgPlaceholder: 'Paste suspicious notification, SMS, or email here. Clyrixa will detect urgency coercion patterns, extract embedded URLs, and evaluate destination risk...',
    sampleScenariosLabel: 'Try a Realistic Social-Engineering Scenario:',
    btnAnalyzeMsgLinks: 'Analyze Message & Links',
    qrDecoderTitle: 'QR Code Security Decoder',
    qrDecoderDesc: 'Scammers often place QR codes in physical letters, parking meters, or phishing emails ("Quishing") to hide URLs from email scanners. Upload an image to decode and inspect it safely.',
    qrUploadPrompt: 'Click to upload QR code image',
    qrUploadSub: 'PNG, JPG, or WEBP supported. Decoded entirely inside your browser.',
    qrDecodedSuccess: 'QR Code Successfully Decoded',
    btnSubmitToSafety: 'Submit to Safety Engine',

    // Dashboard Page
    riskScoreTitle: 'Explainable Risk Score',
    targetDestination: 'Target Destination',
    assessedHostname: 'Assessed Hostname:',
    navRecommendation: 'Navigation Recommendation:',
    cleanRec: '✓ No Known Threat Detected',
    dangerRec: '✕ Navigation Strongly Discouraged',
    brandImpersonationTitle: 'Deceptive Brand Impersonation Detected',
    claimedBrand: 'Claimed Legitimate Brand:',
    actualHostname: 'True Registrable Hostname:',
    verifiedPortal: 'Verified Portal:',
    unrelatedWarning: '⚠️ Completely unrelated to',
    guidanceTitle: 'Grounded Security Analysis & Guidance',
    consequencesTitle: 'Potential Consequences If You Visit:',
    actionsTitle: 'Recommended Safety Actions:',
    journeyTitle: 'Observed Navigation Journey (Redirection Chain)',
    findingsTitle: 'Specific Evaluated Findings',
    providersTitle: 'Threat Intelligence Provider Connectivity',
    btnScanAnother: '← Scan Another Link',
    btnExportJson: 'Export Sanitized JSON Report',
    btnAlreadyClicked: 'Already Clicked? Open Recovery Guide',
    btnProceedWebsite: 'Proceed to Website',
    navBlockedPolicy: 'Direct navigation disabled by security policy.',

    // Link Protection Page
    protectionTitle: 'Pre-Navigation Link Protection',
    protectionSub: 'The Clyrixa extension captures link clicks on ordinary webpages, inspects destinations before the browser loads them, and halts navigation if phishing or deceptive attributes are detected.',
    simulatorHeader: 'Browser Extension Click-Interception Simulator',
    simulatorSub: 'Click any sample hyperlink below to test how the Clyrixa extension intercepts navigation in real time:',
    btnResetDemo: 'Reset Demo',
    btnSimulateClick: 'Simulate Click',
    loadUnpackedTitle: 'How to Load Clyrixa in Chrome & Microsoft Edge',
    loadUnpackedSub: 'The project repository includes a complete, fully functioning /extension folder configured with Manifest V3.',

    // Learn Page
    learnTitle: 'Recognize Phishing Tricks Before They Strike',
    learnSub: 'Learn the foundational mechanics of modern social engineering, lookalike domains, and deception techniques.',
    quizTitle: 'Phishing Awareness Evaluation Quiz',
    quizSub: '5 realistic scenario questions to test your real-world detection skills.',
    btnSubmitQuiz: 'Submit Answers & Review',
    btnRetryQuiz: 'Retry Quiz',

    // Recovery Page
    recoveryTitle: 'I Clicked a Suspicious Link — What Should I Do?',
    recoverySub: 'Stay calm and act systematically. Select what took place below to view your prioritized emergency containment checklist.',
    containmentChecklistTitle: 'Immediate Containment Checklist',
    emergencyHelplinesTitle: 'Report Cyber Fraud & Freeze Stolen Funds',

    // History Page
    historyTitle: 'Scan History & System Settings',
    historySub: 'Review past evaluations stored privately on this device or audit platform connector statuses.',
    filterAll: 'All',
    filterThreats: 'Threats',
    filterClean: 'Clean',
    btnClearHistory: 'Clear History',
    privacySettingsTitle: 'Privacy & Storage Discipline',
    engineStatusTitle: 'Engine Status & Connectors',

    // Footer
    footerMission: 'Context-Aware Phishing Detection, Real-Time Link Protection & Cyber Safety Platform.',
    footerCapabilities: 'Detection Capabilities',
    footerModules: 'Platform Modules',
    footerTrackNotice: 'Track 02: Cyber Security — Phishing & Malicious Link Detection',
    footerTrackText: 'Problem statement solution. Built with explainable deterministic rules, server-side Gemini intelligence, and Chromium Manifest V3 integration.',
    footerCopyright: '© 2026 Clyrixa. Grounded security intelligence. Never treats missing data as clean.',
    footerSsrf: 'SSRF Protected',
    footerPrivacy: 'Privacy Redacted',

    // Extended Quiz & Learn
    academyBadge: 'Cyber Safety Academy',
    module1Title: 'Subdomain Deception',
    module1Desc: 'In standard web naming, domain hierarchy reads backwards from the TLD. Attackers insert trusted names at the start to trick your eyes (e.g. paypal.com.evil-portal.tk).',
    module2Title: 'The HTTPS Padlock Fallacy',
    module2Desc: 'A padlock icon solely means that the connection is encrypted—it does NOT mean the recipient is trustworthy. Over 80% of phishing kits obtain free certificates.',
    module3Title: 'IDN Homograph & Punycode Spoofs',
    module3Desc: 'Attackers register domain names using Cyrillic or Greek characters that look identical to Latin letters (e.g., Cyrillic "а" instead of Latin "a").',
    quizScoreText: 'You scored',

    // Extended Recovery
    recoveryBadge: 'Incident Response & Containment',
    scenario1Title: 'I typed my Password or Account Login',
    scenario1Summary: 'The attacker likely captured your credentials in plain text. Act before they change recovery settings.',
    scenario2Title: 'I entered an SMS OTP or Banking Details',
    scenario2Summary: 'High probability of imminent unauthorized transactions. Immediate financial freeze is critical.',
    scenario3Title: 'I downloaded or ran a file from the link',
    scenario3Summary: 'Potential malware, infostealer, or remote access trojan installation.',
    scenario4Title: 'I clicked on my work computer / corporate email',
    scenario4Summary: 'Enterprise risk: lateral network movement or corporate credential spraying.',
    scenario5Title: 'I clicked the link but entered zero information',
    scenario5Summary: 'Low risk of credential compromise, but browser fingerprinting or drive-by payload check required.',
    helplineDesc: 'National Cyber Crime Reporting Portal (India: 1930 / cybercrime.gov.in) and international response channels.',

    // Extended History & Settings
    historySubtitle: 'Locally stored scan audits and security engine settings.',
    recordCount: 'Records',
    colTargetUrl: 'Target URL',
    colRiskScore: 'Risk Score',
    colAssessedHost: 'Hostname',
    colTime: 'Timestamp',
    colAction: 'Action',
    btnViewReport: 'View Report',
    noHistory: 'No scan history recorded yet. Scanned URLs will appear here.',
    privacySetting1Title: 'Redact Query Parameters & Tokens',
    privacySetting1Desc: 'Automatically strip sensitive query parameters (passwords, tokens, OTPs, session keys) before saving to local history.',
    privacySetting2Title: 'Local Session Storage',
    privacySetting2Desc: 'Retain recent scan results in browser localStorage for offline review.',
    connectorSafeBrowsing: 'Google Safe Browsing v4 Lookup API',
    connectorVirusTotal: 'VirusTotal Multi-Engine Intelligence',
    connectorGemini: 'Google Gemini 3.8 Flash Reasoning Engine',
  },

  te: {
    // Navbar
    brandTagline: 'క్లిక్ చేసేముందు ఆలోచించండి',
    navHome: 'హోమ్',
    navScanner: 'స్కానర్',
    navDashboard: 'విచారణ నివేదిక',
    navProtection: 'లింక్ రక్షణ',
    navLearn: 'నేర్చుకోండి',
    navRecovery: 'రికవరీ సహాయకుడు',
    navHistory: 'చరిత్ర & సెట్టింగ్‌లు',
    navAppointments: 'సంప్రదింపులు',
    navAdmin: 'అడ్మిన్ పోర్టల్',
    btnSignIn: 'లాగిన్',
    btnSignUp: 'ఖాతా సృష్టించండి',
    btnSignOut: 'లాగ్ అవుట్',
    bookingTitle: 'సైబర్ సెక్యూరిటీ నిపుణుల సంప్రదింపులు',
    bookingSubtitle: 'అనుమానాస్పద లింకులు, ఫిషింగ్ దాడులు మరియు భద్రతా సమీక్షల కోసం మా నిపుణులతో 1-ఆన్-1 సెషన్‌ను బుక్ చేయండి.',
    bookConsultationBtn: 'సంప్రదింపును బుక్ చేయండి',
    myBookings: 'నా బుకింగ్‌లు',
    demoScenarios: 'డెమో దృశ్యాలు',
    loadDemoHeader: 'ముందుగా కాన్ఫిగర్ చేసిన పరీక్షను లోడ్ చేయండి',
    tagClean: 'క్లీన్',
    tagCritical: 'తీవ్రమైన ప్రమాదం',
    tagHigh: 'అధిక ప్రమాదం',
    tagModerate: 'మధ్యస్థ ప్రమాదం',
    tagInconclusive: 'అనిశ్చితం',

    // Hero / Landing
    trackBadge: 'ట్రాక్ 02: ఫిషింగ్ & హానికరమైన లింక్ గుర్తింపు',
    heroHeadline1: 'కేవలం క్లిక్ చేయకండి.',
    heroHeadline2: 'లింక్ వెనుక ఏముందో తెలుసుకోండి.',
    heroSubtext: 'ప్రతి లింక్‌కు ఒక కథ ఉంటుంది. క్లైరిక్సా (Clyrixa) మీరు వెబ్‌సైట్‌ను సందర్శించే ముందే నకిలీ డొమైన్‌లు, బ్రాండ్ మోసాలు మరియు సైబర్ ముప్పులను గుర్తించి మీ సమాచారాన్ని కాపాడుతుంది.',
    urlPlaceholder: 'విశ్లేషించడానికి ఏదైనా లింక్‌ను ఇక్కడ అతికించండి (ఉదా: https://...)',
    btnAnalyzeLink: 'లింక్‌ను విశ్లేషించండి',
    btnPaste: 'పేస్ట్ చేయండి',
    btnClear: 'క్లియర్',
    orAnalyzeWith: 'లేదా వీటితో విశ్లేషించండి:',
    btnSuspiciousMsg: 'అనుమానాస్పద సందేశం',
    btnQrCode: 'QR కోడ్ (క్విషింగ్)',
    privacyNotice: 'పాస్‌వర్డ్‌లు లేదా టోకెన్‌లు ఎక్కడా సేకరించబడవు. ప్రైవేట్ సమాచారం ఏదీ బయటకు వెళ్లకుండా విశ్లేషణ జరుగుతుంది.',
    stagesHeaderTitle: 'నాలుగు దశల రక్షణ చక్రం',
    stagesHeaderSub: 'క్లైరిక్సా మీ బ్రౌజింగ్‌ను ఎలా కాపాడుతుంది',

    // 4 Stages
    stage1Title: 'గుర్తించు (DETECT)',
    stage1Desc: 'సబ్‌డొమైన్ మోసాలు, యూనికోడ్ నకిలీ అక్షరాలు, బ్రాండ్ స్పోఫింగ్ మరియు షార్ట్‌నర్ లింక్‌లను నిశితంగా పరిశీలిస్తుంది.',
    stage2Title: 'వివరించు (EXPLAIN)',
    stage2Desc: 'జెమిని AI సహాయంతో సాంకేతిక వివరాలను తెలుగు, హిందీ మరియు ఇంగ్లీష్‌లలో సాధారణ భాషలో వివరిస్తుంది.',
    stage3Title: 'రక్షించు (PROTECT)',
    stage3Desc: 'హానికరమైన లింక్‌లను తెరవకుండా బ్రౌజర్ ఎక్స్‌టెన్షన్ అడ్డుకుంటుంది; సురక్షితమైన లింక్‌లను నేరుగా అనుమతిస్తుంది.',
    stage4Title: 'రికవరీ (RECOVER)',
    stage4Desc: 'ఒకవేళ మీరు ఇప్పటికే వివరాలు నమోదు చేసి ఉంటే, అత్యవసర రక్షణ చర్యలు మరియు సైబర్ హెల్ప్‌లైన్ గైడ్‌ను అందిస్తుంది.',

    // Pillars
    pillar1Title: 'మల్టీ-ఇంటెలిజెన్స్ ఇంజిన్',
    pillar1Desc: 'స్థానిక నియమాలు, Google Safe Browsing మరియు VirusTotal సమాచారాన్ని కలిపి సమగ్ర నివేదిక అందిస్తుంది.',
    pillar1P1: 'ఖచ్చితమైన రిపోర్టింగ్: తప్పుడు లెక్కలు చూపించదు',
    pillar1P2: 'SSRF రక్షణతో సురక్షిత తనిఖీ',
    pillar2Title: 'వివరణాత్మక AI స్కోరింగ్',
    pillar2Desc: 'కేవలం నిజమైన ఆధారాలపై మాత్రమే రిస్క్ స్కోరు నిర్ణయించబడుతుంది. నష్టాలను సులభంగా వివరిస్తుంది.',
    pillar2P1: 'బహుభాషా మద్దతు: తెలుగు, హిందీ, ఇంగ్లీష్',
    pillar2P2: 'ఆఫ్‌లైన్‌లో కూడా పనిచేసే ఖచ్చితమైన విశ్లేషణ',
    pillar3Title: 'రియల్-టైమ్ బ్రౌజర్ ఎక్స్‌టెన్షన్',
    pillar3Desc: 'నకిలీ బ్యాంకింగ్ లేదా ఫిషింగ్ పోర్టల్‌లలో పడకుండా క్లిక్ చేసే క్షణంలోనే హెచ్చరిస్తుంది.',
    pillar3P1: 'సురక్షిత లింక్‌లకు ఎటువంటి ఆలస్యం లేకుండా అనుమతి',
    pillar3P2: 'ప్రమాదకర లింక్‌లకు తక్షణ హెచ్చరిక పేజీ',

    // Extension CTA
    extensionCtaBadge: 'Manifest V3 సిద్ధంగా ఉంది',
    extensionCtaTitle: 'Chrome & Edge బ్రౌజర్‌లలో ముందస్తు రక్షణ పొందండి',
    extensionCtaDesc: 'లింక్‌లను క్లిక్ చేసిన వెంటనే వాటిని పరిశీలించే మా బ్రౌజర్ ఎక్స్‌టెన్షన్‌ను సులభంగా ఇన్‌స్టాల్ చేసుకోండి.',
    extensionCtaBtn: 'ఎక్స్‌టెన్షన్ హబ్‌ను చూడండి',

    // Scanner Page
    scannerTitle: 'సెక్యూరిటీ స్కానర్',
    scannerSub: 'ముప్పు సంకేతాలు, మోసపూరిత విధానాలు మరియు బ్రాండ్ నకిలీలను వెలికితీసేందుకు ఒక మోడ్‌ను ఎంచుకోండి.',
    tabUrl: 'URL విశ్లేషణ',
    tabMessage: 'అనుమానాస్పద సందేశం',
    tabQr: 'QR కోడ్ (క్విషింగ్)',
    destWebAddress: 'గమ్యస్థాన వెబ్ చిరునామా',
    consentCheckbox: 'లైవ్ ఎక్స్‌టర్నల్ థ్రెట్ ఇంటెలిజెన్స్ తనిఖీలకు అనుమతించండి (Google & VirusTotal)',
    consentDesc: 'డిసేబుల్ చేసినప్పుడు, బాహ్య సర్వర్‌లకు లింక్‌లను పంపకుండా స్థానికంగా మాత్రమే విశ్లేషణ జరుగుతుంది.',
    activeLanguageLabel: 'ప్రస్తుత భాష:',
    btnExecuteScan: 'డీప్ స్కాన్ ప్రారంభించండి',
    btnAnalyzing: 'విశ్లేషిస్తోంది...',
    quickTestFixtures: 'శీఘ్ర పరీక్ష లింక్‌లు (డెమో నమూనాలు):',
    msgPasteLabel: 'SMS, WhatsApp లేదా ఈమెయిల్ వచనాన్ని అతికించండి',
    msgPlaceholder: 'అనుమానాస్పద నోటిఫికేషన్, బ్యాంకింగ్ అలర్ట్ లేదా మెసేజ్‌ను ఇక్కడ పేస్ట్ చేయండి. క్లైరిక్సా అత్యవసర ఒత్తిడిని మరియు లింక్‌లను విశ్లేషిస్తుంది...',
    sampleScenariosLabel: 'సామాజిక మోసపు నమూనాను ప్రయత్నించండి:',
    btnAnalyzeMsgLinks: 'సందేశం & లింక్‌లను విశ్లేషించండి',
    qrDecoderTitle: 'QR కోడ్ సెక్యూరిటీ డీకోడర్',
    qrDecoderDesc: 'స్కామర్లు తరచుగా ఫిషింగ్ లింక్‌లను దాచడానికి QR కోడ్‌లను ఉపయోగిస్తారు. సురక్షితంగా పరిశీలించడానికి చిత్రాన్ని అప్‌లోడ్ చేయండి.',
    qrUploadPrompt: 'QR కోడ్ చిత్రాన్ని అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి',
    qrUploadSub: 'PNG, JPG, లేదా WEBP ఫైల్‌లకు మద్దతు ఉంది. బ్రౌజర్‌లోనే డీకోడ్ అవుతుంది.',
    qrDecodedSuccess: 'QR కోడ్ విజయవంతంగా డీకోడ్ చేయబడింది',
    btnSubmitToSafety: 'సేఫ్టీ ఇంజిన్‌కు పంపండి',

    // Dashboard Page
    riskScoreTitle: 'వివరణాత్మక రిస్క్ స్కోరు',
    targetDestination: 'లక్ష్య గమ్యస్థానం',
    assessedHostname: 'పరిశీలించిన హోస్ట్‌నేమ్:',
    navRecommendation: 'నావిగేషన్ సిఫార్సు:',
    cleanRec: '✓ ఎటువంటి ముప్పు కనుగొనబడలేదు',
    dangerRec: '✕ సందర్శించవద్దు - తీవ్ర ప్రమాదం',
    brandImpersonationTitle: 'నకిలీ బ్రాండ్ మోసం గుర్తించబడింది',
    claimedBrand: 'దావా వేసిన అసలైన బ్రాండ్:',
    actualHostname: 'నిజమైన డొమైన్ చిరునామా:',
    verifiedPortal: 'ధృవీకరించబడిన పోర్టల్:',
    unrelatedWarning: '⚠️ ఈ అసలైన బ్రాండ్‌తో ఎటువంటి సంబంధం లేదు:',
    guidanceTitle: 'ఆధారాలతో కూడిన భద్రతా విశ్లేషణ & మార్గదర్శకత్వం',
    consequencesTitle: 'మీరు సందర్శిస్తే జరగబోయే నష్టాలు:',
    actionsTitle: 'సిఫార్సు చేయబడిన రక్షణ చర్యలు:',
    journeyTitle: 'నావిగేషన్ ప్రయాణ క్రమం (రీడైరెక్ట్ చైన్)',
    findingsTitle: 'పరిశీలించిన నిర్దిష్ట ఆధారాలు',
    providersTitle: 'థ్రెట్ ఇంటెలిజెన్స్ ప్రొవైడర్ల కనెక్టివిటీ',
    btnScanAnother: '← మరొక లింక్‌ను స్కాన్ చేయండి',
    btnExportJson: 'JSON నివేదికను డౌన్‌లోడ్ చేయండి',
    btnAlreadyClicked: 'ఇప్పటికే క్లిక్ చేశారా? రికవరీ గైడ్ తెరవండి',
    btnProceedWebsite: 'వెబ్‌సైట్‌కు వెళ్లండి',
    navBlockedPolicy: 'భద్రతా విధానం ప్రకారం డైరెక్ట్ నావిగేషన్ నిలిపివేయబడింది.',

    // Link Protection Page
    protectionTitle: 'ప్రీ-నావిగేషన్ లింక్ రక్షణ',
    protectionSub: 'క్లైరిక్సా ఎక్స్‌టెన్షన్ మీరు వెబ్‌పేజీలపై క్లిక్ చేసినప్పుడు లింక్‌లను ముందే తనిఖీ చేసి, మోసపూరిత సైట్‌లను అడ్డుకుంటుంది.',
    simulatorHeader: 'బ్రౌజర్ ఎక్స్‌టెన్షన్ క్లిక్-ఇంటర్‌సెప్షన్ సిమ్యులేటర్',
    simulatorSub: 'ఎక్స్‌టెన్షన్ రియల్-టైమ్‌లో ఎలా పనిచేస్తుందో క్రింది నమూనా లింక్‌లపై క్లిక్ చేసి పరీక్షించండి:',
    btnResetDemo: 'డెమో రీసెట్',
    btnSimulateClick: 'క్లిక్ అనుకరించండి',
    loadUnpackedTitle: 'Chrome & Edge బ్రౌజర్‌లలో క్లైరిక్సాను ఎలా లోడ్ చేయాలి',
    loadUnpackedSub: 'ప్రాజెక్ట్ డైరెక్టరీలో Manifest V3 తో కూడిన పూర్తి /extension ఫోల్డర్ సిద్ధంగా ఉంది.',

    // Learn Page
    learnTitle: 'ఫిషింగ్ మోసాలను ముందే పసిగట్టండి',
    learnSub: 'ఆధునిక సైబర్ మోసాలు, నకిలీ డొమైన్‌లు మరియు భద్రతా సూత్రాలను వివరంగా తెలుసుకోండి.',
    quizTitle: 'ఫిషింగ్ అవగాహన క్విజ్',
    quizSub: 'మీ సైబర్ రక్షణ నైపుణ్యాలను పరీక్షించడానికి 5 ఆచరణాత్మక ప్రశ్నలు.',
    btnSubmitQuiz: 'సమాధానాలను సమర్పించి సమీక్షించండి',
    btnRetryQuiz: 'మళ్ళీ ప్రయత్నించండి',

    // Recovery Page
    recoveryTitle: 'నేను అనుమానాస్పద లింక్‌పై క్లిక్ చేసాను — ఇప్పుడు ఏమి చేయాలి?',
    recoverySub: 'ఆందోళన చెందకండి. క్రింద మీ పరిస్థితిని ఎంచుకుని తక్షణ అత్యవసర చర్యల చెక్‌లిస్ట్‌ను పూర్తి చేయండి.',
    containmentChecklistTitle: 'తక్షణ అత్యవసర రక్షణ చర్యలు',
    emergencyHelplinesTitle: 'సైబర్ మోసాన్ని నివేదించండి & నిధులను స్తంభింపజేయండి',

    // History Page
    historyTitle: 'స్కాన్ చరిత్ర & సిస్టమ్ సెట్టింగ్‌లు',
    historySub: 'గతంలో పరిశీలించిన నివేదికలను సమీక్షించండి లేదా సిస్టమ్ కనెక్టర్ల స్థితిని చూడండి.',
    filterAll: 'అన్నీ',
    filterThreats: 'ముప్పులు',
    filterClean: 'సురక్షితమైనవి',
    btnClearHistory: 'చరిత్రను క్లియర్ చేయండి',
    privacySettingsTitle: 'గోప్యత & నిల్వ నియంత్రణ',
    engineStatusTitle: 'ఇంజిన్ స్థితి & కనెక్టర్‌లు',

    // Footer
    footerMission: 'సందర్భానుసార ఫిషింగ్ గుర్తింపు, రియల్-టైమ్ లింక్ రక్షణ & సైబర్ భద్రతా వేదిక.',
    footerCapabilities: 'గుర్తింపు సామర్థ్యాలు',
    footerModules: 'ప్లాట్‌ఫారమ్ విభాగాలు',
    footerTrackNotice: 'ట్రాక్ 02: సైబర్ సెక్యూరిటీ — ఫిషింగ్ & హానికరమైన లింక్ గుర్తింపు',
    footerTrackText: 'వివరణాత్మక నియమాలు, సర్వర్-సైడ్ జెమిని AI మరియు క్రోమియం మ్యానిఫెస్ట్ V3 తో నిర్మించబడింది.',
    footerCopyright: '© 2026 క్లైరిక్సా. వాస్తవిక భద్రతా నిఘా. తప్పిపోయిన సమాచారాన్ని క్లీన్‌గా పరిగణించదు.',
    footerSsrf: 'SSRF రక్షితం',
    footerPrivacy: 'గోప్యత సంరక్షితం',

    // Extended Quiz & Learn
    academyBadge: 'సైబర్ సెక్యూరిటీ అకాడమీ',
    module1Title: 'సబ్‌డొమైన్ మోసం',
    module1Desc: 'వెబ్ నేమింగ్ విధానంలో డొమైన్ వెనుక నుండి చదవబడుతుంది. దాడి చేసేవారు మీ కళ్ళను మోసగించడానికి ప్రారంభంలో విశ్వసనీయ పేర్లను చేరుస్తారు (ఉదా: paypal.com.evil-portal.tk).',
    module2Title: 'HTTPS ప్యాడ్‌లాక్ అపోహ',
    module2Desc: 'ప్యాడ్‌లాక్ గుర్తు కేవలం కనెక్షన్ గుప్తీకరించబడిందని సూచిస్తుంది—అంతేగాని అవతలి వ్యక్తి సురక్షితమైన వారని కాదు. 80% పైగా ఫిషింగ్ సైట్లు ఉచిత సర్టిఫికెట్లను వాడుతున్నాయి.',
    module3Title: 'యూనికోడ్ హోమోగ్రాఫ్ నకిలీలు',
    module3Desc: 'దాడి చేసేవారు లాటిన్ అక్షరాల వలె కనిపించే సిరిల్లిక్ లేదా గ్రీకు అక్షరాలను ఉపయోగించి డొమైన్‌లను నమోదు చేస్తారు (ఉదా: ఆంగ్ల "a" బదులు సిరిల్లిక్ "а").',
    quizScoreText: 'మీ స్కోరు',

    // Extended Recovery
    recoveryBadge: 'తక్షణ అత్యవసర ప్రతిస్పందన',
    scenario1Title: 'నేను పాస్‌వర్డ్ లేదా లాగిన్ వివరాలు టైప్ చేసాను',
    scenario1Summary: 'దాడి చేసేవారు మీ వివరాలను సేకరించి ఉండవచ్చు. వారు రికవరీ సెట్టింగ్‌లు మార్చకముందే తక్షణమే స్పందించండి.',
    scenario2Title: 'నేను SMS OTP లేదా బ్యాంకింగ్ వివరాలు నమోదు చేసాను',
    scenario2Summary: 'అనధికారిక ఆర్థిక లావాదేవీలు జరిగే తీవ్ర ప్రమాదం ఉంది. తక్షణమే ఖాతాను స్తంభింపజేయడం అత్యవసరం.',
    scenario3Title: 'నేను లింక్ నుండి ఫైల్‌ను డౌన్‌లోడ్ చేసి రన్ చేసాను',
    scenario3Summary: 'మాల్వేర్ లేదా ఇన్ఫోస్టీలర్ వైరస్ మీ పరికరంలో ఇన్‌స్టాల్ అయ్యే ప్రమాదం ఉంది.',
    scenario4Title: 'నేను ఆఫీస్ కంప్యూటర్ లేదా కార్పొరేట్ ఈమెయిల్‌లో క్లిక్ చేసాను',
    scenario4Summary: 'కంపెనీ నెట్‌వర్క్ భద్రతకు ముప్పు. వెంటనే అంతర్గత IT విభాగానికి తెలియజేయండి.',
    scenario5Title: 'నేను లింక్‌పై క్లిక్ చేసాను కానీ వివరాలు నమోదు చేయలేదు',
    scenario5Summary: 'క్రెడెన్షియల్ ముప్పు తక్కువగా ఉంది, కానీ బ్రౌజర్ క్యాష్‌ను క్లియర్ చేయడం మంచిది.',
    helplineDesc: 'నేషనల్ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్ (భారతదేశం: 1930 / cybercrime.gov.in) మరియు అత్యవసర హెల్ప్‌లైన్లు.',

    // Extended History & Settings
    historySubtitle: 'ఈ పరికరంలో స్థానికంగా భద్రపరచబడిన స్కాన్ నివేదికలు మరియు భద్రతా సెట్టింగ్‌లు.',
    recordCount: 'రికార్డులు',
    colTargetUrl: 'లక్ష్య URL',
    colRiskScore: 'రిస్క్ స్కోరు',
    colAssessedHost: 'హోస్ట్‌నేమ్',
    colTime: 'సమయం',
    colAction: 'చర్య',
    btnViewReport: 'నివేదిక చూడండి',
    noHistory: 'ఇంకా స్కాన్ చరిత్ర నమోదు కాలేదు. స్కాన్ చేసిన లింక్‌లు ఇక్కడ కనిపిస్తాయి.',
    privacySetting1Title: 'టోకెన్‌లు & పారామితులను దాచండి',
    privacySetting1Desc: 'చరిత్రలో నిల్వ చేయడానికి ముందు పాస్‌వర్డ్‌లు, సెషన్ కీలు, OTPలను ఆటోమేటిక్‌గా తొలగిస్తుంది.',
    privacySetting2Title: 'స్థానిక సెషన్ నిల్వ (LocalStorage)',
    privacySetting2Desc: 'ఆఫ్‌లైన్ సమీక్ష కోసం ఇటీవలి స్కాన్ ఫలితాలను బ్రౌజర్‌లో సురక్షితంగా నిల్వ చేస్తుంది.',
    connectorSafeBrowsing: 'Google Safe Browsing v4 తనిఖీ API',
    connectorVirusTotal: 'VirusTotal మల్టీ-ఇంజిన్ ఇంటెలిజెన్స్',
    connectorGemini: 'Google Gemini 3.8 Flash వివరణాత్మక AI ఇంజిన్',
  },

  hi: {
    // Navbar
    brandTagline: 'क्लिक करने से पहले सतर्क रहें',
    navHome: 'होम',
    navScanner: 'स्कैनर',
    navDashboard: 'जांच रिपोर्ट',
    navProtection: 'लिंक सुरक्षा',
    navLearn: 'सीखें',
    navRecovery: 'रिकवरी सहायक',
    navHistory: 'इतिहास और सेटिंग्स',
    navAppointments: 'परामर्श',
    navAdmin: 'एडमिन पोर्टल',
    btnSignIn: 'साइन इन',
    btnSignUp: 'साइन अप',
    btnSignOut: 'साइन आउट',
    bookingTitle: 'साइबर सुरक्षा विशेषज्ञ परामर्श',
    bookingSubtitle: 'संदिग्ध लिंक, फ़िशिंग अभियानों और कॉर्पोरेट सुरक्षा समीक्षा के लिए हमारी घटना प्रतिक्रिया टीम के साथ 1-ऑन-1 सत्र निर्धारित करें।',
    bookConsultationBtn: 'सुरक्षा परामर्श बुक करें',
    myBookings: 'मेरी निर्धारित बुकिंग',
    demoScenarios: 'डेमो परिदृश्य',
    loadDemoHeader: 'पूर्व-कॉन्फ़िगर परीक्षण लोड करें',
    tagClean: 'सुरक्षित',
    tagCritical: 'गंभीर खतरा',
    tagHigh: 'उच्च जोखिम',
    tagModerate: 'मध्यम जोखिम',
    tagInconclusive: 'अनिर्णायक',

    // Hero / Landing
    trackBadge: 'ट्रैक 02: फ़िशिंग और दुर्भावनापूर्ण लिंक पहचान',
    heroHeadline1: 'सिर्फ क्लिक न करें।',
    heroHeadline2: 'लिंक के पीछे का सच जानें।',
    heroSubtext: 'हर लिंक की एक कहानी होती है। क्लेरिक्स (Clyrixa) किसी वेबसाइट पर जाने से पहले ही नकली डोमेन, ब्रांड प्रतिरूपण और सुरक्षा खतरों की जांच करके आपको सुरक्षित रखता है।',
    urlPlaceholder: 'विश्लेषण के लिए कोई भी लिंक पेस्ट करें (उदा: https://...)',
    btnAnalyzeLink: 'लिंक का विश्लेषण करें',
    btnPaste: 'पेस्ट करें',
    btnClear: 'साफ़ करें',
    orAnalyzeWith: 'या इनके द्वारा विश्लेषण करें:',
    btnSuspiciousMsg: 'संदिग्ध संदेश टेक्स्ट',
    btnQrCode: 'क्यूआर कोड (क्विशिंग)',
    privacyNotice: 'पासवर्ड या गोपनीय टोकन का कोई संग्रह नहीं। विश्लेषण पूरी तरह से सुरक्षित और निजी रहता है।',
    stagesHeaderTitle: 'चार-चरणीय सुरक्षा जीवनचक्र',
    stagesHeaderSub: 'क्लेरिक्स आपकी ब्राउज़िंग की रक्षा कैसे करता है',

    // 4 Stages
    stage1Title: 'पहचानें (DETECT)',
    stage1Desc: 'सबडोमेन धोखे, यूनिकोड होलोग्राफ, ब्रांड स्पूफिंग और शॉर्टनर लिंक की गहराई से जांच करता है।',
    stage2Title: 'समझाएं (EXPLAIN)',
    stage2Desc: 'जेमिनी AI की मदद से तकनीकी निष्कर्षों को हिंदी, तेलुगु और अंग्रेजी में सरल भाषा में समझाता है।',
    stage3Title: 'सुरक्षा दें (PROTECT)',
    stage3Desc: 'Manifest V3 एक्सटेंशन खतरनाक साइटों पर जाने से रोकता है, जबकि सुरक्षित लिंक को तुरंत आगे बढ़ने देता है।',
    stage4Title: 'रिकवरी (RECOVER)',
    stage4Desc: 'यदि आपने पहले ही जानकारी दर्ज कर दी है, तो तत्काल आपातकालीन सहायता और साइबर हेल्पलाइन गाइड प्रदान करता है।',

    // Pillars
    pillar1Title: 'मल्टी-इंजन इंटेलिजेंस',
    pillar1Desc: 'स्थानीय नियमों, Google Safe Browsing और VirusTotal के साथ मिलकर सटीक सुरक्षा रिपोर्ट प्रदान करता है।',
    pillar1P1: 'सटीक रिपोर्टिंग: कभी भी झूठे आंकड़े नहीं दिखाता',
    pillar1P2: 'SSRF सुरक्षा के साथ सुरक्षित जांच',
    pillar2Title: 'व्याख्यात्मक AI स्कोरिंग',
    pillar2Desc: 'जोखिम स्कोर पूरी तरह वास्तविक साक्ष्यों पर आधारित होता है और संभावित खतरों को स्पष्ट रूप से समझाता है।',
    pillar2P1: 'बहुभाषी: हिंदी, तेलुगु, अंग्रेजी',
    pillar2P2: 'ऑफ़लाइन होने पर भी सटीक स्थानीय विश्लेषण',
    pillar3Title: 'रीयल-टाइम ब्राउज़र एक्सटेंशन',
    pillar3Desc: 'क्लिक-इंटरसेप्शन तकनीक आपको फर्जी बैंकिंग या फ़िशिंग पोर्टल पर पहुंचने से पहले ही रोकती है।',
    pillar3P1: 'सुरक्षित लिंक के लिए शून्य विलंब',
    pillar3P2: 'खतरनाक लिंक के लिए तुरंत चेतावनी पृष्ठ',

    // Extension CTA
    extensionCtaBadge: 'Manifest V3 तैयार',
    extensionCtaTitle: 'Chrome और Edge ब्राउज़र में पूर्व-नेविगेशन सुरक्षा पाएं',
    extensionCtaDesc: 'वेबपेजों पर लिंक क्लिक करते ही उनकी जांच करने के लिए हमारा हल्का ब्राउज़र एक्सटेंशन इंस्टॉल करें।',
    extensionCtaBtn: 'एक्सटेंशन हब देखें',

    // Scanner Page
    scannerTitle: 'सुरक्षा स्कैनर',
    scannerSub: 'खतरों, भ्रामक पैटर्न और ब्रांड प्रतिरूपण को उजागर करने के लिए नीचे एक मोड चुनें।',
    tabUrl: 'URL विश्लेषण',
    tabMessage: 'संदिग्ध संदेश',
    tabQr: 'क्यूआर कोड (क्विशिंग)',
    destWebAddress: 'गंतव्य वेब पता',
    consentCheckbox: 'लाइव बाहरी थ्रेट इंटेलिजेंस जांच की अनुमति दें (Google & VirusTotal)',
    consentDesc: 'अक्षम होने पर, क्लेरिक्स बिना किसी बाहरी सर्वर पर लिंक भेजे केवल स्थानीय स्तर पर जांच करता है।',
    activeLanguageLabel: 'सक्रिय भाषा:',
    btnExecuteScan: 'डीप स्कैन शुरू करें',
    btnAnalyzing: 'विश्लेषण जारी है...',
    quickTestFixtures: 'त्वरित परीक्षण लिंक (डेमो नमूने):',
    msgPasteLabel: 'SMS, WhatsApp या ईमेल टेक्स्ट पेस्ट करें',
    msgPlaceholder: 'संदिग्ध सूचना, SMS या ईमेल यहां पेस्ट करें। क्लेरिक्स तात्कालिकता के दबाव और लिंक के जोखिम की जांच करेगा...',
    sampleScenariosLabel: 'यथार्थवादी सोशल-इंजीनियरिंग परिदृश्य आज़माएं:',
    btnAnalyzeMsgLinks: 'संदेश और लिंक का विश्लेषण करें',
    qrDecoderTitle: 'क्यूआर कोड सुरक्षा डिकोडर',
    qrDecoderDesc: 'धोखेबाज़ अक्सर फ़िशिंग लिंक छिपाने के लिए क्यूआर कोड का उपयोग करते हैं। सुरक्षित जांच के लिए छवि अपलोड करें।',
    qrUploadPrompt: 'क्यूआर कोड छवि अपलोड करने के लिए क्लिक करें',
    qrUploadSub: 'PNG, JPG या WEBP समर्थित। पूरी तरह आपके ब्राउज़र में डिकोड होता है।',
    qrDecodedSuccess: 'क्यूआर कोड सफलतापूर्वक डिकोड किया गया',
    btnSubmitToSafety: 'सुरक्षा इंजन में भेजें',

    // Dashboard Page
    riskScoreTitle: 'व्याख्यात्मक जोखिम स्कोर',
    targetDestination: 'लक्षित गंतव्य',
    assessedHostname: 'जांचा गया होस्टनेम:',
    navRecommendation: 'नेविगेशन सिफ़ारिश:',
    cleanRec: '✓ कोई ज्ञात खतरा नहीं मिला',
    dangerRec: '✕ आगे न बढ़ें - अत्यधिक खतरनाक',
    brandImpersonationTitle: 'नकली ब्रांड प्रतिरूपण पाया गया',
    claimedBrand: 'दावा किया गया आधिकारिक ब्रांड:',
    actualHostname: 'वास्तविक डोमेन पता:',
    verifiedPortal: 'सत्यापित पोर्टल:',
    unrelatedWarning: '⚠️ इस असली ब्रांड से इसका कोई संबंध नहीं है:',
    guidanceTitle: 'तथ्यात्मक सुरक्षा विश्लेषण और मार्गदर्शन',
    consequencesTitle: 'यदि आप आगे बढ़ते हैं तो संभावित परिणाम:',
    actionsTitle: 'अनुशंसित सुरक्षा कदम:',
    journeyTitle: 'नेविगेशन यात्रा क्रम (पुनर्निर्देशन श्रृंखला)',
    findingsTitle: 'जांचे गए विशिष्ट साक्ष्य',
    providersTitle: 'थ्रेट इंटेलिजेंस प्रदाता कनेक्टिविटी',
    btnScanAnother: '← दूसरा लिंक स्कैन करें',
    btnExportJson: 'JSON रिपोर्ट डाउनलोड करें',
    btnAlreadyClicked: 'पहले ही क्लिक कर दिया? रिकवरी गाइड खोलें',
    btnProceedWebsite: 'वेबसाइट पर जाएं',
    navBlockedPolicy: 'सुरक्षा नीति के अनुसार सीधा नेविगेशन अवरुद्ध है।',

    // Link Protection Page
    protectionTitle: 'पूर्व-नेविगेशन लिंक सुरक्षा',
    protectionSub: 'क्लेरिक्स एक्सटेंशन वेबपेजों पर लिंक क्लिक को पहले ही जांचता है और फ़िशिंग साइटों को रोकता है।',
    simulatorHeader: 'ब्राउज़र एक्सटेंशन क्लिक-इंटरसेप्शन सिम्युलेटर',
    simulatorSub: 'एक्सटेंशन वास्तविक समय में कैसे काम करता है, यह जांचने के लिए नीचे किसी भी नमूना लिंक पर क्लिक करें:',
    btnResetDemo: 'डेमो रीसेट',
    btnSimulateClick: 'क्लिक सिम्युलेट करें',
    loadUnpackedTitle: 'Chrome और Edge में क्लेरिक्स कैसे लोड करें',
    loadUnpackedSub: 'परियोजना डायरेक्टरी में Manifest V3 के साथ तैयार /extension फ़ोल्डर उपलब्ध है।',

    // Learn Page
    learnTitle: 'फ़िशिंग के धोखे पहले ही पहचानें',
    learnSub: 'आधुनिक सोशल इंजीनियरिंग, नकली डोमेन और ऑनलाइन सुरक्षा के बुनियादी सिद्धांतों को समझें।',
    quizTitle: 'फ़िशिंग जागरूकता मूल्यांकन क्विज़',
    quizSub: 'अपने सुरक्षा कौशल का परीक्षण करने के लिए 5 व्यावहारिक प्रश्न।',
    btnSubmitQuiz: 'उत्तर सबमिट करें और समीक्षा करें',
    btnRetryQuiz: 'पुनः प्रयास करें',

    // Recovery Page
    recoveryTitle: 'मैंने संदिग्ध लिंक पर क्लिक कर दिया — अब क्या करूं?',
    recoverySub: 'घबराएं नहीं। अपनी स्थिति चुनें और तत्काल आपातकालीन नियंत्रण चेकलिस्ट का पालन करें।',
    containmentChecklistTitle: 'तत्काल आपातकालीन सुरक्षा चेकलिस्ट',
    emergencyHelplinesTitle: 'साइबर धोखाधड़ी की रिपोर्ट करें और धन फ्रीज करवाएं',

    // History Page
    historyTitle: 'स्कैन इतिहास और सिस्टम सेटिंग्स',
    historySub: 'अतीत में जांची गई रिपोर्टों की समीक्षा करें या सिस्टम कनेक्टर्स की स्थिति देखें।',
    filterAll: 'सभी',
    filterThreats: 'खतरे',
    filterClean: 'सुरक्षित',
    btnClearHistory: 'इतिहास साफ़ करें',
    privacySettingsTitle: 'गोपनीयता और डेटा नियंत्रण',
    engineStatusTitle: 'इंजन स्थिति और कनेक्टर्स',

    // Footer
    footerMission: 'संदर्भ-जागरूक फ़िशिंग पहचान, रीयल-टाइम लिंक सुरक्षा और साइबर सुरक्षा मंच।',
    footerCapabilities: 'पहचान क्षमताएं',
    footerModules: 'मंच मॉड्यूल',
    footerTrackNotice: 'ट्रैक 02: साइबर सुरक्षा — फ़िशिंग और दुर्भावनापूर्ण लिंक पहचान',
    footerTrackText: 'व्याख्यात्मक नियमों, सर्वर-साइड जेमिनी AI और क्रोमियम मैनिफेस्ट V3 के साथ निर्मित।',
    footerCopyright: '© 2026 क्लेरिक्स। तथ्यात्मक सुरक्षा आसूचना। कभी भी अनुपलब्ध डेटा को सुरक्षित नहीं मानता।',
    footerSsrf: 'SSRF सुरक्षित',
    footerPrivacy: 'गोपनीयता संरक्षित',

    // Extended Quiz & Learn
    academyBadge: 'साइबर सुरक्षा अकादमी',
    module1Title: 'सबडोमेन धोखा',
    module1Desc: 'मानक वेब नामकरण में, डोमेन पदानुक्रम TLD से उल्टे क्रम में पढ़ा जाता है। हमलावर आपको धोखा देने के लिए शुरुआत में विश्वसनीय नाम जोड़ते हैं (उदा: paypal.com.evil-portal.tk)।',
    module2Title: 'HTTPS पैडलॉक का भ्रम',
    module2Desc: 'पैडलॉक आइकन का अर्थ केवल कनेक्शन एन्क्रिप्टेड होना है—इसका मतलब यह नहीं कि वेबसाइट सुरक्षित या प्रामाणिक है। 80% से अधिक फ़िशिंग किट मुफ़्त प्रमाणपत्रों का उपयोग करते हैं।',
    module3Title: 'यूनिकोड होमोग्राफ स्पूफिंग',
    module3Desc: 'हमलावर लैटिन अक्षरों के समान दिखने वाले सिरिलिक या ग्रीक अक्षरों का उपयोग करके डोमेन पंजीकृत करते हैं (उदा: लैटिन "a" के स्थान पर सिरिलिक "а")।',
    quizScoreText: 'आपका स्कोर',

    // Extended Recovery
    recoveryBadge: 'आपातकालीन घटना प्रतिक्रिया',
    scenario1Title: 'मैंने अपना पासवर्ड या खाता लॉगिन दर्ज किया',
    scenario1Summary: 'हमलावर ने संभवतः आपके क्रेडेंशियल्स कैप्चर कर लिए हैं। रिकवरी सेटिंग्स बदलने से पहले तुरंत कार्रवाई करें।',
    scenario2Title: 'मैंने SMS OTP या बैंकिंग विवरण दर्ज किए',
    scenario2Summary: 'अनधिकृत वित्तीय लेनदेन का अत्यधिक जोखिम। तत्काल वित्तीय खाते को फ्रीज करना अनिवार्य है।',
    scenario3Title: 'मैंने लिंक से फ़ाइल डाउनलोड या रन की',
    scenario3Summary: 'संभावित मैलवेयर, इन्फोस्टीलर या रिमोट एक्सेस ट्रोजन का जोखिम।',
    scenario4Title: 'मैंने ऑफिस कंप्यूटर या कॉर्पोरेट ईमेल पर क्लिक किया',
    scenario4Summary: 'कंपनी नेटवर्क के लिए गंभीर जोखिम। अपनी आंतरिक IT सुरक्षा टीम को तुरंत सूचित करें।',
    scenario5Title: 'मैंने लिंक पर क्लिक किया लेकिन कोई जानकारी नहीं दी',
    scenario5Summary: 'क्रेडेंशियल चोरी का कम जोखिम, लेकिन ब्राउज़र कैश साफ़ करना और जांचना आवश्यक है।',
    helplineDesc: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल (भारत: 1930 / cybercrime.gov.in) और आपातकालीन वित्तीय हेल्पलाइन।',

    // Extended History & Settings
    historySubtitle: 'इस डिवाइस पर सुरक्षित रूप से संग्रहीत स्कैन रिपोर्ट और सुरक्षा सेटिंग्स।',
    recordCount: 'रिकॉर्ड',
    colTargetUrl: 'लक्षित URL',
    colRiskScore: 'जोखिम स्कोर',
    colAssessedHost: 'होस्टनेम',
    colTime: 'समय',
    colAction: 'कार्रवाई',
    btnViewReport: 'रिपोर्ट देखें',
    noHistory: 'अभी तक कोई स्कैन इतिहास दर्ज नहीं हुआ है। स्कैन किए गए लिंक यहां दिखाई देंगे।',
    privacySetting1Title: 'क्वेरी पैरामीटर्स और टोकन छुपाएं',
    privacySetting1Desc: 'स्थानीय इतिहास में सहेजने से पहले पासवर्ड, टोकन, OTP और सत्र कुंजियों को स्वचालित रूप से हटा देता है।',
    privacySetting2Title: 'स्थानीय सत्र संग्रहण (LocalStorage)',
    privacySetting2Desc: 'ऑफ़लाइन समीक्षा के लिए हाल के स्कैन परिणामों को सुरक्षित रूप से ब्राउज़र में बनाए रखता है।',
    connectorSafeBrowsing: 'Google Safe Browsing v4 लुकअप API',
    connectorVirusTotal: 'VirusTotal मल्टी-इंजन इंटेलिजेंस',
    connectorGemini: 'Google Gemini 3.8 Flash तर्क इंजन',
  },
};
