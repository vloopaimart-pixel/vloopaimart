import { useState } from 'react';
import {
  Bot, ShoppingBag, Wallet, Building2, Heart, BookOpen,
  Shield, Store, Wrench, Settings, MapPin, Mic,
  Lock, Scale, TrendingUp, Eye, Search, Package,
  Gift, Clock, AlertTriangle, CheckCircle, Star, Truck,
  Target, Award, Bell, Users, Globe, Zap, PieChart,
  FileText, Info, BadgeCheck, ChevronRight, Sparkles,
  Activity, BarChart3, CircleDollarSign,
} from 'lucide-react';
import {
  SHOPPING_AI,
  SMART_SHOPPING_GUIDE,
  WALLET_AI,
  BUSINESS_AI,
  CARE_AI,
  LEARNING_AI,
  INSURANCE_AI,
  MARKETPLACE_AI,
  LOCAL_SERVICES_AI,
  FINANCIAL_GUIDE_AI,
  ADMIN_AI,
  HYPER_LOCAL_ENGINE,
  VOICE_AI,
  AI_PRIVACY,
  AI_LEGAL_RULES,
  AI_CORE_SUMMARY,
  formatCurrency,
  getStatusColor,
} from '../lib/vcosAISuperPlatformMockData';

type VCOSAISuperPlatformPageProps = {
  onNavigate: (page: string) => void;
};

