import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToPayment,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartDiscount,
    cartTax,
    cartTotal,
    customerMobile,
    setCustomerMobile,
    activeTableNumber,
  } = useRestaurant();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
    >
      <div
        id="cart-drawer"
        className="w-full max-w-md bg-[var(--color-surface)] text-[var(--color-text)] h-full flex flex-col shadow-2xl border-l border-[var(--color-card-border)] animate-in slide-in-from-right duration-200"
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-[var(--color-card-border)] flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="font-heading font-black text-base">Your Tray</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)]">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dine-in Table Indicator */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs flex items-center justify-between">
          <span className="font-bold text-amber-800 dark:text-amber-300">
            📍 Table {activeTableNumber} (Dine-in Order)
          </span>
          <span className="text-[10px] text-neutral-500">QR Session Active</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-muted)]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold">Your tray is empty</p>
              <p className="text-xs mt-1">Browse the menu and add your crispy favorites!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface)] shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[var(--color-text)] truncate">
                      {item.name}
                    </h4>
                    <span className="font-mono font-bold text-sm text-[var(--color-text)]">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>

                  {/* Customizations / Add-ons List */}
                  {item.customizations.length > 0 && (
                    <div className="text-[11px] text-[var(--color-muted)] mt-0.5">
                      + {item.customizations.map((c) => c.name).join(', ')}
                    </div>
                  )}
                  {item.addOns.length > 0 && (
                    <div className="text-[11px] text-amber-700 mt-0.5">
                      + {item.addOns.map((a) => a.name).join(', ')}
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                    <div className="flex items-center gap-1.5 border border-[var(--color-card-border)] rounded-lg p-0.5 bg-black/5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-black/10 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs min-w-4 text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-black/10 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Quick Add Demo Coupon pill if not applied */}
          {!appliedCoupon && cart.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Try coupon <strong>FRY50</strong> for ₹50 OFF</span>
              </div>
              <button
                onClick={() => applyCoupon('FRY50')}
                className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Customer Mobile Number Input */}
          {cart.length > 0 && (
            <div className="p-3 rounded-xl border border-[var(--color-card-border)] bg-black/5 dark:bg-white/5 space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-text)]">
                Mobile Number (For Digital Invoice & WhatsApp Updates)
              </label>
              <input
                id="cart-customer-mobile"
                type="tel"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <span className="text-[10px] text-[var(--color-muted)]">
                *No app download required. Instant WhatsApp receipt sent.
              </span>
            </div>
          )}
        </div>

        {/* Footer & Bill Details */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[var(--color-card-border)] bg-[var(--color-surface)] space-y-3 shrink-0">
            {/* Coupon Input Form */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon: {appliedCoupon.code}</span>
                    <span className="font-normal text-[11px]">(-₹{cartDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. FRY50)"
                    className="flex-1 text-xs uppercase font-mono px-3 py-2 rounded-xl border border-[var(--color-card-border)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[var(--color-muted)] border-t border-black/5 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-[var(--color-text)]">
                  ₹{cartSubtotal}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono">-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-[11px]">
                <span>Taxes (5% GST)</span>
                <span className="font-mono font-semibold text-[var(--color-text)]">
                  ₹{cartTax}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-[var(--color-text)] pt-1.5 border-t border-[var(--color-card-border)]">
                <span>Total Amount</span>
                <span className="font-mono text-base font-black">₹{cartTotal}</span>
              </div>
            </div>

            {/* Proceed to Payment CTA */}
            <button
              id="btn-proceed-to-payment"
              onClick={onProceedToPayment}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-between hover:opacity-95 transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              <span>Proceed to Payment</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-black">₹{cartTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
