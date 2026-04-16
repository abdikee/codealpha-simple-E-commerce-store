import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { Button } from '../components/Button';
import { CartItem } from '../components/CartItem';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { CartSkeleton } from '../components/ui/skeleton.jsx';

export function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const { isAuthenticated }       = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setCartItems(await api.getCart());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 12.50;
  const total    = subtotal + shipping;

  const updateQuantity = async (index, quantity) => {
    const item = cartItems[index];
    try {
      if (quantity <= 0) await api.removeFromCart(item.id);
      else               await api.updateCartItem(item.id, quantity);
      await fetchCart();
    } catch (err) { setError(err.message); }
  };

  const removeItem = async (index) => {
    try {
      await api.removeFromCart(cartItems[index].id);
      await fetchCart();
    } catch (err) { setError(err.message); }
  };

  const clearCart = async () => {
    try { await api.clearCart(); setCartItems([]); }
    catch (err) { setError(err.message); }
  };

  if (loading) return <CartSkeleton />;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Please Sign In</h2>
          <p className="text-lg text-gray-500 mb-8">Sign in to view and manage your shopping cart.</p>
          <Link to="/login"><Button size="lg" className="h-14 px-12 text-lg shadow-xl shadow-primary/20">Sign In</Button></Link>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-12 relative">
            <ShoppingBag className="w-16 h-16 text-gray-200" />
            <div className="absolute top-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white">0</div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
          <p className="text-lg text-gray-500 mb-12 leading-relaxed">
            Looks like you haven't added anything yet. Discover our latest collections.
          </p>
          <Link to="/shop">
            <Button size="lg" className="h-14 px-12 text-lg shadow-xl shadow-primary/20" leftIcon={<ArrowLeft className="w-5 h-5" />}>
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        className="container mx-auto px-4 lg:px-8 pb-24">

        <div className="py-12 border-b border-gray-100 mb-12">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Checkout Process</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Shopping Cart <span className="text-gray-300 font-normal">({cartItems.length} items)</span>
              </h2>
            </div>
            <Link to="/shop" className="text-primary font-bold hover:underline flex items-center gap-2 group mb-2">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Items */}
          <div className="lg:col-span-2 space-y-2">
            {cartItems.map((item, index) => (
              <CartItem
                key={item.id}
                product={item.product}
                quantity={item.quantity}
                size={item.size}
                color={item.color}
                onUpdateQuantity={(q) => updateQuantity(index, q)}
                onRemove={() => removeItem(index)}
              />
            ))}
            <div className="pt-12 flex justify-end border-t border-gray-100">
              <Button variant="ghost" className="text-gray-500 hover:text-destructive font-bold uppercase tracking-widest text-xs" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl lg:sticky lg:top-32">
              <h4 className="text-xl font-bold mb-8 uppercase tracking-widest text-gray-900">Order Summary</h4>

              <div className="space-y-5 mb-8 pb-8 border-b border-gray-100">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className={`font-bold text-sm uppercase tracking-widest ${shipping === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
                )}
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="text-2xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full h-16 text-lg shadow-xl shadow-primary/20 mb-8" rightIcon={<ArrowRight className="w-6 h-6" />}>
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Secure checkout
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Truck className="w-5 h-5 text-primary" /> Free shipping over $50
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <RefreshCcw className="w-5 h-5 text-primary" /> 30-day returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
