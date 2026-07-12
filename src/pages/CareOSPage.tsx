import { useState } from 'react';
import {
  ArrowLeft, Utensils, HeartPulse, Siren, Briefcase, Users, TrendingUp,
  Brain, Stethoscope, GraduationCap, PhoneCall, Calendar,
  ShieldCheck, Award, MapPin, CheckCircle2, Clock,
  Building2, Star, ChevronRight, HandHeart, Sparkles,
} from 'lucide-react';
import {
  careMetrics, foodBankStats, mentalHealthSupport, disasterResponse,
  jobListings, skillToJobStats,
} from '../lib/academyMockData';

type Props = { onNavigate: (page: string, params?: Record<string, string>) => void };
type TabId = 'overview' | 'food' | 'mental' | 'disaster' | 'jobs';

const iconMap: Record<string, any> = {
  Utensils, HeartPulse, Siren, Briefcase, Users, TrendingUp,
  Brain, Stethoscope, GraduationCap, PhoneCall,
};

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: Users },
  { id: 'food', label: 'Food Bank', icon: Utensils },
  { id: 'mental', label: 'Mental Health', icon: HeartPulse },
  { id: 'disaster', label: 'Disaster Response', icon: Siren },
  { id: 'jobs', label: 'Skill to Job', icon: Briefcase },
];

export default function CareOSPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('home')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-500 to-vloop-600 flex items-center justify-center">
              <HandHeart size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">Care OS Dashboard</h1>
              <p className="text-xs text-gray-500">Phase 15 · Community care & support system</p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white rounded-2xl shadow-card p-2 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-vloop-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === 'food' && <FoodBankTab />}
        {activeTab === 'mental' && <MentalHealthTab />}
        {activeTab === 'disaster' && <DisasterTab />}
        {activeTab === 'jobs' && <JobsTab />}
      </div>
    </div>
  );
}

