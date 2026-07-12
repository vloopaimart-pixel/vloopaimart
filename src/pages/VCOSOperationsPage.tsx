import { useState, lazy, Suspense } from 'react';
import {
  Activity, Clock, GitBranch, LayoutDashboard, Bell, HeartPulse,
  ArrowLeft, Settings,
} from 'lucide-react';
import { opsSummary } from '../lib/vcosOperationsMockData';

const ActivityStream = lazy(() => import('./vcos-operations/ActivityStream'));
const CustomerTimeline = lazy(() => import('./vcos-operations/CustomerTimeline'));
const EventProcessing = lazy(() => import('./vcos-operations/EventProcessing'));
const Pipelines = lazy(() => import('./vcos-operations/Pipelines'));
const OpsAlerts = lazy(() => import('./vcos-operations/OpsAlerts'));
const SystemHealth = lazy(() => import('./vcos-operations/SystemHealth'));

type Props = { onNavigate: (page: string) => void };
type TabId = 'overview' | 'activity' | 'timeline' | 'events' | 'pipelines' | 'alerts' | 'health';

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'activity', label: 'Activity Stream', icon: Activity },
  { id: 'timeline', label: 'Customer Timeline', icon: Clock },
  { id: 'events', label: 'Event Processing', icon: GitBranch },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'health', label: 'System Health', icon: HeartPulse },
];

export default function VCOSOperationsPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0B0819 0%, #12102a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('admin')} className="p-2 rounded-xl transition-colors hover:bg-white/10" aria-label="Back to admin">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <Settings size={24} /> VCOS Operations Center
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Operations Layer · Admin Only · Mock Architecture</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #D4AF37, #B8941F)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? '#0B0819' : '#9ca3af',
                border: activeTab === tab.id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'activity' && <ActivityStream />}
          {activeTab === 'timeline' && <CustomerTimeline />}
          {activeTab === 'events' && <EventProcessing />}
          {activeTab === 'pipelines' && <Pipelines />}
          {activeTab === 'alerts' && <OpsAlerts />}
          {activeTab === 'health' && <SystemHealth />}
        </Suspense>
      </div>
    </div>
  );
}

function OverviewTab() {
  const cards = [
    { label: "Today's Purchases", value: opsSummary.todayPurchases, color: '#D4AF37' },
    { label: "Today's Contributions", value: opsSummary.todayContributions, color: '#22c55e' },
    { label: "Today's SmartCodes", value: opsSummary.todaySmartCodes, color: '#00F2FE' },
    { label: "Today's Valid Entries", value: opsSummary.todayValidEntries, color: '#D4AF37' },
    { label: 'Pending Reviews', value: opsSummary.pendingReviews, color: '#fbbf24' },
    { label: 'Completed Reviews', value: opsSummary.completedReviews, color: '#22c55e' },
  ];
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
            <div className="text-[10px] text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Challenge Status */}
      <div className="rounded-2xl p-4 border-2 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
        <div>
          <div className="text-sm font-bold text-white">Weekly Challenge Status</div>
          <div className="text-xs text-gray-500 mt-0.5">{opsSummary.weeklyChallengeStatus}</div>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
        </span>
      </div>

      {/* Quick Previews */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Activity size={16} style={{ color: '#D4AF37' }} /> Recent Activity</h3>
          <ActivityStream />
        </div>
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Bell size={16} style={{ color: '#D4AF37' }} /> Active Alerts</h3>
          <OpsAlerts />
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full border-2 border-t-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }} />
    </div>
  );
}
