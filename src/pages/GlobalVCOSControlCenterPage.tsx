import { useState } from 'react';
import {
  Activity, Globe, Building2, Shield, AlertTriangle, TrendingUp,
  Users, Bot, FileText, Bell, HardDrive, BarChart3, Lock,
  BadgeCheck, CheckCircle, AlertCircle, Clock, Zap, Eye,
  MapPin, Target, Award, PieChart, Settings, Server, Database,
  Mail, BookOpen, CircleDollarSign, Heart, Package, Wallet,
  RefreshCw, Download, Wifi, WifiOff, Cpu, FileCheck, Info, Gift,
} from 'lucide-react';
import {
  EXECUTIVE_DASHBOARD,
  COUNTRY_OPERATIONS,
  REGION_OPERATIONS,
  ECOSYSTEM_HEALTH,
  SMARTCODE_ANALYTICS,
  BUSINESS_INTELLIGENCE,
  CUSTOMER_INTELLIGENCE,
  AI_MONITORING,
  COMPLIANCE_CENTER,
  FRAUD_SECURITY_CENTER,
  SYSTEM_AUDIT,
  NOTIFICATION_HUB,
  DISASTER_RECOVERY,
  EXECUTIVE_REPORTS,
  LEGAL_GREEN_ZONE,
  CONTROL_CENTER_SUMMARY,
  formatCurrency,
  formatNumber,
  getStatusColor,
  getHealthBadge,
} from '../lib/globalVCOSControlCenterMockData';

type GlobalVCOSControlCenterPageProps = {
  onNavigate: (page: string) => void;
};

