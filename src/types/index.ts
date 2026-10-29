export type Language = 'bn' | 'en';

export type UserRole = 'customer' | 'ownerAdmin';

export interface UserProfile {
  uid: string;
  displayName: string;
  phoneNumber: string;
  email?: string;
  role: UserRole;
  preferredLanguage: Language;
  accountStatus: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Need Documents'
  | 'Processing'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type PaymentStatus =
  | 'Unpaid'
  | 'Payment Pending'
  | 'Paid'
  | 'Refunded'
  | 'Waived';

export interface DynamicFormField {
  name: string;
  labelBn: string;
  labelEn: string;
  type: 'text' | 'textarea' | 'phone' | 'date' | 'select' | 'radio' | 'checkbox' | 'file';
  required: boolean;
  options?: { value: string; labelBn: string; labelEn: string }[];
  placeholderBn?: string;
  placeholderEn?: string;
  helpBn?: string;
  helpEn?: string;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export interface ServiceItem {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryId: string;
  categoryNameBn: string;
  categoryNameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  active: boolean;
  officialFee: number;
  serviceCharge: number;
  requiredDocuments: string[];
  officialPortalUrl: string;
  authorizationRequirement: string;
  formSchema: DynamicFormField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  categoryLabel: string;
  dataUrl?: string; // base64 representation for instant preview & secure storage
  storagePath?: string;
  uploadedAt: string;
}

export interface ServiceApplication {
  id: string; // Document ID in firestore
  applicationId: string; // Friendly unique ID like AOC-2026-000101
  ownerUid: string;
  serviceId: string;
  serviceNameSnapshotBn: string;
  serviceNameSnapshotEn: string;
  categoryNameSnapshotBn: string;
  categoryNameSnapshotEn: string;
  customerName: string;
  customerPhone: string;
  formData: Record<string, any>;
  documentReferences: UploadedDocument[];
  status: ApplicationStatus;
  customerVisibleMessage?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentRef?: string;
  serviceCharge: number;
  officialFee: number;
  totalFee: number;
  assignedOwnerUid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryItem {
  id: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  actorUid: string;
  actorName?: string;
  timestamp: string;
  customerMessage?: string;
  internalNote?: string;
}

export interface ApplicationMessage {
  id: string;
  senderUid: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  visibleToCustomer: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientUid: string;
  applicationId?: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
}

export interface CentreConfig {
  centreNameBn: string;
  centreNameEn: string;
  centrePhone: string;
  centreWhatsApp: string;
  centreEmail: string;
  centreAddressBn: string;
  centreAddressEn: string;
  operatingHoursBn: string;
  operatingHoursEn: string;
  upiId: string;
  ownerName: string;
  noticeBn: string;
  noticeEn: string;
  updatedAt?: string;
}
