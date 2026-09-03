import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES } from '../../data/initialMenu';
import { MenuItem } from '../../types';
import {
  Flame,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { PaymentModal } from './PaymentModal';
import { OrderConfirmation } from './OrderConfirmation';

export const CustomerWebsite: React.FC = () => {
  const {
    menu,
    cart,
    addToCart,
    cartTotal,
    cartDiscount,
    appliedCoupon,
    placeOrder,
    activeOrder,
    setActiveOrder,
    setCustomizingMenuItem,
    setCurrentArea,
    activeTableNumber,
    customerMobile,
    customerName,
  } = useRestaurant();
  const { themeDetails } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const filteredItems = menu.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const featuredItems = menu.filter((i) => i.isFeatured);
  const popularItems = menu.filter((i) => i.isPopular);

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

  const handleStartQrOrder = () => {
    setCurrentArea('qr-ordering');
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-body">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.08] text-[var(--color-text)]">
              CRISPY. JUICY.{' '}
              <span style={{ color: 'var(--color-primary)' }}>UNFORGETTABLE.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-xl font-normal leading-relaxed">
              Your FRYGUY favourites, now just a few taps away. Hand-battered fresh fried chicken, brioche smashed burgers, loaded fries, and thick shakes crafted for maximum crunch.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-hero-order-now"
                onClick={handleStartQrOrder}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-xl hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer scale-100 hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const menuEl = document.getElementById('menu-section');
                  menuEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl font-bold text-sm border border-[var(--color-card-border)] bg-[var(--color-surface)] hover:bg-black/5 text-[var(--color-text)] transition-colors cursor-pointer"
              >
                Explore Full Menu
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-card-border)]">
              <div>
                <span className="block font-heading font-black text-xl text-[var(--color-text)]">
                  100%
                </span>
                <span className="text-[11px] text-[var(--color-muted)]">Fresh Whole Chicken</span>
              </div>
              <div>
                <span className="block font-heading font-black text-xl text-[var(--color-text)]">
                  10–15m
                </span>
                <span className="text-[11px] text-[var(--color-muted)]">Average Prep Time</span>
              </div>
              <div>
                <span className="block font-heading font-black text-xl text-[var(--color-text)]">
                  4.9 / 5
                </span>
                <span className="text-[11px] text-[var(--color-muted)]">Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-2xl border-4 border-[var(--color-surface)]">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                alt="FRYGUY Signature Crispy Feast"
                className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--color-primary)] text-white">
                  CHEF SPECIAL
                </span>
                <h3 className="text-xl font-black font-heading mt-1">Says Cheese Double Smash</h3>
                <p className="text-xs text-neutral-300 line-clamp-2">
                  Double cheddar molten sauce with fried chicken steak & caramelized onions.
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                  <span className="text-base font-black text-amber-400 font-mono">₹139</span>
                  <button
                    onClick={() => {
                      const item = menu.find((m) => m.name === 'Says Cheese');
                      if (item) {
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
                    }}
                    className="px-3 py-1 rounded-lg bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 cursor-pointer shadow-sm transition-transform active:scale-95"
                  >
                    Quick Add +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Combos Carousel / Banner */}
      <section className="bg-neutral-900 text-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                Signature FRYGUY Combos
              </h2>
            </div>
            <button
              onClick={handleStartQrOrder}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Combos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menu
              .filter((i) => i.category === 'Combos')
              .map((combo) => (
                <div
                  key={combo.id}
                  className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 hover:border-amber-400/50 transition-all flex flex-col group"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-amber-500 text-neutral-950 font-black text-xs">
                      SAVE 25%
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-heading font-black text-lg text-white">
                        {combo.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {combo.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                      <div>
                        <span className="text-xs text-neutral-400 block line-through">
                          ₹{combo.price + 70}
                        </span>
                        <span className="text-lg font-black text-amber-400 font-mono">
                          ₹{combo.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleItemClick(combo)}
                        className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Order Combo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Main Menu Section */}
      <section id="menu-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-[var(--color-text)]">
            Explore the FRYGUY Menu
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Tap any item to customize with extra cheese, chicken patties, signature sauces, and loaded sides.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-md scale-105'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-card-border)] hover:text-[var(--color-text)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className={`group rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-card-border)] overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-all duration-300 ${
                  !item.available ? 'opacity-60 grayscale-[40%]' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
                    <span
                      className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                        item.isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      ></span>
                    </span>
                  </div>

                  {/* Badges */}
                  {item.isPopular && item.available && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950">
                      Popular
                    </span>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                      Currently Unavailable
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-black text-base text-[var(--color-text)]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-card-border)]">
                    <span className="font-mono font-black text-base text-[var(--color-text)]">
                      ₹{item.price}
                    </span>

                    {item.available ? (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-90 transition-all cursor-pointer"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-medium">Sold Out</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating View Cart Floating Bar if items exist */}
      {cart.length > 0 && !confirmedOrder && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 max-w-lg mx-auto w-full animate-in slide-in-from-bottom-4 duration-300">
          <button
            id="btn-sticky-view-cart"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white shadow-2xl flex items-center justify-between transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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

      {/* Restaurant Info & Location */}
      <section className="bg-[var(--color-surface)] border-t border-[var(--color-card-border)] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)]">Opening Hours</h4>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                Monday – Sunday: 11:00 AM – 1:00 AM
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                Kitchen Open Now for Dining & Takeaway
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)]">Restaurant Location</h4>
              <p className="text-xs text-[var(--color-muted)] mt-0.5 font-medium">
                Beside Westside, FCI Colony Park Road
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                Abhyudaya Nagar, Chintalkunta, L.B. Nagar, Hyderabad, Telangana 500074
              </p>
              <a
                href="https://maps.app.goo.gl/SGD4e6WWWBYFseff6"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline mt-2 group"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)]">Direct Support & Orders</h4>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                Direct Helpdesk: +91 91212 55890
              </p>
              <p className="text-xs text-[var(--color-muted)]">contact@fryguy.in</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-8 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-base text-white">FRYGUY</span>
            <span>•</span>
            <span>Digital Restaurant Ordering Platform Prototype</span>
          </div>
          <div className="text-[11px]">
            Designed for FRYGUY restaurant owner presentation. All mock integrations simulated locally.
          </div>
        </div>
      </footer>

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
