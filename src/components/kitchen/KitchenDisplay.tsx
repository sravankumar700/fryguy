import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, OrderStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Flame,
  AlertCircle,
  Play,
  Check,
  RotateCcw,
  Sparkles,
  Filter,
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useRestaurant();
  const [filterType, setFilterType] = useState<'all' | 'dine-in' | 'takeaway'>('all');

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filterType === 'all') return true;
    return o.type === filterType;
  });

  const newOrders = filteredOrders.filter((o) => o.status === 'new');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'preparing');
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready');
  const completedOrders = filteredOrders.filter((o) => o.status === 'completed');

  const renderOrderCard = (order: Order) => {
    const isDineIn = order.type === 'dine-in';
    return (
      <div
        key={order.id}
        id={`kds-card-${order.orderNumber}`}
        className="bg-neutral-900 text-white rounded-2xl border border-neutral-700 shadow-md p-4 space-y-3 transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg text-white">
                #{order.orderNumber}
              </span>
              <span
                className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                  isDineIn
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                }`}
              >
                {isDineIn ? `Table ${order.tableNumber || 12}` : 'Takeaway'}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 px-1 py-0.5 rounded bg-neutral-800">
                {order.source}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 block mt-0.5">
              Guest: {order.customerName || 'Walk-in'}
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Clock className="w-3 h-3" />
              <span>{order.createdAt}</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-2 text-xs">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/60"
            >
              <div className="flex items-start justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs shrink-0">
                    {item.quantity}
                  </span>
                  <span>{item.name}</span>
                </span>
              </div>

              {/* Customizations */}
              {item.customizations && item.customizations.length > 0 && (
                <div className="text-[11px] text-amber-300 pl-6 mt-1 font-medium">
                  + {item.customizations.join(', ')}
                </div>
              )}

              {/* Add-ons */}
              {item.addOns && item.addOns.length > 0 && (
                <div className="text-[11px] text-neutral-300 pl-6 mt-0.5">
                  + {item.addOns.join(', ')}
                </div>
              )}

              {/* Special instructions */}
              {item.specialInstructions && (
                <div className="text-[10px] text-rose-300 pl-6 mt-1 italic font-mono">
                  Note: "{item.specialInstructions}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons based on status */}
        <div className="pt-2 border-t border-neutral-800">
          {order.status === 'new' && (
            <button
              id={`btn-kds-prep-${order.orderNumber}`}
              onClick={() => updateOrderStatus(order.id, 'preparing')}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-neutral-950" />
              <span>Start Preparing</span>
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              id={`btn-kds-ready-${order.orderNumber}`}
              onClick={() => updateOrderStatus(order.id, 'ready')}
              className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Mark Ready</span>
            </button>
          )}

          {order.status === 'ready' && (
            <button
              id={`btn-kds-complete-${order.orderNumber}`}
              onClick={() => updateOrderStatus(order.id, 'completed')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Completed</span>
            </button>
          )}

          {order.status === 'completed' && (
            <div className="text-center text-[11px] text-neutral-400 py-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completed & Served</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="kitchen-display-system"
      className="min-h-[calc(100vh-68px)] bg-neutral-950 text-neutral-100 flex flex-col font-body p-4 sm:p-6"
    >
      {/* KDS Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black font-heading tracking-tight text-white flex items-center gap-2">
              <span>Kitchen Display System (KDS)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-neutral-400">
              Real-time kitchen order tickets • Connected with QR & POS
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilterType('dine-in')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'dine-in'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Dine-in
            </button>
            <button
              onClick={() => setFilterType('takeaway')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'takeaway'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Takeaway
            </button>
          </div>
        </div>
      </div>

      {/* 4 Columns: NEW, PREPARING, READY, COMPLETED */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6 flex-1 items-start">
        {/* 1. NEW ORDERS */}
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-rose-400">
                NEW ORDERS
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
              {newOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {newOrders.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs">
                No new incoming tickets.
              </div>
            ) : (
              newOrders.map((o) => renderOrderCard(o))
            )}
          </div>
        </div>

        {/* 2. PREPARING */}
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-amber-400">
                PREPARING
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs">
                No tickets currently frying.
              </div>
            ) : (
              preparingOrders.map((o) => renderOrderCard(o))
            )}
          </div>
        </div>

        {/* 3. READY */}
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-blue-400">
                READY FOR PICKUP
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs">
                No orders waiting for pickup.
              </div>
            ) : (
              readyOrders.map((o) => renderOrderCard(o))
            )}
          </div>
        </div>

        {/* 4. COMPLETED */}
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-emerald-400">
                COMPLETED
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {completedOrders.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs">
                No completed orders yet.
              </div>
            ) : (
              completedOrders.slice(0, 10).map((o) => renderOrderCard(o))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
