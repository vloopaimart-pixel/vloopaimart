import {
  ShoppingBag, Heart, Zap, Star, ShoppingCart, ArrowLeft, ChevronRight,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import { mockProducts, formatINR, calcSmartPoints } from '../lib/commerceMockData';

type Props = { onNavigate: (page: string) => void };

export default function CommerceShopPage({ onNavigate }: Props) {
  const { addToCart, toggleWishlist, wishlist, cartCount } = useCommerce();

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('home')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">VLOOP Commerce</h1>
              <p className="text-sm text-gray-500">Phase 13 — Shopping Flow Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('commerce-wishlist')}
              className="relative p-2.5 rounded-lg bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <Heart size={20} className="text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('commerce-cart')}
              className="relative p-2.5 rounded-lg bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <ShoppingBag size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Flow steps */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max text-xs">
            {['Shop', 'Cart', 'Wishlist', 'Checkout', 'Payment', 'Confirmation', 'Tracking', 'Invoice'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-vloop-50 text-vloop-700 font-semibold whitespace-nowrap">
                  {i + 1}. {step}
                </span>
                {i < 7 && <ChevronRight size={14} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockProducts.map((product) => {
            const inWishlist = wishlist.find((p) => p.id === product.id);
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col hover:shadow-card-hover transition-shadow group">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-colors ${inWishlist ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                  </button>
                  {product.comboEligible && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-success-500 text-white text-[10px] font-bold rounded-md">COMBO</span>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="text-[10px] text-vloop-500 font-semibold uppercase tracking-wide">{product.merchant}</div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5 bg-success-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.rating} <Star size={9} fill="white" />
                    </div>
                    <span className="text-[10px] text-gray-400">{product.category}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-lg font-bold text-gray-900">{formatINR(product.unitPrice)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatINR(product.mrp)}</span>
                  </div>
                  <div className="text-[11px] text-gold-600 font-semibold mb-3 flex items-center gap-1">
                    <Zap size={11} fill="currentColor" /> +{calcSmartPoints(product.unitPrice)} pts
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full py-2 bg-vloop-600 text-white text-xs font-semibold rounded-lg hover:bg-vloop-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart size={14} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
