import React, { useState, useRef, useEffect } from 'react';
import { Phone, ArrowRight, X, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/i18n';
import {
  sendCustomerSmsOtp,
  verifyCustomerSmsOtp,
  AUTHORIZED_ADMIN_PHONE_DISPLAY,
  formatToE164
} from '../../services/adminAuthService';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lang, setCustomerSession, setActiveApp } = useAuth();
  const t = translations[lang];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const confirmationRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setError(lang === 'bn' ? 'সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর লিখুন।' : 'Enter a valid 10-digit mobile number.');
      return;
    }

    // Check if the user accidentally entered the owner admin number
    if (clean.endsWith('7074626784')) {
      setError(
        lang === 'bn'
          ? `এই নম্বরটি (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) আফরান অনলাইন সেন্টারের অনুমোদিত মালিক অ্যাডমিন নম্বর। অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে অনুগ্রহ করে মালিক অ্যাডমিন লগইন ব্যবহার করুন।`
          : `This number (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) is reserved for AFRAN Owner Admin. Please use Owner Admin Login.`
      );
      return;
    }

    setLoading(true);

    try {
      const result = await sendCustomerSmsOtp(clean, 'customer-recaptcha-container');
      if (result.success && result.confirmationResult) {
        confirmationRef.current = result.confirmationResult;
        setStep('otp');
        setOtp('');
        setResendCooldown(60);
      } else {
        setError(result.error || (lang === 'bn' ? 'এসএমএস ওটিপি পাঠাতে ব্যর্থ হয়েছে।' : 'Failed to send SMS OTP.'));
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!confirmationRef.current) {
      setError(lang === 'bn' ? 'যাচাই সেশনের মেয়াদ শেষ হয়েছে। পুনরায় ওটিপি পাঠান।' : 'Verification session expired. Please resend OTP.');
      setStep('phone');
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      setError(lang === 'bn' ? 'অনুগ্রহ করে প্রাপ্ত সঠিক ৬ সংখ্যার ওটিপি কোড লিখুন।' : 'Please enter the 6-digit OTP code received via SMS.');
      return;
    }

    setLoading(true);

    try {
      const res = await verifyCustomerSmsOtp(confirmationRef.current, otp.trim(), customerName.trim());
      if (res.success && res.user) {
        setStep('success');
        const customerProfile = {
          uid: res.user.uid,
          displayName: customerName.trim() || res.user.displayName || (lang === 'bn' ? 'সম্মানিত নাগরিক' : 'Citizen Customer'),
          phoneNumber: res.user.phoneNumber || formatToE164(phoneNumber),
          role: 'customer' as const,
          preferredLanguage: lang,
          accountStatus: 'active' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCustomerSession(customerProfile, res.user);

        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      } else {
        setError(res.error || (lang === 'bn' ? 'ওটিপি যাচাই ব্যর্থ হয়েছে।' : 'OTP verification failed.'));
      }
    } catch (err: any) {
      setError(err?.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  const switchToOwnerLogin = () => {
    onClose();
    setActiveApp('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      {/* Invisible container for Customer Phone Auth reCAPTCHA */}
      <div id="customer-recaptcha-container" style={{ position: 'fixed', bottom: 0, right: 0, opacity: 0, pointerEvents: 'none', zIndex: 1 }} />

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#1267B1] to-[#16B8D4] p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 bg-white/20 rounded-full">
              {lang === 'bn' ? 'গ্রাহক মোবাইল প্রমাণীকরণ' : 'Customer Phone Auth'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg font-bold leading-tight">
            {lang === 'bn' ? 'আফরান অনলাইন সেন্টারে লগইন' : 'Login to AFRAN ONLINE CENTRE'}
          </h3>
          <p className="text-xs text-white/90 mt-1">
            {lang === 'bn'
              ? 'মোবাইল নম্বরে প্রেরিত রিয়েল এসএমএস ওটিপির মাধ্যমে নিরাপদ লগইন'
              : 'Secure login via real SMS OTP verification'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
                {error.includes('7074626784') && (
                  <button
                    type="button"
                    onClick={switchToOwnerLogin}
                    className="block text-xs font-bold text-[#1267B1] underline mt-1"
                  >
                    {lang === 'bn' ? 'মালিক অ্যাডমিন লগইনে যান →' : 'Go to Owner Admin Login →'}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={lang === 'bn' ? 'উদা: রাহুল মণ্ডল' : 'e.g. Rahul Mondal'}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 border-r pr-2 border-slate-200">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-20 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:bg-white font-mono tracking-wider"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t.sendOtp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : step === 'otp' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>{lang === 'bn' ? 'মোবাইলে প্রাপ্ত ৬ সংখ্যার ওটিপি (OTP)' : 'Enter 6-digit SMS OTP'}</span>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[#1267B1] hover:underline"
                >
                  {lang === 'bn' ? 'নম্বর পরিবর্তন' : 'Change Number'}
                </button>
              </div>

              <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                +91 {phoneNumber}
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full py-3 text-center text-xl font-mono tracking-[0.5em] bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1267B1] focus:bg-white"
                autoFocus
              />

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{lang === 'bn' ? 'ওটিপি যাচাই করুন' : 'Verify & Continue'}</span>
                )}
              </button>

              <div className="text-center pt-2">
                {resendCooldown > 0 ? (
                  <span className="text-xs text-slate-400">
                    {lang === 'bn' ? `পুনরায় ওটিপি পাঠান (${resendCooldown}s)` : `Resend OTP in ${resendCooldown}s`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs font-semibold text-[#1267B1] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'পুনরায় ওটিপি পাঠান' : 'Resend SMS OTP'}</span>
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-sm text-slate-800">
                {lang === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login Successful!'}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
