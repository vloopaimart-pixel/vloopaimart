import { useState, useRef } from 'react';
import {
  X, Upload, FileText, CheckCircle2, AlertCircle, Loader2,
  Store, Hash, Calendar, Package, IndianRupee, Camera, Info,
} from 'lucide-react';
import { supabase, type PurchaseBill, type ExtractedProduct } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { uploadFile } from '../lib/storage';

type BillUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
};

type BillForm = {
  storeName: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: string;
  products: ExtractedProduct[];
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function BillUploadModal({ isOpen, onClose, orderId }: BillUploadModalProps) {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'extract' | 'confirm' | 'done'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const [form, setForm] = useState<BillForm>({
    storeName: '',
    invoiceNumber: '',
    invoiceDate: '',
    totalAmount: '',
    products: [{ name: '', quantity: 1, unit_price: null, total: null }],
  });

  if (!isOpen) return null;

  const reset = () => {
    setStep('upload');
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setDuplicateWarning(null);
    setForm({ storeName: '', invoiceNumber: '', invoiceDate: '', totalAmount: '', products: [{ name: '', quantity: 1, unit_price: null, total: null }] });
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Only JPEG, PNG, WebP, or PDF files are accepted.');
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError('File must be under 10 MB.');
      return;
    }

    setFile(f);
    if (f.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreviewUrl(null);
    }
    setStep('extract');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      const fakeEvt = { target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvt);
    }
  };

  const handleProductChange = (idx: number, field: keyof ExtractedProduct, value: string) => {
    setForm((prev) => {
      const products = [...prev.products];
      if (field === 'name') products[idx] = { ...products[idx], name: value };
      else if (field === 'quantity') products[idx] = { ...products[idx], quantity: parseInt(value) || 1 };
      else if (field === 'unit_price') products[idx] = { ...products[idx], unit_price: value ? parseFloat(value) : null };
      else if (field === 'total') products[idx] = { ...products[idx], total: value ? parseFloat(value) : null };
      return { ...prev, products };
    });
  };

  const addProduct = () => setForm((prev) => ({ ...prev, products: [...prev.products, { name: '', quantity: 1, unit_price: null, total: null }] }));
  const removeProduct = (idx: number) => setForm((prev) => ({ ...prev, products: prev.products.filter((_, i) => i !== idx) }));

  const checkDuplicate = async (invoiceNumber: string): Promise<boolean> => {
    if (!invoiceNumber || !profile) return false;
    const { data } = await supabase
      .from('purchase_bills')
      .select('id')
      .eq('user_id', profile.id)
      .eq('invoice_number', invoiceNumber.trim())
      .maybeSingle();
    return !!data;
  };

  const handleSubmit = async () => {
    setError(null);
    setDuplicateWarning(null);

    if (!form.storeName.trim()) { setError('Store name is required.'); return; }
    if (!form.invoiceNumber.trim()) { setError('Invoice number is required.'); return; }
    if (!form.invoiceDate) { setError('Invoice date is required.'); return; }
    if (!form.totalAmount || isNaN(parseFloat(form.totalAmount))) { setError('Total amount is required.'); return; }
    const validProducts = form.products.filter((p) => p.name.trim());
    if (validProducts.length === 0) { setError('At least one product name is required.'); return; }

    setSaving(true);

    // Duplicate check
    const isDuplicate = await checkDuplicate(form.invoiceNumber);
    if (isDuplicate) {
      setDuplicateWarning(`Invoice #${form.invoiceNumber} has already been uploaded. You cannot submit duplicate bills.`);
      setSaving(false);
      return;
    }

    try {
      let storagePath: string | null = null;
      let storageUrl: string | null = null;

      // Upload file to storage
      if (file) {
        setUploading(true);
        const result = await uploadFile('bill-uploads', file, profile!.id);
        setUploading(false);
        if (result.error) throw new Error(`Storage upload failed: ${result.error}`);
        storagePath = result.path;
        storageUrl = result.url;
      }

      // Find existing duplicate id if re-checking (edge case)
      let duplicateOf: string | null = null;
      if (isDuplicate) {
        const { data: dup } = await supabase
          .from('purchase_bills')
          .select('id')
          .eq('user_id', profile!.id)
          .eq('invoice_number', form.invoiceNumber.trim())
          .maybeSingle();
        duplicateOf = dup?.id ?? null;
      }

      const payload: Partial<PurchaseBill> = {
        user_id: profile!.id,
        order_id: orderId ?? null,
        storage_path: storagePath,
        storage_url: storageUrl,
        file_name: file?.name ?? null,
        file_size_bytes: file?.size ?? null,
        mime_type: file?.type ?? null,
        status: 'pending',
        store_name: form.storeName.trim(),
        invoice_number: form.invoiceNumber.trim(),
        invoice_date: form.invoiceDate || null,
        extracted_products: validProducts,
        total_amount: parseFloat(form.totalAmount),
        currency: 'INR',
        is_duplicate: false,
        duplicate_of: duplicateOf,
        manually_entered: true,
        ocr_provider: null,
        ocr_confidence: null,
        ocr_raw_text: null,
      };

      const { error: insertErr } = await supabase.from('purchase_bills').insert(payload);
      if (insertErr) throw insertErr;

      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Failed to save bill. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Upload Purchase Bill</h2>
              <p className="text-xs text-gray-500">Submit your bill for verification</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5">

          {/* STEP: DONE */}
          {step === 'done' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} className="text-success-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bill Submitted!</h3>
              <p className="text-gray-500 text-sm mb-2">Your bill has been received and is pending verification.</p>
              <p className="text-xs text-gray-400 mb-6">You can track the status in your dashboard under the Bills tab.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vloop-50 border border-vloop-200 text-vloop-700 text-sm font-semibold mb-4">
                <Info size={14} /> Status: Pending Review
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { reset(); }} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Upload Another
                </button>
                <button onClick={handleClose} className="flex-1 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors text-sm">
                  Done
                </button>
              </div>
            </div>
          )}

          {/* STEP: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-vloop-300 rounded-xl p-10 text-center cursor-pointer hover:border-vloop-500 hover:bg-vloop-50 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-vloop-100 flex items-center justify-center mx-auto mb-4">
                  <Camera size={28} className="text-vloop-600" />
                </div>
                <p className="font-semibold text-gray-700 mb-1">Click or drag your bill here</p>
                <p className="text-sm text-gray-400">JPEG, PNG, WebP, or PDF · Max 10 MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileSelect} className="hidden" />
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div className="bg-vloop-50 rounded-xl p-4 flex gap-3">
                <Info size={16} className="text-vloop-600 shrink-0 mt-0.5" />
                <p className="text-xs text-vloop-700">
                  After uploading, you'll fill in the bill details manually.
                  Once our OCR service is live, these fields will be auto-filled from the image.
                </p>
              </div>
            </div>
          )}

          {/* STEP: EXTRACT (manual entry) */}
          {(step === 'extract' || step === 'confirm') && (
            <div className="space-y-5">

              {/* Preview */}
              {previewUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img src={previewUrl} alt="Bill preview" className="w-full max-h-48 object-contain bg-gray-50" />
                </div>
              )}
              {file && !previewUrl && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <FileText size={20} className="text-vloop-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              {/* OCR notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                <Info size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">OCR auto-fill is not yet active.</span> Please enter the bill details below manually.
                  The OCR engine is architecture-ready and will auto-fill these fields once connected.
                </p>
              </div>

              {/* Mandatory fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1">
                    <Store size={14} /> Store Name *
                  </label>
                  <input type="text" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 outline-none text-sm transition-all"
                    placeholder="e.g. Big Bazaar" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1">
                    <Hash size={14} /> Invoice Number *
                  </label>
                  <input type="text" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 outline-none text-sm transition-all"
                    placeholder="e.g. INV-2024-00123" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1">
                    <Calendar size={14} /> Invoice Date *
                  </label>
                  <input type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1">
                    <IndianRupee size={14} /> Total Amount (₹) *
                  </label>
                  <input type="number" min="0" step="0.01" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 outline-none text-sm transition-all"
                    placeholder="0.00" />
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Package size={14} /> Products *
                  </label>
                  <button type="button" onClick={addProduct}
                    className="text-xs text-vloop-600 font-semibold hover:underline">
                    + Add Row
                  </button>
                </div>
                <div className="space-y-2">
                  {form.products.map((product, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input type="text" value={product.name}
                        onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                        className="col-span-5 px-2.5 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-xs"
                        placeholder="Product name" />
                      <input type="number" min="1" value={product.quantity}
                        onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                        className="col-span-2 px-2.5 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-xs"
                        placeholder="Qty" />
                      <input type="number" min="0" step="0.01" value={product.unit_price ?? ''}
                        onChange={(e) => handleProductChange(idx, 'unit_price', e.target.value)}
                        className="col-span-2 px-2.5 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-xs"
                        placeholder="Price" />
                      <input type="number" min="0" step="0.01" value={product.total ?? ''}
                        onChange={(e) => handleProductChange(idx, 'total', e.target.value)}
                        className="col-span-2 px-2.5 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-xs"
                        placeholder="Total" />
                      {form.products.length > 1 ? (
                        <button type="button" onClick={() => removeProduct(idx)}
                          className="col-span-1 flex items-center justify-center text-red-400 hover:text-red-600">
                          <X size={14} />
                        </button>
                      ) : <div className="col-span-1" />}
                    </div>
                  ))}
                  <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-400 px-0.5">
                    <span className="col-span-5">Name</span>
                    <span className="col-span-2">Qty</span>
                    <span className="col-span-2">Unit ₹</span>
                    <span className="col-span-2">Total ₹</span>
                  </div>
                </div>
              </div>

              {/* Errors / duplicate warning */}
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {duplicateWarning && (
                <div className="bg-amber-50 text-amber-700 text-sm p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} /> {duplicateWarning}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { reset(); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={saving || uploading}
                  className="flex-1 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {(saving || uploading) ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Submit Bill'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
