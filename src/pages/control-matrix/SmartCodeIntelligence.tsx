import { Ticket, TrendingUp, TrendingDown, Zap, Activity, BarChart3 } from 'lucide-react';
import { smartCodeIntelligence } from '../../lib/controlMatrixMockData';

const HEAT_COLORS: Record<string, string> = {
  extreme: 'rgba(212,175,55,0.6)',
  high: 'rgba(249,115,22,0.45)',
  medium: 'rgba(251,191,36,0.35)',
  low: 'rgba(34,197,94,0.25)',
};

export default function SmartCodeIntelligence() {
  const maxWeekly = Math.max(...smartCodeIntelligence.weeklyDistribution.map((d) => d.value));
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Ticket size={18} style={{ color: '#D4AF37' }} /> SmartCode Intelligence (000-999)</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Most Submitted */}
        <Panel icon={TrendingUp} title="Most Submitted Codes" color="#22c55e">
          {smartCodeIntelligence.mostSubmitted.map((c, i) => (
            <Row key={c.code} rank={i + 1} code={c.code} value={`${c.count}`} change={c.change} />
          ))}
        </Panel>
        {/* Least Submitted */}
        <Panel icon={TrendingDown} title="Least Submitted Codes" color="#9ca3af">
          {smartCodeIntelligence.leastSubmitted.map((c, i) => (
            <Row key={c.code} rank={i + 1} code={c.code} value={`${c.count}`} change={c.change} />
          ))}
        </Panel>
        {/* Fastest Growing */}
        <Panel icon={Zap} title="Fastest Growing Codes" color="#D4AF37">
          {smartCodeIntelligence.fastestGrowing.map((c, i) => (
            <Row key={c.code} rank={i + 1} code={c.code} value={c.growth} change={c.growth} />
          ))}
        </Panel>
        {/* Most Active */}
        <Panel icon={Activity} title="Most Active SmartCodes" color="#00F2FE">
          {smartCodeIntelligence.mostActive.map((c, i) => (
            <div key={c.code} className="flex items-center justify-between py-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-4">#{i + 1}</span>
                <span className="font-bold tracking-widest text-white">{c.code}</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-gray-400">{c.entries} entries</span>
                <span className="text-emerald-400">{c.valid} valid</span>
              </div>
            </div>
          ))}
        </Panel>
        {/* Weekly Distribution */}
        <Panel icon={BarChart3} title="Weekly Entry Distribution" color="#818cf8">
          <div className="flex items-end justify-between gap-1.5 h-32">
            {smartCodeIntelligence.weeklyDistribution.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg" style={{ height: `${(d.value / maxWeekly) * 100}%`, background: 'linear-gradient(180deg, #D4AF37, rgba(212,175,55,0.3))' }} />
                <span className="text-[9px] text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </Panel>
        {/* Heat Ranking */}
        <Panel icon={Activity} title="SmartCode Heat Ranking" color="#f97316">
          {smartCodeIntelligence.heatRanking.map((h) => (
            <div key={h.range} className="flex items-center justify-between py-1.5">
              <span className="text-sm font-mono text-white">{h.range}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-3 rounded-full" style={{ background: HEAT_COLORS[h.intensity] }} />
                <span className="text-xs text-gray-400 w-10 text-right">{h.value}</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Icon size={14} style={{ color }} /> {title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({ rank, code, value, change }: { rank: number; code: string; value: string; change: string }) {
  const isPositive = change.startsWith('+');
  const isNegative = change.startsWith('-');
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 w-4">#{rank}</span>
        <span className="font-bold tracking-widest text-white">{code}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{value}</span>
        <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-gray-500'}`}>{change}</span>
      </div>
    </div>
  );
}
