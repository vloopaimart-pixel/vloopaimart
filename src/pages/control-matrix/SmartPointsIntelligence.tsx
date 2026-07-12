import { Sparkles, ShoppingBag, HandHeart, Wrench, Store } from 'lucide-react';
import { smartPointsIntelligence } from '../../lib/controlMatrixMockData';

export default function SmartPointsIntelligence() {
  const cards = [
    { icon: Sparkles, label: 'Total SmartPoints Generated', value: smartPointsIntelligence.totalGenerated.toLocaleString(), color: '#D4AF37' },
    { icon: Sparkles, label: "Today's SmartPoints", value: smartPointsIntelligence.todayGenerated.toLocaleString(), color: '#00F2FE' },
    { icon: ShoppingBag, label: 'Purchase Generated', value: smartPointsIntelligence.purchaseGenerated.toLocaleString(), color: '#22c55e' },
    { icon: HandHeart, label: 'Care Club Generated', value: smartPointsIntelligence.careClubGenerated.toLocaleString(), color: '#ef4444' },
    { icon: Wrench, label: 'Service Generated', value: smartPointsIntelligence.serviceGenerated.toLocaleString(), color: '#f97316' },
    { icon: Store, label: 'Marketplace Generated', value: smartPointsIntelligence.marketplaceGenerated.toLocaleString(), color: '#818cf8' },
  ];
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Sparkles size={18} style={{ color: '#D4AF37' }} /> SmartPoints Intelligence</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
