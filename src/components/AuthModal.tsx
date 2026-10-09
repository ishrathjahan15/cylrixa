import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  signInWithGoogle 
} from '../services/firebase.js';
import { Language, DICTIONARY } from '../utils/i18n.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
  language,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = DICTIONARY[language] || DICTIONARY.en;

  const isTe = language === 'te';
  const isHi = language === 'hi';

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccessMsg(null);
  };

  const mapAuthError = (err: any): string => {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/email-already-in-use') {
      return isTe 
        ? 'ఈ ఈమెయిల్‌తో ఇప్పటికే ఖాతా ఉంది. దయచేసి లాగిన్ అవ్వండి.'
        : isHi 
        ? 'इस ईमेल के साथ पहले से ही एक खाता मौजूद है। कृपया साइन इन करें।'
        : 'An account with this email already exists. Please sign in.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return isTe 
        ? 'చెల్లని ఈమెయిల్ లేదా పాస్‌వర్డ్. దయచేసి సరిచూసుకోండి.'
        : isHi 
        ? 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।'
        : 'Invalid email or password. Please verify your credentials.';
    }
    if (code === 'auth/weak-password') {
      return isTe 
        ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.'
        : isHi 
        ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
        : 'Password must be at least 6 characters.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return isTe 
        ? 'Google సైన్-ఇన్ పాప్-అప్ మూసివేయబడింది.'
        : isHi 
        ? 'Google साइन-इन पॉपअप बंद कर दिया गया।'
        : 'Google sign-in popup was cancelled.';
    }
    return message || (isTe ? 'ప్రామాణీకరణ లోపం సంభవించింది.' : isHi ? 'प्रमाणीकरण त्रुटि हुई।' : 'Authentication failed. Please try again.');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setError(isTe ? 'దయచేసి ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.' : isHi ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError(isTe ? 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.' : isHi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
        return;
      }
      if (password.length < 6) {
        setError(isTe ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.' : isHi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError(isTe ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.' : isHi ? 'पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await registerWithEmail(email, password, name);
        setSuccessMsg(isTe ? 'ఖాతా విజయవంతంగా సృష్టించబడింది!' : isHi ? 'खाता सफलतापूर्वक बनाया गया!' : 'Account created successfully!');
      } else {
        await loginWithEmail(email, password);
        setSuccessMsg(isTe ? 'విజయవంతంగా లాగిన్ అయ్యారు!' : isHi ? 'सफलतापूर्वक साइन इन हुआ!' : 'Signed in successfully!');
      }

      setTimeout(() => {
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      }, 600);
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccessMsg(isTe ? 'Google తో విజయవంతంగా లాగిన్ అయ్యారు!' : isHi ? 'Google से सफलतापूर्वक साइन इन हुआ!' : 'Signed in with Google successfully!');
      setTimeout(() => {
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      }, 600);
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0B1F30] border border-[#244155] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#071521] border-b border-[#244155] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10283A] border border-[#28D7E5]/40 flex items-center justify-center text-[#28D7E5]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F2F7FC]">
                {mode === 'signin' ? t.btnSignIn : t.btnSignUp}
              </h2>
              <p className="text-[11px] text-[#A8BBCB]">
                {isTe 
                  ? 'భద్రతా సలహా మరియు అపాయింట్‌మెంట్ బుకింగ్ కోసం'
                  : isHi 
                  ? 'सुरक्षा परामर्श व अपॉइंटमेंट बुकिंग के लिए'
                  : 'For Cyber Advisory & Consultation Bookings'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1 rounded-md text-[#A8BBCB] hover:text-[#F2F7FC] hover:bg-[#10283A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#244155] bg-[#071521]/50">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#28D7E5] text-[#28D7E5] bg-[#0B1F30]'
                : 'border-transparent text-[#A8BBCB] hover:text-[#F2F7FC]'
            }`}
          >
            {t.btnSignIn}
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#28D7E5] text-[#28D7E5] bg-[#0B1F30]'
                : 'border-transparent text-[#A8BBCB] hover:text-[#F2F7FC]'
            }`}
          >
            {t.btnSignUp}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FF6378]/10 border border-[#FF6378]/30 text-[#FF6378] text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#35CFA6]/10 border border-[#35CFA6]/30 text-[#35CFA6] text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#10283A] border border-[#244155] text-xs font-medium text-[#F2F7FC] hover:border-[#28D7E5] hover:bg-[#153348] transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isTe 
                ? 'Google తో కొనసాగించండి' 
                : isHi 
                ? 'Google के साथ जारी रखें' 
                : 'Continue with Google'}
            </span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#244155]" />
            </div>
            <span className="relative bg-[#0B1F30] px-3 text-[10px] uppercase tracking-wider text-[#A8BBCB]">
              {isTe ? 'లేదా ఈమెయిల్‌తో' : isHi ? 'या ईमेल से' : 'Or with Email'}
            </span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-[#A8BBCB] mb-1">
                  {isTe ? 'పూర్తి పేరు' : isHi ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-[#A8BBCB]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isTe ? 'మీ పేరు' : isHi ? 'आपका नाम' : 'Jane Doe'}
                    className="w-full pl-9 pr-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/40 focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[#A8BBCB] mb-1">
                {isTe ? 'ఈమెయిల్ చిరునామా' : isHi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#A8BBCB]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@clyrixa.security"
                  className="w-full pl-9 pr-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/40 focus:outline-none focus:border-[#28D7E5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#A8BBCB] mb-1">
                {isTe ? 'పాస్‌వర్డ్' : isHi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#A8BBCB]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/40 focus:outline-none focus:border-[#28D7E5]"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-[#A8BBCB] mb-1">
                  {isTe ? 'పాస్‌వర్డ్ నిర్ధారించండి' : isHi ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#A8BBCB]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/40 focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#28D7E5] text-[#071521] font-semibold text-xs hover:bg-[#35CFA6] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#071521] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? t.btnSignIn : t.btnSignUp}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#071521]/60 border-t border-[#244155] text-center text-[11px] text-[#A8BBCB]">
          {mode === 'signin' ? (
            <span>
              {isTe ? 'ఖాతా లేదా?' : isHi ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-[#28D7E5] hover:underline font-medium"
              >
                {t.btnSignUp}
              </button>
            </span>
          ) : (
            <span>
              {isTe ? 'ఇప్పటికే ఖాతా ఉందా?' : isHi ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="text-[#28D7E5] hover:underline font-medium"
              >
                {t.btnSignIn}
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
