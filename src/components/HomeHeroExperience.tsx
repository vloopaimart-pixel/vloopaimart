import { useState, useEffect } from 'react';
import {
  ShoppingBag, HandHeart, ArrowRight, Trophy,
  Sparkles, Ticket, Target, CheckCircle2, Gift,
  Crown, Gem, Medal, Camera, Upload, Hash, Delete, ShieldCheck,
  FileText, BarChart3, Lock, HelpCircle, X, Radio,
  Star, Keyboard, ScanLine, Clock, BadgeCheck,
  Zap, TrendingUp, Hash as HashIcon, ListChecks, BookOpen, MessageSquare,
} from 'lucide-react';
import {
  rewardTiers, challengeHero,
  generatedCodes, pendingCodes, weeklyWinners,
  queueStatus, smartPointsSummary, rewardJourney,
} from '../lib/challengeMockData';

type Props = { onNavigate: (page: string) => void };
type EntryMode = 'smart' | 'classic' | 'scan';

// ============================================================
// MAIN EXPORT
// ============================================================
export default function HomeHeroExperience({ onNavigate }: Props) {
  return (
    <>
      <WelcomeGateway onNavigate={onNavigate} />
      <LiveChallengeStatusBar />
      <RewardJourneyStrip />
      <SmartCodeHero onNavigate={onNavigate} />
      <QueueStatusWidget />
      <SmartPointsSummary />
      <RewardSnapshot onNavigate={onNavigate} />
      <WeeklyWinners onNavigate={onNavigate} />
      <TrustIndicators />
      <AIHelpButton onNavigate={onNavigate} />
    </>
  );
}

