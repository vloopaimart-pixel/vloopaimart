import { useState } from 'react';
import {
  Store, Package, ShoppingBag, IndianRupee, TrendingUp, AlertCircle,
  Shield, Award, Star, Edit2, Trash2, Eye, EyeOff, Plus, Search,
  Filter, ChevronRight, Clock, CheckCircle, Truck, XCircle, RotateCcw,
  Wallet, Sparkles, BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Calendar, Settings, User, MapPin, Phone, Mail, Globe, FileText,
  CreditCard, Building2, Lock, Unlock, MoreVertical
} from 'lucide-react';
import {
  getMockMerchantProfile,
  getMockMerchantProducts,
  getMockMerchantOrders,
  getMockMerchantWallet,
  getMockMerchantDashboardStats,
  getMockMerchantAnalytics,
  formatCurrency,
  formatSmartPoints,
  getVerificationBadgeColor,
  getVerificationBadgeText,
  getStockStatusColor,
  getTrustLevel,
  formatDate,
  ORDER_STATUS_COLORS,
  DELIVERY_STATUS_COLORS,
  type MerchantProfile,
  type MerchantProduct,
  type MerchantOrder,
  type MerchantWallet,
  type MerchantDashboardStats,
  type MerchantAnalytics,
} from '../lib/MerchantPortalEngine';

type MerchantPortalPageProps = {
  onNavigate: (page: string) => void;
};

export default function MerchantPortalPage({ onNavigate }: MerchantPortalPageProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'orders' | 'wallet' | 'analytics' | 'profile'>('dashboard');

  const profile = getMockMerchantProfile();
  const products = getMockMerchantProducts();
  const orders = getMockMerchantOrders();
  const wallet = getMockMerchantWallet();
  const stats = getMockMerchantDashboardStats();
  const analytics = getMockMerchantAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white py-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Store Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Store className="w-8 h-8 text-indigo-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold">{profile.store_name}</h1>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getVerificationBadgeColor(profile.verification_level)} text-white`}>
                    {getVerificationBadgeText(profile.verification_level)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-200">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Trust: {profile.trust_score} ({getTrustLevel(profile.trust_score)})
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {profile.average_rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <div className="text-xl font-bold">{profile.total_products}</div>
                <div className="text-xs text-blue-200">Products</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <div className="text-xl font-bold">{stats.today_orders}</div>
                <div className="text-xs text-blue-200">Orders Today</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <div className="text-xl font-bold">{formatCurrency(stats.monthly_revenue).replace('₹', '₹')}</div>
                <div className="text-xs text-blue-200">Monthly</div>
              </div>
              <div className={`px-3 py-2 rounded-xl ${profile.store_status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                <span className="text-sm font-medium capitalize">{profile.store_status}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-16 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto hide-scrollbar">
            <NavButton active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} icon={Store} label="Dashboard" />
            <NavButton active={activeSection === 'products'} onClick={() => setActiveSection('products')} icon={Package} label="Products" />
            <NavButton active={activeSection === 'orders'} onClick={() => setActiveSection('orders')} icon={ShoppingBag} label="Orders" />
            <NavButton active={activeSection === 'wallet'} onClick={() => setActiveSection('wallet')} icon={Wallet} label="Wallet" />
            <NavButton active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} icon={BarChart3} label="Analytics" />
            <NavButton active={activeSection === 'profile'} onClick={() => setActiveSection('profile')} icon={User} label="Profile" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeSection === 'dashboard' && (
          <DashboardSection stats={stats} profile={profile} products={products} orders={orders} analytics={analytics} />
        )}
        {activeSection === 'products' && (
          <ProductsSection products={products} />
        )}
        {activeSection === 'orders' && (
          <OrdersSection orders={orders} />
        )}
        {activeSection === 'wallet' && (
          <WalletSection wallet={wallet} />
        )}
        {activeSection === 'analytics' && (
          <AnalyticsSection analytics={analytics} stats={stats} />
        )}
        {activeSection === 'profile' && (
          <ProfileSection profile={profile} />
        )}
      </main>
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

