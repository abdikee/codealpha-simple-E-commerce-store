import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { api } from '../utils/api.js';
import { showToast } from '../components/ui/toaster.jsx';

export default function ResetPassword() {
  const [searchParams]                    = useSearchParams();
  const navigate                          = useNavigate();
  const token                             = searchParams.get('token') || '';

  const [password, setPassword]           = useState('');
  const [confirm, setConfirm]             = useState('');
  const [showPwd, setShowPwd]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [done, setDone]                   = useState(false);
  const [errors, setErrors]               = useState({});

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <p className="text-red-500 font-semibold mb-4">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!password)              e.password = 'Required';
    else if (password.length < 8) e.password = 'At least 8 characters';
    if (password !== confirm)   e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
      showToast.success('Password reset! You can now sign in.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      showToast.error(err.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Decorative panel */}
      <div style={{ display: 'none' }} className="lg:block lg:w-1/2 relative flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-600/85 to-teal-600/80" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
              <span className="text-xl font-black tracking-tight">CHILALOSHOP</span>
            </Link>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black leading-tight mb-4">Set a New<br /><span className="text-white/75">Password</span></h1>
              <p className="text-white/70 text-base leading-relaxed max-w-xs">Choose a strong password to keep your account secure.</p>
            </div>
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} Chilalo Shop</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 bg-gray-50" style={{ overflowY: 'auto' }}>
        <div className="min-h-screen flex items-center justify-center p-6 sm:p-10">
          <div className="w-full" style={{ maxWidth: '420px' }}>
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-gray-900">CHILALO<span className="text-blue-600">SHOP</span></span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {done ? (
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Password updated!</h3>
                  <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h2>
                    <p className="text-sm text-gray-500">Enter your new password below.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="rp-pwd" className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input id="rp-pwd" type={showPwd ? 'text' : 'password'} value={password}
                          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                          placeholder="••••••••" disabled={loading}
                          style={{ width: '100%', boxSizing: 'border-box' }}
                          className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'}`} />
                        <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                      <label htmlFor="rp-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input id="rp-confirm" type={showPwd ? 'text' : 'password'} value={confirm}
                          onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }}
                          placeholder="••••••••" disabled={loading}
                          style={{ width: '100%', boxSizing: 'border-box' }}
                          className={`block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-colors ${errors.confirm ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'}`} />
                      </div>
                      {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                      {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                        : <><span>Set New Password</span><ArrowRight className="w-4 h-4" /></>
                      }
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-gray-500">
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">Back to Sign In</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
