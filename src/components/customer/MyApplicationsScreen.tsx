import React, { useState } from 'react';
import {
  FileText,
  Search,
  ChevronRight,
  Clock,
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ServiceApplication } from '../../types';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { translations } from '../../lib/i18n';

interface MyApplicationsScreenProps {
  onSelectApplication: (app: ServiceApplication) => void;
  onNewApplication: () => void;
}

export const MyApplicationsScreen: React.FC<MyApplicationsScreenProps> = ({
  onSelectApplication,
  onNewApplication,
}) => {
  const { lang, user } = useAuth();
  const { applications } = useApp();
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'need_docs' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter applications for current user (or all if local testing)
  const userApps = applications.filter(
    (app) => !user || app.ownerUid === user.uid || user.role === 'ownerAdmin'
  );

  const filtered = userApps.filter((app) => {
    // Tab filter
    if (activeTab === 'active') {
      if (['Completed', 'Rejected', 'Cancelled'].includes(app.status)) return false;
    } else if (activeTab === 'need_docs') {
      if (app.status !== 'Need Documents') return false;
    } else if (activeTab === 'completed') {
      if (app.status !== 'Completed') return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = app.applicationId.toLowerCase().includes(q);
      const matchService =
        app.serviceNameSnapshotBn.toLowerCase().includes(q) ||
        app.serviceNameSnapshotEn.toLowerCase().includes(q);
      const matchName = app.customerName.toLowerCase().includes(q);
      return matchId || matchService || matchName;
    }

    return true;
  });

  return (
    <div className="space-y-3.5 pb-20">
      {/* Search and Action Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'আবেদন আইডি বা সেবার নাম...' : 'Application ID or service...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1]"
          />
        </div>
        <button
          onClick={onNewApplication}
          className="px-3 py-2 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shrink-0 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'নতুন আবেদন' : 'New'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-2xl text-[11px] font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'সকল' : 'All'} ({userApps.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === 'active' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'চলমান' : 'Active'}
        </button>
        <button
          onClick={() => setActiveTab('need_docs')}
          className={`py-1.5 rounded-xl transition cursor-pointer relative ${
            activeTab === 'need_docs' ? 'bg-white text-orange-700 font-bold shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'নথি দরকার' : 'Need Docs'}
          {userApps.some((a) => a.status === 'Need Documents') && (
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full absolute top-1 right-1" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === 'completed' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
        </button>
      </div>

      {/* Applications Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1267B1] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">
            {lang === 'bn' ? 'কোনো আবেদন পাওয়া যায়নি' : 'No applications found'}
          </h4>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            {lang === 'bn'
              ? 'আফরান অনলাইন সেন্টার থেকে সহজে আধার, প্যান, ভোটার বা ড্রাইভিং লাইসেন্স সহায়তা নিন।'
              : 'Apply easily for Aadhaar, PAN, Voter or certificate services.'}
          </p>
          <button
            onClick={onNewApplication}
            className="px-4 py-2 bg-[#1267B1] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সেবা তালিকা দেখুন' : 'Explore Services'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="bg-white rounded-3xl border border-slate-200/90 p-4 hover:border-[#1267B1] hover:shadow-xs transition cursor-pointer space-y-3 group"
            >
              {/* Header ID and Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-800 tracking-wide bg-slate-100 px-2 py-0.5 rounded-md">
                  {app.applicationId}
                </span>
                <StatusBadge status={app.status} lang={lang} size="sm" />
              </div>

              {/* Service Title */}
              <div>
                <span className="text-[10px] font-semibold text-[#1267B1] uppercase tracking-wider block">
                  {lang === 'bn' ? app.categoryNameSnapshotBn : app.categoryNameSnapshotEn}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1267B1] transition leading-snug">
                  {lang === 'bn' ? app.serviceNameSnapshotBn : app.serviceNameSnapshotEn}
                </h4>
              </div>

              {/* Action Required Banner for Need Documents */}
              {app.status === 'Need Documents' && (
                <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="font-semibold truncate">
                      {lang === 'bn' ? 'অনুপস্থিত নথি আপলোড করুন' : 'Action Required: Upload missing document'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-orange-600 shrink-0" />
                </div>
              )}

              {/* Bottom Meta Bar */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PaymentBadge status={app.paymentStatus} lang={lang} size="sm" />
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1267B1] group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