export default function GlobalVCOSControlCenterPage({ onNavigate }: GlobalVCOSControlCenterPageProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'executive', name: 'Executive', icon: BarChart3 },
    { id: 'countries', name: 'Countries', icon: Globe },
    { id: 'regions', name: 'Regions', icon: MapPin },
    { id: 'health', name: 'Health', icon: Server },
    { id: 'smartcode', name: 'SmartCode', icon: Target },
    { id: 'business', name: 'Business AI', icon: TrendingUp },
    { id: 'customer', name: 'Customer AI', icon: Users },
    { id: 'ai-monitoring', name: 'AI Monitoring', icon: Bot },
    { id: 'compliance', name: 'Compliance', icon: FileCheck },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'audit', name: 'Audit', icon: FileText },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'disaster', name: 'Disaster', icon: HardDrive },
    { id: 'reports', name: 'Reports', icon: Download },
    { id: 'legal', name: 'Legal', icon: Lock },
  ];

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Activity className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 30 • Global Control Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>Global VCOS™ Control Center</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Executive operations platform for monitoring, administration, analytics, compliance, AI operations, and ecosystem health across VLOOP.
          </p>
        </section>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-vloop-900'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' } : {}}
              >
                <Icon size={14} />
                <span className="hidden md:inline">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <div>
                  <div className="font-semibold text-white uppercase">System {CONTROL_CENTER_SUMMARY.status}</div>
                  <div className="text-xs text-white/50">Last updated: {CONTROL_CENTER_SUMMARY.lastUpdated}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-red-400 font-bold">{CONTROL_CENTER_SUMMARY.alerts.critical}</div>
                  <div className="text-xs text-white/50">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">{CONTROL_CENTER_SUMMARY.alerts.warning}</div>
                  <div className="text-xs text-white/50">Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">{CONTROL_CENTER_SUMMARY.alerts.info}</div>
                  <div className="text-xs text-white/50">Info</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <CircleDollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(EXECUTIVE_DASHBOARD.globalRevenue.thisMonth)}</div>
                <div className="text-xs text-white/50">Revenue This Month</div>
                <div className="text-xs" style={{ color: '#22c55e' }}>{EXECUTIVE_DASHBOARD.globalRevenue.growth}</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-xl font-bold text-white">{formatNumber(EXECUTIVE_DASHBOARD.customerGrowth.active)}</div>
                <div className="text-xs text-white/50">Active Customers</div>
                <div className="text-xs" style={{ color: '#22c55e' }}>{EXECUTIVE_DASHBOARD.customerGrowth.growth}</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Building2 className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{formatNumber(EXECUTIVE_DASHBOARD.partnerGrowth.total)}</div>
                <div className="text-xs text-white/50">Total Partners</div>
                <div className="text-xs" style={{ color: '#22c55e' }}>{EXECUTIVE_DASHBOARD.partnerGrowth.growth}</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Target className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-xl font-bold text-white">{formatNumber(EXECUTIVE_DASHBOARD.weeklyParticipation.participants)}</div>
                <div className="text-xs text-white/50">Weekly Participants</div>
              </div>
            </div>

            {/* Ecosystem Health Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(ECOSYSTEM_HEALTH).slice(0, 8).map(([key, system]) => {
                const health = getHealthBadge(system.status);
                return (
                  <div key={key} className="rounded-xl p-3 flex items-center gap-3" style={{ background: health.bg, border: '1px solid' + health.color + '30' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: health.color }} />
                    <div className="flex-1">
                      <div className="text-xs text-white/50 capitalize">{key}</div>
                      <div className="text-sm font-medium" style={{ color: health.color }}>{system.status}</div>
                    </div>
                    <span className="text-xs text-white/70">{(system as any).uptime}</span>
                  </div>
                );
              })}
            </div>

            {/* Care Impact */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Heart size={18} style={{ color: '#f97316' }} />
                <span className="font-semibold text-white">Care Impact Summary</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: '#f97316' }}>{formatCurrency(EXECUTIVE_DASHBOARD.careImpact.totalContributed)}</div>
                  <div className="text-xs text-white/50">Total Contributed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{formatNumber(EXECUTIVE_DASHBOARD.careImpact.livesImpacted)}</div>
                  <div className="text-xs text-white/50">Lives Impacted</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{formatNumber(EXECUTIVE_DASHBOARD.careImpact.mealsServed)}</div>
                  <div className="text-xs text-white/50">Meals Served</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{formatNumber(EXECUTIVE_DASHBOARD.careImpact.studentsSupported)}</div>
                  <div className="text-xs text-white/50">Students Supported</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Dashboard */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            {/* Revenue */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(26,21,48,0.8))', border: '2px solid #D4AF37' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CircleDollarSign size={24} style={{ color: '#D4AF37' }} />
                  <div>
                    <div className="text-sm text-white/50">Global Revenue</div>
                    <div className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{formatCurrency(EXECUTIVE_DASHBOARD.globalRevenue.total)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{EXECUTIVE_DASHBOARD.globalRevenue.growth}</div>
                  <div className="text-xs text-white/50">vs last year</div>
                </div>
              </div>
              <div className="text-sm text-white/70">This month: {formatCurrency(EXECUTIVE_DASHBOARD.globalRevenue.thisMonth)}</div>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Partner Growth', data: EXECUTIVE_DASHBOARD.partnerGrowth, icon: Building2 },
                { label: 'Customer Growth', data: EXECUTIVE_DASHBOARD.customerGrowth, icon: Users },
                { label: 'Community Growth', data: EXECUTIVE_DASHBOARD.communityGrowth, icon: Heart },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon size={18} style={{ color: '#D4AF37' }} />
                    <span className="font-medium text-white">{item.label}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-white/50">Total:</span> <span className="text-white">{formatNumber((item.data as any).total)}</span></div>
                    {'growth' in item.data && <div className="flex justify-between"><span className="text-white/50">Growth:</span> <span className="text-green-400">{item.data.growth}</span></div>}
                    {'sellers' in item.data && <div className="text-white/70">Sellers: {item.data.sellers} • Services: {item.data.services} • Care: {item.data.careParticipants}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Insurance & Marketplace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={18} style={{ color: '#22c55e' }} />
                  <span className="font-medium text-white">Insurance Statistics</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-white/50">Active Policies:</span> <span className="text-white">{formatNumber(EXECUTIVE_DASHBOARD.insuranceStats.activePolicies)}</span></div>
                  <div><span className="text-white/50">Claims This Month:</span> <span className="text-white">{formatNumber(EXECUTIVE_DASHBOARD.insuranceStats.claimsThisMonth)}</span></div>
                  <div><span className="text-white/50">Pending Claims:</span> <span className="text-yellow-400">{formatNumber(EXECUTIVE_DASHBOARD.insuranceStats.pendingClaims)}</span></div>
                  <div><span className="text-white/50">Payout:</span> <span className="text-white">{formatCurrency(EXECUTIVE_DASHBOARD.insuranceStats.payoutThisMonth)}</span></div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Package size={18} style={{ color: '#00F2FE' }} />
                  <span className="font-medium text-white">Marketplace Activity</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-white/50">Weekly Orders:</span> <span className="text-white">{formatNumber(EXECUTIVE_DASHBOARD.marketplaceActivity.weeklyOrders)}</span></div>
                  <div><span className="text-white/50">Weekly GMV:</span> <span className="text-white">{formatCurrency(EXECUTIVE_DASHBOARD.marketplaceActivity.weeklyGMV)}</span></div>
                  <div className="col-span-2"><span className="text-white/50">Top Category:</span> <span style={{ color: '#00F2FE' }}>{EXECUTIVE_DASHBOARD.marketplaceActivity.topCategory}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Country Operations */}
        {activeTab === 'countries' && (
          <div className="space-y-6">
            {/* Expansion Progress */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <div className="flex items-center gap-3">
                <Globe size={20} style={{ color: '#00F2FE' }} />
                <div>
                  <div className="font-medium text-white">Global Expansion</div>
                  <div className="text-sm text-white/50">Next: {COUNTRY_OPERATIONS.expansionProgress.nextLaunch}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{COUNTRY_OPERATIONS.expansionProgress.activeCountries}</div>
                  <div className="text-xs text-white/50">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{COUNTRY_OPERATIONS.expansionProgress.plannedCountries}</div>
                  <div className="text-xs text-white/50">Planned</div>
                </div>
              </div>
            </div>

            {/* Countries List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COUNTRY_OPERATIONS.countries.map((country) => (
                <div key={country.id} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid' + getStatusColor(country.status) + '40' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-white">{country.name}</div>
                    <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: getStatusColor(country.status) + '20', color: getStatusColor(country.status) }}>
                      {country.status}
                    </span>
                  </div>
                  {country.status === 'active' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-white/50">Revenue:</span> <span className="text-white">{formatCurrency(country.revenue)}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Partners:</span> <span className="text-white">{formatNumber(country.partners)}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Currency:</span> <span style={{ color: '#D4AF37' }}>{country.currency}</span></div>
                      <div className="text-xs text-white/50">Languages: {country.languages.join(', ')}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Region Operations */}
        {activeTab === 'regions' && (
          <div className="space-y-6">
            {/* Regions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REGION_OPERATIONS.regions.map((region) => (
                <div key={region.name} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="font-semibold text-white mb-2">{region.name}</div>
                  <div className="text-xs text-white/50 mb-3">{region.states.join(', ')}</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{region.managers}</div>
                      <div className="text-xs text-white/50">Managers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{formatNumber(region.partners)}</div>
                      <div className="text-xs text-white/50">Partners</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{formatNumber(region.customers)}</div>
                      <div className="text-xs text-white/50">Customers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Cities */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={18} style={{ color: '#00F2FE' }} /> Top Cities
              </h3>
              <div className="space-y-3">
                {REGION_OPERATIONS.topCities.map((city) => (
                  <div key={city.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(0,242,254,0.2)', color: '#00F2FE' }}>
                        {city.name.charAt(0)}
                      </span>
                      <span className="font-medium text-white">{city.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div><span className="text-white/50">Partners:</span> <span className="text-white">{formatNumber(city.partners)}</span></div>
                      <div><span className="text-white/50">Customers:</span> <span className="text-white">{formatNumber(city.customers)}</span></div>
                      <div><span className="text-white/50">Orders:</span> <span className="text-white">{formatNumber(city.orders)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ecosystem Health */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ECOSYSTEM_HEALTH).map(([key, system]) => {
                const health = getHealthBadge(system.status);
                return (
                  <div key={key} className="rounded-xl p-4" style={{ background: health.bg, border: '2px solid ' + health.color + '50' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: health.color }} />
                        <span className="font-semibold text-white capitalize">{key}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: health.color + '20', color: health.color }}>
                        {system.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-white/70">
                      Uptime: {(system as any).uptime} • {(system as any).requests || (system as any).transactions || (system as any).queries || ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SmartCode Analytics */}
        {activeTab === 'smartcode' && (
          <div className="space-y-6">
            {/* Participation Trends */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SMARTCODE_ANALYTICS.participationTrends.map((week) => (
                <div key={week.week} className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="text-xs text-white/50 mb-1">{week.week}</div>
                  <div className="text-lg font-bold text-white">{formatNumber(week.participants)}</div>
                  <div className="text-xs text-white/50">participants</div>
                  <div className="text-sm mt-2" style={{ color: '#D4AF37' }}>{formatNumber(week.submissions)} submissions</div>
                </div>
              ))}
            </div>

            {/* Top Regions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SMARTCODE_ANALYTICS.topRegions.map((region) => (
                <div key={region.region} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
                  <div className="font-medium text-white mb-2">{region.region}</div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/50">Submissions:</span>
                    <span className="text-white">{formatNumber(region.submissions)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Avg Tokens:</span>
                    <span style={{ color: '#D4AF37' }}>{region.avgTokens}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill Verification */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck size={18} style={{ color: '#22c55e' }} />
                <span className="font-semibold text-white">Skill Verification</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-400">{SMARTCODE_ANALYTICS.skillVerification.successRate}</div>
                  <div className="text-xs text-white/50">Success Rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{SMARTCODE_ANALYTICS.skillVerification.averageTime}</div>
                  <div className="text-xs text-white/50">Avg Time</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">{formatNumber(SMARTCODE_ANALYTICS.skillVerification.pendingReviews)}</div>
                  <div className="text-xs text-white/50">Pending</div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl p-3 text-center text-sm text-white/50" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <Info size={14} className="inline mr-2" />{SMARTCODE_ANALYTICS.disclaimer}
            </div>
          </div>
        )}

        {/* Business Intelligence */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            {/* Revenue Trend */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} style={{ color: '#22c55e' }} />
                  <div>
                    <div className="font-semibold text-white">Revenue Trend</div>
                    <div className="text-sm text-white/50">{BUSINESS_INTELLIGENCE.revenueTrends.comparedTo}</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-400">{BUSINESS_INTELLIGENCE.revenueTrends.percentage}</div>
              </div>
              <p className="text-sm text-white/70">{BUSINESS_INTELLIGENCE.revenueTrends.prediction}</p>
            </div>

            {/* Sales Categories */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart size={18} style={{ color: '#D4AF37' }} /> Sales by Category
              </h3>
              <div className="space-y-3">
                {BUSINESS_INTELLIGENCE.salesCategories.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <span className="text-white">{cat.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-white">{formatCurrency(cat.revenue)}</span>
                      <span className="text-green-400">{cat.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Performance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BUSINESS_INTELLIGENCE.partnerPerformance.map((tier) => (
                <div key={tier.tier} className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="font-medium text-white mb-2">{tier.tier}</div>
                  <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{formatNumber(tier.count)}</div>
                  <div className="text-xs text-white/50">partners</div>
                  <div className="text-xs text-white/70 mt-1">Avg: {formatCurrency(tier.avgRevenue)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Intelligence */}
        {activeTab === 'customer' && (
          <div className="space-y-6">
            {/* Active Users */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="text-2xl font-bold text-white">{formatNumber(CUSTOMER_INTELLIGENCE.activeUsers.daily)}</div>
                <div className="text-xs text-white/50">Daily Active</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-2xl font-bold text-white">{formatNumber(CUSTOMER_INTELLIGENCE.activeUsers.weekly)}</div>
                <div className="text-xs text-white/50">Weekly Active</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-2xl font-bold text-white">{formatNumber(CUSTOMER_INTELLIGENCE.activeUsers.monthly)}</div>
                <div className="text-xs text-white/50">Monthly Active</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="text-2xl font-bold text-green-400">{CUSTOMER_INTELLIGENCE.activeUsers.growth}</div>
                <div className="text-xs text-white/50">Growth</div>
              </div>
            </div>

            {/* Retention */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h4 className="font-semibold text-white mb-3">Retention Rates</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div><span className="text-white text-lg font-bold">{CUSTOMER_INTELLIGENCE.retention.day1}</span><div className="text-xs text-white/50">Day 1</div></div>
                <div><span className="text-white text-lg font-bold">{CUSTOMER_INTELLIGENCE.retention.day7}</span><div className="text-xs text-white/50">Day 7</div></div>
                <div><span className="text-white text-lg font-bold">{CUSTOMER_INTELLIGENCE.retention.day30}</span><div className="text-xs text-white/50">Day 30</div></div>
                <div><span className="text-white text-lg font-bold">{CUSTOMER_INTELLIGENCE.retention.day90}</span><div className="text-xs text-white/50">Day 90</div></div>
              </div>
            </div>

            {/* Wallet Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="flex items-center gap-2 mb-2"><Wallet size={16} style={{ color: '#00F2FE' }} /><span className="text-white font-medium">Wallet Usage</span></div>
                <div className="text-lg font-bold" style={{ color: '#00F2FE' }}>{formatCurrency(CUSTOMER_INTELLIGENCE.walletUsage.balance)}</div>
                <div className="text-xs text-white/50">Total balance • {formatNumber(CUSTOMER_INTELLIGENCE.walletUsage.transactions)} txns</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="flex items-center gap-2 mb-2"><Gift size={16} style={{ color: '#D4AF37' }} /><span className="text-white font-medium">Benefit Adoption</span></div>
                <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{formatNumber(CUSTOMER_INTELLIGENCE.benefitAdoption.active)}</div>
                <div className="text-xs text-white/50">Active benefits • {formatNumber(CUSTOMER_INTELLIGENCE.benefitAdoption.pendingRelease)} pending</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#22c55e' }} /><span className="text-white font-medium">Protection</span></div>
                <div className="text-lg font-bold text-green-400">{formatNumber(CUSTOMER_INTELLIGENCE.protectionActivation.active)}</div>
                <div className="text-xs text-white/50">Active • {formatNumber(CUSTOMER_INTELLIGENCE.protectionActivation.expiringSoon)} expiring</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Monitoring */}
        {activeTab === 'ai-monitoring' && (
          <div className="space-y-6">
            {/* AI Requests */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="text-2xl font-bold text-white">{formatNumber(AI_MONITORING.aiRequests.total)}</div>
                <div className="text-xs text-white/50">Total Requests</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-2xl font-bold text-green-400">{AI_MONITORING.aiRequests.successRate}</div>
                <div className="text-xs text-white/50">Success Rate</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-2xl font-bold text-white">{AI_MONITORING.aiRequests.avgResponseTime}</div>
                <div className="text-xs text-white/50">Avg Response</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="text-2xl font-bold text-white">{AI_MONITORING.voiceUsage.queries.toLocaleString()}</div>
                <div className="text-xs text-white/50">Voice Queries</div>
              </div>
            </div>

            {/* Response Quality */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><Zap size={16} style={{ color: '#D4AF37' }} /> Response Quality</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center"><div className="text-xl font-bold text-green-400">{AI_MONITORING.responseQuality.excellent}</div><div className="text-xs text-white/50">Excellent</div></div>
                <div className="text-center"><div className="text-xl font-bold text-blue-400">{AI_MONITORING.responseQuality.good}</div><div className="text-xs text-white/50">Good</div></div>
                <div className="text-center"><div className="text-xl font-bold text-yellow-400">{AI_MONITORING.responseQuality.needsWork}</div><div className="text-xs text-white/50">Needs Work</div></div>
              </div>
            </div>

            {/* LLM Health */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-3">
                <Cpu size={20} style={{ color: '#22c55e' }} />
                <div>
                  <div className="font-medium text-white">LLM Health</div>
                  <div className="text-xs text-white/50">Version: {AI_MONITORING.llmHealth.modelVersion} • Updated: {AI_MONITORING.llmHealth.lastUpdate}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">{AI_MONITORING.llmHealth.status}</span>
            </div>
          </div>
        )}

        {/* Compliance Center */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-2xl font-bold text-green-400">{COMPLIANCE_CENTER.privacyCompliance.score}</div>
                <div className="text-xs text-white/50">Privacy Score</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-2xl font-bold text-white">{formatNumber(COMPLIANCE_CENTER.auditLogs.total)}</div>
                <div className="text-xs text-white/50">Audit Logs</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="text-2xl font-bold text-white">{COMPLIANCE_CENTER.insuranceIntegrations.active}</div>
                <div className="text-xs text-white/50">Insurance Partners</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="text-2xl font-bold text-white">{COMPLIANCE_CENTER.paymentCompliance.licensedGateways}</div>
                <div className="text-xs text-white/50">Payment Gateways</div>
              </div>
            </div>

            {/* Risk Dashboard */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white flex items-center gap-2"><AlertTriangle size={16} className="text-yellow-400" /> Risk Dashboard</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">{COMPLIANCE_CENTER.riskDashboard.overallRisk}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div><span className="text-red-400 font-bold">{COMPLIANCE_CENTER.riskDashboard.flaggedAccounts}</span><div className="text-white/50">Flagged</div></div>
                <div><span className="text-yellow-400 font-bold">{COMPLIANCE_CENTER.riskDashboard.underReview}</span><div className="text-white/50">Under Review</div></div>
                <div><span className="text-green-400 font-bold">{COMPLIANCE_CENTER.riskDashboard.resolved}</span><div className="text-white/50">Resolved</div></div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center gap-2 mb-2"><BadgeCheck size={16} style={{ color: '#22c55e' }} /><span className="text-white font-medium">Privacy Compliance</span></div>
                <div className="text-xs space-y-1">
                  <div><span className="text-white/50">GDPR:</span> <span className="text-green-400">{COMPLIANCE_CENTER.privacyCompliance.gdpr}</span></div>
                  <div><span className="text-white/50">DPDP:</span> <span className="text-green-400">{COMPLIANCE_CENTER.privacyCompliance.dpdp}</span></div>
                  <div><span className="text-white/50">Last Audit:</span> <span className="text-white">{COMPLIANCE_CENTER.privacyCompliance.lastAudit}</span></div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="flex items-center gap-2 mb-2"><FileCheck size={16} style={{ color: '#00F2FE' }} /><span className="text-white font-medium">Payment Compliance</span></div>
                <div className="text-xs space-y-1">
                  <div><span className="text-white/50">PCI DSS:</span> <span className="text-green-400">{COMPLIANCE_CENTER.paymentCompliance.pciDss}</span></div>
                  <div><span className="text-white/50">Last Audit:</span> <span className="text-white">{COMPLIANCE_CENTER.paymentCompliance.lastAudit}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Center */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Sybil Shield */}
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(26,21,48,0.8))', border: '2px solid rgba(239,68,68,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield size={24} className="text-red-400" />
                  <div>
                    <div className="font-semibold text-white">Sybil Shield</div>
                    <div className="text-sm text-white/50">Multi-account detection system</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">{FRAUD_SECURITY_CENTER.sybilShield.accuracy}</div>
                  <div className="text-xs text-white/50">accuracy</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><span className="text-xl font-bold text-white">{FRAUD_SECURITY_CENTER.sybilShield.alerts}</span><div className="text-xs text-white/50">Alerts</div></div>
                <div><span className="text-xl font-bold text-red-400">{FRAUD_SECURITY_CENTER.sybilShield.blocked}</span><div className="text-xs text-white/50">Blocked</div></div>
                <div><span className="text-xl font-bold text-yellow-400">{FRAUD_SECURITY_CENTER.sybilShield.underReview}</span><div className="text-xs text-white/50">Under Review</div></div>
              </div>
            </div>

            {/* Suspicious Activity */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" /> Suspicious Activity (Last 24h)
              </h3>
              <div className="space-y-3">
                {FRAUD_SECURITY_CENTER.suspiciousActivity.map((activity) => (
                  <div key={activity.type} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="text-white capitalize">{activity.type.replace('_', ' ')}</div>
                      <div className="text-xs text-white/50">{activity.detected} detected • {activity.blocked} blocked</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${activity.severity === 'high' ? 'bg-red-500/20 text-red-400' : activity.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {activity.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow Monitoring */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-2 mb-3"><Lock size={16} style={{ color: '#D4AF37' }} /><span className="font-medium text-white">Escrow Monitoring</span></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><span className="text-lg font-bold text-white">{formatNumber(FRAUD_SECURITY_CENTER.escrowMonitoring.active)}</span><div className="text-xs text-white/50">Active</div></div>
                <div><span className="text-lg font-bold text-yellow-400">{formatNumber(FRAUD_SECURITY_CENTER.escrowMonitoring.pending)}</span><div className="text-xs text-white/50">Pending</div></div>
                <div><span className="text-lg font-bold text-green-400">{formatNumber(FRAUD_SECURITY_CENTER.escrowMonitoring.released)}</span><div className="text-xs text-white/50">Released</div></div>
                <div><span className="text-lg font-bold" style={{ color: '#D4AF37' }}>{formatCurrency(FRAUD_SECURITY_CENTER.escrowMonitoring.held)}</span><div className="text-xs text-white/50">Held</div></div>
              </div>
            </div>
          </div>
        )}

        {/* Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Audit Logs */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText size={20} style={{ color: '#22c55e' }} />
                  <div>
                    <div className="font-semibold text-white">Immutable Audit Logs</div>
                    <div className="text-xs text-white/50">Last entry: {SYSTEM_AUDIT.immutableLogs.lastEntry}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{formatNumber(SYSTEM_AUDIT.immutableLogs.total)}</div>
                  <div className="text-xs text-white/50">total logs</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div><span className="text-green-400 font-bold">{(SYSTEM_AUDIT as any).immutableLogs.immutable ? 'Yes' : 'No'}</span><div className="text-white/50">Immutable</div></div>
                <div><span className="text-white font-bold">{(SYSTEM_AUDIT as any).immutableLogs.retentionDays} days</span><div className="text-white/50">Retention</div></div>
                <div><span className="text-green-400 font-bold">{(SYSTEM_AUDIT as any).immutableLogs.encrypted ? 'Yes' : 'No'}</span><div className="text-white/50">Encrypted</div></div>
              </div>
            </div>

            {/* System Changes */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Settings size={18} style={{ color: '#D4AF37' }} /> Recent System Changes
              </h3>
              <div className="space-y-3">
                {SYSTEM_AUDIT.systemChanges.map((change, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="text-white">{change.description}</div>
                      <div className="text-xs text-white/50">{change.type} by {change.by}</div>
                    </div>
                    <span className="text-xs text-white/50">{change.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="text-xl font-bold text-white">{SYSTEM_AUDIT.adminActions.today}</div>
                <div className="text-xs text-white/50">Today</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-xl font-bold text-white">{SYSTEM_AUDIT.adminActions.thisWeek}</div>
                <div className="text-xs text-white/50">This Week</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-xl font-bold text-white">{SYSTEM_AUDIT.adminActions.thisMonth}</div>
                <div className="text-xs text-white/50">This Month</div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Broadcast Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="text-xl font-bold text-white">{formatNumber(NOTIFICATION_HUB.customerBroadcasts.sent)}</div>
                <div className="text-xs text-white/50">Sent</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="text-xl font-bold text-white">{formatNumber(NOTIFICATION_HUB.customerBroadcasts.opened)}</div>
                <div className="text-xs text-white/50">Opened</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>{NOTIFICATION_HUB.customerBroadcasts.avgOpenRate}</div>
                <div className="text-xs text-white/50">Open Rate</div>
              </div>
            </div>

            {/* Scheduled Notifications */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Bell size={18} style={{ color: '#D4AF37' }} /> Scheduled Reports
              </h3>
              <div className="space-y-3">
                {(NOTIFICATION_HUB as any).scheduled.map((report: any) => (
                  <div key={report.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="text-white">{report.name}</div>
                      <div className="text-xs text-white/50">{report.frequency} • {report.recipients} recipients</div>
                    </div>
                    <span className="text-xs text-white/50">Next: {report.nextRun}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Alerts */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="flex items-center gap-2 mb-3"><Clock size={16} style={{ color: '#8b5cf6' }} /><span className="font-medium text-white">Maintenance Alerts</span></div>
              {NOTIFICATION_HUB.maintenanceAlerts.map((alert) => (
                <div key={alert.id} className="text-sm mb-2">
                  <span className="text-white">{alert.service}:</span> <span className="text-white/70">{alert.message}</span>
                  <span className="text-xs text-white/50 ml-2">{alert.date} ({alert.duration})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disaster Recovery */}
        {activeTab === 'disaster' && (
          <div className="space-y-6">
            {/* Backup Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '2px solid rgba(34,197,94,0.3)' }}>
                <div className="flex items-center gap-2 mb-3"><Database size={18} style={{ color: '#22c55e' }} /><span className="font-semibold text-white">Backup Status</span></div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-white/50">Status:</span> <span className="text-green-400">{DISASTER_RECOVERY.backupStatus.primary}</span></div>
                  <div><span className="text-white/50">Last Backup:</span> <span className="text-white">{DISASTER_RECOVERY.backupStatus.lastBackup}</span></div>
                  <div><span className="text-white/50">Size:</span> <span className="text-white">{DISASTER_RECOVERY.backupStatus.size}</span></div>
                  <div><span className="text-white/50">Frequency:</span> <span className="text-white">{DISASTER_RECOVERY.backupStatus.frequency}</span></div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <div className="flex items-center gap-2 mb-3"><RefreshCw size={18} style={{ color: '#00F2FE' }} /><span className="font-semibold text-white">Failover Readiness</span></div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-white/50">Status:</span> <span className="text-green-400">{DISASTER_RECOVERY.failoverReadiness.status}</span></div>
                  <div><span className="text-white/50">RTO:</span> <span className="text-white">{DISASTER_RECOVERY.failoverReadiness.rto}</span></div>
                  <div><span className="text-white/50">RPO:</span> <span className="text-white">{DISASTER_RECOVERY.failoverReadiness.rpo}</span></div>
                  <div><span className="text-white/50">Last Test:</span> <span className="text-white">{DISASTER_RECOVERY.failoverReadiness.lastTest}</span></div>
                </div>
              </div>
            </div>

            {/* Recovery Points */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-2 mb-3"><HardDrive size={16} style={{ color: '#D4AF37' }} /><span className="font-medium text-white">Recovery Points</span></div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><span className="text-xl font-bold text-white">{DISASTER_RECOVERY.recoveryPoints.total}</span><div className="text-xs text-white/50">Total Points</div></div>
                <div><span className="text-sm text-white">{DISASTER_RECOVERY.recoveryPoints.earliest}</span><div className="text-xs text-white/50">Earliest</div></div>
                <div><span className="text-sm text-white">{DISASTER_RECOVERY.recoveryPoints.latest}</span><div className="text-xs text-white/50">Latest</div></div>
              </div>
            </div>

            {/* Cloud Status */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(DISASTER_RECOVERY.cloudStatus).map(([key, status]) => (
                <div key={key} className="rounded-xl p-4 text-center" style={{ background: status === 'healthy' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: '1px solid' + (status === 'healthy' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)') }}>
                  <div className="text-sm capitalize text-white mb-1">{key}</div>
                  <span className={status === 'healthy' ? 'text-green-400' : 'text-red-400'}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Available Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {EXECUTIVE_REPORTS.available.map((report) => (
                <div key={report.type} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{report.type}</span>
                    {report.status === 'auto-generated' ? <CheckCircle size={14} className="text-green-400" /> : <Clock size={14} className="text-yellow-400" />}
                  </div>
                  <div className="text-xs text-white/50">Last: {report.lastGenerated}</div>
                </div>
              ))}
            </div>

            {/* Export Options */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><Download size={16} style={{ color: '#00F2FE' }} /> Export Formats</h4>
              <div className="flex flex-wrap gap-3">
                {EXECUTIVE_REPORTS.exports.pdf && <button className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>PDF</button>}
                {EXECUTIVE_REPORTS.exports.excel && <button className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>Excel</button>}
                {EXECUTIVE_REPORTS.exports.csv && <button className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(0,242,254,0.2)', color: '#00F2FE' }}>CSV</button>}
              </div>
            </div>
          </div>
        )}

        {/* Legal Green Zone */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            {/* Compliance Score */}
            <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '2px solid #22c55e' }}>
              <BadgeCheck size={32} className="mx-auto mb-2" style={{ color: '#22c55e' }} />
              <div className="text-3xl font-bold text-green-400 mb-1">{LEGAL_GREEN_ZONE.complianceScore}</div>
              <div className="text-sm text-white/50">Overall Compliance Score</div>
              <div className="text-xs text-white/50 mt-2">Last Audit: {LEGAL_GREEN_ZONE.lastAudit}</div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Lock size={18} style={{ color: '#22c55e' }} /> Legal Green Zone Rules
              </h3>
              <div className="space-y-3">
                {LEGAL_GREEN_ZONE.rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <CheckCircle size={16} style={{ color: '#22c55e' }} />
                    <div className="flex-1">
                      <div className="text-white">{rule.rule}</div>
                      <div className="text-xs text-white/50">{rule.audits} audits</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">{rule.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
