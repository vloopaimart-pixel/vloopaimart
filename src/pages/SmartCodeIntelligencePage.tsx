import { useState, lazy, Suspense } from 'react';
import {
  Brain, BarChart3, Grid3x3, TrendingUp, MapPin, ShieldAlert,
  Trophy, ArrowLeft, Activity, Sparkles,
} from 'lucide-react';
import { liveStats, weeklyDistribution } from '../lib/smartCodeIntelligenceMockData';

const LiveStatsCards = lazy(() => import('./smartcode-intelligence/LiveStatsCards'));
const HeatMap = lazy(() => import('./smartcode-intelligence/HeatMap'));
const WeeklyDistributionSummary = lazy(() => import('./smartcode-intelligence/WeeklyDistributionSummary'));
const SmartCodeTrends = lazy(() => import('./smartcode-intelligence/SmartCodeTrends'));
const GeographicStats = lazy(() => import('./smartcode-intelligence/GeographicStats'));
const FraudMonitoring = lazy(() => import('./smartcode-intelligence/FraudMonitoring'));
const MatrixPreview = lazy(() => import('./smartcode-intelligence/MatrixPreview'));

type Props = { onNavigate: (page: string) => void };
type TabId = 'overview' | 'matrix' | 'heatmap' | 'trends' | 'geo' | 'fraud';

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'matrix', label: 'Matrix 000-999', icon: Grid3x3 },
  { id: 'heatmap', label: 'Heat Map', icon: Activity },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'geo', label: 'Geographic', icon: MapPin },
  { id: 'fraud', label: 'Fraud Monitor', icon: ShieldAlert },
];

export default function SmartCodeIntelligencePage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="min-h-screen bg-gray-50" style={{ background: 'linear-gradient(180deg, #0B0819 0%, #12102a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('admin')} className="p-2 rounded-xl transition-colors hover:bg-white/10" aria-label="Back to admin">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <Brain size={24} /> SmartCode Intelligence
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Analytics Foundation · Admin Only · Mock Data</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Active
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'scale-105' : 'hover:scale-105'}`}
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
          {activeTab === 'overview' && <OverviewTab onNavigate={onNavigate} />}
          {activeTab === 'matrix' && <MatrixPreview />}
          {activeTab === 'heatmap' && <HeatMap />}
          {activeTab === 'trends' && <SmartCodeTrends />}
          {activeTab === 'geo' && <GeographicStats />}
          {activeTab === 'fraud' && <FraudMonitoring />}
        </Suspense>
      </div>
    </div>
  );
}

function OverviewTab({ onNavigate }: Props) {
  return (
    <div className="space-y-4">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickStat icon={Sparkles} label="Total Submitted" value={liveStats.totalSubmitted.toLocaleString()} color="#D4AF37" />
        <QuickStat icon={Activity} label="Validated" value={liveStats.validated.toLocaleString()} color="#22c55e" />
        <QuickStat icon={Trophy} label="Weekly Eligible" value={liveStats.weeklyEligible.toLocaleString()} color="#00F2FE" />
        <QuickStat icon={TrendingUp} label="Avg SP/Entry" value={liveStats.avgSmartPointsPerEntry.toString()} color="#D4AF37" />
      </div>

      {/* Live Stats Cards (full) */}
      <LiveStatsCards />

      {/* Weekly Distribution Summary */}
      <WeeklyDistributionSummary />

      {/* Section shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <SectionShortcut icon={Grid3x3} label="SmartCode Matrix" desc="000-999 range analytics" color="#D4AF37" />
        <SectionShortcut icon={Activity} label="Heat Map" desc="Visual activity intensity" color="#22c55e" />
        <SectionShortcut icon={TrendingUp} label="Trends" desc="Popular & growing codes" color="#00F2FE" />
        <SectionShortcut icon={MapPin} label="Geographic" desc="Regional statistics" color="#D4AF37" />
        <SectionShortcut icon={ShieldAlert} label="Fraud Monitor" desc="AI-powered detection" color="#ef4444" />
        <SectionShortcut icon={Trophy} label="Weekly Results" desc="Distribution summary" color="#D4AF37" />
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function SectionShortcut({ icon: Icon, label, desc, color }: { icon: any; label: string; desc: string; color: string }) {
  return (
    <div className="rounded-2xl p-4 border transition-all hover:scale-[1.02] cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="text-sm font-bold text-white">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
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
