import React from 'react';
import { AlertTriangle, Info, Shield, HelpCircle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-amber-100 max-w-xl mx-auto">Important legal information about VLOOP services</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">General Information</h2>
              </div>
              <p className="text-slate-600">
                VLOOP provides a platform for e-commerce, SmartCode challenges, and community support.
                The information on this platform is provided for general purposes only. While we strive
                for accuracy, we make no representations about the completeness or reliability of any information.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-800">No Financial Advice</h2>
              </div>
              <p className="text-slate-600 mb-3">
                VLOOP is not a financial institution. SmartPoints are reward tokens, not currency or securities.
                The SmartCode weekly challenge is a reward program, not gambling or a lottery.
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>SmartPoints have no guaranteed cash value</li>
                <li>Rewards are assigned by AI and not guaranteed</li>
                <li>Participation does not guarantee winning</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-slate-800">Third-Party Content</h2>
              </div>
              <p className="text-slate-600">
                Products sold on our marketplace may be provided by third-party sellers or partners.
                VLOOP is not responsible for the quality, safety, or legality of third-party products.
                Product warranties, if any, are provided by respective sellers or manufacturers.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Future Projects Disclaimer</h2>
              <p className="text-slate-600">
                Information about future projects (Affordable Housing, Land Projects, EV Projects,
                Healthcare Support, etc.) is for informational purposes only. These projects are in
                planning stages and their implementation, timeline, and features may change.
                Availability of future projects is not guaranteed.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Limitation of Liability</h2>
              <p className="text-slate-600">
                To the fullest extent permitted by law, VLOOP shall not be liable for any direct,
                indirect, incidental, special, or consequential damages arising from your use of
                our platform, including but not limited to loss of SmartPoints, rewards, or opportunity.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Indemnification</h2>
              <p className="text-slate-600">
                You agree to indemnify and hold harmless VLOOP and its affiliates from any claims,
                damages, or expenses arising from your violation of these terms or your use of the platform.
              </p>
            </div>

            <div className="bg-slate-100 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Questions?</h3>
                  <p className="text-slate-600 text-sm">
                    If you have questions about this disclaimer, contact us at{' '}
                    <a href="mailto:legal@vloop.com" className="text-teal-600 hover:underline">legal@vloop.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
