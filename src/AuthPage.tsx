import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function AuthPage({ redirectTo, onAuthed, onBack }: { redirectTo?: string; onAuthed?: (p?: string) => void; onBack?: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'forgot') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (err) throw err;
        setResetSent(true);
      } else if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            name,
            points: 0,
            wallet1_balance: 0,
            wallet2_balance: 0,
            wallet1_total_earned: 0,
            wallet1_total_used: 0,
            membership_status: 'active',
            wallet2_support_status: 'pending',
          });
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      if (onAuthed && redirectTo) onAuthed(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-sky-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft-hover p-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white font-display">V</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-900 font-display">VLOOP</h1>
          <p className="text-sm text-ink-500 mt-1">
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
          </p>
        </div>
        {mode === 'forgot' ? (
          resetSent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-success-600" />
              </div>
              <h3 className="font-bold text-ink-900 text-lg mb-2">Reset Link Sent</h3>
              <p className="text-sm text-ink-500 mb-6">Check your email for a password reset link.</p>
              <button
                onClick={() => { setMode('signin'); setResetSent(false); setError(null); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-600 hover:to-sky-700 transition-all"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
              {error && <p className="text-sm text-error-600 bg-error-50 rounded-lg p-3">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-600 hover:to-sky-700 transition-all disabled:opacity-50"
              >
                {busy ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )
        ) : (
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
          />
          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => { setMode('forgot'); setError(null); }}
              className="w-full text-xs text-ink-500 hover:text-sky-600 transition-colors text-right"
            >
              Forgot Password?
            </button>
          )}
          {error && <p className="text-sm text-error-600 bg-error-50 rounded-lg p-3">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-600 hover:to-sky-700 transition-all disabled:opacity-50"
          >
            {busy ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        )}
        {mode !== 'forgot' && (
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
            className="w-full mt-4 text-sm text-ink-500 hover:text-sky-600 transition-colors text-center"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        )}
        <button
          onClick={() => onBack?.()}
          className="w-full mt-3 text-sm text-ink-400 hover:text-sky-600 transition-colors text-center flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
}
