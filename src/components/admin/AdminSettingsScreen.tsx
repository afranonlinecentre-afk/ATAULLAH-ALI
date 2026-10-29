import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building,
  Phone,
  Clock,
  Bell,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  User,
  ExternalLink,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../lib/i18n';

interface AdminSettingsScreenProps {
  onOpenOwnerLogin: () => void;
  onOpenDownloadHub?: () => void;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({
  onOpenOwnerLogin,
  onOpenDownloadHub,
}) => {
  const { lang, setLang, user, quickSwitchPersona } = useAuth();
  const { centreConfig, updateCentreConfig } = useApp();
  const t = translations[lang];

  const [phone, setPhone] = useState(centreConfig.centrePhone);
  const [whatsapp, setWhatsapp] = useState(centreConfig.centreWhatsApp);
  const [addrBn, setAddrBn] = useState(centreConfig.centreAddressBn);
  const [addrEn, setAddrEn] = useState(centreConfig.centreAddressEn);
  const [hoursBn, setHoursBn] = useState(centreConfig.operatingHoursBn);
  const [hoursEn, setHoursEn] = useState(centreConfig.operatingHoursEn);
  const [noticeBn, setNoticeBn] = useState(centreConfig.noticeBn);
  const [noticeEn, setNoticeEn] = useState(centreConfig.noticeEn);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateCentreConfig({
      centrePhone: phone,
      centreWhatsApp: whatsapp,
      centreAddressBn: addrBn,
      centreAddressEn: addrEn,
      operatingHoursBn: hoursBn,
      operatingHoursEn: hoursEn,
      noticeBn,
      noticeEn,
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {lang === 'bn' ? 'সেন্টারের সেটিংস ও ঘোষণা' : 'Centre Configuration & Notices'}
        </h2>
        <p className="text-[11px] text-slate-500">
          {lang === 'bn' ? 'যোগাযোগের তথ্য, অপারেটিং সময় ও জরুরি নোটিশ পরিচালনা' : 'Manage phone (+91 7074626784), Farakka address, hours and announcements'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lang === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* Owner Security Status Card */}
      <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold">
            {lang === 'bn' ? 'মালিক অ্যাডমিন অনুমোদিত যাচাইকরণ' : 'Owner Admin Verified Identity'}
          </h3>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {lang === 'bn'
            ? 'সুরক্ষিত ফায়ারবেস অথেন্টিকেশন ও আরবিক্স (RBAC) নিরাপত্তা দ্বারা সুরক্ষিত।'
            : 'Protected via Firebase Authentication and strict zero-trust Firestore security rules.'}
        </p>
        <div className="text-[10px] font-mono text-cyan-300 pt-1">
          UID: {user?.uid || 'verified-owner-admin'} • Role: ownerAdmin
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 text-xs">
        {/* Notice Board Broadcast */}
        <div className="space-y-2 pb-3 border-b border-slate-100">
          <label className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
            <Bell className="w-4 h-4 text-[#1267B1]" />
            <span>{lang === 'bn' ? 'গ্রাহকদের জন্য জরুরি নোটিশ (Notice Board)' : 'Emergency Citizen Announcement'}</span>
          </label>
          <p className="text-[10px] text-slate-400">
            {lang === 'bn' ? 'এটি গ্রাহক অ্যাপের হোমপেজে সরাসরি প্রদর্শিত হবে।' : 'This displays live on the customer app home screen banner.'}
          </p>
          <textarea
            rows={2}
            value={noticeBn}
            onChange={(e) => setNoticeBn(e.target.value)}
            placeholder="জরুরি নোটিশ লিখুন (বাংলায়)..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {lang === 'bn' ? 'সেন্টারের হেল্পলাইন ফোন' : 'Centre Helpline Phone'}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {lang === 'bn' ? 'হোয়াটসঅ্যাপ নম্বর' : 'WhatsApp Number'}
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            {lang === 'bn' ? 'অপারেটিং সময় (Operating Hours)' : 'Operating Hours'}
          </label>
          <input
            type="text"
            value={hoursBn}
            onChange={(e) => setHoursBn(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        {/* Official Address Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {lang === 'bn' ? 'সেন্টারের সম্পূর্ণ অফিসিয়াল ঠিকানা (English)' : 'Official Centre Address (English)'}
            </label>
            <textarea
              rows={2}
              value={addrEn}
              onChange={(e) => setAddrEn(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {lang === 'bn' ? 'সেন্টারের সম্পূর্ণ অফিসিয়াল ঠিকানা (বাংলা)' : 'Official Centre Address (Bengali)'}
            </label>
            <textarea
              rows={2}
              value={addrBn}
              onChange={(e) => setAddrBn(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-[#1267B1] hover:bg-[#0D4E87] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{lang === 'bn' ? 'পরিবর্তনসমূহ সংরক্ষণ করুন' : 'Save Centre Settings'}</span>
            </>
          )}
        </button>
      </form>

      {/* Language and Persona Switchers */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-3 divide-y divide-slate-100 shadow-xs text-xs">
        <div className="p-2 flex items-center justify-between">
          <span className="font-semibold text-slate-800">
            {lang === 'bn' ? 'অ্যাডমিন অ্যাপের ভাষা' : 'Admin App Language'}
          </span>
          <div className="flex bg-slate-100 p-0.5 rounded-xl font-semibold">
            <button
              onClick={() => setLang('bn')}
              className={`px-3 py-1 rounded-lg ${lang === 'bn' ? 'bg-[#1267B1] text-white shadow-2xs' : 'text-slate-600'}`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg ${lang === 'en' ? 'bg-[#1267B1] text-white shadow-2xs' : 'text-slate-600'}`}
            >
              English
            </button>
          </div>
        </div>

        <button
          onClick={onOpenDownloadHub}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#1267B1]" />
            <span className="font-semibold text-slate-800">
              {lang === 'bn' ? 'APK ডাউনলোড ও বিল্ড হাব (Download Hub)' : 'APK Downloads & Build Guide'}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => quickSwitchPersona('customer')}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#1267B1]" />
            <span className="font-semibold text-slate-800">
              {lang === 'bn' ? 'গ্রাহক অ্যাপ মোডে ফিরে যান' : 'Switch Back to Customer App Mode'}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
