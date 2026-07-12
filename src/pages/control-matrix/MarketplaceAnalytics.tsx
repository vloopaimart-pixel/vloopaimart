import { Store, Utensils, Scissors, Package, Wheat, Users } from 'lucide-react';
import { marketplaceAnalytics } from '../../lib/controlMatrixMockData';

export default function MarketplaceAnalytics() {
  const cards = [
    { icon: Utensils, label: 'Homemade Products', value: marketplaceAnalytics.homemadeProducts, color: '#f97316' },
    { icon: Scissors, label: 'Handmade Products', value: marketplaceAnalytics.handmadeProducts, color: '#818cf8' },
    { icon: Package, label: 'Used Products', value: marketplaceAnalytics.usedProducts, color: '#00F2FE' },
    { icon: Wheat, label: 'Agriculture', value: marketplaceAnalytics.agriculture, color: '#22c55e' },
    { icon: Users, label: 'Local Sellers', value: marketplaceAnalytics.localSellers, color: '#D4AF37' },
    { icon: Store, label: 'Active Listings', value: marketplaceAnalytics.activeListings, color: '#D4AF37' },
  ];
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Store size={18} style={{ color: '#D4AF37' }} /> Community Marketplace Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
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
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-bold text-white mb-3">Top Categories</h3>
        <div className="space-y-2">
          {marketplaceAnalytics.topCategories.map((c) => (
            <div key={c.name} className="flex items-center justify-between py-2">
              <span className="text-sm font-bold text-white">{c.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{c.listings} listings</span>
                <span className="text-xs font-bold text-emerald-400">{c.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
