import React, { useState } from 'react';
import { BookOpen, Sparkles, Compass, Filter, ChevronRight, Award, ShieldCheck } from 'lucide-react';
import { Language, PoomsaeDetail } from '../types';
import { POOMSAE_LIST } from '../data/taekwondoData';
import { translations } from '../translations';
import { speakText } from '../utils/speech';

interface PoomsaeMasterProps {
  language: Language;
  onPracticeInChat: (poomsaeName: string) => void;
}

export const PoomsaeMaster: React.FC<PoomsaeMasterProps> = ({
  language,
  onPracticeInChat,
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | 'geup' | 'dan'>('all');
  const [selectedPoomsae, setSelectedPoomsae] = useState<PoomsaeDetail>(POOMSAE_LIST[0]);

  const filteredPoomsae = POOMSAE_LIST.filter((p) => {
    if (filter === 'geup') return p.id.startsWith('taegeuk');
    if (filter === 'dan') return !p.id.startsWith('taegeuk');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Kukkiwon Standard Forms Encyclopedia
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Taegeuk & Black Belt Poomsae (품새)
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Poomsae are the sacred blueprint of Taekwondo: a harmonious series of defending and attacking techniques against imaginary opponents, embodying ancient oriental philosophy, cosmic harmony, and martial poise.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Forms (17)
          </button>
          <button
            onClick={() => setFilter('geup')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'geup'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Taegeuk 1 to 8 (Geup Ranks)
          </button>
          <button
            onClick={() => setFilter('dan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'dan'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Black Belt Yudanja (1st to 9th Dan)
          </button>
        </div>
      </div>

      {/* Main Content Layout: List on Left, Active Form Deep-Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredPoomsae.map((p) => {
            const isSelected = selectedPoomsae.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPoomsae(p)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800 border-red-500/80 shadow-lg shadow-red-950/30'
                    : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{p.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800">
                      {p.hangul}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="text-red-400 font-semibold">{p.belt}</span>
                    <span>•</span>
                    <span>{p.movements} Movements</span>
                  </div>
                </div>

                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    isSelected ? 'text-red-400 translate-x-1' : 'text-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Right Detail Showcase */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  {selectedPoomsae.belt}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">{selectedPoomsae.trigram}</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1 flex items-center gap-3">
                {selectedPoomsae.name}
                <button
                  onClick={() => speakText(selectedPoomsae.hangul, 'ko')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  title="Korean pronunciation"
                >
                  🔊 {selectedPoomsae.hangul}
                </button>
              </h3>
            </div>

            <button
              onClick={() => onPracticeInChat(`Coach, please guide me step-by-step through ${selectedPoomsae.name} (${selectedPoomsae.hangul}). What are the key mistakes to avoid?`)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-red-950/40 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice with Coach</span>
            </button>
          </div>

          {/* Form Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[11px] text-slate-400">Total Count</div>
              <div className="text-lg font-bold text-white">{selectedPoomsae.movements} Movements</div>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[11px] text-slate-400">Trigram Symbol</div>
              <div className="text-sm font-bold text-amber-300 truncate">{selectedPoomsae.trigram}</div>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400">Standard Test Rank</div>
              <div className="text-sm font-bold text-emerald-400">{selectedPoomsae.belt}</div>
            </div>
          </div>

          {/* Core Philosophy & Meaning */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Philosophical Meaning & Origin
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedPoomsae.meaning}
            </p>
            <div className="mt-2 text-xs text-slate-400 italic border-l-2 border-red-500 pl-3">
              "{selectedPoomsae.philosophicalSignificance}"
            </div>
          </div>

          {/* Key Techniques Checklist */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-red-400" />
              Key Techniques & Stances Mastered in this Form
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedPoomsae.keyTechniques.map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3 text-xs text-slate-200 flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Advice Box */}
          <div className="bg-gradient-to-r from-red-950/30 to-slate-950 border border-red-900/30 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-300 font-bold shrink-0">
              💡
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">Grandmaster Coach Tip</div>
              <p className="leading-relaxed text-slate-300">
                Never rush between movements. Maintain eye level during stance transitions, pivot the foot sharply at the exact moment of block contact, and synchronize your breath with a focused Kiyap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
