import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  User,
  CheckCircle2,
  ExternalLink,
  Info,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

export const WhatsAppContactModal: React.FC<WhatsAppContactModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
}) => {
  const { lang, user } = useAuth();
  const [customerName, setCustomerName] = useState('');

  // Pre-fill with authenticated customer's name if available
  useEffect(() => {
    if (user?.displayName && !customerName) {
      setCustomerName(user.displayName);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const officialNumber = '917074626784';
  const displayPhone = '+91 7074626784';

  // Format message according to exact user specification:
  // "হ্যালো AFRAN ONLINE CENTRE! আমার নাম [আপনার নাম]। আমি আপনাদের অনলাইন পরিষেবা সম্পর্কে জানতে চাই। দয়া করে আমাকে সাহায্য করবেন।"
  const nameToUse = customerName.trim() || '[আপনার নাম]';
  const serviceSuffix = serviceTitle ? ` (${serviceTitle})` : '';
  const prefilledMessage = `হ্যালো AFRAN ONLINE CENTRE! আমার নাম ${nameToUse}। আমি আপনাদের অনলাইন পরিষেবা${serviceSuffix} সম্পর্কে জানতে চাই। দয়া করে আমাকে সাহায্য করবেন।`;

  const whatsappUrl = `https://wa.me/${officialNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* WhatsApp Branded Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              {lang === 'bn' ? 'অফিসিয়াল হোয়াটসঅ্যাপ সাপোর্ট' : 'Official WhatsApp Support'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <MessageCircle className="w-7 h-7 text-white fill-white/20" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AFRAN ONLINE CENTRE</span>
              </h3>
              <p className="text-xs text-emerald-100 font-mono font-medium">
                {displayPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 leading-relaxed no-scrollbar">
          {/* Service context badge if applicable */}
          {serviceTitle && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2 text-blue-900">
              <Sparkles className="w-4 h-4 text-[#1267B1] shrink-0" />
              <div className="text-[11px]">
                <span className="font-semibold text-slate-500">
                  {lang === 'bn' ? 'নির্বাচিত পরিষেবা: ' : 'Service of interest: '}
                </span>
                <span className="font-bold text-[#1267B1]">{serviceTitle}</span>
              </div>
            </div>
          )}

          {/* Form Step: Enter Customer Name */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            <label className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'bn'
                    ? 'আপনার নাম লিখুন (বার্তায় যুক্ত করার জন্য):'
                    : 'Enter your name (to customize the greeting):'}
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {lang === 'bn' ? 'ঐচ্ছিক' : 'Optional'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: মোঃ রফিকুল ইসলাম' : 'e.g. Md. Rafiqul Islam'}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              {customerName && (
                <button
                  type="button"
                  onClick={() => setCustomerName('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              {lang === 'bn'
                ? 'আপনার নাম দিলে আফরান সেন্টার আপনাকে সরাসরি নাম ধরে সহজে উত্তর দিতে পারবে।'
                : 'Entering your name helps our centre assistant identify and assist you faster.'}
            </p>
          </div>

          {/* Live Message Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {lang === 'bn' ? 'হোয়াটসঅ্যাপ মেসেজ প্রিভিউ' : 'WhatsApp Message Preview'}
              </span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {lang === 'bn' ? 'স্বয়ংক্রিয় প্রি-ফিল' : 'Auto-prefilled'}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl relative text-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold text-xs mt-0.5">💬</span>
                <p className="text-xs leading-relaxed font-sans text-slate-900 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  {prefilledMessage}
                </p>
              </div>
              <p className="text-[10px] text-emerald-800 pl-6">
                {lang === 'bn'
                  ? 'এই মেসেজটি হোয়াটসঅ্যাপ চ্যাট বক্সে সরাসরি চলে যাবে।'
                  : 'This Bengali message will appear prefilled in your WhatsApp message input box.'}
              </p>
            </div>
          </div>

          {/* Notice - Requirement 8: User must review and click send manually */}
          <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start gap-2.5 text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed space-y-1">
              <p className="font-bold text-amber-950">
                {lang === 'bn' ? 'গুরুত্বপূর্ণ সতর্কতা (Please Note):' : 'Important Notice:'}
              </p>
              <p>
                {lang === 'bn'
                  ? 'বোতামে চাপ দিলে আপনার ডিভাইসে হোয়াটসঅ্যাপ অ্যাপ বা ওয়েব খুলবে। মেসেজটি নিজে থেকে স্বয়ংক্রিয়ভাবে যাবে না — আপনি হোয়াটসঅ্যাপে বার্তাটি দেখে নিয়ে নিজে "Send" (পাঠান) বাটনে চাপ দিন।'
                  : 'Clicking the button will open WhatsApp or WhatsApp Web. The message is NOT sent automatically; you will need to review it and click Send inside WhatsApp.'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer group"
          >
            <MessageCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>
              {lang === 'bn'
                ? 'হোয়াটসঅ্যাপে চ্যাট শুরু করুন (Chat on WhatsApp)'
                : 'Start WhatsApp Chat with AFRAN CENTRE'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-white/80" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            {lang === 'bn' ? 'বাতিল করুন' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
