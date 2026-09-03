import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, CustomizationOption, AddOnOption, CartItem } from '../../types';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';

interface FoodCustomizerModalContentProps {
  item: MenuItem;
}

const FoodCustomizerModalContent: React.FC<FoodCustomizerModalContentProps> = ({ item }) => {
  const { setCustomizingMenuItem, addToCart, currentArea } = useRestaurant();

  // Selected options state
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationOption[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const toggleCustomization = (option: CustomizationOption) => {
    if (selectedCustomizations.some((c) => c.id === option.id)) {
      setSelectedCustomizations((prev) => prev.filter((c) => c.id !== option.id));
    } else {
      setSelectedCustomizations((prev) => [...prev, option]);
    }
  };

  const toggleAddOn = (addon: AddOnOption) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns((prev) => prev.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns((prev) => [...prev, addon]);
    }
  };

  const customTotal = selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
  const addonTotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = item.price + customTotal + addonTotal;
  const grandTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `cart-${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      unitPrice,
      quantity,
      image: item.image,
      customizations: selectedCustomizations,
      addOns: selectedAddOns,
      specialInstructions: specialInstructions.trim() || undefined,
    };
    addToCart(cartItem);
    setCustomizingMenuItem(null);
  };

  return (
    <div
      id="modal-food-customizer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="modal-food-customizer"
        className="relative w-full max-w-lg bg-[var(--color-surface)] text-[var(--color-text)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--color-card-border)] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-neutral-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-4 h-4 border flex items-center justify-center rounded-xs ${
                  item.isVeg ? 'border-emerald-500' : 'border-red-500'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                ></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                {item.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight leading-tight">
              {item.name}
            </h3>
            <p className="text-sm font-bold text-amber-400">₹{item.price}</p>
          </div>

          <button
            onClick={() => setCustomizingMenuItem(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            {item.description}
          </p>

          {/* Customizations Section */}
          {item.customizationOptions && item.customizationOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                  Customizations
                </h4>
                <span className="text-[10px] text-[var(--color-muted)]">Optional</span>
              </div>
              <div className="space-y-2">
                {item.customizationOptions.map((opt) => {
                  const isSelected = selectedCustomizations.some((c) => c.id === opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleCustomization(opt)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 font-semibold'
                          : 'border-[var(--color-card-border)] hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                              : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm">{opt.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-text)]">
                        +₹{opt.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Section */}
          {item.availableAddOns && item.availableAddOns.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                  Add-ons
                </h4>
                <span className="text-[10px] text-[var(--color-muted)]">Make it a complete feast</span>
              </div>
              <div className="space-y-2">
                {item.availableAddOns.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 font-semibold'
                          : 'border-[var(--color-card-border)] hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                              : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-text)]">
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-1">
              Special Kitchen Note
            </label>
            <input
              type="text"
              placeholder="e.g. Extra napkins, less mayo, cut into halves..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--color-card-border)] focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface)]"
            />
          </div>
        </div>

        {/* Footer: Quantity & Add to Cart */}
        <div className="p-4 border-t border-[var(--color-card-border)] bg-[var(--color-surface)] flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 border border-[var(--color-card-border)] rounded-xl p-1 bg-black/5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text)] hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm min-w-5 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text)] hover:bg-black/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="btn-confirm-add-to-cart"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-between shadow-md hover:opacity-95 transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            <span>{currentArea === 'pos' ? 'Add to POS Ticket' : 'Add to Cart'}</span>
            <span className="font-mono font-black">₹{grandTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FoodCustomizerModal: React.FC = () => {
  const { customizingMenuItem } = useRestaurant();

  if (!customizingMenuItem) return null;

  return <FoodCustomizerModalContent key={customizingMenuItem.id} item={customizingMenuItem} />;
};
