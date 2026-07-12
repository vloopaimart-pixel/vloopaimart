import {
  Heart, ArrowLeft, ShoppingCart, Trash2, Zap, Package, PackageX, Clock, ChevronRight,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import { formatINR, calcSmartPoints } from '../lib/commerceMockData';

type Props = { onNavigate: (page: string) => void };

export default function CommerceWishlistPage({ onNavigate }: Props) {
  const { wishlist, moveWishlistToCart, removeFromWishlist, addToCart } = useCommerce();

  const stockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50', icon: PackageX };
    if (stock < 10) return { label: `Only ${stock} left`, color: 'text-warning-600', bg: 'bg-warning-50', icon: Clock };
    return { label: 'In Stock', color: 'text-success-600', bg: 'bg-success-50', icon: Package };
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in bg-gray-50">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Heart size={40} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Tap the heart icon on products to save them here.</p>
        <button onClick={() => onNavigate('commerce-shop')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('commerce-cart')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">My Wishlist</h1>
          <span className="text-sm text-gray-500">({wishlist.length} items)</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product) => {
            const stock = stockStatus(product.stock);
            const StockIcon = stock.icon;
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col hover:shadow-card-hover transition-shadow">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                  <div className={`absolute top-2 left-2 px-2 py-0.5 ${stock.bg} ${stock.color} text-[10px] font-bold rounded-md flex items-center gap-1`}>
                    <StockIcon size={10} /> {stock.label}
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="text-[10px] text-vloop-500 font-semibold uppercase tracking-wide">{product.merchant}</div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
                  <div className="text-[10px] text-gray-400 mb-2">{product.category}</div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-lg font-bold text-gray-900">{formatINR(product.unitPrice)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatINR(product.mrp)}</span>
                  </div>
                  <div className="text-[11px] text-gold-600 font-semibold mb-3 flex items-center gap-1">
                    <Zap size={11} fill="currentColor" /> Earn {calcSmartPoints(product.unitPrice)} SmartPoints
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => moveWishlistToCart(product.id)}
                      disabled={product.stock === 0}
                      className="flex-1 py-2 bg-vloop-600 text-white text-xs font-semibold rounded-lg hover:bg-vloop-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={14} /> Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="px-3 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={() => onNavigate('commerce-cart')} className="btn-outline">
            <ArrowLeft size={18} /> Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
