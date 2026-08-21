import React, { createContext, useContext, useState, useMemo } from 'react';
import { CartItem, ProduceListing } from '../types';

interface FarmerCartGroup {
  farmerId: string;
  farmerName: string;
  farmName: string;
  location: string;
  items: CartItem[];
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalQuantityKg: number;
  produceSubtotal: number;
  estimatedFreight: number;
  mandiCessFee: number;
  gstAmount: number;
  grandTotal: number;
  farmerGroups: FarmerCartGroup[];
  addToCart: (produce: ProduceListing, quantityKg: number) => void;
  updateQuantity: (listingId: string, quantityKg: number) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  getItemPriceForQty: (produce: ProduceListing, qty: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([
    // Pre-populate with a demo item for immediate exploration
  ]);

  const getItemPriceForQty = (produce: ProduceListing, qty: number): number => {
    if (!produce.priceTiers || produce.priceTiers.length === 0) {
      return produce.basePricePerUnit;
    }
    // Find matching tier (sorted by minQty descending)
    const sortedTiers = [...produce.priceTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQty) {
        return tier.pricePerUnit;
      }
    }
    return produce.basePricePerUnit;
  };

  const addToCart = (produce: ProduceListing, quantityKg: number) => {
    const qty = Math.max(quantityKg, produce.minOrderQuantity);
    const unitPrice = getItemPriceForQty(produce, qty);

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.listingId === produce.id);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + qty;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          selectedTierPrice: getItemPriceForQty(produce, newQty),
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            listingId: produce.id,
            produce,
            quantity: qty,
            selectedTierPrice: unitPrice,
          },
        ];
      }
    });
  };

  const updateQuantity = (listingId: string, quantityKg: number) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.listingId === listingId);
      if (!item) return prevItems;

      if (quantityKg <= 0) {
        return prevItems.filter(i => i.listingId !== listingId);
      }

      const validQty = Math.max(quantityKg, item.produce.minOrderQuantity);
      const unitPrice = getItemPriceForQty(item.produce, validQty);

      return prevItems.map(i =>
        i.listingId === listingId
          ? { ...i, quantity: validQty, selectedTierPrice: unitPrice }
          : i
      );
    });
  };

  const removeFromCart = (listingId: string) => {
    setItems(prevItems => prevItems.filter(i => i.listingId !== listingId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Group items by farmer
  const farmerGroups = useMemo(() => {
    const map = new Map<string, FarmerCartGroup>();

    items.forEach(item => {
      const fId = item.produce.farmerId;
      if (!map.has(fId)) {
        map.set(fId, {
          farmerId: fId,
          farmerName: item.produce.farmer.name,
          farmName: item.produce.farmer.farmName,
          location: `${item.produce.location.district}, ${item.produce.location.state}`,
          items: [],
          subtotal: 0,
        });
      }
      const group = map.get(fId)!;
      group.items.push(item);
      group.subtotal += item.quantity * item.selectedTierPrice;
    });

    return Array.from(map.values());
  }, [items]);

  const produceSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.selectedTierPrice, 0);
  }, [items]);

  const totalQuantityKg = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const estimatedFreight = useMemo(() => {
    if (totalQuantityKg === 0) return 0;
    // B2B standard rate: ~₹3/kg or min ₹1200 base truck fee
    return Math.max(1200, Math.round(totalQuantityKg * 2.8));
  }, [totalQuantityKg]);

  const mandiCessFee = useMemo(() => {
    if (produceSubtotal === 0) return 0;
    // 1.5% APMC market regulation fee
    return Math.round(produceSubtotal * 0.015);
  }, [produceSubtotal]);

  const gstAmount = 0; // Fresh agricultural produce exempt from GST in India

  const grandTotal = produceSubtotal + estimatedFreight + mandiCessFee + gstAmount;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        totalQuantityKg,
        produceSubtotal,
        estimatedFreight,
        mandiCessFee,
        gstAmount,
        grandTotal,
        farmerGroups,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemPriceForQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
