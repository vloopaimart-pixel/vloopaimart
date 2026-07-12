import { useState } from 'react';
import {
  QrCode, Scan, Upload, CheckCircle, Clock, XCircle, Copy, Calendar,
  Award, TrendingUp, Zap, Sparkles, Bell, ChevronRight, Eye,
  Camera, FileImage, ExternalLink, Users, Trophy, Gift, Shield,
  Target, Timer, BarChart3, ArrowUpRight, RefreshCw, AlertTriangle
} from 'lucide-react';
import {
  getMockSmartCodeStats,
  getMockSmartCodeHistory,
  getMockWeeklyChallenge,
  getMockRewardPreview,
  getMockSmartCodeNotifications,
  getMockVerificationResult,
  formatPoints,
  formatDate,
  formatDateTime,
  getStatusColor,
  getTimeRemaining,
  SMARTCODE_CATEGORIES,
  type SmartCodeStats,
  type SmartCodeEntry,
  type WeeklyChallenge,
  type SmartCodeRewardPreview,
  type SmartCodeNotification,
  type SmartCodeVerificationResult,
} from '../lib/SmartCodeEngineFoundation';

type SmartCodeEnginePageProps = {
  onNavigate: (page: string) => void;
};

export default function SmartCodeEnginePage({ onNavigate }: SmartCodeEnginePageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submit' | 'history' | 'challenge'>('dashboard');

  const stats = getMockSmartCodeStats();
  const challenge = getMockWeeklyChallenge();
  const history = getMockSmartCodeHistory();
  const notifications = getMockSmartCodeNotifications();
  const rewardPreview = getMockRewardPreview();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-orange-600/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <QrCode className="w-7 h-7 text-indigo-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">SmartCode Engine</h1>
              <p className="text-indigo-200 text-sm">Scan, Submit, Earn Rewards</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <QuickStat value={formatPoints(stats.total_submitted)} label="Total Submitted" icon={QrCode} />
            <QuickStat value={formatPoints(stats.verified_codes)} label="Verified" icon={CheckCircle} />
            <QuickStat value={stats.pending_verification} label="Pending" icon={Clock} />
            <QuickStat value={stats.weekly_eligible_entries} label="Challenge Entries" icon={Trophy} />
            <QuickStat value={formatPoints(stats.total_points_earned)} label="Total Points" icon={Sparkles} />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-16 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto hide-scrollbar">
            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={BarChart3} label="Dashboard" />
            <TabButton active={activeTab === 'submit'} onClick={() => setActiveTab('submit')} icon={Scan} label="Submit Code" />
            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={Calendar} label="History" />
            <TabButton active={activeTab === 'challenge'} onClick={() => setActiveTab('challenge')} icon={Trophy} label="Challenge" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardSection stats={stats} notifications={notifications} history={history} challenge={challenge} rewardPreview={rewardPreview} />
        )}
        {activeTab === 'submit' && (
          <SubmitSection />
        )}
        {activeTab === 'history' && (
          <HistorySection history={history} />
        )}
        {activeTab === 'challenge' && (
          <ChallengeSection challenge={challenge} />
        )}
      </main>
    </div>
  );
}

// ============================================================
// TAB COMPONENTS
// ============================================================

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function QuickStat({
  value,
  label,
  icon: Icon,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-indigo-200" />
        <span className="text-xs text-indigo-200">{label}</span>
      </div>
      <div className="text-lg md:text-xl font-bold">{value}</div>
    </div>
  );
}

// ============================================================
// DASHBOARD SECTION
// ============================================================