export default function VCOSAISuperPlatformPage({ onNavigate }: VCOSAISuperPlatformPageProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Bot },
    { id: 'shopping', name: 'Shopping AI', icon: ShoppingBag },
    { id: 'wallet', name: 'Wallet AI', icon: Wallet },
    { id: 'business', name: 'Business AI', icon: Building2 },
    { id: 'care', name: 'Care AI', icon: Heart },
    { id: 'learning', name: 'Learning AI', icon: BookOpen },
    { id: 'insurance', name: 'Insurance AI', icon: Shield },
    { id: 'marketplace', name: 'Marketplace AI', icon: Store },
    { id: 'services', name: 'Services AI', icon: Wrench },
    { id: 'finance', name: 'Finance Guide', icon: CircleDollarSign },
    { id: 'admin', name: 'Admin AI', icon: Settings },
    { id: 'hyperlocal', name: 'Hyper Local', icon: MapPin },
    { id: 'voice', name: 'Voice AI', icon: Mic },
    { id: 'privacy', name: 'AI Privacy', icon: Lock },
    { id: 'legal', name: 'AI Legal', icon: Scale },
  ];

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Bot className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 29 • VCOS™ AI Super Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>VLOOP AI Super Platform</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Intelligent assistance for customers, businesses, sellers, and partners. AI guides, recommends, and assists — never overrides compliance or financial decisions.
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
            {/* AI Core Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <Bot className="w-8 h-8 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-3xl font-bold text-white">{AI_CORE_SUMMARY.modules.length}</div>
                <div className="text-xs text-white/50">AI Modules</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-3xl font-bold text-white">{(AI_CORE_SUMMARY.totalQueries / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-white/50">Total Queries</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-3xl font-bold text-white">{AI_CORE_SUMMARY.avgResponseTime}</div>
                <div className="text-xs text-white/50">Avg Response</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Star className="w-8 h-8 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-3xl font-bold text-white">{AI_CORE_SUMMARY.satisfactionRate}</div>
                <div className="text-xs text-white/50">Satisfaction</div>
              </div>
            </div>

            {/* AI Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_CORE_SUMMARY.modules.map((module) => (
                <div key={module.name} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{module.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${module.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {module.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/50">{module.users.toLocaleString()} active users</div>
                </div>
              ))}
            </div>

            {/* Legal Notice */}
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={18} className="inline mr-2 text-red-400" />
              <span className="text-sm text-white/70">{AI_LEGAL_RULES.disclaimerText}</span>
            </div>
          </div>
        )}

        {/* Shopping AI */}
        {activeTab === 'shopping' && (
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} style={{ color: '#00F2FE' }} /> AI Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHOPPING_AI.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{rec.name}</span>
                      {rec.discount && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>{rec.discount}</span>}
                    </div>
                    <div className="text-xs text-white/50 mb-1">{rec.reason}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#D4AF37' }}>{formatCurrency(rec.price ?? 0)}</span>
                      <span className="text-white/50">Rating: {rec.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Offers */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={18} style={{ color: '#D4AF37' }} /> Nearby Offers
              </h3>
              <div className="space-y-3">
                {SHOPPING_AI.nearbyOffers.map((offer) => (
                  <div key={offer.store} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{offer.store}</div>
                      <div className="text-xs text-white/50">{offer.distance} • Expires in {offer.expires}</div>
                    </div>
                    <span className="text-sm" style={{ color: '#22c55e' }}>{offer.offer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Shopping Guide */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={18} style={{ color: '#8b5cf6' }} /> Smart Shopping Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {SMART_SHOPPING_GUIDE.features.map((feature) => (
                  <div key={feature.id} className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <Search size={20} className="mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                    <div className="text-sm font-medium text-white">{feature.name}</div>
                    <div className="text-xs text-white/50">{feature.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallet AI */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {/* Wallet Insights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Gift className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(WALLET_AI.insights.availableBenefits)}</div>
                <div className="text-xs text-white/50">Available Benefits</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-xl font-bold text-white">{formatCurrency(WALLET_AI.insights.pendingReleases)}</div>
                <div className="text-xs text-white/50">Pending Releases</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-xl font-bold text-white">{WALLET_AI.insights.protectionActive}</div>
                <div className="text-xs text-white/50">Active Protections</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <div className="text-xl font-bold text-white">{WALLET_AI.insights.insuranceExpiring}</div>
                <div className="text-xs text-white/50">Insurance Expiring</div>
              </div>
            </div>

            {/* Upcoming Benefits */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Gift size={18} style={{ color: '#D4AF37' }} /> Upcoming Benefit Releases
              </h3>
              <div className="space-y-3">
                {WALLET_AI.upcomingBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{benefit.name}</div>
                      <div className="text-xs text-white/50">{benefit.source} • Releases: {benefit.releaseDate}</div>
                    </div>
                    <span className="font-semibold" style={{ color: '#D4AF37' }}>{formatCurrency(benefit.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Status Summary */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Wallet size={18} style={{ color: '#00F2FE' }} /> Wallet Status Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-lg font-bold" style={{ color: '#00F2FE' }}>{formatCurrency(WALLET_AI.walletStatus.customerBalance)}</div>
                  <div className="text-xs text-white/50">Customer Balance</div>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{formatCurrency(WALLET_AI.walletStatus.sponsoredAvailable)}</div>
                  <div className="text-xs text-white/50">Sponsored Available</div>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-lg font-bold text-green-400">{formatCurrency(WALLET_AI.walletStatus.totalAvailable)}</div>
                  <div className="text-xs text-white/50">Total Available</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business AI */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            {/* Sales Growth */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} style={{ color: '#22c55e' }} />
                  <div>
                    <div className="font-semibold text-white">Sales Growth</div>
                    <div className="text-sm text-white/50">AI Prediction</div>
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: '#22c55e' }}>{BUSINESS_AI.salesGrowth.percentage}</div>
              </div>
              <p className="text-sm text-white/70">{BUSINESS_AI.salesGrowth.prediction}</p>
            </div>

            {/* Partner Insights */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={18} style={{ color: '#D4AF37' }} /> Partner Insights
              </h3>
              <div className="space-y-3">
                {BUSINESS_AI.partnerInsights.map((partner) => (
                  <div key={partner.partner} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{partner.partner}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">{partner.type}</span>
                        <span style={{ color: '#22c55e' }}>{partner.growth}</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/70">
                      <span style={{ color: '#00F2FE' }}>AI Suggestion:</span> {partner.aiSuggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" /> Inventory Alerts
              </h4>
              <div className="space-y-2">
                {BUSINESS_AI.inventoryAlerts.map((alert) => (
                  <div key={alert.product} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="text-white">{alert.product}</div>
                      <div className="text-xs text-white/50">{alert.action}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {alert.issue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Suggestions */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap size={18} style={{ color: '#00F2FE' }} /> AI Campaign Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BUSINESS_AI.campaignSuggestions.map((camp) => (
                  <div key={camp.name} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{camp.name}</span>
                      <span style={{ color: '#22c55e' }}>{camp.expectedROI}</span>
                    </div>
                    <div className="text-xs text-white/50">Target: {camp.targetAudience}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Care AI */}
        {activeTab === 'care' && (
          <div className="space-y-6">
            {/* Programs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(CARE_AI.programs).map(([key, program]) => (
                <div key={key} className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: '#f97316' }} />
                  <div className="font-semibold text-white">{program.name}</div>
                  <div className="text-lg font-bold" style={{ color: '#f97316' }}>{program.impact.toLocaleString()}</div>
                  <div className="text-xs text-white/50">{program.description}</div>
                </div>
              ))}
            </div>

            {/* Impact Summary */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(26,21,48,0.8))', border: '1px solid rgba(249,115,22,0.3)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} style={{ color: '#f97316' }} /> Your Care Impact
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#f97316' }}>{formatCurrency(CARE_AI.impactSummary.totalContributed)}</div>
                  <div className="text-xs text-white/50">Total Contributed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{CARE_AI.impactSummary.livesImpacted.toLocaleString()}</div>
                  <div className="text-xs text-white/50">Lives Impacted</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>{formatCurrency(CARE_AI.impactSummary.thisMonth)}</div>
                  <div className="text-xs text-white/50">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{CARE_AI.impactSummary.participantSince}</div>
                  <div className="text-xs text-white/50">Participant Since</div>
                </div>
              </div>
            </div>

            {/* Nearby Programs */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={18} style={{ color: '#f97316' }} /> Nearby Care Programs
              </h3>
              <div className="space-y-3">
                {CARE_AI.nearbyPrograms.map((program, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{program.name}</div>
                      <div className="text-xs text-white/50">{program.location}</div>
                    </div>
                    <span className="text-sm text-white/70">{program.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Learning AI */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <BookOpen className="w-6 h-6 mx-auto mb-2" style={{ color: '#3b82f6' }} />
                <div className="text-xl font-bold text-white">{LEARNING_AI.academyProgress.coursesEnrolled}</div>
                <div className="text-xs text-white/50">Courses Enrolled</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{LEARNING_AI.academyProgress.coursesCompleted}</div>
                <div className="text-xs text-white/50">Completed</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Award className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-xl font-bold text-white">{LEARNING_AI.academyProgress.certificationsEarned}</div>
                <div className="text-xs text-white/50">Certifications</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Zap className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-xl font-bold text-white">{LEARNING_AI.academyProgress.currentStreak}</div>
                <div className="text-xs text-white/50">Day Streak</div>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={18} style={{ color: '#3b82f6' }} /> AI Recommended Courses
              </h3>
              <div className="space-y-3">
                {LEARNING_AI.recommendedCourses.map((course) => (
                  <div key={course.name} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{course.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>{course.level}</span>
                    </div>
                    <div className="text-xs text-white/50 mb-1">{course.reason}</div>
                    <div className="text-xs text-white/70">Duration: {course.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Development */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <h4 className="font-semibold text-white mb-3">Skill Development Progress</h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: LEARNING_AI.skillDevelopment.progress, background: '#3b82f6' }} />
                </div>
                <span className="text-sm font-bold text-white">{LEARNING_AI.skillDevelopment.progress}</span>
              </div>
              <div className="text-xs text-white/50">
                <span>Current skills: </span>
                {LEARNING_AI.skillDevelopment.currentSkills.join(', ')}
              </div>
              <div className="text-xs text-white/50">
                <span>Suggested: </span>
                {LEARNING_AI.skillDevelopment.suggestedSkills.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Insurance AI */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            {/* Active Policies */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Shield size={18} style={{ color: '#22c55e' }} /> Active Policies
              </h3>
              <div className="space-y-3">
                {INSURANCE_AI.activePolicies.map((policy) => (
                  <div key={policy.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{policy.name}</div>
                      <div className="text-xs text-white/50">{policy.partner} • Expires: {policy.expiry}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#D4AF37' }}>Coverage: {policy.coverage}</div>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">{policy.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complimentary Covers */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Gift size={18} style={{ color: '#D4AF37' }} /> Complimentary Covers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INSURANCE_AI.complimentaryCovers.map((cover) => (
                  <div key={cover.name} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-medium text-white">{cover.name}</div>
                    <div className="text-xs text-white/50">{cover.provider}</div>
                    <div className="text-sm" style={{ color: '#D4AF37' }}>Coverage: {cover.coverage}</div>
                    <div className="text-xs text-white/50">Source: {cover.source}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim Guidance */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Info size={18} className="text-yellow-400" /> Claim Guidance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="text-white/50">Claim:</span> <span className="text-white">{INSURANCE_AI.claimGuidance.currentClaim}</span></div>
                <div><span className="text-white/50">Status:</span> <span className="text-yellow-400">{INSURANCE_AI.claimGuidance.status}</span></div>
                <div><span className="text-white/50">ETA:</span> <span className="text-white">{INSURANCE_AI.claimGuidance.estimatedResolution}</span></div>
                <div><span className="text-white/50">Next:</span> <span className="text-white">{INSURANCE_AI.claimGuidance.nextSteps}</span></div>
              </div>
              <div className="mt-3 p-2 rounded text-xs text-white/50" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <Info size={12} className="inline mr-1" /> {INSURANCE_AI.disclaimer}
              </div>
            </div>
          </div>
        )}

        {/* Marketplace AI */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Local Sellers */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Store size={18} style={{ color: '#D4AF37' }} /> AI Recommended Sellers Near You
              </h3>
              <div className="space-y-3">
                {MARKETPLACE_AI.localSellers.map((seller) => (
                  <div key={seller.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <div>
                        <div className="font-medium text-white">{seller.name}</div>
                        <div className="text-xs text-white/50">{seller.type} • {seller.distance}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#D4AF37' }}>Rating: {seller.rating}</div>
                      {seller.verified && <span className="text-xs text-green-400">Verified</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Products */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} style={{ color: '#00F2FE' }} /> Trending Products
              </h3>
              <div className="space-y-3">
                {MARKETPLACE_AI.trendingProducts.map((product) => (
                  <div key={product.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <span className="text-white">{product.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50">{product.weeklyOrders.toLocaleString()} orders/week</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${product.trend === 'hot' ? 'bg-red-500/20 text-red-400' : product.trend === 'rising' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {product.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Transactions */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Shield size={18} style={{ color: '#22c55e' }} /> Safe Transaction Features
              </h4>
              <div className="flex flex-wrap gap-3">
                {MARKETPLACE_AI.safeTransactions.escrowEnabled && <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>Escrow Enabled</span>}
                {MARKETPLACE_AI.safeTransactions.buyerProtection && <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>Buyer Protection</span>}
              </div>
            </div>
          </div>
        )}

        {/* Services AI */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Nearby Providers */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Wrench size={18} style={{ color: '#8b5cf6' }} /> Nearby Service Providers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LOCAL_SERVICES_AI.nearbyProviders.map((provider) => (
                  <div key={provider.name} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{provider.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${provider.available ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {provider.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                    <div className="text-xs text-white/50">{provider.category} • {provider.distance}</div>
                    <div className="text-sm" style={{ color: '#D4AF37' }}>Rating: {provider.rating}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Search Support */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Mic size={18} style={{ color: '#00F2FE' }} /> Voice Search Enabled
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {LOCAL_SERVICES_AI.voiceSearchSupport.languages.map((lang) => (
                  <span key={lang} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,242,254,0.2)', color: '#00F2FE' }}>{lang}</span>
                ))}
              </div>
              <div className="text-xs text-white/50">
                {LOCAL_SERVICES_AI.voiceSearchSupport.offlineCapable ? 'Offline voice capable' : 'Requires internet'}
              </div>
            </div>

            {/* Service Categories */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4">Service Categories</h3>
              <div className="flex flex-wrap gap-2">
                {LOCAL_SERVICES_AI.serviceCategories.map((cat) => (
                  <span key={cat} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>{cat}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Finance Guide AI */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            {/* Wallet Explanations */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Info size={18} style={{ color: '#00F2FE' }} /> AI Financial Guide
              </h3>
              <div className="space-y-3">
                {Object.entries(FINANCIAL_GUIDE_AI.walletExplanation).map(([key, explanation]) => (
                  <div key={key} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-medium capitalize text-white mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-sm text-white/70">{explanation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Rules */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Scale size={18} style={{ color: '#D4AF37' }} /> Program Rules
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(FINANCIAL_GUIDE_AI.programRules).map(([key, rule]) => (
                  <div key={key} className="text-white/70">
                    <span className="text-white">{key.replace(/([A-Z])/g, ' $1')}:</span> {rule}
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={18} className="inline mr-2 text-red-400" />
              <span className="text-sm text-white/70">{FINANCIAL_GUIDE_AI.disclaimer}</span>
            </div>
          </div>
        )}

        {/* Admin AI */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            {/* Fraud Trends */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" /> Fraud Detection Trends
              </h3>
              <div className="space-y-3">
                {ADMIN_AI.fraudTrends.map((trend) => (
                  <div key={trend.type} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{trend.type.replace('_', ' ')}</div>
                      <div className="text-xs text-white/50">{trend.action}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white">{trend.count}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${trend.trend === 'increasing' ? 'bg-red-500/20 text-red-400' : trend.trend === 'decreasing' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {trend.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ADMIN_AI.salesTrends.byCategory.map((cat) => (
                <div key={cat.category} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{cat.category}</span>
                    <span style={{ color: '#22c55e' }}>{cat.growth}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Suggestions */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap size={18} style={{ color: '#00F2FE' }} /> AI Operational Suggestions
              </h3>
              <div className="space-y-3">
                {ADMIN_AI.operationalSuggestions.map((suggestion) => (
                  <div key={suggestion.area} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{suggestion.area}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${suggestion.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <div className="text-sm text-white/70">{suggestion.suggestion}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hyper Local Engine */}
        {activeTab === 'hyperlocal' && (
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={18} style={{ color: '#D4AF37' }} /> Hyper Local Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {HYPER_LOCAL_ENGINE.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: getTypeColor(rec.type) }}>
                      {rec.type === 'partner' && <Store size={18} style={{ color: '#fff' }} />}
                      {rec.type === 'service' && <Wrench size={18} style={{ color: '#fff' }} />}
                      {rec.type === 'offer' && <Gift size={18} style={{ color: '#fff' }} />}
                      {rec.type === 'event' && <Bell size={18} style={{ color: '#fff' }} />}
                      {rec.type === 'care' && <Heart size={18} style={{ color: '#fff' }} />}
                      {rec.type === 'seller' && <Users size={18} style={{ color: '#fff' }} />}
                    </div>
                    <div className="font-medium text-white">{rec.name}</div>
                    <div className="text-xs text-white/50">{rec.distance}</div>
                    <span className="text-xs px-2 py-0.5 rounded mt-1 inline-block" style={{ background: getTypeColor(rec.type) + '20', color: getTypeColor(rec.type) }}>
                      {rec.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine Settings */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Settings size={18} style={{ color: '#00F2FE' }} /> Engine Settings
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="text-white/50">Max Distance:</span> <span className="text-white">{HYPER_LOCAL_ENGINE.engineSettings.maxDistance} km</span></div>
                <div><span className="text-white/50">Tracking:</span> <span className="text-green-400">{HYPER_LOCAL_ENGINE.engineSettings.trackingEnabled ? 'ON' : 'OFF'}</span></div>
                <div><span className="text-white/50">Real-time:</span> <span className="text-green-400">{HYPER_LOCAL_ENGINE.engineSettings.realTimeUpdates ? 'ON' : 'OFF'}</span></div>
                <div><span className="text-white/50">Personalization:</span> <span className="text-white">{HYPER_LOCAL_ENGINE.engineSettings.personalizationLevel}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Voice AI */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(VOICE_AI.features).map(([feature, enabled]) => (
                <div key={feature} className="rounded-xl p-4 text-center" style={{ background: enabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: '1px solid' + (enabled ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)') }}>
                  <Mic className="w-6 h-6 mx-auto mb-2" style={{ color: enabled ? '#22c55e' : '#ef4444' }} />
                  <div className="font-medium text-white capitalize">{feature.replace(/([A-Z])/g, ' $1')}</div>
                  <span className={`text-xs ${enabled ? 'text-green-400' : 'text-red-400'}`}>
                    {enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>

            {/* Supported Languages */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe size={18} style={{ color: '#D4AF37' }} /> Supported Languages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VOICE_AI.supportedLanguages.map((lang) => (
                  <div key={lang.code} className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-medium text-white">{lang.name}</div>
                    <div className="text-xs text-white/50">Accuracy: {lang.accuracy}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Commands */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Mic size={18} style={{ color: '#00F2FE' }} /> Sample Voice Commands
              </h3>
              <div className="space-y-3">
                {VOICE_AI.sampleCommands.map((cmd) => (
                  <div key={cmd.command} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <code className="text-sm" style={{ color: '#00F2FE' }}>"{cmd.command}"</code>
                    <div className="text-xs text-white/50 mt-1">{cmd.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            {/* Privacy Principles */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Lock size={18} style={{ color: '#22c55e' }} /> AI Privacy Principles
              </h3>
              <div className="space-y-3">
                {AI_PRIVACY.principles.map((principle) => (
                  <div key={principle.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <CheckCircle size={18} style={{ color: '#22c55e' }} />
                    <div className="flex-1">
                      <div className="font-medium text-white">{principle.principle}</div>
                      <div className="text-xs text-white/50">{principle.description}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">{principle.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Controls */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <h4 className="font-semibold text-white mb-3">User Controls</h4>
              <div className="grid grid-cols-2 gap-3">
                {AI_PRIVACY.userControls.map((control) => (
                  <button key={control} className="p-3 rounded-lg text-sm text-white/70 hover:text-white transition-colors text-left" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    {control}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-white/50">Data Retention: {AI_PRIVACY.dataRetention}</div>
            </div>
          </div>
        )}

        {/* AI Legal Rules */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            {/* Must Never */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" /> AI MUST NEVER
              </h3>
              <div className="space-y-2">
                {AI_LEGAL_RULES.mustNever.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 text-xs font-bold">✕</span>
                    <div>
                      <div className="font-medium text-white">{rule.rule}</div>
                      <div className="text-xs text-white/50">{rule.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Must Always */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={18} style={{ color: '#22c55e' }} /> AI MUST ALWAYS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {AI_LEGAL_RULES.mustAlways.map((action) => (
                  <div key={action.id} className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <CheckCircle size={20} className="mx-auto mb-2" style={{ color: '#22c55e' }} />
                    <div className="font-medium text-white">{action.action}</div>
                    <div className="text-xs text-white/50">{action.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(26,21,48,0.8))', border: '2px solid #D4AF37' }}>
              <Bot size={24} className="mx-auto mb-3" style={{ color: '#D4AF37' }} />
              <p className="text-white/80">{AI_LEGAL_RULES.disclaimerText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper function for type colors
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    partner: '#D4AF37',
    service: '#8b5cf6',
    offer: '#22c55e',
    event: '#ec4899',
    care: '#f97316',
    seller: '#00F2FE',
  };
  return colors[type] || '#94a3b8';
}
