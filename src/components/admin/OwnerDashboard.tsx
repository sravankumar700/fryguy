import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Users,
  UtensilsCrossed,
  Tag,
  CreditCard,
  FileText,
  Bell,
  QrCode,
  Layers,
  Settings,
  Plus,
  Eye,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  X,
} from 'lucide-react';
import { Order, MenuItem, Table } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const {
    orders,
    menu,
    tables,
    coupons,
    customers,
    notifications,
    setInvoiceModalOrder,
    setIsNotificationCenterOpen,
    toggleItemAvailability,
    addMenuItem,
    deleteMenuItem,
    addCoupon,
    deleteCoupon,
    showToast,
  } = useRestaurant();
  const { currentTheme, setTheme, themeDetails } = useTheme();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');

  // Modals for admin additions
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState<boolean>(false);

  // New Menu Item form state
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('Burgers');
  const [newItemPrice, setNewItemPrice] = useState<string>('149');
  const [newItemDesc, setNewItemDesc] = useState<string>('');
  const [newItemIsVeg, setNewItemIsVeg] = useState<boolean>(false);
  const [newItemImage, setNewItemImage] = useState<string>('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60');

  // New Coupon form state
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponDesc, setNewCouponDesc] = useState<string>('');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percentage'>('fixed');
  const [newCouponValue, setNewCouponValue] = useState<string>('50');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<string>('249');
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState<string>('100');
  const [newCouponExpiry, setNewCouponExpiry] = useState<string>('2026-12-31');

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      showToast('Name Required', 'Please enter a name for the menu item.', 'warning');
      return;
    }
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Invalid Price', 'Please enter a valid positive price.', 'warning');
      return;
    }

    addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      price: priceNum,
      description: newItemDesc.trim() || `${newItemName} made fresh to order.`,
      image: newItemImage.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
      isVeg: newItemIsVeg,
      available: true,
      customizationOptions: [],
      availableAddOns: [],
    });

    showToast('Menu Item Added', `${newItemName} added to catalogue.`, 'success');
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('149');
    setIsAddItemModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase();
    if (!cleanCode) {
      showToast('Code Required', 'Please enter a coupon code.', 'warning');
      return;
    }
    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      showToast('Code Exists', `Coupon ${cleanCode} already exists.`, 'alert');
      return;
    }
    const val = parseFloat(newCouponValue);
    if (isNaN(val) || val <= 0) {
      showToast('Invalid Value', 'Please enter a valid discount value.', 'warning');
      return;
    }
    const minOrderVal = parseFloat(newCouponMinOrder) || 0;
    const maxDiscVal = newCouponType === 'percentage' && newCouponMaxDiscount ? parseFloat(newCouponMaxDiscount) : undefined;

    addCoupon({
      code: cleanCode,
      description: newCouponDesc.trim() || (newCouponType === 'fixed' ? `Flat ₹${val} OFF on orders above ₹${minOrderVal}` : `${val}% OFF on orders above ₹${minOrderVal}`),
      discountType: newCouponType,
      discountValue: val,
      minOrder: minOrderVal,
      maxDiscount: maxDiscVal,
      expiryDate: newCouponExpiry || '2026-12-31',
      usageLimit: 100,
      usedCount: 0,
      timesUsed: 0,
      perCustomerLimit: 1,
      active: true,
    });

    showToast('Coupon Created', `Promo coupon ${cleanCode} activated.`, 'success');
    setNewCouponCode('');
    setNewCouponDesc('');
    setNewCouponValue('50');
    setIsCreateCouponModalOpen(false);
  };

  // Key KPI Calculations
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready'
  ).length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;

  // Breakdown calculations
  const dineInOrders = orders.filter((o) => o.type === 'dine-in');
  const takeawayOrders = orders.filter((o) => o.type === 'takeaway');
  const upiOrders = orders.filter((o) => o.paymentMethod === 'UPI');
  const cashOrders = orders.filter((o) => o.paymentMethod === 'Cash');
  const cardOrders = orders.filter((o) => o.paymentMethod === 'Card');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: activeOrdersCount },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'addons', label: 'Add-ons & Custom', icon: Layers },
    { id: 'combos', label: 'Combos & Deals', icon: Tag },
    { id: 'tables', label: 'Tables & QR', icon: QrCode },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.length },
    { id: 'reports', label: 'Analytics Reports', icon: TrendingUp },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div
      id="owner-admin-dashboard"
      className="min-h-[calc(100vh-68px)] bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col md:flex-row font-body"
    >
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-card-border)] p-3 md:p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="px-3 py-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-muted)]">
              Store Control Plane
            </span>
            <h3 className="font-heading font-black text-base text-[var(--color-text)]">
              FRYGUY Chintalkunta
            </h3>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-owner-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white text-[var(--color-primary)] font-bold'
                          : 'bg-black/10 text-[var(--color-text)]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Theme Quick Selector in Admin */}
        <div className="pt-4 border-t border-[var(--color-card-border)] mt-4 text-xs">
          <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] block mb-1.5">
            Active Brand Identity
          </span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'fiery', label: 'Fiery' },
              { id: 'charcoal', label: 'Charcoal' },
              { id: 'urban', label: 'Urban' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${
                  currentTheme === t.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'border-[var(--color-card-border)] text-[var(--color-muted)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Admin Content View Area */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full">
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
                  Today's Live Performance
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Consolidated figures from Table QR Ordering & Counter POS systems
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNotificationCenterOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface)] text-xs font-bold hover:bg-black/5 cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Message Log ({notifications.length})</span>
                </button>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-semibold block">
                    Today's Sales
                  </span>
                  <span className="text-2xl font-black font-heading text-[var(--color-text)] font-mono">
                    ₹{totalSales.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                    ↑ 18.4% vs yesterday
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-semibold block">
                    Total Orders
                  </span>
                  <span className="text-2xl font-black font-heading text-[var(--color-text)] font-mono">
                    {totalOrdersCount}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium block mt-1">
                    {dineInOrders.length} Dine-in • {takeawayOrders.length} Takeaway
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-semibold block">
                    Active Kitchen Orders
                  </span>
                  <span className="text-2xl font-black font-heading text-amber-500 font-mono">
                    {activeOrdersCount}
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold block mt-1">
                    Live tickets in KDS
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-semibold block">
                    Avg Order Value (AOV)
                  </span>
                  <span className="text-2xl font-black font-heading text-[var(--color-text)] font-mono">
                    ₹{avgOrderValue}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium block mt-1">
                    Target: ₹350+
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Middle Section: Quick Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Type Breakdown */}
              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Order Mode Breakdown
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Dine-in (Table QR)</span>
                      <span>
                        {dineInOrders.length} ({Math.round((dineInOrders.length / (totalOrdersCount || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{
                          width: `${(dineInOrders.length / (totalOrdersCount || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Takeaway (Counter POS)</span>
                      <span>
                        {takeawayOrders.length} ({Math.round((takeawayOrders.length / (totalOrdersCount || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{
                          width: `${(takeawayOrders.length / (totalOrdersCount || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Payment Channels
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)]">
                    <span className="text-[10px] text-neutral-500 block">UPI</span>
                    <span className="text-lg font-black text-[var(--color-text)] font-mono">
                      {upiOrders.length}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Instant</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)]">
                    <span className="text-[10px] text-neutral-500 block">Cash</span>
                    <span className="text-lg font-black text-[var(--color-text)] font-mono">
                      {cashOrders.length}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium block">Register</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)]">
                    <span className="text-[10px] text-neutral-500 block">Card</span>
                    <span className="text-lg font-black text-[var(--color-text)] font-mono">
                      {cardOrders.length}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium block">POS Swipe</span>
                  </div>
                </div>
              </div>

              {/* Top Selling Items */}
              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Bestsellers Today
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Says Cheese Burger', count: 48, revenue: '₹6,672' },
                    { name: 'Original Crispy Chicken', count: 42, revenue: '₹5,418' },
                    { name: 'Loaded Fries', count: 35, revenue: '₹5,215' },
                  ].map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-[var(--color-text)]">{it.name}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-[var(--color-text)] block">
                          {it.revenue}
                        </span>
                        <span className="text-[10px] text-neutral-400">{it.count} sold</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders Live Table */}
            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-base text-[var(--color-text)]">
                    Recent Orders Stream
                  </h3>
                  <p className="text-xs text-[var(--color-muted)]">
                    Showing latest synchronized transactions across all terminals
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({orders.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[var(--color-card-border)] text-neutral-400 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-card-border)]">
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                        <td className="py-3 px-3 font-mono font-bold text-[var(--color-text)]">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-3 text-[var(--color-muted)]">{order.createdAt}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              order.type === 'dine-in'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {order.type === 'dine-in'
                              ? `Table ${order.tableNumber || 12}`
                              : 'Takeaway'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-[var(--color-text)]">
                          {order.customerMobile}
                        </td>
                        <td className="py-3 px-3 text-[var(--color-muted)]">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="py-3 px-3 font-mono font-black text-[var(--color-text)]">
                          ₹{order.total.toFixed(0)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              order.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'ready'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'preparing'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setInvoiceModalOrder(order)}
                            className="p-1.5 rounded-lg border border-[var(--color-card-border)] hover:bg-black/10 cursor-pointer"
                            title="View Invoice"
                          >
                            <Eye className="w-3.5 h-3.5 text-neutral-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
                  Complete Orders Log
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Total {orders.length} tickets recorded in central store state
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search order #, mobile, item..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface)]"
                />
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[var(--color-card-border)] text-neutral-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3">Source</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items List</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)]">
                  {orders
                    .filter((o) => {
                      const q = orderSearchQuery.toLowerCase();
                      return (
                        o.orderNumber.toString().includes(q) ||
                        o.customerMobile.toLowerCase().includes(q) ||
                        o.items.some((i) => i.name.toLowerCase().includes(q))
                      );
                    })
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                        <td className="py-3 px-3 font-mono font-bold text-[var(--color-text)]">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-3 text-[var(--color-muted)]">{order.createdAt}</td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[11px]">
                            {order.source} ({order.type})
                          </span>
                          {order.tableNumber && (
                            <span className="text-[10px] text-amber-600 block">
                              Table {order.tableNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold block">{order.customerName}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {order.customerMobile}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[var(--color-muted)] max-w-xs">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className="font-bold">{order.paymentMethod}</span>
                          <span className="text-[10px] text-emerald-600 block">PAID</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-black text-sm text-[var(--color-text)]">
                          ₹{order.total.toFixed(0)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              order.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'ready'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'preparing'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setInvoiceModalOrder(order)}
                            className="px-2.5 py-1 rounded-lg border border-[var(--color-card-border)] hover:bg-black/10 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-neutral-600" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MENU ITEMS */}
        {activeTab === 'menu' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
                  Menu Catalogue & Stock Control
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Add new dishes, manage live prices, and toggle instant out-of-stock across QR & POS
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search item..."
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface)]"
                  />
                </div>

                <button
                  id="btn-admin-add-item"
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="shrink-0 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu
                .filter((item) =>
                  item.name.toLowerCase().includes(menuSearchQuery.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          ></span>
                          <h4 className="font-bold text-xs truncate text-[var(--color-text)]">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-[11px] text-[var(--color-muted)] block">
                          {item.category}
                        </span>
                        <span className="font-mono font-black text-sm text-[var(--color-text)]">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          item.available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {item.available ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() => {
                          deleteMenuItem(item.id);
                          showToast('Item Deleted', `${item.name} was removed from the menu.`, 'info');
                        }}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete item from menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADD-ONS & CUSTOMIZATIONS */}
        {activeTab === 'addons' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Customizations & Add-ons
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Extra cheese, chicken patties, signature drizzles, and upsell sides
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Available Customization Upgrades
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Extra Melted Cheese Slice', price: 20 },
                    { name: 'Extra Fried Chicken Patty', price: 50 },
                    { name: 'Spicy Ghost Chili Sauce', price: 15 },
                    { name: 'Caramelized Onions', price: 15 },
                    { name: 'Jalapeño Poppers Dip', price: 25 },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5"
                    >
                      <span className="font-bold">{c.name}</span>
                      <span className="font-mono font-bold text-amber-600">+₹{c.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Cart Add-on Upsells
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Loaded Cheese Fries', price: 79 },
                    { name: 'Classic Coke 330ml', price: 49 },
                    { name: 'Belgian Chocolate Shake', price: 99 },
                    { name: 'Crispy Wings (2 pcs)', price: 89 },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5"
                    >
                      <span className="font-bold">{a.name}</span>
                      <span className="font-mono font-bold text-[var(--color-primary)]">
                        +₹{a.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMBOS */}
        {activeTab === 'combos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Signature Combos & Value Feasts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {menu
                .filter((m) => m.category === 'Combos')
                .map((combo) => (
                  <div
                    key={combo.id}
                    className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs space-y-3"
                  >
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-36 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[var(--color-text)]">{combo.name}</h4>
                      <p className="text-xs text-[var(--color-muted)] mt-1">{combo.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--color-card-border)]">
                      <span className="font-mono font-black text-base text-amber-600">
                        ₹{combo.price}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Active Promo
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 6: TABLES & QR */}
        {activeTab === 'tables' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
                  Dining Room Tables & QR Standees
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  20 floor tables mapped with table-specific ordering URLs
                </p>
              </div>
              <button
                onClick={() => showToast('QR Codes Downloaded', 'All 20 table QR SVG codes exported.', 'success')}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export QR Standees PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border transition-all text-center space-y-2 ${
                    t.status === 'occupied'
                      ? 'bg-amber-50/60 border-amber-300 dark:bg-amber-950/20'
                      : 'bg-[var(--color-surface)] border-[var(--color-card-border)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-sm text-[var(--color-text)]">
                      {t.name}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        t.status === 'occupied' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-neutral-200 inline-block shadow-xs">
                    <QrCode className="w-14 h-14 text-neutral-900 mx-auto" />
                  </div>

                  <div className="text-[10px] font-mono text-[var(--color-muted)]">
                    fryguy.demo/t/{t.id}
                  </div>

                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block ${
                      t.status === 'occupied'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Customer Retention & Loyalty
            </h2>
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[var(--color-card-border)] text-neutral-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Mobile</th>
                    <th className="py-3 px-3">Total Orders</th>
                    <th className="py-3 px-3">Total Spent</th>
                    <th className="py-3 px-3">Tier</th>
                    <th className="py-3 px-3">Last Visited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)]">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="py-3 px-3 font-bold">{c.name}</td>
                      <td className="py-3 px-3 font-mono text-[var(--color-muted)]">{c.mobile}</td>
                      <td className="py-3 px-3 font-mono font-semibold">{c.totalOrders}</td>
                      <td className="py-3 px-3 font-mono font-black text-amber-600">
                        ₹{c.totalSpent}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            (c.loyaltyTier || (c.totalSpent > 4000 ? 'Gold' : c.totalSpent > 2500 ? 'Silver' : 'Bronze')) === 'Gold'
                              ? 'bg-amber-100 text-amber-900'
                              : (c.loyaltyTier || (c.totalSpent > 4000 ? 'Gold' : c.totalSpent > 2500 ? 'Silver' : 'Bronze')) === 'Silver'
                              ? 'bg-neutral-200 text-neutral-900'
                              : 'bg-orange-100 text-orange-900'
                          }`}
                        >
                          {c.loyaltyTier || (c.totalSpent > 4000 ? 'Gold' : c.totalSpent > 2500 ? 'Silver' : 'Bronze')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--color-muted)]">{c.lastVisited || c.lastOrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
                  Active Promo Coupons
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Create discount codes for customer website and counter POS, or delete expired promotions
                </p>
              </div>

              <button
                id="btn-admin-create-coupon"
                onClick={() => setIsCreateCouponModalOpen(true)}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                      {c.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => {
                          deleteCoupon(c.code);
                          showToast('Coupon Deleted', `Coupon ${c.code} deleted successfully.`, 'info');
                        }}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">{c.description}</p>
                  <div className="text-[11px] space-y-1 pt-2 border-t border-[var(--color-card-border)] text-neutral-500 font-mono">
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="font-bold text-[var(--color-text)]">
                        {c.discountType === 'fixed' ? `Flat ₹${c.discountValue}` : `${c.discountValue}% OFF`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Min Order:</span>
                      <span>₹{c.minOrder}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Redemptions:</span>
                      <span>{c.timesUsed ?? c.usedCount} times</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Simulated Payment Gateway Transactions
            </h2>
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[var(--color-card-border)] text-neutral-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Transaction ID</th>
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Gateway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-black/5">
                      <td className="py-3 px-3 font-mono font-bold text-[var(--color-text)]">
                        {o.transactionId}
                      </td>
                      <td className="py-3 px-3 font-mono">#{o.orderNumber}</td>
                      <td className="py-3 px-3 font-semibold">{o.paymentMethod}</td>
                      <td className="py-3 px-3">{o.customerMobile}</td>
                      <td className="py-3 px-3 font-mono font-black text-sm">₹{o.total.toFixed(0)}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Digital Tax Invoices Repository
            </h2>
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-card-border)] shadow-xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[var(--color-card-border)] text-neutral-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Tax (GST)</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-black/5">
                      <td className="py-3 px-3 font-mono font-bold text-[var(--color-text)]">
                        {o.invoiceId}
                      </td>
                      <td className="py-3 px-3 font-mono">#{o.orderNumber}</td>
                      <td className="py-3 px-3 text-[var(--color-muted)]">{o.createdAt}</td>
                      <td className="py-3 px-3">{o.customerMobile}</td>
                      <td className="py-3 px-3 font-mono text-[var(--color-muted)]">
                        ₹{o.tax.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono font-black text-sm">
                        ₹{o.total.toFixed(0)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setInvoiceModalOrder(o)}
                          className="px-3 py-1 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 cursor-pointer"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 11: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
                  Simulated Notification Dispatch Hub
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  WhatsApp Business API and SMS Gateway mock event stream
                </p>
              </div>
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs hover:opacity-90 cursor-pointer"
              >
                Open Full Dialog
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          n.type === 'whatsapp'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {n.type.toUpperCase()}
                      </span>
                      <span className="font-mono font-bold text-xs">To: {n.recipient}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        (Order #{n.orderNumber})
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text)] mt-1 whitespace-pre-line">
                      {n.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                    {n.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: ANALYTICS REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Store Analytics & Growth Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Sales by Hour (Simulated Peak Trends)
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { hour: '12 PM - 2 PM (Lunch Peak)', pct: 85, amt: '₹14,500' },
                    { hour: '2 PM - 5 PM (Snacks & Shakes)', pct: 40, amt: '₹6,200' },
                    { hour: '7 PM - 10 PM (Dinner Rush)', pct: 95, amt: '₹18,900' },
                    { hour: '10 PM - 1 AM (Late Night Crunch)', pct: 60, amt: '₹9,800' },
                  ].map((h, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{h.hour}</span>
                        <span className="font-mono font-bold">{h.amt}</span>
                      </div>
                      <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--color-primary)]"
                          style={{ width: `${h.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Category Revenue Distribution
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { cat: 'Burgers', pct: 42, color: 'bg-amber-500' },
                    { cat: 'Fried Chicken', pct: 28, color: 'bg-red-500' },
                    { cat: 'Sides & Fries', pct: 18, color: 'bg-orange-500' },
                    { cat: 'Beverages & Shakes', pct: 12, color: 'bg-blue-500' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${c.color}`}></span>
                        <span className="font-bold">{c.cat}</span>
                      </div>
                      <span className="font-mono font-black">{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
            <h2 className="text-2xl font-black font-heading tracking-tight text-[var(--color-text)]">
              Store Configuration
            </h2>

            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-card-border)] space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[var(--color-muted)]">
                General Business Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    readOnly
                    value="FRYGUY Chintalkunta (Hyderabad)"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-black/5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    readOnly
                    value="36AABCF9182C1Z4"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-black/5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Tax Configuration</label>
                <input
                  type="text"
                  readOnly
                  value="5% Flat GST (2.5% CGST + 2.5% SGST Restaurant Rate)"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-black/5 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Store Address</label>
                <input
                  type="text"
                  readOnly
                  value="Beside Westside, FCI Colony Park Road, Abhyudaya Nagar, Chintalkunta, L.B. Nagar, Hyderabad, Telangana 500074"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-black/5"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Google Maps Listing</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://maps.app.goo.gl/SGD4e6WWWBYFseff6"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-card-border)] bg-black/5 font-mono text-xs"
                  />
                  <a
                    href="https://maps.app.goo.gl/SGD4e6WWWBYFseff6"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90"
                  >
                    Open Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD NEW MENU ITEM MODAL */}
        {isAddItemModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <h3 className="font-heading font-black text-base text-neutral-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-red-600" />
                    <span>Add New Menu Item</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Expand your catalogue across Customer Website, QR Ordering, and POS
                  </p>
                </div>
                <button
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-200 flex items-center justify-center text-neutral-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="p-4 overflow-y-auto space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crispy Zinger Burger"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Fried Chicken">Fried Chicken</option>
                      <option value="Meals & Combos">Meals & Combos</option>
                      <option value="Loaded Fries">Loaded Fries</option>
                      <option value="Shakes & Beverages">Shakes & Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="149"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold font-mono focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Dietary Classification
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewItemIsVeg(true)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        newItemIsVeg
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span>Vegetarian (Veg)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewItemIsVeg(false)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        !newItemIsVeg
                          ? 'bg-red-50 border-red-500 text-red-800'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                      <span>Non-Vegetarian</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Crispy seasoned fillet with fresh lettuce and creamy signature mayo sauce."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Item Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-red-600 shadow-2xs mb-1.5"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-neutral-400 font-bold">Quick Presets:</span>
                    {[
                      { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60' },
                      { label: 'Chicken', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=60' },
                      { label: 'Fries', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=60' },
                      { label: 'Beverage', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=60' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setNewItemImage(p.url)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsAddItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs cursor-pointer"
                  >
                    Save & Add to Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE NEW COUPON MODAL */}
        {isCreateCouponModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <h3 className="font-heading font-black text-base text-neutral-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Create New Promo Coupon</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Define promotional discount codes applicable at checkout and counter POS
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateCouponModalOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-200 flex items-center justify-center text-neutral-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="p-4 overflow-y-auto space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Coupon Code * (Auto-Capitalized)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRUNCH50"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as 'fixed' | 'percentage')}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
                    >
                      <option value="fixed">Flat Amount (₹)</option>
                      <option value="percentage">Percentage (% OFF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      {newCouponType === 'fixed' ? 'Discount Amount (₹) *' : 'Discount Percent (%) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={newCouponType === 'percentage' ? 100 : undefined}
                      placeholder={newCouponType === 'fixed' ? '50' : '20'}
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Minimum Order (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="249"
                      value={newCouponMinOrder}
                      onChange={(e) => setNewCouponMinOrder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold font-mono focus:outline-none focus:border-emerald-600 shadow-2xs"
                    />
                  </div>

                  {newCouponType === 'percentage' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Max Discount Cap (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="100"
                        value={newCouponMaxDiscount}
                        onChange={(e) => setNewCouponMaxDiscount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold font-mono focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        value={newCouponExpiry}
                        onChange={(e) => setNewCouponExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat ₹50 OFF on all meals above ₹249"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateCouponModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
                  >
                    Create & Activate Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
