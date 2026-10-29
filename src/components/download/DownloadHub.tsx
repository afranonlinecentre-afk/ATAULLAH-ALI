import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Terminal,
  ArrowLeft,
  FileCode,
  Sparkles,
  Settings,
  HelpCircle,
  Copy,
  Check,
  Phone,
  PhoneCall,
  MessageCircle,
  MapPin,
  CloudLightning
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/i18n';

interface DownloadHubProps {
  onBack?: () => void;
  onOpenOwnerLogin?: () => void;
}

export const DownloadHub: React.FC<DownloadHubProps> = ({ onBack, onOpenOwnerLogin }) => {
  const { lang, user, isOwnerAdmin } = useAuth();
  const t = translations[lang];

  // Real file availability detection
  const [customerApkAvailable, setCustomerApkAvailable] = useState<boolean>(false);
  const [adminApkAvailable, setAdminApkAvailable] = useState<boolean>(false);
  const [customerApkUrl, setCustomerApkUrl] = useState<string | null>(null);
  const [adminApkUrl, setAdminApkUrl] = useState<string | null>(null);
  const [checkingFiles, setCheckingFiles] = useState<boolean>(true);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Modals
  const [showBuildGuideModal, setShowBuildGuideModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const CUSTOMER_CANDIDATE_PATHS = [
    '/downloads/AFRAN_ONLINE_CENTRE.apk',
    '/downloads/afran-customer-app-v1.0.2.apk'
  ];
  const ADMIN_CANDIDATE_PATHS = [
    '/downloads/AFRAN_OWNER_ADMIN.apk',
    '/downloads/afran-owner-admin-v1.0.1.apk'
  ];

  // Helper to verify if an HTTP response represents a real binary APK, not an SPA HTML fallback
  const isRealApkResponse = (res: Response): boolean => {
    if (!res.ok) return false;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    // In Vite / SPA servers, missing files return text/html or application/json error
    if (ct.includes('text/html') || ct.includes('application/json')) {
      return false;
    }
    return true;
  };

  // Check if real APK files are actually hosted on server
  useEffect(() => {
    let isMounted = true;
    const verifyApkFiles = async () => {
      try {
        // Verify customer APK candidates
        for (const path of CUSTOMER_CANDIDATE_PATHS) {
          try {
            const res = await fetch(path, { method: 'HEAD' });
            if (isRealApkResponse(res) && isMounted) {
              setCustomerApkAvailable(true);
              setCustomerApkUrl(path);
              break;
            }
          } catch {
            // Path not accessible
          }
        }

        // Verify admin APK candidates
        for (const path of ADMIN_CANDIDATE_PATHS) {
          try {
            const res = await fetch(path, { method: 'HEAD' });
            if (isRealApkResponse(res) && isMounted) {
              setAdminApkAvailable(true);
              setAdminApkUrl(path);
              break;
            }
          } catch {
            // Path not accessible
          }
        }
      } finally {
        if (isMounted) setCheckingFiles(false);
      }
    };

    verifyApkFiles();
    return () => {
      isMounted = false;
    };
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadClick = async (type: 'customer' | 'admin') => {
    setDownloadError(null);

    if (type === 'admin' && !isOwnerAdmin) {
      onOpenOwnerLogin?.();
      return;
    }

    const isCustomer = type === 'customer';
    const isAvailable = isCustomer ? customerApkAvailable : adminApkAvailable;
    const verifiedPath = isCustomer ? customerApkUrl : adminApkUrl;
    const targetFilename = isCustomer ? 'AFRAN_ONLINE_CENTRE.apk' : 'AFRAN_OWNER_ADMIN.apk';

    if (isAvailable && verifiedPath) {
      setDownloading(true);
      try {
        // Double check file still exists and is binary before initiating browser download
        const headCheck = await fetch(verifiedPath, { method: 'HEAD' });
        if (!isRealApkResponse(headCheck)) {
          throw new Error('APK file is missing or invalid on server');
        }

        // Create standard downloadable anchor link to avoid iframe navigation stalls
        const link = document.createElement('a');
        link.href = verifiedPath;
        link.setAttribute('download', targetFilename);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        const errorMsg = lang === 'bn'
          ? 'ডাউনলোড অনুরোধ ব্যর্থ হয়েছে: সার্ভারে APK ফাইলটি পাওয়া যায়নি (HTTP 404)। বিল্ড সম্পন্ন করে ফাইল যুক্ত করুন।'
          : 'Download failed: APK binary was not found on the server (HTTP 404). Please build and host the binary first.';
        setDownloadError(errorMsg);
        setShowBuildGuideModal(true);
      } finally {
        setDownloading(false);
      }
    } else {
      // APK is not yet generated / uploaded to server
      const notFoundMsg = lang === 'bn'
        ? 'Android APK ফাইলটি এখনও তৈরি করা হয়নি। এটি একটি React ওয়েব প্রজেক্ট। নিচে দেওয়া বিল্ড নির্দেশিকা অনুযায়ী প্রথমে APK তৈরি করুন।'
        : 'The Android APK binary is not available yet. This is a React web project. Please generate the Android APK first following the guide below.';
      setDownloadError(notFoundMsg);
      setShowBuildGuideModal(true);
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              {lang === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ ডাউনলোড হাব' : 'Android App Download Hub'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {lang === 'bn' ? 'অফিসিয়াল অ্যান্ড্রয়েড APK ডাউনলোড ও ইনস্টলেশন নির্দেশিকা' : 'Official Android APK downloads and installation guide'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBuildGuideModal(true)}
          className="px-2.5 py-1 bg-blue-50 text-[#1267B1] hover:bg-blue-100 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'bn' ? 'বিল্ড তথ্য' : 'Build Info'}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1267B1] via-[#0E528E] to-[#16B8D4] text-white p-5 shadow-md">
        <div className="relative z-10 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
            {lang === 'bn' ? 'অফিসিয়াল অ্যান্ড্রয়েড সংস্করণ' : 'Official Android Builds'}
          </span>
          <h3 className="text-base font-bold">
            {lang === 'bn' ? 'আফরান অনলাইন সেন্টার মোবাইল অ্যাপ' : 'AFRAN ONLINE CENTRE Mobile Applications'}
          </h3>
          <p className="text-xs text-white/90 leading-relaxed font-light max-w-sm">
            {lang === 'bn'
              ? 'পশ্চিমবঙ্গের যেকোনো প্রান্ত থেকে দ্রুত সরকারি সেবা সহায়তা, রিয়েল-টাইম ট্র্যাকিং ও তাৎক্ষণিক নোটিফিকেশনের জন্য সরাসরি অ্যাপ ইনস্টল করুন।'
              : 'Install the dedicated Android applications for rapid service tracking, push notifications, and seamless document submissions.'}
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Visible Error Notification if Download Fails or File is Missing */}
      {downloadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-3xl text-xs text-red-900 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{lang === 'bn' ? 'ডাউনলোড ত্রুটি / ফাইল অনুপস্থিত' : 'Download Error / File Not Found'}</span>
            </div>
            <button
              onClick={() => setDownloadError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-red-800 pl-6">
            {downloadError}
          </p>
        </div>
      )}

      {/* TWO SEPARATE DOWNLOAD CARDS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            {lang === 'bn' ? 'উপলব্ধ অ্যাপ্লিকেশন প্যাকেজসমূহ' : 'Available Application Packages'}
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Android 8.0+</span>
        </div>

        {/* CARD 1: CUSTOMER APP */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:border-[#1267B1] transition">
          <div className="flex items-start justify-between gap-3">
            {/* App Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1267B1] to-[#16B8D4] text-white flex flex-col items-center justify-center shadow-md shrink-0 border border-white/20">
              <span className="text-xs font-black tracking-wider">AOC</span>
              <span className="text-[9px] font-bold text-cyan-200">CUSTOMER</span>
            </div>

            <div className="flex-1 truncate space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                  {lang === 'bn' ? 'নাগরিক অ্যাপ' : 'Customer Edition'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">v1.0.2</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {lang === 'bn' ? 'আফরান অনলাইন সেন্টার' : 'AFRAN ONLINE CENTRE'}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                com.afran.onlinecentre.customer
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'ফাইলের আকার' : 'File Size'}</span>
              <strong className="text-slate-800 font-mono text-[11px]">~14.8 MB</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'ভার্সন' : 'Version'}</span>
              <strong className="text-slate-800 font-mono text-[11px]">v1.0.2</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'ফাইলের নাম' : 'Package'}</span>
              <strong className="text-slate-800 font-mono text-[11px]">AFRAN_ONLINE_CENTRE.apk</strong>
            </div>
          </div>

          {/* APK Status Notice */}
          {!customerApkAvailable && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {lang === 'bn' ? 'APK প্রস্তুত করা হচ্ছে (APK not available yet)' : 'APK not available yet'}
                </p>
                <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                  {lang === 'bn'
                    ? 'অ্যান্ড্রয়েড বাইনারি বিল্ড এখনও সার্ভারে আপলোড করা হয়নি। নিচে দেওয়া নির্দেশিকা অনুসরণ করে Android Studio বা Capacitor দ্বারা APK বিল্ড তৈরি করুন।'
                    : 'The Android build must be generated before downloading. Follow the step-by-step instructions below.'}
                </p>
              </div>
            </div>
          )}

          {/* Download APK Button */}
          <button
            onClick={() => handleDownloadClick('customer')}
            disabled={downloading}
            className="w-full py-3 px-4 bg-[#1267B1] hover:bg-[#0D4E87] active:scale-98 disabled:opacity-75 text-white text-xs font-bold rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            <span>
              {downloading
                ? (lang === 'bn' ? 'ডাউনলোড যাচাই করা হচ্ছে...' : 'Verifying download...')
                : customerApkAvailable
                ? (lang === 'bn' ? 'গ্রাহক APK ডাউনলোড করুন (AFRAN_ONLINE_CENTRE.apk)' : 'Download Customer APK (AFRAN_ONLINE_CENTRE.apk)')
                : (lang === 'bn' ? 'APK বিল্ড নির্দেশিকা দেখুন (APK Not Built Yet)' : 'APK Not Available Yet — View Build Guide')}
            </span>
          </button>
        </div>

        {/* CARD 2: OWNER ADMIN APP (RESTRICTED ACCESS) */}
        <div
          className={`rounded-3xl border p-5 shadow-xs space-y-4 transition ${
            isOwnerAdmin
              ? 'bg-white border-slate-200/90 hover:border-cyan-500'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Admin App Icon */}
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-cyan-400 flex flex-col items-center justify-center shadow-md shrink-0 border border-cyan-500/40">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <span className="text-[8px] font-bold tracking-widest text-white/80">ADMIN</span>
            </div>

            <div className="flex-1 truncate space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-md uppercase border border-cyan-800/80">
                  {lang === 'bn' ? 'মালিক সংস্করণ (নিরাপদ)' : 'Owner Admin Edition'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">v1.0.1</span>
              </div>
              <h4 className={`text-xs font-bold leading-tight ${isOwnerAdmin ? 'text-slate-900' : 'text-white'}`}>
                {lang === 'bn' ? 'আফরান সেন্টার — মালিক অ্যাডমিন' : 'AFRAN ONLINE CENTRE — OWNER ADMIN'}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                com.afran.onlinecentre.admin
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div
            className={`grid grid-cols-3 gap-2 p-2.5 rounded-2xl border text-center text-xs ${
              isOwnerAdmin ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'ফাইলের আকার' : 'File Size'}</span>
              <strong className={`font-mono text-[11px] ${isOwnerAdmin ? 'text-slate-800' : 'text-white'}`}>
                ~16.2 MB
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'ভার্সন' : 'Version'}</span>
              <strong className={`font-mono text-[11px] ${isOwnerAdmin ? 'text-slate-800' : 'text-white'}`}>
                v1.0.1
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'অ্যাক্সেস' : 'Access'}</span>
              <strong className="text-cyan-400 font-mono text-[11px]">
                {isOwnerAdmin ? (lang === 'bn' ? 'অনুমোদিত' : 'Authorized') : (lang === 'bn' ? 'সীমাবদ্ধ' : 'Restricted')}
              </strong>
            </div>
          </div>

          {/* Security Gate & Protection Notice */}
          {!isOwnerAdmin ? (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'শুধুমাত্র অনুমোদিত মালিকের জন্য সংরক্ষিত' : 'Restricted to Verified Centre Owner'}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400">
                {lang === 'bn'
                  ? 'নিরাপত্তার স্বার্থে মালিক অ্যাডমিন APK সর্বসাধারণের জন্য উন্মুক্ত নয়। ডাউনলোড করতে প্রথমে মালিক অ্যাকাউন্টে যাচাই করুন।'
                  : 'To protect administrative control and sensitive operations, the owner admin package is accessible only to authenticated owners.'}
              </p>
            </div>
          ) : !adminApkAvailable ? (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {lang === 'bn' ? 'অ্যাডমিন APK প্রস্তুত করা হচ্ছে (APK not available yet)' : 'Admin APK not available yet'}
                </p>
                <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                  {lang === 'bn'
                    ? 'মালিক সংস্করণ অ্যান্ড্রয়েড বাইনারি বিল্ড সম্পন্ন হলে এখানে ডাউনলোড সক্রিয় হবে।'
                    : 'The owner admin build must be generated before downloading.'}
                </p>
              </div>
            </div>
          ) : null}

          {/* Action Button */}
          <button
            onClick={() => handleDownloadClick('admin')}
            disabled={downloading}
            className={`w-full py-3 px-4 text-xs font-bold rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75 ${
              !isOwnerAdmin
                ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black'
                : adminApkAvailable
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {!isOwnerAdmin ? (
              <>
                <Lock className="w-4 h-4" />
                <span>{lang === 'bn' ? 'মালিক হিসাবে যাচাই করে আনলক করুন' : 'Verify as Owner to Unlock Download'}</span>
              </>
            ) : downloading ? (
              <>
                <Download className="w-4 h-4 animate-bounce" />
                <span>{lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
              </>
            ) : adminApkAvailable ? (
              <>
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অ্যাডমিন APK ডাউনলোড করুন (AFRAN_OWNER_ADMIN.apk)' : 'Download Owner Admin APK (AFRAN_OWNER_ADMIN.apk)'}</span>
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অ্যাডমিন APK বিল্ড নির্দেশিকা দেখুন' : 'View Admin APK Build Instructions'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 5: INSTALLATION GUIDE IN BENGALI */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Smartphone className="w-5 h-5 text-[#1267B1]" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              {lang === 'bn' ? 'অ্যান্ড্রয়েড ফোনে APK ইনস্টল করার সহজ নিয়মাবলী' : 'Android APK Installation Instructions'}
            </h3>
            <p className="text-[10px] text-slate-500">
              {lang === 'bn' ? 'মাত্র ৪টি সহজ ধাপে অ্যাপটি আপনার ফোনে ইনস্টল করুন' : 'Follow these 4 simple steps to install the APK'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#1267B1] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ১
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'APK ডাউনলোড নিশ্চিত করুন' : 'Confirm Download'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'উপরে "Download APK" বাটনে ক্লিক করলে আপনার ব্রাউজারে একটি সতর্কবার্তা আসতে পারে: "File might be harmful"। যেহেতু এটি অফিশিয়াল স্থানীয় সেন্টার অ্যাপ, কোনো দ্বিধা ছাড়াই "Download anyway" বা "তবুও ডাউনলোড করুন" নির্বাচন করুন।'
                  : 'When downloading, browser may warn "File might be harmful". Choose "Download anyway" to proceed with the verified centre package.'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#1267B1] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ২
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'অজানা অ্যাপ ইনস্টলের অনুমতি দিন (Install Unknown Apps)' : 'Allow Unknown Apps'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'ডাউনলোড সম্পন্ন হলে ফাইলটিতে ট্যাপ করুন। যদি "Blocked by Play Protect" বা "Settings" দেখায়, তবে "Settings" এ যান এবং "Allow from this source" (এই উৎস থেকে অনুমতি দিন) অন করুন।'
                  : 'Open the downloaded file. If prompted by Android Settings, toggle "Allow from this source" for your browser or file manager.'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#1267B1] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ৩
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'ইনস্টল বাটনে ট্যাপ করুন' : 'Tap Install'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'প্যাকেজ ইনস্টলার স্ক্রিনে "Install" বোতাম চাপুন। কয়েক সেকেন্ডের মধ্যে ইনস্টলেশন সম্পন্ন হয়ে যাবে।'
                  : 'Tap "Install" on the Android Package Installer prompt. Installation takes a few seconds.'}
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#1267B1] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ৪
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'bn' ? 'অ্যাপ ওপেন করুন ও ওটিপি দিয়ে লগইন করুন' : 'Open and Login'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'ইনস্টল শেষ হলে "Open" করুন এবং আপনার ১০ সংখ্যার মোবাইল নম্বর দিয়ে সুরক্ষিত ফায়ারবেস ওটিপি (OTP) যাচাই সম্পন্ন করে সরাসরি সেবা গ্রহণ শুরু করুন।'
                  : 'Launch the application and authenticate securely using your 10-digit mobile phone OTP.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Business Details & Support Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1267B1] bg-blue-50 px-2 py-0.5 rounded-md">
              {lang === 'bn' ? 'অফিসিয়াল সহায়তা ও কেন্দ্র ঠিকানা' : 'Official Business & Support'}
            </span>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">
              AFRAN ONLINE CENTRE
            </h4>
            <div className="text-[11px] text-slate-700 font-medium leading-relaxed">
              <p className="font-semibold text-slate-800">UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE</p>
              <p>FARAKKA, WEST BENGAL - 742202, INDIA</p>
            </div>
            <p className="text-xs font-mono font-bold text-slate-900 pt-0.5">
              Mobile: <a href="tel:+917074626784" className="text-[#1267B1] hover:underline">+91 7074626784</a>
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1267B1] flex items-center justify-center shrink-0 border border-blue-100">
            <Phone className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href="tel:+917074626784"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1267B1] hover:bg-[#0D4E87] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call Directly'}</span>
          </a>

          <a
            href="https://wa.me/917074626784"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* TECHNICAL APK BUILD GUIDE MODAL */}
      {showBuildGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 border border-slate-200 shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#1267B1]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {lang === 'bn' ? 'অ্যান্ড্রয়েড APK বিল্ড প্রস্তুতকরণ নির্দেশিকা' : 'How to Build Android APK'}
                </h3>
              </div>
              <button
                onClick={() => setShowBuildGuideModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900">
                <p className="font-bold flex items-center gap-1.5 text-xs text-[#1267B1]">
                  <Sparkles className="w-4 h-4 text-[#16B8D4]" />
                  <span>{lang === 'bn' ? 'শুধুমাত্র মোবাইল ফোন দিয়ে Android APK তৈরি করুন' : 'Cloud APK Build for Mobile Users'}</span>
                </p>
                <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? 'আপনার কাছে যদি কম্পিউটার বা ল্যাপটপ না থাকে, কোনো চিন্তা নেই! এই প্রজেক্টটিতে স্বয়ংক্রিয় GitHub Actions ক্লাউড বিল্ড কনফিগার করা হয়েছে। উবুন্টু ক্লাউড সার্ভারে স্বয়ংক্রিয়ভাবে APK বিল্ড হবে এবং আপনি সরাসরি নিজের ফোনে ডাউনলোড করতে পারবেন।'
                    : 'No PC needed! A preconfigured GitHub Actions workflow automatically builds the Android APK on a cloud runner so you can download it directly to your phone.'}
                </p>
              </div>

              {/* Method 1: Cloud Build via GitHub Actions (Ideal for Mobile-Only Users) */}
              <div className="space-y-2.5 border-2 border-[#1267B1]/30 bg-blue-50/30 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-[#1267B1] font-bold text-xs">
                  <CloudLightning className="w-4 h-4 text-[#1267B1]" />
                  <span>
                    {lang === 'bn'
                      ? 'পদ্ধতি ১: মোবাইল ফোন থেকে GitHub Actions ক্লাউড বিল্ড (প্রস্তাবিত)'
                      : 'Method 1: GitHub Actions Cloud Build (Recommended for Mobile)'}
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-700">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#1267B1] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">১</span>
                    <div>
                      <strong className="text-slate-900 block">{lang === 'bn' ? 'GitHub-এ প্রজেক্ট আপলোড করুন' : 'Push/Upload to GitHub'}</strong>
                      <span className="text-slate-600">
                        {lang === 'bn'
                          ? 'আপনার ফোনের ক্রোম বা যেকোনো ব্রাউজারে github.com খুলুন এবং একটি নতুন Private Repository তৈরি করে এই প্রজেক্টের সমস্ত ফাইল (বিশেষ করে .github ফোল্ডার ও capacitor.config.ts) আপলোড করুন।'
                          : 'Create a private GitHub repository and upload this project code including .github folder.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#1267B1] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">২</span>
                    <div>
                      <strong className="text-slate-900 block">{lang === 'bn' ? '"Actions" ট্যাবে যান' : 'Go to Actions Tab'}</strong>
                      <span className="text-slate-600">
                        {lang === 'bn'
                          ? 'রিপোজিটরির মেন্যু থেকে "Actions" ট্যাবে ট্যাপ করুন। সেখানে "Build Android APK (AFRAN ONLINE CENTRE)" ওয়ার্কফ্লো দেখতে পাবেন।'
                          : 'Open the Actions tab in your repository to find the preconfigured build workflow.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#1267B1] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">৩</span>
                    <div>
                      <strong className="text-slate-900 block">{lang === 'bn' ? '"Run workflow" বোতাম চাপুন' : 'Click "Run workflow"'}</strong>
                      <span className="text-slate-600">
                        {lang === 'bn'
                          ? '"Run workflow" বাটনে ক্লিক করুন। GitHub-এর ক্লাউড সার্ভার স্বয়ংক্রিয়ভাবে Node.js, Capacitor Android, Java 17 এবং Gradle চালিয়ে আসল APK তৈরি করবে।'
                          : 'Trigger the workflow. Ubuntu cloud runner will build the web bundle, sync Capacitor Android, and compile the APK.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">৪</span>
                    <div>
                      <strong className="text-emerald-800 block">{lang === 'bn' ? 'ফোনে APK ডাউনলোড ও ইনস্টল' : 'Download APK Artifact to Phone'}</strong>
                      <span className="text-slate-600">
                        {lang === 'bn'
                          ? 'বিল্ড সম্পন্ন হলে (সবুজ টিক চিহ্ন) পৃষ্ঠার নিচে "Artifacts" সেকশন থেকে "AFRAN_ONLINE_CENTRE-APK" ফাইলে ক্লিক করলেই আসল APK আপনার ফোনে ডাউনলোড হয়ে যাবে!'
                          : 'Download AFRAN_ONLINE_CENTRE.apk from the Artifacts section directly to your phone and install.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'সম্পূর্ণ নিরাপদ: কোনো সিক্রেট কী বা অ্যাডমিন পাসওয়ার্ড গিটহাবে এক্সপোজ হয় না।'
                      : 'Security verified: No secrets or Firebase admin credentials are committed.'}
                  </span>
                </div>
              </div>

              {/* Method 2: Manual Local Build (If using PC or Terminal) */}
              <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">
                    {lang === 'bn' ? 'পদ্ধতি ২: কম্পিউটারে টার্মিনাল কমান্ড (বিকল্প)' : 'Method 2: Local Terminal Commands (Optional)'}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'npm run build\nnpx cap sync android\ncd android && ./gradlew assembleDebug',
                        'cap'
                      )
                    }
                    className="p-1 text-slate-500 hover:text-[#1267B1]"
                    title="Copy commands"
                  >
                    {copiedCode === 'cap' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <pre className="p-2.5 bg-slate-900 text-cyan-300 font-mono text-[10px] rounded-xl overflow-x-auto whitespace-pre">
{`# 1. Build Vite web bundle
npm run build

# 2. Sync to Capacitor Android
npx cap sync android

# 3. Assemble Android Debug APK
cd android && ./gradlew assembleDebug`}
                </pre>
                <p className="text-[10px] text-slate-500">
                  {lang === 'bn'
                    ? 'তৈরিকৃত ফাইল: android/app/build/outputs/apk/debug/app-debug.apk'
                    : 'Output file: android/app/build/outputs/apk/debug/app-debug.apk'}
                </p>
              </div>

              {/* Method 3: Hosting compiled APK for in-app download button */}
              <div className="space-y-1.5 border border-slate-200 rounded-2xl p-3 bg-slate-50">
                <span className="font-bold text-slate-800 text-[11px]">
                  {lang === 'bn' ? 'ওয়েবসাইটে APK পরিবেশন (Direct In-App Button)' : 'Serving APK directly on this website'}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'ক্লাউড বিল্ড বা লোকাল বিল্ড থেকে প্রাপ্ত APK ফাইলটি ওয়েবসাইটের এই ডিরেক্টরিতে রাখলে উপরের "Download APK" বাটনটি নিজে থেকেই স্বয়ংক্রিয়ভাবে ডাউনলোড শুরু করবে:'
                    : 'Place the compiled APK file at this path to make the Download button instantly download it:'}
                </p>
                <code className="block p-2 bg-slate-200 rounded-lg font-mono text-[10px] text-slate-800">
                  /public/downloads/AFRAN_ONLINE_CENTRE.apk
                </code>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowBuildGuideModal(false)}
                className="w-full py-2.5 bg-[#1267B1] text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                {lang === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Got it / Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
