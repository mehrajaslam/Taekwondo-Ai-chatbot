import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_INSTRUCTION = `You are the official AI Taekwondo Assistant & Coach for:
1. Pakistan Taekwondo Club
2. World Strikers Taekwondo Academy, Al Khobar, Saudi Arabia.

TEAM LEADERSHIP:
- Head of Team: Mr. Ali Rizwan
- Coaches: Mr. Muhammad Faizan, Mr. Nauman, and Ms. Shumaila Nazeer.

YOUR RESPONSIBILITIES & RULES:
1. Welcome every new student warmly with martial arts respect (Charyot! Gyeongnye! / Attention, Bow).
2. Ask their name, current belt / Dan level (White belt 10th Geup up to 9th Dan Grandmaster), and preferred language (English, Urdu, or Arabic).
3. Teach ONE lesson at a time. Keep lessons focused and digestible.
4. Ask a question and wait for the student's answer.
5. Listen to their answers, correct mistakes kindly and constructively, and explain the correct biomechanics, hip rotation, chambering, stances, and safety.
6. Prepare students for Kukkiwon-aligned promotion examinations from 1st to 9th Dan, and Geup belt gradings.
7. Teach Poomsae (Taegeuk 1–8, Koryo, Keumgang, Taebaek, Pyongwon, Sipjin, Jitae, Cheonkwon, Hansoo, Ilyeo), Kyorugi (Olympic WT sparring strategy, scoring, footwork), Korean terminology, Taekwondo history, and the 5 Tenets (Ye Ui, Yom Chi, In Nae, Guk Gi, Baekjul Boolgool).
8. Conduct interactive oral examinations and quizzes.
9. Motivate students and provide daily training exercises.
10. SAFETY & KUKKIWON DISCLAIMER: Always remind students to practice safely on padded mats or open spaces. Never claim to award official Kukkiwon Dan certificates or replace an authorized Kukkiwon test examiner.

LANGUAGE HANDLING:
- Respond in the student's selected language: English, Urdu (اردو), or Arabic (العربية).
- Write natural, grammatically correct Urdu or Arabic when conversing in those languages.
- Always include traditional Korean martial arts terms with pronunciation guide (e.g. Ap Chagi / 앞차기 / Front Kick).

PERSONALITY:
Friendly, disciplined, deeply encouraging, authentic martial arts Master coach.`;

