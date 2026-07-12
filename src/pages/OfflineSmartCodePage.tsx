/**
 * VLOOP Offline AI SmartCode Platform
 * ====================================
 *
 * Phase 32 — Enterprise Offline AI SmartCode Platform
 *
 * Three Permanent SmartCode Entry Methods:
 *   A. Digital Entry — Create SmartCodes inside the VLOOP app
 *   B. Manual Entry — Manually create unlimited 3-digit SmartCodes
 *   C. Offline AI Entry — Write on paper, photo, upload, AI reads
 *
 * Enterprise Rules:
 *   - No demo data
 *   - No fake OCR
 *   - No fake uploads
 *   - Architecture only for OCR
 *
 * Version: 32.0.0
 */

import { useState, useRef, useMemo } from 'react';
import {
  Camera, Upload, FileText, CheckCircle2, XCircle, AlertTriangle,
  Hash, Zap, Eye, RefreshCw, ArrowLeft, ArrowRight, ShieldCheck,
  Sparkles, Trash2, Plus, Minus, Info, ScanLine, Mic, MessageCircle,
  CreditCard, Lock,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  distributePointsAI,
  distributePointsManual,
  calculateLiveCounter,
  type SmartCodeEntry,
} from '../lib/SmartCodeDistributionEngine';
import {
  validateOfflineEntries,
  checkDuplicateSubmission,
  processImageForSmartCodes,
  getWhitePaperTemplate,
  getFutureInputChannels,
  storeOfflineSubmission,
  OFFLINE_ENGINE_CONFIG,
  type EntryMethod,
  type OCRProcessingResult,
  type OfflineValidationResult,
} from '../lib/OfflineAISmartCodeEngine';
import {
  normalizeSmartCode,
  isValidSmartCode,
  getCurrentWeekPeriod,
} from '../lib/CoreBusinessEngine';
import { parseTextFormat } from '../lib/SmartCodeParser';
import { uploadFile } from '../lib/storage';

type Step = 'method' | 'input' | 'review' | 'success';

type Props = {
  onNavigate: (page: string) => void;
};

