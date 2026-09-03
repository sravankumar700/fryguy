export type ThemeMode = 'fiery' | 'charcoal' | 'orange';

export type DemoArea = 'website' | 'qr-ordering' | 'pos' | 'kitchen' | 'admin';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderSource = 'QR' | 'POS';
export type OrderType = 'dine-in' | 'takeaway';
export type PaymentMethod = 'UPI' | 'Card' | 'Cash';
export type PaymentStatus = 'paid' | 'pending' | 'failed';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  available: boolean;
  customizationOptions?: CustomizationOption[];
  availableAddOns?: AddOnOption[];
}

export interface CartCustomization {
  customizations: CustomizationOption[];
  addOns: AddOnOption[];
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  menuItemId: string;
  name: string;
  price: number; // base price
  unitPrice: number; // base + customizations + add-ons
  quantity: number;
  image: string;
  customizations: CustomizationOption[];
  addOns: AddOnOption[];
  specialInstructions?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  customizations: string[];
  addOns: string[];
  specialInstructions?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: number; // e.g. 1048
  createdAt: string; // ISO or formatted time
  timestamp: number;
  type: OrderType;
  tableNumber?: number; // for dine-in
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number; // GST 5%
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  status: OrderStatus;
  source: OrderSource;
  estimatedPrepTimeMinutes: number;
  invoiceId: string;
}

export interface TableInfo {
  id: number;
  name: string; // e.g. "Table 12"
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  qrActive: boolean;
  qrUrl: string;
  currentOrderId?: string;
}

export type Table = TableInfo;

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  couponUsage: string[];
  favoriteItem: string;
  loyaltyTier?: string;
  lastVisited?: string;
}

export interface Coupon {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  timesUsed?: number;
  perCustomerLimit: number;
  active: boolean;
  description: string;
}

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  itemsIncluded: string[];
  price: number;
  originalPrice: number;
  image: string;
  available: boolean;
}

export interface SimulatedNotification {
  id: string;
  orderNumber: number;
  type: 'whatsapp' | 'sms';
  channel: 'Customer' | 'Kitchen' | 'Owner';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'delivered' | 'sent';
}

export interface KPIStats {
  todaySales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  activeOrders: number;
}
