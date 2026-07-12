import {
  ArrowLeft, Star, Clock, PlayCircle, Award, Download, User,
  BookOpen, Globe, BarChart3, CheckCircle2, ChevronRight,
} from 'lucide-react';
import { courses, courseLessons } from '../lib/academyMockData';

type Props = { courseId: string; onNavigate: (page: string, params?: Record<string, string>) => void };

export default function AcademyCoursePage({ courseId, onNavigate }: Props) {
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const lessons = courseLessons[course.id] || courseLessons['c1'];
  const completedLessons = lessons.filter((l) => l.completed).length;

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('academy-home')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 font-display truncate">{course.title}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: course info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Thumbnail */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => onNavigate('academy-learn', { courseId: course.id })}
                    className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <PlayCircle size={36} className="text-vloop-600" />
                  </button>
                </div>
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-vloop-600 text-white text-xs font-bold rounded-lg">{course.category}</span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 font-display mb-2">{course.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <MetaItem icon={User} label="Instructor" value={course.instructor} />
                  <MetaItem icon={Clock} label="Duration" value={course.duration} />
                  <MetaItem icon={BookOpen} label="Lessons" value={`${course.lessons} lessons`} />
                  <MetaItem icon={BarChart3} label="Difficulty" value={course.difficulty} />
                  <MetaItem icon={Globe} label="Language" value={course.language} />
                  <MetaItem icon={Star} label="Rating" value={`${course.rating} (${course.students.toLocaleString()})`} />
                </div>

                {/* Progress bar */}
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Your Progress</span>
                      <span className="font-semibold text-vloop-600">{course.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-vloop-500 to-vloop-700 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{completedLessons} of {lessons.length} lessons completed</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => onNavigate('academy-learn', { courseId: course.id })}
                    className="flex-1 min-w-[160px] py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={18} /> {course.progress > 0 ? 'Resume Learning' : 'Start Learning'}
                  </button>
                  <button className="px-5 py-3 bg-white border-2 border-vloop-200 text-vloop-700 font-semibold rounded-xl hover:bg-vloop-50 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} /> PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Lessons list */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-vloop-600" /> Course Curriculum</h3>
              <div className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${lesson.isCurrent ? 'bg-vloop-50 border border-vloop-200' : 'hover:bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${lesson.completed ? 'bg-success-100 text-success-600' : lesson.isCurrent ? 'bg-vloop-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {lesson.completed ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${lesson.isCurrent ? 'text-vloop-700' : 'text-gray-900'}`}>{lesson.title}</div>
                      <div className="text-xs text-gray-400">{lesson.duration}</div>
                    </div>
                    {lesson.isCurrent && <span className="text-xs font-bold text-vloop-600 bg-vloop-100 px-2 py-0.5 rounded">Current</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card-hover p-5 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4">Course Info</h3>
              <div className="space-y-3 text-sm">
                <InfoRow icon={Award} label="Certificate" value={course.hasCertificate ? 'Included' : 'Not available'} />
                <InfoRow icon={BarChart3} label="Level" value={course.difficulty} />
                <InfoRow icon={Clock} label="Total Duration" value={course.duration} />
                <InfoRow icon={BookOpen} label="Total Lessons" value={`${course.lessons}`} />
                <InfoRow icon={Globe} label="Language" value={course.language} />
                <InfoRow icon={User} label="Instructor" value={course.instructor} />
              </div>
              {course.hasCertificate && (
                <div className="mt-4 p-3 rounded-lg bg-gold-50 border border-gold-100 flex items-center gap-2">
                  <Award size={18} className="text-gold-600" />
                  <div className="text-xs">
                    <div className="font-semibold text-gold-700">Certificate of Completion</div>
                    <div className="text-gray-500">Earn a certificate after finishing all lessons</div>
                  </div>
                </div>
              )}
              <button
                onClick={() => onNavigate('academy-learn', { courseId: course.id })}
                className="w-full mt-4 py-3 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center justify-center gap-2"
              >
                {course.progress > 0 ? 'Resume' : 'Start'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
      <Icon size={16} className="text-vloop-500 shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 flex items-center gap-2"><Icon size={14} /> {label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
