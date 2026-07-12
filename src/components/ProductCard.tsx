import { Star, ShoppingCart, Zap, Eye } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { useCart } from '../lib/cart';
import { calcPurchasePoints, PURCHASE_RULES } from '../lib/points';

type ProductCardProps = {
  product: Product;
  onViewDetails?: (productId: string) => void;
};

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();
  const points = calcPurchasePoints(product.price);

  return (
    <div className="card-premium overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onViewDetails?.(product.id)}>
        <img
          src={product.image_url || ''}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_vloop_own && (
            <span className="px-2 py-0.5 bg-vloop-600 text-white text-[10px] font-bold rounded-md">VLOOP</span>
          )}
          {product.is_partner && !product.is_vloop_own && (
            <span className="px-2 py-0.5 bg-gold-500 text-vloop-950 text-[10px] font-bold rounded-md">PARTNER</span>
          )}
          {product.is_featured && (
            <span className="px-2 py-0.5 bg-success-500 text-white text-[10px] font-bold rounded-md">FEATURED</span>
          )}
        </div>
        {/* Points badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur text-gold-600 text-[10px] font-bold rounded-md flex items-center gap-0.5">
          <Zap size={10} fill="currentColor" /> {points}pt
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-vloop-700 flex items-center gap-1">
            <Eye size={14} /> View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">{product.brand}</div>
        <h3
          className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug cursor-pointer hover:text-vloop-600 transition-colors"
          onClick={() => onViewDetails?.(product.id)}
        >
          {product.name}
        </h3>
        <div className="text-[10px] text-vloop-500 font-medium mb-1">{product.category}</div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-success-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.rating} <Star size={9} fill="white" />
          </div>
          <span className="text-xs text-gray-400">({product.review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(0)}</span>
          <span className="text-xs text-gray-400 line-through">₹{(product.price * 1.3).toFixed(0)}</span>
        </div>

        {/* Points earned */}
        <div className="text-[11px] text-gold-600 font-semibold mb-3 flex items-center gap-1">
          <Zap size={11} fill="currentColor" /> Buy ₹{product.price.toFixed(0)} = Earn {points} Points
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 py-2 bg-vloop-50 text-vloop-700 text-xs font-semibold rounded-lg hover:bg-vloop-100 transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingCart size={14} /> Add To Cart
          </button>
          <button
            onClick={() => onViewDetails?.(product.id)}
            className="flex-1 py-2 bg-gold-400 text-vloop-950 text-xs font-bold rounded-lg hover:bg-gold-500 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
