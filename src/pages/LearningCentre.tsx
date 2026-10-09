import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw
} from 'lucide-react';
import { DICTIONARY, Language } from '../utils/i18n.js';

interface LearningCentreProps {
  language: Language;
}

interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LearningCentre: React.FC<LearningCentreProps> = ({ language }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const t = DICTIONARY[language] || DICTIONARY.en;

  const quizQuestions: QuizQuestion[] = language === 'te' ? [
    {
      id: 1,
      scenario: 'మీకు మీ PayPal ఖాతాలో అనధికారిక ఛార్జ్ జరిగిందని ఒక SMS వచ్చింది. అందులోని లింక్: "https://paypal.com.security-verify.tk/login". అసలైన గమ్యస్థాన వెబ్‌సైట్ ఏది?',
      options: [
        'paypal.com (ఎందుకంటే ప్రోటోకాల్ తర్వాత వెంటనే paypal.com కనిపిస్తుంది)',
        'security-verify.tk (ఎందుకంటే .tk అనేది TLD మరియు security-verify అనేది అసలైన నమోదిత డొమైన్)',
        'రెండు డొమైన్‌లు ధృవీకరించబడిన పద్ధతిలో సహకరిస్తున్నాయి',
        'ఇది PayPal Inc. నిర్వహించే అధికారిక సబ్‌డొమైన్'
      ],
      correctIndex: 1,
      explanation: 'సరైనది! బ్రౌజర్‌లు హోస్ట్‌నేమ్‌లను కుడి నుండి ఎడమకు చదువుతాయి. అసలైన నమోదిత డొమైన్ "security-verify.tk". "paypal.com" అనేది కేవలం వినియోగదారులను మోసగించడానికి ఏర్పాటు చేసిన నకిలీ సబ్‌డొమైన్ మాత్రమే.'
    },
    {
      id: 2,
      scenario: 'బ్రౌజర్ చిరునామా పట్టీలో వెబ్‌సైట్‌కు ఆకుపచ్చ ప్యాడ్‌లాక్ గుర్తు మరియు సరైన HTTPS ఉంది. ఇది ఆ వెబ్‌సైట్ సురక్షితమైనదని మరియు ఫిషింగ్ కాదని నిరూపిస్తుందా?',
      options: [
        'అవును, HTTPS వెబ్‌సైట్ యజమాని గుర్తింపును సెక్యూరిటీ అధికారులు పరిశీలించారని హామీ ఇస్తుంది',
        'కాదు, HTTPS డేటా ట్రాఫిక్‌ను మాత్రమే గుప్తీకరిస్తుంది; దాడి చేసేవారు నకిలీ సైట్‌ల కోసం కూడా ఉచిత సర్టిఫికెట్లను సులభంగా పొందుతారు',
        'సర్టిఫికేట్ గడువు ముగియనంత కాలం అవును',
        'అవును, ఎందుకంటే బ్రౌజర్‌లు విశ్వసనీయం కాని ఫిషింగ్ పోర్టల్‌లను HTTPS వాడకుండా అడ్డుకుంటాయి'
      ],
      correctIndex: 1,
      explanation: 'సరైనది! ప్యాడ్‌లాక్ గుర్తు కేవలం మీ మరియు సర్వర్ మధ్య కమ్యూనికేషన్ ఎన్‌క్రిప్ట్ చేయబడిందని మాత్రమే సూచిస్తుంది. నేడు 80% పైగా ఫిషింగ్ వెబ్‌సైట్‌లు ఉచిత సర్టిఫికెట్లను కలిగి ఉంటున్నాయి.'
    },
    {
      id: 3,
      scenario: '"హోమోగ్రాఫ్" దాడి (IDN homograph attack) అంటే ఏమిటి?',
      options: [
        'వెబ్‌సైట్ క్రాష్ అయ్యే వరకు మిలియన్ల కొద్దీ ఆటోమేటెడ్ రిక్వెస్ట్‌లను పంపడం',
        'సాధారణ లాటిన్ అక్షరాల వలె కనిపించే ఇతర భాషల (సిరిల్లిక్ లేదా గ్రీకు) అక్షరాలను ఉపయోగించి డొమైన్‌ను నమోదు చేయడం',
        'కంపెనీ CEO పంపినట్లుగా నటించే నకిలీ ఈమెయిల్‌ను పంపడం',
        'పాస్‌వర్డ్‌లను ఊహించడానికి మాల్వేర్ ప్రోగ్రామ్‌ను ఉపయోగించడం'
      ],
      correctIndex: 1,
      explanation: 'సరైనది! దాడి చేసేవారు మానవ కంటికి ఒకేలా కనిపించే వివిధ యూనీకోడ్ అక్షరాలను నమోదు చేస్తారు. ఉదాహరణకు సిరిల్లిక్ "а" మరియు లాటిన్ "a" కంప్యూటర్‌కు పూర్తిగా వేర్వేరు సర్వర్‌లను సూచిస్తాయి.'
    },
    {
      id: 4,
      scenario: 'మీకు ఒక అత్యవసర SMS వచ్చింది: "కరెంట్ బిల్లు చెల్లించనందున ఈ రాత్రి 9:30 గంటలకు విద్యుత్ నిలిపివేయబడుతుంది. వెంటనే http://bit.ly/power-bill-pay క్లిక్ చేయండి". ఇందులో అతిపెద్ద ప్రమాద సంకేతం ఏది?',
      options: [
        'పేర్కొన్న సమయం (9:30 PM) ఆఫీస్ సమయాలు ముగిసిన తర్వాత ఉండటం',
        'భయాన్ని రేకెత్తించే కృత్రిమ అత్యవసర ఒత్తిడి మరియు దాచిన షార్ట్‌నర్ లింక్ (bit.ly)',
        'బిల్లులో ఖచ్చితమైన రూపాయల మొత్తం లేకపోవడం',
        'విద్యుత్ శాఖ ఎప్పుడూ మెసేజ్‌లు పంపదు'
      ],
      correctIndex: 1,
      explanation: 'సరైనది! సైబర్ నేరగాళ్లు భయం మరియు ఆందోళన కలిగించడానికి కృత్రిమ అత్యవసర సమయాన్ని ఉపయోగిస్తారు, తద్వారా మీరు ఆలోచించకుండా క్లిక్ చేస్తారు. షార్ట్‌నర్ లింక్‌లు అసలు వెబ్‌సైట్‌ను దాచిపెడతాయి.'
    },
    {
      id: 5,
      scenario: '"క్విషింగ్" (Quishing) అంటే ఏమిటి?',
      options: [
        'బ్యాంకింగ్ పిన్‌లను సంగ్రహించడానికి వాయిస్ మెసేజ్‌లను ఉపయోగించడం',
        'ఈమెయిల్ టెక్స్ట్ ఫిల్టర్‌ల నుండి ఫిషింగ్ లింక్‌లను దాచడానికి హానికరమైన QR కోడ్‌లను ఉపయోగించడం',
        'పాత బ్రౌజర్ వెర్షన్‌లలోని సాఫ్ట్‌వేర్ లోపం',
        'సోషల్ మీడియా ఖాతాలలో 2-ఫాక్టర్ అథెంటికేషన్‌ను దాటవేసే పద్ధతి'
      ],
      correctIndex: 1,
      explanation: 'సరైనది! క్విషింగ్ అనేది QR కోడ్ ఆధారిత ఫిషింగ్. ఈమెయిల్ సెక్యూరిటీ గేట్‌వేలు ప్రధానంగా టెక్స్ట్‌ను స్కాన్ చేస్తాయి కాబట్టి, QR కోడ్‌ల ద్వారా హానికరమైన లింక్‌లను వినియోగదారుల మొబైల్‌లకు చేరవేస్తారు.'
    }
  ] : language === 'hi' ? [
    {
      id: 1,
      scenario: 'आपको एक संदेश मिला कि आपके PayPal खाते पर अनधिकृत शुल्क लगा है। लिंक है: "https://paypal.com.security-verify.tk/login"। वास्तविक गंतव्य वेबसाइट कौन सी है?',
      options: [
        'paypal.com (क्योंकि प्रोटोकॉल के तुरंत बाद paypal.com दिखाई देता है)',
        'security-verify.tk (क्योंकि .tk TLD है और security-verify वास्तविक पंजीकृत डोमेन है)',
        'दोनों डोमेन सत्यापित साझेदारी में काम कर रहे हैं',
        'यह PayPal Inc. का आधिकारिक सबडोमेन है'
      ],
      correctIndex: 1,
      explanation: 'सही! ब्राउज़र होस्टनेम को दाएं से बाएं पढ़ते हैं। वास्तविक डोमेन "security-verify.tk" है, जबकि "paypal.com" हमलावर द्वारा आंखों को धोखा देने के लिए बनाया गया नकली सबडोमेन है।'
    },
    {
      id: 2,
      scenario: 'ब्राउज़र एड्रेस बार में वेबसाइट पर हरा पैडलॉक आइकन और वैध HTTPS दिखाई देता है। क्या यह साबित करता है कि वेबसाइट असली है और फ़िशिंग नहीं?',
      options: [
        'हाँ, HTTPS गारंटी देता है कि वेबसाइट मालिक की जांच सुरक्षा अधिकारियों द्वारा की गई है',
        'नहीं, HTTPS केवल डेटा को एन्क्रिप्ट करता है; हमलावर नकली वेबसाइटों के लिए आसानी से मुफ्त प्रमाणपत्र प्राप्त कर लेते हैं',
        'हाँ, जब तक प्रमाणपत्र समाप्त नहीं हुआ है',
        'हाँ, क्योंकि ब्राउज़र अविश्वसनीय साइटों को HTTPS का उपयोग करने से रोकते हैं'
      ],
      correctIndex: 1,
      explanation: 'सही! पैडलॉक केवल यह दर्शाता है कि डेटा संचार एन्क्रिप्टेड है। आज 80% से अधिक सक्रिय फ़िशिंग वेबसाइटें मुफ़्त HTTPS प्रमाणपत्रों का उपयोग करती हैं।'
    },
    {
      id: 3,
      scenario: '"होमोग्राफ" हमला (IDN homograph attack) क्या है?',
      options: [
        'वेबसाइट क्रैश होने तक लाखों स्वचालित अनुरोध भेजना',
        'लैटिन अक्षरों के समान दिखने वाले विदेशी वर्णों (सिरिलिक या ग्रीक) का उपयोग करके डोमेन पंजीकृत करना',
        'कंपनी के सीईओ के नाम पर नकली ईमेल भेजना',
        'डिफ़ॉल्ट पासवर्ड का अनुमान लगाने के लिए मैलवेयर का उपयोग करना'
      ],
      correctIndex: 1,
      explanation: 'सही! हमलावर ऐसे यूनिकोड वर्णों का उपयोग करते हैं जो मानवीय आंखों को समान दिखते हैं (जैसे सिरिलिक "а" और अंग्रेजी "a")। कंप्यूटर के लिए ये दो बिल्कुल अलग सर्वर हैं।'
    },
    {
      id: 4,
      scenario: 'आपको एक तात्कालिक संदेश मिला: "बिजली बिल न भरने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत http://bit.ly/power-bill-pay पर क्लिक करें"। इसमें सबसे बड़ा चेतावनी संकेत क्या है?',
      options: [
        'उल्लिखित समय (9:30 PM) सामान्य कार्यालय समय के बाद है',
        'कृत्रिम तात्कालिकता का दबाव ("आज रात") और एक छुपा हुआ संक्षिप्त लिंक (bit.ly)',
        'बिल में सटीक राशि नहीं लिखी है',
        'बिजली कंपनियां कभी संदेश नहीं भेजतीं'
      ],
      correctIndex: 1,
      explanation: 'सही! धोखेबाज चिंता पैदा करने के लिए कृत्रिम तात्कालिकता पैदा करते हैं ताकि आप बिना सोचे क्लिक कर दें। शॉर्टनर लिंक असली गंतव्य को छिपाते हैं।'
    },
    {
      id: 5,
      scenario: '"क्विशिंग" (Quishing) क्या है?',
      options: [
        'बैंकिंग पिन निकालने के लिए वॉयस मैसेज का उपयोग करना',
        'ईमेल टेक्स्ट फिल्टर से फ़िशिंग लिंक छिपाने के लिए दुर्भावनापूर्ण क्यूआर कोड का उपयोग करना',
        'पुराने ब्राउज़र संस्करणों में एक बग',
        'ट्विटर पर टू-फैक्टर ऑथेंटिकेशन को बायपास करने की तकनीक'
      ],
      correctIndex: 1,
      explanation: 'सही! क्विशिंग (QR Code Phishing) में इमेज के अंदर लिंक छुपाया जाता है, जिससे सुरक्षा फिल्टर इसे पकड़ नहीं पाते और उपयोगकर्ता मोबाइल पर असुरक्षित लिंक खोल बैठते हैं।'
    }
  ] : [
    {
      id: 1,
      scenario: 'You receive a text claiming your PayPal account has an unauthorized charge. The link provided is: "https://paypal.com.security-verify.tk/login". What is the true destination website?',
      options: [
        'paypal.com (because "paypal.com" appears immediately after the protocol)',
        'security-verify.tk (because .tk is the top-level domain and security-verify is the registrable domain)',
        'Both domains are cooperating through verified authentication',
        'It is an official subdomain hosted by PayPal Inc.'
      ],
      correctIndex: 1,
      explanation: 'Correct! Browsers parse hostnames from right to left. The registrable domain is "security-verify.tk", while "paypal.com" is merely a deceptive subdomain chosen by the attacker to fool mobile viewers.'
    },
    {
      id: 2,
      scenario: 'A website has a green padlock icon and valid HTTPS in your browser address bar. Does this prove the website is authentic and not a phishing scam?',
      options: [
        'Yes, HTTPS guarantees that the website owners identity has been vetted by security authorities',
        'No, HTTPS only encrypts the connection against eavesdropping; phishers easily obtain free certificates for fake websites',
        'Yes, as long as the certificate has not expired',
        'Yes, because browsers automatically block untrusted phishing portals from using HTTPS'
      ],
      correctIndex: 1,
      explanation: 'Correct! A padlock only means the data is encrypted in transit between you and the server. Today, over 80% of active phishing websites use legitimate HTTPS certificates obtained automatically from free certificate authorities.'
    },
    {
      id: 3,
      scenario: 'What is a "Homoglyph" attack (also known as IDN homograph spoofing)?',
      options: [
        'Flooding a website with millions of automated requests until it crashes',
        'Registering a domain using foreign alphabets (like Cyrillic "а" or Greek "о") that look identical to standard Latin characters',
        'Sending an email that pretends to be from your company CEO',
        'Using a malware program to guess default passwords'
      ],
      correctIndex: 1,
      explanation: 'Correct! Attackers exploit Unicode by registering characters that appear visually indistinguishable to the human eye. To the computer, Cyrillic "а" (U+0430) has a different numerical value and points to an entirely different server.'
    },
    {
      id: 4,
      scenario: 'You receive an urgent SMS: "Electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Click http://bit.ly/power-bill-pay immediately". What is the biggest warning sign here?',
      options: [
        'The time stated (9:30 PM) is after normal business hours',
        'The combination of artificial urgency ("tonight") and a concealed shortened link (bit.ly) bypassing official billing channels',
        'The bill does not specify the exact rupee amount',
        'Power utilities never use text messages for any reason'
      ],
      correctIndex: 1,
      explanation: 'Correct! Scammers weaponize artificial urgency to trigger anxiety, preventing critical thinking. They use shortened URLs so you cannot see the suspicious unverified destination until it is clicked.'
    },
    {
      id: 5,
      scenario: 'What is "Quishing"?',
      options: [
        'Using quiet voice messages to extract banking pins',
        'Using malicious QR codes to disguise phishing links from traditional email and network text filters',
        'A software bug in old Chromium browser versions',
        'A technique to bypass two-factor authentication on Twitter'
      ],
      correctIndex: 1,
      explanation: 'Correct! Quishing (QR code phishing) hides hyperlinks inside 2D matrix images. Because security email gateways primarily scan text, QR codes often slip through and trick victims into opening unvetted links on their mobile phones.'
    }
  ];

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    return quizQuestions.reduce((score, q) => {
      return selectedAnswers[q.id] === q.correctIndex ? score + 1 : score;
    }, 0);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = calculateScore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#153348] border border-[#28D7E5]/40 text-xs text-[#28D7E5] mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t.academyBadge}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F7FC] tracking-tight mb-2">
          {t.learnTitle}
        </h1>
        <p className="text-sm text-[#A8BBCB]">
          {t.learnSub}
        </p>
      </div>

      {/* CORE EDUCATIONAL MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1 */}
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#0B1F30] border border-[#28D7E5] text-[#28D7E5] flex items-center justify-center text-xs font-bold font-mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#F2F7FC]">{t.module1Title}</h3>
          <p className="text-xs text-[#A8BBCB] leading-relaxed">
            {t.module1Desc}
          </p>
          <div className="bg-[#0B1F30] p-2.5 rounded border border-[#244155] text-xs font-mono space-y-1">
            <span className="text-[#A8BBCB] line-through block">paypal.com.evil-portal.tk</span>
            <span className="text-[#35CFA6] font-semibold block">paypal.com (Official)</span>
          </div>
        </div>

        {/* Module 2 */}
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#0B1F30] border border-[#35CFA6] text-[#35CFA6] flex items-center justify-center text-xs font-bold font-mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#F2F7FC]">{t.module2Title}</h3>
          <p className="text-xs text-[#A8BBCB] leading-relaxed">
            {t.module2Desc}
          </p>
          <div className="bg-[#0B1F30] p-2.5 rounded border border-[#244155] text-xs space-y-1">
            <span className="text-[#F2F7FC] block">Padlock = Encrypted wire</span>
            <span className="text-[#FF6378] block">≠ Legitimate identity</span>
          </div>
        </div>

        {/* Module 3 */}
        <div className="bg-[#10283A] border border-[#244155] rounded-xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#0B1F30] border border-[#8B7CFF] text-[#8B7CFF] flex items-center justify-center text-xs font-bold font-mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#F2F7FC]">{t.module3Title}</h3>
          <p className="text-xs text-[#A8BBCB] leading-relaxed">
            {t.module3Desc}
          </p>
          <div className="bg-[#0B1F30] p-2.5 rounded border border-[#244155] text-xs space-y-1">
            <span className="text-[#A8BBCB] block">paypal.com (Latin)</span>
            <span className="text-[#FF6378] block">pаypal.com (Cyrillic а)</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE PHISHING AWARENESS QUIZ */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#244155] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#F2F7FC] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#28D7E5]" />
              <span>{t.quizTitle}</span>
            </h2>
            <p className="text-xs text-[#A8BBCB] mt-1">
              {t.quizSub}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {showResults && (
              <button
                onClick={resetQuiz}
                className="px-3 py-1.5 rounded bg-[#10283A] border border-[#244155] text-xs text-[#A8BBCB] hover:text-[#F2F7FC] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btnRetryQuiz}</span>
              </button>
            )}
            <span className="text-xs font-mono text-[#28D7E5] bg-[#10283A] px-3 py-1.5 rounded border border-[#244155]">
              {Object.keys(selectedAnswers).length} / {quizQuestions.length} {language === 'te' ? 'పూర్తయ్యాయి' : language === 'hi' ? 'उत्तर दिए' : 'Answered'}
            </span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {quizQuestions.map((q, qIndex) => {
            const hasAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`bg-[#10283A] border rounded-xl p-5 space-y-4 transition-all ${
                  showResults
                    ? isCorrect
                      ? 'border-[#35CFA6]/60 bg-[#35CFA6]/5'
                      : 'border-[#FF6378]/60 bg-[#FF6378]/5'
                    : 'border-[#244155]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-[#F2F7FC] leading-relaxed">
                    <span className="text-[#28D7E5] font-mono mr-2">Q{qIndex + 1}.</span>
                    {q.scenario}
                  </h4>
                  {showResults && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-[#35CFA6]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#FF6378]" />
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isTheCorrectOption = optIdx === q.correctIndex;

                    let btnStyle = 'bg-[#0B1F30] border-[#244155] text-[#A8BBCB] hover:border-[#28D7E5]/50';
                    if (showResults) {
                      if (isTheCorrectOption) {
                        btnStyle = 'bg-[#35CFA6]/20 border-[#35CFA6] text-[#35CFA6] font-semibold';
                      } else if (isSelected && !isTheCorrectOption) {
                        btnStyle = 'bg-[#FF6378]/20 border-[#FF6378] text-[#FF6378]';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#153348] border-[#28D7E5] text-[#F2F7FC] font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={showResults}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isSelected && !showResults && (
                          <span className="w-2 h-2 rounded-full bg-[#28D7E5]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="border-t border-[#244155] pt-3 text-xs text-[#F2F7FC] leading-relaxed bg-[#0B1F30] p-3 rounded">
                    <strong className="text-[#28D7E5] block mb-1">
                      {language === 'te' ? 'నిపుణుల భద్రతా విశ్లేషణ:' : language === 'hi' ? 'विशेषज्ञ सुरक्षा विश्लेषण:' : 'Expert Security Analysis:'}
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Button or Results Banner */}
        <div className="pt-4 border-t border-[#244155]">
          {!showResults ? (
            <div className="flex justify-end">
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="px-6 py-2.5 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-sm hover:bg-[#35CFA6] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-[#28D7E5]/20"
              >
                {t.btnSubmitQuiz}
              </button>
            </div>
          ) : (
            <div className="bg-[#10283A] border border-[#28D7E5]/50 rounded-xl p-6 text-center space-y-3">
              <span className="text-xs font-semibold text-[#A8BBCB] uppercase tracking-wider block">
                {language === 'te' ? 'మీ ఫిషింగ్ డిఫెన్స్ రేటింగ్' : language === 'hi' ? 'आपकी फ़िशिंग सुरक्षा रेटिंग' : 'Your Phishing Defense Rating'}
              </span>
              <div className="text-3xl font-extrabold text-[#F2F7FC]">
                {score} / {quizQuestions.length} {language === 'te' ? 'సరైనవి' : language === 'hi' ? 'सही' : 'Correct'}
              </div>
              <p className="text-xs text-[#A8BBCB] max-w-md mx-auto">
                {score === 5
                  ? (language === 'te' ? 'అద్భుతం! సబ్‌డొమైన్‌లు మరియు ఒత్తిడి మోసాలను గుర్తించడంలో మీకు అద్భుతమైన ప్రతిభ ఉంది.' : language === 'hi' ? 'उत्कृष्ट! सबडोमेन और भ्रामक दबाव को पहचानने में आपके पास बेहतरीन कौशल है।' : 'Outstanding! You have elite instincts for spotting subdomains, homoglyphs, and urgency coercion.')
                  : score >= 3
                  ? (language === 'te' ? 'మంచి పురోగతి! మరిన్ని సూక్ష్మ హోమోగ్రాఫ్ మరియు TLD మోసాలపై అవగాహన పెంచుకోండి.' : language === 'hi' ? 'अच्छा प्रयास! सूक्ष्म होमोग्राफ और TLD ट्रिक्स से सुरक्षा के लिए विवरणों की समीक्षा करें।' : 'Solid foundation! Review the explanations above to sharpen your defense against subtle homoglyph and TLD tricks.')
                  : (language === 'te' ? 'క్లిక్ చేసేముందు ఆలోచించే అలవాటును పెంచుకోవడానికి క్లైరిక్సా సహాయంతో సాధన కొనసాగించండి.' : language === 'hi' ? 'क्लिक करने से पहले सतर्क रहने की आदत बनाने के लिए अभ्यास जारी रखें।' : 'Great practice session! Keep exploring Clyrixa to build automatic intuition before you click.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
