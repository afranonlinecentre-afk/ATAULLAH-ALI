import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  RefreshCw,
  XCircle,
  FileEdit
} from 'lucide-react';
import { ApplicationStatus, PaymentStatus, Language } from '../../types';
import { getStatusLabel, getPaymentLabel } from '../../lib/i18n';

interface StatusBadgeProps {
  status: ApplicationStatus;
  lang: Language;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang, size = 'md' }) => {
  const label = getStatusLabel(status, lang);

  const getStyle = () => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="w-3.5 h-3.5" />,
          dot: 'bg-blue-500'
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />,
          dot: 'bg-amber-500'
        };
      case 'Need Documents':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <FileQuestion className="w-3.5 h-3.5 text-orange-600" />,
          dot: 'bg-orange-500'
        };
      case 'Processing':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />,
          dot: 'bg-indigo-500'
        };
      case 'Completed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          dot: 'bg-emerald-500'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          dot: 'bg-rose-500'
        };
      case 'Cancelled':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          dot: 'bg-slate-400'
        };
      case 'Draft':
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          icon: <FileEdit className="w-3.5 h-3.5" />,
          dot: 'bg-slate-400'
        };
    }
  };

  const style = getStyle();
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${style.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.icon}
      <span>{label}</span>
    </span>
  );
};

interface PaymentBadgeProps {
  status: PaymentStatus;
  lang: Language;
  size?: 'sm' | 'md';
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ status, lang, size = 'md' }) => {
  const label = getPaymentLabel(status, lang);

  const getStyle = () => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Payment Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Waived':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Refunded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Unpaid':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${getStyle()} ${sizeClasses}`}>
      {label}
    </span>
  );
};
