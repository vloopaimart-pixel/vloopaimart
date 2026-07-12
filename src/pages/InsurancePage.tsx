import { ShieldCheck, HeartPulse, FileText, ShieldAlert, PhoneCall, Info, CheckCircle2, Handshake, MessageCircle } from 'lucide-react';
import { insuranceTypes } from '../lib/data';

const iconMap: Record<string, any> = {
  HeartPulse, FileText, ShieldCheck, ShieldAlert, PhoneCall,
};

export default function InsurancePage(_: { onNavigate: (page: string) => void }) {
  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-700 to-vloop-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-4">
            <ShieldCheck size={16} className="text-gold-400" />
            <span className="text-sm font-medium text-gold-100">Licensed Insurance Partners</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Insurance Services</h1>
          <p className="text-vloop-200 text-base max-w-2xl">
            Comprehensive insurance coverage through our licensed partner network. Protect what matters most to you and your family.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Insurance types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {insuranceTypes.map((ins) => {
            const Icon = iconMap[ins.icon] || ShieldCheck;
            return (
              <div key={ins.title} className="card-premium p-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{ins.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{ins.desc}</p>
                <button className="text-vloop-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More →
                </button>
              </div>
            );
          })}

          {/* Partner insurance card */}
          <div className="rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-6 text-vloop-950 shadow-gold">
            <div className="w-14 h-14 rounded-2xl bg-vloop-950/10 flex items-center justify-center mb-4">
              <Handshake size={26} />
            </div>
            <h3 className="font-bold text-lg mb-1">Partner Insurance Providers</h3>
            <p className="text-sm text-vloop-800 mb-4">
              We work with India's leading licensed insurance providers to bring you the best coverage options.
            </p>
            <button className="text-vloop-900 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View Partners →
            </button>
          </div>
        </div>

        {/* Insurance Consultation Section */}
        <div className="rounded-2xl bg-gradient-to-br from-vloop-600 to-vloop-800 p-8 text-white mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-4">
                <PhoneCall size={16} className="text-gold-400" />
                <span className="text-sm font-medium text-gold-100">Free Consultation</span>
              </div>
              <h2 className="text-2xl font-bold font-display mb-3">Insurance Consultation</h2>
              <p className="text-vloop-100 leading-relaxed mb-6">
                Not sure which insurance plan is right for you? Our expert consultants will guide you through the options,
                help you compare plans from our partner providers, and choose the best coverage for your needs and budget.
              </p>
              <div className="space-y-2 mb-6">
                {['Free expert consultation', 'Compare plans from multiple providers', 'Personalized recommendations', 'Ongoing claims support'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-vloop-100">
                    <CheckCircle2 size={16} className="text-gold-400" /> {item}
                  </div>
                ))}
              </div>
              <button className="btn-gold">
                <MessageCircle size={18} /> Book Free Consultation
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-gold-400 font-display mb-1">5+</div>
                <div className="text-xs text-vloop-200">Insurance Types</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-gold-400 font-display mb-1">10+</div>
                <div className="text-xs text-vloop-200">Partner Providers</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-gold-400 font-display mb-1">Free</div>
                <div className="text-xs text-vloop-200">Consultation</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-gold-400 font-display mb-1">24/7</div>
                <div className="text-xs text-vloop-200">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilitator Disclaimer */}
        <div className="rounded-2xl bg-vloop-50 border-2 border-vloop-200 p-6 mb-10">
          <div className="flex items-start gap-3">
            <Info size={24} className="text-vloop-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Important Notice: VLOOP is NOT an Insurance Company</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                <strong>VLOOP AI MART acts as a service facilitator and partner connector.</strong> We are NOT an insurance company.
                Insurance services are provided by licensed insurance partners who are IRDAI-approved providers.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                All insurance policies are subject to the terms and conditions of the respective insurance provider.
                VLOOP AI MART does not directly underwrite insurance, collect premiums, or process claims.
                We connect you with trusted partners and provide consultation support.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display mb-6">Why Choose VLOOP Insurance?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Trusted Partners', desc: 'Only licensed, IRDAI-approved insurance providers' },
              { title: 'Points on Premium', desc: 'Earn VLOOP points when you pay insurance premiums' },
              { title: 'Easy Claims Support', desc: 'Dedicated support for claim assistance' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-5 rounded-xl bg-white shadow-card">
                <CheckCircle2 size={22} className="text-success-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
