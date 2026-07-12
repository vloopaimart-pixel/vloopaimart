/**
 * VLOOP GLOBAL MARKETPLACE & COMMERCE OPERATING SYSTEM
 * Phase 51 — Enterprise AI Commerce Platform
 */

import { supabase } from './supabase';

export const MARKETPLACE_ENGINE_VERSION = '51.0.0' as const;

// ============================================================
// BUSINESS CATEGORIES (31)
// ============================================================

export const BUSINESS_CATEGORIES = {
  GROCERY: 'grocery',
  FRUITS_VEGETABLES: 'fruits-vegetables',
  DAIRY: 'dairy',
  BEVERAGES: 'beverages',
  SNACKS: 'snacks',
  PERSONAL_CARE: 'personal-care',
  HOUSEHOLD: 'household',
  BABY_CARE: 'baby-care',
  HEALTH_WELLNESS: 'health-wellness',
  ELECTRONICS: 'electronics',
  FASHION: 'fashion',
  HOME_KITCHEN: 'home-kitchen',
  SPORTS_FITNESS: 'sports-fitness',
  BOOKS_STATIONERY: 'books-stationery',
  AUTOMOTIVE: 'automotive',
  PET_SUPPLIES: 'pet-supplies',
  TOYS_GAMES: 'toys-games',
  MOBILE_ACCESSORIES: 'electronics-accessories',
  APPLIANCES: 'appliances',
  FURNITURE: 'furniture',
  JEWELLERY: 'jewellery',
  BEAUTY: 'beauty',
  OFFICE_SUPPLIES: 'office-supplies',
  INDUSTRIAL: 'industrial',
  GARDEN: 'garden',
  HANDMADE: 'handmade',
  LOCAL_PRODUCTS: 'local-products',
  FUTURE_OPPORTUNITIES: 'future-opportunities',
  SERVICES: 'services',
  CARE_CLUB_PRODUCTS: 'care-club-products',
  SMART_DEALS: 'smart-deals',
} as const;

export type BusinessCategoryCode = typeof BUSINESS_CATEGORIES[keyof typeof BUSINESS_CATEGORIES];

export const CATEGORY_LABELS: Record<BusinessCategoryCode, string> = {
  grocery: 'Grocery & Staples',
  'fruits-vegetables': 'Fruits & Vegetables',
  dairy: 'Dairy & Bakery',
  beverages: 'Beverages',
  snacks: 'Snacks & Branded Foods',
  'personal-care': 'Personal Care',
  household: 'Household Items',
  'baby-care': 'Baby Care',
  'health-wellness': 'Health & Wellness',
  electronics: 'Electronics',
  fashion: 'Fashion & Apparel',
  'home-kitchen': 'Home & Kitchen',
  'sports-fitness': 'Sports & Fitness',
  'books-stationery': 'Books & Stationery',
  automotive: 'Automotive',
  'pet-supplies': 'Pet Supplies',
  'toys-games': 'Toys & Games',
  'electronics-accessories': 'Mobile Accessories',
  appliances: 'Home Appliances',
  furniture: 'Furniture',
  jewellery: 'Jewellery & Accessories',
  beauty: 'Beauty & Cosmetics',
  'office-supplies': 'Office Supplies',
  industrial: 'Industrial & Tools',
  garden: 'Garden & Outdoor',
  handmade: 'Handmade & Crafts',
  'local-products': 'Local & Village Products',
  'future-opportunities': 'Future Opportunities',
  services: 'Services',
  'care-club-products': 'Care Club Products',
  'smart-deals': 'Smart Deals',
};

// ============================================================
// RECOMMENDATION TYPES
// ============================================================

export const RECOMMENDATION_TYPES = {
  PURCHASE_HISTORY: 'purchase_history',
  BROWSING_HISTORY: 'browsing_history',
  LOCATION: 'location',
  CATEGORY_INTEREST: 'category_interest',
  SEASON: 'season',
  COMMUNITY_TRENDS: 'community_trends',
  TRENDING: 'trending',
  NEARBY: 'nearby',
  AI_SUGGESTED: 'ai_suggested',
} as const;

