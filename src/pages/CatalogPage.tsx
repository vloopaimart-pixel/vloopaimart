import { ShoppingCart, Droplets, Home, HeartPulse, ShieldCheck, Handshake, ArrowRight, Package } from 'lucide-react';
import { catalogCategories } from '../lib/data';
import { useState, useEffect } from 'react';
import { supabase, type Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

type CatalogPageProps = {
  onNavigate: (page: string) => void;
  onViewDetails: (productId: string) => void;
};

const iconMap: Record<string, any> = {
  ShoppingCart, Droplets, Home, HeartPulse, ShieldCheck, Handshake,
};

export default function CatalogPage({ onNavigate, onViewDetails }: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const categoryToFilter: Record<string, (p: Product) => boolean> = {
    Groceries: (p) => p.category === 'Daily Needs' && p.subcategory === 'Grocery',
    Water: (p) => p.subcategory === 'Water',
    Household: (p) => p.category === 'Home Essentials',
    Health: (p) => p.subcategory === 'Health',
    'Insurance Services': () => false,
    'Partner Products': (p) => p.is_partner,
  };

  const filtered = activeCategory && categoryToFilter[activeCategory]
    ? products.filter(categoryToFilter[activeCategory])
    : products;

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-700 to-vloop-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold font-display mb-2">Product Catalog</h1>
          <p className="text-vloop-200 text-sm md:text-base">Browse all categories — shop and earn points on every purchase</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-10">
          {catalogCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Package;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  if (cat.name === 'Insurance Services') {
                    onNavigate('insurance');
                    return;
                  }
                  setActiveCategory(isActive ? null : cat.name);
                }}
                className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all group ${
                  isActive ? 'ring-2 ring-vloop-600 shadow-card-hover' : 'shadow-card hover:shadow-card-hover'
                } bg-white`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-vloop-600 bg-vloop-50 px-2 py-0.5 rounded-full">{cat.count}</span>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-vloop-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active filter banner */}
        {activeCategory && (
          <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-vloop-50 border border-vloop-100">
            <span className="text-sm font-medium text-vloop-700">
              Showing: {activeCategory} ({filtered.length} products)
            </span>
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm text-vloop-600 hover:text-vloop-800 font-semibold"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Products grid */}
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
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No products in this category yet</h3>
            <p className="text-gray-400 text-sm">Check back soon or browse all products</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
