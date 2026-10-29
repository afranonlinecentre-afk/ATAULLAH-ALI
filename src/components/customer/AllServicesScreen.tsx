import React, { useState } from 'react';
import { Search, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/seedServices';
import { ServiceItem } from '../../types';
import { translations } from '../../lib/i18n';

interface AllServicesScreenProps {
  onSelectService: (service: ServiceItem) => void;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const AllServicesScreen: React.FC<AllServicesScreenProps> = ({
  onSelectService,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { lang } = useAuth();
  const { services } = useApp();
  const t = translations[lang];

  const [query, setQuery] = useState('');

  const filtered = services.filter((s) => {
    if (!s.active) return false;
    const matchesCategory = selectedCategoryId === 'all' || s.categoryId === selectedCategoryId;
    const matchesQuery =
      query.trim() === '' ||
      s.titleBn.toLowerCase().includes(query.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(query.toLowerCase()) ||
      s.categoryNameBn.toLowerCase().includes(query.toLowerCase()) ||
      s.descriptionBn.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-3.5 pb-20">
      {/* Search Header */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#1267B1]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Horizontal Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {SERVICE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                isSelected
                  ? 'bg-[#1267B1] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {lang === 'bn' ? cat.nameBn : cat.nameEn}
            </button>
          );
        })}
      </div>

      {/* Count Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          {lang === 'bn' ? `মোট সেবা প্রদর্শিত: ${filtered.length} টি` : `Showing ${filtered.length} services`}
        </span>
      </div>

      {/* Services List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-xs text-slate-500 mb-2">
            {lang === 'bn' ? 'কোনো সেবা পাওয়া যায়নি।' : 'No services found.'}
          </p>
          <button
            onClick={() => {
              setQuery('');
              onSelectCategory('all');
            }}
            className="text-xs text-[#1267B1] font-semibold hover:underline"
          >
            {lang === 'bn' ? 'সমস্ত সেবা দেখুন' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-[#1267B1] hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#1267B1] bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                    {lang === 'bn' ? service.categoryNameBn : service.categoryNameEn}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {service.requiredDocuments.length} {lang === 'bn' ? 'টি নথি প্রয়োজন' : 'docs required'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1267B1] transition leading-snug">
                  {lang === 'bn' ? service.titleBn : service.titleEn}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {lang === 'bn' ? service.descriptionBn : service.descriptionEn}
                </p>
              </div>

              {/* Fee Bar */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="text-[11px]">
                    <span className="text-slate-500">{lang === 'bn' ? 'সেবা চার্জ: ' : 'Fee: '}</span>
                    <strong className="text-slate-900 font-bold">₹{service.serviceCharge}</strong>
                  </div>
                  {service.officialFee > 0 ? (
                    <span className="text-[10px] text-slate-400">
                      (+ {lang === 'bn' ? 'সরকারি ফি: ₹' : 'Govt: ₹'}{service.officialFee})
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-medium">
                      ({lang === 'bn' ? 'কোনো সরকারি ফি নেই' : 'Free Govt Fee'})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1267B1] group-hover:translate-x-0.5 transition">
                  <span>{lang === 'bn' ? 'আবেদন করুন' : 'Apply'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
