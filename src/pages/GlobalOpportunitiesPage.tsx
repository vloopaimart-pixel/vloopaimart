/**
 * VLOOP Global Opportunities - VCOS Global Service Exchange (GSX)
 * Phase 8 — Jobs, Skills, Languages, Interview Prep, Migration Support
 *
 * Design: Premium Global Theme (Deep Blue, White, Soft Gold)
 * Glass Cards, Professional Icons, Animated Progress
 */

import { useState, useEffect } from 'react';
import {
  Briefcase, GraduationCap, Globe, Plane, Building, Search,
  ChevronRight, Star, Heart, MapPin, Clock, Wallet, Users,
  Award, FileText, Video, Mic, BookOpen, Languages, ShieldCheck,
  TrendingUp, CheckCircle2, ArrowLeft, Bot, Sparkles, Download,
  Eye, Share2, Bookmark, BookmarkCheck, Filter, SlidersHorizontal,
  Building2, Stethoscope, Cpu, Brain, Shield, Megaphone,
  Phone, HeadphonesIcon, Car, Wrench, Zap, Droplet, Hammer,
  Home, Lock, UserCog, User, Calendar, ExternalLink, AlertCircle,
  Send, Check, X, BadgeCheck, Crown, Target, Presentation
} from 'lucide-react';
import {
  JOB_REGIONS, JOB_REGION_LABELS, JOB_CATEGORIES, JOB_CATEGORY_LABELS,
  type JobRegion, type JobCategory, type JobPosting, type LanguageCourse,
  type SkillBadge, type MigrationGuide, type WorkerProfile,
  getJobCategoryColor, getRegionColor, getSkillLevelColor,
  getApplicationStatusColor, formatSalary,
  getMockJobs, getMockLanguageCourses, getMockSkillBadges, getMockMigrationGuides,
} from '../lib/GlobalServiceExchangeEngine';

type GlobalOpportunitiesPageProps = {
  onNavigate: (page: string) => void;
};

type TabId = 'jobs' | 'skills' | 'languages' | 'interview' | 'migration';

