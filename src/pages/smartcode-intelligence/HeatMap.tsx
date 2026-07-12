import { Activity } from 'lucide-react';
import { heatMapData, type HeatCell } from '../../lib/smartCodeIntelligenceMockData';

const INTENSITY_STYLES: Record<HeatCell['intensity'], { bg: string; label: string }> = {
  low: { bg: 'rgba(34,197,94,0.25)', label: 'Low' },
  medium: { bg: 'rgba(251,191,36,0.35)', label: 'Medium' },
  high: { bg: 'rgba(249,115,22,0.45)', label: 'High' },
  extreme: { bg: 'rgba(212,175,55,0.6)', label: 'Extreme' },
};

export default function HeatMap() {
  return (
    <div className="rounded-2xl p-4 md:p-6 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
      <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2"><Activity size={18} style={{ color: '#D4AF37' }} /> SmartCode Activity Heat Map</h2>
      <p className="text-xs text-gray-500 mb-4">Visual intensity of SmartCode submissions across 000-999 range</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {(Object.keys(INTENSITY_STYLES) as HeatCell['intensity'][]).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: INTENSITY_STYLES[key].bg }} />
            <span className="text-[10px] text-gray-400">{INTENSITY_STYLES[key].label}</span>
          </div>
        ))}
      </div>

      {/* Heat Grid */}
      <div className="grid grid-cols-10 gap-1">
        {heatMapData.map((cell, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm transition-all hover:scale-125 hover:z-10 cursor-pointer relative group"
            style={{ background: INTENSITY_STYLES[cell.intensity].bg, border: '1px solid rgba(255,255,255,0.05)' }}
            title={`${cell.range}: ${cell.value} entries`}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-[10px] text-white bg-black/80 px-2 py-1 rounded z-20">
              {cell.range}: {cell.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[10px] text-gray-600 text-center">Each cell represents a range of 10 SmartCodes (e.g., 000-009). Hover for details.</div>
    </div>
  );
}