export type RecommendationType = typeof RECOMMENDATION_TYPES[keyof typeof RECOMMENDATION_TYPES];

// ============================================================
// INTERFACES
// ============================================================

export interface BusinessCategory {
  id: string;
  category_code: BusinessCategoryCode;
  category_name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  banner_image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  product_count: number;
  seller_count: number;
}

export interface SellerStore {
  id: string;
  seller_id: string;
  store_name: string;
  store_slug: string;
  store_description: string | null;
  store_logo_url: string | null;
  store_banner_url: string | null;
  store_address: string | null;
  store_city: string | null;
  store_state: string | null;
  store_pincode: string | null;
  store_phone: string | null;
  store_email: string | null;
  business_hours: Record<string, { open: string; close: string }>;

  is_verified: boolean;
  verification_badge: string;
  gst_number: string | null;
  pan_number: string | null;

  rating_avg: number;
  rating_count: number;
  review_count: number;

  total_products: number;
  total_sales: number;
  total_orders: number;

  is_home_seller: boolean;
  is_women_entrepreneur: boolean;
  is_village_store: boolean;
  is_micro_warehouse: boolean;
  is_community_delivery: boolean;

  ai_recommendation_score: number;
  ai_category: string | null;

  is_active: boolean;
  created_at: string;
}

export interface ProductRecommendation {
  id: string;
  user_id: string;
  product_id: string;
  recommendation_type: RecommendationType;
  relevance_score: number;
  click_probability: number;
  purchase_probability: number;
  context_data: Record<string, unknown>;
  was_shown: boolean;
  was_clicked: boolean;
  was_purchased: boolean;
  expires_at: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  notes: string | null;
  priority: number;
}

export interface RecentlyViewedProduct {
  id: string;
  user_id: string;
  product_id: string;
  view_count: number;
  last_viewed_at: string;
}

export interface ProductQuestion {
  id: string;
  product_id: string;
  user_id: string;
  question_text: string;
  is_anonymous: boolean;
  upvotes: number;
  answer_text: string | null;
  answered_by: string | null;
  answered_at: string | null;
  is_verified_answer: boolean;
  is_active: boolean;
  created_at: string;
}

export interface SellerReview {
  id: string;
  seller_id: string;
  customer_id: string;
  order_id: string | null;
  rating: number;
  review_title: string | null;
  review_text: string | null;
  images: string[];
  is_verified_purchase: boolean;
  is_active: boolean;
  created_at: string;
}

export interface FutureTradingItem {
  id: string;
  seller_id: string;
  trading_type: 'private_label' | 'import' | 'export' | 'wholesale' | 'b2b' | 'global_sourcing';
  product_name: string;
  description: string | null;
  min_order_quantity: number | null;
  max_order_quantity: number | null;
  unit_price: number | null;
  currency: string;
  origin_country: string | null;
  destination_countries: string[];
  specifications: Record<string, unknown>;
  certifications: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  is_active: boolean;
  created_at: string;
}

export interface AffiliateProduct {
  id: string;
  product_id: string | null;
  affiliate_partner: 'amazon' | 'flipkart' | 'other';
  external_product_id: string | null;
  external_url: string | null;
  commission_rate: number;
  smartpoint_reward: number;
  last_synced_at: string | null;
  sync_status: string;
  is_active: boolean;
}

