export type Language = 'en' | 'ur' | 'ar';

export type BeltLevel =
  | 'White Belt (10th Geup)'
  | 'Yellow Stripe (9th Geup)'
  | 'Yellow Belt (8th Geup)'
  | 'Green Stripe (7th Geup)'
  | 'Green Belt (6th Geup)'
  | 'Blue Stripe (5th Geup)'
  | 'Blue Belt (4th Geup)'
  | 'Red Stripe (3rd Geup)'
  | 'Red Belt (2nd Geup)'
  | 'Black Stripe / Bo-Dan (1st Geup)'
  | '1st Dan (Il Dan)'
  | '2nd Dan (Ee Dan)'
  | '3rd Dan (Sam Dan)'
  | '4th Dan (Sa Dan - Master)'
  | '5th Dan (Oh Dan - Master)'
  | '6th Dan (Yuk Dan)'
  | '7th Dan (Chil Dan - Grandmaster)'
  | '8th Dan (Pal Dan - Grandmaster)'
  | '9th Dan (Gu Dan - Grandmaster)';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  audioPromptText?: string;
  suggestedReplies?: string[];
  koreanTermHighlight?: string;
}

export interface StudentProfile {
  name: string;
  belt: BeltLevel;
  language: Language;
  academy: 'both' | 'pakistan' | 'world_strikers';
  completedLessons: number;
  streakDays: number;
}

export interface PoomsaeDetail {
  id: string;
  name: string;
  hangul: string;
  belt: string;
  danLevel?: string;
  trigram: string;
  meaning: string;
  movements: number;
  keyTechniques: string[];
  philosophicalSignificance: string;
}

export interface KoreanTerm {
  korean: string;
  hangul: string;
  category: 'Commands' | 'Stances (Seogi)' | 'Blocks (Makgi)' | 'Kicks (Chagi)' | 'Strikes' | 'Sparring' | 'Numbers & Philosophy';
  en: string;
  ur: string;
  ar: string;
}

export interface OralExamQuestion {
  id: string;
  beltLevel: BeltLevel;
  question: {
    en: string;
    ur: string;
    ar: string;
  };
  keyTopicsExpected: string[];
  kukkiwonReference: string;
}

export interface OralExamResult {
  score: number;
  grade: 'Distinction' | 'Pass' | 'Needs Practice';
  feedback: string;
  strengths: string[];
  corrections: string[];
  correctTerminology: string[];
  nextQuestion?: string;
}

export interface DailyWorkout {
  title: string;
  targetBelt: string;
  durationMinutes: number;
  warmup: string[];
  technicalDrills: { name: string; reps: string; coachingTips: string }[];
  poomsaeFocus: string;
  conditioning: string[];
  coolDown: string[];
  coachesNote: string;
}

export interface TrainingSessionRecord {
  week: string;
  date: string;
  totalHours: number;
  poomsaeHours: number;
  sparringHours: number;
  theoryHours: number;
  conditioningHours: number;
}

export interface QuizScoreRecord {
  id: string;
  date: string;
  title: string;
  category: 'Korean Terms' | 'Poomsae Theory' | 'WT Sparring Rules' | 'Dan Board Oral';
  score: number;
  passingScore: number;
  belt: BeltLevel;
}

export interface BeltMilestone {
  belt: BeltLevel;
  date: string;
  status: 'achieved' | 'current' | 'upcoming';
  requiredHours: number;
  completedHours: number;
  examiner: string;
  dojang: string;
  certificateNumber?: string;
}

