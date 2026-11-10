import { Language } from './types';

export interface Translations {
  appName: string;
  subTitle: string;
  headOfTeam: string;
  coaches: string;
  disclaimerNote: string;
  nav: {
    coachChat: string;
    danExam: string;
    poomsae: string;
    terminology: string;
    workout: string;
    progress: string;
    academies: string;
  };
  welcome: {
    greeting: string;
    tagline: string;
    startTraining: string;
    danPrep: string;
    oralExamBtn: string;
  };
  chat: {
    placeholder: string;
    send: string;
    listening: string;
    speak: string;
    voiceActive: string;
    newSession: string;
    studentName: string;
    currentBelt: string;
    selectLanguage: string;
    readyPrompt: string;
    clearChat: string;
  };
  danExam: {
    title: string;
    subtitle: string;
    selectRank: string;
    oralQuestions: string;
    submitAnswer: string;
    aiEvaluating: string;
    score: string;
    grade: string;
    technicalStrengths: string;
    correctionsNeeded: string;
    koreanTerminology: string;
    nextQuestion: string;
    tryAgain: string;
    speakAnswer: string;
  };
  workout: {
    title: string;
    generateBtn: string;
    generating: string;
    focusArea: string;
    duration: string;
    warmup: string;
    technicalDrills: string;
    conditioning: string;
    coolDown: string;
    coachNote: string;
  };
  academy: {
    pakistanClub: string;
    worldStrikers: string;
    alKhobarLocation: string;
    ourTeam: string;
    headCoachRole: string;
    certPresentation: string;
    joinAcademy: string;
    contactInquiry: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'PAK & WORLD STRIKERS AI TAEKWONDO COACH',
    subTitle: 'Pakistan Taekwondo Club & World Strikers Taekwondo Academy • Al Khobar, Saudi Arabia',
    headOfTeam: 'Head of Team: Mr. Ali Rizwan',
    coaches: 'Coaches: Mr. Muhammad Faizan, Mr. Nauman & Ms. Shumaila Nazeer',
    disclaimerNote: 'Official Kukkiwon Dan & Geup certification is awarded solely by authorized examiners in official testing. This AI Assistant is designed for preparation and training.',
    nav: {
      coachChat: 'AI Coach Chat',
      danExam: 'Kukkiwon Dan & Belt Exam',
      poomsae: 'Poomsae Vault',
      terminology: 'Korean Terminology',
      workout: 'Daily Training',
      progress: 'Training Progress & Stats',
      academies: 'Our Clubs & Coaches',
    },
    welcome: {
      greeting: 'Charyot! Gyeongnye! Welcome to Taekwondo Training',
      tagline: 'Your official martial arts mentor from White Belt (10th Geup) to 9th Dan Grandmaster.',
      startTraining: 'Start Interactive Lesson',
      danPrep: 'Dan Promotion Exam Hall',
      oralExamBtn: 'Take Oral Examination',
    },
    chat: {
      placeholder: 'Ask Coach technique questions, answer quiz questions, or discuss Poomsae...',
      send: 'Send',
      listening: 'Listening to your voice...',
      speak: 'Speak',
      voiceActive: 'Mic Active',
      newSession: 'New Training Session',
      studentName: 'Student Name',
      currentBelt: 'Current Belt Level',
      selectLanguage: 'Language',
      readyPrompt: 'Ready to train!',
      clearChat: 'Reset Chat',
    },
    danExam: {
      title: 'Kukkiwon Promotion & Oral Examination Simulator',
      subtitle: 'Prepare for 10th Geup to 9th Dan Dan promotion boards with rigorous oral questions, terminology checks, and martial philosophy.',
      selectRank: 'Select Target Belt / Dan Level',
      oralQuestions: 'Examiner Oral Theory Question',
      submitAnswer: 'Submit Oral Answer',
      aiEvaluating: 'Examining Answer against Kukkiwon Standards...',
      score: 'Score',
      grade: 'Result',
      technicalStrengths: 'Key Strengths Observed',
      correctionsNeeded: 'Instructor Corrections & Biomechanics',
      koreanTerminology: 'Kukkiwon Terminology Applied',
      nextQuestion: 'Proceed to Next Question',
      tryAgain: 'Practice & Retake Question',
      speakAnswer: 'Speak Answer (Mic)',
    },
    workout: {
      title: 'Dojang Daily Training & Conditioning Generator',
      generateBtn: 'Generate Today\'s Training Plan',
      generating: 'Building Structured Dojang Session...',
      focusArea: 'Training Focus Area',
      duration: 'Session Duration',
      warmup: 'Warm-up & Joint Mobility',
      technicalDrills: 'Technical Kicking & Blocking Drills',
      conditioning: 'Martial Conditioning & Stamina',
      coolDown: 'Cool-Down & Myung-sang (Meditation)',
      coachNote: 'Coach Motivational Note',
    },
    academy: {
      pakistanClub: 'Pakistan Taekwondo Club',
      worldStrikers: 'World Strikers Taekwondo Academy (Al Khobar, KSA)',
      alKhobarLocation: 'Al Khobar, Eastern Province, Kingdom of Saudi Arabia',
      ourTeam: 'Our Coaching Leadership',
      headCoachRole: 'Head of Team & Chief Instructor',
      certPresentation: 'Coach Ms. Shumaila Nazeer awarding Junior Yellow Belt Certificate at World Strikers Taekwondo Academy',
      joinAcademy: 'Enroll at Academy',
      contactInquiry: 'Register or Ask a Question',
    },
  },
  ur: {
    appName: 'پاک اور ورلڈ سٹرائیکرز – اے آئی تائیکوانڈو کوچ',
    subTitle: 'پاکستان تائیکوانڈو کلب اور ورلڈ سٹرائیکرز تائیکوانڈو اکیڈمی • الخبر، سعودی عرب',
    headOfTeam: 'ہیڈ آف ٹیم: جناب علی رضوان',
    coaches: 'کوچز: جناب محمد فیضان، جناب نعمان اور محترمہ شمائلہ نذیر',
    disclaimerNote: 'کوکی وان ڈان اور گیپ سرٹیفکیٹ صرف مجاز امتحانی بورڈ کے ذریعے دیے جاتے ہیں۔ یہ اے آئی کوچ صرف تیاری اور مشق کے لیے ہے۔',
    nav: {
      coachChat: 'اے آئی کوچ چیٹ',
      danExam: 'کوکی وان ڈان امتحان',
      poomsae: 'پومسے انسائیکلوپیڈیا',
      terminology: 'کورین اصطلاحات',
      workout: 'روزانہ کی مشق',
      progress: 'میری پیش رفت اور اعداد و شمار',
      academies: 'کلب اور کوچز',
    },
    welcome: {
      greeting: 'چاریوت! گیونگ نیے! تائیکوانڈو ٹریننگ میں خوش آمدید',
      tagline: 'وائٹ بیلٹ (10ویں گیپ) سے 9ویں ڈان گرینڈ ماسٹر تک آپ کا آفیشل مارشل آرٹس رہبر۔',
      startTraining: 'سبق شروع کریں',
      danPrep: 'ڈان پروموشن ہال',
      oralExamBtn: 'زبانی امتحان شروع کریں',
    },
    chat: {
      placeholder: 'کوچ سے تکنیک کے بارے میں پوچھیں، سوالات کے جوابات دیں...',
      send: 'بھیجیں',
      listening: 'آپ کی آواز سن رہا ہے...',
      speak: 'بولیں',
      voiceActive: 'مائیک آن ہے',
      newSession: 'نیا سیشن شروع کریں',
      studentName: 'طالب علم کا نام',
      currentBelt: 'موجودہ بیلٹ لیول',
      selectLanguage: 'زبان',
      readyPrompt: 'مشق کے لیے تیار!',
      clearChat: 'چیٹ دوبارہ شروع کریں',
    },
    danExam: {
      title: 'کوکی وان ڈان اور پروموشن زبانی امتحان سیمولیٹر',
      subtitle: '10ویں گیپ سے 9ویں ڈان تک امتحانی بورڈ کے سوالات، کورین اصطلاحات اور مارشل فلسفے کی جامع تیاری۔',
      selectRank: 'مطلوبہ بیلٹ یا ڈان لیول منتخب کریں',
      oralQuestions: 'ممتحن کا زبانی تھیوری سوال',
      submitAnswer: 'جواب جمع کروائیں',
      aiEvaluating: 'کوکی وان معیارات کے مطابق جانچ جاری ہے...',
      score: 'نمبرات',
      grade: 'نتیجہ',
      technicalStrengths: 'آپ کے جواب کے مثبت نکات',
      correctionsNeeded: 'تکنیکی اصلاح اور ہدایات',
      koreanTerminology: 'درست کورین اصطلاحات',
      nextQuestion: 'اگلا سوال پوچھیں',
      tryAgain: 'دوبارہ مشق کریں',
      speakAnswer: 'مائیک سے بولیں',
    },
    workout: {
      title: 'ڈوجانگ یومیہ ٹریننگ اور کنڈیشنگ پلان',
      generateBtn: 'آج کا ٹریننگ پلان بنائیں',
      generating: 'پلان ترتیب دیا جا رہا ہے...',
      focusArea: 'ٹریننگ کا بنیادی مرکز',
      duration: 'دورانیہ',
      warmup: 'وارم اپ اور اسٹریچنگ',
      technicalDrills: 'ککس اور بلاکس کی تکنیکی مشقیں',
      conditioning: 'طاقت اور اسٹیمنا',
      coolDown: 'کول ڈاؤن اور میڈیٹیشن',
      coachNote: 'کوچ کا حوصلہ افزا پیغام',
    },
    academy: {
      pakistanClub: 'پاکستان تائیکوانڈو کلب',
      worldStrikers: 'ورلڈ سٹرائیکرز تائیکوانڈو اکیڈمی (الخبر، سعودی عرب)',
      alKhobarLocation: 'الخبر، مشرقی صوبہ، مملکتِ سعودی عرب',
      ourTeam: 'ہماری کوچنگ قیادت',
      headCoachRole: 'ہیڈ آف ٹیم اور چیف انسٹرکٹر',
      certPresentation: 'کوچ شمائلہ نذیر ورلڈ سٹرائیکرز تائیکوانڈو اکیڈمی میں جونیئر یلو بیلٹ سرٹیفکیٹ پیش کرتے ہوئے',
      joinAcademy: 'اکیڈمی میں داخلہ لیں',
      contactInquiry: 'رابطہ یا رجسٹریشن انکوائری',
    },
  },
  ar: {
    appName: 'باك وورلد سترايكرز – مدرب التايكوندو الذكي',
    subTitle: 'نادي باكستان للتايكوندو وأكاديمية سترايكرز العالمية للتايكوندو • الخبر، المملكة العربية السعودية',
    headOfTeam: 'رئيس الفريق: الأستاذ علي رضوان',
    coaches: 'المدربون: الأستاذ محمد فيضان، الأستاذ نعمان، والأستاذة شميله نذير',
    disclaimerNote: 'شهادات كوكيوون الرسمية للدان والغيوب تُمنح حصرياً من قِبل فاحصين معتمدين في الاختبارات الرسمية. هذا المساعد للتدريب والتحضير فقط.',
    nav: {
      coachChat: 'محادثة المدرب الذكي',
      danExam: 'اختبار كوكيوون والدان',
      poomsae: 'موسوعة البومسي',
      terminology: 'المصطلحات الكورية',
      workout: 'التدريب اليومي',
      academies: 'الأندية والمدربون',
      progress: 'سجل التقدم والإحصائيات',
    },
    welcome: {
      greeting: 'تشاريوت! كيونغ ني! مرحباً بك في تدريب التايكوندو',
      tagline: 'مرشدك المعتمد في الفنون القتالية من الحزام الأبيض (الغيوب العاشر) حتى الحزام الأسود الدان التاسع.',
      startTraining: 'ابدأ الدرس التفاعلي',
      danPrep: 'قاعة اختبارات ترقية الدان',
      oralExamBtn: 'خوض الاختبار الشفهي',
    },
    chat: {
      placeholder: 'اسأل المدرب عن التكنيك، أو أجب عن الأسئلة، أو ناقش البومسي...',
      send: 'إرسال',
      listening: 'يستمع إلى صوتك الآن...',
      speak: 'تحدث',
      voiceActive: 'الميكروفون نشط',
      newSession: 'جلسة تدريب جديدة',
      studentName: 'اسم المتدرب',
      currentBelt: 'مستوى الحزام الحالي',
      selectLanguage: 'اللغة المفضلة',
      readyPrompt: 'جاهز للتدريب!',
      clearChat: 'إعادة ضبط المحادثة',
    },
    danExam: {
      title: 'محاكي الاختبار الشفهي وترقيات كوكيوون',
      subtitle: 'تحضير شامل لاختبارات لجان الترقية من الغيوب العاشر حتى الدان التاسع، وفحص المصطلحات وفلسفة التايكوندو.',
      selectRank: 'اختر مستوى الحزام أو الدان المستهدف',
      oralQuestions: 'سؤال الفاحص الشفهي والنظري',
      submitAnswer: 'تقديم الإجابة الشفهية',
      aiEvaluating: 'جاري تقييم الإجابة وفق معايير كوكيوون المعتمدة...',
      score: 'الدرجة',
      grade: 'النتيجة',
      technicalStrengths: 'نقاط القوة في إجابتك',
      correctionsNeeded: 'التصحيحات الفنية والميكانيكا الحيوية',
      koreanTerminology: 'المصطلحات الكورية المطبقة',
      nextQuestion: 'الانتقال للسؤال التالي',
      tryAgain: 'إعادة المحاولة والممارسة',
      speakAnswer: 'تحدث عبر الميكروفون',
    },
    workout: {
      title: 'مُولّد التدريب اليومي واللياقة في الدوجانغ',
      generateBtn: 'إنشاء خطة تدريب اليوم',
      generating: 'جاري بناء الحصة التدريبية المخصصة...',
      focusArea: 'محور التركيز في التدريب',
      duration: 'مدة الحصة',
      warmup: 'الإحماء ومرونة المفاصل',
      technicalDrills: 'تمارين الركلات والصد الفنية',
      conditioning: 'اللياقة القتالية والتحمل',
      coolDown: 'التهدئة والتأمل (ميونغ سانغ)',
      coachNote: 'رسالة تحفيزية من المدرب',
    },
    academy: {
      pakistanClub: 'نادي باكستان للتايكوندو',
      worldStrikers: 'أكاديمية سترايكرز العالمية للتايكوندو (الخبر، السعودية)',
      alKhobarLocation: 'الخبر، المنطقة الشرقية، المملكة العربية السعودية',
      ourTeam: 'الكادر التدريبي والإشرافي',
      headCoachRole: 'رئيس الفريق وكبير المدربين',
      certPresentation: 'الأستاذة شميله نذير تسلّم شهادة الحزام الأصفر للناشئين في أكاديمية سترايكرز العالمية للتايكوندو',
      joinAcademy: 'التسجيل في الأكاديمية',
      contactInquiry: 'استفسار أو حجز حصة تجريبية',
    },
  },
};
