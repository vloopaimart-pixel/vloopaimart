import { useState } from 'react';
import { Grid3x3, Search, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { smartCodeMatrix } from '../../lib/smartCodeIntelligenceMockData';

export default function MatrixPreview() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rank' | 'entries' | 'points'>('rank');

  let filtered = smartCodeMatrix;
  if (search) {
    filtered = smartCodeMatrix.filter((c) => c.code.includes(search));
  }
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'rank') return a.weeklyRank - b.weeklyRank;
    if (sort === 'entries') return b.entryCount - a.entryCount;
    return b.totalSmartPoints - a.totalSmartPoints;
  });

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp size={14} className="text-emerald-400" />;
    if (trend === 'down') return <ArrowDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-gray-500" />;
  };

  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2"><Grid3x3 size={18} style={{ color: '#D4AF37' }} /> SmartCode Matrix (000-999)</h2>
      <p className="text-xs text-gray-500 mb-4">Scalable analytics matrix · Showing {filtered.length} sample codes from 1,000 total</p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code (e.g., 741)..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex gap-1.5">
          {(['rank', 'entries', 'points'] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className="px-3 py-2.5 rounded-xl text-xs font-bold capitalize transition-all" style={{ background: sort === s ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', color: sort === s ? '#D4AF37' : '#9ca3af', border: `1px solid ${sort === s ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
              {s === 'rank' ? 'Rank' : s === 'entries' ? 'Entries' : 'Points'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="grid grid-cols-6 gap-2 px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>Code</div>
          <div className="text-right">Entries</div>
          <div className="text-right hidden sm:block">Valid</div>
          <div className="text-right hidden sm:block">SP Total</div>
          <div className="text-center">Trend</div>
          <div className="text-right">Rank</div>
        </div>
        {/* Rows */}
        <div className="max-h-96 overflow-y-auto">
          {filtered.map((entry) => (
            <div key={entry.code} className="grid grid-cols-6 gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div className="font-bold tracking-widest" style={{ color: '#D4AF37' }}>{entry.code}</div>
              <div className="text-right text-gray-300">{entry.entryCount}</div>
              <div className="text-right text-gray-400 hidden sm:block">{entry.validEntries}</div>
              <div className="text-right text-gray-400 hidden sm:block">{entry.totalSmartPoints.toLocaleString()}</div>
              <div className="flex justify-center">{trendIcon(entry.trend)}</div>
              <div className="text-right text-gray-500 text-xs">#{entry.weeklyRank}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">No codes found matching "{search}"</div>
          )}
        </div>
      </div>
      <div className="mt-3 text-[10px] text-gray-600 text-center">Mock data · Full 000-999 matrix will be populated in production</div>
    </div>
  );
}
