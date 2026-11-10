import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Flame,
  Shield,
  PlusCircle,
  FileCheck,
  ChevronRight,
  Filter,
  BarChart3,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';
import { Language, BeltLevel, StudentProfile, TrainingSessionRecord, QuizScoreRecord, BeltMilestone } from '../types';
import { BELT_LEVELS } from '../data/taekwondoData';

interface StudentProgressProps {
  language: Language;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenExamHall?: () => void;
  onOpenWorkout?: () => void;
}

// Initial realistic default training history
const INITIAL_TRAINING_SESSIONS: TrainingSessionRecord[] = [
  { week: 'W1 (Jan)', date: '2026-01-05', totalHours: 6.5, poomsaeHours: 2.5, sparringHours: 2.0, theoryHours: 1.0, conditioningHours: 1.0 },
  { week: 'W2 (Jan)', date: '2026-01-12', totalHours: 7.0, poomsaeHours: 3.0, sparringHours: 2.0, theoryHours: 1.0, conditioningHours: 1.0 },
  { week: 'W3 (Jan)', date: '2026-01-19', totalHours: 8.5, poomsaeHours: 3.5, sparringHours: 2.5, theoryHours: 1.5, conditioningHours: 1.0 },
  { week: 'W4 (Jan)', date: '2026-01-26', totalHours: 8.0, poomsaeHours: 3.0, sparringHours: 2.5, theoryHours: 1.0, conditioningHours: 1.5 },
  { week: 'W5 (Feb)', date: '2026-02-02', totalHours: 9.5, poomsaeHours: 4.0, sparringHours: 3.0, theoryHours: 1.5, conditioningHours: 1.0 },
  { week: 'W6 (Feb)', date: '2026-02-09', totalHours: 10.0, poomsaeHours: 4.5, sparringHours: 3.0, theoryHours: 1.0, conditioningHours: 1.5 },
  { week: 'W7 (Feb)', date: '2026-02-16', totalHours: 9.0, poomsaeHours: 3.5, sparringHours: 3.0, theoryHours: 1.0, conditioningHours: 1.5 },
  { week: 'W8 (Feb)', date: '2026-02-23', totalHours: 11.0, poomsaeHours: 5.0, sparringHours: 3.5, theoryHours: 1.0, conditioningHours: 1.5 },
];

const INITIAL_QUIZ_RECORDS: QuizScoreRecord[] = [
  { id: 'q1', date: 'Jan 08', title: 'Basic Stances & Chariot', category: 'Korean Terms', score: 85, passingScore: 75, belt: 'White Belt (10th Geup)' },
  { id: 'q2', date: 'Jan 15', title: 'Taegeuk Il Jang Basics', category: 'Poomsae Theory', score: 78, passingScore: 75, belt: 'White Belt (10th Geup)' },
  { id: 'q3', date: 'Jan 22', title: 'WT Scoring & Kyong-go', category: 'WT Sparring Rules', score: 92, passingScore: 75, belt: 'Yellow Stripe (9th Geup)' },
  { id: 'q4', date: 'Jan 29', title: 'Blocks & Kicking Terms', category: 'Korean Terms', score: 88, passingScore: 75, belt: 'Yellow Stripe (9th Geup)' },
  { id: 'q5', date: 'Feb 05', title: 'Taegeuk Ee Jang Trigram', category: 'Poomsae Theory', score: 95, passingScore: 75, belt: 'Yellow Belt (8th Geup)' },
  { id: 'q6', date: 'Feb 12', title: 'Kukkiwon Oral Promotion Mock', category: 'Dan Board Oral', score: 82, passingScore: 75, belt: 'Yellow Belt (8th Geup)' },
  { id: 'q7', date: 'Feb 19', title: 'Advanced Sparring Tactics', category: 'WT Sparring Rules', score: 90, passingScore: 75, belt: 'Yellow Belt (8th Geup)' },
  { id: 'q8', date: 'Feb 26', title: 'Five Tenets of Taekwondo', category: 'Dan Board Oral', score: 98, passingScore: 75, belt: 'Yellow Belt (8th Geup)' },
];

