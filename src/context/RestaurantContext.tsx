import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  CartItem,
  Coupon,
  Customer,
  DemoArea,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
  SimulatedNotification,
  TableInfo,
} from '../types';
import { INITIAL_MENU } from '../data/initialMenu';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';
import { INITIAL_COUPONS } from '../data/initialCoupons';
import { INITIAL_TABLES } from '../data/initialTables';
import { createNewOrder } from '../services/mockOrderService';
import { createNotificationLog } from '../services/mockNotificationService';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'alert';
}

interface RestaurantContextType {
  // Navigation
  currentArea: DemoArea;
  setCurrentArea: (area: DemoArea) => void;
  activeTableNumber: number;
  setActiveTableNumber: (tableNum: number) => void;

  // Menu State
  menu: MenuItem[];
  toggleItemAvailability: (id: string) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;

  // Orders State
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  placeOrder: (params: {
    type: OrderType;
    tableNumber?: number;
    customerName: string;
    customerMobile: string;
    items: OrderItem[];
    couponCode?: string;
    discount: number;
    paymentMethod: PaymentMethod;
    source: 'QR' | 'POS';
  }) => Order;

  // Cart State (Customer QR / Web)
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartDiscount: number;
  cartTax: number;
  cartTotal: number;

  // POS Cart State (Counter POS)
  posCart: CartItem[];
  addToPosCart: (item: CartItem) => void;
  updatePosCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromPosCart: (cartItemId: string) => void;
  clearPosCart: () => void;

  // Customer Data
  customers: Customer[];
  customerMobile: string;
  setCustomerMobile: (mobile: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;

  // Tables & QR
  tables: TableInfo[];
  toggleTableStatus: (tableId: number, status: 'available' | 'occupied' | 'reserved') => void;
  toggleTableQR: (tableId: number) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponActive: (code: string) => void;

  // Notifications
  notifications: SimulatedNotification[];
  addNotification: (notif: SimulatedNotification) => void;

  // Modals & Popups
  invoiceModalOrder: Order | null;
  setInvoiceModalOrder: (order: Order | null) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  customizingMenuItem: MenuItem | null;
  setCustomizingMenuItem: (item: MenuItem | null) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'alert') => void;
  dismissToast: (id: string) => void;

  // Auth Simulation
  isOwnerLoggedIn: boolean;
  setIsOwnerLoggedIn: (val: boolean) => void;
  isKitchenLoggedIn: boolean;
  setIsKitchenLoggedIn: (val: boolean) => void;