function NavButton({
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

// ============================================================
// DASHBOARD SECTION
// ============================================================

function DashboardSection({
  stats,
  profile,
  products,
  orders,
  analytics,
}: {
  stats: MerchantDashboardStats;
  profile: MerchantProfile;
  products: MerchantProduct[];
  orders: MerchantOrder[];
  analytics: MerchantAnalytics;
}) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Products"
          value={stats.total_products}
          icon={Package}
          color="from-blue-500 to-indigo-600"
          subtitle={`${stats.active_products} active`}
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={ShoppingBag}
          color="from-emerald-500 to-teal-600"
          subtitle={`${stats.completed_orders} completed`}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending_orders}
          icon={Clock}
          color="from-amber-500 to-orange-600"
          subtitle={`${stats.processing_orders} processing`}
        />
        <StatCard
          title="Completed"
          value={stats.completed_orders}
          icon={CheckCircle}
          color="from-green-500 to-emerald-600"
          subtitle="Total delivered"
        />
        <StatCard
          title="Monthly Sales"
          value={formatCurrency(stats.monthly_revenue)}
          icon={IndianRupee}
          color="from-violet-500 to-purple-600"
          subtitle={`${stats.monthly_orders} orders`}
        />
        <StatCard
          title="Wallet Balance"
          value={formatCurrency(stats.wallet_balance)}
          icon={Wallet}
          color="from-cyan-500 to-blue-600"
          subtitle={`${formatCurrency(stats.pending_settlement)} pending`}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton icon={Plus} label="Add Product" color="bg-blue-100 text-blue-600" />
          <QuickActionButton icon={ShoppingBag} label="View Orders" color="bg-emerald-100 text-emerald-600" />
          <QuickActionButton icon={Wallet} label="Request Payout" color="bg-violet-100 text-violet-600" />
          <QuickActionButton icon={BarChart3} label="View Reports" color="bg-amber-100 text-amber-600" />
        </div>
      </div>

      {/* Recent Orders & Low Stock Alert */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{order.order_number}</div>
                  <div className="text-xs text-gray-500">{order.customer_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(order.total)}</div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.order_status]}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Low Stock Alert
            </h3>
            <span className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-medium">
              {products.filter(p => p.stock_status !== 'in_stock').length} items
            </span>
          </div>
          <div className="space-y-3">
            {products.filter(p => p.stock_status !== 'in_stock').map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{product.product_name}</div>
                    <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{product.stock_quantity} left</div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStockStatusColor(product.stock_status)}`}>
                    {product.stock_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg">Revenue Overview</h3>
            <p className="text-indigo-200 text-sm">Last 30 days performance</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-indigo-200">Total Revenue</div>
            <div className="text-2xl font-bold">{formatCurrency(analytics.total_revenue)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-indigo-200">Avg Order Value</div>
            <div className="text-2xl font-bold">{formatCurrency(analytics.average_order_value)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-indigo-200">Products Sold</div>
            <div className="text-2xl font-bold">{analytics.total_products_sold}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTS SECTION
// ============================================================

function ProductsSection({ products }: { products: MerchantProduct[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.stock_status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your inventory and product listings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Visibility</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Cards - Mobile */}
      <div className="md:hidden grid gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: MerchantProduct }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.product_name}</div>
            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{product.category}</span>
        {product.subcategory && (
          <span className="text-xs text-gray-400"> / {product.subcategory}</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{formatCurrency(product.price)}</div>
        {product.compare_at_price && (
          <div className="text-xs text-gray-400 line-through">{formatCurrency(product.compare_at_price)}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{product.stock_quantity}</span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStockStatusColor(product.stock_status)}`}>
            {product.stock_status.replace('_', ' ')}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <button className={`p-1.5 rounded-lg ${product.is_visible ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
          {product.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProductCard({ product }: { product: MerchantProduct }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium text-gray-900">{product.product_name}</div>
              <div className="text-xs text-gray-500">SKU: {product.sku}</div>
            </div>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStockStatusColor(product.stock_status)}`}>
              {product.stock_status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="font-semibold text-gray-900">{formatCurrency(product.price)}</div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-400">
                {product.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS SECTION
// ============================================================

function OrdersSection({ orders }: { orders: MerchantOrder[] }) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter((order) => {
    return filterStatus === 'all' || order.order_status === filterStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    confirmed: orders.filter(o => o.order_status === 'confirmed').length,
    processing: orders.filter(o => o.order_status === 'processing').length,
    shipped: orders.filter(o => o.order_status === 'shipped').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-600">Track and manage customer orders</p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <FilterPill active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} label={`All (${statusCounts.all})`} />
        <FilterPill active={filterStatus === 'pending'} onClick={() => setFilterStatus('pending')} label={`Pending (${statusCounts.pending})`} />
        <FilterPill active={filterStatus === 'processing'} onClick={() => setFilterStatus('processing')} label={`Processing (${statusCounts.processing})`} />
        <FilterPill active={filterStatus === 'shipped'} onClick={() => setFilterStatus('shipped')} label={`Shipped (${statusCounts.shipped})`} />
        <FilterPill active={filterStatus === 'delivered'} onClick={() => setFilterStatus('delivered')} label={`Delivered (${statusCounts.delivered})`} />
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders Cards - Mobile */}
      <div className="md:hidden grid gap-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
      }`}
    >
      {label}
    </button>
  );
}

function OrderRow({ order }: { order: MerchantOrder }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-medium text-indigo-600">{order.order_number}</div>
        <div className="text-xs text-gray-500">{order.items.length} items</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{order.customer_name}</div>
        <div className="text-xs text-gray-500">{order.customer_phone || 'No phone'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{formatCurrency(order.total)}</div>
        <div className="text-xs text-gray-500">{order.smartpoints_earned} SP earned</div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.order_status]}`}>
          {order.order_status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 capitalize">{order.payment_method}</div>
        <span className={`text-xs font-medium ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
          {order.payment_status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${DELIVERY_STATUS_COLORS[order.delivery_status]}`}>
          {order.delivery_status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{formatDate(order.created_at)}</div>
      </td>
    </tr>
  );
}

function OrderCard({ order }: { order: MerchantOrder }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium text-indigo-600">{order.order_number}</div>
          <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.order_status]}`}>
          {order.order_status}
        </span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-medium text-gray-900">{order.customer_name}</div>
          <div className="text-xs text-gray-500">{order.items.map(i => i.product_name).slice(0, 2).join(', ')}{order.items.length > 2 && '...'}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900">{formatCurrency(order.total)}</div>
          <div className="text-xs text-gray-500">{order.payment_method}</div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${DELIVERY_STATUS_COLORS[order.delivery_status]}`}>
          {order.delivery_status.replace('_', ' ')}
        </span>
        <button className="text-sm text-indigo-600 font-medium">View Details</button>
      </div>
    </div>
  );
}

