import { useState, useEffect } from 'react';
import {
  Home, Map, Building2, Building, Zap, Car, Coins,
  GraduationCap, HeartPulse, Users, Rocket, Clock,
  Star, ChevronRight, ChevronLeft, Shield, AlertCircle,
  Award, CheckCircle, HelpCircle, Info, ExternalLink,
  TrendingUp, Calendar, Target, Eye, FileText, Bell
} from 'lucide-react';
import {
  FutureProject,
  ProjectFAQ,
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  getFutureProjectByCode,
  getProjectFAQs,
  getStatusBadgeColor,
  formatDuration,
} from '../lib/FutureOpportunitiesEngine';
import Footer from '../components/Footer';

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
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

const PROJECT_IMAGES: Record<string, string> = {
  affordable_housing: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
  land_projects: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200',
  villa_projects: 'https://images.pexels.com/photos/350988/pexels-photo-350988.jpeg?auto=compress&cs=tinysrgb&w=1200',
  apartment_projects: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ev_programs: 'https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=1200',
  vehicle_programs: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
  gold_programs: 'https://images.pexels.com/photos/4664246/pexels-photo-4664246.jpeg?auto=compress&cs=tinysrgb&w=1200',
  education_support: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200',
  healthcare_support: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1200',
  community_development: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
  future: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const DEFAULT_FAQS = [
  {
    question: 'How do I participate in this project?',
    answer: 'Participation will open when the project status changes to "Open for Participation". You can express interest now to receive notifications.',
    category: 'participation',
  },
  {
    question: 'What are the SmartPoints requirements?',
    answer: 'Each project has minimum participation unit requirements displayed on the project page. You can allocate your earned SmartPoints when participation opens.',
    category: 'smartpoints',
  },
  {
    question: 'Is my participation guaranteed?',
    answer: 'Participation is subject to VCOS eligibility rules, verification requirements, and availability. Please review the terms and conditions carefully.',
    category: 'eligibility',
  },
  {
    question: 'When will the project launch?',
    answer: 'The expected launch date is shown on each project. Specific dates may change based on project development progress.',
    category: 'timeline',
  },
  {
    question: 'Are SmartPoints refundable?',
    answer: 'SmartPoints allocation follows VCOS rules. Please review the specific terms and conditions for each project before participating.',
    category: 'legal',
  },
];

interface FutureProjectDetailsPageProps {
  projectCode?: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function FutureProjectDetailsPage({ projectCode, onNavigate }: FutureProjectDetailsPageProps) {
  const [project, setProject] = useState<FutureProject | null>(null);
  const [faqs, setFaqs] = useState<ProjectFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    async function loadProject() {
      const code = projectCode || 'HOUSING-2027-001'; // Default fallback
      try {
        const [projectData, faqData] = await Promise.all([
          getFutureProjectByCode(code),
          getProjectFAQs(),
        ]);
        setProject(projectData);
        setFaqs(faqData.length > 0 ? faqData : DEFAULT_FAQS.map((f, i) => ({
          id: `faq-${i}`,
          question: f.question,
          answer: f.answer,
          category: f.category as ProjectFAQ['category'],
          display_order: i,
        })));
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 mb-6">This project does not exist or has been removed.</p>
          <button
            onClick={() => onNavigate('future-opportunities')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Future Opportunities
          </button>
        </div>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[project.project_category] || Rocket;
  const imageUrl = PROJECT_IMAGES[project.project_category];

  const objectives = project.objectives && project.objectives.length > 0
    ? project.objectives
    : [
      'Provide premium opportunities for VLOOP members',
      'Ensure transparent and fair participation process',
      'Deliver long-term value through sustainable initiatives',
      'Enable community growth and development',
    ];

  const eligibility = project.eligibility && Object.keys(project.eligibility).length > 0
    ? project.eligibility
    : {
      minimum_smartpoints: project.min_participation_units,
      membership_duration: '30 days',
      kyc_verified: 'Required',
      trust_score: 'Minimum 300',
    };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={project.project_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('future-opportunities')}
            className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur text-white rounded-xl hover:bg-slate-700 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {/* Status Badge */}
          <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(project.status)} text-white`}>
            {PROJECT_STATUS_LABELS[project.status]}
          </div>

          {/* Title */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{project.project_name}</h1>
              <p className="text-slate-300">{PROJECT_CATEGORY_LABELS[project.project_category]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Project Overview
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {project.full_description || project.short_description}
              </p>
            </section>

            {/* Vision */}
            <section className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Vision
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {project.vision || 'To create lasting value and opportunities for VLOOP members through sustainable, transparent, and innovative initiatives that benefit both individuals and communities.'}
              </p>
            </section>

            {/* Objectives */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Objectives
              </h2>
              <ul className="space-y-3">
                {objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Eligibility */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Eligibility
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(eligibility).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                    <span className="text-slate-400 text-sm">{key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                    <span className="text-white font-medium text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Participation Rules */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Participation Rules
              </h2>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Minimum participation unit: {project.min_participation_units} SmartPoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Maximum participation per member: {project.max_participation_units} units</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Total available units: {project.total_available_units}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Subject to VCOS eligibility verification</span>
                </li>
              </ul>
            </section>

            {/* AI Transparency Section */}
            <section className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                AI Transparency
              </h2>
              <p className="text-slate-300 mb-6">
                VLOOP uses AI to ensure fair, transparent, and efficient project operations.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Verified</p>
                  <p className="text-slate-400 text-xs">AI Fraud Detection</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">100%</p>
                  <p className="text-slate-400 text-xs">Transparency Score</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Audited</p>
                  <p className="text-slate-400 text-xs">Independent Review</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="border border-slate-700/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
                    >
                      <span className="text-white font-medium pr-4">{faq.question}</span>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${selectedFaq === index ? 'rotate-90' : ''}`} />
                    </button>
                    {selectedFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-slate-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Legal Information */}
            <section className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-white mb-4">Legal Information</h2>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Participation in Future Opportunity Projects is subject to VCOS Terms & Conditions.</p>
                <p>SmartPoints allocation, project timelines, and benefits are determined by VLOOP policies.</p>
                <p>Please review the complete terms before expressing interest or participating.</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={() => onNavigate('terms')} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  Terms & Conditions
                </button>
                <button onClick={() => onNavigate('privacy')} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  Privacy Policy
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Project Stats Card */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-6">Project Details</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Expected Launch
                  </span>
                  <span className="text-white font-medium">
                    {project.expected_launch ? new Date(project.expected_launch).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'TBA'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="text-white font-medium">
                    {formatDuration(project.estimated_duration_months)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Min. Unit
                  </span>
                  <span className="text-white font-medium">{project.min_participation_units} SP</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Units
                  </span>
                  <span className="text-white font-medium">{project.total_available_units.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Unit Value
                  </span>
                  <span className="text-white font-medium">{project.unit_value_smartpoints} SP</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Project Progress</span>
                  <span className="text-white">--</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center py-3 bg-slate-700/30 rounded-xl">
                    <p className="text-2xl font-bold text-white">--</p>
                    <p className="text-slate-400 text-xs">Participants</p>
                  </div>
                  <div className="text-center py-3 bg-slate-700/30 rounded-xl">
                    <p className="text-2xl font-bold text-white">--</p>
                    <p className="text-slate-400 text-xs">Units Allocated</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsInterested(!isInterested)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isInterested
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {isInterested ? 'Interest Expressed' : 'Express Interest'}
                </button>

                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-600/50 text-slate-400 rounded-xl font-semibold cursor-not-allowed"
                >
                  <Rocket className="w-5 h-5" />
                  Join Project (Coming Soon)
                </button>
              </div>

              <p className="text-center text-slate-500 text-xs mt-4">
                Participation opens in Phase 47
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
