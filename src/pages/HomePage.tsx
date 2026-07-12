import { ArrowRight, Sparkles, ShieldCheck, Trophy, Wallet, HeartHandshake, ChevronRight, LogIn } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function HomePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { profile } = useAuth();

  const cards = [
    { icon: Sparkles, title: 'Earn SmartPoints', desc: 'Earn from shopping, services, and activities.', goto: 'benefits' },
    { icon: ShieldCheck, title: 'Sponsored Protection', desc: 'Unlock VLOOP-sponsored protection benefits.', goto: 'benefits' },
    { icon: Trophy, title: 'Weekly SmartCode Challenge', desc: 'Use SmartPoints in skill-based challenges.', goto: 'smartcode-info' },
    { icon: Wallet, title: 'One Smart Wallet', desc: 'Track SmartPoints, benefits, and history.', goto: 'smartcode-info' },
  ];

  return (
    <div className="min-h-screen bg-ink-50 animate-fade-in">
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-sky-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-500/20 text-signal-300 text-xs font-semibold mb-4">
            <HeartHandshake className="w-3.5 h-3.5" /> Benefits First Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 leading-tight">
            What You Get<br />With VLOOP
          </h1>
          <p className="text-lg text-sky-100/80 mb-8 max-w-lg">
            Earn SmartPoints. Unlock protection. Build your future — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            {profile ? (
              <>
                <button
                  onClick={() => onNavigate('journey')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-600 hover:to-sky-700 transition-all flex items-center gap-2"
                >
                  View My Journey <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all"
                >
                  My Profile
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-600 hover:to-sky-700 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </section>

      {profile && (
        <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-soft-hover border border-ink-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-ink-900">Welcome back, {profile.name}</div>
                <div className="text-xs text-ink-500">Your benefits are active</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('journey')}
              className="flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              View My Journey <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-ink-900 font-display mb-2">What You Get With VLOOP</h2>
          <p className="text-ink-500">Four primary benefits — instantly clear.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <button
              key={c.title}
              onClick={() => onNavigate(c.goto)}
              className="group bg-white rounded-2xl p-6 shadow-soft border border-ink-100 hover:shadow-soft-hover hover:border-sky-300 transition-all text-left flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <c.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">{c.title}</h3>
              <p className="text-sm text-ink-500 mb-4 flex-1">{c.desc}</p>
              <span className="text-sm font-semibold text-sky-600 flex items-center gap-1">
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
