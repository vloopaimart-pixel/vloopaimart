import { useState, useEffect } from 'react';
import {
  Shield, TrendingUp, TrendingDown, Activity, Award, Lock,
  ChevronRight, Clock, AlertTriangle, CheckCircle2, Info,
  Zap, Heart, ShoppingBag, Wallet, Users, Building2, Star,
  RefreshCw, ArrowUpRight, ArrowDownRight, Target
} from 'lucide-react';
import {
  TrustScoreSummary,
  TrustScoreHistory,
  TrustImprovement,
  TrustLevelCode,
  TRUST_LEVEL_CONFIG,
  getTrustLevelName,
  getTrustLevelColor,
  getTrendIcon,
  getTrendColor,
  getTrendBgClass,
  getRiskLevel,
  getRiskColor,
  formatScore,
  calculateProgressPercent,
  getMockTrustSummary,
  getMockTrustHistory,
  getMockImprovements,
} from '../lib/VCOSTrustScoreEngine';

interface TrustScorePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

type TabId = 'overview' | 'history' | 'factors' | 'improvements';

export default function TrustScorePage({ onNavigate }: TrustScorePageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [summary, setSummary] = useState<TrustScoreSummary | null>(null);
  const [history, setHistory] = useState<TrustScoreHistory[]>([]);
  const [improvements, setImprovements] = useState<TrustImprovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Mock data for preview
      setSummary(getMockTrustSummary());
      setHistory(getMockTrustHistory());
      setImprovements(getMockImprovements());
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading Trust Score...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Shield },
    { key: 'history', label: 'History', icon: Clock },
    { key: 'factors', label: 'Factors', icon: Activity },
    { key: 'improvements', label: 'Improve Score', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">VCOS Trust Score</h1>
              <p className="text-indigo-200 text-sm">Your VLOOP ecosystem participation score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Level Card (Overlapping Header) */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <TrustLevelCard summary={summary!} />
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex gap-2 overflow-x-auto mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab summary={summary!} improvements={improvements} onNavigate={onNavigate} />
        )}
        {activeTab === 'history' && <HistoryTab history={history} />}
        {activeTab === 'factors' && <FactorsTab summary={summary!} />}
        {activeTab === 'improvements' && (
          <ImprovementsTab improvements={improvements} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// TRUST LEVEL CARD
// ============================================================

function TrustLevelCard({ summary }: { summary: TrustScoreSummary }) {
  const levelConfig = TRUST_LEVEL_CONFIG[summary.trust_level];
  const progress = calculateProgressPercent(summary.trust_score, summary.trust_level);

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Score Circle */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(progress / 100) * 352} 352`}
                strokeLinecap="round"
                style={{ color: levelConfig?.color }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{formatScore(summary.trust_score)}</span>
              <span className="text-slate-400 text-xs">/ 1000</span>
            </div>
          </div>
        </div>

        {/* Level Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${levelConfig?.color}20`,
                color: levelConfig?.color,
              }}
            >
              {getTrustLevelName(summary.trust_level)}
            </span>
            <span className={`flex items-center gap-1 text-sm ${getTrendColor(summary.trust_trend)}`}>
              <span>{getTrendIcon(summary.trust_trend)}</span>
              <span className="capitalize">{summary.trust_trend}</span>
            </span>
          </div>
          <p className="text-slate-300 mb-4">
            {summary.points_to_next_level > 0
              ? `${summary.points_to_next_level} points to ${getTrustLevelName(getNextLevel(summary.trust_level))}`
              : 'Maximum level achieved!'}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${levelConfig?.color}, ${levelConfig?.color}CC)`,
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 md:border-l md:border-slate-700 md:pl-6">
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">AI Confidence</p>
            <p className="text-white font-semibold">{summary.ai_confidence}%</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">Risk Score</p>
            <p className={`${getRiskColor(getRiskLevel(summary.risk_score))} font-semibold`}>
              {summary.risk_score}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">Status</p>
            <p className="text-emerald-400 font-semibold">
              {summary.is_locked ? 'Locked' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNextLevel(level: TrustLevelCode): TrustLevelCode {
  const levels: TrustLevelCode[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'elite'];
  const idx = levels.indexOf(level);
  return idx < levels.length - 1 ? levels[idx + 1] : level;
}

// ============================================================
// OVERVIEW TAB
// ============================================================

function OverviewTab({
  summary,
  improvements,
  onNavigate,
}: {
  summary: TrustScoreSummary;
  improvements: TrustImprovement[];
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* AI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Activity Trend</p>
              <p className={`text-lg font-bold capitalize ${getTrendColor(summary.activity_trend)}`}>
                {summary.activity_trend}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Behaviour Trend</p>
              <p className={`text-lg font-bold capitalize ${getTrendColor(summary.behaviour_trend)}`}>
                {summary.behaviour_trend}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Fraud Risk</p>
              <p className={`text-lg font-bold ${getRiskColor(getRiskLevel(summary.fraud_risk_score))}`}>
                {getRiskLevel(summary.fraud_risk_score).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Component Scores
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ComponentScoreCard label="Purchase Consistency" score={summary.component_scores.purchase_consistency} icon={ShoppingBag} />
          <ComponentScoreCard label="Care Club" score={summary.component_scores.careclub_frequency} icon={Heart} />
          <ComponentScoreCard label="SmartCode" score={summary.component_scores.smartcode_participation} icon={Zap} />
          <ComponentScoreCard label="Weekly Challenge" score={summary.component_scores.weekly_challenge} icon={Award} />
          <ComponentScoreCard label="Wallet Activity" score={summary.component_scores.wallet_activity} icon={Wallet} />
          <ComponentScoreCard label="Account Age" score={summary.component_scores.account_age} icon={Clock} />
          <ComponentScoreCard label="ID Verification" score={summary.component_scores.identity_verification} icon={CheckCircle2} />
          <ComponentScoreCard label="Profile" score={summary.component_scores.profile_completion} icon={Users} />
          <ComponentScoreCard label="Community" score={summary.component_scores.community_participation} icon={Users} />
          <ComponentScoreCard label="FOE Participation" score={summary.component_scores.foe_participation} icon={Building2} />
          <ComponentScoreCard label="Reward History" score={summary.component_scores.reward_history} icon={Star} />
          <ComponentScoreCard label="AI Behaviour" score={summary.component_scores.ai_behaviour} icon={Shield} />
        </div>
      </div>

      {/* Quick Improvements */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Suggested Improvements
          </h3>
          <button
            onClick={() => onNavigate('trust-improvements')}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {improvements.slice(0, 3).map((imp) => (
            <div
              key={imp.id}
              className="p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
              onClick={() => imp.action_link && onNavigate(imp.action_link.replace('/', ''))}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-white font-medium text-sm">{imp.title}</span>
                <span className="text-emerald-400 text-xs font-bold">+{imp.potential_points} pts</span>
              </div>
              <p className="text-slate-400 text-xs">{imp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-slate-300 text-sm mb-1">
            <strong>Important:</strong> Your VCOS Trust Score is NOT a financial credit score.
          </p>
          <p className="text-slate-400 text-xs">
            It is an internal participation score used only within the VLOOP ecosystem for eligibility
            and access to Future Opportunities. It does not affect your credit rating or banking relationships.
          </p>
        </div>
      </div>
    </div>
  );
}

function ComponentScoreCard({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: React.FC<{ className?: string }>;
}) {
  const colorClass = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-slate-400';

  return (
    <div className="bg-slate-700/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-600 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-slate-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${colorClass}`}>{score}</span>
      </div>
    </div>
  );
}

