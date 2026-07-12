import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  mockProducts,
  type MockProduct,
  type MockAddress,
  type MockDeliveryOption,
  type MockOrder,
} from './commerceMockData';

export type CommerceCartItem = {
  product: MockProduct;
  quantity: number;
};

type CommerceContextType = {
  cart: CommerceCartItem[];
  wishlist: MockProduct[];
  savedForLater: CommerceCartItem[];
  addToCart: (product: MockProduct, qty?: number) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
  toggleWishlist: (product: MockProduct) => void;
  removeFromWishlist: (id: string) => void;
  moveWishlistToCart: (id: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  lastOrder: MockOrder | null;
  setLastOrder: (o: MockOrder | null) => void;
  selectedAddress: MockAddress | null;
  setSelectedAddress: (a: MockAddress | null) => void;
  selectedDelivery: MockDeliveryOption | null;
  setSelectedDelivery: (d: MockDeliveryOption | null) => void;
};

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CommerceCartItem[]>([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[1], quantity: 2 },
  ]);
  const [wishlist, setWishlist] = useState<MockProduct[]>([mockProducts[3], mockProducts[5]]);
  const [savedForLater, setSavedForLater] = useState<CommerceCartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<MockOrder | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<MockAddress | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<MockDeliveryOption | null>(null);

  const addToCart = (product: MockProduct, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)));
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const saveForLater = (id: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === id);
      if (item) setSavedForLater((s) => (s.find((x) => x.product.id === id) ? s : [...s, item]));
      return prev.filter((i) => i.product.id !== id);
    });
  };

  const moveToCart = (id: string) => {
    setSavedForLater((prev) => {
      const item = prev.find((i) => i.product.id === id);
      if (item) addToCart(item.product, item.quantity);
      return prev.filter((i) => i.product.id !== id);
    });
  };

  const removeSaved = (id: string) => setSavedForLater((prev) => prev.filter((i) => i.product.id !== id));

  const toggleWishlist = (product: MockProduct) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product]
    );
  };

  const removeFromWishlist = (id: string) => setWishlist((prev) => prev.filter((p) => p.id !== id));

  const moveWishlistToCart = (id: string) => {
    setWishlist((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) addToCart(item, 1);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((s, i) => s + i.product.unitPrice * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CommerceContext.Provider
      value={{
        cart, wishlist, savedForLater,
        addToCart, updateCartQty, removeFromCart, saveForLater, moveToCart, removeSaved,
        toggleWishlist, removeFromWishlist, moveWishlistToCart, clearCart,
        cartSubtotal, cartCount,
        lastOrder, setLastOrder,
        selectedAddress, setSelectedAddress,
        selectedDelivery, setSelectedDelivery,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error('useCommerce must be used within CommerceProvider');
  return ctx;
}
