import { useState } from 'react';
import {
  Wallet, Gift, Shield, FileText, Heart, Building2, Award,
  Bot, Lock, Settings, ChevronRight, AlertTriangle, CheckCircle,
  Clock, ArrowUpRight, ArrowDownRight, Eye, Download, RefreshCw,
  Smartphone, Key, Fingerprint, Monitor, Bell, TrendingUp, Users,
  Package, MapPin, Calendar, Info, BadgeCheck, AlertCircle, CircleDollarSign,
  History, BarChart3, Globe, FileCheck, ExternalLink, PiggyBank,
} from 'lucide-react';
import {
  WALLET_1_CUSTOMER,
  WALLET_2_SPONSORED,
  WALLET_3_PROTECTION,
  WALLET_4_INSURANCE,
  WALLET_5_CARE_CLUB,
  WALLET_6_BUSINESS,
  WALLET_7_REWARD_CENTER,
  AI_WALLET_ASSISTANT,
  WALLET_SECURITY,
  ADMIN_WALLET_DASHBOARD,
  LEGAL_GREEN_ZONE,
  WALLET_TIMELINE,
  formatCurrency,
  getStatusColor,
  DESIGN_TOKENS,
} from '../lib/universalWalletEcosystemMockData';

type UniversalWalletEcosystemPageProps = {
  onNavigate: (page: string) => void;
};

