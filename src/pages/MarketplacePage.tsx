import { useState, useEffect } from 'react';
import { supabase, type Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { categories } from '../lib/data';
import * as Icons from 'lucide-react';
import {
  SlidersHorizontal, X, Flame, TrendingUp, Sparkles, Store,
  Search, MapPin, Star, Clock, Zap, Gift, Globe, ChevronRight,
  Heart, Shuffle, Eye, Bell, Award, ShoppingBag, Building2,
  Truck, Users, Package, Briefcase, Home, Leaf, Utensils,
  Smartphone, Shirt, Sofa, Dumbbell, Book, Car, Dog, Gamepad2,
  Gem, Scissors, Printer, Wrench, Trees, Hand, ShieldCheck,
  HeartHandshake, Megaphone, ArrowRight, ExternalLink, Layers
} from 'lucide-react';
import {
  getMockCategories,
  getMockSellerStores,
  getMockNotifications,
  formatPrice,
  BUSINESS_CATEGORIES,
  CATEGORY_LABELS,
} from '../lib/MarketplaceEngine';

type MarketplacePageProps = {
  searchQuery: string;
  onViewDetails: (productId: string) => void;
  onNavigate: (page: string) => void;
};

type TabId = 'all' | 'featured' | 'trending' | 'deals' | 'new' | 'nearby' | 'recommended';
type SectionId = 'home' | 'categories' | 'sellers' | 'deals' | 'future' | 'affiliate';

export default function MarketplacePage({ searchQuery, onViewDetails, onNavigate }: MarketplacePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [filter, setFilter] = useState<'all' | 'featured' | 'vloop' | 'partner'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating' | 'newest'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [showSearch, setShowSearch] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockCategories = getMockCategories();
  const mockSellers = getMockSellerStores();
  const mockNotifications = getMockNotifications();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  };

  let filtered = products;

  // Search by name, category, brand, store
  if (localSearchQuery) {
    const q = localSearchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        (p.is_partner && 'partner stores'.includes(q)) ||
        (p.is_vloop_own && 'vloop'.includes(q))
    );
  }

  // Category
  if (activeCategory !== 'All') {
    filtered = filtered.filter((p) => p.category === activeCategory || p.subcategory === activeCategory);
  }

  // Tab filter
  if (activeTab === 'featured') filtered = filtered.filter((p) => p.is_featured);
  if (activeTab === 'new') filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);
  if (activeTab === 'trending') filtered = [...filtered].sort((a, b) => b.review_count - a.review_count).slice(0, 20);

  // Filter type
  if (filter === 'featured') filtered = filtered.filter((p) => p.is_featured);
  if (filter === 'vloop') filtered = filtered.filter((p) => p.is_vloop_own);
  if (filter === 'partner') filtered = filtered.filter((p) => p.is_partner);

  // Sort
  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const allCategories = ['All', ...categories.map((c) => c.name), ...categories.flatMap((c) => c.subcategories)];
  const uniqueCategories = [...new Set(allCategories)];

  const tabs = [
    { key: 'all', label: 'All Products', icon: ShoppingBag },
    { key: 'featured', label: 'Featured', icon: Flame },
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'deals', label: "Today's Deals", icon: Gift },
    { key: 'new', label: 'New Arrivals', icon: Sparkles },
    { key: 'nearby', label: 'Nearby', icon: MapPin },
    { key: 'recommended', label: 'AI Picks', icon: Zap },
  ];

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    grocery: ShoppingBag,
    'fruits-vegetables': Leaf,
    dairy: Utensils,
    electronics: Smartphone,
    fashion: Shirt,
    'home-kitchen': Sofa,
    'sports-fitness': Dumbbell,
    'books-stationery': Book,
    automotive: Car,
    'pet-supplies': Dog,
    'toys-games': Gamepad2,
    jewellery: Gem,
    beauty: Scissors,
    'office-supplies': Printer,
    industrial: Wrench,
    garden: Trees,
    handmade: Hand,
    services: Briefcase,
    'care-club-products': HeartHandshake,
    'future-opportunities': Building2,
  };

  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] md:top-[105px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {[
              { key: 'home', label: 'Home', icon: Home },
              { key: 'categories', label: 'Categories', icon: Layers },
              { key: 'sellers', label: 'Sellers', icon: Store },
              { key: 'deals', label: 'Deals', icon: Gift },
              { key: 'future', label: 'Trading', icon: Globe },
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as SectionId)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSection === 'home' && (
        <MarketplaceHomeSection
          products={products}
          loading={loading}
          filtered={filtered}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filter={filter}
          setFilter={setFilter}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          uniqueCategories={uniqueCategories}
          localSearchQuery={localSearchQuery}
          setLocalSearchQuery={setLocalSearchQuery}
          onViewDetails={onViewDetails}
          onNavigate={onNavigate}
          mockSellers={mockSellers}
          mockCategories={mockCategories}
          categories={categories}
        />
      )}

      {activeSection === 'categories' && (
        <CategoriesSection
          mockCategories={mockCategories}
          categoryIcons={categoryIcons}
          onCategorySelect={((code: string) => {
            setActiveCategory(CATEGORY_LABELS[code as keyof typeof CATEGORY_LABELS] || 'All');
            setActiveSection('home');
            setActiveTab('all');
          })}
        />
      )}

      {activeSection === 'sellers' && (
        <SellersSection
          mockSellers={mockSellers}
          onNavigate={onNavigate}
        />
      )}

      {activeSection === 'deals' && (
        <DealsSection
          products={products}
          onViewDetails={onViewDetails}
          onNavigate={onNavigate}
        />
      )}

      {activeSection === 'future' && (
        <FutureTradingSection
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// ============================================================
// MARKETPLACE HOME SECTION
// ============================================================

function MarketplaceHomeSection({
  products,
  loading,
  filtered,
  activeTab,
  setActiveTab,
  tabs,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  filter,
  setFilter,
  activeCategory,
  setActiveCategory,
  uniqueCategories,
  localSearchQuery,
  setLocalSearchQuery,
  onViewDetails,
  onNavigate,
  mockSellers,
  mockCategories,
  categories,
}: any) {
  return (
    <div>
      {/* AI Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories, SmartCode..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                  <Sparkles className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <p className="text-blue-200 text-sm mt-3 text-center">
              AI-powered search • Product • Brand • Category • Seller • Location • SmartCode
            </p>
          </div>
        </div>
      </div>

      {/* Quick Category Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[108px] md:top-[153px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
            {uniqueCategories.slice(0, 12).map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* AI Recommendations Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium text-violet-200">AI Recommendations</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Personalized For You</h2>
              <p className="text-violet-200">Based on your browsing history and purchase patterns</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium">
              View All <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2 rounded-lg border border-gray-200"
            >
              <SlidersHorizontal size={18} />
            </button>
            <span className="text-sm text-gray-500">
              {filtered.length} products
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:border-blue-500 outline-none"
            >
              <option value="popular">Sort: Popularity</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50 md:bg-transparent md:static' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className={`${showFilters ? 'bg-white h-full p-4 md:h-auto md:rounded-2xl md:shadow-card' : ''} md:sticky md:top-48`}>
              <div className="flex items-center justify-between mb-4 md:hidden">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Product Type</h4>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: 'All Products' },
                    { key: 'featured', label: 'Featured Products' },
                    { key: 'vloop', label: 'VLOOP Own Products' },
                    { key: 'partner', label: 'Partner Products' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => { setFilter(f.key); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filter === f.key ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Categories</h4>
                <div className="space-y-1">
                  {categories.map((cat: any) => {
                    const Icon = (Icons as any)[cat.icon] || Icons.Package;
                    return (
                      <div key={cat.name}>
                        <button
                          onClick={() => { setActiveCategory(cat.name); setShowFilters(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                            activeCategory === cat.name ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={16} /> {cat.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Store partner CTA */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                <Store size={20} className="text-amber-600 mb-2" />
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Become a Partner</h4>
                <p className="text-xs text-gray-500 mb-3">Register your store on VLOOP</p>
                <button
                  onClick={() => onNavigate('partner')}
                  className="w-full py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Register Your Store
                </button>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filtered.map((product: Product) => (
                  <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Recently Viewed
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">Clear All</button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {products.slice(0, 8).map((p: Product) => (
              <button
                key={p.id}
                onClick={() => onViewDetails(p.id)}
                className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-100">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Future Opportunities Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-medium text-emerald-200">Future Opportunities</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Build Your Future</h2>
              <p className="text-emerald-200">Housing, Vehicles, Gold, Healthcare, and more</p>
            </div>
            <button
              onClick={() => onNavigate('future-opportunities')}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Explore <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CATEGORIES SECTION (31 Categories)
// ============================================================

function CategoriesSection({
  mockCategories,
  categoryIcons,
  onCategorySelect,
}: {
  mockCategories: any[];
  categoryIcons: Record<string, React.FC<{ className?: string }>>;
  onCategorySelect: (code: string) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">31 Business Categories</h1>
        <p className="text-gray-600">Explore products across all categories</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {mockCategories.map((cat) => {
          const Icon = categoryIcons[cat.category_code] || ShoppingBag;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.category_code)}
              className="group relative bg-white rounded-2xl p-4 shadow-card hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                cat.display_order % 4 === 0 ? 'from-blue-500 to-blue-600' :
                cat.display_order % 4 === 1 ? 'from-emerald-500 to-emerald-600' :
                cat.display_order % 4 === 2 ? 'from-amber-500 to-amber-600' :
                'from-violet-500 to-violet-600'
              } flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 text-center line-clamp-2">{cat.category_name}</h3>
              <p className="text-[10px] text-gray-400 text-center mt-1">{cat.product_count} products</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SELLERS SECTION
// ============================================================

function SellersSection({
  mockSellers,
  onNavigate,
}: {
  mockSellers: any[];
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verified Sellers</h1>
        <p className="text-gray-600">Shop from trusted sellers in your community</p>
      </div>

      {/* Seller Types */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { label: 'Home Sellers', icon: Home, color: 'bg-blue-100 text-blue-600' },
          { label: 'Women Entrepreneurs', icon: Users, color: 'bg-pink-100 text-pink-600' },
          { label: 'Village Stores', icon: Trees, color: 'bg-green-100 text-green-600' },
          { label: 'Micro Warehouses', icon: Package, color: 'bg-amber-100 text-amber-600' },
        ].map((type) => (
          <button
            key={type.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${type.color} text-sm font-medium`}
          >
            <type.icon className="w-4 h-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Seller Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSellers.map((seller) => (
          <div
            key={seller.id}
            className="group bg-white rounded-2xl shadow-card hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Banner */}
            <div className="h-32 relative">
              {seller.store_banner_url ? (
                <img src={seller.store_banner_url} alt={seller.store_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600" />
              )}
              <div className="absolute bottom-0 left-4 translate-y-1/2">
                {seller.store_logo_url ? (
                  <img src={seller.store_logo_url} alt="" className="w-16 h-16 rounded-xl border-4 border-white object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl border-4 border-white bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              {seller.is_verified && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pt-10 pb-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{seller.store_name}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{seller.rating_avg.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{seller.store_description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {seller.store_city}, {seller.store_state}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {seller.total_products} products
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {seller.is_women_entrepreneur && (
                  <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-600 text-xs">Women Entrepreneur</span>
                )}
                {seller.is_home_seller && (
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs">Home Seller</span>
                )}
                {seller.is_village_store && (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs">Village Store</span>
                )}
              </div>

              <button
                onClick={() => onNavigate('partner')}
                className="w-full py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Visit Store
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DEALS SECTION
// ============================================================

function DealsSection({
  products,
  onViewDetails,
  onNavigate,
}: {
  products: Product[];
  onViewDetails: (id: string) => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 mb-4">
          <Gift className="w-4 h-4" />
          Limited Time
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Smart Deals</h1>
        <p className="text-gray-600">Exclusive offers with extra SmartPoints rewards</p>
      </div>

      {/* Flash Sale Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Flash Sale</h2>
            <p className="text-red-200">Up to 50% off + Double SmartPoints</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-200">Ends in</p>
            <p className="text-2xl font-bold">05:32:18</p>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} onViewDetails={onViewDetails} />
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
              -{Math.floor(Math.random() * 30 + 10)}%
            </div>
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
              2x SP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FUTURE TRADING SECTION
// ============================================================

function FutureTradingSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  const tradingTypes = [
    { title: 'Private Label', desc: 'Launch your own brand', icon: Award, color: 'from-blue-500 to-blue-600' },
    { title: 'Import', desc: 'Global product sourcing', icon: Globe, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Export', desc: 'Sell to global markets', icon: ExternalLink, color: 'from-amber-500 to-amber-600' },
    { title: 'Wholesale', desc: 'Bulk trade marketplace', icon: Package, color: 'from-violet-500 to-violet-600' },
    { title: 'B2B', desc: 'Business-to-business', icon: Briefcase, color: 'from-pink-500 to-pink-600' },
    { title: 'Global Sourcing', desc: 'Find suppliers worldwide', icon: Globe, color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 mb-4">
          <Globe className="w-4 h-4" />
          Future Ready
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Future Trading</h1>
        <p className="text-gray-600">B2B, Wholesale, Import/Export, and Private Label opportunities</p>
      </div>

      {/* Trading Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {tradingTypes.map((type) => (
          <div
            key={type.title}
            className="group relative bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <type.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{type.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{type.desc}</p>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
              Coming Soon
            </span>
          </div>
        ))}
      </div>

      {/* Affiliate Commerce */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-5 h-5" />
              <span className="text-sm font-medium text-blue-200">Affiliate Commerce</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Shop from Global Partners</h2>
            <p className="text-blue-200">Amazon, Flipkart, and more — earn SmartPoints on every purchase</p>
          </div>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              A
            </div>
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              F
            </div>
          </div>
        </div>
      </div>

      {/* Commission Tracking */}
      <div className="mt-6 p-6 rounded-xl bg-slate-100">
        <h3 className="font-bold text-gray-900 mb-4">Commission Tracking (Coming Soon)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Click Tracking', icon: Eye },
            { label: 'Purchase Tracking', icon: ShoppingBag },
            { label: 'Commission Earned', icon: Gift },
            { label: 'SmartPoint Rewards', icon: Zap },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <item.icon className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
