import { useState } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown, Zap, Wallet, Rocket, Shield, Heart, Settings, User, HelpCircle, FileText, Building2, QrCode, Camera, Award, BarChart3, Globe, Briefcase, Store, CreditCard, Package } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';

type HeaderProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
};

export default function Header({ onNavigate, currentPage, searchQuery, setSearchQuery, onOpenAuth }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const { count, setCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    { label: 'Home', page: 'home' },
    {
      label: 'Marketplace',
      page: 'marketplace',
      dropdown: [
        { label: 'All Products', page: 'marketplace', icon: ShoppingBag },
        { label: 'Catalog', page: 'catalog', icon: FileText },
        { label: 'My Cart', page: 'cart', icon: ShoppingBag },
        { label: 'My Orders', page: 'orders', icon: Package },
      ]
    },
    {
      label: 'SmartCode',
      page: 'smartcode',
      dropdown: [
        { label: 'SmartCode Engine', page: 'smartcode-engine', icon: Zap },
        { label: 'SmartCode Dashboard', page: 'smartcode-dashboard', icon: QrCode },
        { label: 'Enter SmartCode', page: 'smartcode', icon: Zap },
        { label: 'My SmartCodes', page: 'my-smartcodes', icon: Award },
        { label: 'Offline/OCR Entry', page: 'offline-smartcode', icon: Camera },
        { label: 'SmartCode Info', page: 'smartcode-info', icon: HelpCircle },
      ]
    },
    {
      label: 'Wallet',
      page: 'smart-wallet',
      dropdown: [
        { label: 'Wallet Ecosystem', page: 'wallet-ecosystem', icon: Wallet },
        { label: 'Universal Wallet', page: 'universal-wallet', icon: Wallet },
        { label: 'Identity & Trust', page: 'identity-trust', icon: Shield },
        { label: 'Payment Hub', page: 'payment-finance', icon: CreditCard },
        { label: 'Smart Wallet', page: 'smart-wallet', icon: Wallet },
        { label: 'Wallet System', page: 'wallet-system', icon: Wallet },
        { label: 'FOE Wallet', page: 'foe-wallet', icon: Building2 },
        { label: 'Points History', page: 'dashboard', icon: Zap },
        { label: 'Trust Score', page: 'trust-score', icon: Shield },
      ]
    },
    { label: 'Care Club', page: 'careclub' },
    { label: 'Insurance', page: 'insurance' },
    {
      label: 'Future',
      page: 'future-opportunities',
      dropdown: [
        { label: 'Future Opportunities', page: 'future-opportunities', icon: Rocket },
        { label: 'FOE Wallet', page: 'foe-wallet', icon: Wallet },
        { label: 'Projects', page: 'future-projects', icon: Building2 },
        { label: 'Trust Score', page: 'trust-score', icon: Shield },
      ]
    },
    {
      label: 'Global',
      page: 'global-opportunities',
      dropdown: [
        { label: 'Job Exchange', page: 'global-opportunities', icon: Briefcase },
        { label: 'Global Identity', page: 'global-identity', icon: Globe },
        { label: 'Skill Verification', page: 'global-opportunities', icon: Award },
        { label: 'Language Learning', page: 'global-opportunities', icon: Globe },
      ]
    },
    { label: 'Merchant', page: 'merchant-portal' },
    { label: 'Partner Network', page: 'partner-ecosystem' },
    { label: 'AI Assistant', page: 'ai-super-platform' },
    { label: 'Control Center', page: 'vcos-control-center' },
    { label: 'Global Ecosystem', page: 'global-ecosystem' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display">V</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-vloop-900 font-display text-lg leading-none">VLOOP</div>
              <div className="text-[10px] text-gold-600 font-semibold tracking-wider">AI MART</div>
            </div>
          </button>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:border-vloop-400 focus:bg-white transition-colors"
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('marketplace'); }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag size={22} className="text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Auth */}
            {profile ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vloop-50 hover:bg-vloop-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center text-white text-xs font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-vloop-700 max-w-[100px] truncate">{profile.name}</span>
                </button>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-4 py-1.5 text-sm font-semibold text-vloop-700 hover:text-vloop-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-vloop-600 rounded-lg hover:bg-vloop-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 h-11 border-t border-gray-50">
          {navItems.map((item) => (
            <div
              key={item.page}
              className="relative"
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.page)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => !item.dropdown && onNavigate(item.page)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  currentPage === item.page || (item.dropdown && item.dropdown.some(d => d.page === currentPage))
                    ? 'text-vloop-700 bg-vloop-50 font-semibold'
                    : 'text-gray-600 hover:text-vloop-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
                {item.dropdown && <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.page ? 'rotate-180' : ''}`} />}
              </button>

              {item.dropdown && activeDropdown === item.page && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {item.dropdown.map((subItem) => {
                    const Icon = subItem.icon;
                    return (
                      <button
                        key={subItem.page}
                        onClick={() => {
                          onNavigate(subItem.page);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          currentPage === subItem.page
                            ? 'text-vloop-700 bg-vloop-50 font-semibold'
                            : 'text-gray-600 hover:text-vloop-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} />
                        {subItem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {profile && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'dashboard'
                  ? 'text-vloop-700 bg-vloop-50 font-semibold'
                  : 'text-gray-600 hover:text-vloop-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
          )}
          {profile && (
            <button
              onClick={() => onNavigate('admin-control-center')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'admin-control-center' || currentPage === 'admin-smartcode' || currentPage === 'admin'
                  ? 'text-vloop-700 bg-vloop-50 font-semibold'
                  : 'text-gray-600 hover:text-vloop-700 hover:bg-gray-50'
              }`}
            >
              <Settings size={14} />
              Admin
            </button>
          )}
          {profile && (
            <button
              onClick={() => onNavigate('enterprise-admin')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'enterprise-admin'
                  ? 'text-vloop-700 bg-vloop-50 font-semibold'
                  : 'text-gray-600 hover:text-vloop-700 hover:bg-gray-50'
              }`}
            >
              <Shield size={14} />
              Enterprise
            </button>
          )}
          {profile && (
            <button
              onClick={() => onNavigate('merchant-portal')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentPage === 'merchant-portal'
                  ? 'text-vloop-700 bg-vloop-50 font-semibold'
                  : 'text-gray-600 hover:text-vloop-700 hover:bg-gray-50'
              }`}
            >
              <Store size={14} />
              Merchant
            </button>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {/* Mobile search */}
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:border-vloop-400"
                onKeyDown={(e) => { if (e.key === 'Enter') { onNavigate('marketplace'); setMobileMenuOpen(false); } }}
              />
            </div>

            {/* Mobile nav items */}
            {navItems.map((item) => (
              <div key={item.page}>
                <button
                  onClick={() => item.dropdown ? null : handleNav(item.page)}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === item.page
                      ? 'text-vloop-700 bg-vloop-50 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
                {item.dropdown && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.dropdown.map((subItem) => {
                      const Icon = subItem.icon;
                      return (
                        <button
                          key={subItem.page}
                          onClick={() => handleNav(subItem.page)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === subItem.page
                              ? 'text-vloop-700 bg-vloop-50 font-semibold'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={16} />
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Additional mobile links */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <button onClick={() => handleNav('about')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                About Us
              </button>
              <button onClick={() => handleNav('contact')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                Contact
              </button>
              <button onClick={() => handleNav('faq')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                FAQ
              </button>
              <button onClick={() => handleNav('partner-info')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                Partner Info
              </button>
              <button onClick={() => handleNav('merchant-portal')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <Store size={16} />
                Merchant Portal
              </button>
            </div>

            {profile && (
              <>
                <div className="pt-2 border-t border-gray-100">
                  <button onClick={() => handleNav('dashboard')} className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'dashboard'
                      ? 'text-vloop-700 bg-vloop-50 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                    Dashboard
                  </button>
                  <button onClick={() => handleNav('admin-control-center')} className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'admin-control-center'
                      ? 'text-vloop-700 bg-vloop-50 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                    Admin Center
                  </button>
                  <button onClick={() => handleNav('enterprise-admin')} className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'enterprise-admin'
                      ? 'text-vloop-700 bg-vloop-50 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                    Enterprise Admin
                  </button>
                </div>
              </>
            )}

            {/* Mobile auth */}
            <div className="pt-3 border-t border-gray-100">
              {profile ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-vloop-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center text-white text-xs font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-vloop-700 truncate">{profile.name}</span>
                  </button>
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="px-3 py-2.5 text-sm text-gray-500 font-medium rounded-lg hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 text-sm font-semibold text-vloop-700 border border-vloop-200 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-vloop-600 rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
