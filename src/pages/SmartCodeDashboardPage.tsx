import { useState, useEffect } from 'react';
import {
  Hash, Clock, Users, Zap, TrendingUp, Sparkles, Trophy, Info, CheckCircle2, AlertCircle,
  History, ChevronRight, ShieldCheck, RefreshCw, Delete, Edit3, Target, Award, Calendar,
  Timer, Eye, Video, BookOpen, Play, Lock, Star, Activity, Shield, AlertTriangle,
  BarChart3, PieChart, Globe, Bell, Settings, HelpCircle, ExternalLink, Layers
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type ParticipationEntry } from '../lib/supabase';
import {
  generateSmartCode,
  isValidSmartCode,
  getCurrentWeekPeriod,
  getWeeklyCountdown,
  getSmartCodeHistory,
  getSmartCodeStats,
} from '../lib/engagementEngine';
import {
  getMockEarningRules,
  getMockChallenges,
  getMockTransparencyStats,
  getMockUserSummary,
  getMockEarnings,
  getMockAcademyContent,
  formatSmartPoints,
  getPointsColor,
  getActivityLabel,
  getChallengeStatusColor,
} from '../lib/SmartCodeOperatingSystem';
import { getAITransparencyStatus, USER_MESSAGES, type AITransparencyStatus } from '../lib/WeeklyAIRewardEngine';

type SmartCodeDashboardPageProps = {
  onNavigate: (page: string) => void;
};

type SectionId = 'challenge' | 'mycode' | 'entry' | 'history' | 'winners' | 'knowledge' | 'transparency' | 'academy';
type KeypadKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'clear' | '0' | 'delete';

