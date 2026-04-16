import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { api } from '../utils/api.js';
import { showToast } from '../components/ui/toaster.jsx';

export default function ForgotPassword() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      showToast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* Decorative panel */}
      <div style={{ display: 'none' }} className="lg:block lg:w-1/2 relative flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-600/85 to-teal-600/80" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">CHILALOSHOP</span>
            </Link>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black leading-tight mb-4">
                Password<br />
                <span className="text-white/75">Recovery</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-xs">
                Don't worry — it happens to the best of us. We'll help you get back into your account securely.
              </p>
            </div>
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} Chilalo Shop</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 bg-gray-50" style={{ overflowY: 'auto' }}>
        <div className="min-h-screen flex items-center justify-center p-6 sm:p-10">
          <div className="w-full" style={{ maxWidth: '420px' }}>

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-gray-900">CHILALO<span className="text-blue-600">SHOP</span></span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {!submitted ? (
                <>
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h2>
                    <p className="text-sm text-gray-500">Enter your email and we'll send you reset instructions.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                      <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          id="fp-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setError(''); }}
                          placeholder="you@example.com"
                          disabled={loading}
                          style={{ width: '100%', boxSizing: 'border-box' }}
                          className={`block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors
                            ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                        />
                      </div>
                      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-4"
                    >
                      {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                        : <><span>Send Reset Instructions</span><ArrowRight className="w-4 h-4" /></>
                      }
                    </button>
                  </form>

                  <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Link>
                </>
              ) : (
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                    <p className="text-sm text-gray-500">
                      If <span className="font-semibold text-gray-700">{email}</span> is registered, you'll receive reset instructions shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setEmail(''); }}
                    className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Didn't receive it? Try again
                  </button>
                  <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
