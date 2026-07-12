import { useState, lazy, Suspense } from 'react';
import {
  LayoutDashboard, ArrowLeft, Globe, ChevronDown, ShieldCheck,
} from 'lucide-react';
import { businessLayers, geoFilters, type BusinessLayer } from '../lib/controlMatrixMockData';

const ExecutiveOverview = lazy(() => import('./control-matrix/ExecutiveOverview'));
const SmartCodeIntelligence = lazy(() => import('./control-matrix/SmartCodeIntelligence'));
const ChallengeAnalytics = lazy(() => import('./control-matrix/ChallengeAnalytics'));
const SmartPointsIntelligence = lazy(() => import('./control-matrix/SmartPointsIntelligence'));
const PartnerCommerce = lazy(() => import('./control-matrix/PartnerCommerce'));
const MarketplaceAnalytics = lazy(() => import('./control-matrix/MarketplaceAnalytics'));
const LocalServicesAnalytics = lazy(() => import('./control-matrix/LocalServicesAnalytics'));
const CareClubIntelligence = lazy(() => import('./control-matrix/CareClubIntelligence'));
const SybilShield = lazy(() => import('./control-matrix/SybilShield'));
const AIBusinessIntelligence = lazy(() => import('./control-matrix/AIBusinessIntelligence'));
const EnterpriseHealth = lazy(() => import('./control-matrix/EnterpriseHealth'));

type Props = { onNavigate: (page: string) => void };

export default function ControlMatrixPage({ onNavigate }: Props) {
  const [activeLayer, setActiveLayer] = useState<BusinessLayer>('partner-commerce');
  const [geo, setGeo] = useState({ country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', village: 'Whitefield' });
  const [geoOpen, setGeoOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0B0819 0%, #12102a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('admin')} className="p-2 rounded-xl transition-colors hover:bg-white/10" aria-label="Back to admin">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <LayoutDashboard size={24} /> Control Matrix™
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Enterprise Admin Intelligence · Mock Data Only</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            <ShieldCheck size={14} /> Enterprise
          </span>
        </div>

        {/* Geographic Intelligence Filter */}
        <div className="rounded-2xl p-4 border mb-4" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.2)' }}>
          <button onClick={() => setGeoOpen(!geoOpen)} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Globe size={16} style={{ color: '#D4AF37' }} />
              <span className="text-sm font-bold text-white">{geo.village}, {geo.city}</span>
              <span className="text-xs text-gray-500">{geo.district}, {geo.state}, {geo.country}</span>
            </div>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${geoOpen ? 'rotate-180' : ''}`} />
          </button>
          {geoOpen && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              <GeoSelect label="Country" value={geo.country} options={geoFilters.countries} onChange={(v) => setGeo({ ...geo, country: v })} />
              <GeoSelect label="State" value={geo.state} options={geoFilters.states} onChange={(v) => setGeo({ ...geo, state: v })} />
              <GeoSelect label="District" value={geo.district} options={geoFilters.districts} onChange={(v) => setGeo({ ...geo, district: v })} />
              <GeoSelect label="City / Metro" value={geo.city} options={geoFilters.cities} onChange={(v) => setGeo({ ...geo, city: v })} />
              <GeoSelect label="Village" value={geo.village} options={geoFilters.villages} onChange={(v) => setGeo({ ...geo, village: v })} />
            </div>
          )}
        </div>

        {/* Business Layer Filter */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {businessLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: activeLayer === layer.id ? 'linear-gradient(135deg, #D4AF37, #B8941F)' : 'rgba(255,255,255,0.05)',
                color: activeLayer === layer.id ? '#0B0819' : '#9ca3af',
                border: activeLayer === layer.id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <Suspense fallback={<LoadingFallback />}>
          <div className="space-y-4">
            <ExecutiveOverview />
            <SmartCodeIntelligence />
            <ChallengeAnalytics />
            <SmartPointsIntelligence />
            {activeLayer === 'partner-commerce' && <PartnerCommerce />}
            {activeLayer === 'community-marketplace' && <MarketplaceAnalytics />}
            {activeLayer === 'local-services' && <LocalServicesAnalytics />}
            {activeLayer === 'care-club' && <CareClubIntelligence />}
            <SybilShield />
            <AIBusinessIntelligence />
            <EnterpriseHealth />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

function GeoSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {options.map((opt) => <option key={opt} value={opt} style={{ background: '#0B0819' }}>{opt}</option>)}
      </select>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full border-2 border-t-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }} />
    </div>
  );
}
