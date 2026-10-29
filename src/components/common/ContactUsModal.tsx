import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Mail,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { WhatsAppContactModal } from './WhatsAppContactModal';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useAuth();
  const { centreConfig } = useApp();
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);

  if (!isOpen) return null;

  const phoneRaw = '7074626784';
  const phoneDisplay = '+91 7074626784';
  const fullAddressEn = 'UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE, FARAKKA, WEST BENGAL - 742202, INDIA';
  const fullAddressBn = 'উত্তর মহাদেবনগর, মামরেজপুর ব্রিজ, ফারাক্কা, পশ্চিমবঙ্গ - ৭৪২২০২, ভারত';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - AFRAN Blue Theme */}
        <div className="bg-gradient-to-r from-[#1267B1] to-[#16B8D4] text-white p-5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full">
              {lang === 'bn' ? 'অফিসিয়াল যোগাযোগ' : 'Official Contact Us'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-base font-black tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-white" />
            <span>AFRAN ONLINE CENTRE</span>
          </h3>
          <p className="text-[11px] text-white/90 mt-1">
            {lang === 'bn'
              ? 'সরাসরি যোগাযোগ ও সেন্টারে আসার সম্পূর্ণ তথ্য'
              : 'Direct citizen contact and assistance details'}
          </p>
        </div>

        {/* Modal Body with smooth scrolling */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 leading-relaxed no-scrollbar">
          {/* Official Full Address Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <MapPin className="w-4 h-4 text-[#1267B1] shrink-0" />
              <span>{lang === 'bn' ? 'সেন্টারের সম্পূর্ণ অফিসিয়াল ঠিকানা' : 'Official Business Address'}</span>
            </div>

            <div className="pl-6 space-y-1">
              <p className="font-bold text-slate-900 text-xs tracking-tight">
                AFRAN ONLINE CENTRE
              </p>
              <p className="font-semibold text-slate-800 text-[11px] leading-snug break-words">
                UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE
              </p>
              <p className="text-slate-700 text-[11px] font-medium leading-snug break-words">
                FARAKKA, WEST BENGAL - 742202, INDIA
              </p>
              {lang === 'bn' && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 mt-1 leading-snug">
                  {fullAddressBn}
                </p>
              )}
            </div>

            <div className="pt-2 pl-6">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  'Mamrejpur Bridge, Farakka, West Bengal 742202'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#1267B1] hover:underline font-bold"
              >
                <Navigation className="w-3.5 h-3.5 text-[#1267B1]" />
                <span>{lang === 'bn' ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Call & WhatsApp Action Buttons */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block px-1">
              {lang === 'bn' ? 'সরাসরি হেল্পলাইন ও চ্যাট' : 'Direct Helpline & Chat'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Clickable Phone Link */}
              <a
                href={`tel:+91${phoneRaw}`}
                className="flex items-center justify-center gap-2 p-3 bg-[#1267B1] hover:bg-[#0D4E87] text-white rounded-2xl font-bold text-xs shadow-xs transition group cursor-pointer"
              >
                <Phone className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>{phoneDisplay}</span>
              </a>

              {/* Clickable WhatsApp Button */}
              <button
                type="button"
                onClick={() => setShowWhatsAppPrompt(true)}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-xs transition group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'WhatsApp Chat'}</span>
              </button>
            </div>
          </div>

          {/* Timings & Email */}
          <div className="grid grid-cols-1 gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#1267B1] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 text-[11px]">
                  {lang === 'bn' ? 'কাজের সময়সূচী' : 'Operating Timings'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {lang === 'bn' ? centreConfig.operatingHoursBn : centreConfig.operatingHoursEn}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/80">
              <Mail className="w-4 h-4 text-[#1267B1] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 text-[11px]">
                  {lang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                </p>
                <a
                  href="mailto:afranonlinecentre@gmail.com"
                  className="text-[11px] font-mono text-[#1267B1] hover:underline"
                >
                  afranonlinecentre@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Citizen Security Assurance */}
          <div className="p-3 bg-blue-50/80 border border-blue-200/90 rounded-2xl flex items-start gap-2.5 text-blue-900">
            <ShieldCheck className="w-4 h-4 text-[#1267B1] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {lang === 'bn'
                ? 'আফরান অনলাইন সেন্টার স্থানীয় নাগরিকদের ডিজিটাল সার্ভিসেস ও অনলাইন সরকারি পোর্টালে নির্ভুল ফর্ম পূরণের সহায়তা প্রদান করে।'
                : 'AFRAN ONLINE CENTRE provides citizen assistance for online government portals and digital application submissions.'}
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>

      {/* WhatsApp Pre-fill Customizer Modal */}
      <WhatsAppContactModal
        isOpen={showWhatsAppPrompt}
        onClose={() => setShowWhatsAppPrompt(false)}
      />
    </div>
  );
};
