import { Home, MapPin, Car, Zap, ArrowRight } from 'lucide-react';
import { futureProjects } from '../lib/data';

const iconMap: Record<string, any> = {
  Home, MapPin, Car, Zap,
};

export default function FuturePage() {
  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-vloop-700 to-vloop-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-4">
            <Zap size={16} className="text-gold-400" />
            <span className="text-sm font-medium text-gold-100">Coming Soon</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Future Projects</h1>
          <p className="text-vloop-200 text-base max-w-2xl">
            VLOOP AI MART is building beyond shopping. Our upcoming projects aim to make essential life assets accessible to every member.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {futureProjects.map((project) => {
            const Icon = iconMap[project.icon] || Home;
            return (
              <div key={project.title} className="relative overflow-hidden rounded-2xl bg-white shadow-card-hover group">
                <div className={`h-2 bg-gradient-to-r ${project.color}`} />
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={30} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-display mb-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.desc}</p>
                  <div className="flex items-center gap-2 text-vloop-600 font-semibold text-sm">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-xs font-bold">
                  Upcoming
                </div>
              </div>
            );
          })}
        </div>

        {/* Vision section */}
        <div className="rounded-2xl bg-gradient-to-br from-vloop-700 to-vloop-950 p-8 text-white">
          <h2 className="text-2xl font-bold font-display mb-3">Our Vision</h2>
          <p className="text-vloop-200 leading-relaxed mb-6 max-w-3xl">
            VLOOP AI MART started as a shopping benefits ecosystem, but our vision extends far beyond.
            We're building a comprehensive platform that helps members access affordable housing, land, vehicles, and electric vehicles —
            all integrated with the VLOOP points and wallet system. Every purchase you make today contributes to a better tomorrow.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '10K+', label: 'Target Members' },
              { value: '4', label: 'Future Projects' },
              { value: '100%', label: 'Transparent' },
              { value: '2026', label: 'Launch Year' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gold-400 font-display">{stat.value}</div>
                <div className="text-xs text-vloop-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
