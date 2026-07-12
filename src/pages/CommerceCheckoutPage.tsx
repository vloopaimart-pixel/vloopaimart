import { useState } from 'react';
import {
  ArrowLeft, MapPin, Phone, Truck, Zap, Package, CheckCircle2,
  ChevronRight, Plus, CreditCard, Wallet, Smartphone, Building2, Banknote, Lock, Rocket,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import {
  mockAddresses, mockDeliveryOptions, mockPaymentOptions,
  formatINR, calcSmartPoints, calcComboSavings, calcTax,
  estimatedDeliveryDate, generateOrderId,
  type MockAddress, type MockDeliveryOption, type MockPaymentOption, type MockOrder,
} from '../lib/commerceMockData';

type Props = { onNavigate: (page: string) => void };

const iconMap: Record<string, any> = { Truck, Zap, Rocket, Wallet, Smartphone, CreditCard, Building2, Banknote };

export default function CommerceCheckoutPage({ onNavigate }: Props) {
  const { cart, cartSubtotal, clearCart, setLastOrder } = useCommerce();
  const [address, setAddress] = useState<MockAddress>(mockAddresses[0]);
  const [contactName, setContactName] = useState(mockAddresses[0].name);
  const [contactPhone, setContactPhone] = useState(mockAddresses[0].phone);
  const [delivery, setDelivery] = useState<MockDeliveryOption>(mockDeliveryOptions[0]);
  const [payment, setPayment] = useState<MockPaymentOption>(mockPaymentOptions[0]);
  const [placing, setPlacing] = useState(false);

  const comboSavings = calcComboSavings(cart.map((i) => ({ productId: i.product.id, name: i.product.name, merchant: i.product.merchant, image: i.product.image, unitPrice: i.product.unitPrice, quantity: i.quantity })));
  const tax = calcTax(cartSubtotal);
  const total = cartSubtotal - comboSavings + delivery.price + tax;
  const smartPoints = calcSmartPoints(total);
  const eta = estimatedDeliveryDate(delivery.etaDays);

  const handlePlaceOrder = () => {
    if (!payment.available) return;
    setPlacing(true);
    const order: MockOrder = {
      id: generateOrderId(),
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        merchant: i.product.merchant,
        image: i.product.image,
        unitPrice: i.product.unitPrice,
        quantity: i.quantity,
      })),
      subtotal: cartSubtotal,
      comboSavings,
      deliveryFee: delivery.price,
      tax,
      total,
      smartPoints,
      paymentMethod: payment.label,
      address,
      deliveryOption: delivery,
      placedAt: new Date().toISOString(),
      estimatedDelivery: eta,
      status: 'placed',
    };
    setLastOrder(order);
    clearCart();
    setTimeout(() => {
      setPlacing(false);
      onNavigate('commerce-confirmation');
    }, 900);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in bg-gray-50">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Nothing to checkout</h2>
        <p className="text-gray-500 mb-6">Your cart is empty. Add some products first.</p>
        <button onClick={() => onNavigate('commerce-shop')} className="btn-primary">Browse Products</button>
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
          <h1 className="text-2xl font-bold text-gray-900 font-display">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: sections */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <Section icon={MapPin} title="Delivery Address" step={1}>
              <div className="space-y-2">
                {mockAddresses.map((a) => (
                  <label
                    key={a.id}
                    className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${address.id === a.id ? 'border-vloop-500 bg-vloop-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-start gap-3">
                      <input type="radio" checked={address.id === a.id} onChange={() => { setAddress(a); setContactName(a.name); setContactPhone(a.phone); }} className="mt-1 accent-vloop-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-gray-900 text-sm">{a.name}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">{a.type}</span>
                          {a.isDefault && <span className="px-2 py-0.5 bg-success-50 text-success-600 text-[10px] font-medium rounded">Default</span>}
                        </div>
                        <p className="text-sm text-gray-600">{a.line1}, {a.line2}, {a.city}, {a.state} - {a.pincode}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
                <button className="w-full p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 text-sm font-medium hover:border-vloop-400 hover:text-vloop-600 transition-colors flex items-center justify-center gap-1.5">
                  <Plus size={16} /> Add New Address
                </button>
              </div>
            </Section>

            {/* Contact Details */}
            <Section icon={Phone} title="Contact Details" step={2}>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Full Name</label>
                  <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="input-field py-2.5 text-sm" placeholder="Recipient name" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Phone Number</label>
                  <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="input-field py-2.5 text-sm" placeholder="+91" />
                </div>
              </div>
            </Section>

            {/* Delivery Option */}
            <Section icon={Truck} title="Delivery Option" step={3}>
              <div className="space-y-2">
                {mockDeliveryOptions.map((d) => {
                  const Icon = iconMap[d.icon];
                  return (
                    <label
                      key={d.id}
                      className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${delivery.id === d.id ? 'border-vloop-500 bg-vloop-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={delivery.id === d.id} onChange={() => setDelivery(d)} className="accent-vloop-600" />
                        <div className="w-9 h-9 rounded-lg bg-vloop-100 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-vloop-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{d.label}</div>
                          <div className="text-xs text-gray-500">{d.desc}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-sm">{d.price === 0 ? 'FREE' : formatINR(d.price)}</div>
                          <div className="text-xs text-gray-400">ETA: {estimatedDeliveryDate(d.etaDays)}</div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </Section>

            {/* Payment Selection */}
            <Section icon={Wallet} title="Payment Method" step={4}>
              <div className="space-y-2">
                {mockPaymentOptions.map((p) => {
                  const Icon = iconMap[p.icon];
                  return (
                    <label
                      key={p.id}
                      className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${payment.id === p.id ? 'border-vloop-500 bg-vloop-50' : 'border-gray-200 hover:border-gray-300'} ${!p.available ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={payment.id === p.id} onChange={() => p.available && setPayment(p)} disabled={!p.available} className="accent-vloop-600" />
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{p.label}</span>
                            {p.badge && (
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${p.id === 'wallet' ? 'bg-gold-100 text-gold-700' : 'bg-gray-100 text-gray-500'}`}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{p.desc}</div>
                        </div>
                        {!p.available && <Lock size={14} className="text-gray-400" />}
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Lock size={12} /> Demo only — no payment gateway is integrated. No real charge will be made.
              </p>
            </Section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card-hover p-5 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={18} className="text-vloop-600" /> Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</div>
                      <div className="text-xs text-gray-400">{item.product.merchant} · Qty {item.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{formatINR(item.product.unitPrice * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Combo savings */}
              {comboSavings > 0 && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-3 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success-600" />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-success-700">Combo Savings</div>
                    <div className="text-gray-600">You saved {formatINR(comboSavings)} on combo items</div>
                  </div>
                  <span className="font-bold text-success-600 text-sm">-{formatINR(comboSavings)}</span>
                </div>
              )}

              {/* SmartPoints preview */}
              <div className="bg-gold-50 border border-gold-100 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gold-700 font-medium text-sm flex items-center gap-1">
                    <Zap size={14} fill="currentColor" /> SmartPoints Earned
                  </span>
                  <span className="font-bold text-gold-600">+{smartPoints} pts</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Points credited after delivery is confirmed.</div>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-900">{formatINR(cartSubtotal)}</span></div>
                {comboSavings > 0 && <div className="flex justify-between"><span className="text-gray-500">Combo Savings</span><span className="font-medium text-success-600">-{formatINR(comboSavings)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="font-medium text-gray-900">{delivery.price === 0 ? 'FREE' : formatINR(delivery.price)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Taxes (demo)</span><span className="font-medium text-gray-900">{formatINR(tax)}</span></div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900 font-display">{formatINR(total)}</span>
                </div>
              </div>

              {/* Estimated delivery */}
              <div className="mt-4 p-3 rounded-lg bg-vloop-50 border border-vloop-100 flex items-center gap-2">
                <Truck size={16} className="text-vloop-600" />
                <div className="text-xs">
                  <div className="font-semibold text-vloop-700">Estimated Delivery</div>
                  <div className="text-gray-600">{eta} · {delivery.label}</div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !payment.available}
                className="w-full mt-4 py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? 'Placing Order...' : <>Place Order <ChevronRight size={18} /></>}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Lock size={11} /> Secure demo checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, step, children }: { icon: any; title: string; step: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-vloop-100 flex items-center justify-center">
          <Icon size={18} className="text-vloop-600" />
        </div>
        <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        <span className="ml-auto w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">{step}</span>
      </div>
      {children}
    </div>
  );
}
