import {
  Globe, Home, Car, GraduationCap, Wheat, Briefcase, Monitor, Factory,
  Leaf, HeartPulse, Users, ShieldCheck, Award, Sparkles, Rocket, Store,
  HandHeart, ShoppingBag, Calendar, User, Ticket, ChevronRight, Info, Lock,
} from 'lucide-react';
import {
  opportunityCategories, opportunityJourney, featuredPrograms,
  communityGrowth, opportunityTimeline, aiOpportunitySuggestions,
} from '../lib/foeMockData';

type Props = { onNavigate: (page: string) => void };

const ICON_MAP: Record<string, any> = {
  Globe, Home, Car, GraduationCap, Wheat, Briefcase, Monitor, Factory,
  Leaf, HeartPulse, Users, ShieldCheck, Award, Sparkles, Rocket, Store,
  HandHeart, ShoppingBag, Calendar, User, Ticket,
};

export default function FOEPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(180deg, #0B0819 0%, #12102a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* SECTION 1 — Hero Banner */}
        <section className="mb-6">
          <div className="rounded-3xl p-6 md:p-8 border-2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#00F2FE' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                  <Globe size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold font-display" style={{ color: '#D4AF37' }}>🌍 Future Opportunity Exchange™</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Today's participation. Tomorrow's opportunities.</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Sparkles size={14} style={{ color: '#D4AF37' }} />
                <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>FOE™ Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Opportunity Categories */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3">Opportunity Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {opportunityCategories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Sparkles;
              return (
                <div key={cat.id} className="rounded-2xl p-4 border text-center transition-all hover:scale-[1.03]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${cat.color}20` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ background: `${cat.color}15` }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">{cat.label}</div>
                  <div className="text-[10px] text-gray-500 mt-1.5 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(212,175,55,0.1)' }}>Future Program</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3 — Opportunity Journey */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Sparkles size={18} style={{ color: '#D4AF37' }} /> Opportunity Journey</h2>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {opportunityJourney.map((step, idx) => {
                const Icon = ICON_MAP[step.icon] || Sparkles;
                return (
                  <div key={step.id} className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col items-center text-center w-20">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5" style={{ background: 'rgba(212,175,55,0.1)', border: '1.5px solid rgba(212,175,55,0.3)' }}>
                        <Icon size={18} style={{ color: '#D4AF37' }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 leading-tight">{step.label}</span>
                    </div>
                    {idx < opportunityJourney.length - 1 && <ChevronRight size={14} className="shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[10px] text-gray-600 text-center">Informational only</div>
          </div>
        </section>

        {/* SECTION 4 — Featured Programs */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3">Featured Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredPrograms.map((program) => {
              const Icon = ICON_MAP[program.icon] || Sparkles;
              return (
                <div key={program.id} className="rounded-2xl p-5 border-2 transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: `${program.color}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${program.color}15` }}>
                      <Icon size={22} style={{ color: program.color }} />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${program.color}15`, color: program.color }}>{program.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{program.title}</h3>
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">{program.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Future Program</span>
                    <button className="flex items-center gap-1 text-xs font-bold transition-colors" style={{ color: program.color }}>
                      Learn More <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5 — Community Growth */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(0,242,254,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Users size={18} style={{ color: '#00F2FE' }} /> Community Growth</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {communityGrowth.map((g) => {
                const Icon = ICON_MAP[g.icon] || Users;
                return (
                  <div key={g.id} className="rounded-2xl p-4 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${g.color}15` }}>
                      <Icon size={18} style={{ color: g.color }} />
                    </div>
                    <div className="text-lg font-bold" style={{ color: g.color }}>{g.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{g.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[10px] text-gray-600 text-center">Mock values only · Showing ecosystem growth</div>
          </div>
        </section>

        {/* SECTION 6 — Opportunity Timeline */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Calendar size={18} style={{ color: '#D4AF37' }} /> Opportunity Timeline</h2>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {opportunityTimeline.map((step, idx) => {
                const Icon = ICON_MAP[step.icon] || Calendar;
                const isLast = idx === opportunityTimeline.length - 1;
                return (
                  <div key={step.id} className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col items-center text-center w-20">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5" style={{
                        background: isLast ? 'rgba(0,242,254,0.15)' : 'rgba(212,175,55,0.1)',
                        border: isLast ? '1.5px solid #00F2FE' : '1.5px solid rgba(212,175,55,0.3)',
                        boxShadow: isLast ? '0 0 16px rgba(0,242,254,0.2)' : 'none',
                      }}>
                        <Icon size={18} style={{ color: isLast ? '#00F2FE' : '#D4AF37' }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 leading-tight">{step.label}</span>
                    </div>
                    {idx < opportunityTimeline.length - 1 && <ChevronRight size={14} className="shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7 — AI Opportunity Suggestions */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Sparkles size={18} style={{ color: '#D4AF37' }} /> AI Opportunity Suggestions</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {aiOpportunitySuggestions.map((s) => {
              const Icon = ICON_MAP[s.icon] || Sparkles;
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
          <div className="mt-2 text-[10px] text-gray-600 text-center">Mock recommendations only</div>
        </section>

        {/* SECTION 8 — Future Vision */}
        <section className="mb-6">
          <div className="rounded-3xl p-6 md:p-8 border-2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
            <div className="relative text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                <Globe size={30} className="text-white" />
              </div>
              <h2 className="text-xl font-bold font-display mb-3" style={{ color: '#D4AF37' }}>Building Opportunities Together</h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Through everyday participation — shopping, contributing, and community engagement —
                VLOOP members build trust and reputation that unlock long-term economic and community
                opportunities. Together, we are creating a future where participation today becomes
                opportunity tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 9 — Important Notice */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border-2" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <Lock size={20} style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Important Notice</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Future Opportunity programs are informational previews. Availability depends on future
                  program launches, regional policies, eligibility verification, and organizational approval.
                  Nothing shown here represents a guaranteed benefit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
