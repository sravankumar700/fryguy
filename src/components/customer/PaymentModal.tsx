import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { PaymentMethod } from '../../types';
import {
  X,
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { processSimulatedPayment } from '../../services/mockPaymentService';

interface PaymentModalProps {
  amount: number;
  orderNumber: number;
  onPaymentSuccess: (method: PaymentMethod, txnId: string) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  amount,
  orderNumber,
  onPaymentSuccess,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  const handlePay = async () => {
    setIsProcessing(true);
    const result = await processSimulatedPayment(amount, selectedMethod, orderNumber);
    setIsProcessing(false);
    setIsSuccess(true);
    setTxnId(result.transactionId);

    // Wait 1.5 seconds then call success callback
    setTimeout(() => {
      onPaymentSuccess(selectedMethod, result.transactionId);
    }, 1500);
  };

  return (
    <div
      id="modal-payment-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="modal-payment"
        className="relative w-full max-w-md bg-[var(--color-surface)] text-[var(--color-text)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--color-card-border)] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-lg text-amber-400">FRYGUY</span>
            <span className="text-xs text-neutral-400 font-mono">Order #{orderNumber}</span>
          </div>
          {!isProcessing && !isSuccess && (
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Processing State */}
          {isProcessing ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-[var(--color-primary)]" />
              <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                Processing Demo Payment...
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Simulating secure bank & UPI authorization gateway...
              </p>
              <div className="text-[11px] font-mono text-neutral-400 mt-2">
                Order #{orderNumber} • Amount ₹{amount.toFixed(0)}
              </div>
            </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-emerald-600">
                Payment Successful
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Your transaction has been verified. Creating your order now!
              </p>
              <div className="bg-neutral-100 dark:bg-black/20 p-3 rounded-xl border border-[var(--color-card-border)] text-xs font-mono inline-block">
                <span className="text-neutral-500 block text-[10px]">TRANSACTION ID</span>
                <span className="font-bold text-[var(--color-text)] tracking-wider">
                  {txnId}
                </span>
              </div>
            </div>
          ) : (
            /* Payment Selection State */
            <>
              {/* Amount Banner */}
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--color-muted)] block">Amount to Pay</span>
                  <span className="text-2xl font-black font-heading text-[var(--color-text)] font-mono">
                    ₹{amount.toFixed(0)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">SIMULATED GATEWAY</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMethod('UPI')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'UPI'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-xs'
                        : 'border-[var(--color-card-border)] text-[var(--color-muted)] hover:bg-black/5'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs block">UPI (Fast)</span>
                    <span className="text-[9px] uppercase tracking-wider block opacity-75">Recommended</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('Card')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'Card'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-xs'
                        : 'border-[var(--color-card-border)] text-[var(--color-muted)] hover:bg-black/5'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs block">Card</span>
                    <span className="text-[9px] uppercase tracking-wider block opacity-75">Debit/Credit</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('Cash')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'Cash'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-xs'
                        : 'border-[var(--color-card-border)] text-[var(--color-muted)] hover:bg-black/5'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs block">Cash</span>
                    <span className="text-[9px] uppercase tracking-wider block opacity-75">At Counter</span>
                  </button>
                </div>
              </div>

              {/* UPI Sub-Options */}
              {selectedMethod === 'UPI' && (
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)] space-y-2">
                  <span className="text-[11px] font-bold text-[var(--color-text)] block">
                    Choose UPI App:
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <button
                      onClick={() => setSelectedUpiApp('gpay')}
                      className={`p-2 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        selectedUpiApp === 'gpay'
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs'
                          : 'border-transparent text-[var(--color-muted)]'
                      }`}
                    >
                      Google Pay
                    </button>
                    <button
                      onClick={() => setSelectedUpiApp('phonepe')}
                      className={`p-2 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        selectedUpiApp === 'phonepe'
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs'
                          : 'border-transparent text-[var(--color-muted)]'
                      }`}
                    >
                      PhonePe
                    </button>
                    <button
                      onClick={() => setSelectedUpiApp('paytm')}
                      className={`p-2 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        selectedUpiApp === 'paytm'
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs'
                          : 'border-transparent text-[var(--color-muted)]'
                      }`}
                    >
                      Paytm
                    </button>
                    <button
                      onClick={() => setSelectedUpiApp('qr')}
                      className={`p-2 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        selectedUpiApp === 'qr'
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs'
                          : 'border-transparent text-[var(--color-muted)]'
                      }`}
                    >
                      UPI QR
                    </button>
                  </div>

                  {selectedUpiApp === 'qr' && (
                    <div className="pt-2 text-center flex flex-col items-center">
                      <div className="p-2 bg-white rounded-xl border border-neutral-300 inline-block shadow-sm">
                        <QrCode className="w-24 h-24 text-neutral-900" />
                      </div>
                      <p className="text-[10px] text-[var(--color-muted)] mt-1">
                        Scan with any UPI app to pay ₹{amount.toFixed(0)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'Card' && (
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-card-border)] space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-[var(--color-muted)] block">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4028 (Demo Card)"
                      className="w-full bg-white dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg border border-[var(--color-card-border)] font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[var(--color-muted)] block">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value="12/28"
                        className="w-full bg-white dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg border border-[var(--color-card-border)] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[var(--color-muted)] block">CVV</label>
                      <input
                        type="password"
                        readOnly
                        value="888"
                        className="w-full bg-white dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg border border-[var(--color-card-border)] font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                id="btn-confirm-payment"
                onClick={handlePay}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                }}
              >
                <span>Pay ₹{amount.toFixed(0)}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
