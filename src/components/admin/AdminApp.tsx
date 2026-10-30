import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Sliders,
  BarChart3,
  Settings,
  ShieldCheck,
  Lock,
  ArrowRight,
  LogOut,
  Sparkles,
  Download,
  Smartphone
} from 'lucide-react';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { AdminDashboard } from './AdminDashboard';
import { AdminApplicationsList } from './AdminApplicationsList';
import { AdminServiceManagement } from './AdminServiceManagement';
import { AdminReportsScreen } from './AdminReportsScreen';
import { AdminSettingsScreen } from './AdminSettingsScreen';
import { AdminApplicationDetailModal } from './AdminApplicationDetailModal';
import { AdminLoginModal } from './AdminLoginModal';
import { OwnerAdminLoginScreen } from './OwnerAdminLoginScreen';
import { DownloadHub } from '../download/DownloadHub';
import { ServiceApplication } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/i18n';

export const AdminApp: React.FC = () => {
  const { lang, user, isOwnerAdmin, setActiveApp } = useAuth();
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'services' | 'reports' | 'settings'>('dashboard');
  const [selectedApp, setSelectedApp] = useState<ServiceApplication | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAdminDownloadHub, setShowAdminDownloadHub] = useState<boolean>(false);

  // If current persona is not ownerAdmin, render dedicated Owner Admin Login Screen
  if (!isOwnerAdmin) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-white relative select-none">
        <AndroidStatusBar dark={true} />
        <OwnerAdminLoginScreen
          onSuccess={() => {
            setActiveTab('dashboard');
          }}
          onCancel={() => {
            setActiveApp('customer');
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-900 relative overflow-hidden select-none">
      {/* Android Status Bar in Dark / Navy Theme for Admin Distinction */}
      <AndroidStatusBar dark={true} />

      {/* Admin App Top Header */}
      <div
        className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm border-b border-slate-800"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/40">
            ADM
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight">
              {lang === 'bn' ? 'আফরান অনলাইন সেন্টার — মালিক অ্যাডমিন' : 'AFRAN ONLINE CENTRE — OWNER ADMIN'}
            </h1>
            <p className="text-[10px] text-cyan-300 font-mono">
              +91 7074626784 • Farakka, West Bengal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Return to Customer App */}
          <button
            onClick={() => setActiveApp('customer')}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-[10px] font-semibold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
            title={lang === 'bn' ? 'গ্রাহক অ্যাপে ফিরে যান' : 'Back to Customer App'}
          >
            <Smartphone className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'bn' ? 'গ্রাহক অ্যাপ' : 'Customer'}</span>
          </button>

          <button
            onClick={() => setShowAdminDownloadHub(true)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-cyan-400 transition cursor-pointer"
            title="Download APKs"
          >
            <Download className="w-4 h-4" />
          </button>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
            {lang === 'bn' ? 'সক্রিয়' : 'ONLINE'}
          </span>
        </div>
      </div>

      {/* Main Content Area with scroll */}
      <div className="flex-1 overflow-y-auto px-4 pt-3.5 no-scrollbar">
        {showAdminDownloadHub ? (
          <DownloadHub
            onBack={() => setShowAdminDownloadHub(false)}
            onOpenOwnerLogin={() => setShowLoginModal(true)}
          />
        ) : activeTab === 'dashboard' ? (
          <AdminDashboard
            onSelectApplication={(app) => setSelectedApp(app)}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setShowAdminDownloadHub(false);
            }}
          />
        ) : activeTab === 'applications' ? (
          <AdminApplicationsList onSelectApplication={(app) => setSelectedApp(app)} />
        ) : activeTab === 'services' ? (
          <AdminServiceManagement />
        ) : activeTab === 'reports' ? (
          <AdminReportsScreen />
        ) : (
          <AdminSettingsScreen
            onOpenOwnerLogin={() => setShowLoginModal(true)}
            onOpenDownloadHub={() => setShowAdminDownloadHub(true)}
          />
        )}
      </div>

      {/* Material 3 Bottom Navigation Bar for Owner Admin */}
      <div
        className="bg-white border-t border-slate-200/90 py-1.5 px-2 flex items-center justify-around shrink-0 z-30 shadow-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.375rem)' }}
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'dashboard' ? 'text-[#1267B1] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navDashboard}</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'applications' ? 'text-[#1267B1] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{lang === 'bn' ? 'আবেদনসমূহ' : 'Applications'}</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'services' ? 'text-[#1267B1] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{lang === 'bn' ? 'পরিষেবা' : 'Services'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'reports' ? 'text-[#1267B1] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navReports}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'settings' ? 'text-[#1267B1] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navSettings}</span>
        </button>
      </div>

      {/* Application Detail Action Modal */}
      {selectedApp && (
        <AdminApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {/* Owner Phone OTP Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};
