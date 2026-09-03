import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, MessageSquare, Phone, CheckCheck, Send, Bell } from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    orders,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'all' | 'whatsapp' | 'sms'>('all');

  if (!isNotificationCenterOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  return (
    <div
      id="modal-notification-center-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="modal-notification-center"
        className="relative w-full max-w-xl bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Simulated Notification Dispatch Hub
              </h3>
              <p className="text-[10px] text-neutral-400">
                Live WhatsApp Business & SMS gateway triggers (Demo Engine)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Architecture Disclaimer */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-[11px] text-amber-900">
          <span>
            ⚡ <strong>Demo Mock Dispatch:</strong> Simulated events fired as the order transitions through Kitchen and Billing states.
          </span>
          <span className="text-[10px] font-mono bg-amber-200/60 px-2 py-0.5 rounded font-bold">
            {notifications.length} Triggers
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            All Messages ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2 px-2.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            WhatsApp ({notifications.filter((n) => n.type === 'whatsapp').length})
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`pb-2 px-2.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sms'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            SMS Gateway ({notifications.filter((n) => n.type === 'sms').length})
          </button>
        </div>

        {/* Notification List Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-neutral-100/60 max-h-[60vh]">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No messages triggered yet.</p>
              <p className="text-[11px] mt-1">
                Place an order or update status in Kitchen to watch automated SMS & WhatsApp events fire here.
              </p>
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const isWhatsApp = notif.type === 'whatsapp';
              return (
                <div
                  key={notif.id}
                  className={`rounded-2xl p-4 shadow-xs border transition-all ${
                    isWhatsApp
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isWhatsApp
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isWhatsApp ? 'WhatsApp' : 'SMS'}
                      </span>
                      <span className="text-xs font-bold text-neutral-800 font-mono">
                        To: {notif.recipient}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-500">
                        (Order #{notif.orderNumber})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                      <span>{notif.timestamp}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`mt-2 p-3 rounded-xl text-xs whitespace-pre-line leading-relaxed ${
                      isWhatsApp
                        ? 'bg-white text-neutral-800 border border-emerald-100 shadow-xs'
                        : 'bg-neutral-50 text-neutral-800 border border-neutral-200'
                    }`}
                  >
                    {notif.message}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 text-[10px] text-neutral-500">
                    <span>
                      Trigger: Order #{notif.orderNumber} lifecycle event
                    </span>
                    <span className="text-emerald-700 font-medium font-mono">
                      Status: 200 Delivered
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Simulated integration for FRYGUY restaurant client presentation.</span>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
