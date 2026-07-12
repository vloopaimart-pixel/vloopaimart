import { ShoppingBag, Store, Award, MapPin } from 'lucide-react';
import { partnerCommerceAnalytics } from '../../lib/controlMatrixMockData';

export default function PartnerCommerce() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><ShoppingBag size={18} style={{ color: '#D4AF37' }} /> Partner Commerce Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <MiniStat icon={ShoppingBag} label="Orders" value={partnerCommerceAnalytics.orders.toLocaleString()} color="#00F2FE" />
        <MiniStat icon={Award} label="Revenue" value={partnerCommerceAnalytics.revenue} color="#D4AF37" />
        <MiniStat icon={Store} label="Top Stores" value={partnerCommerceAnalytics.topStores.length.toString()} color="#818cf8" />
        <MiniStat icon={Award} label="Categories" value={partnerCommerceAnalytics.bestCategories.length.toString()} color="#22c55e" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Panel title="Top Stores" icon={Store} color="#D4AF37">
          {partnerCommerceAnalytics.topStores.map((s, i) => (
            <div key={s.name} className="flex items-center justify-between py-2 text-sm border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-4">#{i + 1}</span>
                <span className="font-bold text-white">{s.name}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{s.orders} orders</div>
                <div className="text-xs font-bold" style={{ color: '#D4AF37' }}>{s.revenue}</div>
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Best Categories" icon={Award} color="#00F2FE">
          {partnerCommerceAnalytics.bestCategories.map((c) => (
            <div key={c.name} className="py-2 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-white">{c.name}</span>
                <span className="text-xs" style={{ color: '#00F2FE' }}>{c.share}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: c.share, background: '#00F2FE' }} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Regional Performance" icon={MapPin} color="#22c55e">
          {partnerCommerceAnalytics.regionalPerformance.map((r) => (
            <div key={r.region} className="flex items-center justify-between py-2 text-sm border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <span className="font-bold text-white">{r.region}</span>
              <div className="text-right">
                <div className="text-xs font-bold" style={{ color: '#22c55e' }}>{r.revenue}</div>
                <div className="text-[10px] text-gray-500">{r.orders} orders</div>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function Panel({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Icon size={14} style={{ color }} /> {title}</h3>
      {children}
    </div>
  );
}
