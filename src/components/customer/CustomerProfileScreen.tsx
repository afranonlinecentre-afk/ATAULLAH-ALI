import React, { useState } from 'react';
import {
  User,
  Phone,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Download,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../lib/i18n';
import { ContactUsModal } from '../common/ContactUsModal';
import { AboutUsModal } from '../common/AboutUsModal';
import { WhatsAppContactModal } from '../common/WhatsAppContactModal';

interface CustomerProfileScreenProps {
  onOpenLoginModal: () => void;
  onOpenDownloadHub?: () => void;
}

export const CustomerProfileScreen: React.FC<CustomerProfileScreenProps> = ({
  onOpenLoginModal,
  onOpenDownloadHub,
}) => {
  const { user, lang, setLang, logout, quickSwitchPersona } = useAuth();
  const { centreConfig } = useApp();
  const t = translations[lang];

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  return (
    <div className="space-y-4 pb-24">
      {/* User Info Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1267B1] to-[#16B8D4] text-white flex items-center justify-center font-bold text-xl shadow-md">
            {user?.displayName ? user.displayName.charAt(0) : 'গ'}
          </div>
          <div className="space-y-0.5 flex-1 truncate">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {user?.displayName || (lang === 'bn' ? 'সম্মানিত নাগরিক' : 'Citizen Customer')}
            </h3>
            <p className="text-xs font-mono text-slate-500">{user?.phoneNumber || '+91 98765 43210'}</p>
            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {lang === 'bn' ? 'যাচাইকৃত গ্রাহক অ্যাকাউন্ট' : 'Verified Customer Account'}
            </span>
          </div>
        </div>

        {/* Language Selection Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <Globe className="w-4 h-4 text-[#1267B1]" />
            <span>{lang === 'bn' ? 'অ্যাপের ভাষা' : 'App Language'}</span>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setLang('bn')}
              className={`px-3 py-1 rounded-lg transition ${
                lang === 'bn' ? 'bg-[#1267B1] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg transition ${
                lang === 'en' ? 'bg-[#1267B1] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Centre Contact & Location Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1267B1]" />
            <h4 className="text-xs font-black text-slate-900 tracking-tight">
              AFRAN ONLINE CENTRE
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-[#1267B1] bg-blue-50 px-2 py-0.5 rounded-md">
            Farakka, WB
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#1267B1] shrink-0 mt-0.5" />
            <div className="leading-snug">
              <p className="font-bold text-slate-900 text-xs">UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE</p>
              <p className="text-slate-700 text-[11px] font-medium">FARAKKA, WEST BENGAL - 742202, INDIA</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#1267B1] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px] text-slate-600">
              {lang === 'bn' ? centreConfig.operatingHoursBn : centreConfig.operatingHoursEn}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#1267B1] shrink-0" />
            <span className="font-mono font-bold text-slate-900 text-xs">+91 7074626784</span>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="tel:+917074626784"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1267B1] hover:bg-[#0D4E87] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call Centre'}</span>
          </a>

          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 group"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
            <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'Chat on WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* Security & Privacy Settings */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-2 divide-y divide-slate-100 shadow-xs">
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <PhoneCall className="w-4 h-4 text-[#1267B1]" />
            <div>
              <span className="font-semibold text-slate-800 block">
                {lang === 'bn' ? 'অফিসিয়াল যোগাযোগ (Contact Us)' : 'Official Contact Us'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                +91 7074626784 • Farakka, West Bengal
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Building2 className="w-4 h-4 text-[#1267B1]" />
            <span className="font-semibold text-slate-800">
              {lang === 'bn' ? 'আমাদের সম্পর্কে (About AFRAN)' : 'About AFRAN ONLINE CENTRE'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onOpenDownloadHub}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Download className="w-4 h-4 text-[#1267B1]" />
            <span className="font-semibold text-slate-800">
              {lang === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ ডাউনলোড ও ইনস্টলেশন (APK)' : 'Download Android App (APK)'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800">
              {lang === 'bn' ? 'গোপনীয়তা নীতি ও নিরাপত্তা নির্দেশিকা' : 'Privacy Policy & Data Security'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => quickSwitchPersona('ownerAdmin')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <User className="w-4 h-4 text-[#1267B1]" />
            <span className="font-medium text-slate-800">
              {lang === 'bn' ? 'মালিক অ্যাডমিন ভিউতে পরিবর্তন করুন' : 'Switch to Owner Admin View'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onOpenLoginModal}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-cyan-600" />
            <span className="font-medium text-slate-800">
              {lang === 'bn' ? 'অন্য মোবাইল নম্বর দিয়ে লগইন' : 'Login with different number'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3.5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <ShieldCheck className="w-4 h-4 text-[#1267B1]" />
                <span>{lang === 'bn' ? 'তথ্য সুরক্ষা ও গোপনীয়তা নীতি' : 'Data Privacy & Security Policy'}</span>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed max-h-80 overflow-y-auto pr-1">
              <p>
                <strong>১. বেসরকারি সেবা কেন্দ্র:</strong> আফরান অনলাইন সেন্টার কোনো সরাসরি সরকারি দফতর নয়।
                আমরা পশ্চিমবঙ্গের নাগরিকদের সরকারি পোর্টালে নির্ভুল ফর্ম পূরণে সহায়তা করি।
              </p>
              <p>
                <strong>২. স্পর্শকাতর পাসওয়ার্ড ও পিন নিষেধ:</strong> আমরা কখনো আপনার ব্যক্তিগত ব্যাঙ্ক পাসওয়ার্ড,
                ইউপিআই পিন (UPI PIN) বা সরকারি পোর্টালের পাসওয়ার্ড দাবি করি না।
              </p>
              <p>
                <strong>৩. আধার নিয়মাবলী:</strong> ইউআইডিএআই এর নিয়ম মেনে পূর্ণ আধার নম্বর কখনো অনিয়ন্ত্রিতভাবে সংরক্ষণ
                করা হয় না। মোবাইল লিঙ্কিং ও পূর্ণ বায়োমেট্রিক কার্যক্রমে অনুমোদিত আধার সেবা কেন্দ্রে উপস্থিতি বাধ্যতামূলক।
              </p>
              <p>
                <strong>৪. সুরক্ষিত নথি সঞ্চয়:</strong> আপনার আপলোড করা নথি শুধুমাত্র নির্দিষ্ট আবেদন যাচাইয়ের কাজে ব্যবহৃত
                হয় এবং তৃতীয় পক্ষের নিকট কখনোই বিক্রি বা হস্তান্তর করা হয় না।
              </p>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 bg-[#1267B1] text-white text-xs font-bold rounded-xl"
            >
              {lang === 'bn' ? 'বুঝেছি / ঠিক আছে' : 'I Understand'}
            </button>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      <ContactUsModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* About Us Modal */}
      <AboutUsModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        onOpenContact={() => setShowContactModal(true)}
      />

      {/* WhatsApp Modal */}
      <WhatsAppContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </div>
  );
};
