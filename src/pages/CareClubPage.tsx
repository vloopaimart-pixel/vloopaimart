import { useState, useEffect } from 'react';
import {
  HeartHandshake, Zap, Wallet, CheckCircle2, Info, TrendingUp, Users,
  ShieldCheck, ArrowRight, Clock, Award, Gift, Heart, Utensils, Pill,
  GraduationCap, Shirt, Home, History, Target, Eye, Globe, AlertTriangle,
  Calendar, ChevronRight, Sparkles, Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import {
  calcCareClubPoints,
  calcWallet2FromCareClub,
  calcWallet2ActivationDate,
  CARE_CLUB_RULES,
} from '../lib/points';
import {
  getMockCareClubProfile,
  getMockCareContributions,
  getMockCommunityImpact,
  getMockCarePartners,
  formatCurrency,
  getCareLevelColor,
  getCareLevelBadge,
  getEmergencyLabel,
  type CareClubProfile,
  type CareClubContribution,
} from '../lib/WalletOperatingSystem';

type CareClubPageProps = {
  onNavigate: (page: string) => void;
};

type ActiveTab = 'contribute' | 'history' | 'impact' | 'badges';

export default function CareClubPage({ onNavigate }: CareClubPageProps) {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('contribute');
  const [amount, setAmount] = useState('');
  const [contributionType, setContributionType] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const careProfile = getMockCareClubProfile();
  const contributions = getMockCareContributions();
  const communityImpact = getMockCommunityImpact();
  const partners = getMockCarePartners();

  const contributionAmount = parseFloat(amount) || 0;
  const points = calcCareClubPoints(contributionAmount);
  const wallet2Credit = calcWallet2FromCareClub(contributionAmount);
  const activationDate = calcWallet2ActivationDate();

  const quickAmounts = [10, 50, 100, 500, 1000];

  const contributionTypes = [
    { code: 'food', label: 'Food Support', icon: Utensils, color: 'from-orange-500 to-red-500' },
    { code: 'medicine', label: 'Medicine', icon: Pill, color: 'from-red-500 to-rose-500' },
    { code: 'education', label: 'Education', icon: GraduationCap, color: 'from-blue-500 to-indigo-500' },
    { code: 'clothing', label: 'Clothing', icon: Shirt, color: 'from-purple-500 to-violet-500' },
    { code: 'shelter', label: 'Shelter', icon: Home, color: 'from-emerald-500 to-teal-500' },
    { code: 'general', label: 'General', icon: Heart, color: 'from-pink-500 to-rose-500' },
  ];

  const handleSubmit = async () => {
    setError(null);
    if (!profile) {
      onNavigate('home');
      return;
    }
    if (contributionAmount < CARE_CLUB_RULES.MINIMUM_CONTRIBUTION) {
      setError(`Minimum contribution is ₹${CARE_CLUB_RULES.MINIMUM_CONTRIBUTION}`);
      return;
    }
    setLoading(true);
    try {
      const { error: careError } = await supabase.from('care_club').insert({
        user_id: profile.id,
        amount: contributionAmount,
        points_earned: points,
        contribution_type: contributionType,
        is_anonymous: isAnonymous,
      });
      if (careError) throw careError;

      await supabase.from('point_history').insert({
        user_id: profile.id,
        activity: `Care Club: ${contributionTypes.find(t => t.code === contributionType)?.label}`,
        amount: contributionAmount,
        points_earned: points,
        status: 'completed',
      });

      await supabase.from('profiles').update({
        points: profile.points + points,
        wallet2_balance: profile.wallet2_balance + wallet2Credit,
        wallet2_activation_date: activationDate,
      }).eq('id', profile.id);

      await refreshProfile();
      setSuccess(true);
      setAmount('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit contribution');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-pink-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Care Club</h1>
              <p className="text-pink-200 text-sm">Voluntary community support program</p>
            </div>
          </div>

          {/* Care Level Badge */}
          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br ${getCareLevelColor(careProfile.care_level)} text-white`}>
            <Award className="w-6 h-6" />
            <div>
              <div className="text-xs opacity-80">Care Level</div>
              <div className="font-bold capitalize">{careProfile.care_level} Contributor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] md:top-[105px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {[
              { key: 'contribute', label: 'Contribute', icon: Heart },
              { key: 'history', label: 'My Contributions', icon: History },
              { key: 'impact', label: 'Community Impact', icon: TrendingUp },
              { key: 'badges', label: 'Badges', icon: Award },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as ActiveTab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Contribute Tab */}
        {activeTab === 'contribute' && (
          <div className="space-y-6">
            {success ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-4">Your contribution helps build stronger communities.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  +{points} SmartPoints Earned
                </div>
              </div>
            ) : (
              <>
                {/* Contribution Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Make a Contribution
                  </h2>

                  <p className="text-sm text-gray-600 mb-6">
                    Care Club participation is always voluntary. Your contribution supports community welfare initiatives.
                  </p>

                  {/* Contribution Type */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Select Cause</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {contributionTypes.map((type) => (
                        <button
                          key={type.code}
                          onClick={() => setContributionType(type.code)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            contributionType === type.code
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                            <type.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Amount (₹)</label>
                    <div className="flex gap-3 mb-3">
                      {quickAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setAmount(amt.toString())}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            amount === amt.toString()
                              ? 'bg-rose-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Or enter custom amount"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="mb-6 flex items-center gap-3">
                    <button
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-12 h-7 rounded-full transition-colors ${isAnonymous ? 'bg-rose-600' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-gray-600">Make this contribution anonymous</span>
                  </div>

                  {/* Rewards Preview */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Impact</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-rose-600">{points}</div>
                        <div className="text-xs text-gray-500">SmartPoints</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">{formatCurrency(wallet2Credit)}</div>
                        <div className="text-xs text-gray-500">Wallet 2 Credit</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{Math.ceil(contributionAmount / 100)}</div>
                        <div className="text-xs text-gray-500">Est. Beneficiaries</div>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || contributionAmount < CARE_CLUB_RULES.MINIMUM_CONTRIBUTION}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Contribute {contributionAmount ? formatCurrency(contributionAmount) : ''}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-rose-600" />
                Contribution History
              </h2>
              <div className="space-y-3">
                {contributions.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                        c.contribution_type === 'food' ? 'from-orange-500 to-red-500' :
                        c.contribution_type === 'education' ? 'from-blue-500 to-indigo-500' :
                        'from-pink-500 to-rose-500'
                      } flex items-center justify-center`}>
                        {c.contribution_type === 'food' ? <Utensils className="w-5 h-5 text-white" /> :
                         c.contribution_type === 'education' ? <GraduationCap className="w-5 h-5 text-white" /> :
                         <Heart className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">{c.contribution_type} Support</div>
                        <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(c.amount)}</div>
                      <div className="text-xs text-emerald-600">+{c.smartpoints_earned} SP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                <div className="text-3xl font-bold text-rose-600">{careProfile.total_contributions}</div>
                <div className="text-sm text-gray-500">Total Contributions</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                <div className="text-3xl font-bold text-emerald-600">{formatCurrency(careProfile.total_amount_contributed)}</div>
                <div className="text-sm text-gray-500">Total Amount</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                <div className="text-3xl font-bold text-blue-600">{careProfile.total_beneficiaries}</div>
                <div className="text-sm text-gray-500">Beneficiaries Helped</div>
              </div>
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-200" />
                <span className="text-sm font-medium text-emerald-200">Community Impact Today</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-3xl font-bold">{communityImpact.total_contributions_day}</div>
                  <div className="text-xs text-emerald-200">Contributions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{formatCurrency(communityImpact.total_amount_contributed_day)}</div>
                  <div className="text-xs text-emerald-200">Amount</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{communityImpact.beneficiaries_helped_day}</div>
                  <div className="text-xs text-emerald-200">Beneficiaries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{communityImpact.active_volunteers_day}</div>
                  <div className="text-xs text-emerald-200">Volunteers</div>
                </div>
              </div>
            </div>

            {/* Partner NGOs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                Verified Partner Organizations
              </h2>
              <div className="space-y-3">
                {partners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{partner.partner_name}</div>
                        <div className="text-xs text-gray-500">{partner.city}, {partner.state}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {partner.verification_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparency Note */}
            <div className="bg-slate-100 rounded-xl p-4 text-center">
              <Eye className="w-5 h-5 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                No personal user information is exposed. Only aggregate community statistics are displayed.
              </p>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Your Badges
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {careProfile.badges.map((badge) => (
                  <div
                    key={badge}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-2">
                      <Star className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">{badge}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Level Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4">Care Level Progress</h2>
              <div className="space-y-4">
                {['bronze', 'silver', 'gold', 'platinum', 'diamond'].map((level) => (
                  <div
                    key={level}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      careProfile.care_level === level ? 'bg-amber-50 border-2 border-amber-300' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getCareLevelColor(level)} flex items-center justify-center`}>
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold capitalize text-gray-900">{level}</div>
                      <div className="text-xs text-gray-500">
                        {level === 'bronze' && '₹0 - ₹4,999'}
                        {level === 'silver' && '₹5,000 - ₹19,999'}
                        {level === 'gold' && '₹20,000 - ₹49,999'}
                        {level === 'platinum' && '₹50,000 - ₹99,999'}
                        {level === 'diamond' && '₹100,000+'}
                      </div>
                    </div>
                    {careProfile.care_level === level && (
                      <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
