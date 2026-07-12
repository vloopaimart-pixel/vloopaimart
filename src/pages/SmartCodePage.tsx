import { useState, useMemo } from 'react';
import {
  Sparkles, Hash, Delete, Plus, Minus, ArrowRight, ArrowLeft, Lock, ShieldCheck,
  Gift, ShoppingBag, AlertCircle, CheckCircle2, Loader2, Zap, Award, Trophy,
  Medal, HeartHandshake, GraduationCap, Store, TrendingUp, BadgeCheck, X,
  Wand2, Shuffle, Hand, Bot, ScrollText, ChevronRight, Pencil, Trash2,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import {
  QUIZ_RULES, normalizeSmartCode, isValidSmartCode, getCurrentWeekPeriod,
} from '../lib/points';
import {
  distributePointsAI, distributePointsManual, completeWeeklyDistribution,
  calculateLiveCounter, type DistributionMode, type SmartCodeEntry,
  DISTRIBUTION_MESSAGES,
} from '../lib/SmartCodeDistributionEngine';
import { getAITransparencyStatus, type AITransparencyStatus } from '../lib/WeeklyAIRewardEngine';
import { useEffect } from 'react';

type SmartCodePageProps = {
  onNavigate: (page: string) => void;
};

type GenMode = 'manual' | 'auto' | 'quickpick';
type QuizState = 'verified' | 'required';

export default function SmartCodePage({ onNavigate }: SmartCodePageProps) {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const availablePoints = profile?.points ?? 0;
  // Workspace demo balances (pending/used/lifetime) — derived for preview clarity
  const pendingPoints = Math.round(availablePoints * 0.16);
  const usedPoints = Math.round(availablePoints * 0.36);
  const lifetimePoints = availablePoints + usedPoints + pendingPoints;

  const [genMode, setGenMode] = useState<GenMode>('manual');
  const [entries, setEntries] = useState<SmartCodeEntry[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [manualPoints, setManualPoints] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('required');
  const [aiStatus, setAiStatus] = useState<AITransparencyStatus | null>(null);

  const weekPeriod = getCurrentWeekPeriod();

  useEffect(() => {
    if (profile) {
      getAITransparencyStatus(profile.id, weekPeriod).then(setAiStatus).catch(() => {});
    }
  }, [profile, weekPeriod]);

  const liveCounter = useMemo(
    () => calculateLiveCounter(availablePoints, entries),
    [availablePoints, entries]
  );
  const totalAllocated = liveCounter.allocated;
  const pointsRemaining = liveCounter.remaining;

  // ── Generation helpers ─────────────────────────────────────────────────────
  const genRandomCode = () => String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  const addEntry = (points: number, code?: string) => {
    if (points <= 0) return;
    if (totalAllocated + points > availablePoints) {
      setError(`Points Exceeded! Only ${availablePoints - totalAllocated} points remaining`);
      return;
    }
    setEntries(prev => [...prev, { code: code ?? genRandomCode(), points }]);
    setError(null);
  };

  const handleAddManual = () => {
    const normalized = normalizeSmartCode(manualCode);
    if (!isValidSmartCode(normalized)) {
      setError('Enter a valid 3-digit code (000-999)');
      return;
    }
    if (manualPoints <= 0) {
      setError('Points must be greater than zero');
      return;
    }
    addEntry(manualPoints, normalized);
    setManualCode('');
    setManualPoints(1);
  };

  const handleQuickSelect = (pts: number) => addEntry(pts, genRandomCode());

  const handleCustomAdd = () => {
    const pts = parseInt(customAmount, 10);
    if (!pts || pts <= 0) {
      setError('Enter a valid custom amount');
      return;
    }
    addEntry(pts, genRandomCode());
    setCustomAmount('');
  };

  // Auto generate: distribute remaining across random codes
  const handleAutoGenerate = () => {
    if (availablePoints <= 0) return;
    let remaining = availablePoints - totalAllocated;
    if (remaining <= 0) {
      setError('All points already allocated');
      return;
    }
    const newEntries: SmartCodeEntry[] = [...entries];
    const usedCodes = new Set(newEntries.map(e => e.code));
    while (remaining > 0) {
      const chunk = Math.min(remaining, Math.max(1, Math.floor(Math.random() * 10) + 1));
      let code = genRandomCode();
      let guard = 0;
      while (usedCodes.has(code) && guard < 50) { code = genRandomCode(); guard++; }
      usedCodes.add(code);
      newEntries.push({ code, points: chunk });
      remaining -= chunk;
    }
    setEntries(newEntries);
    setError(null);
  };

  // Quick pick: one code with all remaining points
  const handleQuickPick = () => {
    if (pointsRemaining <= 0) {
      setError('All points already allocated');
      return;
    }
    addEntry(pointsRemaining, genRandomCode());
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleClearAll = () => {
    setEntries([]);
    setEditingIndex(null);
    setError(null);
  };

  const handleEditPoints = (index: number, delta: number) => {
    setEntries(prev => prev.map((e, i) => {
      if (i !== index) return e;
      const next = e.points + delta;
      if (next < 1) return e;
      if (totalAllocated + delta > availablePoints) return e;
      return { ...e, points: next };
    }));
  };

  const handleEditCode = (index: number, newCode: string) => {
    const normalized = normalizeSmartCode(newCode);
    if (!isValidSmartCode(normalized)) return;
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, code: normalized } : e));
    setEditingIndex(null);
  };

  const handleKeypadPress = (key: string) => {
    if (manualCode.length >= 3) return;
    setManualCode(prev => prev + key);
    setError(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!profile) { onNavigate('home'); return; }
    if (quizState !== 'verified') {
      setError('Complete skill verification before submitting the challenge');
      return;
    }
    if (entries.length === 0) {
      setError('Generate at least one SmartCode');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let result;
      if (genMode === 'auto') {
        result = await distributePointsAI(profile.id, availablePoints, 'purchase');
      } else {
        if (totalAllocated !== availablePoints) {
          setError(`Allocate all ${availablePoints} points. Currently allocated: ${totalAllocated}`);
          setLoading(false);
          return;
        }
        result = await distributePointsManual(profile.id, entries, availablePoints, 'purchase');
      }
      if (!result.success) {
        setError(result.error || 'Distribution failed');
        setLoading(false);
        return;
      }
      await supabase.from('point_history').insert({
        user_id: profile.id,
        activity: 'VLOOP SmartCode Weekly Participation',
        amount: 0,
        points_earned: availablePoints,
        status: 'completed',
      });
      await completeWeeklyDistribution(profile.id);
      await refreshProfile();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Distribution failed');
    }
    setLoading(false);
  };

  // ── Customer flow steps ────────────────────────────────────────────────────
  const flowSteps = [
    { label: 'Earn SmartPoints', icon: Sparkles },
    { label: 'Select Points', icon: TrendingUp },
    { label: 'Generate SmartCodes', icon: Hash },
    { label: 'Complete Skill Verification', icon: BadgeCheck },
    { label: 'Submit Challenge', icon: Trophy },
    { label: 'Track Results', icon: Award },
  ];

  const benefits = [
    { label: 'Weekly Challenge', icon: Trophy, page: 'smartcode' },
    { label: 'Sponsored Protection', icon: ShieldCheck, page: 'insurance' },
    { label: 'Marketplace Offers', icon: Store, page: 'marketplace' },
    { label: 'Care Club', icon: HeartHandshake, page: 'careclub' },
    { label: 'Academy', icon: GraduationCap, page: 'academy-home' },
    { label: 'Future Utility Services', icon: Zap, page: 'home' },
  ];

  const rewardTiers = [
    { name: 'Prime', icon: Trophy, tier: 'Highest', color: 'from-signal-500 to-signal-600', border: 'border-signal-300' },
    { name: 'Premium', icon: Medal, tier: 'Mid', color: 'from-sky-500 to-sky-600', border: 'border-sky-300' },
    { name: 'Standard', icon: Award, tier: 'Entry', color: 'from-ink-600 to-ink-800', border: 'border-ink-300' },
  ];

  const modeBtn = (mode: GenMode, Icon: any, label: string) => (
    <button
      onClick={() => setGenMode(mode)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
        genMode === mode
          ? 'bg-ink-900 text-white border-ink-900 shadow-md'
          : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  // ── Success view ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-ink-50 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center mb-6 shadow-xl animate-pulse-gold">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-ink-900 font-display mb-2">Challenge Submitted!</h2>
        <p className="text-ink-500 text-center mb-6 max-w-sm">
          Your {totalAllocated} SmartPoints across {entries.length} SmartCodes are registered for week {weekPeriod}.
          The AI Weekly Reward Engine evaluates every entry automatically.
        </p>
        <div className="w-full max-w-sm space-y-3">
          <button onClick={() => onNavigate('my-smartcodes')} className="w-full py-4 bg-gradient-to-r from-ink-800 to-ink-900 text-white font-bold rounded-2xl hover:from-ink-700 hover:to-ink-800 transition-all flex items-center justify-center gap-2">
            View My SmartCodes <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => onNavigate('home')} className="w-full py-3.5 border border-ink-200 text-ink-600 font-semibold rounded-2xl hover:bg-white transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Main workspace ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2 rounded-lg hover:bg-ink-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-ink-700" />
          </button>
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-signal-500" />
            <span className="text-sm font-bold text-ink-900 font-display">SmartPoints Workspace</span>
          </div>
          <button onClick={() => onNavigate('my-smartcodes')} className="p-2 -mr-2 rounded-lg hover:bg-ink-100 transition-colors" title="My SmartCodes">
            <Hash className="w-5 h-5 text-ink-700" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
        {/* Page title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 font-display mb-1">SmartPoints Workspace</h1>
          <p className="text-sm text-ink-500 max-w-xl mx-auto">
            Use your SmartPoints to unlock skill-based opportunities and sponsored benefits.
          </p>
        </div>

        {/* 2. SmartPoints Summary Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Available', value: availablePoints, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
            { label: 'Pending', value: pendingPoints, color: 'text-signal-600', bg: 'bg-signal-50', border: 'border-signal-200' },
            { label: 'Used', value: usedPoints, color: 'text-ink-700', bg: 'bg-ink-100', border: 'border-ink-200' },
            { label: 'Lifetime Earned', value: lifetimePoints, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.bg} border ${s.border} text-center`}>
              <div className="text-xs font-semibold text-ink-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: selection + list */}
          <div className="lg:col-span-2 space-y-6">
            {/* 5. Generation Modes */}
            <div className="bg-white rounded-2xl p-5 cfe-soft-shadow border border-ink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink-900">Generation Mode</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ink-900 text-white">
                  {genMode === 'manual' ? 'Manual' : genMode === 'auto' ? 'Auto Generate' : 'Quick Pick'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {modeBtn('manual', Hand, 'Manual')}
                {modeBtn('auto', Wand2, 'Auto Generate')}
                {modeBtn('quickpick', Shuffle, 'Quick Pick')}
              </div>

              {/* Auto / Quick Pick actions */}
              {genMode === 'auto' && (
                <button onClick={handleAutoGenerate} className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-xl hover:from-sky-400 hover:to-sky-500 transition-all flex items-center justify-center gap-2">
                  <Wand2 className="w-4 h-4" /> Auto-Distribute Remaining ({pointsRemaining}) Points
                </button>
              )}
              {genMode === 'quickpick' && (
                <button onClick={handleQuickPick} className="w-full py-3 bg-gradient-to-r from-signal-500 to-signal-600 text-ink-900 font-semibold rounded-xl hover:from-signal-400 hover:to-signal-500 transition-all flex items-center justify-center gap-2">
                  <Shuffle className="w-4 h-4" /> Quick Pick All ({pointsRemaining}) Points → 1 Code
                </button>
              )}

              {/* Manual keypad */}
              {genMode === 'manual' && (
                <div>
                  {/* 3. Point Selection Panel — Quick Selection */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-ink-500 uppercase mb-2">Quick Selection</div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 5, 10].map(pts => (
                        <button
                          key={pts}
                          onClick={() => handleQuickSelect(pts)}
                          disabled={totalAllocated + pts > availablePoints}
                          className="px-4 py-2 rounded-xl bg-ink-100 text-ink-700 font-semibold text-sm hover:bg-ink-200 transition-colors disabled:opacity-40"
                        >
                          +{pts} Point{pts > 1 ? 's' : ''}
                        </button>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={customAmount}
                          onChange={e => setCustomAmount(e.target.value)}
                          placeholder="Custom"
                          className="w-20 px-2 py-2 rounded-xl border border-ink-200 text-sm text-ink-700 focus:outline-none focus:border-sky-400"
                        />
                        <button onClick={handleCustomAdd} className="px-3 py-2 rounded-xl bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 transition-colors">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Manual code entry */}
                  <div className="p-4 rounded-xl bg-ink-50 border border-ink-200">
                    <div className="text-xs font-semibold text-ink-500 uppercase mb-3">Enter SmartCode (000-999)</div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[0, 1, 2].map(idx => (
                        <div key={idx} className={`w-12 h-14 rounded-xl flex items-center justify-center ${
                          manualCode[idx] ? 'bg-sky-100 border-2 border-sky-400' : 'bg-white border-2 border-ink-200'
                        }`}>
                          <span className="text-xl font-bold font-display text-ink-800">{manualCode[idx] || '-'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {['1','2','3','4','5','6','7','8','9'].map(key => (
                        <button key={key} onClick={() => handleKeypadPress(key)} disabled={manualCode.length >= 3}
                          className="h-10 rounded-xl bg-white border border-ink-200 text-lg font-bold text-ink-800 hover:bg-sky-50 transition-colors disabled:opacity-50">
                          {key}
                        </button>
                      ))}
                      <button onClick={() => setManualCode('')} className="h-10 rounded-xl bg-ink-100 text-sm font-bold text-ink-600 hover:bg-ink-200">CLR</button>
                      <button onClick={() => handleKeypadPress('0')} disabled={manualCode.length >= 3}
                        className="h-10 rounded-xl bg-white border border-ink-200 text-lg font-bold text-ink-800 hover:bg-sky-50 disabled:opacity-50">0</button>
                      <button onClick={() => setManualCode(prev => prev.slice(0, -1))} className="h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-ink-600">Points:</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setManualPoints(p => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg bg-ink-100 hover:bg-ink-200 flex items-center justify-center">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-ink-800">{manualPoints}</span>
                        <button onClick={() => setManualPoints(p => Math.min(pointsRemaining, p + 1))} className="w-8 h-8 rounded-lg bg-ink-100 hover:bg-ink-200 flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <button onClick={handleAddManual} disabled={manualCode.length !== 3 || manualPoints <= 0}
                      className="w-full py-2.5 bg-ink-900 text-white font-bold rounded-xl hover:bg-ink-800 transition-colors disabled:opacity-50">
                      Add SmartCode
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Live SmartCode List */}
            <div className="bg-white rounded-2xl p-5 cfe-soft-shadow border border-ink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-ink-900">Live SmartCode List</h3>
                {entries.length > 0 && (
                  <button onClick={handleClearAll} className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>

              {/* Live counter row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
                  <div className="text-xs text-sky-600 font-semibold mb-0.5">Available</div>
                  <div className="text-xl font-bold text-sky-700 font-display">{liveCounter.available}</div>
                </div>
                <div className="p-3 rounded-xl bg-signal-50 border border-signal-200 text-center">
                  <div className="text-xs text-signal-600 font-semibold mb-0.5">Allocated</div>
                  <div className="text-xl font-bold text-signal-700 font-display">{liveCounter.allocated}</div>
                </div>
                <div className={`p-3 rounded-xl border text-center ${
                  liveCounter.isExceeded ? 'bg-red-50 border-red-200'
                  : liveCounter.isComplete ? 'bg-success-50 border-success-200'
                  : 'bg-ink-100 border-ink-200'
                }`}>
                  <div className={`text-xs font-semibold mb-0.5 ${
                    liveCounter.isExceeded ? 'text-red-600' : liveCounter.isComplete ? 'text-success-600' : 'text-ink-500'
                  }`}>
                    {liveCounter.isExceeded ? 'Exceeded' : liveCounter.isComplete ? 'Complete' : 'Remaining'}
                  </div>
                  <div className={`text-xl font-bold font-display ${
                    liveCounter.isExceeded ? 'text-red-700' : liveCounter.isComplete ? 'text-success-700' : 'text-ink-700'
                  }`}>{liveCounter.remaining}</div>
                </div>
              </div>

              {liveCounter.isExceeded && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-sm text-red-700 font-semibold">Points Exceeded! Remove entries to continue.</span>
                </div>
              )}

              {/* Entries */}
              {entries.length === 0 ? (
                <div className="text-center py-8 text-ink-400">
                  <Hash className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No SmartCodes generated yet.<br />Select a mode above to begin.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-ink-200 flex items-center justify-center font-mono font-bold text-lg text-ink-800">
                          {entry.code}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditPoints(index, -1)} className="w-7 h-7 rounded-lg bg-white border border-ink-200 text-ink-600 flex items-center justify-center hover:bg-ink-100">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-lg font-bold text-ink-900 w-8 text-center">{entry.points}</span>
                          <button onClick={() => handleEditPoints(index, 1)} disabled={totalAllocated >= availablePoints} className="w-7 h-7 rounded-lg bg-white border border-ink-200 text-ink-600 flex items-center justify-center hover:bg-ink-100 disabled:opacity-40">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingIndex(editingIndex === index ? null : index)} className="text-ink-500 hover:text-sky-600" title="Edit code">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRemoveEntry(index)} className="text-red-500 hover:text-red-700" title="Delete">
                          <Delete className="w-4 h-4" />
                        </button>
                      </div>
                      {editingIndex === index && (
                        <input
                          autoFocus
                          defaultValue={entry.code}
                          maxLength={3}
                          onBlur={e => handleEditCode(index, e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                          className="absolute right-20 w-20 px-2 py-1 rounded-lg border border-sky-400 text-sm font-mono"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 11. Customer Flow */}
            <div className="bg-white rounded-2xl p-5 cfe-soft-shadow border border-ink-100">
              <h3 className="font-bold text-ink-900 mb-4">Customer Flow</h3>
              <div className="overflow-x-auto pb-2">
                <div className="flex items-center gap-2 min-w-max">
                  {flowSteps.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center">
                          <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-ink-700 text-center whitespace-nowrap max-w-[80px]">{s.label}</span>
                      </div>
                      {i < flowSteps.length - 1 && <ArrowRight className="w-4 h-4 text-ink-300 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: quiz, benefits, reward, AI, legal */}
          <div className="space-y-6">
            {/* 6. Quiz Status */}
            <div className="bg-white rounded-2xl p-5 cfe-soft-shadow border border-ink-100">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-ink-900">Skill Verification</h3>
              </div>
              {quizState === 'verified' ? (
                <div className="p-4 rounded-xl bg-success-50 border border-success-200 mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success-600" />
                    <span className="font-bold text-success-700">Verified</span>
                  </div>
                  <p className="text-xs text-success-700/80 mt-1">Skill verification complete. Challenge entry unlocked.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-signal-50 border border-signal-200 mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-signal-600" />
                      <span className="font-bold text-signal-700">Quiz Required</span>
                    </div>
                    <p className="text-xs text-signal-700/80 mt-1">Challenge entry remains locked until verification.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => onNavigate('quiz')} className="w-full py-2.5 bg-gradient-to-r from-signal-500 to-signal-600 text-ink-900 font-bold rounded-xl hover:from-signal-400 hover:to-signal-500 transition-all flex items-center justify-center gap-2 text-sm">
                      <Award className="w-4 h-4" /> Take Quiz
                    </button>
                    <button onClick={() => setQuizState('verified')} className="w-full py-2.5 bg-ink-100 text-ink-700 font-semibold rounded-xl hover:bg-ink-200 transition-all flex items-center justify-center gap-2 text-sm" disabled={!QUIZ_RULES.SKIP_ENABLED}>
                      <X className="w-4 h-4" /> Skip Quiz {QUIZ_RULES.SKIP_ENABLED ? '' : '(disabled)'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 7. Benefit Preview */}
            <div className="bg-white rounded-2xl p-5 cfe-soft-shadow border border-ink-100">
              <h3 className="font-bold text-ink-900 mb-4">Use SmartPoints For</h3>
              <div className="space-y-2">
                {benefits.map(b => (
                  <button key={b.label} onClick={() => onNavigate(b.page)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-ink-50 hover:bg-ink-100 border border-ink-100 transition-colors text-left">
                    <div className="w-9 h-9 rounded-lg bg-white border border-ink-200 flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <span className="text-sm font-medium text-ink-800 flex-1">{b.label}</span>
                    <ChevronRight className="w-4 h-4 text-ink-300" />
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Reward Preview */}
            <div className="bg-white rounded-2xl p-5 cfe-soft-shadow border border-ink-100">
              <h3 className="font-bold text-ink-900 mb-1">Estimated Tier</h3>
              <p className="text-xs text-ink-500 mb-4">Display only. Backend controls reward allocation.</p>
              <div className="space-y-3">
                {rewardTiers.map(t => (
                  <div key={t.name} className={`flex items-center gap-3 p-3 rounded-xl border ${t.border} bg-white`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                      <t.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-ink-900 text-sm">{t.name}</div>
                      <div className="text-xs text-ink-500">{t.tier} Reward Tier</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. AI Assistant suggestion card */}
            <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-5 text-white border border-signal-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-signal-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">AI Assistant</div>
                  <div className="text-xs text-sky-200/70">Smart suggestion</div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 mb-3 border border-white/10">
                <p className="text-sm text-sky-100 mb-2">You have <span className="font-bold text-signal-400">{availablePoints}</span> SmartPoints.</p>
                <p className="text-xs text-sky-200/80 mb-1">Recommended:</p>
                <ul className="space-y-1 text-xs text-sky-100">
                  <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-signal-400" /> Generate {Math.max(1, Math.floor(availablePoints / 40))} SmartCodes</li>
                  <li className="flex items-center gap-2"><Trophy className="w-3 h-3 text-signal-400" /> Join this week's challenge</li>
                  {quizState !== 'verified' && <li className="flex items-center gap-2"><BadgeCheck className="w-3 h-3 text-signal-400" /> Complete skill verification</li>}
                </ul>
              </div>
              {aiStatus && (
                <div className="text-xs text-sky-200/60 space-y-1">
                  <div className="flex justify-between"><span>AI Status</span><span className="font-semibold text-sky-100">{aiStatus.ai_status}</span></div>
                  <div className="flex justify-between"><span>Reward Cycle</span><span className="font-semibold text-sky-100">{aiStatus.reward_cycle}</span></div>
                </div>
              )}
            </div>

            {/* 9. Legal Note */}
            <div className="bg-ink-900 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <ScrollText className="w-4 h-4 text-signal-400" />
                <span className="text-sm font-bold text-signal-400">Legal Note</span>
              </div>
              <ul className="space-y-2">
                {[
                  'SmartPoints are non-cash loyalty units.',
                  'Weekly Challenge is skill-based.',
                  'Reward eligibility depends on challenge rules.',
                  'Benefits are subject to partner terms.',
                ].map(l => (
                  <li key={l} className="flex items-start gap-2 text-xs text-sky-100/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-400 mt-1.5 flex-shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 py-3 pb-5 flex items-center gap-4">
          <div className="flex-1 hidden sm:block">
            <div className="text-xs text-ink-500">SmartPoints allocated</div>
            <div className="text-sm font-bold text-ink-900">{totalAllocated} / {availablePoints} · {entries.length} SmartCodes</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || entries.length === 0 || quizState !== 'verified'}
            className="flex-1 sm:flex-initial sm:w-64 py-4 bg-gradient-to-r from-signal-500 to-signal-600 text-ink-900 font-bold rounded-2xl hover:from-signal-400 hover:to-signal-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <>Submit Challenge <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
