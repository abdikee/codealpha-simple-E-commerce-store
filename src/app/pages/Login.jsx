import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShoppingBag, Truck, ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/ui/toaster.jsx';

// ── Shared brand panel ────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
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
            Ethiopia's #1 Fashion Destination
          </p>
          <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-6">
            Style that speaks<br />
            <span className="text-blue-200">for itself.</span>
          </h2>
          <p className="text-blue-100/80 text-base leading-relaxed max-w-sm">
            ChilaloShop brings you curated fashion from around the world — premium quality, 
            fair prices, and a shopping experience built around you.
          </p>

          {/* Divider */}
          <div className="w-12 h-1 bg-white/30 rounded-full my-8" />

          {/* Feature list */}
          <ul className="space-y-4">
            {[
              { icon: <ShoppingBag className="w-4 h-4" />, title: '10,000+ Products', desc: 'Clothing, accessories & footwear' },
              { icon: <Truck className="w-4 h-4" />,       title: 'Free Shipping',    desc: 'On all orders over $50' },
              { icon: <ShieldCheck className="w-4 h-4" />, title: 'Secure & Trusted', desc: 'SSL encrypted checkout' },
              { icon: <Star className="w-4 h-4" />,        title: '50,000+ Customers', desc: 'Rated 4.9 / 5 stars' },
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

        {/* Footer */}
        <p className="text-blue-300/50 text-xs">
          © {new Date().getFullYear()} Chilalo Shop. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// ── Login page ────────────────────────────────────────────────────────────────
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [rememberMe, setRememberMe]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});

  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate(location.state?.from?.pathname || '/account', { replace: true });
  }, [isAuthenticated, navigate, location]);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (rememberMe) localStorage.setItem('rememberedEmail', email);
        else localStorage.removeItem('rememberedEmail');
        showToast.success('Welcome back!');
        navigate('/account');
      } else {
        showToast.error(result.error || 'Invalid credentials');
      }
    } catch {
      showToast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Brand panel — left on login */}
      <BrandPanel />

      {/* Form panel */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500">Sign in to your ChilaloShop account</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="you@example.com"
                      disabled={loading}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      className={`block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors
                        ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      placeholder="••••••••"
                      disabled={loading}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors
                        ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between mb-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                    : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create one</Link>
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
