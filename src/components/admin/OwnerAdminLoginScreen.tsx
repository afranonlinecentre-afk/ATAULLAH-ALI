import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Phone,
  Lock,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Smartphone,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import {
  AUTHORIZED_ADMIN_PHONE,
  AUTHORIZED_ADMIN_PHONE_DISPLAY,
  sendAdminSmsOtp,
  verifyAdminSmsOtp,
  getBengaliAuthErrorMessage,
  formatToE164
} from '../../services/adminAuthService';

interface OwnerAdminLoginScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const OwnerAdminLoginScreen: React.FC<OwnerAdminLoginScreenProps> = ({
  onSuccess,
  onCancel
}) => {
  const { lang, setVerifiedAdminSession, setActiveApp } = useAuth();

  const [phoneDigits, setPhoneDigits] = useState('7074626784');
  const [countryCode] = useState('+91');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setErrorCode(null);

    const fullPhone = `${countryCode}${phoneDigits.trim()}`;
    const formatted = formatToE164(fullPhone);

    // Enforce authorized admin phone check strictly before even contacting Firebase
    if (formatted !== AUTHORIZED_ADMIN_PHONE) {
      setError(
        lang === 'bn'
          ? `অননুমোদিত নম্বর: শুধুমাত্র আফরান অনলাইন সেন্টারের অনুমোদিত মালিক নম্বর (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) দিয়েই অ্যাডমিন লগইন সম্ভব। অন্য নম্বরে অ্যাডমিন সুবিধা প্রযোজ্য নয়।`
          : `Unauthorized Number: Only the registered AFRAN owner mobile (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) has admin access rights.`
      );
      setErrorCode('auth/unauthorized-phone');
      return;
    }

    setLoading(true);

    try {
      const result = await sendAdminSmsOtp(formatted, 'admin-recaptcha-container');

      if (result.success && result.confirmationResult) {
        confirmationResultRef.current = result.confirmationResult;
        setStep('otp');
        setResendCooldown(60);
      } else {
        setError(result.error || 'এসএমএস ওটিপি পাঠাতে ব্যর্থ হয়েছে।');
        setErrorCode(result.errorCode || 'UNKNOWN_ERROR');
        // If operation not allowed, automatically open config guide
        if (result.errorCode === 'auth/operation-not-allowed') {
          setShowConfigGuide(true);
        }
      }
    } catch (err: any) {
      const msg = getBengaliAuthErrorMessage(err);
      setError(msg);
      setErrorCode(err?.code || 'UNKNOWN_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorCode(null);

    if (!confirmationResultRef.current) {
      setError(
        lang === 'bn'
          ? 'যাচাইকরণ সেশন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় ওটিপি পাঠান।'
          : 'Verification session expired. Please resend OTP.'
      );
      setStep('phone');
      return;
    }

    if (!otpCode || otpCode.trim().length !== 6) {
      setError(
        lang === 'bn'
          ? 'অনুগ্রহ করে প্রাপ্ত সঠিক ৬ সংখ্যার ওটিপি কোড দিন।'
          : 'Please enter the 6-digit OTP code.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAdminSmsOtp(confirmationResultRef.current, otpCode.trim());

      if (result.success && result.user) {
        setStep('success');

        const adminProfile = {
          uid: result.user.uid,
          displayName: 'আফরান সেন্টার প্রধান (AFRAN Owner Admin)',
          phoneNumber: AUTHORIZED_ADMIN_PHONE_DISPLAY,
          email: 'afranonlinecentre@gmail.com',
          role: 'ownerAdmin' as const,
          preferredLanguage: lang,
          accountStatus: 'active' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Update authenticated state and open Admin Dashboard
        setTimeout(() => {
          setVerifiedAdminSession(adminProfile, result.user);
          setActiveApp('admin');
          onSuccess?.();
        }, 1200);
      } else {
        setError(result.error || 'ওটিপি যাচাইকরণ ব্যর্থ হয়েছে।');
        setErrorCode(result.errorCode || 'VERIFICATION_FAILED');
      }
    } catch (err: any) {
      const msg = getBengaliAuthErrorMessage(err);
      setError(msg);
      setErrorCode(err?.code || 'VERIFICATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative overflow-y-auto no-scrollbar">
      {/* Invisible container required by Firebase Phone Auth RecaptchaVerifier */}
      <div id="admin-recaptcha-container" className="hidden" />

      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#1267B1]/30 via-[#16B8D4]/10 to-transparent pointer-events-none" />

      <div className="p-5 flex-1 flex flex-col justify-between max-w-md mx-auto w-full z-10">
        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'bn' ? 'মালিক অ্যাডমিন প্রমাণীকরণ' : 'Owner Admin Security'}</span>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg transition"
              >
                {lang === 'bn' ? 'ফিরে যান' : 'Back'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1267B1] to-[#16B8D4] p-0.5 shadow-lg shadow-cyan-900/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white">
                AFRAN ONLINE CENTRE
              </h1>
              <p className="text-[11px] font-semibold text-cyan-300">
                {lang === 'bn' ? 'মালিক অ্যাডমিন মোবাইল ওটিপি লগইন' : 'Owner Admin Mobile OTP Login'}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
            {lang === 'bn'
              ? 'নিরাপত্তা বিধিমালার অধীনে শুধুমাত্র সেন্টারের অনুমোদিত মোবাইল নম্বরে প্রেরিত রিয়েল এসএমএস ওটিপি যাচাইকরণের মাধ্যমে অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করা যায়।'
              : 'Zero-trust architecture restricts admin access exclusively to SMS OTP verification on the registered owner mobile number.'}
          </p>
        </div>

        {/* Dynamic Card Body */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md mb-4">
          {/* Error Banner with Bengali details */}
          {error && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-2xl text-rose-200 text-xs flex gap-2.5 items-start animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-[11px] leading-snug">{error}</p>
                {errorCode && (
                  <p className="text-[10px] font-mono text-rose-300/80">Code: {errorCode}</p>
                )}
              </div>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'bn' ? 'অনুমোদিত মালিক মোবাইল নম্বর' : 'Authorized Owner Mobile'}</span>
                  </label>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {lang === 'bn' ? 'নিবন্ধিত নম্বর' : 'Registered'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="w-20 shrink-0 flex items-center justify-center gap-1 bg-slate-800 border border-slate-700 rounded-2xl px-2.5 py-3 text-xs font-mono font-bold text-slate-200">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneDigits}
                      onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="7074626784"
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-mono font-bold text-white tracking-wider placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{lang === 'bn' ? 'অনুমোদিত অ্যাডমিন:' : 'Authorized Admin:'}</span>
                  <span className="font-mono text-cyan-300 font-bold">{AUTHORIZED_ADMIN_PHONE_DISPLAY}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#1267B1] to-[#16B8D4] hover:from-[#0D4E87] hover:to-[#0E92A9] text-white text-xs font-bold rounded-2xl shadow-lg shadow-cyan-950 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{lang === 'bn' ? 'এসএমএস ওটিপি পাঠান' : 'Send SMS OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-200">
                  {lang === 'bn' ? 'মোবাইলে প্রেরিত ওটিপি লিখুন' : 'Enter Received OTP Code'}
                </p>
                <p className="text-[11px] font-mono text-cyan-300">
                  +91 {phoneDigits}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-center text-2xl font-mono font-bold tracking-[0.4em] text-cyan-300 placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'যাচাই করুন ও ড্যাশবোর্ড খুলুন' : 'Verify & Open Admin Dashboard'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtpCode('');
                    setError(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {lang === 'bn' ? '← নম্বর পরিবর্তন' : '← Change Number'}
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition cursor-pointer disabled:text-slate-500"
                >
                  {resendCooldown > 0
                    ? `${resendCooldown}s ${lang === 'bn' ? 'অপেক্ষা করুন' : 'wait'}`
                    : (lang === 'bn' ? 'পুনরায় ওটিপি পাঠান' : 'Resend OTP')}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'মালিক ওটিপি সফলভাবে যাচাইকৃত!' : 'Owner Verified Successfully!'}
              </h3>
              <p className="text-[11px] text-slate-300 max-w-xs">
                {lang === 'bn'
                  ? 'অ্যাডমিন অধিকার নিশ্চিত হয়েছে। অ্যাডমিন ড্যাশবোর্ড খোলা হচ্ছে...'
                  : 'Authorized admin session established. Opening Owner Dashboard...'}
              </p>
            </div>
          )}
        </div>

        {/* Firebase Live Setup & Real Device Testing Guidance Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden text-[11px]">
          <button
            onClick={() => setShowConfigGuide(!showConfigGuide)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-slate-300 hover:text-white transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-cyan-400">
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ফায়ারবেস এসএমএস কনফিগারেশন নির্দেশিকা' : 'Firebase SMS Configuration Guide'}</span>
            </span>
            {showConfigGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showConfigGuide && (
            <div className="p-4 pt-1 space-y-2.5 text-slate-300 border-t border-slate-800/80 bg-slate-950/40">
              <p className="text-[10px] text-slate-400 leading-normal">
                {lang === 'bn'
                  ? 'বাস্তব মোবাইল ডিভাইসে এসএমএস ওটিপি প্রেরণের জন্য ফায়ারবেস কনসোলে নিচের ধাপগুলো সক্রিয় থাকা প্রয়োজন:'
                  : 'For real device SMS delivery, the following settings must be active in Firebase Console:'}
              </p>

              <ol className="list-decimal list-inside space-y-1.5 text-[10px] text-slate-300">
                <li>
                  <strong className="text-white">Phone Provider:</strong> Firebase Console &gt; Authentication &gt; Sign-in method &gt; Enable <strong>Phone</strong>.
                </li>
                <li>
                  <strong className="text-white">Authorized Domains:</strong> Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains (for web iframe preview).
                </li>
                <li>
                  <strong className="text-white">Phone Numbers for Testing:</strong> In Firebase Console &gt; Authentication &gt; Sign-in method &gt; Phone &gt; "Phone numbers for testing", add:
                  <div className="mt-1 font-mono text-[9px] bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-cyan-300">
                    Phone: +91 7074626784 &nbsp;|&nbsp; Test OTP: 123456
                  </div>
                </li>
                <li>
                  <strong className="text-white">Android SHA-1:</strong> For real Android APK production builds, register the release SHA-1 fingerprint in Firebase Project Settings.
                </li>
              </ol>

              <div className="pt-1">
                <a
                  href="https://console.firebase.google.com/project/gen-lang-client-0839766457/authentication/providers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline font-semibold"
                >
                  <span>Firebase Console — Auth Providers</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Notice */}
        <div className="mt-3 text-center">
          <p className="text-[9px] text-slate-500 font-mono">
            AFRAN Zero-Trust Protocol • Owner Phone: +91 7074626784
          </p>
        </div>
      </div>
    </div>
  );
};
