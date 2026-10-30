import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Globe,
  User,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Download,
  Phone,
  MessageCircle
} from 'lucide-react';
import { CustomerApp } from '../customer/CustomerApp';
import { AdminApp } from '../admin/AdminApp';
import { DownloadHub } from '../download/DownloadHub';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/i18n';

interface DeviceFrameProps {
  onLaunchFullscreen?: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ onLaunchFullscreen }) => {
  const { activeApp, setActiveApp, lang, setLang, user, quickSwitchPersona, isOwnerAdmin } = useAuth();
  const t = translations[lang];

  // 'phone' | 'fullscreen'
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fullscreen'>('phone');
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start text-slate-100 p-2 sm:p-4 select-none">
      {/* Top Controller Bar */}
      <header className="w-full max-w-4xl bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-2.5 sm:px-4 sm:py-3 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Brand Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1267B1] to-[#16B8D4] flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-xs">
            AOC
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{lang === 'bn' ? 'আফরান অনলাইন সেন্টার' : 'AFRAN ONLINE CENTRE'}</span>
              <span className="text-[10px] font-normal text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800 hidden sm:inline">
                Farakka, WB - 742202
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">
              {lang === 'bn' ? 'গ্রাহক ও মালিক অ্যাডমিন ডুয়াল সিস্টেম' : 'Customer & Owner Admin System'}
            </p>
          </div>
        </div>

        {/* Central App Mode Switcher (Customer App vs Owner Admin App) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
          <button
            onClick={() => setActiveApp('customer')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition cursor-pointer ${
              activeApp === 'customer'
                ? 'bg-[#1267B1] text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'গ্রাহক অ্যাপ' : 'Customer App'}</span>
          </button>

          <button
            onClick={() => setActiveApp('admin')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition cursor-pointer ${
              activeApp === 'admin'
                ? 'bg-cyan-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মালিক অ্যাডমিন' : 'Owner Admin'}</span>
          </button>
        </div>

        {/* Controls: APK Download, Persona Quick Switch, Language, Viewport Toggle */}
        <div className="flex items-center gap-2">
          {/* APK Download Button */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-[#1267B1] to-[#16B8D4] hover:opacity-95 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            title="Download Android APKs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">
              {lang === 'bn' ? 'APK ডাউনলোড' : 'Download APK'}
            </span>
          </button>

          {/* Quick Persona Toggle */}
          <button
            onClick={() => quickSwitchPersona(isOwnerAdmin ? 'customer' : 'ownerAdmin')}
            className="flex items-center gap-1.5 py-1.5 px-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition cursor-pointer"
            title="Switch User Role Persona"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] hidden sm:inline">
              {isOwnerAdmin ? (lang === 'bn' ? 'মালিক' : 'Owner') : (lang === 'bn' ? 'নাগরিক' : 'Customer')}
            </span>
          </button>

          {/* Language Toggle */}
          <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setLang('bn')}
              className={`px-2.5 py-1 rounded-lg transition ${
                lang === 'bn' ? 'bg-[#1267B1] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg transition ${
                lang === 'en' ? 'bg-[#1267B1] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Viewport Mode Toggle */}
          <button
            onClick={() => setDeviceMode(deviceMode === 'phone' ? 'fullscreen' : 'phone')}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition cursor-pointer"
            title={deviceMode === 'phone' ? 'Switch to Full Screen / Tablet View' : 'Switch to Android Phone View'}
          >
            {deviceMode === 'phone' ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>

          {/* Launch Pure Mobile App View Directly */}
          {onLaunchFullscreen && (
            <button
              onClick={onLaunchFullscreen}
              className="hidden lg:flex items-center gap-1.5 py-1.5 px-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Preview pure full-screen mobile app (no mockup)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">{lang === 'bn' ? 'সরাসরি অ্যাপ' : 'Direct App'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main App Container */}
      <main className="w-full flex items-center justify-center flex-1">
        {deviceMode === 'phone' ? (
          /* Realistic Android Phone Device Frame */
          <div className="relative w-full max-w-[400px] h-[780px] max-h-[88vh] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800 flex flex-col overflow-hidden">
            {/* Top Phone Camera Punch Hole */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 border border-slate-800 shadow-inner flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-[#F8FAFC] rounded-[34px] overflow-hidden flex flex-col relative">
              {activeApp === 'customer' ? <CustomerApp /> : <AdminApp />}
            </div>

            {/* Android Navigation Pill Bar at bottom */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-40" />
          </div>
        ) : (
          /* Full Screen / Tablet View */
          <div className="w-full max-w-4xl h-[84vh] bg-[#F8FAFC] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col relative text-slate-900">
            {activeApp === 'customer' ? <CustomerApp /> : <AdminApp />}
          </div>
        )}
      </main>

      {/* Website Official Business Contact Footer */}
      <footer className="w-full max-w-4xl mt-3 pt-3 pb-2 text-center text-xs text-slate-400 space-y-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left bg-slate-800/80 p-3 sm:px-4 rounded-2xl border border-slate-700/80 shadow-md">
          <div className="space-y-0.5">
            <h4 className="font-bold text-white text-xs tracking-tight">
              AFRAN ONLINE CENTRE
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug break-words">
              UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE, FARAKKA, WEST BENGAL - 742202, INDIA
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:+917074626784"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 7074626784</span>
            </a>

            <a
              href={`https://wa.me/917074626784?text=${encodeURIComponent(
                'হ্যালো AFRAN ONLINE CENTRE! আমার নাম [আপনার নাম]। আমি আপনাদের অনলাইন পরিষেবা সম্পর্কে জানতে চাই। দয়া করে আমাকে সাহায্য করবেন।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <p className="text-[10px] text-slate-500">
          AFRAN ONLINE CENTRE • Farakka, West Bengal • Official UIDAI & Online Government Services Assistance System
        </p>
      </footer>

      {/* Global Download Hub Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#F8FAFC] text-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-700/60 relative">
            <DownloadHub
              onBack={() => setShowDownloadModal(false)}
              onOpenOwnerLogin={() => {
                setShowDownloadModal(false);
                quickSwitchPersona('ownerAdmin');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
