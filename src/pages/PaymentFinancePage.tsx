import { useState } from 'react';
import {
  CreditCard, Smartphone, Building2, Wallet, Globe, MapPin,
  Zap, DollarSign, Lock, Shield, BadgeCheck, FileText, Eye,
  AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp,
  ArrowDownRight, ArrowUpRight, ArrowRightLeft, Package,
  Download, RefreshCw, Activity, BarChart3, Ban, ShieldCheck,
  ChevronRight, Info, History, Banknote, Receipt, Coins,
  Settings, AlertCircle, Users, Landmark, Clock4, CircleDollarSign,
  Heart,
} from 'lucide-react';
import {
  PAYMENT_METHODS,
  PAYMENT_GATEWAYS,
  BANK_ACCOUNTS,
  SUPPORTED_CURRENCIES,
  SETTLEMENTS,
  ESCROW_TRANSACTIONS,
  ESCROW_FLOW_STEPS,
  REFUNDS,
  PAYOUTS,
  TAX_CONFIGS,
  INVOICES,
  SECURITY_FEATURES,
  FINANCIAL_AUDIT_LOGS,
  FINANCIAL_DASHBOARD,
  COMPLIANCE_STANDARDS,
  VCOS_FINANCIAL_LOCK,
  formatCurrency,
  getGatewayStatusColor,
  getSettlementStatusColor,
} from '../lib/paymentFinanceMockData';

type PaymentFinancePageProps = {
  onNavigate: (page: string) => void;
};

