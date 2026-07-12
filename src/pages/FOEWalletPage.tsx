import { useState, useEffect } from 'react';
import {
  Wallet, Gift, Lock, CheckCircle2, Clock, Star,
  Coins, ArrowUpRight, AlertCircle, ChevronRight,
  Building2, Car, Zap, Home, Heart, GraduationCap,
  Users, RefreshCw, Shield, TrendingUp, Info, CreditCard
} from 'lucide-react';
import {
  FOECustomerDashboard,
  FOEParticipationUnit,
  FOEProjectParticipation,
  FOEWalletTransaction,
  UnitStatus,
  UnitTier,
  getCustomerDashboard,
  getUserUnits,
  getUserProjectParticipations,
  getWalletTransactions,
  getStatusLabel,
  getTierLabel,
  getTierColor,
  formatSmartpoints,
  calculateProgress,
  UNIT_VALUES,
} from '../lib/FOEParticipationEngine';
import {
  DigitalCard,
  CardWalletSummary,
  getMockCards,
  convertSmartPointsToCards,
  getCardWalletSummary,
} from '../lib/FOECardEngine';
import ParticipationUnitCard, { CardGrid } from '../components/ParticipationUnitCard';
import {
  CardWalletSummaryCards,
} from '../components/ParticipationUnitCard';
import {
  PROJECT_CATEGORY_LABELS,
} from '../lib/FutureOpportunitiesEngine';

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  affordable_housing: Home,
  land_projects: Building2,
  villa_projects: Building2,
  apartment_projects: Building2,
  ev_programs: Zap,
  vehicle_programs: Car,
  gold_programs: Coins,
  education_support: GraduationCap,
  healthcare_support: Heart,
  community_development: Users,
  future: Star,
};

interface FOEWalletPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function FOEWalletPage({ onNavigate }: FOEWalletPageProps) {
  const [dashboard, setDashboard] = useState<FOECustomerDashboard | null>(null);
  const [units, setUnits] = useState<FOEParticipationUnit[]>([]);
  const [digitalCards, setDigitalCards] = useState<DigitalCard[]>([]);
  const [cardSummary, setCardSummary] = useState<CardWalletSummary | null>(null);
  const [participations, setParticipations] = useState<FOEProjectParticipation[]>([]);
  const [transactions, setTransactions] = useState<FOEWalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'units' | 'projects' | 'history'>('overview');

