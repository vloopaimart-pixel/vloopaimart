import { useState } from 'react';
import {
  Building2, Store, Users, Globe, MapPin, Package, TrendingUp,
  Award, CheckCircle, Clock, AlertTriangle, ChevronRight, Upload,
  FileText, CreditCard, Shield, BadgeCheck, Eye, Settings, BarChart3,
  Bell, Calendar, Gift, Zap, RefreshCw, Briefcase, Truck, Leaf,
  Wrench, BookOpen, Car, Heart, Scissors, User, Search, Filter,
  Download, ExternalLink, Info, Handshake, Target, PieChart,
  Activity, Wallet, Globe2, FileCheck, AlertCircle, CircleDollarSign, Ban,
} from 'lucide-react';
import {
  PARTNER_ONBOARDING,
  BUSINESS_DASHBOARD,
  PRODUCT_MANAGEMENT,
  LOCAL_DISCOVERY,
  SMARTPOINT_ELIGIBILITY,
  CUSTOMER_ENGAGEMENT,
  COMMUNITY_BUSINESS,
  LOCAL_SERVICES,
  FRANCHISE_MANAGEMENT,
  ENTERPRISE_PORTAL,
  AI_BUSINESS_INSIGHTS,
  ADMIN_CONTROL,
  GLOBAL_EXPANSION,
  LEGAL_COMPLIANCE,
  PARTNER_NETWORK_STATS,
  formatCurrency,
  getStatusColor,
  getTierColor,
} from '../lib/globalPartnerEcosystemMockData';

type GlobalPartnerEcosystemPageProps = {
  onNavigate: (page: string) => void;
};

