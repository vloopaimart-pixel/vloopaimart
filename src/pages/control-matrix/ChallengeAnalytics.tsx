import { Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { challengeAnalytics } from '../../lib/controlMatrixMockData';

export default function ChallengeAnalytics() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Trophy size={18} style={{ color: '#D4AF37' }} /> Weekly SmartCode Challenge Analytics</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {challengeAnalytics.map((card) => (
          <div key={card.tier} className="rounded-2xl p-5 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: card.color }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{card.medal}</span>
              <div>
                <div className="text-base font-bold" style={{ color: card.color }}>{card.tier} Reward</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${card.color}20`, color: card.color }}>{card.poolStatus}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <Stat label="Weekly Entries" value={card.weeklyEntries.toLocaleString()} color="#fff" />
              <Stat label="Eligible Participants" value={card.eligibleParticipants.toLocaleString()} color="#fff" />
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Distribution Progress</span>
                  <span style={{ color: card.color }}>{card.distributionProgress}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${card.distributionProgress}%`, background: card.color }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={12} /> <span>{card.countdown}</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-gray-500 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: card.color }} />
                <span>{card.previousWeek}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  );
}
