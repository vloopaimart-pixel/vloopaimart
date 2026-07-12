import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';

type FooterProps = {
  onNavigate: (page: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
  const linkSections = [
    {
      title: 'Company',
      links: [
        { label: 'About VLOOP', page: 'about' },
        { label: 'Benefits', page: 'benefits' },
        { label: 'AI Assistant', page: 'ai-super-platform' },
        { label: 'Control Center', page: 'vcos-control-center' },
        { label: 'Global Ecosystem', page: 'global-ecosystem' },
        { label: 'Partner Network', page: 'partner-ecosystem' },
        { label: 'Wallet Ecosystem', page: 'wallet-ecosystem' },
        { label: 'Identity & Trust', page: 'identity-trust' },
        { label: 'Universal Wallet', page: 'universal-wallet' },
        { label: 'Payment Hub', page: 'payment-finance' },
        { label: 'Wallet System', page: 'wallet-system' },
        { label: 'SmartCode Info', page: 'smartcode-info' },
        { label: 'Become a Partner', page: 'partner-info' },
      ],
    },
    {
      title: 'Marketplace',
      links: [
        { label: 'Products', page: 'marketplace' },
        { label: 'Catalog', page: 'catalog' },
        { label: 'SmartCode Entry', page: 'smartcode' },
        { label: 'My SmartCodes', page: 'my-smartcodes' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', page: 'contact' },
        { label: 'FAQ', page: 'faq' },
        { label: 'Privacy Policy', page: 'privacy' },
        { label: 'Terms & Conditions', page: 'terms' },
        { label: 'Disclaimer', page: 'disclaimer' },
        { label: 'Refund Policy', page: 'refund' },
      ],
    },
    {
      title: 'Future Projects',
      links: [
        { label: 'Future Opportunities', page: 'future-opportunities' },
        { label: 'FOE Wallet', page: 'foe-wallet' },
        { label: 'All Projects', page: 'future-projects' },
        { label: 'Global Identity', page: 'global-identity' },
        { label: 'EV Programs', page: 'future-opportunities' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-none">VLOOP</div>
                <div className="text-[10px] text-teal-400 font-semibold tracking-wider">AI MART</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Turn Everyday Shopping Into Everyday Benefits. A transparent ecosystem for shopping, rewards, and community support.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Link sections */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-sm text-gray-400 hover:text-teal-400 transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="border-t border-slate-800 mt-10 pt-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Mail size={16} className="text-teal-400" /> support@vloop.com
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Phone size={16} className="text-teal-400" /> +91 123 456 7890
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin size={16} className="text-teal-400" /> Tech Park, Bangalore, India
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Globe size={16} className="text-teal-400" />
            <select className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-gray-400">
              <option>English</option>
              <option>हिंदी</option>
              <option>മലയാളം</option>
            </select>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 mt-8 pt-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-400">Disclaimer:</strong> VLOOP is a shopping ecosystem with SmartPoints rewards and Care Club community support.
            SmartCode weekly challenge is a reward program—not gambling. Points have no cash value until converted.
            Future projects shown are for informational purposes only.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            <button onClick={() => onNavigate('privacy')} className="text-gray-500 hover:text-gray-300">Privacy</button>
            <button onClick={() => onNavigate('terms')} className="text-gray-500 hover:text-gray-300">Terms</button>
            <button onClick={() => onNavigate('disclaimer')} className="text-gray-500 hover:text-gray-300">Disclaimer</button>
            <button onClick={() => onNavigate('contact')} className="text-gray-500 hover:text-gray-300">Contact</button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            © 2026 VLOOP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
