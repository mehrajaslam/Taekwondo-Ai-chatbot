import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AICoachChat } from './components/AICoachChat';
import { DanExamHall } from './components/DanExamHall';
import { PoomsaeMaster } from './components/PoomsaeMaster';
import { KoreanTerminology } from './components/KoreanTerminology';
import { WorkoutPlanner } from './components/WorkoutPlanner';
import { AcademyShowcase } from './components/AcademyShowcase';
import { KukkiwonDisclaimerModal } from './components/KukkiwonDisclaimerModal';
import { Language, BeltLevel, StudentProfile } from './types';
import { translations } from './translations';
import { Shield, Sparkles, Award, MapPin } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [language, setLanguage] = useState<Language>('en');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('tkd_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Taekwondo Student',
      belt: 'White Belt (10th Geup)',
      language: 'en',
      academy: 'both',
      completedLessons: 3,
      streakDays: 4,
    };
  });

  useEffect(() => {
    localStorage.setItem('tkd_student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    // Set document direction for RTL languages (Urdu and Arabic)
    if (language === 'ur' || language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = language;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const t = translations[language];

  // Inter-component prompt dispatcher to coach chat
  const handleSwitchToCoachChat = (initialPrompt?: string) => {
    setCurrentTab('chat');
  };

  const handleEnrollInquiry = (inquiryMessage: string) => {
    setCurrentTab('chat');
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${
        language === 'ur' ? 'font-nastaliq' : language === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {/* Top Main Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        profile={profile}
        setProfile={setProfile}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'chat' && (
          <AICoachChat
            language={language}
            profile={profile}
            setProfile={setProfile}
            onOpenExamWithBelt={(belt) => {
              setProfile((prev) => ({ ...prev, belt: belt as BeltLevel }));
              setCurrentTab('exam');
            }}
          />
        )}

        {currentTab === 'exam' && (
          <DanExamHall
            language={language}
            selectedBelt={profile.belt}
            onSelectBelt={(b) => setProfile((prev) => ({ ...prev, belt: b }))}
            onSwitchToCoachChat={handleSwitchToCoachChat}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}

        {currentTab === 'poomsae' && (
          <PoomsaeMaster
            language={language}
            onPracticeInChat={handleSwitchToCoachChat}
          />
        )}

        {currentTab === 'terms' && (
          <KoreanTerminology
            language={language}
            onAskCoachAboutTerm={handleSwitchToCoachChat}
          />
        )}

        {currentTab === 'workout' && (
          <WorkoutPlanner
            language={language}
            currentBelt={profile.belt}
            onSelectBelt={(b) => setProfile((prev) => ({ ...prev, belt: b }))}
            onAskCoach={handleSwitchToCoachChat}
          />
        )}

        {currentTab === 'academy' && (
          <AcademyShowcase
            language={language}
            onEnrollInquiry={handleEnrollInquiry}
          />
        )}
      </main>

      {/* Global Martial Arts Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-black">
              TKD
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                PAKISTAN TAEKWONDO CLUB & WORLD STRIKERS ACADEMY
              </div>
              <div className="text-[11px] text-slate-500">
                Al Khobar, Eastern Province, Saudi Arabia • Kukkiwon-Aligned Syllabus
              </div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="text-slate-300 font-semibold">
              Head of Team: Mr. Ali Rizwan | Coaches: Mr. Muhammad Faizan, Mr. Nauman & Ms. Shumaila Nazeer
            </div>
            <div className="text-[11px] text-slate-500">
              Courtesy (Ye Ui) • Integrity (Yom Chi) • Perseverance (In Nae) • Self-Control (Guk Gi) • Indomitable Spirit (Baekjul Boolgool)
            </div>
          </div>
        </div>
      </footer>

      {/* Kukkiwon Disclaimer Modal */}
      <KukkiwonDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        language={language}
      />
    </div>
  );
}