function DashboardSection({
  stats,
  notifications,
  history,
  challenge,
  rewardPreview,
}: {
  stats: SmartCodeStats;
  notifications: SmartCodeNotification[];
  history: SmartCodeEntry[];
  challenge: WeeklyChallenge;
  rewardPreview: SmartCodeRewardPreview;
}) {
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        <StatusCard title="Verified" value={stats.verified_codes} icon={CheckCircle} color="from-emerald-500 to-teal-600" percentage={Math.round((stats.verified_codes / stats.total_submitted) * 100)} />
        <StatusCard title="Pending" value={stats.pending_verification} icon={Clock} color="from-amber-500 to-orange-600" />
        <StatusCard title="Invalid" value={stats.invalid_codes} icon={XCircle} color="from-red-500 to-rose-600" />
        <StatusCard title="Duplicates" value={stats.duplicate_codes} icon={Copy} color="from-orange-500 to-amber-600" />
        <StatusCard title="Expired" value={stats.expired_codes} icon={Calendar} color="from-gray-500 to-slate-600" />
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Recent Activity
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-xl ${!notif.read ? 'bg-indigo-50' : 'bg-gray-50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notif.type === 'verification_complete' ? 'bg-emerald-100 text-emerald-600' :
                  notif.type === 'submission_success' ? 'bg-blue-100 text-blue-600' :
                  notif.type === 'reward_credited' ? 'bg-amber-100 text-amber-600' :
                  notif.type === 'challenge_update' ? 'bg-violet-100 text-violet-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {notif.type === 'verification_complete' ? <CheckCircle className="w-4 h-4" /> :
                   notif.type === 'submission_success' ? <QrCode className="w-4 h-4" /> :
                   notif.type === 'reward_credited' ? <Gift className="w-4 h-4" /> :
                   <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{notif.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{notif.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDateTime(notif.created_at)}</div>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Reward Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-amber-500" />
            Reward Preview
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Expected SmartPoints</div>
              <div className="text-3xl font-bold">{rewardPreview.expected_smartpoints} SP</div>
              {rewardPreview.bonus_eligibility && (
                <div className="flex items-center gap-2 mt-2 text-xs bg-white/20 rounded-full px-2 py-1 inline-flex">
                  <Sparkles className="w-3 h-3" />
                  +{rewardPreview.bonus_percentage}% Bonus Eligible
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Trust Score Impact</div>
                <div className="text-lg font-bold text-emerald-600">+{rewardPreview.trust_score_impact}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Current Score</div>
                <div className="text-lg font-bold text-gray-900">{rewardPreview.current_trust_score}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Streak Multiplier</div>
                <div className="text-lg font-bold text-violet-600">x{rewardPreview.streak_multiplier}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500">Reward Tier</div>
                <div className="text-lg font-bold text-amber-600 capitalize">{rewardPreview.reward_tier}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Overview */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Weekly Challenge
            </h3>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="mb-4">
            <div className="text-lg font-semibold">{challenge.name}</div>
            <div className="text-sm text-violet-200">{challenge.time_remaining}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-violet-200">Reward Pool</div>
              <div className="text-lg font-bold">{formatPoints(challenge.reward_pool)} SP</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-violet-200">Your Entries</div>
              <div className="text-lg font-bold">{challenge.leaderboard.find(e => e.is_current_user)?.entries_count || 0}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-violet-200">Your Rank: #{challenge.leaderboard.find(e => e.is_current_user)?.rank || '-'}</span>
            <button className="flex items-center gap-1 text-white hover:underline">
              View Leaderboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {SMARTCODE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
              <div className="text-xs text-gray-500">{cat.merchant_count} merchants</div>
              <div className="text-xs text-indigo-600 mt-1">{cat.points_multiplier}x points</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  value,
  icon: Icon,
  color,
  percentage,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  percentage?: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {percentage !== undefined && (
          <span className="text-xs text-gray-500">{percentage}%</span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  );
}

// ============================================================
// SUBMIT SECTION
// ============================================================

function SubmitSection() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<SmartCodeVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!code.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const verificationResult = getMockVerificationResult(code.toUpperCase());
      setResult(verificationResult);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Submit Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-indigo-600" />
          Submit SmartCode
        </h3>

        <div className="space-y-4">
          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter SmartCode
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VLP-2024-XXXXXXXXXX"
              className="w-full px-4 py-3 text-lg font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={!code.trim() || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Submit Code
                </>
              )}
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              <Camera className="w-5 h-5" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              <FileImage className="w-5 h-5" />
              <span className="hidden sm:inline">OCR Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result */}
      {result && (
        <VerificationResultCard result={result} onReset={() => { setResult(null); setCode(''); }} />
      )}

      {/* Tips */}
      {!result && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Tips for Successful Scanning
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              Ensure the QR code or barcode is clearly visible
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              SmartCodes from verified merchants earn more points
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              Check code expiration before submission
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              Each unique SmartCode can only be submitted once
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

function VerificationResultCard({
  result,
  onReset,
}: {
  result: SmartCodeVerificationResult;
  onReset: () => void;
}) {
  const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
    verified: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    invalid: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    duplicate: { icon: Copy, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    expired: { icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  };

  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-2xl p-6`}>
      {/* Status Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>
        <div>
          <div className={`text-xl font-bold ${config.color}`}>
            {result.message}
          </div>
          <div className="text-sm text-gray-600">
            Code: <span className="font-mono">{result.code}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="text-sm text-gray-600">{result.details}</div>
      </div>

      {/* Reward Info for Verified */}
      {result.status === 'verified' && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-gray-900">{result.reward_points}</div>
            <div className="text-xs text-gray-500">SmartPoints</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-gray-900">+{result.bonus_points}</div>
            <div className="text-xs text-gray-500">Bonus</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
            <div className="text-xl font-bold text-gray-900">+{result.trust_score_impact}</div>
            <div className="text-xs text-gray-500">Trust Score</div>
          </div>
        </div>
      )}

      {/* Merchant Info */}
      {result.merchant_name && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Merchant</div>
            <div className="font-medium text-gray-900">{result.merchant_name}</div>
          </div>
          {result.product_name && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Product</div>
              <div className="font-medium text-gray-900">{result.product_name}</div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onReset}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
      >
        Submit Another Code
      </button>
    </div>
  );
}

// ============================================================
// HISTORY SECTION
// ============================================================

function HistorySection({ history }: { history: SmartCodeEntry[] }) {
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'invalid' | 'duplicate' | 'expired'>('all');

  const filteredHistory = history.filter((entry) => {
    if (filter === 'all') return true;
    return entry.status === filter;
  });

  const statusCounts = {
    all: history.length,
    verified: history.filter(e => e.status === 'verified').length,
    pending: history.filter(e => e.status === 'pending').length,
    invalid: history.filter(e => e.status === 'invalid').length,
    duplicate: history.filter(e => e.status === 'duplicate').length,
    expired: history.filter(e => e.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'verified', 'pending', 'invalid', 'duplicate', 'expired'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === status
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Merchant</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reward</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredHistory.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-indigo-600">{entry.code}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(entry.submitted_at)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{entry.merchant_name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                    {entry.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-amber-600">
                    {entry.reward_points + entry.bonus_points} SP
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {filteredHistory.map((entry) => (
          <HistoryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ entry }: { entry: SmartCodeEntry }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-mono text-sm text-indigo-600">{entry.code}</span>
          <div className="text-xs text-gray-500 mt-1">{formatDateTime(entry.submitted_at)}</div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
          {entry.status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900">{entry.merchant_name}</div>
          <div className="text-xs text-gray-500">{entry.category}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-amber-600">{entry.reward_points + entry.bonus_points} SP</div>
          {entry.bonus_points > 0 && (
            <div className="text-xs text-emerald-600">+{entry.bonus_points} bonus</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHALLENGE SECTION
// ============================================================

function ChallengeSection({ challenge }: { challenge: WeeklyChallenge }) {
  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6" />
            <span className="text-sm font-medium text-violet-200">WEEKLY CHALLENGE</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{challenge.name}</h2>
          <p className="text-violet-200 mb-4">{challenge.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Timer className="w-5 h-5" />
              <span className="font-semibold">{challenge.time_remaining}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2 text-sm">
              Sponsored by {challenge.sponsor_name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">{formatPoints(challenge.reward_pool)}</div>
              <div className="text-sm text-violet-200">Reward Pool</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">x{challenge.bonus_multiplier}</div>
              <div className="text-sm text-violet-200">Bonus Multiplier</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">{challenge.eligible_entries}</div>
              <div className="text-sm text-violet-200">Total Entries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Leaderboard
          </h3>
          <span className="text-sm text-gray-500">Max {challenge.max_entries_per_user} entries/user</span>
        </div>

        <div className="space-y-3">
          {challenge.leaderboard.map((entry) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                entry.is_current_user ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                entry.rank === 1 ? 'bg-amber-100 text-amber-700' :
                entry.rank === 2 ? 'bg-gray-200 text-gray-700' :
                entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {entry.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${entry.is_current_user ? 'text-indigo-700' : 'text-gray-900'}`}>
                    {entry.user_name}
                  </span>
                  {entry.is_current_user && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{entry.entries_count} entries</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-600">{formatPoints(entry.total_points)} SP</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Progress */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-600" />
          Your Challenge Progress
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="text-xs text-gray-500">Total Entries</div>
            <div className="text-2xl font-bold text-gray-900">38</div>
            <div className="text-xs text-gray-500">of {challenge.max_entries_per_user} max</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-xs text-gray-500">Points Earned</div>
            <div className="text-2xl font-bold text-amber-600">3,800</div>
            <div className="text-xs text-gray-500">SmartPoints</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-xs text-gray-500">Current Rank</div>
            <div className="text-2xl font-bold text-indigo-600">#3</div>
            <div className="text-xs text-gray-500">of {challenge.leaderboard.length * 100}</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-xs text-gray-500">Est. Reward</div>
            <div className="text-2xl font-bold text-emerald-600">~4,500</div>
            <div className="text-xs text-gray-500">at current rank</div>
          </div>
        </div>
      </div>
    </div>
  );
}
