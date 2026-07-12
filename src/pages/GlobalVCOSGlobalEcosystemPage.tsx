// Phase 31 — VCOS™ Global Ecosystem Platform
// Universal Identity + Open Partner Platform

import { useState } from 'react';
import {
  User, Store, Wrench, Heart, HandHeart, Building, Building2, Globe,
  Key, Code, QrCode, Link2, Shield, BarChart3, Lock, FileText,
  Activity, CheckCircle, AlertCircle, Clock, Zap, Award, BadgeCheck,
  Settings, Database, Cloud, MessageSquare, Mail, Bell, Server,
  TrendingUp, Users, CreditCard, Info, ExternalLink, Download,
  ChevronRight, Star, MapPin, RefreshCw, Eye, Zap as ZapIcon,
} from 'lucide-react';
import {
  UNIVERSAL_DIGITAL_ID,
  OPEN_PARTNER_PLATFORM,
  API_GATEWAY,
  DEVELOPER_PORTAL,
  UNIVERSAL_QR_SYSTEM,
  MULTI_COUNTRY_ENGINE,
  ENTERPRISE_CONNECTORS,
  SMART_INTEGRATION_LAYER,
  PARTNER_TRUST_SYSTEM,
  GLOBAL_ECOSYSTEM_DASHBOARD,
  LEGAL_SECURITY,
  ECOSYSTEM_SUMMARY,
  formatNumber,
  getStatusColor,
  getTrustBadgeColor,
} from '../lib/vcosGlobalEcosystemMockData';

type GlobalVCOSGlobalEcosystemPageProps = {
  onNavigate: (page: string) => void;
};

