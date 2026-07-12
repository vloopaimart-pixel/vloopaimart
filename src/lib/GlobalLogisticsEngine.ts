/**
 * VLOOP GLOBAL LOGISTICS & FULFILLMENT ENGINE
 * Phase 36 — Complete Logistics Architecture
 *
 * Enterprise architecture supporting:
 * - Delivery Models (Store Pickup, Local Shop, Home Cloud, Warehouse, Courier, International)
 * - Warehouse Hierarchy (Country, State, District, City, Micro, Home Cloud)
 * - AI Order Allocation
 * - Delivery Status Workflow
 * - Partner Delivery Network
 * - Inventory Sync
 * - AI Logistics Intelligence
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const LOGISTICS_ENGINE_VERSION = '36.0.0' as const;

export const LOGISTICS_ENGINE_META = {
  version: LOGISTICS_ENGINE_VERSION,
  name: 'VLOOP Global Logistics & Fulfillment Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// CONSTANTS
// ============================================================

export const DELIVERY_MODEL_TYPES = {
  STORE_PICKUP: 'store_pickup',
  LOCAL_SHOP_DELIVERY: 'local_shop_delivery',
  HOME_CLOUD_DELIVERY: 'home_cloud_delivery',
  WAREHOUSE_DELIVERY: 'warehouse_delivery',
  COURIER_DELIVERY: 'courier_delivery',
  INTERNATIONAL_SHIPPING: 'international_shipping',
  SAME_DAY_EXPRESS: 'same_day_express',
  HYPER_LOCAL: 'hyper_local',
  DRONE_DELIVERY: 'drone_delivery',
  FUTURE_SERVICE: 'future_service',
} as const;

export type DeliveryModelType = typeof DELIVERY_MODEL_TYPES[keyof typeof DELIVERY_MODEL_TYPES];

export const DELIVERY_STATUS = {
  ORDER_RECEIVED: 'order_received',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  READY: 'ready',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

export type DeliveryStatus = typeof DELIVERY_STATUS[keyof typeof DELIVERY_STATUS];

export const WAREHOUSE_LEVELS = {
  COUNTRY: 'country',
  STATE: 'state',
  DISTRICT: 'district',
  CITY: 'city',
  MICRO: 'micro',
  HOME_CLOUD: 'home_cloud',
} as const;

export type WarehouseLevel = typeof WAREHOUSE_LEVELS[keyof typeof WAREHOUSE_LEVELS];

export const DELIVERY_PARTNER_TYPES = {
  OWN_FLEET: 'own_fleet',
  LOCAL_PARTNER: 'local_partner',
  COURIER_COMPANY: 'courier_company',
  THIRD_PARTY_LOGISTICS: 'third_party_logistics',
  DRONE_SERVICE: 'drone_service',
  HYPER_LOCAL: 'hyper_local',
  INTERNATIONAL_COURIER: 'international_courier',
} as const;

export type DeliveryPartnerType = typeof DELIVERY_PARTNER_TYPES[keyof typeof DELIVERY_PARTNER_TYPES];

export const ALLOCATION_TYPES = {
  NEAREST_WAREHOUSE: 'nearest_warehouse',
  NEAREST_SHOP: 'nearest_shop',
  NEAREST_HOME_CLOUD: 'nearest_home_cloud',
  FASTEST_ROUTE: 'fastest_route',
  LOWEST_COST: 'lowest_cost',
  HIGHEST_RATING: 'highest_rating',
  AI_OPTIMIZED: 'ai_optimized',
} as const;

export type AllocationType = typeof ALLOCATION_TYPES[keyof typeof ALLOCATION_TYPES];

export const INTEL_TYPES = {
  DEMAND_FORECAST: 'demand_forecast',
  STOCK_PREDICTION: 'stock_prediction',
  DELIVERY_OPTIMIZATION: 'delivery_optimization',
  ROUTE_OPTIMIZATION: 'route_optimization',
  TRAFFIC_ANALYSIS: 'traffic_analysis',
  WAREHOUSE_RECOMMENDATION: 'warehouse_recommendation',
  COST_OPTIMIZATION: 'cost_optimization',
  CAPACITY_PLANNING: 'capacity_planning',
} as const;

export type IntelType = typeof INTEL_TYPES[keyof typeof INTEL_TYPES];

// ============================================================
// TYPES
// ============================================================

export interface DeliveryZone {
  id: string;
  zone_code: string;
  zone_name: string;
  zone_type: 'country' | 'state' | 'district' | 'city' | 'pincode' | 'custom';
  country: string;
  state: string | null;
  district: string | null;
  city: string | null;
  pincodes: string[] | null;
  bounds: Record<string, unknown>;
  is_active: boolean;
}

export interface DeliveryModel {
  id: string;
  model_code: string;
  model_name: string;
  model_type: DeliveryModelType;
  description: string | null;
  min_delivery_hours: number;
  max_delivery_hours: number;
  is_same_day: boolean;
  is_express: boolean;
  is_international: boolean;
  requires_address: boolean;
  supports_tracking: boolean;
  supports_cod: boolean;
  supports_returns: boolean;
  base_charge: number;
  per_km_charge: number;
  weight_charge_per_kg: number;
  cod_charge: number;
  min_order_value: number;
  free_delivery_above: number;
  max_weight_kg: number | null;
  max_dimensions_cm: string | null;
  is_active: boolean;
  priority: number;
}

export interface Warehouse {
  id: string;
  warehouse_code: string;
  warehouse_name: string;
  warehouse_type: string;
  warehouse_level: WarehouseLevel;
  address: string;
  city: string;
  state: string | null;
  country: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  service_radius_km: number;
  supports_pickup: boolean;
  supports_delivery: boolean;
  daily_capacity: number;
  current_queue: number;
  processing_time_hours: number;
  zone_id: string | null;
  is_active: boolean;
  operational_hours: { start: string; end: string };
}

export interface OrderDeliveryDetail {
  id: string;
  order_id: string;
  delivery_model_id: string | null;
  warehouse_id: string | null;
  seller_id: string | null;
  home_cloud_store_id: string | null;
  delivery_zone_id: string | null;
  pickup_address: string | null;
  pickup_city: string | null;
  pickup_state: string | null;
  pickup_pincode: string | null;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_pincode: string | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  delivery_instructions: string | null;
  delivery_contact_name: string | null;
  delivery_contact_phone: string | null;
  delivery_status: DeliveryStatus;
  status_history: Array<{ status: string; timestamp: string; location?: string; notes?: string }>;
  estimated_pickup_at: string | null;
  actual_pickup_at: string | null;
  estimated_delivery_at: string | null;
  actual_delivery_at: string | null;
  delivery_attempts: number;
  delivery_partner_type: DeliveryPartnerType | null;
  delivery_partner_id: string | null;
  delivery_partner_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  delivery_distance_km: number | null;
  delivery_charges: number;
  cod_charges: number;
  packaging_charges: number;
  total_delivery_cost: number;
  delivery_rating: number | null;
  delivery_rating_notes: string | null;
}

export interface DeliveryPartner {
  id: string;
  partner_code: string;
  partner_name: string;
  partner_type: DeliveryPartnerType;
  country: string;
  contact_email: string | null;
  contact_phone: string | null;
  api_endpoint: string | null;
  webhook_url: string | null;
  supported_models: string[];
  tracking_support: boolean;
  cod_support: boolean;
  returns_support: boolean;
  insurance_support: boolean;
  base_charge: number;
  per_kg_charge: number;
  per_km_charge: number;
  min_charge: number;
  max_weight_kg: number | null;
  rating: number;
  total_deliveries: number;
  on_time_rate: number;
  is_active: boolean;
  is_verified: boolean;
  contract_start: string | null;
  contract_end: string | null;
  contract_terms: Record<string, unknown>;
}

export interface AIOrderAllocation {
  id: string;
  order_id: string;
  allocation_type: AllocationType;
  allocation_criteria: Record<string, unknown>;
  candidate_sources: Array<{ id: string; type: string; score: number; distance: number }>;
  selected_source_id: string | null;
  selected_source_type: 'warehouse' | 'seller' | 'home_cloud' | null;
  selected_warehouse_id: string | null;
  selected_seller_id: string | null;
  selected_home_cloud_id: string | null;
  selection_score: number | null;
  selection_factors: Record<string, unknown>;
  estimated_pickup_time: string | null;
  estimated_delivery_time: string | null;
  estimated_cost: number | null;
  optimization_score: number;
  is_processed: boolean;
  processed_at: string | null;
  is_assigned: boolean;
  assigned_at: string | null;
}

export interface DeliveryStatusTimeline {
  id: string;
  order_delivery_id: string;
  status: string;
  previous_status: string | null;
  status_description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  images: string[] | null;
  updated_by: string | null;
  created_at: string;
}

export interface InventorySyncQueue {
  id: string;
  sync_type: 'warehouse_stock' | 'seller_stock' | 'partner_stock' | 'home_cloud_inventory' | 'full_sync';
  product_id: string | null;
  warehouse_id: string | null;
  seller_id: string | null;
  home_cloud_store_id: string | null;
  quantity_before: number | null;
  quantity_after: number | null;
  sync_reason: string | null;
  sync_status: 'pending' | 'processing' | 'synced' | 'failed';
  sync_started_at: string | null;
  sync_completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
}

export interface InventoryLocation {
  id: string;
  product_id: string;
  location_type: 'warehouse' | 'seller' | 'home_cloud_store' | 'partner' | 'transit';
  warehouse_id: string | null;
  seller_id: string | null;
  home_cloud_store_id: string | null;
  quantity_available: number;
  quantity_reserved: number;
  quantity_in_transit: number;
  quantity_damaged: number;
  last_stock_check_at: string | null;
  next_sync_at: string | null;
  sync_status: string;
}

export interface AILogisticsIntelligence {
  id: string;
  intelligence_type: IntelType;
  entity_type: string;
  entity_id: string | null;
  prediction_data: Record<string, unknown>;
  confidence_score: number | null;
  model_version: string | null;
  factors: Record<string, unknown>;
  recommendations: Array<{ suggestion: string; priority: string }>;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
}

export interface DeliveryRoute {
  id: string;
  route_code: string;
  route_name: string | null;
  delivery_partner_id: string | null;
  warehouse_id: string | null;
  delivery_date: string;
  route_sequence: Array<{ stop_id: string; sequence: number; address: string }>;
  total_stops: number;
  total_distance_km: number;
  estimated_duration_minutes: number;
  actual_duration_minutes: number | null;
  started_at: string | null;
  completed_at: string | null;
  route_status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  optimization_score: number | null;
  driver_name: string | null;
  driver_phone: string | null;
  vehicle_number: string | null;
  vehicle_type: string | null;
}

export interface RouteStop {
  id: string;
  route_id: string;
  order_id: string | null;
  delivery_detail_id: string | null;
  stop_sequence: number;
  stop_type: 'pickup' | 'delivery' | 'return';
  address: string | null;
  city: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  estimated_arrival: string | null;
  actual_arrival: string | null;
  stop_status: 'pending' | 'arrived' | 'completed' | 'failed' | 'skipped';
  notes: string | null;
}

export interface LogisticsAnalytic {
  id: string;
  date: string;
  warehouse_id: string | null;
  zone_id: string | null;
  delivery_model_id: string | null;
  delivery_partner_id: string | null;
  total_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  returned_orders: number;
  on_time_deliveries: number;
  delayed_deliveries: number;
  avg_delivery_time_hours: number;
  avg_delivery_cost: number;
  total_revenue: number;
  on_time_rate: number;
  cancellation_rate: number;
  return_rate: number;
  customer_rating_avg: number;
}

// ============================================================
// DELIVERY MODEL FUNCTIONS
// ============================================================

export async function getDeliveryModels(): Promise<DeliveryModel[]> {
  const { data, error } = await supabase
    .from('delivery_models')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (error) throw error;
  return (data || []) as DeliveryModel[];
}

export async function getDeliveryModel(modelId: string): Promise<DeliveryModel | null> {
  const { data, error } = await supabase
    .from('delivery_models')
    .select('*')
    .eq('id', modelId)
    .maybeSingle();

  if (error) throw error;
  return data as DeliveryModel | null;
}

export async function getDeliveryModelsByType(modelType: DeliveryModelType): Promise<DeliveryModel[]> {
  const { data, error } = await supabase
    .from('delivery_models')
    .select('*')
    .eq('is_active', true)
    .eq('model_type', modelType);

  if (error) throw error;
  return (data || []) as DeliveryModel[];
}

export function getDeliveryModelArchitecture(): Array<{ type: DeliveryModelType; name: string; description: string }> {
  return [
    { type: 'store_pickup', name: 'Store Pickup', description: 'Customer picks up from store' },
    { type: 'local_shop_delivery', name: 'Local Shop Delivery', description: 'Nearby shop delivers locally' },
    { type: 'home_cloud_delivery', name: 'Home Cloud Store Delivery', description: 'Home-based seller hyper-local delivery' },
    { type: 'warehouse_delivery', name: 'Warehouse Delivery', description: 'Standard delivery from fulfillment center' },
    { type: 'courier_delivery', name: 'Courier Delivery', description: 'Third-party courier service' },
    { type: 'international_shipping', name: 'International Shipping', description: 'Global shipping service' },
    { type: 'same_day_express', name: 'Same Day Express', description: 'Same day delivery for urgent orders' },
    { type: 'hyper_local', name: 'Hyper Local', description: 'Ultra-fast 50-minute delivery (future)' },
    { type: 'drone_delivery', name: 'Drone Delivery', description: 'Autonomous drone delivery (future)' },
    { type: 'future_service', name: 'Future Service', description: 'Reserved for future delivery innovations' },
  ];
}

// ============================================================
// DELIVERY ZONE FUNCTIONS
// ============================================================

export async function getDeliveryZones(filters?: {
  zoneType?: string;
  country?: string;
  state?: string;
}): Promise<DeliveryZone[]> {
  let query = supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true);

  if (filters?.zoneType) {
    query = query.eq('zone_type', filters.zoneType);
  }
  if (filters?.country) {
    query = query.eq('country', filters.country);
  }
  if (filters?.state) {
    query = query.eq('state', filters.state);
  }

  const { data, error } = await query.order('zone_name', { ascending: true });
  if (error) throw error;
  return (data || []) as DeliveryZone[];
}

export async function getDeliveryZone(zoneId: string): Promise<DeliveryZone | null> {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('id', zoneId)
    .maybeSingle();

  if (error) throw error;
  return data as DeliveryZone | null;
}

// ============================================================
// WAREHOUSE FUNCTIONS
// ============================================================

export async function getWarehousesByLevel(level: WarehouseLevel): Promise<Warehouse[]> {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('is_active', true)
    .eq('warehouse_level', level);

  if (error) throw error;
  return (data || []) as Warehouse[];
}

export async function getNearbyWarehouses(lat: number, lng: number, radiusKm: number = 50): Promise<Warehouse[]> {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;

  const warehouses = (data || []).filter(w => {
    if (!w.latitude || !w.longitude) return false;
    const distance = calculateDistance(lat, lng, w.latitude, w.longitude);
    return distance <= radiusKm && distance <= w.service_radius_km;
  });

  return warehouses as Warehouse[];
}

export function getWarehouseHierarchyStructure(): Array<{ level: WarehouseLevel; name: string; description: string }> {
  return [
    { level: 'country', name: 'Country Warehouse', description: 'National distribution hub' },
    { level: 'state', name: 'State Warehouse', description: 'Regional fulfillment center' },
    { level: 'district', name: 'District Warehouse', description: 'District-level distribution' },
    { level: 'city', name: 'City Warehouse', description: 'City fulfillment center' },
    { level: 'micro', name: 'Micro Warehouse', description: 'Neighborhood hub' },
    { level: 'home_cloud', name: 'Home Cloud Store', description: 'Home-based micro warehouse' },
  ];
}

// ============================================================
// ORDER DELIVERY FUNCTIONS
// ============================================================

export async function getOrderDelivery(orderId: string): Promise<OrderDeliveryDetail | null> {
  const { data, error } = await supabase
    .from('order_delivery_details')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data as OrderDeliveryDetail | null;
}

export async function createOrderDelivery(delivery: Partial<OrderDeliveryDetail>): Promise<OrderDeliveryDetail> {
  const { data, error } = await supabase
    .from('order_delivery_details')
    .insert(delivery)
    .select()
    .single();

  if (error) throw error;
  return data as OrderDeliveryDetail;
}

export async function updateDeliveryStatusApi(deliveryId: string, status: DeliveryStatus, notes?: string, location?: string): Promise<void> {
  const { error } = await supabase.rpc('update_delivery_status', {
    p_delivery_id: deliveryId,
    p_new_status: status,
    p_location: location || null,
    p_notes: notes || null,
  });

  if (error) throw error;
}

export async function getDeliveryStatusTimeline(deliveryId: string): Promise<DeliveryStatusTimeline[]> {
  const { data, error } = await supabase
    .from('delivery_status_timeline')
    .select('*')
    .eq('order_delivery_id', deliveryId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as DeliveryStatusTimeline[];
}

export function getDeliveryStatusFlow(): Array<{ status: DeliveryStatus; label: string; transitions: DeliveryStatus[] }> {
  return [
    { status: 'order_received', label: 'Order Received', transitions: ['confirmed', 'cancelled'] },
    { status: 'confirmed', label: 'Confirmed', transitions: ['processing', 'cancelled'] },
    { status: 'processing', label: 'Processing', transitions: ['packed', 'cancelled'] },
    { status: 'packed', label: 'Packed', transitions: ['ready', 'assigned', 'cancelled'] },
    { status: 'ready', label: 'Ready for Pickup', transitions: ['assigned', 'picked_up', 'cancelled'] },
    { status: 'assigned', label: 'Delivery Agent Assigned', transitions: ['picked_up', 'cancelled'] },
    { status: 'picked_up', label: 'Picked Up', transitions: ['in_transit', 'cancelled'] },
    { status: 'in_transit', label: 'In Transit', transitions: ['out_for_delivery', 'cancelled', 'failed'] },
    { status: 'out_for_delivery', label: 'Out for Delivery', transitions: ['delivered', 'failed', 'returned'] },
    { status: 'delivered', label: 'Delivered', transitions: ['returned'] },
    { status: 'cancelled', label: 'Cancelled', transitions: ['refunded'] },
    { status: 'returned', label: 'Returned', transitions: ['refunded'] },
    { status: 'refunded', label: 'Refunded', transitions: [] },
    { status: 'failed', label: 'Delivery Failed', transitions: ['returned', 'cancelled'] },
  ];
}

// ============================================================
// DELIVERY PARTNER FUNCTIONS
// ============================================================

export async function getDeliveryPartners(filters?: {
  partnerType?: DeliveryPartnerType;
  active?: boolean;
}): Promise<DeliveryPartner[]> {
  let query = supabase
    .from('delivery_partners')
    .select('*');

  if (filters?.partnerType) {
    query = query.eq('partner_type', filters.partnerType);
  }
  if (filters?.active !== undefined) {
    query = query.eq('is_active', filters.active);
  }

  const { data, error } = await query.order('rating', { ascending: false });
  if (error) throw error;
  return (data || []) as DeliveryPartner[];
}

export async function getDeliveryPartner(partnerId: string): Promise<DeliveryPartner | null> {
  const { data, error } = await supabase
    .from('delivery_partners')
    .select('*')
    .eq('id', partnerId)
    .maybeSingle();

  if (error) throw error;
  return data as DeliveryPartner | null;
}

export function getDeliveryPartnerTypes(): Array<{ type: DeliveryPartnerType; name: string; description: string }> {
  return [
    { type: 'own_fleet', name: 'Own Fleet', description: 'Company-owned delivery vehicles' },
    { type: 'local_partner', name: 'Local Partner', description: 'Local delivery partners' },
    { type: 'courier_company', name: 'Courier Company', description: 'Professional courier services' },
    { type: 'third_party_logistics', name: 'Third Party Logistics', description: '3PL providers' },
    { type: 'drone_service', name: 'Drone Service', description: 'Autonomous drone delivery (future)' },
    { type: 'hyper_local', name: 'Hyper Local', description: 'Ultra-fast local delivery' },
    { type: 'international_courier', name: 'International Courier', description: 'Global shipping providers' },
  ];
}

// ============================================================
// DELIVERY COST FUNCTIONS
// ============================================================

export async function calculateDeliveryCostApi(
  modelId: string,
  distanceKm: number,
  weightKg: number,
  orderValue: number,
  isCod: boolean = false
): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_delivery_cost', {
    p_delivery_model_id: modelId,
    p_distance_km: distanceKm,
    p_weight_kg: weightKg,
    p_order_value: orderValue,
    p_is_cod: isCod,
  });

  if (error) throw error;
  return data || 0;
}

export async function getEstimatedDeliveryTime(modelId: string): Promise<{ min: number; max: number }> {
  const model = await getDeliveryModel(modelId);
  if (!model) return { min: 24, max: 168 };
  return { min: model.min_delivery_hours, max: model.max_delivery_hours };
}

// ============================================================
// AI ORDER ALLOCATION FUNCTIONS
// ============================================================

export async function createOrderAllocation(allocation: Partial<AIOrderAllocation>): Promise<AIOrderAllocation> {
  const { data, error } = await supabase
    .from('ai_order_allocation_queue')
    .insert(allocation)
    .select()
    .single();

  if (error) throw error;
  return data as AIOrderAllocation;
}

export async function getOrderAllocation(orderId: string): Promise<AIOrderAllocation | null> {
  const { data, error } = await supabase
    .from('ai_order_allocation_queue')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data as AIOrderAllocation | null;
}

export async function getPendingAllocations(): Promise<AIOrderAllocation[]> {
  const { data, error } = await supabase
    .from('ai_order_allocation_queue')
    .select('*')
    .eq('is_processed', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as AIOrderAllocation[];
}

export function getAllocationArchitecture(): Array<{ type: AllocationType; description: string; criteria: string[] }> {
  return [
    {
      type: 'nearest_warehouse',
      description: 'Select nearest warehouse by distance',
      criteria: ['distance_km', 'current_queue', 'daily_capacity'],
    },
    {
      type: 'nearest_shop',
      description: 'Select nearest shop/seller',
      criteria: ['distance_km', 'seller_rating', 'stock_available'],
    },
    {
      type: 'nearest_home_cloud',
      description: 'Select nearest home cloud store',
      criteria: ['distance_km', 'delivery_radius_km', 'trust_score'],
    },
    {
      type: 'fastest_route',
      description: 'Select fastest delivery route',
      criteria: ['estimated_delivery_time', 'traffic_conditions', 'driver_availability'],
    },
    {
      type: 'lowest_cost',
      description: 'Select lowest cost option',
      criteria: ['delivery_charges', 'cod_charges', 'total_delivery_cost'],
    },
    {
      type: 'highest_rating',
      description: 'Select highest rated source',
      criteria: ['rating', 'on_time_rate', 'customer_satisfaction'],
    },
    {
      type: 'ai_optimized',
      description: 'AI balances all factors',
      criteria: ['distance', 'cost', 'rating', 'capacity', 'historical_performance'],
    },
  ];
}

// ============================================================
// INVENTORY SYNC FUNCTIONS
// ============================================================

export async function getInventoryLocations(productId: string): Promise<InventoryLocation[]> {
  const { data, error } = await supabase
    .from('inventory_locations')
    .select('*')
    .eq('product_id', productId);

  if (error) throw error;
  return (data || []) as InventoryLocation[];
}

export async function getTotalAvailableStock(productId: string): Promise<number> {
  const locations = await getInventoryLocations(productId);
  return locations.reduce((sum, loc) => sum + loc.quantity_available - loc.quantity_reserved, 0);
}

export async function queueInventorySync(sync: Partial<InventorySyncQueue>): Promise<InventorySyncQueue> {
  const { data, error } = await supabase
    .from('inventory_sync_queue')
    .insert(sync)
    .select()
    .single();

  if (error) throw error;
  return data as InventorySyncQueue;
}

export async function getPendingInventorySyncs(): Promise<InventorySyncQueue[]> {
  const { data, error } = await supabase
    .from('inventory_sync_queue')
    .select('*')
    .eq('sync_status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as InventorySyncQueue[];
}

// ============================================================
// AI LOGISTICS INTELLIGENCE FUNCTIONS
// ============================================================

export async function getAILogisticsIntelligence(filters: {
  intelligenceType?: IntelType;
  entityType?: string;
  entityId?: string;
}): Promise<AILogisticsIntelligence[]> {
  let query = supabase
    .from('ai_logistics_intelligence')
    .select('*')
    .eq('is_active', true);

  if (filters.intelligenceType) {
    query = query.eq('intelligence_type', filters.intelligenceType);
  }
  if (filters.entityType) {
    query = query.eq('entity_type', filters.entityType);
  }
  if (filters.entityId) {
    query = query.eq('entity_id', filters.entityId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AILogisticsIntelligence[];
}

export function getAILogisticsArchitecture(): Array<{ type: IntelType; description: string; factors: string[] }> {
  return [
    {
      type: 'demand_forecast',
      description: 'Predict future product demand',
      factors: ['historical_sales', 'seasonality', 'trending', 'events', 'promotions'],
    },
    {
      type: 'stock_prediction',
      description: 'Predict optimal stock levels',
      factors: ['demand_forecast', 'lead_time', 'safety_stock', 'reorder_point'],
    },
    {
      type: 'delivery_optimization',
      description: 'Optimize delivery allocation',
      factors: ['warehouse_proximity', 'partner_capacity', 'traffic', 'cost'],
    },
    {
      type: 'route_optimization',
      description: 'Optimize delivery routes',
      factors: ['stops', 'traffic', 'delivery_windows', 'vehicle_capacity'],
    },
    {
      type: 'traffic_analysis',
      description: 'Analyze traffic patterns',
      factors: ['time_of_day', 'day_of_week', 'weather', 'events'],
    },
    {
      type: 'warehouse_recommendation',
      description: 'Recommend warehouse locations',
      factors: ['demand_clusters', 'population_density', 'transportation'],
    },
    {
      type: 'cost_optimization',
      description: 'Optimize logistics costs',
      factors: ['delivery_partners', 'route_efficiency', 'packaging', 'returns'],
    },
    {
      type: 'capacity_planning',
      description: 'Plan warehouse and delivery capacity',
      factors: ['demand_growth', 'seasonality', 'expansion_plans'],
    },
  ];
}

// ============================================================
// DELIVERY ROUTE FUNCTIONS
// ============================================================

export async function getDeliveryRoutes(date?: string): Promise<DeliveryRoute[]> {
  let query = supabase
    .from('delivery_routes')
    .select('*');

  if (date) {
    query = query.eq('delivery_date', date);
  }

  query = query.order('delivery_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as DeliveryRoute[];
}

export async function getRouteStops(routeId: string): Promise<RouteStop[]> {
  const { data, error } = await supabase
    .from('route_stops')
    .select('*')
    .eq('route_id', routeId)
    .order('stop_sequence', { ascending: true });

  if (error) throw error;
  return (data || []) as RouteStop[];
}

// ============================================================
// LOGISTICS DASHBOARD FUNCTIONS
// ============================================================

export async function getLogisticsDashboard(): Promise<{
  orders_received: number;
  orders_packed: number;
  out_for_delivery: number;
  delivered_today: number;
  cancelled_orders: number;
  avg_distance: number | null;
  active_warehouses: number;
  active_partners: number;
}> {
  const { data, error } = await supabase
    .rpc('get_logistics_dashboard');

  if (error) {
    const [
      { count: orders_received },
      { count: orders_packed },
      { count: out_for_delivery },
      { count: delivered_today },
      { count: cancelled_orders },
      { count: active_warehouses },
      { count: active_partners },
    ] = await Promise.all([
      supabase.from('order_delivery_details').select('*', { count: 'exact', head: true }).eq('delivery_status', 'order_received'),
      supabase.from('order_delivery_details').select('*', { count: 'exact', head: true }).eq('delivery_status', 'packed'),
      supabase.from('order_delivery_details').select('*', { count: 'exact', head: true }).eq('delivery_status', 'out_for_delivery'),
      supabase.from('order_delivery_details').select('*', { count: 'exact', head: true }).eq('delivery_status', 'delivered').gte('actual_delivery_at', new Date().toISOString().split('T')[0]),
      supabase.from('order_delivery_details').select('*', { count: 'exact', head: true }).eq('delivery_status', 'cancelled'),
      supabase.from('warehouses').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('delivery_partners').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    return {
      orders_received: orders_received || 0,
      orders_packed: orders_packed || 0,
      out_for_delivery: out_for_delivery || 0,
      delivered_today: delivered_today || 0,
      cancelled_orders: cancelled_orders || 0,
      avg_distance: null,
      active_warehouses: active_warehouses || 0,
      active_partners: active_partners || 0,
    };
  }

  return data;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDeliveryTime(hours: number): string {
  if (hours < 24) {
    return `${hours} hours`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  return `${days} day${days > 1 ? 's' : ''} ${remainingHours}h`;
}

export function getDeliveryStatusLabel(status: DeliveryStatus): string {
  const labels: Record<DeliveryStatus, string> = {
    order_received: 'Order Received',
    confirmed: 'Confirmed',
    processing: 'Processing',
    packed: 'Packed',
    ready: 'Ready for Pickup',
    assigned: 'Agent Assigned',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
    refunded: 'Refunded',
    failed: 'Delivery Failed',
  };
  return labels[status] || status;
}

export function getWarehouseLevelLabel(level: WarehouseLevel): string {
  const labels: Record<WarehouseLevel, string> = {
    country: 'Country Warehouse',
    state: 'State Warehouse',
    district: 'District Warehouse',
    city: 'City Warehouse',
    micro: 'Micro Warehouse',
    home_cloud: 'Home Cloud Store',
  };
  return labels[level] || level;
}

export function getAllocationTypeLabel(type: AllocationType): string {
  const labels: Record<AllocationType, string> = {
    nearest_warehouse: 'Nearest Warehouse',
    nearest_shop: 'Nearest Shop',
    nearest_home_cloud: 'Nearest Home Cloud Store',
    fastest_route: 'Fastest Route',
    lowest_cost: 'Lowest Cost',
    highest_rating: 'Highest Rating',
    ai_optimized: 'AI Optimized',
  };
  return labels[type] || type;
}
