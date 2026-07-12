import { useState } from 'react';
import {
  ShoppingBag, FileText, ShieldCheck, Sparkles, Ticket, Trophy, Gift,
  ListChecks, BadgeCheck, HandHeart, Wallet, Award, Users, LifeBuoy, History,
  ChevronRight,
} from 'lucide-react';
import { purchasePipeline, smartCodePipeline, contributionPipeline } from '../../lib/vcosOperationsMockData';

const ICON_MAP: Record<string, any> = {
  ShoppingBag, FileText, ShieldCheck, Sparkles, Ticket, Trophy, Gift,
  ListChecks, BadgeCheck, HandHeart, Wallet, Award, Users, LifeBuoy, History,
};

type PipelineId = 'purchase' | 'smartcode' | 'contribution';

export default function Pipelines() {
  const [active, setActive] = useState<PipelineId>('purchase');

  const pipelines: { id: PipelineId; label: string; data: typeof purchasePipeline }[] = [
    { id: 'purchase', label: 'Purchase Pipeline', data: purchasePipeline },
    { id: 'smartcode', label: 'SmartCode Pipeline', data: smartCodePipeline },
    { id: 'contribution', label: 'Contribution Pipeline', data: contributionPipeline },
  ];

  const current = pipelines.find((p) => p.id === active)!;

  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1">Visual Pipelines</h2>
      <p className="text-xs text-gray-500 mb-4">Premium horizontal timelines · Placeholder architecture only</p>

      {/* Pipeline selector */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {pipelines.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
            style={{
              background: active === p.id ? 'linear-gradient(135deg, #D4AF37, #B8941F)' : 'rgba(255,255,255,0.05)',
              color: active === p.id ? '#0B0819' : '#9ca3af',
              border: active === p.id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Horizontal Pipeline */}
      <div className="rounded-2xl p-4 md:p-6 border-2 overflow-x-auto" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
        <div className="flex items-center gap-1 min-w-max">
          {current.data.map((step, idx) => {
            const Icon = ICON_MAP[step.icon] || Gift;
            const isLast = idx === current.data.length - 1;
            return (
              <div key={step.id} className="flex items-center gap-1">
                <div className="flex flex-col items-center text-center w-20 md:w-24">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 transition-all hover:scale-110"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1.5px solid rgba(212,175,55,0.3)' }}
                  >
                    <Icon size={20} style={{ color: '#D4AF37' }} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 leading-tight">{step.label}</span>
                </div>
                {!isLast && (
                  <ChevronRight size={16} className="shrink-0 mb-5" style={{ color: 'rgba(212,175,55,0.4)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 text-[10px] text-gray-600 text-center">
        {current.label} · {current.data.length} stages · No automation · Placeholder only
      </div>
    </div>
  );
}