// API: AI Coach Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, studentProfile } = req.body;
    const language = studentProfile?.language || 'en';
    const belt = studentProfile?.belt || 'White Belt (10th Geup)';
    const name = studentProfile?.name || 'Student';

    if (!ai) {
      // Fallback response if API key is not configured
      const fallbacks: Record<string, string> = {
        en: `Charyot! Gyeongnye! Welcome ${name} to Pakistan Taekwondo Club and World Strikers Taekwondo Academy, Al Khobar. I am your AI Taekwondo Coach under Head of Team Mr. Ali Rizwan, and Coaches Mr. Muhammad Faizan, Mr. Nauman, and Ms. Shumaila Nazeer. Currently training at ${belt}. Let's begin our lesson: What technique or Poomsae would you like to master today?`,
        ur: `چاریوت! گیونگ نیے! خوش آمدید ${name}! پاکستان تائیکوانڈو کلب اور ورلڈ سٹرائیکرز تائیکوانڈو اکیڈمی، الخبر میں آپ کا استقبال ہے۔ میں ہیڈ آف ٹیم جناب علی رضوان اور کوچز محمد فیضان، نعمان اور شمائلہ نذیر کی رہنمائی میں آپ کا اے آئی تائیکوانڈو کوچ ہوں۔ آپ کی موجودہ بیلٹ ${belt} ہے۔ آج آپ کون سی تکنیک یا پومسے سیکھنا چاہتے ہیں؟`,
        ar: `تشاريوت! كيونغ ني! أهلاً بك يا ${name} في نادي باكستان للتايكوندو وأكاديمية سترايكرز العالمية للتايكوندو في الخبر، المملكة العربية السعودية. أنا مدربك الذكي بإشراف رئيس الفريق الأستاذ علي رضوان والمدربين محمد فيضان، نعمان، والأستاذة شميله نذير. مستواك الحالي: ${belt}. ما هي التقنية أو البومسي التي تود التدرب عليها اليوم؟`,
      };
      return res.json({
        reply: fallbacks[language] || fallbacks.en,
        suggestedReplies: [
          language === 'ur' ? 'بنیادی ککس (Front Kick & Roundhouse)' : language === 'ar' ? 'الركلات الأساسية (أب تشاغي ودوليو تشاغي)' : 'Basic Kicks (Ap Chagi & Dollyo Chagi)',
          language === 'ur' ? 'پومسے (Taegeuk 1 Jang)' : language === 'ar' ? 'بومسي تايغوك 1 جانغ' : 'Poomsae Taegeuk 1 Jang',
          language === 'ur' ? 'کورین اصطلاحات کا زبانی امتحان' : language === 'ar' ? 'اختبار المصطلحات الكورية الشفهي' : 'Oral Exam Prep & Korean Terminology',
        ],
      });
    }

    // Format conversation history for Gemini
    const contents = messages.map((m: { sender: string; text: string }) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Inject contextual system reminder with student profile
    const contextPrompt = `[Student: ${name}, Belt Level: ${belt}, Preferred Language: ${language}]. Respond in ${
      language === 'ur' ? 'Urdu (اردو)' : language === 'ar' ? 'Arabic (العربية)' : 'English'
    }. Teach step-by-step. Keep it interactive: ask one question to test understanding or invite them to practice!`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...contents,
        {
          role: 'user',
          parts: [{ text: `[System Instruction Reminder: ${contextPrompt}]\n${messages[messages.length - 1]?.text || 'Hello Coach'}` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const replyText = chatResponse.text || 'Osu! Keep your focus and let us practice!';

    // Generate suggested 3 quick replies
    const replyOptions: Record<string, string[]> = {
      en: ['Yes Sir! Ready for next step.', 'Can you explain the foot pivot?', 'Ask me an oral exam question.'],
      ur: ['جی کوچ! اگلے مرحلے کے لیے تیار ہوں۔', 'پاؤں کے موڑ (Pivot) کی وضاحت کریں۔', 'مجھ سے زبانی سوال پوچھیں۔'],
      ar: ['نعم كوتش! جاهز للخطوة التالية.', 'اشرح لي دوران مشط القدم والقدم الثابتة.', 'اطرح علي سؤالاً للاختبار الشفهي.'],
    };

    return res.json({
      reply: replyText,
      suggestedReplies: replyOptions[language] || replyOptions.en,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'Failed to generate coach response. Please try again.',
      reply: 'Charyot! Coach is ready. Let us proceed with determination. (Network reconnecting)',
    });
  }
});

// API: Oral Dan/Geup Examination Evaluator
app.post('/api/oral-exam', async (req, res) => {
  try {
    const { question, studentAnswer, beltLevel, language } = req.body;

    if (!ai) {
      return res.json({
        score: 85,
        grade: 'Pass',
        feedback: 'Good understanding of the fundamental Taekwondo principle and terminology.',
        strengths: ['Identified correct Korean term', 'Clear understanding of stance'],
        corrections: ['Make sure to chamber with hip rotation and exhale with Kiyap'],
        correctTerminology: ['Joonbi Seogi', 'Momtong Makgi', 'Ap Koobi'],
        nextQuestion: 'What is the significance of the 5 Tenets of Taekwondo?',
      });
    }

    const examPrompt = `You are the Kukkiwon-aligned promotion examination evaluator for Pakistan Taekwondo Club & World Strikers Taekwondo Academy, Al Khobar.
Student Belt/Dan Level: ${beltLevel}
Language: ${language}
Examination Question: "${question}"
Student's Answer: "${studentAnswer}"

Evaluate their answer strictly according to Kukkiwon standards, Korean terminology accuracy, biomechanics, and martial philosophy.
Provide constructive, encouraging coaching feedback.
Output JSON format adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: examPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score out of 100' },
            grade: { type: Type.STRING, description: 'Distinction (90+), Pass (70-89), or Needs Practice (<70)' },
            feedback: { type: Type.STRING, description: 'Evaluation feedback in the requested language' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key positive elements in student answer',
            },
            corrections: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Technical points to correct or expand on',
            },
            correctTerminology: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Accurate Korean terms involved (Hangul + Romanization)',
            },
            nextQuestion: {
              type: Type.STRING,
              description: 'A relevant follow-up oral exam question for this belt level',
            },
          },
          required: ['score', 'grade', 'feedback', 'strengths', 'corrections', 'correctTerminology', 'nextQuestion'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Oral Exam Error:', error);
    res.status(500).json({ error: 'Failed to evaluate exam question.' });
  }
});

// API: Daily Training & Weekly Workout Generator
app.post('/api/generate-workout', async (req, res) => {
  try {
    const { beltLevel, focus, durationMinutes, language } = req.body;

    if (!ai) {
      return res.json({
        title: `${beltLevel} Intensive Dojang Training Session`,
        targetBelt: beltLevel,
        durationMinutes: durationMinutes || 45,
        warmup: [
          '5 min light jog & dynamic footwork switches (Bal Bakka)',
          'Hip mobility rotations & adductor stretch',
          'Front swing leg raises (Apcha Olligi) - 15 reps each leg',
        ],
        technicalDrills: [
          { name: 'Ap Chagi (Front Kick) Chamber & Snap', reps: '3 sets of 15', coachingTips: 'Lock knee high before releasing' },
          { name: 'Dollyo Chagi (Roundhouse) 45-degree angle', reps: '3 sets of 12', coachingTips: 'Pivot base foot 180 degrees' },
          { name: 'Momtong Makgi & Baro Jireugi combo', reps: '4 sets of 10', coachingTips: 'Rotate wrist sharply at point of impact' },
        ],
        poomsaeFocus: 'Taegeuk Poomsae: Focus on clean stances (Ap Koobi & Dwit Koobi) and explosive Kiyap.',
        conditioning: ['3 x 30 sec rapid alternating flutter kicks', '20 plyometric split jump lunges', '1 min horse stance (Juchum Seogi) hold'],
        coolDown: ['Hamstring seated fold', 'Cobra abdominal stretch', 'Myung-sang (1 minute silent meditation)'],
        coachesNote: 'Practice with indomitable spirit (Baekjul Boolgool). Keep your guard up at all times!',
      });
    }

    const workoutPrompt = `Generate a high-performance Taekwondo workout plan designed by Pakistan Taekwondo Club & World Strikers Taekwondo Academy (Head of Team Mr. Ali Rizwan, Coaches Mr. Muhammad Faizan, Mr. Nauman, Ms. Shumaila Nazeer).
Student Belt Level: ${beltLevel}
Focus Area: ${focus || 'Poomsae and Kicking Dynamics'}
Duration: ${durationMinutes || 45} minutes
Language: ${language || 'en'}

Create a realistic martial arts dojang training session with warm-ups, technical drills, Poomsae focus, conditioning, cool-down, and a coach motivational note.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: workoutPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetBelt: { type: Type.STRING },
            durationMinutes: { type: Type.INTEGER },
            warmup: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalDrills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  coachingTips: { type: Type.STRING },
                },
                required: ['name', 'reps', 'coachingTips'],
              },
            },
            poomsaeFocus: { type: Type.STRING },
            conditioning: { type: Type.ARRAY, items: { type: Type.STRING } },
            coolDown: { type: Type.ARRAY, items: { type: Type.STRING } },
            coachesNote: { type: Type.STRING },
          },
          required: ['title', 'targetBelt', 'durationMinutes', 'warmup', 'technicalDrills', 'poomsaeFocus', 'conditioning', 'coolDown', 'coachesNote'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Workout Generator Error:', error);
    res.status(500).json({ error: 'Failed to generate training plan.' });
  }
});

// API: Audio Voice Transcription (Gemini 3.5 Transcribe)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType, language } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    if (!ai) {
      return res.json({ text: '' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioData,
      },
    };

    const promptText =
      language === 'ur'
        ? 'Transcribe this martial arts student speech verbatim in Urdu or English as spoken. Output only the transcribed text, without commentary.'
        : language === 'ar'
        ? 'Transcribe this martial arts student speech verbatim in Arabic or English as spoken. Output only the transcribed text, without commentary.'
        : 'Transcribe this martial arts student speech verbatim in English or Korean terminology as spoken. Output only the transcribed text, without commentary.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { parts: [audioPart, { text: promptText }] },
    });

    const transcribedText = (response.text || '').trim();
    return res.json({ text: transcribedText });
  } catch (error) {
    console.error('Audio Transcription Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Taekwondo AI Coach server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
