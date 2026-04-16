import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2, Check, ShoppingBag, Truck, ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/ui/toaster.jsx';

// ── Shared brand panel ────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-500 text-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 group w-fit">
          <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight leading-none block">
              CHILALO<span className="text-blue-200">SHOP</span>
            </span>
            <span className="text-[10px] text-blue-200 font-semibold uppercase tracking-widest">Premium Fashion</span>
          </div>
        </Link>

        {/* Main copy */}
        <div className="mt-auto mb-auto pt-16 pb-10">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
            Join 50,000+ happy shoppers
          </p>
          <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-6">
            Your wardrobe,<br />
            <span className="text-blue-200">elevated.</span>
          </h2>
          <p className="text-blue-100/80 text-base leading-relaxed max-w-sm">
            Create a free account and unlock exclusive member benefits — early sale access, 
            personalised picks, and 20% off your very first order.
          </p>

          {/* Divider */}
          <div className="w-12 h-1 bg-white/30 rounded-full my-8" />

          {/* Feature list */}
          <ul className="space-y-4">
            {[
              { icon: <Star className="w-4 h-4" />,        title: '20% Off First Order', desc: 'Exclusive new member discount' },
              { icon: <ShoppingBag className="w-4 h-4" />, title: 'Early Sale Access',   desc: 'Shop before everyone else' },
              { icon: <Truck className="w-4 h-4" />,       title: 'Free Shipping',       desc: 'On all orders over $50' },
              { icon: <ShieldCheck className="w-4 h-4" />, title: 'Secure Account',      desc: 'Your data is always protected' },
            ].map(f => (
              <li key={f.title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{f.title}</p>
                  <p className="text-xs text-blue-200/70 mt-0.5">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="bg-white/10 rounded-2xl p-5 mb-6">
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
          <p className="text-sm text-white/80 leading-relaxed italic">
            "ChilaloShop has completely changed how I shop. The quality is amazing and delivery is always fast."
          </p>
          <p className="text-xs text-blue-200/60 mt-2 font-semibold">— Amara T., Addis Ababa</p>
        </div>

        {/* Footer */}
        <p className="text-blue-300/50 text-xs">
          © {new Date().getFullYear()} Chilalo Shop. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// ── Register page ─────────────────────────────────────────────────────────────
export default function Register() {
  const [firstName, setFirstName]  = useState('');
  const [lastName, setLastName]    = useState('');
  const [email, setEmail]          = useState('');
  const [password, setPassword]    = useState('');
  const [confirm, setConfirm]      = useState('');
  const [showPassword, setShowPwd] = useState(false);
  const [agreedToTerms, setAgreed] = useState(false);
  const [loading, setLoading]      = useState(false);
  const [errors, setErrors]        = useState({});

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/account', { replace: true });
  }, [isAuthenticated, navigate]);

  const checks = [
    { label: '8+ chars',      met: password.length >= 8 },
    { label: 'Number',        met: /\d/.test(password) },
    { label: 'Upper & lower', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Special char',  met: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength      = checks.filter(c => c.met).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['bg-gray-200', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'][strength];

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!lastName.trim())  e.lastName  = 'Required';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!agreedToTerms) { showToast.warning('Please agree to the terms'); return; }
    setErrors({});
    setLoading(true);
    try {
      const result = await register({ firstName, lastName, email, password });
      if (result.success) {
        showToast.success('Account created! Welcome.');
        navigate('/account');
      } else {
        showToast.error(result.error || 'Registration failed');
      }
    } catch {
      showToast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key) =>
    `block w-full py-2.5 text-sm rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors ${
      errors[key] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
    }`;

  return (
    <div className="min-h-screen flex">

      {/* Brand panel — right on register */}
      <div className="flex-1 bg-gray-50 overflow-y-auto order-1">
        <div className="min-h-screen flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-gray-900 leading-none block">
                  CHILALO<span className="text-blue-600">SHOP</span>
                </span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Premium Fashion</span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
                <p className="text-sm text-gray-500">Join ChilaloShop and start shopping today</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label htmlFor="reg-first" className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input id="reg-first" type="text" autoComplete="given-name" value={firstName}
                        onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })); }}
                        placeholder="John" disabled={loading}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        className={`${inputCls('firstName')} pl-9 pr-3`} />
                    </div>
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="reg-last" className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input id="reg-last" type="text" autoComplete="family-name" value={lastName}
                        onChange={e => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: '' })); }}
                        placeholder="Doe" disabled={loading}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        className={`${inputCls('lastName')} pl-9 pr-3`} />
                    </div>
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input id="reg-email" type="email" autoComplete="email" value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="you@example.com" disabled={loading}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      className={`${inputCls('email')} pl-10 pr-4`} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      placeholder="••••••••" disabled={loading}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      className={`${inputCls('password')} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                            style={{ width: `${(strength / 4) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">{strengthLabel}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {checks.map(c => (
                          <span key={c.label}
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium transition-colors
                              ${c.met ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Check className="w-3 h-3" />{c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="mb-4">
                  <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input id="reg-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }}
                      placeholder="••••••••" disabled={loading}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      className={`${inputCls('confirm')} pl-10 pr-4`} />
                  </div>
                  {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer select-none mb-5">
                  <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 font-semibold hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 font-semibold hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading || !agreedToTerms}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                    : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Brand panel — right on register */}
      <div className="order-2">
        <BrandPanel />
      </div>

    </div>
  );
}
