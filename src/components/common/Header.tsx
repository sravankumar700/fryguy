import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { DemoArea } from '../../types';
import {
  Globe,
  QrCode,
  LayoutGrid,
  ChefHat,
  ShieldCheck,
  Bell,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentArea,
    setCurrentArea,
    notifications,
    setIsNotificationCenterOpen,
    resetDemoData,
    activeTableNumber,
    orders,
    cart,
    setIsCartOpen,
  } = useRestaurant();

  // Calculate live badges
  const pendingKitchenCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing'
  ).length;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const areas: {
    id: DemoArea;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
    showLivePulse?: boolean;
  }[] = [
    {
      id: 'website',
      label: 'Storefront',
      icon: <Globe className="w-3.5 h-3.5" />,
      badgeCount: totalCartCount > 0 ? totalCartCount : undefined,
    },
    {
      id: 'qr-ordering',
      label: `Table ${activeTableNumber} QR`,
      icon: <QrCode className="w-3.5 h-3.5" />,
      showLivePulse: true,
    },
    {
      id: 'pos',
      label: 'POS Register',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
    {
      id: 'kitchen',
      label: 'Kitchen KDS',
      icon: <ChefHat className="w-3.5 h-3.5" />,
      badgeCount: pendingKitchenCount > 0 ? pendingKitchenCount : undefined,
    },
    {
      id: 'admin',
      label: 'Admin Hub',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-neutral-200/80 shadow-xs transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div
          id="brand-logo"
          onClick={() => setCurrentArea('website')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white font-black text-sm tracking-tight flex items-center justify-center shadow-md ring-1 ring-neutral-800 transition-all duration-200 group-hover:scale-105">
            <span className="text-white">FG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg tracking-tight text-neutral-900">
                FRYGUY
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-neutral-100 text-neutral-700 border border-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 hidden sm:block font-medium">
              Chintalkunta, Hyderabad
            </span>
          </div>
        </div>

        {/* Center: Sleek Capsule Navigation */}
        <nav
          id="demo-area-nav"
          className="hidden lg:flex items-center p-1.5 bg-neutral-900 text-neutral-300 rounded-2xl border border-neutral-800 shadow-md backdrop-blur-md gap-1"
        >
          {areas.map((area) => {
            const isActive = currentArea === area.id;
            return (
              <button
                key={area.id}
                id={`nav-area-${area.id}`}
                onClick={() => setCurrentArea(area.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? 'text-red-600' : 'text-neutral-400'
                  }`}
                >
                  {area.icon}
                </span>
                <span>{area.label}</span>

                {/* Real-time notification badge */}
                {area.badgeCount !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-tight ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {area.badgeCount}
                  </span>
                )}

                {/* Live pulse dot */}
                {area.showLivePulse && !area.badgeCount && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Live Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Cart trigger when on website and has items */}
          {currentArea === 'website' && totalCartCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all transform active:scale-95 cursor-pointer"
              title="Open customer order bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{totalCartCount}</span>
            </button>
          )}

          {/* SMS & WhatsApp Notification Trigger */}
          <button
            id="btn-open-notifications"
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Real-time WhatsApp & SMS Order Feed"
          >
            <Bell className="w-4 h-4 text-neutral-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-white bg-red-600 flex items-center justify-center animate-pulse shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Reset Demo Data Pill */}
          <button
            id="btn-reset-demo"
            onClick={resetDemoData}
            title="Reset to fresh demo orders and menu"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-all text-xs font-semibold cursor-pointer shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden xl:inline text-[11px]">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Pill Bar */}
      <div className="flex lg:hidden overflow-x-auto px-3 py-2 gap-1.5 border-t border-neutral-200 bg-neutral-950 scrollbar-none">
        {areas.map((area) => {
          const isActive = currentArea === area.id;
          return (
            <button
              key={area.id}
              onClick={() => setCurrentArea(area.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-neutral-900'
              }`}
            >
              <span className={isActive ? 'text-red-600' : 'text-neutral-400'}>{area.icon}</span>
              <span>{area.label}</span>
              {area.badgeCount !== undefined && (
                <span
                  className={`px-1 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-red-600 text-white' : 'bg-red-950 text-red-300'
                  }`}
                >
                  {area.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
