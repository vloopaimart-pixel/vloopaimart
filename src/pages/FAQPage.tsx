import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Wallet, ShoppingBag, Gift, Shield } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // SmartPoints & Wallet
  { category: 'points', question: 'How do I earn SmartPoints?', answer: 'You earn SmartPoints through two methods: 1) Shopping - Every ₹40 purchase gives you 1 SmartPoint. 2) Care Club - Every ₹10 contribution gives you 5 SmartPoints. These conversion rates are permanently locked.' },
  { category: 'points', question: 'What is the difference between Wallet 1 and Wallet 2?', answer: 'Wallet 1 is your instant access wallet - funds are available immediately for purchases, transfers, and withdrawals. Wallet 2 is a secure holdings wallet with a 30-day holding period for enhanced security and fraud protection. Funds are automatically released to Wallet 1 after the holding period.' },
  { category: 'points', question: 'How does the 30-day holding period work?', answer: 'When you transfer funds from Wallet 1 to Wallet 2, they enter a 30-day holding period. During this time, the funds are protected by insurance conditions and fraud prevention measures. After 30 days, funds are automatically released to Wallet 1 for immediate use.' },
  // SmartCode
  { category: 'smartcode', question: 'How does SmartCode work?', answer: 'SmartCode is a weekly challenge where you enter 3-digit codes (000-999) using your SmartPoints. The AI Weekly Reward Engine evaluates all entries and selects winners. Rewards are ₹400 (Prime), ₹200 (Premium), and ₹100 (Standard), assigned automatically by AI.' },
  { category: 'smartcode', question: 'Can I enter multiple SmartCodes?', answer: 'Yes! You can enter unlimited SmartCodes with different point allocations. You can even enter the same code multiple times with different point values. For example, entering 542 with 2 points and also 542 with 10 points.' },
  { category: 'smartcode', question: 'How are winners selected?', answer: 'The AI Weekly Reward Engine automatically evaluates all entries based on multiple factors including SmartCode entries, SmartPoints balance, purchase activity, Care Club participation, weekly activity, and rule compliance. AI assigns rewards automatically - users never select reward categories.' },
  { category: 'smartcode', question: 'What reward pools are available?', answer: 'There are three locked reward pools: Prime Reward (₹400 - First Prize), Premium Reward (₹200 - Second Prize), and Standard Reward (₹100 - Third Prize). These amounts and the AI-only assignment rule are permanently locked.' },
  // Care Club
  { category: 'careclub', question: 'What is Care Club?', answer: 'Care Club is VLOOP\'s community support program. When you contribute ₹10, you receive 5 SmartPoints instantly. Your contributions support community initiatives, and you receive transparency reports showing the impact of your support.' },
  { category: 'careclub', question: 'How does Care Club benefit me?', answer: 'Care Club gives you double the SmartPoints compared to regular purchases (₹10 = 5 points vs ₹40 = 1 point). Plus, you\'re supporting community initiatives, building your trust score, and becoming eligible for future benefits like housing and healthcare initiatives.' },
  // Account & Security
  { category: 'account', question: 'How do I verify my account?', answer: 'Account verification involves confirming your email, phone number, and basic identity information. Go to Settings > Account > Verification and follow the prompts. Verified accounts have higher trust scores and access to more features.' },
  { category: 'account', question: 'How does the Trust Score work?', answer: 'Your Trust Score (0-1000) is calculated by AI based on purchase history, Care Club participation, successful deliveries, reviews, fraud detection status, account verification, platform activity, and community contributions. Higher scores unlock premium features and future opportunities.' },
  { category: 'account', question: 'Is my money safe?', answer: 'Yes. VLOOP uses industry-standard encryption and security measures. Wallet 2 adds an extra layer with a 30-day holding period and insurance conditions. All transactions are logged and auditable.' },
];

type Props = {
  onNavigate?: (page: string) => void;
};

export default function FAQPage({ onNavigate }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: HelpCircle },
    { id: 'points', label: 'Points & Wallet', icon: Wallet },
    { id: 'smartcode', label: 'SmartCode', icon: Gift },
    { id: 'careclub', label: 'Care Club', icon: ShoppingBag },
    { id: 'account', label: 'Account & Security', icon: Shield },
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-teal-100 max-w-xl mx-auto">Find answers to common questions</p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-800 pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 mb-4">Can't find what you're looking for?</p>
          <button
            onClick={() => handleNavigate('contact')}
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
}