// ============================================================
// HISTORY TAB
// ============================================================

function HistoryTab({ history }: { history: TrustScoreHistory[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Score History</h2>
        <span className="text-slate-400 text-sm">{history.length} records</span>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {history.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        entry.score_change > 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : entry.score_change < 0
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {entry.score_change > 0 ? '+' : ''}{entry.score_change}
                    </span>
                    <span className="text-white font-medium">
                      {entry.previous_score} → {entry.new_score}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{entry.change_reason || entry.change_type}</span>
                  <span className="text-slate-500 text-xs">AI: {entry.ai_confidence}%</span>
                </div>
                {entry.previous_level !== entry.new_level && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 rounded bg-slate-600 text-slate-300 capitalize">{entry.previous_level}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 capitalize">{entry.new_level}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// FACTORS TAB
// ============================================================

function FactorsTab({ summary }: { summary: TrustScoreSummary }) {
  const factors = [
    { name: 'Purchase Consistency', score: summary.component_scores.purchase_consistency, weight: 1.5, positive: true },
    { name: 'Care Club Contributions', score: summary.component_scores.careclub_frequency, weight: 2.0, positive: true },
    { name: 'SmartCode Participation', score: summary.component_scores.smartcode_participation, weight: 1.5, positive: true },
    { name: 'Weekly Challenge', score: summary.component_scores.weekly_challenge, weight: 1.2, positive: true },
    { name: 'Wallet Activity', score: summary.component_scores.wallet_activity, weight: 1.0, positive: true },
    { name: 'Account Age', score: summary.component_scores.account_age, weight: 0.8, positive: true },
    { name: 'Identity Verification', score: summary.component_scores.identity_verification, weight: 2.5, positive: true },
    { name: 'Profile Completion', score: summary.component_scores.profile_completion, weight: 1.0, positive: true },
    { name: 'Community Participation', score: summary.component_scores.community_participation, weight: 1.2, positive: true },
    { name: 'FOE Participation', score: summary.component_scores.foe_participation, weight: 1.8, positive: true },
  ];

  const negativeFactors = [
    { name: 'Risk Score', score: summary.risk_score, weight: 2.0 },
    { name: 'Fraud Risk', score: summary.fraud_risk_score, weight: 3.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Positive Factors */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          Positive Factors
        </h3>
        <div className="space-y-3">
          {factors.map((factor, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-sm">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">Weight: {factor.weight}x</span>
                    <span className="text-emerald-400 font-semibold">{factor.score}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Negative Factors */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5 text-red-400" />
          Risk Factors
        </h3>
        <div className="space-y-3">
          {negativeFactors.map((factor, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-sm">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">Weight: {factor.weight}x</span>
                    <span className={`${factor.score < 30 ? 'text-emerald-400' : factor.score < 60 ? 'text-amber-400' : 'text-red-400'} font-semibold`}>
                      {factor.score}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${factor.score < 30 ? 'bg-emerald-500' : factor.score < 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-4">
          Lower risk scores are better. High risk or fraud scores can reduce your trust score.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// IMPROVEMENTS TAB
// ============================================================

function ImprovementsTab({
  improvements,
  onNavigate,
}: {
  improvements: TrustImprovement[];
  onNavigate: (page: string) => void;
}) {
  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    verification: Shield,
    profile: Users,
    activity: Activity,
    participation: Zap,
    community: Heart,
  };

  const categoryColors: Record<string, string> = {
    verification: 'bg-blue-500/20 text-blue-400',
    profile: 'bg-purple-500/20 text-purple-400',
    activity: 'bg-emerald-500/20 text-emerald-400',
    participation: 'bg-amber-500/20 text-amber-400',
    community: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Ways to Improve Your Score</h2>
        <span className="text-slate-400 text-sm">{improvements.length} suggestions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {improvements.map((imp) => {
          const Icon = categoryIcons[imp.category] || Activity;
          return (
            <div
              key={imp.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => imp.action_link && onNavigate(imp.action_link.replace('/', ''))}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[imp.category]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium">{imp.title}</h3>
                    <span className="text-emerald-400 text-sm font-bold">+{imp.potential_points} pts</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{imp.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs capitalize">
                      {imp.category}
                    </span>
                    {imp.action_link && (
                      <span className="text-indigo-400 text-xs flex items-center gap-1">
                        Start Now <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
