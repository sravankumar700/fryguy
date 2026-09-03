/**
 * @file mockPaymentService.ts
 * @description Mock payment gateway integration (UPI, Card, Cash).
 *
 * NOTE FOR PRODUCTION MIGRATION:
 * Replace this mock service with:
 * - Razorpay, Cashfree, or Stripe India integration:
 *   - Client opens standard checkout SDK
 *   - Server verifies webhook signature via /api/payments/verify
 *   - Updates order state only after cryptographic HMAC validation.
 */

import { PaymentMethod } from '../types';

export interface PaymentProcessResult {
  success: boolean;
  transactionId: string;
  paymentMethod: PaymentMethod;
  timestamp: string;
  message: string;
}

export const processSimulatedPayment = async (
  amount: number,
  method: PaymentMethod,
  orderNumber: number
): Promise<PaymentProcessResult> => {
  // Simulate network latency of 1200ms
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const txnId = `DEMO_TXN_${orderNumber}`;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    success: true,
    transactionId: txnId,
    paymentMethod: method,
    timestamp: now,
    message: `Payment of ₹${amount.toFixed(2)} completed successfully via ${method}`,
  };
};
