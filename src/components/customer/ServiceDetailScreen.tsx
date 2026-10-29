import React, { useState } from 'react';
import {
  ArrowLeft,
  FileCheck2,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/i18n';
import { WhatsAppContactModal } from '../common/WhatsAppContactModal';

interface ServiceDetailScreenProps {
  service: ServiceItem;
  onBack: () => void;
  onStartApplication: (service: ServiceItem) => void;
}

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({
  service,
  onBack,
  onStartApplication,
}) => {
  const { lang } = useAuth();
  const t = translations[lang];
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const totalPayable = service.serviceCharge + service.officialFee;

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-[#1267B1] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
          {lang === 'bn' ? service.categoryNameBn : service.categoryNameEn}
        </span>
      </div>

      {/* Service Title & Description */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          {lang === 'bn' ? service.titleBn : service.titleEn}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {lang === 'bn' ? service.descriptionBn : service.descriptionEn}
        </p>

        {/* Official Portal Link Badge */}
        {service.officialPortalUrl && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              {lang === 'bn' ? 'অফিসিয়াল সরকারি পোর্টাল:' : 'Official Govt Portal:'}
            </span>
            <a
              href={service.officialPortalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#1267B1] hover:underline font-semibold text-[11px]"
            >
              <span>{new URL(service.officialPortalUrl).hostname}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Fee Breakdown Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          {lang === 'bn' ? 'ফি এবং চার্জের সুস্পষ্ট বিবরণ' : 'Transparent Fee Breakdown'}
        </h3>

        <div className="space-y-2 text-xs divide-y divide-slate-100">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600">{t.serviceChargeLabel} (Afran Online Centre)</span>
            <span className="font-bold text-slate-900 font-mono">₹{service.serviceCharge}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600">{t.officialFeeLabel}</span>
            <span className="font-bold text-slate-900 font-mono">
              {service.officialFee > 0 ? `₹${service.officialFee}` : (lang === 'bn' ? 'বিনামূল্যে' : '₹0 / Free')}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 font-bold text-sm text-[#1267B1]">
            <span>{t.totalFeeLabel}</span>
            <span className="font-mono text-base">₹{totalPayable}</span>
          </div>
        </div>
      </div>

      {/* Required Documents Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#1267B1]" />
          <h3 className="text-xs font-bold text-slate-900">
            {lang === 'bn' ? 'প্রয়োজনীয় নথিপত্রের তালিকা' : 'Required Supporting Documents'}
          </h3>
        </div>

        <ul className="space-y-2 text-xs text-slate-700">
          {service.requiredDocuments.map((doc, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1267B1] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{doc}</span>
            </li>
          ))}
        </ul>

        {service.authorizationRequirement && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{service.authorizationRequirement}</span>
          </div>
        )}
      </div>

      {/* Statutory Citizen Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 text-[11px] text-slate-600 leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>{lang === 'bn' ? 'গুরুত্বপূর্ণ সতর্কতা ও আইনি ঘোষণা' : 'Important Statutory Disclaimer'}</span>
        </div>
        <p>
          {lang === 'bn'
            ? 'আফরান অনলাইন সেন্টার কোনো সরকারি দফতর বা ইউআইডিএআই (UIDAI) এর সরাসরি কর্তৃপক্ষ নয়। এটি একটি স্থানীয় বেসরকারি ডিজিটাল সেবা সহায়তা কেন্দ্র। আমরা গ্রাহকের পক্ষে অফিসিয়াল পোর্টালসমূহে তথ্য নির্ভুলভাবে জমাদানে সহায়তা করি।'
            : 'AFRAN ONLINE CENTRE is an independent digital facilitation service and not an official government body. We assist citizens with official portal submissions as per published rules.'}
        </p>
      </div>

      {/* WhatsApp Service Consultation Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-600/10 to-teal-500/10 border border-emerald-300 rounded-3xl p-4 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'bn' ? 'এই পরিষেবা নিয়ে সাহায্য প্রয়োজন?' : 'Need guidance with this service?'}
            </h4>
            <p className="text-[10px] text-slate-600">
              {lang === 'bn' ? 'হোয়াটসঅ্যাপে সেন্টারের সাথে সরাসরি কথা বলুন' : 'Chat directly with AFRAN Centre on WhatsApp'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWhatsAppModal(true)}
          className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে পরামর্শ নিন (+91 7074626784)' : 'Chat on WhatsApp (+91 7074626784)'}</span>
        </button>
      </div>

      {/* Floating Bottom Apply & WhatsApp CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg max-w-md mx-auto z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowWhatsAppModal(true)}
          title={lang === 'bn' ? 'হোয়াটসঅ্যাপে জিজ্ঞাসা করুন' : 'Ask on WhatsApp'}
          className="p-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center shrink-0"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => onStartApplication(service)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#1267B1] to-[#16B8D4] hover:from-[#0D4E87] hover:to-[#0E92A9] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition cursor-pointer active:scale-98"
        >
          <span>{t.applyNow}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* WhatsApp Modal with Service context */}
      <WhatsAppContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        serviceTitle={lang === 'bn' ? service.titleBn : service.titleEn}
      />
    </div>
  );
};
