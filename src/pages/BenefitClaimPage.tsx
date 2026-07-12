import { useState } from 'react';
import { HeartHandshake, ShieldPlus, Users, GraduationCap, Ribbon, HeartPulse, CloudRain, Plane, CheckCircle2, Loader2, AlertCircle, FileText, Clock, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { wallet2Features } from '../lib/data';

const iconMap: Record<string, any> = {
  ShieldPlus, HeartHandshake, Users, GraduationCap, Ribbon, HeartPulse, CloudRain, Plane,
};

export default function BenefitClaimPage() {
  const { profile } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimAmount = parseFloat(amount) || 0;
  const w2Balance = profile?.wallet2_balance || 0;
  const w2Eligibility = profile?.wallet2_eligibility_status || 'eligible';

  const handleSubmit = async () => {
    setError(null);
    if (!profile) return;
    if (!selectedType) { setError('Please select a support type'); return; }
    if (!description.trim()) { setError('Please describe your situation'); return; }
    if (claimAmount <= 0) { setError('Please enter a valid amount'); return; }
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('support_requests').insert({
        user_id: profile.id,
        request_type: selectedType,
        message: `${description} [Requested: ₹${claimAmount}]`,
        status: 'open',
      });
      if (insertError) throw insertError;

      await supabase.from('benefits_history').insert({
        user_id: profile.id,
        benefit_type: selectedType,
        tier: 'standard',
        points_used: 0,
        amount: claimAmount,
        wallet: 'wallet2',
      });

      setSuccess(true);
      setSelectedType('');
      setDescription('');
      setAmount('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim');
    }
    setLoading(false);
  };

  const isEligible = w2Eligibility === 'eligible';

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-700 to-vloop-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 mb-4">
            <ShieldPlus size={16} className="text-gold-400" />
            <span className="text-sm font-medium text-gold-100">Wallet 2 Support</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Benefit Claim</h1>
          <p className="text-vloop-200 text-base max-w-2xl">
            Submit a support request to the VLOOP community charity fund. All claims are reviewed and verified before approval.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Eligibility banner */}
        <div className={`rounded-2xl p-5 mb-6 flex items-start gap-3 ${
          isEligible ? 'bg-success-50 border-2 border-success-200' : 'bg-gold-50 border-2 border-gold-200'
        }`}>
          {isEligible ? <BadgeCheck size={24} className="text-success-600 shrink-0 mt-0.5" /> : <Clock size={24} className="text-gold-600 shrink-0 mt-0.5" />}
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">
              {isEligible ? 'You are eligible to claim support' : 'Your eligibility is under review'}
            </h4>
            <p className="text-sm text-gray-600">
              Wallet 2 Balance: <span className="font-bold text-gold-600">₹{w2Balance.toLocaleString('en-IN')}</span>
              {' • '}Status: <span className="font-semibold capitalize">{w2Eligibility.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Support types */}
          <div className="lg:col-span-2">
            <div className="card-premium p-6">
              <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Select Support Type</h2>
              <p className="text-sm text-gray-500 mb-6">Choose the type of support you need</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {wallet2Features.map((feature) => {
                  const Icon = iconMap[feature.icon] || ShieldPlus;
                  const isSelected = selectedType === feature.title;
                  return (
                    <button
                      key={feature.title}
                      onClick={() => setSelectedType(feature.title)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        isSelected
                          ? 'border-vloop-500 bg-vloop-50 shadow-md'
                          : 'border-gray-100 bg-white hover:border-vloop-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 transition-colors ${
                        isSelected ? 'bg-vloop-600' : 'bg-gray-100'
                      }`}>
                        <Icon size={20} className={isSelected ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <div className={`text-xs font-semibold ${isSelected ? 'text-vloop-700' : 'text-gray-600'}`}>{feature.title}</div>
                    </button>
                  );
                })}
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
                    <CheckCircle2 size={40} className="text-success-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Claim Submitted!</h3>
                  <p className="text-gray-500 text-sm">Your support request has been submitted for review. We'll contact you within 48 hours.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Requested Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all"
                        placeholder="Enter amount needed"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Describe Your Situation</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vloop-500 focus:ring-2 focus:ring-vloop-100 outline-none transition-all resize-none"
                      placeholder="Please describe your situation and why you need support..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isEligible}
                    className="w-full py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                    Submit Claim Request
                  </button>

                  {!isEligible && (
                    <p className="text-xs text-gold-600 text-center mt-3">Your eligibility is currently under review. Claims are temporarily disabled.</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Disclaimer */}
            <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Important Disclaimer</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <strong>This is not insurance.</strong> Wallet 2 is a community-funded charity support system.
                    Support is subject to verification and policy review. Eligibility and payout amounts are determined
                    by VLOOP AI MART based on available community funds and individual case assessment.
                  </p>
                </div>
              </div>
            </div>

            {/* Process */}
            <div className="card-premium p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Claim Process</h3>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Submit Request', desc: 'Fill the form with your support type and details' },
                  { step: '2', title: 'Verification', desc: 'Our team reviews and verifies your request' },
                  { step: '3', title: 'Approval', desc: 'Eligible claims are approved based on fund availability' },
                  { step: '4', title: 'Disbursement', desc: 'Approved amount is credited to your Wallet 2' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-vloop-100 text-vloop-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet 2 balance */}
            <div className="rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-5 text-vloop-950">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake size={20} />
                <span className="text-sm font-semibold">Wallet 2 Balance</span>
              </div>
              <div className="text-3xl font-bold font-display">₹{w2Balance.toLocaleString('en-IN')}</div>
              <div className="text-xs text-vloop-800 mt-1">Available for charity support claims</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
