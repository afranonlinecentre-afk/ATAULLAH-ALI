import React, { useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, X, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/i18n';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lang, loginWithPhoneOtp } = useAuth();
  const t = translations[lang];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setError(lang === 'bn' ? 'সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর লিখুন।' : 'Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setOtp('123456'); // Pre-fill test OTP for easy testing
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginWithPhoneOtp(phoneNumber || '9876543210', otp, 'customer');
    setLoading(false);
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.error || (lang === 'bn' ? 'ওটিপি যাচাই ব্যর্থ হয়েছে।' : 'OTP verification failed.'));
    }
  };

  const useTestCredentials = () => {
    setPhoneNumber('9876543210');
    setStep('otp');
    setOtp('123456');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#1267B1] to-[#16B8D4] p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 bg-white/20 rounded-full">
              {lang === 'bn' ? 'গ্রাহক যাচাইকরণ' : 'Customer Verification'}
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
              ? 'মোবাইল নম্বরে প্রেরিত ওটিপির মাধ্যমে নিরাপদ লগইন করুন'
              : 'Secure login via SMS OTP verification'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                disabled={loading}
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

              {/* Quick test credentials button */}
              <button
                type="button"
                onClick={useTestCredentials}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-[#1267B1] bg-blue-50/80 hover:bg-blue-100 rounded-xl font-medium transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'টেস্ট গ্রাহক নম্বর ব্যবহার করুন' : 'Use Test Customer Credentials'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>{lang === 'bn' ? 'প্রেরিত ওটিপি কোড (OTP)' : 'Enter 6-digit OTP'}</span>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[#1267B1] hover:underline font-medium"
                >
                  {lang === 'bn' ? 'নম্বর পরিবর্তন' : 'Change No.'}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full py-3 px-4 text-center text-xl font-mono tracking-[0.5em] bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:bg-white"
                  autoFocus
                />
              </div>

              <p className="text-[11px] text-center text-slate-500">
                {lang === 'bn'
                  ? 'টেস্টিংয়ের সুবিধার্থে ওটিপি স্বয়ংক্রিয়ভাবে পূরণ করা হয়েছে (123456)'
                  : 'Test verification OTP auto-filled (123456)'}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.verifyOtp}</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <KeyRound className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'নিরাপদ ফায়ারবেস অথেন্টিকেশন' : 'Secured by Firebase Auth'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
