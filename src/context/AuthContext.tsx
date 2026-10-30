import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole, Language } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  fbUser: FirebaseUser | null;
  loading: boolean;
  activeApp: 'customer' | 'admin';
  setActiveApp: (app: 'customer' | 'admin') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  setVerifiedAdminSession: (userProfile: UserProfile, fbUser?: FirebaseUser) => void;
  setCustomerSession: (customerProfile: UserProfile, fbUser?: FirebaseUser) => void;
  quickSwitchPersona: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isOwnerAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const OWNER_EMAIL = 'afranonlinecentre@gmail.com';
export const OWNER_PHONE = '+91 7074626784';
export const OWNER_PHONE_RAW = '7074626784';
export const OWNER_PHONE_E164 = '+917074626784';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeApp, setActiveApp] = useState<'customer' | 'admin'>('customer');
  const [lang, setLang] = useState<Language>('bn');

  // Load saved preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('aoc_lang') as Language;
    if (savedLang === 'bn' || savedLang === 'en') {
      setLang(savedLang);
    }
    const savedApp = localStorage.getItem('aoc_active_app') as 'customer' | 'admin';
    if (savedApp === 'customer' || savedApp === 'admin') {
      setActiveApp(savedApp);
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('aoc_lang', newLang);
  };

  const changeActiveApp = (app: 'customer' | 'admin') => {
    setActiveApp(app);
    localStorage.setItem('aoc_active_app', app);
  };

  // Sync with Firestore user record based strictly on real Firebase Auth claims & verified phone
  const syncUserRecord = async (fUser: FirebaseUser): Promise<UserProfile> => {
    const userPhoneDigits = fUser.phoneNumber ? fUser.phoneNumber.replace(/\D/g, '') : '';
    const isOwnerByPhone = userPhoneDigits.endsWith('7074626784');
    const isOwnerByEmail = fUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

    // Strict admin role gate: Only authorized phone +917074626784 or owner email can be ownerAdmin
    const effectiveRole: UserRole = (isOwnerByPhone || isOwnerByEmail) ? 'ownerAdmin' : 'customer';

    const userDocRef = doc(db, 'users', fUser.uid);
    let profileData: UserProfile;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        profileData = snap.data() as UserProfile;
        // Strictly prevent any unauthorized customer document from carrying ownerAdmin role
        if (effectiveRole !== 'ownerAdmin' && profileData.role === 'ownerAdmin') {
          profileData.role = 'customer';
          await setDoc(userDocRef, { role: 'customer', updatedAt: new Date().toISOString() }, { merge: true });
        } else if (effectiveRole === 'ownerAdmin' && profileData.role !== 'ownerAdmin') {
          profileData.role = 'ownerAdmin';
          await setDoc(userDocRef, { role: 'ownerAdmin', updatedAt: new Date().toISOString() }, { merge: true });
        }
      } else {
        profileData = {
          uid: fUser.uid,
          displayName: fUser.displayName || (effectiveRole === 'ownerAdmin' ? 'AFRAN Owner Admin (আফরান সেন্টার প্রধান)' : 'সম্মানিত নাগরিক'),
          phoneNumber: fUser.phoneNumber || (effectiveRole === 'ownerAdmin' ? OWNER_PHONE : ''),
          email: fUser.email || (effectiveRole === 'ownerAdmin' ? OWNER_EMAIL : undefined),
          role: effectiveRole,
          preferredLanguage: lang,
          accountStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, profileData);
      }

      // If verified ownerAdmin, sync with /admins collection for zero-trust Firestore security rules
      if (profileData.role === 'ownerAdmin') {
        const adminDocRef = doc(db, 'admins', fUser.uid);
        await setDoc(adminDocRef, {
          uid: fUser.uid,
          email: OWNER_EMAIL,
          phoneNumber: OWNER_PHONE_E164,
          role: 'ownerAdmin',
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not read or write user doc to Firestore:', e);
      profileData = {
        uid: fUser.uid,
        displayName: effectiveRole === 'ownerAdmin' ? 'AFRAN Owner Admin (আফরান সেন্টার প্রধান)' : 'সম্মানিত নাগরিক',
        phoneNumber: fUser.phoneNumber || (effectiveRole === 'ownerAdmin' ? OWNER_PHONE : ''),
        email: effectiveRole === 'ownerAdmin' ? OWNER_EMAIL : undefined,
        role: effectiveRole,
        preferredLanguage: lang,
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return profileData;
  };

  useEffect(() => {
    // Listen for real Firebase Auth state changes
    // IMPORTANT: Never call signInAnonymously() here as it triggers auth/admin-restricted-operation
    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFbUser(currentFbUser);
      if (currentFbUser) {
        try {
          const profile = await syncUserRecord(currentFbUser);
          setUser(profile);
          // If the verified user is ownerAdmin, allow admin app if previously requested
          if (profile.role === 'ownerAdmin') {
            const savedApp = localStorage.getItem('aoc_active_app');
            if (savedApp === 'admin') {
              setActiveApp('admin');
            }
          }
        } catch (err) {
          console.error('Error syncing auth profile:', err);
        }
      } else {
        // User is unauthenticated. Do NOT call signInAnonymously.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lang]);

  // Trusted setter called exclusively when real OTP for +91 7074626784 is verified
  const setVerifiedAdminSession = (adminProfile: UserProfile, newFbUser?: FirebaseUser) => {
    // Strictly verify that the profile belongs to the authorized owner
    const phoneDigits = (adminProfile.phoneNumber || '').replace(/\D/g, '');
    const isOwner = phoneDigits.endsWith('7074626784') || adminProfile.email === OWNER_EMAIL;

    if (!isOwner) {
      console.error('Rejected unauthorized attempt to set admin session');
      return;
    }

    if (newFbUser) {
      setFbUser(newFbUser);
    }
    setUser({ ...adminProfile, role: 'ownerAdmin' });
    setActiveApp('admin');
    localStorage.setItem('aoc_active_app', 'admin');
  };

  // Trusted setter for customer session
  const setCustomerSession = (customerProfile: UserProfile, newFbUser?: FirebaseUser) => {
    if (newFbUser) {
      setFbUser(newFbUser);
    }
    setUser({ ...customerProfile, role: 'customer' });
  };

  // Safe navigation between customer and admin interfaces.
  // Never bypasses authentication: switching to admin strictly triggers login if not verified.
  const quickSwitchPersona = (targetRole: UserRole) => {
    if (targetRole === 'customer') {
      setActiveApp('customer');
      localStorage.setItem('aoc_active_app', 'customer');
    } else if (targetRole === 'ownerAdmin') {
      // Check if already verified as owner
      const isVerifiedOwner =
        user?.role === 'ownerAdmin' &&
        (user.phoneNumber?.replace(/\D/g, '').endsWith('7074626784') || user.email === OWNER_EMAIL);

      setActiveApp('admin');
      localStorage.setItem('aoc_active_app', 'admin');

      // If not verified, AdminApp will safely render OwnerAdminLoginScreen
      if (!isVerifiedOwner && user) {
        // Reset role to customer so owner admin login screen must be completed
        setUser({ ...user, role: 'customer' });
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updated);
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (e) {
        console.warn('Failed to update firestore user profile:', e);
      }
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Error signing out:', e);
    }
    setFbUser(null);
    setUser(null);
    setActiveApp('customer');
    localStorage.setItem('aoc_active_app', 'customer');
  };

  // Strictly verify ownerAdmin: Must have role 'ownerAdmin' AND phone must match +91 7074626784 (or owner email)
  const isOwnerAdmin = Boolean(
    user?.role === 'ownerAdmin' &&
    ((user.phoneNumber && user.phoneNumber.replace(/\D/g, '').endsWith('7074626784')) ||
     (user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        fbUser,
        loading,
        activeApp,
        setActiveApp: changeActiveApp,
        lang,
        setLang: changeLanguage,
        setVerifiedAdminSession,
        setCustomerSession,
        quickSwitchPersona,
        updateUserProfile,
        logout,
        isOwnerAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
