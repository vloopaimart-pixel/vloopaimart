/**
 * VLOOP FOE DIGITAL PARTICIPATION UNIT CARD ENGINE
 * Phase 48 — Enterprise Digital Card System
 *
 * Participation Units are NOT money.
 * They represent SmartPoints allocated to eligible Future Opportunity projects under VCOS Rules.
 */

import { supabase } from './supabase';

export const FOE_CARD_ENGINE_VERSION = '48.0.0' as const;

// ============================================================
// CARD TYPES AND TIERS
// ============================================================

export const CARD_TYPES = {
  SP_100: 'SP-100',
  SP_250: 'SP-250',
  SP_500: 'SP-500',
  SP_1000: 'SP-1000',
} as const;

export type CardTypeCode = typeof CARD_TYPES[keyof typeof CARD_TYPES];

export const CARD_TIERS = {
  COPPER: 'copper',
  SILVER: 'silver',
  GOLD: 'gold',
  OBSIDIAN: 'obsidian',
} as const;

export type CardTier = typeof CARD_TIERS[keyof typeof CARD_TIERS];

export const CARD_VALUES: Record<CardTypeCode, number> = {
  'SP-100': 100,
  'SP-250': 250,
  'SP-500': 500,
  'SP-1000': 1000,
};

export const CARD_TIER_FROM_TYPE: Record<CardTypeCode, CardTier> = {
  'SP-100': 'copper',
  'SP-250': 'silver',
  'SP-500': 'gold',
  'SP-1000': 'obsidian',
};

// ============================================================
// CARD STATUS
// ============================================================

export const CARD_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  LOCKED: 'locked',
  ALLOCATED: 'allocated',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
} as const;

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS];

export const VCOS_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
} as const;

export type VcosStatus = typeof VCOS_STATUS[keyof typeof VCOS_STATUS];

// ============================================================
// CARD THEMES
// ============================================================

export interface CardTheme {
  card_type: CardTypeCode;
  tier_name: CardTier;
  display_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  gradient_start: string;
  gradient_end: string;
  front_material: string;
}

export const DEFAULT_CARD_THEMES: Record<CardTypeCode, CardTheme> = {
  'SP-100': {
    card_type: 'SP-100',
    tier_name: 'copper',
    display_name: '100 SmartPoints Unit',
    primary_color: '#B87333',
    secondary_color: '#CD7F32',
    accent_color: '#E8C078',
    gradient_start: '#B87333',
    gradient_end: '#8B5A2B',
    front_material: 'brushed_steel',
  },
  'SP-250': {
    card_type: 'SP-250',
    tier_name: 'silver',
    display_name: '250 SmartPoints Unit',
    primary_color: '#C0C0C0',
    secondary_color: '#A8A8A8',
    accent_color: '#E8E8E8',
    gradient_start: '#D4D4D4',
    gradient_end: '#8C8C8C',
    front_material: 'platinum_silver',
  },
  'SP-500': {
    card_type: 'SP-500',
    tier_name: 'gold',
    display_name: '500 SmartPoints Unit',
    primary_color: '#D4AF37',
    secondary_color: '#1E3A5F',
    accent_color: '#2C5282',
    gradient_start: '#D4AF37',
    gradient_end: '#B8860B',
    front_material: 'matte_gold_royal',
  },
  'SP-1000': {
    card_type: 'SP-1000',
    tier_name: 'obsidian',
    display_name: '1000 SmartPoints Unit',
    primary_color: '#1A1A1A',
    secondary_color: '#FFD700',
    accent_color: '#FFA500',
    gradient_start: '#2D2D2D',
    gradient_end: '#0A0A0A',
    front_material: 'obsidian_gold',
  },
};

// ============================================================
// INTERFACES
// ============================================================

export interface DigitalCard {
  id: string;
  card_id: string;
  unit_id: string | null;
  user_id: string;
  project_id: string | null;
  card_serial: number;
  card_type: CardTypeCode;
  smartpoints_value: number;
  tier: CardTier;
  visual_theme: Record<string, unknown>;
  encrypted_hash: string;
  qr_code: string | null;
  signature_key: string | null;
  tamper_seal: 'intact' | 'broken' | 'verified';
  status: CardStatus;
  vcos_status: VcosStatus;
  ai_verification_status: 'pending' | 'verified' | 'flagged';
  ai_verification_score: number;
  trust_weight: number;
  generated_at: string;
  activated_at: string | null;
  locked_at: string | null;
  allocated_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
  project_status: string | null;
  project_progress: number;
  created_at: string;
}

export interface CardWalletSummary {
  total_cards: number;
  active_cards: number;
  locked_cards: number;
  completed_cards: number;
  pending_cards: number;
  cards_100: number;
  cards_250: number;
  cards_500: number;
  cards_1000: number;
  total_smartpoints: number;
  active_smartpoints: number;
  locked_smartpoints: number;
}

