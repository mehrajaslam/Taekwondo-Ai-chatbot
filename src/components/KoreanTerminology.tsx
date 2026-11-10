import React, { useState } from 'react';
import { Search, Volume2, Globe, Check, Award, HelpCircle, Sparkles } from 'lucide-react';
import { Language, KoreanTerm } from '../types';
import { KOREAN_TERMS } from '../data/taekwondoData';
import { translations } from '../translations';
import { speakText } from '../utils/speech';

interface KoreanTerminologyProps {
  language: Language;
  onAskCoachAboutTerm: (term: string) => void;
}

export const KoreanTerminology: React.FC<KoreanTerminologyProps> = ({
  language,
  onAskCoachAboutTerm,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const categories = [
    'All',
    'Commands',
    'Stances (Seogi)',
    'Blocks (Makgi)',
    'Kicks (Chagi)',
    'Sparring',
    'Numbers & Philosophy',
  ];

  const filteredTerms = KOREAN_TERMS.filter((term) => {
    const matchesCategory = activeCategory === 'All' || term.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      term.korean.toLowerCase().includes(query) ||
      term.hangul.includes(query) ||
      term.en.toLowerCase().includes(query) ||
      term.ur.includes(query) ||
      term.ar.includes(query);

    return matchesCategory && matchesSearch;
  });

  const currentQuizTerm = KOREAN_TERMS[quizIndex % KOREAN_TERMS.length];

  const handleNextQuiz = (isCorrect: boolean) => {
    if (isCorrect) setQuizScore((prev) => prev + 1);
    setShowQuizAnswer(false);
    setQuizIndex((prev) => (prev + 1) % KOREAN_TERMS.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Kukkiwon Standard Vocabulary
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Korean Martial Arts Terminology (한국어 용어)
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-300">
              Master the official commands, anatomical striking points, stances, kicks, and five tenets in Korean, English, Urdu, and Arabic.
            </p>
          </div>

          <button
            onClick={() => {
              setQuizMode(!quizMode);
              setShowQuizAnswer(false);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{quizMode ? 'Back to Vocabulary List' : 'Start Rapid Oral Flashcards'}</span>
          </button>
        </div>

        {/* Search & Categories */}
        {!quizMode && (
          <div className="mt-6 space-y-3 border-t border-slate-800/80 pt-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Korean, English, Urdu, or Arabic terms..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rapid Oral Quiz Mode */}
      {quizMode ? (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span>Flashcard #{quizIndex + 1} of {KOREAN_TERMS.length}</span>
            <span className="font-bold text-emerald-400">Score: {quizScore}</span>
          </div>

          <div className="space-y-3 py-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              {currentQuizTerm.category}
            </span>

            <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono">
              {currentQuizTerm.hangul}
            </div>
            <div className="text-xl font-bold text-white tracking-wide">
              {currentQuizTerm.korean}
            </div>

            <button
              onClick={() => speakText(currentQuizTerm.hangul, 'ko')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Pronounce Korean</span>
            </button>
          </div>

          {!showQuizAnswer ? (
            <button
              onClick={() => setShowQuizAnswer(true)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              Reveal Meaning & Translations
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">English:</span>
                  <div className="text-sm font-bold text-white">{currentQuizTerm.en}</div>
                </div>
                <div className="border-t border-slate-900 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Urdu (اردو):</span>
                  <div className="text-sm font-bold text-emerald-400">{currentQuizTerm.ur}</div>
                </div>
                <div className="border-t border-slate-900 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Arabic (العربية):</span>
                  <div className="text-sm font-bold text-amber-400">{currentQuizTerm.ar}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleNextQuiz(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs cursor-pointer border border-slate-700"
                >
                  Need Review 🔄
                </button>
                <button
                  onClick={() => handleNextQuiz(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  I Knew It! ✓
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Terminology Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md transition-all hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {term.category}
                  </span>
                  <button
                    onClick={() => speakText(term.hangul, 'ko')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
                    title="Audio pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-black text-white">{term.korean}</h3>
                  <span className="text-sm font-mono text-amber-400 font-bold">{term.hangul}</span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="text-slate-500 font-semibold w-6">EN:</span>
                    <span>{term.en}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <span className="text-slate-500 font-semibold w-6">UR:</span>
                    <span className="font-nastaliq text-xs">{term.ur}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <span className="text-slate-500 font-semibold w-6">AR:</span>
                    <span className="font-arabic text-xs">{term.ar}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  onClick={() => onAskCoachAboutTerm(`Coach, how do I perform and master "${term.korean}" (${term.hangul})? Explain body alignment and execution.`)}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Practice with Coach</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
