import { useState } from 'react';
import {
  Shield, Award, Smartphone, Monitor, AlertTriangle, Activity, ShieldCheck,
  HeartPulse, Lock, UserCheck, ShoppingBag, KeyRound, Wallet, Zap, Clock,
  TrendingUp, Headphones, Store, Rocket, Copy, LogIn, QrCode, Laptop,
  ShieldAlert, Settings, Sparkles, Bell, Server, AlertCircle, ChevronRight,
  ArrowLeft, CheckCircle2, XCircle, LogOut, Eye, RefreshCw,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  securityMetrics, trustHistory, trustTips, trustBenefits, devices,
  fraudAlerts, timelineEvents, aiSuggestions, notifications,
  getTrustLevel, getTrustColor, getRiskColor, getFraudStatusColor,
  type RiskLevel, type FraudStatus,
} from '../lib/securityMockData';

type Props = { onNavigate: (page: string) => void };
type TabId = 'dashboard' | 'trust' | 'devices' | 'fraud' | 'timeline' | 'ai' | 'notifications';

const iconMap: Record<string, any> = {
  Shield, Award, Smartphone, Monitor, AlertTriangle, Activity, ShieldCheck,
  HeartPulse, Lock, UserCheck, ShoppingBag, KeyRound, Wallet, Zap, Clock,
  TrendingUp, Headphones, Store, Rocket, Copy, LogIn, QrCode, Laptop,
  ShieldAlert, Settings, Sparkles, Bell, Server, AlertCircle,
};

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Shield },
  { id: 'trust', label: 'Trust Score', icon: Award },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'fraud', label: 'Fraud Monitor', icon: AlertTriangle },
  { id: 'timeline', label: 'Timeline', icon: Activity },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SecurityCenterPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('home')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">AI Security & Trust Center</h1>
              <p className="text-xs text-gray-500">Phase 14 · Enterprise Security Dashboard</p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white rounded-2xl shadow-card p-2 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-vloop-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'trust' && <TrustTab />}
        {activeTab === 'devices' && <DevicesTab />}
        {activeTab === 'fraud' && <FraudTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'ai' && <AITab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
}

