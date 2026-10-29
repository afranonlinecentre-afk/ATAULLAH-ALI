import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  RefreshCw,
  Upload,
  FileText,
  Printer,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ServiceApplication, StatusHistoryItem, UploadedDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { translations } from '../../lib/i18n';

interface ApplicationTrackingScreenProps {
  application: ServiceApplication;
  onBack: () => void;
}

export const ApplicationTrackingScreen: React.FC<ApplicationTrackingScreenProps> = ({
  application,
  onBack,
}) => {
  const { lang } = useAuth();
  const { getApplicationHistory, submitMissingDocuments, centreConfig } = useApp();
  const t = translations[lang];

  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Missing doc upload state
  const [newDocs, setNewDocs] = useState<UploadedDocument[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submittingDocs, setSubmittingDocs] = useState(false);
  const [docSuccessMsg, setDocSuccessMsg] = useState('');

  // Receipt modal
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getApplicationHistory(application.id).then((items) => {
      if (isMounted) {
        setHistory(items);
        setLoadingHistory(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [application.id, application.status]);

  // Stepper definition
  const steps = [
    { key: 'Submitted', labelBn: 'জমা হয়েছে', labelEn: 'Submitted' },
    { key: 'Under Review', labelBn: 'পর্যালোচনাধীন', labelEn: 'Under Review' },
    { key: 'Processing', labelBn: 'প্রক্রিয়াধীন', labelEn: 'Processing' },
    { key: 'Completed', labelBn: 'সম্পন্ন', labelEn: 'Completed' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Under Review':
      case 'Need Documents': return 1;
      case 'Processing': return 2;
      case 'Completed': return 3;
      case 'Rejected':
      case 'Cancelled': return 1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(application.status);

  // Upload missing document handler
  const handleUploadMissingDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploadingDoc(true);
    const reader = new FileReader();
    reader.onload = () => {
      const docItem: UploadedDocument = {
        id: `missing_${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        categoryLabel: 'সংশোধিত / অতিরিক্ত নথি',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      };
      setNewDocs((prev) => [...prev, docItem]);
      setUploadingDoc(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMissingDocs = async () => {
    if (newDocs.length === 0) return;
    setSubmittingDocs(true);
    await submitMissingDocuments(application.id, newDocs);
    setSubmittingDocs(false);
    setNewDocs([]);
    setDocSuccessMsg(
      lang === 'bn'
        ? 'নতুন নথি সফলভাবে সেন্টারে পাঠানো হয়েছে!'
        : 'Documents submitted to centre successfully!'
    );
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          {application.applicationId}
        </span>
        <button
          onClick={() => setShowReceipt(true)}
          className="p-2 rounded-xl text-[#1267B1] hover:bg-blue-50 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          title="Print Receipt"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'bn' ? 'রসিদ' : 'Receipt'}</span>
        </button>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-[#1267B1] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
            {lang === 'bn' ? application.categoryNameSnapshotBn : application.categoryNameSnapshotEn}
          </span>
          <StatusBadge status={application.status} lang={lang} size="md" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">
            {lang === 'bn' ? application.serviceNameSnapshotBn : application.serviceNameSnapshotEn}
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            {lang === 'bn' ? 'আবেদনকারী: ' : 'Applicant: '}
            <strong className="text-slate-800">{application.customerName}</strong> • {application.customerPhone}
          </p>
        </div>

        {/* Stepper Visualization */}
        <div className="pt-2">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
            <div
              className="absolute top-3.5 left-4 h-0.5 bg-[#1267B1] transition-all duration-500 -z-0"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 88}%` }}
            />

            {steps.map((st, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={st.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-[#1267B1] text-white shadow-xs'
                        : isCurrent
                        ? application.status === 'Need Documents'
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                          : application.status === 'Rejected'
                          ? 'bg-rose-500 text-white ring-4 ring-rose-100'
                          : 'bg-[#1267B1] text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium text-center ${
                      isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {lang === 'bn' ? st.labelBn : st.labelEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer-Facing Message from Owner Admin */}
        {application.customerVisibleMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
              application.status === 'Need Documents'
                ? 'bg-orange-50/80 border-orange-200 text-orange-900'
                : application.status === 'Completed'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : application.status === 'Rejected'
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : 'bg-blue-50/80 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সেন্টারের আপডেট বার্তা' : 'Centre Update Message'}</span>
            </div>
            <p className="text-[11px]">{application.customerVisibleMessage}</p>
          </div>
        )}
      </div>

      {/* MISSING DOCUMENTS ACTION BOX (If Owner Admin requested additional documents) */}
      {application.status === 'Need Documents' && (
        <div className="bg-orange-50/90 border-2 border-orange-200 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-orange-900">
                {lang === 'bn' ? 'অনুপস্থিত নথির জন্য অনুরোধ' : 'Missing Documents Requested'}
              </h4>
              <p className="text-[11px] text-orange-700">
                {lang === 'bn'
                  ? 'আপনার আবেদন এগিয়ে নিয়ে যেতে অনুগ্রহ করে নিচে প্রয়োজনীয় ফাইল আপলোড করুন'
                  : 'Please upload the requested documents below to continue processing'}
              </p>
            </div>
          </div>

          {docSuccessMsg ? (
            <div className="p-3 bg-emerald-100 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{docSuccessMsg}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleUploadMissingDoc}
                  className="hidden"
                  disabled={uploadingDoc}
                />
                <div className="w-full py-2.5 px-3 border border-dashed border-orange-300 hover:border-orange-500 bg-white rounded-xl text-center text-xs text-orange-800 font-semibold flex items-center justify-center gap-2 transition">
                  <Upload className="w-4 h-4 text-orange-600" />
                  <span>
                    {uploadingDoc
                      ? (lang === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...')
                      : (lang === 'bn' ? 'সঠিক নথি নির্বাচন বা স্ক্যান করুন' : 'Select or Scan Missing File')}
                  </span>
                </div>
              </label>

              {newDocs.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {newDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 bg-white rounded-xl border border-orange-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800 truncate">{doc.fileName}</span>
                      <span className="text-[10px] text-slate-400">{(doc.fileSize / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}

                  <button
                    onClick={handleSendMissingDocs}
                    disabled={submittingDocs}
                    className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submittingDocs ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'সেন্টারে নথি জমা দিন' : 'Submit Uploaded Documents'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fee & Payment Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            {lang === 'bn' ? 'ফি এবং পেমেন্ট স্থিতি' : 'Fee & Payment Status'}
          </h3>
          <PaymentBadge status={application.paymentStatus} lang={lang} size="sm" />
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t.serviceChargeLabel}</span>
            <span className="font-mono">₹{application.serviceCharge}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t.officialFeeLabel}</span>
            <span className="font-mono">₹{application.officialFee}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-100">
            <span>{t.totalFeeLabel}</span>
            <span className="font-mono text-sm text-[#1267B1]">₹{application.totalFee}</span>
          </div>
          {application.paymentMethod && (
            <p className="text-[11px] text-slate-400 pt-1">
              {lang === 'bn' ? 'পেমেন্ট মাধ্যম: ' : 'Payment Method: '}
              <strong className="text-slate-700">{application.paymentMethod}</strong>
              {application.paymentRef && ` (${application.paymentRef})`}
            </p>
          )}
        </div>
      </div>

      {/* Audit History Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900">
          {lang === 'bn' ? 'কার্যবিবরণী ও অগ্রগতি' : 'Application History & Activity'}
        </h3>

        {loadingHistory ? (
          <div className="py-4 text-center text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-[#1267B1]" />
            <span>{lang === 'bn' ? 'ইতিহাস লোড হচ্ছে...' : 'Loading history...'}</span>
          </div>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            {lang === 'bn' ? 'কোনো পূর্ববর্তী ইতিহাস নেই।' : 'No activity history recorded.'}
          </p>
        ) : (
          <div className="space-y-3 border-l-2 border-slate-200 ml-2 pl-4 py-1">
            {history.map((item) => (
              <div key={item.id} className="relative space-y-0.5">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#1267B1] ring-4 ring-blue-50" />
                <div className="flex items-center justify-between text-[11px]">
                  <strong className="text-slate-800 font-semibold">{item.newStatus}</strong>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {item.customerMessage && (
                  <p className="text-[11px] text-slate-600">{item.customerMessage}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900">
          {lang === 'bn'
            ? `সংযুক্ত নথিপত্র (${application.documentReferences.length} টি)`
            : `Submitted Documents (${application.documentReferences.length})`}
        </h3>

        {application.documentReferences.length === 0 ? (
          <p className="text-xs text-slate-400">{lang === 'bn' ? 'কোনো ফাইল জমা নেই' : 'No documents attached'}</p>
        ) : (
          <div className="space-y-2">
            {application.documentReferences.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs"
              >
                <div className="flex items-center gap-2 truncate max-w-[220px]">
                  <FileText className="w-4 h-4 text-[#1267B1] shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{doc.fileName}</p>
                    <p className="text-[10px] text-slate-400">{doc.categoryLabel}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(doc.fileSize / 1024).toFixed(0)} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Help Card */}
      <div className="bg-slate-100 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-700">
        <div>
          <p className="font-bold text-slate-800">{lang === 'bn' ? 'সহায়তার প্রয়োজন?' : 'Need Help?'}</p>
          <p className="text-[11px] text-slate-500">
            {lang === 'bn' ? 'আমাদের সেন্টারে সরাসরি যোগাযোগ করুন' : 'Contact AFRAN ONLINE CENTRE'}
          </p>
        </div>
        <a
          href={`tel:${centreConfig.centrePhone}`}
          className="px-3 py-1.5 bg-[#1267B1] text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'কল করুন' : 'Call'}</span>
        </a>
      </div>

      {/* Official Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="text-center border-b border-slate-100 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#1267B1]">
                {centreConfig.centreNameEn}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{centreConfig.centreNameBn}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{centreConfig.centreAddressEn}</p>
              <p className="text-[10px] text-slate-500">Ph: {centreConfig.centrePhone}</p>
            </div>

            <div className="text-center bg-blue-50 py-1.5 rounded-xl">
              <span className="text-xs font-bold text-[#1267B1] uppercase tracking-wider">
                {lang === 'bn' ? 'আবেদন রসিদ ও স্বীকৃতিপত্র' : 'Service Acknowledgement Receipt'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Application ID:</span>
                <span className="font-mono font-bold">{application.applicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="font-semibold">{application.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile:</span>
                <span className="font-mono">{application.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-semibold text-right">{application.serviceNameSnapshotEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span>{new Date(application.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold">{application.status}</span>
              </div>
            </div>

            <div className="border-t border-b border-slate-200 py-2 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Centre Service Charge:</span>
                <span className="font-mono">₹{application.serviceCharge}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Government Portal Fee:</span>
                <span className="font-mono">₹{application.officialFee}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="font-mono text-sm">₹{application.totalFee}</span>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 text-center leading-tight">
              Computer-generated acknowledgement slip by AFRAN ONLINE CENTRE. For official portal verification,
              retain reference ID.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowReceipt(false)}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-1/2 py-2.5 bg-[#1267B1] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