export default function GlobalOpportunitiesPage({ onNavigate }: GlobalOpportunitiesPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('jobs');
  const [selectedRegion, setSelectedRegion] = useState<JobRegion | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs] = useState(getMockJobs());
  const [languageCourses] = useState(getMockLanguageCourses());
  const [skillBadges] = useState(getMockSkillBadges());
  const [migrationGuides] = useState(getMockMigrationGuides());

  const tabs: Array<{ id: TabId; label: string; icon: typeof Briefcase }> = [
    { id: 'jobs', label: 'Jobs & Employment', icon: Briefcase },
    { id: 'skills', label: 'Skill Verification', icon: Award },
    { id: 'languages', label: 'Language Learning', icon: Languages },
    { id: 'interview', label: 'Interview Prep', icon: Mic },
    { id: 'migration', label: 'Migration Support', icon: Plane },
  ];

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-400 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-400 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          {/* Header Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/90">VCOS Global Service Exchange</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Global Opportunities
            </h1>
            <p className="text-xl text-blue-200 leading-relaxed">
              Jobs, Skills, Languages, Migration Support — Everything you need for global career success.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              label="Total Jobs"
              value="15,420+"
              icon={Briefcase}
              color="from-blue-400 to-blue-600"
            />
            <StatCard
              label="Languages"
              value="8"
              icon={Languages}
              color="from-emerald-400 to-teal-500"
            />
            <StatCard
              label="Countries"
              value="25+"
              icon={Globe}
              color="from-amber-400 to-orange-500"
            />
            <StatCard
              label="Success Rate"
              value="87%"
              icon={TrendingUp}
              color="from-violet-400 to-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'jobs' && (
          <JobsSection
            jobs={jobs}
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
            onRegionChange={setSelectedRegion}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        {activeTab === 'skills' && <SkillsSection badges={skillBadges} />}
        {activeTab === 'languages' && <LanguagesSection courses={languageCourses} />}
        {activeTab === 'interview' && <InterviewSection />}
        {activeTab === 'migration' && <MigrationSection guides={migrationGuides} />}
      </div>
    </div>
  );
}

// ============================================================
// JOBS SECTION
// ============================================================

function JobsSection({
  jobs,
  selectedRegion,
  selectedCategory,
  onRegionChange,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: {
  jobs: JobPosting[];
  selectedRegion: JobRegion | null;
  selectedCategory: JobCategory | null;
  onRegionChange: (region: JobRegion | null) => void;
  onCategoryChange: (category: JobCategory | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filteredJobs = jobs.filter((job) => {
    if (selectedRegion && job.region !== selectedRegion) return false;
    if (selectedCategory && job.job_category !== selectedCategory) return false;
    if (searchQuery && !job.job_title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion || ''}
            onChange={(e) => onRegionChange((e.target.value as JobRegion) || null)}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
          >
            <option value="">All Regions</option>
            {Object.entries(JOB_REGION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange((e.target.value as JobCategory) || null)}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {Object.entries(JOB_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Categories Quick Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">Popular Categories</h3>
        <div className="flex flex-wrap gap-2">
          {['it', 'healthcare', 'hospitality', 'driver', 'electrician', 'freelance'].map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(selectedCategory === cat ? null : cat as JobCategory)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              {JOB_CATEGORY_LABELS[cat as JobCategory]}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={savedJobs.includes(job.id)}
            onSaveToggle={() => toggleSave(job.id)}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, isSaved, onSaveToggle }: { job: JobPosting; isSaved: boolean; onSaveToggle: () => void }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 overflow-hidden">
      {/* Featured Badge */}
      {job.is_featured && (
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1 text-amber-950 text-xs font-bold">
          FEATURED JOB
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Building className="w-7 h-7 text-slate-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate">{job.job_title}</h3>
              <p className="text-slate-600 text-sm">{job.employer?.company_name}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.city}, {job.country_code}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${job.is_urgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {job.is_urgent ? 'Urgent' : JOB_REGION_LABELS[job.region]}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveToggle}
              className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-amber-100 text-amber-600' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getJobCategoryColor(job.job_category as JobCategory)} text-white`}>
            {JOB_CATEGORY_LABELS[job.job_category as JobCategory] || job.job_category}
          </span>
          {job.visa_sponsorship && (
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
              Visa Sponsored
            </span>
          )}
          {job.accommodation_provided && (
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-100 text-violet-700">
              Accommodation
            </span>
          )}
        </div>

        {/* Salary & Details */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-slate-900">
              {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              {job.experience_required_min}-{job.experience_required_max} years exp
              {job.languages_required.length > 0 && (
                <span className="ml-2 flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  {job.languages_required.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* SmartPoints */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">+{job.smartpoints_reward} SP</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
          <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Apply Now
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Requirements</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Benefits</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                {job.benefits.map((ben, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {ben}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SKILLS SECTION
// ============================================================

function SkillsSection({ badges }: { badges: SkillBadge[] }) {
  return (
    <div>
      {/* Skill Verification Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">VLOOP Skill Verification</h2>
            <p className="text-violet-200 mt-1">Every completed course generates a verified skill badge</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{badges.length}</div>
            <div className="text-sm text-violet-200">Verified Skills</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">92</div>
            <div className="text-sm text-violet-200">Avg Score</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">4.6</div>
            <div className="text-sm text-violet-200">Trust Rating</div>
          </div>
        </div>
      </div>

      {/* Skill Badges */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Your Verified Skills</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-violet-300 transition-colors"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                badge.verified ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-slate-200'
              }`}>
                {badge.verified ? (
                  <BadgeCheck className="w-7 h-7 text-white" />
                ) : (
                  <Award className="w-7 h-7 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{badge.skill_name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm font-medium ${getSkillLevelColor(badge.skill_level as any)}`}>
                    {badge.skill_level.charAt(0).toUpperCase() + badge.skill_level.slice(1)}
                  </span>
                  {badge.verified && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {badge.assessment_score}% Score
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {badge.endorsements} Endorsements
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employer Filter Info */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-amber-600" />
          <div>
            <h4 className="font-bold text-amber-900">Employer Visibility</h4>
            <p className="text-amber-700 text-sm">
              Employers can filter candidates by verified skills. Get more job matches by verifying your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LANGUAGES SECTION
// ============================================================

function LanguagesSection({ courses }: { courses: LanguageCourse[] }) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const languages = ['english', 'arabic', 'german', 'french', 'hindi', 'malayalam', 'tamil', 'kannada'];
  const filteredCourses = selectedLanguage
    ? courses.filter((c) => c.language === selectedLanguage)
    : courses;

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
            <Languages className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Learn Languages Free</h2>
            <p className="text-emerald-200 mt-1">Earn SmartPoints and certificates with every course</p>
          </div>
        </div>
      </div>

      {/* Language Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedLanguage('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedLanguage ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Languages
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang === selectedLanguage ? '' : lang)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLanguage === lang ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-5">
              {/* Language Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium mb-3">
                <Languages className="w-3 h-3" />
                {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{course.course_name}</h3>
              <p className="text-sm text-slate-600 mb-4">{course.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  {course.videos_count} Videos
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {course.lessons_count} Lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration_hours}h
                </span>
              </div>

              {/* Rating & Enrolled */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-slate-700">{course.rating}</span>
                </div>
                <span className="text-sm text-slate-500">{course.enrolled_count.toLocaleString()} enrolled</span>
              </div>

              {/* SmartPoints & Certificate */}
              <div className="flex items-center justify-between py-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-amber-600">+{course.smartpoints_reward} SP</span>
                </div>
                {course.certificate_awarded && (
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    <Award className="w-4 h-4" />
                    Certificate
                  </div>
                )}
              </div>

              {/* Enroll Button */}
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-opacity mt-2">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// INTERVIEW PREP SECTION
// ============================================================

function InterviewSection() {
  const interviewTypes = [
    { id: 'mock', title: 'Mock Interview', description: 'Practice with AI interviewer', icon: Mic, color: 'from-blue-500 to-indigo-600' },
    { id: 'common', title: 'Common Questions', description: 'Prepare for frequently asked questions', icon: FileText, color: 'from-emerald-500 to-teal-600' },
    { id: 'resume', title: 'Resume Builder', description: 'Create professional CVs', icon: FileText, color: 'from-amber-500 to-orange-600' },
    { id: 'cover', title: 'Cover Letter', description: 'Write compelling cover letters', icon: Send, color: 'from-violet-500 to-purple-600' },
  ];

  const resumeTemplates = [
    { name: 'Professional Classic', type: 'professional', count: '4,500+ uses' },
    { name: 'Modern Minimal', type: 'modern', count: '3,200+ uses' },
    { name: 'Executive Premium', type: 'executive', count: '1,800+ uses' },
    { name: 'Creative Design', type: 'creative', count: '2,100+ uses' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
            <Presentation className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Interview Preparation</h2>
            <p className="text-violet-200 mt-1">Practice with AI and build professional documents</p>
          </div>
        </div>
      </div>

      {/* Interview Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {interviewTypes.map((type) => (
          <button
            key={type.id}
            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all text-left group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <type.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{type.title}</h3>
            <p className="text-sm text-slate-500">{type.description}</p>
          </button>
        ))}
      </div>

      {/* Resume Templates */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Resume Templates
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resumeTemplates.map((template) => (
            <div
              key={template.name}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-slate-900">{template.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{template.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MIGRATION SECTION
// ============================================================

function MigrationSection({ guides }: { guides: MigrationGuide[] }) {
  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
            <Plane className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Migration Support</h2>
            <p className="text-blue-200 mt-1">Complete guides for international relocation</p>
          </div>
        </div>
      </div>

      {/* Country Guides */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {guide.country_code}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{guide.country_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    {guide.processing_time_days} days processing
                  </div>
                </div>
              </div>

              {/* Visa Types */}
              <div className="space-y-2 mb-4">
                {guide.visa_types.slice(0, 2).map((visa: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{visa.visa_name}</span>
                    <span className="font-medium text-blue-600">{visa.fees} {visa.currency}</span>
                  </div>
                ))}
              </div>

              {/* Success Rate */}
              <div className="flex items-center justify-between py-3 border-t border-slate-100">
                <span className="text-sm text-slate-500">Success Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${guide.success_rate}%` }}
                    />
                  </div>
                  <span className="font-bold text-emerald-600">{guide.success_rate}%</span>
                </div>
              </div>

              {/* View Details */}
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2">
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-4">Additional Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-blue-800">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Document Checklist</span>
          </div>
          <div className="flex items-center gap-3 text-blue-800">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">Embassy Links</span>
          </div>
          <div className="flex items-center gap-3 text-blue-800">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Medical Requirements</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Briefcase; color: string }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-white/70">{label}</div>
        </div>
      </div>
    </div>
  );
}
