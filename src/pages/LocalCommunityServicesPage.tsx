import { useState } from 'react';
import {
  Zap, Wrench, Car, Hammer, Sparkles, HeartPulse, GraduationCap,
  Monitor, Package, Wheat, Utensils, Scissors,
  Star, MapPin, Clock, BadgeCheck, ArrowRight, Mic, X,
  CheckCircle2, Ticket, Trophy, ShieldCheck, Lock, Eye, HandHeart,
  Pill, Droplet, Users, Award, Home, Navigation,
} from 'lucide-react';
import {
  serviceCategories, serviceProviders, trustProfile,
  smartEconomyFlow, careClubReminders, vcosProtection,
  type ServiceProvider,
} from '../lib/localCommunityServicesMockData';

type Props = { onNavigate: (page: string) => void };

const ICON_MAP: Record<string, any> = {
  Zap, Wrench, Car, Hammer, Sparkles, HeartPulse, GraduationCap,
  Monitor, Package, Wheat, Utensils, Scissors,
  CheckCircle2, Ticket, Trophy, ShieldCheck, Lock, Eye, HandHeart,
  Pill, Droplet, Users, BadgeCheck, Award,
};

export default function LocalCommunityServicesPage({ onNavigate }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const filteredProviders = selectedCategory
    ? serviceProviders.filter((p) => p.category === selectedCategory)
    : serviceProviders;

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(180deg, #0B0819 0%, #12102a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <section className="mb-6">
          <div className="rounded-3xl p-6 md:p-8 border-2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#00F2FE' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Home size={28} style={{ color: '#D4AF37' }} />
                <h1 className="text-2xl md:text-3xl font-bold font-display" style={{ color: '#D4AF37' }}>
                  Local Community Services™
                </h1>
              </div>
              <p className="text-sm md:text-base text-gray-400 mb-3">Find trusted people near you.</p>
              <p className="text-sm font-semibold mb-4" style={{ color: '#00F2FE' }}>Work • Service • Community</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <BadgeCheck size={16} style={{ color: '#22c55e' }} />
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>VCOS™ Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-3">Choose a Service</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {serviceCategories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Sparkles;
              const isActive = selectedCategory === cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? null : cat.label)}
                  className="rounded-2xl p-4 border text-center transition-all hover:scale-[1.03]"
                  style={{
                    background: isActive ? `${cat.color}15` : 'rgba(255,255,255,0.04)',
                    borderColor: isActive ? `${cat.color}80` : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ background: `${cat.color}15` }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div className="text-xs font-bold text-white">{cat.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{cat.providerCount} nearby</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Voice Request */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: 'rgba(212,175,55,0.3)' }}>
            <button
              onClick={() => { setVoiceActive(!voiceActive); setTimeout(() => setVoiceActive(false), 3000); }}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: voiceActive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #D4AF37, #B8941F)',
                boxShadow: voiceActive ? '0 0 24px rgba(239,68,68,0.4)' : '0 0 16px rgba(212,175,55,0.3)',
              }}
            >
              <Mic size={28} className="text-white" />
            </button>
            <div className="mt-3 text-center">
              {voiceActive ? (
                <>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Listening...
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Describe the service you need.</p>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-white">🎤 Voice Request</div>
                  <p className="text-xs text-gray-500 mt-1">Tap and speak to find a service</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Nearby Area Preview */}
        <section className="mb-6">
          <div className="rounded-2xl p-6 border-2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: 'rgba(0,242,254,0.3)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Navigation size={18} style={{ color: '#00F2FE' }} /> Nearby Area Preview</h2>
            <div className="relative h-48 rounded-2xl overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,242,254,0.08), rgba(11,8,25,0.5))' }}>
              {/* You */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.2)', border: '2px solid #00F2FE', boxShadow: '0 0 20px rgba(0,242,254,0.3)' }}>
                  <span className="text-xs font-bold" style={{ color: '#00F2FE' }}>You</span>
                </div>
              </div>
              {/* Nearby Providers */}
              {[
                { top: '20%', left: '25%' }, { top: '30%', left: '70%' },
                { top: '70%', left: '30%' }, { top: '65%', left: '75%' },
              ].map((pos, i) => (
                <div key={i} className="absolute flex flex-col items-center" style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1.5px solid #D4AF37' }}>
                    <BadgeCheck size={14} style={{ color: '#D4AF37' }} />
                  </div>
                </div>
              ))}
              {/* Verified Service Area Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full" style={{ border: '1.5px dashed rgba(0,242,254,0.3)' }} />
              {/* Labels */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#00F2FE' }} />
                <span className="text-[10px] text-gray-300">You</span>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
                <span className="text-[10px] text-gray-300">Nearby Providers</span>
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="w-3 h-3 rounded-full" style={{ border: '1px dashed #00F2FE' }} />
                <span className="text-[10px] text-gray-300">Verified Service Area</span>
              </div>
            </div>
          </div>
        </section>

        {/* Provider Cards */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">
              {selectedCategory ? `${selectedCategory} Providers` : 'Trusted Providers Near You'}
            </h2>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-xs text-gray-500 hover:text-gray-300">Clear filter</button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onRequest={() => setSelectedProvider(provider)} />
            ))}
          </div>
          {filteredProviders.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">No providers found for {selectedCategory}. Try another category.</div>
          )}
        </section>

        {/* Trust Profile */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck size={18} style={{ color: '#D4AF37' }} /> Trust Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <TrustStat icon={ShieldCheck} label="Trust Score" value={trustProfile.trustScore.toString()} color="#D4AF37" />
              <TrustStat icon={CheckCircle2} label="Completed Jobs" value={trustProfile.completedJobs.toString()} color="#22c55e" />
              <TrustStat icon={Star} label="Community Rating" value={trustProfile.communityRating.toString()} color="#fbbf24" />
              <TrustStat icon={BadgeCheck} label="Verified Identity" value={trustProfile.verifiedIdentity ? 'Yes' : 'No'} color="#00F2FE" />
            </div>
          </div>
        </section>

        {/* Community Information Card */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(0,242,254,0.05)', borderColor: 'rgba(0,242,254,0.2)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,242,254,0.15)' }}>
                <Users size={20} style={{ color: '#00F2FE' }} />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Community Services help local families earn through trusted work opportunities inside the VLOOP ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Smart Economy Flow */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><Sparkles size={18} style={{ color: '#D4AF37' }} /> Smart Economy Flow</h2>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {smartEconomyFlow.map((step, idx) => {
                const Icon = ICON_MAP[step.icon] || Sparkles;
                return (
                  <div key={step.id} className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col items-center text-center w-20">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5" style={{ background: 'rgba(212,175,55,0.1)', border: '1.5px solid rgba(212,175,55,0.3)' }}>
                        <Icon size={18} style={{ color: '#D4AF37' }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 leading-tight">{step.label}</span>
                    </div>
                    {idx < smartEconomyFlow.length - 1 && <ArrowRight size={14} className="shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[10px] text-gray-600 text-center">Mock visualization only · No calculations</div>
          </div>
        </section>

        {/* Care Club Reminder */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><HandHeart size={18} style={{ color: '#ef4444' }} /> Care Club Reminder</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {careClubReminders.map((item) => {
                const Icon = ICON_MAP[item.icon] || HandHeart;
                return (
                  <button key={item.id} onClick={() => onNavigate('careclub')} className="rounded-xl p-3 border text-center transition-all hover:scale-[1.03]" style={{ background: `${item.color}10`, borderColor: `${item.color}30` }}>
                    <div className="flex justify-center mb-1.5"><Icon size={18} style={{ color: item.color }} /></div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-500 text-center">Support is reviewed according to VLOOP eligibility policies.</p>
          </div>
        </section>

        {/* VCOS Protection Card */}
        <section className="mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(34,197,94,0.2)' }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck size={18} style={{ color: '#22c55e' }} /> VCOS Protection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vcosProtection.map((item) => {
                const Icon = ICON_MAP[item.icon] || ShieldCheck;
                return (
                  <div key={item.id} className="rounded-xl p-3 border text-center" style={{ background: `${item.color}10`, borderColor: `${item.color}25` }}>
                    <div className="flex justify-center mb-1.5"><Icon size={18} style={{ color: item.color }} /></div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA — Become a Service Provider */}
        <section className="mb-6">
          <div className="rounded-3xl p-6 md:p-8 border-2 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: '#D4AF37' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                <HandHeart size={30} className="text-white" />
              </div>
              <h2 className="text-xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>Become a Service Provider</h2>
              <p className="text-sm text-gray-400 mb-5">Join the VLOOP community and start earning through trusted work.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button className="py-3.5 px-5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}>
                  Start Helping
                </button>
                <button className="py-3.5 px-5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'rgba(0,242,254,0.1)', border: '1.5px solid rgba(0,242,254,0.3)', color: '#00F2FE' }}>
                  Start Earning
                </button>
                <button className="py-3.5 px-5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Request Service Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedProvider(null)}>
          <div className="rounded-3xl max-w-sm w-full overflow-hidden border-2 animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              <h3 className="text-lg font-bold font-display" style={{ color: '#D4AF37' }}>Request Service</h3>
              <button onClick={() => setSelectedProvider(null)} className="p-1 rounded-lg hover:bg-white/10"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '2px solid #D4AF37' }}>
                <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{selectedProvider.name.charAt(0)}</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">{selectedProvider.name}</h4>
              <p className="text-xs text-gray-500 mb-4">{selectedProvider.category} · {selectedProvider.distance} away</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <ModalStat label="Rating" value={`${selectedProvider.rating} ★`} color="#fbbf24" />
                <ModalStat label="Trust Score" value={selectedProvider.trustScore.toString()} color="#D4AF37" />
                <ModalStat label="Arrival" value={selectedProvider.arrivalTime} color="#00F2FE" />
                <ModalStat label="Jobs Done" value={selectedProvider.completedJobs.toString()} color="#22c55e" />
              </div>
              {selectedProvider.availableNow ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full mb-4" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available Now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full mb-4" style={{ background: 'rgba(156,163,175,0.15)', color: '#9ca3af' }}>
                  <Clock size={12} /> Currently Busy
                </span>
              )}
              <button className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}>
                Confirm Request
              </button>
              <p className="text-[10px] text-gray-600 mt-3">No phone numbers shared · Secure request via VLOOP</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Provider Card
// ============================================================
function ProviderCard({ provider, onRequest }: { provider: ServiceProvider; onRequest: () => void }) {
  return (
    <div className="rounded-2xl p-4 border transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-start gap-3 mb-3">
        {/* Profile Photo (initial-based placeholder) */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '1.5px solid rgba(212,175,55,0.3)' }}>
          <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>{provider.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-white truncate">{provider.name}</h3>
            {provider.verifiedIdentity && <BadgeCheck size={14} style={{ color: '#22c55e' }} />}
          </div>
          <p className="text-xs text-gray-500">{provider.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-xs" style={{ color: '#fbbf24' }}>
              <Star size={12} fill="currentColor" /> {provider.rating}
            </span>
            <span className="text-gray-600 text-[10px]">·</span>
            <span className="text-xs text-gray-400">Trust: {provider.trustScore}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <InfoChip icon={MapPin} label={provider.distance} color="#00F2FE" />
        <InfoChip icon={Clock} label={provider.arrivalTime} color="#D4AF37" />
        <InfoChip icon={CheckCircle2} label={provider.completedJobs + ' jobs'} color="#22c55e" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {provider.availableNow ? (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available Now
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ background: 'rgba(156,163,175,0.15)', color: '#9ca3af' }}>
              Busy
            </span>
          )}
          {provider.smartPointsEligible && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
              <Sparkles size={10} /> SP Eligible
            </span>
          )}
        </div>
        <button onClick={onRequest} className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.03]" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}>
          Request Service
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================
function TrustStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex justify-center mb-1.5"><Icon size={18} style={{ color }} /></div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function InfoChip({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg" style={{ background: `${color}10` }}>
      <Icon size={12} style={{ color }} />
      <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
    </div>
  );
}

function ModalStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-2.5 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
