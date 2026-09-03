import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Play,
  ArrowRight,
  X,
} from 'lucide-react';

interface DemoWalkthroughBarProps {
  onClose: () => void;
}

interface StepDef {
  step: number;
  title: string;
  description: string;
  targetArea: 'website' | 'qr-ordering' | 'pos' | 'kitchen' | 'admin';
  actionLabel?: string;
  action?: () => void;
}

export const DemoWalkthroughBar: React.FC<DemoWalkthroughBarProps> = ({ onClose }) => {
  const {
    demoStep,
    setDemoStep,
    setCurrentArea,
    setActiveTableNumber,
    menu,
    addToCart,
    applyCoupon,
    setCustomerMobile,
    orders,
    setActiveOrder,
    setInvoiceModalOrder,
    setIsNotificationCenterOpen,
    updateOrderStatus,
    placeOrder,
  } = useRestaurant();

  const handleStepJump = (s: number) => {
    setDemoStep(s);
    executeStepContext(s);
  };

  const executeStepContext = (s: number) => {
    switch (s) {
      case 1:
        setCurrentArea('website');
        break;
      case 2:
      case 3:
      case 4:
        setCurrentArea('qr-ordering');
        setActiveTableNumber(12);
        break;
      case 5:
        // Add Says Cheese with Extra Cheese + Loaded Fries + Coke
        setCurrentArea('qr-ordering');
        setActiveTableNumber(12);
        break;
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        setCurrentArea('qr-ordering');
        setActiveTableNumber(12);
        break;
      case 14:
      case 15:
      case 16:
      case 17:
        setCurrentArea('kitchen');
        break;
      case 18:
        setCurrentArea('admin');
        break;
      case 19:
        // Open Invoice
        {
          const order1048 = orders.find((o) => o.orderNumber === 1048) || orders[0];
          if (order1048) setInvoiceModalOrder(order1048);
        }
        break;
      case 20:
        // Open Notification center
        setIsNotificationCenterOpen(true);
        break;
      case 21:
        // POS Demo
        setCurrentArea('pos');
        break;
      default:
        break;
    }
  };

  const steps: StepDef[] = [
    {
      step: 1,
      title: 'Customer Website',
      description: 'Showcase the public FRYGUY QSR storefront with appetizing food photography and branding.',
      targetArea: 'website',
    },
    {
      step: 2,
      title: 'Click "Order Now"',
      description: 'Customer initiates digital ordering.',
      targetArea: 'qr-ordering',
    },
    {
      step: 3,
      title: 'Table 12 Identified',
      description: 'Simulate customer scanning the QR code at Table 12.',
      targetArea: 'qr-ordering',
      actionLabel: 'Set Table 12',
      action: () => {
        setActiveTableNumber(12);
        setCurrentArea('qr-ordering');
      },
    },
    {
      step: 4,
      title: 'Browse Menu',
      description: 'Filter categories: Burgers, Fried Chicken, Fries, Combos, Shakes.',
      targetArea: 'qr-ordering',
    },
    {
      step: 5,
      title: 'Add Items & Customization',
      description: 'Add "Says Cheese" with +Extra Cheese, plus Loaded Fries and Coke.',
      targetArea: 'qr-ordering',
      actionLabel: '1-Click Quick Add',
      action: () => {
        const saysCheese = menu.find((m) => m.name === 'Says Cheese') || menu[1];
        const loadedFries = menu.find((m) => m.name === 'Loaded Fries') || menu[12];
        const coke = menu.find((m) => m.name === 'Classic Coke') || menu[17];

        if (saysCheese) {
          addToCart({
            id: `cart-sc-${Date.now()}`,
            menuItemId: saysCheese.id,
            name: saysCheese.name,
            price: saysCheese.price,
            unitPrice: saysCheese.price + 20, // + cheese
            quantity: 1,
            image: saysCheese.image,
            customizations: [{ id: 'c-cheese', name: 'Extra Melted Cheese', price: 20 }],
            addOns: [],
          });
        }
        if (loadedFries) {
          addToCart({
            id: `cart-lf-${Date.now()}`,
            menuItemId: loadedFries.id,
            name: loadedFries.name,
            price: loadedFries.price,
            unitPrice: loadedFries.price,
            quantity: 1,
            image: loadedFries.image,
            customizations: [],
            addOns: [],
          });
        }
        if (coke) {
          addToCart({
            id: `cart-ck-${Date.now()}`,
            menuItemId: coke.id,
            name: coke.name,
            price: coke.price,
            unitPrice: coke.price,
            quantity: 1,
            image: coke.image,
            customizations: [],
            addOns: [],
          });
        }
      },
    },
    {
      step: 6,
      title: 'Open Cart & Review',
      description: 'View customized items, subtotal, and pricing breakdown.',
      targetArea: 'qr-ordering',
    },
    {
      step: 7,
      title: 'Apply Coupon FRY50',
      description: 'Redeem Flat ₹50 off discount coupon.',
      targetArea: 'qr-ordering',
      actionLabel: 'Apply FRY50',
      action: () => {
        applyCoupon('FRY50');
      },
    },
    {
      step: 8,
      title: 'Enter Mobile Number',
      description: 'Provide customer identifier (+91 98450 12890) for invoice & WhatsApp tracking.',
      targetArea: 'qr-ordering',
      actionLabel: 'Set Demo Mobile',
      action: () => setCustomerMobile('+91 98450 12890'),
    },
    {
      step: 9,
      title: 'Proceed to Payment',
      description: 'Select UPI as the primary frictionless payment channel.',
      targetArea: 'qr-ordering',
    },
    {
      step: 10,
      title: 'Simulate UPI Payment',
      description: 'Click Pay to trigger realistic simulated bank processing delay.',
      targetArea: 'qr-ordering',
    },
    {
      step: 11,
      title: 'Payment Success',
      description: 'Display DEMO_TXN_1048 with instant digital receipt generation.',
      targetArea: 'qr-ordering',
    },
    {
      step: 12,
      title: 'Order #1048 Created',
      description: 'View order confirmation, Table 12 banner, and live preparation timeline.',
      targetArea: 'qr-ordering',
    },
    {
      step: 13,
      title: 'Open Kitchen KDS',
      description: 'Notice Order #1048 immediately appears under "NEW" without page reload.',
      targetArea: 'kitchen',
      actionLabel: 'Go to KDS',
      action: () => setCurrentArea('kitchen'),
    },
    {
      step: 14,
      title: 'Kitchen: Start Preparing',
      description: 'Chef clicks "Start Preparing" -> Order moves to PREPARING column.',
      targetArea: 'kitchen',
      actionLabel: 'Mark Preparing',
      action: () => {
        const o = orders.find((ord) => ord.status === 'new') || orders[0];
        if (o) updateOrderStatus(o.id, 'preparing');
      },
    },
    {
      step: 15,
      title: 'Kitchen: Mark Ready',
      description: 'Order moves to READY column -> WhatsApp notification auto-dispatched.',
      targetArea: 'kitchen',
      actionLabel: 'Mark Ready',
      action: () => {
        const o = orders.find((ord) => ord.status === 'preparing') || orders[0];
        if (o) updateOrderStatus(o.id, 'ready');
      },
    },
    {
      step: 16,
      title: 'Kitchen: Mark Completed',
      description: 'Order completes -> Table freed, Digital invoice finalized.',
      targetArea: 'kitchen',
      actionLabel: 'Mark Completed',
      action: () => {
        const o = orders.find((ord) => ord.status === 'ready') || orders[0];
        if (o) updateOrderStatus(o.id, 'completed');
      },
    },
    {
      step: 17,
      title: 'Owner Dashboard: Live KPIs',
      description: 'Inspect live sales update, order count increment, and category analytics.',
      targetArea: 'admin',
      actionLabel: 'Go to Owner Dashboard',
      action: () => setCurrentArea('admin'),
    },
    {
      step: 18,
      title: 'View Digital Tax Invoice',
      description: 'Open official FRYGUY itemized invoice with QR verification.',
      targetArea: 'admin',
      actionLabel: 'View Invoice',
      action: () => {
        const o = orders.find((ord) => ord.orderNumber === 1048) || orders[0];
        if (o) setInvoiceModalOrder(o);
      },
    },
    {
      step: 19,
      title: 'WhatsApp & SMS Hub',
      description: 'Inspect simulated message dispatches received by the customer.',
      targetArea: 'admin',
      actionLabel: 'Open Message Log',
      action: () => setIsNotificationCenterOpen(true),
    },
    {
      step: 20,
      title: 'Counter POS Demo: Takeaway',
      description: 'Create Order #1049 via POS to prove both QR and POS feed the exact same Kitchen & Owner data.',
      targetArea: 'pos',
      actionLabel: 'Open Counter POS',
      action: () => setCurrentArea('pos'),
    },
  ];

  const currentStepObj = steps[demoStep - 1] || steps[0];

  return (
    <div
      id="demo-walkthrough-assistant"
      className="bg-neutral-900 text-neutral-100 border-b border-neutral-800 px-3 py-2 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Left: Step Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP {currentStepObj.step} / {steps.length}</span>
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>{currentStepObj.title}</span>
              <span className="text-[10px] text-neutral-400 font-normal">
                ({currentStepObj.targetArea.toUpperCase()})
              </span>
            </h4>
            <p className="text-[11px] text-neutral-300 line-clamp-1">
              {currentStepObj.description}
            </p>
          </div>
        </div>

        {/* Right: Actions & Stepper Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          {currentStepObj.action && (
            <button
              id="btn-walkthrough-action"
              onClick={currentStepObj.action}
              className="flex items-center gap-1 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3 h-3 fill-neutral-950" />
              <span>{currentStepObj.actionLabel || 'Execute Step'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-neutral-800 p-0.5 rounded border border-neutral-700">
            <button
              id="btn-walkthrough-prev"
              disabled={demoStep <= 1}
              onClick={() => handleStepJump(demoStep - 1)}
              className="p-1 rounded hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-neutral-300 px-1.5">
              {demoStep}
            </span>
            <button
              id="btn-walkthrough-next"
              disabled={demoStep >= steps.length}
              onClick={() => handleStepJump(demoStep + 1)}
              className="p-1 rounded hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            id="btn-close-walkthrough"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
