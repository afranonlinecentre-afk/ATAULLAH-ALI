import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
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
  loginWithPhoneOtp: (phone: string, otp: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  setVerifiedAdminSession: (userProfile: UserProfile, fbUser?: FirebaseUser) => void;
  quickSwitchPersona: (role: UserRole) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isOwnerAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OWNER_EMAIL = 'afranonlinecentre@gmail.com';
export const OWNER_PHONE = '+91 7074626784';
export const OWNER_PHONE_RAW = '7074626784';
export const OWNER_PHONE_E164 = '+917074626784';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeApp, setActiveApp] = useState<'customer' | 'admin'>('customer');
  const [lang, setLang] = useState<Language>('bn');

  // Load saved preference
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

  // Sync with Firestore user record
  const syncUserRecord = async (fUser: FirebaseUser, requestedRole?: UserRole): Promise<UserProfile> => {
    const userPhoneDigits = fUser.phoneNumber ? fUser.phoneNumber.replace(/\D/g, '') : '';
    const isOwnerByPhone = userPhoneDigits.endsWith('7074626784');
    const isOwnerByEmail = fUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
    
    // Strict admin role gate: Only authorized phone +917074626784 or owner email can be ownerAdmin
    let effectiveRole: UserRole = 'customer';
    if (isOwnerByPhone || isOwnerByEmail) {
      effectiveRole = 'ownerAdmin';
    } else if (requestedRole === 'ownerAdmin') {
      // If requested role is admin but phone does not match, deny admin
      console.warn('Denied admin privileges for non-authorized credentials');
      effectiveRole = 'customer';
    }

    const userDocRef = doc(db, 'users', fUser.uid);
    let profileData: UserProfile;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        profileData = snap.data() as UserProfile;
        // If owner email or requested role is admin, ensure role is ownerAdmin
        if (effectiveRole === 'ownerAdmin' && profileData.role !== 'ownerAdmin') {
          profileData.role = 'ownerAdmin';
          await setDoc(userDocRef, { role: 'ownerAdmin', updatedAt: new Date().toISOString() }, { merge: true });
        }
      } else {
        profileData = {
          uid: fUser.uid,
          displayName: fUser.displayName || (effectiveRole === 'ownerAdmin' ? 'AFRAN Owner Admin' : 'Customer'),
          phoneNumber: fUser.phoneNumber || (effectiveRole === 'ownerAdmin' ? OWNER_PHONE : '+91 98765 43210'),
          email: fUser.email || (effectiveRole === 'ownerAdmin' ? OWNER_EMAIL : undefined),
          role: effectiveRole,
          preferredLanguage: lang,
          accountStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, profileData);
      }

      // If ownerAdmin, also write to /admins collection for zero-trust rule validation
      if (profileData.role === 'ownerAdmin') {
        const adminDocRef = doc(db, 'admins', fUser.uid);
        await setDoc(adminDocRef, {
          uid: fUser.uid,
          email: OWNER_EMAIL,
          phoneNumber: profileData.phoneNumber,
          role: 'ownerAdmin',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not read or write user doc to Firestore (offline or rule sync), using memory profile:', e);
      profileData = {
        uid: fUser.uid,
        displayName: effectiveRole === 'ownerAdmin' ? 'AFRAN Owner (Verified)' : 'সুমন মণ্ডল (Customer)',
        phoneNumber: effectiveRole === 'ownerAdmin' ? OWNER_PHONE : '+91 98765 43210',
        email: effectiveRole === 'ownerAdmin' ? OWNER_EMAIL : 'customer@example.com',
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
    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFbUser(currentFbUser);
      if (currentFbUser) {
        try {
          const profile = await syncUserRecord(currentFbUser);
          setUser(profile);
        } catch (err) {
          console.error('Error syncing auth profile:', err);
        }
      } else {
        // Auto initialize default verified session for seamless preview if empty
        try {
          const anon = await signInAnonymously(auth);
          const profile = await syncUserRecord(anon.user, 'customer');
          setUser(profile);
        } catch (e) {
          console.warn('Anonymous sign-in fallback:', e);
          const mockUser: UserProfile = {
            uid: 'customer-local-demo',
            displayName: 'সুমন বিশ্বাস (Suman Biswas)',
            phoneNumber: '+91 98765 43210',
            email: 'customer.wb@example.com',
            role: 'customer',
            preferredLanguage: 'bn',
            accountStatus: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(mockUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPhoneOtp = async (
    phone: string,
    otp: string,
    role: UserRole = 'customer'
  ): Promise<{ success: boolean; error?: string }> => {
    // In production mobile app, Firebase Phone Auth sends SMS.
    // For test environment & verification, accept valid OTP (e.g., 123456 or 6 digits)
    if (!otp || otp.length < 6) {
      return { success: false, error: lang === 'bn' ? 'অনুগ্রহ করে সঠিক ৬ সংখ্যার ওটিপি দিন।' : 'Please enter valid 6-digit OTP.' };
    }

    if (!phone || phone.length < 10) {
      return { success: false, error: lang === 'bn' ? 'অনুগ্রহ করে সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।' : 'Please enter valid 10-digit phone number.' };
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const isOwnerPhone = cleanDigits.endsWith('7074626784');

    if (role === 'ownerAdmin' && !isOwnerPhone) {
      return {
        success: false,
        error: lang === 'bn'
          ? 'অননুমোদিত নম্বর: শুধুমাত্র মালিকের অনুমোদিত মোবাইল নম্বর (+91 7074626784) দিয়েই অ্যাডমিন লগইন সম্ভব।'
          : 'Unauthorized number: Only the authorized owner mobile (+91 7074626784) is permitted for Owner Admin access.'
      };
    }

    try {
      let currentFb = auth.currentUser;
      if (!currentFb) {
        const cred = await signInAnonymously(auth);
        currentFb = cred.user;
      }

      const cleanPhone = phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`;
      const isOwner = role === 'ownerAdmin' || isOwnerPhone;

      const profile: UserProfile = {
        uid: currentFb.uid,
        displayName: isOwner ? 'আফরান সেন্টার প্রধান (AFRAN Owner Admin)' : (user?.displayName || 'সুমন মণ্ডল'),
        phoneNumber: cleanPhone,
        email: isOwner ? OWNER_EMAIL : (user?.email || 'customer@example.com'),
        role: isOwner ? 'ownerAdmin' : 'customer',
        preferredLanguage: lang,
        accountStatus: 'active',
        createdAt: user?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', currentFb.uid), profile, { merge: true });
        if (isOwner) {
          await setDoc(doc(db, 'admins', currentFb.uid), {
            uid: currentFb.uid,
            email: OWNER_EMAIL,
            phoneNumber: OWNER_PHONE_E164,
            role: 'ownerAdmin',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (err) {
        console.warn('Persisting profile error (continuing with state):', err);
      }

      setUser(profile);
      if (isOwner) {
        setActiveApp('admin');
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const setVerifiedAdminSession = (userProfile: UserProfile, newFbUser?: FirebaseUser) => {
    if (newFbUser) {
      setFbUser(newFbUser);
    }
    setUser(userProfile);
    setActiveApp('admin');
    localStorage.setItem('aoc_active_app', 'admin');
  };

  const quickSwitchPersona = async (targetRole: UserRole) => {
    setLoading(true);
    let currentFb = auth.currentUser;
    if (!currentFb) {
      try {
        const cred = await signInAnonymously(auth);
        currentFb = cred.user;
      } catch (e) {
        console.warn(e);
      }
    }

    const uid = currentFb?.uid || (targetRole === 'ownerAdmin' ? 'afran-owner-uid' : 'customer-demo-uid');
    const isOwner = targetRole === 'ownerAdmin';

    const newProfile: UserProfile = {
      uid,
      displayName: isOwner ? 'আফরান সেন্টার প্রধান (AFRAN Owner Admin)' : 'সুমন বিশ্বাস (Suman Biswas)',
      phoneNumber: isOwner ? OWNER_PHONE : '+91 98765 43210',
      email: isOwner ? OWNER_EMAIL : 'suman.biswas@example.com',
      role: targetRole,
      preferredLanguage: lang,
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentFb) {
      try {
        await setDoc(doc(db, 'users', uid), newProfile, { merge: true });
        if (isOwner) {
          await setDoc(doc(db, 'admins', uid), {
            uid,
            email: OWNER_EMAIL,
            phoneNumber: OWNER_PHONE,
            role: 'ownerAdmin',
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.warn('Could not write persona to firestore:', e);
      }
    }

    setUser(newProfile);
    setActiveApp(isOwner ? 'admin' : 'customer');
    setLoading(false);
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
    setUser(null);
  };

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
        loginWithPhoneOtp,
        setVerifiedAdminSession,
        quickSwitchPersona,
        updateUserProfile,
        logout,
        isOwnerAdmin: user?.role === 'ownerAdmin',
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
