import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, Appointment, AppointmentServiceType, AppointmentStatus } from '../../shared/types.js';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore and Auth instances
// CRITICAL: Must pass firestoreDatabaseId for custom provisioned databases
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

// Connection test at boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Check network and configuration.');
    }
  }
}
testConnection();

// Structured Firestore error handler per security specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ==================== User Profile Services ====================

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.userId}`;
  try {
    await setDoc(doc(db, 'users', profile.userId), {
      userId: profile.userId,
      email: profile.email,
      displayName: profile.displayName,
      createdAt: profile.createdAt || new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// ==================== Appointment Services ====================

export interface CreateBookingParams {
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceType: AppointmentServiceType;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export async function createAppointmentBooking(params: CreateBookingParams): Promise<Appointment> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: User must be signed in to book an appointment.');
  }

  const id = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const path = `appointments/${id}`;

  const appointmentData: Appointment = {
    id,
    userId: currentUser.uid,
    userName: params.userName.trim(),
    userEmail: params.userEmail.trim().toLowerCase(),
    ...(params.userPhone ? { userPhone: params.userPhone.trim() } : {}),
    serviceType: params.serviceType,
    preferredDate: params.preferredDate,
    preferredTime: params.preferredTime,
    ...(params.notes ? { notes: params.notes.trim() } : {}),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'appointments', id), appointmentData);
    return appointmentData;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const q = query(collection(db, 'appointments'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const results: Appointment[] = [];
    snapshot.forEach((d) => {
      results.push(d.data() as Appointment);
    });
    // Sort descending by creation date
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function cancelUserAppointment(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'cancelled',
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// ==================== Authentication Helpers ====================

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  const user = res.user;

  // Sync profile to Firestore
  if (user) {
    await saveUserProfile({
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Security Analyst',
      createdAt: new Date().toISOString(),
    });
  }
  return user;
}

export async function registerWithEmail(email: string, pass: string, displayName: string): Promise<User> {
  const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = res.user;

  if (displayName) {
    await updateProfile(user, { displayName: displayName.trim() });
  }

  // Persist user record in Firestore
  await saveUserProfile({
    userId: user.uid,
    email: user.email || email.trim(),
    displayName: displayName.trim() || user.email?.split('@')[0] || 'Security Analyst',
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim();
  try {
    const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return res.user;
  } catch (err: any) {
    const code = err?.code || '';
    // If this is an authorized admin account and not registered yet, auto-provision the user
    if (isAdminEmail(cleanEmail) && (code === 'auth/user-not-found' || code === 'auth/invalid-credential')) {
      try {
        const newUser = await registerWithEmail(cleanEmail, pass, 'Clyrixa SOC Administrator');
        return newUser;
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ==================== Admin Portal Services ====================

export const ADMIN_EMAILS = [
  'ishrath.knl@gmail.com',
  '259xa33276@gmail.com',
  'webx@gmail.com'
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some(e => e.toLowerCase() === normalized);
}

export function isCurrentAdmin(): boolean {
  return isAdminEmail(auth.currentUser?.email);
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const snap = await getDocs(collection(db, 'appointments'));
    const results: Appointment[] = [];
    snap.forEach((docSnap) => {
      results.push(docSnap.data() as Appointment);
    });
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function updateAppointmentStatusByAdmin(
  appointmentId: string, 
  status: AppointmentStatus,
  notes?: string
): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const updatePayload: Record<string, any> = { status };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }
    await updateDoc(doc(db, 'appointments', appointmentId), updatePayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteAppointmentByAdmin(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function createAdminAppointment(params: CreateBookingParams & {
  status?: AppointmentStatus;
  targetUserId?: string;
}): Promise<Appointment> {
  const currentUser = auth.currentUser;
  if (!currentUser || !isCurrentAdmin()) {
    throw new Error('Unauthorized: Admin access required.');
  }

  const id = `apt_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const path = `appointments/${id}`;

  const appointmentData: Appointment = {
    id,
    userId: params.targetUserId || currentUser.uid,
    userName: params.userName.trim(),
    userEmail: params.userEmail.trim().toLowerCase(),
    ...(params.userPhone ? { userPhone: params.userPhone.trim() } : {}),
    serviceType: params.serviceType,
    preferredDate: params.preferredDate,
    preferredTime: params.preferredTime,
    ...(params.notes ? { notes: params.notes.trim() } : {}),
    status: params.status || 'confirmed',
    createdByAdmin: true,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'appointments', id), appointmentData);
    return appointmentData;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function loginAdminWithCredentials(
  email = 'ishrath.knl@gmail.com',
  password = 'Ishrath@1029'
): Promise<User> {
  try {
    const user = await loginWithEmail(email, password);
    return user;
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      try {
        const newUser = await registerWithEmail(email, password, 'Clyrixa SOC Administrator');
        return newUser;
      } catch (regErr) {
        throw err;
      }
    }
    throw err;
  }
}

