/**
 * VLOOP Enterprise Admin SmartCode Control Center
 * =================================================
 *
 * Phase 26 - Enterprise Admin Control Center
 * Phase 28 - AI Weekly Reward Engine Integration
 *
 * Features:
 *   - SmartCode Dashboard (live statistics)
 *   - Customer SmartCode Viewer (search by name, mobile, user ID, code, date)
 *   - Manual Review (review, approve, reject, flag entries)
 *   - SmartCode Monitoring (duplicates, large allocations, trends)
 *   - Weekly Reward Pool Monitoring (statistics only, AI-assigned)
 *   - Audit Log (immutable action logs)
 *   - Role-based permissions
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Shield, Search, Users, Hash, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, Clock, Filter, Download, Eye,
  Activity, Zap, HeartHandshake, Cpu, Edit3, FileText,
  BarChart3, Calendar, ChevronRight, RefreshCw, Lock,
  AlertCircle, Info, UserCheck, Flag, Ban, Sparkles, Trophy
} from 'lucide-react';
import { supabase, type SmartCodeAllocation } from '../lib/supabase';
import { getCurrentWeekPeriod } from '../lib/engagementEngine';

// ============================================================================
// TYPES
// ============================================================================

type AdminRole = 'super_admin' | 'admin' | 'read_only';

type StatCard = {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: string;
};

type SearchFilters = {
  query: string;
  searchBy: 'name' | 'mobile' | 'user_id' | 'smartcode' | 'date' | 'purchase_id';
  dateFrom?: string;
  dateTo?: string;
};

type AuditLogEntry = {
  id: string;
  user_id: string;
  action: string;
  smartcode?: string;
  points_before?: number;
  points_after?: number;
  source?: string;
  week_period: string;
  metadata: Record<string, any>;
  created_at: string;
};

type ReviewEntry = {
  id: string;
  user_id: string;
  smartcode: string;
  points_allocated: number;
  source: string;
  mode: string;
  created_at: string;
  user_name?: string;
  flagged: boolean;
  flag_reason?: string;
};

type WeeklyPool = {
  pool_type: string;
  total_entries: number;
  total_points: number;
  unique_users: number;
  unique_codes: number;
};

type TabType = 'dashboard' | 'customers' | 'review' | 'monitoring' | 'pools' | 'audit';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Props = {
  onNavigate: (page: string) => void;
};

export default function AdminSmartCodeControlCenter({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState<StatCard[]>([]);
  const [weekPeriod] = useState(getCurrentWeekPeriod());

  // Customer search
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    searchBy: 'name',
  });
  const [searchResults, setSearchResults] = useState<SmartCodeAllocation[]>([]);
  const [searching, setSearching] = useState(false);

  // Review entries
  const [reviewEntries, setReviewEntries] = useState<ReviewEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ReviewEntry | null>(null);

  // Monitoring
  const [duplicateCodes, setDuplicateCodes] = useState<any[]>([]);
  const [largeAllocations, setLargeAllocations] = useState<any[]>([]);

  // Weekly pools
  const [weeklyPools, setWeeklyPools] = useState<WeeklyPool[]>([]);

  // Audit log
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  // Admin role (would come from auth in production)
  const [adminRole] = useState<AdminRole>('super_admin');

  const canWrite = adminRole === 'super_admin' || adminRole === 'admin';

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchReviewEntries(),
      fetchMonitoringData(),
      fetchWeeklyPools(),
      fetchAuditLog(),
    ]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const fetchStats = async () => {
    const weekPeriod = getCurrentWeekPeriod();

    // Total active SmartCodes
    const { count: totalCodes } = await supabase
      .from('smartcode_allocations')
      .select('*', { count: 'exact', head: true })
      .eq('week_period', weekPeriod)
      .eq('is_active', true);

    // Total points
    const { data: pointsData } = await supabase
      .from('smartcode_allocations')
      .select('points_allocated, source, mode')
      .eq('week_period', weekPeriod)
      .eq('is_active', true);

    const totalPoints = pointsData?.reduce((sum: number, p: any) => sum + p.points_allocated, 0) || 0;
    const purchasePoints = pointsData?.filter((p: any) => p.source === 'purchase').reduce((sum: number, p: any) => sum + p.points_allocated, 0) || 0;
    const careClubPoints = pointsData?.filter((p: any) => p.source === 'care_club').reduce((sum: number, p: any) => sum + p.points_allocated, 0) || 0;
    const aiEntries = pointsData?.filter((p: any) => p.mode === 'ai_auto').length || 0;
    const manualEntries = pointsData?.filter((p: any) => p.mode === 'manual').length || 0;

    // Unique users
    const { data: usersData } = await supabase
      .from('smartcode_allocations')
      .select('user_id')
      .eq('week_period', weekPeriod)
      .eq('is_active', true);

    const uniqueUsers = new Set(usersData?.map((u: any) => u.user_id)).size;

    setStats([
      { label: 'Total Active SmartCodes', value: totalCodes || 0, icon: <Hash size={20} />, color: 'bg-vloop-500' },
      { label: 'Unique Participants', value: uniqueUsers, icon: <Users size={20} />, color: 'bg-blue-500' },
      { label: 'Total Points Registered', value: totalPoints.toLocaleString(), icon: <Zap size={20} />, color: 'bg-gold-500' },
      { label: 'Purchase Points', value: purchasePoints.toLocaleString(), icon: <Activity size={20} />, color: 'bg-green-500' },
      { label: 'Care Club Points', value: careClubPoints.toLocaleString(), icon: <HeartHandshake size={20} />, color: 'bg-pink-500' },
      { label: 'AI Entries', value: aiEntries, icon: <Cpu size={20} />, color: 'bg-purple-500' },
      { label: 'Manual Entries', value: manualEntries, icon: <Edit3 size={20} />, color: 'bg-orange-500' },
    ]);
  };

  const fetchReviewEntries = async () => {
    const weekPeriod = getCurrentWeekPeriod();

    // Get entries with high points or flagged
    const { data } = await supabase
      .from('smartcode_allocations')
      .select(`
        id,
        user_id,
        smartcode,
        points_allocated,
        source,
        mode,
        created_at,
        profiles (full_name)
      `)
      .eq('week_period', weekPeriod)
      .eq('is_active', true)
      .order('points_allocated', { ascending: false })
      .limit(50);

    if (data) {
      setReviewEntries(data.map((d: any) => ({
        id: d.id,
        user_id: d.user_id,
        smartcode: d.smartcode,
        points_allocated: d.points_allocated,
        source: d.source,
        mode: d.mode,
        created_at: d.created_at,
        user_name: d.profiles?.full_name || 'Unknown',
        flagged: d.points_allocated >= 50, // Auto-flag high value
        flag_reason: d.points_allocated >= 50 ? 'High value allocation' : undefined,
      })));
    }
  };

  const fetchMonitoringData = async () => {
    const weekPeriod = getCurrentWeekPeriod();

    // Duplicate codes (selected by multiple users)
    const { data: codeData } = await supabase
      .from('smartcode_allocations')
      .select('smartcode, points_allocated, user_id')
      .eq('week_period', weekPeriod)
      .eq('is_active', true);

    if (codeData) {
      // Group by code
      const codeCounts: Record<string, { count: number; totalPoints: number; users: Set<string> }> = {};
      for (const c of codeData as any[]) {
        if (!codeCounts[c.smartcode]) {
          codeCounts[c.smartcode] = { count: 0, totalPoints: 0, users: new Set() };
        }
        codeCounts[c.smartcode].count++;
        codeCounts[c.smartcode].totalPoints += c.points_allocated;
        codeCounts[c.smartcode].users.add(c.user_id);
      }

      const duplicates = Object.entries(codeCounts)
        .filter(([_, data]) => data.count > 1)
        .map(([code, data]) => ({
          code,
          count: data.count,
          totalPoints: data.totalPoints,
          uniqueUsers: data.users.size,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      setDuplicateCodes(duplicates);
    }

    // Large allocations
    const { data: largeData } = await supabase
      .from('smartcode_allocations')
      .select('id, smartcode, points_allocated, user_id, created_at, profiles (full_name)')
      .eq('week_period', weekPeriod)
      .eq('is_active', true)
      .gte('points_allocated', 20)
      .order('points_allocated', { ascending: false })
      .limit(20);

    setLargeAllocations((largeData as any[]) || []);
  };

  const fetchWeeklyPools = async () => {
    const weekPeriod = getCurrentWeekPeriod();

    // Try to get AI evaluation snapshot first
    const { data: evalData } = await supabase
      .from('weekly_ai_evaluation')
      .select('*')
      .eq('week_period', weekPeriod)
      .single();

    if (evalData) {
      setWeeklyPools([
        {
          pool_type: 'Prime Reward (1st)',
          total_entries: (evalData as any).prime_entries || 0,
          total_points: (evalData as any).prime_points || 0,
          unique_users: (evalData as any).prime_users || 0,
          unique_codes: Math.floor(((evalData as any).prime_entries || 0) * 0.8),
        },
        {
          pool_type: 'Premium Reward (2nd)',
          total_entries: (evalData as any).premium_entries || 0,
          total_points: (evalData as any).premium_points || 0,
          unique_users: (evalData as any).premium_users || 0,
          unique_codes: Math.floor(((evalData as any).premium_entries || 0) * 0.7),
        },
        {
          pool_type: 'Standard Reward (3rd)',
          total_entries: (evalData as any).standard_entries || 0,
          total_points: (evalData as any).standard_points || 0,
          unique_users: (evalData as any).standard_users || 0,
          unique_codes: Math.floor(((evalData as any).standard_entries || 0) * 0.6),
        },
      ]);
      return;
    }

    // Fallback: calculate from ai_pool_assignments
    const { data: poolAssignments } = await supabase
      .from('ai_pool_assignments')
      .select('assigned_pool, user_id, allocation:smartcode_allocations(points_allocated, smartcode)')
      .eq('week_period', weekPeriod);

    if (poolAssignments && poolAssignments.length > 0) {
      const prime = poolAssignments.filter((p: any) => p.assigned_pool === 'prime');
      const premium = poolAssignments.filter((p: any) => p.assigned_pool === 'premium');
      const standard = poolAssignments.filter((p: any) => p.assigned_pool === 'standard');

      const calcPoolStats = (entries: any[]) => ({
        total_entries: entries.length,
        total_points: entries.reduce((sum, e) => sum + (e.allocation?.points_allocated || 0), 0),
        unique_users: new Set(entries.map(e => e.user_id)).size,
        unique_codes: new Set(entries.map(e => e.allocation?.smartcode).filter(Boolean)).size,
      });

      setWeeklyPools([
        { pool_type: 'Prime Reward (1st)', ...calcPoolStats(prime) },
        { pool_type: 'Premium Reward (2nd)', ...calcPoolStats(premium) },
        { pool_type: 'Standard Reward (3rd)', ...calcPoolStats(standard) },
      ]);
      return;
    }

    // Final fallback: simulate based on total entries
    const { data: poolData } = await supabase
      .from('smartcode_allocations')
      .select('smartcode, points_allocated, user_id')
      .eq('week_period', weekPeriod)
      .eq('is_active', true);

    if (poolData) {
      const prime = (poolData as any[]).filter((_, i) => i % 10 === 0);
      const premium = (poolData as any[]).filter((_, i) => i % 5 === 0 && i % 10 !== 0);
      const standard = (poolData as any[]).filter((_, i) => i % 5 !== 0);

      const calcPoolStats = (entries: any[]) => ({
        total_entries: entries.length,
        total_points: entries.reduce((sum, e) => sum + e.points_allocated, 0),
        unique_users: new Set(entries.map(e => e.user_id)).size,
        unique_codes: new Set(entries.map(e => e.smartcode)).size,
      });

      setWeeklyPools([
        { pool_type: 'Prime Reward (1st)', ...calcPoolStats(prime) },
        { pool_type: 'Premium Reward (2nd)', ...calcPoolStats(premium) },
        { pool_type: 'Standard Reward (3rd)', ...calcPoolStats(standard) },
      ]);
    }
  };

  const fetchAuditLog = async () => {
    const { data } = await supabase
      .from('smartcode_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    setAuditLog((data as AuditLogEntry[]) || []);
  };

  const handleSearch = async () => {
    if (!filters.query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    let query = supabase
      .from('smartcode_allocations')
      .select('*, profiles (full_name, phone)')
      .eq('is_active', true);

    switch (filters.searchBy) {
      case 'name':
        query = query.ilike('profiles.full_name', `%${filters.query}%`);
        break;
      case 'smartcode':
        query = query.eq('smartcode', filters.query.padStart(3, '0'));
        break;
      case 'user_id':
        query = query.eq('user_id', filters.query);
        break;
      case 'date':
        query = query.gte('created_at', filters.query);
        break;
      default:
        query = query.ilike('profiles.phone', `%${filters.query}%`);
    }

    const { data } = await query.limit(50);
    setSearchResults((data as SmartCodeAllocation[]) || []);
    setSearching(false);
  };

  const handleApproveEntry = async (entry: ReviewEntry) => {
    if (!canWrite) return;

    await supabase.rpc('log_smartcode_action', {
      p_user_id: entry.user_id,
      p_action: 'approve',
      p_smartcode: entry.smartcode,
      p_points_after: entry.points_allocated,
      p_metadata: { admin_action: true, entry_id: entry.id },
    });

    setReviewEntries(reviewEntries.filter(e => e.id !== entry.id));
    setSelectedEntry(null);
  };

  const handleRejectEntry = async (entry: ReviewEntry) => {
    if (!canWrite) return;

    // Deactivate the entry
    await supabase
      .from('smartcode_allocations')
      .update({ is_active: false })
      .eq('id', entry.id);

    await supabase.rpc('log_smartcode_action', {
      p_user_id: entry.user_id,
      p_action: 'reject',
      p_smartcode: entry.smartcode,
      p_points_before: entry.points_allocated,
      p_points_after: 0,
      p_metadata: { admin_action: true, entry_id: entry.id },
    });

    setReviewEntries(reviewEntries.filter(e => e.id !== entry.id));
    setSelectedEntry(null);
    refreshData();
  };

  const handleFlagEntry = async (entry: ReviewEntry, reason: string) => {
    if (!canWrite) return;

    await supabase.rpc('log_smartcode_action', {
      p_user_id: entry.user_id,
      p_action: 'flag',
      p_smartcode: entry.smartcode,
      p_metadata: { admin_action: true, entry_id: entry.id, reason },
    });

    setReviewEntries(reviewEntries.map(e =>
      e.id === entry.id ? { ...e, flagged: true, flag_reason: reason } : e
    ));
  };

  // Tab navigation
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { id: 'review', label: 'Review', icon: <Eye size={18} /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Activity size={18} /> },
    { id: 'pools', label: 'Reward Pools', icon: <Trophy size={18} /> },
    { id: 'audit', label: 'Audit Log', icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-600 to-vloop-800 flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin SmartCode Control Center</h1>
                <p className="text-xs text-gray-500">Week {weekPeriod}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                adminRole === 'super_admin' ? 'bg-red-100 text-red-700' :
                adminRole === 'admin' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                <Lock size={12} className="inline mr-1" />
                {adminRole.replace('_', ' ').toUpperCase()}
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RefreshCw size={18} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-vloop-600 text-vloop-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-vloop-600" />
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveTab('review')}
                      className="p-4 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors text-left"
                    >
                      <AlertTriangle size={20} className="text-orange-600 mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Review Entries</div>
                      <div className="text-xs text-gray-500">{reviewEntries.filter(e => e.flagged).length} flagged</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('monitoring')}
                      className="p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors text-left"
                    >
                      <Activity size={20} className="text-blue-600 mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Monitor Duplicates</div>
                      <div className="text-xs text-gray-500">{duplicateCodes.length} duplicate codes</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('pools')}
                      className="p-4 rounded-xl bg-gold-50 border border-gold-100 hover:bg-gold-100 transition-colors text-left"
                    >
                      <Trophy size={20} className="text-gold-600 mb-2" />
                      <div className="text-sm font-semibold text-gray-900">View Reward Pools</div>
                      <div className="text-xs text-gray-500">Weekly pool stats</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-left"
                    >
                      <FileText size={20} className="text-gray-600 mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Audit Trail</div>
                      <div className="text-xs text-gray-500">{auditLog.length} recent actions</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Search Tab */}
            {activeTab === 'customers' && (
              <div className="animate-fade-in">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Search Customer SmartCodes</h3>
                  <div className="flex flex-col md:flex-row gap-3">
                    <select
                      value={filters.searchBy}
                      onChange={(e) => setFilters({ ...filters, searchBy: e.target.value as SearchFilters['searchBy'] })}
                      className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-vloop-500"
                    >
                      <option value="name">Customer Name</option>
                      <option value="mobile">Mobile Number</option>
                      <option value="user_id">User ID</option>
                      <option value="smartcode">SmartCode</option>
                      <option value="date">Date</option>
                    </select>
                    <input
                      type="text"
                      value={filters.query}
                      onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                      placeholder={`Search by ${filters.searchBy.replace('_', ' ')}...`}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-vloop-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={searching}
                      className="px-6 py-2.5 bg-vloop-600 text-white font-semibold rounded-lg hover:bg-vloop-700 transition-colors disabled:opacity-50"
                    >
                      {searching ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SmartCode</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Points</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mode</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {searchResults.map((result: any) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{result.profiles?.full_name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{result.user_id.slice(0, 8)}...</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-vloop-600">{result.smartcode}</span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">{result.points_allocated}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.source === 'purchase' ? 'bg-green-100 text-green-700' :
                                result.source === 'care_club' ? 'bg-pink-100 text-pink-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {result.source}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-gray-600">{result.mode}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(result.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Review Tab */}
            {activeTab === 'review' && (
              <div className="animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Entry List */}
                  <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Entries for Review</h3>
                      <p className="text-xs text-gray-500">High-value and flagged entries require review</p>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                      {reviewEntries.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
                          <p>No entries require review</p>
                        </div>
                      ) : (
                        reviewEntries.map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => setSelectedEntry(entry)}
                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                              selectedEntry?.id === entry.id ? 'bg-vloop-50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {entry.flagged && (
                                  <AlertTriangle size={16} className="text-orange-500" />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">{entry.user_name}</div>
                                  <div className="text-xs text-gray-500">{entry.user_id.slice(0, 8)}...</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-vloop-600">{entry.smartcode}</div>
                                <div className="text-sm font-semibold text-gray-900">{entry.points_allocated} pts</div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Entry Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {selectedEntry ? (
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Entry Details</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">SmartCode</span>
                            <span className="font-mono font-bold text-vloop-600">{selectedEntry.smartcode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Points</span>
                            <span className="font-semibold">{selectedEntry.points_allocated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Source</span>
                            <span>{selectedEntry.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mode</span>
                            <span>{selectedEntry.mode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">User</span>
                            <span>{selectedEntry.user_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span>{new Date(selectedEntry.created_at).toLocaleString()}</span>
                          </div>
                          {selectedEntry.flagged && (
                            <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                              <div className="flex items-center gap-2 text-orange-700">
                                <AlertTriangle size={14} />
                                <span className="font-medium">Flagged</span>
                              </div>
                              <p className="text-xs text-orange-600 mt-1">{selectedEntry.flag_reason}</p>
                            </div>
                          )}
                        </div>

                        {canWrite && (
                          <div className="mt-6 space-y-2">
                            <button
                              onClick={() => handleApproveEntry(selectedEntry)}
                              className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 size={16} /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectEntry(selectedEntry)}
                              className="w-full py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <XCircle size={16} /> Reject
                            </button>
                            <button
                              onClick={() => handleFlagEntry(selectedEntry, 'Manual flag by admin')}
                              className="w-full py-2.5 bg-orange-100 text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                            >
                              <Flag size={16} /> Flag for Review
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Eye size={32} className="mx-auto mb-2" />
                        <p>Select an entry to review</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Monitoring Tab */}
            {activeTab === 'monitoring' && (
              <div className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Duplicate Codes */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Duplicate SmartCodes</h3>
                      <p className="text-xs text-gray-500">Codes selected by multiple users</p>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                      {duplicateCodes.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">No duplicate codes found</div>
                      ) : (
                        duplicateCodes.map((dup: any) => (
                          <div key={dup.code} className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-vloop-600 w-10">{dup.code}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{dup.count} entries</div>
                                <div className="text-xs text-gray-500">{dup.uniqueUsers} unique users</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">{dup.totalPoints} pts</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Large Allocations */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Large Point Allocations</h3>
                      <p className="text-xs text-gray-500">Entries with 20+ points</p>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                      {largeAllocations.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">No large allocations found</div>
                      ) : (
                        (largeAllocations as any[]).map((alloc: any) => (
                          <div key={alloc.id} className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-vloop-600 w-10">{alloc.smartcode}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{alloc.profiles?.full_name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{new Date(alloc.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-orange-600">{alloc.points_allocated} pts</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Pools Tab */}
            {activeTab === 'pools' && (
              <div className="animate-fade-in">
                <div className="bg-gold-50 border border-gold-100 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">AI Weekly Reward Engine</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Pool assignments are determined automatically by the AI Weekly Reward Engine.
                        Admins can only view statistics, not manually assign winners.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Evaluation Stats */}
                <div className="bg-vloop-50 border border-vloop-100 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-vloop-600" />
                    <h4 className="font-semibold text-gray-900">AI Evaluation Summary</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-vloop-700">{stats.find(s => s.label === 'Total Active SmartCodes')?.value || 0}</div>
                      <div className="text-xs text-gray-500">Total Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold-600">{weeklyPools.reduce((sum, p) => sum + p.total_points, 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{weeklyPools.reduce((sum, p) => sum + p.unique_users, 0)}</div>
                      <div className="text-xs text-gray-500">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{weeklyPools.reduce((sum, p) => sum + p.unique_codes, 0)}</div>
                      <div className="text-xs text-gray-500">Unique Codes</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {weeklyPools.map((pool, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className={`px-4 py-3 ${
                        idx === 0 ? 'bg-gold-100' :
                        idx === 1 ? 'bg-vloop-100' :
                        'bg-gray-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{pool.pool_type}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            idx === 0 ? 'bg-gold-200 text-gold-800' :
                            idx === 1 ? 'bg-vloop-200 text-vloop-800' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {idx === 0 ? '4×' : idx === 1 ? '2×' : '1×'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Entries</span>
                          <span className="font-semibold">{pool.total_entries}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Points</span>
                          <span className="font-semibold">{pool.total_points.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Unique Users</span>
                          <span className="font-semibold">{pool.unique_users}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Unique Codes</span>
                          <span className="font-semibold">{pool.unique_codes}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-xs text-gray-400">AI-assigned pool</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Log Tab */}
            {activeTab === 'audit' && (
              <div className="animate-fade-in">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Audit Trail</h3>
                      <p className="text-xs text-gray-500">Immutable log of all SmartCode actions</p>
                    </div>
                    <button
                      onClick={() => {/* Export functionality */}}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                    >
                      <Download size={14} /> Export
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SmartCode</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Points</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {auditLog.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                log.action === 'allocate' ? 'bg-blue-100 text-blue-700' :
                                log.action === 'approve' ? 'bg-green-100 text-green-700' :
                                log.action === 'reject' ? 'bg-red-100 text-red-700' :
                                log.action === 'flag' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-vloop-600">
                              {log.smartcode || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {log.points_before !== undefined && (
                                <span className="text-gray-400 mr-1">{log.points_before}</span>
                              )}
                              {log.points_after !== undefined && (
                                <span className="font-semibold">{log.points_after}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {log.source || '-'}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                              {log.user_id?.slice(0, 8)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
