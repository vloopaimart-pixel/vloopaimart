import React from 'react';
import {
  Smartphone, Gift, ShoppingBag, Heart, Sparkles, CheckCircle,
  ArrowRight, Zap, Shield, Clock, Award, HelpCircle
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

export default function SmartCodeInfoPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">SmartCode Challenge</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Enter 3-digit codes and win weekly rewards. It's simple, fun, and rewarding.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How SmartCode Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A simple 3-step process to participate in weekly challenges
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center h-full">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Earn SmartPoints</h3>
                <p className="text-slate-600 text-sm">
                  Make purchases or contribute to Care Club. Every ₹40 purchase = 1 SmartPoint.
                  Every ₹10 Care Club contribution = 5 SmartPoints.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Enter SmartCodes</h3>
                <p className="text-slate-600 text-sm">
                  Choose any 3-digit code (000-999), assign points from your balance. Enter multiple
                  codes with different point values.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center h-full">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-600">3</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Win Rewards</h3>
                <p className="text-slate-600 text-sm">
                  Weekly AI draw selects winners. Prizes: ₹400 (Prime), ₹200 (Premium), ₹100 (Standard).
                  AI assigns rewards automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Point Conversion */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">SmartPoints Conversion</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Fixed rules for earning SmartPoints (Locked and Permanent)
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-teal-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">From Purchases</h3>
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">LOCKED RULE</span>
                </div>
              </div>
              <div className="text-center py-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl">
                <div className="text-4xl font-bold text-teal-600 mb-2">₹40 = 1 Point</div>
                <p className="text-sm text-slate-600">Every ₹40 spent earns 1 SmartPoint</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">₹120 Purchase</span>
                  <span className="font-semibold text-teal-600">3 SmartPoints</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">₹200 Purchase</span>
                  <span className="font-semibold text-teal-600">5 SmartPoints</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">₹400 Purchase</span>
                  <span className="font-semibold text-teal-600">10 SmartPoints</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">From Care Club</h3>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">LOCKED RULE</span>
                </div>
              </div>
              <div className="text-center py-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                <div className="text-4xl font-bold text-emerald-600 mb-2">₹10 = 5 Points</div>
                <p className="text-sm text-slate-600">Every ₹10 contribution earns 5 SmartPoints</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">₹10 Contribution</span>
                  <span className="font-semibold text-emerald-600">5 SmartPoints</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">₹50 Contribution</span>
                  <span className="font-semibold text-emerald-600">25 SmartPoints</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">₹100 Contribution</span>
                  <span className="font-semibold text-emerald-600">50 SmartPoints</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Methods */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Ways to Enter SmartCodes</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Multiple methods available to participate in the weekly challenge
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">AI Automatic</h3>
              <p className="text-sm text-slate-600">
                System creates SmartCodes automatically using your available SmartPoints.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Manual Entry</h3>
              <p className="text-sm text-slate-600">
                Choose your own codes, assign points from your balance. Unlimited entries.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Offline OCR</h3>
              <p className="text-sm text-slate-600">
                Write codes on paper, photograph, and AI reads and registers automatically.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-slate-800">Voice (Coming Soon)</h3>
                  <p className="text-sm text-slate-500">Speak your code: "Five Four Two" = 542</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-slate-800">WhatsApp (Coming Soon)</h3>
                  <p className="text-sm text-slate-500">Send "542 = 10" via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Pools */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Weekly Reward Pools</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              AI automatically assigns rewards. Users never select categories.
            </p>
            <span className="inline-block mt-2 px-4 py-1 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
              AI ASSIGNMENT ONLY
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                1st Prize
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Prime Reward</h3>
                <div className="text-4xl font-bold mb-2">₹400</div>
                <p className="text-amber-100 text-sm">First position in weekly draw</p>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                2nd Prize
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Reward</h3>
                <div className="text-4xl font-bold mb-2">₹200</div>
                <p className="text-gray-200 text-sm">Second position in weekly draw</p>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                3rd Prize
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Standard Reward</h3>
                <div className="text-4xl font-bold mb-2">₹100</div>
                <p className="text-orange-100 text-sm">Third position in weekly draw</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Weekly Engine */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">AI Weekly Reward Engine</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The AI evaluates multiple factors to determine winners fairly
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'SmartCode', desc: 'Code entries' },
                { title: 'SmartPoints', desc: 'Point balance' },
                { title: 'Activity', desc: 'Weekly engagement' },
                { title: 'Compliance', desc: 'Rule adherence' },
              ].map((factor, i) => (
                <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{factor.title}</h3>
                  <p className="text-xs text-slate-600">{factor.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-800">
                  The AI weekly draw runs automatically, validating entries, detecting duplicates,
                  analyzing fraud, and selecting winners based on weighted fair processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-indigo-100 mb-6">
              Start entering SmartCodes and win weekly rewards.
            </p>
            <button
              onClick={() => handleNavigate('smartcode')}
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Enter SmartCode
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
