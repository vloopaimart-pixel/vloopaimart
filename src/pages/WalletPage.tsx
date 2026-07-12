import { useState } from 'react';
import {
  Wallet, Zap, TrendingUp, Clock, ArrowRight, Sparkles, Gift,
  ShoppingBag, Stethoscope, Building2, Car, Train, Droplets,
  Flame, ShieldCheck, Smartphone, Wifi, History, ChevronRight,
  Heart, Users, Award, Target, Eye, Globe, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  getMockWalletA,
  getMockWalletB,
  getMockWalletATransactions,
  getMockEssentialServices,
  getMockCareClubProfile,
  getMockCommunityImpact,
  formatCurrency,
  formatSmartPoints,
  getCareLevelColor,
  getCareLevelBadge,
  type WalletASmart,
  type WalletBFOE,
  type WalletATransaction,
  type EssentialService,
  type CareClubProfile,
} from '../lib/WalletOperatingSystem';

type WalletPageProps = {
  onNavigate: (page: string) => void;
};

export default function WalletPage({ onNavigate }: WalletPageProps) {
  const { profile } = useAuth();
  const [activeWallet, setActiveWallet] = useState<'wallet-a' | 'wallet-b'>('wallet-a');
  const [showTransactions, setShowTransactions] = useState(false);

  const walletA = getMockWalletA();
  const walletB = getMockWalletB();
  const transactions = getMockWalletATransactions();
  const essentialServices = getMockEssentialServices();
  const careProfile = getMockCareClubProfile();
  const communityImpact = getMockCommunityImpact();

  const serviceCategories = [
    { name: 'Electricity', icon: Zap, category: 'electricity', color: 'from-yellow-500 to-amber-500' },
    { name: 'Water', icon: Droplets, category: 'water', color: 'from-blue-500 to-cyan-500' },
    { name: 'Mobile', icon: Smartphone, category: 'mobile', color: 'from-green-500 to-emerald-500' },
    { name: 'Broadband', icon: Wifi, category: 'broadband', color: 'from-violet-500 to-purple-500' },
    { name: 'Gas', icon: Flame, category: 'gas', color: 'from-orange-500 to-red-500' },
    { name: 'Insurance', icon: ShieldCheck, category: 'insurance', color: 'from-emerald-500 to-teal-500' },
    { name: 'FASTag', icon: Car, category: 'fastag', color: 'from-pink-500 to-rose-500' },
    { name: 'Transport', icon: Train, category: 'transport', color: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-950 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dual Wallet System</h1>
              <p className="text-blue-200 text-sm">Smart Wallet + Future Opportunity Wallet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Toggle */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] md:top-[105px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3">
            <button
              onClick={() => setActiveWallet('wallet-a')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeWallet === 'wallet-a'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Smart Wallet (A)
            </button>
            <button
              onClick={() => setActiveWallet('wallet-b')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeWallet === 'wallet-b'
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Future Wallet (B)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeWallet === 'wallet-a' ? (
          <WalletASection
            wallet={walletA}
            transactions={transactions}
            showTransactions={showTransactions}
            setShowTransactions={setShowTransactions}
            onNavigate={onNavigate}
          />
        ) : (
          <WalletBSection wallet={walletB} onNavigate={onNavigate} />
        )}

        {/* Essential Services */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Essential Services
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {serviceCategories.map((service) => (
              <button
                key={service.category}
                onClick={() => onNavigate('wallet')}
                className="group flex flex-col items-center p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Community Impact */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-200" />
            <span className="text-sm font-medium text-emerald-200">Community Impact Today</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{communityImpact.total_contributions_day}</div>
              <div className="text-xs text-emerald-200">Contributions</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(communityImpact.total_amount_contributed_day)}</div>
              <div className="text-xs text-emerald-200">Amount</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{communityImpact.beneficiaries_helped_day}</div>
              <div className="text-xs text-emerald-200">Beneficiaries</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{communityImpact.active_volunteers_day}</div>
              <div className="text-xs text-emerald-200">Volunteers</div>
            </div>
          </div>
        </div>

        {/* Care Level Badge */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getCareLevelColor(careProfile.care_level)} flex items-center justify-center`}>
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Care Level</div>
                <div className={`font-bold capitalize ${getCareLevelBadge(careProfile.care_level).split(' ')[1]}`}>
                  {careProfile.care_level} Contributor
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {careProfile.total_contributions} contributions • {careProfile.total_beneficiaries} helped
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('careclub')}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View Care Club
            </button>
          </div>
          {careProfile.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {careProfile.badges.map((badge) => (
                <span key={badge} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SmartPoints Never Purchasable */}
        <div className="mt-6 bg-slate-100 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            <Sparkles className="w-4 h-4 inline mr-1 text-amber-500" />
            SmartPoints can ONLY be earned through approved ecosystem activities.
            They are NEVER directly purchasable.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WALLET A SECTION
// ============================================================

function WalletASection({
  wallet,
  transactions,
  showTransactions,
  setShowTransactions,
  onNavigate,
}: {
  wallet: WalletASmart;
  transactions: WalletATransaction[];
  showTransactions: boolean;
  setShowTransactions: (v: boolean) => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-blue-200 font-semibold tracking-wider mb-1">SMART WALLET</div>
              <h2 className="text-xl font-bold">Wallet A — SmartPoints Balance</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          <div className="text-5xl font-bold mb-6">{formatSmartPoints(wallet.smartpoints_balance)}</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{formatSmartPoints(wallet.activity_rewards_balance)}</div>
              <div className="text-xs text-blue-200">Activity Rewards</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{formatSmartPoints(wallet.learning_rewards_balance)}</div>
              <div className="text-xs text-blue-200">Learning Rewards</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{formatSmartPoints(wallet.quiz_rewards_balance)}</div>
              <div className="text-xs text-blue-200">Quiz Rewards</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{formatSmartPoints(wallet.volunteer_rewards_balance)}</div>
              <div className="text-xs text-blue-200">Volunteer</div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="flex-1">
              <div className="text-sm text-blue-200">Total Earned</div>
              <div className="text-xl font-bold">{formatSmartPoints(wallet.total_earned)}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-blue-200">Total Redeemed</div>
              <div className="text-xl font-bold">{formatSmartPoints(wallet.total_redeemed)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Earn Sources */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" />
          Approved SmartPoint Sources
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Marketplace Purchases', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
            { label: 'Essential Services', icon: Zap, color: 'bg-amber-100 text-amber-600' },
            { label: 'Educational Activities', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Quiz Completion', icon: Target, color: 'bg-violet-100 text-violet-600' },
            { label: 'Volunteer Activities', icon: Heart, color: 'bg-rose-100 text-rose-600' },
            { label: 'Care Club', icon: Users, color: 'bg-teal-100 text-teal-600' },
            { label: 'Community Campaigns', icon: Globe, color: 'bg-indigo-100 text-indigo-600' },
            { label: 'Daily Login', icon: Clock, color: 'bg-orange-100 text-orange-600' },
          ].map((source) => (
            <div key={source.label} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <div className={`w-8 h-8 rounded-lg ${source.color} flex items-center justify-center`}>
                <source.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-700">{source.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          SmartPoints cannot be purchased directly. They are only earned through participation.
        </p>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <button
          onClick={() => setShowTransactions(!showTransactions)}
          className="w-full p-5 flex items-center justify-between border-b border-gray-100"
        >
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Recent Transactions
          </h3>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showTransactions ? 'rotate-90' : ''}`} />
        </button>
        {showTransactions && (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{tx.description || tx.category}</div>
                  <div className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${tx.transaction_type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.transaction_type === 'credit' ? '+' : '-'}{tx.amount} SP
                  </div>
                  <div className="text-xs text-gray-500">Balance: {tx.balance_after}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// WALLET B SECTION
// ============================================================

function WalletBSection({
  wallet,
  onNavigate,
}: {
  wallet: WalletBFOE;
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-violet-200 font-semibold tracking-wider mb-1">FUTURE OPPORTUNITY</div>
              <h2 className="text-xl font-bold">Wallet B — FOE Units</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
          </div>

          <div className="text-5xl font-bold mb-2">{wallet.foe_units_balance} Units</div>
          <p className="text-violet-200 text-sm mb-6">Future Opportunity Units for project participation</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{wallet.active_projects}</div>
              <div className="text-xs text-violet-200">Active Projects</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{wallet.completed_projects}</div>
              <div className="text-xs text-violet-200">Completed</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <div className="text-lg font-bold">{wallet.total_foe_units_earned}</div>
              <div className="text-xs text-violet-200">Total Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Future Opportunities */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-violet-600" />
          Future Projects
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Housing Projects', icon: Building2, locked: false },
            { name: 'EV Vehicles', icon: Car, locked: false },
            { name: 'Land Opportunities', icon: Globe, locked: true },
            { name: 'Gold Programs', icon: Gift, locked: true },
            { name: 'Healthcare Plans', icon: Stethoscope, locked: true },
            { name: 'Education Fund', icon: Target, locked: true },
          ].map((project) => (
            <button
              key={project.name}
              disabled={project.locked}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                project.locked
                  ? 'bg-gray-50 border-gray-200 opacity-50'
                  : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 hover:border-violet-400'
              }`}
              onClick={() => onNavigate('future-opportunities')}
            >
              <div className="flex items-center gap-2 mb-2">
                <project.icon className={`w-5 h-5 ${project.locked ? 'text-gray-400' : 'text-violet-600'}`} />
                {project.locked && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Coming Soon</span>}
              </div>
              <div className={`font-semibold ${project.locked ? 'text-gray-400' : 'text-gray-900'}`}>{project.name}</div>
            </button>
          ))}
        </div>
        <button
          onClick={() => onNavigate('future-opportunities')}
          className="w-full mt-4 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
        >
          Explore Future Projects <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Participation Card */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-900 mb-2">FOE Participation Cards</h3>
        <p className="text-amber-700 text-sm mb-4">
          Each participation creates a digital card with project benefits
        </p>
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{wallet.active_projects}</div>
            <div className="text-xs text-gray-500">Active Cards</div>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{wallet.completed_projects}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