export default function UniversalWalletEcosystemPage({ onNavigate }: UniversalWalletEcosystemPageProps) {
  const [activeWallet, setActiveWallet] = useState<string>('overview');

  const walletTabs = [
    { id: 'overview', name: 'Overview', icon: Wallet },
    { id: 'wallet1', name: 'Customer Balance', icon: CircleDollarSign },
    { id: 'wallet2', name: 'Sponsored Benefits', icon: Gift },
    { id: 'wallet3', name: 'Protection', icon: Shield },
    { id: 'wallet4', name: 'Insurance', icon: FileText },
    { id: 'wallet5', name: 'Care Club', icon: Heart },
    { id: 'wallet6', name: 'Business', icon: Building2 },
    { id: 'wallet7', name: 'Reward Center', icon: Award },
    { id: 'timeline', name: 'Timeline', icon: History },
    { id: 'assistant', name: 'AI Assistant', icon: Bot },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'admin', name: 'Admin', icon: Settings },
    { id: 'legal', name: 'Legal', icon: BadgeCheck },
  ];

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Wallet className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 27 • VCOS™ Wallet Ecosystem</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>Universal Wallet Ecosystem</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Secure multi-wallet system separating customer funds, sponsored benefits, protection, insurance, care contributions, and business settlements.
          </p>
        </section>

        {/* Wallet Tabs */}
        <nav className="flex flex-wrap gap-2 justify-center">
          {walletTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWallet(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeWallet === tab.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-vloop-900'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                style={activeWallet === tab.id ? { background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' } : {}}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Overview */}
        {activeWallet === 'overview' && (
          <div className="space-y-6">
            {/* Wallet Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { wallet: WALLET_1_CUSTOMER, key: 'wallet1', color: '#00F2FE' },
                { wallet: WALLET_2_SPONSORED, key: 'wallet2', color: '#D4AF37' },
                { wallet: WALLET_3_PROTECTION, key: 'wallet3', color: '#8b5cf6' },
                { wallet: WALLET_4_INSURANCE, key: 'wallet4', color: '#22c55e' },
                { wallet: WALLET_5_CARE_CLUB, key: 'wallet5', color: '#f97316' },
                { wallet: WALLET_6_BUSINESS, key: 'wallet6', color: '#ec4899' },
              ].map(({ wallet, key, color }) => (
                <div
                  key={key}
                  className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] border"
                  style={{ background: 'rgba(26,21,48,0.8)', borderColor: `${color}30` }}
                  onClick={() => setActiveWallet(key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                        <Wallet className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{wallet.name}</h3>
                        <p className="text-xs text-white/50">{wallet.type}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-white/30" />
                  </div>
                  {'balance' in wallet && (
                    <div className="text-2xl font-bold mb-2" style={{ color }}>
                      {formatCurrency(wallet.balance)}
                    </div>
                  )}
                  {'benefits' in wallet && (
                    <div className="text-2xl font-bold mb-2" style={{ color }}>
                      {formatCurrency(wallet.benefits.available)}
                    </div>
                  )}
                  {'protections' in wallet && (
                    <div className="text-lg font-bold mb-2" style={{ color }}>
                      {wallet.protections.filter(p => p.status === 'active').length} Active
                    </div>
                  )}
                  {'policies' in wallet && (
                    <div className="text-lg font-bold mb-2" style={{ color }}>
                      {wallet.policies.filter(p => p.status === 'active').length} Policies
                    </div>
                  )}
                  {'stats' in wallet && key === 'wallet5' && (
                    <div className="text-lg font-bold mb-2" style={{ color }}>
                      {formatCurrency((wallet as typeof WALLET_5_CARE_CLUB).stats.totalContributions)}
                    </div>
                  )}
                  {'stats' in wallet && key === 'wallet6' && (
                    <div className="text-lg font-bold mb-2" style={{ color }}>
                      {formatCurrency((wallet as typeof WALLET_6_BUSINESS).stats.totalSales)}
                    </div>
                  )}
                  <p className="text-sm text-white/50">{wallet.description}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <CircleDollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-lg font-bold text-white">{formatCurrency(WALLET_1_CUSTOMER.balance)}</div>
                <div className="text-xs text-white/50">Customer Balance</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Gift className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-lg font-bold text-white">{formatCurrency(WALLET_2_SPONSORED.benefits.available)}</div>
                <div className="text-xs text-white/50">Available Benefits</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-lg font-bold text-white">{WALLET_3_PROTECTION.protections.filter(p => p.status === 'active').length}</div>
                <div className="text-xs text-white/50">Active Protections</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Award className="w-6 h-6 mx-auto mb-2" style={{ color: '#ef4444' }} />
                <div className="text-lg font-bold text-white">{WALLET_7_REWARD_CENTER.weeklyParticipation.currentParticipation}</div>
                <div className="text-xs text-white/50">Weekly Participation</div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <BadgeCheck size={16} style={{ color: '#22c55e' }} />
                <span className="font-semibold" style={{ color: '#22c55e' }}>Legal Green Zone Active</span>
              </div>
              <p className="text-sm text-white/70">
                SmartPoints have no cash value • Wallet 1 = Customer Funds • Wallet 2 = Sponsored Benefits • Insurance via licensed partners only
              </p>
            </div>
          </div>
        )}

        {/* Wallet 1 - Customer Balance */}
        {activeWallet === 'wallet1' && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #00F2FE' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#00F2FE' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.2)' }}>
                    <CircleDollarSign className="w-6 h-6" style={{ color: '#00F2FE' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_1_CUSTOMER.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_1_CUSTOMER.description}</p>
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2" style={{ color: '#00F2FE' }}>
                  {formatCurrency(WALLET_1_CUSTOMER.balance)}
                </div>
                <p className="text-sm text-white/50 mb-6">{WALLET_1_CUSTOMER.disclaimer}</p>
                <div className="flex flex-wrap gap-2">
                  {WALLET_1_CUSTOMER.features.map((feature) => (
                    <span key={feature} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(0,242,254,0.15)', color: '#00F2FE' }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <History size={18} style={{ color: '#00F2FE' }} /> Transaction History
              </h3>
              <div className="space-y-3">
                {WALLET_1_CUSTOMER.transactionHistory.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {tx.amount > 0 ? <ArrowDownRight size={16} className="text-green-400" /> : <ArrowUpRight size={16} className="text-red-400" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{tx.description}</div>
                        <div className="text-xs text-white/40">{tx.date} • {tx.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(tx.status) + '30', color: getStatusColor(tx.status) }}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallet 2 - Sponsored Benefits */}
        {activeWallet === 'wallet2' && (
          <div className="space-y-6">
            {/* Benefits Overview */}
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #D4AF37' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#D4AF37' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <Gift className="w-6 h-6" style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_2_SPONSORED.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_2_SPONSORED.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(WALLET_2_SPONSORED.benefits.available)}</div>
                    <div className="text-xs text-white/50">Available</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.15)' }}>
                    <div className="text-2xl font-bold text-yellow-400">{formatCurrency(WALLET_2_SPONSORED.benefits.pending)}</div>
                    <div className="text-xs text-white/50">Pending</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <div className="text-2xl font-bold text-purple-400">{formatCurrency(WALLET_2_SPONSORED.benefits.locked)}</div>
                    <div className="text-xs text-white/50">Locked</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: '#00F2FE' }}>{formatCurrency(WALLET_2_SPONSORED.benefits.released)}</div>
                    <div className="text-xs text-white/50">Released</div>
                  </div>
                </div>
                <p className="text-sm text-white/50">{WALLET_2_SPONSORED.disclaimer}</p>
              </div>
            </div>

            {/* Holding Period Notice */}
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <Clock size={18} style={{ color: '#D4AF37' }} />
              <div>
                <div className="font-medium" style={{ color: '#D4AF37' }}>Holding Period</div>
                <p className="text-sm text-white/70">{WALLET_2_SPONSORED.holdingPeriod}</p>
              </div>
            </div>

            {/* Benefit Items */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4">Benefit Items</h3>
              <div className="space-y-3">
                {WALLET_2_SPONSORED.benefitItems.map((benefit) => (
                  <div key={benefit.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: getStatusColor(benefit.status) + '20' }}>
                        <Gift size={18} style={{ color: getStatusColor(benefit.status) }} />
                      </div>
                      <div>
                        <div className="font-medium text-white">{benefit.name}</div>
                        <div className="text-xs text-white/50">{benefit.source} • {benefit.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: getStatusColor(benefit.status) }}>{formatCurrency(benefit.amount)}</div>
                      <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: getStatusColor(benefit.status) + '30', color: getStatusColor(benefit.status) }}>
                        {benefit.status}
                      </span>
                      {benefit.releaseDate && (
                        <div className="text-xs text-white/40 mt-1">Releases: {benefit.releaseDate}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallet 3 - Protection */}
        {activeWallet === 'wallet3' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #8b5cf6' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#8b5cf6' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
                    <Shield className="w-6 h-6" style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_3_PROTECTION.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_3_PROTECTION.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4">Active Protections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WALLET_3_PROTECTION.protections.map((protection) => (
                  <div key={protection.id} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid' + getStatusColor(protection.status) + '40' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2 py-1 rounded" style={{ background: getStatusColor(protection.status) + '20', color: getStatusColor(protection.status) }}>
                        {protection.status === 'expiring_soon' ? 'Expiring Soon' : protection.status}
                      </span>
                      <span className="text-xs text-white/50">{protection.type}</span>
                    </div>
                    <div className="font-semibold text-white mb-2">{protection.name}</div>
                    {'device' in protection && <div className="text-sm text-white/70 mb-1">Device: {protection.device}</div>}
                    {'order' in protection && <div className="text-sm text-white/70 mb-1">Order: {protection.order}</div>}
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span>Activated: {protection.activationDate}</span>
                      <span>Expires: {protection.expiryDate}</span>
                    </div>
                    <button className="mt-3 text-xs flex items-center gap-1" style={{ color: '#8b5cf6' }}>
                      <FileText size={14} /> View Policy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Info size={18} style={{ color: '#8b5cf6' }} />
              <p className="text-sm text-white/70">{WALLET_3_PROTECTION.disclaimer}</p>
            </div>
          </div>
        )}

        {/* Wallet 4 - Insurance */}
        {activeWallet === 'wallet4' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #22c55e' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#22c55e' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                    <FileText className="w-6 h-6" style={{ color: '#22c55e' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_4_INSURANCE.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_4_INSURANCE.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4">Insurance Policies</h3>
              <div className="space-y-4">
                {WALLET_4_INSURANCE.policies.map((policy) => (
                  <div key={policy.id} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid' + getStatusColor(policy.status) + '40' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{policy.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(policy.status) + '20', color: getStatusColor(policy.status) }}>
                            {policy.status === 'expiring_soon' ? 'Expiring Soon' : policy.status}
                          </span>
                        </div>
                        <div className="text-sm text-white/50">{policy.type} • {policy.partner}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold" style={{ color: '#22c55e' }}>Coverage: {policy.coverage}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-white/60 mb-3">
                      <div><span className="text-white/40">Policy #:</span> {policy.policyNumber}</div>
                      <div><span className="text-white/40">Valid:</span> {policy.activationDate} - {policy.expiryDate}</div>
                    </div>
                    {policy.claimStatus && (
                      <div className="text-xs p-2 rounded mb-2" style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308' }}>
                        <AlertCircle size={12} className="inline mr-1" /> {policy.claimStatus}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs">
                      <button className="flex items-center gap-1" style={{ color: '#22c55e' }}>
                        <Download size={14} /> Download PDF
                      </button>
                      {policy.status === 'expiring_soon' && (
                        <button className="flex items-center gap-1 text-yellow-400">
                          <RefreshCw size={14} /> Renew Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <FileCheck size={18} style={{ color: '#22c55e' }} />
              <p className="text-sm text-white/70">{WALLET_4_INSURANCE.disclaimer}</p>
            </div>
          </div>
        )}

        {/* Wallet 5 - Care Club */}
        {activeWallet === 'wallet5' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #f97316' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#f97316' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.2)' }}>
                    <Heart className="w-6 h-6" style={{ color: '#f97316' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_5_CARE_CLUB.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_5_CARE_CLUB.description}</p>
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2" style={{ color: '#f97316' }}>
                  {formatCurrency(WALLET_5_CARE_CLUB.stats.totalContributions)}
                </div>
                <p className="text-sm text-white/50">{WALLET_5_CARE_CLUB.disclaimer}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <PiggyBank className="w-6 h-6 mx-auto mb-2" style={{ color: '#f97316' }} />
                <div className="text-lg font-bold text-white">{formatCurrency(WALLET_5_CARE_CLUB.stats.foodPrograms)}</div>
                <div className="text-xs text-white/50">Food Programs</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: '#ef4444' }} />
                <div className="text-lg font-bold text-white">{formatCurrency(WALLET_5_CARE_CLUB.stats.medicalSupport)}</div>
                <div className="text-xs text-white/50">Medical Support</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#3b82f6' }} />
                <div className="text-lg font-bold text-white">{formatCurrency(WALLET_5_CARE_CLUB.stats.educationSupport)}</div>
                <div className="text-xs text-white/50">Education</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-lg font-bold text-white">{formatCurrency(WALLET_5_CARE_CLUB.stats.communityProjects)}</div>
                <div className="text-xs text-white/50">Community</div>
              </div>
            </div>

            {/* Impact Report */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} style={{ color: '#f97316' }} /> Impact Report
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#f97316' }}>{WALLET_5_CARE_CLUB.impact.livesImpacted.toLocaleString()}</div>
                  <div className="text-xs text-white/50">Lives Impacted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>{WALLET_5_CARE_CLUB.impact.mealsServed.toLocaleString()}</div>
                  <div className="text-xs text-white/50">Meals Served</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{WALLET_5_CARE_CLUB.impact.studentsSupported}</div>
                  <div className="text-xs text-white/50">Students Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{WALLET_5_CARE_CLUB.impact.medicalAid}</div>
                  <div className="text-xs text-white/50">Medical Aid</div>
                </div>
              </div>
            </div>

            {/* Transparency Ledger */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FileCheck size={18} style={{ color: '#f97316' }} /> Transparency Ledger
              </h3>
              <div className="space-y-2">
                {WALLET_5_CARE_CLUB.ledger.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl text-sm" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${entry.type === 'contribution' ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                        {entry.type === 'contribution' ? <ArrowDownRight size={14} className="text-green-400" /> : <ArrowUpRight size={14} className="text-orange-400" />}
                      </div>
                      <div>
                        <div className="text-white">{entry.source}</div>
                        <div className="text-xs text-white/40">{entry.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={entry.type === 'contribution' ? 'text-green-400' : 'text-orange-400'}>
                        {entry.type === 'contribution' ? '+' : '-'}{formatCurrency(Math.abs(entry.amount))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallet 6 - Business */}
        {activeWallet === 'wallet6' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #ec4899' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ec4899' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.2)' }}>
                    <Building2 className="w-6 h-6" style={{ color: '#ec4899' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_6_BUSINESS.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_6_BUSINESS.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(236,72,153,0.15)' }}>
                    <div className="text-xl font-bold" style={{ color: '#ec4899' }}>{formatCurrency(WALLET_6_BUSINESS.stats.totalSales)}</div>
                    <div className="text-xs text-white/50">Total Sales</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.15)' }}>
                    <div className="text-xl font-bold text-yellow-400">{formatCurrency(WALLET_6_BUSINESS.stats.pendingSettlement)}</div>
                    <div className="text-xs text-white/50">Pending</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <div className="text-xl font-bold text-purple-400">{formatCurrency(WALLET_6_BUSINESS.stats.escrowBalance)}</div>
                    <div className="text-xs text-white/50">Escrow</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <div className="text-xl font-bold text-green-400">{formatCurrency(WALLET_6_BUSINESS.stats.thisMonthPayout)}</div>
                    <div className="text-xs text-white/50">This Month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business List */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(236,72,153,0.2)' }}>
              <h3 className="font-semibold text-white mb-4">Businesses</h3>
              <div className="space-y-3">
                {WALLET_6_BUSINESS.businesses.map((business) => (
                  <div key={business.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.2)' }}>
                        <Building2 size={18} style={{ color: '#ec4899' }} />
                      </div>
                      <div>
                        <div className="font-medium text-white">{business.name}</div>
                        <div className="text-xs text-white/50">{business.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatCurrency(business.sales)}</div>
                      <div className="text-xs text-yellow-400">Pending: {formatCurrency(business.pending)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(236,72,153,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FileText size={18} style={{ color: '#ec4899' }} /> Invoices
              </h3>
              <div className="space-y-3">
                {WALLET_6_BUSINESS.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{invoice.business}</div>
                      <div className="text-xs text-white/50">{invoice.period}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatCurrency(invoice.amount)}</div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(invoice.status) + '30', color: getStatusColor(invoice.status) }}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Status */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/50">Next Payout</div>
                  <div className="text-xl font-bold" style={{ color: '#ec4899' }}>{formatCurrency(WALLET_6_BUSINESS.payoutStatus.estimatedAmount)}</div>
                  <div className="text-xs text-white/50">{WALLET_6_BUSINESS.payoutStatus.nextPayout}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50">Bank Account</div>
                  <div className="text-sm text-white">{WALLET_6_BUSINESS.payoutStatus.bankAccount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallet 7 - Reward Center */}
        {activeWallet === 'wallet7' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #ef4444' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ef4444' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
                    <Award className="w-6 h-6" style={{ color: '#ef4444' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{WALLET_7_REWARD_CENTER.name}</h2>
                    <p className="text-sm text-white/50">{WALLET_7_REWARD_CENTER.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Participation */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Package size={18} style={{ color: '#ef4444' }} /> Weekly Participation
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{WALLET_7_REWARD_CENTER.weeklyParticipation.currentParticipation}</div>
                  <div className="text-xs text-white/50">Current Tokens</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{WALLET_7_REWARD_CENTER.weeklyParticipation.smartCodesEntered}</div>
                  <div className="text-xs text-white/50">SmartCodes</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(136,132,216,0.15)' }}>
                  <div className="text-lg font-bold text-white">{WALLET_7_REWARD_CENTER.weeklyParticipation.eligiblePool}</div>
                  <div className="text-xs text-white/50">Eligible Pool</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(WALLET_7_REWARD_CENTER.weeklyParticipation.estimatedBenefit)}</div>
                  <div className="text-xs text-white/50">Est. Benefit</div>
                </div>
              </div>
            </div>

            {/* Sponsored Rewards */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Gift size={18} style={{ color: '#ef4444' }} /> Sponsored Rewards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[WALLET_7_REWARD_CENTER.sponsorRewards.prime, WALLET_7_REWARD_CENTER.sponsorRewards.premium, WALLET_7_REWARD_CENTER.sponsorRewards.standard].map((reward, idx) => (
                  <div key={reward.name} className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Award className="w-8 h-8 mx-auto mb-2" style={{ color: idx === 0 ? '#D4AF37' : idx === 1 ? '#C0C0C0' : '#CD7F32' }} />
                    <div className="font-semibold text-white">{reward.name}</div>
                    <div className="text-xl font-bold" style={{ color: '#ef4444' }}>{formatCurrency(reward.amount)}</div>
                    <div className="text-xs text-white/50 mt-1">{reward.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Verification */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-3">
                <BadgeCheck size={24} style={{ color: '#22c55e' }} />
                <div>
                  <div className="font-medium text-white">Skill Verification</div>
                  <div className="text-sm text-white/50">{WALLET_7_REWARD_CENTER.skillVerification.level} • {WALLET_7_REWARD_CENTER.skillVerification.badges} Badges</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
                {WALLET_7_REWARD_CENTER.skillVerification.status}
              </span>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <Info size={18} style={{ color: '#ef4444' }} />
              <p className="text-sm text-white/70">{WALLET_7_REWARD_CENTER.disclaimer}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {activeWallet === 'timeline' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <History size={18} style={{ color: '#D4AF37' }} /> Wallet Activity Timeline
              </h3>
              <div className="space-y-4">
                {WALLET_TIMELINE.map((activity) => {
                  const typeColors: Record<string, string> = {
                    purchase: '#00F2FE',
                    benefit_earned: '#D4AF37',
                    benefit_released: '#22c55e',
                    insurance_activated: '#8b5cf6',
                    reward_sponsored: '#ef4444',
                    refund: '#22c55e',
                    settlement: '#ec4899',
                    claim_update: '#eab308',
                  };
                  const color = typeColors[activity.type] || '#94a3b8';
                  const typeIcons: Record<string, any> = {
                    purchase: Package,
                    benefit_earned: Gift,
                    benefit_released: CheckCircle,
                    insurance_activated: FileText,
                    reward_sponsored: Award,
                    refund: ArrowDownRight,
                    settlement: Building2,
                    claim_update: AlertCircle,
                  };
                  const Icon = typeIcons[activity.type] || CircleDollarSign;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid ' + color }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: color + '20' }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-white">{activity.description}</div>
                          {activity.amount && (
                            <div className="font-semibold" style={{ color }}>
                              {activity.amount > 0 ? '+' : ''}{formatCurrency(activity.amount)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/50 mt-1">
                          <span>{activity.wallet}</span>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant */}
        {activeWallet === 'assistant' && (
          <div className="space-y-6">
            {/* Insights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="text-2xl font-bold" style={{ color: '#00F2FE' }}>{formatCurrency(AI_WALLET_ASSISTANT.insights.totalAvailableBenefits)}</div>
                <div className="text-xs text-white/50">Available Benefits</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{formatCurrency(AI_WALLET_ASSISTANT.insights.upcomingReleases)}</div>
                <div className="text-xs text-white/50">Upcoming Releases</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="text-2xl font-bold text-red-400">{AI_WALLET_ASSISTANT.insights.expiringThisMonth}</div>
                <div className="text-xs text-white/50">Expiring This Month</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-2xl font-bold text-green-400">{AI_WALLET_ASSISTANT.insights.suggestedActions}</div>
                <div className="text-xs text-white/50">Suggested Actions</div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Bot size={18} style={{ color: '#00F2FE' }} /> AI Suggestions
              </h3>
              <div className="space-y-3">
                {AI_WALLET_ASSISTANT.suggestions.map((suggestion) => {
                  const priorityColors: Record<string, string> = {
                    high: '#ef4444',
                    medium: '#eab308',
                    low: '#22c55e',
                  };
                  const typeIcons: Record<string, any> = {
                    benefit_release: Gift,
                    expiry_alert: Clock,
                    insurance_renewal: FileText,
                    nearby_offer: MapPin,
                  };
                  const Icon = typeIcons[suggestion.type] || Info;
                  return (
                    <div key={suggestion.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid ' + priorityColors[suggestion.priority] + '30' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: priorityColors[suggestion.priority] + '20' }}>
                          <Icon size={18} style={{ color: priorityColors[suggestion.priority] }} />
                        </div>
                        <div>
                          <div className="font-medium text-white">{suggestion.title}</div>
                          <div className="text-sm text-white/50">{suggestion.description}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: priorityColors[suggestion.priority] + '20', color: priorityColors[suggestion.priority] }}>
                        {suggestion.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personalized Guidance */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp size={16} style={{ color: '#00F2FE' }} /> Personalized Guidance
              </h4>
              <ul className="space-y-2">
                {AI_WALLET_ASSISTANT.personalizedGuidance.map((guidance, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
                    {guidance}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Security */}
        {activeWallet === 'security' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Lock size={18} style={{ color: '#22c55e' }} /> Security Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WALLET_SECURITY.features.map((feature) => {
                  const featureIcons: Record<string, any> = {
                    'Biometric Lock': Fingerprint,
                    'PIN Protection': Key,
                    'Face ID': Smartphone,
                    'OTP Verification': Key,
                    'Device Verification': Monitor,
                    'Fraud Detection': Shield,
                  };
                  const Icon = featureIcons[feature.name] || Lock;
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: feature.status === 'enabled' || feature.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>
                          <Icon size={18} style={{ color: feature.status === 'enabled' || feature.status === 'active' ? '#22c55e' : '#ef4444' }} />
                        </div>
                        <div>
                          <div className="font-medium text-white">{feature.name}</div>
                          <div className="text-xs text-white/50">
                            {'lastUsed' in feature && `Last used: ${feature.lastUsed}`}
                            {'lastUpdated' in feature && `Updated: ${feature.lastUpdated}`}
                            {'alertsBlocked' in feature && `${feature.alertsBlocked} alerts blocked`}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${feature.status === 'enabled' || feature.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {feature.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device List */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Monitor size={18} style={{ color: '#22c55e' }} /> Verified Devices
              </h3>
              <div className="space-y-3">
                {WALLET_SECURITY.deviceList.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: device.type === 'mobile' ? 'rgba(0,242,254,0.2)' : 'rgba(139,92,246,0.2)' }}>
                        {device.type === 'mobile' ? <Smartphone size={18} style={{ color: '#00F2FE' }} /> : <Monitor size={18} style={{ color: '#8b5cf6' }} />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{device.name}</div>
                        <div className="text-xs text-white/50">Last active: {device.lastActive}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      {device.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {activeWallet === 'admin' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-xl font-bold text-white">{ADMIN_WALLET_DASHBOARD.stats.totalWallets.toLocaleString()}</div>
                <div className="text-xs text-white/50">Total Wallets</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <CircleDollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(ADMIN_WALLET_DASHBOARD.stats.totalCustomerFunds)}</div>
                <div className="text-xs text-white/50">Customer Funds</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Gift className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(ADMIN_WALLET_DASHBOARD.stats.totalSponsoredBenefits)}</div>
                <div className="text-xs text-white/50">Sponsored Benefits</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-xl font-bold text-white">{ADMIN_WALLET_DASHBOARD.stats.totalInsurancePolicies.toLocaleString()}</div>
                <div className="text-xs text-white/50">Insurance Policies</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: '#f97316' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(ADMIN_WALLET_DASHBOARD.stats.careClubContributions)}</div>
                <div className="text-xs text-white/50">Care Contributions</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)' }}>
                <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: '#ec4899' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(ADMIN_WALLET_DASHBOARD.stats.escrowBalance)}</div>
                <div className="text-xs text-white/50">Escrow Balance</div>
              </div>
            </div>

            {/* Pending Items */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-yellow-400" /> Pending Items
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-yellow-400">{ADMIN_WALLET_DASHBOARD.pending.benefitReleases.toLocaleString()}</div>
                  <div className="text-xs text-white/50">Benefit Releases</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-yellow-400">{ADMIN_WALLET_DASHBOARD.pending.settlements}</div>
                  <div className="text-xs text-white/50">Settlements</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-yellow-400">{ADMIN_WALLET_DASHBOARD.pending.insuranceClaims}</div>
                  <div className="text-xs text-white/50">Insurance Claims</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-yellow-400">{ADMIN_WALLET_DASHBOARD.pending.verifications}</div>
                  <div className="text-xs text-white/50">Verifications</div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" /> Alerts
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-red-400">{ADMIN_WALLET_DASHBOARD.alerts.fraudAlerts}</div>
                  <div className="text-xs text-white/50">Fraud Alerts</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-orange-400">{ADMIN_WALLET_DASHBOARD.alerts.expiringPolicies}</div>
                  <div className="text-xs text-white/50">Expiring Policies</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-2xl font-bold text-blue-400">{ADMIN_WALLET_DASHBOARD.alerts.pendingApproval}</div>
                  <div className="text-xs text-white/50">Pending Approval</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal Green Zone */}
        {activeWallet === 'legal' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', border: '2px solid #22c55e' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#22c55e' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                    <BadgeCheck className="w-6 h-6" style={{ color: '#22c55e' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Legal Green Zone</h2>
                    <p className="text-sm text-white/50">Compliance & Regulatory Framework</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FileCheck size={18} style={{ color: '#22c55e' }} /> Enforced Rules
              </h3>
              <div className="space-y-3">
                {LEGAL_GREEN_ZONE.rules.map((rule) => {
                  const categoryIcons: Record<string, any> = {
                    compliance: BadgeCheck,
                    disclosure: Eye,
                    licensing: FileText,
                    audit: History,
                    privacy: Lock,
                  };
                  const Icon = categoryIcons[rule.category] || BadgeCheck;
                  return (
                    <div key={rule.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                        <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{rule.rule}</div>
                        <div className="text-xs text-white/50 capitalize">{rule.category}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        {rule.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <History size={18} style={{ color: '#22c55e' }} /> Audit Trail Configuration
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: LEGAL_GREEN_ZONE.auditTrail.enabled ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>
                    {LEGAL_GREEN_ZONE.auditTrail.enabled ? <CheckCircle size={16} style={{ color: '#22c55e' }} /> : <AlertTriangle size={16} className="text-red-400" />}
                  </div>
                  <div className="font-medium text-white">{LEGAL_GREEN_ZONE.auditTrail.enabled ? 'Enabled' : 'Disabled'}</div>
                  <div className="text-xs text-white/50">Status</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{LEGAL_GREEN_ZONE.auditTrail.retentionDays}</div>
                  <div className="text-xs text-white/50">Days Retention</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {LEGAL_GREEN_ZONE.auditTrail.immutable ? <Lock size={24} className="mx-auto mb-2" style={{ color: '#22c55e' }} /> : <AlertTriangle size={24} className="mx-auto mb-2 text-red-400" />}
                  <div className="font-medium text-white">{LEGAL_GREEN_ZONE.auditTrail.immutable ? 'Immutable' : 'Mutable'}</div>
                  <div className="text-xs text-white/50">Records</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {LEGAL_GREEN_ZONE.auditTrail.encrypted ? <Lock size={24} className="mx-auto mb-2" style={{ color: '#22c55e' }} /> : <AlertTriangle size={24} className="mx-auto mb-2 text-red-400" />}
                  <div className="font-medium text-white">{LEGAL_GREEN_ZONE.auditTrail.encrypted ? 'Encrypted' : 'Unencrypted'}</div>
                  <div className="text-xs text-white/50">Data</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
