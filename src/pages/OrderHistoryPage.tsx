import { useEffect, useState, useMemo } from 'react';
import {
  Search, Package, ChevronRight, ShoppingBag, Clock, CheckCircle2,
  XCircle, Truck, RefreshCw, Filter, PackageOpen, MapPin, CreditCard,
  Zap, FileText, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type Order, type OrderItem, type PurchaseBill } from '../lib/supabase';

type OrderHistoryPageProps = {
  onNavigate: (page: string, params?: Record<string, string>) => void;
};

type FilterId = 'all' | 'pending' | 'completed' | 'cancelled' | 'returned';

type EnrichedOrder = Order & {
  items: OrderItem[];
  bill: PurchaseBill | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', icon: CheckCircle2 },
  packed: { label: 'Packed', color: 'text-vloop-700', bg: 'bg-vloop-50 border-vloop-200', icon: Package },
  shipped: { label: 'Shipped', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-success-700', bg: 'bg-success-50 border-success-200', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
  returned: { label: 'Returned', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: RefreshCw },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  paid: { label: 'Paid', color: 'text-success-700', bg: 'bg-success-100' },
  refunded: { label: 'Refunded', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  failed: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100' },
};

const BILL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  verified: { label: 'Verified', color: 'text-success-700', bg: 'bg-success-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
  not_uploaded: { label: 'Not Uploaded', color: 'text-gray-600', bg: 'bg-gray-100' },
};

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returned', label: 'Returned' },
];

function matchesFilter(order: Order, filter: FilterId): boolean {
  if (filter === 'all') return true;
  const status = (order.status || 'pending').toLowerCase();
  if (filter === 'pending') return ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(status);
  if (filter === 'completed') return status === 'delivered';
  if (filter === 'cancelled') return status === 'cancelled';
  if (filter === 'returned') return status === 'returned';
  return true;
}

export default function OrderHistoryPage({ onNavigate }: OrderHistoryPageProps) {
  const { profile, session } = useAuth();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  useEffect(() => {
    if (profile) fetchOrders();
  }, [profile]);

  const fetchOrders = async () => {
    if (!profile) return;
    setLoading(true);
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (!orderData || orderData.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const orderIds = orderData.map((o) => o.id);
    const [itemsRes, billsRes] = await Promise.all([
      supabase.from('order_items').select('*').in('order_id', orderIds),
      supabase.from('purchase_bills').select('*').in('order_id', orderIds),
    ]);

    const itemsMap = new Map<string, OrderItem[]>();
    (itemsRes.data || []).forEach((item: OrderItem) => {
      const list = itemsMap.get(item.order_id) || [];
      list.push(item);
      itemsMap.set(item.order_id, list);
    });

    const billMap = new Map<string, PurchaseBill>();
    (billsRes.data || []).forEach((bill: PurchaseBill) => {
      billMap.set(bill.order_id!, bill);
    });

    const enriched: EnrichedOrder[] = orderData.map((o: Order) => ({
      ...o,
      items: itemsMap.get(o.id) || [],
      bill: billMap.get(o.id) || null,
    }));

    setOrders(enriched);
    setLoading(false);
  };

  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) => matchesFilter(o, activeFilter));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => {
        const orderNum = (o.order_number || o.id.slice(0, 8)).toLowerCase();
        const itemMatch = o.items.some((item) => item.product_name.toLowerCase().includes(q));
        return orderNum.includes(q) || itemMatch;
      });
    }
    return result;
  }, [orders, activeFilter, searchQuery]);

  const filterCounts = useMemo(() => {
    const counts: Record<FilterId, number> = { all: orders.length, pending: 0, completed: 0, cancelled: 0, returned: 0 };
    orders.forEach((o) => {
      (Object.keys(FILTERS) as FilterId[]).forEach((f) => {
        if (f !== 'all' && matchesFilter(o, f)) counts[f]++;
      });
    });
    return counts;
  }, [orders]);

  if (!session || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-vloop-100 flex items-center justify-center mb-4">
          <Package size={36} className="text-vloop-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your orders</h2>
        <p className="text-gray-500 text-sm mb-6">Track your purchases, delivery status, and earned points</p>
        <button onClick={() => onNavigate('home')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-800 to-vloop-950 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-vloop-300 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <ShoppingBag size={24} className="text-vloop-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display">My Orders</h1>
              <p className="text-vloop-200 text-sm">Track your purchases and delivery status</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or Product Name..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-vloop-400 focus:border-transparent"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            const count = filterCounts[filter.id] || 0;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-vloop-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-vloop-300 hover:text-vloop-600'
                }`}
              >
                {filter.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw size={32} className="animate-spin text-vloop-600 mx-auto" />
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-vloop-50 to-vloop-100 flex items-center justify-center mb-6">
              <PackageOpen size={64} className="text-vloop-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your orders will appear here</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md">
              When you place an order, you'll be able to track its status, view delivery details, and manage returns — all in one place.
            </p>
            <button onClick={() => onNavigate('marketplace')} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          /* Order list */
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusKey = (order.status || 'pending').toLowerCase();
              const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              const payKey = (order.payment_status || 'pending').toLowerCase();
              const payCfg = PAYMENT_CONFIG[payKey] || PAYMENT_CONFIG.pending;
              const billKey = order.bill ? (order.bill.status || 'pending').toLowerCase() : 'not_uploaded';
              const billCfg = BILL_CONFIG[billKey] || BILL_CONFIG.not_uploaded;
              const orderDisplay = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;
              const itemNames = order.items.length > 0
                ? order.items.map((i) => i.product_name).join(', ')
                : 'Order items';

              return (
                <div
                  key={order.id}
                  onClick={() => onNavigate('order-details', { orderId: order.id })}
                  className="card-premium p-5 cursor-pointer hover:shadow-soft-hover transition-all group"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center shrink-0">
                        <ShoppingBag size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{orderDisplay}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-vloop-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>

                  {/* Product names */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">{itemNames}</p>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
                      <StatusIcon size={12} /> {statusCfg.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${payCfg.bg} ${payCfg.color}`}>
                      <CreditCard size={12} /> {payCfg.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${billCfg.bg} ${billCfg.color}`}>
                      <FileText size={12} /> Bill: {billCfg.label}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Total</span>
                        <div className="font-bold text-gray-900">₹{Number(order.total_amount).toFixed(0)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Earned</span>
                        <div className="font-bold text-gold-600 flex items-center gap-0.5">
                          <Zap size={12} /> {order.points_earned} pts
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