const INITIAL_BELT_MILESTONES: BeltMilestone[] = [
  {
    belt: 'White Belt (10th Geup)',
    date: '2025-11-15',
    status: 'achieved',
    requiredHours: 20,
    completedHours: 24,
    examiner: 'Coach Muhammad Faizan',
    dojang: 'Pakistan Taekwondo Club',
    certificateNumber: 'PTC-2025-089',
  },
  {
    belt: 'Yellow Stripe (9th Geup)',
    date: '2025-12-28',
    status: 'achieved',
    requiredHours: 25,
    completedHours: 28,
    examiner: 'Coach Shumaila Nazeer',
    dojang: 'World Strikers Academy, Al Khobar',
    certificateNumber: 'WSA-KSA-1104',
  },
  {
    belt: 'Yellow Belt (8th Geup)',
    date: '2026-02-14',
    status: 'current',
    requiredHours: 35,
    completedHours: 31,
    examiner: 'Coach Shumaila Nazeer & Head of Team Ali Rizwan',
    dojang: 'World Strikers Academy, Al Khobar',
    certificateNumber: 'WSA-KSA-1215',
  },
  {
    belt: 'Green Stripe (7th Geup)',
    date: 'Target: April 2026',
    status: 'upcoming',
    requiredHours: 40,
    completedHours: 0,
    examiner: 'Pakistan & World Strikers Joint Board',
    dojang: 'Al Khobar Central Dojang',
  },
  {
    belt: '1st Dan (Il Dan)',
    date: 'Kukkiwon Target: 2027',
    status: 'upcoming',
    requiredHours: 250,
    completedHours: 83,
    examiner: 'Kukkiwon Certified 4th+ Dan Board',
    dojang: 'Official Kukkiwon Examination',
  },
];

const SKILL_RADAR_DATA = [
  { skill: 'Poomsae Accuracy', student: 85, benchmark: 75 },
  { skill: 'Sparring Agility', student: 78, benchmark: 70 },
  { skill: 'Korean Terms', student: 92, benchmark: 80 },
  { skill: 'Stances & Biomechanics', student: 84, benchmark: 75 },
  { skill: 'Conditioning & Power', student: 88, benchmark: 80 },
  { skill: 'Tenets & Discipline', student: 96, benchmark: 85 },
];

