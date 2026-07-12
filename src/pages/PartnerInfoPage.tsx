import React from 'react';
import {
  Users, MapPin, Globe, Award, TrendingUp, CheckCircle,
  ArrowRight, Handshake, Building, Briefcase, Star
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

export default function PartnerInfoPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Handshake className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a Partner</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Join the VLOOP partner network and build your business ecosystem
          </p>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Partnership Levels</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Start small and grow your network across the globe
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* District Partner */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-white">
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">District Partner</h3>
                    <p className="text-teal-100 text-sm">Start locally</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Build your foundation by establishing partnerships within your district.
                  Perfect for starting your VLOOP journey.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Onboard local merchants and customers',
                    'Earn from local transactions',
                    'Build trust within community',
                    'Training and support provided',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <span className="text-sm text-slate-500">Entry Point</span>
                  <div className="text-lg font-bold text-teal-600">Start Here</div>
                </div>
              </div>
            </div>

            {/* State Partner */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-1 text-xs font-bold">
                POPULAR CHOICE
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white mt-4">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">State Partner</h3>
                    <p className="text-orange-100 text-sm">Expand regionally</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Scale your network across state boundaries with enhanced benefits
                  and greater earning potential.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'All District Partner benefits',
                    'Expand across entire state',
                    'Higher commission rates',
                    'District partner referrals',
                    'State-wide events access',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <span className="text-sm text-slate-500">Upgrade Level</span>
                  <div className="text-lg font-bold text-orange-600">By Invitation</div>
                </div>
              </div>
            </div>

            {/* Global Partner */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-1 text-xs font-bold">
                ELITE LEVEL
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white mt-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">Global Partner</h3>
                    <p className="text-purple-100 text-sm">International reach</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Join the elite network with international reach and premium benefits
                  for established partners.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'All State Partner benefits',
                    'International business opportunities',
                    'Maximum commission rates',
                    'Executive support team',
                    'Global partner events',
                    'Brand collaboration opportunities',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <span className="text-sm text-slate-500">By Selection</span>
                  <div className="text-lg font-bold text-purple-600">Elite Only</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Opportunities */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Business Opportunities</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Multiple revenue streams as a VLOOP partner
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: 'Transaction Revenue', desc: 'Earn from every transaction in your network' },
              { icon: Users, title: 'Referral Bonuses', desc: 'Rewards for bringing new partners' },
              { icon: Award, title: 'Performance Incentives', desc: 'Quarterly bonuses for top performers' },
              { icon: Star, title: 'Premium Access', desc: 'Early access to new features and products' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How to Apply</h2>
            <p className="text-slate-600">
              Simple process to become a VLOOP partner
            </p>
          </div>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Apply Online', desc: 'Fill out the partner registration form with your details' },
              { step: 2, title: 'Review', desc: 'Our team reviews your application and background' },
              { step: 3, title: 'Interview', desc: 'Brief interview to understand your goals and network' },
              { step: 4, title: 'Onboarding', desc: 'Complete training and sign partnership agreement' },
              { step: 5, title: 'Launch', desc: 'Start building your partner network with support' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Start Your Partnership Journey</h2>
            <p className="text-orange-100 mb-6">
              Apply today and become part of the VLOOP ecosystem
            </p>
            <button
              onClick={() => handleNavigate('partner')}
              className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
            >
              Apply Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
