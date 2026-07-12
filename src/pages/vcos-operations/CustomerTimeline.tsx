import {
  ShoppingBag, Sparkles, Ticket, Trophy, Gift, Award, Wallet, History,
  CheckCircle2, Clock, Circle,
} from 'lucide-react';
import { customerTimeline } from '../../lib/vcosOperationsMockData';

const ICON_MAP: Record<string, any> = {
  ShoppingBag, Sparkles, Ticket, Trophy, Gift, Award, Wallet, History,
};

export default function CustomerTimeline() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1">Unified Customer Timeline</h2>
      <p className="text-xs text-gray-500 mb-4">Operational journey from purchase to reward distribution · UI structure only</p>
      <div className="rounded-2xl p-4 md:p-6 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
        <div className="space-y-0">
          {customerTimeline.map((stage, idx) => {
            const Icon = ICON_MAP[stage.icon] || Circle;
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            return (
              <div key={stage.id} className="flex gap-3">
                {/* Left: Icon + Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${isCurrent ? 'animate-pulse-soft' : ''}`}
                    style={{
                      background: isCompleted ? 'rgba(212,175,55,0.15)' : isCurrent ? 'rgba(0,242,254,0.15)' : 'rgba(255,255,255,0.03)',
                      border: isCompleted ? '1.5px solid #D4AF37' : isCurrent ? '1.5px solid #00F2FE' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isCurrent ? '0 0 16px rgba(0,242,254,0.25)' : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} style={{ color: '#D4AF37' }} />
                    ) : isCurrent ? (
                      <Icon size={20} style={{ color: '#00F2FE' }} />
                    ) : (
                      <Icon size={18} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    )}
                  </div>
                  {idx < customerTimeline.length - 1 && (
                    <div className="w-0.5 h-8 mt-1" style={{ background: isCompleted ? '#D4AF37' : 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
                {/* Right: Content */}
                <div className="flex-1 pb-2">
                  <div className={`text-sm font-bold ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-white' : 'text-gray-600'}`}>
                    {stage.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{stage.detail}</div>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ background: 'rgba(0,242,254,0.15)', color: '#00F2FE' }}>
                      <Clock size={10} /> Current Stage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
