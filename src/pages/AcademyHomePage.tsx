import {
  ArrowLeft, Star, Clock, PlayCircle, Award, TrendingUp, ChevronRight,
  Zap, Wrench, Cpu, Flame, BrainCircuit, ShieldCheck, Megaphone, Car,
  Smile, Briefcase, BookOpen, Download, Users, GraduationCap,
} from 'lucide-react';
import {
  courses, courseCategories, certificates,
  type Course,
} from '../lib/academyMockData';

type Props = { onNavigate: (page: string, params?: Record<string, string>) => void };

const iconMap: Record<string, any> = {
  Zap, Wrench, Cpu, Flame, BrainCircuit, ShieldCheck, Megaphone, Car, Smile, Briefcase,
};

export default function AcademyHomePage({ onNavigate }: Props) {
  const featured = courses.filter((c) => c.isFeatured);
  const continueLearning = courses.filter((c) => c.progress > 0 && c.progress < 100);
  const recentlyAdded = courses.filter((c) => c.recentlyAdded);
  const popular = courses.filter((c) => c.isPopular);
  const overallProgress = Math.round(
    courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
  );

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('home')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">Digital Academy</h1>
              <p className="text-xs text-gray-500">Phase 15 · Learn skills, earn certificates</p>
            </div>
          </div>
        </div>

        {/* Learning progress banner */}
        <div className="bg-gradient-to-br from-vloop-600 to-vloop-800 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display mb-1">Your Learning Journey</h2>
              <p className="text-white/70 text-sm">Keep going — you're {overallProgress}% through your courses!</p>
              <div className="flex gap-4 mt-3">
                <div><span className="text-2xl font-bold">{continueLearning.length}</span><span className="text-sm text-white/70 ml-1">In Progress</span></div>
                <div><span className="text-2xl font-bold">{certificates.length}</span><span className="text-sm text-white/70 ml-1">Certificates</span></div>
                <div><span className="text-2xl font-bold">{courses.length}</span><span className="text-sm text-white/70 ml-1">Total Courses</span></div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold font-display">{overallProgress}%</div>
              <div className="text-sm text-white/70">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {continueLearning.length > 0 && (
          <Section title="Continue Learning" icon={PlayCircle} onMore={() => onNavigate('academy-categories')}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {continueLearning.map((course) => (
                <ContinueCard key={course.id} course={course} onNavigate={onNavigate} />
              ))}
            </div>
          </Section>
        )}

        {/* Featured Courses */}
        <Section title="Featured Courses" icon={Star} onMore={() => onNavigate('academy-categories')}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>
        </Section>

        {/* Recently Added */}
        <Section title="Recently Added" icon={Clock} onMore={() => onNavigate('academy-categories')}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyAdded.map((course) => (
              <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>
        </Section>

        {/* Popular Courses */}
        <Section title="Popular Courses" icon={TrendingUp} onMore={() => onNavigate('academy-categories')}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((course) => (
              <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>
        </Section>

        {/* Categories quick access */}
        <Section title="Course Categories" icon={BookOpen} onMore={() => onNavigate('academy-categories')}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {courseCategories.slice(0, 10).map((cat) => {
              const Icon = iconMap[cat.icon] || BookOpen;
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('academy-categories')}
                  className="bg-white rounded-2xl shadow-card p-4 text-center hover:shadow-card-hover transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{cat.name}</div>
                  <div className="text-xs text-gray-400">{cat.courseCount} courses</div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Certificates */}
        <Section title="Your Certificates" icon={Award} onMore={() => undefined}>
          <div className="grid sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
                  <Award size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{cert.courseName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Issued: {cert.issuedDate} · Score: {cert.score}%</div>
                </div>
                <button className="p-2 text-gold-600 hover:bg-gold-200 rounded-lg transition-colors">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Care OS link */}
        <div className="mt-8">
          <button
            onClick={() => onNavigate('care-os')}
            className="w-full bg-gradient-to-r from-success-500 to-vloop-600 text-white rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg font-display">Care OS Dashboard</div>
                <div className="text-sm text-white/80">Food Bank, Mental Health, Disaster Response, Skill to Job & more</div>
              </div>
            </div>
            <ChevronRight size={24} className="text-white/80" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, onMore, children }: { title: string; icon: any; onMore?: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon size={20} className="text-vloop-600" /> {title}
        </h2>
        {onMore && (
          <button onClick={onMore} className="text-sm text-vloop-600 font-medium hover:underline flex items-center gap-0.5">
            View All <ChevronRight size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function CourseCard({ course, onNavigate }: { course: Course; onNavigate: Props['onNavigate'] }) {
  return (
    <div
      onClick={() => onNavigate('academy-course', { courseId: course.id })}
      className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer hover:shadow-card-hover transition-shadow group flex flex-col"
    >
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <PlayCircle size={36} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-vloop-600 text-white text-[10px] font-bold rounded">{course.category}</span>
        {course.hasCertificate && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-gold-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5">
            <Award size={9} /> CERT
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{course.title}</h3>
        <div className="text-xs text-gray-400 mb-2">{course.instructor}</div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Clock size={12} /> {course.duration}
          <span>·</span>
          <span>{course.lessons} lessons</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-success-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {course.rating} <Star size={9} fill="white" />
          </div>
          <span className="text-xs text-gray-400">({course.students.toLocaleString()})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{course.difficulty}</span>
            <span>{course.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContinueCard({ course, onNavigate }: { course: Course; onNavigate: Props['onNavigate'] }) {
  return (
    <div
      onClick={() => onNavigate('academy-learn', { courseId: course.id })}
      className="bg-white rounded-2xl shadow-card p-4 flex gap-4 cursor-pointer hover:shadow-card-hover transition-shadow"
    >
      <img src={course.thumbnail} alt={course.title} className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{course.title}</h3>
        <div className="text-xs text-gray-400 mb-2">{course.instructor}</div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-vloop-500 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-vloop-600">{course.progress}%</span>
        </div>
        <button className="text-xs font-semibold text-vloop-600 hover:underline flex items-center gap-1">
          <PlayCircle size={14} /> Resume Learning
        </button>
      </div>
    </div>
  );
}
