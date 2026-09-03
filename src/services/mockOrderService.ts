/**
 * @file mockOrderService.ts
 * @description Mock Order Service simulating restaurant order processing.
 *
 * NOTE FOR PRODUCTION MIGRATION:
 * In a production deployment, replace this mock layer with:
 * - POST /api/orders (create order in PostgreSQL/Firestore)
 * - GET /api/orders (live stream via WebSockets/SSE/Firebase snapshots)
 * - PATCH /api/orders/:id/status (role-checked KDS and POS updates)
 */

import { Order, OrderItem, OrderSource, OrderType, PaymentMethod } from '../types';

export const calculateOrderTotals = (
  items: OrderItem[],
  discountAmount: number = 0
) => {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const discount = Math.min(discountAmount, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  // Standard Indian QSR GST rate: 5% (2.5% CGST + 2.5% SGST)
  const tax = Math.round(taxableAmount * 0.05 * 100) / 100;
  const total = Math.round((taxableAmount + tax) * 100) / 100;

  return { subtotal, discount, tax, total };
};

export const createNewOrder = (params: {
  orderNumber: number;
  type: OrderType;
  tableNumber?: number;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  couponCode?: string;
  discount: number;
  paymentMethod: PaymentMethod;
  source: OrderSource;
  transactionId?: string;
}): Order => {
  const totals = calculateOrderTotals(params.items, params.discount);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    id: `order-${params.orderNumber}`,
    orderNumber: params.orderNumber,
    createdAt: timeStr,
    timestamp: Date.now(),
    type: params.type,
    tableNumber: params.tableNumber,
    customerName: params.customerName || (params.tableNumber ? `Table ${params.tableNumber} Guest` : 'Walk-in Guest'),
    customerMobile: params.customerMobile || '+91 98765 43210',
    items: params.items,
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.total,
    couponCode: params.couponCode,
    paymentMethod: params.paymentMethod,
    paymentStatus: 'paid',
    transactionId: params.transactionId || `DEMO_TXN_${params.orderNumber}`,
    status: 'new',
    source: params.source,
    estimatedPrepTimeMinutes: 12,
    invoiceId: `INV-${params.orderNumber}`,
  };
};
