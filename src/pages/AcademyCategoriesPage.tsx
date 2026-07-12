import {
  ArrowLeft, ChevronRight, Zap, Wrench, Cpu, Flame, BrainCircuit,
  ShieldCheck, Megaphone, Car, Smile, Briefcase, BookOpen,
} from 'lucide-react';
import { courseCategories, courses, type Course } from '../lib/academyMockData';

type Props = { onNavigate: (page: string, params?: Record<string, string>) => void };

const iconMap: Record<string, any> = {
  Zap, Wrench, Cpu, Flame, BrainCircuit, ShieldCheck, Megaphone, Car, Smile, Briefcase,
};

export default function AcademyCategoriesPage({ onNavigate }: Props) {
  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('academy-home')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Course Categories</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || BookOpen;
            const catCourses = courses.filter((c) => c.categoryId === cat.id);
            return (
              <div key={cat.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-vloop-600 bg-vloop-50 px-2.5 py-1 rounded-lg">{cat.courseCount} courses</span>
                  <button
                    onClick={() => catCourses.length > 0 && onNavigate('academy-course', { courseId: catCourses[0].id })}
                    className="text-sm font-semibold text-vloop-600 hover:text-vloop-700 flex items-center gap-0.5"
                  >
                    Explore <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* All courses */}
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">All Courses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course: Course) => (
            <button
              key={course.id}
              onClick={() => onNavigate('academy-course', { courseId: course.id })}
              className="bg-white rounded-2xl shadow-card overflow-hidden text-left hover:shadow-card-hover transition-shadow group flex flex-col"
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-vloop-600 text-white text-[10px] font-bold rounded">{course.category}</span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{course.title}</h3>
                <div className="text-xs text-gray-400">{course.instructor} · {course.duration}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
