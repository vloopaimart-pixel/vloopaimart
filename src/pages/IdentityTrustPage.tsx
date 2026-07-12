import { useState } from 'react';
import {
  Shield, BadgeCheck, AlertTriangle, CheckCircle, Clock, XCircle,
  Mail, Smartphone, CreditCard, MapPin, Building2, Globe, Lock,
  Award, TrendingUp, ShoppingBag, Truck, MessageSquare, Users,
  Activity, Key, Eye, Download, Trash2, Bell, BarChart3, FileText,
  Ban, UserCheck, Leaf, Home, Mountain, Palette, Store,
  Zap, Wrench, Car, BookOpen, Stethoscope, Sparkles, Briefcase,
  Bot, UserX, Laptop, Gift, Hash, ShoppingCart, Monitor, Fingerprint,
  History, Handshake, ChevronRight, Info, Star, Crown, CircleDollarSign, ShieldCheck,
} from 'lucide-react';
import {
  IDENTITY_VERIFICATIONS,
  IDENTITY_PROGRESS,
  TRUST_FACTORS,
  TRUST_TIER_CONFIG,
  calculateTrustTier,
  SELLER_VERIFICATIONS,
  COMMUNITY_SELLER_CATEGORIES,
  SERVICE_PROFESSIONS,
  SERVICE_VERIFICATION_STEPS,
  THREAT_DETECTIONS,
  CURRENT_RISK_LEVEL,
  COMPLIANCE_RULES,
  TRUST_BADGES,
  SECURITY_ITEMS,
  LOGIN_HISTORY,
  PRIVACY_CONTROLS,
  ADMIN_PENDING_ITEMS,
  AUDIT_LOGS,
  LEGAL_LINKS,
  VCOS_LEGAL_LOCK,
  DESIGN_TOKENS,
  type TrustTier,
  type RiskLevel,
} from '../lib/identityTrustMockData';

type IdentityTrustPageProps = {
  onNavigate: (page: string) => void;
};

