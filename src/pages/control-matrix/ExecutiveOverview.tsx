import {
  DollarSign, ShoppingBag, Sparkles, Ticket, Trophy, Award,
  Store, Package, Wrench, HandHeart, HeartPulse,
} from 'lucide-react';
import { executiveOverview } from '../../lib/controlMatrixMockData';

export default function ExecutiveOverview() {
  const cards = [
    { icon: DollarSign, label: 'Total Revenue', value: executiveOverview.totalRevenue, color: '#D4AF37' },
    { icon: ShoppingBag, label: "Today's Orders", value: executiveOverview.todayOrders.toString(), color: '#00F2FE' },
    { icon: Sparkles, label: 'Active SmartPoints', value: executiveOverview.activeSmartPoints.toLocaleString(), color: '#D4AF37' },
    { icon: Ticket, label: 'Active SmartCodes', value: executiveOverview.activeSmartCodes.toLocaleString(), color: '#00F2FE' },
    { icon: Trophy, label: 'Weekly Challenge Entries', value: executiveOverview.weeklyChallengeEntries.toLocaleString(), color: '#D4AF37' },
    { icon: Award, label: 'Prime Reward Participants', value: executiveOverview.primeParticipants.toString(), color: '#D4AF37' },
    { icon: Award, label: 'Premium Reward Participants', value: executiveOverview.premiumParticipants.toString(), color: '#818cf8' },
    { icon: Award, label: 'Standard Reward Participants', value: executiveOverview.standardParticipants.toString(), color: '#22c55e' },
    { icon: Store, label: 'Partner Stores', value: executiveOverview.partnerStores.toString(), color: '#00F2FE' },
    { icon: Package, label: 'Marketplace Listings', value: executiveOverview.marketplaceListings.toLocaleString(), color: '#818cf8' },
    { icon: Wrench, label: 'Local Service Providers', value: executiveOverview.localServiceProviders.toString(), color: '#f97316' },
    { icon: HandHeart, label: 'Care Club Contributors', value: executiveOverview.careClubContributors.toString(), color: '#ef4444' },
  ];
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3">Executive Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
      <div className="mt-3 rounded-xl p-3 border flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
        <HeartPulse size={16} style={{ color: '#22c55e' }} />
        <span className="text-xs text-gray-400">System Health: {executiveOverview.systemHealth}</span>
      </div>
    </div>
  );
}
