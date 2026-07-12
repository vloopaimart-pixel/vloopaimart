/**
 * VLOOP GLOBAL MARKETPLACE CORE ENGINE
 * Phase 34 — Complete Marketplace Backbone
 *
 * Enterprise-grade marketplace engine supporting:
 * - Physical Products, Digital Products, Services
 * - All Seller Types (Individual to International Supplier)
 * - Scalable Category Architecture
 * - AI Recommendations
 * - Private Label, Trading, Affiliate, Home Cloud Store
 * - Marketplace Analytics
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const MARKETPLACE_ENGINE_VERSION = '34.0.0' as const;

export const MARKETPLACE_ENGINE_META = {
  version: MARKETPLACE_ENGINE_VERSION,
  name: 'VLOOP Global Marketplace Core Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// CONSTANTS
// ============================================================

export const SELLER_TYPES = {
  INDIVIDUAL: 'individual',
  LOCAL_SHOP: 'local_shop',
  DISTRIBUTOR: 'distributor',
  BRAND: 'brand',
  MANUFACTURER: 'manufacturer',
  IMPORTER: 'importer',
  HOME_BUSINESS: 'home_business',
  DISTRICT_FRANCHISE: 'district_franchise',
  STATE_FRANCHISE: 'state_franchise',
  INTERNATIONAL_SUPPLIER: 'international_supplier',
  AFFILIATE_PARTNER: 'affiliate_partner',
} as const;

export type SellerType = typeof SELLER_TYPES[keyof typeof SELLER_TYPES];

export const PRODUCT_TYPES = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
  SERVICE: 'service',
  TRADING: 'trading',
  AFFILIATE: 'affiliate',
} as const;

export type ProductType = typeof PRODUCT_TYPES[keyof typeof PRODUCT_TYPES];

export const DELIVERY_TYPES = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  SAME_DAY: 'same_day',
  PICKUP: 'pickup',
  DIGITAL: 'digital',
  HYPER_LOCAL: 'hyper_local',
} as const;

export type DeliveryType = typeof DELIVERY_TYPES[keyof typeof DELIVERY_TYPES];

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIAL_REFUND: 'partial_refund',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHODS = {
  COD: 'cod',
  PREPAID: 'prepaid',
  UPI: 'upi',
  CARD: 'card',
  WALLET: 'wallet',
  NET_BANKING: 'net_banking',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const TRADING_SUPPLIER_REGIONS = {
  INDIA: 'india',
  DUBAI: 'dubai',
  CHINA: 'china',
  USA: 'usa',
  EUROPE: 'europe',
  SOUTHEAST_ASIA: 'southeast_asia',
  OTHER: 'other',
} as const;

export type TradingSupplierRegion = typeof TRADING_SUPPLIER_REGIONS[keyof typeof TRADING_SUPPLIER_REGIONS];

export const AFFILIATE_PLATFORMS = {
  AMAZON: 'amazon',
  FLIPKART: 'flipkart',
  MYNTRA: 'myntra',
  AJIO: 'ajio',
  MEESHO: 'meesho',
  NYKAA: 'nykaa',
  OTHER: 'other',
} as const;

export type AffiliatePlatform = typeof AFFILIATE_PLATFORMS[keyof typeof AFFILIATE_PLATFORMS];

export const PRIVATE_LABEL_CATEGORIES = {
  ESSENTIALS: 'essentials',
  AURA: 'aura',
  APPAREL: 'apparel',
  HOME: 'home',
  ORGANIC: 'organic',
  KITCHEN: 'kitchen',
  HEALTH: 'health',
  KIDS: 'kids',
  ELECTRONICS: 'electronics',
  BEAUTY: 'beauty',
  SPORTS: 'sports',
  FUTURE: 'future',
} as const;

export type PrivateLabelCategory = typeof PRIVATE_LABEL_CATEGORIES[keyof typeof PRIVATE_LABEL_CATEGORIES];

export const VISIBILITY_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  UNLISTED: 'unlisted',
  MEMBERS_ONLY: 'members_only',
} as const;

export type VisibilityType = typeof VISIBILITY_TYPES[keyof typeof VISIBILITY_TYPES];

// ============================================================
// TYPES
// ============================================================

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  level: number;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

export interface Seller {
  id: string;
  user_id: string | null;
  seller_type: SellerType;
  business_name: string;
  business_email: string | null;
  business_phone: string | null;
  business_address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  gst_number: string | null;
  pan_number: string | null;
  commission_rate: number;
  rating: number;
  total_sales: number;
  total_products: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  verified_at: string | null;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  country_of_origin: string | null;
  is_private_label: boolean;
  private_label_owner: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string | null;
  brand_id: string | null;
  category_id: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  price: number;
  mrp: number;
  discount_percent: number;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  image_url: string | null;
  images: ProductImage[];
  specifications: ProductSpecification[];
  stock: number;
  delivery_type: DeliveryType;
  warranty_months: number;
  warranty_text: string | null;
  weight_kg: number | null;
  dimensions_cm: string | null;
  country_of_origin: string | null;
  hsn_code: string | null;
  tax_percent: number;
  min_order_qty: number;
  max_order_qty: number;
  product_type: ProductType;
  visibility: VisibilityType;
  status: ProductStatus;
  ai_tags: string[];
  ai_category_score: number;
  is_trending: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
  is_vloop_own: boolean;
  is_partner: boolean;
  rating: number;
  review_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_group: string | null;
  sort_order: number;
}

export interface ProductInventory {
  id: string;
  product_id: string;
  warehouse_location: string | null;
  quantity_available: number;
  quantity_reserved: number;
  quantity_in_transit: number;
  reorder_level: number;
  reorder_quantity: number;
  last_restocked_at: string | null;
  restock_lead_days: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  seller_id: string | null;
  product_id: string | null;
  order_number: string;
  quantity: number;
  total_amount: number;
  points_earned: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_transaction_id: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_pincode: string | null;
  delivery_type: DeliveryType;
  delivery_date: string | null;
  delivery_slot: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  invoice_number: string | null;
  invoice_url: string | null;
  cancellation_reason: string | null;
  refunded_amount: number;
  seller_earnings: number;
  platform_fee: number;
  delivery_fee: number;
  discount_amount: number;
  coupon_code: string | null;
  is_affiliate_order: boolean;
  affiliate_commission: number;
  created_at: string;
}

export interface TradingSupplier {
  id: string;
  supplier_name: string;
  supplier_type: TradingSupplierRegion;
  country: string;
  city: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  gst_or_tax_id: string | null;
  payment_terms: string | null;
  moq: number;
  lead_time_days: number;
  currency: string;
  rating: number;
  total_orders: number;
  is_verified: boolean;
  is_active: boolean;
  verified_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface TradingOrder {
  id: string;
  supplier_id: string | null;
  product_id: string | null;
  order_type: 'import' | 'export' | 'wholesale' | 'bulk' | 'container';
  quantity: number;
  unit_price: number;
  total_value: number;
  currency: string;
  exchange_rate: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  delivery_status: 'pending' | 'processing' | 'shipped' | 'customs' | 'delivered' | 'cancelled';
  estimated_delivery: string | null;
  actual_delivery: string | null;
  documents: Record<string, unknown>;
  tracking_number: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AffiliateProduct {
  id: string;
  product_id: string | null;
  external_platform: AffiliatePlatform;
  external_product_id: string | null;
  external_product_url: string;
  affiliate_url: string | null;
  commission_percent: number;
  commission_type: 'percentage' | 'fixed';
  fixed_commission: number;
  smart_points_reward: number;
  price_at_sync: number | null;
  last_synced_at: string | null;
  sync_status: 'pending' | 'synced' | 'failed' | 'discontinued';
  is_active: boolean;
  clicks: number;
  conversions: number;
  total_commission_earned: number;
  created_at: string;
}

export interface HomeCloudStore {
  id: string;
  seller_id: string | null;
  store_name: string;
  store_slug: string;
  store_description: string | null;
  store_image_url: string | null;
  address: string;
  city: string;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  delivery_radius_km: number;
  delivery_hours: { start: string; end: string };
  delivery_days: string[];
  min_order_value: number;
  delivery_fee: number;
  free_delivery_above: number;
  is_micro_inventory: boolean;
  max_products: number;
  total_products: number;
  rating: number;
  total_orders: number;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
}

export interface PrivateLabelBrand {
  id: string;
  brand_name: string;
  brand_slug: string;
  brand_category: PrivateLabelCategory;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  brand_color: string | null;
  target_audience: string | null;
  price_positioning: 'budget' | 'mid_range' | 'premium' | 'luxury';
  launch_status: 'planned' | 'in_development' | 'soft_launch' | 'launched' | 'discontinued';
  launch_date: string | null;
  total_products: number;
  total_revenue: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface MarketplaceAnalytics {
  id: string;
  date: string;
  metric_type: string;
  metric_key: string;
  metric_value: number;
  dimension_type: string | null;
  dimension_value: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  recommendation_type: 'home' | 'category' | 'product_detail' | 'search' | 'cart' | 'checkout' | 'weekly';
  context_data: Record<string, unknown>;
  recommended_products: Array<{ product_id: string; score: number; reason: string }>;
  recommendation_score: number;
  factors: Record<string, unknown>;
  is_processed: boolean;
  processed_at: string | null;
  is_served: boolean;
  served_at: string | null;
  served_context: string | null;
  click_through: boolean;
  created_at: string;
}

// ============================================================
// CATEGORY FUNCTIONS
// ============================================================

export async function getCategories(parentId?: string | null): Promise<MarketplaceCategory[]> {
  let query = supabase
    .from('marketplace_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (parentId === null) {
    query = query.is('parent_id', null);
  } else if (parentId) {
    query = query.eq('parent_id', parentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as MarketplaceCategory[];
}

export async function getCategoryBySlug(slug: string): Promise<MarketplaceCategory | null> {
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as MarketplaceCategory | null;
}

export async function getCategoryTree(): Promise<MarketplaceCategory[]> {
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .eq('is_active', true)
    .order('level', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as MarketplaceCategory[];
}

// ============================================================
// SELLER FUNCTIONS
// ============================================================

export async function getSeller(sellerId: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', sellerId)
    .maybeSingle();

  if (error) throw error;
  return data as Seller | null;
}

export async function getSellerByUserId(userId: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Seller | null;
}

export async function searchSellers(filters: {
  query?: string;
  sellerType?: SellerType;
  city?: string;
  state?: string;
  verified?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ results: Seller[]; total: number }> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('sellers')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (filters.query) {
    query = query.or(`business_name.ilike.%${filters.query}%,city.ilike.%${filters.query}%`);
  }
  if (filters.sellerType) {
    query = query.eq('seller_type', filters.sellerType);
  }
  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.state) {
    query = query.eq('state', filters.state);
  }
  if (filters.verified !== undefined) {
    query = query.eq('is_verified', filters.verified);
  }

  query = query.order('rating', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as Seller[], total: count || 0 };
}

export async function createSeller(seller: Partial<Seller>): Promise<Seller> {
  const { data, error } = await supabase
    .from('sellers')
    .insert(seller)
    .select()
    .single();

  if (error) throw error;
  return data as Seller;
}

export async function updateSeller(sellerId: string, updates: Partial<Seller>): Promise<void> {
  const { error } = await supabase
    .from('sellers')
    .update(updates)
    .eq('id', sellerId);

  if (error) throw error;
}

// ============================================================
// BRAND FUNCTIONS
// ============================================================

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []) as Brand[];
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as Brand | null;
}

// ============================================================
// PRODUCT FUNCTIONS
// ============================================================

export async function getProduct(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .maybeSingle();

  if (error) throw error;
  return data as Product | null;
}

export async function getProductWithDetails(productId: string): Promise<Product | null> {
  const [productResult, imagesResult, specsResult, inventoryResult] = await Promise.all([
    supabase.from('products').select('*').eq('id', productId).maybeSingle(),
    supabase.from('product_images').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('product_specifications').select('*').eq('product_id', productId).order('spec_group').order('sort_order'),
    supabase.from('product_inventory').select('*').eq('product_id', productId).maybeSingle(),
  ]);

  if (productResult.error || !productResult.data) return null;

  return {
    ...productResult.data,
    images: (imagesResult.data || []) as ProductImage[],
    specifications: (specsResult.data || []) as ProductSpecification[],
    inventory: inventoryResult.data as ProductInventory | null,
  } as Product;
}

export async function searchProducts(filters: {
  query?: string;
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  sellerId?: string;
  productType?: ProductType;
  deliveryType?: DeliveryType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  status?: ProductStatus;
  visibility?: VisibilityType;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity';
}): Promise<{ results: Product[]; total: number }> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });

  query = query.eq('status', filters.status || PRODUCT_STATUS.ACTIVE);

  if (filters.query) {
    query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,brand.ilike.%${filters.query}%`);
  }
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters.brandId) {
    query = query.eq('brand_id', filters.brandId);
  }
  if (filters.sellerId) {
    query = query.eq('seller_id', filters.sellerId);
  }
  if (filters.productType) {
    query = query.eq('product_type', filters.productType);
  }
  if (filters.deliveryType) {
    query = query.eq('delivery_type', filters.deliveryType);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.minRating !== undefined) {
    query = query.gte('rating', filters.minRating);
  }
  if (filters.visibility) {
    query = query.eq('visibility', filters.visibility);
  } else {
    query = query.in('visibility', ['public']);
  }
  if (filters.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured);
  }
  if (filters.isTrending !== undefined) {
    query = query.eq('is_trending', filters.isTrending);
  }
  if (filters.isNewArrival !== undefined) {
    query = query.eq('is_new_arrival', filters.isNewArrival);
  }
  if (filters.isBestseller !== undefined) {
    query = query.eq('is_bestseller', filters.isBestseller);
  }
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('ai_tags', filters.tags);
  }

  switch (filters.sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popularity':
    default:
      query = query.order('review_count', { ascending: false });
      break;
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as Product[], total: count || 0 };
}

export async function getFeaturedProducts(limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', PRODUCT_STATUS.ACTIVE)
    .eq('is_featured', true)
    .in('visibility', ['public'])
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getTrendingProducts(limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', PRODUCT_STATUS.ACTIVE)
    .eq('is_trending', true)
    .in('visibility', ['public'])
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getNewArrivals(limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', PRODUCT_STATUS.ACTIVE)
    .eq('is_new_arrival', true)
    .in('visibility', ['public'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getBestsellers(limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', PRODUCT_STATUS.ACTIVE)
    .eq('is_bestseller', true)
    .in('visibility', ['public'])
    .order('review_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getProductsByCategory(categoryId: string, page: number = 1, pageSize: number = 20): Promise<{ results: Product[]; total: number }> {
  return searchProducts({ categoryId, page, pageSize });
}

export async function getProductsBySeller(sellerId: string, page: number = 1, pageSize: number = 20): Promise<{ results: Product[]; total: number }> {
  return searchProducts({ sellerId, page, pageSize });
}

// ============================================================
// ORDER FUNCTIONS
// ============================================================

export async function getOrder(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data as Order | null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) throw error;
  return data as Order | null;
}

export async function getUserOrders(userId: string, page: number = 1, pageSize: number = 10): Promise<{ results: Order[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { results: (data || []) as Order[], total: count || 0 };
}

export async function getSellerOrders(sellerId: string, page: number = 1, pageSize: number = 20): Promise<{ results: Order[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { results: (data || []) as Order[], total: count || 0 };
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<void> {
  const updates: Partial<Order> = { payment_status: paymentStatus };
  if (transactionId) updates.payment_transaction_id = transactionId;
  if (paymentStatus === 'paid') updates.status = 'confirmed';

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) throw error;
}

// ============================================================
// TRADING ENGINE FUNCTIONS
// ============================================================

export async function getTradingSuppliers(filters?: {
  supplierType?: TradingSupplierRegion;
  country?: string;
  verified?: boolean;
}): Promise<TradingSupplier[]> {
  let query = supabase
    .from('trading_suppliers')
    .select('*')
    .eq('is_active', true);

  if (filters?.supplierType) {
    query = query.eq('supplier_type', filters.supplierType);
  }
  if (filters?.country) {
    query = query.eq('country', filters.country);
  }
  if (filters?.verified !== undefined) {
    query = query.eq('is_verified', filters.verified);
  }

  query = query.order('rating', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as TradingSupplier[];
}

export async function getTradingOrders(supplierId?: string): Promise<TradingOrder[]> {
  let query = supabase
    .from('trading_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (supplierId) {
    query = query.eq('supplier_id', supplierId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as TradingOrder[];
}

export async function createTradingOrder(order: Partial<TradingOrder>): Promise<TradingOrder> {
  const { data, error } = await supabase
    .from('trading_orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as TradingOrder;
}

// ============================================================
// AFFILIATE ENGINE FUNCTIONS
// ============================================================

export async function getAffiliateProducts(filters?: {
  platform?: AffiliatePlatform;
  productId?: string;
}): Promise<AffiliateProduct[]> {
  let query = supabase
    .from('affiliate_products')
    .select('*')
    .eq('is_active', true);

  if (filters?.platform) {
    query = query.eq('external_platform', filters.platform);
  }
  if (filters?.productId) {
    query = query.eq('product_id', filters.productId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AffiliateProduct[];
}

export async function trackAffiliateClick(affiliateId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_affiliate_click', { p_id: affiliateId });
  if (error) {
    await supabase
      .from('affiliate_products')
      .update({ clicks: supabase.rpc('increment') })
      .eq('id', affiliateId);
  }
}

export async function trackAffiliateConversion(affiliateId: string, amount: number): Promise<void> {
  const { error } = await supabase
    .from('affiliate_products')
    .update({
      conversions: supabase.rpc('increment'),
      total_commission_earned: supabase.rpc('increment', { value: amount }),
    })
    .eq('id', affiliateId);

  if (error) throw error;
}

// ============================================================
// HOME CLOUD STORE FUNCTIONS
// ============================================================

export async function getHomeCloudStores(filters?: {
  city?: string;
  state?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}): Promise<HomeCloudStore[]> {
  let query = supabase
    .from('home_cloud_stores')
    .select('*')
    .eq('is_active', true)
    .eq('is_verified', true);

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  if (filters?.state) {
    query = query.eq('state', filters.state);
  }
  if (filters?.pincode) {
    query = query.eq('pincode', filters.pincode);
  }

  query = query.order('rating', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as HomeCloudStore[];
}

export async function getHomeCloudStore(storeId: string): Promise<HomeCloudStore | null> {
  const { data, error } = await supabase
    .from('home_cloud_stores')
    .select('*')
    .eq('id', storeId)
    .maybeSingle();

  if (error) throw error;
  return data as HomeCloudStore | null;
}

export async function getHomeCloudStoreProducts(storeId: string): Promise<Product[]> {
  const { data: store } = await supabase
    .from('home_cloud_stores')
    .select('seller_id')
    .eq('id', storeId)
    .maybeSingle();

  if (!store?.seller_id) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', store.seller_id)
    .eq('status', PRODUCT_STATUS.ACTIVE);

  if (error) throw error;
  return (data || []) as Product[];
}

// ============================================================
// PRIVATE LABEL ENGINE FUNCTIONS
// ============================================================

export async function getPrivateLabelBrands(filters?: {
  category?: PrivateLabelCategory;
  launchStatus?: string;
}): Promise<PrivateLabelBrand[]> {
  let query = supabase
    .from('private_label_brands')
    .select('*');

  if (filters?.category) {
    query = query.eq('brand_category', filters.category);
  }
  if (filters?.launchStatus) {
    query = query.eq('launch_status', filters.launchStatus);
  }

  query = query.order('brand_name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as PrivateLabelBrand[];
}

export async function getPrivateLabelBrand(brandId: string): Promise<PrivateLabelBrand | null> {
  const { data, error } = await supabase
    .from('private_label_brands')
    .select('*')
    .eq('id', brandId)
    .maybeSingle();

  if (error) throw error;
  return data as PrivateLabelBrand | null;
}

export function getPrivateLabelArchitecture(): Array<{
  name: string;
  category: PrivateLabelCategory;
  tagline: string;
  targetAudience: string;
  positioning: string;
}> {
  return [
    { name: 'VLOOP Essentials', category: 'essentials', tagline: 'Everyday Value', targetAudience: 'All households', positioning: 'budget' },
    { name: 'VLOOP Aura', category: 'aura', tagline: 'Feel the Difference', targetAudience: 'Premium seekers', positioning: 'premium' },
    { name: 'VLOOP Apparel', category: 'apparel', tagline: 'Style for Every Story', targetAudience: 'Fashion conscious', positioning: 'mid_range' },
    { name: 'VLOOP Home', category: 'home', tagline: 'Make It Yours', targetAudience: 'Home makers', positioning: 'mid_range' },
    { name: 'VLOOP Organic', category: 'organic', tagline: 'Pure. Natural. Yours.', targetAudience: 'Health conscious', positioning: 'premium' },
    { name: 'VLOOP Kitchen', category: 'kitchen', tagline: 'Chef at Home', targetAudience: 'Cooking enthusiasts', positioning: 'mid_range' },
    { name: 'VLOOP Health', category: 'health', tagline: 'Wellness First', targetAudience: 'Wellness seekers', positioning: 'premium' },
    { name: 'VLOOP Kids', category: 'kids', tagline: 'Happy Kids, Happy Parents', targetAudience: 'Parents', positioning: 'mid_range' },
    { name: 'VLOOP Electronics', category: 'electronics', tagline: 'Smart Living', targetAudience: 'Tech savvy', positioning: 'mid_range' },
    { name: 'VLOOP Beauty', category: 'beauty', tagline: 'Your Glow, Your Way', targetAudience: 'Beauty conscious', positioning: 'premium' },
    { name: 'VLOOP Sports', category: 'sports', tagline: 'Play Your Best', targetAudience: 'Fitness enthusiasts', positioning: 'mid_range' },
  ];
}

// ============================================================
// AI RECOMMENDATION ENGINE FUNCTIONS
// ============================================================

export async function getAIRecommendations(userId: string, recommendationType: AIRecommendation['recommendation_type']): Promise<AIRecommendation | null> {
  const { data, error } = await supabase
    .from('ai_recommendation_queue')
    .select('*')
    .eq('user_id', userId)
    .eq('recommendation_type', recommendationType)
    .eq('is_processed', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as AIRecommendation | null;
}

export async function getAIRecommendedProducts(userId: string): Promise<Product[]> {
  const recommendation = await getAIRecommendations(userId, 'home');
  if (!recommendation || !recommendation.recommended_products?.length) {
    return getTrendingProducts(10);
  }

  const productIds = recommendation.recommended_products
    .map(r => r.product_id)
    .slice(0, 10);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', PRODUCT_STATUS.ACTIVE);

  if (error) throw error;
  return (data || []) as Product[];
}

export interface AIRecommendationFactors {
  shoppingHistory: boolean;
  purchaseBehaviour: boolean;
  location: boolean;
  trendingProducts: boolean;
  careClubActivity: boolean;
  season: boolean;
  language: boolean;
  budget: boolean;
}

export function getAIRecommendationFactors(): AIRecommendationFactors {
  return {
    shoppingHistory: true,
    purchaseBehaviour: true,
    location: true,
    trendingProducts: true,
    careClubActivity: true,
    season: true,
    language: true,
    budget: true,
  };
}

export function getAIRecommendationArchitecture(): {
  factors: AIRecommendationFactors;
  algorithm: string[];
  scoring: string;
  implementation: string;
} {
  return {
    factors: getAIRecommendationFactors(),
    algorithm: [
      'Collaborative filtering based on user purchase history',
      'Content-based filtering using product attributes',
      'Location-based recommendations for hyper-local products',
      'Trending analysis for popular products',
      'Care Club activity correlation for health products',
      'Seasonal adjustments for category prioritization',
      'Budget-aware recommendations within price range',
      'Language preference for regional products',
    ],
    scoring: 'Weighted scoring combining all factors with configurable weights',
    implementation: 'Architecture-ready. ML models to be trained on historical data.',
  };
}

// ============================================================
// MARKETPLACE ANALYTICS FUNCTIONS
// ============================================================

export async function getMarketplaceAnalytics(filters: {
  metricType?: string;
  dateFrom?: string;
  dateTo?: string;
  dimensionType?: string;
  dimensionValue?: string;
}): Promise<MarketplaceAnalytics[]> {
  let query = supabase
    .from('marketplace_analytics')
    .select('*')
    .order('date', { ascending: false });

  if (filters.metricType) {
    query = query.eq('metric_type', filters.metricType);
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo);
  }
  if (filters.dimensionType) {
    query = query.eq('dimension_type', filters.dimensionType);
  }
  if (filters.dimensionValue) {
    query = query.eq('dimension_value', filters.dimensionValue);
  }

  const { data, error } = await query.limit(100);
  if (error) throw error;
  return (data || []) as MarketplaceAnalytics[];
}

export async function getMarketplaceDashboardStats(): Promise<{
  totalProducts: number;
  activeProducts: number;
  totalSellers: number;
  verifiedSellers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCategories: number;
  topCategories: Array<{ name: string; count: number }>;
  topSellers: Array<{ name: string; sales: number }>;
}> {
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalSellers },
    { count: verifiedSellers },
    { count: totalOrders },
    { count: pendingOrders },
    { data: orders },
    { count: totalCategories },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sellers').select('*', { count: 'exact', head: true }),
    supabase.from('sellers').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('total_amount'),
    supabase.from('marketplace_categories').select('*', { count: 'exact', head: true }),
  ]);

  const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return {
    totalProducts: totalProducts || 0,
    activeProducts: activeProducts || 0,
    totalSellers: totalSellers || 0,
    verifiedSellers: verifiedSellers || 0,
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    totalRevenue,
    totalCategories: totalCategories || 0,
    topCategories: [],
    topSellers: [],
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function calculateDeliveryDate(deliveryType: DeliveryType): Date {
  const now = new Date();
  switch (deliveryType) {
    case 'same_day':
      return new Date(now.setDate(now.getDate() + 0));
    case 'express':
      return new Date(now.setDate(now.getDate() + 2));
    case 'hyper_local':
      return new Date(now.setHours(now.getHours() + 4));
    case 'digital':
      return new Date();
    case 'pickup':
      return new Date(now.setDate(now.getDate() + 1));
    case 'standard':
    default:
      return new Date(now.setDate(now.getDate() + 5));
  }
}

export function isProductAvailable(product: Product, quantity: number = 1): boolean {
  return product.status === 'active' &&
    product.visibility === 'public' &&
    product.stock >= quantity;
}

export function getSellerTypeLabel(sellerType: SellerType): string {
  const labels: Record<SellerType, string> = {
    individual: 'Individual Seller',
    local_shop: 'Local Shop',
    distributor: 'Distributor',
    brand: 'Brand',
    manufacturer: 'Manufacturer',
    importer: 'Importer',
    home_business: 'Home Business',
    district_franchise: 'District Franchise',
    state_franchise: 'State Franchise',
    international_supplier: 'International Supplier',
    affiliate_partner: 'Affiliate Partner',
  };
  return labels[sellerType] || sellerType;
}

export function getDeliveryTypeLabel(deliveryType: DeliveryType): string {
  const labels: Record<DeliveryType, string> = {
    standard: 'Standard Delivery (5-7 days)',
    express: 'Express Delivery (2-3 days)',
    same_day: 'Same Day Delivery',
    pickup: 'Store Pickup',
    digital: 'Digital Download',
    hyper_local: 'Hyper Local (4 hours)',
  };
  return labels[deliveryType] || deliveryType;
}