export default function IdentityTrustPage({ onNavigate }: IdentityTrustPageProps) {
  const [activeTab, setActiveTab] = useState<'identity' | 'trust' | 'security' | 'compliance'>('identity');
  const currentTier = calculateTrustTier(TRUST_FACTORS);

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Shield className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 25 • VCOS™ Identity & Trust</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>
            Global Identity & Trust Infrastructure
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Universal verification, trust scoring, security, and compliance system
          </p>
        </section>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { id: 'identity', label: 'Identity Center', icon: BadgeCheck },
            { id: 'trust', label: 'Trust System', icon: Award },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'compliance', label: 'Compliance', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? ''
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' } : {}}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODULE 1: IDENTITY CENTER */}
        {activeTab === 'identity' && (
          <div className="space-y-8">
            {/* Identity Progress */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <BadgeCheck className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Identity Verification Center</h2>
                    <p className="text-sm text-gray-400">Complete your verification to unlock all features</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(0,242,254,0.1)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Identity Verification Progress</span>
                    <span className="text-sm font-bold" style={{ color: '#00F2FE' }}>{IDENTITY_PROGRESS.percentage}%</span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${IDENTITY_PROGRESS.percentage}%`, background: 'linear-gradient(90deg, #00F2FE, #D4AF37)' }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-400">{IDENTITY_PROGRESS.completed} of {IDENTITY_PROGRESS.total} verifications complete</div>
                </div>

                {/* Verification Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {IDENTITY_VERIFICATIONS.map((item) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      Mail, Smartphone, CreditCard, MapPin, Building2, Globe,
                    };
                    const Icon = iconMap[item.icon] || BadgeCheck;
                    const statusColors = {
                      verified: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' },
                      pending: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
                      unverified: { bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.3)', text: '#6b7280' },
                      rejected: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
                    };
                    const colors = statusColors[item.status];

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <Icon className="w-5 h-5" style={{ color: colors.text }} />
                          </div>
                          {item.status === 'verified' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                          {item.status === 'pending' && <Clock className="w-5 h-5 text-amber-400" />}
                          {item.status === 'unverified' && <XCircle className="w-5 h-5 text-gray-500" />}
                        </div>
                        <div className="font-semibold text-white mb-1">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                        {item.verified_at && (
                          <div className="text-xs mt-2" style={{ color: colors.text }}>Verified: {item.verified_at}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 3: Verified Seller */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <Store className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Verified Seller Program</h2>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Pending</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SELLER_VERIFICATIONS.map((item) => {
                    const statusColors = {
                      verified: '#22c55e',
                      pending: '#fbbf24',
                      unverified: '#6b7280',
                      rejected: '#ef4444',
                    };

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl text-center"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {item.status === 'verified' && <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />}
                        {item.status === 'pending' && <Clock className="w-5 h-5 mx-auto mb-2 text-amber-400" />}
                        {item.status === 'unverified' && <XCircle className="w-5 h-5 mx-auto mb-2 text-gray-500" />}
                        <div className="text-sm text-white">{item.name}</div>
                        <div className="text-xs mt-1" style={{ color: statusColors[item.status] }}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(212,175,55,0.1)' }}>
                  <BadgeCheck className="w-6 h-6" style={{ color: '#D4AF37' }} />
                  <div>
                    <div className="font-semibold text-white">VERIFIED SELLER Badge</div>
                    <div className="text-xs text-gray-400">Earn this badge after completing all verifications</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Module 4: Community Seller */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Community Seller Programs</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {COMMUNITY_SELLER_CATEGORIES.map((cat) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      Leaf, Home, Mountain, Palette, Store,
                    };
                    const Icon = iconMap[cat.icon] || Store;

                    return (
                      <div
                        key={cat.id}
                        className="p-4 rounded-xl text-center"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                        <div className="text-sm text-white">{cat.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{cat.verified ? 'Verified' : 'Available'}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <Users className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">COMMUNITY VERIFIED Badge</div>
                    <div className="text-xs text-gray-400">For farmers, homemakers, and local artisans</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Module 5: Service Professionals */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <Wrench className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Service Professionals</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {SERVICE_PROFESSIONS.map((prof) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      Zap, Wrench, Car, Truck, BookOpen, Stethoscope, Sparkles, Briefcase,
                    };
                    const Icon = iconMap[prof.icon] || Wrench;

                    return (
                      <div
                        key={prof.id}
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}
                      >
                        <Icon className="w-5 h-5 mb-2" style={{ color: '#00F2FE' }} />
                        <div className="font-semibold text-white text-sm">{prof.name}</div>
                        <div className="text-xs text-gray-400">{prof.verified_providers} verified</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2">
                  {SERVICE_VERIFICATION_STEPS.map((step) => (
                    <span
                      key={step.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        background: step.status === 'required' ? 'rgba(239,68,68,0.15)' : step.status === 'optional' ? 'rgba(107,114,128,0.15)' : 'rgba(34,197,94,0.15)',
                        color: step.status === 'required' ? '#f87171' : step.status === 'optional' ? '#9ca3af' : '#34d399',
                      }}
                    >
                      {step.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* MODULE 2: VTS™ TRUST SYSTEM */}
        {activeTab === 'trust' && (
          <div className="space-y-8">
            {/* Trust Tier Display */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <Award className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">VTS™ — VLOOP Trust System</h2>
                    <p className="text-sm text-gray-400">Your trust level is calculated from multiple factors</p>
                  </div>
                </div>

                {/* Current Tier */}
                <div className="p-6 rounded-xl text-center mb-6" style={{ background: TRUST_TIER_CONFIG[currentTier].color + '20', border: `2px solid ${TRUST_TIER_CONFIG[currentTier].color}` }}>
                  <Crown className="w-12 h-12 mx-auto mb-3" style={{ color: TRUST_TIER_CONFIG[currentTier].color }} />
                  <div className="text-4xl font-bold mb-2" style={{ color: TRUST_TIER_CONFIG[currentTier].color }}>{currentTier}</div>
                  <div className="text-sm text-gray-400">Current Trust Tier</div>
                </div>

                {/* Tier Progression */}
                <div className="flex items-center justify-between gap-2 mb-6 overflow-x-auto pb-2">
                  {(Object.keys(TRUST_TIER_CONFIG) as TrustTier[]).map((tier, idx, arr) => (
                    <div key={tier} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          tier === currentTier ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''
                        }`}
                        style={{
                          background: TRUST_TIER_CONFIG[tier].color,
                          color: '#0B0819',
                        }}
                      >
                        {idx + 1}
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="w-8 md:w-16 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Trust Factors */}
                <h3 className="font-bold text-white mb-4">Trust Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TRUST_FACTORS.map((factor) => (
                    <div key={factor.id} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{factor.name}</span>
                        <span className="text-xs text-gray-500">Weight: {factor.weight}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(factor.score / factor.max_score) * 100}%`,
                            background: factor.score >= 80 ? '#22c55e' : factor.score >= 50 ? '#fbbf24' : '#ef4444',
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>{factor.score}%</span>
                        <span>Max: {factor.max_score}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Tier Benefits */}
                <div className="mt-6 p-4 rounded-xl" style={{ background: TRUST_TIER_CONFIG[currentTier].color + '15' }}>
                  <h3 className="font-semibold text-white mb-3">{currentTier} Tier Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {TRUST_TIER_CONFIG[currentTier].benefits.map((benefit) => (
                      <span key={benefit} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: TRUST_TIER_CONFIG[currentTier].color + '30', color: '#fff' }}>
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Module 6: AI Trust Shield */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: CURRENT_RISK_LEVEL === 'green' ? 'rgba(34,197,94,0.15)' : CURRENT_RISK_LEVEL === 'yellow' ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)' }}>
                    <Shield className="w-5 h-5" style={{ color: CURRENT_RISK_LEVEL === 'green' ? '#22c55e' : CURRENT_RISK_LEVEL === 'yellow' ? '#fbbf24' : '#ef4444' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Trust Shield</h2>
                    <p className="text-sm text-gray-400">Real-time threat detection</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: CURRENT_RISK_LEVEL === 'green' ? 'rgba(34,197,94,0.15)' : CURRENT_RISK_LEVEL === 'yellow' ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)' }}>
                    <div className={`w-2 h-2 rounded-full ${CURRENT_RISK_LEVEL === 'green' ? 'bg-emerald-500' : CURRENT_RISK_LEVEL === 'yellow' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-xs font-bold" style={{ color: CURRENT_RISK_LEVEL === 'green' ? '#22c55e' : CURRENT_RISK_LEVEL === 'yellow' ? '#fbbf24' : '#ef4444' }}>
                      {CURRENT_RISK_LEVEL.toUpperCase()} ZONE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {(['green', 'yellow', 'red'] as RiskLevel[]).map((level) => (
                    <div
                      key={level}
                      className="p-3 rounded-xl text-center"
                      style={{
                        background: level === 'green' ? 'rgba(34,197,94,0.15)' : level === 'yellow' ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)',
                        border: `2px solid ${level === CURRENT_RISK_LEVEL ? (level === 'green' ? '#22c55e' : level === 'yellow' ? '#fbbf24' : '#ef4444') : 'transparent'}`,
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full mx-auto ${level === 'green' ? 'bg-emerald-500' : level === 'yellow' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <div className="text-xs text-white mt-2 capitalize">{level}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                  {THREAT_DETECTIONS.map((threat) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      UserX, Bot, Laptop, Users, Gift, Hash, MessageSquare, ShoppingCart, MapPin,
                    };
                    const Icon = iconMap[threat.icon] || AlertTriangle;
                    const severityColors = {
                      low: 'rgba(34,197,94,0.15)',
                      medium: 'rgba(251,191,36,0.15)',
                      high: 'rgba(249,115,22,0.15)',
                      critical: 'rgba(239,68,68,0.15)',
                    };

                    return (
                      <div
                        key={threat.id}
                        className="p-3 rounded-xl"
                        style={{ background: severityColors[threat.severity], border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-gray-400" />
                          {threat.detected ? (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <div className="text-xs text-white">{threat.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 8: Public Trust Badges */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <Award className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Public Trust Badges</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {TRUST_BADGES.map((badge) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      BadgeCheck, Store, Users, Truck, Handshake, Shield,
                    };
                    const Icon = iconMap[badge.icon] || Award;

                    return (
                      <div
                        key={badge.id}
                        className="p-4 rounded-xl flex items-center gap-3"
                        style={{
                          background: badge.earned ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${badge.earned ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.earned ? '' : 'opacity-50'}`} style={{ background: badge.earned ? 'linear-gradient(135deg, #D4AF37, #B8941F)' : 'rgba(255,255,255,0.1)' }}>
                          <Icon className="w-6 h-6" style={{ color: badge.earned ? '#0B0819' : '#6b7280' }} />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{badge.name}</div>
                          <div className="text-xs text-gray-400">{badge.description}</div>
                          {badge.earned && (
                            <div className="text-xs mt-1" style={{ color: '#D4AF37' }}>Earned</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* MODULE 9: SECURITY CENTER */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <Lock className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Security Center</h2>
                    <p className="text-sm text-gray-400">Manage your account security</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SECURITY_ITEMS.map((item) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      History, Monitor, ShieldCheck, Activity, Key, Fingerprint, Smartphone,
                    };
                    const Icon = iconMap[item.icon] || Lock;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl flex items-center gap-4"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: item.status === 'enabled' ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)' }}>
                          <Icon className="w-6 h-6" style={{ color: item.status === 'enabled' ? '#22c55e' : '#6b7280' }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-xs text-gray-400 capitalize">{item.status}</div>
                        </div>
                        {item.status === 'enabled' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Login History */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <History className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Recent Login Activity</h2>
                </div>

                <div className="space-y-3">
                  {LOGIN_HISTORY.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-white font-medium">{log.device}</div>
                          <div className="text-xs text-gray-400">{log.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{new Date(log.time).toLocaleString()}</div>
                        <span className={`text-xs font-medium ${log.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 10: Privacy Center */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <Eye className="w-5 h-5 text-violet-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Privacy Center</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRIVACY_CONTROLS.map((control) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      download_data: Download,
                      delete_account: Trash2,
                      notifications: Bell,
                      marketing: Bell,
                      insurance_consent: Shield,
                      analytics_consent: BarChart3,
                      academy_consent: BookOpen,
                    };
                    const Icon = iconMap[control.id] || Eye;

                    return (
                      <div
                        key={control.id}
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-violet-400" />
                          <span className="font-medium text-white">{control.name}</span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">{control.description}</div>
                        <div className={`text-xs font-medium ${control.status === 'enabled' ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {control.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* MODULES 7, 11-14: COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div className="space-y-8">
            {/* Module 7: Global Compliance */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <Globe className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Global Compliance Center</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(COMPLIANCE_RULES).map(([key, rule]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}
                    >
                      <div className="text-xs text-gray-400 mb-1">{rule.name}</div>
                      <div className="text-sm text-white font-medium">{rule.current_value}</div>
                      <div className="text-xs mt-2" style={{ color: '#00F2FE' }}>Configurable</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 11: Admin Dashboard Preview */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <BarChart3 className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Admin Dashboard Preview</h2>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>Admin Only</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(ADMIN_PENDING_ITEMS).map(([key, value]) => {
                    const isAlert = ['fraud_alerts', 'compliance_alerts', 'manual_reviews'].includes(key);
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-xl text-center"
                        style={{
                          background: isAlert && value > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isAlert && value > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        <div className="text-2xl font-bold" style={{ color: isAlert && value > 0 ? '#ef4444' : '#fff' }}>{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 12: Audit Logs */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Audit Log Engine</h2>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Immutable</span>
                </div>

                <div className="space-y-2">
                  {AUDIT_LOGS.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-sm text-white">{log.action}</div>
                          <div className="text-xs text-gray-400">{log.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</div>
                        <div className="text-xs text-emerald-400">Immutable</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 14: VCOS Legal Lock */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">VCOS™ Legal Lock</h2>
                    <p className="text-sm text-gray-400">Always Enforced Compliance Rules</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {VCOS_LEGAL_LOCK.map((item) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      Award, Ban, CircleDollarSign, ShieldCheck, CreditCard, Lock, UserCheck, FileText,
                    };
                    const Icon = iconMap[item.icon] || CheckCircle;

                    return (
                      <div
                        key={item.rule}
                        className="p-3 rounded-xl text-center"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
                      >
                        <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                        <div className="text-xs text-white">{item.rule}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 13: Legal Center Links */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <FileText className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Legal Center</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {LEGAL_LINKS.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => onNavigate(link.page)}
                      className="p-4 rounded-xl text-left transition-all hover:bg-white/10"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="font-medium text-white">{link.name}</div>
                      <ChevronRight className="w-4 h-4 text-gray-500 mt-1" />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}
          >
            <ChevronRight className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => onNavigate('security-center')}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Shield className="w-4 h-4" />
            Security Center
          </button>
        </div>

      </div>
    </div>
  );
}
