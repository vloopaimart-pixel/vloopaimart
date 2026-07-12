import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Globe, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-300 max-w-xl mx-auto">Last updated: July 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Introduction</h2>
              <p className="text-slate-600">
                VLOOP ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our
                platform, mobile application, and services.
              </p>
            </div>

            {/* Information Collection */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Information We Collect</h2>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li><strong>Account Information:</strong> Name, email, phone number, address.</li>
                <li><strong>Transaction Data:</strong> Purchases, wallet transactions, SmartPoint activities.</li>
                <li><strong>Usage Data:</strong> Platform interactions, SmartCode entries, browsing history.</li>
                <li><strong>Device Information:</strong> IP address, device type, browser, location data.</li>
                <li><strong>Care Club Data:</strong> Contributions and participation records.</li>
              </ul>
            </div>

            {/* How We Use */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">How We Use Your Information</h2>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li>To provide and maintain our services</li>
                <li>To process transactions and manage your account</li>
                <li>To operate the SmartCode Weekly Challenge</li>
                <li>To calculate and display your Trust Score</li>
                <li>To send notifications about rewards and updates</li>
                <li>To improve our platform and develop new features</li>
                <li>To prevent fraud and ensure platform security</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Data Security</h2>
              </div>
              <p className="text-slate-600">
                We implement industry-standard security measures including encryption, secure servers,
                and regular security audits. Our dual-wallet system with 30-day holding period provides
                additional fraud protection for your funds.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Your Rights</h2>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Data Sharing</h2>
              </div>
              <p className="text-slate-600 mb-3">We do not sell your personal information. We may share data with:</p>
              <ul className="space-y-2 text-slate-600">
                <li>Service providers who assist in operations</li>
                <li>Payment processors for transactions</li>
                <li>Legal authorities when required by law</li>
                <li>Partner merchants for order fulfillment</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-slate-100 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Questions About Privacy?</h3>
                  <p className="text-slate-600 text-sm">
                    Contact us at <a href="mailto:privacy@vloop.com" className="text-teal-600 hover:underline">privacy@vloop.com</a> for any
                    privacy-related inquiries or to exercise your data rights.
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
