import { useState, useEffect } from 'react';
import {
  ArrowLeft, Trophy, Crown, Gem, Medal, Sparkles, Ticket, Award, Target,
  ShoppingBag, CheckCircle2, Gift, ChevronRight, ChevronDown, Clock,
  BarChart3, FileText, ShieldCheck, TrendingUp, Lightbulb, MapPin,
  Radio, Users, Lock, Eye,
} from 'lucide-react';
import {
  rewardTiers, journeyStats, journeyProgress, participateSteps,
  verifiedWinners, challengeHistory, transparencyItems, aiSuggestions,
  challengeHero,
} from '../lib/challengeMockData';

type Props = { onNavigate: (page: string) => void };

const iconMap: Record<string, any> = {
  Crown, Gem, Medal, Sparkles, Ticket, Award, Target,
  ShoppingBag, CheckCircle2, Gift, BarChart3, FileText, ShieldCheck,
  TrendingUp, Lightbulb, Trophy,
};

export default function ChallengeCenterPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('home')} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft size={22} className="text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Trophy size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">Challenge Center™</h1>
              <p className="text-xs text-gray-400">Phase 16 · Core Identity Module</p>
            </div>
          </div>
        </div>

        <ChallengeHero onNavigate={onNavigate} />
        <YourJourney />
        <RewardTiers />
        <HowToParticipate />
        <TransparencyCenter />
        <AIAssistant />
      </div>
    </div>
  );
}

