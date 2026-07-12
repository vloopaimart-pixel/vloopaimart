/**
 * VLOOP Essential Services - Universal Daily Life Service Hub
 * Phase 7 — Premium Glass UI with VCOS Point Engine Integration
 *
 * Design: Premium Glass UI, Blue/White/Gold, Elder-friendly, Large touch buttons
 */

import { useState, useEffect } from 'react';
import {
  Zap, Droplets, Smartphone, Wifi, Flame, ShieldCheck, Car, Train,
  Building2, Stethoscope, FileText, Globe, Search, ChevronRight,
  Clock, CheckCircle2, AlertCircle, History, ArrowLeft, Sparkles,
  CreditCard, Receipt, AlertTriangle, Heart, Bot, Star, Repeat,
  Download, Bell, Settings, X, Wallet, TrendingUp, Gift, BadgeCheck,
  Bus, Plane, GraduationCap, Home, Landmark, Users, Phone
} from 'lucide-react';
import {
  getMockEssentialServices,
  getMockWalletA,
  formatCurrency,
  type EssentialService,
} from '../lib/WalletOperatingSystem';
import { AIAssistantMini } from '../components/AIAssistant';

type EssentialServicesPageProps = {
  onNavigate: (page: string) => void;
};

interface ServiceTransaction {
  id: string;
  service_code: string;
  service_name: string;
  amount: number;
  consumer_number: string;
  status: 'completed' | 'pending' | 'failed';
  smartpoints_earned: number;
  created_at: Date;
  receipt_id: string;
}

