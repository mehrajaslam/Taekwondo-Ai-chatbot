import React from 'react';
import { Shield, Globe, Award, Info, Sparkles, TrendingUp } from 'lucide-react';
import { Language, BeltLevel, StudentProfile } from '../types';
import { translations } from '../translations';
import { BELT_LEVELS } from '../data/taekwondoData';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenDisclaimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  profile,
  setProfile,
  onOpenDisclaimer,
}) => {
  const t = translations[language];

  const currentBeltInfo = BELT_LEVELS.find((b) => b.level === profile.belt) || BELT_LEVELS[0];

  const navItems = [
    { id: 'chat', label: t.nav.coachChat },
    { id: 'progress', label: t.nav.progress },
    { id: 'exam', label: t.nav.danExam },
    { id: 'poomsae', label: t.nav.poomsae },
    { id: 'terms', label: t.nav.terminology },
    { id: 'workout', label: t.nav.workout },
    { id: 'academy', label: t.nav.academies },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Bar with Club Affiliation & Disclaimers */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-red-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              🇵🇰 Pakistan Taekwondo Club
            </span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              🇸🇦 World Strikers Academy, Al Khobar
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-400 font-medium">
              {t.headOfTeam} | {t.coaches}
            </span>
            <button
              onClick={onOpenDisclaimer}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
              title="Official Kukkiwon Guidelines"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Kukkiwon Rules</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 via-slate-900 to-blue-600 p-0.5 shadow-lg shadow-red-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-red-600 text-white px-1 py-0.2 rounded border border-slate-900">
              TKD
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                PAK & WORLD STRIKERS
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                  AI Coach
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
              {t.subTitle}
            </p>
          </div>
        </div>

        {/* User Belt Profile & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Belt selector pill */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <div
              className="w-3 h-3 rounded-full border border-slate-950 shadow-sm"
              style={{ backgroundColor: currentBeltInfo.color }}
            />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 leading-none">Rank</div>
              <select
                value={profile.belt}
                onChange={(e) => setProfile((prev) => ({ ...prev, belt: e.target.value as BeltLevel }))}
                className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-1"
              >
                {BELT_LEVELS.map((b) => (
                  <option key={b.level} value={b.level} className="bg-slate-900 text-white">
                    {b.level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === 'en' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === 'ur' ? 'bg-emerald-600 text-white shadow-sm font-nastaliq' : 'text-slate-400 hover:text-white'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === 'ar' ? 'bg-amber-600 text-white shadow-sm font-arabic' : 'text-slate-400 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-slate-800/60">
        <nav className="flex space-x-1 sm:space-x-2 py-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.id === 'exam' && <Award className="w-3.5 h-3.5 text-amber-400" />}
                {item.id === 'chat' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                {item.id === 'progress' && <TrendingUp className="w-3.5 h-3.5 text-red-400" />}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
