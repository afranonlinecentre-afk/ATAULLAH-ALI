import { Language, ApplicationStatus, PaymentStatus } from '../types';

export const translations = {
  bn: {
    // Brand & Header
    appName: 'আফরান অনলাইন সেন্টার',
    adminAppName: 'আফরান অনলাইন সেন্টার — মালিক অ্যাডমিন',
    tagline: 'অনলাইন সরকারি সেবা সহায়তা ও ডিজিটাল পরিষেবা কেন্দ্র',
    subtitle: 'পশ্চিমবঙ্গ, ভারত',
    customerApp: 'গ্রাহক অ্যাপ',
    adminApp: 'মালিক অ্যাডমিন',
    officialDisclaimer: 'সতর্কীকরণ: এটি একটি বেসরকারি ডিজিটাল সেবা সহায়তা কেন্দ্র। আমরা সরাসরি কোনো সরকারি দফতর বা কর্তৃপক্ষ নই।',

    // Nav
    navHome: 'হোম',
    navServices: 'সমস্ত সেবা',
    navApplications: 'আমার আবেদন',
    navNotifications: 'বিজ্ঞপ্তি',
    navProfile: 'প্রোফাইল',
    navDashboard: 'ড্যাশবোর্ড',
    navReports: 'রিপোর্ট',
    navSettings: 'সেটিংস',

    // Common Actions
    login: 'লগইন করুন',
    logout: 'লগআউট',
    sendOtp: 'ওটিপি (OTP) পাঠান',
    verifyOtp: 'ওটিপি যাচাই করুন',
    enterPhone: '১০ সংখ্যার মোবাইল নম্বর লিখুন',
    enterOtp: '৬ সংখ্যার ওটিপি লিখুন',
    resendOtp: 'পুনরায় ওটিপি পাঠান',
    applyNow: 'আবেদন করুন',
    submit: 'জমা দিন',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    searchPlaceholder: 'সেবার নাম বা বিষয় অনুসন্ধান করুন...',
    filterAll: 'সকল',
    viewDetails: 'বিস্তারিত দেখুন',
    trackApplication: 'আবেদন ট্র্যাক করুন',
    uploadDocument: 'নথি আপলোড করুন',
    chooseFile: 'ফাইল নির্বাচন করুন',
    dragDropText: 'ফাইল টেনে এনে এখানে ছাড়ুন অথবা ব্রাউজ করুন (PDF, JPG, PNG - সর্বোচ্চ ২MB)',
    removeFile: 'মুছুন',
    reviewForm: 'পর্যালোচনা করুন',
    confirmSubmit: 'নিশ্চিত করুন ও জমা দিন',
    back: 'ফিরে যান',
    next: 'পরবর্তী ধাপ',
    downloadReceipt: 'রসিদ ডাউনলোড',
    contactUs: 'যোগাযোগ করুন',

    // Statuses
    statusDraft: 'খসড়া',
    statusSubmitted: 'জমা দেওয়া হয়েছে',
    statusUnderReview: 'পর্যালোচনাধীন',
    statusNeedDocuments: 'নথি প্রয়োজন',
    statusProcessing: 'প্রক্রিয়াধীন',
    statusCompleted: 'সম্পন্ন হয়েছে',
    statusRejected: 'বাতিল',
    statusCancelled: 'প্রত্যাহার করা হয়েছে',

    // Payment Statuses
    paymentUnpaid: 'বাকি (Unpaid)',
    paymentPending: 'পেমেন্ট অপেক্ষমান',
    paymentPaid: 'পরিশোধিত (Paid)',
    paymentRefunded: 'রিফান্ড করা হয়েছে',
    paymentWaived: 'মওকুফ (Waived)',

    // Fee labels
    officialFeeLabel: 'সরকারি ফি',
    serviceChargeLabel: 'আফরান সেবা চার্জ',
    totalFeeLabel: 'মোট প্রদেয় ফি',
    freeGovtFee: 'সরকারি ফি প্রযোজ্য নয় বা পোর্টালে সরাসরি প্রদেয়',

    // Admin Dashboard
    totalApplications: 'মোট আবেদন',
    newApplications: 'নতুন আবেদন',
    todayApplications: 'আজকের আবেদন',
    processingApplications: 'প্রক্রিয়াধীন',
    needDocumentsCount: 'নথি অপেক্ষমান',
    completedApplications: 'সম্পন্ন আবেদন',
    rejectedApplications: 'বাতিল আবেদন',
    totalRevenue: 'সংগৃহীত সেবা চার্জ',
    updateStatus: 'স্ট্যাটাস পরিবর্তন করুন',
    addInternalNote: 'অভ্যন্তরীণ নোট (শুধুমাত্র অ্যাডমিনের জন্য)',
    customerMessage: 'গ্রাহকের জন্য বার্তা (গ্রাহক দেখতে পাবেন)',
    requestMissingDoc: 'অনুপস্থিত নথির জন্য অনুরোধ পাঠান',
    recordPayment: 'পেমেন্ট রেকর্ড করুন',

    // Categories
    catAadhaar: 'আধার সেবা',
    catPan: 'প্যান কার্ড সেবা',
    catVoter: 'ভোটার সেবা',
    catDriving: 'ড্রাইভিং লাইসেন্স সেবা',
    catEpfo: 'ইপিএফও / পিএফ সেবা',
    catCsc: 'সিএসসি ও ডিজিটাল সেবা',
    catCertificates: 'শংসাপত্র / সার্টিফিকেট',
    catOther: 'অন্যান্য সরকারি স্কিম',

    // Dynamic Form Strings
    applicantName: 'আবেদনকারীর পুরো নাম',
    mobileNumber: 'যোগাযোগের মোবাইল নম্বর',
    consentDeclaration: 'আমি নিশ্চিত করছি যে প্রদত্ত তথ্যসমূহ সঠিক এবং আফরান অনলাইন সেন্টারকে সরকারি পোর্টালে আবেদন পরিচালনায় সহায়তার অনুমতি দিচ্ছি।',
  },
  en: {
    // Brand & Header
    appName: 'AFRAN ONLINE CENTRE',
    adminAppName: 'AFRAN ONLINE CENTRE — OWNER ADMIN',
    tagline: 'Online Government Services Assistance & Digital Service Centre',
    subtitle: 'West Bengal, India',
    customerApp: 'Customer App',
    adminApp: 'Owner Admin',
    officialDisclaimer: 'Notice: This is a private digital assistance facilitation centre. We are not a direct government department or authority.',

    // Nav
    navHome: 'Home',
    navServices: 'All Services',
    navApplications: 'My Applications',
    navNotifications: 'Notifications',
    navProfile: 'Profile',
    navDashboard: 'Dashboard',
    navReports: 'Reports',
    navSettings: 'Settings',

    // Common Actions
    login: 'Login',
    logout: 'Logout',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
    enterPhone: 'Enter 10-digit mobile number',
    enterOtp: 'Enter 6-digit OTP',
    resendOtp: 'Resend OTP',
    applyNow: 'Apply Now',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    searchPlaceholder: 'Search services, schemes or keywords...',
    filterAll: 'All',
    viewDetails: 'View Details',
    trackApplication: 'Track Application',
    uploadDocument: 'Upload Document',
    chooseFile: 'Choose File',
    dragDropText: 'Drag & drop file here or click to browse (PDF, JPG, PNG - max 2MB)',
    removeFile: 'Remove',
    reviewForm: 'Review Form',
    confirmSubmit: 'Confirm & Submit',
    back: 'Back',
    next: 'Next',
    downloadReceipt: 'Download Receipt',
    contactUs: 'Contact Centre',

    // Statuses
    statusDraft: 'Draft',
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusNeedDocuments: 'Need Documents',
    statusProcessing: 'Processing',
    statusCompleted: 'Completed',
    statusRejected: 'Rejected',
    statusCancelled: 'Cancelled',

    // Payment Statuses
    paymentUnpaid: 'Unpaid',
    paymentPending: 'Payment Pending',
    paymentPaid: 'Paid',
    paymentRefunded: 'Refunded',
    paymentWaived: 'Waived',

    // Fee labels
    officialFeeLabel: 'Official Govt Fee',
    serviceChargeLabel: 'Afran Service Charge',
    totalFeeLabel: 'Total Payable Amount',
    freeGovtFee: 'Govt fee as per portal or free',

    // Admin Dashboard
    totalApplications: 'Total Applications',
    newApplications: 'New Applications',
    todayApplications: 'Today Applications',
    processingApplications: 'Processing',
    needDocumentsCount: 'Waiting for Docs',
    completedApplications: 'Completed',
    rejectedApplications: 'Rejected',
    totalRevenue: 'Total Service Fee',
    updateStatus: 'Update Status',
    addInternalNote: 'Internal Admin Note (Owner Eyes Only)',
    customerMessage: 'Customer-Facing Message (Visible to Citizen)',
    requestMissingDoc: 'Request Missing Documents',
    recordPayment: 'Record Payment',

    // Categories
    catAadhaar: 'Aadhaar Services',
    catPan: 'PAN Card Services',
    catVoter: 'Voter Services',
    catDriving: 'Driving Licence Services',
    catEpfo: 'EPFO / PF Services',
    catCsc: 'CSC & Digital Services',
    catCertificates: 'Certificates (e-District)',
    catOther: 'Other Services & Schemes',

    // Dynamic Form Strings
    applicantName: 'Full Name of Applicant',
    mobileNumber: 'Contact Mobile Number',
    consentDeclaration: 'I hereby declare that the information provided is accurate and authorize AFRAN ONLINE CENTRE to assist in processing on the official government portal.',
  },
};

export function getStatusLabel(status: ApplicationStatus, lang: Language): string {
  const dict = translations[lang];
  switch (status) {
    case 'Draft': return dict.statusDraft;
    case 'Submitted': return dict.statusSubmitted;
    case 'Under Review': return dict.statusUnderReview;
    case 'Need Documents': return dict.statusNeedDocuments;
    case 'Processing': return dict.statusProcessing;
    case 'Completed': return dict.statusCompleted;
    case 'Rejected': return dict.statusRejected;
    case 'Cancelled': return dict.statusCancelled;
    default: return status;
  }
}

export function getPaymentLabel(status: PaymentStatus, lang: Language): string {
  const dict = translations[lang];
  switch (status) {
    case 'Unpaid': return dict.paymentUnpaid;
    case 'Payment Pending': return dict.paymentPending;
    case 'Paid': return dict.paymentPaid;
    case 'Refunded': return dict.paymentRefunded;
    case 'Waived': return dict.paymentWaived;
    default: return status;
  }
}
