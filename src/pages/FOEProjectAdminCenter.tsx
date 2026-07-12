import { useState, useEffect } from 'react';
import {
  Building2, Users, Coins, TrendingUp, Shield, AlertTriangle,
  Plus, Edit, Pause, Play, Archive, RotateCcw, MoreVertical,
  Search, Filter, ChevronRight, Clock, BarChart3, FileText,
  Activity, Zap, Eye, Download, RefreshCw, Settings, Bell,
  CheckCircle2, XCircle, AlertCircle, Info
} from 'lucide-react';
import {
  AdminDashboardStats,
  AIMonitoringSummary,
  ProjectAdminLog,
  ProjectStatus,
  ProjectCategory,
  PROJECT_STATUS,
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  ADMIN_ROLES,
  ADMIN_ROLE_LABELS,
  getStatusLabel,
  getStatusBgClass,
  getCategoryLabel,
  getActionLabel,
  getRoleLabel,
  getPriorityColor,
  getTrendIcon,
  getTrendColor,
  getMockDashboardStats,
  getMockAIMonitoringSummary,
  getMockAuditLog,
} from '../lib/FOEProjectAdminEngine';

interface FOEProjectAdminCenterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

type TabId = 'dashboard' | 'projects' | 'monitoring' | 'audit' | 'reports' | 'settings';

