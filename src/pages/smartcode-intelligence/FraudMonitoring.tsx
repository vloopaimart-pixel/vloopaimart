import { ShieldAlert, Copy, Zap, Eye, Bot, ShieldCheck } from 'lucide-react';
import { fraudMonitoring } from '../../lib/smartCodeIntelligenceMockData';

export default function FraudMonitoring() {
  const items = [
    { icon: Copy, label: 'Duplicate Detection', ...fraudMonitoring.duplicateDetection },
    { icon: Zap, label: 'Rapid Entry Alerts', ...fraudMonitoring.rapidEntryAlerts },
    { icon: Eye, label: 'Abnormal Patterns', ...fraudMonitoring.abnormalPatterns },
    { icon: Bot, label: 'AI Review Queue', ...fraudMonitoring.aiReviewQueue },
  ];
  const statusColor = (status: string) => {
    if (status === 'Clear') return '#22c55e';
    if (status === 'Reviewing' || status === 'Pending') return '#fbbf24';
    return '#ef4444';
  };
  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className="rounded-2xl p-4 border flex items-center justify-between" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <ShieldCheck size={20} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{fraudMonitoring.status}</div>
            <div className="text-[10px] text-gray-500">AI-powered fraud detection · No detection logic active</div>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
        </span>
      </div>

      {/* Monitoring Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => {
          const color = statusColor(item.status);
          return (
            <div key={item.label} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}15` }}>
                <item.icon size={18} style={{ color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color }}>{item.count}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{item.label}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color }}>{item.status}</div>
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-start gap-2">
          <ShieldAlert size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">
            This is a placeholder panel for fraud monitoring. No detection logic is implemented in this phase.
            Future phases will integrate AI-powered duplicate detection, rapid entry analysis, and abnormal pattern recognition.
          </p>
        </div>
      </div>
    </div>
  );
}
