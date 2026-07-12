import {
  ShoppingBag, HandHeart, FileText, ScanLine, Keyboard, Gift, Trophy,
} from 'lucide-react';
import { activityStream, type ActivityType } from '../../lib/vcosOperationsMockData';

const TYPE_CONFIG: Record<ActivityType, { icon: any; color: string }> = {
  purchase: { icon: ShoppingBag, color: '#D4AF37' },
  contribution: { icon: HandHeart, color: '#22c55e' },
  receipt: { icon: FileText, color: '#00F2FE' },
  scan: { icon: ScanLine, color: '#D4AF37' },
  manual: { icon: Keyboard, color: '#00F2FE' },
  reward: { icon: Gift, color: '#D4AF37' },
  challenge: { icon: Trophy, color: '#22c55e' },
};

const STATUS_COLOR: Record<string, string> = {
  completed: '#22c55e',
  processing: '#fbbf24',
  pending: '#9ca3af',
};

export default function ActivityStream() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1">Incoming Activity Stream</h2>
      <p className="text-xs text-gray-500 mb-4">Unified feed of all ecosystem events · Placeholder data</p>
      <div className="space-y-2">
        {activityStream.map((event) => {
          const cfg = TYPE_CONFIG[event.type];
          const Icon = cfg.icon;
          return (
            <div key={event.id} className="flex items-center gap-3 p-3 rounded-2xl border transition-colors hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cfg.color}15` }}>
                <Icon size={18} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{event.title}</div>
                <div className="text-xs text-gray-500 truncate">{event.description}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-gray-600">{event.timestamp}</div>
                <div className="text-[10px] font-bold mt-0.5" style={{ color: STATUS_COLOR[event.status] }}>{event.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