export interface CardAuditEntry {
  id: string;
  card_id: string;
  user_id: string;
  action: string;
  previous_state: Record<string, unknown>;
  new_state: Record<string, unknown>;
  actor_type: 'system' | 'ai' | 'admin' | 'user';
  created_at: string;
}

export interface CardIntegrityResult {
  valid: boolean;
  card_id: string;
  tamper_seal: 'intact' | 'broken';
  verified_at: string;
  error?: string;
}

export interface GeneratedCardResult {
  success: boolean;
  card_id: string;
  card_serial: number;
  tier: CardTier;
  qr_code: string;
  error?: string;
}

// ============================================================
// CARD GENERATION FUNCTIONS
// ============================================================

export async function generateDigitalCard(
  userId: string,
  cardType: CardTypeCode,
  smartpoints: number,
  projectId?: string
): Promise<GeneratedCardResult> {
  const { data, error } = await supabase.rpc('foe_generate_digital_card', {
    p_user_id: userId,
    p_card_type: cardType,
    p_smartpoints: smartpoints,
    p_project_id: projectId || null,
  });

  if (error) throw error;
  return data as GeneratedCardResult;
}

export async function getUserCards(userId: string): Promise<DigitalCard[]> {
  const { data, error } = await supabase.rpc('foe_get_user_cards', {
    p_user_id: userId,
  });

  if (error) throw error;
  return (data || []) as DigitalCard[];
}

export async function getCardById(cardId: string): Promise<DigitalCard | null> {
  const { data, error } = await supabase
    .from('foe_digital_cards')
    .select('*')
    .eq('card_id', cardId)
    .maybeSingle();

  if (error) throw error;
  return data as DigitalCard | null;
}

// ============================================================
// CARD WALLET FUNCTIONS
// ============================================================

export async function getCardWalletSummary(userId: string): Promise<CardWalletSummary> {
  const { data, error } = await supabase.rpc('foe_get_card_wallet_summary', {
    p_user_id: userId,
  });

  if (error) throw error;
  return (data || {
    total_cards: 0,
    active_cards: 0,
    locked_cards: 0,
    completed_cards: 0,
    pending_cards: 0,
    cards_100: 0,
    cards_250: 0,
    cards_500: 0,
    cards_1000: 0,
    total_smartpoints: 0,
    active_smartpoints: 0,
    locked_smartpoints: 0,
  }) as CardWalletSummary;
}

// ============================================================
// CARD SECURITY FUNCTIONS
// ============================================================

export async function verifyCardIntegrity(cardId: string): Promise<CardIntegrityResult> {
  const { data, error } = await supabase.rpc('foe_verify_card_integrity', {
    p_card_id: cardId,
  });

  if (error) throw error;
  return data as CardIntegrityResult;
}

export async function getCardAuditTrail(cardId: string): Promise<CardAuditEntry[]> {
  const { data, error } = await supabase
    .from('foe_card_audit')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as CardAuditEntry[];
}

// ============================================================
// CARD THEME FUNCTIONS
// ============================================================

export async function getCardThemes(): Promise<CardTheme[]> {
  const { data, error } = await supabase
    .from('foe_card_themes')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data || []) as CardTheme[];
}

export function getCardTheme(cardType: CardTypeCode): CardTheme {
  return DEFAULT_CARD_THEMES[cardType];
}

// ============================================================
// LOCAL CARD GENERATION (For Preview)
// ============================================================

