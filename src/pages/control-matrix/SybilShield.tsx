import { ShieldAlert, Smartphone, Users, Ticket, Eye, BadgeCheck, Activity } from 'lucide-react';
import { sybilShield } from '../../lib/controlMatrixMockData';

const ALERT_STYLE: Record<string, { color: string; bg: string }> = {
  urgent: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  warning: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  info: { color: '#00F2FE', bg: 'rgba(0,242,254,0.1)' },
};

export default function SybilShield() {
  const metrics = [
    { icon: Smartphone, label: 'Duplicate Devices', ...sybilShield.duplicateDevices },
    { icon: Users, label: 'Multiple Accounts', ...sybilShield.multipleAccounts },
    { icon: Ticket, label: 'Repeated SmartCodes', ...sybilShield.repeatedSmartCodes },
    { icon: Eye, label: 'Suspicious Activity', ...sybilShield.suspiciousActivity },
    { icon: BadgeCheck, label: 'Device Trust', value: sybilShield.deviceTrust.score, status: sybilShield.deviceTrust.status },
    { icon: Activity, label: 'Behaviour Monitoring', value: sybilShield.behaviourMonitoring.anomalies, status: sybilShield.behaviourMonitoring.status },
  ];
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><ShieldAlert size={18} style={{ color: '#ef4444' }} /> Sybil Shield™ — Fraud Monitoring</h2>
      <div className="rounded-2xl p-4 border-2 mb-3 flex items-center justify-between" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} style={{ color: '#10b981' }} />
          <span className="text-sm font-bold text-white">{sybilShield.status}</span>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
        {metrics.map((m) => {
          const color = m.status === 'High' || m.status === 'Normal' ? '#22c55e' : m.status === 'Detected' || m.status === 'Flagged' ? '#ef4444' : '#fbbf24';
          return (
            <div key={m.label} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}15` }}>
                <m.icon size={18} style={{ color }} />
              </div>
              <div className="text-lg font-bold" style={{ color }}>{m.value ?? m.count}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{m.label}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color }}>{m.status}</div>
            </div>
          );
        })}
      </div>
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-bold text-white mb-3">Recent Alerts</h3>
        <div className="space-y-2">
          {sybilShield.recentAlerts.map((alert) => {
            const style = ALERT_STYLE[alert.type];
            return (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: style.bg, borderColor: `${style.color}20` }}>
                <ShieldAlert size={16} style={{ color: style.color }} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-white">{alert.title}</span>
                    <span className="text-[10px] text-gray-500">{alert.time}</span>
                  </div>
                  <span className="text-xs text-gray-400">{alert.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
