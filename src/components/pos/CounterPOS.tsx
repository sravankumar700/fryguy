import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES } from '../../data/initialMenu';
import {
  CartItem,
  MenuItem,
  OrderType,
  PaymentMethod,
} from '../../types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  Users,
  ShoppingBag,
  UtensilsCrossed,
  X,
  MapPin,
} from 'lucide-react';
import { calculateOrderTotals } from '../../services/mockOrderService';

export const CounterPOS: React.FC = () => {
  const {
    menu,
    tables,
    placeOrder,
    coupons,
    setCustomizingMenuItem,
    showToast,
    orders,
    posCart,
    addToPosCart,
    updatePosCartQuantity,
    removeFromPosCart,
    clearPosCart,
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // POS Order State
  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [customerMobile, setCustomerMobile] = useState<string>('+91 98000 11223');
  const [customerName, setCustomerName] = useState<string>('Takeaway Guest');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Success alert
  const [lastCreatedOrderNum, setLastCreatedOrderNum] = useState<number | null>(null);

  // Filter menu
  const filteredItems = menu.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddItemToPos = (item: MenuItem) => {
    if (!item.available) return;

    addToPosCart({
      id: `pos-${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      unitPrice: item.price,
      quantity: 1,
      image: item.image,
      customizations: [],
      addOns: [],
    });
  };

  const updatePosQty = (id: string, delta: number) => {
    const item = posCart.find((p) => p.id === id);
    if (!item) return;
    updatePosCartQuantity(id, item.quantity + delta);
  };

  const subtotal = posCart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  // Apply POS Coupon
  const handleApplyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!found) {
      showToast('Invalid Coupon', 'Coupon code not recognized.', 'alert');
      return;
    }
    if (subtotal < found.minOrder) {
      showToast('Min Order Unmet', `Requires minimum ₹${found.minOrder}.`, 'warning');
      return;
    }
    setAppliedCouponCode(found.code);
    if (found.discountType === 'fixed') {
      setDiscountAmount(found.discountValue);
    } else {
      const disc = (subtotal * found.discountValue) / 100;
      setDiscountAmount(found.maxDiscount ? Math.min(disc, found.maxDiscount) : disc);
    }
    showToast('Coupon Applied', `${found.code} applied to POS ticket!`, 'success');
  };

  const totals = calculateOrderTotals(
    posCart.map((c) => ({
      menuItemId: c.menuItemId,
      name: c.name,
      unitPrice: c.unitPrice,
      quantity: c.quantity,
      customizations: c.customizations.map((cu) => cu.name),
      addOns: c.addOns.map((a) => a.name),
      subtotal: c.unitPrice * c.quantity,
    })),
    discountAmount
  );

  const handlePlaceOrder = () => {
    if (posCart.length === 0) {
      showToast('Empty Order', 'Please add items to cart first.', 'warning');
      return;
    }

    if (orderType === 'dine-in' && !selectedTable) {
      showToast('Table Selection Required', 'Please select a dining table before placing order.', 'warning');
      setIsTableModalOpen(true);
      return;
    }

    // Place order in shared state
    const newOrder = placeOrder({
      type: orderType,
      tableNumber: orderType === 'dine-in' ? selectedTable : undefined,
      customerName: customerName.trim() || (orderType === 'dine-in' ? `Table ${selectedTable} Guest` : 'Walk-in Guest'),
      customerMobile: customerMobile.trim() || '+91 98000 11223',
      items: posCart.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        unitPrice: c.unitPrice,
        quantity: c.quantity,
        customizations: c.customizations.map((cu) => `${cu.name} (+₹${cu.price})`),
        addOns: c.addOns.map((a) => `${a.name} (+₹${a.price})`),
        specialInstructions: c.specialInstructions,
        subtotal: c.unitPrice * c.quantity,
      })),
      couponCode: appliedCouponCode || undefined,
      discount: totals.discount,
      paymentMethod,
      source: 'POS',
    });

    setLastCreatedOrderNum(newOrder.orderNumber);
    // Clear POS cart
    clearPosCart();
    setAppliedCouponCode('');
    setDiscountAmount(0);

    setTimeout(() => {
      setLastCreatedOrderNum(null);
    }, 6000);
  };

  return (
    <div
      id="counter-pos-system"
      className="h-[calc(100vh-68px)] bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col overflow-hidden font-body"
    >
      {/* POS Notification Bar */}
      {lastCreatedOrderNum && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Order #{lastCreatedOrderNum} Created Successfully!</span>
            <span className="text-emerald-200 font-normal">
              Dispatched directly to Kitchen Display System (KDS).
            </span>
          </div>
          <button
            onClick={() => setLastCreatedOrderNum(null)}
            className="text-white hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3-Column POS Grid */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: Categories */}
        <div className="col-span-2 bg-[var(--color-surface)] border-r border-[var(--color-card-border)] flex flex-col p-2 space-y-1.5 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] px-2 py-1">
            Categories
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-black/5'
                }`}
              >
                <span className="truncate">{cat}</span>
                {cat === 'All' && (
                  <span className="text-[10px] opacity-75">{menu.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* CENTER COLUMN: Food Products Grid */}
        <div className="col-span-6 flex flex-col bg-[var(--color-bg)] overflow-hidden border-r border-[var(--color-card-border)]">
          {/* Search Header */}
          <div className="p-3 bg-[var(--color-surface)] border-b border-[var(--color-card-border)] flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Quick search item name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddItemToPos(item)}
                className={`p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-card-border)] hover:border-[var(--color-primary)] shadow-xs transition-all cursor-pointer flex flex-col justify-between group select-none ${
                  !item.available ? 'opacity-50 pointer-events-none' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="relative h-24 rounded-lg overflow-hidden mb-2 bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 bg-white/90 p-0.5 rounded">
                    <span
                      className={`w-2.5 h-2.5 border flex items-center justify-center rounded-2xs ${
                        item.isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      ></span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-[var(--color-text)] line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-black/5">
                    <span className="font-mono font-black text-xs text-[var(--color-text)]">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.customizationOptions && item.customizationOptions.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomizingMenuItem(item);
                          }}
                          className="text-[10px] font-bold text-[var(--color-primary)] hover:underline px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 cursor-pointer"
                          title="Customize burger, fries, or chicken"
                        >
                          Custom
                        </button>
                      )}
                      <span className="w-5 h-5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Ticket / Cart */}
        <div className="col-span-4 bg-white border-l border-neutral-200 flex flex-col h-full overflow-hidden text-neutral-900">
          {/* Top Order Type Switcher */}
          <div className="p-3 border-b border-neutral-200 bg-neutral-50/80 space-y-2.5">
            <div className="grid grid-cols-2 gap-1.5 bg-neutral-200/70 p-1 rounded-xl border border-neutral-300">
              <button
                onClick={() => {
                  setOrderType('dine-in');
                  if (!selectedTable) {
                    setIsTableModalOpen(true);
                  }
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  orderType === 'dine-in'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-300/50'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dine-in</span>
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  orderType === 'takeaway'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-300/50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Takeaway</span>
              </button>
            </div>

            {/* Table Selector for Dine-in */}
            {orderType === 'dine-in' ? (
              <div className="pt-0.5">
                {selectedTable ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <div>
                        <span className="font-bold text-neutral-900 text-xs">
                          Table {selectedTable}
                        </span>
                        <span className="text-neutral-500 text-[11px] ml-1.5 font-medium">
                          ({tables.find((t) => t.id === selectedTable)?.capacity || 4} Seater • {tables.find((t) => t.id === selectedTable)?.status || 'available'})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsTableModalOpen(true)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 px-2 py-1 rounded-md bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      Change Table
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsTableModalOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-xs animate-pulse"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Select Table for Dine-In * (Required)</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-neutral-500 font-medium pt-0.5 flex items-center gap-1.5 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Direct Counter Pickup • Instant Token</span>
              </div>
            )}
          </div>

          {/* Ticket Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-neutral-100/50">
            {posCart.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <ShoppingBag className="w-8 h-8 mx-auto mb-1 opacity-30" />
                <p className="text-xs font-semibold text-neutral-600">No items in current ticket</p>
                <p className="text-[11px] text-neutral-400">Tap menu items to add to this bill</p>
              </div>
            ) : (
              posCart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-neutral-200/90 bg-white text-xs flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-neutral-900 truncate text-xs">
                      {item.name}
                    </div>
                    {item.customizations.length > 0 && (
                      <div className="text-[10px] text-neutral-500 truncate">
                        {item.customizations.map((c) => c.name).join(', ')}
                      </div>
                    )}
                    <div className="font-mono text-neutral-500 text-[11px] mt-0.5">
                      ₹{item.unitPrice} × {item.quantity} ={' '}
                      <strong className="text-neutral-900 font-bold">
                        ₹{item.unitPrice * item.quantity}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updatePosQty(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-800 font-bold cursor-pointer active:scale-95 transition-colors shadow-2xs"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs w-6 text-center text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updatePosQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-800 font-bold cursor-pointer active:scale-95 transition-colors shadow-2xs"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* POS Customer & Coupon Inputs */}
          <div className="p-3.5 border-t border-neutral-200 bg-neutral-50 space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Customer Mobile
                </label>
                <input
                  type="text"
                  placeholder="+91 Mobile"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-mono font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Quick Coupon Tag */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-neutral-600 font-semibold">Apply Coupon:</span>
              <div className="flex gap-1.5">
                {coupons.filter((c) => c.active).slice(0, 3).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleApplyCoupon(c.code)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      appliedCouponCode === c.code
                        ? 'bg-emerald-600 text-white border border-emerald-600 shadow-xs'
                        : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1 pt-0.5">
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Cash', 'UPI', 'Card'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === m
                        ? 'bg-neutral-900 text-white shadow-sm border border-neutral-900'
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 shadow-2xs'
                    }`}
                  >
                    {m === 'Cash' && <Banknote className={`w-3.5 h-3.5 ${paymentMethod === m ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                    {m === 'UPI' && <Smartphone className={`w-3.5 h-3.5 ${paymentMethod === m ? 'text-indigo-300' : 'text-indigo-600'}`} />}
                    {m === 'Card' && <CreditCard className={`w-3.5 h-3.5 ${paymentMethod === m ? 'text-blue-300' : 'text-blue-600'}`} />}
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-neutral-900">
                  ₹{totals.subtotal.toFixed(0)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCouponCode}):</span>
                  <span className="font-mono">-₹{totals.discount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="font-mono">₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-1.5 border-t border-neutral-200">
                <span>Net Payable:</span>
                <span className="font-mono text-base font-black">
                  ₹{totals.total.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              id="btn-pos-place-order"
              onClick={handlePlaceOrder}
              disabled={posCart.length === 0}
              className="w-full py-3 px-4 rounded-xl font-black text-sm text-white shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>{orderType === 'dine-in' && !selectedTable ? 'Select Table to Place Order' : 'Complete Billing & Send to KDS'}</span>
              <span className="font-mono font-black">₹{totals.total.toFixed(0)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Selection Modal for Counter POS */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="font-heading font-black text-base text-neutral-900 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-red-600" />
                  <span>Select Table for Dine-In Billing</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select an available dining table to attach to this order ticket
                </p>
              </div>
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-neutral-200 flex items-center justify-center text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tables Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3">
              {tables.map((tbl) => {
                const isSelected = selectedTable === tbl.id;
                const isAvailable = tbl.status === 'available';
                const isOccupied = tbl.status === 'occupied';

                return (
                  <button
                    key={tbl.id}
                    onClick={() => {
                      setSelectedTable(tbl.id);
                      setIsTableModalOpen(false);
                      showToast('Table Assigned', `Table ${tbl.id} selected for dine-in order.`, 'info');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-red-600 bg-red-50 ring-2 ring-red-500/30'
                        : isAvailable
                        ? 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100 hover:border-emerald-400'
                        : isOccupied
                        ? 'border-amber-300 bg-amber-50/60 hover:bg-amber-100'
                        : 'border-purple-300 bg-purple-50/60 hover:bg-purple-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-sm text-neutral-900">
                        Table {tbl.id}
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-500'
                            : isOccupied
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[11px] text-neutral-600 font-medium">
                        {tbl.capacity} Guests
                      </div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isAvailable
                            ? 'text-emerald-700'
                            : isOccupied
                            ? 'text-amber-700'
                            : 'text-purple-700'
                        }`}
                      >
                        {tbl.status}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Occupied
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Reserved
                </span>
              </div>

              <button
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
