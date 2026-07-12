import { useState, useEffect } from 'react';
import {
  ArrowLeft, ShoppingBag, CheckCircle2, Package, Truck, Bike, Home,
  MapPin, FileText, Clock,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import { mockOrderStatusSteps, formatINR, type MockOrderStatus } from '../lib/commerceMockData';

type Props = { onNavigate: (page: string) => void };

const iconMap: Record<string, any> = {
  ShoppingBag, CheckCircle2, Package, Truck, Bike, Home,
};

export default function CommerceTrackPage({ onNavigate }: Props) {
  const { lastOrder } = useCommerce();
  // Demo: auto-advance status for visual effect
  const [currentStatus, setCurrentStatus] = useState<MockOrderStatus>(lastOrder?.status || 'placed');

  const statusIndex = mockOrderStatusSteps.findIndex((s) => s.key === currentStatus);

  useEffect(() => {
    if (!lastOrder) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= mockOrderStatusSteps.length) {
        clearInterval(interval);
        return;
      }
      setCurrentStatus(mockOrderStatusSteps[idx].key);
    }, 1800);
    return () => clearInterval(interval);
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in bg-gray-50">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">No order to track</h2>
        <button onClick={() => onNavigate('commerce-shop')} className="btn-primary mt-4">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('commerce-shop')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Track Order</h1>
        </div>

        {/* Order header */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div>
              <div className="text-xs text-gray-400">Order ID</div>
              <div className="font-bold text-vloop-700 font-mono">{lastOrder.id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Estimated Delivery</div>
              <div className="font-bold text-gray-900">{lastOrder.estimatedDelivery}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-vloop-500" />
            <span className="text-gray-600">Current status:</span>
            <span className="font-semibold text-vloop-700">{mockOrderStatusSteps[statusIndex].label}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-6">Order Timeline</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-vloop-500 transition-all duration-700"
              style={{ height: `calc(${(statusIndex / (mockOrderStatusSteps.length - 1)) * 100}% )` }}
            />
            <div className="space-y-6">
              {mockOrderStatusSteps.map((step, idx) => {
                const Icon = iconMap[step.icon];
                const isDone = idx <= statusIndex;
                const isCurrent = idx === statusIndex;
                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isDone
                          ? 'bg-vloop-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-vloop-200 animate-pulse' : ''}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className={`flex-1 pt-1.5 transition-all duration-300 ${isDone ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                      {isDone && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {idx === 0 && `Order placed · ${new Date(lastOrder.placedAt).toLocaleString('en-IN')}`}
                          {idx === 1 && 'Seller confirmed your order'}
                          {idx === 2 && 'Items packed and ready to ship'}
                          {idx === 3 && 'Order dispatched from warehouse'}
                          {idx === 4 && 'Out for delivery — arriving today'}
                          {idx === 5 && `Delivered to ${lastOrder.address.name}`}
                        </div>
                      )}
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-bold text-vloop-600 bg-vloop-50 px-2 py-1 rounded-full mt-1.5">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-vloop-600" /> Delivery Address
          </h3>
          <div className="text-sm text-gray-600">
            <div className="font-medium text-gray-900">{lastOrder.address.name}</div>
            <div>{lastOrder.address.line1}, {lastOrder.address.line2}</div>
            <div>{lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.pincode}</div>
            <div className="text-xs text-gray-400 mt-0.5">{lastOrder.address.phone}</div>
          </div>
        </div>

        {/* Order items summary */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Items in this Order</h3>
          <div className="space-y-2">
            {lastOrder.items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</div>
                  <div className="text-xs text-gray-400">Qty {item.quantity} · {formatINR(item.unitPrice)}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">{formatINR(item.unitPrice * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => onNavigate('commerce-invoice')} className="py-3 bg-white border-2 border-vloop-200 text-vloop-700 font-semibold rounded-xl hover:bg-vloop-50 transition-colors flex items-center justify-center gap-2">
            <FileText size={18} /> View Invoice
          </button>
          <button onClick={() => onNavigate('commerce-shop')} className="py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
