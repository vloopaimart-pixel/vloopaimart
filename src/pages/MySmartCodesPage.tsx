import { useState, useEffect, useMemo } from 'react';
import {
  Hash, Plus, Minus, Delete, Edit3, Copy, ArrowLeft,
  Loader2, AlertCircle, CheckCircle2, Sparkles, ShoppingBag,
  Calendar, Filter, Zap,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  getMySmartCodes,
  getAllMySmartCodes,
  addMySmartCode,
  updateMySmartCode,
  deleteMySmartCode,
  duplicateMySmartCode,
  calculateLiveCounter,
  type MySmartCode,
  type PointSource,
} from '../lib/SmartCodeDistributionEngine';
import {
  normalizeSmartCode,
  isValidSmartCode,
  getCurrentWeekPeriod,
} from '../lib/points';
import { getAITransparencyStatus, type AITransparencyStatus } from '../lib/WeeklyAIRewardEngine';

type MySmartCodesPageProps = {
  onNavigate: (page: string) => void;
};

type FilterPeriod = 'current' | 'all';

export default function MySmartCodesPage({ onNavigate }: MySmartCodesPageProps) {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [smartCodes, setSmartCodes] = useState<MySmartCode[]>([]);
  const [filter, setFilter] = useState<FilterPeriod>('current');

  // Add new code state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPoints, setNewPoints] = useState(1);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState(0);

  const weekPeriod = getCurrentWeekPeriod();
  const availablePoints = profile?.points ?? 0;

  // Calculate total allocated from current week's active codes
  const currentWeekCodes = useMemo(
    () => smartCodes.filter(sc => sc.week_period === weekPeriod),
    [smartCodes, weekPeriod]
  );

  const totalAllocated = useMemo(
    () => currentWeekCodes.reduce((sum, sc) => sum + sc.points, 0),
    [currentWeekCodes]
  );

  const liveCounter = useMemo(
    () => calculateLiveCounter(availablePoints, currentWeekCodes.map(sc => ({ code: sc.smartcode, points: sc.points }))),
    [availablePoints, currentWeekCodes]
  );

  const [aiStatus, setAiStatus] = useState<AITransparencyStatus | null>(null);

  useEffect(() => {
    fetchSmartCodes();
    if (profile) {
      getAITransparencyStatus(profile.id, weekPeriod).then(setAiStatus);
    }
  }, [profile, filter]);

  const fetchSmartCodes = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const codes = filter === 'current'
        ? await getMySmartCodes(profile.id)
        : await getAllMySmartCodes(profile.id);
      setSmartCodes(codes);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch SmartCodes');
    }
    setLoading(false);
  };

  // ── Add new SmartCode ──────────────────────────────────────────────────────
  const handleAddCode = async () => {
    if (!profile) return;
    const normalized = normalizeSmartCode(newCode);
    if (!isValidSmartCode(normalized)) {
      setError('Enter a valid 3-digit code (000-999)');
      return;
    }
    if (newPoints <= 0) {
      setError('Points must be greater than zero');
      return;
    }

    setError(null);
    const result = await addMySmartCode(profile.id, normalized, newPoints, 'purchase');
    if (!result.success) {
      setError(result.error || 'Failed to add SmartCode');
      return;
    }

    setSuccess('SmartCode added successfully!');
    setNewCode('');
    setNewPoints(1);
    setShowAddForm(false);
    setTimeout(() => setSuccess(null), 2000);
    fetchSmartCodes();
    refreshProfile();
  };

  // ── Edit SmartCode ────────────────────────────────────────────────────────
  const handleStartEdit = (sc: MySmartCode) => {
    setEditingId(sc.id);
    setEditPoints(sc.points);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (editPoints <= 0) {
      setError('Points must be greater than zero');
      return;
    }

    setError(null);
    const result = await updateMySmartCode(editingId, editPoints);
    if (!result.success) {
      setError(result.error || 'Failed to update SmartCode');
      return;
    }

    setSuccess('SmartCode updated successfully!');
    setEditingId(null);
    setTimeout(() => setSuccess(null), 2000);
    fetchSmartCodes();
    refreshProfile();
  };

  // ── Delete SmartCode ──────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setError(null);
    const result = await deleteMySmartCode(id);
    if (!result.success) {
      setError(result.error || 'Failed to delete SmartCode');
      return;
    }

    setSuccess('SmartCode deleted!');
    setTimeout(() => setSuccess(null), 2000);
    fetchSmartCodes();
    refreshProfile();
  };

  // ── Duplicate SmartCode ───────────────────────────────────────────────────
  const handleDuplicate = async (sc: MySmartCode) => {
    if (!profile) return;
    setError(null);
    const result = await duplicateMySmartCode(profile.id, sc.id, sc.source as PointSource);
    if (!result.success) {
      setError(result.error || 'Failed to duplicate SmartCode');
      return;
    }

    setSuccess('SmartCode duplicated!');
    setTimeout(() => setSuccess(null), 2000);
    fetchSmartCodes();
  };

  // ── Keypad for add form ───────────────────────────────────────────────────
  const handleKeypadPress = (key: string) => {
    if (newCode.length >= 3) return;
    setNewCode(prev => prev + key);
    setError(null);
  };

  const groupedCodes = useMemo(() => {
    // Group by smartcode to show aggregate view
    const groups: Record<string, { code: string; totalPoints: number; count: number; entries: MySmartCode[] }> = {};
    for (const sc of smartCodes) {
      if (!groups[sc.smartcode]) {
        groups[sc.smartcode] = { code: sc.smartcode, totalPoints: 0, count: 0, entries: [] };
      }
      groups[sc.smartcode].totalPoints += sc.points;
      groups[sc.smartcode].count += 1;
      groups[sc.smartcode].entries.push(sc);
    }
    return Object.values(groups).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [smartCodes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-vloop-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="inline-flex items-center gap-1.5">
            <Hash size={16} className="text-vloop-600" />
            <span className="text-sm font-bold text-vloop-800 font-display">My SmartCodes</span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus size={20} className="text-vloop-600" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* ── Live Counter ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-vloop-600 to-vloop-800 text-white text-center">
            <div className="text-xs text-vloop-200 font-semibold mb-1">Available</div>
            <div className="text-2xl font-bold font-display text-gold-400">{liveCounter.available}</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-vloop-950 text-center">
            <div className="text-xs text-vloop-800 font-semibold mb-1">Allocated</div>
            <div className="text-2xl font-bold font-display">{liveCounter.allocated}</div>
          </div>
          <div className={`p-4 rounded-2xl text-center ${
            liveCounter.isExceeded
              ? 'bg-red-50 border-2 border-red-200'
              : liveCounter.isComplete
              ? 'bg-success-50 border-2 border-success-200'
              : 'bg-gray-50 border-2 border-gray-200'
          }`}>
            <div className={`text-xs font-semibold mb-1 ${
              liveCounter.isExceeded ? 'text-red-600'
              : liveCounter.isComplete ? 'text-success-600'
              : 'text-gray-500'
            }`}>
              {liveCounter.isExceeded ? 'Exceeded' : liveCounter.isComplete ? 'Complete' : 'Remaining'}
            </div>
            <div className={`text-2xl font-bold font-display ${
              liveCounter.isExceeded ? 'text-red-700'
              : liveCounter.isComplete ? 'text-success-700'
              : 'text-gray-700'
            }`}>{liveCounter.remaining}</div>
          </div>
        </div>

        {/* ── AI Transparency Status ──────────────────────────────────────────── */}
        {aiStatus && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-vloop-600 to-vloop-800 text-white mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-gold-400" />
              <span className="text-sm font-bold">AI Weekly Reward Engine</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-white/10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  <span className="text-xs text-vloop-200 font-semibold">AI Status</span>
                </div>
                <div className="text-sm font-bold">{aiStatus.ai_status}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Calendar size={12} className="text-gold-400" />
                  <span className="text-xs text-vloop-200 font-semibold">Reward Cycle</span>
                </div>
                <div className="text-sm font-bold">{aiStatus.reward_cycle}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Hash size={12} className="text-gold-400" />
                  <span className="text-xs text-vloop-200 font-semibold">SmartCodes</span>
                </div>
                <div className="text-sm font-bold">{aiStatus.smartcodes_registered}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Zap size={12} className="text-gold-400" />
                  <span className="text-xs text-vloop-200 font-semibold">SmartPoints</span>
                </div>
                <div className="text-sm font-bold">{aiStatus.smartpoints_allocated}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Filter Toggle ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-gray-400" />
          <button
            onClick={() => setFilter('current')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'current' ? 'bg-vloop-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'all' ? 'bg-vloop-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All History
          </button>
          {filter === 'current' && (
            <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> {weekPeriod}
            </span>
          )}
        </div>

        {/* ── Success/Error Messages ─────────────────────────────────────────── */}
        {success && (
          <div className="p-3 rounded-xl bg-success-50 border border-success-200 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-success-600 shrink-0" />
            <span className="text-sm text-success-700 font-semibold">{success}</span>
          </div>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* ── Add New SmartCode Form ─────────────────────────────────────────── */}
        {showAddForm && (
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Add New SmartCode</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Delete size={20} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className={`w-14 h-16 rounded-xl flex items-center justify-center ${
                  newCode[idx] ? 'bg-vloop-100 border-2 border-vloop-300' : 'bg-gray-50 border-2 border-gray-200'
                }`}>
                  <span className="text-2xl font-bold font-display text-gray-800">{newCode[idx] || '-'}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 max-w-xs mx-auto">
              {['1','2','3','4','5','6','7','8','9'].map(key => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  disabled={newCode.length >= 3}
                  className="h-12 rounded-xl bg-gray-50 border border-gray-200 text-lg font-bold text-gray-800 hover:bg-vloop-50 transition-colors disabled:opacity-50"
                >
                  {key}
                </button>
              ))}
              <button
                onClick={() => setNewCode('')}
                className="h-12 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200"
              >
                CLR
              </button>
              <button
                onClick={() => handleKeypadPress('0')}
                disabled={newCode.length >= 3}
                className="h-12 rounded-xl bg-gray-50 border border-gray-200 text-lg font-bold text-gray-800 hover:bg-vloop-50 disabled:opacity-50"
              >
                0
              </button>
              <button
                onClick={() => setNewCode(prev => prev.slice(0, -1))}
                className="h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
              >
                <Delete size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 justify-center">
              <span className="text-sm text-gray-600">Points:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewPoints(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-bold text-gray-800">{newPoints}</span>
                <button
                  onClick={() => setNewPoints(p => p + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddCode}
              disabled={newCode.length !== 3 || newPoints <= 0}
              className="w-full py-3 bg-vloop-600 text-white font-bold rounded-xl hover:bg-vloop-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add SmartCode
            </button>
          </div>
        )}

        {/* ── SmartCodes List ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-vloop-500" />
          </div>
        ) : !profile ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Hash size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Sign in to view your SmartCodes</h3>
            <p className="text-gray-400 text-sm mb-4">Access your SmartCode entries and participation history</p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-vloop-600 text-white font-bold rounded-xl hover:bg-vloop-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : smartCodes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-vloop-50 flex items-center justify-center mx-auto mb-4">
              <Hash size={32} className="text-vloop-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No SmartCodes Yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              {filter === 'current' ? "You haven't added any SmartCodes this week" : 'No SmartCode history found'}
            </p>
            <button
              onClick={() => onNavigate('smartcode')}
              className="px-6 py-3 bg-vloop-600 text-white font-bold rounded-xl hover:bg-vloop-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Sparkles size={18} /> Distribute Points
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Summary header */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-vloop-600 to-vloop-800 text-white mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-vloop-200 mb-0.5">Total SmartCodes</div>
                  <div className="text-2xl font-bold font-display text-gold-400">{smartCodes.length}</div>
                </div>
                <div>
                  <div className="text-xs text-vloop-200 mb-0.5">Total Points</div>
                  <div className="text-2xl font-bold font-display text-gold-400">{totalAllocated}</div>
                </div>
                <div>
                  <div className="text-xs text-vloop-200 mb-0.5">Unique Codes</div>
                  <div className="text-2xl font-bold font-display text-gold-400">{groupedCodes.length}</div>
                </div>
              </div>
            </div>

            {/* Individual SmartCode entries */}
            {smartCodes.map((sc) => (
              <div
                key={sc.id}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* SmartCode display */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vloop-100 to-vloop-200 flex items-center justify-center font-mono font-bold text-xl text-vloop-700">
                      {sc.smartcode}
                    </div>

                    {/* Points and info */}
                    <div>
                      {editingId === sc.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditPoints(p => Math.max(1, p - 1))}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-900">{editPoints}</span>
                          <button
                            onClick={() => setEditPoints(p => p + 1)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900 font-display">{sc.points}</span>
                          <span className="text-sm text-gray-500">pts</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          sc.mode === 'ai_auto'
                            ? 'bg-vloop-100 text-vloop-700'
                            : 'bg-gold-100 text-gold-700'
                        }`}>
                          {sc.mode === 'ai_auto' ? (
                            <span className="flex items-center gap-1">
                              <Sparkles size={10} /> AI Auto
                            </span>
                          ) : (
                            'Manual'
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(sc.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    {editingId === sc.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 rounded-lg bg-success-50 text-success-600 hover:bg-success-100 transition-colors"
                          title="Save"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setError(null); }}
                          className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                          title="Cancel"
                        >
                          <Delete size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(sc)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(sc)}
                          className="p-2 rounded-lg bg-gray-50 text-vloop-600 hover:bg-vloop-100 transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(sc.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Delete size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA to distribute more ──────────────────────────────────────────── */}
        {profile && smartCodes.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-vloop-950 text-sm">Want to distribute more points?</h3>
                <p className="text-xs text-vloop-800">You have {availablePoints} SmartPoints available</p>
              </div>
              <button
                onClick={() => onNavigate('smartcode')}
                className="px-4 py-2 bg-vloop-800 text-white text-sm font-bold rounded-xl hover:bg-vloop-900 transition-colors flex items-center gap-1"
              >
                Distribute <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── Shop CTA when no points ─────────────────────────────────────────── */}
        {profile && availablePoints === 0 && smartCodes.length === 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-vloop-50 border border-vloop-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-vloop-800 text-sm">Earn SmartPoints</h3>
                <p className="text-xs text-vloop-600">Shop or contribute to Care Club to earn points</p>
              </div>
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-4 py-2 bg-vloop-600 text-white text-sm font-bold rounded-xl hover:bg-vloop-700 transition-colors flex items-center gap-1"
              >
                <ShoppingBag size={14} /> Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
