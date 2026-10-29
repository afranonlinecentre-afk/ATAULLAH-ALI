import React from 'react';
import {
  Download,
  Printer,
  TrendingUp,
  FileText,
  IndianRupee,
  CheckCircle2,
  PieChart,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../lib/i18n';

export const AdminReportsScreen: React.FC = () => {
  const { lang } = useAuth();
  const { applications, centreConfig } = useApp();
  const t = translations[lang];

  const totalApps = applications.length;
  const completedCount = applications.filter((a) => a.status === 'Completed').length;
  const needDocsCount = applications.filter((a) => a.status === 'Need Documents').length;
  const processingCount = applications.filter(
    (a) => a.status === 'Processing' || a.status === 'Under Review' || a.status === 'Submitted'
  ).length;

  const totalServiceChargesCollected = applications.reduce((acc, curr) => {
    return curr.paymentStatus === 'Paid' ? acc + (curr.serviceCharge || 0) : acc;
  }, 0);

  const pendingServiceCharges = applications.reduce((acc, curr) => {
    return curr.paymentStatus === 'Unpaid' || curr.paymentStatus === 'Payment Pending'
      ? acc + (curr.serviceCharge || 0)
      : acc;
  }, 0);

  // Export non-sensitive CSV report
  const handleExportCSV = () => {
    const headers = [
      'Application ID',
      'Service Name',
      'Category',
      'Customer Name',
      'Status',
      'Payment Status',
      'Service Charge (INR)',
      'Govt Fee (INR)',
      'Total (INR)',
      'Created Date'
    ];

    const rows = applications.map((app) => [
      app.applicationId,
      `"${app.serviceNameSnapshotEn.replace(/"/g, '""')}"`,
      `"${app.categoryNameSnapshotEn}"`,
      `"${app.customerName.replace(/"/g, '""')}"`,
      app.status,
      app.paymentStatus,
      app.serviceCharge,
      app.officialFee,
      app.totalFee,
      new Date(app.createdAt).toLocaleDateString()
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AOC_Operational_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header and Export buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {lang === 'bn' ? 'কার্যনির্বাহী ও আর্থিক রিপোর্ট' : 'Operational & Revenue Reports'}
          </h2>
          <p className="text-[11px] text-slate-500">
            {lang === 'bn' ? 'অপারেশনাল মেট্রিক্স ও এক্সপোর্ট' : 'Daily/Monthly statistics and CSV export'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Revenue Summary Card */}
      <div className="bg-gradient-to-br from-[#1267B1] to-[#16B8D4] text-white p-5 rounded-3xl shadow-sm space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
          {lang === 'bn' ? 'আয় ও সংগ্রহ সংক্ষেপ' : 'Revenue Summary'}
        </span>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-[10px] text-white/80 block">
              {lang === 'bn' ? 'মোট সংগৃহীত চার্জ (পরিশোধিত)' : 'Total Paid Fees'}
            </span>
            <span className="text-2xl font-bold font-mono">₹{totalServiceChargesCollected}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/80 block">
              {lang === 'bn' ? 'বকেয়া / অপেক্ষমান ফি' : 'Unpaid / Pending'}
            </span>
            <span className="text-2xl font-bold font-mono text-amber-200">₹{pendingServiceCharges}</span>
          </div>
        </div>
      </div>

      {/* Operations Performance Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900">
          {lang === 'bn' ? 'আবেদন নিষ্পত্তি ও গতিশীলতা' : 'Resolution Performance'}
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>{lang === 'bn' ? 'সম্পন্ন আবেদন (Completed)' : 'Completed'}:</span>
              <strong className="text-slate-900 font-mono">
                {completedCount} ({totalApps > 0 ? ((completedCount / totalApps) * 100).toFixed(0) : 0}%)
              </strong>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${totalApps > 0 ? (completedCount / totalApps) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>{lang === 'bn' ? 'প্রক্রিয়াধীন ও নতুন (Processing/New)' : 'In Progress'}:</span>
              <strong className="text-slate-900 font-mono">
                {processingCount} ({totalApps > 0 ? ((processingCount / totalApps) * 100).toFixed(0) : 0}%)
              </strong>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${totalApps > 0 ? (processingCount / totalApps) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>{lang === 'bn' ? 'নথি অপেক্ষমান (Need Documents)' : 'Waiting for Docs'}:</span>
              <strong className="text-slate-900 font-mono">
                {needDocsCount} ({totalApps > 0 ? ((needDocsCount / totalApps) * 100).toFixed(0) : 0}%)
              </strong>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${totalApps > 0 ? (needDocsCount / totalApps) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Centre Printable Summary */}
      <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-slate-800">{lang === 'bn' ? 'অপারেশনাল রসিদ ও রিপোর্ট প্রিন্ট' : 'Printable Daily Sheet'}</p>
          <p className="text-[11px] text-slate-500">{centreConfig.centreNameEn} • West Bengal</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-[#1267B1] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
        </button>
      </div>
    </div>
  );
};
