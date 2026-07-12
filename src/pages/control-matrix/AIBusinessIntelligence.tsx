import {
  TrendingUp, Users, Wrench, Ticket, Store, ShoppingBag, HandHeart, Brain,
} from 'lucide-react';
import { aiBusinessIntelligence } from '../../lib/controlMatrixMockData';

const ICON_MAP: Record<string, any> = {
  TrendingUp, Users, Wrench, Ticket, Store, ShoppingBag, HandHeart,
};

export default function AIBusinessIntelligence() {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Brain size={18} style={{ color: '#D4AF37' }} /> AI Business Intelligence</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {aiBusinessIntelligence.map((insight) => {
          const Icon = ICON_MAP[insight.icon] || Brain;
          return (
            <div key={insight.id} className="rounded-2xl p-4 border transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${insight.color}20` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${insight.color}15` }}>
                  <Icon size={20} style={{ color: insight.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: `${insight.color}15`, color: insight.color }}>{insight.trend}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{insight.insight}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
