import { useState } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, Zap, CheckCircle2, Tag, Clock } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { calcPurchasePoints, calcWallet2FromPurchase, calcWallet2ActivationDate, PURCHASE_RULES } from '../lib/points';

type CartPageProps = {
  onNavigate: (page: string) => void;
};

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, total, clearCart, count } = useCart();
  const { profile, refreshProfile } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const pointsEarned = calcPurchasePoints(total);
  // NEW: Wallet 2 gets 2% of purchase
  const wallet2Credit = calcWallet2FromPurchase(total);
  const activationDate = calcWallet2ActivationDate();
  const discount = promoApplied ? Math.floor(total * 0.05) : 0;
  const finalTotal = total - discount;

  const handleCheckout = async () => {
    if (!profile) {
      onNavigate('home');
      return;
    }
    setCheckingOut(true);
    try {
      for (const item of items) {
        const points = calcPurchasePoints(item.product.price * item.quantity);
        await supabase.from('orders').insert({
          user_id: profile.id,
          product_id: item.product.id,
          quantity: item.quantity,
          total_amount: item.product.price * item.quantity,
          points_earned: points,
          status: 'confirmed',
        });
        await supabase.from('point_history').insert({
          user_id: profile.id,
          activity: `Purchase: ${item.product.name}`,
          amount: item.product.price * item.quantity,
          points_earned: points,
          status: 'completed',
        });
      }
      // NEW: Only Wallet 2 credited (2%), Wallet 1 gets nothing until winning
      await supabase.from('profiles').update({
        points: profile.points + pointsEarned,
        wallet2_balance: profile.wallet2_balance + wallet2Credit,
        wallet2_activation_date: activationDate,
      }).eq('id', profile.id);
      await refreshProfile();
      clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        onNavigate('dashboard');
      }, 2500);
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setCheckingOut(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center mb-6 animate-pulse-gold">
          <CheckCircle2 size={48} className="text-success-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-1">You earned <span className="font-bold text-gold-600">{pointsEarned} points</span></p>
        <p className="text-gray-500 mb-2">Wallet 2 credit: <span className="font-bold text-vloop-600">+₹{wallet2Credit}</span></p>
        <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mb-4">
          <Clock size={12} /> Available in 30 days
        </div>
        <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-6">Add products to start earning points</p>
        <button onClick={() => onNavigate('marketplace')} className="btn-primary">
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
          <button onClick={() => onNavigate('marketplace')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Shopping Cart ({count} items)</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4">
                <img
                  src={item.product.image_url || ''}
                  alt={item.product.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-100 shrink-0 cursor-pointer"
                  onClick={() => onNavigate('product-' + item.product.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-400 font-medium uppercase">{item.product.brand}</div>
                  <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-1">{item.product.name}</h3>
                  <div className="text-xs text-vloop-500 mb-2">{item.product.category}</div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap size={12} className="text-gold-500" fill="currentColor" />
                    <span className="text-xs text-gold-600 font-semibold">Earn {calcPurchasePoints(item.product.price * item.quantity)} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 font-bold">-</button>
                      <span className="px-3 py-1.5 font-semibold text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 font-bold">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toFixed(0)}</div>
                        <div className="text-xs text-gray-400">₹{item.product.price.toFixed(0)} each</div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 font-medium flex items-center gap-1">
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card-hover p-5 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              {/* Promo code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-vloop-500 outline-none"
                    />
                  </div>
                  <button onClick={() => setPromoApplied(true)} className="px-4 py-2 bg-vloop-50 text-vloop-700 text-sm font-semibold rounded-lg hover:bg-vloop-100">
                    Apply
                  </button>
                </div>
                {promoApplied && <p className="text-xs text-success-600 mt-1">5% discount applied!</p>}
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({count} items)</span>
                  <span className="font-medium text-gray-900">₹{total.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-success-600">-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium text-success-600">FREE</span>
                </div>
                <div className="p-3 rounded-lg bg-gold-50 border border-gold-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-gold-700 font-medium flex items-center gap-1">
                      <Zap size={14} fill="currentColor" /> Points (₹{PURCHASE_RULES.POINT_RATE}=1pt)
                    </span>
                    <span className="font-bold text-gold-600">+{pointsEarned} pts</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Wallet 2 (2%)</span>
                    <span className="font-bold text-vloop-600">+₹{wallet2Credit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={10} /> Wallet 2 locked 30 days
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900 font-display">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} disabled={checkingOut} className="w-full mt-4 py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50">
                {checkingOut ? 'Processing...' : profile ? 'Checkout & Earn Points' : 'Sign In to Checkout'}
              </button>

              <div className="mt-4 text-center">
                <button onClick={() => onNavigate('marketplace')} className="text-sm text-vloop-600 font-medium hover:underline">
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
