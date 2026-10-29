import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Check,
  Power,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/seedServices';
import { translations } from '../../lib/i18n';

export const AdminServiceManagement: React.FC = () => {
  const { lang } = useAuth();
  const { services, toggleServiceStatus, updateServiceFees, addService } = useApp();
  const t = translations[lang];

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Edit fee state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editOfficialFee, setEditOfficialFee] = useState<number>(0);
  const [editServiceCharge, setEditServiceCharge] = useState<number>(0);

  // Add Service Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [newDescBn, setNewDescBn] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newGovtFee, setNewGovtFee] = useState(0);
  const [newServiceCharge, setNewServiceCharge] = useState(100);
  const [newPortalUrl, setNewPortalUrl] = useState('');

  const filtered = services.filter((s) => {
    const matchCat = selectedCategory === 'all' || s.categoryId === selectedCategory;
    const matchQuery =
      query.trim() === '' ||
      s.titleBn.toLowerCase().includes(query.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleStartEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setEditOfficialFee(service.officialFee);
    setEditServiceCharge(service.serviceCharge);
  };

  const handleSaveEdit = async (serviceId: string) => {
    await updateServiceFees(serviceId, Number(editOfficialFee), Number(editServiceCharge));
    setEditingServiceId(null);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleBn.trim() || !newTitleEn.trim()) return;

    const catObj = SERVICE_CATEGORIES.find((c) => c.id === newCategory) || SERVICE_CATEGORIES[1];
    const newService: ServiceItem = {
      id: `service_${Date.now()}`,
      titleBn: newTitleBn.trim(),
      titleEn: newTitleEn.trim(),
      categoryId: newCategory,
      categoryNameBn: catObj.nameBn,
      categoryNameEn: catObj.nameEn,
      descriptionBn: newDescBn.trim() || newTitleBn.trim(),
      descriptionEn: newDescEn.trim() || newTitleEn.trim(),
      active: true,
      officialFee: Number(newGovtFee),
      serviceCharge: Number(newServiceCharge),
      requiredDocuments: ['আধার কার্ড', 'সংশ্লিষ্ট নথিপত্র'],
      officialPortalUrl: newPortalUrl || 'https://wb.gov.in',
      authorizationRequirement: 'অনলাইন আবেদনের প্রয়োজনীয় নির্দেশাবলী প্রযোজ্য।',
      formSchema: [
        {
          name: 'applicantName',
          labelBn: 'আবেদনকারীর পুরো নাম',
          labelEn: 'Applicant Full Name',
          type: 'text',
          required: true
        },
        {
          name: 'details',
          labelBn: 'প্রয়োজনীয় তথ্যাবলী বা বিবরণ',
          labelEn: 'Required Information',
          type: 'textarea',
          required: true
        }
      ]
    };

    await addService(newService);
    setShowAddModal(false);
    setNewTitleBn('');
    setNewTitleEn('');
    setNewDescBn('');
    setNewDescEn('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header and Add CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {lang === 'bn' ? 'পরিষেবা ক্যাটালগ পরিচালনা' : 'Service Catalogue Management'}
          </h2>
          <p className="text-[11px] text-slate-500">
            {lang === 'bn' ? 'ফি পরিবর্তন, সেবা চালু/বন্ধ ও নতুন সেবা যোগ করুন' : 'Configure fees, toggle active status, add services'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 bg-[#1267B1] hover:bg-[#0D4E87] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'নতুন সেবা' : 'Add Service'}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-2 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'সেবার নাম লিখুন...' : 'Search services...'}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1267B1]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 text-xs font-medium"
        >
          <option value="all">{lang === 'bn' ? 'সকল বিভাগ' : 'All Categories'}</option>
          {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <option key={cat.id} value={cat.id}>
              {lang === 'bn' ? cat.nameBn : cat.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Services List Table / Cards */}
      <div className="space-y-2.5">
        {filtered.map((service) => {
          const isEditing = editingServiceId === service.id;
          return (
            <div
              key={service.id}
              className={`p-3.5 bg-white border rounded-2xl transition space-y-2.5 ${
                service.active ? 'border-slate-200/90 shadow-2xs' : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 truncate">
                  <span className="text-[10px] font-semibold text-[#1267B1] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                    {lang === 'bn' ? service.categoryNameBn : service.categoryNameEn}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {lang === 'bn' ? service.titleBn : service.titleEn}
                  </h4>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    service.active
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title="Toggle Active"
                >
                  <Power className="w-3 h-3" />
                  <span>{service.active ? (lang === 'bn' ? 'সক্রিয়' : 'Active') : (lang === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}</span>
                </button>
              </div>

              {/* Fee Configuration Bar */}
              {isEditing ? (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600 block font-medium">
                        {t.serviceChargeLabel} (₹):
                      </label>
                      <input
                        type="number"
                        value={editServiceCharge}
                        onChange={(e) => setEditServiceCharge(Number(e.target.value))}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block font-medium">
                        {t.officialFeeLabel} (₹):
                      </label>
                      <input
                        type="number"
                        value={editOfficialFee}
                        onChange={(e) => setEditOfficialFee(Number(e.target.value))}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setEditingServiceId(null)}
                      className="px-2.5 py-1 text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => handleSaveEdit(service.id)}
                      className="px-3 py-1 bg-[#1267B1] text-white rounded-lg text-xs font-bold"
                    >
                      {lang === 'bn' ? 'সংরক্ষণ' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span>
                      {lang === 'bn' ? 'সেন্টার চার্জ: ' : 'Charge: '}
                      <strong className="text-slate-900 font-bold font-mono">₹{service.serviceCharge}</strong>
                    </span>
                    <span>
                      {lang === 'bn' ? 'সরকারি ফি: ' : 'Govt: '}
                      <strong className="text-slate-900 font-bold font-mono">₹{service.officialFee}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartEdit(service)}
                    className="p-1 text-[#1267B1] hover:bg-blue-50 rounded-lg flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ফি এডিট' : 'Edit Fee'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3.5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {lang === 'bn' ? 'নতুন সেবা যোগ করুন' : 'Add New Custom Service'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {lang === 'bn' ? 'সেবার নাম (বাংলায়)' : 'Service Title (Bengali)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitleBn}
                  onChange={(e) => setNewTitleBn(e.target.value)}
                  placeholder="যেমন: নতুন রেশন কার্ড নাম সংযোজন"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {lang === 'bn' ? 'সেবার নাম (ইংরেজিতে)' : 'Service Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="e.g. New Ration Card Member Addition"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {lang === 'bn' ? 'বিভাগ (Category)' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-medium"
                >
                  {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameBn} ({cat.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {t.serviceChargeLabel} (₹)
                  </label>
                  <input
                    type="number"
                    value={newServiceCharge}
                    onChange={(e) => setNewServiceCharge(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {t.officialFeeLabel} (₹)
                  </label>
                  <input
                    type="number"
                    value={newGovtFee}
                    onChange={(e) => setNewGovtFee(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {lang === 'bn' ? 'অফিসিয়াল পোর্টাল লিঙ্ক (ঐচ্ছিক)' : 'Official Portal URL (Optional)'}
                </label>
                <input
                  type="url"
                  value={newPortalUrl}
                  onChange={(e) => setNewPortalUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#1267B1] hover:bg-[#0D4E87] text-white font-bold rounded-xl shadow-xs"
                >
                  {lang === 'bn' ? 'যোগ করুন' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
