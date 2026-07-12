import { useEffect, useState } from 'react';
import {
  FileText, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw,
  Upload, ChevronDown, ChevronUp, Store, Hash, Calendar, Package,
  IndianRupee, Eye, Info, Zap,
} from 'lucide-react';
import { supabase, type PurchaseBill } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import BillUploadModal from '../components/BillUploadModal';

type BillVerificationPageProps = {
  onNavigate: (page: string) => void;
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    bg: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-700',
    badge: 'bg-success-100 text-success-700',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
  },
};

function ConfidenceMeter({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-gray-400">OCR not run</span>;
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? 'bg-success-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600">{pct}%</span>
    </div>
  );
}

function BillCard({ bill }: { bill: PurchaseBill }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[bill.status];
  const StatusIcon = cfg.icon;
  const uploadDate = new Date(bill.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`rounded-2xl border ${cfg.border} bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
      {/* Card header */}
      <div className={`flex items-start justify-between p-4 ${cfg.bg}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.badge}`}>
            <FileText size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{bill.store_name || 'Unknown Store'}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {bill.invoice_number ? `#${bill.invoice_number}` : 'No invoice number'} · {uploadDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${cfg.badge}`}>
            <StatusIcon size={10} /> {cfg.label}
          </span>
          {bill.is_duplicate && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
              <AlertCircle size={10} /> Duplicate
            </span>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm">
          {bill.total_amount !== null && (
            <span className="flex items-center gap-1 font-bold text-gray-900">
              <IndianRupee size={14} className="text-vloop-600" />
              {bill.total_amount.toLocaleString('en-IN')}
            </span>
          )}
          {bill.invoice_date && (
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <Calendar size={12} /> {new Date(bill.invoice_date).toLocaleDateString('en-IN')}
            </span>
          )}
          {bill.extracted_products.length > 0 && (
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <Package size={12} /> {bill.extracted_products.length} item{bill.extracted_products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button onClick={() => setExpanded((x) => !x)}
          className="flex items-center gap-1 text-xs text-vloop-600 font-semibold hover:underline">
          {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> Details</>}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-3">

          {/* OCR confidence */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">OCR Confidence</p>
            <ConfidenceMeter value={bill.ocr_confidence} />
            {bill.ocr_provider && <p className="text-xs text-gray-400 mt-1">Provider: {bill.ocr_provider}</p>}
            {bill.manually_entered && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <Info size={11} /> Manually entered (OCR not yet active)
              </p>
            )}
          </div>

          {/* Products */}
          {bill.extracted_products.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Products</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400">
                      <th className="px-3 py-2 text-left font-medium">Name</th>
                      <th className="px-3 py-2 text-center font-medium">Qty</th>
                      <th className="px-3 py-2 text-right font-medium">Total ₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.extracted_products.map((p, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-3 py-2 text-gray-800">{p.name}</td>
                        <td className="px-3 py-2 text-center text-gray-500">{p.quantity}</td>
                        <td className="px-3 py-2 text-right text-gray-700 font-medium">
                          {p.total !== null ? `₹${p.total}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Verification note */}
          {bill.verification_note && (
            <div className={`rounded-xl p-3 ${cfg.bg} border ${cfg.border}`}>
              <p className="text-xs font-semibold text-gray-500 mb-1">Verification Note</p>
              <p className={`text-sm ${cfg.text}`}>{bill.verification_note}</p>
            </div>
          )}

          {/* Duplicate warning */}
          {bill.is_duplicate && (
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <p className="text-xs font-semibold text-red-600">Duplicate Detected</p>
              <p className="text-xs text-red-500 mt-0.5">This invoice number matches a previously uploaded bill.</p>
            </div>
          )}

          {/* Storage path badge */}
          {bill.storage_path && (
            <p className="text-[10px] text-gray-300 font-mono truncate">{bill.storage_path}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function BillVerificationPage({ onNavigate }: BillVerificationPageProps) {
  const { profile } = useAuth();
  const [bills, setBills] = useState<PurchaseBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    if (profile) fetchBills();
  }, [profile]);

  const fetchBills = async () => {
    if (!profile) return;
    setLoading(true);
    const { data } = await supabase
      .from('purchase_bills')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    if (data) setBills(data as PurchaseBill[]);
    setLoading(false);
  };

  const filtered = filter === 'all' ? bills : bills.filter((b) => b.status === filter);

  const counts = {
    all: bills.length,
    pending: bills.filter((b) => b.status === 'pending').length,
    verified: bills.filter((b) => b.status === 'verified').length,
    rejected: bills.filter((b) => b.status === 'rejected').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-gradient-to-br from-vloop-700 to-vloop-900 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Bill Verification</h2>
              <p className="text-vloop-200 text-sm">Track your uploaded purchase bills</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchBills}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <RefreshCw size={16} />
            </button>
            <button onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-vloop-950 font-semibold rounded-xl hover:bg-gold-400 transition-colors text-sm">
              <Upload size={16} /> Upload Bill
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {(['all', 'pending', 'verified', 'rejected'] as const).map((s) => (
            <button key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-3 text-center transition-all ${filter === s ? 'bg-white/20 ring-2 ring-white/30' : 'bg-white/10 hover:bg-white/15'}`}>
              <div className="text-2xl font-bold font-display">{counts[s]}</div>
              <div className="text-xs capitalize text-vloop-200">{s}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info banner for new users */}
      {bills.length === 0 && !loading && (
        <div className="bg-vloop-50 rounded-2xl border border-vloop-200 p-5 mb-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-vloop-100 flex items-center justify-center shrink-0">
            <Zap size={20} className="text-vloop-600" />
          </div>
          <div>
            <p className="font-semibold text-vloop-900 text-sm mb-1">How Bill Verification Works</p>
            <ol className="text-xs text-vloop-700 space-y-1 list-decimal ml-4">
              <li>After a purchase, click "Upload Bill" and attach your receipt image.</li>
              <li>Fill in the store name, invoice number, date, and products.</li>
              <li>Our team reviews the bill (OCR auto-fill coming soon).</li>
              <li>Once verified, your bill is marked "Verified" — future phases will unlock SmartCode rewards.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Bill list */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={28} className="animate-spin text-vloop-600 mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">
            {filter === 'all' ? 'No bills uploaded yet.' : `No ${filter} bills.`}
          </p>
          {filter === 'all' && (
            <button onClick={() => setUploadModalOpen(true)}
              className="mt-4 px-5 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors text-sm">
              Upload Your First Bill
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bill) => <BillCard key={bill.id} bill={bill} />)}
        </div>
      )}

      <BillUploadModal
        isOpen={uploadModalOpen}
        onClose={() => { setUploadModalOpen(false); fetchBills(); }}
      />
    </div>
  );
}
