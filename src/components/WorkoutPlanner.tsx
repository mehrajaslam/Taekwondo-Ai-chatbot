import React, { useState } from 'react';
import { Dumbbell, Flame, CheckCircle, Clock, Sparkles, Printer, Shield, ChevronRight } from 'lucide-react';
import { BeltLevel, DailyWorkout, Language } from '../types';
import { translations } from '../translations';
import { BELT_LEVELS } from '../data/taekwondoData';

interface WorkoutPlannerProps {
  language: Language;
  currentBelt: BeltLevel;
  onSelectBelt: (belt: BeltLevel) => void;
  onAskCoach: (prompt: string) => void;
}

export const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({
  language,
  currentBelt,
  onSelectBelt,
  onAskCoach,
}) => {
  const t = translations[language];

  const [focusArea, setFocusArea] = useState<string>('Poomsae and Kicking Dynamics');
  const [duration, setDuration] = useState<number>(45);
  const [isGenerating, setIsGenerating] = useState(false);
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);

  const focusOptions = [
    'Poomsae and Kicking Dynamics',
    'Olympic Kyorugi Sparring Speed & Footwork',
    'Flexibility, Hip Mobility & High Head Kicks',
    'Kukkiwon Dan Promotion Endurance & Board Breaking Prep',
    'White to Yellow Belt Fundamental Chambering & Stances',
  ];

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beltLevel: currentBelt,
          focus: focusArea,
          durationMinutes: duration,
          language: language,
        }),
      });
      const data: DailyWorkout = await response.json();
      setWorkout(data);
    } catch (err) {
      console.error('Workout generation error:', err);
      setWorkout({
        title: `${currentBelt} High-Performance Dojang Session`,
        targetBelt: currentBelt,
        durationMinutes: duration,
        warmup: [
          '5 min dynamic footwork switches (Bal Bakka) and light skipping',
          'Hip flexor active rotations & adductor wall stretches',
          'Front leg swing raises (Apcha Olligi) - 15 reps each leg',
        ],
        technicalDrills: [
          { name: 'Ap Chagi (Front Snap Kick) Snap & Retract', reps: '3 sets x 15 reps each leg', coachingTips: 'Lock knee high before releasing' },
          { name: 'Dollyo Chagi (Roundhouse) 45-degree angle', reps: '3 sets x 12 reps each leg', coachingTips: 'Pivot base foot 180 degrees cleanly' },
          { name: 'Momtong Makgi & Baro Jireugi combo', reps: '4 sets x 10 reps', coachingTips: 'Rotate wrist sharply at the point of impact' },
        ],
        poomsaeFocus: 'Form Precision: Focus on crisp chamber transitions, solid Ap Koobi stances, and sharp Kiyap.',
        conditioning: [
          '3 x 30 sec rapid alternating flutter kicks',
          '20 plyometric split jump lunges',
          '1 min horse riding stance (Juchum Seogi) static hold',
        ],
        coolDown: [
          'Hamstring seated butterfly stretch',
          'Deep diaphragmatic breathing',
          'Myung-sang (1 minute silent martial meditation)',
        ],
        coachesNote: 'Train with indomitable spirit (Baekjul Boolgool). Keep your hands in guard position at all times!',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-orange-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 w-fit">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Official Dojang Training Routine
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
            {t.workout.title}
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-300">
            Structured daily dojang workouts engineered by Head of Team Mr. Ali Rizwan, Mr. Muhammad Faizan, Mr. Nauman, and Ms. Shumaila Nazeer.
          </p>
        </div>

        {/* Workout Configuration Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Belt Level
            </label>
            <select
              value={currentBelt}
              onChange={(e) => onSelectBelt(e.target.value as BeltLevel)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              {BELT_LEVELS.map((b) => (
                <option key={b.level} value={b.level} className="bg-slate-900">
                  {b.level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {t.workout.focusArea}
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              {focusOptions.map((f) => (
                <option key={f} value={f} className="bg-slate-900">
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {t.workout.duration}
            </label>
            <div className="flex gap-2">
              {[25, 45, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    duration === d
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerateWorkout}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-950/40 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{t.workout.generating}</span>
              </>
            ) : (
              <>
                <Dumbbell className="w-4 h-4" />
                <span>{t.workout.generateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Workout Showcase */}
      {workout && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {workout.targetBelt} • {workout.durationMinutes} Minutes
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white mt-0.5">
                {workout.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Plan</span>
              </button>
              <button
                onClick={() => onAskCoach(`Coach, I am starting today's workout for ${workout.targetBelt}. Any specific warm-up caution for my knee and hip joints?`)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md cursor-pointer"
              >
                Ask Coach Questions
              </button>
            </div>
          </div>

          {/* Grid Layout of Workout Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Warm-up */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{t.workout.warmup}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {workout.warmup.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Poomsae Focus */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-400">
                <Shield className="w-4 h-4" />
                <span>Poomsae & Stance Mastery</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {workout.poomsaeFocus}
              </p>
            </div>
          </div>

          {/* 3. Technical Drills */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-red-400" />
              <span>{t.workout.technicalDrills}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {workout.technicalDrills.map((drill, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="line-clamp-1">{drill.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-500/30">
                      {drill.reps}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                    <span className="text-amber-400 font-semibold">Coach Tip:</span> {drill.coachingTips}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Conditioning & Cool-down */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                <Flame className="w-4 h-4" />
                <span>{t.workout.conditioning}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {workout.conditioning.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-400">
                <CheckCircle className="w-4 h-4" />
                <span>{t.workout.coolDown}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {workout.coolDown.map((cd, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{cd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coach Note */}
          <div className="bg-gradient-to-r from-red-950/40 via-slate-950 to-amber-950/30 border border-red-900/40 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-amber-300 font-black shrink-0">
              🥋
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">{t.workout.coachNote}</div>
              <p className="leading-relaxed text-slate-300 italic">
                "{workout.coachesNote}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
