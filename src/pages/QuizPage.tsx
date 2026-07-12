import { useState, useEffect } from 'react';
import { HelpCircle, Zap, ArrowRight, SkipForward, Check, X, Loader2, Award, Target, Brain, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type QuizQuestion, type UserEngagement } from '../lib/supabase';
import { getQuizQuestions, submitQuizAnswer, skipQuiz, getUserEngagement, awardBadge, XP_BADGES } from '../lib/engagementEngine';
import { QUIZ_CATEGORIES } from '../lib/vloopEngine';

type QuizPageProps = {
  onNavigate: (page: string) => void;
  onComplete?: () => void;
  questionCount?: number;
};

export default function QuizPage({ onNavigate, onComplete, questionCount = 1 }: QuizPageProps) {
  const { profile, refreshProfile } = useAuth();
  const [mode, setMode] = useState<'select' | 'playing' | 'result'>('select');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [engagement, setEngagement] = useState<UserEngagement | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (profile) loadEngagement();
  }, [profile]);

  const loadEngagement = async () => {
    const data = await getUserEngagement(profile!.id);
    setEngagement(data);
  };

  const startQuiz = async (count: number) => {
    setLoading(true);
    const qs = await getQuizQuestions(count);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setXpEarned(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setStreak(0);
    setMode('playing');
    setLoading(false);
  };

  const handleAnswer = async (answer: string) => {
    if (showFeedback || !profile) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const result = await submitQuizAnswer(profile.id, questions[currentIndex].id, answer);

    if (result.correct) {
      setScore(s => s + 1);
      setXpEarned(x => x + result.xpEarned);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setMode('result');
        checkBadges();
      }
    }, 1500);
  };

  const handleSkip = async () => {
    if (!profile) return;
    await skipQuiz(profile.id);
    if (onComplete) {
      onComplete();
    } else {
      onNavigate('smartcode');
    }
  };

  const checkBadges = async () => {
    if (!profile || !engagement) return;

    const totalCompleted = (engagement.quizzes_completed || 0) + 1;

    if (totalCompleted === 1) {
      await awardBadge(profile.id, 'first_quiz');
    }
    if (totalCompleted >= 50) {
      await awardBadge(profile.id, 'quiz_master');
    }
    if (streak >= 10) {
      await awardBadge(profile.id, 'perfect_score');
    }

    await loadEngagement();
  };

  const questionOptions = [
    { count: 1, label: 'Quick Quiz', desc: '1 Question', icon: Target },
    { count: 5, label: 'Challenge', desc: '5 Questions', icon: Brain },
    { count: 10, label: 'Master', desc: '10 Questions', icon: Award },
  ];

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (mode === 'select') {
    return (
      <div className="animate-fade-in min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vloop-500 to-vloop-700 flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">Knowledge Challenge</h1>
            <p className="text-gray-500 text-sm">Test your knowledge and earn XP rewards!</p>
          </div>

          {/* Engagement Stats */}
          {engagement && (
            <div className="card-premium p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gold-600 font-display">{engagement.xp_total}</div>
                  <div className="text-xs text-gray-500">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-vloop-600 font-display">Lvl {engagement.xp_level}</div>
                  <div className="text-xs text-gray-500">Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success-600 font-display">{engagement.quizzes_completed}</div>
                  <div className="text-xs text-gray-500">Quizzes</div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Options */}
          <div className="space-y-3 mb-6">
            {questionOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.count}
                  onClick={() => startQuiz(opt.count)}
                  disabled={loading}
                  className="w-full p-4 bg-white rounded-2xl shadow-card border-2 border-transparent hover:border-vloop-300 hover:shadow-card-hover transition-all text-left flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vloop-100 to-gold-100 flex items-center justify-center">
                    <Icon size={24} className="text-vloop-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              );
            })}
          </div>

          {/* Skip Option */}
          <button
            onClick={handleSkip}
            className="w-full p-4 bg-gray-100 rounded-xl text-gray-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <SkipForward size={18} /> Skip Quiz
          </button>

          {/* Benefits info */}
          <div className="mt-6 p-4 rounded-xl bg-gold-50 border border-gold-200">
            <div className="flex items-start gap-2">
              <Sparkles size={18} className="text-gold-600 shrink-0 mt-0.5" />
              <div className="text-sm text-gold-800">
                <strong>Bonus Benefits:</strong> Earn XP for correct answers. XP contributes to your Trust Score and unlocks badges!
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;

    return (
      <div className="animate-fade-in min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          {/* Result Card */}
          <div className="card-premium p-8">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              isPerfect ? 'bg-gradient-to-br from-gold-400 to-gold-600' :
              percentage >= 50 ? 'bg-gradient-to-br from-success-400 to-success-600' :
              'bg-gradient-to-br from-gray-300 to-gray-400'
            }`}>
              {isPerfect ? <Award size={48} className="text-white" /> :
               percentage >= 50 ? <Check size={48} className="text-white" /> :
               <X size={48} className="text-white" />}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">
              {isPerfect ? 'Perfect Score!' : percentage >= 50 ? 'Great Job!' : 'Keep Learning!'}
            </h2>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl bg-vloop-50">
                <div className="text-3xl font-bold text-vloop-600 font-display">{score}/{questions.length}</div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div className="p-4 rounded-xl bg-gold-50">
                <div className="text-3xl font-bold text-gold-600 font-display">+{xpEarned}</div>
                <div className="text-xs text-gray-500">XP Earned</div>
              </div>
            </div>

            {/* Badges earned */}
            {xpEarned > 0 && (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-success-50 mb-6">
                <Zap size={18} className="text-success-600" />
                <span className="text-sm font-semibold text-success-700">XP added to your profile!</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setMode('select')}
                className="flex-1 py-3 bg-vloop-50 text-vloop-700 font-semibold rounded-xl hover:bg-vloop-100 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => onComplete ? onComplete() : onNavigate('smartcode')}
                className="flex-1 py-3 bg-gold-400 text-vloop-950 font-bold rounded-xl hover:bg-gold-500 transition-colors flex items-center justify-center gap-1"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-vloop-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="flex items-center gap-1">
              <Zap size={14} className="text-gold-500" /> {xpEarned} XP
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vloop-500 to-gold-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card-premium p-6">
          {/* Category */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-vloop-50 text-vloop-700 text-xs font-semibold">
              {currentQuestion.category}
            </span>
            <span className="text-xs text-gray-500">
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((letter) => {
              const option = currentQuestion[`option_${letter.toLowerCase()}` as keyof QuizQuestion] as string;
              const isSelected = selectedAnswer === letter;
              const isCorrect = currentQuestion.correct_answer === letter;
              const showCorrect = showFeedback && isCorrect;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    showCorrect ? 'border-success-500 bg-success-50' :
                    showWrong ? 'border-red-500 bg-red-50' :
                    isSelected ? 'border-vloop-500 bg-vloop-50' :
                    'border-gray-200 hover:border-vloop-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      showCorrect ? 'bg-success-500 text-white' :
                      showWrong ? 'bg-red-500 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {showCorrect ? <Check size={16} /> : showWrong ? <X size={16} /> : letter}
                    </div>
                    <span className={`font-medium ${
                      showCorrect ? 'text-success-700' :
                      showWrong ? 'text-red-700' :
                      'text-gray-900'
                    }`}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && currentQuestion.explanation && (
            <div className={`mt-4 p-3 rounded-lg ${
              selectedAnswer === currentQuestion.correct_answer
                ? 'bg-success-50 border border-success-200'
                : 'bg-gold-50 border border-gold-200'
            }`}>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Skip button */}
        {!showFeedback && (
          <button
            onClick={handleSkip}
            className="w-full mt-4 py-3 text-gray-500 font-medium flex items-center justify-center gap-2 hover:text-gray-700 transition-colors"
          >
            <SkipForward size={18} /> Skip to SmartCode
          </button>
        )}
      </div>
    </div>
  );
}
