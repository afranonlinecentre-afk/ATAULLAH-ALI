import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export const AUTHORIZED_ADMIN_PHONE = '+917074626784';
export const AUTHORIZED_ADMIN_PHONE_DISPLAY = '+91 7074626784';
export const AUTHORIZED_ADMIN_EMAIL = 'afranonlinecentre@gmail.com';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export interface PhoneOtpResult {
  success: boolean;
  confirmationResult?: ConfirmationResult;
  error?: string;
  errorCode?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  user?: any;
  error?: string;
  errorCode?: string;
}

/**
 * Format any input to E.164 standard phone format for India (+91XXXXXXXXXX)
 */
export function formatToE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return phone.trim();
}

/**
 * Initialize RecaptchaVerifier safely for real Firebase Phone Authentication.
 * Ensures the target container exists and does not have display:none which breaks reCAPTCHA.
 */
export function initRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  let containerEl = document.getElementById(containerId);
  if (!containerEl) {
    containerEl = document.createElement('div');
    containerEl.id = containerId;
    document.body.appendChild(containerEl);
  }

  // Remove any conflicting display:none or hidden class that breaks reCAPTCHA token generation
  containerEl.classList.remove('hidden');
  containerEl.style.position = 'fixed';
  containerEl.style.bottom = '0';
  containerEl.style.right = '0';
  containerEl.style.opacity = '0';
  containerEl.style.pointerEvents = 'none';
  containerEl.style.zIndex = '1';

  // Clear existing verifier instance if any
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      // ignore clear error
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerEl, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired. User must retry.');
    }
  });

  window.recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Translate Firebase Authentication errors to clear, actionable Bengali messages.
 * Directly addresses auth/admin-restricted-operation and phone auth setup requirements.
 */
export function getBengaliAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  const message = error?.message || '';

  switch (code) {
    case 'auth/admin-restricted-operation':
      return 'ফায়ারবেস অথেন্টিকেশনে এই অপারেশনটি অ্যাডমিন-সীমাবদ্ধ (admin-restricted-operation)। অনুগ্রহ করে নিশ্চিত করুন যে Firebase Console > Authentication > Settings এ "Allow users to sign up" সক্রিয় আছে এবং Sign-in method এ Phone Auth চালু রয়েছে।';
    case 'auth/operation-not-allowed':
      return 'ফায়ারবেস কনসোলে Phone Authentication (SMS) সক্রিয় করা হয়নি। অনুগ্রহ করে Firebase Console > Authentication > Sign-in method এ গিয়ে Phone সক্রিয় করুন।';
    case 'auth/invalid-phone-number':
      return 'মোবাইল নম্বরটি সঠিক নয়। অনুগ্রহ করে সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর দিন।';
    case 'auth/missing-phone-number':
      return 'মোবাইল নম্বর প্রদান করা হয়নি।';
    case 'auth/quota-exceeded':
      return 'এসএমএস ওটিপি পাঠানোর দৈনিক সীমা অতিক্রান্ত হয়েছে (SMS quota exceeded)। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন অথবা Firebase Console এ টেস্ট ফোন নম্বর ব্যবহার করুন।';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA নিরাপত্তা যাচাই ব্যর্থ হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করে পুনরায় চেষ্টা করুন।';
    case 'auth/invalid-verification-code':
      return 'ভুল ওটিপি (OTP) কোড। অনুগ্রহ করে আপনার মোবাইলে প্রাপ্ত সঠিক ৬ সংখ্যার কোড লিখুন।';
    case 'auth/code-expired':
      return 'এই ওটিপি (OTP) কোডটির মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে "পুনরায় ওটিপি পাঠান" বাটনে চাপুন।';
    case 'auth/too-many-requests':
      return 'অতিরিক্ত সংখ্যক অনুরোধ পাঠানো হয়েছে। নিরাপত্তার স্বার্থে এই ডিভাইস সাময়িকভাবে ব্লক করা হয়েছে, কিছুক্ষণ পর চেষ্টা করুন।';
    case 'auth/network-request-failed':
      return 'নেটওয়ার্ক সংযোগ ত্রুটি। ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।';
    case 'auth/unauthorized-domain':
      return 'এই ডোমেনটি ফায়ারবেসের অনুমোদিত তালিকায় (Authorized Domains) যুক্ত নেই। Firebase Console > Authentication > Settings এ ডোমেনটি যোগ করুন।';
    case 'auth/user-disabled':
      return 'এই অ্যাকাউন্টটি ফায়ারবেস কনসোল থেকে সাময়িকভাবে নিষ্ক্রিয় করা হয়েছে।';
    default:
      if (message.includes('reCAPTCHA') || message.includes('recaptcha')) {
        return 'reCAPTCHA যাচাইকরণ সম্পন্ন হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
      }
      return `অথেন্টিকেশন ত্রুটি: ${message || 'অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে'}`;
  }
}

/**
 * Send real SMS OTP to authorized Admin mobile number (+91 7074626784)
 */
