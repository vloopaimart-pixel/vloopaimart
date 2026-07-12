import { useState, useEffect } from 'react';
import {
  Home, Map, Building2, Building, Zap, Car, Coins,
  GraduationCap, HeartPulse, Users, Rocket, Clock,
  Star, ChevronRight, Sparkles, TrendingUp, Shield,
  Award, Gift, Wallet, Info, Bell
} from 'lucide-react';
import {
  FutureProject,
  ParticipationUnit,
  ProjectCategory,
  ProjectStatus,
  UnitTier,
  PROJECT_CATEGORY_ICONS,
  PROJECT_STATUS_LABELS,
  getFutureProjects,
  getParticipationUnits,
  getStatusBadgeColor,
  getTierGradient,
  formatDate,
  formatDuration,
} from '../lib/FutureOpportunitiesEngine';

const CATEGORY_ICONS: Record<ProjectCategory, React.FC<{ className?: string }>> = {
  affordable_housing: Home,
  land_projects: Map,
  villa_projects: Building2,
  apartment_projects: Building,
  ev_programs: Zap,
  vehicle_programs: Car,
  gold_programs: Coins,
  education_support: GraduationCap,
  healthcare_support: HeartPulse,
  community_development: Users,
  future: Rocket,
};

const PROJECT_IMAGES: Record<ProjectCategory, string> = {
  affordable_housing: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
  land_projects: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
  villa_projects: 'https://images.pexels.com/photos/350988/pexels-photo-350988.jpeg?auto=compress&cs=tinysrgb&w=800',
  apartment_projects: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
  ev_programs: 'https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=800',
  vehicle_programs: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
  gold_programs: 'https://images.pexels.com/photos/4664246/pexels-photo-4664246.jpeg?auto=compress&cs=tinysrgb&w=800',
  education_support: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
  healthcare_support: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=800',
  community_development: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
  future: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
};

