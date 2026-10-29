import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, X, ArrowRight, Lock, ShieldAlert, CheckCircle2 } from 'lucide-react';
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

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lang, setVerifiedAdminSession, setActiveApp } = useAuth();

  const [phone, setPhone] = useState('7074626784');
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

    const formatted = formatToE164(`+91${phone}`);
    if (formatted !== AUTHORIZED_ADMIN_PHONE) {
      setError(
        lang === 'bn'
          ? `অননুমোদিত নম্বর: শুধুমাত্র মালিকের অনুমোদিত মোবাইল (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) দিয়েই অ্যাডমিন লগইন সম্ভব।`
          : `Unauthorized: Only owner mobile (${AUTHORIZED_ADMIN_PHONE_DISPLAY}) has admin access rights.`
      );
      return;
    }

    setLoading(true);

    try {
      const result = await sendAdminSmsOtp(formatted, 'modal-admin-recaptcha');
      if (result.success && result.confirmationResult) {
        confirmationRef.current = result.confirmationResult;
        setStep('otp');
        setResendCooldown(60);
      } else {
        setError(result.error || 'ওটিপি পাঠাতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(getBengaliAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!confirmationRef.current) {
      setError(lang === 'bn' ? 'যাচাই সেশনের মেয়াদ শেষ হয়েছে।' : 'Session expired. Please resend OTP.');
      setStep('phone');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError(lang === 'bn' ? 'সঠিক ৬ সংখ্যার ওটিপি কোড লিখুন।' : 'Enter 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAdminSmsOtp(confirmationRef.current, otp.trim());
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

        setTimeout(() => {
          setVerifiedAdminSession(adminProfile, result.user);
          setActiveApp('admin');
          onSuccess?.();
          onClose();
        }, 1200);
      } else {
        setError(result.error || 'ওটিপি যাচাইকরণ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(getBengaliAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div id="modal-admin-recaptcha" className="hidden" />

      <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-950 p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
              {lang === 'bn' ? 'মালিক অ্যাডমিন প্রমাণীকরণ' : 'Owner Admin Auth'}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>AFRAN OWNER ADMIN</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {lang === 'bn'
              ? 'শুধুমাত্র অনুমোদিত মালিক নম্বরে (+91 7074626784) নিরাপদ ওটিপি যাচাইকরণ।'
              : 'Secure SMS OTP authentication on registered owner mobile (+91 7074626784).'}
          </p>
        </div>

        <div className="p-6 text-xs">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  {lang === 'bn' ? 'অনুমোদিত মালিক মোবাইল নম্বর' : 'Authorized Owner Mobile Number'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-mono font-bold">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="7074626784"
                    className="w-full pl-12 pr-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl font-mono font-bold text-sm focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {lang === 'bn' ? 'মালিক নম্বর: ' : 'Registered Owner: '}
                  <span className="font-mono text-cyan-300 font-bold">{AUTHORIZED_ADMIN_PHONE_DISPLAY}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#1267B1] to-[#16B8D4] hover:from-[#0D4E87] hover:to-[#0E92A9] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 text-center">
                  {lang === 'bn' ? 'মোবাইলে প্রেরিত ৬ সংখ্যার ওটিপি (OTP)' : 'Enter 6-digit SMS OTP'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full py-3 px-4 text-center text-xl font-mono tracking-[0.5em] bg-slate-800 border border-slate-700 text-cyan-300 rounded-xl font-bold focus:outline-hidden focus:border-cyan-400"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'যাচাই করুন ও ড্যাশবোর্ড খুলুন' : 'Verify & Open Dashboard'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  {lang === 'bn' ? '← নম্বর পরিবর্তন' : '← Change'}
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleSendOtp}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 disabled:text-slate-500"
                >
                  {resendCooldown > 0
                    ? `${resendCooldown}s ${lang === 'bn' ? 'অপেক্ষা করুন' : 'wait'}`
                    : (lang === 'bn' ? 'পুনরায় ওটিপি পাঠান' : 'Resend OTP')}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              <p className="font-bold text-white text-sm">
                {lang === 'bn' ? 'মালিক ওটিপি যাচাইকৃত!' : 'Owner Verified!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