export default function GlobalVCOSGlobalEcosystemPage({ onNavigate }: GlobalVCOSGlobalEcosystemPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'identity', label: 'Universal ID', icon: User },
    { id: 'partners', label: 'Partner Platform', icon: Building2 },
    { id: 'api', label: 'API Gateway', icon: Key },
    { id: 'developers', label: 'Developer Portal', icon: Code },
    { id: 'qr', label: 'Universal QR', icon: QrCode },
    { id: 'countries', label: 'Multi-Country', icon: MapPin },
    { id: 'connectors', label: 'Connectors', icon: Link2 },
    { id: 'integrations', label: 'Integrations', icon: Cloud },
    { id: 'trust', label: 'Partner Trust', icon: Shield },
    { id: 'dashboard', label: 'Ecosystem', icon: BarChart3 },
    { id: 'legal', label: 'Legal & Security', icon: Lock },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', border: '2px solid #D4AF37' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#D4AF37' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#00F2FE' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.15)' }}>
            <Globe size={14} style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Phase 31 • Production Ready</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-display" style={{ color: '#D4AF37' }}>
            VCOS™ Global Ecosystem Platform
          </h1>
          <p className="text-white/80 mb-6 max-w-3xl">
            Transform VLOOP from an application into a Global Socio-Economic Ecosystem Platform through Universal Digital Identity, Partner APIs, Developer Tools, and Global Expansion Framework.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Identities', value: '3.05M' },
              { label: 'Partners', value: '12,567' },
              { label: 'Countries', value: '7' },
              { label: 'API Calls', value: '51.2M/day' },
              { label: 'Uptime', value: '99.97%' },
              { label: 'Trust Score', value: '94.2%' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ECOSYSTEM_SUMMARY.modules.map((module, idx) => (
          <button
            key={module}
            onClick={() => setActiveTab(tabs[idx + 1]?.id || 'overview')}
            className="p-5 rounded-xl border transition-all hover:scale-[1.02] text-left"
            style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 100%)', borderColor: 'rgba(212,175,55,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const Icon = tabs[idx + 1]?.icon || Globe;
                return <Icon size={20} style={{ color: '#D4AF37' }} />;
              })()}
              <span className="font-semibold text-white">{module}</span>
            </div>
            <p className="text-sm text-white/60">Module {idx + 1} • Click to explore</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderUniversalID = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>VCOS Universal Digital ID</h2>
        <BadgeCheck className="w-6 h-6 text-green-400" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(UNIVERSAL_DIGITAL_ID.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="text-xl font-bold" style={{ color: '#3b82f6' }}>
              {typeof value === 'number' ? formatNumber(value) : value}
            </div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Identity Types */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Identity Types Supported</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {UNIVERSAL_DIGITAL_ID.identityTypes.map((type) => (
            <div key={type.type} className="p-4 rounded-xl text-center" style={{ background: `${type.color}15`, border: `1px solid ${type.color}30` }}>
              <div className="text-lg font-bold" style={{ color: type.color }}>{formatNumber(type.count)}</div>
              <div className="text-xs text-white/60">{type.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {UNIVERSAL_DIGITAL_ID.features.map((feature) => (
          <div key={feature.name} className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">{feature.name}</div>
              <div className="text-xs text-white/60">{feature.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Open Partner Platform</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
          {formatNumber(OPEN_PARTNER_PLATFORM.stats.totalPartners)} Partners
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(OPEN_PARTNER_PLATFORM.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div className="text-xl font-bold text-green-400">
              {typeof value === 'number' ? formatNumber(value) : value}
            </div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Partner Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {OPEN_PARTNER_PLATFORM.partnerCategories.map((cat) => (
            <div key={cat.category} className="p-4 rounded-xl" style={{ background: `${cat.color}10`, border: `1px solid ${cat.color}30` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{cat.category}</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: `${cat.color}20`, color: cat.color }}>
                  {cat.status}
                </span>
              </div>
              <div className="text-lg font-bold" style={{ color: cat.color }}>{formatNumber(cat.partners)}</div>
              <div className="text-xs text-white/60">Partners</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAPIGateway = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>VCOS API Gateway</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
          {API_GATEWAY.stats.uptime} Uptime
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(API_GATEWAY.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>{value}</div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Endpoints */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Active API Endpoints</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/60 border-b border-white/10">
                <th className="pb-2">Endpoint</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Calls</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {API_GATEWAY.endpoints.map((ep) => (
                <tr key={ep.endpoint} className="border-b border-white/5">
                  <td className="py-3 font-mono text-sm" style={{ color: '#00F2FE' }}>{ep.endpoint}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: ep.method === 'POST' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)', color: ep.method === 'POST' ? '#22c55e' : '#3b82f6' }}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white/80">{ep.calls}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">{ep.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
        <h3 className="text-lg font-semibold mb-4 text-amber-400">Security Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-sm font-semibold text-white">Authentication</div>
            <div className="text-xs text-white/60">{API_GATEWAY.security.authentication.join(', ')}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-sm font-semibold text-white">Rate Limiting</div>
            <div className="text-xs text-white/60">Default: {API_GATEWAY.security.rateLimit.default}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-sm font-semibold text-white">Encryption</div>
            <div className="text-xs text-white/60">{API_GATEWAY.security.encryption}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeveloperPortal = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Developer Portal</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#8b5cf6' }}>
          {formatNumber(DEVELOPER_PORTAL.stats.totalDevelopers)} Developers
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(DEVELOPER_PORTAL.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <div className="text-xl font-bold text-violet-400">
              {typeof value === 'number' ? formatNumber(value) : value}
            </div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Developer Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DEVELOPER_PORTAL.features.map((feature) => (
            <div key={feature.name} className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <CheckCircle size={16} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-white">{feature.name}</div>
                <div className="text-xs text-white/60">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SDKs */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Download size={18} style={{ color: '#D4AF37' }} />
          Official SDKs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DEVELOPER_PORTAL.sdks.map((sdk) => (
            <button key={sdk.language} className="p-4 rounded-xl text-center transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="font-semibold text-white">{sdk.language}</div>
              <div className="text-xs text-white/60">v{sdk.version}</div>
              <div className="text-xs mt-1" style={{ color: '#22c55e' }}>{sdk.downloads}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQRSystem = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Universal QR System</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(6,182,212,0.2)', color: '#06b6d4' }}>
          {UNIVERSAL_QR_SYSTEM.stats.totalScans} scans/month
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(UNIVERSAL_QR_SYSTEM.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
            <div className="text-xl font-bold text-cyan-400">{value}</div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Capabilities */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">QR Capabilities</h3>
        <div className="space-y-3">
          {UNIVERSAL_QR_SYSTEM.capabilities.map((cap) => (
            <div key={cap.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <QrCode size={20} style={{ color: '#06b6d4' }} />
                <div>
                  <div className="font-semibold text-white">{cap.name}</div>
                  <div className="text-xs text-white/60">{cap.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: '#06b6d4' }}>{cap.scans}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMultiCountry = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Multi-Country Engine</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
          {MULTI_COUNTRY_ENGINE.stats.activeCountries} Countries Active
        </span>
      </div>

      {/* Localization */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(MULTI_COUNTRY_ENGINE.localization).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <div className="text-xl font-bold text-amber-400">{value}</div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Countries */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Supported Countries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/60 border-b border-white/10">
                <th className="pb-2">Country</th>
                <th className="pb-2">Code</th>
                <th className="pb-2">Currency</th>
                <th className="pb-2">Languages</th>
                <th className="pb-2">Users</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {MULTI_COUNTRY_ENGINE.countries.map((country) => (
                <tr key={country.code} className="border-b border-white/5">
                  <td className="py-3 font-semibold text-white">{country.country}</td>
                  <td className="py-3 text-sm" style={{ color: '#00F2FE' }}>{country.code}</td>
                  <td className="py-3 text-sm text-white/80">{country.currency}</td>
                  <td className="py-3 text-sm text-white/80">{country.language}</td>
                  <td className="py-3 text-sm font-semibold" style={{ color: '#22c55e' }}>{country.users}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: country.status === 'Active' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)', color: country.status === 'Active' ? '#22c55e' : '#f59e0b' }}>
                      {country.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderConnectors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Enterprise Connectors</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>
          {formatNumber(ENTERPRISE_CONNECTORS.stats.totalIntegrations)} Integrations
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(ENTERPRISE_CONNECTORS.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="text-xl font-bold text-blue-400">
              {typeof value === 'number' ? formatNumber(value) : value}
            </div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Connectors */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Available Connectors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ENTERPRISE_CONNECTORS.connectors.map((conn) => (
            <div key={conn.name} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Link2 size={24} className="mx-auto mb-2" style={{ color: '#3b82f6' }} />
              <div className="font-semibold text-sm text-white">{conn.name}</div>
              <div className="text-xs text-white/60">{formatNumber(conn.integrations)} active</div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
                {conn.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Smart Integration Layer</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(236,72,153,0.2)', color: '#ec4899' }}>
          {SMART_INTEGRATION_LAYER.stats.totalProviders} Providers
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(SMART_INTEGRATION_LAYER.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)' }}>
            <div className="text-xl font-bold text-pink-400">{value}</div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Integrations */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Future-Ready Connectors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SMART_INTEGRATION_LAYER.integrations.map((int) => (
            <div key={int.name} className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Cloud size={20} style={{ color: '#ec4899' }} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{int.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
                    {int.status}
                  </span>
                </div>
                <div className="text-xs text-white/60 mt-1">{int.description}</div>
                <div className="text-xs mt-2" style={{ color: '#ec4899' }}>{int.providers} providers available</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrust = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Partner Trust System</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>
          {PARTNER_TRUST_SYSTEM.stats.avgTrustScore}% Avg Trust Score
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(PARTNER_TRUST_SYSTEM.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <div className="text-xl font-bold text-amber-400">
              {typeof value === 'number' ? (key.includes('Score') ? `${value}%` : formatNumber(value)) : value}
            </div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Partner Trust Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PARTNER_TRUST_SYSTEM.partnerBadges.map((badge) => (
            <div key={badge.badge} className="p-4 rounded-xl text-center" style={{ background: `${getTrustBadgeColor(badge.badge)}15`, border: `1px solid ${getTrustBadgeColor(badge.badge)}30` }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award size={20} style={{ color: getTrustBadgeColor(badge.badge) }} />
                <span className="font-bold" style={{ color: getTrustBadgeColor(badge.badge) }}>{badge.badge}</span>
              </div>
              <div className="text-lg font-bold text-white">{formatNumber(badge.count)}</div>
              <div className="text-xs text-white/60">{badge.requirements}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Trust Metrics</h3>
        <div className="space-y-3">
          {PARTNER_TRUST_SYSTEM.trustMetrics.map((metric) => (
            <div key={metric.metric} className="flex items-center gap-4">
              <div className="w-40 text-sm text-white/80">{metric.metric}</div>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${metric.score}%`, background: metric.score >= 95 ? '#22c55e' : metric.score >= 90 ? '#3b82f6' : '#f59e0b' }}
                />
              </div>
              <div className="w-16 text-right font-bold" style={{ color: metric.score >= 95 ? '#22c55e' : metric.score >= 90 ? '#3b82f6' : '#f59e0b' }}>
                {metric.score}%
              </div>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${getStatusColor(metric.status)}20`, color: getStatusColor(metric.status) }}>
                {metric.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEcosystem = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Global Ecosystem Dashboard</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
          Live Monitoring
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GLOBAL_ECOSYSTEM_DASHBOARD.metrics.map((metric) => (
          <div key={metric.name} className="p-4 rounded-xl" style={{ background: `${metric.color}10`, border: `1px solid ${metric.color}30` }}>
            <div className="text-xl font-bold" style={{ color: metric.color }}>{metric.value}</div>
            <div className="text-xs text-white/60">{metric.name}</div>
            <div className="text-xs mt-1" style={{ color: metric.color }}>{metric.trend}</div>
          </div>
        ))}
      </div>

      {/* Regional Breakdown */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Regional Breakdown</h3>
        <div className="space-y-4">
          {GLOBAL_ECOSYSTEM_DASHBOARD.regionalBreakdown.map((region) => (
            <div key={region.region} className="flex items-center gap-4">
              <div className="w-32 font-semibold text-white">{region.region}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-20">Users:</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full bg-blue-400" style={{ width: region.users }} />
                  </div>
                  <span className="text-xs text-white/80 w-12">{region.users}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-20">Transactions:</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full bg-green-400" style={{ width: region.transactions }} />
                  </div>
                  <span className="text-xs text-white/80 w-12">{region.transactions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-20">Revenue:</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full" style={{ background: '#D4AF37', width: region.revenue }} />
                  </div>
                  <span className="text-xs text-white/80 w-12">{region.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>Legal & Security</h2>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
          {LEGAL_SECURITY.stats.complianceScore}% Compliant
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(LEGAL_SECURITY.stats).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div className="text-xl font-bold" style={{ color: '#22c55e' }}>
              {typeof value === 'number' ? (key.includes('Score') ? `${value}%` : value) : value}
            </div>
            <div className="text-xs text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Certifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LEGAL_SECURITY.certifications.map((cert) => (
            <div key={cert.name} className="p-4 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Shield size={24} className="mx-auto mb-2 text-green-400" />
              <div className="font-semibold text-white">{cert.name}</div>
              <div className="text-xs" style={{ color: '#22c55e' }}>{cert.status} • {cert.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold mb-4 text-white">Security Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {LEGAL_SECURITY.principles.map((principle) => (
            <div key={principle.principle} className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-white">{principle.principle}</div>
                <div className="text-xs text-white/60">{principle.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'identity': return renderUniversalID();
      case 'partners': return renderPartners();
      case 'api': return renderAPIGateway();
      case 'developers': return renderDeveloperPortal();
      case 'qr': return renderQRSystem();
      case 'countries': return renderMultiCountry();
      case 'connectors': return renderConnectors();
      case 'integrations': return renderIntegrations();
      case 'trust': return renderTrust();
      case 'dashboard': return renderEcosystem();
      case 'legal': return renderLegal();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0B0819' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" style={{ color: '#D4AF37' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-display" style={{ color: '#D4AF37' }}>
                Global Ecosystem Platform
              </h1>
              <p className="text-sm text-white/60">Phase 31 • Universal Identity + Open Partner Platform</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #D4AF37, #B8941F)' } : {}}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="border-t mt-8" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>VLOOP VCOS™ Global Ecosystem Platform • Phase 31</span>
            <span>Universal Identity • Open Partner Platform • Global Expansion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