// ============================================================
// 1. SECURITY DASHBOARD
// ============================================================
function DashboardTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top banner */}
      <div className="bg-gradient-to-br from-vloop-600 to-vloop-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-success-300" />
              <span className="text-sm text-white/80">Security Status</span>
            </div>
            <h2 className="text-3xl font-bold font-display">All Systems Protected</h2>
            <p className="text-white/70 text-sm mt-1">AI security engine is actively monitoring your account.</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold font-display">92</div>
            <div className="text-sm text-white/70">Security Score</div>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {securityMetrics.map((m) => {
          const Icon = iconMap[m.icon] || Shield;
          const colorClasses: Record<string, string> = {
            vloop: 'bg-vloop-50 text-vloop-600',
            gold: 'bg-gold-50 text-gold-600',
            success: 'bg-success-50 text-success-600',
            error: 'bg-error-50 text-error-600',
          };
          return (
            <div key={m.id} className="bg-white rounded-2xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[m.color] || colorClasses.vloop}`}>
                  <Icon size={20} />
                </div>
                {m.trend && m.trend !== 'stable' && (
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${m.trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                    {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {m.trendValue}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 font-display">{m.value}</div>
              <div className="text-sm font-medium text-gray-700">{m.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Quick stats row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Activity size={16} className="text-vloop-600" /> Recent Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Logins today</span><span className="font-semibold text-gray-900">3</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Transactions</span><span className="font-semibold text-gray-900">12</span></div>
            <div className="flex justify-between"><span className="text-gray-500">SmartCodes</span><span className="font-semibold text-gray-900">5</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><ShieldCheck size={16} className="text-success-600" /> Protections</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-500" /><span className="text-gray-600">2FA Enabled</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-500" /><span className="text-gray-600">Biometric Login</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-500" /><span className="text-gray-600">Fraud Monitor Active</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-error-500" /> Alerts</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Active</span><span className="font-semibold text-error-600">1</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Monitoring</span><span className="font-semibold text-amber-600">2</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Resolved</span><span className="font-semibold text-success-600">3</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 2. TRUST SCORE CENTER
// ============================================================
function TrustTab() {
  const score = 87;
  const level = getTrustLevel(score);
  const levelColor = getTrustColor(level);
  const maxScore = 100;
  const progress = (score / maxScore) * 100;
  const nextLevel = level === 'Bronze' ? 'Silver' : level === 'Silver' ? 'Gold' : level === 'Gold' ? 'Platinum' : null;
  const nextThreshold = level === 'Bronze' ? 60 : level === 'Silver' ? 75 : level === 'Gold' ? 90 : 100;
  const pointsToNext = Math.max(0, nextThreshold - score);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Trust score hero */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award size={18} className="text-gold-500" /> Current Trust Score</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#trustGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(progress / 100) * 327} 327`} />
                <defs>
                  <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 font-display">{score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${levelColor} text-white text-sm font-bold mb-2`}>
                <Award size={14} /> {level} Tier
              </div>
              <p className="text-sm text-gray-500 mb-1">Trend: <span className="text-success-600 font-semibold flex items-center gap-0.5 inline-flex"><TrendingUp size={12} /> +5 this month</span></p>
              {nextLevel && (
                <p className="text-xs text-gray-400">{pointsToNext} points to {nextLevel}</p>
              )}
            </div>
          </div>
        </div>

        {/* Trust history chart */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={18} className="text-vloop-600" /> Trust History</h2>
          <TrustChart />
        </div>
      </div>

      {/* Improvement tips */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-vloop-600" /> Trust Improvement Tips</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {trustTips.map((tip) => {
            const Icon = iconMap[tip.icon] || CheckCircle2;
            return (
              <div key={tip.id} className="flex items-center gap-3 p-3 rounded-xl bg-vloop-50 border border-vloop-100">
                <div className="w-9 h-9 rounded-lg bg-vloop-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-vloop-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{tip.tip}</div>
                </div>
                <span className="text-xs font-bold text-success-600 bg-success-50 px-2 py-1 rounded-lg whitespace-nowrap">{tip.impact}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits unlocked */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-success-600" /> Benefits Unlocked</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trustBenefits.map((b) => {
            const Icon = iconMap[b.icon] || Award;
            return (
              <div key={b.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${b.unlocked ? 'bg-success-50 border-success-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${b.unlocked ? 'bg-success-100' : 'bg-gray-200'}`}>
                  <Icon size={18} className={b.unlocked ? 'text-success-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1 text-sm font-medium text-gray-700">{b.label}</div>
                {b.unlocked ? <CheckCircle2 size={18} className="text-success-500" /> : <XCircle size={18} className="text-gray-400" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TrustChart() {
  const max = 100;
  const min = 50;
  const range = max - min;
  const chartH = 140;
  const points = trustHistory.map((p, i) => {
    const x = (i / (trustHistory.length - 1)) * 100;
    const y = chartH - ((p.score - min) / range) * chartH;
    return { x, y, ...p };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 ${chartH} L 0 ${chartH} Z`;

  return (
    <div>
      <svg viewBox={`0 0 100 ${chartH}`} className="w-full" preserveAspectRatio="none" style={{ height: chartH }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#d97706" strokeWidth="1.5" />
        {points.map((p) => (
          <circle key={p.month} cx={p.x} cy={p.y} r="1.5" fill="#d97706" />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {trustHistory.map((p) => (
          <div key={p.month} className="text-center">
            <div className="text-xs font-semibold text-gray-700">{p.score}</div>
            <div className="text-[10px] text-gray-400">{p.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 3. DEVICE MANAGER
// ============================================================
function DevicesTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Smartphone size={18} className="text-vloop-600" /> Device Manager</h2>
        <div className="space-y-3">
          {devices.map((d) => {
            const Icon = iconMap[d.icon] || Smartphone;
            return (
              <div key={d.id} className={`p-4 rounded-xl border-2 transition-colors ${d.isCurrent ? 'border-vloop-300 bg-vloop-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${d.isCurrent ? 'bg-vloop-100' : 'bg-gray-100'}`}>
                    <Icon size={20} className={d.isCurrent ? 'text-vloop-600' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{d.name}</span>
                      {d.isCurrent && <span className="px-2 py-0.5 bg-vloop-600 text-white text-[10px] font-bold rounded">CURRENT</span>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <div><span className="text-gray-400">Browser:</span> {d.browser}</div>
                      <div><span className="text-gray-400">OS:</span> {d.os}</div>
                      <div><span className="text-gray-400">Login:</span> {d.loginTime}</div>
                      <div><span className="text-gray-400">Location:</span> {d.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 text-xs font-semibold text-vloop-700 bg-vloop-50 rounded-lg hover:bg-vloop-100 transition-colors flex items-center gap-1">
                      <Eye size={14} /> View
                    </button>
                    {!d.isCurrent && (
                      <button className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1">
                        <LogOut size={14} /> Logout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="w-full mt-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <LogOut size={16} /> Logout All Other Devices
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 4. FRAUD MONITOR
// ============================================================
function FraudTab() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2"><AlertTriangle size={20} className="text-error-500" /> Fraud Monitor</h2>
        <button className="px-3 py-1.5 text-sm font-medium text-vloop-700 bg-vloop-50 rounded-lg hover:bg-vloop-100 transition-colors flex items-center gap-1.5">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {fraudAlerts.map((alert) => {
          const Icon = iconMap[alert.icon] || AlertTriangle;
          const risk = getRiskColor(alert.riskLevel as RiskLevel);
          const status = getFraudStatusColor(alert.status as FraudStatus);
          return (
            <div key={alert.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${risk.bg}`}>
                  <Icon size={20} className={risk.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{alert.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${risk.bg} ${risk.text} border ${risk.border}`}>{risk.label}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${status.bg} ${status.text}`}>{status.label}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-0.5"><Clock size={10} /> {alert.time}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Recommendation</div>
                <p className="text-sm text-gray-700">{alert.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 5. SECURITY TIMELINE
// ============================================================
function TimelineTab() {
  const typeColors: Record<string, string> = {
    login: 'bg-vloop-100 text-vloop-600',
    password: 'bg-amber-100 text-amber-600',
    wallet: 'bg-gold-100 text-gold-600',
    smartcode: 'bg-purple-100 text-purple-600',
    merchant: 'bg-success-100 text-success-600',
    admin: 'bg-gray-200 text-gray-600',
    alert: 'bg-red-100 text-red-600',
  };

  return (
    <div className="animate-fade-in">
      <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><Activity size={20} className="text-vloop-600" /> Security Timeline</h2>
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
          <div className="space-y-5">
            {timelineEvents.map((event) => {
              const Icon = iconMap[event.icon] || Activity;
              return (
                <div key={event.id} className="relative flex items-start gap-4">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColors[event.type] || 'bg-gray-100 text-gray-500'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="font-semibold text-sm text-gray-900">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.desc}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-0.5"><Clock size={10} /> {event.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 6. AI ASSISTANT
// ============================================================
function AITab() {
  const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
    shopping: { label: 'Shopping', color: 'text-vloop-600', bg: 'bg-vloop-50' },
    security: { label: 'Security', color: 'text-error-600', bg: 'bg-error-50' },
    trust: { label: 'Trust', color: 'text-gold-600', bg: 'bg-gold-50' },
    reminder: { label: 'Reminder', color: 'text-success-600', bg: 'bg-success-50' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI header */}
      <div className="bg-gradient-to-br from-vloop-600 to-vloop-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">AI Security Assistant</h2>
            <p className="text-white/70 text-sm">Personalized insights for shopping, security, and trust</p>
          </div>
        </div>
      </div>

      {/* Suggestion cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {aiSuggestions.map((s) => {
          const Icon = iconMap[s.icon] || Sparkles;
          const cat = categoryConfig[s.category];
          return (
            <div key={s.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
                  <Icon size={20} className={cat.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${cat.bg} ${cat.color}`}>{cat.label}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{s.desc}</p>
              <button className="mt-3 text-xs font-semibold text-vloop-600 hover:text-vloop-700 flex items-center gap-0.5">
                Learn more <ChevronRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 7. NOTIFICATION CENTER
// ============================================================
function NotificationsTab() {
  const [filter, setFilter] = useState<string>('all');
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'security', label: 'Security' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'merchant', label: 'Merchant' },
    { id: 'system', label: 'System' },
    { id: 'ai', label: 'AI' },
  ];
  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.category === filter);
  const catColors: Record<string, string> = {
    security: 'bg-red-50 text-red-600',
    wallet: 'bg-gold-50 text-gold-600',
    merchant: 'bg-success-50 text-success-600',
    system: 'bg-vloop-50 text-vloop-600',
    ai: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Bell size={20} className="text-vloop-600" /> Notification Center</h2>
        <button className="text-sm text-vloop-600 font-medium hover:underline">Mark all as read</button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === c.id ? 'bg-vloop-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {filtered.map((n) => {
          const Icon = iconMap[n.icon] || Bell;
          return (
            <div key={n.id} className={`bg-white rounded-xl shadow-card p-4 flex items-start gap-3 ${!n.read ? 'border-l-4 border-vloop-500' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catColors[n.category] || 'bg-gray-100 text-gray-500'}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-vloop-500" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{n.desc}</p>
                <div className="text-xs text-gray-400 mt-1">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
