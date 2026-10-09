import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertOctagon, 
  KeyRound, 
  Smartphone, 
  FileWarning, 
  CreditCard, 
  CheckCircle2, 
  PhoneCall, 
  ExternalLink
} from 'lucide-react';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface RecoveryAssistantProps {
  language: Language;
}

interface RecoveryScenario {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: 'high' | 'critical';
  summary: string;
  steps: { id: string; action: string; details: string }[];
}

export const RecoveryAssistant: React.FC<RecoveryAssistantProps> = ({ language }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('passwords');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const t = DICTIONARY[language] || DICTIONARY.en;

  const recoveryScenarios: RecoveryScenario[] = language === 'te' ? [
    {
      id: 'passwords',
      title: 'నేను పాస్‌వర్డ్ లేదా లాగిన్ వివరాలు టైప్ చేసాను',
      icon: KeyRound,
      severity: 'critical',
      summary: 'దాడి చేసేవారు మీ క్రెడెన్షియల్స్ సంగ్రహించి ఉండవచ్చు. వారు రికవరీ సెట్టింగ్‌లు మార్చకముందే తక్షణమే స్పందించండి.',
      steps: [
        {
          id: 'p1',
          action: 'సురక్షితమైన పరికరం లేదా ప్రైవేట్ విండో నుండి వెంటనే పాస్‌వర్డ్‌ను రీసెట్ చేయండి',
          details: 'నేరుగా అధికారిక పోర్టల్‌ను బ్రౌజర్‌లో టైప్ చేయండి (బ్రౌజర్ హిస్టరీలోని లింక్‌లను ఉపయోగించవద్దు) మరియు పాస్‌వర్డ్ మార్చండి.',
        },
        {
          id: 'p2',
          action: 'యాక్టివ్‌గా ఉన్న అన్ని సెషన్‌ల నుండి వెంటనే సైన్-అవుట్ చేయండి',
          details: 'ఖాతా సెట్టింగ్‌లలో "Manage devices" లేదా "Security" తెరిచి, అన్ని ఇతర పరికరాలను లాగౌట్ చేయండి.',
        },
        {
          id: 'p3',
          action: '2-ఫాక్టర్ అథెంటికేషన్ (2FA) ను రీసెట్ చేయండి లేదా ఎనేబుల్ చేయండి',
          details: 'SMS కంటే అథెంటికేటర్ యాప్ (Google Authenticator) లేదా హార్డ్‌వేర్ కీని ఉపయోగించడం మరింత సురక్షితం.',
        },
        {
          id: 'p4',
          action: 'ఈ పాస్‌వర్డ్‌ను ఇతర ఖాతాలలో వాడి ఉంటే వాటిని కూడా వెంటనే మార్చండి',
          details: 'ఈమెయిల్, బ్యాంకింగ్ లేదా సోషల్ మీడియాలో ఇదే పాస్‌వర్డ్ ఉంటే తక్షణమే మార్చండి.',
        },
      ],
    },
    {
      id: 'otp',
      title: 'నేను SMS OTP లేదా 2FA కోడ్‌ను నమోదు చేసాను',
      icon: Smartphone,
      severity: 'critical',
      summary: 'దాడి చేసేవారు నిజ సమయ లావాదేవీల ద్వారా డబ్బును తరలించే తీవ్ర ముప్పు ఉంది. తక్షణ ఆర్థిక రక్షణ అవసరం.',
      steps: [
        {
          id: 'o1',
          action: 'వెంటనే మీ బ్యాంక్ అత్యవసర హెల్ప్‌లైన్‌కు కాల్ చేయండి',
          details: 'నెట్ బ్యాంకింగ్, UPI మరియు డెబిట్ కార్డులపై తక్షణ బ్లాక్ విధించాలని అభ్యర్థించండి.',
        },
        {
          id: 'o2',
          action: 'ఇటీవలి లావాదేవీల స్టేట్‌మెంట్‌లను తనిఖీ చేయండి',
          details: 'అనధికారిక లావాదేవీలు లేదా కొత్త లబ్ధిదారుల చేరికలు జరిగాయో లేదో పరిశీలించండి.',
        },
        {
          id: 'o3',
          action: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్ 1930 (భారతదేశం) కు వెంటనే కాల్ చేయండి',
          details: 'మొదటి గంటలో (గోల్డెన్ అవర్) ఫిర్యాదు చేయడం వల్ల డబ్బును స్తంభింపజేసే అవకాశం ఎక్కువగా ఉంటుంది.',
        },
      ],
    },
    {
      id: 'money',
      title: 'నేను క్రెడిట్ కార్డు వివరాలు నమోదు చేసాను / డబ్బు పంపాను',
      icon: CreditCard,
      severity: 'critical',
      summary: 'కార్డు నంబర్లు మరియు CVV లు డార్క్ వెబ్‌లో దుర్వినియోగం కావచ్చు. తక్షణ చర్యలు తీసుకోండి.',
      steps: [
        {
          id: 'm1',
          action: 'బ్యాంకింగ్ యాప్ ద్వారా కార్డును శాశ్వతంగా బ్లాక్ లేదా హాట్‌లిస్ట్ చేయండి',
          details: 'ఆన్‌లైన్ మరియు అంతర్జాతీయ లావాదేవీలను వెంటనే ఆఫ్ చేయండి, కొత్త CVV తో రీప్లేస్‌మెంట్ కార్డు కోరండి.',
        },
        {
          id: 'm2',
          action: 'బ్యాంక్‌లో ఫ్రాడ్ / ఛార్జ్‌బ్యాక్ వివాదాన్ని నమోదు చేయండి',
          details: 'ఫిషింగ్ URL మరియు మెసేజ్ వివరాలను ఆధారాలుగా సమర్పించండి.',
        },
        {
          id: 'm3',
          action: 'cybercrime.gov.in లో అధికారిక ఫిర్యాదును నమోదు చేయండి',
          details: 'లావాదేవీల UTR నంబర్‌లు మరియు SMS రశీదులను సిద్ధంగా ఉంచుకోండి.',
        },
      ],
    },
    {
      id: 'download',
      title: 'నేను లింక్ నుండి తెలియని ఫైల్ / APK ని డౌన్‌లోడ్ చేసాను',
      icon: FileWarning,
      severity: 'critical',
      summary: 'మాల్వేర్ లేదా ఇన్ఫోస్టీలర్ వైరస్ మీ పరికరంలో చొరబడే ప్రమాదం ఉంది.',
      steps: [
        {
          id: 'd1',
          action: 'పరికరంలో Wi-Fi మరియు మొబైల్ డేటాను తక్షణమే ఆఫ్ చేయండి',
          details: 'మాల్వేర్ సమాచారాన్ని సర్వర్‌లకు పంపకుండా నెట్‌వర్క్ కనెక్షన్‌ను వెంటనే డిస్‌కనెక్ట్ చేయండి.',
        },
        {
          id: 'd2',
          action: 'Accessibility లేదా Device Admin అనుమతులను అంగీకరించవద్దు',
          details: 'Android లో అనుమానాస్పద యాప్‌లను సేఫ్ మోడ్ (Safe Mode) లో అన్‌ఇన్‌స్టాల్ చేయండి.',
        },
        {
          id: 'd3',
          action: 'విశ్వసనీయ యాంటీవైరస్‌తో పూర్తి ఆఫ్‌లైన్ స్కాన్ నిర్వహించండి',
          details: 'కంప్యూటర్‌లో Windows Defender లేదా ప్రత్యేక మాల్వేర్ స్కానర్‌ను రన్ చేయండి.',
        },
      ],
    },
    {
      id: 'visited',
      title: 'నేను లింక్‌ను మాత్రమే తెరిచాను, సమాచారం నమోదు చేయలేదు',
      icon: AlertOctagon,
      severity: 'high',
      summary: 'సమాచారం నమోదు చేయకపోతే ముప్పు తక్కువగా ఉంటుంది, అయితే ముందుజాగ్రత్త చర్యలు అవసరం.',
      steps: [
        {
          id: 'v1',
          action: 'ఆ ట్యాబ్‌ను మూసివేసి, ఇటీవలి బ్రౌజర్ క్యాష్ & కుకీలను క్లియర్ చేయండి',
          details: 'ట్రాకింగ్ కుకీలు బ్రౌజర్‌లో మిగిలిపోకుండా ఇది నిరోధిస్తుంది.',
        },
        {
          id: 'v2',
          action: 'మీ ఆపరేటింగ్ సిస్టమ్ మరియు బ్రౌజర్ అప్‌డేట్‌లను నిర్ధారించుకోండి',
          details: 'తాజా బ్రౌజర్ వెర్షన్‌లు సురక్షితమైన శాండ్‌బాక్స్‌ను అందిస్తాయి.',
        },
        {
          id: 'v3',
          action: 'ఎలాంటి అనుమానాస్పద బ్యాక్‌గ్రౌండ్ డౌన్‌లోడ్‌లు జరగలేదని ధృవీకరించండి',
          details: 'మీ Downloads ఫోల్డర్‌లో తెలియని .exe, .apk లేదా .zip ఫైల్‌లు ఉంటే వెంటనే తొలగించండి.',
        },
      ],
    },
  ] : language === 'hi' ? [
    {
      id: 'passwords',
      title: 'मैंने अपना पासवर्ड या खाता लॉगिन दर्ज किया',
      icon: KeyRound,
      severity: 'critical',
      summary: 'हमलावर ने संभवतः आपके क्रेडेंशियल्स कैप्चर कर लिए हैं। रिकवरी सेटिंग्स बदलने से पहले तुरंत कार्रवाई करें।',
      steps: [
        {
          id: 'p1',
          action: 'सुरक्षित डिवाइस या गुप्त विंडो से तुरंत पासवर्ड रीसेट करें',
          details: 'सीधे आधिकारिक पोर्टल को ब्राउज़र में टाइप करें (इतिहास के लिंक का उपयोग न करें) और पासवर्ड बदलें।',
        },
        {
          id: 'p2',
          action: 'सभी सक्रिय सत्रों (Sessions) से तुरंत साइन-आउट करें',
          details: 'खाता सेटिंग्स में "Manage devices" या "Security" खोलें और अन्य सभी सत्रों को समाप्त करें।',
        },
        {
          id: 'p3',
          action: 'टू-फैक्टर ऑथेंटिकेशन (2FA) को रीसेट या सक्षम करें',
          details: 'SMS के बजाय ऑथेंटिकेटर ऐप (Google Authenticator) या सुरक्षा कुंजी का उपयोग करें।',
        },
        {
          id: 'p4',
          action: 'यह पासवर्ड अन्य जिन खातों में उपयोग हुआ है, उन्हें भी तुरंत बदलें',
          details: 'यदि ईमेल, बैंकिंग या सोशल मीडिया पर यही पासवर्ड था, तो उन्हें तुरंत अपडेट करें।',
        },
      ],
    },
    {
      id: 'otp',
      title: 'मैंने SMS OTP या 2FA कोड दर्ज किया',
      icon: Smartphone,
      severity: 'critical',
      summary: 'हमलावर वास्तविक समय में वित्तीय लेनदेन कर सकते हैं। तत्काल वित्तीय रोक लगाना अनिवार्य है।',
      steps: [
        {
          id: 'o1',
          action: 'तुरंत अपने बैंक की आपातकालीन हेल्पलाइन पर कॉल करें',
          details: 'नेट बैंकिंग, UPI और डेबिट कार्ड पर तत्काल आपातकालीन ब्लॉक का अनुरोध करें।',
        },
        {
          id: 'o2',
          action: 'हाल के लेनदेन विवरणों की तुरंत जांच करें',
          details: 'जांचें कि क्या कोई अनधिकृत कटौती या नया लाभार्थी जोड़ा गया है।',
        },
        {
          id: 'o3',
          action: 'साइबर अपराध हेल्पलाइन 1930 (भारत) पर तुरंत कॉल करें',
          details: 'पहले घंटे (गोल्डन ऑवर) में शिकायत दर्ज कराने से बैंक खातों में धन फ्रीज होने की संभावना बढ़ जाती है।',
        },
      ],
    },
    {
      id: 'money',
      title: 'मैंने क्रेडिट कार्ड विवरण दर्ज किए या पैसे भेजे',
      icon: CreditCard,
      severity: 'critical',
      summary: 'कार्ड नंबर और सीवीवी का डार्क वेब पर दुरुपयोग हो सकता है। तुरंत आवश्यक कदम उठाएं।',
      steps: [
        {
          id: 'm1',
          action: 'बैंकिंग ऐप के माध्यम से कार्ड को स्थायी रूप से ब्लॉक या हॉटलिस्ट करें',
          details: 'ऑनलाइन और अंतरराष्ट्रीय लेनदेन को तुरंत बंद करें और नए CVV के साथ नए कार्ड का अनुरोध करें।',
        },
        {
          id: 'm2',
          action: 'कार्ड जारीकर्ता के पास धोखाधड़ी / चार्जबैक विवाद दर्ज करें',
          details: 'धोखाधड़ी के साक्ष्य के रूप में फ़िशिंग URL और संदेश का स्क्रीनशॉट दें।',
        },
        {
          id: 'm3',
          action: 'cybercrime.gov.in पर आधिकारिक शिकायत दर्ज करें',
          details: 'लेनदेन के UTR नंबर और SMS रसीदें तैयार रखें।',
        },
      ],
    },
    {
      id: 'download',
      title: 'मैंने लिंक से अज्ञात फ़ाइल या APK डाउनलोड किया',
      icon: FileWarning,
      severity: 'critical',
      summary: 'मैलवेयर या रिमोट एक्सेस ट्रोजन आपके डिवाइस में इंस्टॉल होने का जोखिम है।',
      steps: [
        {
          id: 'd1',
          action: 'डिवाइस से Wi-Fi और मोबाइल डेटा तुरंत बंद करें',
          details: 'मैलवेयर को बाहर डेटा भेजने से रोकने के लिए डिवाइस को नेटवर्क से अलग करें।',
        },
        {
          id: 'd2',
          action: 'Accessibility या डिवाइस व्यवस्थापक अनुमतियां न दें',
          details: 'एंड्रॉइड पर संदिग्ध ऐप को सेफ मोड (Safe Mode) में अनइंस्टॉल करें।',
        },
        {
          id: 'd3',
          action: 'विश्वसनीय एंटीवायरस के साथ पूर्ण ऑफ़लाइन स्कैन चलाएं',
          details: 'कंप्यूटर पर Windows Defender या मैलवेयर हटाने वाले टूल का उपयोग करें।',
        },
      ],
    },
    {
      id: 'visited',
      title: 'मैंने केवल लिंक खोला, कोई जानकारी नहीं भरी',
      icon: AlertOctagon,
      severity: 'high',
      summary: 'यदि आपने डेटा दर्ज नहीं किया है तो जोखिम कम है, लेकिन एहतियाती उपाय आवश्यक हैं।',
      steps: [
        {
          id: 'v1',
          action: 'टैब बंद करें और हाल का ब्राउज़र कैश और कुकीज़ साफ़ करें',
          details: 'यह ट्रैकिंग कुकीज़ को ब्राउज़र में बने रहने से रोकता है।',
        },
        {
          id: 'v2',
          action: 'सुनिश्चित करें कि ऑपरेटिंग सिस्टम और ब्राउज़र अपडेटेड हैं',
          details: 'आधुनिक ब्राउज़र सुरक्षित सैंडबॉक्सिंग प्रदान करते हैं।',
        },
        {
          id: 'v3',
          action: 'जांचें कि पृष्ठभूमि में कोई फ़ाइल डाउनलोड तो नहीं हुई',
          details: 'अपने Downloads फ़ोल्डर में किसी भी अज्ञात फ़ाइल (.exe, .apk) को तुरंत हटाएं।',
        },
      ],
    },
  ] : [
    {
      id: 'passwords',
      title: 'I typed my Password or Account Login',
      icon: KeyRound,
      severity: 'critical',
      summary: 'The attacker likely captured your credentials in plain text. Act before they change recovery settings.',
      steps: [
        {
          id: 'p1',
          action: 'Reset password immediately from a clean device or incognito tab',
          details: 'Go directly to the legitimate official portal (do NOT use links in your history) and change your password.',
        },
        {
          id: 'p2',
          action: 'Force sign-out of all active sessions',
          details: 'In account settings, find "Manage devices" or "Security" and terminate all active sessions/tokens.',
        },
        {
          id: 'p3',
          action: 'Enable or regenerate Two-Factor Authentication (2FA)',
          details: 'Switch to an authenticator app (TOTP) or hardware key rather than SMS if available.',
        },
        {
          id: 'p4',
          action: 'Change passwords on other accounts sharing this password',
          details: 'If you reused this password on email, banking, or social media, change those immediately.',
        },
      ],
    },
    {
      id: 'otp',
      title: 'I submitted an SMS OTP or 2FA Code',
      icon: Smartphone,
      severity: 'critical',
      summary: 'Attackers use real-time OTP relays to authorize immediate fund transfers or login sessions.',
      steps: [
        {
          id: 'o1',
          action: 'Call your bank or card issuer emergency line NOW',
          details: 'Request an immediate emergency block on net banking, UPI, and debit cards.',
        },
        {
          id: 'o2',
          action: 'Check recent transaction statements immediately',
          details: 'Verify if any unauthorized debit, beneficiary addition, or virtual card generation occurred.',
        },
        {
          id: 'o3',
          action: 'Dial Cyber Crime Helpline 1930 (India) or your local cyber cell',
          details: 'Reporting within the golden hour enables authorities to freeze funds across banking nodes.',
        },
      ],
    },
    {
      id: 'money',
      title: 'I entered Credit Card details or sent Money',
      icon: CreditCard,
      severity: 'critical',
      summary: 'Card numbers, expiration dates, and CVVs are rapidly monetized on underground forums.',
      steps: [
        {
          id: 'm1',
          action: 'Permanently freeze or hotlist the compromised card via banking app',
          details: 'Toggle off online international transactions and request a replacement card with a new CVV.',
        },
        {
          id: 'm2',
          action: 'File a chargeback / fraud dispute with your card issuer',
          details: 'Supply transaction timestamps and the phishing URL as evidence of deceptive fraud.',
        },
        {
          id: 'm3',
          action: 'Register an official FIR / complaint on national cyber portal',
          details: 'Keep transaction UTR numbers and SMS receipts ready for the investigation record.',
        },
      ],
    },
    {
      id: 'download',
      title: 'I downloaded or ran an unknown file / APK',
      icon: FileWarning,
      severity: 'critical',
      summary: 'Phishing downloads frequently bundle infostealers, RATs, or malicious Android accessibility services.',
      steps: [
        {
          id: 'd1',
          action: 'Disconnect device from Wi-Fi and mobile data immediately',
          details: 'Isolate the device to sever active command-and-control communication channels.',
        },
        {
          id: 'd2',
          action: 'Do not approve accessibility or device admin permissions',
          details: 'If an Android APK asked for Accessibility or SMS read access, uninstall it in Safe Mode.',
        },
        {
          id: 'd3',
          action: 'Run a full offline scan using trusted endpoint security',
          details: 'On desktop, run Windows Defender Offline or dedicated malware removal tools.',
        },
      ],
    },
    {
      id: 'visited',
      title: 'I only opened the link, did not enter data',
      icon: AlertOctagon,
      severity: 'high',
      summary: 'Simply browsing an unvetted page carries lower risk if your browser is up to date, but precautions are advised.',
      steps: [
        {
          id: 'v1',
          action: 'Close the tab and clear recent browser cache & cookies',
          details: 'Prevents tracking beacons or rogue session cookies from persisting in your browser.',
        },
        {
          id: 'v2',
          action: 'Ensure your operating system and browser have latest updates',
          details: 'Modern browser sandboxes protect against drive-by downloads when up to date.',
        },
        {
          id: 'v3',
          action: 'Verify no automatic background downloads started',
          details: 'Check your Downloads folder for unknown .exe, .scr, .iso, or .apk files and delete them.',
        },
      ],
    },
  ];

  const activeScenario = recoveryScenarios.find((s) => s.id === selectedScenarioId) || recoveryScenarios[0];

  const toggleStep = (stepId: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6378]/20 border border-[#FF6378]/40 text-xs text-[#FF6378] mb-4">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>{t.recoveryBadge}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F7FC] tracking-tight mb-2">
          {t.recoveryTitle}
        </h1>
        <p className="text-sm text-[#A8BBCB]">
          {t.recoverySub}
        </p>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {recoveryScenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#153348] border-[#28D7E5] shadow-lg text-[#F2F7FC]'
                  : 'bg-[#10283A] border-[#244155] text-[#A8BBCB] hover:border-[#28D7E5]/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-[#28D7E5]' : 'text-[#A8BBCB]'}`} />
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  sc.severity === 'critical' ? 'bg-[#FF6378]/20 text-[#FF6378]' : 'bg-[#FF9866]/20 text-[#FF9866]'
                }`}>
                  {sc.severity.toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-bold leading-snug">{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE ACTION CHECKLIST */}
      <div className="bg-[#10283A] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-[#244155] pb-4">
          <h2 className="text-xl font-bold text-[#F2F7FC] mb-1">
            {t.containmentChecklistTitle}
          </h2>
          <p className="text-xs text-[#A8BBCB]">{activeScenario.summary}</p>
        </div>

        <div className="space-y-4">
          {activeScenario.steps.map((step, idx) => {
            const isChecked = Boolean(checkedSteps[step.id]);
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-[#35CFA6]/10 border-[#35CFA6]/60 text-[#F2F7FC]'
                    : 'bg-[#0B1F30] border-[#244155] text-[#A8BBCB] hover:border-[#28D7E5]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isChecked
                      ? 'bg-[#35CFA6] border-[#35CFA6] text-[#071521]'
                      : 'border-[#244155] bg-[#10283A]'
                  }`}
                >
                  {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-mono text-[#A8BBCB]">{idx + 1}</span>}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${isChecked ? 'text-[#35CFA6]' : 'text-[#F2F7FC]'}`}>
                    {step.action}
                  </h4>
                  <p className="text-xs text-[#A8BBCB] leading-relaxed">{step.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EMERGENCY REPORTING & OFFICIAL HELPLINE CONTACTS */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#FF6378] uppercase tracking-wider block mb-1">
            {language === 'te' ? 'అధికారిక సంస్థలు & ఆర్థిక హెల్ప్‌లైన్లు' : language === 'hi' ? 'आधिकारिक प्राधिकरण एवं वित्तीय हेल्पलाइन' : 'Official Authorities & Financial Helplines'}
          </span>
          <h3 className="text-lg font-bold text-[#F2F7FC]">
            {t.emergencyHelplinesTitle}
          </h3>
          <p className="text-xs text-[#A8BBCB] mt-1">
            {t.helplineDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* India */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-[#F2F7FC] block">
              {language === 'te' ? 'భారతదేశం — నేషనల్ సైబర్ పోర్టల్' : language === 'hi' ? 'भारत — राष्ट्रीय साइबर पोर्टल' : 'India — MHA Cyber Portal'}
            </span>
            <div className="text-lg font-extrabold text-[#28D7E5] flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>1930</span>
            </div>
            <p className="text-[11px] text-[#A8BBCB]">
              {language === 'te' ? 'జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్ (24/7 పౌర పోర్టల్).' : language === 'hi' ? 'राष्ट्रीय साइबर अपराध हेल्पलाइन (24/7 नागरिक पोर्टल)।' : 'National Cyber Crime Helpline (24/7 Citizen Portal).'}
            </p>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#28D7E5] underline text-[11px] flex items-center gap-1 pt-1"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* United States */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-[#F2F7FC] block">United States — FBI IC3</span>
            <div className="text-sm font-bold text-[#28D7E5]">Internet Crime Complaint Center</div>
            <p className="text-[11px] text-[#A8BBCB]">Official reporting for identity theft, wire fraud & phishing.</p>
            <a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#28D7E5] underline text-[11px] flex items-center gap-1 pt-1"
            >
              <span>ic3.gov portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* International / UK */}
          <div className="bg-[#10283A] border border-[#244155] rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-[#F2F7FC] block">UK — Action Fraud</span>
            <div className="text-sm font-bold text-[#28D7E5]">0300 123 2040</div>
            <p className="text-[11px] text-[#A8BBCB]">National reporting centre for fraud and cyber crime.</p>
            <a
              href="https://www.actionfraud.police.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#28D7E5] underline text-[11px] flex items-center gap-1 pt-1"
            >
              <span>actionfraud.police.uk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
