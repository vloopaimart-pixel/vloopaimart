/**
 * VLOOP Enterprise Admin Control Center Engine
 * Phase 11 — Professional Admin Dashboard
 */

import { supabase } from './supabase';

export const ENTERPRISE_ADMIN_VERSION = '11.0.0' as const;

// ============================================================
// TYPES
// ============================================================

export interface AdminDashboardStats {
  total_users: number;
  new_users_today: number;
  active_users_today: number;
  total_merchants: number;
  pending_merchant_requests: number;
  active_merchants: number;
  total_products: number;
  pending_products: number;
  active_products: number;
  orders_today: number;
  pending_orders: number;
  completed_orders_today: number;
  pending_deliveries: number;
  smartpoints_generated_today: number;
  smartpoints_total: number;
  wallet_transactions_today: number;
  wallet_volume_today: number;
  care_club_members: number;
  care_contributions_today: number;
  academy_students: number;
  active_courses: number;
  active_smartcodes: number;
  smartcodes_scanned_today: number;
  support_tickets_open: number;
  support_tickets_today: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'merchant' | 'admin' | 'support';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  trust_score: number;
  smartpoints_balance: number;
  wallet_balance: number;
  created_at: string;
  last_login_at: string | null;
  email_verified: boolean;
  phone_verified: boolean;
}

export interface AdminMerchant {
  id: string;
  business_name: string;
  store_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  logo_url: string | null;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  verification_level: 'pending' | 'basic' | 'standard' | 'premium';
  trust_score: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  created_at: string;
  request_date: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  merchant_name: string;
  merchant_id: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'pending' | 'rejected' | 'suspended';
  visibility: boolean;
  images: string[];
  created_at: string;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  merchant_name: string;
  total: number;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_status: 'not_shipped' | 'shipped' | 'in_transit' | 'delivered';
  smartpoints_earned: number;
  created_at: string;
}

export interface AdminWalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer' | 'settlement' | 'refund';
  user_id: string;
  user_name: string;
  amount: number;
  balance_after: number;
  category: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface AdminSmartCode {
  id: string;
  code: string;
  user_id: string;
  user_name: string;
  type: 'product' | 'batch' | 'campaign';
  status: 'active' | 'used' | 'expired' | 'suspended';
  points_value: number;
  scans_count: number;
  max_scans: number;
  created_at: string;
  expires_at: string | null;
}

export interface AdminCareClubActivity {
  id: string;
  user_id: string;
  user_name: string;
  type: 'contribution' | 'volunteer' | 'emergency_request';
  amount: number;
  cause: string;
  beneficiaries: number;
  status: 'completed' | 'pending' | 'processing';
  created_at: string;
}

export interface AdminAcademyStudent {
  id: string;
  user_id: string;
  name: string;
  email: string;
  enrolled_courses: number;
  completed_courses: number;
  certificates: number;
  smartpoints_earned: number;
  status: 'active' | 'inactive' | 'suspended';
  last_activity: string;
  enrolled_at: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'promotion';
  target: 'all' | 'users' | 'merchants' | 'admins';
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: 'user' | 'merchant' | 'product' | 'order' | 'wallet' | 'system';
  target_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface AdminAnalytics {
  period: string;
  orders: AdminAnalyticsPoint[];
  revenue: AdminAnalyticsPoint[];
  users: AdminAnalyticsPoint[];
  merchants: AdminAnalyticsPoint[];
  wallet_activity: AdminAnalyticsPoint[];
}

export interface AdminAnalyticsPoint {
  date: string;
  value: number;
}

export interface AdminQuickAction {
  id: string;
  action_type: 'approve_merchant' | 'reject_merchant' | 'approve_product' | 'suspend_user' | 'freeze_wallet' | 'send_notification' | 'create_offer';
  title: string;
  description: string;
  target_id: string;
  target_name: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
}

export const SIDEBAR_MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'merchants', label: 'Merchants', icon: 'Store' },
  { id: 'products', label: 'Products', icon: 'Package' },
  { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
  { id: 'categories', label: 'Categories', icon: 'Folder' },
  { id: 'wallet', label: 'Wallet', icon: 'Wallet' },
  { id: 'smartpoints', label: 'SmartPoints', icon: 'Sparkles' },
  { id: 'smartcodes', label: 'SmartCodes', icon: 'QrCode' },
  { id: 'care-club', label: 'Care Club', icon: 'Heart' },
  { id: 'academy', label: 'Academy', icon: 'GraduationCap' },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'settings', label: 'System Settings', icon: 'Settings' },
  { id: 'audit-logs', label: 'Audit Logs', icon: 'FileText' },
] as const;

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getAdminDashboardStats(): Promise<AdminDashboardStats | null> {
  const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
  if (error) throw error;
  return data as AdminDashboardStats | null;
}

