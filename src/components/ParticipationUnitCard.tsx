import { useState } from 'react';
import {
  QrCode, Shield, Lock, CheckCircle2, Clock, Zap,
  Award, Building2, Eye, RefreshCw, AlertCircle
} from 'lucide-react';
import {
  DigitalCard,
  CardTier,
  CardStatus,
  getTierGradient,
  getTierAccentColor,
  getTierBadgeStyle,
  getStatusLabel,
  formatSmartpoints,
  getCardTheme,
} from '../lib/FOECardEngine';
import {
  DEFAULT_CARD_THEMES,
} from '../lib/FOECardEngine';

interface ParticipationUnitCardProps {
  card: DigitalCard;
  showBack?: boolean;
  onClick?: () => void;
}

export default function ParticipationUnitCard({ card, showBack = false, onClick }: ParticipationUnitCardProps) {
  const [isFlipped, setIsFlipped] = useState(showBack);
  const theme = getCardTheme(card.card_type);

  return (
    <div
      className="relative w-full perspective-1000 cursor-pointer"
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT VIEW */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            minHeight: '280px',
          }}
        >
          {/* Gradient Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getTierGradient(card.tier)}`}
          />

          {/* Material Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: card.tier === 'obsidian'
                  ? 'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 40%)'
                  : card.tier === 'gold'
                  ? 'linear-gradient(135deg, rgba(30, 58, 95, 0.3) 0%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(255, 215, 0, 0.2) 0%, transparent 40%)'
                  : 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)',
                backgroundSize: card.tier === 'gold' || card.tier === 'obsidian' ? '100% 100%' : '4px 4px',
              }}
            />
          </div>

          {/* Metallic Shine Effect */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full bg-gradient-to-br from-white via-transparent to-black"
              style={{ mixBlendMode: 'overlay' }}
            />
          </div>

          {/* Content */}
          <div className="relative p-5 h-full flex flex-col">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              {/* VLOOP Logo */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    card.tier === 'obsidian' || card.tier === 'copper'
                      ? 'bg-black/30'
                      : 'bg-white/20'
                  } backdrop-blur-sm`}
                >
                  <Zap
                    className="w-5 h-5"
                    style={{ color: getTierAccentColor(card.tier) }}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold tracking-wider ${
                      card.tier === 'obsidian' ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    VLOOP F.O.E
                  </p>
                  <p
                    className={`text-[10px] ${
                      card.tier === 'obsidian' ? 'text-gray-400' : 'text-white/70'
                    }`}
                  >
                    Participation Unit
                  </p>
                </div>
              </div>

              {/* Tier Badge */}
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${getTierBadgeStyle(card.tier)}`}
              >
                {card.smartpoints_value} SP
              </div>
            </div>

            {/* Main Value */}
            <div className="flex-1 flex flex-col justify-center items-center my-3">
              <p
                className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${
                  card.tier === 'obsidian' ? 'text-gray-400' : 'text-white/70'
                }`}
              >
                SmartPoints
              </p>
              <p
                className={`text-5xl font-bold tracking-tight ${
                  card.tier === 'obsidian' ? 'text-yellow-400' : 'text-white'
                }`}
                style={{
                  textShadow: card.tier === 'gold' ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
                  fontFamily: 'system-ui',
                }}
              >
                {card.smartpoints_value}
              </p>
              <p
                className={`text-sm mt-2 ${
                  card.tier === 'obsidian' ? 'text-gray-500' : 'text-white/50'
                }`}
              >
                {theme.display_name}
              </p>
            </div>

            {/* Status Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    card.status === 'active' || card.status === 'allocated'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : card.status === 'locked'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {getStatusLabel(card.status)}
                </div>
                {card.ai_verification_status === 'verified' && (
                  <Shield className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
                <span className={`text-[10px] ${card.tier === 'obsidian' ? 'text-gray-500' : 'text-white/50'}`}>
                  Tap to flip
                </span>
              </div>
            </div>
          </div>

          {/* Border Accent */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: `1px solid ${getTierAccentColor(card.tier)}40`,
            }}
          />

          {/* Premium Corner Accent */}
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-30"
            style={{
              borderTopRightRadius: '1rem',
              background: `radial-gradient(circle at top right, ${getTierAccentColor(card.tier)}20, transparent 70%)`,
            }}
          />
        </div>

        {/* BACK VIEW */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-slate-900"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" />
                <span className="text-white font-medium text-sm">Card Details</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                {card.qr_code ? (
                  <QrCode className="w-16 h-16 text-slate-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-slate-600" />
                )}
              </div>
            </div>

            {/* Card ID */}
            <div className="text-center mb-4">
              <p className="text-[10px] text-slate-500 mb-1">Card ID</p>
              <p className="text-xs text-slate-300 font-mono tracking-tight">{card.card_id}</p>
            </div>

            {/* Details Grid */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Serial</span>
                <span className="text-slate-300 font-mono">{card.card_serial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier</span>
                <span className="text-slate-300 capitalize">{card.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`${card.status === 'active' || card.status === 'allocated' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {getStatusLabel(card.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Verified</span>
                <span className={card.ai_verification_status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}>
                  {card.ai_verification_status === 'verified' ? 'Yes' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trust Weight</span>
                <span className="text-slate-300">{card.trust_weight.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VCOS Status</span>
                <span className={card.vcos_status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}>
                  {card.vcos_status}
                </span>
              </div>
            </div>

            {/* Security Footer */}
            <div className="pt-3 mt-auto border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <Shield className="w-3 h-3" />
                  <span>Secured by VCOS</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={card.tamper_seal === 'intact' ? 'text-emerald-500' : 'text-red-500'}>
                    {card.tamper_seal === 'intact' ? 'Seal Intact' : 'Tampered'}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 text-center mt-2">
                Generated: {new Date(card.generated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none border border-slate-700"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPACT CARD VARIANT
// ============================================================

interface CompactCardProps {
  card: DigitalCard;
  onClick?: () => void;
}

export function CompactCard({ card, onClick }: CompactCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
      style={{ minHeight: '120px' }}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getTierGradient(card.tier)}`}
      />

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-2">
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTierBadgeStyle(card.tier)}`}
          >
            {card.smartpoints_value} SP
          </div>
          {card.ai_verification_status === 'verified' && (
            <Shield className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        <div className="text-center my-2">
          <p
            className={`text-3xl font-bold ${
              card.tier === 'obsidian' ? 'text-yellow-400' : 'text-white'
            }`}
          >
            {card.smartpoints_value}
          </p>
          <p className="text-xs text-white/60">SmartPoints</p>
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <span
            className={`px-2 py-0.5 rounded ${
              card.status === 'active' || card.status === 'allocated'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-gray-500/20 text-gray-300'
            }`}
          >
            {getStatusLabel(card.status)}
          </span>
          <span className="text-white/50 font-mono">{card.card_serial}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARD GRID COMPONENT
// ============================================================

interface CardGridProps {
  cards: DigitalCard[];
  onCardClick?: (card: DigitalCard) => void;
  variant?: 'full' | 'compact';
}

export function CardGrid({ cards, onCardClick, variant = 'full' }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Participation Units</h3>
        <p className="text-slate-400">Allocate SmartPoints to generate participation unit cards</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${
      variant === 'full'
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    }`}>
      {cards.map((card) => (
        variant === 'full' ? (
          <ParticipationUnitCard
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
          />
        ) : (
          <CompactCard
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
          />
        )
      ))}
    </div>
  );
}

// ============================================================
// CARD WALLET SUMMARY COMPONENT
// ============================================================

interface CardWalletSummaryProps {
  summary: {
    total_cards: number;
    active_cards: number;
    locked_cards: number;
    completed_cards: number;
    cards_100: number;
    cards_250: number;
    cards_500: number;
    cards_1000: number;
    total_smartpoints: number;
    active_smartpoints: number;
    locked_smartpoints: number;
  };
}

export function CardWalletSummaryCards({ summary }: CardWalletSummaryProps) {
  const stats = [
    { label: 'Total Cards', value: summary.total_cards, icon: Award, color: 'blue' },
    { label: 'Active', value: summary.active_cards, icon: CheckCircle2, color: 'emerald' },
    { label: 'Locked', value: summary.locked_cards, icon: Lock, color: 'amber' },
    { label: 'Completed', value: summary.completed_cards, icon: Clock, color: 'purple' },
  ];

  const byType = [
    { label: '100 SP', value: summary.cards_100, tier: 'copper' as CardTier },
    { label: '250 SP', value: summary.cards_250, tier: 'silver' as CardTier },
    { label: '500 SP', value: summary.cards_500, tier: 'gold' as CardTier },
    { label: '1000 SP', value: summary.cards_1000, tier: 'obsidian' as CardTier },
  ];

  return (
    <div className="space-y-4">
      {/* Status Counts */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
            <stat.icon className={`w-5 h-5 text-${stat.color}-400 mx-auto mb-1`} />
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* By Type */}
      <div className="grid grid-cols-4 gap-3">
        {byType.map((type) => (
          <div key={type.label} className="rounded-xl p-3 text-center bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30">
            <p className="text-lg font-bold text-white">{type.value}</p>
            <p className="text-slate-400 text-xs">{type.label}</p>
          </div>
        ))}
      </div>

      {/* Total Value */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Total SmartPoints Value</span>
          <span className="text-2xl font-bold text-emerald-400">{formatSmartpoints(summary.total_smartpoints)}</span>
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-slate-500">Active: <span className="text-white">{formatSmartpoints(summary.active_smartpoints)}</span></span>
          <span className="text-slate-500">Locked: <span className="text-white">{formatSmartpoints(summary.locked_smartpoints)}</span></span>
        </div>
      </div>
    </div>
  );
}