export default function FOEProjectAdminCenter({ onNavigate }: FOEProjectAdminCenterProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [aiSummary, setAiSummary] = useState<AIMonitoringSummary | null>(null);
  const [auditLog, setAuditLog] = useState<ProjectAdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      // Mock data for preview
      setStats(getMockDashboardStats());
      setAiSummary(getMockAIMonitoringSummary());
      setAuditLog(getMockAuditLog());
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading Admin Center...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'projects', label: 'Projects', icon: Building2 },
    { key: 'monitoring', label: 'AI Monitoring', icon: Activity },
    { key: 'audit', label: 'Audit Log', icon: FileText },
    { key: 'reports', label: 'Reports', icon: Download },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">FOE Project Admin Center</h1>
                  <p className="text-slate-400 text-sm">Future Opportunity Exchange Administration</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabId)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab stats={stats!} aiSummary={aiSummary!} auditLog={auditLog} />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab onNavigate={onNavigate} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        {activeTab === 'monitoring' && <MonitoringTab aiSummary={aiSummary!} />}
        {activeTab === 'audit' && <AuditTab auditLog={auditLog} />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD TAB
// ============================================================

function DashboardTab({
  stats,
  aiSummary,
  auditLog,
}: {
  stats: AdminDashboardStats;
  aiSummary: AIMonitoringSummary;
  auditLog: ProjectAdminLog[];
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Projects"
          value={stats.projects.total}
          icon={Building2}
          color="blue"
        />
        <StatCard
          label="Active"
          value={stats.projects.active}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Coming Soon"
          value={stats.projects.coming_soon}
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Completed"
          value={stats.projects.completed}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          label="Participants"
          value={stats.participation.total_participants}
          icon={Users}
          color="purple"
        />
        <StatCard
          label="Total Units"
          value={stats.participation.total_units}
          icon={Coins}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Participation Value</h3>
            <Coins className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400 mb-2">
            {stats.participation.total_smartpoints.toLocaleString()}
          </p>
          <p className="text-slate-400 text-sm">Total SmartPoints Allocated</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Avg Progress</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400 mb-2">{stats.progress.avg_progress}%</p>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.progress.avg_progress}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-2">{stats.progress.high_progress_count} projects near completion</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Transparency</h3>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-2">{stats.transparency.avg_score}%</p>
          <p className="text-slate-400 text-sm">
            {stats.transparency.flagged_count} flagged items
          </p>
        </div>
      </div>

      {/* AI Monitoring Summary */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          AI Monitoring Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{aiSummary.alerts.total_risk_alerts}</p>
            <p className="text-slate-400 text-xs">Risk Alerts</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{aiSummary.alerts.critical_count}</p>
            <p className="text-slate-400 text-xs">Critical</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{aiSummary.health.avg_health_score}%</p>
            <p className="text-slate-400 text-xs">Health Score</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{aiSummary.trends.increasing}</p>
            <p className="text-slate-400 text-xs">Growing Projects</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Recent Admin Activity
        </h3>
        <div className="space-y-3">
          {auditLog.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Edit className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{getActionLabel(log.action)}</p>
                  <p className="text-slate-400 text-xs">{log.project_name || 'Unknown Project'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-xs">{log.admin_name || 'System'}</p>
                <p className="text-slate-500 text-xs">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
      <Icon className={`w-5 h-5 text-${color}-400 mx-auto mb-2`} />
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-slate-400 text-xs">{label}</p>
    </div>
  );
}

// ============================================================
// PROJECTS TAB
// ============================================================

function ProjectsTab({
  onNavigate,
  searchQuery,
  setSearchQuery,
}: {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ProjectCategory | 'all'>('all');

  const mockProjects = [
    { id: '1', name: 'Green Valley Housing', category: 'affordable_housing', status: 'active' as ProjectStatus, progress: 45, participants: 234 },
    { id: '2', name: 'EV Future Program', category: 'ev_programs', status: 'coming_soon' as ProjectStatus, progress: 0, participants: 0 },
    { id: '3', name: 'Golden Savings Plan', category: 'gold_programs', status: 'active' as ProjectStatus, progress: 78, participants: 567 },
    { id: '4', name: 'Land Opportunity 2026', category: 'land_projects', status: 'paused' as ProjectStatus, progress: 32, participants: 123 },
    { id: '5', name: 'Healthcare Support Initiative', category: 'healthcare_programs', status: 'completed' as ProjectStatus, progress: 100, participants: 890 },
    { id: '6', name: 'Premier Villa Estate', category: 'villa_projects', status: 'draft' as ProjectStatus, progress: 0, participants: 0 },
  ];

  const filteredProjects = mockProjects.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm"
          >
            <option value="all">All Status</option>
            {Object.values(PROJECT_STATUS).map((status) => (
              <option key={status} value={status}>{PROJECT_STATUS_LABELS[status]}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ProjectCategory | 'all')}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm"
          >
            <option value="all">All Categories</option>
            {Object.values(PROJECT_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>{PROJECT_CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Projects List */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Project</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Category</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Status</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Progress</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Participants</th>
              <th className="text-right px-4 py-3 text-slate-300 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                <td className="px-4 py-4">
                  <button
                    onClick={() => onNavigate('future-project-details', { projectCode: project.id })}
                    className="text-white font-medium hover:text-blue-400 transition-colors"
                  >
                    {project.name}
                  </button>
                </td>
                <td className="px-4 py-4 text-slate-400 text-sm">{getCategoryLabel(project.category)}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgClass(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${project.progress >= 80 ? 'bg-emerald-500' : project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-400 text-sm">{project.participants.toLocaleString()}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MONITORING TAB
// ============================================================

function MonitoringTab({ aiSummary }: { aiSummary: AIMonitoringSummary }) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Health Score</p>
              <p className="text-2xl font-bold text-emerald-400">{aiSummary.health.avg_health_score}%</p>
            </div>
          </div>
          <p className="text-emerald-400/70 text-xs">All projects healthy</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Trust Score</p>
              <p className="text-2xl font-bold text-blue-400">{aiSummary.health.avg_trust_score}</p>
            </div>
          </div>
          <p className="text-blue-400/70 text-xs">High trust ecosystem</p>
        </div>

        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Risk Alerts</p>
              <p className="text-2xl font-bold text-amber-400">{aiSummary.alerts.total_risk_alerts}</p>
            </div>
          </div>
          <p className="text-amber-400/70 text-xs">{aiSummary.alerts.high_risk_count} high priority</p>
        </div>

        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Critical</p>
              <p className="text-2xl font-bold text-red-400">{aiSummary.alerts.critical_count}</p>
            </div>
          </div>
          <p className="text-red-400/70 text-xs">Requires attention</p>
        </div>
      </div>

      {/* Trends */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Participation Trends</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400 mb-1">{aiSummary.trends.increasing}</p>
            <p className="text-emerald-400/70 text-sm flex items-center justify-center gap-1">
              <span className="text-xl">↑</span> Growing
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400 mb-1">{aiSummary.trends.stable}</p>
            <p className="text-blue-400/70 text-sm flex items-center justify-center gap-1">
              <span className="text-xl">→</span> Stable
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-400 mb-1">{aiSummary.trends.decreasing}</p>
            <p className="text-red-400/70 text-sm flex items-center justify-center gap-1">
              <span className="text-xl">↓</span> Declining
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendations Placeholder */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          AI Recommendations
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-medium">EV Future Program</span>
              <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor('normal')}`}>Normal</span>
            </div>
            <p className="text-slate-300 text-sm">Consider extending closing date by 30 days based on participation velocity.</p>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 font-medium">Land Opportunity 2026</span>
              <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor('high')}`}>High</span>
            </div>
            <p className="text-slate-300 text-sm">Participation trend declining. Review marketing visibility settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AUDIT TAB
// ============================================================

function AuditTab({ auditLog }: { auditLog: ProjectAdminLog[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Audit Trail</h2>
        <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Timestamp</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Action</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Project</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Admin</th>
              <th className="text-left px-4 py-3 text-slate-300 text-sm font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((log) => (
              <tr key={log.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-4 py-4 text-slate-400 text-sm">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.action === 'created' ? 'bg-emerald-500/20 text-emerald-400' :
                    log.action === 'status_changed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {getActionLabel(log.action)}
                  </span>
                </td>
                <td className="px-4 py-4 text-white text-sm">{log.project_name || '—'}</td>
                <td className="px-4 py-4 text-slate-400 text-sm">{log.admin_name || 'System'}</td>
                <td className="px-4 py-4 text-slate-400 text-sm">{log.audit_notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// REPORTS TAB
// ============================================================

function ReportsTab() {
  const reports = [
    { code: 'RPT-001', name: 'Project Summary Report', desc: 'Overview of all projects' },
    { code: 'RPT-002', name: 'Participation Summary', desc: 'Participation unit breakdown' },
    { code: 'RPT-003', name: 'Growth Analytics', desc: 'Trends and predictions' },
    { code: 'RPT-004', name: 'Transparency Report', desc: 'Trust and validation scores' },
    { code: 'RPT-005', name: 'Audit Trail Report', desc: 'Admin activity log' },
    { code: 'RPT-006', name: 'Admin Activity Report', desc: 'Permissions usage' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.code} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-500 text-xs">{report.code}</span>
            </div>
            <h3 className="text-white font-medium mb-1">{report.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{report.desc}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Generate
              </button>
              <button className="px-3 py-2 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS TAB
// ============================================================

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Admin Settings</h2>

      {/* Admin Roles */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Admin Role Permissions</h3>
        <div className="space-y-3">
          {Object.values(ADMIN_ROLES).map((role) => (
            <div key={role} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <span className="text-white font-medium">{ADMIN_ROLE_LABELS[role]}</span>
              </div>
              <span className="text-slate-400 text-sm capitalize">{role.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 bg-slate-700/30 rounded-lg text-center hover:bg-slate-700 transition-colors">
            <Plus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <span className="text-slate-300 text-sm">Create Template</span>
          </button>
          <button className="p-4 bg-slate-700/30 rounded-lg text-center hover:bg-slate-700 transition-colors">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <span className="text-slate-300 text-sm">Manage Admins</span>
          </button>
          <button className="p-4 bg-slate-700/30 rounded-lg text-center hover:bg-slate-700 transition-colors">
            <Settings className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <span className="text-slate-300 text-sm">System Config</span>
          </button>
          <button className="p-4 bg-slate-700/30 rounded-lg text-center hover:bg-slate-700 transition-colors">
            <Bell className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <span className="text-slate-300 text-sm">Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
}
