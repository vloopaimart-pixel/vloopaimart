import React from 'react';
import {
  Home, Car, TreePine, GraduationCap, Heart, Tractor,
  Users, Rocket, Globe, Clock, ArrowRight, Sparkles
} from 'lucide-react';

type Props = {
  onNavigate?: (page: string) => void;
};

interface FutureProject {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'coming_soon' | 'planning' | 'development';
  color: string;
}

const projects: FutureProject[] = [
  { icon: <Home className="w-8 h-8" />, title: 'Affordable Housing', description: 'Access to affordable housing projects for verified members. Build your dream home with VLOOP support.', status: 'coming_soon', color: 'teal' },
  { icon: <TreePine className="w-8 h-8" />, title: 'Land Projects', description: 'Investment opportunities in land development. Secure your piece of land through VLOOP partnerships.', status: 'planning', color: 'green' },
  { icon: <Car className="w-8 h-8" />, title: 'Vehicle Projects', description: 'Vehicle financing and assistance programs. From two-wheelers to four-wheelers, drive your dreams.', status: 'coming_soon', color: 'blue' },
  { icon: <Sparkles className="w-8 h-8" />, title: 'EV Projects', description: 'Electric vehicle initiatives for sustainable mobility. Join the green revolution with VLOOP EV.', status: 'planning', color: 'emerald' },
  { icon: <GraduationCap className="w-8 h-8" />, title: 'Education Support', description: 'Scholarship and education loan assistance. Empowering futures through educational support.', status: 'coming_soon', color: 'purple' },
  { icon: <Heart className="w-8 h-8" />, title: 'Healthcare Support', description: 'Healthcare assistance and insurance partnerships. Your health, our priority.', status: 'planning', color: 'pink' },
  { icon: <Tractor className="w-8 h-8" />, title: 'Farmer Support', description: 'Agricultural support programs for farmers. Empowering those who feed the nation.', status: 'coming_soon', color: 'amber' },
  { icon: <Users className="w-8 h-8" />, title: 'Women Entrepreneurship', description: 'Special programs for women entrepreneurs. Supporting women-led businesses.', status: 'planning', color: 'rose' },
  { icon: <Rocket className="w-8 h-8" />, title: 'Startup Support', description: 'Incubation and support for startups. Turn your ideas into reality with VLOOP.', status: 'coming_soon', color: 'indigo' },
  { icon: <Globe className="w-8 h-8" />, title: 'Global Expansion', description: 'International market access and partnerships. Go global with VLOOP.', status: 'planning', color: 'cyan' },
];

export default function FutureProjectsPage({ onNavigate }: Props) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Future Projects</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Building tomorrow's opportunities today. Explore what's coming next.
          </p>
        </div>
      </section>

      {/* Notice */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Information Only - No Active Business Logic</span>
            </div>
            <p className="text-amber-700 text-sm mt-2">
              These projects are in development. Availability and features may change.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const colorStyles = {
                teal: 'bg-teal-100 text-teal-600 border-teal-200 hover:border-teal-400',
                green: 'bg-green-100 text-green-600 border-green-200 hover:border-green-400',
                blue: 'bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-400',
                emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-400',
                purple: 'bg-purple-100 text-purple-600 border-purple-200 hover:border-purple-400',
                pink: 'bg-pink-100 text-pink-600 border-pink-200 hover:border-pink-400',
                amber: 'bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-400',
                rose: 'bg-rose-100 text-rose-600 border-rose-200 hover:border-rose-400',
                indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-400',
                cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200 hover:border-cyan-400',
              } as const;
              const style = colorStyles[project.color as keyof typeof colorStyles] || colorStyles.teal;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl border ${style} hover:shadow-lg transition-all p-6`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${style.split(' ')[0]}`}>
                    {project.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'coming_soon'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {project.status === 'coming_soon' ? 'Coming Soon' : 'Planning'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Score */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Build Your Eligibility</h2>
            <p className="text-slate-600 mb-6">
              Future project eligibility will be determined by your Trust Score,
              Care Club participation, and platform engagement.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="font-semibold text-teal-600">Trust Score</p>
                <p className="text-xs text-slate-500">Build through activity</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="font-semibold text-emerald-600">Care Club</p>
                <p className="text-xs text-slate-500">Contribute regularly</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-600">Transactions</p>
                <p className="text-xs text-slate-500">Stay active</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('dashboard')}
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              View Your Dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 mb-4">
            Stay updated on project announcements and early access opportunities.
          </p>
          <button
            onClick={() => handleNavigate('contact')}
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Contact us for updates
          </button>
        </div>
      </section>
    </div>
  );
}
