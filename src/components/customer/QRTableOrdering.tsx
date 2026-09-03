import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES } from '../../data/initialMenu';
import { MenuItem } from '../../types';
import {
  QrCode,
  ShoppingBag,
  Sparkles,
  Plus,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  Tag,
  Search,
} from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { PaymentModal } from './PaymentModal';
import { OrderConfirmation } from './OrderConfirmation';

export const QRTableOrdering: React.FC = () => {
  const {
    menu,
    cart,
    addToCart,
    cartTotal,
    cartDiscount,
    appliedCoupon,
    placeOrder,
    activeTableNumber,
    setActiveTableNumber,
    setCustomizingMenuItem,
    customerMobile,
    customerName,
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [showTableSelect, setShowTableSelect] = useState<boolean>(false);

  const filteredItems = menu.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleItemClick = (item: MenuItem) => {
    if (!item.available) return;
    if (
      (item.customizationOptions && item.customizationOptions.length > 0) ||
      (item.availableAddOns && item.availableAddOns.length > 0)
    ) {
      setCustomizingMenuItem(item);
    } else {
      addToCart({
        id: `cart-${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        unitPrice: item.price,
        quantity: 1,
        image: item.image,
        customizations: [],
        addOns: [],
      });
    }
  };

  const handlePaymentSuccess = (paymentMethod: any, transactionId: string) => {
    setIsPaymentModalOpen(false);
    setIsCartOpen(false);

    // Create Order #1048
    const order = placeOrder({
      type: 'dine-in',
      tableNumber: activeTableNumber,
      customerName: customerName,
      customerMobile: customerMobile,
      items: cart.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        unitPrice: c.unitPrice,
        quantity: c.quantity,
        customizations: c.customizations.map((cu) => `${cu.name} (+₹${cu.price})`),
        addOns: c.addOns.map((a) => `${a.name} (+₹${a.price})`),
        specialInstructions: c.specialInstructions,
        subtotal: c.unitPrice * c.quantity,
      })),
      couponCode: appliedCoupon?.code,
      discount: cartDiscount,
      paymentMethod,
      source: 'QR',
    });

    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-body pb-24">
      {/* Table 12 Prominent Session Banner */}
      <div
        id="qr-table-banner"
        className="bg-neutral-900 text-white px-4 py-3 border-b border-neutral-800 shadow-md sticky top-14 z-20"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Dine-in QR Session
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-heading leading-none text-white">
                You're ordering from Table {activeTableNumber}
              </h2>
            </div>
          </div>

          {/* Quick Table Switcher for presentation flexibility */}
          <div className="relative">
            <button
              onClick={() => setShowTableSelect(!showTableSelect)}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
            >
              <span>Change Table</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showTableSelect && (
              <div className="absolute right-0 mt-1 w-44 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 z-50 grid grid-cols-4 gap-1">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTableNumber(t);
                      setShowTableSelect(false);
                    }}
                    className={`p-1.5 rounded text-xs font-bold transition-colors ${
                      activeTableNumber === t
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    T{t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Search Bar & Promo Notice */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search burgers, tenders, fries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <Tag className="w-3.5 h-3.5" />
            <span>Use coupon <strong>FRY50</strong> for ₹50 OFF</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-card-border)] hover:text-[var(--color-text)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Menu Food Cards List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-start sm:items-center justify-between gap-4 transition-all hover:border-[var(--color-primary)]/40 ${
                !item.available ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-100 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1.5 left-1.5 bg-white/90 p-0.5 rounded shadow-xs">
                  <span
                    className={`w-3 h-3 border flex items-center justify-center rounded-xs ${
                      item.isVeg ? 'border-emerald-600' : 'border-red-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    ></span>
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm sm:text-base text-[var(--color-text)]">
                    {item.name}
                  </h3>
                  {item.isPopular && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      Bestseller
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono font-black text-base text-[var(--color-text)]">
                    ₹{item.price}
                  </span>
                  {item.customizationOptions && (
                    <span className="text-[10px] text-[var(--color-muted)]">
                      • Customizable
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 self-center">
                {item.available ? (
                  <button
                    id={`btn-add-item-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white flex items-center gap-1 shadow-xs hover:opacity-90 transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <span className="text-xs text-neutral-400 font-semibold">Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && !confirmedOrder && (
        <div className="fixed bottom-3 inset-x-0 z-30 px-4 max-w-lg mx-auto w-full">
          <button
            id="btn-qr-open-cart"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white shadow-2xl flex items-center justify-between transition-all transform hover:scale-[1.01] cursor-pointer"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>
                {cart.reduce((a, b) => a + b.quantity, 0)} Items Added
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base">₹{cartTotal}</span>
              <span className="text-xs uppercase bg-white/20 px-2 py-0.5 rounded">
                View Tray →
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToPayment={() => {
          setIsCartOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          amount={cartTotal}
          orderNumber={1048}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}

      {/* Order Confirmation Screen Overlay if placed */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <OrderConfirmation
            order={confirmedOrder}
            onBackToMenu={() => setConfirmedOrder(null)}
          />
        </div>
      )}
    </div>
  );
};
