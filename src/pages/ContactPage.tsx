import React from 'react';
import {
  Mail, Phone, MapPin, MessageCircle, Clock, Send,
  HelpCircle, FileQuestion, ExternalLink
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

export default function ContactPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Email</h3>
              <p className="text-slate-600 mb-4">For general inquiries</p>
              <a href="mailto:support@vloop.com" className="text-blue-600 font-medium hover:underline">
                support@vloop.com
              </a>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center hover:border-green-300 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Phone</h3>
              <p className="text-slate-600 mb-4">Mon-Sat, 9 AM - 6 PM IST</p>
              <a href="tel:+911234567890" className="text-green-600 font-medium hover:underline">
                +91 123 456 7890
              </a>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center hover:border-purple-300 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">WhatsApp</h3>
              <p className="text-slate-600 mb-4">Quick responses</p>
              <a href="https://wa.me/911234567890" className="text-purple-600 font-medium hover:underline">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Support Hours</h2>
                <p className="text-slate-600">When we're available</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Customer Support</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-slate-800">9:00 AM - 8:00 PM IST</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-slate-800">9:00 AM - 6:00 PM IST</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-slate-800">Closed</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Partner Support</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-slate-800">9:00 AM - 6:00 PM IST</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-slate-800">10:00 AM - 4:00 PM IST</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-slate-800">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Help Resources</h2>
            <p className="text-slate-600">Find answers quickly</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button onClick={() => handleNavigate('faq')} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all w-full text-left">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <FileQuestion className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">FAQ</h3>
                <p className="text-sm text-slate-600">Common questions answered</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
            </button>
            <button onClick={() => handleNavigate('faq')} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all w-full text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Help Center</h3>
                <p className="text-sm text-slate-600">Detailed guides and tutorials</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
            </button>
          </div>
        </div>
      </section>

      {/* Office Address */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <MapPin className="w-5 h-5" />
            <span>VLOOP Headquarters, Tech Park, Bangalore, India</span>
          </div>
        </div>
      </section>
    </div>
  );
}
