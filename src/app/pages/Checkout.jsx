import React, { useState } from 'react';
import { ChevronRight, CreditCard, Truck, ShieldCheck, ArrowLeft, ArrowRight, MapPin, Mail, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../utils/api.js';
import { showToast } from '../components/ui/toaster.jsx';
import { smooth } from '../utils/animations.js';

export function Checkout() {
  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '',
    state: '', zip: '', country: 'United States',
    cardNumber: '', cardExpiry: '', cardCVC: '', cardName: ''
  });
  const { cartItems, cartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 12.50;
  const total = subtotal + shipping;

  const steps = [
    { id: 1, name: 'Cart' },
    { id: 2, name: 'Shipping' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Review' },
  ];

  const validateShipping = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip'];
    const newErrors = {};
    required.forEach(field => { if (!formData[field]) newErrors[field] = 'This field is required'; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const required = ['cardNumber', 'cardExpiry', 'cardCVC', 'cardName'];
    const newErrors = {};
    required.forEach(field => { if (!formData[field]) newErrors[field] = 'This field is required'; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 2 && !validateShipping()) return;
    if (step === 3 && !validatePayment()) return;
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep(s => s - 1); };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const order = await api.createOrder({
        items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
        shipping: { ...formData },
        total,
      });
      setOrderId(order.id || order.orderId || 'ORD-' + Date.now());
      showToast.success('Order placed successfully!');
    } catch (err) {
      showToast.error('Failed to place order', err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const field = (name, label, props = {}) => (
    <Input label={label} value={formData[name]}
      onChange={e => setFormData(p => ({ ...p, [name]: e.target.value }))}
      errorMessage={errors[name]} {...props} />
  );

  if (orderId) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-24 text-center max-w-lg">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold">Order Confirmed!</h2>
          <p className="text-gray-500">Your order <span className="font-bold text-gray-900">#{orderId}</span> has been placed successfully.</p>
          <Button size="lg" onClick={() => navigate('/account/orders')}>View My Orders</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-24">
      {/* Progress Bar */}
      <div className="py-16 flex items-center justify-center">
        <div className="flex items-center w-full max-w-4xl relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2"
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            transition={smooth}
          />
          {steps.map(s => (
            <div key={s.id} className="flex-grow flex flex-col items-center relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 font-bold ${
                step >= s.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'
              }`}>
                {step > s.id ? <Check className="w-6 h-6" /> : s.id}
              </div>
              <span className={`mt-4 text-xs font-bold uppercase tracking-widest transition-colors ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <h3 className="text-2xl font-bold">Cart Review</h3>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty. <Link to="/shop" className="text-primary font-bold">Shop now</Link></p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <ImageWithFallback src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-gray-900">{item.product?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Size: {item.size} / {item.color} × {item.quantity}</p>
                        <p className="text-sm font-bold text-primary mt-1">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
                <div className="pt-8 flex justify-end border-t border-gray-100">
                  <Button size="lg" className="h-14 px-10 shadow-xl shadow-primary/20" onClick={handleNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Continue to Shipping
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary"><Mail className="w-6 h-6" /></div>
                    Contact Information
                  </h3>
                  {field('email', 'Email Address', { type: 'email', placeholder: 'you@example.com' })}
                </div>
                <div className="space-y-6 pt-10 border-t border-gray-100">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary"><MapPin className="w-6 h-6" /></div>
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {field('firstName', 'First Name', { placeholder: 'John' })}
                    {field('lastName', 'Last Name', { placeholder: 'Doe' })}
                  </div>
                  {field('address', 'Address', { placeholder: '123 Street Ave' })}
                  <div className="grid grid-cols-3 gap-4">
                    {field('city', 'City', { placeholder: 'New York' })}
                    {field('state', 'State', { placeholder: 'NY' })}
                    {field('zip', 'Zip Code', { placeholder: '10001' })}
                  </div>
                </div>
                <div className="pt-12 flex items-center justify-between border-t border-gray-100">
                  <button onClick={handleBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Return to Cart
                  </button>
                  <Button size="lg" className="h-14 px-10 shadow-xl shadow-primary/20" onClick={handleNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary"><CreditCard className="w-6 h-6" /></div>
                    Payment Method
                  </h3>
                  <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-200 space-y-6">
                    {field('cardNumber', 'Card Number', { placeholder: '0000 0000 0000 0000', leadingIcon: <CreditCard className="w-5 h-5" /> })}
                    <div className="grid grid-cols-2 gap-4">
                      {field('cardExpiry', 'Expiration Date', { placeholder: 'MM / YY' })}
                      {field('cardCVC', 'Security Code', { placeholder: '123' })}
                    </div>
                    {field('cardName', 'Name on Card', { placeholder: 'John Doe' })}
                  </div>
                </div>
                <div className="pt-12 flex items-center justify-between border-t border-gray-100">
                  <button onClick={handleBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Return to Shipping
                  </button>
                  <Button size="lg" className="h-14 px-10 shadow-xl shadow-primary/20" onClick={handleNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <h3 className="text-2xl font-bold">Review Your Order</h3>
                <div className="p-6 bg-gray-50 rounded-2xl space-y-2 text-sm">
                  <h4 className="font-bold text-gray-700 mb-3">Shipping Address</h4>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.email}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl space-y-2 text-sm">
                  <h4 className="font-bold text-gray-700 mb-3">Payment</h4>
                  <p>Card ending in {formData.cardNumber.slice(-4) || '****'}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-700">Items</h4>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product?.name} × {item.quantity}</span>
                      <span className="font-bold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-12 flex items-center justify-between border-t border-gray-100">
                  <button onClick={handleBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Return to Payment
                  </button>
                  <Button size="lg" className="h-14 px-10 shadow-xl shadow-primary/20" onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    rightIcon={placingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}>
                    {placingOrder ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl border-t-4 border-t-primary/10 lg:sticky lg:top-32">
            <h4 className="text-xl font-bold mb-8 uppercase tracking-widest text-gray-900">Order Summary</h4>
            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <ImageWithFallback src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</p>
                    <p className="text-sm font-bold text-primary mt-0.5">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-bold text-green-500">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between pt-4 border-t border-dashed border-gray-200">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-primary" /> Delivery in 2–4 business days
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-primary" /> Safe & Secure Payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
