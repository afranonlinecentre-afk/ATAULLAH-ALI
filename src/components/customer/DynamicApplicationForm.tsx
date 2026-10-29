import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ServiceItem, UploadedDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../lib/i18n';

interface DynamicApplicationFormProps {
  service: ServiceItem;
  onBack: () => void;
  onSubmittedSuccess: (appId: string) => void;
}

export const DynamicApplicationForm: React.FC<DynamicApplicationFormProps> = ({
  service,
  onBack,
  onSubmittedSuccess,
}) => {
  const { lang, user } = useAuth();
  const { submitApplication } = useApp();
  const t = translations[lang];

  // Steps: 1: Form Details, 2: Document Upload, 3: Review & Consent, 4: Submitting
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form field state
  const [formData, setFormData] = useState<Record<string, any>>({
    applicantName: user?.displayName || '',
    mobileNumber: user?.phoneNumber || '',
  });

  // Uploaded documents
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Consent checkbox
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Validate step 1
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    service.formSchema.forEach((field) => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        errors[field.name] =
          lang === 'bn' ? `${field.labelBn} পূরণ করা আবশ্যক` : `${field.labelEn} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToDocs = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Handle file selection and conversion to previewable base64 dataUrl
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, categoryLabel: string) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        lang === 'bn'
          ? 'শুধুমাত্র PDF, JPG অথবা PNG ফাইল গ্রহণযোগ্য।'
          : 'Only PDF, JPG or PNG files are accepted.'
      );
      return;
    }

    // Limit to 2.5MB
    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError(
        lang === 'bn' ? 'ফাইলের আকার ২.৫ মেগাবাইট (MB) এর কম হতে হবে।' : 'File size must be under 2.5MB.'
      );
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: UploadedDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        categoryLabel,
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      };
      setDocuments((prev) => [...prev, newDoc]);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadError(lang === 'bn' ? 'ফাইল পড়তে সমস্যা হয়েছে।' : 'Failed to read file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleFinalSubmit = async () => {
    if (!consentGiven) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে সম্মতি বক্সে টিক দিন।' : 'Please accept the consent declaration.');
      return;
    }

    setSubmitting(true);
    try {
      const generatedId = await submitApplication(service, formData, documents);
      setSubmitting(false);
      onSubmittedSuccess(generatedId);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
      alert(lang === 'bn' ? 'আবেদন জমা দিতে ত্রুটি হয়েছে।' : 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Breadcrumb & Step Indicator */}
      <div className="flex items-center justify-between">
        <button
          onClick={currentStep === 1 ? onBack : () => setCurrentStep((prev) => (prev - 1) as any)}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-700">
          {lang === 'bn' ? `ধাপ ${currentStep} / ৩` : `Step ${currentStep} of 3`}
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className={`h-1.5 rounded-full transition-all ${currentStep >= 1 ? 'bg-[#1267B1]' : 'bg-slate-200'}`} />
        <div className={`h-1.5 rounded-full transition-all ${currentStep >= 2 ? 'bg-[#1267B1]' : 'bg-slate-200'}`} />
        <div className={`h-1.5 rounded-full transition-all ${currentStep >= 3 ? 'bg-[#1267B1]' : 'bg-slate-200'}`} />
      </div>

      {/* Service Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-[#1267B1] uppercase tracking-wider">
            {lang === 'bn' ? service.categoryNameBn : service.categoryNameEn}
          </span>
          <h3 className="text-xs font-bold text-slate-900 leading-snug">
            {lang === 'bn' ? service.titleBn : service.titleEn}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'প্রদেয় ফি' : 'Total'}</span>
          <span className="text-xs font-bold text-[#1267B1] font-mono">
            ₹{service.serviceCharge + service.officialFee}
          </span>
        </div>
      </div>

      {/* STEP 1: DYNAMIC FORM FIELDS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'bn' ? '১. প্রয়োজনীয় তথ্যাবলী পূরণ করুন' : '1. Enter Required Information'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'অনুগ্রহ করে সঠিক ও নির্ভুল তথ্য প্রদান করুন' : 'Provide exact details as per original ID'}
            </p>
          </div>

          <div className="space-y-3.5">
            {service.formSchema.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {lang === 'bn' ? field.labelBn : field.labelEn}
                  {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={lang === 'bn' ? field.placeholderBn : field.placeholderEn}
                    className={`w-full p-3 text-xs bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:bg-white ${
                      formErrors[field.name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full p-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:bg-white ${
                      formErrors[field.name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? '-- নির্বাচন করুন --' : '-- Select Option --'}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {lang === 'bn' ? opt.labelBn : opt.labelEn}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="flex gap-4 pt-1">
                    {field.options?.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name={field.name}
                          value={opt.value}
                          checked={formData[field.name] === opt.value}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="accent-[#1267B1]"
                        />
                        <span>{lang === 'bn' ? opt.labelBn : opt.labelEn}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type === 'phone' ? 'tel' : field.type === 'date' ? 'date' : 'text'}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={lang === 'bn' ? field.placeholderBn : field.placeholderEn}
                    className={`w-full px-3 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1267B1] focus:bg-white ${
                      formErrors[field.name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                )}

                {formErrors[field.name] && (
                  <p className="text-[10px] text-rose-600 font-medium">{formErrors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextToDocs}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-xs font-bold rounded-xl shadow-xs transition mt-4 cursor-pointer"
          >
            <span>{lang === 'bn' ? 'পরবর্তী ধাপ: নথি আপলোড' : 'Next: Upload Documents'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: DOCUMENT UPLOAD */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'bn' ? '২. প্রয়োজনীয় নথি আপলোড করুন' : '2. Upload Supporting Documents'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'স্পষ্ট স্ক্যান অথবা ছবি আপলোড করুন (PDF/JPG/PNG)' : 'Upload clear scan/photos (Max 2.5MB)'}
            </p>
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Upload Slots for each required document */}
          <div className="space-y-3">
            {service.requiredDocuments.map((reqDoc, index) => {
              const matchedUploaded = documents.filter((d) => d.categoryLabel === reqDoc);
              return (
                <div key={index} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1267B1] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{reqDoc}</span>
                    </div>
                    {matchedUploaded.length > 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === 'bn' ? 'আপলোড সম্পন্ন' : 'Uploaded'}
                      </span>
                    )}
                  </div>

                  {/* Upload Trigger Button */}
                  <label className="block w-full cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, reqDoc)}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-[#1267B1] bg-white rounded-xl text-center text-xs text-[#1267B1] font-medium flex items-center justify-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ফাইল সিলেক্ট বা স্ক্যান করুন' : 'Select / Scan File'}</span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>

          {/* List of currently uploaded documents */}
          {documents.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                {lang === 'bn' ? `সংযুক্ত নথিপত্র (${documents.length} টি):` : `Attached Files (${documents.length}):`}
              </span>
              <div className="space-y-1.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 truncate max-w-[200px]">
                      <FileText className="w-4 h-4 text-[#1267B1] shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-slate-400">
                          {(doc.fileSize / 1024).toFixed(0)} KB • {doc.categoryLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1 text-slate-500 hover:text-[#1267B1] rounded-lg"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDoc(doc.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-1/3 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              {lang === 'bn' ? 'পূর্ববর্তী' : 'Back'}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3 px-4 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{lang === 'bn' ? 'পর্যালোচনা ও সম্মতি' : 'Review & Consent'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & STATUTORY CONSENT */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'bn' ? '৩. চূড়ান্ত পর্যালোচনা ও নাগরিক সম্মতি' : '3. Final Review & Statutory Consent'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'bn' ? 'জমা দেওয়ার পূর্বে সমস্ত তথ্য মিলিয়ে নিন' : 'Verify all details before final submission'}
            </p>
          </div>

          {/* Form Data Summary */}
          <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/80 text-xs">
            <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-[#1267B1]">
              {lang === 'bn' ? 'আবেদনকারীর তথ্য' : 'Applicant Information'}
            </h5>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              {Object.entries(formData).map(([k, v]) => (
                <div key={k}>
                  <span className="text-[10px] text-slate-400 block capitalize">{k}</span>
                  <span className="font-medium text-slate-800 truncate block">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Documents Summary */}
          <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/80 text-xs">
            <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-[#1267B1]">
              {lang === 'bn' ? `সংযুক্ত নথিপত্র (${documents.length} টি)` : `Attached Documents (${documents.length})`}
            </h5>
            {documents.length === 0 ? (
              <p className="text-[11px] text-amber-700">
                {lang === 'bn' ? 'কোনো নথি আপলোড করা হয়নি।' : 'No documents uploaded.'}
              </p>
            ) : (
              <ul className="space-y-1 text-[11px] text-slate-700">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{d.fileName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fee Table */}
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-1">
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>{t.serviceChargeLabel}</span>
              <span className="font-mono">₹{service.serviceCharge}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>{t.officialFeeLabel}</span>
              <span className="font-mono">₹{service.officialFee}</span>
            </div>
            <div className="flex justify-between font-bold text-xs text-[#1267B1] pt-1 border-t border-blue-200/60">
              <span>{t.totalFeeLabel}</span>
              <span className="font-mono text-sm">₹{service.serviceCharge + service.officialFee}</span>
            </div>
          </div>

          {/* Statutory Citizen Consent Checkbox */}
          <label className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#1267B1] focus:ring-[#1267B1] accent-[#1267B1]"
            />
            <span className="text-[11px] text-slate-700 leading-relaxed font-normal">
              {t.consentDeclaration}
            </span>
          </label>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setCurrentStep(2)}
              className="w-1/3 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              {lang === 'bn' ? 'পূর্ববর্তী' : 'Back'}
            </button>
            <button
              type="button"
              disabled={submitting || !consentGiven}
              onClick={handleFinalSubmit}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#1267B1] to-[#16B8D4] hover:from-[#0D4E87] hover:to-[#0E92A9] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.confirmSubmit}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="text-xs font-bold text-slate-900 truncate">{previewDoc.fileName}</h4>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto flex items-center justify-center bg-slate-50 p-2 rounded-2xl border">
              {previewDoc.fileType.startsWith('image/') && previewDoc.dataUrl ? (
                <img src={previewDoc.dataUrl} alt="Preview" className="max-h-64 object-contain rounded-lg" />
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  <FileText className="w-12 h-12 text-[#1267B1] mx-auto mb-2" />
                  <p>{previewDoc.fileName}</p>
                  <p className="text-[10px] text-slate-400">PDF Document (Preview Ready)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
