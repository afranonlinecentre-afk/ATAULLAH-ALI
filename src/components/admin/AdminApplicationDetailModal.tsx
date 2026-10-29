import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  RefreshCw,
  Clock,
  IndianRupee,
  Phone,
  MessageSquare,
  Lock,
  Send,
  Plus
} from 'lucide-react';
import {
  ServiceApplication,
  ApplicationStatus,
  PaymentStatus,
  UploadedDocument,
  StatusHistoryItem
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { translations } from '../../lib/i18n';

interface AdminApplicationDetailModalProps {
  application: ServiceApplication;
  onClose: () => void;
}

export const AdminApplicationDetailModal: React.FC<AdminApplicationDetailModalProps> = ({
  application,
  onClose,
}) => {
  const { lang, user } = useAuth();
  const {
    updateApplicationStatus,
    requestMissingDocuments,
    updatePaymentStatus,
    getApplicationHistory
  } = useApp();
  const t = translations[lang];

  // Active tab in modal: 'details' | 'documents' | 'status_action' | 'payment' | 'history'
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'status_action' | 'payment' | 'history'>('details');

  // Status Action Form State
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>(application.status);
  const [customerMsg, setCustomerMsg] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState('');

  // Missing Documents Builder
  const [missingDocInput, setMissingDocInput] = useState('');
  const [missingDocList, setMissingDocList] = useState<string[]>([
    'স্পষ্ট আধার কার্ড স্ক্যান কপি',
    'ঠিকানার প্রমাণের মূল কপি'
  ]);

  // Payment Form State
  const [targetPaymentStatus, setTargetPaymentStatus] = useState<PaymentStatus>(application.paymentStatus);
  const [paymentMethod, setPaymentMethod] = useState(application.paymentMethod || 'Cash at Centre');
  const [paymentRef, setPaymentRef] = useState(application.paymentRef || '');
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');

  // Document Viewer Modal
  const [activeDocPreview, setActiveDocPreview] = useState<UploadedDocument | null>(null);

  // History timeline
  const [historyItems, setHistoryItems] = useState<StatusHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let mounted = true;
    getApplicationHistory(application.id).then((items) => {
      if (mounted) {
        setHistoryItems(items);
        setLoadingHistory(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [application.id, application.status]);

  const handleApplyStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingStatus(true);
    setStatusSuccess('');
    await updateApplicationStatus(
      application.id,
      targetStatus,
      customerMsg || undefined,
      internalNote || undefined
    );
    setUpdatingStatus(false);
    setStatusSuccess(
      lang === 'bn' ? 'স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!' : 'Status updated successfully!'
    );
    setTimeout(() => {
      setStatusSuccess('');
    }, 2500);
  };

  const handleRequestMissingDocs = async () => {
    if (missingDocList.length === 0) return;
    setUpdatingStatus(true);
    await requestMissingDocuments(
      application.id,
      missingDocList,
      customerMsg || (lang === 'bn' ? 'অনুগ্রহ করে যত দ্রুত সম্ভব উল্লেখিত নথি আপলোড করুন।' : 'Please upload requested documents.')
    );
    setUpdatingStatus(false);
    setTargetStatus('Need Documents');
    setStatusSuccess(
      lang === 'bn' ? 'নথি চাওয়ার অনুরোধ পাঠানো হয়েছে!' : 'Missing documents requested successfully!'
    );
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPayment(true);
    await updatePaymentStatus(application.id, targetPaymentStatus, paymentMethod, paymentRef);
    setUpdatingPayment(false);
    setPaymentSuccess(lang === 'bn' ? 'পেমেন্ট সফলভাবে সংরক্ষিত হয়েছে!' : 'Payment recorded!');
    setTimeout(() => {
      setPaymentSuccess('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-[#1267B1] px-2 py-0.5 rounded-md text-white">
                {application.applicationId}
              </span>
              <StatusBadge status={application.status} lang={lang} size="sm" />
            </div>
            <h3 className="text-xs font-bold text-white mt-1 leading-tight">
              {lang === 'bn' ? application.serviceNameSnapshotBn : application.serviceNameSnapshotEn}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-2 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#1267B1] text-[#1267B1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'আবেদন বিবরণ' : 'Details'}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#1267B1] text-[#1267B1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'নথিপত্র' : 'Documents'} ({application.documentReferences.length})
          </button>
          <button
            onClick={() => setActiveTab('status_action')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'status_action'
                ? 'border-[#1267B1] text-[#1267B1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'স্ট্যাটাস ও মেসেজ' : 'Update Status'}
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'payment'
                ? 'border-[#1267B1] text-[#1267B1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'পেমেন্ট' : 'Payment'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#1267B1] text-[#1267B1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'ইতিহাস' : 'History'}
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* TAB 1: APPLICATION DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Customer Contact Card */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'bn' ? 'নাগরিক ও আবেদনকারীর পরিচিতি' : 'Applicant Contact'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">{lang === 'bn' ? 'নাম:' : 'Name:'}</span>
                    <strong className="text-slate-900 font-bold">{application.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{lang === 'bn' ? 'ফোন নম্বর:' : 'Phone:'}</span>
                    <a
                      href={`tel:${application.customerPhone}`}
                      className="font-mono text-[#1267B1] font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{application.customerPhone}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{lang === 'bn' ? 'আবেদনের তারিখ:' : 'Applied At:'}</span>
                    <span className="font-mono text-slate-700">
                      {new Date(application.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{lang === 'bn' ? 'পেমেন্ট স্থিতি:' : 'Payment:'}</span>
                    <PaymentBadge status={application.paymentStatus} lang={lang} size="sm" />
                  </div>
                </div>
              </div>

              {/* Dynamic Form Responses */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-[#1267B1] uppercase tracking-wider block">
                  {lang === 'bn' ? 'ফর্মের পূরণকৃত তথ্যাবলী (Submitted Form Data)' : 'Submitted Form Values'}
                </span>

                <div className="space-y-2 divide-y divide-slate-200/60">
                  {Object.entries(application.formData || {}).map(([key, val]) => (
                    <div key={key} className="pt-1.5 first:pt-0">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                        {key}
                      </span>
                      <p className="text-xs font-medium text-slate-800 break-words mt-0.5">
                        {String(val)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Visible Message Note */}
              {application.customerVisibleMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                  <span className="text-[10px] font-bold text-blue-900 block mb-0.5">
                    {lang === 'bn' ? 'বর্তমান গ্রাহক বার্তা:' : 'Current Customer Message:'}
                  </span>
                  <p className="text-xs text-blue-800">{application.customerVisibleMessage}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENTS REVIEW */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  {lang === 'bn' ? 'আপলোডকৃত সুরক্ষিত নথিসমূহ' : 'Protected Customer Documents'}
                </h4>
                <span className="text-[10px] text-slate-500">
                  {application.documentReferences.length} {lang === 'bn' ? 'টি ফাইল' : 'files'}
                </span>
              </div>

              {application.documentReferences.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <p>{lang === 'bn' ? 'কোনো নথি আপলোড করা নেই' : 'No documents uploaded'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {application.documentReferences.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[260px]">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1267B1] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate">{doc.fileName}</p>
                          <p className="text-[10px] text-slate-500">
                            {doc.categoryLabel} • {(doc.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveDocPreview(doc)}
                        className="px-3 py-1.5 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-[11px] font-semibold rounded-xl flex items-center gap-1 shadow-2xs transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPDATE STATUS & SEND CUSTOMER MESSAGE */}
          {activeTab === 'status_action' && (
            <div className="space-y-4">
              {statusSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusSuccess}</span>
                </div>
              )}

              {/* Status Selector Form */}
              <form onSubmit={handleApplyStatusChange} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'নতুন স্ট্যাটাস নির্বাচন করুন:' : 'Change Application Status:'}
                  </label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1267B1] font-semibold text-slate-800"
                  >
                    <option value="Submitted">Submitted (জমা দেওয়া হয়েছে)</option>
                    <option value="Under Review">Under Review (পর্যালোচনা চলছে)</option>
                    <option value="Need Documents">Need Documents (নথি প্রয়োজন)</option>
                    <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
                    <option value="Completed">Completed (সম্পন্ন হয়েছে)</option>
                    <option value="Rejected">Rejected (বাতিল করা হয়েছে)</option>
                    <option value="Cancelled">Cancelled (প্রত্যাহার)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.customerMessage}
                  </label>
                  <textarea
                    rows={2}
                    value={customerMsg}
                    onChange={(e) => setCustomerMsg(e.target.value)}
                    placeholder={
                      lang === 'bn'
                        ? 'যেমন: আপনার আবেদন NSDL পোর্টালে জমা হয়েছে। রেফারেন্স নং: N-12345678'
                        : 'e.g. Application submitted on portal. Ack Ref: N-12345678'
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1267B1]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>{t.addInternalNote}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder={
                      lang === 'bn'
                        ? 'অভ্যন্তরীণ রেকর্ড (যেমন: গ্রাহক ৫ তারিখে সেন্টারে এসে মূল স্লিপ নিয়ে যাবেন)'
                        : 'Internal staff record (Citizen will collect original slip on 5th)'
                    }
                    className="w-full p-2.5 text-xs bg-amber-50/40 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="w-full py-2.5 px-4 bg-[#1267B1] hover:bg-[#0D4E87] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {updatingStatus ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.updateStatus}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Missing Documents Request Builder */}
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <h5 className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                  <FileQuestion className="w-4 h-4 text-orange-600" />
                  <span>{lang === 'bn' ? 'অনুপস্থিত নথির তালিকা পাঠান' : 'Missing Documents Checklist Builder'}</span>
                </h5>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={missingDocInput}
                    onChange={(e) => setMissingDocInput(e.target.value)}
                    placeholder={lang === 'bn' ? 'নতুন নথির নাম লিখুন...' : 'Add document name...'}
                    className="flex-1 p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (missingDocInput.trim()) {
                        setMissingDocList([...missingDocList, missingDocInput.trim()]);
                        setMissingDocInput('');
                      }
                    }}
                    className="px-3 bg-orange-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {missingDocList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-orange-50/70 border border-orange-200 rounded-xl text-xs flex items-center justify-between text-orange-950"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => setMissingDocList(missingDocList.filter((_, i) => i !== idx))}
                        className="text-orange-600 hover:text-orange-900 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRequestMissingDocs}
                  disabled={missingDocList.length === 0 || updatingStatus}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'গ্রাহককে নথি আপলোডের নির্দেশ পাঠান' : 'Send Missing Document Notice'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT RECORDING */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              {paymentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{paymentSuccess}</span>
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Centre Service Charge:</span>
                  <span className="font-mono font-bold">₹{application.serviceCharge}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Official Government Portal Fee:</span>
                  <span className="font-mono font-bold">₹{application.officialFee}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-slate-200 text-sm">
                  <span>Total Amount:</span>
                  <span className="font-mono text-[#1267B1]">₹{application.totalFee}</span>
                </div>
              </div>

              {/* Payment Update Form */}
              <form onSubmit={handleUpdatePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}
                  </label>
                  <select
                    value={targetPaymentStatus}
                    onChange={(e) => setTargetPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Paid">Paid (সম্পূর্ণ পরিশোধিত)</option>
                    <option value="Unpaid">Unpaid (বাকি)</option>
                    <option value="Payment Pending">Payment Pending (অপেক্ষমান)</option>
                    <option value="Waived">Waived (মওকুফ)</option>
                    <option value="Refunded">Refunded (ফেরত)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পেমেন্টের মাধ্যম' : 'Payment Method'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Cash at Centre">সেন্টারে নগদ (Cash at Centre)</option>
                    <option value="UPI / QR Code">UPI / QR কোড পেমেন্ট</option>
                    <option value="Bank Transfer">ব্যাঙ্ক ট্রান্সফার (NEFT/IMPS)</option>
                    <option value="Waived">মওকুফ / ছাড় (Waived)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ট্রানজ্যাকশন আইডি / নোট' : 'Transaction Reference / Receipt ID'}
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="যেমন: UPI-109283719"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPayment}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {updatingPayment ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{t.recordPayment}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: AUDIT HISTORY TIMELINE */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'সম্পূর্ণ অডিট ও স্ট্যাটাস ট্র্যাকিং ইতিহাস' : 'Complete Audit & Status Log'}
              </h4>

              {loadingHistory ? (
                <div className="py-6 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-[#1267B1]" />
                  <span>Loading history...</span>
                </div>
              ) : historyItems.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No audit logs found.</p>
              ) : (
                <div className="space-y-3 border-l-2 border-slate-200 ml-2 pl-4 py-1">
                  {historyItems.map((item) => (
                    <div key={item.id} className="relative space-y-1">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#1267B1] ring-4 ring-blue-50" />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">
                          {item.previousStatus} → {item.newStatus}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{item.customerMessage}</p>
                      {item.internalNote && (
                        <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-md border border-amber-200/60 font-mono">
                          Internal Note: {item.internalNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>

      {/* Document Zoom / Preview Sub-Modal */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 overflow-hidden space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {activeDocPreview.fileName}
              </h4>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto flex items-center justify-center bg-slate-100 rounded-2xl p-2">
              {activeDocPreview.fileType.startsWith('image/') && activeDocPreview.dataUrl ? (
                <img
                  src={activeDocPreview.dataUrl}
                  alt="Zoom"
                  className="max-h-[55vh] object-contain rounded-lg"
                />
              ) : (
                <div className="py-12 text-center text-xs text-slate-600">
                  <FileText className="w-14 h-14 text-[#1267B1] mx-auto mb-2" />
                  <p className="font-bold">{activeDocPreview.fileName}</p>
                  <p className="text-[10px] text-slate-400">PDF Document • Protected View</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