// ============================================================
// WALLET SECTION
// ============================================================

function WalletSection({ wallet }: { wallet: MerchantWallet }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Merchant Wallet</h2>
        <p className="text-gray-600">Manage your earnings and settlements</p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <BalanceCard
          title="Available Balance"
          amount={wallet.available_balance}
          icon={Unlock}
          color="from-emerald-500 to-teal-600"
          subtitle="Ready for withdrawal"
        />
        <BalanceCard
          title="Pending Settlement"
          amount={wallet.pending_settlement}
          icon={Clock}
          color="from-amber-500 to-orange-600"
          subtitle="Being processed"
        />
        <BalanceCard
          title="Lifetime Earnings"
          amount={wallet.lifetime_earnings}
          icon={TrendingUp}
          color="from-blue-500 to-indigo-600"
          subtitle={`Total: ${wallet.total_withdrawn} withdrawn`}
        />
        <BalanceCard
          title="SmartPoints Issued"
          amount={wallet.smartpoints_issued}
          icon={Sparkles}
          color="from-violet-500 to-purple-600"
          subtitle="To customers"
          isPoints
        />
      </div>

      {/* Settlement Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Settlement Cycle: {wallet.settlement_cycle.charAt(0).toUpperCase() + wallet.settlement_cycle.slice(1)}</h3>
            <p className="text-indigo-200 text-sm">
              Last: {wallet.last_settlement_date ? formatDate(wallet.last_settlement_date) : 'N/A'} |
              Next: {wallet.next_settlement_date ? formatDate(wallet.next_settlement_date) : 'N/A'}
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
            Request Early Settlement
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {getMockMerchantTransactions().slice(0, 5).map((txn) => (
            <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  txn.transaction_type === 'order_payment' ? 'bg-emerald-100 text-emerald-600' :
                  txn.transaction_type === 'settlement' ? 'bg-blue-100 text-blue-600' :
                  txn.transaction_type === 'withdrawal' ? 'bg-violet-100 text-violet-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {txn.transaction_type === 'order_payment' ? <ShoppingBag className="w-5 h-5" /> :
                   txn.transaction_type === 'settlement' ? <CheckCircle className="w-5 h-5" /> :
                   txn.transaction_type === 'withdrawal' ? <IndianRupee className="w-5 h-5" /> :
                   <RotateCcw className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm capitalize">{txn.transaction_type.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-500">{txn.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${txn.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {txn.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount))}
                </div>
                <div className="text-xs text-gray-500">{formatDate(txn.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BalanceCard({
  title,
  amount,
  icon: Icon,
  color,
  subtitle,
  isPoints,
}: {
  title: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  subtitle: string;
  isPoints?: boolean;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/80">{title}</span>
        <Icon className="w-5 h-5 text-white/80" />
      </div>
      <div className="text-2xl font-bold mb-1">{isPoints ? formatSmartPoints(amount) : formatCurrency(amount)}</div>
      <div className="text-xs text-white/70">{subtitle}</div>
    </div>
  );
}

// ============================================================
// ANALYTICS SECTION
// ============================================================

function AnalyticsSection({ analytics, stats }: { analytics: MerchantAnalytics; stats: MerchantDashboardStats }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Store Analytics</h2>
        <p className="text-gray-600">Performance overview and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={analytics.total_orders}
          change={+12}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analytics.total_revenue)}
          change={+8.5}
          icon={IndianRupee}
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(analytics.average_order_value)}
          change={-2.3}
          icon={TrendingUp}
        />
        <MetricCard
          title="Products Sold"
          value={analytics.total_products_sold}
          change={+15}
          icon={Package}
        />
    </div>

      {/* Charts Section - Visual Representation */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Revenue Trend (30 Days)</h3>
          <div className="h-48 flex items-end gap-1">
            {analytics.revenue_by_day.slice(-14).map((point, i) => {
              const height = (point.revenue / 60000) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg transition-all hover:from-indigo-600 hover:to-indigo-400"
                  style={{ height: `${height}%` }}
                  title={`${point.revenue}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Orders by Status</h3>
          <div className="space-y-4">
            {Object.entries(analytics.orders_by_status).slice(0, 5).map(([status, count]) => {
              const total = Object.values(analytics.orders_by_status).reduce((a, b) => a + b, 0);
              const percentage = (count / total) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-600">{status}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === 'delivered' ? 'bg-emerald-500' :
                        status === 'pending' ? 'bg-amber-500' :
                        status === 'shipped' ? 'bg-blue-500' :
                        status === 'cancelled' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {analytics.top_products.map((product, i) => (
            <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.product_name}</div>
                  <div className="text-xs text-gray-500">{product.units_sold} units sold</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        <span>{Math.abs(change)}%</span>
        <span className="text-gray-400">vs last period</span>
      </div>
    </div>
  );
}

// ============================================================
// PROFILE SECTION
// ============================================================

function ProfileSection({ profile }: { profile: MerchantProfile }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Merchant Profile</h2>
        <p className="text-gray-600">Your business information and settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Business Information
          </h3>
          <div className="space-y-4">
            <ProfileField icon={Store} label="Business Name" value={profile.business_name} />
            <ProfileField icon={Store} label="Store Name" value={profile.store_name} />
            <ProfileField icon={Globe} label="Store Slug" value={profile.store_slug} />
            <ProfileField icon={FileText} label="GST Number" value={profile.gst_number || 'Not provided'} />
            <ProfileField icon={FileText} label="PAN Number" value={profile.pan_number || 'Not provided'} />
            <ProfileField icon={MapPin} label="Address" value={`${profile.address_line1}, ${profile.address_line2 || ''} ${profile.city}, ${profile.state} - ${profile.pincode}`} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-indigo-600" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <ProfileField icon={Phone} label="Phone" value={profile.phone} />
            <ProfileField icon={Mail} label="Email" value={profile.email} />
            <ProfileField icon={Globe} label="Website" value={profile.website || 'Not provided'} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              Bank Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Account Name</span>
                <span className="font-medium text-gray-900">{profile.bank_account_name || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium text-gray-900">{profile.bank_account_number || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Bank Name</span>
                <span className="font-medium text-gray-900">{profile.bank_name || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600">UPI ID</span>
                <span className="font-medium text-gray-900">{profile.upi_id || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:col-span-2">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Account Status
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Store Status</div>
              <div className={`font-semibold capitalize ${profile.store_status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {profile.store_status}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Verification</div>
              <div className="font-semibold capitalize text-indigo-600">{profile.verification_level}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Subscription</div>
              <div className="font-semibold capitalize text-violet-600">{profile.subscription_plan}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Member Since</div>
              <div className="font-semibold text-gray-900">{formatDate(profile.member_since)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium text-gray-900">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
    </button>
  );
}

// Import getMockMerchantTransactions for wallet display
import { getMockMerchantTransactions } from '../lib/MerchantPortalEngine';