export async function getAdminUsers(limit?: number): Promise<AdminUser[]> {
  let query = supabase
    .from('admin_users_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AdminUser[];
}

export async function getAdminMerchants(limit?: number): Promise<AdminMerchant[]> {
  let query = supabase
    .from('admin_merchants_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AdminMerchant[];
}

export async function getAdminProducts(limit?: number): Promise<AdminProduct[]> {
  let query = supabase
    .from('admin_products_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AdminProduct[];
}

export async function getAdminOrders(limit?: number): Promise<AdminOrder[]> {
  let query = supabase
    .from('admin_orders_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AdminOrder[];
}

export async function getAdminAnalytics(period?: string): Promise<AdminAnalytics | null> {
  const { data, error } = await supabase.rpc('get_admin_analytics', {
    p_period: period || '30d',
  });
  if (error) throw error;
  return data as AdminAnalytics | null;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
    banned: 'bg-gray-100 text-gray-700',
    approved: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-600';
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockAdminDashboardStats(): AdminDashboardStats {
  return {
    total_users: 124580,
    new_users_today: 245,
    active_users_today: 12580,
    total_merchants: 2545,
    pending_merchant_requests: 23,
    active_merchants: 1890,
    total_products: 45670,
    pending_products: 156,
    active_products: 38450,
    orders_today: 3456,
    pending_orders: 456,
    completed_orders_today: 2890,
    pending_deliveries: 890,
    smartpoints_generated_today: 125000,
    smartpoints_total: 45600000,
    wallet_transactions_today: 8567,
    wallet_volume_today: 12500000,
    care_club_members: 45000,
    care_contributions_today: 567,
    academy_students: 12580,
    active_courses: 45,
    active_smartcodes: 125000,
    smartcodes_scanned_today: 4567,
    support_tickets_open: 89,
    support_tickets_today: 23,
  };
}

export function getMockAdminUsers(): AdminUser[] {
  return [
    { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91-9876543210', avatar_url: null, role: 'user', status: 'active', trust_score: 785, smartpoints_balance: 2450, wallet_balance: 15850, created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), last_login_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), email_verified: true, phone_verified: true },
    { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91-9876543211', avatar_url: null, role: 'merchant', status: 'active', trust_score: 892, smartpoints_balance: 5670, wallet_balance: 245000, created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), last_login_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), email_verified: true, phone_verified: true },
    { id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', phone: null, avatar_url: null, role: 'user', status: 'pending', trust_score: 450, smartpoints_balance: 120, wallet_balance: 0, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), last_login_at: null, email_verified: false, phone_verified: false },
    { id: 'u4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91-9876543212', avatar_url: null, role: 'user', status: 'suspended', trust_score: 320, smartpoints_balance: 0, wallet_balance: 5000, created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), last_login_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), email_verified: true, phone_verified: false },
    { id: 'u5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91-9876543213', avatar_url: null, role: 'admin', status: 'active', trust_score: 950, smartpoints_balance: 12500, wallet_balance: 45000, created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), last_login_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), email_verified: true, phone_verified: true },
  ];
}

export function getMockAdminMerchants(): AdminMerchant[] {
  return [
    { id: 'm1', business_name: 'TechStore India Pvt Ltd', store_name: 'TechStore India', owner_name: 'Rajesh Kumar', owner_email: 'rajesh@techstore.in', owner_phone: '+91-9876543220', logo_url: null, status: 'active', verification_level: 'premium', trust_score: 912, total_products: 156, total_orders: 2845, total_revenue: 4500000, created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), request_date: new Date(Date.now() - 185 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm2', business_name: 'Fashion Bazaar', store_name: 'FashionBazaar', owner_name: 'Priya Mehta', owner_email: 'priya@fashionbazaar.com', owner_phone: '+91-9876543221', logo_url: null, status: 'pending', verification_level: 'pending', trust_score: 0, total_products: 0, total_orders: 0, total_revenue: 0, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), request_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm3', business_name: 'Home Decor Hub', store_name: 'HomeDecorHub', owner_name: 'Amit Sharma', owner_email: 'amit@homedecor.in', owner_phone: '+91-9876543222', logo_url: null, status: 'suspended', verification_level: 'basic', trust_score: 420, total_products: 45, total_orders: 234, total_revenue: 450000, created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), request_date: new Date(Date.now() - 122 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'm4', business_name: 'Organic Foods Direct', store_name: 'OrganicFoods', owner_name: 'Sneha Reddy', owner_email: 'sneha@organicfoods.com', owner_phone: '+91-9876543223', logo_url: null, status: 'active', verification_level: 'standard', trust_score: 756, total_products: 89, total_orders: 1567, total_revenue: 1250000, created_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), request_date: new Date(Date.now() - 202 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminProducts(): AdminProduct[] {
  return [
    { id: 'p1', name: 'Wireless Bluetooth Earbuds Pro', merchant_name: 'TechStore India', merchant_id: 'm1', category: 'Electronics', price: 2499, stock: 45, status: 'active', visibility: true, images: [], created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), approval_status: 'approved' },
    { id: 'p2', name: 'Smart Watch Series X', merchant_name: 'TechStore India', merchant_id: 'm1', category: 'Electronics', price: 8999, stock: 12, status: 'active', visibility: true, images: [], created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), approval_status: 'approved' },
    { id: 'p3', name: 'Designer Kurti Collection', merchant_name: 'Fashion Bazaar', merchant_id: 'm2', category: 'Fashion', price: 1299, stock: 0, status: 'pending', visibility: false, images: [], created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), approval_status: 'pending' },
    { id: 'p4', name: 'Handmade Wooden Chair', merchant_name: 'Home Decor Hub', merchant_id: 'm3', category: 'Home & Living', price: 4999, stock: 5, status: 'suspended', visibility: false, images: [], created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), approval_status: 'approved' },
  ];
}

export function getMockAdminOrders(): AdminOrder[] {
  return [
    { id: 'o1', order_number: 'ORD-2024-123567', customer_name: 'Rahul Sharma', customer_email: 'rahul@example.com', merchant_name: 'TechStore India', total: 3777, payment_status: 'paid', order_status: 'processing', delivery_status: 'shipped', smartpoints_earned: 52, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'o2', order_number: 'ORD-2024-123568', customer_name: 'Priya Patel', customer_email: 'priya@example.com', merchant_name: 'Fashion Bazaar', total: 2499, payment_status: 'pending', order_status: 'pending', delivery_status: 'not_shipped', smartpoints_earned: 0, created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { id: 'o3', order_number: 'ORD-2024-123569', customer_name: 'Amit Kumar', customer_email: 'amit@example.com', merchant_name: 'Home Decor Hub', total: 8999, payment_status: 'paid', order_status: 'delivered', delivery_status: 'delivered', smartpoints_earned: 90, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminWalletTransactions(): AdminWalletTransaction[] {
  return [
    { id: 'wt1', type: 'credit', user_id: 'u1', user_name: 'Rahul Sharma', amount: 2500, balance_after: 15850, category: 'order_settlement', description: 'Order settlement ORD-2024-123567', status: 'completed', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'wt2', type: 'debit', user_id: 'u2', user_name: 'Priya Patel', amount: 5000, balance_after: 240000, category: 'withdrawal', description: 'Withdrawal to HDFC Bank', status: 'completed', created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'wt3', type: 'transfer', user_id: 'u3', user_name: 'Amit Kumar', amount: 1000, balance_after: 1000, category: 'wallet_transfer', description: 'W1 to W2 transfer', status: 'pending', created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminSmartCodes(): AdminSmartCode[] {
  return [
    { id: 'sc1', code: 'VLOOP-2024-ABC123', user_id: 'u1', user_name: 'Rahul Sharma', type: 'product', status: 'active', points_value: 100, scans_count: 45, max_scans: 100, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'sc2', code: 'VLOOP-2024-DEF456', user_id: 'u2', user_name: 'Priya Patel', type: 'batch', status: 'used', points_value: 50, scans_count: 100, max_scans: 100, created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), expires_at: null },
    { id: 'sc3', code: 'VLOOP-2024-GHI789', user_id: 'u5', user_name: 'Vikram Singh', type: 'campaign', status: 'active', points_value: 25, scans_count: 1250, max_scans: 10000, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminCareClubActivities(): AdminCareClubActivity[] {
  return [
    { id: 'ca1', user_id: 'u1', user_name: 'Rahul Sharma', type: 'contribution', amount: 500, cause: 'Food Support', beneficiaries: 5, status: 'completed', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ca2', user_id: 'u2', user_name: 'Priya Patel', type: 'volunteer', amount: 0, cause: 'Education', beneficiaries: 3, status: 'completed', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ca3', user_id: 'u4', user_name: 'Sneha Reddy', type: 'emergency_request', amount: 0, cause: 'Medical Support', beneficiaries: 1, status: 'pending', created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminAcademyStudents(): AdminAcademyStudent[] {
  return [
    { id: 'as1', user_id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', enrolled_courses: 5, completed_courses: 3, certificates: 2, smartpoints_earned: 450, status: 'active', last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), enrolled_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'as2', user_id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', enrolled_courses: 2, completed_courses: 0, certificates: 0, smartpoints_earned: 25, status: 'active', last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), enrolled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'as3', user_id: 'u4', name: 'Sneha Reddy', email: 'sneha@example.com', enrolled_courses: 8, completed_courses: 8, certificates: 5, smartpoints_earned: 1250, status: 'inactive', last_activity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), enrolled_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminQuickActions(): AdminQuickAction[] {
  return [
    { id: 'qa1', action_type: 'approve_merchant', title: 'Approve Merchant', description: 'Fashion Bazaar awaiting approval', target_id: 'm2', target_name: 'Fashion Bazaar', priority: 'high', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'qa2', action_type: 'approve_product', title: 'Approve Product', description: 'Designer Kurti Collection pending review', target_id: 'p3', target_name: 'Designer Kurti Collection', priority: 'medium', created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    { id: 'qa3', action_type: 'suspend_user', title: 'Review User Activity', description: 'Suspicious activity detected for user', target_id: 'u4', target_name: 'Sneha Reddy', priority: 'urgent', created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { id: 'qa4', action_type: 'freeze_wallet', title: 'Freeze Wallet', description: 'Large withdrawal request pending review', target_id: 'u2', target_name: 'Priya Patel', priority: 'high', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockAdminAnalytics(): AdminAnalytics {
  return {
    period: '30d',
    orders: generateAnalyticsPoints(30, 100, 200),
    revenue: generateAnalyticsPoints(30, 800000, 1500000),
    users: generateAnalyticsPoints(30, 100, 300),
    merchants: generateAnalyticsPoints(30, 5, 15),
    wallet_activity: generateAnalyticsPoints(30, 50000, 150000),
  };
}

function generateAnalyticsPoints(days: number, min: number, max: number): AdminAnalyticsPoint[] {
  const points: AdminAnalyticsPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * (max - min)) + min,
    });
  }
  return points;
}
