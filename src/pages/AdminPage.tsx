import { useState, useEffect } from 'react';
import { Users, Zap, Wallet, History, LifeBuoy, TrendingUp, TrendingDown, Activity, ShieldCheck, Database, Server, Lock, Store, Package, BarChart3, ArrowUpRight, CheckCircle2, Clock, AlertCircle, Trophy, Check, X, Loader2, RefreshCw, Settings, ToggleLeft, ToggleRight, Play, FileText, Video, Calendar, Sparkles, Hash, Eye, Brain, LayoutDashboard } from 'lucide-react';
import { supabase, type Profile, type ParticipationEntry, type AdminSetting, type DailyHint, type AwarenessContent } from '../lib/supabase';
import { getRewardTier, REWARD_CATEGORIES, ADMIN_STATUS } from '../lib/vloopEngine';
import { getAdminSettings, updateAdminSetting, publishHint, publishAwarenessContent, addQuizQuestion } from '../lib/engagementEngine';

type AdminPageProps = {
  onNavigate: (page: string) => void;
};

type WinnerEntry = ParticipationEntry & {
  category: string;
  profiles: Pick<Profile, 'id' | 'name' | 'vloop_code' | 'points'> | null;
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'wallets' | 'winners' | 'controls' | 'analytics' | 'architecture' | 'smartcode'>('overview');
  const [pendingWinners, setPendingWinners] = useState<WinnerEntry[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSetting[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPoints: 0,
    wallet1Credits: 0,
    wallet2Credits: 0,
  });

  useEffect(() => {
    if (activeTab === 'winners') {
      fetchPendingWinners();
    }
    if (activeTab === 'overview') {
      fetchStats();
    }
    if (activeTab === 'controls') {
      fetchAdminSettings();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    const { count: memberCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { data: pointsData } = await supabase.from('profiles').select('points, wallet1_balance, wallet2_balance');
    if (pointsData) {
      const totalPts = pointsData.reduce((sum, p) => sum + (p.points || 0), 0);
      const totalW1 = pointsData.reduce((sum, p) => sum + Number(p.wallet1_balance || 0), 0);
      const totalW2 = pointsData.reduce((sum, p) => sum + Number(p.wallet2_balance || 0), 0);
      setStats({
        totalMembers: memberCount || 0,
        totalPoints: totalPts,
        wallet1Credits: totalW1,
        wallet2Credits: totalW2,
      });
    }
  };

  const fetchAdminSettings = async () => {
    const settings = await getAdminSettings();
    setAdminSettings(settings);
  };

  const handleToggleSetting = async (key: string, currentValue: boolean) => {
    await updateAdminSetting(key, !currentValue);
    await fetchAdminSettings();
  };

  const fetchPendingWinners = async () => {
    setLoadingWinners(true);
    const { data } = await supabase
      .from('participation')
      .select('*, profiles(id, name, vloop_code, points)')
      .eq('winner_status', 'pending')
      .not('smartcode', 'is', null)
      .order('created_at', { ascending: false });
    if (data) setPendingWinners(data as WinnerEntry[]);
    setLoadingWinners(false);
  };

  const handleApproveWinner = async (entry: WinnerEntry) => {
    if (!entry.profiles) return;
    setProcessingId(entry.id);
    const tier = getRewardTier(entry.points_used);
    const category = (entry.category || 'standard') as keyof typeof tier;
    const amount = tier[category] || tier.standard;

    // Update participation status
    await supabase
      .from('participation')
      .update({ winner_status: 'approved', winner_amount: amount })
      .eq('id', entry.id);

    // Credit Wallet 1
    await supabase
      .from('profiles')
      .update({
        wallet1_balance: (entry.profiles.points || 0) + amount,
        wallet1_total_earned: supabase.rpc('increment', { row: entry.profiles.id, column: 'wallet1_total_earned', value: amount }),
      })
      .eq('id', entry.user_id);

    // Record in point_history
    await supabase.from('point_history').insert({
      user_id: entry.user_id,
      activity: 'Weekly Reward Winning',
      amount: amount,
      points_earned: 0,
      status: 'completed',
    });

    await fetchPendingWinners();
    setProcessingId(null);
  };

  const handleRejectWinner = async (entry: WinnerEntry) => {
    setProcessingId(entry.id);
    await supabase
      .from('participation')
      .update({ winner_status: 'rejected', winner_amount: 0 })
      .eq('id', entry.id);
    await fetchPendingWinners();
    setProcessingId(null);
  };

  const handleDisburseWinner = async (entry: WinnerEntry) => {
    setProcessingId(entry.id);
    await supabase
      .from('participation')
      .update({ winner_status: 'disbursed' })
      .eq('id', entry.id);
    await fetchPendingWinners();
    setProcessingId(null);
  };

  const displayStats = [
    { label: 'Total Members', value: stats.totalMembers.toLocaleString('en-IN'), change: '+12.5%', trend: 'up', icon: Users, color: 'from-vloop-500 to-vloop-700' },
    { label: 'Total Points Issued', value: stats.totalPoints.toLocaleString('en-IN'), change: '+8.3%', trend: 'up', icon: Zap, color: 'from-gold-400 to-gold-600' },
    { label: 'Wallet 1 Credits', value: `₹${(stats.wallet1Credits / 100000).toFixed(1)}L`, change: '+15.7%', trend: 'up', icon: Wallet, color: 'from-vloop-400 to-vloop-600' },
    { label: 'Wallet 2 Credits', value: `₹${(stats.wallet2Credits / 100000).toFixed(1)}L`, change: '+10.2%', trend: 'up', icon: Wallet, color: 'from-gold-400 to-gold-600' },
    { label: 'Support Requests', value: '23', change: '-5.1%', trend: 'down', icon: LifeBuoy, color: 'from-vloop-400 to-vloop-600' },
    { label: 'Store Partners', value: '45', change: '+20%', trend: 'up', icon: Store, color: 'from-success-500 to-success-700' },
    { label: 'Products', value: '128', change: '+8', trend: 'up', icon: Package, color: 'from-vloop-500 to-vloop-700' },
    { label: 'Analytics', value: 'Live', change: 'Real-time', trend: 'up', icon: BarChart3, color: 'from-gold-500 to-gold-700' },
  ];

  const dbTables = [
    { name: 'Members', desc: 'User profiles, codes, points, membership status', icon: Users, status: 'Ready' },
    { name: 'Points', desc: 'Point history ledger with amounts & status', icon: Zap, status: 'Ready' },
    { name: 'Wallet1', desc: 'Personal benefit wallet: earned, used, available', icon: Wallet, status: 'Ready' },
    { name: 'Wallet2', desc: 'Charity support wallet: activation, eligibility', icon: Wallet, status: 'Ready' },
    { name: 'Participation', desc: 'Quiz & activity records', icon: History, status: 'Ready' },
    { name: 'Products', desc: 'Product catalog & inventory', icon: Package, status: 'Ready' },
    { name: 'Store Partners', desc: 'Partner store registrations', icon: Store, status: 'Ready' },
    { name: 'Support Requests', desc: 'Member support tickets', icon: LifeBuoy, status: 'Ready' },
    { name: 'Admin Panel', desc: 'Admin access & controls', icon: ShieldCheck, status: 'Architecture' },
  ];

  const recentMembers = [
    { name: 'Rajesh Kumar', code: '482', points: 12, joined: '2026-06-24', status: 'active' },
    { name: 'Priya Sharma', code: '777', points: 8, joined: '2026-06-23', status: 'active' },
    { name: 'Mohammed Ali', code: '123', points: 15, joined: '2026-06-23', status: 'active' },
    { name: 'Sneha Patel', code: '999', points: 5, joined: '2026-06-22', status: 'pending' },
    { name: 'Arjun Reddy', code: '356', points: 20, joined: '2026-06-22', status: 'active' },
  ];

  const recentTransactions = [
    { type: 'Shopping', member: 'Rajesh K.', amount: '₹1,299', points: '+32', wallet: 'Wallet 1' },
    { type: 'Care Club', member: 'Priya S.', amount: '₹500', points: '+25', wallet: 'Wallet 2' },
    { type: 'Benefit Claim', member: 'Mohammed A.', amount: '₹2,000', points: '-10', wallet: 'Wallet 1' },
    { type: 'Shopping', member: 'Sneha P.', amount: '₹649', points: '+16', wallet: 'Wallet 1' },
    { type: 'Recharge', member: 'Arjun R.', amount: '₹299', points: '0', wallet: 'Wallet 1' },
  ];

  const storePartners = [
    { name: 'Sri Lakshmi Stores', category: 'Groceries', location: 'Hyderabad', status: 'approved' },
    { name: 'Pure Water Co.', category: 'Drinking Water', location: 'Bangalore', status: 'approved' },
    { name: 'TechWorld Electronics', category: 'Electronics', location: 'Chennai', status: 'pending' },
    { name: 'Fashion Hub', category: 'Fashion', location: 'Mumbai', status: 'approved' },
  ];

  const supportRequests = [
    { member: 'Rajesh K.', type: 'Wallet 2 Claim', status: 'open', date: '2026-06-24' },
    { member: 'Priya S.', type: 'Points Issue', status: 'in_progress', date: '2026-06-23' },
    { member: 'Mohammed A.', type: 'Insurance Query', status: 'resolved', date: '2026-06-22' },
    { member: 'Sneha P.', type: 'Store Partner', status: 'open', date: '2026-06-22' },
  ];

  const analyticsData = [
    { label: 'Monthly Active Members', value: '892', change: '+15%', trend: 'up' },
    { label: 'Avg Points Per Member', value: '36.6', change: '+4.2%', trend: 'up' },
    { label: 'Avg Wallet 1 Balance', value: '₹3,612', change: '+8.1%', trend: 'up' },
    { label: 'Avg Wallet 2 Balance', value: '₹1,845', change: '+6.3%', trend: 'up' },
    { label: 'Monthly Sales Volume', value: '₹8.2L', change: '+15.7%', trend: 'up' },
    { label: 'Care Club Contributions', value: '₹2.3L', change: '+10.2%', trend: 'up' },
    { label: 'Benefit Claims Processed', value: '189', change: '+12%', trend: 'up' },
    { label: 'New Store Partners', value: '8', change: '+20%', trend: 'up' },
  ];

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'members', label: 'Members', icon: Users },
    { key: 'wallets', label: 'Wallets', icon: Wallet },
    { key: 'winners', label: 'Winners', icon: Trophy },
    { key: 'smartcode', label: 'SmartCode Center', icon: Hash },
    { key: 'controls', label: 'Controls', icon: Settings },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'architecture', label: 'Architecture', icon: Server },
  ];

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-800 to-vloop-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
              <ShieldCheck size={24} className="text-vloop-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display">Admin Control Panel</h1>
              <p className="text-vloop-200 text-sm">Platform overview, analytics & architecture preview</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 mt-2">
            <Lock size={14} className="text-gold-400" />
            <span className="text-xs font-medium text-gold-200">Preview Mode — Admin access requires authentication</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-vloop-600 text-white shadow-md'
                    : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {displayStats.map((stat) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                return (
                  <div key={stat.label} className="card-premium p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.trend === 'up' ? 'text-success-600' : 'text-red-500'}`}>
                        <TrendIcon size={12} /> {stat.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-display">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Members */}
              <div className="card-premium overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Users size={18} className="text-vloop-600" /> Recent Members
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {recentMembers.map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center text-white text-sm font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">Code: {member.code} • Joined: {member.joined}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          member.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-gold-100 text-gold-700'
                        }`}>{member.status}</span>
                        <span className="font-bold text-sm text-gold-600">{member.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="card-premium overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Activity size={18} className="text-vloop-600" /> Wallet Transactions
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {recentTransactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-vloop-50 flex items-center justify-center">
                          <Wallet size={16} className="text-vloop-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{tx.type}</div>
                          <div className="text-xs text-gray-500">{tx.member} • {tx.wallet}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-gray-900">{tx.amount}</div>
                        <div className={`text-xs font-semibold ${tx.points.startsWith('+') ? 'text-gold-600' : 'text-red-500'}`}>{tx.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Participation Records */}
            <div className="card-premium p-5 mb-8">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <History size={18} className="text-vloop-600" /> Participation Records
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Weekly Quizzes', value: '342' },
                  { label: 'Code Generations', value: '1,248' },
                  { label: 'Care Club Joins', value: '567' },
                  { label: 'Benefit Claims', value: '189' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-2xl font-bold text-vloop-700 font-display">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-vloop-600" /> Member Management
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Member</th>
                    <th className="py-3 px-4 font-medium">Code</th>
                    <th className="py-3 px-4 font-medium">Points</th>
                    <th className="py-3 px-4 font-medium">Join Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMembers.map((member, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center text-white text-xs font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-vloop-700">{member.code}</td>
                      <td className="py-3 px-4 font-bold text-gold-600">{member.points}</td>
                      <td className="py-3 px-4 text-gray-500">{member.joined}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          member.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-gold-100 text-gold-700'
                        }`}>{member.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wallets Tab */}
        {activeTab === 'wallets' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Wallet 1 */}
              <div className="card-premium overflow-hidden">
                <div className="bg-gradient-to-r from-vloop-600 to-vloop-800 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet size={20} />
                    <h3 className="font-bold">Wallet 1 — Personal Benefits</h3>
                  </div>
                  <p className="text-vloop-200 text-xs">Shopping, recharge, utility & future services</p>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: 'Total Credits Issued', value: '₹4,56,200' },
                    { label: 'Total Used', value: '₹1,82,400' },
                    { label: 'Available Balance', value: '₹2,73,800' },
                    { label: 'Active Transactions', value: '1,248' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wallet 2 */}
              <div className="card-premium overflow-hidden">
                <div className="bg-gradient-to-r from-gold-400 to-gold-600 p-5 text-vloop-950">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet size={20} />
                    <h3 className="font-bold">Wallet 2 — Charity Support</h3>
                  </div>
                  <p className="text-vloop-800 text-xs">Community-funded support system</p>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: 'Total Support Fund', value: '₹2,34,500' },
                    { label: 'Support Disbursed', value: '₹56,200' },
                    { label: 'Available Fund', value: '₹1,78,300' },
                    { label: 'Pending Claims', value: '12' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Requests */}
            <div className="card-premium overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <LifeBuoy size={18} className="text-vloop-600" /> Support Requests
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {supportRequests.map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        req.status === 'open' ? 'bg-red-50' : req.status === 'in_progress' ? 'bg-gold-50' : 'bg-success-50'
                      }`}>
                        {req.status === 'open' ? <AlertCircle size={16} className="text-red-500" /> :
                         req.status === 'in_progress' ? <Clock size={16} className="text-gold-600" /> :
                         <CheckCircle2 size={16} className="text-success-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{req.type}</div>
                        <div className="text-xs text-gray-500">{req.member} • {req.date}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                      req.status === 'open' ? 'bg-red-100 text-red-700' :
                      req.status === 'in_progress' ? 'bg-gold-100 text-gold-700' :
                      'bg-success-100 text-success-700'
                    }`}>{req.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Winners Tab - Weekly SmartCode Winners Dashboard */}
        {activeTab === 'winners' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="card-premium p-5 bg-gradient-to-r from-gold-50 to-vloop-50 border-2 border-gold-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <Trophy size={24} className="text-vloop-950" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-display">Weekly SmartCode Winners</h2>
                    <p className="text-sm text-gray-600">Review and approve pending winners for Wallet 1 credit</p>
                  </div>
                </div>
                <button
                  onClick={fetchPendingWinners}
                  disabled={loadingWinners}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <RefreshCw size={20} className={`text-vloop-600 ${loadingWinners ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card-premium p-4 text-center">
                <div className="text-2xl font-bold text-gold-600 font-display">{pendingWinners.length}</div>
                <div className="text-xs text-gray-500">Pending Approval</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-2xl font-bold text-success-600 font-display">
                  {pendingWinners.filter(w => w.category === 'prime').length}
                </div>
                <div className="text-xs text-gray-500">Prime Winners</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-2xl font-bold text-vloop-600 font-display">
                  {pendingWinners.reduce((sum, w) => sum + (w.points_used || 0), 0)}
                </div>
                <div className="text-xs text-gray-500">Total Points Used</div>
              </div>
            </div>

            {/* Workflow Info */}
            <div className="p-4 rounded-xl bg-vloop-50 border border-vloop-100 flex items-start gap-3">
              <ShieldCheck size={18} className="text-vloop-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Admin Verification Workflow</h4>
                <p className="text-xs text-gray-600">
                  Winners appear here after SmartCode participation. Approve to credit Wallet 1, or reject.
                  Wallet 1 credit only releases after admin approval.
                </p>
              </div>
            </div>

            {/* Winners List */}
            {loadingWinners ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-vloop-600" />
              </div>
            ) : pendingWinners.length === 0 ? (
              <div className="card-premium p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Trophy size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">No Pending Winners</h3>
                <p className="text-sm text-gray-400">All SmartCode winners have been processed</p>
              </div>
            ) : (
              <div className="card-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500 bg-gray-50">
                        <th className="py-3 px-4 font-medium">Member</th>
                        <th className="py-3 px-4 font-medium">SmartCode</th>
                        <th className="py-3 px-4 font-medium">Category</th>
                        <th className="py-3 px-4 font-medium">Points Used</th>
                        <th className="py-3 px-4 font-medium">Reward Amount</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingWinners.map((entry) => {
                        const tier = getRewardTier(entry.points_used);
                        const category = (entry.category || 'standard') as keyof typeof tier;
                        const amount = tier[category] || tier.standard;
                        const categoryInfo = REWARD_CATEGORIES[category as keyof typeof REWARD_CATEGORIES] || REWARD_CATEGORIES.standard;
                        const isProcessing = processingId === entry.id;

                        return (
                          <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center text-white text-sm font-bold">
                                  {(entry.profiles?.name || 'U').charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{entry.profiles?.name || 'Unknown'}</div>
                                  <div className="text-xs text-gray-500">{entry.profiles?.points || 0} pts total</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-mono text-lg font-bold text-vloop-700">{entry.smartcode}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                                category === 'prime' ? 'bg-gold-100 text-gold-800' :
                                category === 'premium' ? 'bg-vloop-100 text-vloop-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {categoryInfo.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold text-gold-600">{entry.points_used}</td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-success-600">₹{amount.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                                entry.winner_status === 'pending' ? 'bg-gold-100 text-gold-700' :
                                entry.winner_status === 'approved' ? 'bg-success-100 text-success-700' :
                                entry.winner_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {entry.winner_status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {entry.winner_status === ADMIN_STATUS.PENDING && (
                                  <>
                                    <button
                                      onClick={() => handleApproveWinner(entry)}
                                      disabled={isProcessing}
                                      className="px-3 py-1.5 bg-success-500 text-white text-xs font-bold rounded-lg hover:bg-success-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectWinner(entry)}
                                      disabled={isProcessing}
                                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                      Reject
                                    </button>
                                  </>
                                )}
                                {entry.winner_status === ADMIN_STATUS.APPROVED && (
                                  <button
                                    onClick={() => handleDisburseWinner(entry)}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 bg-vloop-600 text-white text-xs font-bold rounded-lg hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Wallet size={12} />}
                                    Disburse
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Help Card */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Reward Amount Guide (by Tier)</h4>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                  <div className="font-bold text-gold-700 mb-1">Prime (4x)</div>
                  <div className="text-gray-600">Highest reward tier for qualified winners</div>
                </div>
                <div className="p-3 rounded-lg bg-vloop-50 border border-vloop-200">
                  <div className="font-bold text-vloop-700 mb-1">Premium (2x)</div>
                  <div className="text-gray-600">Mid-tier rewards for winners</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                  <div className="font-bold text-gray-700 mb-1">Standard (1x)</div>
                  <div className="text-gray-600">Base reward for winners</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analyticsData.map((item) => (
                <div key={item.label} className="card-premium p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-vloop-50 flex items-center justify-center">
                      <BarChart3 size={18} className="text-vloop-600" />
                    </div>
                    <div className="flex items-center gap-0.5 text-xs font-semibold text-success-600">
                      <ArrowUpRight size={12} /> {item.change}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 font-display">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Store Partners */}
            <div className="card-premium overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Store size={18} className="text-vloop-600" /> Store Partners
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {storePartners.map((partner, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center">
                        <Store size={16} className="text-gold-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{partner.name}</div>
                        <div className="text-xs text-gray-500">{partner.category} • {partner.location}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                      partner.status === 'approved' ? 'bg-success-100 text-success-700' : 'bg-gold-100 text-gold-700'
                    }`}>{partner.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SmartCode Control Center Tab */}
        {activeTab === 'smartcode' && (
          <div className="space-y-6">
            <div className="card-premium p-6 bg-gradient-to-r from-vloop-50 to-gold-50 border-2 border-vloop-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vloop-600 to-vloop-800 flex items-center justify-center">
                    <Hash size={24} className="text-gold-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-display">Admin SmartCode Control Center</h2>
                    <p className="text-sm text-gray-600">Monitor, review, and manage all SmartCode operations</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('admin-smartcode')}
                  className="px-5 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center gap-2"
                >
                  Open Control Center <ArrowUpRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate('admin-sc-intelligence')}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-colors flex items-center gap-2"
                >
                  <Brain size={18} /> Intelligence
                </button>
                <button
                  onClick={() => onNavigate('admin-vcos-ops')}
                  className="px-5 py-2.5 bg-gradient-to-r from-vloop-600 to-vloop-700 text-white font-semibold rounded-xl hover:from-vloop-700 hover:to-vloop-800 transition-colors flex items-center gap-2"
                >
                  <Settings size={18} /> Operations
                </button>
                <button
                  onClick={() => onNavigate('admin-control-matrix')}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={18} /> Control Matrix
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="card-premium p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-vloop-100 flex items-center justify-center">
                    <Hash size={20} className="text-vloop-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">--</div>
                    <div className="text-xs text-gray-500">Active SmartCodes</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">View real-time statistics in the full Control Center</p>
              </div>

              <div className="card-premium p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <AlertCircle size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">--</div>
                    <div className="text-xs text-gray-500">Flagged Entries</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Review high-value and suspicious allocations</p>
              </div>

              <div className="card-premium p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center">
                    <Trophy size={20} className="text-gold-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-xs text-gray-500">Reward Pools</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Prime, Premium, and Standard pools</p>
              </div>
            </div>

            <div className="card-premium p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-vloop-600" /> Control Center Features
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: Activity, label: 'Live Dashboard', desc: 'Real-time SmartCode statistics' },
                  { icon: Users, label: 'Customer Search', desc: 'Search by name, mobile, code, or date' },
                  { icon: Eye, label: 'Manual Review', desc: 'Approve, reject, or flag entries' },
                  { icon: BarChart3, label: 'Monitoring', desc: 'Duplicates and large allocations' },
                  { icon: Trophy, label: 'Reward Pools', desc: 'View pool statistics (no manual selection)' },
                  { icon: FileText, label: 'Audit Log', desc: 'Immutable action trail' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <item.icon size={20} className="text-vloop-600" />
                    <div>
                      <div className="font-medium text-sm text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Controls Tab - Admin Control Center */}
        {activeTab === 'controls' && (
          <div className="space-y-6">
            {/* Admin Settings */}
            <div className="card-premium overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-vloop-50 to-gold-50">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-vloop-600" />
                  <h3 className="font-bold text-gray-900">Admin Control Center</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">Toggle features and manage platform settings</p>
              </div>
              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {adminSettings.map((setting) => {
                    const isEnabled = setting.value === 'true';
                    return (
                      <div key={setting.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-vloop-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isEnabled ? 'bg-success-100' : 'bg-gray-100'
                          }`}>
                            {isEnabled ? (
                              <ToggleRight size={20} className="text-success-600" />
                            ) : (
                              <ToggleLeft size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-900 capitalize">
                              {setting.key.replace(/_/g, ' ')}
                            </div>
                            {setting.description && (
                              <div className="text-xs text-gray-500">{setting.description}</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleSetting(setting.key, isEnabled)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            isEnabled ? 'bg-success-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            isEnabled ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <button className="card-premium p-5 text-left hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-3">
                  <Sparkles size={20} className="text-gold-600" />
                </div>
                <div className="font-semibold text-gray-900">Publish Hint</div>
                <div className="text-xs text-gray-500 mt-1">Create daily SmartCode hint</div>
              </button>
              <button className="card-premium p-5 text-left hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-vloop-100 flex items-center justify-center mb-3">
                  <Video size={20} className="text-vloop-600" />
                </div>
                <div className="font-semibold text-gray-900">Publish Content</div>
                <div className="text-xs text-gray-500 mt-1">Add awareness video/carto</div>
              </button>
              <button className="card-premium p-5 text-left hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center mb-3">
                  <FileText size={20} className="text-success-600" />
                </div>
                <div className="font-semibold text-gray-900">Add Quiz Question</div>
                <div className="text-xs text-gray-500 mt-1">Create new quiz question</div>
              </button>
            </div>

            {/* Weekly Countdown */}
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">Weekly SmartCode Draw</h3>
                  <p className="text-sm text-gray-500">Next draw scheduled</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-50 border border-gold-200">
                  <Calendar size={18} className="text-gold-600" />
                  <span className="font-bold text-gold-700">Sunday 8:00 PM</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Days', value: '5' },
                  { label: 'Hours', value: '23' },
                  { label: 'Minutes', value: '45' },
                  { label: 'Seconds', value: '12' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 rounded-xl bg-gray-50">
                    <div className="text-2xl font-bold text-vloop-700 font-display">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <>
            <div className="card-premium overflow-hidden mb-6">
              <div className="p-5 border-b border-gray-100 bg-vloop-50/50">
                <div className="flex items-center gap-2">
                  <Server size={18} className="text-vloop-600" />
                  <h3 className="font-bold text-gray-900">Database Architecture (Supabase Ready)</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">Complete table structure prepared for Supabase integration</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dbTables.map((table) => {
                    const Icon = table.icon;
                    return (
                      <div key={table.name} className="p-4 rounded-xl border border-gray-100 hover:border-vloop-200 hover:shadow-card transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-9 h-9 rounded-lg bg-vloop-100 flex items-center justify-center">
                            <Icon size={18} className="text-vloop-600" />
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            table.status === 'Ready' ? 'bg-success-100 text-success-700' : 'bg-gold-100 text-gold-700'
                          }`}>{table.status}</span>
                        </div>
                        <div className="font-semibold text-sm text-gray-900">{table.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{table.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-vloop-50 border border-vloop-100 flex items-start gap-3">
              <Database size={20} className="text-vloop-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Architecture Status</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  All 9 database tables are structured and ready for Supabase integration: Members, Points (with amount ledger), Wallet1 (earned/used/available tracking),
                  Wallet2 (activation date, support status, eligibility), Participation, Products, Store Partners, Support Requests, and Admin Panel.
                  RLS policies are configured for secure member-level access. Payment gateway and real wallet connections will be activated in the next phase.
                </p>
                <button
                  onClick={() => onNavigate('admin-products')}
                  className="px-4 py-2 bg-vloop-600 text-white text-sm font-semibold rounded-lg hover:bg-vloop-700 transition-colors flex items-center gap-1.5"
                >
                  <Package size={16} /> Manage Product Inventory
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
