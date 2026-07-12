import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Zap, ArrowLeft, Check, Truck, Shield, RotateCcw, Package, MessageSquare, Loader2, Send } from 'lucide-react';
import { supabase, type Product, type ProductReview } from '../lib/supabase';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import ProductCard from '../components/ProductCard';
import { calcPurchasePoints } from '../lib/points';

type ProductDetailsPageProps = {
  productId: string;
  onNavigate: (page: string) => void;
  onViewDetails: (productId: string) => void;
};

export default function ProductDetailsPage({ productId, onNavigate, onViewDetails }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setCartOpen } = useCart();
  const { profile } = useAuth();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('id', productId).single();
    if (data) {
      setProduct(data as Product);
      const { data: rel } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', productId)
        .limit(4);
      if (rel) setRelated(rel as Product[]);
      const { data: rev } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (rev) setReviews(rev as ProductReview[]);
    }
    setLoading(false);
  };

  const submitReview = async () => {
    setReviewError(null);
    if (!profile) { setReviewError('Please sign in to leave a review'); return; }
    if (!reviewText.trim()) { setReviewError('Please write your review'); return; }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.from('product_reviews').insert({
        product_id: productId,
        user_id: profile.id,
        rating: reviewRating,
        title: reviewTitle || null,
        review_text: reviewText,
      }).select('*').single();
      if (error) throw error;
      if (data) setReviews([data as ProductReview, ...reviews]);
      setReviewText('');
      setReviewTitle('');
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Product not found</h2>
        <button onClick={() => onNavigate('marketplace')} className="btn-primary">Back to Marketplace</button>
      </div>
    );
  }

  const points = calcPurchasePoints(product.price);
  const totalPoints = points * quantity;
  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setCartOpen(true);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-vloop-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>

        {/* Product main */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="relative aspect-square bg-gray-50">
              <img src={product.image_url || ''} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.is_vloop_own && <span className="px-2 py-1 bg-vloop-600 text-white text-xs font-bold rounded-md">VLOOP</span>}
                {product.is_partner && !product.is_vloop_own && <span className="px-2 py-1 bg-gold-500 text-vloop-950 text-xs font-bold rounded-md">PARTNER</span>}
                {product.is_featured && <span className="px-2 py-1 bg-success-500 text-white text-xs font-bold rounded-md">FEATURED</span>}
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="text-xs text-vloop-500 font-semibold uppercase tracking-wide mb-1">{product.brand}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5 bg-success-600 text-white text-sm font-bold px-2 py-1 rounded">
                {product.rating} <Star size={12} fill="white" />
              </div>
              <span className="text-sm text-gray-500">{product.review_count} reviews</span>
              <span className="text-sm text-gray-300">|</span>
              <span className="text-sm text-success-600 font-medium">In Stock</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(0)}</span>
              <span className="text-lg text-gray-400 line-through">₹{(product.price * 1.3).toFixed(0)}</span>
              <span className="text-sm text-success-600 font-semibold">{Math.round((1 - product.price / (product.price * 1.3)) * 100)}% off</span>
            </div>

            {/* Points earned */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-50 border border-gold-200 mb-6">
              <Zap size={18} className="text-gold-600" fill="currentColor" />
              <span className="text-sm font-bold text-gold-700">Buy this product and earn {points} points</span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="text-gray-500">Category:</span>
              <span className="px-3 py-1 rounded-full bg-vloop-50 text-vloop-700 font-medium text-xs">{product.category}</span>
              {product.subcategory && <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium text-xs">{product.subcategory}</span>}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description || 'High quality product from VLOOP AI MART. Shop and earn points on every purchase.'}</p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">VLOOP Benefits</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-success-500" /> Earn {points} points
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-success-500" /> Wallet 1 benefits
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-success-500" /> Care Club eligible
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-success-500" /> Reward tier benefits
                </div>
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-600 font-bold">-</button>
                <span className="px-4 py-2.5 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-600 font-bold">+</button>
              </div>
              <div className="text-sm text-gray-500">
                Total: <span className="font-bold text-gray-900">₹{totalPrice.toFixed(0)}</span> • <span className="font-bold text-gold-600">{totalPoints} pts</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 py-3 bg-vloop-50 text-vloop-700 font-semibold rounded-xl hover:bg-vloop-100 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> Add To Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 py-3 bg-gold-400 text-vloop-950 font-bold rounded-xl hover:bg-gold-500 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white shadow-card">
                <Truck size={20} className="text-vloop-600 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white shadow-card">
                <Shield size={20} className="text-vloop-600 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white shadow-card">
                <RotateCcw size={20} className="text-vloop-600 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 font-display mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-vloop-600" /> Customer Reviews ({reviews.length})
          </h2>

          {/* Write review */}
          <div className="card-premium p-5 mb-6">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Write a Review</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-500">Your rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewRating(star)}>
                    <Star size={20} className={star <= reviewRating ? 'text-gold-500' : 'text-gray-300'} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm mb-2"
              placeholder="Review title (optional)"
            />
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm resize-none mb-2"
              placeholder="Share your experience with this product..."
            />
            {reviewError && <p className="text-xs text-red-500 mb-2">{reviewError}</p>}
            <button
              onClick={submitReview}
              disabled={submitting}
              className="px-4 py-2 bg-vloop-600 text-white text-sm font-semibold rounded-lg hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit Review
            </button>
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="card-premium p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center text-white text-xs font-bold">
                        {(rev.user_id || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        {rev.title && <div className="font-semibold text-sm text-gray-900">{rev.title}</div>}
                        <div className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= rev.rating ? 'text-gold-500' : 'text-gray-300'} fill={s <= rev.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  {rev.review_text && <p className="text-sm text-gray-600 leading-relaxed">{rev.review_text}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-display mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onViewDetails={onViewDetails} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
