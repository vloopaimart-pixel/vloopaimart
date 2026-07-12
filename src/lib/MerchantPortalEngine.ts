/**
 * VLOOP Merchant Portal Engine
 * Phase 10 — Professional Seller Dashboard
 */

import { supabase } from './supabase';

export const MERCHANT_PORTAL_VERSION = '10.0.0' as const;

// ============================================================
// TYPES
// ============================================================

export interface MerchantProfile {
  id: string;
  user_id: string;
  business_name: string;
  store_name: string;
  store_slug: string;
  store_logo_url: string | null;
  store_banner_url: string | null;
  store_description: string | null;
  business_type: 'individual' | 'llc' | 'partnership' | 'corporation';
  gst_number: string | null;
  pan_number: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country_code: string;
  phone: string;
  email: string;
  website: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  bank_name: string | null;
  upi_id: string | null;
  is_verified: boolean;
  verification_level: 'pending' | 'basic' | 'standard' | 'premium';
  trust_score: number;
  total_products: number;
  total_orders: number;
  total_reviews: number;
  average_rating: number;
  member_since: string;
  store_status: 'active' | 'pending' | 'suspended' | 'inactive';
  subscription_plan: 'free' | 'basic' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface MerchantProduct {
  id: string;
  merchant_id: string;
  product_name: string;
  product_slug: string;
  product_description: string;
  category: string;
  subcategory: string | null;
  sku: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_visible: boolean;
  is_featured: boolean;
  images: string[];
  primary_image: string | null;
  weight: number | null;
  weight_unit: string;
  dimensions: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  total_views: number;
  total_sales: number;
  average_rating: number;
  total_reviews: number;
  smartpoints_reward: number;
  created_at: string;
  updated_at: string;
}

export interface MerchantOrder {
  id: string;
  order_number: string;
  merchant_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  items: MerchantOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  payment_method: 'cod' | 'prepaid' | 'upi' | 'card' | 'wallet';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  delivery_status: 'not_shipped' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'return_initiated';
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_address: {
    name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  notes: string | null;
  smartpoints_earned: number;
  smartpoints_credited: boolean;
  created_at: string;
  updated_at: string;
}

export interface MerchantOrderItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface MerchantWallet {
  id: string;
  merchant_id: string;
  available_balance: number;
  pending_settlement: number;
  lifetime_earnings: number;
  total_withdrawn: number;
  smartpoints_issued: number;
  total_transactions: number;
  last_settlement_date: string | null;
  next_settlement_date: string | null;
  settlement_cycle: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface MerchantTransaction {
  id: string;
  merchant_id: string;
  transaction_type: 'order_payment' | 'settlement' | 'withdrawal' | 'refund' | 'fee';
  amount: number;
  balance_after: number;
  order_id: string | null;
  description: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

export interface MerchantAnalytics {
  period: string;
  total_orders: number;
  total_revenue: number;
  total_products_sold: number;
  average_order_value: number;
  new_customers: number;
  return_customers: number;
  top_products: MerchantAnalyticsProduct[];
  orders_by_status: Record<string, number>;
  revenue_by_day: MerchantRevenuePoint[];
}

export interface MerchantAnalyticsProduct {
  product_id: string;
  product_name: string;
  units_sold: number;
  revenue: number;
}

export interface MerchantRevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface MerchantDashboardStats {
  total_products: number;
  active_products: number;
  out_of_stock: number;
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  today_orders: number;
  today_revenue: number;
  monthly_orders: number;
  monthly_revenue: number;
  wallet_balance: number;
  pending_settlement: number;
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-violet-100 text-violet-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-orange-100 text-orange-700',
};

export const DELIVERY_STATUS_COLORS: Record<string, string> = {
  not_shipped: 'bg-gray-100 text-gray-700',
  shipped: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-violet-100 text-violet-700',
  out_for_delivery: 'bg-amber-100 text-amber-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  return_initiated: 'bg-red-100 text-red-700',
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Fitness',
  'Books & Stationery',
  'Grocery & Food',
  'Health & Wellness',
  'Automotive',
  'Baby & Kids',
  'Office Supplies',
  'Pet Supplies',
] as const;

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getMerchantProfile(userId: string): Promise<MerchantProfile | null> {
  const { data, error } = await supabase
    .from('merchant_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as MerchantProfile | null;
}

export async function getMerchantProducts(merchantId: string): Promise<MerchantProduct[]> {
  const { data, error } = await supabase
    .from('merchant_products')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as MerchantProduct[];
}

export async function getMerchantOrders(merchantId: string, limit?: number): Promise<MerchantOrder[]> {
  let query = supabase
    .from('merchant_orders')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as MerchantOrder[];
}

export async function getMerchantWallet(merchantId: string): Promise<MerchantWallet | null> {
  const { data, error } = await supabase
    .from('merchant_wallets')
    .select('*')
    .eq('merchant_id', merchantId)
    .maybeSingle();
  if (error) throw error;
  return data as MerchantWallet | null;
}

export async function getMerchantTransactions(merchantId: string, limit?: number): Promise<MerchantTransaction[]> {
  let query = supabase
    .from('merchant_transactions')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as MerchantTransaction[];
}

export async function getMerchantAnalytics(merchantId: string, period?: string): Promise<MerchantAnalytics | null> {
  const { data, error } = await supabase.rpc('get_merchant_analytics', {
    p_merchant_id: merchantId,
    p_period: period || '30d',
  });
  if (error) throw error;
  return data as MerchantAnalytics | null;
}

export async function getMerchantDashboardStats(merchantId: string): Promise<MerchantDashboardStats | null> {
  const { data, error } = await supabase.rpc('get_merchant_dashboard_stats', {
    p_merchant_id: merchantId,
  });
  if (error) throw error;
  return data as MerchantDashboardStats | null;
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

export function formatSmartPoints(points: number): string {
  if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
  return `${points}`;
}

export function getVerificationBadgeColor(level: string): string {
  const colors: Record<string, string> = {
    premium: 'from-amber-400 to-amber-600',
    standard: 'from-blue-400 to-blue-600',
    basic: 'from-emerald-400 to-emerald-600',
    pending: 'from-gray-400 to-gray-600',
  };
  return colors[level] || 'from-gray-400 to-gray-600';
}

export function getVerificationBadgeText(level: string): string {
  const texts: Record<string, string> = {
    premium: 'Verified Premium',
    standard: 'Verified',
    basic: 'Basic Verified',
    pending: 'Pending Verification',
  };
  return texts[level] || 'Unknown';
}

export function getStockStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_stock: 'bg-emerald-100 text-emerald-700',
    low_stock: 'bg-amber-100 text-amber-700',
    out_of_stock: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getTrustLevel(score: number): string {
  if (score >= 900) return 'Diamond';
  if (score >= 800) return 'Platinum';
  if (score >= 700) return 'Gold';
  if (score >= 600) return 'Silver';
  return 'Bronze';
}

export function getDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return { start, end };
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

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockMerchantProfile(): MerchantProfile {
  return {
    id: 'merchant-1',
    user_id: 'user-1',
    business_name: 'TechStore India Pvt Ltd',
    store_name: 'TechStore India',
    store_slug: 'techstore-india',
    store_logo_url: null,
    store_banner_url: null,
    store_description: 'Your one-stop shop for electronics, gadgets, and accessories.',
    business_type: 'llc',
    gst_number: '27ABCCT1234P1ZM',
    pan_number: 'ABCCT1234P',
    address_line1: '123 Tech Park, MG Road',
    address_line2: 'Suite 456',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country_code: 'IN',
    phone: '+91-9876543210',
    email: 'support@techstore.in',
    website: 'https://techstore.in',
    bank_account_name: 'TechStore India Pvt Ltd',
    bank_account_number: 'XXXX-XXXX-4567',
    bank_ifsc: 'HDFC0001234',
    bank_name: 'HDFC Bank',
    upi_id: 'techstore@upi',
    is_verified: true,
    verification_level: 'premium',
    trust_score: 847,
    total_products: 156,
    total_orders: 2845,
    total_reviews: 1256,
    average_rating: 4.6,
    member_since: '2023-01-15',
    store_status: 'active',
    subscription_plan: 'pro',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: new Date().toISOString(),
  };
}

export function getMockMerchantProducts(): MerchantProduct[] {
  return [
    {
      id: 'prod-1',
      merchant_id: 'merchant-1',
      product_name: 'Wireless Bluetooth Earbuds Pro',
      product_slug: 'wireless-bluetooth-earbuds-pro',
      product_description: 'Premium wireless earbuds with active noise cancellation',
      category: 'Electronics',
      subcategory: 'Audio',
      sku: 'WBE-PRO-001',
      price: 2499,
      compare_at_price: 3999,
      cost_price: 1200,
      stock_quantity: 45,
      stock_status: 'in_stock',
      is_visible: true,
      is_featured: true,
      images: [],
      primary_image: null,
      weight: 50,
      weight_unit: 'g',
      dimensions: '10x5x3 cm',
      tags: ['earbuds', 'wireless', 'bluetooth', 'audio'],
      seo_title: null,
      seo_description: null,
      total_views: 1250,
      total_sales: 89,
      average_rating: 4.5,
      total_reviews: 45,
      smartpoints_reward: 25,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      merchant_id: 'merchant-1',
      product_name: 'Smart Watch Series X',
      product_slug: 'smart-watch-series-x',
      product_description: 'Advanced smartwatch with health monitoring',
      category: 'Electronics',
      subcategory: 'Wearables',
      sku: 'SWS-X-002',
      price: 8999,
      compare_at_price: 11999,
      cost_price: 4500,
      stock_quantity: 12,
      stock_status: 'low_stock',
      is_visible: true,
      is_featured: true,
      images: [],
      primary_image: null,
      weight: 65,
      weight_unit: 'g',
      dimensions: '4.5x4.5x1.2 cm',
      tags: ['smartwatch', 'wearable', 'fitness', 'health'],
      seo_title: null,
      seo_description: null,
      total_views: 2350,
      total_sales: 156,
      average_rating: 4.7,
      total_reviews: 89,
      smartpoints_reward: 90,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      merchant_id: 'merchant-1',
      product_name: 'USB-C Fast Charging Cable 3-Pack',
      product_slug: 'usb-c-fast-charging-cable-3-pack',
      product_description: 'Durable braided USB-C cables, 2m length',
      category: 'Electronics',
      subcategory: 'Accessories',
      sku: 'UCFC-3P-003',
      price: 599,
      compare_at_price: 999,
      cost_price: 200,
      stock_quantity: 0,
      stock_status: 'out_of_stock',
      is_visible: true,
      is_featured: false,
      images: [],
      primary_image: null,
      weight: 120,
      weight_unit: 'g',
      dimensions: '200x5x0.5 cm',
      tags: ['cable', 'usb-c', 'charging', 'accessories'],
      seo_title: null,
      seo_description: null,
      total_views: 3400,
      total_sales: 567,
      average_rating: 4.2,
      total_reviews: 234,
      smartpoints_reward: 6,
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-4',
      merchant_id: 'merchant-1',
      product_name: 'Portable Power Bank 20000mAh',
      product_slug: 'portable-power-bank-20000mah',
      product_description: 'High capacity power bank with fast charging support',
      category: 'Electronics',
      subcategory: 'Power',
      sku: 'PPB-20K-004',
      price: 2199,
      compare_at_price: 2999,
      cost_price: 1100,
      stock_quantity: 78,
      stock_status: 'in_stock',
      is_visible: true,
      is_featured: false,
      images: [],
      primary_image: null,
      weight: 350,
      weight_unit: 'g',
      dimensions: '15x7x2.5 cm',
      tags: ['power bank', 'portable charger', 'battery', 'fast charging'],
      seo_title: null,
      seo_description: null,
      total_views: 1890,
      total_sales: 234,
      average_rating: 4.4,
      total_reviews: 67,
      smartpoints_reward: 22,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-5',
      merchant_id: 'merchant-1',
      product_name: 'Mechanical Gaming Keyboard RGB',
      product_slug: 'mechanical-gaming-keyboard-rgb',
      product_description: 'Professional gaming keyboard with RGB lighting',
      category: 'Electronics',
      subcategory: 'Gaming',
      sku: 'MGK-RGB-005',
      price: 4999,
      compare_at_price: 6999,
      cost_price: 2500,
      stock_quantity: 23,
      stock_status: 'in_stock',
      is_visible: true,
      is_featured: true,
      images: [],
      primary_image: null,
      weight: 950,
      weight_unit: 'g',
      dimensions: '44x14x4 cm',
      tags: ['keyboard', 'gaming', 'rgb', 'mechanical'],
      seo_title: null,
      seo_description: null,
      total_views: 3450,
      total_sales: 145,
      average_rating: 4.8,
      total_reviews: 78,
      smartpoints_reward: 50,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-6',
      merchant_id: 'merchant-1',
      product_name: 'Wireless Mouse Ergonomic Design',
      product_slug: 'wireless-mouse-ergonomic-design',
      product_description: 'Comfortable wireless mouse for extended use',
      category: 'Electronics',
      subcategory: 'Accessories',
      sku: 'WME-006',
      price: 1299,
      compare_at_price: 1799,
      cost_price: 600,
      stock_quantity: 56,
      stock_status: 'in_stock',
      is_visible: true,
      is_featured: false,
      images: [],
      primary_image: null,
      weight: 85,
      weight_unit: 'g',
      dimensions: '12x7x4 cm',
      tags: ['mouse', 'wireless', 'ergonomic', 'accessories'],
      seo_title: null,
      seo_description: null,
      total_views: 2890,
      total_sales: 312,
      average_rating: 4.3,
      total_reviews: 123,
      smartpoints_reward: 13,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

export function getMockMerchantOrders(): MerchantOrder[] {
  return [
    {
      id: 'order-001',
      order_number: 'ORD-2024-123567',
      merchant_id: 'merchant-1',
      customer_id: 'cust-1',
      customer_name: 'Rahul Sharma',
      customer_phone: '+91-9876543210',
      customer_email: 'rahul@example.com',
      items: [
        { product_id: 'prod-1', product_name: 'Wireless Bluetooth Earbuds Pro', product_image: null, quantity: 1, price: 2499, total: 2499 },
        { product_id: 'prod-3', product_name: 'USB-C Fast Charging Cable 3-Pack', product_image: null, quantity: 2, price: 599, total: 1198 },
      ],
      subtotal: 3697,
      discount: 200,
      tax: 280,
      shipping: 0,
      total: 3777,
      payment_method: 'prepaid',
      payment_status: 'paid',
      order_status: 'processing',
      delivery_status: 'shipped',
      tracking_number: 'TRK123456789',
      tracking_url: 'https://track.example.com/TRK123456789',
      shipping_address: {
        name: 'Rahul Sharma',
        phone: '+91-9876543210',
        address_line1: '456, Block A, Sector 15',
        address_line2: 'Near Metro Station',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
      },
      notes: 'Please deliver before 6 PM',
      smartpoints_earned: 52,
      smartpoints_credited: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-002',
      order_number: 'ORD-2024-123568',
      merchant_id: 'merchant-1',
      customer_id: 'cust-2',
      customer_name: 'Priya Patel',
      customer_phone: '+91-9876543211',
      customer_email: 'priya@example.com',
      items: [
        { product_id: 'prod-2', product_name: 'Smart Watch Series X', product_image: null, quantity: 1, price: 8999, total: 8999 },
      ],
      subtotal: 8999,
      discount: 500,
      tax: 612,
      shipping: 99,
      total: 9210,
      payment_method: 'upi',
      payment_status: 'paid',
      order_status: 'confirmed',
      delivery_status: 'not_shipped',
      tracking_number: null,
      tracking_url: null,
      shipping_address: {
        name: 'Priya Patel',
        phone: '+91-9876543211',
        address_line1: '789, MG Road',
        address_line2: 'Apt 12B',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
      },
      notes: null,
      smartpoints_earned: 90,
      smartpoints_credited: false,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-003',
      order_number: 'ORD-2024-123569',
      merchant_id: 'merchant-1',
      customer_id: 'cust-3',
      customer_name: 'Amit Kumar',
      customer_phone: '+91-9876543212',
      customer_email: 'amit@example.com',
      items: [
        { product_id: 'prod-5', product_name: 'Mechanical Gaming Keyboard RGB', product_image: null, quantity: 1, price: 4999, total: 4999 },
        { product_id: 'prod-6', product_name: 'Wireless Mouse Ergonomic Design', product_image: null, quantity: 1, price: 1299, total: 1299 },
      ],
      subtotal: 6298,
      discount: 300,
      tax: 440,
      shipping: 0,
      total: 6438,
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'pending',
      delivery_status: 'not_shipped',
      tracking_number: null,
      tracking_url: null,
      shipping_address: {
        name: 'Amit Kumar',
        phone: '+91-9876543212',
        address_line1: '123, Anna Nagar',
        address_line2: null,
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
      },
      notes: 'Handle with care',
      smartpoints_earned: 63,
      smartpoints_credited: false,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-004',
      order_number: 'ORD-2024-123570',
      merchant_id: 'merchant-1',
      customer_id: 'cust-4',
      customer_name: 'Sneha Reddy',
      customer_phone: '+91-9876543213',
      customer_email: 'sneha@example.com',
      items: [
        { product_id: 'prod-4', product_name: 'Portable Power Bank 20000mAh', product_image: null, quantity: 2, price: 2199, total: 4398 },
      ],
      subtotal: 4398,
      discount: 0,
      tax: 309,
      shipping: 49,
      total: 4756,
      payment_method: 'card',
      payment_status: 'paid',
      order_status: 'delivered',
      delivery_status: 'delivered',
      tracking_number: 'TRK987654321',
      tracking_url: 'https://track.example.com/TRK987654321',
      shipping_address: {
        name: 'Sneha Reddy',
        phone: '+91-9876543213',
        address_line1: '456, Jubilee Hills',
        address_line2: 'Road No 10',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
      },
      notes: null,
      smartpoints_earned: 44,
      smartpoints_credited: true,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-005',
      order_number: 'ORD-2024-123571',
      merchant_id: 'merchant-1',
      customer_id: 'cust-5',
      customer_name: 'Vikram Singh',
      customer_phone: '+91-9876543214',
      customer_email: 'vikram@example.com',
      items: [
        { product_id: 'prod-2', product_name: 'Smart Watch Series X', product_image: null, quantity: 1, price: 8999, total: 8999 },
        { product_id: 'prod-1', product_name: 'Wireless Bluetooth Earbuds Pro', product_image: null, quantity: 1, price: 2499, total: 2499 },
      ],
      subtotal: 11498,
      discount: 1000,
      tax: 782,
      shipping: 0,
      total: 11280,
      payment_method: 'prepaid',
      payment_status: 'paid',
      order_status: 'cancelled',
      delivery_status: 'return_initiated',
      tracking_number: null,
      tracking_url: null,
      shipping_address: {
        name: 'Vikram Singh',
        phone: '+91-9876543214',
        address_line1: '789, Model Town',
        address_line2: null,
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110009',
      },
      notes: 'Wrong item delivered',
      smartpoints_earned: 115,
      smartpoints_credited: false,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockMerchantWallet(): MerchantWallet {
  return {
    id: 'wallet-1',
    merchant_id: 'merchant-1',
    available_balance: 245850,
    pending_settlement: 89500,
    lifetime_earnings: 4250000,
    total_withdrawn: 3900000,
    smartpoints_issued: 42500,
    total_transactions: 156,
    last_settlement_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    next_settlement_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    settlement_cycle: 'weekly',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: new Date().toISOString(),
  };
}

export function getMockMerchantTransactions(): MerchantTransaction[] {
  return [
    {
      id: 'txn-1',
      merchant_id: 'merchant-1',
      transaction_type: 'order_payment',
      amount: 3777,
      balance_after: 245850,
      order_id: 'order-001',
      description: 'Order ORD-2024-123567 payment received',
      status: 'completed',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-2',
      merchant_id: 'merchant-1',
      transaction_type: 'settlement',
      amount: 125000,
      balance_after: 242073,
      order_id: null,
      description: 'Weekly settlement - Week 28',
      status: 'completed',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-3',
      merchant_id: 'merchant-1',
      transaction_type: 'order_payment',
      amount: 4756,
      balance_after: 127073,
      order_id: 'order-004',
      description: 'Order ORD-2024-123570 payment received',
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-4',
      merchant_id: 'merchant-1',
      transaction_type: 'withdrawal',
      amount: -125000,
      balance_after: 122317,
      order_id: null,
      description: 'Withdrawal to HDFC Bank XXXX-4567',
      status: 'completed',
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-5',
      merchant_id: 'merchant-1',
      transaction_type: 'refund',
      amount: -11280,
      balance_after: 247317,
      order_id: 'order-005',
      description: 'Refund for cancelled order ORD-2024-123571',
      status: 'completed',
      created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockMerchantDashboardStats(): MerchantDashboardStats {
  return {
    total_products: 156,
    active_products: 142,
    out_of_stock: 8,
    total_orders: 2845,
    pending_orders: 45,
    processing_orders: 23,
    completed_orders: 2680,
    today_orders: 12,
    today_revenue: 45230,
    monthly_orders: 567,
    monthly_revenue: 1245600,
    wallet_balance: 245850,
    pending_settlement: 89500,
  };
}

export function getMockMerchantAnalytics(): MerchantAnalytics {
  return {
    period: '30d',
    total_orders: 567,
    total_revenue: 1245600,
    total_products_sold: 892,
    average_order_value: 2195,
    new_customers: 89,
    return_customers: 145,
    top_products: [
      { product_id: 'prod-3', product_name: 'USB-C Fast Charging Cable 3-Pack', units_sold: 234, revenue: 140166 },
      { product_id: 'prod-6', product_name: 'Wireless Mouse Ergonomic Design', units_sold: 156, revenue: 202644 },
      { product_id: 'prod-4', product_name: 'Portable Power Bank 20000mAh', units_sold: 134, revenue: 294666 },
      { product_id: 'prod-1', product_name: 'Wireless Bluetooth Earbuds Pro', units_sold: 98, revenue: 244902 },
      { product_id: 'prod-2', product_name: 'Smart Watch Series X', units_sold: 67, revenue: 602933 },
    ],
    orders_by_status: {
      pending: 45,
      confirmed: 78,
      processing: 23,
      shipped: 56,
      delivered: 2689,
      cancelled: 34,
      returned: 12,
    },
    revenue_by_day: generateMockRevenueData(),
  };
}

function generateMockRevenueData(): MerchantRevenuePoint[] {
  const data: MerchantRevenuePoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 25) + 10,
    });
  }
  return data;
}