export default function OfflineSmartCodePage({ onNavigate }: Props) {
  const { profile, refreshProfile } = useAuth();

  const [step, setStep] = useState<Step>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entryMethod, setEntryMethod] = useState<EntryMethod | null>(null);

  // Digital mode
  const [digitalMode, setDigitalMode] = useState<'ai_auto' | 'manual'>('manual');
  const [digitalAllocations, setDigitalAllocations] = useState<{ code: string; points: number }[]>([]);
  const [digitalCode, setDigitalCode] = useState('');
  const [digitalPoints, setDigitalPoints] = useState(1);

  // Manual text entry
  const [manualText, setManualText] = useState('');

  // Offline AI entry
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRProcessingResult | null>(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [validation, setValidation] = useState<OfflineValidationResult | null>(null);

  const availablePoints = profile?.points ?? 0;
  const weekPeriod = getCurrentWeekPeriod();

  const digitalTotal = useMemo(() =>
    digitalAllocations.reduce((sum, a) => sum + a.points, 0),
    [digitalAllocations]
  );

  const manualEntries = useMemo(() => {
    if (!manualText.trim()) return [];
    const result = parseTextFormat(manualText, 'manual');
    return result.entries;
  }, [manualText]);

  const manualTotal = useMemo(() =>
    manualEntries.reduce((sum, e) => sum + e.points, 0),
    [manualEntries]
  );

  const liveCounter = useMemo(() => {
    if (entryMethod === 'digital') {
      return calculateLiveCounter(availablePoints, digitalAllocations);
    }
    if (entryMethod === 'manual') {
      return calculateLiveCounter(availablePoints, manualEntries.map(e => ({ code: e.code, points: e.points })));
    }
    if (entryMethod === 'offline_ai' && ocrResult) {
      return calculateLiveCounter(availablePoints, ocrResult.entries.map(e => ({ code: e.code, points: e.points })));
    }
    return calculateLiveCounter(availablePoints, []);
  }, [entryMethod, availablePoints, digitalAllocations, manualEntries, ocrResult]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAddDigitalCode = () => {
    const normalized = normalizeSmartCode(digitalCode);
    if (!isValidSmartCode(normalized)) {
      setError('Enter a valid 3-digit code (000-999)');
      return;
    }
    if (digitalPoints < 1) {
      setError('Points must be greater than zero');
      return;
    }
    if (digitalTotal + digitalPoints > availablePoints) {
      setError(`Points Exceeded! Only ${availablePoints - digitalTotal} points remaining`);
      return;
    }

    setDigitalAllocations([...digitalAllocations, { code: normalized, points: digitalPoints }]);
    setDigitalCode('');
    setDigitalPoints(1);
    setError(null);
  };

  const handleRemoveDigitalCode = (index: number) => {
    setDigitalAllocations(digitalAllocations.filter((_, i) => i !== index));
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!OFFLINE_ENGINE_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    if (file.size > OFFLINE_ENGINE_CONFIG.MAX_IMAGE_SIZE) {
      setError('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      setUploadedImage(event.target?.result as string);
      setOcrResult(null);
      setError(null);

      if (profile) {
        const { path, error: uploadErr } = await uploadFile('bill-uploads', file, profile.id);
        if (uploadErr) {
          console.warn('Storage upload failed:', uploadErr);
        } else if (path) {
          setStoragePath(path);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async () => {
    if (!uploadedImage || !profile) return;

    setOcrProcessing(true);
    setError(null);

    try {
      const result = await processImageForSmartCodes(
        uploadedImage,
        profile.id,
        availablePoints
      );
      setOcrResult(result);

      if (!result.success) {
        setError(result.validation.errors[0] || 'OCR processing not available');
      }
    } catch (err: any) {
      setError(err.message || 'OCR processing failed');
    }

    setOcrProcessing(false);
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const getEntriesForValidation = (): SmartCodeEntry[] => {
    if (entryMethod === 'digital') {
      return digitalAllocations;
    }
    if (entryMethod === 'manual') {
      return manualEntries.map(e => ({ code: e.code, points: e.points }));
    }
    if (entryMethod === 'offline_ai' && ocrResult) {
      return ocrResult.entries.map(e => ({ code: e.code, points: e.points }));
    }
    return [];
  };

  const validateEntries = (): OfflineValidationResult => {
    const entries = getEntriesForValidation();
    return validateOfflineEntries(entries, availablePoints);
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleContinue = async () => {
    setError(null);

    if (step === 'method') {
      if (!entryMethod) {
        setError('Please select an entry method');
        return;
      }
      setStep('input');
      return;
    }

    if (step === 'input') {
      if (entryMethod === 'digital' && digitalMode === 'ai_auto') {
        // AI auto — skip to processing
        await submitEntries([]);
        return;
      }

      const entries = getEntriesForValidation();
      if (entries.length === 0) {
        setError('Please enter at least one SmartCode');
        return;
      }

      const validationResult = validateEntries();
      setValidation(validationResult);

      if (!validationResult.valid) {
        setError('Validation failed. Please review your entries.');
        return;
      }

      setStep('review');
      return;
    }

    if (step === 'review') {
      await submitEntries(getEntriesForValidation());
    }
  };

  const submitEntries = async (entries: SmartCodeEntry[]) => {
    if (!profile) {
      onNavigate('home');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;

      if (entryMethod === 'digital' && digitalMode === 'ai_auto') {
        result = await distributePointsAI(profile.id, availablePoints, 'purchase');
      } else {
        if (entries.length === 0) {
          setError('No entries to submit');
          setLoading(false);
          return;
        }

        // Check for duplicate submission
        const dupCheck = await checkDuplicateSubmission(profile.id, entries, weekPeriod);
        if (dupCheck.isDuplicate) {
          setError(dupCheck.reason);
          setLoading(false);
          return;
        }

        result = await distributePointsManual(profile.id, entries, availablePoints, 'purchase');
      }

      if (!result.success) {
        setError(result.error || 'Submission failed');
        setLoading(false);
        return;
      }

      // Store audit trail
      const parsedEntries = entries.map((e, i) => ({
        code: e.code,
        points: e.points,
        raw: `${e.code} = ${e.points}`,
        confidence: 1.0,
        source: (entryMethod === 'offline_ai' ? 'ocr' : entryMethod === 'manual' ? 'manual' : 'text') as import('../lib/SmartCodeParser').ParsedSource,
        lineNumber: i + 1,
      }));

      await storeOfflineSubmission(
        profile.id,
        entryMethod || 'manual',
        parsedEntries,
        'processed'
      );

      await refreshProfile();
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    }

    setLoading(false);
  };

  const handleBack = () => {
    if (step === 'input') setStep('method');
    else if (step === 'review') setStep('input');
    else if (step === 'success') onNavigate('my-smartcodes');
  };

  const canContinue = () => {
    if (step === 'method') return entryMethod !== null;
    if (step === 'input') {
      if (entryMethod === 'digital') {
        if (digitalMode === 'ai_auto') return true;
        return digitalAllocations.length > 0 && liveCounter.isComplete;
      }
      if (entryMethod === 'manual') {
        return manualEntries.length > 0 && liveCounter.isComplete;
      }
      if (entryMethod === 'offline_ai') {
        return ocrResult !== null && ocrResult.success;
      }
    }
    if (step === 'review') return validation?.valid ?? false;
    return true;
  };

  const resetForm = () => {
    setStep('method');
    setEntryMethod(null);
    setDigitalAllocations([]);
    setManualText('');
    setUploadedImage(null);
    setOcrResult(null);
    setValidation(null);
    setError(null);
  };

  const futureChannels = getFutureInputChannels();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-vloop-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="inline-flex items-center gap-1.5">
            <Camera size={16} className="text-gold-500" />
            <span className="text-sm font-bold text-vloop-800 font-display">Offline SmartCode</span>
          </div>
          <div className="w-9" />
        </div>
        {step !== 'success' && (
          <div className="max-w-md mx-auto px-4 pb-2.5 flex items-center justify-center gap-1.5">
            {(['method', 'input', 'review'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  (['method', 'input', 'review'] as Step[]).indexOf(step) >= i ? 'bg-vloop-500 w-7' : 'bg-gray-200 w-3'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 pb-28">

        {/* ── STEP: Method Selection ──────────────────────────────────────── */}
        {step === 'method' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vloop-600 to-vloop-900 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Hash size={36} className="text-gold-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">Enter SmartCodes</h1>
              <p className="text-gray-500 text-sm">Choose your preferred entry method</p>
            </div>

            <div className="space-y-3">
              {/* Method A: Digital */}
              <button
                onClick={() => setEntryMethod('digital')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  entryMethod === 'digital'
                    ? 'border-vloop-500 bg-vloop-50 shadow-lg'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    entryMethod === 'digital' ? 'bg-vloop-600' : 'bg-gray-100'
                  }`}>
                    <Zap size={24} className={entryMethod === 'digital' ? 'text-white' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">A. Digital Entry</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Create SmartCodes inside the VLOOP app</p>
                  </div>
                  {entryMethod === 'digital' && <CheckCircle2 size={20} className="text-vloop-600" />}
                </div>
              </button>

              {/* Method B: Manual */}
              <button
                onClick={() => setEntryMethod('manual')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  entryMethod === 'manual'
                    ? 'border-gold-500 bg-gold-50 shadow-lg'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    entryMethod === 'manual' ? 'bg-gold-500' : 'bg-gray-100'
                  }`}>
                    <FileText size={24} className={entryMethod === 'manual' ? 'text-white' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">B. Manual Entry</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Type unlimited 3-digit codes manually</p>
                  </div>
                  {entryMethod === 'manual' && <CheckCircle2 size={20} className="text-gold-600" />}
                </div>
              </button>

              {/* Method C: Offline AI */}
              <button
                onClick={() => setEntryMethod('offline_ai')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  entryMethod === 'offline_ai'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    entryMethod === 'offline_ai' ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <Camera size={24} className={entryMethod === 'offline_ai' ? 'text-white' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">C. Offline AI Entry</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Write on paper, photo, upload, AI reads</p>
                  </div>
                  {entryMethod === 'offline_ai' && <CheckCircle2 size={20} className="text-blue-600" />}
                </div>
              </button>
            </div>

            {/* Available Points */}
            <div className="mt-6 p-4 rounded-xl bg-vloop-50 border border-vloop-100">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-vloop-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  <strong className="text-vloop-700">Available SmartPoints:</strong> You have {availablePoints} points to distribute. All points must be allocated.
                </p>
              </div>
            </div>

            {/* Future AI Input Channels (architecture only) */}
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={14} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase">Future AI Input Channels</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {futureChannels.map((ch) => {
                  const icons: Record<string, any> = {
                    voice: Mic,
                    whatsapp: MessageCircle,
                    camera_live: ScanLine,
                    offline_smartcard: CreditCard,
                  };
                  const Icon = icons[ch.channel] || Lock;
                  return (
                    <div key={ch.channel} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-gray-100">
                      <Icon size={14} className="text-gray-400" />
                      <div>
                        <div className="text-xs font-semibold text-gray-600 capitalize">
                          {ch.channel.replace('_', ' ')}
                        </div>
                        <div className="text-[10px] text-gray-400">Architecture Ready</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: Input ─────────────────────────────────────────────────── */}
        {step === 'input' && (
          <div className="animate-fade-in">

            {/* Digital Entry */}
            {entryMethod === 'digital' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Digital SmartCode Entry</h2>
                  <p className="text-sm text-gray-500">Distribute your {availablePoints} points</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setDigitalMode('ai_auto')}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      digitalMode === 'ai_auto' ? 'bg-vloop-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Sparkles size={14} className="inline mr-1" /> AI Auto
                  </button>
                  <button
                    onClick={() => setDigitalMode('manual')}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      digitalMode === 'manual' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Hash size={14} className="inline mr-1" /> Manual
                  </button>
                </div>

                {digitalMode === 'ai_auto' ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-vloop-600 to-vloop-900 text-white text-center">
                    <Sparkles size={48} className="mx-auto mb-3 text-gold-400" />
                    <h3 className="font-bold text-lg mb-2">AI Automatic Distribution</h3>
                    <p className="text-sm text-vloop-200">The AI will automatically distribute your {availablePoints} points across optimized SmartCodes.</p>
                  </div>
                ) : (
                  <div>
                    {/* Live Counter */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-3 rounded-xl bg-vloop-50 border border-vloop-100 text-center">
                        <div className="text-xs text-vloop-600 font-semibold mb-0.5">Available</div>
                        <div className="text-xl font-bold text-vloop-700 font-display">{liveCounter.available}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-gold-50 border border-gold-100 text-center">
                        <div className="text-xs text-gold-600 font-semibold mb-0.5">Allocated</div>
                        <div className="text-xl font-bold text-gold-700 font-display">{liveCounter.allocated}</div>
                      </div>
                      <div className={`p-3 rounded-xl border text-center ${
                        liveCounter.isExceeded ? 'bg-red-50 border-red-200'
                        : liveCounter.isComplete ? 'bg-success-50 border-success-200'
                        : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`text-xs font-semibold mb-0.5 ${
                          liveCounter.isExceeded ? 'text-red-600'
                          : liveCounter.isComplete ? 'text-success-600'
                          : 'text-gray-500'
                        }`}>
                          {liveCounter.isExceeded ? 'Exceeded' : liveCounter.isComplete ? 'Complete' : 'Remaining'}
                        </div>
                        <div className={`text-xl font-bold font-display ${
                          liveCounter.isExceeded ? 'text-red-700'
                          : liveCounter.isComplete ? 'text-success-700'
                          : 'text-gray-700'
                        }`}>{liveCounter.remaining}</div>
                      </div>
                    </div>

                    {/* Allocations */}
                    {digitalAllocations.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {digitalAllocations.map((alloc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-vloop-600 w-10">{alloc.code}</span>
                              <span className="text-gray-600">=</span>
                              <span className="font-semibold">{alloc.points} pts</span>
                            </div>
                            <button onClick={() => handleRemoveDigitalCode(idx)} className="text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Code Form */}
                    {liveCounter.remaining > 0 && !liveCounter.isExceeded && (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-4">
                        <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Add SmartCode</div>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            maxLength={3}
                            value={digitalCode}
                            onChange={(e) => setDigitalCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000"
                            className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-vloop-500"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={() => setDigitalPoints(Math.max(1, digitalPoints - 1))} className="w-8 h-8 rounded-lg bg-gray-100">
                              <Minus size={14} className="mx-auto" />
                            </button>
                            <span className="w-10 text-center font-bold">{digitalPoints}</span>
                            <button onClick={() => setDigitalPoints(Math.min(liveCounter.remaining, digitalPoints + 1))} className="w-8 h-8 rounded-lg bg-gray-100">
                              <Plus size={14} className="mx-auto" />
                            </button>
                          </div>
                          <button
                            onClick={handleAddDigitalCode}
                            disabled={digitalCode.length !== 3 || liveCounter.allocated + digitalPoints > availablePoints}
                            className="flex-1 py-2 bg-vloop-600 text-white font-bold rounded-lg disabled:opacity-50"
                          >
                            Add
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Duplicate SmartCodes are allowed (same code, different points)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Manual Text Entry */}
            {entryMethod === 'manual' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Manual SmartCode Entry</h2>
                  <p className="text-sm text-gray-500">Enter one code per line: CODE = POINTS</p>
                </div>

                {/* Live Counter */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-3 rounded-xl bg-vloop-50 border border-vloop-100 text-center">
                    <div className="text-xs text-vloop-600 font-semibold mb-0.5">Available</div>
                    <div className="text-xl font-bold text-vloop-700 font-display">{liveCounter.available}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gold-50 border border-gold-100 text-center">
                    <div className="text-xs text-gold-600 font-semibold mb-0.5">Allocated</div>
                    <div className="text-xl font-bold text-gold-700 font-display">{liveCounter.allocated}</div>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${
                    liveCounter.isExceeded ? 'bg-red-50 border-red-200'
                    : liveCounter.isComplete ? 'bg-success-50 border-success-200'
                    : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`text-xs font-semibold mb-0.5 ${
                      liveCounter.isExceeded ? 'text-red-600'
                      : liveCounter.isComplete ? 'text-success-600'
                      : 'text-gray-500'
                    }`}>
                      {liveCounter.isExceeded ? 'Exceeded' : liveCounter.isComplete ? 'Complete' : 'Remaining'}
                    </div>
                    <div className={`text-xl font-bold font-display ${
                      liveCounter.isExceeded ? 'text-red-700'
                      : liveCounter.isComplete ? 'text-success-700'
                      : 'text-gray-700'
                    }`}>{liveCounter.remaining}</div>
                  </div>
                </div>

                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={`466 = 2\n764 = 5\n854 = 10\n010 = 1`}
                  className="w-full h-48 p-4 border border-gray-200 rounded-2xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-vloop-500"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Example format: <code className="bg-gray-100 px-1 rounded">466 = 2</code> (one entry per line). Duplicates allowed.
                </p>
              </div>
            )}

            {/* Offline AI Entry */}
            {entryMethod === 'offline_ai' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Offline AI Entry</h2>
                  <p className="text-sm text-gray-500">Upload a photo of your handwritten SmartCodes</p>
                </div>

                {/* White Paper Standard Template */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-blue-800">White Paper Standard Format</span>
                  </div>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
                    {getWhitePaperTemplate()}
                  </pre>
                </div>

                {/* Upload Area */}
                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-vloop-500 hover:bg-vloop-50 transition-all"
                  >
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="font-semibold text-gray-700 mb-1">Tap to upload photo</p>
                    <p className="text-xs text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">JPEG, PNG, WebP up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded SmartCode"
                      className="w-full rounded-2xl shadow-lg"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setOcrResult(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* OCR Processing */}
                {uploadedImage && !ocrResult && (
                  <button
                    onClick={processOCR}
                    disabled={ocrProcessing}
                    className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {ocrProcessing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Reading SmartCodes...
                      </>
                    ) : (
                      <>
                        <Eye size={18} />
                        Read SmartCodes
                      </>
                    )}
                  </button>
                )}

                {/* OCR Results — Architecture Ready Status */}
                {ocrResult && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={18} className={ocrResult.success ? 'text-success-600' : 'text-gray-400'} />
                      <span className="font-semibold text-gray-900">OCR Engine Status</span>
                    </div>

                    {ocrResult.success ? (
                      <div className="space-y-1 font-mono text-sm">
                        {ocrResult.entries.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="font-bold text-vloop-600">{entry.code}</span>
                            <span className="text-gray-600">{entry.points} pts</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <Lock size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">OCR Service Not Integrated</p>
                        <p className="text-xs text-gray-500 mb-3">
                          Architecture is ready for Google Vision, AWS Textract, Azure Computer Vision, or custom ML models.
                        </p>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {['Google Vision', 'AWS Textract', 'Azure Vision', 'Custom ML'].map((p) => (
                            <span key={p} className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── STEP: Review ────────────────────────────────────────────────── */}
        {step === 'review' && validation && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-vloop-100 flex items-center justify-center mx-auto mb-4">
                <Eye size={36} className="text-vloop-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Review SmartCodes</h2>
              <p className="text-sm text-gray-500">Verify your entries before submission</p>
            </div>

            {/* Validation Summary */}
            <div className={`p-4 rounded-xl mb-4 ${
              validation.valid ? 'bg-success-50 border border-success-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {validation.valid ? (
                  <CheckCircle2 size={20} className="text-success-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <span className={`font-bold ${validation.valid ? 'text-success-700' : 'text-red-700'}`}>
                  {validation.valid ? 'All SmartCodes Valid' : 'Validation Issues Found'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Entries:</span> <strong>{validation.stats.totalEntries}</strong></div>
                <div><span className="text-gray-500">Points:</span> <strong>{validation.stats.totalPoints}</strong></div>
                <div><span className="text-gray-500">Valid:</span> <strong>{validation.stats.validEntries}</strong></div>
                <div><span className="text-gray-500">Invalid:</span> <strong>{validation.stats.invalidEntries}</strong></div>
              </div>
            </div>

            {/* Errors */}
            {validation.errors.length > 0 && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                <p className="font-semibold text-red-700 text-sm mb-2">Errors:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {validation.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-gold-50 border border-gold-200 mb-4">
                <p className="font-semibold text-gold-700 text-sm mb-2">Warnings:</p>
                <ul className="text-xs text-gold-600 space-y-1">
                  {validation.warnings.map((warn, i) => (
                    <li key={i}>• {warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duplicate Info */}
            {validation.stats.duplicateCodes.length > 0 && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 mb-4">
                <p className="font-semibold text-blue-700 text-sm mb-1">Duplicate SmartCodes Detected</p>
                <p className="text-xs text-blue-600">
                  Codes: {validation.stats.duplicateCodes.join(', ')} — duplicates are allowed (same code, different points).
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: Success ───────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="animate-fade-in flex flex-col items-center justify-center pt-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center mb-6 shadow-xl">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-display mb-3 text-center">SmartCodes Accepted!</h2>
            <p className="text-gray-500 text-sm text-center mb-8 max-w-xs">
              Your SmartCodes have been successfully registered for this week's reward program.
            </p>

            <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-vloop-50 to-gold-50 border border-vloop-200 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-vloop-600 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">AI Weekly Reward Engine</h3>
                  <p className="text-xs text-gray-600">
                    The AI Weekly Reward Engine will automatically evaluate your entries and place them into the appropriate reward pool.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={() => onNavigate('my-smartcodes')}
                className="w-full py-4 bg-vloop-600 text-white font-bold rounded-2xl hover:bg-vloop-700 transition-colors"
              >
                View My SmartCodes
              </button>
              <button
                onClick={resetForm}
                className="w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50"
              >
                Enter More Codes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {step !== 'success' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100">
          <div className="max-w-md mx-auto px-4 py-3 pb-5">
            {step === 'input' && entryMethod === 'manual' && !liveCounter.isComplete && !liveCounter.isExceeded && manualEntries.length > 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-center">
                {liveCounter.remaining > 0
                  ? `Allocate remaining ${liveCounter.remaining} points to continue`
                  : 'Adjust your allocations to continue'}
              </div>
            ) : step === 'input' && entryMethod === 'digital' && digitalMode === 'manual' && !liveCounter.isComplete && !liveCounter.isExceeded && digitalAllocations.length > 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-center">
                {liveCounter.remaining > 0
                  ? `Allocate remaining ${liveCounter.remaining} points to continue`
                  : 'Adjust your allocations to continue'}
              </div>
            ) : (
              <button
                onClick={handleContinue}
                disabled={loading || !canContinue()}
                className="w-full py-4 bg-gradient-to-r from-vloop-600 to-vloop-800 text-white font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