// ============================================================
// 1. CHALLENGE HERO CARD
// ============================================================
export function ChallengeHero({ onNavigate, compact }: { onNavigate?: (page: string) => void; compact?: boolean }) {
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

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gold-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-gold-400" />
              <span className="text-sm font-bold text-gold-400 font-display">{challengeHero.title}</span>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1"><MapPin size={12} /> {challengeHero.region}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {challengeHero.week}</span>
          </div>
          <div className="flex gap-2 mb-4">
            {[
              { label: 'Days', val: pad(time.days) },
              { label: 'Hrs', val: pad(time.hours) },
              { label: 'Min', val: pad(time.minutes) },
              { label: 'Sec', val: pad(time.seconds) },
            ].map((unit) => (
              <div key={unit.label} className="flex-1 bg-white/5 rounded-xl p-2 text-center border border-white/10">
                <div className="text-xl font-bold text-gold-400 font-display tabular-nums">{unit.val}</div>
                <div className="text-[10px] text-gray-500">{unit.label}</div>
              </div>
            ))}
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('challenge-center')}
              className="w-full py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 font-bold rounded-xl hover:from-gold-300 hover:to-gold-500 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Trophy size={18} /> View Full Challenge
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 md:p-8 border border-gold-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-vloop-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-gold-400" />
            <h2 className="text-lg md:text-xl font-bold text-gold-400 font-display">{challengeHero.title}</h2>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE NOW
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-5 flex-wrap">
          <span className="flex items-center gap-1"><MapPin size={14} /> {challengeHero.region}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {challengeHero.week}</span>
        </div>
        <div className="flex gap-2 md:gap-3 mb-5">
          {[
            { label: 'Days', val: pad(time.days) },
            { label: 'Hours', val: pad(time.hours) },
            { label: 'Minutes', val: pad(time.minutes) },
            { label: 'Seconds', val: pad(time.seconds) },
          ].map((unit) => (
            <div key={unit.label} className="flex-1 bg-white/5 rounded-2xl p-3 text-center border border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-gold-400 font-display tabular-nums">{unit.val}</div>
              <div className="text-xs text-gray-500">{unit.label}</div>
            </div>
          ))}
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('challenge-center')}
            className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 font-bold rounded-xl hover:from-gold-300 hover:to-gold-500 transition-all flex items-center justify-center gap-2 text-base"
          >
            <Trophy size={20} /> View Full Challenge
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 2. YOUR JOURNEY
// ============================================================
function YourJourney() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles size={20} className="text-gold-400" /> Your Journey
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {journeyStats.map((stat) => {
          const Icon = iconMap[stat.icon] || Sparkles;
          return (
            <div key={stat.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white font-display">{stat.value}</div>
              <div className="text-sm font-medium text-gray-300">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>
            </div>
          );
        })}
      </div>
      {/* Progress indicator */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-300">Progress to next milestone</span>
          <span className="font-bold text-gold-400">{journeyProgress}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all" style={{ width: `${journeyProgress}%` }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 3. REWARD TIERS
// ============================================================
function RewardTiers() {
  const eligibilityStyles: Record<string, { bg: string; text: string; icon: any }> = {
    eligible: { bg: 'bg-success-500/20', text: 'text-success-400', icon: CheckCircle2 },
    almost: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock },
    locked: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Lock },
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Gift size={20} className="text-gold-400" /> Reward Tiers
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {rewardTiers.map((tier) => {
          const Icon = iconMap[tier.icon] || Gift;
          const elig = eligibilityStyles[tier.eligibilityStatus];
          const EligIcon = elig.icon;
          return (
            <div key={tier.id} className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-white/10 ${tier.glow} hover:scale-[1.02] transition-transform`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                  <Icon size={26} className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded">{tier.rank}</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-2">{tier.name}</h3>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${elig.bg} ${elig.text} mb-3`}>
                <EligIcon size={14} /> {tier.eligibilityLabel}
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pool Status</div>
                <div className="text-sm text-gray-300">{tier.poolStatus}</div>
              </div>
              <button className="w-full py-2.5 bg-white/5 text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                <Eye size={16} /> View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 4. HOW TO PARTICIPATE
// ============================================================
function HowToParticipate() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Ticket size={20} className="text-gold-400" /> How To Participate
      </h2>
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          {participateSteps.map((step, idx) => {
            const Icon = iconMap[step.icon] || CheckCircle2;
            return (
              <div key={step.id} className="flex items-center gap-2 md:flex-1">
                <div className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 border border-gold-500/30 flex items-center justify-center mb-2">
                    <Icon size={24} className="text-gold-400" />
                  </div>
                  <div className="text-xs font-medium text-gray-300 leading-tight">{step.label}</div>
                </div>
                {idx < participateSteps.length - 1 && (
                  <ChevronRight size={20} className="text-gold-500/40 rotate-90 md:rotate-0 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 5. TRANSPARENCY CENTER
// ============================================================
function TransparencyCenter() {
  const [openSection, setOpenSection] = useState<string | null>('winners');

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ShieldCheck size={20} className="text-gold-400" /> Transparency Center
      </h2>

      {/* Verified Winners */}
      <div className="bg-white/5 rounded-2xl border border-white/10 mb-3 overflow-hidden">
        <button
          onClick={() => setOpenSection(openSection === 'winners' ? null : 'winners')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <span className="font-semibold text-white text-sm flex items-center gap-2"><Users size={18} className="text-gold-400" /> Verified Winners</span>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${openSection === 'winners' ? 'rotate-180' : ''}`} />
        </button>
        {openSection === 'winners' && (
          <div className="px-4 pb-4 space-y-2">
            {verifiedWinners.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <div className="text-sm font-medium text-gray-200">{w.name}</div>
                  <div className="text-xs text-gray-500">{w.week} · {w.region}</div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  w.tier === 'Prime' ? 'bg-gold-500/20 text-gold-400' :
                  w.tier === 'Premium' ? 'bg-vloop-500/20 text-vloop-400' :
                  'bg-success-500/20 text-success-400'
                }`}>{w.tier}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Challenge History */}
      <div className="bg-white/5 rounded-2xl border border-white/10 mb-3 overflow-hidden">
        <button
          onClick={() => setOpenSection(openSection === 'history' ? null : 'history')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <span className="font-semibold text-white text-sm flex items-center gap-2"><BarChart3 size={18} className="text-gold-400" /> Challenge History</span>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${openSection === 'history' ? 'rotate-180' : ''}`} />
        </button>
        {openSection === 'history' && (
          <div className="px-4 pb-4 space-y-2">
            {challengeHistory.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="text-sm font-medium text-gray-200">{h.week}</div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{h.participants.toLocaleString()} participants</span>
                  <span>·</span>
                  <span>{h.winners} winners</span>
                  {h.status === 'live' && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded">LIVE</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Other transparency items */}
      <div className="grid sm:grid-cols-3 gap-3">
        {transparencyItems.map((item) => {
          const Icon = iconMap[item.icon] || ShieldCheck;
          return (
            <div key={item.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center mb-2">
                <Icon size={18} className="text-gold-400" />
              </div>
              <div className="text-sm font-semibold text-white">{item.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 6. AI CHALLENGE ASSISTANT
// ============================================================
function AIAssistant() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Radio size={20} className="text-gold-400" /> AI Challenge Assistant
      </h2>
      <div className="bg-gradient-to-br from-vloop-900/40 to-gray-900 rounded-2xl p-5 border border-vloop-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
            <Radio size={24} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white font-display">AI Assistant</div>
            <div className="text-xs text-gray-400">Personalized challenge guidance</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {aiSuggestions.map((s) => {
            const Icon = iconMap[s.icon] || Sparkles;
            return (
              <div key={s.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-vloop-500/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-vloop-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-vloop-400 uppercase tracking-wide">{s.category}</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{s.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