  useEffect(() => {
    async function loadData() {
      // Using placeholder data since no user is signed in during dev
      const mockDashboard: FOECustomerDashboard = {
        available_sp: 750,
        allocated_sp: 0,
        locked_sp: 0,
        purchase_sp: 500,
        careclub_sp: 250,
        total_earned: 750,
        wallet_balance: 750,
        total_units: 0,
        active_units: 0,
        completed_units: 0,
        pending_units: 0,
        projects_count: 0,
      };

      setDashboard(mockDashboard);

      // Mock units based on conversion of 750 SP
      const mockUnits: FOEParticipationUnit[] = [
        {
          id: 'unit-1',
          unit_id: 'FOE-2026-00001001',
          unit_code: 'SP-500',
          user_id: 'user-1',
          project_id: null,
          smartpoints_value: 500,
          status: 'pending' as UnitStatus,
          qr_code: null,
          ai_verification_status: 'pending',
          ai_verification_score: 0,
          allocated_at: null,
          locked_at: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'unit-2',
          unit_id: 'FOE-2026-00001002',
          unit_code: 'SP-250',
          user_id: 'user-1',
          project_id: null,
          smartpoints_value: 250,
          status: 'pending' as UnitStatus,
          qr_code: null,
          ai_verification_status: 'pending',
          ai_verification_score: 0,
          allocated_at: null,
          locked_at: null,
          created_at: new Date().toISOString(),
        },
      ];

      setUnits(mockUnits);

      // Mock transactions
      const mockTransactions: FOEWalletTransaction[] = [
        {
          id: 'txn-1',
          wallet_id: 'wallet-1',
          user_id: 'user-1',
          transaction_type: 'earn_purchase',
          amount: 500,
          previous_balance: 0,
          new_balance: 500,
          source_reference: 'Order #12345',
          description: 'SmartPoints from purchase',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'txn-2',
          wallet_id: 'wallet-1',
          user_id: 'user-1',
          transaction_type: 'earn_careclub',
          amount: 250,
          previous_balance: 500,
          new_balance: 750,
          source_reference: 'Contribution #C-1001',
          description: 'SmartPoints from Care Club contribution',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setTransactions(mockTransactions);

      // Mock digital cards based on 750 SP conversion (1 x 500 + 1 x 250)
      const mockCards = getMockCards('user-1');
      setDigitalCards(mockCards);

      // Mock card summary
      const mockCardSummary: CardWalletSummary = {
        total_cards: mockCards.length,
        active_cards: mockCards.filter((c) => c.status === 'active').length,
        locked_cards: mockCards.filter((c) => c.status === 'locked').length,
        completed_cards: mockCards.filter((c) => c.status === 'completed').length,
        pending_cards: mockCards.filter((c) => c.status === 'pending').length,
        cards_100: mockCards.filter((c) => c.card_type === 'SP-100').length,
        cards_250: mockCards.filter((c) => c.card_type === 'SP-250').length,
        cards_500: mockCards.filter((c) => c.card_type === 'SP-500').length,
        cards_1000: mockCards.filter((c) => c.card_type === 'SP-1000').length,
        total_smartpoints: mockCards.reduce((sum, c) => sum + c.smartpoints_value, 0),
        active_smartpoints: mockCards.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.smartpoints_value, 0),
        locked_smartpoints: mockCards.filter((c) => c.status === 'locked').reduce((sum, c) => sum + c.smartpoints_value, 0),
      };
      setCardSummary(mockCardSummary);

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading FOE Wallet...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Wallet },
    { key: 'cards', label: 'Digital Cards', icon: CreditCard },
    { key: 'units', label: 'Participation Units', icon: Coins },
    { key: 'projects', label: 'My Projects', icon: Building2 },
    { key: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-2">FOE Wallet</h1>
          <p className="text-blue-100">Future Opportunity Exchange Participation Center</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Tab Navigation */}
        <div className="bg-slate-800 rounded-2xl shadow-xl mb-6">
          <div className="flex border-b border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <OverviewTab
            dashboard={dashboard!}
            units={units}
            digitalCards={digitalCards}
            cardSummary={cardSummary}
            onNavigate={onNavigate}
          />
        )}
        {activeTab === 'cards' && (
          <CardsTab cards={digitalCards} summary={cardSummary} />
        )}
        {activeTab === 'units' && (
          <UnitsTab units={units} onNavigate={onNavigate} />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab participations={participations} onNavigate={onNavigate} />
        )}
        {activeTab === 'history' && (
          <HistoryTab transactions={transactions} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// OVERVIEW TAB
// ============================================================

function OverviewTab({
  dashboard,
  units,
  digitalCards,
  cardSummary,
  onNavigate,
}: {
  dashboard: FOECustomerDashboard;
  units: FOEParticipationUnit[];
  digitalCards: DigitalCard[];
  cardSummary: CardWalletSummary | null;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}) {
  const conversion = [
    { smartpoints: 500, tier: 'gold' as UnitTier, name: '500 SP Unit' },
    { smartpoints: 250, tier: 'silver' as UnitTier, name: '250 SP Unit' },
  ];

  return (
    <div className="space-y-6">
      {/* SmartPoints Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Purchase SmartPoints</p>
              <p className="text-3xl font-bold text-white">{formatSmartpoints(dashboard.purchase_sp)}</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs">
            Earned from purchases at VLOOP partner stores
          </p>
          <div className="mt-3 text-xs text-blue-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            30-day activation rule applies
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Care Club SmartPoints</p>
              <p className="text-3xl font-bold text-white">{formatSmartpoints(dashboard.careclub_sp)}</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs">
            Earned from Care Club contributions
          </p>
          <div className="mt-3 text-xs text-amber-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            30-day activation rule applies
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Star className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total SmartPoints</p>
              <p className="text-3xl font-bold text-white">{formatSmartpoints(dashboard.total_earned)}</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs">
            Available for Future Opportunity participation
          </p>
        </div>
      </div>

      {/* FOE Wallet Status */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          FOE Wallet Status
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700/30 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">Available</p>
            <p className="text-2xl font-bold text-emerald-400">{formatSmartpoints(dashboard.available_sp)}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">Allocated</p>
            <p className="text-2xl font-bold text-blue-400">{formatSmartpoints(dashboard.allocated_sp)}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">Locked</p>
            <p className="text-2xl font-bold text-amber-400">{formatSmartpoints(dashboard.locked_sp)}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">Projects</p>
            <p className="text-2xl font-bold text-purple-400">{dashboard.projects_count}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('future-opportunities')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            <ArrowUpRight className="w-5 h-5" />
            Explore Projects
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all">
            <RefreshCw className="w-5 h-5" />
            Refresh Balance
          </button>
        </div>
      </div>

      {/* Participation Units Preview */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Participation Units Preview
          </h2>
          <span className="text-slate-400 text-sm">{units.length} units ready</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {conversion.map((unit, i) => (
            <div key={i} className={`${getTierGradientFromTier(unit.tier)} rounded-xl p-4 text-center`}>
              <p className="text-white/70 text-xs mb-1">{unit.tier.charAt(0).toUpperCase() + unit.tier.slice(1)} Tier</p>
              <p className="text-3xl font-bold text-white mb-1">{unit.smartpoints}</p>
              <p className="text-white/80 text-sm">SP Unit</p>
            </div>
          ))}
        </div>

        <p className="text-slate-500 text-xs mt-4 text-center">
          Units generated automatically from SmartPoints. Allocation to projects opens when you select a project.
        </p>
      </div>

      {/* Unit Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Units', value: dashboard.total_units, icon: Coins, color: 'blue' },
          { label: 'Active', value: dashboard.active_units, icon: Lock, color: 'emerald' },
          { label: 'Completed', value: dashboard.completed_units, icon: CheckCircle2, color: 'purple' },
          { label: 'Pending', value: dashboard.pending_units, icon: Clock, color: 'amber' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <item.icon className={`w-6 h-6 text-${item.color}-400 mx-auto mb-2`} />
            <p className="text-xl font-bold text-white">{item.value}</p>
            <p className="text-slate-400 text-xs">{item.label}</p>
          </div>
        ))}
      </div>

      {/* VCOS Rules Info */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
        <h3 className="text-white font-medium mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          VCOS Core Rules
        </h3>
        <ul className="text-slate-400 text-sm space-y-1">
          <li>Purchase: ₹40 = 1 SmartPoint, 2% Cashback (Wallet-1), 30-Day Activation</li>
          <li>Care Club: ₹10 Contribution = 5 SmartPoints, 5% Benefit (Wallet-2), 30-Day Activation</li>
          <li>FOE is a SmartPoints-based Participation Engine - NOT a payment or investment system</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// UNITS TAB
// ============================================================

function UnitsTab({
  units,
  onNavigate,
}: {
  units: FOEParticipationUnit[];
  onNavigate: (page: string, params?: Record<string, string>) => void;
}) {
  const [filterStatus, setFilterStatus] = useState<UnitStatus | 'all'>('all');

  const filteredUnits = filterStatus === 'all'
    ? units
    : units.filter((u) => u.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'allocated', 'locked', 'active', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as UnitStatus | 'all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
          <Coins className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Participation Units</h3>
          <p className="text-slate-400 mb-6">Generate units from your SmartPoints</p>
          <button
            onClick={() => onNavigate('future-opportunities')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            Explore Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}

function UnitCard({ unit }: { unit: FOEParticipationUnit }) {
  const tier = unit.smartpoints_value >= 1000 ? 'platinum'
    : unit.smartpoints_value >= 500 ? 'gold'
    : unit.smartpoints_value >= 250 ? 'silver'
    : 'standard';

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className={`${getTierGradientFromTier(tier)} p-6 text-center`}>
        <p className="text-4xl font-bold text-white mb-1">{unit.smartpoints_value}</p>
        <p className="text-white/70">SmartPoints</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Unit ID</span>
          <span className="text-white font-mono text-sm">{unit.unit_id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(unit.status)}`}>
            {getStatusLabel(unit.status)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Tier</span>
          <span className="text-white text-sm">{getTierLabel(tier)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">AI Verification</span>
          <span className={`text-xs flex items-center gap-1 ${unit.ai_verification_status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
            <Shield className="w-3 h-3" />
            {unit.ai_verification_status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Created</span>
          <span className="text-white text-sm">{new Date(unit.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROJECTS TAB
// ============================================================

function ProjectsTab({
  participations,
  onNavigate,
}: {
  participations: FOEProjectParticipation[];
  onNavigate: (page: string, params?: Record<string, string>) => void;
}) {
  if (participations.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
        <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Project Participations Yet</h3>
        <p className="text-slate-400 mb-6">Explore Future Opportunity Projects to participate</p>
        <button
          onClick={() => onNavigate('future-opportunities')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
        >
          Explore Projects
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {participations.map((participation) => (
        <div key={participation.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Project Name</h3>
              <p className="text-slate-400 text-sm">{participation.total_units} units | {participation.total_smartpoints} SP</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// CARDS TAB
// ============================================================

function CardsTab({
  cards,
  summary,
}: {
  cards: DigitalCard[];
  summary: CardWalletSummary | null;
}) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {summary && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Digital Card Wallet
          </h2>
          <CardWalletSummaryCards summary={summary} />
        </div>
      )}

      {/* Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">My Digital Cards</h3>
          <span className="text-slate-400 text-sm">{cards.length} cards</span>
        </div>
        <CardGrid cards={cards} variant="full" />
      </div>

      {/* Info */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-white font-medium mb-1">Card Security</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>Each card has a unique encrypted ID and QR verification</li>
              <li>Cards are generated automatically when SmartPoints are allocated</li>
              <li>Tap cards to view full details and QR codes</li>
              <li>All cards are secured by VCOS integrity verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HISTORY TAB
// ============================================================

function HistoryTab({ transactions }: { transactions: FOEWalletTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
        <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Transaction History</h3>
        <p className="text-slate-400">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((txn) => (
        <div key={txn.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                txn.transaction_type.includes('earn') ? 'bg-emerald-500/20' : 'bg-blue-500/20'
              }`}>
                {txn.transaction_type.includes('earn') ? (
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Wallet className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">{txn.description}</p>
                <p className="text-slate-400 text-sm">{new Date(txn.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${txn.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {txn.amount > 0 ? '+' : ''}{txn.amount} SP
              </p>
              <p className="text-slate-400 text-sm">{txn.source_reference}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function getTierGradientFromTier(tier: UnitTier): string {
  const gradients: Record<UnitTier, string> = {
    standard: 'bg-gradient-to-br from-slate-500 to-slate-700',
    silver: 'bg-gradient-to-br from-gray-400 to-gray-600',
    gold: 'bg-gradient-to-br from-amber-500 to-amber-700',
    platinum: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
  };
  return gradients[tier] || 'bg-gradient-to-br from-gray-500 to-gray-700';
}

function getStatusBg(status: UnitStatus): string {
  const colors: Record<UnitStatus, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    allocated: 'bg-blue-500/20 text-blue-400',
    locked: 'bg-purple-500/20 text-purple-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    completed: 'bg-green-500/20 text-green-400',
    expired: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
}
