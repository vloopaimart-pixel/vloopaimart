import { HandHeart, Utensils, Pill, Droplet, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { careClubIntelligence } from '../../lib/controlMatrixMockData';

export default function CareClubIntelligence() {
  const cards = [
    { icon: HandHeart, label: 'Contributions', value: careClubIntelligence.contributions, color: '#D4AF37' },
    { icon: Clock, label: 'Emergency Requests', value: careClubIntelligence.emergencyRequests, color: '#ef4444' },
    { icon: Utensils, label: 'Food', value: careClubIntelligence.food, color: '#f97316' },
    { icon: Pill, label: 'Medicine', value: careClubIntelligence.medicine, color: '#ef4444' },
    { icon: Droplet, label: 'Blood', value: careClubIntelligence.blood, color: '#ef4444' },
    { icon: GraduationCap, label: 'Education', value: careClubIntelligence.education, color: '#818cf8' },
    { icon: Clock, label: 'Pending Reviews', value: careClubIntelligence.pendingReviews, color: '#fbbf24' },
    { icon: CheckCircle2, label: 'Approved Assistance', value: careClubIntelligence.approvedAssistance, color: '#22c55e' },
  ];
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><HandHeart size={18} style={{ color: '#ef4444' }} /> Care Club Intelligence</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
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
      <div className="mt-3 text-[10px] text-gray-600 text-center">Mock only · No eligibility logic</div>
    </div>
  );
}
