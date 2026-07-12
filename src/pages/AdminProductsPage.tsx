import { useState, useEffect, useRef } from 'react';
import { Package, Plus, Pencil, Trash2, X, Loader2, Search, Star, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import { uploadFile } from '../lib/storage';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    image_url: '',
    rating: '4.5',
    review_count: '0',
    is_featured: false,
    is_vloop_own: false,
    is_partner: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', category: '', subcategory: '', brand: '', image_url: '', rating: '4.5', review_count: '0', is_featured: false, is_vloop_own: false, is_partner: false });
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      image_url: product.image_url || '',
      rating: String(product.rating),
      review_count: String(product.review_count),
      is_featured: product.is_featured,
      is_vloop_own: product.is_vloop_own,
      is_partner: product.is_partner,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const { url, error: uploadErr } = await uploadFile('product-images', file);
    if (uploadErr || !url) {
      setError(uploadErr || 'Upload failed');
    } else {
      setForm((prev) => ({ ...prev, image_url: url }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setError(null);
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        subcategory: form.subcategory || null,
        brand: form.brand || null,
        image_url: form.image_url || null,
        rating: parseFloat(form.rating) || 4.5,
        review_count: parseInt(form.review_count) || 0,
        is_featured: form.is_featured,
        is_vloop_own: form.is_vloop_own,
        is_partner: form.is_partner,
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
        setSuccess('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        setSuccess('Product added successfully');
      }

      await fetchProducts();
      setShowForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    }
    setSaving(false);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== product.id));
      setSuccess('Product deleted');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const categories = ['Daily Needs', 'Home Essentials', 'Beauty', 'Electronics', 'Fashion'];

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-800 to-vloop-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
              <Package size={24} className="text-vloop-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display">Product Inventory</h1>
              <p className="text-vloop-200 text-sm">Add, edit, and manage products in the catalog</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {success && (
          <div className="mb-4 p-4 rounded-xl bg-success-50 border border-success-200 text-success-700 text-sm flex items-center gap-2">
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 outline-none text-sm"
              placeholder="Search products..."
            />
          </div>
          <button
            onClick={openAddForm}
            className="px-4 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center gap-1.5 text-sm"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Products table */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="animate-spin text-vloop-600 mx-auto" />
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Brand</th>
                    <th className="py-3 px-4 font-medium text-right">Price</th>
                    <th className="py-3 px-4 font-medium text-center">Rating</th>
                    <th className="py-3 px-4 font-medium text-center">Flags</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={product.image_url || ''} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.category}</td>
                      <td className="py-3 px-4 text-gray-600">{product.brand || '—'}</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">₹{product.price.toFixed(0)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-0.5 bg-success-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          {product.rating} <Star size={9} fill="white" />
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1 justify-center">
                          {product.is_vloop_own && <span className="px-1.5 py-0.5 bg-vloop-100 text-vloop-700 text-[10px] font-bold rounded">VLOOP</span>}
                          {product.is_featured && <span className="px-1.5 py-0.5 bg-success-100 text-success-700 text-[10px] font-bold rounded">FEAT</span>}
                          {product.is_partner && <span className="px-1.5 py-0.5 bg-gold-100 text-gold-700 text-[10px] font-bold rounded">PRT</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => openEditForm(product)} className="p-2 rounded-lg hover:bg-vloop-50 text-vloop-600 transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(product)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No products found</div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Brand</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm bg-white">
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subcategory</label>
                  <input type="text" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm" />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Product Image</label>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 bg-vloop-50 text-vloop-700 text-sm font-semibold rounded-lg hover:bg-vloop-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
                <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm" placeholder="Or paste image URL..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vloop-500 outline-none text-sm resize-none" />
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-vloop-600" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_vloop_own} onChange={(e) => setForm({ ...form, is_vloop_own: e.target.checked })} className="w-4 h-4 accent-vloop-600" />
                  VLOOP Own
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_partner} onChange={(e) => setForm({ ...form, is_partner: e.target.checked })} className="w-4 h-4 accent-vloop-600" />
                  Partner Product
                </label>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
