import { useState } from 'react';
import {
  Wallet, Sparkles, Shield, TrendingUp, Award, Clock, ArrowUpRight,
  ArrowDownRight, ShoppingBag, Zap, QrCode, Heart, Users, Calendar,
  BookOpen, Gift, ArrowRightLeft, ChevronRight, Building2, Lock,
  Unlock, Target, Coins, BarChart3, RefreshCw, Eye, Filter
} from 'lucide-react';
import {
  getMockWalletBalance,
  getMockSmartPointsAnalytics,
  getMockTrustScoreBreakdown,
  getMockWalletTransactions,
  getMockWalletSummaryStats,
  formatCurrency,
  formatSmartPoints,
  getTrustLevelColor,
  getTrustLevelTextColor,
  getTransactionStatusColor,
  type WalletBalance,
  type SmartPointsAnalytics,
  type TrustScoreBreakdown,
  type WalletTransaction,
  type WalletSummaryStats,
} from '../lib/SmartWalletEngine';

type SmartWalletPageProps = {
  onNavigate: (page: string) => void;
};

export default function SmartWalletPage({ onNavigate }: SmartWalletPageProps) {
  const [activeView, setActiveView] = useState<'overview' | 'transactions' | 'smartpoints'>('overview');

  const walletBalance = getMockWalletBalance();
  const smartPointsAnalytics = getMockSmartPointsAnalytics();
  const trustScore = getMockTrustScoreBreakdown();
  const transactions = getMockWalletTransactions();
  const stats = getMockWalletSummaryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Wallet className="w-7 h-7 text-blue-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Smart Wallet</h1>
              <p className="text-blue-200 text-sm">Your complete financial overview</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickStatCard
              label="Available Balance"
              value={formatCurrency(walletBalance.wallet_1_available)}
              icon={Unlock}
              color="from-emerald-500 to-teal-600"
            />
            <QuickStatCard
              label="Locked Rewards"
              value={formatCurrency(walletBalance.wallet_2_locked)}
              icon={Lock}
              color="from-violet-500 to-purple-600"
            />
            <QuickStatCard
              label="SmartPoints"
              value={formatSmartPoints(walletBalance.smartpoints_balance)}
              icon={Sparkles}
              color="from-amber-500 to-orange-600"
            />
            <QuickStatCard
              label="Trust Score"
              value={`${walletBalance.trust_score}`}
              icon={Shield}
              color="from-cyan-500 to-blue-600"
            />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto hide-scrollbar">
            <TabButton
              active={activeView === 'overview'}
              onClick={() => setActiveView('overview')}
              icon={BarChart3}
              label="Overview"
            />
            <TabButton
              active={activeView === 'smartpoints'}
              onClick={() => setActiveView('smartpoints')}
              icon={Sparkles}
              label="SmartPoints"
            />
            <TabButton
              active={activeView === 'transactions'}
              onClick={() => setActiveView('transactions')}
              icon={ArrowRightLeft}
              label="Transactions"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'overview' && (
          <OverviewSection
            walletBalance={walletBalance}
            trustScore={trustScore}
            stats={stats}
            onNavigate={onNavigate}
          />
        )}
        {activeView === 'smartpoints' && (
          <SmartPointsSection
            analytics={smartPointsAnalytics}
            stats={stats}
          />
        )}
        {activeView === 'transactions' && (
          <TransactionsSection transactions={transactions} />
        )}
      </main>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function QuickStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs text-blue-200 font-medium">{label}</span>
      </div>
      <div className="text-lg md:text-xl font-bold">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function OverviewSection({
  walletBalance,
  trustScore,
  stats,
  onNavigate,
}: {
  walletBalance: WalletBalance;
  trustScore: TrustScoreBreakdown;
  stats: WalletSummaryStats;
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Wallet Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Wallet 1 Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Unlock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-emerald-100 font-medium">WALLET 1</div>
                  <div className="font-bold">Available Balance</div>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold mb-4">{formatCurrency(walletBalance.wallet_1_available)}</div>
            <div className="flex items-center justify-between text-sm text-emerald-100">
              <span>Instant access for payments</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Wallet 2 Card */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-violet-100 font-medium">WALLET 2</div>
                  <div className="font-bold">Locked Rewards</div>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold mb-4">{formatCurrency(walletBalance.wallet_2_locked)}</div>
            <div className="flex items-center justify-between text-sm text-violet-100">
              <span>30-day security hold</span>
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Trust Score Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-cyan-100 font-medium">TRUST</div>
                  <div className="font-bold">Trust Score</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-bold bg-white/20 ${getTrustLevelTextColor(trustScore.level)}`}>
                {trustScore.level}
              </div>
            </div>
            <div className="text-3xl font-bold mb-4">{trustScore.overall_score}</div>
            <div className="flex items-center gap-2 text-sm text-cyan-100">
              {trustScore.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              ) : trustScore.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4 text-red-300" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span>
                {trustScore.trend === 'up' ? `+${trustScore.trend_value}` : trustScore.trend === 'down' ? `-${trustScore.trend_value}` : 'Stable'} this month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Score Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-600" />
          Trust Score Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(trustScore.factors).map(([key, value]) => (
            <TrustFactorCard key={key} label={formatFactorLabel(key)} value={value} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton
            icon={Zap}
            label="Pay Bills"
            color="bg-amber-100 text-amber-600"
            onClick={() => onNavigate('essential-services')}
          />
          <QuickActionButton
            icon={QrCode}
            label="SmartCode"
            color="bg-violet-100 text-violet-600"
            onClick={() => onNavigate('smartcode')}
          />
          <QuickActionButton
            icon={Heart}
            label="Care Club"
            color="bg-rose-100 text-rose-600"
            onClick={() => onNavigate('careclub')}
          />
          <QuickActionButton
            icon={Building2}
            label="Future Projects"
            color="bg-indigo-100 text-indigo-600"
            onClick={() => onNavigate('future-opportunities')}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Activity Summary</div>
              <div className="text-sm text-gray-600">Your wallet activity</div>
            </div>
          </div>
          <div className="space-y-3">
            <SummaryStatRow label="Total Transactions" value={stats.total_transactions} />
            <SummaryStatRow label="This Month" value={stats.this_month_transactions} />
            <SummaryStatRow label="Avg Monthly Earnings" value={`${stats.average_monthly_earnings} SP`} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">SmartPoints Summary</div>
              <div className="text-sm text-gray-600">Your earning progress</div>
            </div>
          </div>
          <div className="space-y-3">
            <SummaryStatRow label="Total Earned" value={formatSmartPoints(stats.total_smartpoints_earned)} />
            <SummaryStatRow label="Total Redeemed" value={formatSmartPoints(stats.total_smartpoints_redeemed)} />
            <SummaryStatRow label="Current Balance" value={formatSmartPoints(walletBalance.smartpoints_balance)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartPointsSection({
  analytics,
  stats,
}: {
  analytics: SmartPointsAnalytics;
  stats: WalletSummaryStats;
}) {
  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm text-amber-100 font-medium">TOTAL SMARTPOINTS</div>
                <div className="text-4xl font-bold">{formatSmartPoints(analytics.total_balance)}</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-amber-100 text-sm">
              SmartPoints can ONLY be earned through approved ecosystem activities
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <AnalyticsCard
          label="Lifetime Earned"
          value={formatSmartPoints(analytics.lifetime_earned)}
          icon={Award}
          color="from-emerald-500 to-teal-600"
        />
        <AnalyticsCard
          label="This Month"
          value={formatSmartPoints(analytics.this_month_earned)}
          icon={TrendingUp}
          color="from-blue-500 to-indigo-600"
        />
        <AnalyticsCard
          label="Pending Rewards"
          value={formatSmartPoints(analytics.pending_rewards)}
          icon={Clock}
          color="from-violet-500 to-purple-600"
        />
        <AnalyticsCard
          label="Estimated Future"
          value={formatSmartPoints(analytics.estimated_future_rewards)}
          icon={Target}
          color="from-cyan-500 to-blue-600"
        />
      </div>

      {/* Earn Sources */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-600" />
          Approved SmartPoint Sources
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <EarnSourceCard icon={ShoppingBag} label="Marketplace" color="bg-blue-100 text-blue-600" />
          <EarnSourceCard icon={Zap} label="Essential Services" color="bg-amber-100 text-amber-600" />
          <EarnSourceCard icon={QrCode} label="SmartCode" color="bg-violet-100 text-violet-600" />
          <EarnSourceCard icon={Award} label="Quiz Challenges" color="bg-emerald-100 text-emerald-600" />
          <EarnSourceCard icon={Heart} label="Care Club" color="bg-rose-100 text-rose-600" />
          <EarnSourceCard icon={Users} label="Referrals" color="bg-indigo-100 text-indigo-600" />
          <EarnSourceCard icon={Calendar} label="Daily Login" color="bg-orange-100 text-orange-600" />
          <EarnSourceCard icon={BookOpen} label="Learning" color="bg-cyan-100 text-cyan-600" />
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-xl text-center">
          <p className="text-sm text-amber-800">
            <Lock className="w-4 h-4 inline mr-1" />
            SmartPoints are NEVER purchasable - They are earned only through participation
          </p>
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Monthly Progress
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Total Earned</div>
            <div className="text-2xl font-bold text-gray-900">{formatSmartPoints(stats.total_smartpoints_earned)}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Total Redeemed</div>
            <div className="text-2xl font-bold text-gray-900">{formatSmartPoints(stats.total_smartpoints_redeemed)}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Avg Monthly</div>
            <div className="text-2xl font-bold text-gray-900">{stats.average_monthly_earnings} SP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionsSection({
  transactions,
}: {
  transactions: WalletTransaction[];
}) {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          Transaction History
        </h3>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
          <FilterButton active={filter === 'credit'} onClick={() => setFilter('credit')} label="Credit" />
          <FilterButton active={filter === 'debit'} onClick={() => setFilter('debit')} label="Debit" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SmartPoints</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} />
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
        active ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

function TransactionRow({ transaction: tx }: { transaction: WalletTransaction }) {
  const Icon = getCategoryIcon(tx.category);
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(tx.date)}</div>
        <div className="text-xs text-gray-500">{formatTime(tx.date)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryBgColor(tx.category)}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{tx.description}</div>
            <div className="text-xs text-gray-500">{tx.reference_id || 'System'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {tx.amount > 0 ? (
          <div className="text-sm text-gray-900">{formatCurrency(tx.amount)}</div>
        ) : (
          <div className="text-sm text-gray-400">-</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
          {tx.type === 'credit' ? '+' : ''}{tx.smartpoints} SP
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionStatusColor(tx.status)}`}>
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
        </span>
      </td>
    </tr>
  );
}