export default function GlobalPartnerEcosystemPage({ onNavigate }: GlobalPartnerEcosystemPageProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building2 },
    { id: 'onboarding', name: 'Onboarding', icon: FileText },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'discovery', name: 'Local Discovery', icon: MapPin },
    { id: 'smartpoint', name: 'SmartPoints', icon: Zap },
    { id: 'engagement', name: 'Engagement', icon: Bell },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'services', name: 'Services', icon: Wrench },
    { id: 'franchise', name: 'Franchise', icon: Building2 },
    { id: 'enterprise', name: 'Enterprise', icon: Briefcase },
    { id: 'insights', name: 'AI Insights', icon: TrendingUp },
    { id: 'admin', name: 'Admin', icon: Settings },
    { id: 'global', name: 'Global', icon: Globe },
    { id: 'legal', name: 'Legal', icon: BadgeCheck },
  ];

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Globe className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 28 • VCOS™ Partner Network</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2" style={{ color: '#D4AF37' }}>Global Partner Ecosystem</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Connecting enterprise brands, partner stores, community businesses, local services, and franchise networks under one unified platform.
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
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <Building2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-3xl font-bold text-white">{PARTNER_NETWORK_STATS.totalPartners.toLocaleString()}</div>
                <div className="text-xs text-white/50">Total Partners</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Store className="w-8 h-8 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-3xl font-bold text-white">{PARTNER_NETWORK_STATS.registeredStores.toLocaleString()}</div>
                <div className="text-xs text-white/50">Registered Stores</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-3xl font-bold text-white">{PARTNER_NETWORK_STATS.communityBusinesses.toLocaleString()}</div>
                <div className="text-xs text-white/50">Community Businesses</div>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Wrench className="w-8 h-8 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-3xl font-bold text-white">{PARTNER_NETWORK_STATS.localServices.toLocaleString()}</div>
                <div className="text-xs text-white/50">Local Services</div>
              </div>
            </div>

            {/* Partner Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Enterprise Partners', count: PARTNER_NETWORK_STATS.enterprisePartners, icon: Briefcase, color: '#D4AF37' },
                { title: 'Franchise Network', count: PARTNER_NETWORK_STATS.franchisees, icon: Building2, color: '#ec4899' },
                { title: 'Active Today', count: PARTNER_NETWORK_STATS.activeToday, icon: Activity, color: '#22c55e' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid' + item.color + '30' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color + '20' }}>
                      <item.icon size={20} style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.count.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab('onboarding')}
                className="rounded-xl p-6 text-left transition-all hover:scale-[1.02]" style={{ background: 'rgba(0,242,254,0.1)', border: '2px solid #00F2FE' }}
              >
                <FileText size={24} style={{ color: '#00F2FE' }} />
                <h3 className="font-semibold text-white mt-2">Register Your Business</h3>
                <p className="text-sm text-white/50">Join the VLOOP Partner Network</p>
              </button>
              <button
                onClick={() => setActiveTab('discovery')}
                className="rounded-xl p-6 text-left transition-all hover:scale-[1.02]" style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid #D4AF37' }}
              >
                <Search size={24} style={{ color: '#D4AF37' }} />
                <h3 className="font-semibold text-white mt-2">Discover Partners</h3>
                <p className="text-sm text-white/50">Find stores & services near you</p>
              </button>
            </div>
          </div>
        )}

        {/* Partner Onboarding */}
        {activeTab === 'onboarding' && (
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FileText size={18} style={{ color: '#00F2FE' }} /> Onboarding Progress
              </h3>
              <div className="space-y-3">
                {PARTNER_ONBOARDING.steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'completed' ? 'bg-green-500 text-white' :
                      step.status === 'in_progress' ? ' text-white' : 'bg-white/10 text-white/50'
                    }`} style={step.status === 'in_progress' ? { background: '#D4AF37' } : {}}>
                      {step.status === 'completed' ? <CheckCircle size={16} /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{step.name}</div>
                      <div className="text-xs text-white/50">{step.description}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded capitalize" style={{ background: getStatusColor(step.status) + '20', color: getStatusColor(step.status) }}>
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Upload size={18} style={{ color: '#00F2FE' }} /> Document Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PARTNER_ONBOARDING.requirements.map((req) => (
                  <div key={req.doc} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-white/50" />
                      <span className="text-white">{req.doc}</span>
                      {req.required && <span className="text-xs text-red-400">*</span>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${req.uploaded ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {req.uploaded ? 'Uploaded' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Types */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4">Business Types</h3>
              <div className="flex flex-wrap gap-2">
                {PARTNER_ONBOARDING.businessTypes.map((type) => (
                  <span key={type} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Business Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(BUSINESS_DASHBOARD.stats.totalSales)}</div>
                <div className="text-xs text-white/50">Total Sales</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <Package className="w-6 h-6 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-xl font-bold text-white">{BUSINESS_DASHBOARD.stats.totalOrders.toLocaleString()}</div>
                <div className="text-xs text-white/50">Total Orders</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-xl font-bold text-white">{BUSINESS_DASHBOARD.stats.totalCustomers.toLocaleString()}</div>
                <div className="text-xs text-white/50">Customers</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Gift className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-xl font-bold text-white">{formatCurrency(BUSINESS_DASHBOARD.stats.rewardsSponsored)}</div>
                <div className="text-xs text-white/50">Rewards Sponsored</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-xl font-bold text-white">{formatCurrency(BUSINESS_DASHBOARD.stats.pendingSettlement)}</div>
                <div className="text-xs text-white/50">Pending Settlement</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)' }}>
                <Package className="w-6 h-6 mx-auto mb-2" style={{ color: '#ec4899' }} />
                <div className="text-xl font-bold text-white">{BUSINESS_DASHBOARD.stats.totalProducts.toLocaleString()}</div>
                <div className="text-xs text-white/50">Products</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Package size={18} style={{ color: '#D4AF37' }} /> Recent Orders
              </h3>
              <div className="space-y-3">
                {BUSINESS_DASHBOARD.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{order.id}</div>
                      <div className="text-xs text-white/50">{order.customer} • {order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatCurrency(order.amount)}</div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(order.status) + '30', color: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={18} style={{ color: '#00F2FE' }} /> Top Products
              </h3>
              <div className="space-y-3">
                {BUSINESS_DASHBOARD.topProducts.map((product, idx) => (
                  <div key={product.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#D4AF37', color: '#0B0819' }}>
                        {idx + 1}
                      </span>
                      <span className="text-white">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{product.sales} sales</div>
                      <div className="text-xs" style={{ color: '#22c55e' }}>{formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUCT_MANAGEMENT.categories.map((cat) => (
                <div key={cat.id} className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Package className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                  <div className="font-semibold text-white">{cat.name}</div>
                  <div className="text-sm text-white/50">{cat.products} products</div>
                  <div className="text-xs" style={{ color: '#22c55e' }}>{cat.active} active</div>
                </div>
              ))}
            </div>

            {/* Products List */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Package size={18} style={{ color: '#D4AF37' }} /> Products
              </h3>
              <div className="space-y-3">
                {PRODUCT_MANAGEMENT.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-xs text-white/50">SKU: {product.sku} • {product.variants} variants</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatCurrency(product.price)}</div>
                      <div className="text-xs text-white/50">Stock: {product.stock}</div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(product.status) + '30', color: getStatusColor(product.status) }}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-red-400" />
                <span className="font-semibold text-white">Inventory Alerts</span>
              </div>
              <div className="space-y-2">
                {PRODUCT_MANAGEMENT.inventoryAlerts.map((alert) => (
                  <div key={alert.product} className="flex items-center justify-between text-sm">
                    <span className="text-white">{alert.product}</span>
                    <span className="text-red-400">{alert.issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Local Discovery */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {LOCAL_DISCOVERY.filters.map((filter) => (
                <button key={filter} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                  {filter}
                </button>
              ))}
            </div>

            {/* Nearby Stores */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Store size={18} style={{ color: '#00F2FE' }} /> Nearby Stores
              </h3>
              <div className="space-y-3">
                {LOCAL_DISCOVERY.nearbyStores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.2)' }}>
                        <Store size={18} style={{ color: '#00F2FE' }} />
                      </div>
                      <div>
                        <div className="font-medium text-white">{store.name}</div>
                        <div className="text-xs text-white/50">{store.type} • {store.address}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{store.distance}</div>
                      <div className="text-xs" style={{ color: '#D4AF37' }}>Rating: {store.rating}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${store.openNow ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {store.openNow ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Services */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Wrench size={18} style={{ color: '#8b5cf6' }} /> Nearby Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LOCAL_DISCOVERY.nearbyServices.map((service) => (
                  <div key={service.id} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{service.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${service.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="text-sm text-white/50">{service.category} • {service.distance}</div>
                    <div className="text-xs mt-1" style={{ color: '#D4AF37' }}>Rating: {service.rating}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SmartPoint Eligibility */}
        {activeTab === 'smartpoint' && (
          <div className="space-y-6">
            {/* Eligible Categories */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap size={18} style={{ color: '#D4AF37' }} /> Point Earning Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SMARTPOINT_ELIGIBILITY.eligibleCategories.map((cat) => (
                  <div key={cat.category} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{cat.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${cat.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {cat.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm"><span style={{ color: '#D4AF37' }}>{cat.rate}</span> <span className="text-white/50">point earning rate</span></div>
                    <div className="text-xs text-white/50">Max: {formatCurrency(cat.cap)}/order</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaigns */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Gift size={18} style={{ color: '#00F2FE' }} /> Active Campaigns
              </h3>
              <div className="space-y-3">
                {SMARTPOINT_ELIGIBILITY.campaigns.map((camp) => (
                  <div key={camp.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{camp.name}</div>
                      <div className="text-sm" style={{ color: '#D4AF37' }}>{camp.bonus}</div>
                      <div className="text-xs text-white/50">{camp.startDate} - {camp.endDate}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(camp.status) + '30', color: getStatusColor(camp.status) }}>
                      {camp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Campaigns */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={18} style={{ color: '#8b5cf6' }} /> Corporate Partnerships
              </h3>
              <div className="space-y-3">
                {SMARTPOINT_ELIGIBILITY.corporateCampaigns.map((corp) => (
                  <div key={corp.company} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-medium text-white">{corp.company}</div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#D4AF37' }}>{corp.discount} + {corp.points}</div>
                      <div className="text-xs text-white/50">Valid: {corp.validUntil}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Engagement */}
        {activeTab === 'engagement' && (
          <div className="space-y-6">
            {/* Notifications Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Bell className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-xl font-bold text-white">{CUSTOMER_ENGAGEMENT.notifications.scheduled}</div>
                <div className="text-xs text-white/50">Scheduled</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{CUSTOMER_ENGAGEMENT.notifications.sent.toLocaleString()}</div>
                <div className="text-xs text-white/50">Sent</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <Eye className="w-6 h-6 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-xl font-bold text-white">{CUSTOMER_ENGAGEMENT.notifications.opened.toLocaleString()}</div>
                <div className="text-xs text-white/50">Opened</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-xl font-bold text-white">{CUSTOMER_ENGAGEMENT.notifications.pending}</div>
                <div className="text-xs text-white/50">Pending</div>
              </div>
            </div>

            {/* Active Coupons */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Gift size={18} style={{ color: '#D4AF37' }} /> Active Coupons
              </h3>
              <div className="space-y-3">
                {CUSTOMER_ENGAGEMENT.activeCoupons.map((coupon) => (
                  <div key={coupon.code} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <code className="text-sm px-2 py-1 rounded" style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>{coupon.code}</code>
                      <div className="text-sm text-white mt-1">{coupon.discount}</div>
                      <div className="text-xs text-white/50">Expires: {coupon.expiresOn}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-white">{coupon.usage}/{coupon.limit}</div>
                      <div className="text-white/50">used</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar size={18} style={{ color: '#8b5cf6' }} /> Upcoming Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CUSTOMER_ENGAGEMENT.events.map((event) => (
                  <div key={event.name} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-medium text-white mb-1">{event.name}</div>
                    <div className="text-xs text-white/50 mb-2">{event.date}</div>
                    <div className="text-sm"><span style={{ color: '#22c55e' }}>{event.registrations}</span> <span className="text-white/50">/{event.maxAttendees} registered</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Business */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMMUNITY_BUSINESS.categories.map((cat) => (
                <div key={cat.name} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                      <Users size={18} style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{cat.name}</div>
                      <div className="text-xs text-white/50">{cat.sellers} sellers</div>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: '#22c55e' }}>{cat.products} products</div>
                </div>
              ))}
            </div>

            {/* Featured Sellers */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={18} style={{ color: '#00F2FE' }} /> Featured Community Sellers
              </h3>
              <div className="space-y-3">
                {COMMUNITY_BUSINESS.featuredSellers.map((seller) => (
                  <div key={seller.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{seller.name}</div>
                      <div className="text-xs text-white/50">{seller.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#D4AF37' }}>Rating: {seller.rating}</div>
                      <div className="text-xs text-white/50">{seller.orders} orders</div>
                    </div>
                    <BadgeCheck size={18} style={{ color: '#22c55e' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Local Services */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Service Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {LOCAL_SERVICES.categories.map((cat) => (
                <div key={cat.name} className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Wrench className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                  <div className="font-semibold text-white">{cat.name}</div>
                  <div className="text-sm text-white/50">{cat.providers} providers</div>
                  <div className="text-xs" style={{ color: '#D4AF37' }}>Rating: {cat.avgRating}</div>
                </div>
              ))}
            </div>

            {/* Booking Requests */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar size={18} style={{ color: '#00F2FE' }} /> Booking Requests
              </h3>
              <div className="space-y-3">
                {LOCAL_SERVICES.bookingRequests.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{booking.service}</div>
                      <div className="text-xs text-white/50">{booking.provider} • {booking.customer}</div>
                      <div className="text-xs text-white/50">{booking.date} at {booking.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{formatCurrency(booking.amount)}</div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(booking.status) + '30', color: getStatusColor(booking.status) }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geo Matching */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-3">
                <MapPin size={18} style={{ color: '#22c55e' }} />
                <div>
                  <div className="font-medium text-white">Geo Matching</div>
                  <div className="text-xs text-white/50">Auto-assign nearby providers within {LOCAL_SERVICES.geoMatching.maxDistance}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${LOCAL_SERVICES.geoMatching.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {LOCAL_SERVICES.geoMatching.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        )}

        {/* Franchise Management */}
        {activeTab === 'franchise' && (
          <div className="space-y-6">
            {/* Regions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRANCHISE_MANAGEMENT.regions.map((region) => (
                <div key={region.id} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(236,72,153,0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-white">{region.name}</div>
                    <span style={{ color: '#22c55e' }}>{region.growth}</span>
                  </div>
                  <div className="text-sm text-white/50 mb-1">Manager: {region.manager}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{region.franchisees} franchisees</span>
                    <span style={{ color: '#D4AF37' }}>{formatCurrency(region.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Franchisees */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={18} style={{ color: '#D4AF37' }} /> Top Franchisees
              </h3>
              <div className="space-y-3">
                {FRANCHISE_MANAGEMENT.topFranchisees.map((franchisee) => (
                  <div key={franchisee.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{franchisee.name}</div>
                      <div className="text-xs text-white/50">{franchisee.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#D4AF37' }}>{formatCurrency(franchisee.revenue)}</div>
                      <div className="text-xs text-white/50">{franchisee.customers.toLocaleString()} customers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expansion Requests */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-yellow-400" /> Expansion Requests
              </h3>
              <div className="space-y-3">
                {FRANCHISE_MANAGEMENT.expansionRequests.map((req) => (
                  <div key={req.location} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <span className="text-white">{req.location}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white/50">{formatCurrency(req.investment)}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(req.status) + '30', color: getStatusColor(req.status) }}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Portal */}
        {activeTab === 'enterprise' && (
          <div className="space-y-6">
            {/* Multi-branch Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Building2 className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <div className="text-xl font-bold text-white">{ENTERPRISE_PORTAL.multibranchManagement.totalBranches}</div>
                <div className="text-xs text-white/50">Total Branches</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{ENTERPRISE_PORTAL.multibranchManagement.activeBranches}</div>
                <div className="text-xs text-white/50">Active</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-xl font-bold text-white">{ENTERPRISE_PORTAL.multibranchManagement.pendingApproval}</div>
                <div className="text-xs text-white/50">Pending</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Globe className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                <div className="text-xl font-bold text-white">{ENTERPRISE_PORTAL.brands.length}</div>
                <div className="text-xs text-white/50">Brands</div>
              </div>
            </div>

            {/* Enterprise Brands */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase size={18} style={{ color: '#D4AF37' }} /> Enterprise Brands
              </h3>
              <div className="space-y-3">
                {ENTERPRISE_PORTAL.brands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{brand.name}</div>
                      <div className="text-xs text-white/50">{brand.type} • {brand.branches} branches</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#D4AF37' }}>{formatCurrency(brand.revenue)}</div>
                      <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: getTierColor(brand.tier) + '30', color: getTierColor(brand.tier) }}>
                        {brand.tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Integration */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <div className="flex items-center gap-3">
                <Globe2 size={18} style={{ color: '#00F2FE' }} />
                <div>
                  <div className="font-medium text-white">API Integration</div>
                  <div className="text-xs text-white/50">{ENTERPRISE_PORTAL.apiIntegration.endpoints} endpoints • Last sync: {ENTERPRISE_PORTAL.apiIntegration.lastSync}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ENTERPRISE_PORTAL.apiIntegration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {ENTERPRISE_PORTAL.apiIntegration.status}
              </span>
            </div>
          </div>
        )}

        {/* AI Business Insights */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Sales Trend */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} style={{ color: '#22c55e' }} />
                  <div>
                    <div className="font-semibold text-white">Sales Trend</div>
                    <div className="text-sm text-white/50">{AI_BUSINESS_INSIGHTS.salesTrends.comparedTo}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: '#22c55e' }}>{AI_BUSINESS_INSIGHTS.salesTrends.percentage}</div>
                  <div className="text-xs text-white/50">{AI_BUSINESS_INSIGHTS.salesTrends.trend}</div>
                </div>
              </div>
              <p className="text-sm text-white/70">{AI_BUSINESS_INSIGHTS.salesTrends.prediction}</p>
            </div>

            {/* Demand Forecast */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(0,242,254,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={18} style={{ color: '#00F2FE' }} /> Demand Forecast
              </h3>
              <div className="space-y-3">
                {AI_BUSINESS_INSIGHTS.demandForecast.map((item) => (
                  <div key={item.product} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-medium text-white mb-2">{item.product}</div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/50">Current: <span style={{ color: '#D4AF37' }}>{item.currentDemand}</span></span>
                      <span className="text-white/50">Forecast: <span style={{ color: '#22c55e' }}>{item.forecastDemand}</span></span>
                    </div>
                    <div className="text-xs text-white/50">Recommendation: {item.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap size={18} style={{ color: '#8b5cf6' }} /> AI Recommendations
              </h3>
              <div className="space-y-2">
                {AI_BUSINESS_INSIGHTS.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <Target size={16} style={{ color: '#D4AF37' }} className="shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/50 mb-1">{rec.type}</div>
                      <div className="text-sm text-white">{rec.suggestion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Control */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                <div className="text-xl font-bold text-white">{ADMIN_CONTROL.analytics.totalPartners.toLocaleString()}</div>
                <div className="text-xs text-white/50">Total Partners</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.2)' }}>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#00F2FE' }} />
                <div className="text-xl font-bold text-white">{ADMIN_CONTROL.analytics.activePartners.toLocaleString()}</div>
                <div className="text-xs text-white/50">Active</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-xl font-bold text-white">{ADMIN_CONTROL.analytics.pendingApplications}</div>
                <div className="text-xs text-white/50">Pending</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Ban className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <div className="text-xl font-bold text-white">{ADMIN_CONTROL.analytics.suspendedPartners}</div>
                <div className="text-xs text-white/50">Suspended</div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-yellow-400" /> Pending Approvals
              </h3>
              <div className="space-y-3">
                {ADMIN_CONTROL.pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{approval.business}</div>
                      <div className="text-xs text-white/50">{approval.type} • Applied: {approval.appliedOn}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: getStatusColor(approval.status) + '30', color: getStatusColor(approval.status) }}>
                      {approval.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud Alerts */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" /> Fraud Alerts
              </h3>
              <div className="space-y-3">
                {ADMIN_CONTROL.fraudAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                      <div className="font-medium text-white">{alert.business}</div>
                      <div className="text-xs text-white/50">{alert.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-white/70">{alert.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Expansion */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            {/* Countries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GLOBAL_EXPANSION.countries.map((country) => (
                <div key={country.name} className="rounded-xl p-4" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid' + getStatusColor(country.status) + '40' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-white">{country.name}</div>
                    <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: getStatusColor(country.status) + '30', color: getStatusColor(country.status) }}>
                      {country.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/50 mb-2">
                    <div>{country.states} states/regions</div>
                    <div>{country.partners.toLocaleString()} partners</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: '#D4AF37' }}>{country.currency}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/50">{country.language.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Regions */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe size={18} style={{ color: '#D4AF37' }} /> Regional Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(GLOBAL_EXPANSION.regions).map(([region, data]) => (
                  <div key={region} className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="font-semibold capitalize text-white mb-2">{region}</div>
                    <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{data.countries}</div>
                    <div className="text-xs text-white/50">countries</div>
                    <div className="text-sm text-white/70 mt-1">{data.partners.toLocaleString()} partners</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Currency */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' }}>
              <h4 className="font-semibold text-white mb-3">Multi-Currency Support</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {GLOBAL_EXPANSION.multiCurrency.supported.map((curr) => (
                  <span key={curr} className="px-3 py-1 rounded-lg text-sm" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>{curr}</span>
                ))}
              </div>
              <div className="text-xs text-white/50">
                Auto-conversion: {GLOBAL_EXPANSION.multiCurrency.autoConversion ? 'Enabled' : 'Disabled'} • Tax: {GLOBAL_EXPANSION.multiCurrency.taxCompliance}
              </div>
            </div>
          </div>
        )}

        {/* Legal Compliance */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            {/* Audit Status */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(26,21,48,0.8))', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileCheck size={24} style={{ color: '#22c55e' }} />
                  <div>
                    <div className="font-semibold text-white">Compliance Score</div>
                    <div className="text-sm text-white/50">Last audit: {LEGAL_COMPLIANCE.auditStatus.lastAudit}</div>
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: '#22c55e' }}>{LEGAL_COMPLIANCE.auditStatus.complianceScore}</div>
              </div>
              <div className="flex items-center justify-between text-sm text-white/50">
                <span>Issues: {LEGAL_COMPLIANCE.auditStatus.issuesResolved}/{LEGAL_COMPLIANCE.auditStatus.issuesFound + LEGAL_COMPLIANCE.auditStatus.issuesResolved} resolved</span>
                <span>Next audit: {LEGAL_COMPLIANCE.auditStatus.nextAudit}</span>
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(26,21,48,0.8)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BadgeCheck size={18} style={{ color: '#22c55e' }} /> Enforced Rules
              </h3>
              <div className="space-y-3">
                {LEGAL_COMPLIANCE.rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <span className="text-white">{rule.rule}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">{rule.status}</span>
                      <span className="text-xs text-white/50">{rule.auditCount.toLocaleString()} audits</span>
                    </div>
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
