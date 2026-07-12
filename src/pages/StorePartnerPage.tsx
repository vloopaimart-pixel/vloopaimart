import { useState } from 'react';
import { Store, MapPin, Phone, Tag, CheckCircle2, Loader2, Handshake, TrendingUp, Users, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export default function StorePartnerPage() {
  const { session } = useAuth();
  const [form, setForm] = useState({ storeName: '', location: '', mobile: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessCategories = ['Groceries', 'Drinking Water', 'Household Products', 'Personal Care', 'Health Products', 'Electronics', 'Fashion', 'Restaurant', 'Pharmacy', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.storeName || !form.location || !form.mobile || !form.category) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('store_partners').insert({
        store_name: form.storeName,
        location: form.location,
        mobile_number: form.mobile,
        business_category: form.category,
      });
      if (insertError) throw insertError;
      setSuccess(true);
      setForm({ storeName: '', location: '', mobile: '', category: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-700 to-vloop-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 mb-4">
            <Handshake size={16} className="text-gold-400" />
            <span className="text-sm font-medium text-gold-100">Partnership Opportunity</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Become a VLOOP Store Partner</h1>
          <p className="text-vloop-200 text-base max-w-2xl">
            Join the VLOOP ecosystem as a store partner. Reach thousands of members, grow your business, and be part of a transparent shopping benefits platform.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-display mb-6">Why Partner With VLOOP?</h2>
            <div className="space-y-4">
              {[
                { icon: Users, title: 'Reach 10,000+ Members', desc: 'Get direct access to our growing member base across India' },
                { icon: TrendingUp, title: 'Grow Your Sales', desc: 'Increase revenue through our points-driven shopping ecosystem' },
                { icon: Award, title: 'Trusted Brand Association', desc: 'Be listed as an official VLOOP partner store' },
                { icon: Store, title: 'Easy Store Management', desc: 'Manage your products, orders and inventory through our platform' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-premium p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center shrink-0">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="card-premium p-4 text-center">
                <div className="text-2xl font-bold text-vloop-700 font-display">1,248+</div>
                <div className="text-xs text-gray-500">Active Members</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-2xl font-bold text-gold-600 font-display">45+</div>
                <div className="text-xs text-gray-500">Partner Stores</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-2xl font-bold text-success-600 font-display">₹8.2L</div>
                <div className="text-xs text-gray-500">Monthly Sales</div>
              </div>
            </div>
          </div>

          {/* Registration form */}
          <div className="card-premium p-6">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
                  <CheckCircle2 size={40} className="text-success-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-500 text-sm mb-6">We'll review your application and contact you within 48 hours.</p>
                <button onClick={() => setSuccess(false)} className="btn-outline">
                  Register Another Store
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Register Your Store</h2>
                <p className="text-sm text-gray-500 mb-6">Fill in your store details to get started</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Store Name *</label>
                    <div className="relative">
                      <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.storeName}
                        onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                        placeholder="Enter your store name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Location *</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                        placeholder="City, State"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mobile Number *</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Category *</label>
                    <div className="relative">
                      <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select category</option>
                        {businessCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    Submit Application
                  </button>

                  {!session && (
                    <p className="text-xs text-gray-400 text-center">You can register without an account. We'll contact you on your mobile number.</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
