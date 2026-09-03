import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, OrderStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface OrderConfirmationProps {
  order: Order;
  onBackToMenu: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onBackToMenu,
}) => {
  const { setInvoiceModalOrder, setIsNotificationCenterOpen } = useRestaurant();

  const statusSteps: { id: OrderStatus; label: string; desc: string }[] = [
    { id: 'new', label: 'Order Placed', desc: 'Received in system' },
    { id: 'preparing', label: 'Preparing', desc: 'Chef frying fresh crunch' },
    { id: 'ready', label: 'Ready', desc: 'Ready for table delivery' },
    { id: 'completed', label: 'Completed', desc: 'Served & billed' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <div
      id="order-confirmation-screen"
      className="max-w-xl mx-auto p-4 sm:p-6 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-card-border)] shadow-xl my-6 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Banner */}
      <div className="text-center pb-6 border-b border-[var(--color-card-border)]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment Successful • {order.paymentMethod}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[var(--color-text)]">
          Order #{order.orderNumber}
        </h2>
        <p className="text-sm font-semibold text-[var(--color-primary)] mt-0.5">
          {order.type === 'dine-in' ? `Table ${order.tableNumber || 12}` : 'Takeaway Pickup'}
        </p>
      </div>

      {/* Estimated Prep Time */}
      <div className="my-5 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[var(--color-muted)] block">Estimated Preparation</span>
            <span className="text-base font-black font-heading text-[var(--color-text)]">
              10–15 minutes
            </span>
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="text-[10px] text-neutral-400 block font-mono">ORDER TIME</span>
          <span className="font-bold text-[var(--color-text)]">{order.createdAt}</span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="my-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-4">
          Live Order Status Timeline
        </h4>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
          {statusSteps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.id} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20 animate-pulse'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div>
                  <h5
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[var(--color-primary)] font-black text-sm'
                        : isCompleted
                        ? 'text-neutral-900 font-semibold'
                        : 'text-neutral-400 font-medium'
                    }`}
                  >
                    {step.label}
                  </h5>
                  <p className="text-[11px] text-[var(--color-muted)]">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="p-4 rounded-xl border border-[var(--color-card-border)] bg-black/5 dark:bg-white/5 space-y-2 mb-6">
        <div className="flex justify-between text-xs font-bold text-[var(--color-text)] border-b border-[var(--color-card-border)] pb-2">
          <span>Items Ordered ({order.items.length})</span>
          <span>Total: ₹{order.total.toFixed(0)}</span>
        </div>
        <div className="space-y-1 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start py-1">
              <div>
                <span className="font-semibold text-[var(--color-text)]">
                  {item.quantity}× {item.name}
                </span>
                {item.customizations.length > 0 && (
                  <span className="text-[10px] text-[var(--color-muted)] block">
                    {item.customizations.join(', ')}
                  </span>
                )}
                {item.addOns.length > 0 && (
                  <span className="text-[10px] text-amber-600 block">
                    {item.addOns.join(', ')}
                  </span>
                )}
              </div>
              <span className="font-bold text-[var(--color-text)] font-mono">
                ₹{item.subtotal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons: View Digital Invoice & WhatsApp Updates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          id="btn-view-digital-invoice"
          onClick={() => setInvoiceModalOrder(order)}
          className="py-3 px-4 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface)] hover:bg-black/5 text-[var(--color-text)] font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <FileText className="w-4 h-4 text-neutral-600" />
          <span>View Digital Invoice</span>
        </button>

        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className="py-3 px-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp & SMS Updates</span>
        </button>
      </div>

      <button
        onClick={onBackToMenu}
        className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Order More Items</span>
      </button>
    </div>
  );
};
