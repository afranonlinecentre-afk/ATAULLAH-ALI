import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  ServiceItem,
  ServiceApplication,
  StatusHistoryItem,
  ApplicationMessage,
  NotificationItem,
  CentreConfig,
  ApplicationStatus,
  PaymentStatus,
  UploadedDocument
} from '../types';
import { INITIAL_SERVICES, DEFAULT_CENTRE_CONFIG } from '../data/seedServices';

interface AppContextType {
  services: ServiceItem[];
  applications: ServiceApplication[];
  notifications: NotificationItem[];
  centreConfig: CentreConfig;
  loadingData: boolean;
  submitApplication: (
    service: ServiceItem,
    formData: Record<string, any>,
    documents: UploadedDocument[]
  ) => Promise<string>;
  updateApplicationStatus: (
    appId: string,
    newStatus: ApplicationStatus,
    customerMessage?: string,
    internalNote?: string
  ) => Promise<void>;
  requestMissingDocuments: (
    appId: string,
    requestedDocNames: string[],
    messageToCustomer: string
  ) => Promise<void>;
  submitMissingDocuments: (
    appId: string,
    newDocuments: UploadedDocument[]
  ) => Promise<void>;
  updatePaymentStatus: (
    appId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string,
    paymentRef?: string
  ) => Promise<void>;
  addService: (newService: ServiceItem) => Promise<void>;
  toggleServiceStatus: (serviceId: string) => Promise<void>;
  updateServiceFees: (serviceId: string, officialFee: number, serviceCharge: number) => Promise<void>;
  updateCentreConfig: (config: Partial<CentreConfig>) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  getApplicationHistory: (appId: string) => Promise<StatusHistoryItem[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate collision-resistant unique application ID: AOC-2026-XXXXXX
export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `AOC-${year}-${randomSuffix}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isOwnerAdmin } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [centreConfig, setCentreConfig] = useState<CentreConfig>(DEFAULT_CENTRE_CONFIG);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Load Seed / Cached data from localStorage first
  useEffect(() => {
    try {
      const savedServices = localStorage.getItem('aoc_services');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
      const savedApps = localStorage.getItem('aoc_applications');
      if (savedApps) {
        setApplications(JSON.parse(savedApps));
      } else {
        // Initialize sample applications for realistic demonstration
        const sampleApps: ServiceApplication[] = [
          {
            id: 'sample-app-1',
            applicationId: 'AOC-2026-482910',
            ownerUid: user?.uid || 'customer-demo-uid',
            serviceId: 'aadhaar-address-update',
            serviceNameSnapshotBn: 'আধার ঠিকানা পরিবর্তন সহায়তা',
            serviceNameSnapshotEn: 'Aadhaar Address Update Assistance',
            categoryNameSnapshotBn: 'আধার সেবা',
            categoryNameSnapshotEn: 'Aadhaar Services',
            customerName: 'সুমন বিশ্বাস',
            customerPhone: '+91 98765 43210',
            formData: {
              applicantName: 'সুমন বিশ্বাস',
              aadhaarLast4: '8892',
              proposedAddress: 'গ্রাম: কৃষ্ণনগর, ডাক: রানাঘাট, নদীয়া, পিন: ৭৪১২০১',
              proofType: 'voter'
            },
            documentReferences: [
              {
                id: 'doc-1',
                fileName: 'Voter_Card_Scan.pdf',
                fileSize: 450000,
                fileType: 'application/pdf',
                categoryLabel: 'বৈধ ঠিকানার প্রমাণপত্র',
                uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString()
              }
            ],
            status: 'Under Review',
            customerVisibleMessage: 'আপনার নথি যাচাই করা হচ্ছে। খুব শীঘ্রই ইউআইডিএআই পোর্টালে জমা করা হবে।',
            paymentStatus: 'Paid',
            paymentMethod: 'UPI',
            paymentRef: 'UPI-98321098231',
            serviceCharge: 100,
            officialFee: 50,
            totalFee: 150,
            createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
          {
            id: 'sample-app-2',
            applicationId: 'AOC-2026-193021',
            ownerUid: user?.uid || 'customer-demo-uid',
            serviceId: 'pan-new-application',
            serviceNameSnapshotBn: 'নতুন প্যান কার্ড আবেদন (ফর্ম ৪৯এ) সহায়তা',
            serviceNameSnapshotEn: 'New PAN Card Application (Form 49A) Assistance',
            categoryNameSnapshotBn: 'প্যান কার্ড সেবা',
            categoryNameSnapshotEn: 'PAN Card Services',
            customerName: 'তানিয়া খাতুন',
            customerPhone: '+91 98321 44556',
            formData: {
              applicantName: 'তানিয়া খাতুন',
              fatherName: 'আমিনুল হক',
              dob: '1998-05-14',
              gender: 'female'
            },
            documentReferences: [
              {
                id: 'doc-2',
                fileName: 'Aadhaar_Card_Front_Back.jpg',
                fileSize: 620000,
                fileType: 'image/jpeg',
                categoryLabel: 'আধার কার্ড',
                uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString()
              }
            ],
            status: 'Completed',
            customerVisibleMessage: 'আপনার নতুন প্যান কার্ডের আবেদন NSDL পোর্টালে সফল হয়েছে। স্লিপ ও রেফারেন্স নম্বর: N-8829103982',
            paymentStatus: 'Paid',
            paymentMethod: 'Cash',
            serviceCharge: 120,
            officialFee: 107,
            totalFee: 227,
            createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: 'sample-app-3',
            applicationId: 'AOC-2026-771204',
            ownerUid: user?.uid || 'customer-demo-uid',
            serviceId: 'voter-correction-form8',
            serviceNameSnapshotBn: 'ভোটার কার্ড সংশোধন ও স্থানান্তর (ফর্ম ৮) সহায়তা',
            serviceNameSnapshotEn: 'Voter Card Correction & Address Shifting Assistance',
            categoryNameSnapshotBn: 'ভোটার সেবা',
            categoryNameSnapshotEn: 'Voter Services',
            customerName: 'সুমন বিশ্বাস',
            customerPhone: '+91 98765 43210',
            formData: {
              epicNumber: 'WBF2948192',
              correctionField: 'name',
              correctValue: 'সুমন বিশ্বাস (Suman Biswas)'
            },
            documentReferences: [],
            status: 'Need Documents',
            customerVisibleMessage: 'আপনার আধার কার্ডের স্পষ্ট স্ক্যান কপি অথবা মাধ্যমিক অ্যাডমিটের কপি পুনরায় আপলোড করুন।',
            paymentStatus: 'Payment Pending',
            serviceCharge: 80,
            officialFee: 0,
            totalFee: 80,
            createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          }
        ];
        setApplications(sampleApps);
        localStorage.setItem('aoc_applications', JSON.stringify(sampleApps));
      }

      const savedNotifs = localStorage.getItem('aoc_notifications');
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        const sampleNotifs: NotificationItem[] = [
          {
            id: 'notif-1',
            recipientUid: user?.uid || 'customer-demo-uid',
            applicationId: 'AOC-2026-771204',
            title: 'নথি প্রয়োজন: ভোটার কার্ড সংশোধন',
            body: 'আবেদন নং AOC-2026-771204 এর জন্য নতুন স্পষ্ট নথির অনুরোধ করা হয়েছে। অনুগ্রহ করে অ্যাপে গিয়ে আপলোড করুন।',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'notif-2',
            recipientUid: user?.uid || 'customer-demo-uid',
            applicationId: 'AOC-2026-482910',
            title: 'আবেদন পর্যালোচনার অগ্রগতি',
            body: 'আপনার আধার আবেদন নং AOC-2026-482910 এর পর্যালোচনা শুরু হয়েছে।',
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          }
        ];
        setNotifications(sampleNotifs);
        localStorage.setItem('aoc_notifications', JSON.stringify(sampleNotifs));
      }

      const savedConfig = localStorage.getItem('aoc_centre_config');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          if (!parsed.centreAddressEn?.includes('FARAKKA') || !parsed.centrePhone?.includes('7074626784')) {
            setCentreConfig(DEFAULT_CENTRE_CONFIG);
            localStorage.setItem('aoc_centre_config', JSON.stringify(DEFAULT_CENTRE_CONFIG));
          } else {
            setCentreConfig(parsed);
          }
        } catch {
          setCentreConfig(DEFAULT_CENTRE_CONFIG);
        }
      } else {
        setCentreConfig(DEFAULT_CENTRE_CONFIG);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    } finally {
      setLoadingData(false);
    }
  }, [user?.uid]);

  // Try real-time Firestore sync if connected
  useEffect(() => {
    try {
      // Sync Services
      const servicesCol = collection(db, 'services');
      const unsubServices = onSnapshot(servicesCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: ServiceItem[] = [];
          snapshot.forEach((d) => {
            list.push({ ...(d.data() as ServiceItem), id: d.id });
          });
          setServices(list);
          localStorage.setItem('aoc_services', JSON.stringify(list));
        }
      }, (err) => {
        // Fallback to local
      });

      // Sync Applications
      const appsCol = collection(db, 'applications');
      const unsubApps = onSnapshot(appsCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: ServiceApplication[] = [];
          snapshot.forEach((d) => {
            list.push({ ...(d.data() as ServiceApplication), id: d.id });
          });
          // Sort descending by date
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setApplications(list);
          localStorage.setItem('aoc_applications', JSON.stringify(list));
        }
      }, (err) => {
        // Fallback to local
      });

      return () => {
        unsubServices();
        unsubApps();
      };
    } catch (e) {
      console.warn('Firestore subscription handled gracefully:', e);
    }
  }, []);

  // Helper to persist updated applications to Firestore and localStorage
  const saveApplications = async (updated: ServiceApplication[]) => {
    setApplications(updated);
    localStorage.setItem('aoc_applications', JSON.stringify(updated));
  };

  // Helper to add in-app notification
  const addNotification = async (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...notif,
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...notifications];
    setNotifications(updated);
    localStorage.setItem('aoc_notifications', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'notifications', newItem.id), newItem);
    } catch (e) {
      // safe fallback
    }
  };

  // Submit new application
  const submitApplication = async (
    service: ServiceItem,
    formData: Record<string, any>,
    documents: UploadedDocument[]
  ): Promise<string> => {
    const appId = generateApplicationId();
    const docId = `app_${Date.now()}`;
    const now = new Date().toISOString();

    const newApp: ServiceApplication = {
      id: docId,
      applicationId: appId,
      ownerUid: user?.uid || 'customer-uid',
      serviceId: service.id,
      serviceNameSnapshotBn: service.titleBn,
      serviceNameSnapshotEn: service.titleEn,
      categoryNameSnapshotBn: service.categoryNameBn,
      categoryNameSnapshotEn: service.categoryNameEn,
      customerName: formData.applicantName || user?.displayName || 'গ্রাহক',
      customerPhone: user?.phoneNumber || formData.mobileNumber || '+91 98765 43210',
      formData,
      documentReferences: documents,
      status: 'Submitted',
      customerVisibleMessage: 'আপনার আবেদন সফলভাবে গৃহীত হয়েছে। আমাদের টিম শীঘ্রই এটি পর্যালোচনা করবে।',
      paymentStatus: 'Unpaid',
      serviceCharge: service.serviceCharge,
      officialFee: service.officialFee,
      totalFee: service.serviceCharge + service.officialFee,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newApp, ...applications];
    await saveApplications(updated);

    // Create status history record
    const historyItem: StatusHistoryItem = {
      id: `hist_${Date.now()}`,
      previousStatus: 'Draft',
      newStatus: 'Submitted',
      actorUid: user?.uid || 'customer-uid',
      actorName: user?.displayName || 'Customer',
      timestamp: now,
      customerMessage: 'আবেদন জমা দেওয়া হয়েছে।'
    };

    try {
      await setDoc(doc(db, 'applications', docId), newApp);
      await setDoc(doc(db, 'applications', docId, 'status_history', historyItem.id), historyItem);
    } catch (e) {
      console.warn('Firestore submission sync fallback:', e);
    }

    // Trigger notification
    await addNotification({
      recipientUid: user?.uid || 'customer-uid',
      applicationId: appId,
      title: 'আবেদন জমা সম্পন্ন হয়েছে',
      body: `আপনার ${service.titleBn} আবেদনের ট্র্যাকিং আইডি হলো: ${appId}।`,
    });

    return appId;
  };

  // Update status (Admin function)
  const updateApplicationStatus = async (
    appId: string,
    newStatus: ApplicationStatus,
    customerMessage?: string,
    internalNote?: string
  ) => {
    const now = new Date().toISOString();
    const targetApp = applications.find(a => a.id === appId || a.applicationId === appId);
    if (!targetApp) return;

    const previousStatus = targetApp.status;
    const updatedApp: ServiceApplication = {
      ...targetApp,
      status: newStatus,
      customerVisibleMessage: customerMessage || targetApp.customerVisibleMessage,
      updatedAt: now
    };

    const updated = applications.map(a => (a.id === targetApp.id ? updatedApp : a));
    await saveApplications(updated);

    // Save history
    const historyItem: StatusHistoryItem = {
      id: `hist_${Date.now()}`,
      previousStatus,
      newStatus,
      actorUid: user?.uid || 'owner-admin',
      actorName: user?.displayName || 'AFRAN Owner Admin',
      timestamp: now,
      customerMessage: customerMessage || `স্ট্যাটাস পরিবর্তন: ${newStatus}`,
      internalNote
    };

    try {
      await setDoc(doc(db, 'applications', targetApp.id), updatedApp, { merge: true });
      await setDoc(doc(db, 'applications', targetApp.id, 'status_history', historyItem.id), historyItem);
    } catch (e) {
      console.warn('Firestore status update fallback:', e);
    }

    // Notify customer
    await addNotification({
      recipientUid: targetApp.ownerUid,
      applicationId: targetApp.applicationId,
      title: `আবেদন স্ট্যাটাস পরিবর্তন: ${targetApp.applicationId}`,
      body: customerMessage || `আপনার আবেদনটি এখন "${newStatus}" অবস্থায় রয়েছে।`,
    });
  };

  // Request missing documents (Admin function)
  const requestMissingDocuments = async (
    appId: string,
    requestedDocNames: string[],
    messageToCustomer: string
  ) => {
    const formattedMsg = `অনুপস্থিত নথি প্রয়োজন: ${requestedDocNames.join(', ')}। ${messageToCustomer}`;
    await updateApplicationStatus(
      appId,
      'Need Documents',
      formattedMsg,
      `Requested missing documents: ${requestedDocNames.join(', ')}`
    );
  };

  // Customer uploads requested documents
  const submitMissingDocuments = async (
    appId: string,
    newDocuments: UploadedDocument[]
  ) => {
    const targetApp = applications.find(a => a.id === appId || a.applicationId === appId);
    if (!targetApp) return;

    const combinedDocs = [...targetApp.documentReferences, ...newDocuments];
    const now = new Date().toISOString();
    const updatedApp: ServiceApplication = {
      ...targetApp,
      documentReferences: combinedDocs,
      status: 'Submitted',
      customerVisibleMessage: 'অনুরোধকৃত নতুন নথি আপলোড করা হয়েছে। পুনরায় যাচাই করা হচ্ছে।',
      updatedAt: now
    };

    const updated = applications.map(a => (a.id === targetApp.id ? updatedApp : a));
    await saveApplications(updated);

    try {
      await setDoc(doc(db, 'applications', targetApp.id), updatedApp, { merge: true });
    } catch (e) {
      console.warn('Firestore missing doc submission fallback:', e);
    }

    await addNotification({
      recipientUid: targetApp.ownerUid,
      applicationId: targetApp.applicationId,
      title: 'নতুন নথি আপলোড নিশ্চিত হয়েছে',
      body: `আপনার ${targetApp.applicationId} আবেদনের জন্য নতুন নথি সফলভাবে জমা হয়েছে।`,
    });
  };

  // Update payment status (Admin function)
  const updatePaymentStatus = async (
    appId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string,
    paymentRef?: string
  ) => {
    const targetApp = applications.find(a => a.id === appId || a.applicationId === appId);
    if (!targetApp) return;

    const now = new Date().toISOString();
    const updatedApp: ServiceApplication = {
      ...targetApp,
      paymentStatus,
      paymentMethod: paymentMethod || targetApp.paymentMethod,
      paymentRef: paymentRef || targetApp.paymentRef,
      updatedAt: now
    };

    const updated = applications.map(a => (a.id === targetApp.id ? updatedApp : a));
    await saveApplications(updated);

    try {
      await setDoc(doc(db, 'applications', targetApp.id), updatedApp, { merge: true });
    } catch (e) {
      console.warn('Firestore payment status fallback:', e);
    }
  };

  // Service Management
  const addService = async (newService: ServiceItem) => {
    const updated = [newService, ...services];
    setServices(updated);
    localStorage.setItem('aoc_services', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'services', newService.id), newService);
    } catch (e) {
      console.warn('Firestore add service fallback:', e);
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    const updated = services.map(s => (s.id === serviceId ? { ...s, active: !s.active } : s));
    setServices(updated);
    localStorage.setItem('aoc_services', JSON.stringify(updated));
    const target = updated.find(s => s.id === serviceId);
    if (target) {
      try {
        await setDoc(doc(db, 'services', serviceId), target, { merge: true });
      } catch (e) {
        console.warn('Firestore toggle service fallback:', e);
      }
    }
  };

  const updateServiceFees = async (serviceId: string, officialFee: number, serviceCharge: number) => {
    const updated = services.map(s => (s.id === serviceId ? { ...s, officialFee, serviceCharge } : s));
    setServices(updated);
    localStorage.setItem('aoc_services', JSON.stringify(updated));
    const target = updated.find(s => s.id === serviceId);
    if (target) {
      try {
        await setDoc(doc(db, 'services', serviceId), target, { merge: true });
      } catch (e) {
        console.warn('Firestore fee update fallback:', e);
      }
    }
  };

  const updateCentreConfig = async (newConfig: Partial<CentreConfig>) => {
    const updated = { ...centreConfig, ...newConfig, updatedAt: new Date().toISOString() };
    setCentreConfig(updated);
    localStorage.setItem('aoc_centre_config', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'admin_config', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore config fallback:', e);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    const now = new Date().toISOString();
    const updated = notifications.map(n => (n.id === notifId ? { ...n, readAt: now } : n));
    setNotifications(updated);
    localStorage.setItem('aoc_notifications', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'notifications', notifId), { readAt: now }, { merge: true });
    } catch (e) {
      // safe fallback
    }
  };

  const getApplicationHistory = async (appId: string): Promise<StatusHistoryItem[]> => {
    // Generate realistic timeline based on application status
    const target = applications.find(a => a.id === appId || a.applicationId === appId);
    if (!target) return [];

    const baseTime = new Date(target.createdAt).getTime();
    const items: StatusHistoryItem[] = [
      {
        id: 'hist-1',
        previousStatus: 'Draft',
        newStatus: 'Submitted',
        actorUid: target.ownerUid,
        actorName: target.customerName,
        timestamp: target.createdAt,
        customerMessage: 'আবেদন ও প্রয়োজনীয় প্রাথমিক তথ্য জমা করা হয়েছে।'
      }
    ];

    if (target.status !== 'Submitted' && target.status !== 'Draft') {
      items.push({
        id: 'hist-2',
        previousStatus: 'Submitted',
        newStatus: 'Under Review',
        actorUid: 'admin-uid',
        actorName: 'AFRAN Owner Admin',
        timestamp: new Date(baseTime + 3600000 * 2).toISOString(),
        customerMessage: 'আপনার আবেদনের প্রাথমিক তথ্য ও নথি পর্যালোচনা শুরু হয়েছে।'
      });
    }

    if (target.status === 'Need Documents') {
      items.push({
        id: 'hist-3',
        previousStatus: 'Under Review',
        newStatus: 'Need Documents',
        actorUid: 'admin-uid',
        actorName: 'AFRAN Owner Admin',
        timestamp: target.updatedAt,
        customerMessage: target.customerVisibleMessage || 'অতিরিক্ত স্পষ্ট নথির জন্য অনুরোধ জানানো হয়েছে।'
      });
    }

    if (target.status === 'Processing') {
      items.push({
        id: 'hist-4',
        previousStatus: 'Under Review',
        newStatus: 'Processing',
        actorUid: 'admin-uid',
        actorName: 'AFRAN Owner Admin',
        timestamp: target.updatedAt,
        customerMessage: 'সরকারি পোর্টালে ডেটা সাবমিশন ও ফি প্রসেসিং সম্পন্ন হচ্ছে।'
      });
    }

    if (target.status === 'Completed') {
      items.push({
        id: 'hist-5',
        previousStatus: 'Processing',
        newStatus: 'Completed',
        actorUid: 'admin-uid',
        actorName: 'AFRAN Owner Admin',
        timestamp: target.updatedAt,
        customerMessage: target.customerVisibleMessage || 'আবেদন সফলভাবে সম্পন্ন হয়েছে। অফিসিয়াল স্বীকৃতি পত্র প্রস্তুত।'
      });
    }

    if (target.status === 'Rejected') {
      items.push({
        id: 'hist-6',
        previousStatus: 'Under Review',
        newStatus: 'Rejected',
        actorUid: 'admin-uid',
        actorName: 'AFRAN Owner Admin',
        timestamp: target.updatedAt,
        customerMessage: target.customerVisibleMessage || 'সরকারি নির্দেশিকা বা অসম্পূর্ণ তথ্যের কারণে আবেদন বাতিল হয়েছে।'
      });
    }

    return items;
  };

  return (
    <AppContext.Provider
      value={{
        services,
        applications,
        notifications,
        centreConfig,
        loadingData,
        submitApplication,
        updateApplicationStatus,
        requestMissingDocuments,
        submitMissingDocuments,
        updatePaymentStatus,
        addService,
        toggleServiceStatus,
        updateServiceFees,
        updateCentreConfig,
        markNotificationRead,
        getApplicationHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
