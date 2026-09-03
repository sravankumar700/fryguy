import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Header } from './components/common/Header';
import { CustomerWebsite } from './components/customer/CustomerWebsite';
import { QRTableOrdering } from './components/customer/QRTableOrdering';
import { CounterPOS } from './components/pos/CounterPOS';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { OwnerDashboard } from './components/admin/OwnerDashboard';
import { FoodCustomizerModal } from './components/common/FoodCustomizerModal';
import { DigitalInvoiceModal } from './components/common/DigitalInvoiceModal';
import { NotificationCenterModal } from './components/common/NotificationCenterModal';
import { ToastContainer } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { currentArea } = useRestaurant();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-body transition-colors duration-200">
      {/* Sleek Global Header */}
      <Header />

      {/* Dynamic Main Stage based on Selected Area */}
      <main className="flex-1 flex flex-col">
        {currentArea === 'website' && <CustomerWebsite />}
        {currentArea === 'qr-ordering' && <QRTableOrdering />}
        {currentArea === 'pos' && <CounterPOS />}
        {currentArea === 'kitchen' && <KitchenDisplay />}
        {currentArea === 'admin' && <OwnerDashboard />}
      </main>

      {/* Global Interactive Modals */}
      <FoodCustomizerModal />
      <DigitalInvoiceModal />
      <NotificationCenterModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RestaurantProvider>
        <AppContent />
      </RestaurantProvider>
    </ThemeProvider>
  );
}
