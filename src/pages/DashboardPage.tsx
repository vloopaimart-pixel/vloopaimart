import { useEffect, useState } from 'react';
import {
  User, Zap, Wallet, Hash, ShoppingBag, HeartHandshake, Gift, TrendingUp,
  RefreshCw, Activity, BadgeCheck, Users, Copy, Check, History,
  Share2, Home, Award, ShieldCheck, Clock, ChevronRight, ArrowUpRight,
  ArrowDownRight, Sparkles, Bell, CreditCard, Receipt, Rocket, Building2, Shield,
  FileText,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type Order, type CareClubEntry, type BenefitEntry, type PointHistoryEntry, type ReferralReward } from '../lib/supabase';
import { REFERRAL_RULES } from '../lib/CoreBusinessEngine';
import BillVerificationPage from './BillVerificationPage';
import OrderHistoryPage from './OrderHistoryPage';

type DashboardPageProps = {
  onNavigate: (page: string) => void;
};

type TabId = 'home' | 'wallet' | 'points' | 'referrals' | 'benefits' | 'bills' | 'orders' | 'profile';

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { profile, session, refreshProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [careClub, setCareClub] = useState<CareClubEntry[]>([]);
  const [benefits, setBenefits] = useState<BenefitEntry[]>([]);
  const [pointHistory, setPointHistory] = useState<PointHistoryEntry[]>([]);
  const [referrals, setReferrals] = useState<ReferralReward[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => {
    if (profile) fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;
    setLoading(true);
    const [ordersRes, careRes, benefitsRes, pointsRes, refRes] = await Promise.all([
      supabase.from('orders').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
      supabase.from('care_club').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
      supabase.from('benefits_history').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
      supabase.from('point_history').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
      supabase.from('referral_rewards').select('*').eq('referrer_id', profile.id).order('created_at', { ascending: false }),
    ]);
    if (ordersRes.data) setOrders(ordersRes.data as Order[]);
    if (careRes.data) setCareClub(careRes.data as CareClubEntry[]);
    if (benefitsRes.data) setBenefits(benefitsRes.data as BenefitEntry[]);
    if (pointsRes.data) setPointHistory(pointsRes.data as PointHistoryEntry[]);
    if (refRes.data) setReferrals(refRes.data as ReferralReward[]);
    setLoading(false);
  };

  if (!session || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-vloop-100 flex items-center justify-center mb-4">
          <User size={36} className="text-vloop-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your dashboard</h2>
        <p className="text-gray-500 text-sm mb-6">Access your points, wallets, and benefits history</p>
        <button onClick={() => onNavigate('home')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  const lifetimePoints = pointHistory.reduce((sum, p) => sum + p.points_earned, 0);
  const referralEarnings = referrals.reduce((sum, r) => sum + r.referrer_points, 0);
  const totalContributions = careClub.reduce((sum, c) => sum + Number(c.amount), 0);
  const activeBenefits = benefits.filter((b) => b.wallet === 'wallet2').length;

  const recentActivity = [
    ...orders.map((o) => ({ type: 'order', title: `Order #${o.id.slice(0, 8)}`, detail: `₹${o.total_amount.toFixed(0)} • +${o.points_earned} pts`, date: o.created_at })),
    ...careClub.map((c) => ({ type: 'care', title: 'Care Club Contribution', detail: `₹${c.amount.toFixed(0)} • +${c.points_earned} pts`, date: c.created_at })),
    ...benefits.map((b) => ({ type: 'benefit', title: b.benefit_type, detail: `₹${Number(b.amount).toLocaleString('en-IN')} • ${b.points_used} pts used`, date: b.created_at })),
    ...pointHistory.map((p) => ({ type: 'point', title: p.activity, detail: `+${p.points_earned} pts • ${p.status}`, date: p.created_at })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const activityIcons: Record<string, any> = { order: ShoppingBag, care: HeartHandshake, benefit: Gift, point: Zap };
  const activityColors: Record<string, string> = {
    order: 'bg-vloop-100 text-vloop-600', care: 'bg-gold-100 text-gold-600',
    benefit: 'bg-success-100 text-success-600', point: 'bg-gold-100 text-gold-600',
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'points', label: 'Points', icon: Zap },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'benefits', label: 'Benefits', icon: ShieldCheck },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'bills', label: 'Bills', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-br from-vloop-800 to-vloop-950 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30">
              <Sparkles size={14} className="text-gold-400" />
              <span className="text-xs font-semibold text-gold-100">VLOOP Member Benefits Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-400" />
              </button>
              <button onClick={refreshProfile} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-2xl font-bold font-display text-vloop-950 shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold font-display truncate">Welcome to Your VLOOP Account</h1>
              <p className="text-vloop-200 text-sm truncate">{profile.name} • {profile.location || 'India'}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-500/20 border border-success-500/30">
              <BadgeCheck size={14} className="text-success-400" />
              <span className="text-xs font-semibold text-success-300">Active Member</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-gold-400 text-gold-300'
                      : 'border-transparent text-vloop-300 hover:text-white'
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* BILLS TAB — rendered outside the loading gate since it loads its own data */}
        {activeTab === 'bills' && (
          <BillVerificationPage onNavigate={onNavigate} />
        )}

        {/* ORDERS TAB — rendered outside the loading gate since it loads its own data */}
        {activeTab === 'orders' && (
          <OrderHistoryPage onNavigate={onNavigate} />
        )}

        {activeTab !== 'bills' && activeTab !== 'orders' && (
          loading ? (
            <div className="text-center py-20">
              <RefreshCw size={32} className="animate-spin text-vloop-600 mx-auto" />
            </div>
          ) : (
            <>
              {/* HOME TAB */}
              {activeTab === 'home' && (
                <div className="space-y-6 animate-fade-in">
                  {/* 7 Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 1. My VLOOP Code */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
                          <Hash size={20} className="text-white" />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 text-success-700 text-[10px] font-bold">
                          <BadgeCheck size={10} /> ACTIVE
                        </span>
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">My VLOOP Code</h3>
                      <div className="text-3xl font-bold text-vloop-700 font-display tracking-wider">{profile.vloop_code || '---'}</div>
                      <p className="text-xs text-gray-400 mt-1">3-digit member identifier</p>
                    </div>

                    {/* 2. Wallet Balance */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                          <Wallet size={20} className="text-vloop-950" />
                        </div>
                        <CreditCard size={16} className="text-gray-300" />
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">Wallet Balance</h3>
                      <div className="text-2xl font-bold text-gold-600 font-display">₹{profile.wallet1_balance.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-gray-500">Earned: <span className="font-semibold text-success-600">₹{profile.wallet1_total_earned.toLocaleString('en-IN')}</span></span>
                        <span className="text-gray-500">Used: <span className="font-semibold text-red-500">₹{profile.wallet1_total_used.toLocaleString('en-IN')}</span></span>
                      </div>
                    </div>

                    {/* 3. Reward Points */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                          <Zap size={20} className="text-vloop-950" fill="currentColor" />
                        </div>
                        <span className="text-xs font-bold text-vloop-600">{lifetimePoints} lifetime</span>
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">SmartPoints Balance</h3>
                      <div className="text-2xl font-bold text-gray-900 font-display">{profile.points.toLocaleString('en-IN')}</div>
                      <p className="text-xs text-gray-400 mt-1">Active reward points</p>
                    </div>

                    {/* 4. Wallet 2 */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-400 to-vloop-600 flex items-center justify-center">
                          <CreditCard size={20} className="text-white" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.wallet2_eligibility_status === 'eligible' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
                          {profile.wallet2_eligibility_status}
                        </span>
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">Wallet 2 (Savings)</h3>
                      <div className="text-2xl font-bold text-vloop-700 font-display">₹{Number(profile.wallet2_balance).toLocaleString('en-IN')}</div>
                      <p className="text-xs text-gray-400 mt-1">2% purchase credit • 30-day lock</p>
                    </div>

                    {/* 5. Orders */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
                          <ShoppingBag size={20} className="text-white" />
                        </div>
                        <button onClick={() => onNavigate('marketplace')} className="text-xs text-vloop-600 font-semibold hover:underline">Browse →</button>
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">Total Orders</h3>
                      <div className="text-2xl font-bold text-gray-900 font-display">{orders.length}</div>
                      <p className="text-xs text-gray-400 mt-1">All-time purchases</p>
                    </div>

                    {/* 6. Care Club */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                          <HeartHandshake size={20} className="text-white" />
                        </div>
                        <button onClick={() => onNavigate('careclub')} className="text-xs text-vloop-600 font-semibold hover:underline">View →</button>
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">Care Club Contributions</h3>
                      <div className="text-2xl font-bold text-gray-900 font-display">₹{totalContributions.toLocaleString('en-IN')}</div>
                      <p className="text-xs text-gray-400 mt-1">{careClub.length} contribution{careClub.length !== 1 ? 's' : ''}</p>
                    </div>

                    {/* 7. Benefits */}
                    <div className="card-premium p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-500 to-success-700 flex items-center justify-center">
                          <Gift size={20} className="text-white" />
                        </div>
                        <button onClick={() => setActiveTab('benefits')} className="text-xs text-vloop-600 font-semibold hover:underline">View →</button>
                      </div>
                      <h3 className="text-xs text-gray-500 mb-1">Active Benefits</h3>
                      <div className="text-2xl font-bold text-gray-900 font-display">{activeBenefits}</div>
                      <p className="text-xs text-gray-400 mt-1">{benefits.length} total claimed</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card-premium">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-vloop-600" />
                        <h3 className="font-bold text-gray-900">Recent Activity</h3>
                      </div>
                    </div>
                    {recentActivity.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">No activity yet. Start shopping to earn points!</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {recentActivity.map((a, idx) => {
                          const Icon = activityIcons[a.type] || Zap;
                          return (
                            <div key={idx} className="flex items-center gap-4 p-4">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activityColors[a.type] || 'bg-gray-100 text-gray-500'}`}>
                                <Icon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                                <p className="text-xs text-gray-500">{a.detail}</p>
                              </div>
                              <p className="text-xs text-gray-400 shrink-0">{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="card-premium">
                    <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                      <Rocket size={18} className="text-vloop-600" />
                      <h3 className="font-bold text-gray-900">Quick Access</h3>
                    </div>
                    <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      <button onClick={() => setActiveTab('bills')} className="p-4 rounded-xl bg-gradient-to-br from-vloop-50 to-vloop-100 border border-vloop-200 text-center hover:shadow-md transition-all group">
                        <FileText size={24} className="text-vloop-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">My Bills</div>
                      </button>
                      <button onClick={() => setActiveTab('orders')} className="p-4 rounded-xl bg-gradient-to-br from-vloop-50 to-vloop-100 border border-vloop-200 text-center hover:shadow-md transition-all group">
                        <ShoppingBag size={24} className="text-vloop-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">My Orders</div>
                      </button>
                      <button onClick={() => onNavigate('smartcode')} className="p-4 rounded-xl bg-gradient-to-br from-vloop-50 to-vloop-100 border border-vloop-200 text-center hover:shadow-md transition-all group">
                        <Hash size={24} className="text-vloop-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">SmartCode</div>
                      </button>
                      <button onClick={() => setActiveTab('wallet')} className="p-4 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200 text-center hover:shadow-md transition-all group">
                        <Wallet size={24} className="text-gold-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Wallets</div>
                      </button>
                      <button onClick={() => onNavigate('wallet-system')} className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 text-center hover:shadow-md transition-all group">
                        <CreditCard size={24} className="text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Wallet System</div>
                      </button>
                      <button onClick={() => onNavigate('foe-wallet')} className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 text-center hover:shadow-md transition-all group">
                        <TrendingUp size={24} className="text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">FOE Wallet</div>
                      </button>
                      <button onClick={() => onNavigate('careclub')} className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 text-center hover:shadow-md transition-all group">
                        <HeartHandshake size={24} className="text-rose-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Care Club</div>
                      </button>
                      <button onClick={() => onNavigate('marketplace')} className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-center hover:shadow-md transition-all group">
                        <ShoppingBag size={24} className="text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Marketplace</div>
                      </button>
                      <button onClick={() => onNavigate('cart')} className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border border-fuchsia-200 text-center hover:shadow-md transition-all group">
                        <ShoppingBag size={24} className="text-fuchsia-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Cart</div>
                      </button>
                      <button onClick={() => onNavigate('insurance')} className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-center hover:shadow-md transition-all group">
                        <ShieldCheck size={24} className="text-teal-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Insurance</div>
                      </button>
                      <button onClick={() => onNavigate('claim')} className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 text-center hover:shadow-md transition-all group">
                        <Gift size={24} className="text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Claim Benefits</div>
                      </button>
                      <button onClick={() => onNavigate('trust-score')} className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-center hover:shadow-md transition-all group">
                        <Shield size={24} className="text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Trust Score</div>
                      </button>
                      <button onClick={() => onNavigate('future-opportunities')} className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 text-center hover:shadow-md transition-all group">
                        <TrendingUp size={24} className="text-sky-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Future Opportunities</div>
                      </button>
                      <button onClick={() => onNavigate('partner-info')} className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-center hover:shadow-md transition-all group">
                        <Users size={24} className="text-slate-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">Partner Info</div>
                      </button>
                      <button onClick={() => onNavigate('about')} className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-center hover:shadow-md transition-all group">
                        <BadgeCheck size={24} className="text-gray-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">About VLOOP</div>
                      </button>
                      <button onClick={() => onNavigate('faq')} className="p-4 rounded-xl bg-gradient-to-br from-lime-50 to-lime-100 border border-lime-200 text-center hover:shadow-md transition-all group">
                        <History size={24} className="text-lime-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-semibold text-gray-700">FAQ</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* WALLET TAB */}
              {activeTab === 'wallet' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wallet 1 */}
                    <div className="card-premium p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <Wallet size={24} className="text-vloop-950" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Wallet 1</h3>
                            <p className="text-xs text-gray-500">Main Reward Wallet</p>
                          </div>
                        </div>
                        <button onClick={() => onNavigate('wallet')} className="text-xs text-vloop-600 font-semibold hover:underline">Manage →</button>
                      </div>
                      <div className="text-3xl font-bold text-gold-600 font-display mb-4">₹{profile.wallet1_balance.toLocaleString('en-IN')}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Earned</span>
                          <span className="font-semibold text-success-600">₹{profile.wallet1_total_earned.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Used</span>
                          <span className="font-semibold text-red-500">₹{profile.wallet1_total_used.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Wallet 2 */}
                    <div className="card-premium p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-vloop-400 to-vloop-600 flex items-center justify-center">
                            <CreditCard size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Wallet 2</h3>
                            <p className="text-xs text-gray-500">Savings Wallet (2% purchase)</p>
                          </div>
                        </div>
                        <button onClick={() => onNavigate('smart-wallet')} className="text-xs text-vloop-600 font-semibold hover:underline">Manage →</button>
                      </div>
                      <div className="text-3xl font-bold text-vloop-700 font-display mb-4">₹{Number(profile.wallet2_balance).toLocaleString('en-IN')}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <span className={`font-semibold capitalize ${profile.wallet2_support_status === 'active' ? 'text-success-600' : 'text-amber-600'}`}>{profile.wallet2_support_status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Eligibility</span>
                          <span className={`font-semibold capitalize ${profile.wallet2_eligibility_status === 'eligible' ? 'text-success-600' : 'text-amber-600'}`}>{profile.wallet2_eligibility_status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wallet actions */}
                  <div className="card-premium p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Wallet Ecosystem</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Universal Wallet', page: 'universal-wallet', color: 'from-sky-50 to-sky-100 border-sky-200', textColor: 'text-sky-600', icon: Wallet },
                        { label: 'Wallet System', page: 'wallet-system', color: 'from-yellow-50 to-yellow-100 border-yellow-200', textColor: 'text-yellow-600', icon: CreditCard },
                        { label: 'FOE Wallet', page: 'foe-wallet', color: 'from-emerald-50 to-emerald-100 border-emerald-200', textColor: 'text-emerald-600', icon: TrendingUp },
                        { label: 'Payment & Finance', page: 'payment-finance', color: 'from-vloop-50 to-vloop-100 border-vloop-200', textColor: 'text-vloop-600', icon: Receipt },
                      ].map((item) => (
                        <button key={item.label} onClick={() => onNavigate(item.page)}
                          className={`p-4 rounded-xl bg-gradient-to-br ${item.color} border text-center hover:shadow-md transition-all group`}>
                          <item.icon size={22} className={`${item.textColor} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                          <div className="text-xs font-semibold text-gray-700">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* POINTS TAB */}
              {activeTab === 'points' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="card-premium p-5 text-center">
                      <div className="text-3xl font-bold text-gray-900 font-display">{profile.points}</div>
                      <p className="text-xs text-gray-500 mt-1">Current Balance</p>
                    </div>
                    <div className="card-premium p-5 text-center">
                      <div className="text-3xl font-bold text-success-600 font-display">{lifetimePoints}</div>
                      <p className="text-xs text-gray-500 mt-1">Lifetime Earned</p>
                    </div>
                    <div className="card-premium p-5 text-center">
                      <div className="text-3xl font-bold text-vloop-600 font-display">{pointHistory.length}</div>
                      <p className="text-xs text-gray-500 mt-1">Total Events</p>
                    </div>
                  </div>
                  <div className="card-premium">
                    <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                      <Zap size={18} className="text-gold-500" />
                      <h3 className="font-bold text-gray-900">Points History</h3>
                    </div>
                    {pointHistory.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">No points history yet.</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {pointHistory.slice(0, 20).map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{p.activity || p.source_type}</p>
                              <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-success-600">+{p.points_earned} pts</p>
                              <p className="text-xs text-gray-400 capitalize">{p.status || 'completed'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REFERRALS TAB */}
              {activeTab === 'referrals' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="card-premium p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Share2 size={18} className="text-vloop-600" /> Your Referral Code
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-vloop-50 rounded-xl border border-vloop-200 px-4 py-3">
                        <span className="text-2xl font-bold text-vloop-700 font-display tracking-widest">
                          {profile.referral_code || '—'}
                        </span>
                      </div>
                      <button
                        onClick={() => { navigator.clipboard.writeText(profile.referral_code || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        className="flex items-center gap-1.5 px-4 py-3 bg-vloop-600 text-white rounded-xl hover:bg-vloop-700 transition-colors font-semibold text-sm"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-xl font-bold text-gray-900">{profile.referral_count}</div>
                        <p className="text-xs text-gray-500">Referrals</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-xl font-bold text-success-600">{referralEarnings}</div>
                        <p className="text-xs text-gray-500">Pts Earned</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-xl font-bold text-vloop-600">{REFERRAL_RULES.BONUS_POINTS}</div>
                        <p className="text-xs text-gray-500">Pts / Referral</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-premium">
                    <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                      <Users size={18} className="text-vloop-600" />
                      <h3 className="font-bold text-gray-900">Referral History</h3>
                    </div>
                    {referrals.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">No referrals yet. Share your code!</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {referrals.map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.referred_email}</p>
                              <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-success-600">+{r.referrer_points} pts</p>
                              <p className={`text-xs capitalize font-medium ${r.status === 'completed' ? 'text-success-600' : 'text-amber-500'}`}>{r.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* BENEFITS TAB */}
              {activeTab === 'benefits' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                    <div className="card-premium p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{benefits.length}</div>
                      <p className="text-xs text-gray-500 mt-1">Total Claimed</p>
                    </div>
                    <div className="card-premium p-4 text-center">
                      <div className="text-2xl font-bold text-success-600">{activeBenefits}</div>
                      <p className="text-xs text-gray-500 mt-1">Active</p>
                    </div>
                    <div className="card-premium p-4 text-center">
                      <div className="text-2xl font-bold text-vloop-600">{benefits.reduce((s, b) => s + b.points_used, 0)}</div>
                      <p className="text-xs text-gray-500 mt-1">Pts Used</p>
                    </div>
                    <div className="card-premium p-4 text-center">
                      <div className="text-2xl font-bold text-gold-600">₹{benefits.reduce((s, b) => s + Number(b.amount), 0).toLocaleString('en-IN')}</div>
                      <p className="text-xs text-gray-500 mt-1">Total Value</p>
                    </div>
                  </div>
                  <div className="card-premium">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-success-600" />
                        <h3 className="font-bold text-gray-900">Benefits History</h3>
                      </div>
                      <button onClick={() => onNavigate('benefit-claim')} className="text-xs text-vloop-600 font-semibold hover:underline">Claim New →</button>
                    </div>
                    {benefits.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">No benefits claimed yet.</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {benefits.map((b) => (
                          <div key={b.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-success-100 flex items-center justify-center">
                                <Gift size={16} className="text-success-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{b.benefit_type}</p>
                                <p className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString('en-IN')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gold-600">₹{Number(b.amount).toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-400">{b.points_used} pts</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in max-w-2xl">
                  <div className="card-premium p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-3xl font-bold text-vloop-950 font-display">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 text-success-700 text-[10px] font-bold">
                            <BadgeCheck size={10} /> {profile.membership_status}
                          </span>
                          {profile.admin_role && profile.admin_role !== 'none' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-vloop-100 text-vloop-700 text-[10px] font-bold">
                              <Award size={10} /> {profile.admin_role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Mobile', value: profile.mobile },
                        { label: 'Location', value: profile.location || '—' },
                        { label: 'Member ID', value: profile.member_id || '—' },
                        { label: 'Referral Code', value: profile.referral_code || '—' },
                        { label: 'VLOOP Code', value: profile.vloop_code || '—' },
                        { label: 'Member Since', value: new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-500">{row.label}</span>
                          <span className="text-sm font-medium text-gray-900">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => onNavigate('profile')} className="btn-primary w-full">
                    Edit Profile
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}
