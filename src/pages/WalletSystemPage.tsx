import React from 'react';
import {
  Wallet, Shield, Clock, ArrowRightLeft, Lock, CheckCircle,
  AlertCircle, Info, ArrowRight, Gift, CreditCard
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

export default function WalletSystemPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">VLOOP Wallet System</h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Dual-wallet architecture for security, flexibility, and growth
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How the Wallet System Works</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              VLOOP uses a dual-wallet system to balance instant access with enhanced security.
              Each wallet serves a specific purpose in managing your funds.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Wallet 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">W1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Wallet 1</h3>
                    <p className="text-teal-100">Instant Access Wallet</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Wallet 1 is your primary wallet for immediate transactions. Funds are available
                  instantly for purchases, transfers, and withdrawals.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Instant Availability</p>
                      <p className="text-sm text-slate-600">Use funds immediately after receiving</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Merchant Payments</p>
                      <p className="text-sm text-slate-600">Pay at any VLOOP-connected merchant</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">User Transfers</p>
                      <p className="text-sm text-slate-600">Send to other VLOOP users instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Withdrawal</p>
                      <p className="text-sm text-slate-600">Transfer to bank account anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">W2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Wallet 2</h3>
                    <p className="text-emerald-100">Secure Holdings Wallet</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Wallet 2 provides enhanced security with a 30-day holding period. Perfect for
                  larger amounts and protected savings.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">30-Day Holding</p>
                      <p className="text-sm text-slate-600">Protected during holding period</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Fraud Protection</p>
                      <p className="text-sm text-slate-600">Enhanced security measures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Insurance Coverage</p>
                      <p className="text-sm text-slate-600">Automatic insurance conditions apply</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Transfer from Wallet 1</p>
                      <p className="text-sm text-slate-600">Move funds to secure holdings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activation Rules */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Activation Rules</h2>
              <p className="text-slate-600">How to activate and use your wallets</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Wallet 1 Activation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-teal-600">1</span>
                  </div>
                  <span className="text-slate-600">Create your VLOOP account</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-teal-600">2</span>
                  </div>
                  <span className="text-slate-600">Complete profile verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-teal-600">3</span>
                  </div>
                  <span className="text-slate-600">Wallet 1 becomes active automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-teal-600">4</span>
                  </div>
                  <span className="text-slate-600">Start receiving SmartPoints and rewards</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Wallet 2 Activation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600">1</span>
                  </div>
                  <span className="text-slate-600">Maintain minimum balance in Wallet 1</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600">2</span>
                  </div>
                  <span className="text-slate-600">Initiate transfer from Wallet 1 to Wallet 2</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600">3</span>
                  </div>
                  <span className="text-slate-600">30-day holding period begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600">4</span>
                  </div>
                  <span className="text-slate-600">Funds unlock after holding period</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Holding Rules */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">30-Day Holding Rules</h2>
              <p className="text-slate-600">Understanding the holding period</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Purpose</h3>
                <p className="text-sm text-slate-600">
                  Security period to protect against fraud, disputes, and unauthorized transactions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Protection</h3>
                <p className="text-sm text-slate-600">
                  Insurance conditions apply during the holding period for added security.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Release</h3>
                <p className="text-sm text-slate-600">
                  Funds automatically release after 30 days to Wallet 1 for immediate use.
                </p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Once funds are released from Wallet 2 to Wallet 1, the 30-day holding period
                  does not apply again for those funds. The holding period only applies when
                  transferring from Wallet 1 to Wallet 2.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Insurance Conditions</h2>
              <p className="text-slate-600">Protection for your funds</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Coverage During Holding</h3>
                <ul className="space-y-2">
                  {[
                    'Fraud protection for unauthorized access',
                    'Dispute resolution support',
                    'Transaction reversal capability',
                    'Account security monitoring',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Conditions Apply</h3>
                <ul className="space-y-2">
                  {[
                    'Account must be verified',
                    'Holding period must be active',
                    'Dispute must be filed within 14 days',
                    'Compliance with terms of service',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Manage Your Wallets</h2>
            <p className="text-cyan-100 mb-6">
              View balances, transfer funds, and track transactions.
            </p>
            <button
              onClick={() => handleNavigate('wallet')}
              className="inline-flex items-center px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Go to Wallet
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