export function generateLocalCardId(cardType: CardTypeCode): string {
  const serial = Math.floor(Math.random() * 900000000) + 100000000;
  const checksum = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VCARD-${cardType}-${serial.toString().padStart(9, '0')}-${checksum}`;
}

export function generateLocalQrCode(cardId: string): string {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
  return `QR-VCARD-${cardId}-${timestamp}`;
}

export function generateLocalHash(cardId: string, userId: string, smartpoints: number): string {
  // Simplified hash for preview
  const data = `${cardId}-${userId}-${smartpoints}-${Date.now()}`;
  const hash = btoa(data).substring(0, 32);
  return `HSH-${hash.toUpperCase()}`;
}

// ============================================================
// CARD CONVERSION (SmartPoints to Cards)
// ============================================================

export interface CardConversion {
  cardType: CardTypeCode;
  smartpoints: number;
  quantity: number;
  tier: CardTier;
}

export function convertSmartPointsToCards(smartpoints: number): CardConversion[] {
  const result: CardConversion[] = [];
  let remaining = smartpoints;

  const cardTypes: CardTypeCode[] = ['SP-1000', 'SP-500', 'SP-250', 'SP-100'];

  for (const cardType of cardTypes) {
    const value = CARD_VALUES[cardType];
    if (remaining >= value) {
      const quantity = Math.floor(remaining / value);
      result.push({
        cardType,
        smartpoints: value,
        quantity,
        tier: CARD_TIER_FROM_TYPE[cardType],
      });
      remaining -= quantity * value;
    }
  }

  return result;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatCardId(cardId: string): string {
  // Format: VCARD-SP-500-000123456-ABCD -> Display version
  return cardId;
}

export function formatCardSerial(serial: number): string {
  return serial.toString().padStart(9, '0');
}

export function getStatusLabel(status: CardStatus): string {
  const labels: Record<CardStatus, string> = {
    pending: 'Pending',
    active: 'Active',
    locked: 'Locked',
    allocated: 'Allocated',
    completed: 'Completed',
    expired: 'Expired',
    revoked: 'Revoked',
  };
  return labels[status] || status;
}

export function getStatusColor(status: CardStatus): string {
  const colors: Record<CardStatus, string> = {
    pending: 'bg-amber-500',
    active: 'bg-emerald-500',
    locked: 'bg-blue-500',
    allocated: 'bg-purple-500',
    completed: 'bg-green-500',
    expired: 'bg-red-500',
    revoked: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getTierGradient(tier: CardTier): string {
  const gradients: Record<CardTier, string> = {
    copper: 'from-[#B87333] via-[#CD7F32] to-[#8B5A2B]',
    silver: 'from-[#D4D4D4] via-[#C0C0C0] to-[#8C8C8C]',
    gold: 'from-[#D4AF37] via-[#FFD700] to-[#B8860B]',
    obsidian: 'from-[#2D2D2D] via-[#1A1A1A] to-[#0A0A0A]',
  };
  return gradients[tier] || 'from-gray-500 to-gray-700';
}

export function getTierAccentColor(tier: CardTier): string {
  const colors: Record<CardTier, string> = {
    copper: '#E8C078',
    silver: '#E8E8E8',
    gold: '#FFD700',
    obsidian: '#FFD700',
  };
  return colors[tier] || '#FFFFFF';
}

export function getTierLabel(tier: CardTier): string {
  const labels: Record<CardTier, string> = {
    copper: 'Copper & Brushed Steel',
    silver: 'Platinum Silver',
    gold: 'Matte Gold & Royal Blue',
    obsidian: 'Obsidian Black & Gold',
  };
  return labels[tier] || tier;
}

export function getTierBadgeStyle(tier: CardTier): string {
  const styles: Record<CardTier, string> = {
    copper: 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100',
    silver: 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800',
    gold: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-900',
    obsidian: 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black',
  };
  return styles[tier] || 'bg-gray-500 text-white';
}

export function formatSmartpoints(value: number): string {
  return value.toLocaleString() + ' SP';
}

export function calculateTotalSmartpoints(cards: DigitalCard[]): number {
  return cards.reduce((sum, card) => sum + card.smartpoints_value, 0);
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockCards(userId: string = 'demo'): DigitalCard[] {
  const cards: DigitalCard[] = [];
  let serial = 100000001;

  // Generate sample cards based on 750 SP example (1 x 500 + 1 x 250)
  const conversions: Array<{ type: CardTypeCode; sp: number }> = [
    { type: 'SP-500', sp: 500 },
    { type: 'SP-250', sp: 250 },
    { type: 'SP-1000', sp: 1000 },
    { type: 'SP-100', sp: 100 },
  ];

  conversions.forEach((conv, i) => {
    const cardId = generateLocalCardId(conv.type);
    cards.push({
      id: `mock-${i}`,
      card_id: cardId,
      unit_id: `FOE-2026-${(serial + i).toString().padStart(8, '0')}`,
      user_id: userId,
      project_id: i < 2 ? 'project-1' : null,
      card_serial: serial + i,
      card_type: conv.type,
      smartpoints_value: conv.sp,
      tier: CARD_TIER_FROM_TYPE[conv.type],
      visual_theme: {},
      encrypted_hash: generateLocalHash(cardId, userId, conv.sp),
      qr_code: generateLocalQrCode(cardId),
      signature_key: null,
      tamper_seal: 'intact',
      status: i < 2 ? 'allocated' : 'active',
      vcos_status: 'verified',
      ai_verification_status: 'verified',
      ai_verification_score: 98,
      trust_weight: 1.0,
      generated_at: new Date(Date.now() - i * 86400000).toISOString(),
      activated_at: new Date(Date.now() - i * 86400000).toISOString(),
      locked_at: null,
      allocated_at: i < 2 ? new Date().toISOString() : null,
      completed_at: null,
      expires_at: null,
      project_status: i < 2 ? 'active' : null,
      project_progress: i < 2 ? 35 + i * 10 : 0,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    });
  });

  return cards;
}
