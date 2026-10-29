import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Phone,
  FileText,
  ChevronRight,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ServiceApplication, ApplicationStatus, PaymentStatus } from '../../types';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { SERVICE_CATEGORIES } from '../../data/seedServices';
import { translations } from '../../lib/i18n';

interface AdminApplicationsListProps {
  onSelectApplication: (app: ServiceApplication) => void;
}

export const AdminApplicationsList: React.FC<AdminApplicationsListProps> = ({
  onSelectApplication,
}) => {
  const { lang } = useAuth();
  const { applications } = useApp();
  const t = translations[lang];

  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');

  const filtered = applications.filter((app) => {
    // Status filter
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    // Category filter
    if (selectedCategory !== 'all') {
      const isMatch = app.serviceId.includes(selectedCategory) ||
        app.categoryNameSnapshotEn.toLowerCase().includes(selectedCategory.toLowerCase());
      if (!isMatch) return false;
    }
    // Payment filter
    if (selectedPayment !== 'all' && app.paymentStatus !== selectedPayment) return false;

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchId = app.applicationId.toLowerCase().includes(q);
      const matchCustomer = app.customerName.toLowerCase().includes(q);
      const matchPhone = app.customerPhone.includes(q);
      const matchService =
        app.serviceNameSnapshotBn.toLowerCase().includes(q) ||
        app.serviceNameSnapshotEn.toLowerCase().includes(q);
      return matchId || matchCustomer || matchPhone || matchService;
    }

    return true;
  });

  return (
    <div className="space-y-3.5 pb-20">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            lang === 'bn'
              ? 'আবেদন আইডি, গ্রাহকের নাম, ফোন বা সেবা খুঁজুন...'
              : 'Search by ID, customer name, phone, or service...'
          }
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="grid grid-cols-3 gap-1.5 text-xs">
        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl p-2 text-slate-700 font-medium focus:ring-1 focus:ring-[#1267B1] text-[11px]"
        >
          <option value="all">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
          <option value="Submitted">Submitted (জমা)</option>
          <option value="Under Review">Under Review (পর্যালোচনা)</option>
          <option value="Need Documents">Need Documents (নথি প্রয়োজন)</option>
          <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
          <option value="Completed">Completed (সম্পন্ন)</option>
          <option value="Rejected">Rejected (বাতিল)</option>
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl p-2 text-slate-700 font-medium focus:ring-1 focus:ring-[#1267B1] text-[11px]"
        >
          <option value="all">{lang === 'bn' ? 'সকল বিভাগ' : 'All Categories'}</option>
          {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <option key={cat.id} value={cat.id}>
              {lang === 'bn' ? cat.nameBn : cat.nameEn}
            </option>
          ))}
        </select>

        {/* Payment Dropdown */}
        <select
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl p-2 text-slate-700 font-medium focus:ring-1 focus:ring-[#1267B1] text-[11px]"
        >
          <option value="all">{lang === 'bn' ? 'পেমেন্ট: সকল' : 'Payment: All'}</option>
          <option value="Paid">Paid (পরিশোধিত)</option>
          <option value="Unpaid">Unpaid (বাকি)</option>
          <option value="Payment Pending">Pending (অপেক্ষমান)</option>
          <option value="Waived">Waived (মওকুফ)</option>
        </select>
      </div>

      {/* Results Count and Reset */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          {lang === 'bn' ? `খুঁজে পাওয়া গেছে: ${filtered.length} টি আবেদন` : `Found: ${filtered.length} applications`}
        </span>
        {(selectedStatus !== 'all' || selectedCategory !== 'all' || selectedPayment !== 'all' || query) && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedStatus('all');
              setSelectedCategory('all');
              setSelectedPayment('all');
            }}
            className="text-[#1267B1] font-semibold hover:underline"
          >
            {lang === 'bn' ? 'ফিল্টার মুছুন' : 'Reset'}
          </button>
        )}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-700">
            {lang === 'bn' ? 'কোনো আবেদন মেলেনি' : 'No matching applications found'}
          </p>
          <p className="text-[11px] text-slate-400">
            {lang === 'bn' ? 'ফিল্টার পরিবর্তন করে অনুসন্ধান করুন।' : 'Try adjusting the search criteria or filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-[#1267B1] hover:shadow-xs transition cursor-pointer space-y-2.5 group"
            >
              {/* Top Bar: ID and Status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {app.applicationId}
                </span>
                <StatusBadge status={app.status} lang={lang} size="sm" />
              </div>

              {/* Service & Customer Details */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1267B1] transition leading-snug">
                  {lang === 'bn' ? app.serviceNameSnapshotBn : app.serviceNameSnapshotEn}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                  <span className="font-semibold text-slate-800">{app.customerName}</span>
                  <span>•</span>
                  <span className="font-mono">{app.customerPhone}</span>
                </div>
              </div>

              {/* Document Count & Customer Message Preview */}
              {app.customerVisibleMessage && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl italic line-clamp-1 border border-slate-100">
                  "{app.customerVisibleMessage}"
                </p>
              )}

              {/* Bottom Meta */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{app.documentReferences.length} {lang === 'bn' ? 'টি নথি' : 'docs'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <PaymentBadge status={app.paymentStatus} lang={lang} size="sm" />
                  <span className="font-bold text-slate-900 font-mono">₹{app.totalFee}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1267B1] transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
