import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Hash, Trophy, Users, Heart, Wallet, BrainCircuit,
  BarChart3, ScrollText, Shield, Search, Lock, Unlock, Trash2, Edit,
  Play, Pause, Snowflake, RefreshCw, Award, Archive, Eye, Download,
  UserX, UserCheck, AlertTriangle, Activity, TrendingUp, TrendingDown,
  Loader2, ChevronLeft, ChevronRight, X, Check, KeyRound, UserCog,
  Calendar, Bot, Sparkles, Mic, FileScan, ShieldCheck, Flag, Gauge,
  AlertCircle, Clock, Zap, Globe, ToggleLeft, ToggleRight, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  getDashboardStats, searchSmartCodes, updateSmartCode, deleteSmartCode,
  lockSmartCode, unlockSmartCode, exportSmartCodes,
  getWeeklyCycleStatus, getAllWeeklyCycles, startWeeklyCycle, closeWeeklyCycle,
  freezeWeeklyCycle, recalculateAI, generateWinners, publishResults, archiveWeek,
  searchCustomers, getCustomerDetails, suspendCustomer, activateCustomer,
  getCareClubStats, getWalletStats, getWalletTransactions,
  getAIMonitoringStats, getAnalyticsData, getAuditLogs,
  getAdminRoles, assignRole, revokeRole, updateRole, checkAdminAccess,
  getCurrentWeekPeriod, formatCurrency, formatDate,
  ADMIN_ROLES, ROLE_PERMISSIONS,
  type DashboardStats, type SmartCodeSearchResult, type WeeklyCycleStatus,
  type CustomerSearchResult, type CareClubStats, type WalletStats,
  type WalletTransaction, type AIMonitoringStats, type AnalyticsData,
  type AuditLogEntry, type AdminRoleEntry, type AdminRole,
} from '../lib/AdminAIControlCenterEngine';
import {
  AI_INTELLIGENCE_VERSION,
  getFraudLogs,
  getAIFeatureFlags,
  getAIGlobalConfigs,
  getMockFraudLogs,
  getMockAIFeatureFlags,
  getMockGlobalConfigs,
  getFraudSeverityColor,
  getFraudStatusColor,
  getTrustLevelColor,
  getTrustScoreColor,
  getIntentLabel,
  formatConfidence,
  type AIFraudDetectionLog,
  type AIFeatureFlag,
  type AIGlobalConfig,
} from '../lib/AIIntelligenceEngine';

type AdminAIControlCenterProps = {
  onNavigate: (page: string) => void;
};

type TabId = 'dashboard' | 'smartcodes' | 'rewards' | 'customers' | 'careclub' | 'wallets' | 'ai' | 'analytics' | 'audit' | 'security';

const TABS: Array<{ id: TabId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'smartcodes', label: 'SmartCodes', icon: Hash },
  { id: 'rewards', label: 'Weekly Rewards', icon: Trophy },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'careclub', label: 'Care Club', icon: Heart },
  { id: 'wallets', label: 'Wallets', icon: Wallet },
  { id: 'ai', label: 'AI Monitor', icon: BrainCircuit },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'audit', label: 'Audit Log', icon: ScrollText },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function AdminAIControlCenter({ onNavigate }: AdminAIControlCenterProps) {
  const { session, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [accessChecked, setAccessChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loadingAccess, setLoadingAccess] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      checkAdminAccess(session.user.id).then(result => {
        setIsAdmin(result.isAdmin);
        setIsSuperAdmin(result.isSuperAdmin);
        setAdminRole(result.role);
        setAccessChecked(true);
        setLoadingAccess(false);
      });
    } else {
      setAccessChecked(true);
      setLoadingAccess(false);
    }
  }, [session]);

  if (loadingAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-vloop-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Lock className="w-12 h-12 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700">Authentication Required</h2>
        <p className="text-gray-500 text-sm">Sign in to access the Admin AI Control Center.</p>
        <button onClick={() => onNavigate('home')} className="px-4 py-2 rounded-lg bg-vloop-600 text-white text-sm font-semibold hover:bg-vloop-700 transition-colors">
          Go Home
        </button>
      </div>
    );
  }

  if (accessChecked && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Shield className="w-12 h-12 text-red-300" />
        <h2 className="text-xl font-bold text-gray-700">Access Denied</h2>
        <p className="text-gray-500 text-sm">You do not have admin privileges to access this control center.</p>
        <button onClick={() => onNavigate('home')} className="px-4 py-2 rounded-lg bg-vloop-600 text-white text-sm font-semibold hover:bg-vloop-700 transition-colors">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-vloop-900 via-vloop-800 to-vloop-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <BrainCircuit className="w-7 h-7 text-gold-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-display">Enterprise Admin AI Control Center</h1>
                  <p className="text-vloop-200 text-sm">Permanent Backbone of the VLOOP Ecosystem</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isSuperAdmin && (
                <span className="px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-500/30">
                  SUPER ADMIN
                </span>
              )}
              {adminRole && !isSuperAdmin && (
                <span className="px-3 py-1.5 rounded-lg bg-vloop-500/20 text-vloop-200 text-xs font-bold border border-vloop-500/30 uppercase">
                  {adminRole}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                  {profile?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium hidden sm:block">{profile?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const hasAccess = isSuperAdmin || ROLE_PERMISSIONS[adminRole as AdminRole]?.includes(tab.id) || false;
              if (!hasAccess) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-vloop-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <DashboardModule />}
        {activeTab === 'smartcodes' && <SmartCodeModule adminId={session.user.id} />}
        {activeTab === 'rewards' && <WeeklyRewardModule adminId={session.user.id} />}
        {activeTab === 'customers' && <CustomerModule adminId={session.user.id} />}
        {activeTab === 'careclub' && <CareClubModule />}
        {activeTab === 'wallets' && <WalletModule />}
        {activeTab === 'ai' && <AIMonitoringModule />}
        {activeTab === 'analytics' && <AnalyticsModule />}
        {activeTab === 'audit' && <AuditLogModule />}
        {activeTab === 'security' && isSuperAdmin && <SecurityModule adminId={session.user.id} />}
      </div>
    </div>
  );
}

