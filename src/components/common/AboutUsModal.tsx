import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  X,
  FileCheck,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  const { lang } = useAuth();

  if (!isOpen) return null;

  const phoneRaw = '7074626784';
  const phoneDisplay = '+91 7074626784';
  const fullAddressEn = 'UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE, FARAKKA, WEST BENGAL - 742202, INDIA';
  const fullAddressBn = 'উত্তর মহাদেবনগর, মামরেজপুর ব্রিজ, ফারাক্কা, পশ্চিমবঙ্গ - ৭৪২২০২, ভারত';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - AFRAN Blue Theme */}
        <div className="bg-gradient-to-r from-[#1267B1] via-[#0D4E87] to-[#16B8D4] text-white p-5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full">
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-base font-black tracking-tight">
            AFRAN ONLINE CENTRE
          </h3>
          <p className="text-[11px] text-cyan-200 mt-0.5 font-medium">
            {lang === 'bn'
              ? 'ডিজিটাল সেবা ও অনলাইন সরকারি আবেদন সহায়তা কেন্দ্র'
              : 'Digital Services & Online Government Application Facilitation Centre'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 leading-relaxed no-scrollbar">
          {/* Official Business Identity Card */}
          <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1267B1]" />
              <span className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'প্রতিষ্ঠান পরিচিতি' : 'Business Information'}
              </span>
            </div>

            <div className="space-y-1.5 pl-6">
              <p className="text-xs font-black text-[#1267B1] tracking-tight">
                AFRAN ONLINE CENTRE
              </p>
              <div className="text-[11px] text-slate-800 font-semibold leading-snug">
                <p>UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE</p>
                <p>FARAKKA, WEST BENGAL - 742202</p>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-900 pt-0.5">
                Mobile: <a href={`tel:+91${phoneRaw}`} className="text-[#1267B1] hover:underline">{phoneDisplay}</a>
              </p>
            </div>
          </div>

          {/* Mission and Services */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              {lang === 'bn' ? 'আমাদের লক্ষ্য ও কার্যক্রম' : 'Our Mission & Services'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'আফরান অনলাইন সেন্টার পশ্চিমবঙ্গের ফারাক্কা অঞ্চলের নাগরিকদের জন্য একটি বিশ্বস্ত ডিজিটাল সেবা সহায়তা কেন্দ্র। আমরা সরকারি পোর্টালসমূহে নির্ভুল অনলাইন আবেদনপত্র দাখিল, আধার ও প্যান সেবা সহায়তা, ভোটার পরিচয়পত্র সংশোধন, ড্রাইভিং লাইসেন্স এবং সার্টিফিকেট আবেদন প্রক্রিয়া সহজ ও স্বচ্ছভাবে পরিচালনা করি।'
                : 'AFRAN ONLINE CENTRE is a dedicated digital facilitation centre based in Farakka, West Bengal. We assist citizens with online government portal applications, PAN cards, Aadhaar correction facilitation, Voter ID services, trade licences, and certificates with full transparency.'}
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h5 className="font-bold text-slate-900 text-[11px]">
                {lang === 'bn' ? 'নির্ভুল আবেদন' : 'Accurate Submissions'}
              </h5>
              <p className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'দক্ষ অপারেটর দ্বারা যাচাইকরণ' : 'Verified by experienced staff'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
              <Award className="w-4 h-4 text-[#1267B1]" />
              <h5 className="font-bold text-slate-900 text-[11px]">
                {lang === 'bn' ? 'ন্যায্য সেবা চার্জ' : 'Transparent Fees'}
              </h5>
              <p className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'নির্দিষ্ট সরকারি ফি ও সার্ভিস চার্জ' : 'Fixed govt fees & clear charges'}
              </p>
            </div>
          </div>

          {/* Direct Contact Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:+91${phoneRaw}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1267B1] hover:bg-[#0D4E87] text-white rounded-xl text-xs font-bold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'কল করুন' : 'Call Directly'}</span>
              </a>

              <a
                href={`https://wa.me/91${phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenContact?.();
            }}
            className="text-xs font-bold text-[#1267B1] hover:underline"
          >
            {lang === 'bn' ? 'পূর্ণাঙ্গ যোগাযোগ তথ্য দেখুন →' : 'View Full Contact Info →'}
          </button>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-800 text-white font-bold rounded-xl text-xs"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