interface FutureOpportunitiesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function FutureOpportunitiesPage({ onNavigate }: FutureOpportunitiesPageProps) {
  const [projects, setProjects] = useState<FutureProject[]>([]);
  const [units, setUnits] = useState<ParticipationUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, unitsData] = await Promise.all([
          getFutureProjects({ status: ['coming_soon', 'open', 'active'] }),
          getParticipationUnits(),
        ]);
        setProjects(projectsData);
        setUnits(unitsData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.project_category === activeCategory);

  const featuredProjects = projects.filter((p) => p.is_featured);

  const defaultUnits = [
    { smartpoints: 100, tier: 'standard' as UnitTier, name: '100 SmartPoints Unit' },
    { smartpoints: 250, tier: 'silver' as UnitTier, name: '250 SmartPoints Unit' },
    { smartpoints: 500, tier: 'gold' as UnitTier, name: '500 SmartPoints Unit' },
    { smartpoints: 1000, tier: 'platinum' as UnitTier, name: '1000 SmartPoints Unit' },
  ];

  const displayUnits = units.length > 0 ? units : defaultUnits.map((u, i) => ({
    id: `unit-${i}`,
    unit_code: `UNIT-${u.smartpoints}`,
    unit_name: u.name,
    smartpoints_required: u.smartpoints,
    tier: u.tier,
    description: '',
    color_theme: 'blue',
    benefits: [],
    display_order: i,
  }));

  const categories: { key: ProjectCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'affordable_housing', label: 'Housing' },
    { key: 'land_projects', label: 'Land' },
    { key: 'ev_programs', label: 'EV' },
    { key: 'gold_programs', label: 'Gold' },
    { key: 'education_support', label: 'Education' },
    { key: 'healthcare_support', label: 'Healthcare' },
  ];

  const handleProjectClick = (projectCode: string) => {
    onNavigate('future-project-details', { projectCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Enterprise Experience Center</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              VLOOP Future Opportunities
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Turn your SmartPoints into Future Opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25">
                <Rocket className="w-5 h-5" />
                Explore Projects
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-all">
                <Info className="w-5 h-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SmartPoints Information */}
      <section className="py-12 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Purchase SmartPoints</p>
                  <p className="text-2xl font-bold text-white">-- SP</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Earned through purchases at VLOOP partner stores.</p>
            </div>

            <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Care Club SmartPoints</p>
                  <p className="text-2xl font-bold text-white">-- SP</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Earned through Care Club contributions.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total SmartPoints</p>
                  <p className="text-2xl font-bold text-white">-- SP</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Available for Future Opportunity participation.</p>
            </div>
          </div>

          <div className="mt-6 bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 text-sm">
              SmartPoints earned through Purchases and Care Club Contributions may be allocated to eligible Future Opportunity Projects according to VCOS Rules.
            </p>
          </div>
        </div>
      </section>

      {/* AI Recommendations Panel */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600/10 via-slate-800/50 to-cyan-600/10 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
                <p className="text-slate-400 mb-4">
                  Based on your SmartPoints, activity level and VCOS Trust Score, these Future Opportunity Projects may be suitable for you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredProjects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleProjectClick(project.project_code)}
                      className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        {(() => {
                          const Icon = CATEGORY_ICONS[project.project_category];
                          return <Icon className="w-5 h-5 text-blue-400" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{project.project_name}</p>
                        <p className="text-slate-400 text-xs">{project.min_participation_units} SP minimum</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Categories Filter */}
      <section className="py-6 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Future Opportunity Projects</h2>
              <p className="text-slate-400 mt-1">Discover projects aligned with your goals</p>
            </div>
            <div className="text-slate-400 text-sm">
              {filteredProjects.length} projects available
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-slate-700/50 rounded-2xl h-[400px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project.project_code)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Participation Units Preview */}
      <section className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Participation Units Preview</h2>
            <p className="text-slate-400">Premium digital units for Future Opportunity participation</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {displayUnits.map((unit, index) => (
              <ParticipationUnitCard key={unit.id || index} unit={unit} />
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Preview only. Generation will be activated in Phase 47.
          </p>
        </div>
      </section>

      {/* Live Transparency Dashboard */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Live Transparency</h2>
            <p className="text-slate-400">Real-time project progress and verification</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: TrendingUp, label: 'Project Progress', value: '--' },
              { icon: Users, label: 'Participants', value: '--' },
              { icon: Award, label: 'Participation Units', value: '--' },
              { icon: Gift, label: 'Remaining Units', value: '--' },
              { icon: Shield, label: 'AI Verification', value: '--' },
              { icon: Star, label: 'Transparency Score', value: '--' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 text-center">
                <item.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Backend connection coming soon
          </p>
        </div>
      </section>

      {/* Customer Dashboard Summary */}
      <section className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Your Future Opportunities Dashboard</h2>
            <p className="text-slate-400">Track your project interests and participation</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Available Projects', value: projects.length, color: 'blue' },
              { label: 'Interested Projects', value: '--', color: 'amber' },
              { label: 'Pending Projects', value: '--', color: 'purple' },
              { label: 'Coming Soon', value: projects.filter((p) => p.status === 'coming_soon').length, color: 'emerald' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">{item.label}</p>
                <p className={`text-3xl font-bold text-${item.color}-400`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Notification */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
            <Bell className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-slate-400 mb-6">
              Get notified when new Future Opportunity Projects become available for participation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, onClick }: { project: FutureProject; onClick: () => void }) {
  const Icon = CATEGORY_ICONS[project.project_category];
  const imageUrl = PROJECT_IMAGES[project.project_category];

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={project.project_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)} text-white`}>
          {PROJECT_STATUS_LABELS[project.status]}
        </div>

        {/* Featured Badge */}
        {project.is_featured && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {project.project_name}
            </h3>
            <p className="text-slate-400 text-sm">{PROJECT_ICONS[project.project_category]}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {project.short_description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Expected Launch:</span>
            <span className="text-white">{formatDate(project.expected_launch?.toString())}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Min. Unit:</span>
            <span className="text-white">{project.min_participation_units} SP</span>
          </div>
        </div>

        {/* Progress Bar Placeholder */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Project Progress</span>
            <span>--</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between text-blue-400 font-medium">
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

// Participation Unit Card Component
function ParticipationUnitCard({ unit }: { unit: ParticipationUnit }) {
  return (
    <div className="group relative">
      <div className={`${getTierGradient(unit.tier)} rounded-2xl p-6 text-center transition-transform hover:scale-105`}>
        {/* Tier Badge */}
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-white text-xs font-medium mb-3">
          <Star className="w-3 h-3" />
          {unit.tier.charAt(0).toUpperCase() + unit.tier.slice(1)} Tier
        </div>

        {/* Points */}
        <div className="mb-4">
          <p className="text-5xl font-bold text-white mb-1">{unit.smartpoints_required}</p>
          <p className="text-white/70 text-sm">SmartPoints</p>
        </div>

        {/* Name */}
        <p className="text-white font-medium">{unit.unit_name}</p>

        {/* Premium Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
      </div>
    </div>
  );
}

// Helper
const PROJECT_ICONS: Record<ProjectCategory, string> = {
  affordable_housing: 'Housing Initiative',
  land_projects: 'Land Development',
  villa_projects: 'Villa Community',
  apartment_projects: 'Premium Apartments',
  ev_programs: 'Electric Vehicles',
  vehicle_programs: 'Vehicle Program',
  gold_programs: 'Gold Savings',
  education_support: 'Education Support',
  healthcare_support: 'Healthcare Support',
  community_development: 'Community Development',
  future: 'Future Project',
};
