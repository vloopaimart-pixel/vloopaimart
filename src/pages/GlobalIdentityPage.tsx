import { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle,
  Clock,
  MapPin,
  Languages,
  DollarSign,
  ShoppingBag,
  Wrench,
  Store,
  Users,
  Heart,
  Trophy,
  Info,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Type,
  Contrast,
  Zap,
  Settings,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  COUNTRIES,
  LANGUAGES,
  FUTURE_LANGUAGES,
  REGIONAL_SERVICES,
  REGION_INFO,
  ACCESSIBILITY_OPTIONS,
  COMPLIANCE_NOTICE,
  getMockWeeklyCountdown,
  getCurrencyExample,
  type Country,
} from '../lib/globalIdentityMockData';

type GlobalIdentityPageProps = {
  onNavigate: (page: string) => void;
};

export default function GlobalIdentityPage({ onNavigate }: GlobalIdentityPageProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [currentTime, setCurrentTime] = useState('');
  const [countdown, setCountdown] = useState(getMockWeeklyCountdown());
  const [accessibilitySettings, setAccessibilitySettings] = useState<Record<string, string>>({
    'font-size': 'Medium',
    'high-contrast': 'Off',
    'reduced-motion': 'Off',
    language: 'English',
    theme: 'System',
  });

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      try {
        const time = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: selectedCountry.timezone,
        });
        setCurrentTime(time);
        setCountdown(getMockWeeklyCountdown());
      } catch {
        setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [selectedCountry.timezone]);

  const currencyExample = getCurrencyExample(selectedCountry);

  const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    ShoppingBag,
    Wrench,
    Store,
    Users,
    Heart,
    Trophy,
    CheckCircle,
    Clock,
    Globe,
    MapPin,
  };

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'linear-gradient(135deg, #0B0819 0%, #1a1530 50%, #0B0819 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">

        {/* SECTION 1 — Global Welcome Card */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-3xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00F2FE 0%, transparent 70%)' }} />
          <div className="relative rounded-xl md:rounded-2xl p-6 md:p-10 backdrop-blur-sm" style={{ background: 'rgba(11,8,25,0.8)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                    <Globe className="w-7 h-7" style={{ color: '#0B0819' }} />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-display" style={{ color: '#D4AF37' }}>Welcome to VLOOP</h1>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Global Human-Centered Commerce Platform</p>
                  </div>
                </div>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                  One Ecosystem.<br />
                  <span className="font-semibold" style={{ color: '#D4AF37' }}>Many Countries.</span><br />
                  <span className="text-gray-300">One Transparent Experience.</span>
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <MapPin className="w-4 h-4" style={{ color: '#00F2FE' }} />
                  <span className="font-semibold" style={{ color: '#D4AF37' }}>{selectedCountry.flag} {selectedCountry.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{selectedCountry.region}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  Phase 23 • Global Identity Layer
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 & 3 — Country & Language Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Country Selector */}
          <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
            <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                  <Globe className="w-5 h-5" style={{ color: '#D4AF37' }} />
                </div>
                <h2 className="text-xl font-bold text-white">Select Your Region</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country)}
                    className={`relative p-4 rounded-xl transition-all text-left flex items-center gap-3 ${
                      selectedCountry.code === country.code
                        ? 'border-2'
                        : 'border border-gray-700/50 hover:border-gray-600'
                    }`}
                    style={{
                      background: selectedCountry.code === country.code ? 'rgba(212,175,55,0.15)' : 'rgba(11,8,25,0.6)',
                      borderColor: selectedCountry.code === country.code ? '#D4AF37' : undefined,
                    }}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {country.name}
                        {country.comingSoon && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Soon</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{country.currencySymbol} • {country.currency}</div>
                    </div>
                    {selectedCountry.code === country.code && (
                      <CheckCircle className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Language Selector */}
          <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
            <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                  <Languages className="w-5 h-5" style={{ color: '#00F2FE' }} />
                </div>
                <h2 className="text-xl font-bold text-white">Select Language</h2>
              </div>

              <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full p-4 rounded-xl transition-all text-left flex items-center justify-between ${
                      selectedLanguage === lang.code
                        ? 'border-2'
                        : 'border border-gray-700/50 hover:border-gray-600'
                    }`}
                    style={{
                      background: selectedLanguage === lang.code ? 'rgba(0,242,254,0.1)' : 'rgba(11,8,25,0.6)',
                      borderColor: selectedLanguage === lang.code ? '#00F2FE' : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: selectedLanguage === lang.code ? 'rgba(0,242,254,0.2)' : 'rgba(255,255,255,0.05)' }}>
                        <span className="font-bold text-lg" style={{ color: selectedLanguage === lang.code ? '#00F2FE' : '#D4AF37' }}>
                          {lang.native.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{lang.name}</div>
                        <div className="text-sm text-gray-400">{lang.native}</div>
                      </div>
                    </div>
                    {selectedLanguage === lang.code && (
                      <CheckCircle className="w-5 h-5" style={{ color: '#00F2FE' }} />
                    )}
                  </button>
                ))}

                {/* Future Languages */}
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    Future Languages
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FUTURE_LANGUAGES.map((lang) => (
                      <div
                        key={lang.code}
                        className="px-3 py-2 rounded-lg text-sm text-gray-400 flex items-center gap-2"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <span>{lang.native}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-500">Coming</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 4 — Currency Preview */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Currency Preview</h2>
              <span className="text-sm text-gray-400 ml-auto">Demo Only</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {COUNTRIES.slice(0, 5).map((country) => {
                const example = getCurrencyExample(country);
                return (
                  <div
                    key={country.code}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedCountry.code === country.code ? 'ring-2' : ''
                    }`}
                    style={{
                      background: selectedCountry.code === country.code ? 'rgba(212,175,55,0.15)' : 'rgba(11,8,25,0.6)',
                      borderColor: selectedCountry.code === country.code ? '#D4AF37' : undefined,
                    }}
                  >
                    <div className="text-2xl mb-2">{country.flag}</div>
                    <div className="font-bold text-lg" style={{ color: '#D4AF37' }}>{country.currencySymbol}</div>
                    <div className="text-sm text-gray-300">{country.currency}</div>
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <span className="text-xs text-gray-400">Example: </span>
                      <span className="text-sm font-semibold text-white">{example.formatted}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5 — Regional Experience */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <Store className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Regional Experience</h2>
                <p className="text-sm text-gray-400">Services available in {selectedCountry.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {REGIONAL_SERVICES.map((service) => {
                const IconComponent = iconMap[service.icon] || ShoppingBag;
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      const pages: Record<string, string> = {
                        ShoppingBag: 'marketplace',
                        Wrench: 'local-services',
                        Store: 'seller-store',
                        Users: 'careclub',
                        Heart: 'careclub',
                        Trophy: 'challenge-center',
                      };
                      onNavigate(pages[service.icon] || 'home');
                    }}
                    className="group p-5 rounded-xl transition-all hover:scale-[1.02] text-left"
                    style={{
                      background: 'rgba(11,8,25,0.8)',
                      border: '1px solid rgba(212,175,55,0.3)',
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>
                      <IconComponent className="w-6 h-6" style={{ color: '#0B0819' }} />
                    </div>
                    <div className="font-semibold text-white mb-1">{service.name}</div>
                    <div className="text-xs text-gray-400">{service.description}</div>
                    {service.available && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 6 — Time Zone Display */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,242,254,0.15)' }}>
                <Clock className="w-5 h-5" style={{ color: '#00F2FE' }} />
              </div>
              <h2 className="text-xl font-bold text-white">Time Zone Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm text-gray-400">Current Region</span>
                </div>
                <div className="text-xl font-bold text-white">{selectedCountry.flag} {selectedCountry.name}</div>
                <div className="text-sm text-gray-400 mt-1">{selectedCountry.region}</div>
              </div>

              <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: '#00F2FE' }} />
                  <span className="text-sm text-gray-400">Local Time</span>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#00F2FE' }}>{currentTime || '--:--'}</div>
                <div className="text-sm text-gray-400">{selectedCountry.timezone}</div>
              </div>

              <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm text-gray-400">Weekly Challenge</span>
                </div>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{countdown.days}</span>
                  <span className="text-sm text-gray-400">d</span>
                  <span className="text-2xl font-bold text-white">{countdown.hours}</span>
                  <span className="text-sm text-gray-400">h</span>
                  <span className="text-2xl font-bold text-white">{countdown.minutes}</span>
                  <span className="text-sm text-gray-400">m</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">until next draw</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — Regional Information Panel */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Region Info Cards */}
          <div className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
            <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
              <div className="flex items-center gap-3 mb-5">
                <Info className="w-5 h-5" style={{ color: '#00F2FE' }} />
                <h2 className="text-xl font-bold text-white">Regional Information</h2>
              </div>

              <div className="space-y-3">
                {REGION_INFO.map((info) => {
                  const IconComponent = iconMap[info.icon] || Info;
                  const statusColors = {
                    available: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' },
                    coming_soon: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
                    future: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
                  };
                  const colors = statusColors[info.status];

                  return (
                    <div
                      key={info.id}
                      className="p-4 rounded-xl"
                      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <IconComponent className="w-5 h-5" style={{ color: colors.text }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{info.title}</div>
                          <div className="text-sm text-gray-400">{info.description}</div>
                        </div>
                        <div className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: colors.text }}>
                          {info.status === 'available' ? 'Live' : info.status === 'coming_soon' ? 'Soon' : 'Future'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 8 — Global Compliance Notice */}
          <div className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
            <div className="rounded-xl p-6 h-full" style={{ background: 'rgba(26,21,48,0.5)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{COMPLIANCE_NOTICE.title}</h2>
              </div>

              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-gray-300 leading-relaxed">{COMPLIANCE_NOTICE.message}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <ShieldCheck className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  Local regulations compliance
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Verified partnerships
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Future rollout schedules
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 — Accessibility Panel */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <Settings className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Accessibility Settings</h2>
                <p className="text-sm text-gray-400">Customize your experience</p>
              </div>
              <span className="ml-auto text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,242,254,0.15)', color: '#00F2FE' }}>Demo Only</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACCESSIBILITY_OPTIONS.map((option) => {
                const iconMapAccess: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                  'font-size': Type,
                  'high-contrast': Contrast,
                  'reduced-motion': Zap,
                  language: Languages,
                  theme: Sun,
                };
                const IconComponent = iconMapAccess[option.id] || Settings;

                return (
                  <div
                    key={option.id}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-5 h-5" style={{ color: '#D4AF37' }} />
                      <span className="font-medium text-white">{option.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAccessibilitySettings({ ...accessibilitySettings, [option.id]: opt })}
                          className="px-3 py-1.5 rounded-lg text-sm transition-all"
                          style={{
                            background: accessibilitySettings[option.id] === opt ? 'linear-gradient(135deg, #D4AF37, #B8941F)' : 'rgba(255,255,255,0.05)',
                            color: accessibilitySettings[option.id] === opt ? '#0B0819' : '#9ca3af',
                            border: accessibilitySettings[option.id] === opt ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Theme Preview */}
            <div className="mt-6 p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                {accessibilitySettings.theme === 'Light' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : accessibilitySettings.theme === 'Dark' ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Monitor className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-white">Current Theme: <span className="font-semibold" style={{ color: '#D4AF37' }}>{accessibilitySettings.theme}</span></span>
              </div>
              <span className="text-xs text-gray-500">Preview only • No actual changes</span>
            </div>
          </div>
        </section>

        {/* SECTION 10 — Global Footer Enhancement */}
        <section className="rounded-2xl border-2 p-1" style={{ borderColor: '#D4AF37', background: 'rgba(11,8,25,0.6)' }}>
          <div className="rounded-xl p-6" style={{ background: 'rgba(26,21,48,0.5)' }}>
            <div className="flex items-center gap-3 mb-5">
              <Globe className="w-5 h-5" style={{ color: '#D4AF37' }} />
              <h2 className="text-lg font-bold text-white">Global Settings Summary</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-sm text-gray-400 mb-1">Country</div>
                <div className="font-semibold text-white flex items-center justify-center gap-1">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-sm text-gray-400 mb-1">Language</div>
                <div className="font-semibold text-white">
                  {LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'}
                </div>
              </div>

              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-sm text-gray-400 mb-1">Currency</div>
                <div className="font-semibold text-white">{selectedCountry.currencySymbol}</div>
              </div>

              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-sm text-gray-400 mb-1">Region</div>
                <div className="font-semibold text-white">{selectedCountry.region}</div>
              </div>

              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-sm text-gray-400 mb-1">Version</div>
                <div className="font-semibold" style={{ color: '#D4AF37' }}>Phase 23</div>
              </div>

              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(11,8,25,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-sm text-gray-400 mb-1">Support Region</div>
                <div className="font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </div>
              </div>
            </div>

            {/* Additional Footer Info */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
                <span>VLOOP™ Global Identity Layer</span>
                <span>•</span>
                <span>Phase 23</span>
                <span>•</span>
                <span>{selectedCountry.name}</span>
                <span>•</span>
                <span>Mock Data Only</span>
                <span>•</span>
                <span>No Backend Integration</span>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                © 2026 VLOOP. All rights reserved. Global Human-Centered Commerce Platform.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation CTA */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#0B0819' }}
          >
            <ChevronRight className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Explore Marketplace
          </button>
        </div>

      </div>
    </div>
  );
}