function TransactionCard({ transaction: tx }: { transaction: WalletTransaction }) {
  const Icon = getCategoryIcon(tx.category);
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryBgColor(tx.category)}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">{tx.description}</div>
            <div className="text-xs text-gray-500">{formatDate(tx.date)} at {formatTime(tx.date)}</div>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionStatusColor(tx.status)}`}>
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          {tx.amount > 0 ? formatCurrency(tx.amount) : '-'}
        </div>
        <span className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
          {tx.type === 'credit' ? '+' : ''}{tx.smartpoints} SP
        </span>
      </div>
    </div>
  );
}

function TrustFactorCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium text-gray-900">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
    </button>
  );
}

function SummaryStatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function EarnSourceCard({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getCategoryIcon(category: string): React.ElementType {
  const icons: Record<string, React.ElementType> = {
    marketplace_purchase: ShoppingBag,
    essential_service: Zap,
    smartcode_reward: QrCode,
    quiz_completion: Award,
    care_club: Heart,
    referral_bonus: Users,
    daily_login: Calendar,
    learning_reward: BookOpen,
    redemption: Gift,
    transfer: ArrowRightLeft,
  };
  return icons[category] || Coins;
}

function getCategoryBgColor(category: string): string {
  const colors: Record<string, string> = {
    marketplace_purchase: 'bg-blue-100 text-blue-600',
    essential_service: 'bg-amber-100 text-amber-600',
    smartcode_reward: 'bg-violet-100 text-violet-600',
    quiz_completion: 'bg-emerald-100 text-emerald-600',
    care_club: 'bg-rose-100 text-rose-600',
    referral_bonus: 'bg-indigo-100 text-indigo-600',
    daily_login: 'bg-orange-100 text-orange-600',
    learning_reward: 'bg-cyan-100 text-cyan-600',
    redemption: 'bg-pink-100 text-pink-600',
    transfer: 'bg-slate-100 text-slate-600',
  };
  return colors[category] || 'bg-gray-100 text-gray-600';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFactorLabel(key: string): string {
  const labels: Record<string, string> = {
    account_age: 'Account Age',
    transaction_history: 'Transactions',
    verification_status: 'Verification',
    community_contribution: 'Community',
    consistency_score: 'Consistency',
  };
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
