import {
  Sparkles, CheckCircle2, Clock, Trophy, TrendingUp,
  Hash, Activity, Zap, ArrowUp, ArrowDown, Minus,
} from 'lucide-react';
import { liveStats } from '../../lib/smartCodeIntelligenceMockData';

export default function LiveStatsCards() {
  const cards = [
    { icon: Sparkles, label: 'Total SmartCodes Submitted', value: liveStats.totalSubmitted.toLocaleString(), color: '#D4AF37' },
    { icon: CheckCircle2, label: 'Validated SmartCodes', value: liveStats.validated.toLocaleString(), color: '#22c55e' },
    { icon: Clock, label: 'Pending Verification', value: liveStats.pendingVerification.toLocaleString(), color: '#fbbf24' },
    { icon: Trophy, label: 'Weekly Eligible Entries', value: liveStats.weeklyEligible.toLocaleString(), color: '#00F2FE' },
    { icon: TrendingUp, label: 'Avg SmartPoints / Entry', value: liveStats.avgSmartPointsPerEntry.toString(), color: '#D4AF37' },
    { icon: Hash, label: 'Most Active SmartCode', value: liveStats.mostActiveCode, color: '#22c55e' },
    { icon: Activity, label: 'Least Used SmartCode', value: liveStats.leastUsedCode, color: '#9ca3af' },
    { icon: Zap, label: 'Highest Growth Code', value: liveStats.highestGrowthCode, color: '#D4AF37' },
  ];
  return (
    <div>
      <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Activity size={16} style={{ color: '#D4AF37' }} /> Live Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${c.color}15` }}>
              <c.icon size={18} style={{ color: c.color }} />
            </div>
            <div className="text-lg font-bold" style={{ color: c.color }}>{c.value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
