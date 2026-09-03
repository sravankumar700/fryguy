/**
 * @file mockNotificationService.ts
 * @description Simulated WhatsApp Business API & SMS Gateway dispatches.
 *
 * NOTE FOR PRODUCTION MIGRATION:
 * In a live system, plug into:
 * - WhatsApp Business Cloud API / Gupshup / Twilio
 * - SMS Gateway (MSG91, Kaleyra, Twilio)
 * Server triggers these hooks asynchronously upon order state transitions.
 */

import { SimulatedNotification } from '../types';

export const createNotificationLog = (
  orderNumber: number,
  event: 'placed' | 'preparing' | 'ready' | 'completed' | 'invoice',
  recipientMobile: string,
  tableNumber?: number
): SimulatedNotification[] => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let whatsappMsg = '';
  let smsMsg = '';

  switch (event) {
    case 'placed':
      whatsappMsg = `🍔 *FRYGUY Order Confirmed!*\nYour order #${orderNumber} ${tableNumber ? `at Table ${tableNumber}` : ''} has been placed successfully.\nEstimated prep time: 10–15 mins.\nTrack status live in the app.`;
      smsMsg = `FRYGUY: Order #${orderNumber} confirmed! We are getting your crispy feast ready. View status: https://fryguy.demo/track/${orderNumber}`;
      break;

    case 'preparing':
      whatsappMsg = `🔥 *Chef is on it!*\nYour order #${orderNumber} is now sizzling in the FRYGUY kitchen. Freshest crunch coming right up!`;
      smsMsg = `FRYGUY: Order #${orderNumber} is now being prepared by our kitchen team.`;
      break;

    case 'ready':
      whatsappMsg = `✨ *Order Ready!* 🍗\nOrder #${orderNumber} is hot and ready for ${tableNumber ? `Table ${tableNumber}` : 'pickup at the counter'}! Enjoy your meal!`;
      smsMsg = `FRYGUY: Your order #${orderNumber} is ready! Please collect or enjoy at your table.`;
      break;

    case 'completed':
      whatsappMsg = `❤️ *Thanks for dining with FRYGUY!*\nOrder #${orderNumber} has been served. How was your crunch? Rate us & save on your next bite with coupon FRY50!`;
      smsMsg = `FRYGUY: Thank you for dining with us! Digital invoice is ready for #${orderNumber}.`;
      break;

    case 'invoice':
      whatsappMsg = `📄 *Digital Invoice INV-${orderNumber}*\nThank you for choosing FRYGUY! Download your official digital tax invoice here: https://fryguy.demo/invoice/INV-${orderNumber}`;
      smsMsg = `FRYGUY: Tax Invoice INV-${orderNumber} is available online at https://fryguy.demo/inv/${orderNumber}`;
      break;
  }

  return [
    {
      id: `notif-wa-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      orderNumber,
      type: 'whatsapp',
      channel: 'Customer',
      recipient: recipientMobile || '+91 98765 43210',
      title: `WhatsApp: ${event.toUpperCase()}`,
      message: whatsappMsg,
      timestamp: time,
      status: 'delivered',
    },
    {
      id: `notif-sms-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      orderNumber,
      type: 'sms',
      channel: 'Customer',
      recipient: recipientMobile || '+91 98765 43210',
      title: `SMS Alert: ${event.toUpperCase()}`,
      message: smsMsg,
      timestamp: time,
      status: 'delivered',
    },
  ];
};
