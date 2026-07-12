import React from 'react';
import {
  Gift, Shield, Users, Wallet, ShoppingBag, Award,
  CheckCircle, ArrowRight, Star, TrendingUp, Heart, Sparkles
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

export default function BenefitsPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">VLOOP Benefits</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Discover the advantages for every member of our ecosystem
          </p>
        </div>
      </section>

      {/* Customer Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Customer Benefits</h2>
              <p className="text-slate-600">Enhancing your shopping experience</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'SmartPoints on Every Purchase', desc: 'Earn 1 SmartPoint for every ₹40 spent. Points add up quickly with regular shopping.' },
              { title: 'Weekly SmartCode Challenge', desc: 'Participate in weekly draws with chances to win ₹100, ₹200, or ₹400 rewards.' },
              { title: 'Care Club Membership', desc: 'Contribute ₹10 and earn 5 SmartPoints while supporting community initiatives.' },
              { title: 'Dual Wallet System', desc: 'Wallet 1 for immediate use, Wallet 2 with 30-day holding for enhanced security.' },
              { title: 'Exclusive Product Access', desc: 'Access to VLOOP private label brands and global merchandise.' },
              { title: 'Trust Score Benefits', desc: 'Build your trust score for premium perks and future opportunities.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Merchant Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Merchant Benefits</h2>
              <p className="text-slate-600">Grow your business with VLOOP</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Global Marketplace Access', desc: 'List products to customers across multiple regions and markets.' },
              { title: 'Private Label Opportunities', desc: 'Create your own brand under VLOOP private label ecosystem.' },
              { title: 'Smart Inventory Management', desc: 'AI-powered inventory predictions and restocking alerts.' },
              { title: 'Logistics Integration', desc: 'Access global logistics network for seamless fulfillment.' },
              { title: 'Seller Analytics Dashboard', desc: 'Comprehensive insights on sales, performance, and growth trends.' },
              { title: 'Partner Network', desc: 'Connect with distributors, suppliers, and service providers.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Partner Benefits</h2>
              <p className="text-slate-600">Build and grow with VLOOP partnership</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'District Partnership', desc: 'Start locally and build your network within your district.' },
              { title: 'State Partnership', desc: 'Expand your reach across state boundaries with enhanced benefits.' },
              { title: 'Global Partnership', desc: 'Join the global network for international opportunities.' },
              { title: 'Revenue Sharing', desc: 'Earn from transactions, referrals, and network growth.' },
              { title: 'Training & Support', desc: 'Comprehensive onboarding and continuous support.' },
              { title: 'Exclusive Events', desc: 'Access to partner-only events and networking opportunities.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Club Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Care Club Benefits</h2>
              <p className="text-slate-600">Community support and rewards</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Contribution Rewards', desc: 'Every ₹10 contribution earns 5 SmartPoints instantly.' },
              { title: 'Community Impact', desc: 'Your contributions support meaningful community initiatives.' },
              { title: 'Transparency Reports', desc: 'Track how your contributions make a difference.' },
              { title: 'Care Club Tier Growth', desc: 'Progress through tiers for enhanced benefits as you contribute.' },
              { title: 'Reward Eligibility', desc: 'Care Club participation enhances weekly draw eligibility.' },
              { title: 'Future Benefits', desc: 'Priority access to upcoming housing and healthcare initiatives.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Wallet Benefits</h2>
              <p className="text-slate-600">Secure and flexible wallet system</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W1</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Wallet 1 - Instant Access</h3>
                  <p className="text-sm text-slate-600">For immediate transactions</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Instant availability for purchases',
                  'Use at any VLOOP merchant',
                  'Transfer to other VLOOP users',
                  'Convert to withdrawal instantly',
                  'Real-time balance tracking',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W2</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Wallet 2 - Secure Holdings</h3>
                  <p className="text-sm text-slate-600">Protected with 30-day holding</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  '30-day holding for enhanced security',
                  'Fraud protection during holding period',
                  'Automatic insurance conditions',
                  'Higher earning potential',
                  'Safe transfer from Wallet 1',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Start Earning Today</h2>
            <p className="text-emerald-100 mb-6">
              Join millions of VLOOP members and start enjoying these benefits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleNavigate('marketplace')}
                className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigate('partner-info')}
                className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Become a Partner
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