export default function PaymentFinancePage({ onNavigate }: PaymentFinancePageProps) {
  const [activeTab, setActiveTab] = useState<'payments' | 'settlements' | 'financial' | 'compliance'>('payments');

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <CreditCard className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 26 • VCOS™ Payments</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>
            Global Payments & Financial Infrastructure
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Secure, scalable, regulation-ready payment orchestration through licensed partners
          </p>
        </section>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'settlements', label: 'Settlements', icon: Landmark },
            { id: 'financial', label: 'Financial', icon: Banknote },
            { id: 'compliance', label: 'Compliance', icon: Shield },
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

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            {/* Module 1: Payment Orchestration */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <CreditCard className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Payment Orchestration Layer</h2>
                    <p className="text-sm text-gray-400">Universal payment engine with automatic gateway selection</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      Smartphone, CreditCard, Building2, Wallet, Globe, MapPin,
                    };
                    const Icon = iconMap[method.icon] || CreditCard;

                    return (
                      <div
                        key={method.id}
                        className="p-4 rounded-xl text-center"
                        style={{
                          background: method.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)',
                          border: `1px solid ${method.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)'}`,
                        }}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: method.status === 'active' ? '#22c55e' : '#fbbf24' }} />
                        <div className="font-semibold text-white text-sm">{method.name}</div>
                        <div className="text-xs text-gray-500 mt-1">Priority: {method.priority}</div>
                        <div className={`text-xs mt-1 ${method.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {method.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 2: Gateway Manager */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <Zap className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Payment Gateway Manager</h2>
                    <p className="text-sm text-gray-400">Multi-gateway support with failover</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PAYMENT_GATEWAYS.map((gateway) => (
                    <div
                      key={gateway.id}
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: getGatewayStatusColor(gateway.status) + '20' }}>
                            <Zap className="w-4 h-4" style={{ color: getGatewayStatusColor(gateway.status) }} />
                          </div>
                          <span className="font-semibold text-white">{gateway.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${gateway.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : gateway.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {gateway.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-400">Success Rate</div>
                          <div className="text-white font-medium">{gateway.success_rate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Latency</div>
                          <div className="text-white font-medium">{gateway.avg_latency_ms}ms</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 3: Bank Accounts */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <Building2 className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Bank Account Management</h2>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Encrypted</span>
                </div>

                <div className="space-y-3">
                  {BANK_ACCOUNTS.map((account) => (
                    <div
                      key={account.id}
                      className="p-4 rounded-xl flex items-center justify-between"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                          <Landmark className="w-5 h-5" style={{ color: '#D4AF37' }} />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{account.beneficiary_name}</div>
                          <div className="text-xs text-gray-400">{account.bank_name} • {account.account_number_masked}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {account.ifsc_code && <span>IFSC: {account.ifsc_code}</span>}
                            {account.swift_code && <span>SWIFT: {account.swift_code}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${account.verification_status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {account.verification_status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{account.account_type.replace('_', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 4: Multi-Currency */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <CircleDollarSign className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Multi-Currency Engine</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <div
                      key={currency.code}
                      className="p-4 rounded-xl text-center"
                      style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}
                    >
                      <div className="text-2xl font-bold" style={{ color: '#00F2FE' }}>{currency.symbol}</div>
                      <div className="font-semibold text-white">{currency.code}</div>
                      <div className="text-xs text-gray-400">{currency.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 6: Escrow Layer */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <Lock className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Escrow Payment Layer</h2>
                    <p className="text-sm text-gray-400">Secure payment protection for marketplace</p>
                  </div>
                </div>

                {/* Flow Steps */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {ESCROW_FLOW_STEPS.map((step) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      CreditCard, Lock, Package, Wallet,
                    };
                    const Icon = iconMap[step.icon] || Lock;
                    const colors = ['#00F2FE', '#D4AF37', '#22c55e', '#8b5cf6'];

                    return (
                      <div key={step.step} className="p-3 rounded-xl text-center" style={{ background: colors[step.step - 1] + '15', border: `1px solid ${colors[step.step - 1]}30` }}>
                        <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2" style={{ background: colors[step.step - 1] + '30' }}>
                          <Icon className="w-4 h-4" style={{ color: colors[step.step - 1] }} />
                        </div>
                        <div className="text-xs font-medium text-white">{step.title}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Escrows */}
                <div className="space-y-2">
                  {ESCROW_TRANSACTIONS.slice(0, 4).map((escrow) => {
                    const statusColors: Record<string, string> = {
                      payment_held: '#fbbf24',
                      delivery_confirmed: '#00F2FE',
                      seller_paid: '#22c55e',
                      disputed: '#ef4444',
                      refunded: '#f87171',
                      closed: '#6b7280',
                    };

                    return (
                      <div
                        key={escrow.id}
                        className="p-3 rounded-xl flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-3">
                          <Lock className="w-4 h-4 text-violet-400" />
                          <div>
                            <div className="text-sm text-white">{escrow.order_id}</div>
                            <div className="text-xs text-gray-400">{escrow.created_at}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white">{formatCurrency(escrow.amount, escrow.currency)}</span>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: statusColors[escrow.status] + '20', color: statusColors[escrow.status] }}>
                            {escrow.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SETTLEMENTS TAB */}
        {activeTab === 'settlements' && (
          <div className="space-y-8">
            {/* Module 5: Settlement Engine */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <Landmark className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Settlement Engine</h2>
                    <p className="text-sm text-gray-400">Automated merchant settlement calculations</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {SETTLEMENTS.map((settlement) => (
                    <div
                      key={settlement.id}
                      className="p-5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-semibold text-white">{settlement.merchant_name}</div>
                          <div className="text-xs text-gray-400">{settlement.id} • {settlement.scheduled_date}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: getSettlementStatusColor(settlement.status) + '20', color: getSettlementStatusColor(settlement.status) }}>
                          {settlement.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 md:grid-cols-7 gap-3 text-xs">
                        <div>
                          <div className="text-gray-400">Gross</div>
                          <div className="text-white font-medium">{formatCurrency(settlement.gross_amount, settlement.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Gateway</div>
                          <div className="text-red-400">-{formatCurrency(settlement.breakdown.gateway_charges, settlement.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Platform</div>
                          <div className="text-red-400">-{formatCurrency(settlement.breakdown.platform_fee, settlement.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Tax</div>
                          <div className="text-red-400">-{formatCurrency(settlement.breakdown.taxes, settlement.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Benefits</div>
                          <div className="text-amber-400">-{formatCurrency(settlement.breakdown.sponsored_benefits, settlement.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Insurance</div>
                          <div className="text-amber-400">-{formatCurrency(settlement.breakdown.insurance_sponsorship, settlement.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Net</div>
                          <div className="text-emerald-400 font-bold">{formatCurrency(settlement.breakdown.net_settlement, settlement.currency)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 7: Refund Engine */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                    <RefreshCw className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Refund Engine</h2>
                </div>

                <div className="space-y-3">
                  {REFUNDS.map((refund) => {
                    const statusColors: Record<string, string> = {
                      initiated: '#fbbf24',
                      processing: '#00F2FE',
                      completed: '#22c55e',
                      failed: '#ef4444',
                    };

                    return (
                      <div
                        key={refund.id}
                        className="p-4 rounded-xl flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-4 h-4 text-red-400" />
                          <div>
                            <div className="text-sm text-white">{refund.id} • {refund.order_id}</div>
                            <div className="text-xs text-gray-400">{refund.reason}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-400">-{formatCurrency(refund.amount, refund.currency)}</div>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: statusColors[refund.status] + '20', color: statusColors[refund.status] }}>
                            {refund.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{refund.type}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 8: Payout Engine */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Payout Engine</h2>
                </div>

                <div className="space-y-3">
                  {PAYOUTS.map((payout) => {
                    const statusColors: Record<string, string> = {
                      scheduled: '#fbbf24',
                      processing: '#00F2FE',
                      completed: '#22c55e',
                      failed: '#ef4444',
                      cancelled: '#6b7280',
                    };

                    return (
                      <div
                        key={payout.id}
                        className="p-4 rounded-xl flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-3">
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="text-sm text-white">{payout.merchant_name}</div>
                            <div className="text-xs text-gray-400">{payout.scheduled_date} • {payout.schedule}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-emerald-400">{formatCurrency(payout.amount, payout.currency)}</div>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: statusColors[payout.status] + '20', color: statusColors[payout.status] }}>
                            {payout.status}
                          </span>
                          {payout.utr_number && (
                            <div className="text-xs text-gray-500 mt-1">{payout.utr_number}</div>
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

        {/* FINANCIAL TAB */}
        {activeTab === 'financial' && (
          <div className="space-y-8">
            {/* Module 13: Financial Dashboard */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <BarChart3 className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Financial Dashboard</h2>
                    <p className="text-sm text-gray-400">Admin overview of payment analytics</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <div className="text-xs text-gray-400 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-emerald-400">{formatCurrency(FINANCIAL_DASHBOARD.total_revenue.amount)}</div>
                    <div className="text-xs text-emerald-400">+{FINANCIAL_DASHBOARD.total_revenue.change_percent}%</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                    <div className="text-xs text-gray-400 mb-1">Pending Settlement</div>
                    <div className="text-2xl font-bold text-amber-400">{formatCurrency(FINANCIAL_DASHBOARD.pending_settlement.amount)}</div>
                    <div className="text-xs text-gray-400">{FINANCIAL_DASHBOARD.pending_settlement.count} merchants</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
                    <div className="text-xs text-gray-400 mb-1">Completed</div>
                    <div className="text-2xl font-bold" style={{ color: '#00F2FE' }}>{formatCurrency(FINANCIAL_DASHBOARD.completed_settlement.amount)}</div>
                    <div className="text-xs text-gray-400">{FINANCIAL_DASHBOARD.completed_settlement.count} settlements</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <div className="text-xs text-gray-400 mb-1">Escrow Balance</div>
                    <div className="text-2xl font-bold text-violet-400">{formatCurrency(FINANCIAL_DASHBOARD.escrow_balance.total_held)}</div>
                    <div className="text-xs text-gray-400">{FINANCIAL_DASHBOARD.escrow_balance.active_transactions} active</div>
                  </div>
                </div>

                {/* Country Revenue */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FINANCIAL_DASHBOARD.country_revenue.map((country) => (
                    <div
                      key={country.code}
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{country.country}</span>
                        <span className="text-xs text-gray-400">{country.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${country.percentage}%`, background: '#D4AF37' }} />
                      </div>
                      <div className="text-sm font-semibold mt-2" style={{ color: '#D4AF37' }}>{formatCurrency(country.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 9: Tax Engine */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <Receipt className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Tax Engine</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {TAX_CONFIGS.map((tax) => (
                    <div
                      key={tax.country}
                      className="p-3 rounded-xl"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}
                    >
                      <div className="text-xs text-gray-400">{tax.country}</div>
                      <div className="font-semibold text-white">{tax.tax_type}</div>
                      <div className="text-sm" style={{ color: '#D4AF37' }}>{tax.rate}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 10: Invoice Center */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <FileText className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Invoice Center</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INVOICES.map((invoice) => {
                    const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
                      invoice: Receipt,
                      receipt: FileText,
                      credit_note: FileText,
                      refund_receipt: RefreshCw,
                      insurance_receipt: Shield,
                      care_club_receipt: Heart,
                    };
                    const Icon = typeIcons[invoice.type] || FileText;

                    return (
                      <div
                        key={invoice.id}
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400 capitalize">{invoice.type.replace('_', ' ')}</span>
                        </div>
                        <div className="font-medium text-white text-sm">{invoice.number}</div>
                        <div className="text-xs text-gray-400">{invoice.customer_name}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold" style={{ color: '#D4AF37' }}>{formatCurrency(invoice.amount, invoice.currency)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 12: Financial Audit */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <History className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Financial Audit Log</h2>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Immutable</span>
                </div>

                <div className="space-y-2">
                  {FINANCIAL_AUDIT_LOGS.map((log) => {
                    const categoryColors: Record<string, string> = {
                      payment: '#00F2FE',
                      settlement: '#22c55e',
                      refund: '#f87171',
                      payout: '#D4AF37',
                      gateway: '#8b5cf6',
                      webhook: '#fbbf24',
                    };

                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ background: categoryColors[log.category] }} />
                          <div>
                            <div className="text-sm text-white capitalize">{log.category} • {log.action}</div>
                            <div className="text-xs text-gray-400">{log.reference_id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</div>
                          {log.amount && (
                            <div className="text-sm font-medium" style={{ color: categoryColors[log.category] }}>
                              {formatCurrency(log.amount, log.currency || 'INR')}
                            </div>
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

        {/* COMPLIANCE TAB */}
        {activeTab === 'compliance' && (
          <div className="space-y-8">
            {/* Module 11: Payment Security */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6 md:p-8" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <Shield className="w-6 h-6" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Payment Security</h2>
                    <p className="text-sm text-gray-400">Enterprise-grade protection for all transactions</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SECURITY_FEATURES.map((feature) => (
                    <div
                      key={feature.id}
                      className="p-4 rounded-xl"
                      style={{
                        background: feature.status === 'enabled' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)',
                        border: `1px solid ${feature.status === 'enabled' ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.3)'}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {feature.status === 'enabled' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="font-semibold text-white text-sm">{feature.name}</span>
                      </div>
                      <div className="text-xs text-gray-400">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Module 14: Global Compliance */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                    <Globe className="w-5 h-5" style={{ color: '#00F2FE' }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Global Compliance Standards</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COMPLIANCE_STANDARDS.map((standard) => {
                    const statusColors: Record<string, string> = {
                      compliant: '#22c55e',
                      partial: '#fbbf24',
                      pending: '#6b7280',
                    };

                    return (
                      <div
                        key={standard.id}
                        className="p-4 rounded-xl"
                        style={{ background: statusColors[standard.status] + '10', border: `1px solid ${statusColors[standard.status]}30` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <BadgeCheck className="w-4 h-4" style={{ color: statusColors[standard.status] }} />
                          <span className="font-semibold text-white text-sm">{standard.name}</span>
                        </div>
                        <div className="text-xs text-gray-400">{standard.region}</div>
                        <div className={`text-xs mt-1 capitalize ${standard.status === 'compliant' ? 'text-emerald-400' : standard.status === 'partial' ? 'text-amber-400' : 'text-gray-500'}`}>
                          {standard.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Module 15: VCOS Financial Lock */}
            <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">VCOS™ Financial Lock</h2>
                    <p className="text-sm text-gray-400">Always enforced financial rules</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {VCOS_FINANCIAL_LOCK.map((rule) => {
                    const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                      Ban, Shield, BadgeCheck, Lock, ShieldCheck, FileText, Globe, Eye,
                    };
                    const Icon = iconMap[rule.icon] || CheckCircle;

                    return (
                      <div
                        key={rule.rule}
                        className="p-3 rounded-xl text-center"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
                      >
                        <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                        <div className="text-xs text-white font-medium">{rule.rule}</div>
                        <div className="text-xs text-gray-400 mt-1">{rule.description}</div>
                      </div>
                    );
                  })}
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
            onClick={() => onNavigate('universal-wallet')}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Wallet className="w-4 h-4" />
            Universal Wallet
          </button>
        </div>

      </div>
    </div>
  );
}