// ============================================================
// SECTION 1 — WELCOME ACTION GATEWAY
// ============================================================
function WelcomeGateway({ onNavigate }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden border-2" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: '#D4AF37' }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
              <ShoppingBag size={30} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-1">Purchase / Services</h3>
            <p className="text-sm text-gray-400 mb-1">Buy Products</p>
            <p className="text-sm text-gray-400 mb-1">Use Services</p>
            <p className="text-sm text-gray-400 mb-5">Earn SmartPoints</p>
            <button onClick={() => onNavigate('marketplace')} className="w-full py-4 text-lg font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}>
              Start Purchase <ArrowRight size={22} />
            </button>
          </div>
        </div>
        <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden border-2" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: '#D4AF37' }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
              <HandHeart size={30} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-1">Care Club Contribution</h3>
            <p className="text-sm text-gray-400 mb-1">Support Community</p>
            <p className="text-sm text-gray-400 mb-1">Make Contribution</p>
            <p className="text-sm text-gray-400 mb-5">Build Care Reputation</p>
            <button onClick={() => onNavigate('careclub')} className="w-full py-4 text-lg font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}>
              Contribute Now <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 2 — LIVE CHALLENGE STATUS BAR
// ============================================================
function LiveChallengeStatusBar() {
  const [time, setTime] = useState(challengeHero.countdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="Live challenge status">
      <div className="rounded-2xl p-3 border flex items-center justify-between gap-2 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #12102a)', borderColor: 'rgba(212,175,55,0.3)' }}>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
          </span>
          <span className="text-xs font-bold text-gray-300 hidden sm:inline">{challengeHero.week}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <StatusItem label="Pool" value="3,200" color="#D4AF37" />
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <StatusItem label="Countdown" value={`${pad(time.days)}d ${pad(time.hours)}h ${pad(time.minutes)}m ${pad(time.seconds)}s`} color="#10b981" mono />
        </div>
      </div>
    </section>
  );
}

function StatusItem({ label, value, color, mono }: { label: string; value: string; color: string; mono?: boolean }) {
  return (
    <div className="text-right">
      <div className="text-[9px] text-gray-500 leading-none mb-0.5">{label}</div>
      <div className={`text-xs font-bold ${mono ? 'tabular-nums' : ''}`} style={{ color }}>{value}</div>
    </div>
  );
}

// ============================================================
// SECTION 3 — REWARD JOURNEY STRIP (with stage states)
// ============================================================
function RewardJourneyStrip() {
  const iconMap: Record<string, any> = { ShoppingBag, Sparkles, Ticket, Trophy, Gift };
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="Reward journey progress">
      <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #12102a 100%)', borderColor: 'rgba(212,175,55,0.3)' }}>
        <div className="flex items-center justify-between gap-1">
          {rewardJourney.map((step, idx) => {
            const Icon = iconMap[step.icon] || Gift;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isUpcoming = step.status === 'upcoming';
            return (
              <div key={step.id} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 ${isCurrent ? 'animate-pulse-soft' : ''}`}
                    style={{
                      background: isCompleted ? 'rgba(212,175,55,0.2)' : isCurrent ? 'rgba(0,242,254,0.15)' : 'rgba(255,255,255,0.03)',
                      border: isCompleted ? '1.5px solid #D4AF37' : isCurrent ? '1.5px solid #00F2FE' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isCurrent ? '0 0 20px rgba(0,242,254,0.3)' : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={22} style={{ color: '#D4AF37' }} />
                    ) : isCurrent ? (
                      <Icon size={22} style={{ color: '#00F2FE' }} />
                    ) : (
                      <Icon size={20} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${isUpcoming ? 'text-gray-600' : isCurrent ? 'text-cyan-400' : 'text-gray-300'}`}>{step.label}</span>
                </div>
                {idx < rewardJourney.length - 1 && (
                  <div className="h-0.5 w-4 md:w-8 rounded-full shrink-0" style={{ background: isCompleted ? '#D4AF37' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 4-6 — SMARTCODE HERO (3 modes, glass digits, keypad, success)
// ============================================================
function SmartCodeHero({ onNavigate }: Props) {
  const [digits, setDigits] = useState<string[]>(['', '', '']);
  const [activeBox, setActiveBox] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');
  const [entryNumber, setEntryNumber] = useState(0);
  const [mode, setMode] = useState<EntryMode>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('vloop_entry_mode');
      if (saved === 'smart' || saved === 'classic' || saved === 'scan') return saved;
    }
    return 'smart';
  });
  const [dialOrder, setDialOrder] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  const [time, setTime] = useState(challengeHero.countdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode === 'smart') setDialOrder(shuffleNine());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  function shuffleNine(): string[] {
    const base = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    return base;
  }

  const switchMode = (m: EntryMode) => {
    setMode(m);
    try { localStorage.setItem('vloop_entry_mode', m); } catch {}
    if (m === 'classic') setDialOrder(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    else if (m === 'smart') setDialOrder(shuffleNine());
  };

  const allFilled = digits.every((d) => d !== '');

  const handleDigit = (d: string) => {
    if (showSuccess || mode === 'scan') return;
    setDigits((prev) => { const next = [...prev]; if (activeBox < 3) next[activeBox] = d; return next; });
    if (activeBox < 2) setActiveBox(activeBox + 1);
  };

  const handleClear = () => { if (showSuccess) return; setDigits(['', '', '']); setActiveBox(0); };

  const handleSubmit = () => {
    if (!allFilled || showSuccess) return;
    const code = digits.join('');
    setSubmittedCode(code);
    setSubmissionTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setEntryNumber((prev) => prev + 1);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setDigits(['', '', '']);
      setActiveBox(0);
      if (mode === 'smart') setDialOrder(shuffleNine());
    }, 4000);
  };

  const keypadDigits = mode === 'classic' ? ['1', '2', '3', '4', '5', '6', '7', '8', '9'] : dialOrder;
  const digitLabels = ['1st Digit', '2nd Digit', '3rd Digit'];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4">
      <div className="rounded-3xl p-4 md:p-6 border-2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#00F2FE' }} />
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={22} style={{ color: '#D4AF37' }} />
              <h2 className="text-base md:text-lg font-bold font-display" style={{ color: '#D4AF37' }}>Weekly SmartCode™ Challenge</h2>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <StatMini label="Pool" value="3,200" color="#D4AF37" />
            <StatMini label="Countdown" value={`${pad(time.days)}d ${pad(time.hours)}h ${pad(time.minutes)}m`} color="#00F2FE" mono />
            <StatMini label="SmartPoints" value="1,840" color="#D4AF37" />
            <StatMini label="Entries" value="3" color="#00F2FE" />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <ActionBtn icon={Upload} label="Upload Receipt" color="#D4AF37" />
            <ActionBtn icon={Camera} label="Scan QR" color="#00F2FE" />
            <ActionBtn icon={Hash} label="Manual Entry" color="#9ca3af" />
          </div>

          {/* 3-digit glass display with labels */}
          <div className="flex justify-center gap-3 md:gap-5 mb-2">
            {digits.map((d, i) => {
              const isActive = activeBox === i && !showSuccess && mode !== 'scan';
              const isFilled = d !== '';
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    onClick={() => !showSuccess && mode !== 'scan' && setActiveBox(i)}
                    className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-bold cursor-pointer transition-all duration-300 ${isActive ? 'animate-pulse-soft' : ''} ${isFilled ? 'animate-digit-pop' : ''}`}
                    style={{
                      background: isActive ? 'rgba(0,242,254,0.08)' : isFilled ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.04)',
                      border: isActive ? '2px solid #00F2FE' : isFilled ? '2px solid rgba(212,175,55,0.6)' : '2px solid rgba(255,255,255,0.12)',
                      boxShadow: isActive ? '0 0 24px rgba(0,242,254,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' : isFilled ? '0 0 16px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                      color: isFilled ? '#D4AF37' : 'transparent',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {d}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{digitLabels[i]}</span>
                </div>
              );
            })}
          </div>

          {/* Mode selector — 3 official modes */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <ModeBtn icon={Star} label="Smart" subtitle="Signature" active={mode === 'smart'} onClick={() => switchMode('smart')} />
              <ModeBtn icon={Keyboard} label="Classic" subtitle="Elder-friendly" active={mode === 'classic'} onClick={() => switchMode('classic')} />
              <ModeBtn icon={ScanLine} label="Scan" subtitle="Fastest" active={mode === 'scan'} onClick={() => switchMode('scan')} />
            </div>
          </div>

          {/* Keypad or scan panel */}
          {!showSuccess ? (
            mode === 'scan' ? (
              <div className="max-w-xs mx-auto py-4 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ background: 'rgba(0,242,254,0.1)', border: '1.5px solid rgba(0,242,254,0.3)' }}>
                  <ScanLine size={28} style={{ color: '#00F2FE' }} />
                </div>
                <p className="text-sm text-gray-300 mb-1">Scan mode active</p>
                <p className="text-xs text-gray-500 mb-4">Use camera or upload receipt to enter automatically</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.03]" style={{ background: 'rgba(0,242,254,0.1)', border: '1.5px solid rgba(0,242,254,0.3)', color: '#00F2FE' }}>
                    <Camera size={18} /> Scan QR
                  </button>
                  <button className="py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.03]" style={{ background: 'rgba(212,175,55,0.1)', border: '1.5px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
                    <Upload size={18} /> Upload
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-xs mx-auto">
                <div className="grid grid-cols-3 gap-2.5 animate-keypad-shuffle">
                  {keypadDigits.map((d) => (
                    <button key={d} onClick={() => handleDigit(d)} className="aspect-square rounded-2xl text-2xl font-bold transition-all active:scale-90 active:vibrate-tap hover:bg-white/10" style={{ background: 'linear-gradient(135deg, rgba(30,27,46,0.8), rgba(11,8,25,0.8))', border: '1.5px solid rgba(212,175,55,0.25)', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.3)' }}>
                      {d}
                    </button>
                  ))}
                  <button onClick={handleClear} className="aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-90 active:vibrate-tap" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', border: '1.5px solid rgba(239,68,68,0.35)', color: '#fb7185', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.3)' }}>
                    <Delete size={24} />
                  </button>
                  <button onClick={() => handleDigit('0')} className="aspect-square rounded-2xl text-2xl font-bold transition-all active:scale-90 active:vibrate-tap hover:bg-white/10" style={{ background: 'linear-gradient(135deg, rgba(30,27,46,0.8), rgba(11,8,25,0.8))', border: '1.5px solid rgba(212,175,55,0.25)', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.3)' }}>
                    0
                  </button>
                  <button onClick={handleSubmit} disabled={!allFilled} className={`aspect-square rounded-2xl text-sm font-bold transition-all active:scale-90 disabled:opacity-30 ${allFilled ? 'animate-submit-pulse' : ''}`} style={{ background: allFilled ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.04)', border: allFilled ? '1.5px solid #34d399' : '1.5px solid rgba(255,255,255,0.1)', color: allFilled ? '#fff' : '#666', boxShadow: allFilled ? '0 0 20px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none' }}>
                    SUBMIT
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center py-4 animate-gold-success">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e', boxShadow: '0 0 32px rgba(34,197,94,0.3)' }}>
                <CheckCircle2 size={36} style={{ color: '#22c55e' }} />
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-3">SmartCode Submitted Successfully</h3>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                <SuccessDetail label="Entered Code" value={submittedCode} color="#D4AF37" />
                <SuccessDetail label="Entry #" value={`#${(entryNumber + 3).toString().padStart(3, '0')}`} color="#00F2FE" />
                <SuccessDetail label="Submitted At" value={submissionTime} color="#9ca3af" />
                <SuccessDetail label="Queue Position" value="#14" color="#10b981" />
              </div>
            </div>
          )}

          <button onClick={() => onNavigate('challenge-center')} className="w-full mt-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            View Full Challenge →
          </button>
        </div>
      </div>

      {/* Generated Codes Panel */}
      <div className="mt-4 rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #0B0819, #12102a)', borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 size={16} style={{ color: '#22c55e' }} /> Generated Codes</h3>
          <span className="text-xs text-gray-500">{generatedCodes.length} validated</span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {generatedCodes.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                <span className="text-lg font-bold tracking-widest" style={{ color: '#D4AF37' }}>{c.code}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{c.week}</div>
                <div className="text-[10px] text-gray-600">{c.validatedAt}</div>
              </div>
            </div>
          ))}
        </div>
        {generatedCodes.length > 3 && (
          <button className="w-full mt-2 py-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors">+ {generatedCodes.length - 3} More</button>
        )}
      </div>

      {/* Pending Queue Panel */}
      <div className="mt-3 rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #0B0819, #12102a)', borderColor: 'rgba(0,242,254,0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Clock size={16} style={{ color: '#00F2FE' }} /> Pending Queue</h3>
          <span className="text-xs text-gray-500">{pendingCodes.length} pending</span>
        </div>
        <div className="space-y-2">
          {pendingCodes.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-widest" style={{ color: '#00F2FE' }}>{p.code}</span>
                <span className="text-xs text-gray-500">{p.estimatedValue}</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg" style={{ background: p.status === 'verifying' ? 'rgba(251,191,36,0.15)' : 'rgba(0,242,254,0.1)', color: p.status === 'verifying' ? '#fbbf24' : '#00F2FE' }}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full mt-2 py-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors">+ More</button>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 7 — QUEUE STATUS WIDGET
// ============================================================
function QueueStatusWidget() {
  const items = [
    { label: 'Pending', value: queueStatus.pending, icon: Clock, color: '#fbbf24' },
    { label: 'Validated', value: queueStatus.validated, icon: CheckCircle2, color: '#22c55e' },
    { label: 'Processing', value: queueStatus.processing, icon: Zap, color: '#00F2FE' },
    { label: 'Eligible', value: queueStatus.eligible, icon: BadgeCheck, color: '#D4AF37' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="Queue status">
      <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #0B0819, #12102a)', borderColor: 'rgba(212,175,55,0.2)' }}>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><ListChecks size={16} style={{ color: '#D4AF37' }} /> Your Queue Status</h3>
        <div className="grid grid-cols-4 gap-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-xl p-2.5 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex justify-center mb-1"><item.icon size={16} style={{ color: item.color }} /></div>
              <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[10px] text-gray-500 leading-none mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 8 — SMARTPOINTS SUMMARY
// ============================================================
function SmartPointsSummary() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="SmartPoints summary">
      <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #0B0819, #12102a)', borderColor: 'rgba(212,175,55,0.2)' }}>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Sparkles size={16} style={{ color: '#D4AF37' }} /> SmartPoints Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <SummaryCard label="Today's SP" value={smartPointsSummary.today.toString()} icon={Zap} color="#00F2FE" />
          <SummaryCard label="Weekly SP" value={smartPointsSummary.weekly.toString()} icon={TrendingUp} color="#D4AF37" />
          <SummaryCard label="Eligible Codes" value={smartPointsSummary.totalEligibleCodes.toString()} icon={HashIcon} color="#22c55e" />
          <SummaryCard label="Current Tier" value={smartPointsSummary.currentTier} icon={Crown} color="#D4AF37" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 9 — REWARD SNAPSHOT (compact table)
// ============================================================
function RewardSnapshot({ onNavigate }: Props) {
  const iconMap: Record<string, any> = { Crown, Gem, Medal };
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="Reward snapshot">
      <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Gift size={18} className="text-amber-500" /> Reward Snapshot</h2>
      <div className="rounded-2xl p-4 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
        <div className="space-y-2">
          {rewardTiers.map((tier) => {
            const Icon = iconMap[tier.icon] || Gift;
            return (
              <div key={tier.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{tier.name}</div>
                    <div className="text-xs text-gray-500">{tier.eligibilityLabel}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{tier.rank}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => onNavigate('challenge-center')} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl transition-colors" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          View Full Reward Chart →
        </button>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 10 — WEEKLY WINNERS (separate card)
// ============================================================
function WeeklyWinners({ onNavigate }: Props) {
  const tierStyles: Record<string, { bg: string; text: string; medal: string }> = {
    Prime: { bg: 'rgba(212,175,55,0.15)', text: '#D4AF37', medal: '🏆' },
    Premium: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8', medal: '🥈' },
    Standard: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', medal: '🥉' },
  };
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="Weekly winners">
      <div className="rounded-2xl p-4 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#D4AF37' }}>
          <Trophy size={18} /> Weekly Winners
        </h2>
        <div className="space-y-2">
          {weeklyWinners.map((w) => {
            const style = tierStyles[w.tier] || tierStyles.Standard;
            return (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{style.medal}</span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg" style={{ background: style.bg, color: style.text }}>{w.tier}</span>
                  <span className="text-xl font-bold tracking-widest text-white">{w.smartCode}</span>
                </div>
                {w.vcosVerified && (
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}>
                    <BadgeCheck size={16} /> VCOS Verified
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={() => onNavigate('challenge-center')} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl transition-colors" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          View Full Weekly Results →
        </button>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 11 — TRUST INDICATORS
// ============================================================
function TrustIndicators() {
  const [showTrust, setShowTrust] = useState(false);
  const indicators = [
    { icon: Lock, label: 'Encrypted', desc: 'End-to-end encryption', color: '#00F2FE' },
    { icon: FileText, label: 'Audited', desc: 'Independently verified', color: '#D4AF37' },
    { icon: BarChart3, label: 'Transparent', desc: '100% distribution', color: '#22c55e' },
    { icon: BadgeCheck, label: 'Verified', desc: 'VCOS certified', color: '#D4AF37' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4" aria-label="Trust indicators">
      <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #0B0819, #12102a)', borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-shield-glow" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <ShieldCheck size={18} style={{ color: '#D4AF37' }} />
          </div>
          <h3 className="text-sm font-bold text-white">Trust & Verification</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {indicators.map((item) => (
            <div key={item.label} className="rounded-xl p-3 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex justify-center mb-1.5"><item.icon size={18} style={{ color: item.color }} /></div>
              <div className="text-xs font-bold text-white">{item.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowTrust(true)} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl transition-colors" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          <ShieldCheck size={16} className="inline mr-1.5" /> Why Trust VLOOP?
        </button>
      </div>
      {showTrust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowTrust(false)}>
          <div className="rounded-3xl max-w-md w-full overflow-hidden border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              <h3 className="text-lg font-bold font-display" style={{ color: '#D4AF37' }}>Why Trust VLOOP?</h3>
              <button onClick={() => setShowTrust(false)} className="p-1 rounded-lg hover:bg-white/10"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { icon: FileText, label: 'Rules', desc: 'Clear, published challenge rules. No hidden terms.' },
                { icon: BarChart3, label: 'Audit', desc: 'Every challenge is independently audited.' },
                { icon: Gift, label: 'Distribution', desc: '100% of rewards are distributed transparently.' },
                { icon: Lock, label: 'Privacy', desc: 'Your personal data is encrypted and protected.' },
                { icon: ShieldCheck, label: 'Compliance', desc: 'Full regulatory compliance. No lottery. No betting.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}><item.icon size={18} style={{ color: '#D4AF37' }} /></div>
                  <div><div className="text-sm font-semibold text-white">{item.label}</div><div className="text-xs text-gray-400">{item.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================
// SECTION 12 — AI HELP BUTTON (floating, with Guide Me / FAQ / Support)
// ============================================================
function AIHelpButton({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const steps = [
    { icon: Upload, label: 'Upload Receipt', desc: 'Take a photo of your purchase receipt' },
    { icon: Hash, label: 'Enter SmartCode', desc: 'Type your 3-digit SmartCode using the dial pad' },
    { icon: CheckCircle2, label: 'Submit', desc: 'Press submit to enter the weekly challenge' },
    { icon: Target, label: 'Track Eligibility', desc: 'Check your entries and reward tier status' },
  ];
  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-4 md:right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-full shadow-xl transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }} aria-label="AI Help">
        <HelpCircle size={22} />
        <span className="font-bold text-sm hidden sm:inline">Need Help?</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="rounded-3xl max-w-md w-full overflow-hidden border-2 animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}><Radio size={20} style={{ color: '#00F2FE' }} /></div>
                <div><h3 className="font-bold font-display" style={{ color: '#D4AF37' }}>AI Assistant</h3><p className="text-xs text-gray-400">Need help submitting SmartCodes?</p></div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5">
              {/* Step-by-step guide */}
              <div className="space-y-3 mb-4">
                {steps.map((step, idx) => (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}><step.icon size={18} style={{ color: '#D4AF37' }} /></div>
                      {idx < steps.length - 1 && <div className="w-0.5 h-6 mt-1" style={{ background: 'rgba(212,175,55,0.2)' }} />}
                    </div>
                    <div className="pt-1.5"><div className="text-sm font-semibold text-white">{step.label}</div><div className="text-xs text-gray-400">{step.desc}</div></div>
                  </div>
                ))}
              </div>
              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                <button onClick={() => { setOpen(false); onNavigate('challenge-center'); }} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all hover:scale-[1.03]" style={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
                  <BookOpen size={18} />
                  <span className="text-[11px] font-semibold">Guide Me</span>
                </button>
                <button onClick={() => { setOpen(false); onNavigate('faq'); }} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all hover:scale-[1.03]" style={{ background: 'rgba(0,242,254,0.1)', borderColor: 'rgba(0,242,254,0.3)', color: '#00F2FE' }}>
                  <HelpCircle size={18} />
                  <span className="text-[11px] font-semibold">FAQ</span>
                </button>
                <button onClick={() => { setOpen(false); onNavigate('contact'); }} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all hover:scale-[1.03]" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }}>
                  <MessageSquare size={18} />
                  <span className="text-[11px] font-semibold">Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// Helpers
// ============================================================
function StatMini({ label, value, color, mono }: { label: string; value: string; color: string; mono?: boolean }) {
  return (
    <div className="rounded-xl p-2.5 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="text-[10px] text-gray-500 mb-0.5 leading-none">{label}</div>
      <div className={`text-sm font-bold ${mono ? 'tabular-nums' : ''}`} style={{ color }}>{value}</div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all hover:scale-[1.03]" style={{ background: color === '#D4AF37' ? 'rgba(212,175,55,0.1)' : color === '#00F2FE' ? 'rgba(0,242,254,0.1)' : 'rgba(255,255,255,0.05)', borderColor: `${color}55` }}>
      <Icon size={18} style={{ color }} />
      <span className="text-[11px] font-medium text-gray-300 text-center leading-tight">{label}</span>
    </button>
  );
}

function ModeBtn({ icon: Icon, label, subtitle, active, onClick }: { icon: any; label: string; subtitle: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center px-3 py-1.5 rounded-lg transition-all" style={{ background: active ? 'linear-gradient(135deg, #D4AF37, #B8941F)' : 'transparent', color: active ? '#0B0819' : '#9ca3af' }}>
      <div className="flex items-center gap-1.5">
        <Icon size={14} />
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className="text-[9px] leading-none mt-0.5 opacity-80">{subtitle}</span>
    </button>
  );
}

function SuccessDetail({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-2.5 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="text-[10px] text-gray-500 mb-0.5 leading-none">{label}</div>
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="rounded-xl p-3 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} style={{ color }} />
        <span className="text-[10px] text-gray-500 leading-none">{label}</span>
      </div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
