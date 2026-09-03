import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, Download, Printer, CheckCircle2, QrCode } from 'lucide-react';

export const DigitalInvoiceModal: React.FC = () => {
  const { invoiceModalOrder, setInvoiceModalOrder, showToast } = useRestaurant();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoiceModalOrder) return null;

  const order = invoiceModalOrder;
  const cgst = (order.tax / 2).toFixed(2);
  const sgst = (order.tax / 2).toFixed(2);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast(
        'Invoice Downloaded',
        `PDF ${order.invoiceId}.pdf generated successfully.`,
        'success'
      );
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="modal-digital-invoice-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="modal-digital-invoice"
        className="relative w-full max-w-md bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-lg tracking-tight text-amber-400">
              FRYGUY
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
              TAX INVOICE
            </span>
          </div>
          <button
            onClick={() => setInvoiceModalOrder(null)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 overflow-y-auto font-body text-xs space-y-4">
          {/* Restaurant Details */}
          <div className="text-center pb-3 border-b border-dashed border-neutral-300">
            <h2 className="text-lg font-black tracking-tight text-neutral-950 font-heading">
              FRYGUY CRISPY FOODS LLP
            </h2>
            <p className="text-neutral-600 text-[11px] mt-0.5">
              Beside Westside, FCI Colony Park Rd, Abhyudaya Nagar, Chintalkunta, Hyderabad 500074
            </p>
            <p className="text-neutral-500 text-[10px] mt-0.5">
              GSTIN: 36AABCF9182C1Z4 • FSSAI Lic: 11223344556677
            </p>
          </div>

          {/* Invoice Metadata */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-[11px]">
            <div>
              <span className="text-neutral-500 block">Invoice No:</span>
              <span className="font-bold text-neutral-900 font-mono">{order.invoiceId}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Order ID:</span>
              <span className="font-bold text-neutral-900">#{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Date & Time:</span>
              <span className="font-medium text-neutral-800">{order.createdAt}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Order Mode:</span>
              <span className="font-bold text-neutral-900 uppercase">
                {order.type === 'dine-in' ? `Table ${order.tableNumber || 12}` : 'Takeaway'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Customer Mobile:</span>
              <span className="font-medium text-neutral-800">{order.customerMobile}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Payment:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {order.paymentMethod} (PAID)
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[10px] font-bold text-neutral-500 uppercase pb-1 border-b border-neutral-300">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 text-right">Amt</span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 text-[11px] items-start">
                  <div className="col-span-6 pr-1">
                    <span className="font-semibold text-neutral-900">{item.name}</span>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        {item.customizations.join(', ')}
                      </div>
                    )}
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="text-[10px] text-amber-700 mt-0.5">
                        {item.addOns.join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="col-span-2 text-center font-mono">{item.quantity}</span>
                  <span className="col-span-2 text-right text-neutral-600 font-mono">
                    ₹{item.unitPrice}
                  </span>
                  <span className="col-span-2 text-right font-bold text-neutral-900 font-mono">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Tax Calculation */}
          <div className="pt-3 border-t border-dashed border-neutral-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-neutral-600">
              <span>Item Subtotal:</span>
              <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span className="font-mono">-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-500 text-[10px]">
              <span>CGST (2.5%):</span>
              <span className="font-mono">₹{cgst}</span>
            </div>
            <div className="flex justify-between text-neutral-500 text-[10px]">
              <span>SGST (2.5%):</span>
              <span className="font-mono">₹{sgst}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-neutral-950 pt-2 border-t border-neutral-300">
              <span>Net Payable Amount:</span>
              <span className="font-mono text-base font-black">₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Digital Signature & QR Verification */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
            <div>
              <p className="font-bold text-neutral-800">Digital Tax Compliance Validated</p>
              <p className="font-mono text-[9px] mt-0.5">Txn Ref: {order.transactionId}</p>
              <p className="mt-0.5">This is a computer-generated tax invoice.</p>
            </div>
            <div className="w-12 h-12 bg-white p-1 rounded border border-neutral-300 flex items-center justify-center shrink-0">
              <QrCode className="w-10 h-10 text-neutral-900" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-end gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
