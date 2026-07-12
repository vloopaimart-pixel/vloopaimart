import { Wrench, Star, TrendingUp } from 'lucide-react';
import { localServicesAnalytics } from '../../lib/controlMatrixMockData';

export default function LocalServicesAnalytics() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Wrench size={18} style={{ color: '#D4AF37' }} /> Local Services Analytics</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {localServicesAnalytics.map((s) => (
          <div key={s.service} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">{s.service}</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{s.growth}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Active Requests" value={s.activeRequests.toString()} color="#fbbf24" />
              <Metric label="Completed Jobs" value={s.completedJobs.toString()} color="#22c55e" />
              <Metric label="Rating" value={`${s.rating} ★`} color="#D4AF37" />
              <Metric label="Growth" value={s.growth} color="#00F2FE" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-2.5 border text-center" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
      <div className="text-[9px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
