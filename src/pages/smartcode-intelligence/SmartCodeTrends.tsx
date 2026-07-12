import { useState } from 'react';
import { TrendingUp, TrendingDown, Zap, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { codeTrends } from '../../lib/smartCodeIntelligenceMockData';

type SubTab = 'popular' | 'unpopular' | 'growing' | 'weekly' | 'monthly';

export default function SmartCodeTrends() {
  const [subTab, setSubTab] = useState<SubTab>('popular');
  const subTabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'unpopular', label: 'Least Popular', icon: TrendingDown },
    { id: 'growing', label: 'Fastest Growing', icon: Zap },
    { id: 'weekly', label: 'Weekly Activity', icon: BarChart3 },
    { id: 'monthly', label: 'Monthly Activity', icon: BarChart3 },
  ];
  const maxWeekly = Math.max(...codeTrends.weeklyActivity.map((d) => d.value));
  const maxMonthly = Math.max(...codeTrends.monthlyActivity.map((d) => d.value));

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {subTabs.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all" style={{ background: subTab === t.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', color: subTab === t.id ? '#D4AF37' : '#9ca3af', border: `1px solid ${subTab === t.id ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-4 md:p-6 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
        {(subTab === 'popular' || subTab === 'unpopular') && (
          <div className="space-y-2">
            {(subTab === 'popular' ? codeTrends.mostPopular : codeTrends.leastPopular).map((item, i) => (
              <div key={item.code} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 font-bold w-6">#{i + 1}</span>
                  <span className="text-lg font-bold tracking-widest text-white">{item.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{item.count} entries</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${item.change.startsWith('+') ? 'text-emerald-400' : item.change.startsWith('-') ? 'text-red-400' : 'text-gray-500'}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === 'growing' && (
          <div className="space-y-2">
            {codeTrends.fastestGrowing.map((item, i) => (
              <div key={item.code} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 font-bold w-6">#{i + 1}</span>
                  <span className="text-lg font-bold tracking-widest text-white">{item.code}</span>
                </div>
                <span className="text-sm font-bold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{item.growth}</span>
              </div>
            ))}
          </div>
        )}

        {subTab === 'weekly' && (
          <div>
            <div className="flex items-end justify-between gap-2 h-48 mb-2">
              {codeTrends.weeklyActivity.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(d.value / maxWeekly) * 100}%`, background: 'linear-gradient(180deg, #D4AF37, rgba(212,175,55,0.3))' }} />
                  <span className="text-[10px] text-gray-500">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>Peak: Friday (2,680)</span>
              <span>Total: 12,847</span>
            </div>
          </div>
        )}

        {subTab === 'monthly' && (
          <div>
            <div className="flex items-end justify-between gap-2 h-48 mb-2">
              {codeTrends.monthlyActivity.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(d.value / maxMonthly) * 100}%`, background: 'linear-gradient(180deg, #00F2FE, rgba(0,242,254,0.3))' }} />
                  <span className="text-[10px] text-gray-500">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>Growth: +56% (Jan-Jun)</span>
              <span>Peak: June (12,847)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
