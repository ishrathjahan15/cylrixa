import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileSearch, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Lock, 
  LogOut, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  logoutUser, 
  createAppointmentBooking, 
  getUserAppointments, 
  cancelUserAppointment 
} from '../services/firebase.js';
import { Appointment, AppointmentServiceType } from '../../shared/types.js';
import { Language, DICTIONARY } from '../utils/i18n.js';
import { AuthModal } from '../components/AuthModal.js';

interface AppointmentBookingPageProps {
  language: Language;
  onNavigate: (tab: string) => void;
  onAnalyzeUrl?: (url: string) => void;
}

export const AppointmentBookingPage: React.FC<AppointmentBookingPageProps> = ({
  language,
  onNavigate,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  
  // Booking form state
  const [serviceType, setServiceType] = useState<AppointmentServiceType>('incident_triage');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 11:00 AM');
  const [userPhone, setUserPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User's booked appointments
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const t = DICTIONARY[language] || DICTIONARY.en;
  const isTe = language === 'te';
  const isHi = language === 'hi';

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserAppointments(user.uid);
      } else {
        setMyAppointments([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserAppointments = async (uid: string) => {
    setLoadingAppointments(true);
    try {
      const records = await getUserAppointments(uid);
      setMyAppointments(records);
    } catch (err: any) {
      console.error('Failed to load appointments from Firestore:', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalMode('signin');
      setIsAuthModalOpen(true);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const booked = await createAppointmentBooking({
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Security Lead',
        userEmail: currentUser.email || '',
        userPhone: userPhone.trim() || undefined,
        serviceType,
        preferredDate,
        preferredTime,
        notes: notes.trim() || undefined,
      });

      setBookingSuccess(booked);
      setNotes('');
      // Refresh list
      fetchUserAppointments(currentUser.uid);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setErrorMessage(
        err.message || 
        (isTe 
          ? 'బుకింగ్ సమయంలో లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి.' 
          : isHi 
          ? 'बुकिंग के दौरान त्रुटि हुई। कृपया पुन: प्रयास करें।' 
          : 'Failed to record appointment. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm(
      isTe ? 'మీరు ఖచ్చితంగా ఈ అపాయింట్‌మెంట్‌ను రద్దు చేయాలనుకుంటున్నారా?' 
      : isHi ? 'क्या आप वाकई इस अपॉइंटमेंट को रद्द करना चाहते हैं?' 
      : 'Are you sure you want to cancel this appointment?'
    )) {
      return;
    }

    try {
      await cancelUserAppointment(id);
      if (currentUser) {
        fetchUserAppointments(currentUser.uid);
      }
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
  };

  const serviceOptions = [
    {
      id: 'incident_triage' as AppointmentServiceType,
      title: isTe ? 'అత్యవసర ఫిషింగ్ సంఘటన ప్రతిస్పందన' : isHi ? 'आपातकालीन फ़िशिंग घटना प्रतिक्रिया' : 'Emergency Incident Triage',
      desc: isTe ? 'క్లిక్ చేసిన అనుమానాస్పద లింకులు, ఆధారాల చౌర్యం & తక్షణ నియంత్రణ' : isHi ? 'क्लिक किए गए संदिग्ध लिंक, क्रेडेंशियल चोरी व त्वरित रोकथाम' : 'Immediate analysis of clicked malicious links, credential theft, & malware downloads',
      icon: AlertTriangle,
      color: 'text-[#FF6378]',
      borderColor: 'border-[#FF6378]/30',
      bgColor: 'bg-[#FF6378]/10',
    },
    {
      id: 'link_audit' as AppointmentServiceType,
      title: isTe ? 'డీప్-డైవ్ లింక్ & డొమైన్ భద్రతా ఆడిట్' : isHi ? 'गहन लिंक व डोमेन सुरक्षा ऑडिट' : 'Deep-Dive Link & Domain Security Audit',
      desc: isTe ? 'హోమోగ్రాఫ్ నకిలీ డొమైన్‌లు, రీడైరెక్ట్ నెట్‌వర్క్‌లు & హానికరమైన స్క్రిప్ట్‌ల విశ్లేషణ' : isHi ? 'होमोग्लिफ नकली डोमेन, पुनर्निर्देशन नेटवर्क व पेलोड का विश्लेषण' : 'Exhaustive heuristic inspection of deceptive homoglyphs, cloaked redirects, & infrastructure',
      icon: FileSearch,
      color: 'text-[#28D7E5]',
      borderColor: 'border-[#28D7E5]/30',
      bgColor: 'bg-[#28D7E5]/10',
    },
    {
      id: 'security_consultation' as AppointmentServiceType,
      title: isTe ? 'సంస్థాగత సైబర్ రక్షణ సంప్రదింపులు' : isHi ? 'संगठनात्मक साइबर रक्षा परामर्श' : 'Organizational Cyber Defense Consultation',
      desc: isTe ? 'బ్రౌజర్ ప్రొటెక్షన్ నిబంధనలు, ఫిషింగ్ అవగాహన & సురక్షిత DNS విధానాలు' : isHi ? 'ब्राउज़र सुरक्षा नीतियां, फ़िशिंग जागरूकता व सुरक्षित डीएनएस रणनीति' : '1-on-1 strategy session on hardening email gateways, browser protections, & user defenses',
      icon: ShieldCheck,
      color: 'text-[#35CFA6]',
      borderColor: 'border-[#35CFA6]/30',
      bgColor: 'bg-[#35CFA6]/10',
    },
    {
      id: 'enterprise_demo' as AppointmentServiceType,
      title: isTe ? 'Clyrixa ప్లాట్‌ఫామ్ & API డెమో' : isHi ? 'Clyrixa प्लेटफ़ॉर्म व एपीआई डेमो' : 'Enterprise Clyrixa Platform Demo',
      desc: isTe ? 'రియల్-టైమ్ API ఇంటిగ్రేషన్, SIEM వెబ్‌హుక్స్ & బ్రౌజర్ ఎక్స్‌టెన్షన్ అమలు' : isHi ? 'रीयल-टाइम एपीआई एकीकरण, SIEM वेबहुक व एंटरप्राइज एक्सटेंशन परिनियोजन' : 'Live demonstration of high-throughput API endpoints, SIEM log forwarding, & extension deployment',
      icon: Users,
      color: 'text-[#F6C453]',
      borderColor: 'border-[#F6C453]/30',
      bgColor: 'bg-[#F6C453]/10',
    },
  ];

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '02:00 PM - 03:00 PM',
    '03:30 PM - 04:30 PM',
    '05:00 PM - 06:00 PM',
  ];

  const minDate = (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10283A] border border-[#28D7E5]/30 text-xs text-[#28D7E5] font-mono mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>CYBER ADVISORY DESK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F7FC] mb-3">
          {t.bookingTitle}
        </h1>
        <p className="text-sm sm:text-base text-[#A8BBCB] leading-relaxed">
          {t.bookingSubtitle}
        </p>
      </div>

      {/* User Auth Status Banner */}
      <div className="mb-8 p-4 rounded-xl bg-[#0B1F30] border border-[#244155] flex flex-col sm:flex-row items-center justify-between gap-4">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#153348] border border-[#28D7E5] flex items-center justify-center text-[#28D7E5] font-bold text-sm">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#F2F7FC]">
                  {currentUser.displayName || 'Security Lead'}
                </span>
                <span className="text-[10px] bg-[#35CFA6]/20 text-[#35CFA6] border border-[#35CFA6]/30 rounded px-1.5 py-0.5 font-mono">
                  {isTe ? 'కనెక్ట్ చేయబడింది' : isHi ? 'सत्यापित' : 'Authenticated'}
                </span>
              </div>
              <p className="text-xs text-[#A8BBCB] font-mono">{currentUser.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10283A] border border-[#FF9866]/40 flex items-center justify-center text-[#FF9866]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F2F7FC]">
                {isTe ? 'అపాయింట్‌మెంట్ బుక్ చేయడానికి సైన్ ఇన్ అవ్వండి' : isHi ? 'अपॉइंटमेंट बुक करने के लिए साइन इन करें' : 'Sign in to book an appointment'}
              </h3>
              <p className="text-xs text-[#A8BBCB]">
                {isTe 
                  ? 'మీ బుకింగ్ రికార్డులను సురక్షితంగా నిల్వ చేయడానికి ఖాతా అవసరం.' 
                  : isHi 
                  ? 'अपनी बुकिंग को सुरक्षित रखने के लिए खाते में साइन इन आवश्यक है।' 
                  : 'Account authentication is required to store your consultation details securely in Firebase.'}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => logoutUser()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#10283A] border border-[#244155] text-[#A8BBCB] hover:text-[#FF6378] hover:border-[#FF6378]/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.btnSignOut}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#10283A] border border-[#244155] text-[#F2F7FC] hover:border-[#28D7E5] hover:text-[#28D7E5] transition-colors"
              >
                {t.btnSignIn}
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#28D7E5] text-[#071521] hover:bg-[#35CFA6] transition-colors"
              >
                {t.btnSignUp}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#F2F7FC] mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#28D7E5]" />
              <span>{isTe ? 'సంప్రదింపు వివరాలు ఎంచుకోండి' : isHi ? 'परामर्श विवरण चुनें' : 'Schedule New Consultation'}</span>
            </h2>
            <p className="text-xs text-[#A8BBCB] mb-6">
              {isTe 
                ? 'మీ సైబర్ భద్రతా అవసరాలకు సరిపోయే సేవను మరియు అనుకూల సమయాన్ని ఎంచుకోండి.' 
                : isHi 
                ? 'अपनी साइबर सुरक्षा आवश्यकताओं के अनुरूप सेवा और सुविधाजनक समय चुनें।' 
                : 'Choose the appropriate advisory scope and your preferred session schedule.'}
            </p>

            {bookingSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#35CFA6]/10 border border-[#35CFA6]/40 text-[#F2F7FC]">
                <div className="flex items-center gap-2 text-[#35CFA6] font-semibold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isTe ? 'అపాయింట్‌మెంట్ విజయవంతంగా నమోదు చేయబడింది!' : isHi ? 'अपॉइंटमेंट सफलतापूर्वक दर्ज हो गया!' : 'Appointment Successfully Confirmed!'}</span>
                </div>
                <p className="text-xs text-[#A8BBCB] mb-2">
                  {isTe 
                    ? `మీ వివరాలు క్లౌడ్ డేటాబేస్‌లో నిల్వ చేయబడ్డాయి. మా భద్రతా నిపుణుడు ${bookingSuccess.preferredDate} న ${bookingSuccess.preferredTime} సమయంలో మిమ్మల్ని సంప్రదిస్తారు.` 
                    : isHi 
                    ? `आपका विवरण क्लाउड डेटाबेस में सुरक्षित हो गया है। हमारे विश्लेषक ${bookingSuccess.preferredDate} को ${bookingSuccess.preferredTime} पर संपर्क करेंगे।` 
                    : `Your consultation is logged in Firebase. Our threat analysts will connect with you on ${bookingSuccess.preferredDate} at ${bookingSuccess.preferredTime}.`}
                </p>
                <div className="text-[11px] font-mono text-[#35CFA6] bg-[#071521] p-2 rounded border border-[#35CFA6]/30 inline-block">
                  Booking ID: {bookingSuccess.id}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-3 rounded-lg bg-[#FF6378]/10 border border-[#FF6378]/40 text-[#FF6378] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Service Selection Cards */}
              <div>
                <label className="block text-xs font-semibold text-[#F2F7FC] mb-2.5">
                  {isTe ? '1. సంప్రదింపు రకం ఎంచుకోండి' : isHi ? '1. परामर्श का प्रकार चुनें' : '1. Select Consultation Scope'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = serviceType === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setServiceType(opt.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#153348] border-[#28D7E5] shadow-lg shadow-[#28D7E5]/10'
                            : 'bg-[#071521]/60 border-[#244155] hover:border-[#A8BBCB]/40'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className={`p-2 rounded-lg ${opt.bgColor} ${opt.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#F2F7FC]">{opt.title}</h4>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#A8BBCB] leading-relaxed">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F2F7FC] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#28D7E5]" />
                    <span>{isTe ? '2. తేదీ ఎంచుకోండి' : isHi ? '2. तारीख चुनें' : '2. Preferred Date'}</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F2F7FC] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#28D7E5]" />
                    <span>{isTe ? '3. సమయ స్లాట్' : isHi ? '3. समय स्लॉट' : '3. Preferred Time Slot'}</span>
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#F2F7FC] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#28D7E5]" />
                  <span>{isTe ? 'సంప్రదింపు ఫోన్ నంబర్ (ఐచ్ఛికం)' : isHi ? 'संपर्क फोन नंबर (वैकल्पिक)' : 'Contact Phone (Optional)'}</span>
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/40 focus:outline-none focus:border-[#28D7E5]"
                />
              </div>

              {/* Notes / Suspicious URLs */}
              <div>
                <label className="block text-xs font-semibold text-[#F2F7FC] mb-1.5">
                  {isTe 
                    ? 'విశ్లేషించవలసిన లింకులు లేదా సంఘటన వివరాలు' 
                    : isHi 
                    ? 'विश्लेषण के लिए संदिग्ध लिंक या घटना विवरण' 
                    : 'Suspicious Links / Incident Context'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isTe 
                      ? 'ఉదా: https://bank-verify.xyz వంటి లింక్ SMS ద్వారా వచ్చింది, పాస్‌వర్డ్ నమోదు చేయలేదు...' 
                      : isHi 
                      ? 'उदा: https://bank-verify.xyz एसएमएस से मिला, पासवर्ड दर्ज नहीं किया...' 
                      : 'e.g. Received SMS with http://secure-paypal-login.tk claiming account lock; clicked link on mobile...'
                  }
                  className="w-full px-3 py-2.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/40 focus:outline-none focus:border-[#28D7E5]"
                />
              </div>

              {/* Submit CTA */}
              <div>
                {currentUser ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-sm hover:bg-[#35CFA6] transition-all shadow-lg shadow-[#28D7E5]/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[#071521] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>{t.bookConsultationBtn}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalMode('signin');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-sm hover:bg-[#35CFA6] transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isTe ? 'బుకింగ్ చేయడానికి ముందుగా సైన్ ఇన్ అవ్వండి' : isHi ? 'बुकिंग के लिए पहले साइन इन करें' : 'Sign In or Create Account to Book'}</span>
                    </button>
                    <p className="text-[11px] text-center text-[#A8BBCB]">
                      {isTe ? 'ఒక్క క్లిక్‌తో Google ద్వారా లేదా ఈమెయిల్‌తో తక్షణమే ఖాతా తెరవండి.' : isHi ? 'Google या ईमेल के साथ तुरंत खाता बनाएं।' : 'Instant signup via Google or Email to store and track your advisory appointments.'}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: User's Bookings and Advisory Scope */}
        <div className="lg:col-span-5 space-y-6">
          {/* User's Appointments List */}
          <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#F2F7FC] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#28D7E5]" />
                <span>{t.myBookings}</span>
              </h3>
              <span className="text-xs font-mono text-[#28D7E5] bg-[#10283A] px-2 py-0.5 rounded border border-[#244155]">
                {myAppointments.length} {isTe ? 'నమోదులు' : isHi ? 'रिकॉर्ड' : 'Bookings'}
              </span>
            </div>

            {!currentUser ? (
              <div className="p-6 rounded-lg bg-[#071521]/60 border border-[#244155] text-center text-xs text-[#A8BBCB]">
                <Lock className="w-8 h-8 text-[#A8BBCB]/40 mx-auto mb-2" />
                <p className="mb-3">
                  {isTe 
                    ? 'మీ షెడ్యూల్ చేసిన అపాయింట్‌మెంట్‌లను వీక్షించడానికి లాగిన్ అవ్వండి.' 
                    : isHi 
                    ? 'अपनी निर्धारित बुकिंग देखने के लिए साइन इन करें।' 
                    : 'Sign in to view and manage your booked appointments.'}
                </p>
                <button
                  onClick={() => {
                    setAuthModalMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#153348] border border-[#28D7E5]/40 text-[#28D7E5] font-semibold text-xs hover:bg-[#10283A] transition-colors"
                >
                  {t.btnSignIn}
                </button>
              </div>
            ) : loadingAppointments ? (
              <div className="p-8 text-center text-xs text-[#A8BBCB]">
                <div className="w-6 h-6 border-2 border-[#28D7E5] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>{isTe ? 'డేటాబేస్ నుండి లోడ్ అవుతోంది...' : isHi ? 'डेटाबेस से लोड हो रहा है...' : 'Loading bookings from Firestore...'}</span>
              </div>
            ) : myAppointments.length === 0 ? (
              <div className="p-6 rounded-lg bg-[#071521]/60 border border-[#244155] text-center text-xs text-[#A8BBCB]">
                <Calendar className="w-8 h-8 text-[#A8BBCB]/30 mx-auto mb-2" />
                <p>
                  {isTe 
                    ? 'ఇంకా ఎలాంటి సంప్రదింపులు బుక్ చేయబడలేదు. ఎడమవైపు ఫారమ్ ద్వారా బుక్ చేయండి.' 
                    : isHi 
                    ? 'अभी तक कोई परामर्श बुक नहीं किया गया है। बाईं ओर फॉर्म से बुक करें।' 
                    : 'No appointments scheduled yet. Use the form to book your first security consultation.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {myAppointments.map((apt) => {
                  const isCancelled = apt.status === 'cancelled';
                  const isConfirmed = apt.status === 'confirmed';
                  return (
                    <div
                      key={apt.id}
                      className={`p-3.5 rounded-lg border text-xs transition-colors ${
                        isCancelled
                          ? 'bg-[#071521]/40 border-[#244155]/60 opacity-60'
                          : 'bg-[#071521] border-[#244155] hover:border-[#28D7E5]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-bold text-[#F2F7FC]">
                            {apt.serviceType === 'incident_triage' ? (isTe ? 'అత్యవసర సంఘటన ప్రతిస్పందన' : isHi ? 'आपातकालीन घटना प्रतिक्रिया' : 'Incident Triage') :
                             apt.serviceType === 'link_audit' ? (isTe ? 'లింక్ & డొమైన్ ఆడిట్' : isHi ? 'लिंक व डोमेन ऑडिट' : 'Link & Domain Audit') :
                             apt.serviceType === 'enterprise_demo' ? (isTe ? 'ఎంటర్‌ప్రైజ్ ప్లాట్‌ఫామ్ డెమో' : isHi ? 'एंटरप्राइज प्लेटफॉर्म डेमो' : 'Enterprise Demo') :
                             (isTe ? 'సైబర్ రక్షణ సంప్రదింపులు' : isHi ? 'साइबर रक्षा परामर्श' : 'Security Consultation')}
                          </span>
                          <div className="text-[11px] text-[#A8BBCB] font-mono mt-0.5">
                            {apt.preferredDate} • {apt.preferredTime}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                            isCancelled
                              ? 'bg-[#FF6378]/20 text-[#FF6378]'
                              : isConfirmed
                              ? 'bg-[#35CFA6]/20 text-[#35CFA6]'
                              : 'bg-[#F6C453]/20 text-[#F6C453]'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-[#A8BBCB] italic bg-[#0B1F30] p-2 rounded border border-[#244155] mb-2 line-clamp-2">
                          "{apt.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[#244155]/60 text-[10px] text-[#A8BBCB]">
                        <span className="font-mono">ID: {apt.id.substring(0, 16)}</span>
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="text-[#FF6378] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>{isTe ? 'రద్దు చేయండి' : isHi ? 'रद्द करें' : 'Cancel'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Scanner Promotion Card */}
          <div className="bg-[#10283A] border border-[#28D7E5]/30 rounded-xl p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#28D7E5]/10 text-[#28D7E5]">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F2F7FC] mb-1">
                  {isTe ? 'తక్షణమే లింక్ తనిఖీ చేయాలా?' : isHi ? 'तुरंत लिंक की जांच करनी है?' : 'Need Immediate Link Verification?'}
                </h4>
                <p className="text-xs text-[#A8BBCB] mb-3 leading-relaxed">
                  {isTe 
                    ? 'మీ సంప్రదింపు సమయం వచ్చేలోపు, మా ఆటోమేటెడ్ మల్టీ-ఇంజిన్ స్కానర్ ద్వారా మీ లింక్‌ను ఇప్పుడే విశ్లేషించండి.' 
                    : isHi 
                    ? 'अपने परामर्श समय से पहले, हमारे स्वचालित मल्टी-इंजन स्कैनर से अभी लिंक का विश्लेषण करें।' 
                    : 'While awaiting your appointment, test suspicious links against our zero-trust heuristic & brand impersonation engines.'}
                </p>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-colors cursor-pointer"
                >
                  <span>{isTe ? 'స్కానర్ ప్రారంభించండి' : isHi ? 'स्कैनर खोलें' : 'Open Clyrixa Scanner'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        language={language}
        onSuccess={() => {
          if (currentUser) {
            fetchUserAppointments(currentUser.uid);
          }
        }}
      />
    </div>
  );
};
