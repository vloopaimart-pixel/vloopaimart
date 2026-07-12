import { useState } from 'react';
import {
  Trash2, ShoppingBag, ArrowLeft, Heart, Bookmark, Truck,
  Tag, Zap, ShieldCheck, ChevronRight, Package,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import { mockProducts, formatINR, calcSmartPoints } from '../lib/commerceMockData';
import QuantitySelector from '../components/QuantitySelector';

type Props = { onNavigate: (page: string) => void };

export default function CommerceCartPage({ onNavigate }: Props) {
  const {
    cart, savedForLater, updateCartQty, removeFromCart, saveForLater, moveToCart, removeSaved,
    cartSubtotal, cartCount,
  } = useCommerce();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? Math.floor(cartSubtotal * 0.05) : 0;
  const deliveryFee = cartSubtotal > 999 ? 0 : 49;
  const total = cartSubtotal - discount + deliveryFee;
  const smartPoints = calcSmartPoints(total);

  const comboItems = cart.filter((i) => i.product.comboEligible);
  const comboSavings = comboItems.length >= 2 ? Math.floor(comboItems.reduce((s, i) => s + i.product.unitPrice * i.quantity, 0) * 0.08) : 0;

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in bg-gray-50">
        <div className="w-24 h-24 rounded-full bg-vloop-50 flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-vloop-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse the marketplace to add products and start earning SmartPoints.</p>
        <button onClick={() => onNavigate('commerce-shop')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('commerce-shop')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Shopping Cart</h1>
          {cartCount > 0 && <span className="text-sm text-gray-500">({cartCount} items)</span>}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: cart + saved */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart items */}
            {cart.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">Cart Items</h2>
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4 hover:shadow-card-hover transition-shadow">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-100 shrink-0 cursor-pointer"
                      onClick={() => onNavigate('commerce-shop')}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-vloop-500 font-semibold uppercase tracking-wide">{item.product.merchant}</div>
                      <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-1">{item.product.name}</h3>
                      <div className="text-xs text-gray-400 mb-2">{item.product.category}</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Zap size={12} className="text-gold-500" fill="currentColor" />
                        <span className="text-xs text-gold-600 font-semibold">Earn {calcSmartPoints(item.product.unitPrice * item.quantity)} SmartPoints</span>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() => updateCartQty(item.product.id, item.quantity - 1)}
                          onIncrease={() => updateCartQty(item.product.id, item.quantity + 1)}
                        />
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatINR(item.product.unitPrice * item.quantity)}</div>
                            <div className="text-xs text-gray-400">{formatINR(item.product.unitPrice)} each</div>
                          </div>
                          <button onClick={() => saveForLater(item.product.id)} title="Save for later" className="p-2 text-gray-400 hover:text-vloop-600 hover:bg-vloop-50 rounded-lg transition-colors">
                            <Bookmark size={18} />
                          </button>
                          <button onClick={() => removeFromCart(item.product.id)} title="Remove" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Combo savings banner */}
            {comboSavings > 0 && (
              <div className="bg-gradient-to-r from-success-50 to-vloop-50 border border-success-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                  <Tag size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-success-700 text-sm">Combo Savings Applied!</div>
                  <div className="text-xs text-gray-600">You saved {formatINR(comboSavings)} by buying combo-eligible items together.</div>
                </div>
              </div>
            )}

            {/* Saved for later */}
            {savedForLater.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1 flex items-center gap-1.5">
                  <Bookmark size={14} /> Saved for Later ({savedForLater.length})
                </h2>
                {savedForLater.map((item) => (
                  <div key={item.product.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-vloop-500 font-semibold uppercase">{item.product.merchant}</div>
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{item.product.name}</h3>
                      <div className="text-sm font-bold text-gray-900 mt-0.5">{formatINR(item.product.unitPrice)}</div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <button onClick={() => moveToCart(item.product.id)} className="px-3 py-1.5 bg-vloop-50 text-vloop-700 text-xs font-semibold rounded-lg hover:bg-vloop-100 transition-colors whitespace-nowrap">
                        Move to Cart
                      </button>
                      <button onClick={() => removeSaved(item.product.id)} className="px-3 py-1.5 text-gray-400 hover:text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist quick link */}
            <button
              onClick={() => onNavigate('commerce-wishlist')}
              className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Heart size={18} className="text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 text-sm">View Wishlist</div>
                <div className="text-xs text-gray-500">Save items you love for later</div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card-hover p-5 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={18} className="text-vloop-600" /> Order Summary
              </h3>

              {/* Coupon */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-vloop-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setCouponApplied(true)}
                    className="px-4 py-2 bg-vloop-50 text-vloop-700 text-sm font-semibold rounded-lg hover:bg-vloop-100"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && <p className="text-xs text-success-600 mt-1">5% coupon applied!</p>}
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-gray-900">{formatINR(cartSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coupon Discount</span>
                    <span className="font-medium text-success-600">-{formatINR(discount)}</span>
                  </div>
                )}
                {comboSavings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Combo Savings</span>
                    <span className="font-medium text-success-600">-{formatINR(comboSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium text-success-600">{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
                </div>
                {deliveryFee === 0 && cartSubtotal > 0 && (
                  <div className="text-xs text-success-600 flex items-center gap-1">
                    <Truck size={12} /> Free delivery on orders above ₹999
                  </div>
                )}
                <div className="p-3 rounded-lg bg-gold-50 border border-gold-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gold-700 font-medium flex items-center gap-1">
                      <Zap size={14} fill="currentColor" /> SmartPoints
                    </span>
                    <span className="font-bold text-gold-600">+{smartPoints} pts</span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900 font-display">{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('commerce-checkout')}
                disabled={cart.length === 0}
                className="w-full mt-4 py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ChevronRight size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Secure</span>
                <span className="flex items-center gap-1"><Truck size={12} /> Fast Delivery</span>
                <span className="flex items-center gap-1"><Zap size={12} /> Earn Points</span>
              </div>

              <div className="mt-4 text-center">
                <button onClick={() => onNavigate('commerce-shop')} className="text-sm text-vloop-600 font-medium hover:underline">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
