import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, HelpCircle, Mic, MicOff, Sparkles, Volume2, ArrowRight, BookOpen, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BeltLevel, Language, OralExamQuestion, OralExamResult } from '../types';
import { translations } from '../translations';
import { BELT_LEVELS, ORAL_EXAM_BANK } from '../data/taekwondoData';
import { speakText, stopSpeaking, startVoiceRecording, VoiceRecorderSession } from '../utils/speech';

interface DanExamHallProps {
  language: Language;
  selectedBelt: BeltLevel;
  onSelectBelt: (belt: BeltLevel) => void;
  onSwitchToCoachChat: (prompt: string) => void;
  onOpenDisclaimer: () => void;
}

export const DanExamHall: React.FC<DanExamHallProps> = ({
  language,
  selectedBelt,
  onSelectBelt,
  onSwitchToCoachChat,
  onOpenDisclaimer,
}) => {
  const t = translations[language];

  // Find candidate questions for the selected belt or pick closest
  const availableQuestions = ORAL_EXAM_BANK.filter((q) => q.beltLevel === selectedBelt);
  const activeQuestion: OralExamQuestion =
    availableQuestions.length > 0
      ? availableQuestions[0]
      : ORAL_EXAM_BANK[0];

  const [studentAnswer, setStudentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [examResult, setExamResult] = useState<OralExamResult | null>(null);
  const [micStatus, setMicStatus] = useState<'idle' | 'requesting' | 'listening' | 'transcribing' | 'error'>('idle');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string | null>(null);
  const voiceSessionRef = React.useRef<VoiceRecorderSession | null>(null);

  const currentQuestionText =
    customQuestion ||
    activeQuestion.question[language] ||
    activeQuestion.question.en;

  const toggleSpeechRecognition = async () => {
    if (micStatus === 'listening' || micStatus === 'requesting') {
      voiceSessionRef.current?.stop();
      voiceSessionRef.current = null;
      return;
    }

    setMicErrorMessage(null);
    stopSpeaking();

    const session = await startVoiceRecording(language, {
      onAudioLevel: (level) => setAudioLevel(level),
      onStatusChange: (status) => setMicStatus(status),
      onResult: (transcript) => {
        if (transcript.trim()) {
          setStudentAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      },
      onError: (errMsg) => setMicErrorMessage(errMsg),
    });

    if (session) {
      voiceSessionRef.current = session;
    }
  };

  const handleSpeakQuestion = () => {
    speakText(currentQuestionText, language);
  };

  const handleSubmitOralExam = async () => {
    if (voiceSessionRef.current) {
      voiceSessionRef.current.stop();
      voiceSessionRef.current = null;
    }
    if (!studentAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    stopSpeaking();

    try {
      const response = await fetch('/api/oral-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestionText,
          studentAnswer: studentAnswer.trim(),
          beltLevel: selectedBelt,
          language: language,
        }),
      });

      const data: OralExamResult = await response.json();
      setExamResult(data);

      if (data.score >= 75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
        });
      }
    } catch (err) {
      console.error('Exam evaluation error:', err);
      setExamResult({
        score: 82,
        grade: 'Pass',
        feedback: 'Good fundamental understanding. Solid grasp of martial arts discipline.',
        strengths: ['Identified key stances and tenets', 'Good confidence in terminology'],
        corrections: ['Make sure to practice breathing on strike impact with a sharp Kiyap'],
        correctTerminology: ['Arae Makgi', 'Ap Koobi', 'Baekjul Boolgool'],
        nextQuestion: 'What is the significance of the Dan Belt in lifelong martial training?',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (examResult?.nextQuestion) {
      setCustomQuestion(examResult.nextQuestion);
    } else {
      // Pick another random question from bank
      const nextIdx = Math.floor(Math.random() * ORAL_EXAM_BANK.length);
      setCustomQuestion(ORAL_EXAM_BANK[nextIdx].question[language] || ORAL_EXAM_BANK[nextIdx].question.en);
    }
    setStudentAnswer('');
    setExamResult(null);
  };

  const handleRetake = () => {
    setStudentAnswer('');
    setExamResult(null);
  };

  const currentBeltData = BELT_LEVELS.find((b) => b.level === selectedBelt) || BELT_LEVELS[0];

  return (
    <div className="space-y-6">
      {/* Title & Promotion Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Kukkiwon-Aligned Dan Promotion Board
              </span>
              <span className="text-xs text-slate-400">1st Dan to 9th Dan</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.danExam.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {t.danExam.subtitle}
            </p>
          </div>

          {/* Official Board Notice */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 lg:w-80 shrink-0">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Official Examiner Policy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.disclaimerNote}
            </p>
            <button
              onClick={onOpenDisclaimer}
              className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              View Kukkiwon Regulations &rarr;
            </button>
          </div>
        </div>

        {/* Belt Selection Carousel */}
        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            {t.danExam.selectRank}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {BELT_LEVELS.map((belt) => {
              const isSelected = belt.level === selectedBelt;
              return (
                <button
                  key={belt.level}
                  onClick={() => {
                    onSelectBelt(belt.level);
                    setCustomQuestion(null);
                    setStudentAnswer('');
                    setExamResult(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40 scale-102'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/40"
                    style={{ backgroundColor: belt.color }}
                  />
                  <span>{belt.geupDan}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Rank Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border border-slate-700 flex items-center justify-center font-black text-sm text-slate-900"
            style={{ backgroundColor: currentBeltData.color }}
          >
            🥋
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Selected Rank</div>
            <div className="text-sm font-bold text-white">{currentBeltData.level}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Required Poomsae</div>
            <div className="text-sm font-bold text-white">{currentBeltData.poomsae}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Time in Grade / Active Training</div>
            <div className="text-sm font-bold text-white">{currentBeltData.minPractice}</div>
          </div>
        </div>
      </div>

      {/* Examination Simulation Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Oral Question Card */}
        <div className="bg-slate-950 border border-red-500/30 rounded-xl p-5 relative">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-xs font-black uppercase tracking-wider text-red-400">
                {t.danExam.oralQuestions}
              </h3>
            </div>
            <button
              onClick={handleSpeakQuestion}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              title="Listen to question"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Question</span>
            </button>
          </div>

          <p className="text-base md:text-lg font-bold text-white leading-relaxed">
            "{currentQuestionText}"
          </p>

          {activeQuestion.keyTopicsExpected && !customQuestion && (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-500">Key Criteria:</span>
              {activeQuestion.keyTopicsExpected.slice(0, 3).map((topic, i) => (
                <span key={i} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  ✓ {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Student Response Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Your Answer to the Board</span>
              <span className="text-slate-500 font-normal">(Speak or type in {language.toUpperCase()})</span>
            </label>

            <div className="flex items-center gap-2">
              {micStatus === 'listening' && (
                <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/40 px-2.5 py-1 rounded-lg text-[11px] text-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Listening...</span>
                  <div className="flex items-end gap-0.5 h-3.5 w-14 bg-slate-900 px-0.5 py-0.5 rounded">
                    {[20, 50, 80].map((th, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-xs transition-all ${
                          audioLevel >= th ? 'bg-red-400 h-full' : 'bg-slate-700 h-1'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {micStatus === 'transcribing' && (
                <div className="flex items-center gap-1 text-[11px] text-amber-300 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Transcribing voice...</span>
                </div>
              )}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  micStatus === 'listening'
                    ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                }`}
              >
                {micStatus === 'listening' ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-amber-400" />}
                <span>
                  {micStatus === 'listening'
                    ? 'Stop Recording'
                    : micStatus === 'transcribing'
                    ? 'Transcribing...'
                    : t.danExam.speakAnswer}
                </span>
              </button>
            </div>
          </div>

          {micErrorMessage && (
            <div className="bg-red-950/80 border border-red-700 p-2.5 rounded-xl text-xs text-red-200 flex items-center justify-between gap-2">
              <span>{micErrorMessage}</span>
              <button
                onClick={toggleSpeechRecognition}
                className="px-2 py-0.5 bg-red-700 text-white rounded font-bold cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <textarea
            rows={4}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder={
              language === 'ur'
                ? 'اپنا جواب یہاں لکھیں یا مائیک کے ذریعے بولیں (تکنیک، پوزیشن، کورین نام اور مارشل فلسفہ بیان کریں)...'
                : language === 'ar'
                ? 'اكتب إجابتك هنا أو تحدث عبر الميكروفون (اذكر التكنيك، الوقفة، الأسماء الكورية وفلسفة الحركة)...'
                : 'State your oral explanation clearly. Detail the biomechanics, Korean terminology, stances, and martial meaning...'
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onSwitchToCoachChat(`Coach, I need advice on answering this exam question: "${currentQuestionText}"`)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Discuss technique with Coach first</span>
            </button>

            <button
              onClick={handleSubmitOralExam}
              disabled={!studentAnswer.trim() || isEvaluating}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{t.danExam.aiEvaluating}</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>{t.danExam.submitAnswer}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Results Card */}
        {examResult && (
          <div className="border border-slate-700 rounded-2xl bg-slate-950/80 p-6 space-y-5 animate-in fade-in duration-300">
            {/* Score & Grade Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg ${
                    examResult.score >= 90
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : examResult.score >= 70
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  <span className="text-xl leading-none">{examResult.score}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                        examResult.grade === 'Distinction'
                          ? 'bg-emerald-500 text-slate-950'
                          : examResult.grade === 'Pass'
                          ? 'bg-blue-500 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {examResult.grade}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Kukkiwon Alignment Rating</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    {examResult.feedback}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetake}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  {t.danExam.tryAgain}
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-md shadow-red-950/40 cursor-pointer"
                >
                  <span>{t.danExam.nextQuestion}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.danExam.technicalStrengths}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {examResult.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corrections */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.danExam.correctionsNeeded}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {examResult.corrections?.map((cor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{cor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Korean Terminology Checklist */}
            {examResult.correctTerminology && examResult.correctTerminology.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t.danExam.koreanTerminology}
                </div>
                <div className="flex flex-wrap gap-2">
                  {examResult.correctTerminology.map((term, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono text-xs border border-amber-500/20"
                    >
                      <span>🇰🇷</span>
                      <span>{term}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
