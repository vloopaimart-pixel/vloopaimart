import { X, Plus, Minus, Trash2, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { calcPurchasePoints, calcWallet2FromPurchase, calcWallet2ActivationDate, PURCHASE_RULES } from '../lib/points';
import BillUploadModal from './BillUploadModal';

type CartDrawerProps = {
  onNavigate: (page: string) => void;
};

export default function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { items, isCartOpen, setCartOpen, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { profile, refreshProfile } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [billModalOpen, setBillModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const pointsEarned = calcPurchasePoints(total);
  const wallet2Credit = calcWallet2FromPurchase(total);
  const activationDate = calcWallet2ActivationDate();

  const handleCheckout = async () => {
    if (!profile) {
      setCartOpen(false);
      onNavigate('home');
      return;
    }
    setCheckingOut(true);
    try {
      const orderNumber = `VLP${Date.now().toString().slice(-8)}`;
      let firstOrderId: string | null = null;

      for (const item of items) {
        const itemTotal = item.product.price * item.quantity;
        const points = calcPurchasePoints(itemTotal);
        const { data } = await supabase.from('orders').insert({
          user_id: profile.id,
          product_id: item.product.id,
          quantity: item.quantity,
          total_amount: itemTotal,
          points_earned: points,
          status: 'confirmed',
          order_number: orderNumber,
          payment_status: 'paid',
          payment_method: 'cod',
          delivery_address: profile.location || null,
          delivery_city: null,
          delivery_state: null,
          delivery_pincode: null,
          delivery_type: 'standard',
        }).select('id').maybeSingle();

        if (data) {
          if (!firstOrderId) firstOrderId = data.id;
          await supabase.from('order_items').insert({
            order_id: data.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.price,
            total_price: itemTotal,
            item_status: 'confirmed',
          });
          await supabase.from('order_status_history').insert({
            order_id: data.id,
            old_status: null,
            new_status: 'pending',
            changed_by_type: 'system',
            notes: 'Order placed',
          });
          await supabase.from('order_status_history').insert({
            order_id: data.id,
            old_status: 'pending',
            new_status: 'confirmed',
            changed_by_type: 'system',
            notes: 'Payment confirmed',
          });
        }
      }

      await supabase.from('profiles').update({
        points: profile.points + pointsEarned,
        wallet2_balance: profile.wallet2_balance + wallet2Credit,
        wallet2_activation_date: activationDate,
      }).eq('id', profile.id);

      await supabase.from('point_history').insert({
        user_id: profile.id,
        activity: 'Cart Purchase',
        amount: total,
        points_earned: pointsEarned,
        status: 'completed',
      });

      await refreshProfile();
      clearCart();
      setLastOrderId(firstOrderId);
      setOrderSuccess(true);
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setCheckingOut(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
        <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-vloop-50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={22} className="text-vloop-700" />
              <h3 className="font-bold text-gray-900 text-lg">Your Cart ({items.length})</h3>
            </div>
            <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg hover:bg-vloop-100 transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {orderSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-4">
                <ShoppingBag size={36} className="text-success-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
              <p className="text-gray-500 text-sm mb-1">You earned <span className="font-bold text-gold-600">{pointsEarned} points</span></p>
              <p className="text-gray-500 text-sm mb-4">Wallet 2 credit: <span className="font-bold text-vloop-600">+{wallet2Credit}</span></p>
              <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mb-6">
                <Clock size={12} /> Available in 30 days
              </div>
              {/* Bill Upload CTA */}
              <div className="w-full p-4 rounded-xl bg-vloop-50 border border-vloop-200 text-left mb-4">
                <p className="text-sm font-semibold text-vloop-800 mb-1">Got your purchase receipt?</p>
                <p className="text-xs text-vloop-600 mb-3">Upload your bill to get it verified. Future phases will unlock additional SmartCode rewards.</p>
                <button
                  onClick={() => { setBillModalOpen(true); }}
                  className="w-full py-2 bg-vloop-600 text-white text-sm font-semibold rounded-lg hover:bg-vloop-700 transition-colors"
                >
                  Upload Purchase Bill
                </button>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setOrderSuccess(false); setCartOpen(false); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  onClick={() => { setOrderSuccess(false); setCartOpen(false); onNavigate('dashboard'); }}
                  className="flex-1 py-2.5 bg-vloop-600 text-white text-sm font-semibold rounded-xl hover:bg-vloop-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag size={36} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mb-6">Add products to start earning points</p>
              <button onClick={() => { setCartOpen(false); onNavigate('marketplace'); }} className="btn-primary">
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-card transition-shadow">
                    <img src={item.product.image_url || ''} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">{item.product.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                          <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-vloop-700 text-sm">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                          <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-4 space-y-3">
                <div className="p-3 rounded-lg bg-gold-50 border border-gold-100">
                  <div className="text-xs text-gold-700 font-semibold mb-2">EARNINGS BREAKDOWN</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points (₹{PURCHASE_RULES.POINT_RATE} = 1pt)</span>
                    <span className="font-bold text-gold-600">+{pointsEarned} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Wallet 2 (2% of purchase)</span>
                    <span className="font-bold text-vloop-600">+₹{wallet2Credit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={10} /> Wallet 2 locked for 30 days
                  </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(0)}</span>
                </div>
                <button onClick={handleCheckout} disabled={checkingOut} className="w-full py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50">
                  {checkingOut ? 'Processing...' : profile ? 'Checkout & Earn Points' : 'Sign In to Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bill upload modal — rendered outside the drawer so it's not clipped */}
      <BillUploadModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        orderId={lastOrderId ?? undefined}
      />
    </>
  );
}
