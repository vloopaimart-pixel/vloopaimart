import { HeartPulse, CheckCircle2 } from 'lucide-react';
import { systemHealth } from '../../lib/vcosOperationsMockData';

const STATUS_CONFIG = {
  healthy: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Healthy' },
  degraded: { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', label: 'Degraded' },
  offline: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Offline' },
};

export default function SystemHealth() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1">System Health</h2>
      <p className="text-xs text-gray-500 mb-4">Compact service status cards · Placeholder only</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {systemHealth.map((svc) => {
          const cfg = STATUS_CONFIG[svc.status];
          return (
            <div key={svc.id} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                  <HeartPulse size={18} style={{ color: cfg.color }} />
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg" style={{ background: cfg.bg, color: cfg.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} /> {cfg.label}
                </span>
              </div>
              <div className="text-sm font-bold text-white">{svc.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Uptime: {svc.uptime}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl p-4 border flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
        <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
        <span className="text-xs text-gray-400">All systems operational · This is placeholder data for UI architecture</span>
      </div>
    </div>
  );
}
