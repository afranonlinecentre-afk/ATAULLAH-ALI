import React from 'react';
import {
  FileText,
  Clock,
  RefreshCw,
  FileQuestion,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Calendar,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ServiceApplication } from '../../types';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { translations } from '../../lib/i18n';

interface AdminDashboardProps {
  onSelectApplication: (app: ServiceApplication) => void;
  onNavigateToTab: (tab: 'applications' | 'services' | 'reports' | 'settings') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectApplication,
  onNavigateToTab,
}) => {
  const { lang, user } = useAuth();
  const { applications, services } = useApp();
  const t = translations[lang];

  // Metrics computation
  const totalApps = applications.length;
  const submittedCount = applications.filter((a) => a.status === 'Submitted').length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const needDocsCount = applications.filter((a) => a.status === 'Need Documents').length;
  const processingCount = applications.filter((a) => a.status === 'Processing').length;
  const completedCount = applications.filter((a) => a.status === 'Completed').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const todayStr = new Date().toDateString();
  const todayAppsCount = applications.filter(
    (a) => new Date(a.createdAt).toDateString() === todayStr
  ).length;

  const totalRevenue = applications.reduce((acc, curr) => {
    return curr.paymentStatus === 'Paid' ? acc + (curr.serviceCharge || 0) : acc;
  }, 0);

  const urgentApplications = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Need Documents'
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1267B1] text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/20 rounded-full">
            {lang === 'bn' ? 'মালিক অ্যাডমিন পোর্টাল' : 'Owner Admin Panel'}
          </span>
          <span className="text-[11px] text-white/80 font-mono">
            {new Date().toLocaleDateString(lang === 'bn' ? 'bn-IN' : 'en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        <h2 className="text-base font-bold">
          {lang === 'bn' ? 'আফরান সেন্টার কন্ট্রোল বোর্ড' : 'AFRAN Operations Command'}
        </h2>
        <p className="text-xs text-white/80 mt-0.5">
          {lang === 'bn'
            ? 'সমস্ত অনলাইন পরিষেবা আবেদন, নথি নিরীক্ষণ ও স্ট্যাটাস ব্যবস্থাপনা।'
            : 'Review citizen applications, verify documents, and issue status updates.'}
        </p>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
            <span className="text-[10px] text-white/70 block">{lang === 'bn' ? 'আজকের আবেদন' : "Today's Apps"}</span>
            <span className="text-lg font-bold font-mono text-cyan-300">{todayAppsCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
            <span className="text-[10px] text-white/70 block">{lang === 'bn' ? 'সংগৃহীত চার্জ' : 'Fees Collected'}</span>
            <span className="text-lg font-bold font-mono text-emerald-300">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Applications */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-[#1267B1] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">{t.totalApplications}</span>
            <FileText className="w-4 h-4 text-[#1267B1]" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">{totalApps}</p>
        </div>

        {/* New Submitted */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-blue-700">{t.newApplications}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-blue-800 font-mono">{submittedCount}</p>
        </div>

        {/* Under Review */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-amber-700">
              {lang === 'bn' ? 'পর্যালোচনাধীন' : 'Under Review'}
            </span>
            <RefreshCw className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-amber-800 font-mono">{underReviewCount}</p>
        </div>

        {/* Need Documents */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-2xs hover:border-orange-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-orange-700">{t.needDocumentsCount}</span>
            <FileQuestion className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xl font-bold text-orange-800 font-mono">{needDocsCount}</p>
        </div>

        {/* Processing */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-indigo-700">{t.processingApplications}</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-indigo-800 font-mono">{processingCount}</p>
        </div>

        {/* Completed */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-emerald-700">{t.completedApplications}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-800 font-mono">{completedCount}</p>
        </div>

        {/* Rejected */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-rose-700">{t.rejectedApplications}</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold text-rose-800 font-mono">{rejectedCount}</p>
        </div>

        {/* Active Services */}
        <div
          onClick={() => onNavigateToTab('services')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-[#1267B1] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-700">
              {lang === 'bn' ? 'সক্রিয় সেবা' : 'Active Services'}
            </span>
            <Plus className="w-4 h-4 text-[#1267B1]" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">
            {services.filter((s) => s.active).length}
          </p>
        </div>
      </div>

      {/* Urgent Action Feed: Submitted or Need Documents */}
      {urgentApplications.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'bn' ? 'জরুরি পদক্ষেপ প্রয়োজন' : 'Requires Attention'}</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-amber-700">
              {urgentApplications.length}
            </span>
          </div>

          <div className="space-y-2">
            {urgentApplications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-2xl flex items-center justify-between hover:bg-amber-100/50 transition cursor-pointer"
              >
                <div className="space-y-0.5 truncate pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{app.applicationId}</span>
                    <StatusBadge status={app.status} lang={lang} size="sm" />
                  </div>
                  <p className="text-xs font-medium text-slate-800 truncate">
                    {app.customerName} • {lang === 'bn' ? app.serviceNameSnapshotBn : app.serviceNameSnapshotEn}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications Feed */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-slate-900">
            {lang === 'bn' ? 'সাম্প্রতিক আবেদনসমূহ' : 'Recent Citizen Submissions'}
          </h3>
          <button
            onClick={() => onNavigateToTab('applications')}
            className="text-[11px] text-[#1267B1] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {applications.slice(0, 6).map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-[#1267B1] hover:shadow-2xs transition cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1 truncate pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{app.applicationId}</span>
                  <StatusBadge status={app.status} lang={lang} size="sm" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#1267B1] transition">
                  {lang === 'bn' ? app.serviceNameSnapshotBn : app.serviceNameSnapshotEn}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{app.customerName}</span>
                  <span>•</span>
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <PaymentBadge status={app.paymentStatus} lang={lang} size="sm" />
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1267B1] group-hover:translate-x-0.5 transition shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
