import React from 'react';
import {
  Heart, Shield, Users, Target, Globe, Award, Sparkles,
  CheckCircle, ArrowRight, Zap, Leaf, Handshake
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

export default function AboutPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About VLOOP</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Building a global ecosystem that empowers communities through innovation,
              trust, and sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                To create a transparent, community-driven platform where every purchase
                contributes to building trust, rewarding participation, and enabling
                sustainable growth for individuals, merchants, and partners worldwide.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed">
                A world where economic opportunities are accessible to everyone,
                where trust is built through transparent systems, and where communities
                thrive through shared value creation and mutual support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Ecosystem */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">The VLOOP Global Ecosystem</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              An integrated platform connecting customers, merchants, and partners
              through innovative technology and community-driven values.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Customers</h3>
              <p className="text-slate-600">
                Earn SmartPoints on every purchase, participate in weekly SmartCode challenges,
                and access Care Club benefits.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Merchants</h3>
              <p className="text-slate-600">
                Grow your business with our global marketplace, private label opportunities,
                and partner ecosystem.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Partners</h3>
              <p className="text-slate-600">
                Join as a District, State, or Global Partner and build your network
                while earning rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do at VLOOP.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Trust</h3>
              <p className="text-sm text-slate-600">
                Building systems that earn and maintain trust through transparency and reliability.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Community</h3>
              <p className="text-sm text-slate-600">
                Empowering communities to grow together through shared value and mutual support.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Innovation</h3>
              <p className="text-sm text-slate-600">
                Continuously improving our platform with AI-powered solutions and smart technology.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Sustainability</h3>
              <p className="text-sm text-slate-600">
                Creating long-term value for all stakeholders through sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Story */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Journey</h2>
            <p className="text-slate-600">
              From a vision to a global ecosystem.
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                1.0
              </div>
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Foundation</h3>
                <p className="text-slate-600 text-sm">
                  Building the core platform with universal point engine, marketplace,
                  and SmartCode challenge system.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                2.0
              </div>
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Enterprise Growth</h3>
                <p className="text-slate-600 text-sm">
                  Expanding with private label brands, global logistics, seller ecosystem,
                  and AI-powered systems.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                3.0
              </div>
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Global Expansion</h3>
                <p className="text-slate-600 text-sm">
                  Launching future projects: affordable housing, EV initiatives,
                  healthcare support, and global partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Join the VLOOP Ecosystem</h2>
            <p className="text-teal-100 mb-6">
              Start earning SmartPoints today and become part of a growing community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleNavigate('marketplace')}
                className="inline-flex items-center px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
              >
                Explore Marketplace
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigate('smartcode-info')}
                className="inline-flex items-center px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors"
              >
                Learn About SmartCode
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
