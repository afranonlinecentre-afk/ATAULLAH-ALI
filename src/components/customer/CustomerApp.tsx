import React, { useState } from 'react';
import {
  Home,
  LayoutGrid,
  FileText,
  Bell,
  User,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Download,
  Phone
} from 'lucide-react';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { CustomerHome } from './CustomerHome';
import { AllServicesScreen } from './AllServicesScreen';
import { ServiceDetailScreen } from './ServiceDetailScreen';
import { DynamicApplicationForm } from './DynamicApplicationForm';
import { MyApplicationsScreen } from './MyApplicationsScreen';
import { ApplicationTrackingScreen } from './ApplicationTrackingScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { CustomerProfileScreen } from './CustomerProfileScreen';
import { CustomerLoginModal } from './CustomerLoginModal';
import { DownloadHub } from '../download/DownloadHub';
import { ServiceItem, ServiceApplication } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../lib/i18n';

export const CustomerApp: React.FC = () => {
  const { lang, user } = useAuth();
  const { notifications, applications } = useApp();
  const t = translations[lang];

  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'home' | 'services' | 'applications' | 'notifications' | 'profile'>('home');

  // Sub-views state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [applyingService, setApplyingService] = useState<ServiceItem | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ServiceApplication | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [showDownloadHub, setShowDownloadHub] = useState<boolean>(false);

  // Unread notifications count
  const unreadNotifs = notifications.filter(
    (n) => !n.readAt && (!user || n.recipientUid === user.uid)
  ).length;

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setApplyingService(null);
    setShowDownloadHub(false);
  };

  const handleStartApplication = (service: ServiceItem) => {
    setSelectedService(null);
    setApplyingService(service);
    setShowDownloadHub(false);
  };

  const handleTrackingAppById = (appId: string) => {
    const target = applications.find(
      (a) => a.applicationId.toUpperCase() === appId.toUpperCase() || a.id === appId
    );
    if (target) {
      setSelectedApplication(target);
      setCurrentTab('applications');
      setShowDownloadHub(false);
    }
  };

  const handleSubmissionSuccess = (appId: string) => {
    setApplyingService(null);
    setSubmittedAppId(appId);
    setShowDownloadHub(false);
    // Find newly created application and switch to it
    setTimeout(() => {
      handleTrackingAppById(appId);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-900 relative overflow-hidden select-none">
      {/* Realistic Android Status Bar */}
      <AndroidStatusBar dark={false} />

      {/* Main Top App Header */}
      <div
        className="bg-[#1267B1] text-white px-4 py-3 flex items-center justify-between shadow-xs shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center font-bold text-sm tracking-wider border border-white/20">
            AOC
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight">
              {lang === 'bn' ? 'আফরান অনলাইন সেন্টার' : 'AFRAN ONLINE CENTRE'}
            </h1>
            <p className="text-[10px] text-cyan-200">
              {lang === 'bn' ? 'ডিজিটাল সেবা ও নাগরিক পোর্টাল' : 'West Bengal Citizen Service Portal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href="tel:+917074626784"
            className="p-1.5 rounded-full hover:bg-white/10 transition text-white"
            title={lang === 'bn' ? 'সরাসরি হেল্পলাইন কল: +91 7074626784' : 'Call Helpline: +91 7074626784'}
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            onClick={() => {
              setShowDownloadHub(true);
              setSelectedService(null);
              setApplyingService(null);
              setSelectedApplication(null);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 transition relative text-white cursor-pointer"
            title={lang === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ ডাউনলোড' : 'Download Android App'}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCurrentTab('notifications');
              setSelectedService(null);
              setApplyingService(null);
              setSelectedApplication(null);
              setShowDownloadHub(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 transition relative text-white cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 ring-1 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area with smooth scroll */}
      <div className="flex-1 overflow-y-auto px-4 pt-3.5 no-scrollbar">
        {/* Success Modal / Banner upon application submission */}
        {submittedAppId && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-3xl shadow-sm text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-emerald-900">
              {lang === 'bn' ? 'আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Application Successfully Submitted!'}
            </h3>
            <p className="text-[11px] text-emerald-700">
              {lang === 'bn' ? 'আপনার ট্র্যাকিং রেফারেন্স আইডি:' : 'Your Tracking Reference ID:'}{' '}
              <strong className="font-mono text-emerald-950 font-bold">{submittedAppId}</strong>
            </p>
          </div>
        )}

        {/* View Router */}
        {showDownloadHub ? (
          <DownloadHub
            onBack={() => setShowDownloadHub(false)}
            onOpenOwnerLogin={() => setShowLoginModal(true)}
          />
        ) : applyingService ? (
          <DynamicApplicationForm
            service={applyingService}
            onBack={() => setApplyingService(null)}
            onSubmittedSuccess={handleSubmissionSuccess}
          />
        ) : selectedService ? (
          <ServiceDetailScreen
            service={selectedService}
            onBack={() => setSelectedService(null)}
            onStartApplication={handleStartApplication}
          />
        ) : selectedApplication ? (
          <ApplicationTrackingScreen
            application={selectedApplication}
            onBack={() => setSelectedApplication(null)}
          />
        ) : currentTab === 'home' ? (
          <CustomerHome
            onSelectService={handleSelectService}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              setSelectedService(null);
              setApplyingService(null);
              setSelectedApplication(null);
              setShowDownloadHub(false);
            }}
            onFilterCategory={(catId) => setSelectedCategoryId(catId)}
            onTrackAppId={handleTrackingAppById}
            onOpenDownloadHub={() => setShowDownloadHub(true)}
          />
        ) : currentTab === 'services' ? (
          <AllServicesScreen
            onSelectService={handleSelectService}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        ) : currentTab === 'applications' ? (
          <MyApplicationsScreen
            onSelectApplication={(app) => setSelectedApplication(app)}
            onNewApplication={() => setCurrentTab('services')}
          />
        ) : currentTab === 'notifications' ? (
          <NotificationsScreen onSelectApplicationById={handleTrackingAppById} />
        ) : (
          <CustomerProfileScreen
            onOpenLoginModal={() => setShowLoginModal(true)}
            onOpenDownloadHub={() => setShowDownloadHub(true)}
          />
        )}
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <div
        className="bg-white border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around shrink-0 z-30 shadow-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.375rem)' }}
      >
        <button
          onClick={() => {
            setCurrentTab('home');
            setSelectedService(null);
            setApplyingService(null);
            setSelectedApplication(null);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'home' && !selectedService && !applyingService && !selectedApplication
              ? 'text-[#1267B1] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navHome}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('services');
            setSelectedService(null);
            setApplyingService(null);
            setSelectedApplication(null);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'services' || selectedService || applyingService
              ? 'text-[#1267B1] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navServices}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('applications');
            setSelectedService(null);
            setApplyingService(null);
            setSelectedApplication(null);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'applications' || selectedApplication
              ? 'text-[#1267B1] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navApplications}</span>
          {applications.some((a) => a.status === 'Need Documents') && (
            <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1 right-2 ring-1 ring-white" />
          )}
        </button>

        <button
          onClick={() => {
            setCurrentTab('notifications');
            setSelectedService(null);
            setApplyingService(null);
            setSelectedApplication(null);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer relative ${
            currentTab === 'notifications'
              ? 'text-[#1267B1] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navNotifications}</span>
          {unreadNotifs > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-2 ring-1 ring-white" />
          )}
        </button>

        <button
          onClick={() => {
            setCurrentTab('profile');
            setSelectedService(null);
            setApplyingService(null);
            setSelectedApplication(null);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'profile'
              ? 'text-[#1267B1] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{t.navProfile}</span>
        </button>
      </div>

      {/* Customer Login Modal */}
      <CustomerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};
