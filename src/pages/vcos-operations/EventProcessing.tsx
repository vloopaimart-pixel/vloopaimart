import {
  Clock, Loader2, BadgeCheck, CheckCircle2, XCircle, Eye,
} from 'lucide-react';
import { eventCards, type EventState } from '../../lib/vcosOperationsMockData';

const STATE_CONFIG: Record<EventState, { icon: any; color: string; bg: string; label: string }> = {
  waiting: { icon: Clock, color: '#9ca3af', bg: 'rgba(156,163,175,0.15)', label: 'Waiting' },
  processing: { icon: Loader2, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', label: 'Processing' },
  verified: { icon: BadgeCheck, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Verified' },
  completed: { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Completed' },
  rejected: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Rejected' },
  review: { icon: Eye, color: '#00F2FE', bg: 'rgba(0,242,254,0.15)', label: 'Pending Review' },
};

export default function EventProcessing() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1">Event Processing Cards</h2>
      <p className="text-xs text-gray-500 mb-4">Reusable processing cards with state indicators · No processing engine</p>
      <div className="grid md:grid-cols-2 gap-3">
        {eventCards.map((event) => {
          const cfg = STATE_CONFIG[event.state];
          const Icon = cfg.icon;
          return (
            <div key={event.id} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                    <Icon size={18} style={{ color: cfg.color }} className={event.state === 'processing' ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{event.title}</div>
                    <div className="text-[10px] text-gray-600">{event.timestamp}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-400">{event.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