export default function EssentialServicesPage({ onNavigate }: EssentialServicesPageProps) {
  const [selectedService, setSelectedService] = useState<EssentialService | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [careClubContribution, setCareClubContribution] = useState(0);
  const [careClubEnabled, setCareClubEnabled] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['electricity', 'mobile-prepaid', 'broadband']);
  const [viewMode, setViewMode] = useState<'grid' | 'favorites' | 'history'>('grid');

  const wallet = getMockWalletA();
  const services = getMockEssentialServices();

  // Extended Service Categories - Phase 7
  const serviceCategories = [
    // Active Services
    { category: 'electricity', name: 'Electricity', icon: Zap, color: 'from-amber-400 to-amber-600', bgColor: 'bg-amber-50', active: true, description: 'Pay electricity bills' },
    { category: 'water', name: 'Water', icon: Droplets, color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-50', active: true, description: 'Water bill payment' },
    { category: 'mobile', name: 'Mobile Recharge', icon: Smartphone, color: 'from-green-400 to-emerald-600', bgColor: 'bg-green-50', active: true, description: 'Prepaid & Postpaid' },
    { category: 'broadband', name: 'Broadband', icon: Wifi, color: 'from-violet-400 to-purple-600', bgColor: 'bg-violet-50', active: true, description: 'Internet & Landline' },
    { category: 'dth', name: 'DTH Recharge', icon: Tv, color: 'from-indigo-400 to-indigo-600', bgColor: 'bg-indigo-50', active: true, description: 'TV & Entertainment' },
    { category: 'gas', name: 'LPG Gas', icon: Flame, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', active: true, description: 'Gas cylinder booking' },
    { category: 'fastag', name: 'FASTag', icon: Car, color: 'from-pink-400 to-rose-600', bgColor: 'bg-pink-50', active: true, description: 'Toll payment recharge' },
    { category: 'insurance', name: 'Insurance', icon: ShieldCheck, color: 'from-emerald-400 to-teal-600', bgColor: 'bg-emerald-50', active: true, description: 'Premium payments' },
    { category: 'metro', name: 'Metro Card', icon: Train, color: 'from-cyan-400 to-cyan-600', bgColor: 'bg-cyan-50', active: true, description: 'Metro card recharge' },
    { category: 'bus', name: 'Bus Pass', icon: Bus, color: 'from-slate-400 to-slate-600', bgColor: 'bg-slate-50', active: true, description: 'Bus pass renewal' },
    // Future Services
    { category: 'railway', name: 'Railway', icon: Train, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'Railway services', future: true },
    { category: 'government', name: 'Govt Fees', icon: Building2, color: 'from-gray-500 to-gray-700', bgColor: 'bg-gray-100', active: false, description: 'Government fees', future: true },
    { category: 'property', name: 'Property Tax', icon: Home, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'Property tax payment', future: true },
    { category: 'passport', name: 'Passport', icon: FileText, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'Passport services', future: true },
    { category: 'visa', name: 'Visa Services', icon: Globe, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'Visa applications', future: true },
    { category: 'healthcare', name: 'Healthcare', icon: Stethoscope, color: 'from-red-400 to-rose-600', bgColor: 'bg-red-50', active: false, description: 'Medical payments', future: true },
    { category: 'school', name: 'School Fees', icon: GraduationCap, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'School fee payment', future: true },
    { category: 'college', name: 'College Fees', icon: GraduationCap, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'College fee payment', future: true },
    { category: 'municipality', name: 'Municipality', icon: Landmark, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', active: false, description: 'Municipal services', future: true },
  ];

  // Recent Transactions (Mock)
  const recentTransactions: ServiceTransaction[] = [
    { id: 'tx1', service_code: 'electricity', service_name: 'Electricity Bill', amount: 2500, consumer_number: 'MSEB-123456', status: 'completed', smartpoints_earned: 5, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), receipt_id: 'RCP-001' },
    { id: 'tx2', service_code: 'mobile-prepaid', service_name: 'Mobile Recharge', amount: 299, consumer_number: '9876543210', status: 'completed', smartpoints_earned: 3, created_at: new Date(Date.now() - 72 * 60 * 60 * 1000), receipt_id: 'RCP-002' },
    { id: 'tx3', service_code: 'broadband', service_name: 'Broadband Bill', amount: 999, consumer_number: 'JIO-789012', status: 'completed', smartpoints_earned: 5, created_at: new Date(Date.now() - 168 * 60 * 60 * 1000), receipt_id: 'RCP-003' },
    { id: 'tx4', service_code: 'lpg-gas', service_name: 'LPG Gas', amount: 850, consumer_number: 'HP-456789', status: 'completed', smartpoints_earned: 5, created_at: new Date(Date.now() - 240 * 60 * 60 * 1000), receipt_id: 'RCP-004' },
  ];

  // Calculate SmartPoints for payment
  const calculatePoints = (amount: number): number => {
    return Math.floor(amount / 100) + 5; // Base 5 SP + 1 SP per ₹100
  };

  // Calculate Care Club bonus points
  const calculateCareClubBonus = (contribution: number): number => {
    return Math.floor(contribution / 10) * 5; // 5 SP per ₹10
  };

  const totalPoints = paymentAmount ? calculatePoints(parseFloat(paymentAmount) || 0) + (careClubEnabled ? calculateCareClubBonus(careClubContribution) : 0) : 0;

  const handlePayment = async () => {
    if (!consumerNumber || !paymentAmount) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowPayment(false);
      setSelectedService(null);
      setPaymentAmount('');
      setConsumerNumber('');
      setCareClubEnabled(false);
      setCareClubContribution(0);
    }, 4000);
  };

  const toggleFavorite = (serviceCode: string) => {
    setFavorites(prev =>
      prev.includes(serviceCode)
        ? prev.filter(f => f !== serviceCode)
        : [...prev, serviceCode]
    );
  };

  const repeatPayment = (tx: ServiceTransaction) => {
    const service = services.find(s => s.service_code === tx.service_code) || {
      id: tx.service_code,
      service_code: tx.service_code,
      service_name: tx.service_name,
      service_category: tx.service_code.split('-')[0],
      provider_name: null,
      provider_logo_url: null,
      country_code: 'IN',
      is_global: false,
      supported_countries: ['IN'],
      convenience_fee: 0,
      smartpoints_reward: tx.smartpoints_earned,
      is_active: true,
      display_order: 1,
    };
    setSelectedService(service);
    setConsumerNumber(tx.consumer_number);
    setPaymentAmount(tx.amount.toString());
    setShowPayment(true);
  };

  const activeCategories = serviceCategories.filter(c => c.active);
  const futureCategories = serviceCategories.filter(c => c.future);

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Premium Glass Header */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-400 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-300 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => onNavigate('home')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAI(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">AI Help</span>
              </button>
              <button onClick={() => onNavigate('wallet')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Wallet className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Header Content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-600/20 border border-amber-400/30 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Universal Daily Life Service Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Essential Services
            </h1>
            <p className="text-blue-200 text-lg">
              Pay bills, recharge, book services - all in one place
            </p>
          </div>

          {/* SmartPoints & Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Wallet Balance */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-200 text-sm">Wallet Balance</span>
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formatCurrency(wallet.smartpoints_balance * 4)}</div>
              <div className="text-blue-300 text-sm mt-1">{formatSmartPoints(wallet.smartpoints_balance)} SmartPoints</div>
            </div>

            {/* Today's Savings */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-200 text-sm">Points Earned Today</span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">+15 SP</div>
              <div className="text-blue-300 text-sm mt-1">3 transactions completed</div>
            </div>

            {/* Care Club */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-rose-500/20 to-pink-600/20 rounded-2xl p-5 border border-rose-400/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-rose-200 text-sm">Care Club Option</span>
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-white text-lg font-medium">Add contribution during payment</div>
              <div className="text-rose-300 text-sm mt-1">Earn bonus SmartPoints</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!showPayment ? (
          <>
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="Search for any service..."
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white shadow-lg border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                All Services
              </button>
              <button
                onClick={() => setViewMode('favorites')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  viewMode === 'favorites' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Star className="w-5 h-5" />
                Favorites
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  viewMode === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <History className="w-5 h-5" />
                History
              </button>
            </div>

            {viewMode === 'grid' && (
              <>
                {/* Active Services Grid */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    Pay Bills Instantly
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {activeCategories.map((category) => {
                      const Icon = category.icon;
                      const isFavorite = favorites.includes(category.category);
                      return (
                        <button
                          key={category.category}
                          onClick={() => {
                            const service = services.find(s => s.service_category === category.category);
                            if (service) {
                              setSelectedService(service);
                              setShowPayment(true);
                            }
                          }}
                          className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-blue-200"
                        >
                          {/* Favorite Star */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(category.category);
                            }}
                            className="absolute top-3 right-3 p-1 rounded-full"
                          >
                            <Star className={`w-5 h-5 ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                          </button>

                          {/* Icon */}
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-slate-800 text-center">{category.name}</h3>
                          <p className="text-sm text-slate-500 text-center mt-1">{category.description}</p>

                          {/* SmartPoints Badge */}
                          <div className="mt-3 flex items-center justify-center gap-1">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600">+5 SP</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Future Services - Coming Soon */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-slate-500" />
                    Coming Soon
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {futureCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.category}
                          className="relative bg-slate-50 rounded-3xl p-6 border border-slate-200 opacity-75"
                        >
                          {/* Coming Soon Badge */}
                          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                            Soon
                          </span>

                          {/* Icon */}
                          <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-8 h-8 text-slate-400" />
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-slate-600 text-center">{category.name}</h3>
                          <p className="text-sm text-slate-400 text-center mt-1">{category.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {viewMode === 'favorites' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  Your Favorite Services
                </h2>
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                    <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No favorites yet. Tap the star on any service to add it here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {activeCategories.filter(c => favorites.includes(c.category)).map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.category}
                          onClick={() => {
                            const service = services.find(s => s.service_category === category.category);
                            if (service) {
                              setSelectedService(service);
                              setShowPayment(true);
                            }
                          }}
                          className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border border-amber-200"
                        >
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-4`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-center">{category.name}</h3>
                          <div className="mt-3 flex items-center justify-center gap-1">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600">+5 SP</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'history' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <History className="w-6 h-6 text-emerald-600" />
                  Recent Payments
                </h2>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {recentTransactions.map((tx) => {
                    const category = serviceCategories.find(c => c.category === tx.service_code.split('-')[0]);
                    const Icon = category?.icon || Zap;
                    return (
                      <div key={tx.id} className="p-5 border-b border-slate-100 last:border-0 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${category?.bgColor || 'bg-slate-100'} flex items-center justify-center`}>
                            <Icon className="w-7 h-7 text-slate-700" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{tx.service_name}</h4>
                            <p className="text-sm text-slate-500">{tx.consumer_number}</p>
                            <p className="text-xs text-slate-400">{tx.created_at.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800 text-lg">{formatCurrency(tx.amount)}</div>
                          <div className="flex items-center justify-end gap-1 text-amber-600 text-sm">
                            <Sparkles className="w-4 h-4" />
                            +{tx.smartpoints_earned} SP
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => repeatPayment(tx)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              <Repeat className="w-3 h-3" />
                              Repeat
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium hover:bg-slate-100 transition-colors">
                              <Download className="w-3 h-3" />
                              Receipt
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Global Ready Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <Globe className="w-10 h-10 text-blue-200" />
                <div>
                  <h3 className="font-bold text-lg">Global Architecture Ready</h3>
                  <p className="text-blue-200">Services available for India, GCC, Europe, Canada, Australia, USA</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Payment Screen */
          <div className="max-w-lg mx-auto">
            {success ? (
              /* Success Animation */
              <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                {/* Animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                <p className="text-slate-600 mb-6">
                  {selectedService?.service_name} - {formatCurrency(parseFloat(paymentAmount))}
                </p>

                {/* SmartPoints Earned */}
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Sparkles className="w-8 h-8 text-amber-500" />
                    <span className="text-3xl font-bold text-amber-600">+{totalPoints}</span>
                    <span className="text-xl text-amber-700">SmartPoints</span>
                  </div>
                  <p className="text-sm text-amber-600">
                    {careClubEnabled && `Including ${calculateCareClubBonus(careClubContribution)} SP Care Club bonus`}
                  </p>
                </div>

                {/* Digital Receipt */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-sm">Receipt ID</span>
                    <span className="font-mono text-slate-800 font-medium">RCP-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-sm">Consumer</span>
                    <span className="text-slate-800 font-medium">{consumerNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Date</span>
                    <span className="text-slate-800 font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setShowPayment(false);
                      setSelectedService(null);
                    }}
                    className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setPaymentAmount('');
                      setConsumerNumber('');
                    }}
                    className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Pay Again
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Form */
              <>
                {/* Back Button */}
                <button
                  onClick={() => { setShowPayment(false); setSelectedService(null); }}
                  className="flex items-center gap-2 text-slate-600 mb-4 hover:text-slate-900 text-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Services
                </button>

                {/* Payment Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Zap className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedService?.service_name}</h2>
                        <p className="text-blue-200">Pay your bill instantly</p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="p-6 space-y-5">
                    {/* Consumer Number */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Consumer Number / Account ID
                      </label>
                      <input
                        type="text"
                        value={consumerNumber}
                        onChange={(e) => setConsumerNumber(e.target.value)}
                        placeholder="Enter your account number"
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg"
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-2xl">₹</span>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="0"
                          className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-3xl font-bold"
                        />
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 2000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setPaymentAmount(amt.toString())}
                          className="py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    {/* Care Club Contribution */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">Add Care Club Contribution</h4>
                            <p className="text-sm text-slate-500">Support the community</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCareClubEnabled(!careClubEnabled)}
                          className={`w-14 h-8 rounded-full transition-colors ${careClubEnabled ? 'bg-rose-500' : 'bg-slate-200'}`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${careClubEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {careClubEnabled && (
                        <div className="mt-4 space-y-3">
                          <div className="grid grid-cols-4 gap-2">
                            {[10, 50, 100, 500].map((amt) => (
                              <button
                                key={amt}
                                onClick={() => setCareClubContribution(amt)}
                                className={`py-2 rounded-lg font-medium transition-colors ${
                                  careClubContribution === amt
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-white text-slate-600 hover:bg-rose-100'
                                }`}
                              >
                                ₹{amt}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Bonus SmartPoints</span>
                            <span className="font-bold text-rose-600">+{calculateCareClubBonus(careClubContribution)} SP</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SmartPoints Summary */}
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-8 h-8 text-amber-500" />
                          <div>
                            <h4 className="font-bold text-slate-800">SmartPoints You'll Earn</h4>
                            <p className="text-sm text-amber-600">Added to Wallet-1 after 30-day VCOS Lock</p>
                          </div>
                        </div>
                        <span className="text-3xl font-bold text-amber-600">+{totalPoints}</span>
                      </div>
                    </div>

                    {/* Pay Button - Large for Elder */}
                    <button
                      onClick={handlePayment}
                      disabled={processing || !consumerNumber || !paymentAmount}
                      className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      {processing ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay {paymentAmount ? formatCurrency(parseFloat(paymentAmount) + (careClubEnabled ? careClubContribution : 0)) : 'Now'}
                          <ChevronRight className="w-6 h-6" />
                        </>
                      )}
                    </button>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Your payment is secure and encrypted</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setShowAI(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-slate-800">AI Service Helper</span>
              </div>
              <button onClick={() => setShowAI(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
              <p className="text-slate-600 mb-4">Try saying:</p>
              {[
                "Recharge my mobile",
                "Pay electricity bill",
                "Book LPG gas cylinder",
                "Pay broadband bill",
                "Check my payment history",
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => setShowAI(false)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      {!showPayment && !showAI && (
        <button
          onClick={() => setShowAI(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// Missing icon component
function Tv({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

function formatSmartPoints(points: number): string {
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
  return `${points}`;
}
