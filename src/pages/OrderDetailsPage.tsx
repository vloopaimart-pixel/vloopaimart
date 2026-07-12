import { useEffect, useState } from 'react';
import {
  ArrowLeft, ShoppingBag, MapPin, CreditCard, Zap, FileText,
  CheckCircle2, Clock, Package, Truck, XCircle, RefreshCw, PackageCheck,
  Calendar, Hash, IndianRupee, Download, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type Order, type OrderItem, type OrderStatusHistory, type PurchaseBill } from '../lib/supabase';
import BillUploadModal from '../components/BillUploadModal';

type OrderDetailsPageProps = {
  orderId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
};

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck },
];

const TERMINAL_STATUSES = ['cancelled', 'returned'];

function getStatusIndex(status: string): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === status.toLowerCase());
  return idx === -1 ? 0 : idx;
}

export default function OrderDetailsPage({ orderId, onNavigate }: OrderDetailsPageProps) {
  const { profile } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [bill, setBill] = useState<PurchaseBill | null>(null);
  const [loading, setLoading] = useState(true);
  const [billModalOpen, setBillModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    const [orderRes, itemsRes, historyRes, billRes] = await Promise.all([
      supabase.from('orders').select('*').eq('id', orderId).maybeSingle(),
      supabase.from('order_items').select('*').eq('order_id', orderId),
      supabase.from('order_status_history').select('*').eq('order_id', orderId).order('created_at', { ascending: true }),
      supabase.from('purchase_bills').select('*').eq('order_id', orderId).maybeSingle(),
    ]);

    if (orderRes.data) setOrder(orderRes.data as Order);
    if (itemsRes.data) setItems(itemsRes.data as OrderItem[]);
    if (historyRes.data) setHistory(historyRes.data as OrderStatusHistory[]);
    if (billRes.data) setBill(billRes.data as PurchaseBill);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-vloop-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-error-50 flex items-center justify-center mb-4">
          <Package size={36} className="text-error-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-500 text-sm mb-6">This order may have been removed or the link is invalid.</p>
        <button onClick={() => onNavigate('orders')} className="btn-primary">Back to Orders</button>
      </div>
    );
  }

  const statusKey = (order.status || 'pending').toLowerCase();
  const isTerminal = TERMINAL_STATUSES.includes(statusKey);
  const currentStepIndex = isTerminal ? -1 : getStatusIndex(statusKey);
  const orderDisplay = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;
  const payKey = (order.payment_status || 'pending').toLowerCase();

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-800 to-vloop-950 text-white">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <button
            onClick={() => onNavigate('orders')}
            className="inline-flex items-center gap-1.5 text-vloop-300 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <ShoppingBag size={24} className="text-vloop-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Order {orderDisplay}</h1>
              <p className="text-vloop-200 text-sm">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Order Status Timeline */}
        <div className="card-premium p-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Package size={18} className="text-vloop-600" /> Order Timeline
          </h3>

          {isTerminal ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                {statusKey === 'cancelled' ? <XCircle size={20} className="text-red-600" /> : <RefreshCw size={20} className="text-orange-600" />}
              </div>
              <div>
                <div className="font-bold text-gray-900 capitalize">{statusKey}</div>
                {order.cancellation_reason && (
                  <div className="text-sm text-gray-500">{order.cancellation_reason}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {TIMELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isFuture = idx > currentStepIndex;
                const historyEntry = history.find((h) => h.new_status?.toLowerCase() === step.key);

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    {/* Connector line */}
                    {idx > 0 && (
                      <div
                        className={`absolute top-5 right-1/2 w-full h-0.5 -translate-y-0 ${
                          idx <= currentStepIndex ? 'bg-vloop-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                    {/* Icon circle */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-success-500 text-white'
                          : isCurrent
                          ? 'bg-vloop-600 text-white ring-4 ring-vloop-100 animate-pulse'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    {/* Label */}
                    <div className={`text-xs font-semibold mt-2 text-center ${isFuture ? 'text-gray-400' : 'text-gray-900'}`}>
                      {step.label}
                    </div>
                    {/* Date */}
                    {historyEntry && (
                      <div className="text-[10px] text-gray-400 mt-0.5 text-center">
                        {new Date(historyEntry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Purchased Products */}
        <div className="card-premium">
          <div className="flex items-center gap-2 p-5 border-b border-gray-100">
            <ShoppingBag size={18} className="text-vloop-600" />
            <h3 className="font-bold text-gray-900">Purchased Products</h3>
          </div>
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Individual item details were not recorded for this order.
              <div className="mt-2 text-xs">Order total: ₹{Number(order.total_amount).toFixed(0)} • Quantity: {order.quantity}</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vloop-100 to-vloop-200 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-vloop-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{item.product_name}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(0)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">₹{Number(item.total_price).toFixed(0)}</div>
                    {Number(item.discount_per_item) > 0 && (
                      <div className="text-xs text-success-600">−₹{Number(item.discount_per_item).toFixed(0)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Subtotal */}
          <div className="p-4 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">₹{Number(order.total_amount).toFixed(0)}</span>
            </div>
            {Number(order.delivery_fee) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium text-gray-900">₹{Number(order.delivery_fee).toFixed(0)}</span>
              </div>
            )}
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-success-600">−₹{Number(order.discount_amount).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-50">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-bold text-lg text-vloop-700">₹{Number(order.total_amount).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Zap size={14} className="text-gold-500" /> Points Earned
              </span>
              <span className="font-bold text-gold-600">+{order.points_earned} pts</span>
            </div>
          </div>
        </div>

        {/* Delivery Address & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Address */}
          <div className="card-premium p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-vloop-600" /> Delivery Address
            </h3>
            {order.delivery_address ? (
              <div className="text-sm text-gray-600 space-y-1">
                <div className="font-medium text-gray-900">{profile?.name}</div>
                <div>{order.delivery_address}</div>
                {order.delivery_city && <div>{order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}</div>}
                {order.delivery_type && (
                  <div className="text-xs text-gray-400 mt-2 capitalize">
                    {order.delivery_type} delivery
                    {order.delivery_date && ` • ${new Date(order.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                {profile?.name}<br />
                {profile?.location || 'Address not specified for this order'}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="card-premium p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-vloop-600" /> Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900 capitalize">{order.payment_method || 'COD'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold capitalize ${
                  payKey === 'paid' ? 'text-success-600' : payKey === 'failed' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {payKey}
                </span>
              </div>
              {order.payment_transaction_id && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-600">{order.payment_transaction_id}</span>
                </div>
              )}
              {order.invoice_number && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Invoice</span>
                  <span className="font-mono text-xs text-gray-600">{order.invoice_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Purchase Bill */}
        <div className="card-premium p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-vloop-600" /> Purchase Bill
          </h3>
          {bill ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-vloop-50 border border-vloop-200">
                <div className="w-10 h-10 rounded-lg bg-vloop-100 flex items-center justify-center">
                  <FileText size={20} className="text-vloop-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{bill.file_name || 'Uploaded bill'}</div>
                  <div className="text-xs text-gray-500">
                    Status: <span className="font-semibold capitalize">{bill.status}</span>
                    {bill.store_name && ` • ${bill.store_name}`}
                  </div>
                </div>
                {bill.storage_url && (
                  <a
                    href={bill.storage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-vloop-600 text-white hover:bg-vloop-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              {bill.total_amount != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bill Total</span>
                  <span className="font-bold text-gray-900">₹{Number(bill.total_amount).toFixed(0)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <FileText size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-4">No bill uploaded for this order yet.</p>
              <button
                onClick={() => setBillModalOpen(true)}
                className="px-5 py-2 bg-vloop-600 text-white text-sm font-semibold rounded-xl hover:bg-vloop-700 transition-colors"
              >
                Upload Purchase Bill
              </button>
            </div>
          )}
        </div>

        {/* Order Metadata */}
        <div className="card-premium p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Hash size={18} className="text-vloop-600" /> Order Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Order Number</span>
              <div className="font-mono text-gray-900">{orderDisplay}</div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Order Date</span>
              <div className="text-gray-900">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            {order.tracking_number && (
              <div>
                <span className="text-gray-500 text-xs">Tracking Number</span>
                <div className="font-mono text-gray-900">{order.tracking_number}</div>
              </div>
            )}
            {order.coupon_code && (
              <div>
                <span className="text-gray-500 text-xs">Coupon Applied</span>
                <div className="font-mono text-gray-900">{order.coupon_code}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Upload Modal */}
      <BillUploadModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        orderId={order.id}
      />
    </div>
  );
}