export interface MarketplaceNotification {
  id: string;
  user_id: string;
  notification_type: 'order_update' | 'price_drop' | 'back_in_stock' | 'wishlist_sale' | 'recommendation' | 'offer' | 'delivery' | 'review_request' | 'seller_update';
  title: string;
  message: string | null;
  data: Record<string, unknown>;
  image_url: string | null;
  action_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getBusinessCategories(): Promise<BusinessCategory[]> {
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as BusinessCategory[];
}

export async function getCategoryBySlug(slug: string): Promise<BusinessCategory | null> {
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data as BusinessCategory | null;
}

export async function getFeaturedCategories(): Promise<BusinessCategory[]> {
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as BusinessCategory[];
}

export async function getSellerStores(limit: number = 20): Promise<SellerStore[]> {
  const { data, error } = await supabase
    .from('seller_stores')
    .select('*')
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as SellerStore[];
}

export async function getSellerBySlug(slug: string): Promise<SellerStore | null> {
  const { data, error } = await supabase
    .from('seller_stores')
    .select('*')
    .eq('store_slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data as SellerStore | null;
}

export async function getAIRecommendations(userId: string): Promise<ProductRecommendation[]> {
  const { data, error } = await supabase
    .from('marketplace_recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('was_shown', false)
    .gt('expires_at', new Date().toISOString())
    .order('relevance_score', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []) as ProductRecommendation[];
}

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('marketplace_wishlist')
    .select('*, products(*)')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  if (error) throw error;
  return (data || []) as WishlistItem[];
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('marketplace_wishlist')
    .insert({ user_id: userId, product_id: productId });
  if (error && !error.message.includes('duplicate')) throw error;
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('marketplace_wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw error;
}

export async function getRecentlyViewed(userId: string, limit: number = 20): Promise<RecentlyViewedProduct[]> {
  const { data, error } = await supabase
    .from('marketplace_recently_viewed')
    .select('*, products(*)')
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as RecentlyViewedProduct[];
}

export async function trackProductView(userId: string, productId: string): Promise<void> {
  await supabase.rpc('marketplace_track_view', {
    p_user_id: userId,
    p_product_id: productId,
  });
}

export async function getProductQuestions(productId: string): Promise<ProductQuestion[]> {
  const { data, error } = await supabase
    .from('marketplace_product_questions')
    .select('*')
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('upvotes', { ascending: false });
  if (error) throw error;
  return (data || []) as ProductQuestion[];
}

export async function getSellerReviews(sellerId: string): Promise<SellerReview[]> {
  const { data, error } = await supabase
    .from('marketplace_seller_reviews')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as SellerReview[];
}

export async function getNotifications(userId: string): Promise<MarketplaceNotification[]> {
  const { data, error } = await supabase
    .from('marketplace_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []) as MarketplaceNotification[];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('marketplace_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);
  if (error) throw error;
}

export async function getFutureTradingItems(): Promise<FutureTradingItem[]> {
  const { data, error } = await supabase
    .from('marketplace_future_trading')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as FutureTradingItem[];
}

export async function getAffiliateProducts(limit: number = 20): Promise<AffiliateProduct[]> {
  const { data, error } = await supabase
    .from('marketplace_affiliate_products')
    .select('*')
    .eq('is_active', true)
    .limit(limit);
  if (error) throw error;
  return (data || []) as AffiliateProduct[];
}

export async function searchProducts(query: string, filters?: Record<string, unknown>): Promise<ProductSearchResult[]> {
  let queryBuilder = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`);
  }

  const { data, error } = await queryBuilder.limit(50);
  if (error) throw error;
  return (data || []) as ProductSearchResult[];
}

export interface ProductSearchResult {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  brand: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getCategoryLabel(code: string): string {
  return CATEGORY_LABELS[code as BusinessCategoryCode] || code;
}

export function formatPrice(price: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getVerificationBadgeColor(badge: string): string {
  switch (badge) {
    case 'verified': return 'bg-emerald-500/20 text-emerald-400';
    case 'pending': return 'bg-amber-500/20 text-amber-400';
    case 'rejected': return 'bg-red-500/20 text-red-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
}

export function getTradingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    private_label: 'Private Label',
    import: 'Import',
    export: 'Export',
    wholesale: 'Wholesale',
    b2b: 'B2B',
    global_sourcing: 'Global Sourcing',
  };
  return labels[type] || type;
}

export function getPartnerLabel(partner: string): string {
  const labels: Record<string, string> = {
    amazon: 'Amazon',
    flipkart: 'Flipkart',
    other: 'Partner',
  };
  return labels[partner] || partner;
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockCategories(): BusinessCategory[] {
  return Object.entries(CATEGORY_LABELS).map(([code, name], i) => ({
    id: `cat-${i}`,
    category_code: code as BusinessCategoryCode,
    category_name: name,
    slug: code,
    description: `${name} products`,
    icon: null,
    banner_image_url: null,
    parent_id: null,
    display_order: i,
    is_active: true,
    is_featured: i < 6,
    product_count: Math.floor(Math.random() * 500) + 10,
    seller_count: Math.floor(Math.random() * 50) + 1,
  }));
}

export function getMockSellerStores(): SellerStore[] {
  return [
    {
      id: 'store-1',
      seller_id: 'seller-1',
      store_name: 'Fresh Farm Store',
      store_slug: 'fresh-farm-store',
      store_description: 'Fresh produce and groceries delivered to your doorstep',
      store_logo_url: 'https://images.unsplash.com/photo-1488459716781-31dba5a5a769?w=200',
      store_banner_url: 'https://images.unsplash.com/photo-1542838132-2589913145b6?w=800',
      store_address: '123 Main Street',
      store_city: 'Mumbai',
      store_state: 'Maharashtra',
      store_pincode: '400001',
      store_phone: '+91-9876543210',
      store_email: 'store@freshfarm.com',
      business_hours: { monday: { open: '09:00', close: '21:00' } },
      is_verified: true,
      verification_badge: 'verified',
      gst_number: 'GST12345',
      pan_number: 'ABCDE1234F',
      rating_avg: 4.8,
      rating_count: 1250,
      review_count: 856,
      total_products: 48,
      total_sales: 15420,
      total_orders: 3200,
      is_home_seller: false,
      is_women_entrepreneur: true,
      is_village_store: false,
      is_micro_warehouse: true,
      is_community_delivery: true,
      ai_recommendation_score: 92,
      ai_category: 'grocery',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'store-2',
      seller_id: 'seller-2',
      store_name: 'Tech World',
      store_slug: 'tech-world',
      store_description: 'Latest electronics and gadgets',
      store_logo_url: 'https://images.unsplash.com/photo-1519389950475-1b3d0cc0b8e2?w=200',
      store_banner_url: 'https://images.unsplash.com/photo-1468495244123-6c6c3321d00b?w=800',
      store_address: '456 Tech Park',
      store_city: 'Bangalore',
      store_state: 'Karnataka',
      store_pincode: '560001',
      store_phone: '+91-9876543211',
      store_email: 'store@techworld.com',
      business_hours: { monday: { open: '10:00', close: '22:00' } },
      is_verified: true,
      verification_badge: 'verified',
      gst_number: 'GST67890',
      pan_number: 'FGHIJ5678K',
      rating_avg: 4.6,
      rating_count: 890,
      review_count: 542,
      total_products: 120,
      total_sales: 28500,
      total_orders: 5200,
      is_home_seller: false,
      is_women_entrepreneur: false,
      is_village_store: false,
      is_micro_warehouse: false,
      is_community_delivery: false,
      ai_recommendation_score: 88,
      ai_category: 'electronics',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];
}

export function getMockNotifications(): MarketplaceNotification[] {
  return [
    {
      id: 'notif-1',
      user_id: 'user-1',
      notification_type: 'price_drop',
      title: 'Price Drop Alert!',
      message: 'An item in your wishlist has dropped by 20%',
      data: { product_id: 'prod-1' },
      image_url: null,
      action_url: '/product/prod-1',
      is_read: false,
      read_at: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'user-1',
      notification_type: 'back_in_stock',
      title: 'Back in Stock',
      message: 'Your favorite product is available again',
      data: { product_id: 'prod-2' },
      image_url: null,
      action_url: '/product/prod-2',
      is_read: true,
      read_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ];
}
