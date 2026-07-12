import {
  ArrowLeft, FileText, Download, Zap, Printer, ShoppingBag,
} from 'lucide-react';
import { useCommerce } from '../lib/commerceContext';
import { mockMerchantDetails, formatINR } from '../lib/commerceMockData';

type Props = { onNavigate: (page: string) => void };

export default function CommerceInvoicePage({ onNavigate }: Props) {
  const { lastOrder } = useCommerce();

  if (!lastOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in bg-gray-50">
        <FileText size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">No invoice available</h2>
        <button onClick={() => onNavigate('commerce-shop')} className="btn-primary mt-4">Browse Products</button>
      </div>
    );
  }

  const merchantId = mockMerchantDetails[lastOrder.items[0]?.merchant || 'm1'] ? lastOrder.items[0].merchant : 'm1';
  const merchant = mockMerchantDetails[merchantId] || mockMerchantDetails['m1'];
  const invoiceDate = new Date(lastOrder.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const invoiceNo = `INV-${lastOrder.id.split('-')[1]}`;

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('commerce-track')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Invoice</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <Printer size={16} /> Print
            </button>
            <button className="px-4 py-2 bg-vloop-600 text-white text-sm font-semibold rounded-lg hover:bg-vloop-700 transition-colors flex items-center gap-1.5">
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-2xl shadow-card-hover overflow-hidden">
          {/* Invoice header */}
          <div className="bg-gradient-to-r from-vloop-600 to-vloop-700 p-6 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-xl font-display">V</span>
                </div>
                <div>
                  <div className="font-bold text-xl font-display">VLOOP Mart</div>
                  <div className="text-white/70 text-xs">AI-Powered Commerce</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-xs uppercase tracking-wide">Invoice</div>
                <div className="font-bold text-lg font-mono">{invoiceNo}</div>
                <div className="text-white/70 text-xs">{invoiceDate}</div>
              </div>
            </div>
          </div>

          {/* Bill to / From */}
          <div className="p-6 grid sm:grid-cols-2 gap-6 border-b border-gray-100">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Bill To</div>
              <div className="font-bold text-gray-900">{lastOrder.address.name}</div>
              <div className="text-sm text-gray-600 mt-1">{lastOrder.address.line1}</div>
              <div className="text-sm text-gray-600">{lastOrder.address.line2}</div>
              <div className="text-sm text-gray-600">{lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.pincode}</div>
              <div className="text-sm text-gray-500 mt-1">{lastOrder.address.phone}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sold By</div>
              <div className="font-bold text-gray-900">{merchant.name}</div>
              <div className="text-sm text-gray-600 mt-1">{merchant.address}</div>
              <div className="text-sm text-gray-500 mt-1">GSTIN: {merchant.gstin}</div>
              <div className="text-sm text-gray-500">{merchant.phone}</div>
            </div>
          </div>

          {/* Order meta */}
          <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-x-8 gap-y-2 text-sm border-b border-gray-100">
            <div><span className="text-gray-400">Order ID: </span><span className="font-mono font-semibold text-gray-700">{lastOrder.id}</span></div>
            <div><span className="text-gray-400">Payment: </span><span className="font-medium text-gray-700">{lastOrder.paymentMethod}</span></div>
            <div><span className="text-gray-400">Delivery: </span><span className="font-medium text-gray-700">{lastOrder.estimatedDelivery}</span></div>
          </div>

          {/* Items table */}
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold text-center">Qty</th>
                  <th className="pb-3 font-semibold text-right">Unit Price</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lastOrder.items.map((item) => (
                  <tr key={item.productId} className="border-b border-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.merchant}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">{formatINR(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium text-gray-900">{formatINR(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-6 pb-6 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">{formatINR(lastOrder.subtotal)}</span></div>
              {lastOrder.comboSavings > 0 && (
                <div className="flex justify-between"><span className="text-gray-500">Combo Savings</span><span className="text-success-600">-{formatINR(lastOrder.comboSavings)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span className="text-gray-900">{lastOrder.deliveryFee === 0 ? 'FREE' : formatINR(lastOrder.deliveryFee)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Taxes (demo 5%)</span><span className="text-gray-900">{formatINR(lastOrder.tax)}</span></div>
              <div className="flex justify-between border-t-2 border-gray-100 pt-3">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-gray-900 text-lg">{formatINR(lastOrder.total)}</span>
              </div>
              <div className="flex justify-between items-center bg-gold-50 rounded-lg px-3 py-2 mt-2">
                <span className="text-gold-700 font-medium flex items-center gap-1 text-sm">
                  <Zap size={14} fill="currentColor" /> SmartPoints Earned
                </span>
                <span className="font-bold text-gold-600">+{lastOrder.smartPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">This is a demo invoice. No real transaction has occurred.</p>
            <p className="text-xs text-gray-400 mt-1">Thank you for shopping with VLOOP Mart!</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={() => onNavigate('commerce-shop')} className="btn-outline">
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
