import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  mobile: string;
  location: string | null;
  email: string | null;
  vloop_code: string | null;
  code_type: 'auto' | 'self';
  points: number;
  wallet1_balance: number;
  wallet2_balance: number;
  wallet1_total_earned: number;
  wallet1_total_used: number;
  wallet2_activation_date: string;
  wallet2_support_status: 'active' | 'suspended' | 'pending';
  wallet2_eligibility_status: 'eligible' | 'not_eligible' | 'pending';
  membership_status: 'active' | 'suspended' | 'pending' | 'expired';
  referral_count: number;
  referral_code: string | null;
  created_at: string;
  member_id: string | null;
  admin_role: 'admin' | 'super_admin' | 'none' | null;
  photo_url: string | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string | null;
  description: string | null;
  image_url: string | null;
  brand: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_partner: boolean;
  is_vloop_own: boolean;
  created_at: string;
};

export type ProductReview = {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string | null;
  review_text: string | null;
  comment: string;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number | string;
  category: string;
  difficulty: string;
  explanation: string | null;
  xp_reward: number;
  points: number;
  is_active: boolean;
};

export type UserEngagement = {
  id: string;
  user_id: string;
  quizzes_completed: number;
  quizzes_skipped: number;
  xp_total: number;
  xp_level: number;
  badges: string[];
  created_at: string;
};

export type ParticipationEntry = {
  id: string;
  user_id: string;
  smartcode: string;
  points_used: number;
  winner_status: string | null;
  created_at: string;
};

export type AdminSetting = {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  created_at: string;
};

export type DailyHint = {
  id: string;
  hint_text: string;
  hint_type?: string | null;
  title?: string | null;
  content?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
};

export type AwarenessContent = {
  id: string;
  title: string;
  content: string;
  content_type: string | null;
  is_active: boolean;
  view_count: number;
  mascot: string | null;
  thumbnail_url?: string | null;
  duration_seconds?: number | null;
  sponsored?: boolean;
  episode_number?: number | null;
  video_url?: string | null;
  description?: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  product_id: string | null;
  quantity: number;
  total_amount: number;
  points_earned: number;
  status: string;
  order_number: string | null;
  payment_status: string | null;
  payment_method: string | null;
  payment_transaction_id: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_pincode: string | null;
  delivery_type: string | null;
  delivery_date: string | null;
  delivery_fee: number | null;
  discount_amount: number | null;
  tracking_number: string | null;
  tracking_url: string | null;
  invoice_number: string | null;
  invoice_url: string | null;
  coupon_code: string | null;
  cancellation_reason: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_per_item: number | null;
  item_status: string | null;
  created_at: string;
};

export type OrderStatusHistory = {
  id: string;
  order_id: string;
  old_status: string | null;
  new_status: string;
  status_reason: string | null;
  changed_by_type: string | null;
  notes: string | null;
  created_at: string;
};

export type CareClubEntry = {
  id: string;
  user_id: string;
  amount: number;
  points_earned: number;
  created_at: string;
};

export type BenefitEntry = {
  id: string;
  user_id: string;
  benefit_type: string;
  tier: string | null;
  points_used: number;
  amount: number;
  wallet: string | null;
  created_at: string;
};

export type PointHistoryEntry = {
  id: string;
  user_id: string;
  source_type: string;
  activity: string | null;
  points_before: number;
  points_added: number;
  points_after: number;
  points_earned: number;
  amount: number | null;
  status: string | null;
  created_at: string;
};

export type ReferralReward = {
  id: string;
  referrer_email: string;
  referred_email: string;
  referrer_points: number;
  referred_points: number;
  reward_points: number;
  status: string;
  created_at: string;
};

export type SmartCodeHistory = {
  id: string;
  smartcode: string;
  week_period: string;
  drawn_at: string | null;
  total_participants: number;
  total_winners: number;
  total_distribution: number;
  status: string;
  created_at: string;
};

export type SmartCodeSelection = {
  id: string;
  smartcode: string;
  user_id: string;
  points_used: number;
  category: string | null;
  week_period: string;
  created_at: string;
};

export type SmartCodeStat = {
  smartcode: string;
  selection_count: number;
  win_count: number;
  last_selected_at: string | null;
  last_won_at: string | null;
};

export type QuizResult = {
  id: string;
  user_id: string;
  quiz_question_id: string;
  selected_answer: number;
  is_correct: boolean;
  points_earned: number;
  created_at: string;
};

export type SocialShare = {
  id: string;
  user_id: string;
  platform: string;
  share_type: string;
  content_type: string;
  content_id: string | null;
  points_earned: number;
  created_at: string;
};

export type PartnerCampaign = {
  id: string;
  partner_name: string;
  campaign_name: string;
  campaign_type: string;
  description: string | null;
  start_date: string;
  end_date: string;
  reward_points: number;
  is_active: boolean;
  created_at: string;
};

export type SmartCodeAllocation = {
  id: string;
  user_id: string;
  smartcode: string;
  points_allocated: number;
  source: string;
  week_period: string;
  mode: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SmartCodeDistributionSession = {
  id: string;
  user_id: string;
  total_points: number;
  points_distributed: number;
  mode: string;
  status: string;
  week_period: string;
  metadata: any;
  created_at: string;
  completed_at: string | null;
};

export type UserSmartCodeSummary = {
  id: string;
  user_id: string;
  week_period: string;
  total_smartcodes: number;
  total_points_allocated: number;
  ai_auto_codes: number;
  manual_codes: number;
  has_completed_distribution: boolean;
  created_at: string;
  updated_at: string;
};

export type WeeklyAIRewardPool = {
  id: string;
  pool_type: string;
  pool_name: string;
  reward_amount: number;
  currency: string;
  position: number | null;
  is_locked: boolean;
  ai_assignable_only: boolean;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ExtractedProduct = {
  name: string;
  quantity: number;
  unit_price: number | null;
  total: number | null;
};

export type PurchaseBill = {
  id: string;
  user_id: string;
  order_id: string | null;
  storage_path: string | null;
  storage_url: string | null;
  file_name: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  status: 'pending' | 'verified' | 'rejected';
  verification_note: string | null;
  ocr_raw_text: string | null;
  ocr_confidence: number | null;
  ocr_provider: string | null;
  store_name: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  extracted_products: ExtractedProduct[];
  total_amount: number | null;
  currency: string;
  is_duplicate: boolean;
  duplicate_of: string | null;
  manually_entered: boolean;
  created_at: string;
  updated_at: string;
};
