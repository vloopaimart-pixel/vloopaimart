import { useState } from 'react';
import {
  Bot, MessageCircle, Lightbulb, MapPin, Ticket, Sparkles, Trophy,
  ShoppingBag, Store, Utensils, Wrench, HandHeart, Scissors, Monitor,
  Wheat, ArrowRight, CheckCircle2, Clock, Award, TrendingUp,
  ChevronRight, Info, ShieldCheck, Lock,
} from 'lucide-react';
import {
  personalizedSuggestions, hyperLocalOpportunities, smartCodeProgress,
  smartPointsGuide, careClubGuidance, businessGrowthSuggestions,
  businessDiscovery, weeklyChallengeAssistant, aiInsightTimeline,
} from '../lib/aiIntelligenceMockData';

type Props = { onNavigate: (page: string) => void };

const ICON_MAP: Record<string, any> = {
  Bot, MessageCircle, Lightbulb, MapPin, Ticket, Sparkles, Trophy,
  ShoppingBag, Store, Utensils, Wrench, HandHeart, Scissors, Monitor,
  Wheat, CheckCircle2, Clock, Award,
};

export default function AIIntelligencePage({ onNavigate }: Props) {
  const [activeSection, setActiveSection] = useState<'suggestions' | 'opportunities' | null>(null);

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(180deg, #0B0819 0%, #12102a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* SECTION 1 — AI Welcome Card */}
        <section className="mb-6">
          <div className="rounded-3xl p-6 md:p-8 border-2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#00F2FE' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                  <Bot size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold font-display" style={{ color: '#D4AF37' }}>🤖 VLOOP AI Assistant™</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Helping you make better shopping, contribution, and business decisions.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <button onClick={() => setActiveSection('suggestions')} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}>
                  <MessageCircle size={16} /> Ask AI
                </button>
                <button onClick={() => setActiveSection('suggestions')} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] flex items-center gap-2" style={{ background: 'rgba(0,242,254,0.1)', border: '1.5px solid rgba(0,242,254,0.3)', color: '#00F2FE' }}>
                  <Lightbulb size={16} /> My Suggestions
                </button>
                <button onClick={() => setActiveSection('opportunities')} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                  <MapPin size={16} /> Nearby Opportunities
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Personalized Suggestions */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Lightbulb size={18} style={{ color: '#D4AF37' }} /> Personalized Suggestions</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {personalizedSuggestions.map((s) => {
              const Icon = ICON_MAP[s.icon] || Lightbulb;
              return (
                <div key={s.id} className="rounded-2xl p-4 border flex items-start gap-3 transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${s.color}20` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3 — Hyper-Local Opportunities */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><MapPin size={18} style={{ color: '#00F2FE' }} /> Hyper-Local Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {hyperLocalOpportunities.map((o) => {
              const Icon = ICON_MAP[o.icon] || MapPin;
              return (
                <div key={o.id} className="rounded-2xl p-4 border flex items-start gap-3 transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${o.color}20` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${o.color}15` }}>
                    <Icon size={20} style={{ color: o.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white">{o.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{o.desc}</p>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg shrink-0" style={{ background: `${o.color}10`, color: o.color }}>
                    <MapPin size={10} /> {o.distance}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4 — SmartCode Progress Assistant */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Ticket size={18} style={{ color: '#D4AF37' }} /> SmartCode Progress Assistant</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <ProgressStat label="Current SmartCodes" value={smartCodeProgress.currentSmartCodes.toString()} color="#D4AF37" />
              <ProgressStat label="Suggested Next Goal" value={smartCodeProgress.suggestedNextGoal.toString()} color="#00F2FE" />
              <ProgressStat label="Weekly Progress" value={`${smartCodeProgress.estimatedWeeklyProgress}%`} color="#22c55e" />
              <ProgressStat label="Reward Tier" value="Premium" color="#818cf8" />
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${smartCodeProgress.estimatedWeeklyProgress}%`, background: 'linear-gradient(90deg, #D4AF37, #00F2FE)' }} />
            </div>
            <div className="rounded-xl p-3 border flex items-start gap-2" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.2)' }}>
              <Info size={14} style={{ color: '#D4AF37' }} className="shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">{smartCodeProgress.rewardTierGuidance}</p>
            </div>
            <div className="mt-2 text-[10px] text-gray-600 text-center">Mock visualization only · AI never predicts winners or calculates rewards</div>
          </div>
        </section>

        {/* SECTION 5 — SmartPoints Guide */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Sparkles size={18} style={{ color: '#D4AF37' }} /> SmartPoints Guide</h2>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {smartPointsGuide.map((step, idx) => {
                const Icon = ICON_MAP[step.icon] || Sparkles;
                return (
                  <div key={step.id} className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col items-center text-center w-20">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5" style={{ background: 'rgba(212,175,55,0.1)', border: '1.5px solid rgba(212,175,55,0.3)' }}>
                        <Icon size={18} style={{ color: '#D4AF37' }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 leading-tight">{step.label}</span>
                    </div>
                    {idx < smartPointsGuide.length - 1 && <ChevronRight size={14} className="shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[10px] text-gray-600 text-center">Visual guide only</div>
          </div>
        </section>

        {/* SECTION 6 — Care Club Guidance */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><HandHeart size={18} style={{ color: '#ef4444' }} /> Care Club Guidance</h2>
            <div className="space-y-3">
              <GuidanceRow icon={Clock} color="#fbbf24" text={careClubGuidance.contributionReminder} />
              <GuidanceRow icon={Info} color="#00F2FE" text={careClubGuidance.communitySupportInfo} />
              <GuidanceRow icon={ShieldCheck} color="#ef4444" text={careClubGuidance.emergencyAssistanceNotice} />
            </div>
            <div className="mt-3 rounded-xl p-3 border flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <Lock size={14} style={{ color: '#ef4444' }} className="shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">Eligibility is always reviewed by VLOOP. AI never guarantees support.</p>
            </div>
          </div>
        </section>

        {/* SECTION 7 — Business Growth Suggestions */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><TrendingUp size={18} style={{ color: '#D4AF37' }} /> Business Growth Suggestions</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {businessGrowthSuggestions.map((b) => {
              const Icon = ICON_MAP[b.icon] || TrendingUp;
              return (
                <div key={b.id} className="rounded-2xl p-4 border flex items-start gap-3 transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${b.color}20` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.color}15` }}>
                    <Icon size={20} style={{ color: b.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{b.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: `${b.color}15`, color: b.color }}>{b.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 8 — Hyper-Local Business Discovery */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><MapPin size={18} style={{ color: '#00F2FE' }} /> Hyper-Local Business Discovery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {businessDiscovery.map((d) => {
              const Icon = ICON_MAP[d.icon] || Store;
              return (
                <div key={d.id} className="rounded-2xl p-4 border text-center transition-all hover:scale-[1.03]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${d.color}20` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ background: `${d.color}15` }}>
                    <Icon size={22} style={{ color: d.color }} />
                  </div>
                  <div className="text-sm font-bold text-white">{d.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{d.desc}</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-[10px]" style={{ color: d.color }}>
                    <MapPin size={10} /> {d.location}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 9 — Weekly Challenge Assistant */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Trophy size={18} style={{ color: '#D4AF37' }} /> Weekly Challenge Assistant</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <ProgressStat label="Current Tier" value={weeklyChallengeAssistant.currentTier} color="#22c55e" />
              <ProgressStat label="Next Tier" value={weeklyChallengeAssistant.nextTier} color="#818cf8" />
              <ProgressStat label="Remaining SmartPoints" value={weeklyChallengeAssistant.remainingSmartPoints.toString()} color="#D4AF37" />
              <ProgressStat label="Current SmartCodes" value={weeklyChallengeAssistant.currentSmartCodes.toString()} color="#00F2FE" />
            </div>
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Lightbulb size={14} style={{ color: '#D4AF37' }} /> Suggested Actions</h3>
              <div className="space-y-2">
                {weeklyChallengeAssistant.suggestedActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} style={{ color: '#22c55e' }} className="shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-300">{action}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 text-[10px] text-gray-600 text-center">Motivational guidance only · AI never predicts winning numbers or displays probabilities</div>
          </div>
        </section>

        {/* SECTION 10 — AI Insight Timeline */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Clock size={18} style={{ color: '#D4AF37' }} /> AI Insight Timeline</h2>
            <div className="space-y-0">
              {aiInsightTimeline.map((item, idx) => {
                const Icon = ICON_MAP[item.icon] || Clock;
                const isCompleted = item.status === 'completed';
                const isCurrent = item.status === 'current';
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{
                        background: isCompleted ? 'rgba(212,175,55,0.15)' : isCurrent ? 'rgba(0,242,254,0.15)' : 'rgba(255,255,255,0.03)',
                        border: isCompleted ? '1.5px solid #D4AF37' : isCurrent ? '1.5px solid #00F2FE' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isCurrent ? '0 0 16px rgba(0,242,254,0.25)' : 'none',
                      }}>
                        <Icon size={20} style={{ color: isCompleted ? '#D4AF37' : isCurrent ? '#00F2FE' : 'rgba(255,255,255,0.25)' }} />
                      </div>
                      {idx < aiInsightTimeline.length - 1 && <div className="w-0.5 h-8 mt-1" style={{ background: isCompleted ? '#D4AF37' : 'rgba(255,255,255,0.08)' }} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isCurrent ? '#00F2FE' : '#6b7280' }}>{item.period}</div>
                      <div className={`text-sm font-bold ${isCurrent ? 'text-cyan-400' : 'text-white'}`}>{item.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Disclaimer */}
        <section className="mb-6">
          <div className="rounded-2xl p-4 border flex items-start gap-3" style={{ background: 'rgba(0,242,254,0.05)', borderColor: 'rgba(0,242,254,0.2)' }}>
            <ShieldCheck size={18} style={{ color: '#00F2FE' }} className="shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">
              VLOOP AI Assistant™ is an informational assistant only. It provides recommendations using mock/demo data.
              It never controls SmartPoints, SmartCode results, reward winners, weekly challenge logic, or VCOS calculations.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================
function ProgressStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

function GuidanceRow({ icon: Icon, color, text }: { icon: any; color: string; text: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <Icon size={16} style={{ color }} className="shrink-0 mt-0.5" />
      <p className="text-xs text-gray-300">{text}</p>
    </div>
  );
}
