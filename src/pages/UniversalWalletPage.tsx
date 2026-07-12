import { useState } from 'react';
import {
  Wallet, Plus, ArrowUpRight, ArrowRightLeft, History, Lock,
  Shield, Smartphone, Key, CheckCircle, AlertTriangle, TrendingUp,
  TrendingDown, Minus, ShoppingBag, Heart, Store, Wrench, Gift,
  Building2, CreditCard, Globe, Zap, ChevronRight, Info, Clock,
  ArrowDownRight, Eye, Sparkles, BadgeCheck,
} from 'lucide-react';
import {
  MOCK_WALLET_OVERVIEW,
  PAYMENT_METHODS,
  ESCROW_STEPS,
  MOCK_TRANSACTIONS,
  SECURITY_STATUSES,
  FUTURE_BANKING_FEATURES,
  WALLET_INSIGHTS,
  COMPLIANCE_NOTICE,
  WALLET_ACTIONS,
  formatCurrency,
  getTransactionColor,
} from '../lib/universalWalletMockData';

type UniversalWalletPageProps = {
  onNavigate: (page: string) => void;
};

export default function UniversalWalletPage({ onNavigate }: UniversalWalletPageProps) {
  const [showTransactions, setShowTransactions] = useState(false);

  const overview = MOCK_WALLET_OVERVIEW;

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Wallet className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 24 • Universal Wallet</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>
            Universal Wallet Experience
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your complete financial foundation for the VLOOP ecosystem
          </p>
        </section>

        {/* SECTION 1 — Wallet Overview */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                <Wallet className="w-6 h-6" style={{ color: '#0B0819' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Wallet Overview</h2>
                <p className="text-sm text-gray-400">Demo values • Interface preview</p>
              </div>
            </div>

            {/* Main Balance */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="col-span-2 md:col-span-1 p-5 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div className="text-sm text-gray-400 mb-1">Wallet Balance</div>
                <div className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{formatCurrency(overview.wallet_balance)}</div>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                <div className="text-sm text-gray-400 mb-1">Pending Balance</div>
                <div className="text-2xl font-bold text-amber-400">{formatCurrency(overview.pending_balance)}</div>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
                <div className="text-sm text-gray-400 mb-1">Escrow Balance</div>
                <div className="text-2xl font-bold text-violet-400">{formatCurrency(overview.escrow_balance)}</div>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <div className="text-sm text-gray-400 mb-1">Total Earned</div>
                <div className="text-2xl font-bold text-emerald-400">{formatCurrency(overview.total_earned)}</div>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(overview.total_spent)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Wallet Actions */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                <Zap className="w-5 h-5" style={{ color: '#00F2FE' }} />
              </div>
              <h2 className="text-xl font-bold text-white">Wallet Actions</h2>
              <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>Info Only</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {WALLET_ACTIONS.map((action) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  Plus: Plus,
                  ArrowUpRight: ArrowUpRight,
                  ArrowRightLeft: ArrowRightLeft,
                  History: History,
                  Lock: Lock,
                };
                const Icon = iconMap[action.icon] || Zap;

                return (
                  <button
                    key={action.id}
                    className="group p-4 rounded-xl transition-all hover:scale-[1.02] text-center"
                    style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                      <Icon className="w-6 h-6" style={{ color: '#0B0819' }} />
                    </div>
                    <div className="font-semibold text-white text-sm">{action.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3 — Payment Methods */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <CreditCard className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Payment Methods</h2>
                <p className="text-sm text-gray-400">Coming Soon — Future Integration</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {PAYMENT_METHODS.map((method) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  Smartphone: Smartphone,
                  CreditCard: CreditCard,
                  Building2: Building2,
                  Zap: Zap,
                  Wallet: Wallet,
                  Globe: Globe,
                };
                const Icon = iconMap[method.icon] || CreditCard;
                const categoryColors: Record<string, string> = {
                  upi: 'rgba(0,242,254,0.15)',
                  cards: 'rgba(212,175,55,0.15)',
                  banking: 'rgba(139,92,246,0.15)',
                  wallets: 'rgba(34,197,94,0.15)',
                  international: 'rgba(239,68,68,0.15)',
                };

                return (
                  <div
                    key={method.id}
                    className="p-4 rounded-xl text-center"
                    style={{ background: categoryColors[method.category], border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">{method.name}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>
                      {method.status === 'coming_soon' ? 'Coming Soon' : 'Future'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4 — Escrow Wallet */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <Lock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Escrow Wallet</h2>
                <p className="text-sm text-gray-400">Secure transaction protection</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ESCROW_STEPS.map((step, index) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  ArrowDownRight: ArrowDownRight,
                  Lock: Lock,
                  CheckCircle: CheckCircle,
                  ArrowUpRight: ArrowUpRight,
                };
                const Icon = iconMap[step.icon] || Lock;
                const colors = ['#00F2FE', '#D4AF37', '#22c55e', '#8b5cf6'];

                return (
                  <div key={step.id} className="relative">
                    <div className="p-5 rounded-xl text-center h-full" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: `rgba(${step.id === 2 ? '212,175,55' : step.id === 3 ? '34,197,94' : '0,242,254'},0.15)`, border: `2px solid ${colors[index]}` }}>
                        <Icon className="w-7 h-7" style={{ color: colors[index] }} />
                      </div>
                      <div className="font-bold text-white mb-1">{step.title}</div>
                      <div className="text-xs text-gray-400">{step.description}</div>
                    </div>
                    {index < ESCROW_STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5 — Transaction Timeline */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                <History className="w-5 h-5" style={{ color: '#00F2FE' }} />
              </div>
              <h2 className="text-xl font-bold text-white">Transaction Timeline</h2>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'rgba(0,242,254,0.15)', color: '#00F2FE' }}
              >
                {showTransactions ? 'Show Less' : 'View All'}
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_TRANSACTIONS.slice(0, showTransactions ? undefined : 5).map((tx) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  Purchase: ShoppingBag,
                  Contribution: Heart,
                  'Marketplace Sale': Store,
                  'Local Service Payment': Wrench,
                  'Reward Credit': Gift,
                  'Wallet Transfer': ArrowRightLeft,
                };
                const Icon = iconMap[tx.category] || ShoppingBag;
                const colorClass = getTransactionColor(tx.category);
                const statusColors: Record<string, string> = {
                  completed: 'rgba(34,197,94,0.15)',
                  pending: 'rgba(251,191,36,0.15)',
                  processing: 'rgba(0,242,254,0.15)',
                };
                const statusTextColors: Record<string, string> = {
                  completed: '#22c55e',
                  pending: '#fbbf24',
                  processing: '#00F2FE',
                };

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-all"
                    style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <Icon className="w-6 h-6" style={{ color: colorClass.includes('red') ? '#f87171' : colorClass.includes('emerald') ? '#34d399' : colorClass.includes('blue') ? '#60a5fa' : colorClass.includes('amber') ? '#fbbf24' : colorClass.includes('violet') ? '#a78bfa' : '#00F2FE' }} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{tx.description}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {tx.reference && (
                            <>
                              <span>•</span>
                              <span>{tx.reference}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                      {tx.smartpoints > 0 && (
                        <div className="text-xs text-gray-400">+{tx.smartpoints} SP</div>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: statusColors[tx.status], color: statusTextColors[tx.status] }}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 6 — Security Center */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Security Center</h2>
              <span className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                <BadgeCheck className="w-3 h-3" /> All Protected
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SECURITY_STATUSES.map((status) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  Shield: Shield,
                  Smartphone: Smartphone,
                  Lock: Lock,
                  Key: Key,
                };
                const Icon = iconMap[status.icon] || Shield;

                return (
                  <div
                    key={status.id}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="font-semibold text-white">{status.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{status.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7 — Future Banking */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <Building2 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Future Banking</h2>
                <p className="text-sm text-gray-400">Advanced financial features</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {FUTURE_BANKING_FEATURES.map((feature) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  Building2: Building2,
                  Smartphone: Smartphone,
                  Globe: Globe,
                  CreditCard: CreditCard,
                  Wallet: Wallet,
                };
                const Icon = iconMap[feature.icon] || Building2;

                return (
                  <div
                    key={feature.id}
                    className="p-4 rounded-xl text-center"
                    style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(139,92,246,0.3)' }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(139,92,246,0.15)' }}>
                      <Icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="font-semibold text-white text-sm">{feature.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                    <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                      Coming Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 8 — Wallet Insights */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                <Eye className="w-5 h-5" style={{ color: '#00F2FE' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Wallet Insights</h2>
                <p className="text-sm text-gray-400">Analytics overview • Demo data</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {WALLET_INSIGHTS.map((insight) => {
                const categoryColors: Record<string, { bg: string; text: string }> = {
                  spending: { bg: 'rgba(239,68,68,0.1)', text: '#f87171' },
                  earnings: { bg: 'rgba(34,197,94,0.1)', text: '#34d399' },
                  income: { bg: 'rgba(0,242,254,0.1)', text: '#00F2FE' },
                  contribution: { bg: 'rgba(212,175,55,0.1)', text: '#D4AF37' },
                  rewards: { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
                };
                const colors = categoryColors[insight.category] || { bg: 'rgba(255,255,255,0.1)', text: '#fff' };

                return (
                  <div
                    key={insight.id}
                    className="p-4 rounded-xl"
                    style={{ background: colors.bg, border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="text-sm text-gray-400 mb-1">{insight.label}</div>
                    <div className="text-2xl font-bold" style={{ color: colors.text }}>
                      {formatCurrency(insight.value)}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {insight.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                      {insight.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                      {insight.trend === 'stable' && <Minus className="w-3 h-3 text-gray-400" />}
                      <span className={`text-xs ${insight.trend === 'up' ? 'text-emerald-400' : insight.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                        {insight.change > 0 ? `+${insight.change}%` : insight.change < 0 ? `${insight.change}%` : 'Stable'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 9 — Compliance Notice */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{COMPLIANCE_NOTICE.title}</h3>
                <p className="text-gray-300 leading-relaxed">{COMPLIANCE_NOTICE.message}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, label: 'Regulatory Approval', color: 'rgba(239,68,68,0.1)' },
                { icon: Globe, label: 'Regional Rollout', color: 'rgba(212,175,55,0.1)' },
                { icon: CreditCard, label: 'Payment Integration', color: 'rgba(0,242,254,0.1)' },
                { icon: BadgeCheck, label: 'Identity Verification', color: 'rgba(34,197,94,0.1)' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl text-center"
                  style={{ background: item.color, border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  <div className="text-xs text-gray-400">{item.label}</div>
                  <div className="text-xs font-medium mt-1" style={{ color: '#fbbf24' }}>Future</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation CTA */}
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
            onClick={() => onNavigate('wallet')}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Sparkles className="w-4 h-4" />
            View Smart Wallet
          </button>
        </div>

      </div>
    </div>
  );
}
