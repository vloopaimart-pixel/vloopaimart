import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Scale, Clock, Wallet } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-slate-300 max-w-xl mx-auto">Last updated: July 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Acceptance */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-bold text-slate-800">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600">
                By accessing or using VLOOP, you agree to be bound by these Terms and Conditions.
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            {/* SmartPoints */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-bold text-slate-800">2. SmartPoints System</h2>
              </div>
              <div className="space-y-3 text-slate-600">
                <p><strong>Locked Rules:</strong> The following conversion rates are permanently locked:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Purchase: ₹40 = 1 SmartPoint</li>
                  <li>Care Club: ₹10 = 5 SmartPoints</li>
                </ul>
                <p>SmartPoints have no cash value until converted through the platform's approved methods.</p>
              </div>
            </div>

            {/* SmartCode */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-slate-800">3. SmartCode Challenge</h2>
              </div>
              <div className="space-y-3 text-slate-600">
                <p><strong>Participation:</strong> Entry requires valid SmartPoints. All entries are subject to AI validation.</p>
                <p><strong>Rewards:</strong> Weekly rewards (₹400, ₹200, ₹100) are assigned solely by AI. Users cannot select reward categories.</p>
                <p><strong>Fraud:</strong> Any attempt to manipulate the SmartCode system will result in disqualification and account suspension.</p>
              </div>
            </div>

            {/* Wallet */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">4. Wallet System</h2>
              </div>
              <div className="space-y-3 text-slate-600">
                <p><strong>Wallet 1:</strong> Instant access wallet for immediate transactions.</p>
                <p><strong>Wallet 2:</strong> Secure holdings with mandatory 30-day holding period.</p>
                <p><strong>Insurance:</strong> Insurance conditions apply to Wallet 2 holdings during the holding period.</p>
              </div>
            </div>

            {/* Prohibited */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-slate-800">5. Prohibited Activities</h2>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Creating multiple accounts to manipulate rewards</li>
                <li>Using automated systems or bots for SmartCode</li>
                <li>Attempting to reverse-engineer SmartCode algorithms</li>
                <li>Sharing account credentials with others</li>
                <li>Engaging in fraudulent transactions</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </div>

            {/* Liability */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-600">
                VLOOP shall not be liable for any indirect, incidental, or consequential damages
                arising from your use of the platform. Our total liability shall not exceed the
                amount of SmartPoints in your account at the time of the incident.
              </p>
            </div>

            {/* Modification */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">7. Modifications</h2>
              <p className="text-slate-600">
                We reserve the right to modify these terms at any time. Users will be notified
                of significant changes. Continued use of the platform constitutes acceptance
                of modified terms. Note: The locked SmartPoint conversion rules cannot be modified.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-slate-100 rounded-xl p-6 text-center">
              <p className="text-slate-600">
                Questions about these Terms? Contact us at{' '}
                <a href="mailto:legal@vloop.com" className="text-teal-600 hover:underline">legal@vloop.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
