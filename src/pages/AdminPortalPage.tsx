import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  KeyRound, 
  Mail, 
  LogOut, 
  Sparkles, 
  User as UserIcon, 
  Phone, 
  FileText, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  logoutUser, 
  isAdminEmail, 
  getAllAppointments, 
  updateAppointmentStatusByAdmin, 
  deleteAppointmentByAdmin, 
  createAdminAppointment, 
  loginAdminWithCredentials 
} from '../services/firebase.js';
import { Appointment, AppointmentServiceType, AppointmentStatus } from '../../shared/types.js';
import { Language, DICTIONARY } from '../utils/i18n.js';

interface AdminPortalPageProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  language,
  onNavigate,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminEmail(auth.currentUser?.email));
  
  // Admin Login State
  const [loginEmail, setLoginEmail] = useState('ishrath.knl@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Ishrath@1029');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Bookings Data & Filters
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | AppointmentServiceType>('all');

  // Modal: Add New Booking from Admin End
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newServiceType, setNewServiceType] = useState<AppointmentServiceType>('incident_triage');
  const [newDate, setNewDate] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState('10:00 AM - 11:00 AM');
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('confirmed');
  const [newNotes, setNewNotes] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Quick Edit Notes Modal
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editNotesText, setEditNotesText] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const t = DICTIONARY[language] || DICTIONARY.en;
  const isTe = language === 'te';
  const isHi = language === 'hi';

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      const isAdm = isAdminEmail(user?.email);
      setIsAdmin(isAdm);
      if (isAdm) {
        fetchAppointments();
      } else {
        setAppointments([]);
      }
    });
    return () => unsub();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const records = await getAllAppointments();
      setAppointments(records);
    } catch (err: any) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const emailToUse = (customEmail !== undefined ? customEmail : loginEmail).trim();
    const passToUse = customPass !== undefined ? customPass : loginPassword;

    try {
      await loginAdminWithCredentials(emailToUse, passToUse);
      // Auth listener will handle fetching appointments
    } catch (err: any) {
      console.error('Admin login failed:', err);
      const msg = err?.message || (isTe ? 'లాగిన్ విఫలమైంది. ఆధారాలను తనిఖీ చేయండి.' : isHi ? 'लॉगिन विफल रहा। कृपया क्रेडेंशियल जांचें।' : 'Admin login failed. Please verify credentials.');
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (aptId: string, newStatusVal: AppointmentStatus) => {
    try {
      await updateAppointmentStatusByAdmin(aptId, newStatusVal);
      setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatusVal } : a));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteAppointment = async (aptId: string) => {
    if (!window.confirm(
      isTe ? 'మీరు ఖచ్చితంగా ఈ బుకింగ్‌ను తొలగించాలనుకుంటున్నారా?' 
      : isHi ? 'क्या आप वाकई इस बुकिंग को हटाना चाहते हैं?' 
      : 'Permanently remove this appointment record from Firestore?'
    )) {
      return;
    }

    try {
      await deleteAppointmentByAdmin(aptId);
      setAppointments(prev => prev.filter(a => a.id !== aptId));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  const handleSaveEditedNotes = async () => {
    if (!editingApt) return;
    setEditSaving(true);
    try {
      await updateAppointmentStatusByAdmin(editingApt.id, editingApt.status, editNotesText);
      setAppointments(prev => prev.map(a => a.id === editingApt.id ? { ...a, notes: editNotesText } : a));
      setEditingApt(null);
    } catch (err) {
      console.error('Failed to update notes:', err);
    } finally {
      setEditSaving(false);
    }
  };

  const handleCreateAdminBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) {
      setAddError(isTe ? 'దయచేసి పేరు మరియు ఈమెయిల్ నమోదు చేయండి.' : isHi ? 'कृपया नाम और ईमेल दर्ज करें।' : 'Client name and email are required.');
      return;
    }

    setAddLoading(true);
    setAddError(null);

    try {
      const created = await createAdminAppointment({
        userName: newClientName.trim(),
        userEmail: newClientEmail.trim().toLowerCase(),
        userPhone: newClientPhone.trim() || undefined,
        serviceType: newServiceType,
        preferredDate: newDate,
        preferredTime: newTime,
        status: newStatus,
        notes: newNotes.trim() || undefined,
      });

      setAppointments(prev => [created, ...prev]);
      setShowAddModal(false);
      // Reset form
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPhone('');
      setNewNotes('');
    } catch (err: any) {
      console.error('Admin create appointment failed:', err);
      setAddError(err?.message || (isTe ? 'బుకింగ్ సృష్టించడంలో లోపం సంభవించింది.' : isHi ? 'बुकिंग बनाने में त्रुटि हुई।' : 'Failed to record booking.'));
    } finally {
      setAddLoading(false);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && apt.serviceType !== serviceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.userName?.toLowerCase().includes(q);
      const matchEmail = apt.userEmail?.toLowerCase().includes(q);
      const matchPhone = apt.userPhone?.toLowerCase().includes(q);
      const matchId = apt.id?.toLowerCase().includes(q);
      const matchNotes = apt.notes?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchId && !matchNotes) return false;
    }
    return true;
  });

  // Metrics
  const totalCount = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  // Render Gate 1: Logged in, but NOT an admin
  if (currentUser && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="bg-[#0B1F30] border border-[#FF6378]/40 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6378]/10 border border-[#FF6378]/40 flex items-center justify-center text-[#FF6378] mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10283A] border border-[#FF6378]/30 text-xs font-mono text-[#FF6378] mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>ACCESS RESTRICTED — ADMIN PRIVILEGES REQUIRED</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F2F7FC] mb-2">
            {isTe ? 'అనుమతి నిరాకరించబడింది' : isHi ? 'पहुंच अस्वीकृत' : 'Administrator Access Only'}
          </h1>
          <p className="text-xs text-[#A8BBCB] mb-6 max-w-md mx-auto leading-relaxed">
            {isTe 
              ? `మీరు '${currentUser.email}' గా లాగిన్ అయ్యారు, ఇది అడ్మినిస్ట్రేటర్ ఖాతా కాదు. ఈ అడ్మిన్ పోర్టల్‌ను యాక్సెస్ చేయడానికి అనుమతించబడిన అడ్మిన్ ఖాతాతో లాగిన్ అవ్వండి.`
              : isHi
              ? `आप '${currentUser.email}' के रूप में लॉग इन हैं, जो व्यवस्थापक खाता नहीं है। एडमिन पोर्टल का उपयोग करने के लिए अधिकृत खाते से लॉग इन करें।`
              : `You are currently logged in as "${currentUser.email}". This account does not possess administrator privileges. The Admin Portal is restricted to authorized cybersecurity administrators.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#153348] border border-[#244155] text-xs font-semibold text-[#F2F7FC] hover:border-[#28D7E5] transition-all cursor-pointer"
            >
              {isTe ? 'హోమ్‌కు తిరిగి వెళ్లండి' : isHi ? 'होम पर लौटें' : 'Return to Home'}
            </button>
            <button
              onClick={async () => {
                await logoutUser();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-all cursor-pointer"
            >
              {isTe ? 'అడ్మిన్‌గా సైన్ ఇన్ చేయండి' : isHi ? 'व्यवस्थापक के रूप में साइन इन करें' : 'Sign In as Administrator'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Gate 2: Not logged in at all
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-[#0B1F30] border border-[#244155] rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#10283A] border border-[#28D7E5]/50 flex items-center justify-center text-[#28D7E5] mx-auto mb-4 shadow-lg shadow-[#28D7E5]/10">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10283A] border border-[#28D7E5]/30 text-xs font-mono text-[#28D7E5] mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>SOC ADMIN SECURITY GATEWAY</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#F2F7FC]">
              {isTe ? 'అడ్మిన్ పోర్టల్ లాగిన్' : isHi ? 'एडमिन पोर्टल लॉगिन' : 'Admin Portal Authentication'}
            </h1>
            <p className="text-xs text-[#A8BBCB] mt-1.5 max-w-md mx-auto">
              {isTe 
                ? 'ఈ విభాగం కేవలం సైబర్ సెక్యూరిటీ అడ్మినిస్ట్రేటర్లకు మాత్రమే అనుమతించబడింది.' 
                : isHi 
                ? 'यह अनुभाग केवल अधिकृत सुरक्षा प्रशासकों के लिए आरक्षित है।' 
                : 'Restricted administrative portal for managing threat response consultations and bookings.'}
            </p>
          </div>

          {/* Preset Admin Credentials Box */}
          <div className="mb-6 p-4 rounded-xl bg-[#10283A] border border-[#28D7E5]/30 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#28D7E5] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Authorized Admin Credentials</span>
              </span>
              <span className="text-[10px] font-mono bg-[#071521] px-2 py-0.5 rounded text-[#35CFA6] border border-[#35CFA6]/30">
                ACTIVE
              </span>
            </div>
            
            {/* Primary Requested Credentials */}
            <div className="mb-2 p-2.5 rounded-lg bg-[#071521] border border-[#28D7E5]/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-[#28D7E5] tracking-wide uppercase">Designated Super Admin</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('ishrath.knl@gmail.com');
                      setLoginPassword('Ishrath@1029');
                    }}
                    className="text-[10px] text-[#A8BBCB] hover:text-[#28D7E5] underline cursor-pointer"
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('ishrath.knl@gmail.com');
                      setLoginPassword('Ishrath@1029');
                      handleAdminLogin(undefined, 'ishrath.knl@gmail.com', 'Ishrath@1029');
                    }}
                    className="px-2 py-0.5 rounded bg-[#28D7E5] text-[#071521] text-[10px] font-bold hover:bg-[#35CFA6] transition-colors cursor-pointer"
                  >
                    Quick Sign In
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#A8BBCB]">
                <div>
                  <span className="text-[#A8BBCB]/70 block text-[10px]">Email:</span>
                  <span className="text-[#F2F7FC] font-bold">ishrath.knl@gmail.com</span>
                </div>
                <div>
                  <span className="text-[#A8BBCB]/70 block text-[10px]">Password:</span>
                  <span className="text-[#F2F7FC] font-bold">Ishrath@1029</span>
                </div>
              </div>
            </div>

            {/* Secondary Admins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-[#071521]/60 border border-[#244155]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-semibold text-[#A8BBCB] tracking-wide uppercase">Admin Preset 2</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('259xa33276@gmail.com');
                      setLoginPassword('gayanireddy098');
                    }}
                    className="text-[9px] text-[#A8BBCB] hover:text-[#28D7E5] underline cursor-pointer"
                  >
                    Use
                  </button>
                </div>
                <div className="text-[10px] font-mono text-[#A8BBCB]">
                  <div className="truncate text-[#F2F7FC]">259xa33276@gmail.com</div>
                  <div className="text-[#A8BBCB]/70 text-[9px]">gayanireddy098</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#071521]/60 border border-[#244155]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-semibold text-[#A8BBCB] tracking-wide uppercase">Admin Preset 3</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('webx@gmail.com');
                      setLoginPassword('webX@1234');
                    }}
                    className="text-[9px] text-[#A8BBCB] hover:text-[#28D7E5] underline cursor-pointer"
                  >
                    Use
                  </button>
                </div>
                <div className="text-[10px] font-mono text-[#A8BBCB]">
                  <div className="truncate text-[#F2F7FC]">webx@gmail.com</div>
                  <div className="text-[#A8BBCB]/70 text-[9px]">webX@1234</div>
                </div>
              </div>
            </div>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-lg bg-[#FF6378]/10 border border-[#FF6378]/40 text-[#FF6378] text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F2F7FC] mb-1.5">
                {isTe ? 'అడ్మిన్ ఈమెయిల్' : isHi ? 'एडमिन ईमेल' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#A8BBCB]" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F2F7FC] mb-1.5">
                {isTe ? 'పాస్‌వర్డ్' : isHi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#A8BBCB]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#A8BBCB] hover:text-[#F2F7FC]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-xs hover:bg-[#35CFA6] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#28D7E5]/20"
              >
                {loginLoading ? (
                  <div className="w-4 h-4 border-2 border-[#071521] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{isTe ? 'అడ్మిన్ లాగిన్ చేయండి' : isHi ? 'एडमिन लॉगिन करें' : 'Sign In to Admin Console'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginEmail('259xa33276@gmail.com');
                  setLoginPassword('gayanireddy098');
                  handleAdminLogin(undefined, '259xa33276@gmail.com', 'gayanireddy098');
                }}
                disabled={loginLoading}
                className="w-full py-2.5 rounded-lg bg-[#153348] border border-[#28D7E5]/40 text-[#28D7E5] font-semibold text-xs hover:bg-[#10283A] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡</span>
                <span>{isTe ? 'ఒక్క క్లిక్‌తో అడ్మిన్‌గా లాగిన్ అవ్వండి (259xa33276@gmail.com)' : isHi ? 'एक क्लिक में एडमिन लॉगिन (259xa33276@gmail.com)' : 'Quick Auto-Login as Admin (259xa33276@gmail.com)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginEmail('webx@gmail.com');
                  setLoginPassword('webX@1234');
                  handleAdminLogin(undefined, 'webx@gmail.com', 'webX@1234');
                }}
                disabled={loginLoading}
                className="w-full py-2 rounded-lg bg-[#0B1F30] border border-[#244155] text-[#A8BBCB] hover:text-[#F2F7FC] hover:border-[#A8BBCB]/40 font-medium text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔑</span>
                <span>Alternative: Login as webx@gmail.com</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#244155] text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#A8BBCB] hover:text-[#28D7E5] transition-colors"
            >
              ← {isTe ? 'హోమ్ పేజీకి తిరిగి వెళ్లండి' : isHi ? 'होम पेज पर वापस जाएं' : 'Return to Clyrixa Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Portal Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Status Header */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#10283A] border border-[#28D7E5] flex items-center justify-center text-[#28D7E5] shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#F2F7FC]">
                SOC Operations Center — Booking Manager
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#28D7E5]/20 text-[#28D7E5] border border-[#28D7E5]/30">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-[#A8BBCB] font-mono">
              Signed in as: <strong className="text-[#35CFA6]">{currentUser.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isTe ? 'కొత్త బుకింగ్ జోడించండి' : isHi ? 'नई बुकिंग जोड़ें' : 'Add New Booking'}</span>
          </button>

          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="p-2 rounded-lg bg-[#10283A] border border-[#244155] text-[#A8BBCB] hover:text-[#28D7E5] hover:border-[#28D7E5]/40 transition-colors cursor-pointer"
            title="Refresh bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#28D7E5]' : ''}`} />
          </button>

          <button
            onClick={() => logoutUser()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#10283A] border border-[#244155] text-xs text-[#FF6378] hover:bg-[#FF6378]/10 hover:border-[#FF6378]/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.btnSignOut}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4">
          <span className="text-[11px] font-medium text-[#A8BBCB] block">Total Bookings</span>
          <span className="text-2xl font-bold text-[#F2F7FC] mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4">
          <span className="text-[11px] font-medium text-[#F6C453] block">Pending Triage</span>
          <span className="text-2xl font-bold text-[#F6C453] mt-1 block">{pendingCount}</span>
        </div>
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4">
          <span className="text-[11px] font-medium text-[#35CFA6] block">Confirmed</span>
          <span className="text-2xl font-bold text-[#35CFA6] mt-1 block">{confirmedCount}</span>
        </div>
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4">
          <span className="text-[11px] font-medium text-[#28D7E5] block">Completed</span>
          <span className="text-2xl font-bold text-[#28D7E5] mt-1 block">{completedCount}</span>
        </div>
        <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4">
          <span className="text-[11px] font-medium text-[#FF6378] block">Cancelled</span>
          <span className="text-2xl font-bold text-[#FF6378] mt-1 block">{cancelledCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A8BBCB]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTe ? 'పేరు, ఈమెయిల్, ఐడీతో శోధించండి...' : isHi ? 'नाम, ईमेल, आईडी से खोजें...' : 'Search by client, email, phone, or ID...'}
            className="w-full pl-9 pr-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/50 focus:outline-none focus:border-[#28D7E5]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#A8BBCB]">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
          >
            <option value="all">All Statuses ({totalCount})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="confirmed">Confirmed ({confirmedCount})</option>
            <option value="completed">Completed ({completedCount})</option>
            <option value="cancelled">Cancelled ({cancelledCount})</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
          >
            <option value="all">All Service Scopes</option>
            <option value="incident_triage">Incident Triage</option>
            <option value="link_audit">Link & Domain Audit</option>
            <option value="security_consultation">Security Consultation</option>
            <option value="enterprise_demo">Enterprise Demo</option>
          </select>
        </div>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-[#0B1F30] border border-[#244155] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#244155] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F2F7FC] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#28D7E5]" />
            <span>Consultation Bookings Queue ({filteredAppointments.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#A8BBCB]">
            <div className="w-6 h-6 border-2 border-[#28D7E5] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Synchronizing with Cloud Firestore...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#A8BBCB]">
            <Calendar className="w-8 h-8 text-[#A8BBCB]/30 mx-auto mb-2" />
            <p>No bookings match the current filter or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A8BBCB]">
              <thead className="bg-[#071521] text-[#A8BBCB] border-b border-[#244155] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Client Details</th>
                  <th className="py-3 px-4">Service Scope</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status & Management</th>
                  <th className="py-3 px-4">Incident Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#244155]/60">
                {filteredAppointments.map((apt) => {
                  const statusColors = {
                    pending: 'bg-[#F6C453]/20 text-[#F6C453] border-[#F6C453]/40',
                    confirmed: 'bg-[#35CFA6]/20 text-[#35CFA6] border-[#35CFA6]/40',
                    completed: 'bg-[#28D7E5]/20 text-[#28D7E5] border-[#28D7E5]/40',
                    cancelled: 'bg-[#FF6378]/20 text-[#FF6378] border-[#FF6378]/40',
                  };

                  return (
                    <tr key={apt.id} className="hover:bg-[#10283A]/50 transition-colors">
                      {/* Client Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F2F7FC]">{apt.userName}</div>
                        <div className="text-[11px] font-mono text-[#28D7E5]">{apt.userEmail}</div>
                        {apt.userPhone && (
                          <div className="text-[10px] text-[#A8BBCB] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{apt.userPhone}</span>
                          </div>
                        )}
                        {apt.createdByAdmin && (
                          <span className="inline-block mt-1 text-[9px] font-mono bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/30 px-1 rounded">
                            ADMIN CREATED
                          </span>
                        )}
                      </td>

                      {/* Service Scope */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 rounded text-[11px] font-medium bg-[#153348] text-[#F2F7FC] border border-[#244155]">
                          {apt.serviceType === 'incident_triage' ? 'Incident Triage' :
                           apt.serviceType === 'link_audit' ? 'Link & Domain Audit' :
                           apt.serviceType === 'enterprise_demo' ? 'Enterprise Demo' :
                           'Security Consultation'}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="text-[#F2F7FC] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#28D7E5]" />
                          <span>{apt.preferredDate}</span>
                        </div>
                        <div className="text-[#A8BBCB] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{apt.preferredTime}</span>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                          className={`text-xs px-2.5 py-1 rounded-md font-mono border font-semibold cursor-pointer focus:outline-none ${statusColors[apt.status] || 'bg-[#10283A]'}`}
                        >
                          <option value="pending" className="bg-[#0B1F30] text-[#F6C453]">Pending</option>
                          <option value="confirmed" className="bg-[#0B1F30] text-[#35CFA6]">Confirmed</option>
                          <option value="completed" className="bg-[#0B1F30] text-[#28D7E5]">Completed</option>
                          <option value="cancelled" className="bg-[#0B1F30] text-[#FF6378]">Cancelled</option>
                        </select>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {apt.notes ? (
                          <div 
                            onClick={() => {
                              setEditingApt(apt);
                              setEditNotesText(apt.notes || '');
                            }}
                            className="text-[11px] text-[#A8BBCB] italic line-clamp-2 cursor-pointer hover:text-[#28D7E5] transition-colors"
                            title="Click to edit notes"
                          >
                            "{apt.notes}"
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingApt(apt);
                              setEditNotesText('');
                            }}
                            className="text-[11px] text-[#A8BBCB]/60 hover:text-[#28D7E5] cursor-pointer"
                          >
                            + Add notes
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingApt(apt);
                              setEditNotesText(apt.notes || '');
                            }}
                            className="p-1.5 rounded bg-[#10283A] text-[#A8BBCB] hover:text-[#28D7E5] hover:border-[#28D7E5]/40 border border-[#244155] transition-colors cursor-pointer"
                            title="Edit triage notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1.5 rounded bg-[#10283A] text-[#A8BBCB] hover:text-[#FF6378] hover:border-[#FF6378]/40 border border-[#244155] transition-colors cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Booking from Admin End */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0B1F30] border border-[#244155] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#071521] border-b border-[#244155] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#28D7E5]" />
                <h3 className="text-sm font-bold text-[#F2F7FC]">
                  Create New Consultation (Admin End)
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#A8BBCB] hover:text-[#F2F7FC] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminBooking} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 rounded-lg bg-[#FF6378]/10 border border-[#FF6378]/40 text-[#FF6378] text-xs">
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Acme Corp Security Lead"
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="security@client.com"
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Client Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Service Scope
                  </label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  >
                    <option value="incident_triage">Emergency Incident Triage</option>
                    <option value="link_audit">Link & Domain Security Audit</option>
                    <option value="security_consultation">Organizational Defense Review</option>
                    <option value="enterprise_demo">Enterprise Platform Demo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5]"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A8BBCB] mb-1">
                  Analyst Triage Notes / Suspicious URL Payload
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes, targets, incident report numbers..."
                  className="w-full px-3 py-2 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] placeholder-[#A8BBCB]/50 focus:outline-none focus:border-[#28D7E5]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#10283A] text-[#A8BBCB] hover:text-[#F2F7FC] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 rounded-lg bg-[#28D7E5] text-[#071521] text-xs font-bold hover:bg-[#35CFA6] transition-all cursor-pointer disabled:opacity-50"
                >
                  {addLoading ? 'Saving to Firestore...' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Notes */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1F30] border border-[#244155] rounded-xl shadow-2xl p-6">
            <h3 className="text-sm font-bold text-[#F2F7FC] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#28D7E5]" />
              <span>Edit Incident & Triage Notes</span>
            </h3>
            <p className="text-xs text-[#A8BBCB] mb-4">
              Booking for <strong className="text-[#F2F7FC]">{editingApt.userName}</strong> ({editingApt.userEmail})
            </p>

            <textarea
              rows={4}
              value={editNotesText}
              onChange={(e) => setEditNotesText(e.target.value)}
              placeholder="Incident observations, suspicious domains, triage summary..."
              className="w-full p-3 bg-[#071521] border border-[#244155] rounded-lg text-xs text-[#F2F7FC] focus:outline-none focus:border-[#28D7E5] mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="px-3 py-1.5 rounded-lg bg-[#10283A] text-xs text-[#A8BBCB] hover:text-[#F2F7FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedNotes}
                disabled={editSaving}
                className="px-4 py-1.5 rounded-lg bg-[#28D7E5] text-[#071521] font-bold text-xs hover:bg-[#35CFA6] cursor-pointer disabled:opacity-50"
              >
                {editSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
