import { useState } from 'react';
import {
  X, Mail, Lock, User, Phone, MapPin, Loader2,
  MessageCircle, Gift, CheckCircle2, Smartphone, KeyRound, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  setMode: (m: 'signin' | 'signup') => void;
};

export default function AuthModal({ isOpen, onClose, mode, setMode }: AuthModalProps) {
  const { signIn, signUp, justRegistered, clearJustRegistered } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    location: '',
    email: '',
    referral: '',
    password: '',
    otp: '',
  });

  if (!isOpen) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email) { setError('Please enter your email address'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: window.location.origin,
      });
      if (err) throw err;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!form.name) { setError('Name is required'); setLoading(false); return; }
        if (loginMethod === 'email') {
          if (!form.email || !form.password) { setError('Email and password are required'); setLoading(false); return; }
          const { error: err } = await signUp(form.email, form.password, form.name);
          if (err) throw err;
        } else {
          if (!form.mobile) { setError('Mobile number is required'); setLoading(false); return; }
          const { error: err } = await signUp(`${form.mobile}@vloop.app`, 'vloop123', form.name);
          if (err) throw err;
        }
      } else {
        if (loginMethod === 'email') {
          if (!form.email || !form.password) { setError('Email and password are required'); setLoading(false); return; }
          const { error: err } = await signIn(form.email, form.password);
          if (err) throw err;
        } else {
          if (!form.mobile) { setError('Mobile number is required'); setLoading(false); return; }
          const { error: err } = await signIn(`${form.mobile}@vloop.app`, 'vloop123');
          if (err) throw err;
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  if (justRegistered) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { clearJustRegistered(); onClose(); }} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">Welcome to VLOOP!</h2>
          <p className="text-gray-500 mb-2">Your account has been created successfully.</p>
          <p className="text-sm text-vloop-600 font-semibold mb-6">Start earning SmartPoints today!</p>
          <button
            onClick={() => { clearJustRegistered(); onClose(); }}
            className="btn-primary w-full"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
              <span className="text-white font-bold text-base font-display">V</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-display leading-tight">
                {forgotPassword ? 'Reset Password' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-xs text-gray-500">
                {forgotPassword ? 'Enter your email to receive a reset link' : mode === 'signin' ? 'Welcome back to VLOOP' : 'Join the VLOOP community'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Forgot Password Flow */}
        {forgotPassword ? (
          <form onSubmit={handleResetPassword} className="p-6 space-y-4">
            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-success-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Reset Link Sent</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Check your email for a password reset link. It may take a few minutes to arrive.
                </p>
                <button
                  type="button"
                  onClick={() => { setForgotPassword(false); setResetSent(false); setError(null); }}
                  className="btn-primary w-full"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => { setForgotPassword(false); setError(null); }}
                  className="w-full text-sm text-gray-500 hover:text-vloop-600 font-medium text-center"
                >
                  Back to Sign In
                </button>
              </>
            )}
          </form>
        ) : (
          /* Main sign-in / sign-up form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Mode tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
              <button type="button" onClick={() => { setMode('signin'); setError(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'signin' ? 'bg-white text-vloop-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                Sign In
              </button>
              <button type="button" onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-vloop-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                Sign Up
              </button>
            </div>

            {/* Login method toggle */}
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button type="button" onClick={() => { setLoginMethod('mobile'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${loginMethod === 'mobile' ? 'bg-vloop-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Smartphone size={14} /> Mobile
              </button>
              <button type="button" onClick={() => { setLoginMethod('email'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${loginMethod === 'email' ? 'bg-vloop-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Mail size={14} /> Email
              </button>
            </div>

            {/* Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="Your full name" required />
                </div>
              </div>
            )}

            {/* Mobile or Email */}
            {loginMethod === 'mobile' ? (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mobile Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="+91 98765 43210" required />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="your@email.com" required />
                </div>
              </div>
            )}

            {/* Location (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="City, State" />
                </div>
              </div>
            )}

            {/* Password (email mode) */}
            {loginMethod === 'email' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password *</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="Your password" required />
                </div>
                {mode === 'signin' && (
                  <button type="button"
                    onClick={() => { setForgotPassword(true); setError(null); setResetSent(false); }}
                    className="text-xs text-vloop-600 font-medium hover:underline text-right w-full mt-1.5 block">
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            {/* OTP (mobile signin) */}
            {loginMethod === 'mobile' && mode === 'signin' && otpSent && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">OTP *</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="6-digit OTP" maxLength={6} />
                </div>
              </div>
            )}

            {/* WhatsApp (signup mobile) */}
            {mode === 'signup' && loginMethod === 'mobile' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">WhatsApp Number</label>
                <div className="relative">
                  <MessageCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="+91 98765 43210 (if different)" />
                </div>
              </div>
            )}

            {/* Referral (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Referral Code</label>
                <div className="relative">
                  <Gift size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.referral} onChange={(e) => setForm({ ...form, referral: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                    placeholder="Optional referral code" />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2 py-3">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our{' '}
              <span className="text-vloop-600 cursor-pointer hover:underline">Terms</span> &{' '}
              <span className="text-vloop-600 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
