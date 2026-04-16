import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Calculate cart count from items
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(count);
  }, [cartItems]);

  // Fetch cart when authenticated
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const cart = await api.getCart();
      setCartItems(cart || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (item) => {
    try {
      await api.addToCart(item);
      await refreshCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.removeFromCart(id);
      await refreshCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      await api.updateCartItem(id, quantity);
      await refreshCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCartItems([]);
      setCartCount(0);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    refreshCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
