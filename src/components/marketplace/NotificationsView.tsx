import React, { useState } from 'react';
import { Bell, MessageSquare, Users, Sparkles, Check, CheckCheck, Trash2, ArrowRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'lead' | 'message' | 'price' | 'system';
  read: boolean;
  linkTab?: string;
}

interface NotificationsViewProps {
  onSelectTab: (tab: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onSelectTab }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '🔥 New Buyer Inquiry on Toyota Corolla',
      body: 'Kamran Ali sent an inquiry for test drive inspection on your 2022 Altis Grande.',
      time: '15 mins ago',
      type: 'lead',
      read: false,
      linkTab: 'leads',
    },
    {
      id: 'notif-2',
      title: '💬 New Message from Auto Choice Showroom',
      body: '"The car is available for inspection at our showroom."',
      time: '1 hour ago',
      type: 'message',
      read: false,
      linkTab: 'messages',
    },
    {
      id: 'notif-3',
      title: '🛡️ Seller Trust Badge Verified',
      body: 'Your phone number and CNIC verification have been confirmed on Bazar360.',
      time: 'Yesterday',
      type: 'system',
      read: true,
      linkTab: 'profile',
    },
    {
      id: 'notif-4',
      title: '📉 Price Drop Alert',
      body: 'A vehicle in your saved shortlist (2021 Honda Civic) dropped in price by 1.5 Lakh.',
      time: '2 days ago',
      type: 'price',
      read: true,
      linkTab: 'saved',
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-16">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500">Live updates on buyer leads, messages, and saved vehicles.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell size={36} className="mx-auto text-slate-300 mb-2" />
            No new notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => notif.linkTab && onSelectTab(notif.linkTab)}
              className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                notif.read ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'lead' ? 'bg-amber-100 text-amber-700' :
                notif.type === 'message' ? 'bg-blue-100 text-blue-700' :
                notif.type === 'system' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {notif.type === 'lead' ? <Users size={16} /> :
                 notif.type === 'message' ? <MessageSquare size={16} /> :
                 <Sparkles size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${notif.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