export const StudentProgress: React.FC<StudentProgressProps> = ({
  language,
  profile,
  setProfile,
  onOpenExamHall,
  onOpenWorkout,
}) => {
  // Persistence state
  const [trainingSessions, setTrainingSessions] = useState<TrainingSessionRecord[]>(() => {
    const saved = localStorage.getItem('tkd_training_sessions');
    return saved ? JSON.parse(saved) : INITIAL_TRAINING_SESSIONS;
  });

  const [quizScores, setQuizScores] = useState<QuizScoreRecord[]>(() => {
    const saved = localStorage.getItem('tkd_quiz_scores');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_RECORDS;
  });

  const [milestones] = useState<BeltMilestone[]>(INITIAL_BELT_MILESTONES);

  // View toggles
  const [chartView, setChartView] = useState<'area' | 'bar'>('area');
  const [scoreCategoryFilter, setScoreCategoryFilter] = useState<string>('All');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  // New session log form
  const [logForm, setLogForm] = useState({
    poomsaeHours: 1.5,
    sparringHours: 1.0,
    theoryHours: 0.5,
    conditioningHours: 0.5,
  });

  useEffect(() => {
    localStorage.setItem('tkd_training_sessions', JSON.stringify(trainingSessions));
  }, [trainingSessions]);

  useEffect(() => {
    localStorage.setItem('tkd_quiz_scores', JSON.stringify(quizScores));
  }, [quizScores]);

  // Aggregate stats
  const totalHoursTrained = trainingSessions.reduce((acc, curr) => acc + curr.totalHours, 0);
  const averageQuizScore = Math.round(
    quizScores.reduce((acc, curr) => acc + curr.score, 0) / (quizScores.length || 1)
  );
  const totalPassedQuizzes = quizScores.filter((q) => q.score >= q.passingScore).length;

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const total =
      Number(logForm.poomsaeHours) +
      Number(logForm.sparringHours) +
      Number(logForm.theoryHours) +
      Number(logForm.conditioningHours);

    const nextIndex = trainingSessions.length + 1;
    const newSession: TrainingSessionRecord = {
      week: `Session #${nextIndex}`,
      date: new Date().toISOString().split('T')[0],
      totalHours: Number(total.toFixed(1)),
      poomsaeHours: Number(logForm.poomsaeHours),
      sparringHours: Number(logForm.sparringHours),
      theoryHours: Number(logForm.theoryHours),
      conditioningHours: Number(logForm.conditioningHours),
    };

    setTrainingSessions((prev) => [...prev, newSession]);
    setProfile((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons + 1,
      streakDays: prev.streakDays + 1,
    }));
    setShowLogModal(false);
  };

  const filteredScores =
    scoreCategoryFilter === 'All'
      ? quizScores
      : quizScores.filter((q) => q.category === scoreCategoryFilter);

  // Localization dictionaries
  const labels = {
    en: {
      title: 'Student Training Progress & Analytics',
      subtitle:
        'Official training logs, belt milestones, and Kukkiwon Dan roadmap for Pakistan Taekwondo Club & World Strikers Academy.',
      totalHours: 'Total Training Hours',
      avgScore: 'Avg Exam & Quiz Score',
      passRate: 'Pass Rate',
      streak: 'Training Streak',
      currentRank: 'Current Belt Rank',
      hoursOverTime: 'Training Hours Over Time',
      hoursSub: 'Weekly breakdown across Poomsae, Sparring, Theory, and Physical Conditioning.',
      viewArea: 'Trend Area',
      viewBar: 'Weekly Bars',
      logPractice: 'Log Training Session',
      milestonesTitle: 'Belt Milestones & Dan Promotion Roadmap',
      milestonesSub: 'Official time-in-grade and test board approvals aligned with Kukkiwon standards.',
      examScoresTitle: 'Oral Examination & Quiz Performance',
      examScoresSub: 'Historical scores across Korean terminology, Poomsae theory, and WT sparring rules.',
      passingThreshold: 'Kukkiwon Pass Mark (75%)',
      radarTitle: 'Martial Arts Skills Mastery Radar',
      radarSub: 'Six-pillar evaluation comparing current skill levels against target benchmark.',
      logModalTitle: 'Log Martial Arts Practice',
      poomsaeHrs: 'Poomsae Hours (Forms)',
      sparringHrs: 'Sparring Hours (Kyorugi)',
      theoryHrs: 'Theory & Korean Terms Hours',
      condHrs: 'Conditioning & Stamina Hours',
      saveLog: 'Save to Training Journal',
      cancel: 'Cancel',
      allCategories: 'All Categories',
      certificate: 'Certificate',
      examiner: 'Examiner',
      dojang: 'Dojang',
      completed: 'Achieved',
      inProgress: 'In Progress',
      upcoming: 'Upcoming Target',
    },
    ur: {
      title: 'طالب علم کی ٹریننگ پیش رفت اور کارکردگی',
      subtitle:
        'پاکستان تائیکوانڈو کلب اور ورلڈ سٹرائیکرز اکیڈمی کے آفیشل ٹریننگ لاگز، بیلٹ سنگ میل اور کوکیوون ڈان روڈ میپ۔',
      totalHours: 'کل ٹریننگ کے اوقات',
      avgScore: 'اوسط کوئز اور امتحانی اسکور',
      passRate: 'کامیابی کی شرح',
      streak: 'تسلسل کا ریکارڈ',
      currentRank: 'موجودہ بیلٹ کا درجہ',
      hoursOverTime: 'ٹریننگ کے اوقات کی پیش رفت',
      hoursSub: 'پومسے، کیوروگی (فائٹ)، تھیوری اور جسمانی فٹنس کے ہفتہ وار اوقات۔',
      viewArea: 'ٹرینڈ گراف',
      viewBar: 'ہفتہ وار بارز',
      logPractice: 'نئی پریکٹس درج کریں',
      milestonesTitle: 'بیلٹ کے سنگ میل اور ڈان پروموشن کا سفر',
      milestonesSub: 'کوکیوون کے معیارات کے مطابق ٹریننگ مدت اور امتحانی بورڈ کے سرٹیفکیٹس۔',
      examScoresTitle: 'زبانی امتحان اور کوئز کے نتائج',
      examScoresSub: 'کوریائی اصطلاحات، پومسے تھیوری اور ڈبلیو ٹی قوانین پر حاصل کردہ درجات۔',
      passingThreshold: 'کوکیوون پاسنگ معیار (75%)',
      radarTitle: 'مارشل آرٹس مہارتوں کا ریڈار',
      radarSub: 'چھ اہم شعبوں میں موجودہ کارکردگی بمقابلہ ٹارگٹ معیار۔',
      logModalTitle: 'پریکٹس سیشن درج کریں',
      poomsaeHrs: 'پومسے کے گھنٹے',
      sparringHrs: 'کیوروگی کے گھنٹے',
      theoryHrs: 'تھیوری اور کوریائی اصطلاحات',
      condHrs: 'کنڈیشنگ اور اسٹیمینا',
      saveLog: 'لاگ میں محفوظ کریں',
      cancel: 'منسوخ کریں',
      allCategories: 'تمام اقسام',
      certificate: 'سرٹیفکیٹ نمبر',
      examiner: 'ممتحن کوچ',
      dojang: 'ڈوجانگ',
      completed: 'مکمل شدہ',
      inProgress: 'جاری ہے',
      upcoming: 'آئندہ ہدف',
    },
    ar: {
      title: 'سجل تقدم المتدرب والإحصائيات الفنية',
      subtitle:
        'سجلات التدريب المعتمدة، ومحطات الأحزمة، وخارطة طريق ترقيات كوكيوون لنادي باكستان وأكاديمية سترايكرز العالمية.',
      totalHours: 'إجمالي ساعات التدريب',
      avgScore: 'معدل درجات الاختبارات',
      passRate: 'نسبة النجاح',
      streak: 'أيام التدريب المتتالية',
      currentRank: 'مستوى الحزام الحالي',
      hoursOverTime: 'ساعات التدريب بمرور الوقت',
      hoursSub: 'توزيع أسبوعي بين البومسي، والقتال (كيوروجي)، والنظري، واللياقة البدنية.',
      viewArea: 'الرسم البياني للمسار',
      viewBar: 'أعمدة أسبوعية',
      logPractice: 'تسجيل حصة تدريبية',
      milestonesTitle: 'محطات ترقية الأحزمة وخارطة الدان',
      milestonesSub: 'فترات الترقية المعتمدة وشهادات لجان الاختبار وفق معايير كوكيوون.',
      examScoresTitle: 'نتائج الاختبارات الشفهية والنظرية',
      examScoresSub: 'تتبع الدرجات في المصطلحات الكورية، وفلسفة البومسي، وقوانين الاتحاد الدولي.',
      passingThreshold: 'علامة النجاح المعتمدة (75%)',
      radarTitle: 'مخطط كفاءة المهارات القتالية',
      radarSub: 'تقييم شامل عبر 6 محاور رئيسية مقارنة بالمعيار المستهدف.',
      logModalTitle: 'تسجيل تمرين جديد',
      poomsaeHrs: 'ساعات البومسي',
      sparringHrs: 'ساعات الكيوروجي',
      theoryHrs: 'ساعات النظري والمصطلحات',
      condHrs: 'ساعات اللياقة البدنية',
      saveLog: 'حفظ في السجل',
      cancel: 'إلغاء',
      allCategories: 'جميع الفئات',
      certificate: 'رقم الشهادة',
      examiner: 'الفاحص المعتمد',
      dojang: 'الدوجانغ',
      completed: 'تم الاجتياز',
      inProgress: 'قيد الإنجاز',
      upcoming: 'الهدف القادم',
    },
  }[language];

  const currentBeltObj = BELT_LEVELS.find((b) => b.level === profile.belt) || BELT_LEVELS[2];

  // Custom Chart Tooltip styling
  const CustomHoursTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-200 min-w-[170px]">
          <p className="font-bold text-white border-b border-slate-800 pb-1.5 mb-1.5 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-amber-400 font-mono">
              {payload.reduce((sum: number, entry: any) => sum + (Number(entry.value) || 0), 0).toFixed(1)} hrs
            </span>
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-300 capitalize">{entry.name}</span>
                </span>
                <span className="font-semibold text-slate-100 font-mono">{entry.value}h</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomScoreTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as QuizScoreRecord;
      const isPassed = data.score >= data.passingScore;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-200 min-w-[190px]">
          <p className="font-bold text-white mb-0.5">{data.title}</p>
          <p className="text-[11px] text-slate-400 mb-1.5">{data.date} • {data.category}</p>
          <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
            <span className="text-slate-300">Score:</span>
            <span className={`font-black font-mono text-sm ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
              {data.score}%
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Pass Threshold:</span>
            <span className="text-amber-400 font-mono">{data.passingScore}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                Dojang Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kukkiwon Standard Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {labels.title}
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              {labels.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs sm:text-sm hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-900/40 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{labels.logPractice}</span>
            </button>
            {onOpenExamHall && (
              <button
                onClick={onOpenExamHall}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Dan Exam Prep</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlight Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          {/* Stat 1: Total Hours */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                {labels.totalHours}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalHoursTrained.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>
          </div>

          {/* Stat 2: Current Belt */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner"
              style={{ backgroundColor: currentBeltObj.color }}
            >
              <Shield className={`w-6 h-6 ${currentBeltObj.level.includes('White') ? 'text-slate-800' : 'text-white'}`} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide truncate">
                {labels.currentRank}
              </div>
              <div className="text-sm sm:text-base font-black text-white truncate">
                {profile.belt}
              </div>
            </div>
          </div>

          {/* Stat 3: Avg Exam Score */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                {labels.avgScore}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                <span>{averageQuizScore}%</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  {totalPassedQuizzes}/{quizScores.length} passed
                </span>
              </div>
            </div>
          </div>

          {/* Stat 4: Active Streak */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                {labels.streak}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {profile.streakDays} <span className="text-xs font-normal text-slate-400">days active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section: Training Hours & Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Training Hours Over Time */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white">{labels.hoursOverTime}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">{labels.hoursSub}</p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
                <button
                  onClick={() => setChartView('area')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    chartView === 'area'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{labels.viewArea}</span>
                </button>
                <button
                  onClick={() => setChartView('bar')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    chartView === 'bar'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{labels.viewBar}</span>
                </button>
              </div>
            </div>

            {/* Recharts Area / Bar Chart Container */}
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'area' ? (
                  <AreaChart data={trainingSessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPoomsae" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorSparring" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorTheory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorConditioning" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="h" />
                    <Tooltip content={<CustomHoursTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-300 font-medium capitalize">{val}</span>}
                    />
                    <Area type="monotone" dataKey="poomsaeHours" name="Poomsae" stroke="#EF4444" fillOpacity={1} fill="url(#colorPoomsae)" />
                    <Area type="monotone" dataKey="sparringHours" name="Sparring (Kyorugi)" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSparring)" />
                    <Area type="monotone" dataKey="theoryHours" name="Theory & Terms" stroke="#10B981" fillOpacity={1} fill="url(#colorTheory)" />
                    <Area type="monotone" dataKey="conditioningHours" name="Conditioning" stroke="#A855F7" fillOpacity={1} fill="url(#colorConditioning)" />
                  </AreaChart>
                ) : (
                  <BarChart data={trainingSessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="h" />
                    <Tooltip content={<CustomHoursTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-300 font-medium capitalize">{val}</span>}
                    />
                    <Bar dataKey="poomsaeHours" name="Poomsae" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="sparringHours" name="Sparring (Kyorugi)" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="theoryHours" name="Theory & Terms" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="conditioningHours" name="Conditioning" stackId="a" fill="#A855F7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>Dojang recommendation: Minimum 4.5 hours / week for continuous Dan progression.</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> On Target this month (+18%)
            </span>
          </div>
        </div>

        {/* Right Column (1 col): Martial Arts Skills Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">{labels.radarTitle}</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">{labels.radarSub}</p>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SKILL_RADAR_DATA}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="skill" stroke="#94A3B8" fontSize={10} tick={{ fill: '#CBD5E1' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar name="Student Proficiency" dataKey="student" stroke="#EF4444" fill="#EF4444" fillOpacity={0.45} />
                  <Radar name="Belt Benchmark" dataKey="benchmark" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 text-center">
            Highest Attribute: <strong className="text-amber-400">Tenets & Discipline (96%)</strong>
          </div>
        </div>
      </div>

      {/* Belt Milestones & Kukkiwon Dan Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black text-white">{labels.milestonesTitle}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{labels.milestonesSub}</p>
          </div>

          {/* Dojang Photo Link Reference */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 max-w-sm">
            <img
              src="/assets/aistudio/world_strikers_11jpg_6dfbd321.jpg"
              alt="World Strikers Yellow Belt Certificate"
              className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0"
            />
            <div className="text-xs">
              <div className="font-bold text-white line-clamp-1">World Strikers Belt Testing</div>
              <div className="text-[11px] text-amber-400 line-clamp-1">Coach Shumaila Nazeer presenting</div>
            </div>
          </div>
        </div>

        {/* Milestone Steps / Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {milestones.map((item, index) => {
            const beltInfo = BELT_LEVELS.find((b) => b.level === item.belt) || BELT_LEVELS[0];
            const isAchieved = item.status === 'achieved';
            const isCurrent = item.status === 'current';
            const isUpcoming = item.status === 'upcoming';

            return (
              <div
                key={item.belt}
                className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500/80 shadow-lg shadow-amber-950/20 ring-4 ring-amber-500/10'
                    : isAchieved
                    ? 'bg-slate-950/70 border border-emerald-500/30'
                    : 'bg-slate-950/40 border border-slate-800/80 opacity-75'
                }`}
              >
                {/* Badge status pill */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm"
                    style={{ backgroundColor: beltInfo.color }}
                  />
                  {isAchieved && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {labels.completed}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                      {labels.inProgress}
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {labels.upcoming}
                    </span>
                  )}
                </div>

                {/* Belt Title */}
                <div>
                  <h3 className="text-sm font-black text-white leading-tight mb-1">{item.belt}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-3">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{item.date}</span>
                  </div>

                  {/* Progress bar for hours */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.completedHours}h completed</span>
                      <span>{item.requiredHours}h req</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isAchieved ? 'bg-emerald-500' : isCurrent ? 'bg-amber-400' : 'bg-slate-700'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round((item.completedHours / item.requiredHours) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <div className="truncate">
                    <span className="text-slate-500">{labels.examiner}:</span>{' '}
                    <span className="text-slate-300 font-medium">{item.examiner}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">{labels.dojang}:</span>{' '}
                    <span className="text-slate-300">{item.dojang}</span>
                  </div>
                  {item.certificateNumber && (
                    <div className="truncate font-mono text-emerald-400/90 flex items-center gap-1 pt-0.5">
                      <FileCheck className="w-3 h-3" />
                      <span>{item.certificateNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Scores & Oral Examination Performance Over Time */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-black text-white">{labels.examScoresTitle}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{labels.examScoresSub}</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-2xl p-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {['All', 'Korean Terms', 'Poomsae Theory', 'WT Sparring Rules', 'Dan Board Oral'].map((cat) => (
              <button
                key={cat}
                onClick={() => setScoreCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                  scoreCategoryFilter === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? labels.allCategories : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Score Trend LineChart Container */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredScores} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip content={<CustomScoreTooltip />} />
              <ReferenceLine
                y={75}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{
                  value: labels.passingThreshold,
                  fill: '#F59E0B',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Exam Score"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10B981', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#34D399', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score records card strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          {filteredScores.slice(-4).map((record) => (
            <div key={record.id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>{record.date}</span>
                <span className={`font-mono font-bold ${record.score >= record.passingScore ? 'text-emerald-400' : 'text-red-400'}`}>
                  {record.score}%
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate" title={record.title}>
                {record.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{record.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Log New Practice Session */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-white">{labels.logModalTitle}</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {labels.poomsaeHrs}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={logForm.poomsaeHours}
                  onChange={(e) => setLogForm({ ...logForm, poomsaeHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {labels.sparringHrs}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={logForm.sparringHours}
                  onChange={(e) => setLogForm({ ...logForm, sparringHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {labels.theoryHrs}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={logForm.theoryHours}
                  onChange={(e) => setLogForm({ ...logForm, theoryHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {labels.condHrs}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={logForm.conditioningHours}
                  onChange={(e) => setLogForm({ ...logForm, conditioningHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  {labels.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 cursor-pointer"
                >
                  {labels.saveLog}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
