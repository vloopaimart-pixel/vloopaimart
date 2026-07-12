import { useState } from 'react';
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart, Folder,
  Wallet, Sparkles, QrCode, Heart, GraduationCap, BarChart3,
  Bell, Settings, FileText, ChevronRight, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Search, Filter, Eye, Edit2, Trash2, Plus, RefreshCw, Download,
  Calendar, MapPin, Phone, Mail, Shield, Award, Activity
} from 'lucide-react';
import {
  getMockAdminDashboardStats,
  getMockAdminUsers,
  getMockAdminMerchants,
  getMockAdminProducts,
  getMockAdminOrders,
  getMockAdminWalletTransactions,
  getMockAdminSmartCodes,
  getMockAdminCareClubActivities,
  getMockAdminAcademyStudents,
  getMockAdminQuickActions,
  getMockAdminAnalytics,
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  getStatusColor,
  getPriorityColor,
  SIDEBAR_MENU_ITEMS,
  type AdminDashboardStats,
  type AdminUser,
  type AdminMerchant,
  type AdminProduct,
  type AdminOrder,
  type AdminWalletTransaction,
  type AdminSmartCode,
  type AdminCareClubActivity,
  type AdminAcademyStudent,
  type AdminQuickAction,
  type AdminAnalytics,
} from '../lib/EnterpriseAdminEngine';

type EnterpriseAdminPageProps = {
  onNavigate: (page: string) => void;
};

type MenuItemId = typeof SIDEBAR_MENU_ITEMS[number]['id'];

export default function EnterpriseAdminPage({ onNavigate }: EnterpriseAdminPageProps) {
  const [activeSection, setActiveSection] = useState<MenuItemId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = getMockAdminDashboardStats();
  const analytics = getMockAdminAnalytics();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection stats={stats} analytics={analytics} />;
      case 'users':
        return <UsersSection />;
      case 'merchants':
        return <MerchantsSection />;
      case 'products':
        return <ProductsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'wallet':
        return <WalletSection />;
      case 'smartcodes':
        return <SmartCodesSection />;
      case 'care-club':
        return <CareClubSection />;
      case 'academy':
        return <AcademySection />;
      case 'reports':
        return <ReportsSection analytics={analytics} />;
      case 'notifications':
        return <NotificationsSection />;
      case 'settings':
        return <SettingsSection />;
      case 'audit-logs':
        return <AuditLogsSection />;
      default:
        return <DashboardSection stats={stats} analytics={analytics} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="font-bold text-sm">Enterprise Admin</div>
                <div className="text-xs text-slate-400">Control Center</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {SIDEBAR_MENU_ITEMS.map((item) => (
              <SidebarButton
                key={item.id}
                item={item}
                active={activeSection === item.id}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveSection(item.id as MenuItemId)}
              />
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} flex-1 transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================

function SidebarButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: typeof SIDEBAR_MENU_ITEMS[number];
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const icons: Record<string, React.ElementType> = {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    Folder,
    Wallet,
    Sparkles,
    QrCode,
    Heart,
    GraduationCap,
    BarChart3,
    Bell,
    Settings,
    FileText,
  };
  const Icon = icons[item.icon] || LayoutDashboard;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        active
          ? 'bg-indigo-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </button>
  );
}

// ============================================================
// DASHBOARD SECTION
// ============================================================

