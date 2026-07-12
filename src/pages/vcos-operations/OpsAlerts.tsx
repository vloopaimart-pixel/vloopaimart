import { Bell, AlertTriangle, CheckCircle2, Info, Zap } from 'lucide-react';
import { opsAlerts, type OpsAlert } from '../../lib/vcosOperationsMockData';

const ALERT_CONFIG: Record<OpsAlert['type'], { icon: any; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: '#00F2FE', bg: 'rgba(0,242,254,0.1)', border: 'rgba(0,242,254,0.2)' },
  warning: { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  success: { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  urgent: { icon: Zap, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
};

export default function OpsAlerts() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1">Operations Alerts</h2>
      <p className="text-xs text-gray-500 mb-4">Notification cards · Mock only · No real alerts</p>
      <div className="space-y-2">
        {opsAlerts.map((alert) => {
          const cfg = ALERT_CONFIG[alert.type];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className="flex items-start gap-3 p-3.5 rounded-2xl border" style={{ background: cfg.bg, borderColor: cfg.border }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                <Icon size={18} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white">{alert.title}</div>
                  <span className="text-[10px] text-gray-500">{alert.timestamp}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{alert.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
