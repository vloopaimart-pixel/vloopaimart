import {
  CheckCircle2, Package, Zap, Truck, ShoppingBag, MapPin,
  ChevronRight, FileText, ArrowRight, PartyPopper,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import { formatINR } from '../lib/commerceMockData';

type Props = { onNavigate: (page: string) => void };

export default function CommerceConfirmationPage({ onNavigate }: Props) {
  const { lastOrder } = useCommerce();

  if (!lastOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in bg-gray-50">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">No recent order found</h2>
        <button onClick={() => onNavigate('commerce-shop')} className="btn-primary mt-4">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success hero */}
        <div className="bg-white rounded-3xl shadow-card-hover p-8 text-center mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-success-500 via-vloop-500 to-gold-400" />
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
            <CheckCircle2 size={44} className="text-success-600" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 font-display">Order Confirmed!</h1>
            <PartyPopper size={22} className="text-gold-500" />
          </div>
          <p className="text-gray-500 text-sm mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-vloop-50 rounded-full">
            <span className="text-xs text-gray-500">Order ID</span>
            <span className="font-bold text-vloop-700 font-mono text-sm">{lastOrder.id}</span>
          </div>
        </div>

        {/* SmartPoints earned */}
        <div className="bg-gradient-to-r from-gold-400 to-gold-500 rounded-2xl p-5 mb-6 flex items-center gap-4 shadow-gold">
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
            <Zap size={26} className="text-white" fill="white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg">+{lastOrder.smartPoints} SmartPoints Earned</div>
            <div className="text-white/80 text-sm">Points will be credited after delivery</div>
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-vloop-600" /> Items Ordered
          </h2>
          <div className="space-y-3">
            {lastOrder.items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.merchant} · Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">{formatINR(item.unitPrice * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">{formatINR(lastOrder.subtotal)}</span></div>
            {lastOrder.comboSavings > 0 && <div className="flex justify-between"><span className="text-gray-500">Combo Savings</span><span className="text-success-600">-{formatINR(lastOrder.comboSavings)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-gray-900">{lastOrder.deliveryFee === 0 ? 'FREE' : formatINR(lastOrder.deliveryFee)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Taxes</span><span className="text-gray-900">{formatINR(lastOrder.tax)}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-bold text-gray-900 text-lg">{formatINR(lastOrder.total)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400"><span>Payment Method</span><span>{lastOrder.paymentMethod}</span></div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-vloop-50 flex items-center justify-center shrink-0">
              <Truck size={18} className="text-vloop-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">Estimated Delivery</div>
              <div className="text-2xl font-bold text-vloop-700 font-display">{lastOrder.estimatedDelivery}</div>
              <div className="text-xs text-gray-500 mt-1">{lastOrder.deliveryOption.label}</div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600">
              <div className="font-medium text-gray-900">{lastOrder.address.name}</div>
              <div>{lastOrder.address.line1}, {lastOrder.address.line2}</div>
              <div>{lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.pincode}</div>
              <div className="text-xs text-gray-400 mt-0.5">{lastOrder.address.phone}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => onNavigate('commerce-track')}
            className="py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center justify-center gap-2"
          >
            <Truck size={18} /> Track Order
          </button>
          <button
            onClick={() => onNavigate('commerce-invoice')}
            className="py-3 bg-white border-2 border-vloop-200 text-vloop-700 font-semibold rounded-xl hover:bg-vloop-50 transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={18} /> View Invoice
          </button>
        </div>
        <button
          onClick={() => onNavigate('commerce-shop')}
          className="w-full py-3 text-vloop-600 font-semibold rounded-xl hover:bg-vloop-50 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} /> Continue Shopping <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
