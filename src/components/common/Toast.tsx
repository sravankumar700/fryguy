import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useRestaurant();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notifications-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-neutral-900 text-white rounded-xl p-3.5 shadow-2xl border border-neutral-700 flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-2"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              )}
              {toast.type === 'alert' && (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              )}
              {(!toast.type || toast.type === 'info') && (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold tracking-tight text-white">
                {toast.title}
              </h5>
              <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
