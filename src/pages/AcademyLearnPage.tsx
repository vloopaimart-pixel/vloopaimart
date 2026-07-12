import { useState } from 'react';
import {
  ArrowLeft, PlayCircle, CheckCircle2, Download, FileText,
  ChevronLeft, ChevronRight, Clock, BookOpen, PenLine,
} from 'lucide-react';
import { courses, courseLessons } from '../lib/academyMockData';

type Props = { courseId: string; onNavigate: (page: string, params?: Record<string, string>) => void };

export default function AcademyLearnPage({ courseId, onNavigate }: Props) {
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const allLessons = courseLessons[course.id] || courseLessons['c1'];
  const [currentLessonIdx, setCurrentLessonIdx] = useState(
    Math.max(0, allLessons.findIndex((l) => l.isCurrent))
  );
  const [lessons, setLessons] = useState(allLessons);
  const [notes, setNotes] = useState('');
  const currentLesson = lessons[currentLessonIdx];

  const markComplete = () => {
    setLessons((prev) => prev.map((l, i) => (i === currentLessonIdx ? { ...l, completed: true } : l)));
  };

  const goNext = () => {
    if (currentLessonIdx < lessons.length - 1) setCurrentLessonIdx(currentLessonIdx + 1);
  };

  const goPrev = () => {
    if (currentLessonIdx > 0) setCurrentLessonIdx(currentLessonIdx - 1);
  };

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('academy-course', { courseId: course.id })} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 font-display truncate">{course.title}</h1>
            <p className="text-xs text-gray-500">{course.instructor} · {progress}% complete</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: video + content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video placeholder */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <PlayCircle size={48} className="text-white/80" />
                </div>
                <p className="text-white/60 text-sm">{currentLesson.title}</p>
                <p className="text-white/40 text-xs mt-1">{currentLesson.duration} · Demo video placeholder</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full bg-vloop-500 w-1/3 rounded-r-full" />
              </div>
            </div>

            {/* Lesson nav */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={currentLessonIdx === 0}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm text-gray-500">Lesson {currentLessonIdx + 1} of {lessons.length}</span>
              <button
                onClick={goNext}
                disabled={currentLessonIdx === lessons.length - 1}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            {/* Lesson content */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-2">{currentLesson.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                This is a demo lesson. In the full version, this section would contain the lesson transcript,
                key concepts, and interactive content. The video placeholder above represents where the
                instructional video would be embedded.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={markComplete}
                  disabled={currentLesson.completed}
                  className={`px-5 py-2.5 font-semibold rounded-xl transition-colors flex items-center gap-2 text-sm ${
                    currentLesson.completed
                      ? 'bg-success-100 text-success-600 cursor-default'
                      : 'bg-success-500 text-white hover:bg-success-600'
                  }`}
                >
                  <CheckCircle2 size={18} /> {currentLesson.completed ? 'Completed' : 'Mark Complete'}
                </button>
                <button className="px-5 py-2.5 bg-white border-2 border-vloop-200 text-vloop-700 font-semibold rounded-xl hover:bg-vloop-50 transition-colors flex items-center gap-2 text-sm">
                  <Download size={18} /> PDF Download
                </button>
                <button
                  onClick={goNext}
                  disabled={currentLessonIdx === lessons.length - 1}
                  className="px-5 py-2.5 bg-vloop-600 text-white font-semibold rounded-xl hover:bg-vloop-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-40"
                >
                  Next Lesson <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><PenLine size={18} className="text-vloop-600" /> My Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes while learning..."
                className="w-full h-32 p-3 rounded-xl border border-gray-200 text-sm focus:border-vloop-500 focus:ring-2 focus:ring-vloop-200 outline-none transition-all resize-none"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-vloop-50 text-vloop-700 text-sm font-semibold rounded-lg hover:bg-vloop-100 transition-colors">
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* Right: lesson sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-4 sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><BookOpen size={18} className="text-vloop-600" /> Lessons</h3>
              <div className="space-y-1.5">
                {lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIdx(idx)}
                    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      idx === currentLessonIdx ? 'bg-vloop-50 border border-vloop-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${lesson.completed ? 'bg-success-100 text-success-600' : idx === currentLessonIdx ? 'bg-vloop-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {lesson.completed ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${idx === currentLessonIdx ? 'text-vloop-700' : 'text-gray-900'}`}>{lesson.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-0.5"><Clock size={10} /> {lesson.duration}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-semibold text-vloop-600">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-vloop-500 to-vloop-700 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{completedCount} of {lessons.length} lessons completed</div>
              </div>

              {/* Resources */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5"><FileText size={14} className="text-vloop-500" /> Resources</h4>
                <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-colors">
                  <Download size={14} className="text-vloop-500" /> Course PDF Material
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-colors">
                  <FileText size={14} className="text-vloop-500" /> Lesson Transcript
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
