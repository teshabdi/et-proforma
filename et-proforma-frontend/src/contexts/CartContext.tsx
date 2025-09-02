import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await api.get('/cart');
      // ✅ handle different possible API response shapes
      const cartItems = response.data.items || response.data.data || response.data || [];
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await api.post('/cart', { product_id: productId, quantity });
      await refreshCart(); // ✅ always sync after add
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/cart/${itemId}`);
      await refreshCart(); // ✅ sync with backend instead of only local filter
    } catch (error) {
      console.error('Remove from cart failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setIsLoading(true);
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      await refreshCart(); // ✅ sync with backend
    } catch (error) {
      console.error('Update quantity failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await api.delete('/cart');
      setItems([]);
    } catch (error) {
      console.error('Clear cart failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      isLoading,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

