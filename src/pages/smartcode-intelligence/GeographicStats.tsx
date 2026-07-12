import { useState } from 'react';
import { MapPin, ChevronDown, Users, Award, Gift } from 'lucide-react';
import { geoStats } from '../../lib/smartCodeIntelligenceMockData';

export default function GeographicStats() {
  const [expanded, setExpanded] = useState<string | null>(geoStats[0]?.id || null);

  return (
    <div>
      <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2"><MapPin size={18} style={{ color: '#D4AF37' }} /> Geographic Statistics</h2>
      <p className="text-xs text-gray-500 mb-4">Regional SmartCode participation and reward distribution</p>
      <div className="space-y-2">
        {geoStats.map((geo) => {
          const isOpen = expanded === geo.id;
          return (
            <div key={geo.id} className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <button onClick={() => setExpanded(isOpen ? null : geo.id)} className="w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                    <MapPin size={18} style={{ color: '#D4AF37' }} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{geo.city}, {geo.state}</div>
                    <div className="text-[10px] text-gray-500">{geo.district}, {geo.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>{geo.entries.toLocaleString()}</span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                  <GeoDetail icon={Users} label="Entries" value={geo.entries.toLocaleString()} color="#00F2FE" />
                  <GeoDetail icon={Award} label="Participation" value={geo.participation} color="#D4AF37" />
                  <GeoDetail icon={Gift} label="Rewards" value={geo.rewardDistribution} color="#22c55e" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GeoDetail({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex justify-center mb-1"><Icon size={14} style={{ color }} /></div>
      <div className="text-xs font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