  // Demo step walk-through helper
  demoStep: number;
  setDemoStep: (step: number) => void;
  resetDemoData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentArea, setCurrentArea] = useState<DemoArea>('website');
  const [activeTableNumber, setActiveTableNumber] = useState<number>(12); // Default to Table 12 per spec

  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [tables, setTables] = useState<TableInfo[]>(INITIAL_TABLES);
  const [notifications, setNotifications] = useState<SimulatedNotification[]>([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [customerMobile, setCustomerMobile] = useState<string>('+91 98450 12890');
  const [customerName, setCustomerName] = useState<string>('Rohan Mehta');

  // Modals
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [customizingMenuItem, setCustomizingMenuItem] = useState<MenuItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Auth
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(true); // Pre-authenticated for convenient demoing
  const [isKitchenLoggedIn, setIsKitchenLoggedIn] = useState<boolean>(true);

  // Demo Walkthrough Step
  const [demoStep, setDemoStep] = useState<number>(1);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'alert' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(appliedCoupon.discountValue, cartSubtotal);
    } else {
      const disc = (cartSubtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    }
  }, [cartSubtotal, appliedCoupon]);

  const cartTax = useMemo(() => {
    const taxable = Math.max(0, cartSubtotal - cartDiscount);
    return Math.round(taxable * 0.05 * 100) / 100; // 5% GST
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    return Math.round((Math.max(0, cartSubtotal - cartDiscount) + cartTax) * 100) / 100;
  }, [cartSubtotal, cartDiscount, cartTax]);

  const addToCart = (item: CartItem) => {
    if (currentArea === 'pos') {
      addToPosCart(item);
      return;
    }
    setCart((prev) => {
      // Check if identical item with same customizations exists
      const existingIdx = prev.findIndex(
        (p) =>
          p.menuItemId === item.menuItemId &&
          JSON.stringify(p.customizations || []) === JSON.stringify(item.customizations || []) &&
          JSON.stringify(p.addOns || []) === JSON.stringify(item.addOns || [])
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // POS Cart functions
  const addToPosCart = (item: CartItem) => {
    setPosCart((prev) => {
      const existingIdx = prev.findIndex(
        (p) =>
          p.menuItemId === item.menuItemId &&
          JSON.stringify(p.customizations || []) === JSON.stringify(item.customizations || []) &&
          JSON.stringify(p.addOns || []) === JSON.stringify(item.addOns || [])
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const updatePosCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromPosCart(cartItemId);
      return;
    }
    setPosCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromPosCart = (cartItemId: string) => {
    setPosCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearPosCart = () => {
    setPosCart([]);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (!found.active) {
      return { success: false, message: 'This coupon is currently expired or inactive.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Add items worth ₹${found.minOrder - cartSubtotal} more to apply ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast('Coupon Applied!', `Saved with ${found.code}!`, 'success');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Menu Handlers
  const toggleItemAvailability = (id: string) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
    const itm = menu.find((m) => m.id === id);
    if (itm) {
      showToast(
        itm.available ? 'Item Disabled' : 'Item Activated',
        `${itm.name} is now ${itm.available ? 'currently unavailable' : 'available for ordering'}.`,
        'info'
      );
    }
  };

  const updateMenuItem = (updated: MenuItem) => {
    setMenu((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    showToast('Menu Updated', `${updated.name} updated successfully.`, 'success');
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenu((prev) => [newItem, ...prev]);
    showToast('Menu Item Added', `${newItem.name} added to menu!`, 'success');
  };

  const deleteMenuItem = (id: string) => {
    const itm = menu.find((m) => m.id === id);
    setMenu((prev) => prev.filter((item) => item.id !== id));
    showToast('Item Removed', `${itm?.name || 'Menu item'} deleted from catalog.`, 'info');
  };

  // Order Placement
  const placeOrder = (params: {
    type: OrderType;
    tableNumber?: number;
    customerName: string;
    customerMobile: string;
    items: OrderItem[];
    couponCode?: string;
    discount: number;
    paymentMethod: PaymentMethod;
    source: 'QR' | 'POS';
  }): Order => {
    // Generate next sequential order number
    const maxOrderNum = orders.reduce((max, o) => Math.max(max, o.orderNumber), 1047);
    const nextOrderNumber = maxOrderNum + 1; // 1048 for first demo order, 1049 for next

    const newOrder = createNewOrder({
      orderNumber: nextOrderNumber,
      type: params.type,
      tableNumber: params.tableNumber,
      customerName: params.customerName,
      customerMobile: params.customerMobile,
      items: params.items,
      couponCode: params.couponCode,
      discount: params.discount,
      paymentMethod: params.paymentMethod,
      source: params.source,
    });

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Update table status if dine-in
    if (params.tableNumber) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === params.tableNumber
            ? { ...t, status: 'occupied', currentOrderId: newOrder.id }
            : t
        )
      );
    }

    // Add customer or update spend
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.mobile === params.customerMobile);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          totalOrders: updated[idx].totalOrders + 1,
          totalSpent: updated[idx].totalSpent + newOrder.total,
          lastOrderDate: 'Just now',
          couponUsage: params.couponCode
            ? [...updated[idx].couponUsage, params.couponCode]
            : updated[idx].couponUsage,
        };
        return updated;
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: params.customerName || (params.tableNumber ? `Table ${params.tableNumber} Guest` : 'Walk-in Guest'),
          mobile: params.customerMobile,
          totalOrders: 1,
          totalSpent: newOrder.total,
          lastOrderDate: 'Just now',
          couponUsage: params.couponCode ? [params.couponCode] : [],
          favoriteItem: params.items[0]?.name || 'Says Cheese',
        };
        return [newCust, ...prev];
      }
    });

    // Create notifications for Placed event
    const notifs = createNotificationLog(
      newOrder.orderNumber,
      'placed',
      newOrder.customerMobile,
      newOrder.tableNumber
    );
    setNotifications((prev) => [...notifs, ...prev]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D62828', '#F77F00', '#F9A825', '#111111'],
      });
    } catch {
      // ignore
    }

    showToast(
      `Order #${newOrder.orderNumber} Created`,
      `${params.source === 'QR' ? `Table ${params.tableNumber}` : 'POS Takeaway'} • ₹${newOrder.total.toFixed(0)} Paid via ${params.paymentMethod}`,
      'success'
    );

    return newOrder;
  };

  // Order Status Updates (Kitchen & Admin)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Dispatch simulated notification
    if (newStatus === 'preparing' || newStatus === 'ready' || newStatus === 'completed') {
      const notifs = createNotificationLog(
        targetOrder.orderNumber,
        newStatus,
        targetOrder.customerMobile,
        targetOrder.tableNumber
      );
      setNotifications((prev) => [...notifs, ...prev]);

      if (newStatus === 'completed') {
        const invNotifs = createNotificationLog(
          targetOrder.orderNumber,
          'invoice',
          targetOrder.customerMobile,
          targetOrder.tableNumber
        );
        setNotifications((prev) => [...invNotifs, ...prev]);

        // Release table if dine-in
        if (targetOrder.tableNumber) {
          setTables((prev) =>
            prev.map((t) =>
              t.id === targetOrder.tableNumber
                ? { ...t, status: 'available', currentOrderId: undefined }
                : t
            )
          );
        }
      }
    }

    const statusLabels: Record<OrderStatus, string> = {
      new: 'New Order',
      preparing: 'Now Preparing in Kitchen',
      ready: 'Marked Ready for Table/Pickup',
      completed: 'Order Completed & Served',
      cancelled: 'Order Cancelled',
    };

    showToast(
      `Order #${targetOrder.orderNumber} Updated`,
      statusLabels[newStatus],
      newStatus === 'completed' ? 'success' : 'info'
    );
  };

  // Table status toggle
  const toggleTableStatus = (tableId: number, status: 'available' | 'occupied' | 'reserved') => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  };

  const toggleTableQR = (tableId: number) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, qrActive: !t.qrActive } : t))
    );
    showToast('QR Status Updated', `Table ${tableId} QR code toggled.`, 'info');
  };

  // Coupon management
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast('Coupon Added', `Coupon ${coupon.code} created!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase()));
    showToast('Coupon Deleted', `Coupon ${code} removed.`, 'info');
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const addNotification = (notif: SimulatedNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  // Reset demo state back to pristine clean state
  const resetDemoData = () => {
    setMenu(INITIAL_MENU);
    setOrders(INITIAL_ORDERS);
    setActiveOrder(null);
    setCustomers(INITIAL_CUSTOMERS);
    setCoupons(INITIAL_COUPONS);
    setTables(INITIAL_TABLES);
    setNotifications([]);
    setCart([]);
    setPosCart([]);
    setAppliedCoupon(null);
    setDemoStep(1);
    showToast('Demo State Reset', 'Fresh starting data loaded for presentation.', 'info');
  };

  return (
    <RestaurantContext.Provider
      value={{
        currentArea,
        setCurrentArea,
        activeTableNumber,
        setActiveTableNumber,
        menu,
        toggleItemAvailability,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        orders,
        activeOrder,
        setActiveOrder,
        updateOrderStatus,
        placeOrder,
        cart,
        addToCart,
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
        posCart,
        addToPosCart,
        updatePosCartQuantity,
        removeFromPosCart,
        clearPosCart,
        customers,
        customerMobile,
        setCustomerMobile,
        customerName,
        setCustomerName,
        tables,
        toggleTableStatus,
        toggleTableQR,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        notifications,
        addNotification,
        invoiceModalOrder,
        setInvoiceModalOrder,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        customizingMenuItem,
        setCustomizingMenuItem,
        toasts,
        showToast,
        dismissToast,
        isOwnerLoggedIn,
        setIsOwnerLoggedIn,
        isKitchenLoggedIn,
        setIsKitchenLoggedIn,
        demoStep,
        setDemoStep,
        resetDemoData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