// ============================================================
// 1. DASHBOARD MODULE
// ============================================================

function DashboardModule() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(s => {
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <EmptyState message="Unable to load dashboard statistics" />;

  const cards = [
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'blue' },
    { label: 'Active Customers', value: stats.activeCustomers, icon: UserCheck, color: 'green' },
    { label: 'Weekly Participants', value: stats.weeklyParticipants, icon: Activity, color: 'amber' },
    { label: 'Total Purchase Value', value: formatCurrency(stats.totalPurchaseValue), icon: TrendingUp, color: 'emerald' },
    { label: 'Care Club Contributions', value: formatCurrency(stats.totalCareClubContributions), icon: Heart, color: 'rose' },
    { label: 'Wallet-1 Balance', value: formatCurrency(stats.wallet1Balance), icon: Wallet, color: 'vloop' },
    { label: 'Wallet-2 Balance', value: formatCurrency(stats.wallet2Balance), icon: Wallet, color: 'cyan' },
    { label: 'Total SmartPoints', value: stats.totalSmartPoints.toLocaleString(), icon: Zap, color: 'gold' },
    { label: 'Total SmartCodes', value: stats.totalSmartCodes, icon: Hash, color: 'indigo' },
    { label: 'AI Weekly Reward', value: stats.aiWeeklyRewardStatus, icon: BrainCircuit, color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    vloop: 'bg-vloop-50 text-vloop-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    gold: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Enterprise Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[card.color]}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 truncate">{card.value}</div>
              <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 2. SMARTCODE MANAGEMENT MODULE
// ============================================================

function SmartCodeModule({ adminId }: { adminId: string }) {
  const [results, setResults] = useState<SmartCodeSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [entryMethod, setEntryMethod] = useState('');
  const [selectedItem, setSelectedItem] = useState<SmartCodeSearchResult | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchSmartCodes({ query, status, entryMethod, page, pageSize: 20 });
      setResults(res.results);
      setTotal(res.total);
    } catch { /* empty */ }
    setLoading(false);
  }, [query, status, entryMethod, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAction = async (action: string, id: string) => {
    setActionLoading(true);
    try {
      if (action === 'lock') await lockSmartCode(id, adminId);
      else if (action === 'unlock') await unlockSmartCode(id, adminId);
      else if (action === 'delete') await deleteSmartCode(id, adminId);
      await fetch();
    } catch { /* empty */ }
    setActionLoading(false);
  };

  const handleExport = async () => {
    const data = await exportSmartCodes({ query, status, entryMethod });
    const csv = ['smartcode,points,source,week_period,entry_source,is_active,created_at,customer_name'];
    data.forEach(r => {
      csv.push(`${r.smartcode},${r.points_allocated},${r.source || ''},${r.week_period || ''},${r.entry_source || ''},${r.is_active},${r.created_at},${r.customer_name || ''}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartcodes_${getCurrentWeekPeriod()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">SmartCode Management</h2>
        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vloop-600 text-white text-sm font-semibold hover:bg-vloop-700 transition-colors">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search smartcode or source..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400"
            />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={entryMethod} onChange={e => { setEntryMethod(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400">
            <option value="">All Methods</option>
            <option value="digital">Digital</option>
            <option value="manual">Manual</option>
            <option value="offline_ai">Offline AI</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center justify-end">{total} results</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <LoadingSpinner /> : results.length === 0 ? <EmptyState message="No SmartCodes found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">SmartCode</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Points</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Method</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Week</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-vloop-700">{r.smartcode}</td>
                    <td className="px-4 py-3 text-gray-700">{r.customer_name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.points_allocated}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{r.entry_source}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.week_period || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {r.is_active ? 'Active' : 'Locked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedItem(r)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="View">
                          <Eye size={15} />
                        </button>
                        {r.is_active ? (
                          <button onClick={() => handleAction('lock', r.id)} disabled={actionLoading} className="p-1.5 rounded hover:bg-amber-50 text-amber-600" title="Lock">
                            <Lock size={15} />
                          </button>
                        ) : (
                          <button onClick={() => handleAction('unlock', r.id)} disabled={actionLoading} className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Unlock">
                            <Unlock size={15} />
                          </button>
                        )}
                        <button onClick={() => handleAction('delete', r.id)} disabled={actionLoading} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal title="SmartCode Details" onClose={() => setSelectedItem(null)}>
          <div className="space-y-3">
            <DetailRow label="SmartCode" value={selectedItem.smartcode} />
            <DetailRow label="Customer" value={selectedItem.customer_name || 'Unknown'} />
            <DetailRow label="Points" value={String(selectedItem.points_allocated)} />
            <DetailRow label="Source" value={selectedItem.source || '-'} />
            <DetailRow label="Entry Method" value={selectedItem.entry_source} />
            <DetailRow label="Week Period" value={selectedItem.week_period || '-'} />
            <DetailRow label="Status" value={selectedItem.is_active ? 'Active' : 'Locked'} />
            <DetailRow label="Created" value={formatDate(selectedItem.created_at)} />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// 3. WEEKLY REWARD CONTROL MODULE
// ============================================================

function WeeklyRewardModule({ adminId }: { adminId: string }) {
  const [cycles, setCycles] = useState<WeeklyCycleStatus[]>([]);
  const [currentWeek, setCurrentWeek] = useState<WeeklyCycleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const weekPeriod = getCurrentWeekPeriod();

  const fetch = async () => {
    setLoading(true);
    try {
      const [all, current] = await Promise.all([getAllWeeklyCycles(), getWeeklyCycleStatus(weekPeriod)]);
      setCycles(all);
      setCurrentWeek(current);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    try {
      if (action === 'start') await startWeeklyCycle(weekPeriod, adminId);
      else if (action === 'close') await closeWeeklyCycle(weekPeriod, adminId);
      else if (action === 'freeze') await freezeWeeklyCycle(weekPeriod, adminId);
      else if (action === 'recalculate') await recalculateAI(weekPeriod, adminId);
      else if (action === 'generate') await generateWinners(weekPeriod, adminId);
      else if (action === 'publish') await publishResults(weekPeriod, adminId);
      else if (action === 'archive') await archiveWeek(weekPeriod, adminId);
      await fetch();
    } catch { /* empty */ }
    setActionLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  const statusColors: Record<string, string> = {
    open: 'bg-green-50 text-green-600 border-green-200',
    closed: 'bg-blue-50 text-blue-600 border-blue-200',
    frozen: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    archived: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const actions = [
    { id: 'start', label: 'Start Week', icon: Play, color: 'green', disabled: currentWeek?.status === 'open' },
    { id: 'close', label: 'Close Week', icon: Pause, color: 'blue', disabled: currentWeek?.status !== 'open' },
    { id: 'freeze', label: 'Freeze', icon: Snowflake, color: 'cyan', disabled: currentWeek?.status === 'frozen' || currentWeek?.status === 'archived' },
    { id: 'recalculate', label: 'Recalculate AI', icon: RefreshCw, color: 'amber', disabled: !currentWeek },
    { id: 'generate', label: 'Generate Winners', icon: Award, color: 'vloop', disabled: !currentWeek || currentWeek.winners_generated },
    { id: 'publish', label: 'Publish Results', icon: Check, color: 'emerald', disabled: !currentWeek || !currentWeek.winners_generated || currentWeek.results_published },
    { id: 'archive', label: 'Archive Week', icon: Archive, color: 'gray', disabled: !currentWeek || currentWeek.status === 'archived' },
  ];

  const actionColors: Record<string, string> = {
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    cyan: 'bg-cyan-600 hover:bg-cyan-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    vloop: 'bg-vloop-600 hover:bg-vloop-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    gray: 'bg-gray-600 hover:bg-gray-700',
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Reward Control</h2>

      {/* Current Week Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">Current Week: {weekPeriod}</h3>
            <p className="text-sm text-gray-500 mt-1">Manage the weekly reward cycle</p>
          </div>
          {currentWeek && (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${statusColors[currentWeek.status] || 'bg-gray-100 text-gray-500'}`}>
              {currentWeek.status.toUpperCase()}
            </span>
          )}
        </div>

        {currentWeek && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatBox label="Participants" value={currentWeek.total_participants} />
            <StatBox label="SmartCodes" value={currentWeek.total_smartcodes} />
            <StatBox label="Total Points" value={currentWeek.total_points} />
            <StatBox label="Reward Pool" value={formatCurrency(currentWeek.reward_pool_amount)} />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {actions.map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => handleAction(a.id)}
                disabled={a.disabled || actionLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${actionColors[a.color]}`}
              >
                <Icon size={16} /> {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Weeks History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">All Weekly Cycles</h3>
        </div>
        {cycles.length === 0 ? <EmptyState message="No weekly cycles found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Week</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Participants</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">SmartCodes</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Points</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Winners</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cycles.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-vloop-700">{c.week_period}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[c.status] || ''}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.total_participants}</td>
                    <td className="px-4 py-3 text-gray-700">{c.total_smartcodes}</td>
                    <td className="px-4 py-3 text-gray-700">{c.total_points}</td>
                    <td className="px-4 py-3">{c.winners_generated ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                    <td className="px-4 py-3">{c.results_published ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 4. CUSTOMER CONTROL MODULE
// ============================================================

function CustomerModule({ adminId }: { adminId: string }) {
  const [results, setResults] = useState<CustomerSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResult | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchCustomers(query, page, 20);
      setResults(res.results);
      setTotal(res.total);
    } catch { /* empty */ }
    setLoading(false);
  }, [query, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSuspend = async (userId: string) => {
    setActionLoading(true);
    try { await suspendCustomer(userId, adminId); await fetch(); } catch { /* empty */ }
    setActionLoading(false);
  };

  const handleActivate = async (userId: string) => {
    setActionLoading(true);
    try { await activateCustomer(userId, adminId); await fetch(); } catch { /* empty */ }
    setActionLoading(false);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Control</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, mobile, email, or VLOOP code..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <LoadingSpinner /> : results.length === 0 ? <EmptyState message="No customers found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Mobile</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">VLOOP Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Points</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Wallet-1</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Wallet-2</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.mobile || '-'}</td>
                    <td className="px-4 py-3 font-mono text-vloop-700 text-xs">{c.vloop_code || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{c.points || 0}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(c.wallet1_balance || 0)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(c.wallet2_balance || 0)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.membership_status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {c.membership_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedCustomer(c)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="View">
                          <Eye size={15} />
                        </button>
                        {c.membership_status === 'active' ? (
                          <button onClick={() => handleSuspend(c.id)} disabled={actionLoading} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Suspend">
                            <UserX size={15} />
                          </button>
                        ) : (
                          <button onClick={() => handleActivate(c.id)} disabled={actionLoading} className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Activate">
                            <UserCheck size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <Modal title="Customer Details" onClose={() => setSelectedCustomer(null)}>
          <CustomerDetail userId={selectedCustomer.id} />
        </Modal>
      )}
    </div>
  );
}

function CustomerDetail({ userId }: { userId: string }) {
  const [details, setDetails] = useState<ReturnType<typeof getCustomerDetails> extends Promise<infer T> ? T : never | null>(undefined as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerDetails(userId).then(d => { setDetails(d); setLoading(false); }).catch(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!details) return <EmptyState message="Unable to load customer details" />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <DetailRow label="Name" value={details.profile?.name || '-'} />
        <DetailRow label="Mobile" value={details.profile?.mobile || '-'} />
        <DetailRow label="Email" value={details.profile?.email || '-'} />
        <DetailRow label="VLOOP Code" value={details.profile?.vloop_code || '-'} />
        <DetailRow label="Points" value={String(details.profile?.points || 0)} />
        <DetailRow label="Wallet-1" value={formatCurrency(details.profile?.wallet1_balance || 0)} />
        <DetailRow label="Wallet-2" value={formatCurrency(details.profile?.wallet2_balance || 0)} />
        <DetailRow label="Status" value={details.profile?.membership_status || '-'} />
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 text-sm mb-2">SmartCodes ({details.smartCodes.length})</h4>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {details.smartCodes.length === 0 ? <p className="text-gray-400 text-xs">No SmartCodes</p> :
            details.smartCodes.map(sc => (
              <div key={sc.id} className="flex items-center justify-between text-xs bg-gray-50 px-3 py-1.5 rounded">
                <span className="font-mono font-semibold text-vloop-700">{sc.smartcode}</span>
                <span className="text-gray-500">{sc.points_allocated} pts</span>
              </div>
            ))
          }
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 text-sm mb-2">Point History ({details.pointHistory.length})</h4>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {details.pointHistory.length === 0 ? <p className="text-gray-400 text-xs">No point history</p> :
            details.pointHistory.map(ph => (
              <div key={ph.id} className="flex items-center justify-between text-xs bg-gray-50 px-3 py-1.5 rounded">
                <span className="text-gray-600">{ph.source_type}</span>
                <span className="font-semibold text-green-600">+{ph.points_awarded}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 5. CARE CLUB MANAGEMENT MODULE
// ============================================================

function CareClubModule() {
  const [stats, setStats] = useState<CareClubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareClubStats().then(s => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <EmptyState message="Unable to load Care Club stats" />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Care Club Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Contributors" value={stats.totalContributors} icon={Users} color="blue" />
        <StatCard label="Total Contributions" value={formatCurrency(stats.totalContributions)} icon={Heart} color="rose" />
        <StatCard label="Daily Contribution" value={formatCurrency(stats.dailyContribution)} icon={TrendingUp} color="green" />
        <StatCard label="Weekly Contribution" value={formatCurrency(stats.weeklyContribution)} icon={TrendingUp} color="amber" />
        <StatCard label="Monthly Contribution" value={formatCurrency(stats.monthlyContribution)} icon={TrendingUp} color="emerald" />
        <StatCard label="Available Fund" value={formatCurrency(stats.availableFund)} icon={Wallet} color="vloop" />
        <StatCard label="Insurance Reserve" value={formatCurrency(stats.insuranceReserve)} icon={Shield} color="cyan" />
        <StatCard label="Community Balance" value={formatCurrency(stats.communityBalance)} icon={Heart} color="gold" />
      </div>
    </div>
  );
}

// ============================================================
// 6. WALLET MANAGEMENT MODULE
// ============================================================

function WalletModule() {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getWalletStats(),
      getWalletTransactions(1, 20),
    ]).then(([s, t]) => {
      setStats(s);
      setTransactions(t.results);
      setTotal(t.total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <EmptyState message="Unable to load wallet stats" />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Wallet Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Wallet-1 Total Balance" value={formatCurrency(stats.wallet1TotalBalance)} icon={Wallet} color="vloop" />
        <StatCard label="Wallet-2 Total Balance" value={formatCurrency(stats.wallet2TotalBalance)} icon={Wallet} color="cyan" />
        <StatCard label="Wallet-1 Total Earned" value={formatCurrency(stats.wallet1TotalEarned)} icon={TrendingUp} color="green" />
        <StatCard label="Insurance Hold" value={formatCurrency(stats.insuranceHold)} icon={Shield} color="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Pending Transactions" value={stats.pendingTransactions} icon={Activity} color="amber" />
        <StatCard label="Released Transactions" value={stats.releasedTransactions} icon={Check} color="green" />
        <StatCard label="Expired Transactions" value={stats.expiredTransactions} icon={X} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">Transaction History</h3>
        </div>
        {transactions.length === 0 ? <EmptyState message="No transactions found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Points</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Purchase</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Care Club</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Wallet-2 Credit</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Week</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{t.source_type}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">+{t.points_awarded}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(t.purchase_amount || 0)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(t.care_club_amount || 0)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(t.wallet2_credit || 0)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.week_period || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 7. AI MONITORING MODULE - PHASE 6 ENHANCED
// ============================================================

function AIMonitoringModule() {
  const [stats, setStats] = useState<AIMonitoringStats | null>(null);
  const [fraudLogs, setFraudLogs] = useState<AIFraudDetectionLog[]>([]);
  const [featureFlags, setFeatureFlags] = useState<AIFeatureFlag[]>([]);
  const [globalConfigs, setGlobalConfigs] = useState<AIGlobalConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiTab, setAiTab] = useState<'overview' | 'fraud' | 'trust' | 'features' | 'configs'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aiStats, fraud, flags, configs] = await Promise.all([
        getAIMonitoringStats(),
        getMockFraudLogs(),
        getMockAIFeatureFlags(),
        getMockGlobalConfigs(),
      ]);
      setStats(aiStats);
      setFraudLogs(fraud);
      setFeatureFlags(flags);
      setGlobalConfigs(configs);
    } catch {
      // Use mock data if DB fails
      setFraudLogs(getMockFraudLogs());
      setFeatureFlags(getMockAIFeatureFlags());
      setGlobalConfigs(getMockGlobalConfigs());
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!stats) return <EmptyState message="Unable to load AI monitoring data" />;

  const aiTabs = [
    { id: 'overview', label: 'Overview', icon: BrainCircuit },
    { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert },
    { id: 'trust', label: 'Trust Engine', icon: ShieldCheck },
    { id: 'features', label: 'Feature Flags', icon: ToggleLeft },
    { id: 'configs', label: 'Global Configs', icon: Globe },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Intelligence Control Center</h2>
          <p className="text-sm text-gray-500">Phase 6 — Version {AI_INTELLIGENCE_VERSION}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
            AI Active
          </span>
        </div>
      </div>

      {/* AI Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4">
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 overflow-x-auto">
          {aiTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAiTab(tab.id as typeof aiTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  aiTab === tab.id
                    ? 'bg-vloop-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {/* Overview Tab */}
          {aiTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard label="AI Status" value={stats.aiStatus.toUpperCase()} icon={BrainCircuit} color={stats.aiStatus === 'active' ? 'green' : 'amber'} />
                <StatCard label="Current Week" value={stats.currentWeek} icon={Calendar} color="vloop" />
                <StatCard label="Reward Cycle" value={stats.rewardCycleStatus} icon={Trophy} color="gold" />
                <StatCard label="Performance Score" value={`${stats.performanceScore}%`} icon={Activity} color={stats.performanceScore > 70 ? 'green' : 'amber'} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">SmartCode Distribution</h3>
                  <div className="space-y-2">
                    <DistributionBar label="Prime" value={stats.smartcodeDistribution.primeEntries} total={stats.smartcodeDistribution.totalEntries} color="bg-vloop-600" />
                    <DistributionBar label="Premium" value={stats.smartcodeDistribution.premiumEntries} total={stats.smartcodeDistribution.totalEntries} color="bg-gold-500" />
                    <DistributionBar label="Standard" value={stats.smartcodeDistribution.standardEntries} total={stats.smartcodeDistribution.totalEntries} color="bg-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                    <StatBox label="Total Entries" value={stats.smartcodeDistribution.totalEntries} />
                    <StatBox label="Total Points" value={stats.smartcodeDistribution.totalPoints} />
                    <StatBox label="Unique SmartCodes" value={stats.smartcodeDistribution.uniqueSmartcodes} />
                    <StatBox label="Unique Users" value={stats.smartcodeDistribution.uniqueUsers} />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">AI Assistants Activity</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBox label="Shopping AI" value={featureFlags.find(f => f.feature_name === 'ai_shopping_assistant')?.is_enabled ? 'Active' : 'Inactive'} />
                    <StatBox label="Learning AI" value={featureFlags.find(f => f.feature_name === 'ai_learning_guide')?.is_enabled ? 'Active' : 'Inactive'} />
                    <StatBox label="Services AI" value={featureFlags.find(f => f.feature_name === 'ai_services_guide')?.is_enabled ? 'Active' : 'Inactive'} />
                    <StatBox label="Voice Mode" value={featureFlags.find(f => f.feature_name === 'ai_voice_mode')?.is_enabled ? 'Active' : 'Beta'} />
                    <StatBox label="OCR Layer" value={featureFlags.find(f => f.feature_name === 'ai_ocr_layer')?.is_enabled ? 'Active' : 'Inactive'} />
                    <StatBox label="Trust Engine" value={featureFlags.find(f => f.feature_name === 'ai_trust_engine')?.is_enabled ? 'Active' : 'Inactive'} />
                  </div>
                </div>
              </div>

              {/* Processing Queue */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-3">Processing Queue</h3>
                <div className="text-3xl font-bold text-vloop-700 mb-1">{stats.processingQueue}</div>
                <p className="text-sm text-gray-500">Pending offline entries awaiting processing</p>
              </div>

              {/* Recent Fraud Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-gray-700">Recent Fraud Alerts ({fraudLogs.length})</h3>
                  </div>
                  <button onClick={() => setAiTab('fraud')} className="text-xs text-vloop-600 hover:text-vloop-800 font-medium">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {fraudLogs.slice(0, 3).map(a => (
                    <div key={a.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{a.fraud_type.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFraudSeverityColor(a.severity)}`}>
                            {a.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFraudStatusColor(a.status)}`}>
                            {a.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-700">{formatConfidence(a.ai_confidence)}</span>
                        <p className="text-xs text-gray-400">{formatDate(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fraud Detection Tab */}
          {aiTab === 'fraud' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <StatCard label="Total Flags" value={fraudLogs.length} icon={ShieldAlert} color="vloop" />
                <StatCard label="Critical" value={fraudLogs.filter(f => f.severity === 'critical').length} icon={AlertCircle} color="red" />
                <StatCard label="High" value={fraudLogs.filter(f => f.severity === 'high').length} icon={AlertTriangle} color="amber" />
                <StatCard label="Open Cases" value={fraudLogs.filter(f => f.status === 'detected' || f.status === 'investigating').length} icon={Clock} color="blue" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">Fraud Detection Logs</h3>
                </div>
                {fraudLogs.length === 0 ? <EmptyState message="No fraud logs found" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Severity</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Risk Score</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Confidence</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Method</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {fraudLogs.map(f => (
                          <tr key={f.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-700">{f.fraud_type.replace(/_/g, ' ')}</div>
                              {f.user_id && <div className="text-xs text-gray-400">User: {f.user_id.substring(0, 8)}...</div>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFraudSeverityColor(f.severity)}`}>
                                {f.severity.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFraudStatusColor(f.status)}`}>
                                {f.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Gauge className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-700">{f.risk_score}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-700">{formatConfidence(f.ai_confidence)}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{f.detection_method}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(f.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trust Engine Tab */}
          {aiTab === 'trust' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <StatCard label="Trust Engine" value="Active" icon={ShieldCheck} color="green" />
                <StatCard label="Update Freq" value="Weekly" icon={Clock} color="blue" />
                <StatCard label="Min Factors" value="5" icon={Activity} color="amber" />
                <StatCard label="Sensitivity" value="High" icon={Gauge} color="vloop" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="font-semibold text-gray-700 mb-4">Trust Level Distribution</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xs`}>New</div>
                    <p className="text-xs text-gray-500 mt-2">Just joined</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br from-slate-400 to-gray-500 flex items-center justify-center text-white font-bold text-xs`}>Basic</div>
                    <p className="text-xs text-gray-500 mt-2">Verified email</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs`}>Verified</div>
                    <p className="text-xs text-gray-500 mt-2">Trust proven</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs`}>Trusted</div>
                    <p className="text-xs text-gray-500 mt-2">High trust</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xs`}>Elite</div>
                    <p className="text-xs text-gray-500 mt-2">Top tier</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Trust Score Factors</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Age</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                      </div>
                      <span className="text-xs text-gray-500">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Activity Consistency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                      </div>
                      <span className="text-xs text-gray-500">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verification Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-vloop-500 rounded-full" style={{ width: '15%' }} />
                      </div>
                      <span className="text-xs text-gray-500">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transaction History</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }} />
                      </div>
                      <span className="text-xs text-gray-500">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Community Reputation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }} />
                      </div>
                      <span className="text-xs text-gray-500">10%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SmartCode Consistency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: '10%' }} />
                      </div>
                      <span className="text-xs text-gray-500">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Flags Tab */}
          {aiTab === 'features' && (
            <div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">AI Feature Flags</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {featureFlags.map(f => (
                    <div key={f.id} className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.is_enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                          {f.is_enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{f.feature_name.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-gray-500">{f.feature_description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">Rollout: {f.rollout_percentage}%</span>
                            {f.target_user_groups.length > 0 && (
                              <span className="text-xs text-gray-400">Groups: {f.target_user_groups.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          f.is_enabled
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f.is_enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Global Configs Tab */}
          {aiTab === 'configs' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalConfigs.map(c => (
                  <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-vloop-600" />
                        <span className="font-bold text-gray-900">{c.country_code}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Language</span>
                        <span className="text-gray-700 font-medium">{c.language_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Currency</span>
                        <span className="text-gray-700 font-medium">{c.currency_format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date Format</span>
                        <span className="text-gray-700 font-medium">{c.date_format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Personality</span>
                        <span className="text-gray-700 font-medium">{c.assistant_personality.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        {c.supported_intents.slice(0, 3).map(intent => (
                          <span key={intent} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                            {intent.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {c.supported_intents.length > 3 && (
                          <span className="text-xs text-gray-400">+{c.supported_intents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 8. ANALYTICS MODULE
// ============================================================

function AnalyticsModule() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <EmptyState message="Unable to load analytics data" />;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Analytics</h2>

      {/* Growth Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Customer Growth" value={`${data.growthTrends.customerGrowth}%`} icon={TrendingUp} color="blue" />
        <StatCard label="Revenue Growth" value={`${data.growthTrends.revenueGrowth}%`} icon={TrendingUp} color="green" />
        <StatCard label="SmartCode Growth" value={`${data.growthTrends.smartCodeGrowth}%`} icon={TrendingUp} color="vloop" />
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TopList title="Top Products" items={data.topProducts.map(p => ({ label: p.name, value: p.count }))} />
        <TopList title="Top Customers" items={data.topCustomers.map(c => ({ label: c.name, value: c.points }))} />
        <TopList title="Top Partners" items={data.topPartners.map(p => ({ label: p.name, value: p.campaigns }))} />
        <TopList title="Top SmartCodes" items={data.topSmartCodes.map(s => ({ label: s.smartcode, value: s.count }))} />
      </div>

      {/* Daily Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Daily Revenue (Last 30 Days)</h3>
        {data.daily.length === 0 ? <EmptyState message="No daily data available" /> : (
          <div className="flex items-end gap-1 h-40">
            {data.daily.map((d, i) => {
              const max = Math.max(...data.daily.map(x => x.value), 1);
              const height = (d.value / max) * 100;
              return (
                <div key={i} className="flex-1 bg-vloop-200 hover:bg-vloop-400 rounded-t transition-colors" style={{ height: `${Math.max(height, 2)}%` }} title={`${d.date}: ${formatCurrency(d.value)}`} />
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Weekly Distribution (Last 12 Weeks)</h3>
        {data.weekly.length === 0 ? <EmptyState message="No weekly data available" /> : (
          <div className="flex items-end gap-2 h-40">
            {data.weekly.map((w, i) => {
              const max = Math.max(...data.weekly.map(x => x.value), 1);
              const height = (w.value / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gold-300 hover:bg-gold-500 rounded-t transition-colors" style={{ height: `${Math.max(height, 2)}%` }} title={`${w.week}: ${formatCurrency(w.value)}`} />
                  <span className="text-[10px] text-gray-400 truncate w-full text-center">{w.week}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 9. AUDIT LOG MODULE
// ============================================================

function AuditLogModule() {
  const [results, setResults] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs(page, 20, category || undefined, severity || undefined);
      setResults(res.results);
      setTotal(res.total);
    } catch { /* empty */ }
    setLoading(false);
  }, [page, category, severity]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / 20);

  const severityColors: Record<string, string> = {
    info: 'bg-blue-50 text-blue-600',
    warning: 'bg-amber-50 text-amber-600',
    critical: 'bg-red-50 text-red-600',
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Audit Log</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400">
            <option value="">All Categories</option>
            <option value="smartcode">SmartCode</option>
            <option value="reward">Reward</option>
            <option value="customer">Customer</option>
            <option value="security">Security</option>
            <option value="general">General</option>
          </select>
          <select value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400">
            <option value="">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center ml-auto">{total} entries</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <LoadingSpinner /> : results.length === 0 ? <EmptyState message="No audit logs found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Target</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Severity</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{l.action_category}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{l.action_type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{l.target_type || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[l.severity] || severityColors.info}`}>
                        {l.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 10. SECURITY MODULE (RBAC)
// ============================================================

function SecurityModule({ adminId }: { adminId: string }) {
  const [roles, setRoles] = useState<AdminRoleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('admin');
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { setRoles(await getAdminRoles()); } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAssign = async () => {
    if (!newUserId.trim()) return;
    setActionLoading(true);
    try { await assignRole(newUserId.trim(), newRole, adminId); setShowAssign(false); setNewUserId(''); await fetch(); } catch { /* empty */ }
    setActionLoading(false);
  };

  const handleRevoke = async (userId: string) => {
    setActionLoading(true);
    try { await revokeRole(userId, adminId); await fetch(); } catch { /* empty */ }
    setActionLoading(false);
  };

  const handleUpdateRole = async (userId: string, role: AdminRole) => {
    setActionLoading(true);
    try { await updateRole(userId, role, adminId); await fetch(); } catch { /* empty */ }
    setActionLoading(false);
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-gold-50 text-gold-700 border-gold-200',
    admin: 'bg-vloop-50 text-vloop-700 border-vloop-200',
    support: 'bg-blue-50 text-blue-700 border-blue-200',
    finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    audit: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Security — Role-Based Access Control</h2>
        <button onClick={() => setShowAssign(!showAssign)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vloop-600 text-white text-sm font-semibold hover:bg-vloop-700 transition-colors">
          <KeyRound size={16} /> Assign Role
        </button>
      </div>

      {/* Role Permissions Reference */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => (
            <div key={role} className={`rounded-lg border p-3 ${roleColors[role] || ''}`}>
              <div className="font-bold text-sm uppercase mb-1">{role.replace('_', ' ')}</div>
              <div className="text-xs opacity-80">{perms[0] === '*' ? 'Full Access' : perms.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Role Form */}
      {showAssign && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Assign New Role</h3>
          <div className="flex flex-wrap gap-3">
            <input
              value={newUserId}
              onChange={e => setNewUserId(e.target.value)}
              placeholder="User ID (UUID)"
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400"
            />
            <select value={newRole} onChange={e => setNewRole(e.target.value as AdminRole)} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vloop-400">
              <option value="admin">Admin</option>
              <option value="support">Support</option>
              <option value="finance">Finance</option>
              <option value="audit">Audit</option>
            </select>
            <button onClick={handleAssign} disabled={actionLoading || !newUserId.trim()} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign'}
            </button>
          </div>
        </div>
      )}

      {/* Admin Roles Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">Admin Users ({roles.length})</h3>
        </div>
        {roles.length === 0 ? <EmptyState message="No admin roles assigned" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">User ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Active</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.user_id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <select
                        value={r.role}
                        onChange={e => handleUpdateRole(r.user_id, e.target.value as AdminRole)}
                        disabled={actionLoading || r.role === 'super_admin'}
                        className={`px-2 py-1 rounded text-xs font-medium border ${roleColors[r.role] || ''} disabled:opacity-60`}
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="support">Support</option>
                        <option value="finance">Finance</option>
                        <option value="audit">Audit</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {r.is_active ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-400" />}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      {r.role !== 'super_admin' && (
                        <button onClick={() => handleRevoke(r.user_id)} disabled={actionLoading} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Revoke">
                          <UserCog size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SHARED UI COMPONENTS
// ============================================================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 text-vloop-600 animate-spin" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <p className="text-sm">{message}</p>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: typeof Users; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    vloop: 'bg-vloop-50 text-vloop-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    gold: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.vloop}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-xl font-bold text-gray-900 truncate">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function DistributionBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-500">{value} ({Math.round(pct)}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.max(pct, 1)}%` }} />
      </div>
    </div>
  );
}

function TopList({ title, items }: { title: string; items: Array<{ label: string; value: number }> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      {items.length === 0 ? <p className="text-gray-400 text-sm">No data available</p> : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-gray-700 truncate max-w-[150px]">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-vloop-700">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
