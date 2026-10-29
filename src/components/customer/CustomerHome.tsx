import React, { useState } from 'react';
import {
  Search,
  Fingerprint,
  CreditCard,
  Vote,
  Car,
  PiggyBank,
  Globe,
  FileBadge,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  PhoneCall,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Smartphone,
  Download,
  MapPin,
  MessageCircle,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/seedServices';
import { ServiceItem } from '../../types';
import { translations } from '../../lib/i18n';
import { ContactUsModal } from '../common/ContactUsModal';
import { AboutUsModal } from '../common/AboutUsModal';
import { WhatsAppContactModal } from '../common/WhatsAppContactModal';

interface CustomerHomeProps {
  onSelectService: (service: ServiceItem) => void;
  onNavigateTab: (tab: 'services' | 'applications' | 'notifications' | 'profile') => void;
  onFilterCategory: (categoryId: string) => void;
  onTrackAppId: (appId: string) => void;
  onOpenDownloadHub?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectService,
  onNavigateTab,
  onFilterCategory,
  onTrackAppId,
  onOpenDownloadHub,
}) => {
  const { lang, user } = useAuth();
  const { services, applications, centreConfig } = useApp();
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Icon mapping
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fingerprint': return <Fingerprint className="w-5 h-5 text-sky-600" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-indigo-600" />;
      case 'Vote': return <Vote className="w-5 h-5 text-emerald-600" />;
      case 'Car': return <Car className="w-5 h-5 text-amber-600" />;
      case 'PiggyBank': return <PiggyBank className="w-5 h-5 text-purple-600" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-600" />;
      case 'FileBadge': return <FileBadge className="w-5 h-5 text-teal-600" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-600" />;
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    const clean = trackInput.trim().toUpperCase();
    const found = applications.find(
      a => a.applicationId.toUpperCase() === clean || a.applicationId.toUpperCase().includes(clean)
    );
    if (found) {
      setTrackError('');
      onTrackAppId(found.applicationId);
    } else {
      setTrackError(lang === 'bn' ? 'এই ট্র্যাকিং আইডি দিয়ে কোনো আবেদন খুঁজে পাওয়া যায়নি।' : 'No application found with this reference ID.');
    }
  };

  // Filtered services for instant search
  const filteredServices = searchQuery.trim()
    ? services.filter(s =>
        s.active &&
        (s.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.categoryNameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const activeUserApplications = applications.filter(
    a => a.ownerUid === user?.uid && a.status !== 'Completed' && a.status !== 'Cancelled'
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1267B1] via-[#0E528E] to-[#16B8D4] text-white p-5 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full">
              {centreConfig.centreAddressEn.split(',').slice(-2).join(',')}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[11px]">{lang === 'bn' ? 'আজ খোলা আছে' : 'Open Today'}</span>
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            {lang === 'bn' ? 'আফরান অনলাইন সেন্টার' : 'AFRAN ONLINE CENTRE'}
          </h2>
          <p className="text-xs text-white/90 mt-1 max-w-xs font-light">
            {lang === 'bn'
              ? 'পশ্চিমবঙ্গের সমস্ত অনলাইন সরকারি সেবা ও ডিজিটাল আবেদন সহায়তা কেন্দ্র।'
              : 'Complete Digital Facilitation & Online Government Services Assistance in West Bengal.'}
          </p>

          {/* Quick Contact & WhatsApp Navigation Bar */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowContactModal(true)}
              className="py-1 px-2.5 bg-white text-[#1267B1] hover:bg-white/90 rounded-xl text-[10px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-[#1267B1]" />
              <span>{lang === 'bn' ? 'যোগাযোগ (+91 7074626784)' : 'Contact Us'}</span>
            </button>
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-3 h-3 text-white" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'Chat on WhatsApp'}</span>
            </button>
            <button
              onClick={() => setShowAboutModal(true)}
              className="py-1 px-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[10px] font-semibold backdrop-blur-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3 h-3" />
              <span>{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
            </button>
          </div>

          {/* Quick Notice Banner */}
          {centreConfig.noticeBn && (
            <div className="mt-3.5 p-2.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-white/95">
                {lang === 'bn' ? centreConfig.noticeBn : centreConfig.noticeEn}
              </p>
            </div>
          )}
        </div>

        {/* Decorative circle shapes */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-12 -top-6 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg pointer-events-none" />
      </div>

      {/* PROMINENT "DOWNLOAD ANDROID APP" BUTTON BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1267B1] to-[#16B8D4] rounded-3xl p-4 text-white shadow-md border border-blue-400/30 flex items-center justify-between gap-3 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
              {lang === 'bn' ? 'অফিসিয়াল অ্যান্ড্রয়েড অ্যাপ' : 'Official Android App'}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
            {lang === 'bn' ? 'আফরান সেন্টার অ্যাপ ডাউনলোড করুন' : 'Download AFRAN Android App'}
          </h3>
          <p className="text-[11px] text-white/90 leading-tight">
            {lang === 'bn'
              ? 'মোবাইল ফোনে দ্রুত নোটিফিকেশন ও সহজ ট্র্যাকিংয়ের জন্য APK ইনস্টল করুন'
              : 'Direct APK installation for instant status alerts and seamless services'}
          </p>
        </div>

        <button
          onClick={onOpenDownloadHub}
          className="px-3.5 py-2.5 bg-white text-[#1267B1] hover:bg-blue-50 text-xs font-bold rounded-2xl shadow-md transition shrink-0 flex items-center gap-1.5 cursor-pointer relative z-10 active:scale-95"
        >
          <Download className="w-4 h-4 text-[#1267B1]" />
          <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
        </button>

        <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
      </div>

      {/* PROMINENT GREEN "CHAT ON WHATSAPP" BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-4 text-white shadow-md border border-emerald-400/30 flex items-center justify-between gap-3 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
              {lang === 'bn' ? 'হোয়াটসঅ্যাপ সরাসরি সহায়তা' : 'Direct WhatsApp Help'}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
            {lang === 'bn' ? 'আফরান সেন্টারে হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat with AFRAN Centre on WhatsApp'}
          </h3>
          <p className="text-[11px] text-emerald-100/90 leading-tight">
            {lang === 'bn'
              ? 'যেকোনো অনলাইন পরিষেবা বা নথিপত্র সংক্রান্ত প্রশ্ন সরাসরি হোয়াটসঅ্যাপে পাঠান'
              : 'Direct citizen inquiries & service help via WhatsApp (+91 7074626784)'}
          </p>
        </div>

        <button
          onClick={() => setShowWhatsAppModal(true)}
          className="px-3.5 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-2xl shadow-md transition shrink-0 flex items-center gap-1.5 cursor-pointer relative z-10 active:scale-95 group"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>{lang === 'bn' ? 'চ্যাট করুন' : 'Chat on WhatsApp'}</span>
        </button>

        <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
      </div>

      {/* Active Application Status Alert (if user has any pending) */}
      {activeUserApplications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1267B1] text-white flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {lang === 'bn' ? 'চলমান আবেদন' : 'Active Application'}: {activeUserApplications[0].applicationId}
              </p>
              <p className="text-[11px] text-slate-600 truncate max-w-[200px]">
                {lang === 'bn'
                  ? activeUserApplications[0].serviceNameSnapshotBn
                  : activeUserApplications[0].serviceNameSnapshotEn}
              </p>
            </div>
          </div>
          <button
            onClick={() => onTrackAppId(activeUserApplications[0].applicationId)}
            className="text-xs font-semibold text-[#1267B1] hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {filteredServices.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                {lang === 'bn' ? 'কোনো সেবা পাওয়া যায়নি।' : 'No matching services found.'}
              </div>
            ) : (
              filteredServices.map(service => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSearchQuery('');
                    onSelectService(service);
                  }}
                  className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-[#1267B1] uppercase tracking-wider">
                      {lang === 'bn' ? service.categoryNameBn : service.categoryNameEn}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">
                      {lang === 'bn' ? service.titleBn : service.titleEn}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {lang === 'bn' ? 'সার্ভিস চার্জ: ₹' : 'Fee: ₹'}{service.serviceCharge}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Track Application Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 text-[#16B8D4] flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">
            {lang === 'bn' ? 'আবেদনের বর্তমান স্থিতি জানুন (Track ID)' : 'Track Application Status'}
          </h3>
        </div>
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <input
            type="text"
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
            placeholder="AOC-2026-XXXXXX"
            className="flex-1 py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-[#1267B1]"
          />
          <button
            type="submit"
            className="py-2 px-3.5 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            {lang === 'bn' ? 'খুঁজুন' : 'Track'}
          </button>
        </form>
        {trackError && (
          <p className="text-[11px] text-rose-600 mt-2 font-medium">{trackError}</p>
        )}
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'সেবার ক্যাটাগরি সমূহ' : 'Service Categories'}
          </h3>
          <button
            onClick={() => onNavigateTab('services')}
            className="text-[11px] font-semibold text-[#1267B1] hover:underline flex items-center gap-0.5"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {SERVICE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                onFilterCategory(cat.id);
                onNavigateTab('services');
              }}
              className="flex flex-col items-center p-2.5 bg-white rounded-2xl border border-slate-200/80 hover:border-[#1267B1] hover:shadow-sm transition cursor-pointer group text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center mb-1.5 transition">
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="text-[11px] font-medium text-slate-700 group-hover:text-[#1267B1] leading-tight line-clamp-2">
                {lang === 'bn' ? cat.nameBn : cat.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular / Recommended Services */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'জনপ্রিয় ও প্রয়োজনীয় সেবা' : 'Popular Services'}
          </h3>
          <span className="text-[11px] text-slate-500">
            {lang === 'bn' ? 'সহজ অনলাইন আবেদন' : 'Direct Assistance'}
          </span>
        </div>

        <div className="space-y-2.5">
          {services.slice(0, 5).map(service => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 hover:border-[#1267B1] hover:shadow-xs transition cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#1267B1] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                    {lang === 'bn' ? service.categoryNameBn : service.categoryNameEn}
                  </span>
                  {service.officialFee === 0 && (
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      {lang === 'bn' ? 'সরকারি ফি নেই' : 'No Govt Fee'}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1267B1] transition leading-snug">
                  {lang === 'bn' ? service.titleBn : service.titleEn}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {lang === 'bn' ? service.descriptionBn : service.descriptionEn}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-0.5 font-medium">
                  <span>
                    {lang === 'bn' ? 'সেবা চার্জ: ' : 'Fee: '}
                    <strong className="text-slate-900">₹{service.serviceCharge}</strong>
                  </span>
                  {service.officialFee > 0 && (
                    <span className="text-slate-400">
                      + {lang === 'bn' ? 'সরকারি ফি: ₹' : 'Govt: ₹'}{service.officialFee}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#1267B1] group-hover:text-white flex items-center justify-center text-slate-400 shrink-0 transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Business Contact Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1267B1] bg-blue-50 px-2 py-0.5 rounded-md">
              {lang === 'bn' ? 'অফিসিয়াল ব্যবসা বিবরণ' : 'Official Business Details'}
            </span>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              AFRAN ONLINE CENTRE
            </h3>
            <div className="text-[11px] text-slate-700 font-medium leading-relaxed">
              <p className="font-semibold text-slate-800">UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE</p>
              <p>FARAKKA, WEST BENGAL - 742202, INDIA</p>
            </div>
            <p className="text-xs font-mono font-bold text-slate-900 pt-0.5">
              Mobile: <a href="tel:+917074626784" className="text-[#1267B1] hover:underline">+91 7074626784</a>
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1267B1] flex items-center justify-center shrink-0 border border-blue-100">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Action Buttons: Direct Call & WhatsApp Chat */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="tel:+917074626784"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1267B1] hover:bg-[#0D4E87] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call Now'}</span>
          </a>

          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer active:scale-95 group"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
            <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'Chat on WhatsApp'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <button
            onClick={() => setShowAboutModal(true)}
            className="text-[11px] font-semibold text-slate-600 hover:text-[#1267B1] transition cursor-pointer"
          >
            {lang === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}
          </button>
          <button
            onClick={() => setShowContactModal(true)}
            className="text-[11px] font-bold text-[#1267B1] hover:underline transition cursor-pointer"
          >
            {lang === 'bn' ? 'যোগাযোগ পেজ (Contact Us) →' : 'Contact Us Page →'}
          </button>
        </div>
      </div>

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

      {/* WhatsApp Pre-fill & Contact Modal */}
      <WhatsAppContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </div>
  );
};
