import React from 'react';
import { Bell, CheckCheck, Clock, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../lib/i18n';

interface NotificationsScreenProps {
  onSelectApplicationById: (appId: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onSelectApplicationById,
}) => {
  const { lang, user } = useAuth();
  const { notifications, markNotificationRead } = useApp();
  const t = translations[lang];

  const userNotifs = notifications.filter(
    (n) => !user || n.recipientUid === user.uid || user.role === 'ownerAdmin'
  );

  return (
    <div className="space-y-3.5 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {lang === 'bn' ? 'বিজ্ঞপ্তি এবং আপডেট' : 'Notifications & Updates'}
        </h2>
        <span className="text-[11px] text-slate-500">
          {userNotifs.length} {lang === 'bn' ? 'টি বার্তা' : 'messages'}
        </span>
      </div>

      {userNotifs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1267B1] flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            {lang === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No new notifications'}
          </p>
          <p className="text-[11px] text-slate-400">
            {lang === 'bn'
              ? 'আপনার আবেদনের অগ্রগতি এখানে প্রদর্শিত হবে।'
              : 'Updates regarding your applications will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {userNotifs.map((notif) => {
            const isUnread = !notif.readAt;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (isUnread) markNotificationRead(notif.id);
                  if (notif.applicationId) onSelectApplicationById(notif.applicationId);
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 relative ${
                  isUnread
                    ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isUnread ? 'bg-[#1267B1] text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{notif.body}</p>

                  {notif.applicationId && (
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#1267B1] font-semibold">
                        {notif.applicationId}
                      </span>
                      <span className="text-[#1267B1] font-medium flex items-center gap-0.5 hover:underline">
                        <span>{lang === 'bn' ? 'আবেদন দেখুন' : 'View'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-[#1267B1] shrink-0 absolute top-4 right-4 ring-2 ring-blue-100" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