// ============================================================
// OVERVIEW
// ============================================================
function OverviewTab({ setActiveTab }: { setActiveTab: (t: TabId) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-success-500 to-vloop-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-white/80" />
            <span className="text-sm text-white/80">Care OS Status</span>
          </div>
          <h2 className="text-3xl font-bold font-display mb-1">Making an Impact Together</h2>
          <p className="text-white/70 text-sm">Your community care initiatives are actively running.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {careMetrics.map((m) => {
          const Icon = iconMap[m.icon] || Users;
          return (
            <button
              key={m.id}
              onClick={() => {
                const tabMap: Record<string, TabId> = { food: 'food', mental: 'mental', disaster: 'disaster', skill: 'jobs' };
                setActiveTab(tabMap[m.id] || 'overview');
              }}
              className="bg-white rounded-2xl shadow-card p-5 text-left hover:shadow-card-hover transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 font-display">{m.value}</div>
              <div className="text-sm font-medium text-gray-700">{m.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// FOOD BANK
// ============================================================
function FoodBankTab() {
  const { mealsSponsored, mealsDelivered, familiesHelped, liveCounter, donationGoal, donationCurrent } = foodBankStats;
  const donationPct = Math.round((donationCurrent / donationGoal) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Utensils} label="Meals Sponsored" value={mealsSponsored.toLocaleString()} color="from-success-500 to-success-700" />
        <StatCard icon={CheckCircle2} label="Meals Delivered" value={mealsDelivered.toLocaleString()} color="from-vloop-500 to-vloop-700" />
        <StatCard icon={Users} label="Families Helped" value={familiesHelped.toLocaleString()} color="from-gold-400 to-gold-600" />
        <StatCard icon={TrendingUp} label="Live Impact Counter" value={`+${liveCounter}`} color="from-pink-400 to-pink-600" live />
      </div>

      {/* Donation progress */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><HandHeart size={18} className="text-success-600" /> Donation Progress</h3>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">₹{donationCurrent.toLocaleString()} raised</span>
          <span className="text-gray-400">Goal: ₹{donationGoal.toLocaleString()}</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-success-500 to-success-700 rounded-full transition-all" style={{ width: `${donationPct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-success-600">{donationPct}% funded</span>
          <button className="px-5 py-2 bg-success-500 text-white text-sm font-semibold rounded-lg hover:bg-success-600 transition-colors">
            Donate Now
          </button>
        </div>
      </div>

      {/* Impact summary */}
      <div className="bg-gradient-to-br from-success-50 to-vloop-50 rounded-2xl p-6 border border-success-200">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-success-600" /> Your Impact</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 font-display">{familiesHelped}</div>
            <div className="text-sm text-gray-600">Families supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-vloop-600 font-display">{Math.round(mealsDelivered / familiesHelped)}</div>
            <div className="text-sm text-gray-600">Avg meals per family</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-600 font-display">98%</div>
            <div className="text-sm text-gray-600">Delivery success rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MENTAL HEALTH
// ============================================================
function MentalHealthTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold font-display mb-1">Mental Health Support</h2>
          <p className="text-white/70 text-sm">Professional support is available. You're not alone.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {mentalHealthSupport.map((support) => {
          const Icon = iconMap[support.icon] || HeartPulse;
          return (
            <div key={support.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${support.color} flex items-center justify-center shrink-0`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{support.title}</h3>
                  <span className="text-xs text-success-600 font-medium">{support.available}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{support.desc}</p>
              <button className="w-full py-2.5 bg-vloop-600 text-white text-sm font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center justify-center gap-2">
                <Calendar size={16} /> Book Appointment
              </button>
            </div>
          );
        })}
      </div>

      {/* Emergency banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
          <PhoneCall size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-red-700">24/7 Crisis Helpline</h3>
          <p className="text-sm text-red-600">If you need immediate support, call our crisis line.</p>
        </div>
        <button className="px-5 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">
          Call Now
        </button>
      </div>
    </div>
  );
}

// ============================================================
// DISASTER RESPONSE
// ============================================================
function DisasterTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status banner */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-white/80" />
              <span className="text-sm text-white/80">Volunteer Status</span>
            </div>
            <h2 className="text-2xl font-bold font-display">{disasterResponse.badge}</h2>
            <p className="text-white/70 text-sm mt-1">Training: {disasterResponse.trainingStatus}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold font-display">{disasterResponse.trainingProgress}%</div>
            <div className="text-sm text-white/70">Training Complete</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Emergency contact */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><PhoneCall size={18} className="text-red-500" /> Emergency Contact</h3>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="text-2xl font-bold text-red-600 font-display">{disasterResponse.emergencyContact}</div>
            <div className="text-xs text-gray-500 mt-1">Available 24/7 for disaster emergencies</div>
          </div>
          <button className="w-full mt-3 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <PhoneCall size={16} /> Call Emergency
          </button>
        </div>

        {/* Response areas */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={18} className="text-vloop-600" /> Response Areas</h3>
          <div className="flex flex-wrap gap-2">
            {disasterResponse.responseAreas.map((area) => (
              <span key={area} className="px-3 py-1.5 bg-vloop-50 text-vloop-700 text-sm font-medium rounded-lg flex items-center gap-1">
                <MapPin size={12} /> {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Training modules */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award size={18} className="text-gold-500" /> Training Modules</h3>
        <div className="space-y-2">
          {disasterResponse.trainingModules.map((mod) => (
            <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-xl ${mod.completed ? 'bg-success-50' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${mod.completed ? 'bg-success-100 text-success-600' : 'bg-gray-200 text-gray-400'}`}>
                {mod.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{mod.title}</div>
                <div className="text-xs text-gray-400">{mod.completed ? 'Completed' : 'In Progress'}</div>
              </div>
              {mod.completed ? (
                <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs font-bold rounded">Done</span>
              ) : (
                <button className="px-3 py-1.5 bg-vloop-50 text-vloop-700 text-xs font-semibold rounded-lg hover:bg-vloop-100 transition-colors">
                  Continue
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer registration */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users size={18} className="text-vloop-600" /> Volunteer Registration</h3>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success-50 border border-success-200">
          <CheckCircle2 size={24} className="text-success-600 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-success-700 text-sm">You're a registered volunteer!</div>
            <div className="text-xs text-gray-600">Your registration is active. Keep your training up to date.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SKILL TO JOB
// ============================================================
function JobsTab() {
  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    available: { label: 'Available', bg: 'bg-success-100', text: 'text-success-700' },
    applied: { label: 'Applied', bg: 'bg-vloop-100', text: 'text-vloop-700' },
    interview: { label: 'Interview', bg: 'bg-amber-100', text: 'text-amber-700' },
    offered: { label: 'Offered', bg: 'bg-gold-100', text: 'text-gold-700' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Available Jobs" value={skillToJobStats.availableJobs.toString()} color="from-vloop-500 to-vloop-700" />
        <StatCard icon={Award} label="Certified Members" value={skillToJobStats.certifiedMembers.toString()} color="from-gold-400 to-gold-600" />
        <StatCard icon={MapPin} label="Nearby Opportunities" value={skillToJobStats.nearbyOpportunities.toString()} color="from-success-500 to-success-700" />
        <StatCard icon={Building2} label="Employer Requests" value={skillToJobStats.employerRequests.toString()} color="from-pink-400 to-pink-600" />
      </div>

      {/* Job listings */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><Briefcase size={20} className="text-vloop-600" /> Job Listings</h3>
        <div className="space-y-3">
          {jobListings.map((job) => {
            const status = statusConfig[job.status];
            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-12 h-12 rounded-xl bg-vloop-100 flex items-center justify-center shrink-0">
                    <Building2 size={22} className="text-vloop-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${status.bg} ${status.text}`}>{status.label}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{job.company} · {job.location}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span className="font-semibold text-gray-700">{job.salary}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                      <span>·</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-gold-500" fill="currentColor" />
                      <span className="text-sm font-bold text-gray-900">{job.matchScore}%</span>
                      <span className="text-xs text-gray-400">match</span>
                    </div>
                    <button className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      job.status === 'available' ? 'bg-vloop-600 text-white hover:bg-vloop-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.status === 'available' ? 'Apply Now' : job.status === 'applied' ? 'View Application' : job.status === 'interview' ? 'View Details' : 'Accept Offer'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function StatCard({ icon: Icon, label, value, color, live }: { icon: any; label: string; value: string; color: string; live?: boolean }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-4 hover:shadow-card-hover transition-shadow">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900 font-display flex items-center gap-1.5">
        {value}
        {live && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
      </div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  );
}
