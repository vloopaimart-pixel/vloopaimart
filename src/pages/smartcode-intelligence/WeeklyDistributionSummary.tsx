import { Trophy, CheckCircle2, Users, Award, ShieldCheck } from 'lucide-react';
import { weeklyDistribution } from '../../lib/smartCodeIntelligenceMockData';

export default function WeeklyDistributionSummary() {
  const winners = [
    { tier: 'Prime', code: weeklyDistribution.primeWinner, medal: '🏆', color: '#D4AF37' },
    { tier: 'Premium', code: weeklyDistribution.premiumWinner, medal: '🥈', color: '#818cf8' },
    { tier: 'Standard', code: weeklyDistribution.standardWinner, medal: '🥉', color: '#22c55e' },
  ];
  const stats = [
    { icon: Users, label: 'Total Participants', value: weeklyDistribution.totalParticipants.toLocaleString(), color: '#00F2FE' },
    { icon: Award, label: 'Eligible Entries', value: weeklyDistribution.eligibleEntries.toLocaleString(), color: '#D4AF37' },
    { icon: CheckCircle2, label: 'Distribution Status', value: weeklyDistribution.distributionStatus, color: '#22c55e' },
  ];
  return (
    <div className="rounded-2xl p-4 md:p-6 border-2" style={{ background: 'linear-gradient(135deg, #0B0819, #1a1530)', borderColor: '#D4AF37' }}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: '#D4AF37' }}>
        <Trophy size={18} /> Weekly Distribution Summary
      </h2>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        {winners.map((w) => (
          <div key={w.tier} className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${w.color}33` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{w.medal}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: `${w.color}20`, color: w.color }}>{w.tier} Winner</span>
            </div>
            <div className="text-2xl font-bold tracking-widest text-white">{w.code}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-3 border text-center" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex justify-center mb-1"><s.icon size={16} style={{ color: s.color }} /></div>
            <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      {weeklyDistribution.vcosVerified && (
        <div className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <ShieldCheck size={16} style={{ color: '#22c55e' }} />
          <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>VCOS Verified</span>
        </div>
      )}
    </div>
  );
}