function DashboardSection({ stats, analytics }: { stats: AdminDashboardStats; analytics: AdminAnalytics }) {
  const quickActions = getMockAdminQuickActions();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={formatNumber(stats.total_users)} change={+2.4} icon={Users} color="from-blue-500 to-indigo-600" />
        <StatCard title="Merchants" value={formatNumber(stats.total_merchants)} change={+1.8} icon={Store} color="from-emerald-500 to-teal-600" />
        <StatCard title="Products" value={formatNumber(stats.total_products)} change={+3.2} icon={Package} color="from-violet-500 to-purple-600" />
        <StatCard title="Orders Today" value={formatNumber(stats.orders_today)} change={+5.6} icon={ShoppingCart} color="from-amber-500 to-orange-600" />
        <StatCard title="Pending Deliveries" value={formatNumber(stats.pending_deliveries)} icon={TruckIcon} color="from-cyan-500 to-blue-600" />
        <StatCard title="SmartPoints Today" value={formatNumber(stats.smartpoints_generated_today)} change={+8.2} icon={Sparkles} color="from-pink-500 to-rose-600" />
        <StatCard title="Wallet Txns" value={formatNumber(stats.wallet_transactions_today)} change={+4.5} icon={Wallet} color="from-indigo-500 to-blue-600" />
        <StatCard title="Care Club" value={formatNumber(stats.care_club_members)} change={+2.1} icon={Heart} color="from-red-500 to-pink-600" />
        <StatCard title="Academy Students" value={formatNumber(stats.academy_students)} change={+6.3} icon={GraduationCap} color="from-emerald-500 to-green-600" />
        <StatCard title="Active SmartCodes" value={formatNumber(stats.active_smartcodes)} change={+12.5} icon={QrCode} color="from-slate-500 to-gray-600" />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Orders Trend" data={analytics.orders} color="indigo" />
        <ChartCard title="Revenue Trend" data={analytics.revenue} color="emerald" isCurrency />
      </div>

      {/* Widgets Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Latest Orders */}
        <WidgetCard title="Latest Orders" icon={ShoppingCart}>
          <div className="space-y-3">
            {getMockAdminOrders().slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{order.order_number}</div>
                  <div className="text-xs text-gray-500">{order.customer_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(order.total)}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Recent Users */}
        <WidgetCard title="Recent Users" icon={Users}>
          <div className="space-y-3">
            {getMockAdminUsers().slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Quick Actions */}
        <WidgetCard title="Quick Actions" icon={AlertTriangle}>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.target_name}</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Action
                </button>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Secondary Widgets */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Merchant Requests */}
        <WidgetCard title="Merchant Requests" icon={Store}>
          <div className="space-y-3">
            {getMockAdminMerchants().filter(m => m.status === 'pending').map((merchant) => (
              <div key={merchant.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="font-medium text-sm">{merchant.business_name}</div>
                <div className="text-xs text-gray-500">{merchant.owner_name}</div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700">Approve</button>
                  <button className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Product Approvals */}
        <WidgetCard title="Product Approvals" icon={Package}>
          <div className="space-y-3">
            {getMockAdminProducts().filter(p => p.approval_status === 'pending').map((product) => (
              <div key={product.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-gray-500">{product.merchant_name}</div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded">Approve</button>
                  <button className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Wallet Activity */}
        <WidgetCard title="Wallet Activity" icon={Activity}>
          <div className="space-y-3">
            {getMockAdminWalletTransactions().slice(0, 3).map((txn) => (
              <div key={txn.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-sm">{txn.user_name}</div>
                    <div className="text-xs text-gray-500 capitalize">{txn.type}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-sm ${txn.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {txn.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Support Tickets */}
        <WidgetCard title="Support Tickets" icon={AlertTriangle}>
          <div className="text-center py-6">
            <div className="text-3xl font-bold text-gray-900">{stats.support_tickets_open}</div>
            <div className="text-sm text-gray-600">Open Tickets</div>
            <div className="text-xs text-gray-400 mt-1">{stats.support_tickets_today} new today</div>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
              View All
            </button>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

// ============================================================
// USERS SECTION
// ============================================================

function UsersSection() {
  const users = getMockAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600">Manage all platform users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trust Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SmartPoints</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize text-sm text-gray-600">{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{user.trust_score}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-indigo-600">{formatNumber(user.smartpoints_balance)} SP</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.status !== 'suspended' && (
                      <button className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
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
// MERCHANTS SECTION
// ============================================================

function MerchantsSection() {
  const merchants = getMockAdminMerchants();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Merchant Management</h2>
          <p className="text-sm text-gray-600">Review and manage merchant accounts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid gap-4">
        {merchants.map((merchant) => (
          <div key={merchant.id} className="bg-white rounded-xl shadow border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {merchant.store_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{merchant.business_name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(merchant.status)}`}>
                      {merchant.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{merchant.store_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {merchant.owner_name} • {merchant.owner_email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{merchant.total_products}</div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{formatNumber(merchant.total_orders)}</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-emerald-600">{formatCurrency(merchant.total_revenue)}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
                <div className="flex gap-2">
                  {merchant.status === 'pending' && (
                    <>
                      <button className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Approve</button>
                      <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Reject</button>
                    </>
                  )}
                  {merchant.status === 'active' && (
                    <button className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">Suspend</button>
                  )}
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTS SECTION
// ============================================================

function ProductsSection() {
  const products = getMockAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-600">Review and approve products</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Merchant</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.merchant_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 text-sm">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {product.approval_status === 'pending' && (
                      <>
                        <button className="px-2 py-1 text-xs bg-emerald-600 text-white rounded">Approve</button>
                        <button className="px-2 py-1 text-xs bg-red-600 text-white rounded">Reject</button>
                      </>
                    )}
                    <button className="p-1.5 rounded bg-gray-100 text-gray-600">
                      <Eye className="w-4 h-4" />
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
// ORDERS SECTION
// ============================================================

function OrdersSection() {
  const orders = getMockAdminOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-600">Track and manage all orders</p>
        </div>
        <div className="flex gap-2">
          <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Merchant</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-indigo-600">{order.order_number}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.customer_name}</div>
                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.merchant_name}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4">
                  <button className="p-1.5 rounded bg-gray-100 text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
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
// WALLET SECTION
// ============================================================

function WalletSection() {
  const transactions = getMockAdminWalletTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Wallet Management</h2>
          <p className="text-sm text-gray-600">Monitor wallet transactions</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-80">Total Volume</div>
          <div className="text-2xl font-bold">{formatCurrency(12500000)}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-80">Today's Volume</div>
          <div className="text-2xl font-bold">{formatCurrency(850000)}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-80">Pending Settlements</div>
          <div className="text-2xl font-bold">{formatCurrency(450000)}</div>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-80">Frozen Wallets</div>
          <div className="text-2xl font-bold">12</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{txn.user_name}</div>
                </td>
                <td className="px-6 py-4 text-sm capitalize text-gray-600">{txn.type}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${txn.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {txn.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount))}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{txn.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(txn.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// SMARTCODES SECTION
// ============================================================

function SmartCodesSection() {
  const smartcodes = getMockAdminSmartCodes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">SmartCode Management</h2>
          <p className="text-sm text-gray-600">Monitor SmartCode activity</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Points Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Scans</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {smartcodes.map((sc) => (
              <tr key={sc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">{sc.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{sc.user_name}</td>
                <td className="px-6 py-4 text-sm capitalize text-gray-600">{sc.type}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{sc.points_value} SP</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sc.scans_count}/{sc.max_scans}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sc.status)}`}>
                    {sc.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {sc.status === 'active' && (
                      <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Suspend</button>
                    )}
                    <button className="p-1.5 rounded bg-gray-100 text-gray-600">
                      <Eye className="w-4 h-4" />
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
// CARE CLUB SECTION
// ============================================================

function CareClubSection() {
  const activities = getMockAdminCareClubActivities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Care Club Management</h2>
          <p className="text-sm text-gray-600">Monitor contributions and volunteer activities</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cause</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Beneficiaries</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{activity.user_name}</td>
                <td className="px-6 py-4 text-sm capitalize text-gray-600">{activity.type.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{activity.cause}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {activity.amount > 0 ? formatCurrency(activity.amount) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{activity.beneficiaries}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(activity.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// ACADEMY SECTION
// ============================================================

function AcademySection() {
  const students = getMockAdminAcademyStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Academy Management</h2>
          <p className="text-sm text-gray-600">Track student progress</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Courses</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Completed</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Certificates</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SmartPoints</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.enrolled_courses}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.completed_courses}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">{student.certificates}</span>
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-indigo-600">{student.smartpoints_earned} SP</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(student.last_activity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// REPORTS SECTION
// ============================================================

function ReportsSection({ analytics }: { analytics: AdminAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-sm text-gray-600">Platform performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="User Growth" data={analytics.users} color="blue" />
        <ChartCard title="Merchant Growth" data={analytics.merchants} color="emerald" />
        <ChartCard title="Orders Trend" data={analytics.orders} color="indigo" />
        <ChartCard title="Revenue Trend" data={analytics.revenue} color="amber" isCurrency />
      </div>
    </div>
  );
}

// ============================================================
// NOTIFICATIONS SECTION
// ============================================================

function NotificationsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Notification Center</h2>
          <p className="text-sm text-gray-600">Create and manage notifications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
          <Plus className="w-4 h-4" />
          Create Notification
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No active notifications</p>
          <p className="text-sm mt-1">Create a new notification to send to users</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS SECTION
// ============================================================

function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">System Settings</h2>
        <p className="text-sm text-gray-600">Configure platform settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Platform Name</span>
              <span className="font-medium">VLOOP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Maintenance Mode</span>
              <button className="w-10 h-6 bg-gray-200 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Registration Open</span>
              <button className="w-10 h-6 bg-emerald-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">SmartPoints Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Points per ₹100 purchase</span>
              <span className="font-medium">10 SP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Daily Login Bonus</span>
              <span className="font-medium">5 SP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Referral Bonus</span>
              <span className="font-medium">200 SP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AUDIT LOGS SECTION
// ============================================================

function AuditLogsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Audit Logs</h2>
          <p className="text-sm text-gray-600">Track all admin actions</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Audit logs will appear here</p>
          <p className="text-sm mt-1">All admin actions are logged for security</p>
        </div>
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
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {change !== undefined && (
          <span className={`flex items-center text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  );
}

function WidgetCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ChartCard({
  title,
  data,
  color,
  isCurrency,
}: {
  title: string;
  data: { date: string; value: number }[];
  color: string;
  isCurrency?: boolean;
}) {
  const maxValue = Math.max(...data.map(d => d.value));

  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-300',
    emerald: 'from-emerald-500 to-emerald-300',
    blue: 'from-blue-500 to-blue-300',
    amber: 'from-amber-500 to-amber-300',
    violet: 'from-violet-500 to-violet-300',
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-40 flex items-end gap-1">
        {data.slice(-14).map((point, i) => {
          const height = (point.value / maxValue) * 100;
          return (
            <div
              key={i}
              className={`flex-1 bg-gradient-to-t ${colorClasses[color]} rounded-t transition-all hover:opacity-80`}
              style={{ height: `${height}%` }}
              title={isCurrency ? formatCurrency(point.value) : formatNumber(point.value)}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>14 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 17H4V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <path d="M14 17h6V9h-6v8Z" />
      <path d="M14 9h6l-4-4h-2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