export default function SmartCodeDashboardPage({ onNavigate }: SmartCodeDashboardPageProps) {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>('challenge');

  // Entry state
  const [entryMode, setEntryMode] = useState<'auto' | 'manual'>('auto');
  const [manualCode, setManualCode] = useState('');
  const [autoCode, setAutoCode] = useState('');
  const [selectedPoints, setSelectedPoints] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [entrySuccess, setEntrySuccess] = useState(false);

  // Data state
  const [countdown, setCountdown] = useState(getWeeklyCountdown());
  const [myEntries, setMyEntries] = useState<ParticipationEntry[]>([]);
  const [history, setHistory] = useState<{ smartcode: string; drawn_at: string; total_winners: number }[]>([]);
  const [stats, setStats] = useState<{
    mostSelected: { smartcode: string; selection_count: number }[];
    leastSelected: { smartcode: string; selection_count: number }[];
  }>({ mostSelected: [], leastSelected: [] });
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({
    challengeNumber: getCurrentWeekPeriod(),
    status: 'Open' as 'Open' | 'Closed',
    totalParticipants: 0,
    totalPointsEntered: 0,
  });
  const [aiStatus, setAiStatus] = useState<AITransparencyStatus | null>(null);

  // SmartPoints state
  const [smartPointsSummary, setSmartPointsSummary] = useState<any>(null);
  const [recentEarnings, setRecentEarnings] = useState<any[]>([]);
  const [transparencyStats, setTransparencyStats] = useState<any>(null);
  const [academyContent, setAcademyContent] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCountdown(getWeeklyCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (profile) {
        const { data: participations } = await supabase
          .from('participation')
          .select('*')
          .eq('user_id', profile.id)
          .not('smartcode', 'is', null)
          .order('created_at', { ascending: false });
        if (participations) setMyEntries(participations as ParticipationEntry[]);
      }

      const historyData = await getSmartCodeHistory(5);
      setHistory(historyData.map(h => ({
        smartcode: h.smartcode,
        drawn_at: h.drawn_at || '',
        total_winners: h.total_winners,
      })));

      const statsData = await getSmartCodeStats();
      setStats({
        mostSelected: statsData.mostSelected.slice(0, 5),
        leastSelected: statsData.leastSelected.slice(0, 5),
      });

      const week = getCurrentWeekPeriod();
      const { data: userRows } = await supabase
        .from('smartcode_allocations')
        .select('user_id')
        .eq('week_period', week)
        .eq('is_active', true);
      const uniqueUsers = new Set((userRows || []).map(r => r.user_id)).size;

      const { data: pointsData } = await supabase
        .from('smartcode_allocations')
        .select('points_allocated')
        .eq('week_period', week)
        .eq('is_active', true);

      const totalPoints = pointsData ? pointsData.reduce((sum: number, r: any) => sum + (r.points_allocated || 0), 0) : 0;

      setWeeklyStats({
        challengeNumber: week,
        status: 'Open',
        totalParticipants: uniqueUsers,
        totalPointsEntered: totalPoints,
      });

      if (profile) {
        const transparency = await getAITransparencyStatus(profile.id, week);
        setAiStatus(transparency);
      }

      // Mock data for SmartPoints
      setSmartPointsSummary(getMockUserSummary());
      setRecentEarnings(getMockEarnings());
      setTransparencyStats(getMockTransparencyStats());
      setAcademyContent(getMockAcademyContent());
      setChallenges(getMockChallenges());

    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const handleKeypadPress = (key: KeypadKey) => {
    if (key === 'clear') {
      setManualCode('');
    } else if (key === 'delete') {
      setManualCode(manualCode.slice(0, -1));
    } else if (manualCode.length < 3) {
      setManualCode(manualCode + key);
    }
    setEntryError(null);
  };

  const generateNewAutoCode = () => {
    setAutoCode(generateSmartCode());
    setEntryError(null);
  };

  const handleSubmit = async () => {
    if (!profile) {
      onNavigate('home');
      return;
    }

    const code = entryMode === 'auto' ? autoCode : manualCode;

    if (!isValidSmartCode(code)) {
      setEntryError('Please enter a valid 3-digit code (000-999)');
      return;
    }

    if (selectedPoints < 1) {
      setEntryError('Please select at least 1 point');
      return;
    }

    if (profile.points < selectedPoints) {
      setEntryError(`Insufficient points. You have ${profile.points} points.`);
      return;
    }

    setSubmitting(true);
    setEntryError(null);

    try {
      const { error } = await supabase.from('participation').insert({
        user_id: profile.id,
        participation_type: 'weekly_smartcode',
        smartcode: code,
        points_used: selectedPoints,
        winner_status: 'pending',
        weekly_period: getCurrentWeekPeriod(),
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ points: profile.points - selectedPoints })
        .eq('id', profile.id);

      setEntrySuccess(true);
      setManualCode('');
      setAutoCode('');
      setTimeout(() => {
        setEntrySuccess(false);
        fetchData();
      }, 2000);
    } catch (err: any) {
      setEntryError(err.message || 'Failed to submit entry');
    }

    setSubmitting(false);
  };

  const currentCode = entryMode === 'auto' ? autoCode : manualCode;
  const weekPeriod = getCurrentWeekPeriod();
  const currentEntry = myEntries[0];
  const totalMyPoints = myEntries.reduce((sum, e) => sum + (e.points_used || 0), 0);

  const sections = [
    { key: 'challenge', label: 'Weekly Challenge', icon: Calendar },
    { key: 'mycode', label: 'My SmartCode', icon: Target },
    { key: 'entry', label: 'Enter Code', icon: Hash },
    { key: 'history', label: 'History', icon: History },
    { key: 'winners', label: 'Winner Board', icon: Trophy },
    { key: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { key: 'transparency', label: 'Transparency', icon: Eye },
    { key: 'academy', label: 'Learn', icon: Video },
  ];

  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-950 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Hash size={24} className="text-blue-950" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">SmartCode Dashboard</h1>
              <p className="text-blue-200 text-sm">Weekly Reward Program • AI Verified</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mt-6 inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20">
            <div className="flex items-center gap-2">
              <Timer size={20} className="text-amber-400" />
              <span className="text-sm text-blue-200">Weekly Draw In:</span>
            </div>
            <div className="flex gap-3">
              {[
                { value: countdown.days, label: 'Days' },
                { value: countdown.hours, label: 'Hrs' },
                { value: countdown.minutes, label: 'Min' },
                { value: countdown.seconds, label: 'Sec' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{String(item.value).padStart(2, '0')}</div>
                  <div className="text-[10px] text-blue-300 uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SmartPoints Summary */}
          {smartPointsSummary && (
            <div className="mt-4 inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-blue-200 text-sm">SmartPoints:</span>
              <span className={`font-bold ${getPointsColor(smartPointsSummary.total_points_earned)}`}>
                {formatSmartPoints(smartPointsSummary.total_points_earned)}
              </span>
              <span className="text-blue-300 text-xs">| {smartPointsSummary.points_last_7_days} SP this week</span>
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] md:top-[105px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as SectionId)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* SECTION 1: Weekly Challenge */}
        {activeSection === 'challenge' && (
          <div className="space-y-6">
            <ChallengeSection
              weeklyStats={weeklyStats}
              profile={profile}
              onEnterCode={() => setActiveSection('entry')}
            />
          </div>
        )}

        {/* SECTION 2: My SmartCode */}
        {activeSection === 'mycode' && (
          <MySmartCodeSection
            profile={profile}
            myEntries={myEntries}
            aiStatus={aiStatus}
            currentEntry={currentEntry}
            totalMyPoints={totalMyPoints}
            onNavigate={onNavigate}
            onEnterCode={() => setActiveSection('entry')}
          />
        )}

        {/* SECTION 3: Enter Code */}
        {activeSection === 'entry' && (
          <EnterCodeSection
            profile={profile}
            entryMode={entryMode}
            setEntryMode={setEntryMode}
            manualCode={manualCode}
            setManualCode={setManualCode}
            autoCode={autoCode}
            currentCode={currentCode}
            selectedPoints={selectedPoints}
            setSelectedPoints={setSelectedPoints}
            submitting={submitting}
            entryError={entryError}
            entrySuccess={entrySuccess}
            onKeypadPress={handleKeypadPress}
            onGenerateNewCode={generateNewAutoCode}
            onSubmit={handleSubmit}
            onViewMyCode={() => setActiveSection('mycode')}
            onNavigate={onNavigate}
          />
        )}

        {/* SECTION 4: History */}
        {activeSection === 'history' && (
          <HistorySection history={history} myEntries={myEntries} recentEarnings={recentEarnings} />
        )}

        {/* SECTION 5: Winner Board */}
        {activeSection === 'winners' && (
          <WinnerBoardSection history={history} stats={stats} />
        )}

        {/* SECTION 6: Knowledge Challenge */}
        {activeSection === 'knowledge' && (
          <KnowledgeSection challenges={challenges} onNavigate={onNavigate} />
        )}

        {/* SECTION 7: Transparency */}
        {activeSection === 'transparency' && (
          <TransparencySection transparencyStats={transparencyStats} />
        )}

        {/* SECTION 8: Academy */}
        {activeSection === 'academy' && (
          <AcademySection academyContent={academyContent} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION COMPONENTS
// ============================================================

function ChallengeSection({ weeklyStats, profile, onEnterCode }: any) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Weekly Challenge</div>
            <h2 className="text-2xl font-bold text-gray-900">{weeklyStats.challengeNumber}</h2>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            {weeklyStats.status}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-blue-600" />
              <span className="text-xs text-gray-500">Participants</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{weeklyStats.totalParticipants.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-amber-600" />
              <span className="text-xs text-gray-500">Points Entered</span>
            </div>
            <div className="text-2xl font-bold text-amber-700">{weeklyStats.totalPointsEntered.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-emerald-600" />
              <span className="text-xs text-gray-500">Winners</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">-</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-gray-600" />
              <span className="text-xs text-gray-500">Draw Time</span>
            </div>
            <div className="text-lg font-bold text-gray-700">Sunday 8PM</div>
          </div>
        </div>
      </div>

      {profile && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-blue-950">Ready to participate?</h3>
            <p className="text-sm text-blue-900">You have {profile.points} points available</p>
          </div>
          <button
            onClick={onEnterCode}
            className="px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-950 transition-colors flex items-center gap-2"
          >
            Enter Code <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  );
}

function MySmartCodeSection({ profile, myEntries, aiStatus, currentEntry, totalMyPoints, onNavigate, onEnterCode }: any) {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Target size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Sign in to view your SmartCode</h3>
        <p className="text-gray-400 text-sm mb-4">Access your SmartCode entries and participation history</p>
        <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Sign In</button>
      </div>
    );
  }

  if (myEntries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <Hash size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No SmartCode Yet</h3>
        <p className="text-gray-400 text-sm mb-4">You haven't entered a SmartCode this week</p>
        <button onClick={onEnterCode} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Enter Your Code</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Target size={18} />
            <span className="text-sm font-medium">Your Current SmartCode</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-5xl font-bold tracking-widest">{currentEntry?.smartcode || '---'}</div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentEntry?.points_used || 0} pts</div>
              <div className="text-xs text-blue-200">AI Evaluated</div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-700">{totalMyPoints}</div>
              <div className="text-xs text-gray-500">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{myEntries.length}</div>
              <div className="text-xs text-gray-500">Entries</div>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-700 capitalize">
                {currentEntry?.winner_status || 'Pending'}
              </span>
              <div className="text-xs text-gray-500 mt-1">Status</div>
            </div>
          </div>
        </div>
      </div>

      {aiStatus && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-sm font-bold">AI Weekly Reward Engine</span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs text-blue-600 font-semibold">AI Status</span>
                </div>
                <div className="text-sm font-bold text-blue-800">{aiStatus.ai_status}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <div className="text-xs text-amber-600 font-semibold mb-1">Reward Cycle</div>
                <div className="text-sm font-bold text-amber-800">{aiStatus.reward_cycle}</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              The AI Engine evaluates every active SmartCode automatically. No reward predictions.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <History size={18} className="text-blue-600" /> Entry History
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {myEntries.slice(0, 5).map((entry: ParticipationEntry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center font-mono font-bold text-blue-700">
                  {entry.smartcode}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{entry.points_used} Points</div>
                  <div className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700 capitalize">
                {entry.winner_status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnterCodeSection({
  profile, entryMode, setEntryMode, manualCode, setManualCode, autoCode, currentCode,
  selectedPoints, setSelectedPoints, submitting, entryError, entrySuccess,
  onKeypadPress, onGenerateNewCode, onSubmit, onViewMyCode, onNavigate
}: any) {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">Sign in Required</h3>
        <p className="text-gray-400 text-sm mb-4">Please sign in to enter your SmartCode</p>
        <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Sign In</button>
      </div>
    );
  }

  if (entrySuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">SmartCode Registered!</h3>
        <p className="text-gray-600 text-sm mb-4">{USER_MESSAGES.REGISTRATION_SUCCESS}</p>
        <button onClick={onViewMyCode} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">View My SmartCode</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
          <button
            onClick={() => { setEntryMode('auto'); onGenerateNewCode(); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              entryMode === 'auto' ? 'bg-white text-blue-700 shadow-md' : 'text-gray-500'
            }`}
          >
            <Sparkles size={16} /> Auto Generate
          </button>
          <button
            onClick={() => { setEntryMode('manual'); setManualCode(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              entryMode === 'manual' ? 'bg-white text-blue-700 shadow-md' : 'text-gray-500'
            }`}
          >
            <Edit3 size={16} /> Manual Entry
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-3">
          {entryMode === 'auto' ? 'Your Generated Code' : 'Enter Your Code'}
        </div>
        <div className="inline-flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-20 rounded-xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-3xl font-bold text-blue-800"
            >
              {currentCode[i] || '-'}
            </div>
          ))}
        </div>
        {entryMode === 'auto' && (
          <button
            onClick={onGenerateNewCode}
            className="mt-4 px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} /> Generate New Code
          </button>
        )}
      </div>

      {/* Keypad */}
      {entryMode === 'manual' && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {(['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'] as KeypadKey[]).map((key) => (
              <button
                key={key}
                onClick={() => onKeypadPress(key)}
                className={`h-14 rounded-xl text-xl font-bold transition-all active:scale-95 ${
                  key === 'clear' ? 'bg-gray-100 text-gray-600 text-sm' :
                  key === 'delete' ? 'bg-red-50 text-red-600' :
                  'bg-white border-2 border-gray-200 text-gray-800 hover:border-blue-300'
                }`}
              >
                {key === 'delete' ? <Delete size={20} className="mx-auto" /> : key === 'clear' ? 'CLR' : key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Points Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> Select Points to Use
        </div>
        <div className="flex items-center gap-3">
          {[1, 5, 10, 20].map((pts) => (
            <button
              key={pts}
              onClick={() => setSelectedPoints(pts)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                selectedPoints === pts
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pts}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Available: {profile.points} points
        </p>
      </div>

      {/* Error */}
      {entryError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" />
          <span className="text-red-700 text-sm">{entryError}</span>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={submitting || currentCode.length !== 3}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Hash size={20} /> Submit SmartCode Entry
          </>
        )}
      </button>
    </div>
  );
}

function HistorySection({ history, myEntries, recentEarnings }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <History className="text-blue-600" /> Draw History
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {history.map((h: any, i: number) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center font-mono font-bold text-amber-700">
                  {h.smartcode}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Winner Code: {h.smartcode}</div>
                  <div className="text-xs text-gray-500">{new Date(h.drawn_at).toLocaleDateString()}</div>
                </div>
              </div>
              <span className="text-sm text-gray-600">{h.total_winners} winners</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-amber-600" /> Recent SmartPoints
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentEarnings.map((e: any) => (
            <div key={e.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{getActivityLabel(e.activity_type)}</div>
                <div className="text-xs text-gray-500">{new Date(e.created_at).toLocaleString()}</div>
              </div>
              <span className={`font-bold ${getPointsColor(e.points_earned)}`}>
                +{e.points_earned} SP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WinnerBoardSection({ history, stats }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="text-amber-500" /> Recent Winners
        </h3>
        <div className="space-y-3">
          {history.map((h: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                  <Trophy size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Code: {h.smartcode}</div>
                  <div className="text-xs text-gray-500">{h.total_winners} participants won</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-emerald-600 mb-4">Most Selected</h3>
          <div className="space-y-2">
            {stats.mostSelected.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50">
                <span className="font-mono font-bold text-emerald-700">{s.smartcode}</span>
                <span className="text-sm text-emerald-600">{s.selection_count} times</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-amber-600 mb-4">Least Selected</h3>
          <div className="space-y-2">
            {stats.leastSelected.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-amber-50">
                <span className="font-mono font-bold text-amber-700">{s.smartcode}</span>
                <span className="text-sm text-amber-600">{s.selection_count} times</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgeSection({ challenges, onNavigate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-violet-200" />
          <span className="text-sm font-medium text-violet-200">Knowledge Challenge</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Learn. Quiz. Earn.</h2>
        <p className="text-violet-200">Complete challenges to earn SmartPoints</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map((challenge: any) => (
          <div key={challenge.id} className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                challenge.challenge_type === 'video' ? 'bg-blue-100 text-blue-600' :
                challenge.challenge_type === 'interactive' ? 'bg-violet-100 text-violet-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {challenge.challenge_type}
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Zap size={14} />
                <span className="font-bold text-sm">{challenge.smartpoints_reward} SP</span>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{challenge.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{challenge.duration_minutes} min</span>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center gap-1">
                <Play size={14} /> Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransparencySection({ transparencyStats }: any) {
  if (!transparencyStats) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="text-emerald-200" />
          <span className="text-sm font-medium">Transparency Dashboard</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Ecosystem Statistics</h2>
        <p className="text-emerald-200">Real-time platform metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{transparencyStats.total_active_participants.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Active Participants</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{transparencyStats.verified_participants.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Verified Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <Hash className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{transparencyStats.total_entries_today.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Entries Today</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <Zap className="w-6 h-6 text-violet-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{formatSmartPoints(transparencyStats.smartpoints_earned_today)}</div>
          <div className="text-xs text-gray-500">Points Today</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-blue-600" /> Activity Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Marketplace Transactions</span>
              <span className="font-bold text-gray-900">{transparencyStats.marketplace_transactions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Care Club Contributions</span>
              <span className="font-bold text-gray-900">{transparencyStats.careclub_contributions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quizzes Completed</span>
              <span className="font-bold text-gray-900">{transparencyStats.quizzes_completed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Videos Watched</span>
              <span className="font-bold text-gray-900">{transparencyStats.videos_watched.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="text-red-600" /> Security Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Fraud Attempts Blocked</span>
              <span className="font-bold text-red-600">{transparencyStats.fraud_attempts_blocked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duplicate Accounts Detected</span>
              <span className="font-bold text-red-600">{transparencyStats.duplicate_accounts_detected}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Suspicious Activity Flags</span>
              <span className="font-bold text-amber-600">{transparencyStats.suspicious_activity_flags}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Trust Score</span>
              <span className="font-bold text-emerald-600">{transparencyStats.avg_trust_score.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          SmartPoints can ONLY be earned through approved ecosystem activities.
          They are NEVER directly purchasable.
        </p>
      </div>
    </div>
  );
}

function AcademySection({ academyContent }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Video className="text-blue-200" />
          <span className="text-sm font-medium">SmartCode Academy</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Learn How It Works</h2>
        <p className="text-blue-200">Guides, tutorials, and FAQs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {academyContent.map((content: any) => (
          <div key={content.id} className="bg-white rounded-xl shadow-lg p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              content.content_type === 'guide' ? 'bg-blue-100' :
              content.content_type === 'rule' ? 'bg-amber-100' :
              content.content_type === 'faq' ? 'bg-violet-100' :
              content.content_type === 'tutorial' ? 'bg-emerald-100' :
              'bg-slate-100'
            }`}>
              {content.content_type === 'guide' && <Info size={20} className="text-blue-600" />}
              {content.content_type === 'rule' && <Shield size={20} className="text-amber-600" />}
              {content.content_type === 'faq' && <HelpCircle size={20} className="text-violet-600" />}
              {content.content_type === 'tutorial' && <Video size={20} className="text-emerald-600" />}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-sm text-gray-600">{content.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