export async function sendAdminSmsOtp(
  phoneInput: string,
  containerId: string = 'admin-recaptcha-container'
): Promise<PhoneOtpResult> {
  const formattedPhone = formatToE164(phoneInput);

  // Strict check: Only +917074626784 is permitted for Owner Admin
  if (formattedPhone !== AUTHORIZED_ADMIN_PHONE) {
    return {
      success: false,
      error: `অননুমোদিত নম্বর: শুধুমাত্র অনুমোদিত মালিকের মোবাইল নম্বর (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) দিয়েই অ্যাডমিন লগইন সম্ভব। অন্য নম্বরে অ্যাডমিন অ্যাক্সেস অনুমোদিত নয়।`,
      errorCode: 'auth/unauthorized-phone'
    };
  }

  try {
    const appVerifier = initRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    window.confirmationResult = confirmationResult;

    return {
      success: true,
      confirmationResult
    };
  } catch (error: any) {
    console.error('Firebase Phone Auth send OTP error:', error);
    return {
      success: false,
      error: getBengaliAuthErrorMessage(error),
      errorCode: error?.code || 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Verify received SMS OTP via Firebase Authentication and validate owner authorization
 */
export async function verifyAdminSmsOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<VerifyOtpResult> {
  if (!otpCode || otpCode.trim().length !== 6) {
    return {
      success: false,
      error: 'অনুগ্রহ করে এসএমএসে প্রাপ্ত সঠিক ৬ সংখ্যার ওটিপি (OTP) লিখুন।'
    };
  }

  try {
    const credential: UserCredential = await confirmationResult.confirm(otpCode.trim());
    const fbUser = credential.user;

    // Strict validation of verified phone number in Firebase token
    const verifiedPhone = fbUser.phoneNumber ? formatToE164(fbUser.phoneNumber) : '';
    if (verifiedPhone !== AUTHORIZED_ADMIN_PHONE) {
      // Immediate logout if not the authorized owner phone
      await signOut(auth);
      return {
        success: false,
        error: `অননুমোদিত অ্যাক্সেস: আপনার ফোন নম্বর (${verifiedPhone}) মালিক হিসেবে অনুমোদিত নয়। অ্যাক্সেস বাতিল করা হলো।`,
        errorCode: 'auth/unauthorized-admin'
      };
    }

    // Check trusted server claims and /admins document
    const adminDocRef = doc(db, 'admins', fbUser.uid);
    const adminSnap = await getDoc(adminDocRef);

    if (!adminSnap.exists()) {
      // Register initial authorized admin document for +917074626784
      await setDoc(adminDocRef, {
        uid: fbUser.uid,
        phoneNumber: AUTHORIZED_ADMIN_PHONE,
        email: AUTHORIZED_ADMIN_EMAIL,
        role: 'ownerAdmin',
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
      }, { merge: true });
    }

    // Also update /users profile
    await setDoc(doc(db, 'users', fbUser.uid), {
      uid: fbUser.uid,
      displayName: 'AFRAN Owner Admin (আফরান সেন্টার প্রধান)',
      phoneNumber: AUTHORIZED_ADMIN_PHONE,
      role: 'ownerAdmin',
      preferredLanguage: 'bn',
      accountStatus: 'active',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      success: true,
      user: fbUser
    };
  } catch (error: any) {
    console.error('Firebase confirm OTP error:', error);
    return {
      success: false,
      error: getBengaliAuthErrorMessage(error),
      errorCode: error?.code || 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Send real SMS OTP to customer phone
 */
export async function sendCustomerSmsOtp(
  phoneInput: string,
  containerId: string = 'customer-recaptcha-container'
): Promise<PhoneOtpResult> {
  const formattedPhone = formatToE164(phoneInput);
  const cleanDigits = phoneInput.replace(/\D/g, '');

  if (cleanDigits.length < 10) {
    return {
      success: false,
      error: 'অনুগ্রহ করে সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর দিন।'
    };
  }

  // Prevent admin phone from logging in via Customer portal
  if (formattedPhone === AUTHORIZED_ADMIN_PHONE || cleanDigits.endsWith('7074626784')) {
    return {
      success: false,
      error: 'এই নম্বরটি (+91 7074626784) সেন্টারের অনুমোদিত মালিক অ্যাডমিন নম্বর। অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে অনুগ্রহ করে মালিক অ্যাডমিন লগইন ব্যবহার করুন।'
    };
  }

  try {
    const appVerifier = initRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    return {
      success: true,
      confirmationResult
    };
  } catch (error: any) {
    console.error('Customer Phone Auth send OTP error:', error);
    return {
      success: false,
      error: getBengaliAuthErrorMessage(error),
      errorCode: error?.code || 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Verify received SMS OTP for Customer
 */
export async function verifyCustomerSmsOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string,
  name?: string
): Promise<VerifyOtpResult> {
  if (!otpCode || otpCode.trim().length !== 6) {
    return {
      success: false,
      error: 'অনুগ্রহ করে এসএমএসে প্রাপ্ত সঠিক ৬ সংখ্যার ওটিপি (OTP) লিখুন।'
    };
  }

  try {
    const credential: UserCredential = await confirmationResult.confirm(otpCode.trim());
    const fbUser = credential.user;

    // Strict customer profile update (never grant admin role)
    const customerProfile: UserProfile = {
      uid: fbUser.uid,
      displayName: name || fbUser.displayName || 'সম্মানিত নাগরিক',
      phoneNumber: fbUser.phoneNumber || '',
      role: 'customer',
      preferredLanguage: 'bn',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', fbUser.uid), customerProfile, { merge: true });
    } catch (e) {
      console.warn('Customer firestore update error:', e);
    }

    return {
      success: true,
      user: fbUser
    };
  } catch (error: any) {
    console.error('Customer verify OTP error:', error);
    return {
      success: false,
      error: getBengaliAuthErrorMessage(error),
      errorCode: error?.code || 'UNKNOWN_ERROR'
    };
  }
}
