import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Sparkles,
  User,
  ShieldCheck,
  Flame,
  AlertCircle,
  Radio,
  Square,
  Activity,
  Check,
  Bell,
  BellOff,
  Headphones,
  VolumeX,
} from 'lucide-react';
import { ChatMessage, Language, StudentProfile } from '../types';
import { translations } from '../translations';
import { speakText, stopSpeaking, playCoachResponseChime } from '../utils/speech';

interface AICoachChatProps {
  language: Language;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenExamWithBelt?: (belt: string) => void;
  onOpenPoomsae?: (poomsaeId: string) => void;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  language,
  profile,
  setProfile,
  onOpenExamWithBelt,
  onOpenPoomsae,
}) => {
  const t = translations[language];

  const getInitialMessage = (lang: Language, studentName: string, belt: string): ChatMessage => {
    if (lang === 'ur') {
      return {
        id: 'msg-init-1',
        sender: 'coach',
        text: `چاریوت! گیونگ نیے! (Charyot! Gyeongnye! - باادب سلام)\n\nخوش آمدید! میں پاکستان تائیکوانڈو کلب اور ورلڈ سٹرائیکرز تائیکوانڈو اکیڈمی، الخبر (سعودی عرب) کا آفیشل اے آئی تائیکوانڈو کوچ ہوں۔ ہماری قیادت ہیڈ آف ٹیم جناب علی رضوان اور کوچز محمد فیضان، نعمان اور محترمہ شمائلہ نذیر کے پاس ہے۔\n\nمارشل آرٹس کے اصول کے مطابق، ہر نیا سفر تعارف سے شروع ہوتا ہے۔ برائے مہربانی اپنا نام بتائیں، اپنی موجودہ بیلٹ لیول (وائٹ بیلٹ سے 9ویں ڈان تک) کی تصدیق کریں، اور بتائیں کہ آج آپ کون سا سبق یا تکنیک سیکھنا چاہتے ہیں؟\n\n(دو طرفہ صوتی گفتگو فعال ہے: آپ بول کر سوال پوچھیں، میں بول کر جواب دوں گا!)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: [
          `میرا نام ${studentName} ہے، بیلٹ: ${belt}`,
          'میں نیا طالب علم ہوں، وائٹ بیلٹ کے بنیادی اصول سیکھنا چاہتا ہوں',
          'Taegeuk 1 Jang (پومسے 1) کی تیاری کروائیں',
          'کوکی وان ڈان پروموشن کے زبانی امتحان کی مشق',
        ],
      };
    }

    if (lang === 'ar') {
      return {
        id: 'msg-init-1',
        sender: 'coach',
        text: `تشاريوت! كيونغ ني! (Charyot! Gyeongnye! - انتباه وتحية احترام)\n\nأهلاً وسهلاً بك في نادي باكستان للتايكوندو وأكاديمية سترايكرز العالمية للتايكوندو في الخبر، المملكة العربية السعودية! أنا مدربك الذكي الرسمي تحت إشراف رئيس الفريق الأستاذ علي رضوان والمدربين الأفاضل: محمد فيضان، نعمان، والأستاذة شميله نذير.\n\nوفقاً لتقاليد التايكوندو الأصيلة، نبدأ دائماً بالتعارف: يرجى تأكيد اسمك الكريم، ومستوى حزامك الحالي (من الحزام الأبيض حتى الدان التاسع)، وما هو الدرس أو التقنية التي تود أن نبدأ بها اليوم؟\n\n(المحادثة الصوتية المتبادلة ثنائية الاتجاه مفعلة: تحدث بصوتك وسأجيبك بصوتي مباشرة!)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: [
          `اسمي ${studentName}، مستواي: ${belt}`,
          'أنا مبتدئ تماماً، أريد تعلم وقفات وركلات الحزام الأبيض',
          'تدريب بومسي تايغوك 1 جانغ (Taegeuk Il Jang)',
          'محاكاة اختبار كوكيوون الشفهي للترقية',
        ],
      };
    }

    return {
      id: 'msg-init-1',
      sender: 'coach',
      text: `Charyot! Gyeongnye! (Attention! Bow!)\n\nWelcome to Pakistan Taekwondo Club and World Strikers Taekwondo Academy, Al Khobar, Saudi Arabia! I am your official AI Taekwondo Coach under the leadership of our Head of Team Mr. Ali Rizwan, and Coaches Mr. Muhammad Faizan, Mr. Nauman, and Ms. Shumaila Nazeer.\n\nIn the spirit of martial arts discipline, let us begin our journey together: Please tell me your name, confirm your current belt or Dan level (from White Belt to 9th Dan), and let me know what specific technique, Poomsae, or Dan exam preparation you would like to master today!\n\n(Two-way voice conversation is enabled: speak with your microphone, and I will speak back to you aloud!)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedReplies: [
        `My name is ${studentName}, currently ${belt}`,
        "I'm a new student! Teach me White Belt fundamentals",
        'Prepare me for Taegeuk 1 Jang Poomsae',
        'Test me on Kukkiwon Dan Oral Examination questions',
        'Teach me Kyorugi (Olympic Sparring) tactics',
      ],
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    getInitialMessage(language, profile.name, profile.belt),
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);

  // Web Speech API States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  // Two-Way Voice Conversational Mode
  const [twoWayVoiceMode, setTwoWayVoiceMode] = useState<boolean>(true);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState<boolean>(false);
  const [audioCueEnabled, setAudioCueEnabled] = useState<boolean>(true);

  const wasVoiceInputRef = useRef<boolean>(false);
  const twoWayVoiceModeRef = useRef<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speakingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    twoWayVoiceModeRef.current = twoWayVoiceMode;
  }, [twoWayVoiceMode]);

  useEffect(() => {
    // Check Web Speech API browser availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isListening, interimTranscript, isCoachSpeaking]);

  // Clean up recognition and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
      stopSpeaking();
    };
  }, []);

  const handleResetChat = () => {
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    setIsSpeaking(false);
    setIsCoachSpeaking(false);
    setInterimTranscript('');
    setSpeechError(null);
    setMessages([getInitialMessage(language, profile.name, profile.belt)]);
  };

  // Start speech recognition listening
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'The Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.'
      );
      return;
    }

    // Stop coach audio if currently speaking before listening
    stopSpeaking();
    setIsCoachSpeaking(false);

    setSpeechError(null);
    setInterimTranscript('');

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      if (language === 'ur') {
        recognition.lang = 'ur-PK';
      } else if (language === 'ar') {
        recognition.lang = 'ar-SA';
      } else {
        recognition.lang = 'en-US';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setIsSpeaking(false);
        setSpeechError(null);
        wasVoiceInputRef.current = true;
      };

      recognition.onspeechstart = () => {
        setIsSpeaking(true);
      };

      recognition.onsoundstart = () => {
        setIsSpeaking(true);
      };

      recognition.onsoundend = () => {
        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, 800);
      };

      recognition.onspeechend = () => {
        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, 800);
      };

      recognition.onresult = (event: any) => {
        setIsSpeaking(true);
        wasVoiceInputRef.current = true;
        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, 1200);

        let finalPart = '';
        let interimPart = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalPart += item[0].transcript + ' ';
          } else {
            interimPart += item[0].transcript;
          }
        }

        if (finalPart.trim()) {
          wasVoiceInputRef.current = true;
          setInputText((prev) => {
            const trimmedPrev = prev.trim();
            const trimmedFinal = finalPart.trim();
            return trimmedPrev ? `${trimmedPrev} ${trimmedFinal}` : trimmedFinal;
          });
          setInterimTranscript('');
        } else {
          if (interimPart.trim()) {
            wasVoiceInputRef.current = true;
          }
          setInterimTranscript(interimPart);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Web Speech API recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError(
            'Microphone access denied. Please allow microphone permissions in your browser address bar and try again.'
          );
          setIsListening(false);
          setIsSpeaking(false);
        } else if (event.error === 'no-speech') {
          setIsSpeaking(false);
        } else if (event.error === 'network') {
          setSpeechError('Speech recognition network error. Please verify connection and retry.');
          setIsListening(false);
          setIsSpeaking(false);
        } else if (event.error !== 'aborted') {
          setSpeechError(`Speech recognition: ${event.error}`);
          setIsListening(false);
          setIsSpeaking(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsSpeaking(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start Web Speech API:', err);
      setSpeechError(err.message || 'Failed to start microphone.');
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  // Toggle Web Speech API voice recording
  const handleToggleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (activeSpeechMsgId === msgId) {
      stopSpeaking();
      setActiveSpeechMsgId(null);
    } else {
      setActiveSpeechMsgId(msgId);
      speakText(text, language);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    // If speech recognition is active, stop it before sending
    if (isListening) {
      stopListening();
    }

    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    stopSpeaking();
    setActiveSpeechMsgId(null);
    setSpeechError(null);
    setInterimTranscript('');
    setIsCoachSpeaking(false);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ sender: m.sender, text: m.text })),
          studentProfile: profile,
        }),
      });

      const data = await response.json();

      // Subtle audio cue notification when AI responds to voice input question
      if (wasVoiceInputRef.current && audioCueEnabled) {
        playCoachResponseChime();
      }

      const coachMessage: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: data.reply || 'Charyot! Good effort. Let us practice the next movement with precision.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: data.suggestedReplies || [],
      };

      setMessages((prev) => [...prev, coachMessage]);
      setProfile((prev) => ({
        ...prev,
        completedLessons: prev.completedLessons + 1,
      }));

      // TWO-WAY VOICE CONVERSATION LOOP:
      // When two-way voice mode is active, Coach speaks the answer aloud,
      // and when finished, automatically re-opens the microphone for the student!
      if (twoWayVoiceModeRef.current) {
        setIsCoachSpeaking(true);
        speakText(
          coachMessage.text,
          language,
          () => {
            // Callback when Coach finishes speaking
            setIsCoachSpeaking(false);
            if (twoWayVoiceModeRef.current) {
              // Gentle pause of 500ms before re-opening mic to avoid self-echo
              setTimeout(() => {
                startListening();
              }, 500);
            }
          },
          () => {
            setIsCoachSpeaking(true);
          }
        );
      }

      wasVoiceInputRef.current = false;
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text:
          language === 'ur'
            ? 'توجہ فرمائیں! تکنیک کی مشق کرتے وقت اپنی کمر سیدھی رکھیں اور سانس پر قابو رکھیں۔ کیا آپ نے بنیادی وارم اپ مکمل کر لیا ہے؟'
            : language === 'ar'
            ? 'ممتاز! تذكر دائماً المحافظة على التوازن واستقامة الظهر أثناء أداء الركلة. هل أكملت تمارين الإحماء؟'
            : 'Excellent focus! Always remember to pivot your supporting foot, chamber the knee tightly, and exhale with Kiyap. Shall we test your stance balance now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: ['Yes Sir! Ready for next step.', 'Show me the common mistakes to avoid', 'Ask me an oral exam question'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[880px] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Coach Top Profile Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <span className="text-sm font-black text-white">사범</span>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Master AI Coach
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-400">
              Pak Taekwondo Club & World Strikers Academy (Al Khobar)
            </p>
          </div>
        </div>

        {/* Header Controls: Two-Way Voice Toggle, Audio Cue & Reset */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Two-Way Conversational Voice Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !twoWayVoiceMode;
              setTwoWayVoiceMode(nextVal);
              twoWayVoiceModeRef.current = nextVal;
              if (!nextVal) {
                stopSpeaking();
                setIsCoachSpeaking(false);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              twoWayVoiceMode
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-sm shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-300'
            }`}
            title="Two-Way Voice Mode: Coach speaks responses aloud and automatically listens for your verbal reply"
          >
            <Headphones className={`w-3.5 h-3.5 ${twoWayVoiceMode ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">
              {twoWayVoiceMode ? '2-Way Voice: On' : '2-Way Voice: Off'}
            </span>
          </button>

          {/* Audio Cue Notification Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !audioCueEnabled;
              setAudioCueEnabled(nextVal);
              if (nextVal) {
                playCoachResponseChime();
              }
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              audioCueEnabled
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-300'
            }`}
            title={audioCueEnabled ? 'Audio Chime Cue: On' : 'Audio Chime Cue: Off'}
          >
            {audioCueEnabled ? (
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <BellOff className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-300 font-semibold">{profile.completedLessons}</span>
          </div>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700/60"
            title={t.chat.clearChat}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t.chat.newSession}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
            >
              <div className="flex items-end gap-2 max-w-[92%] sm:max-w-[80%]">
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-xs font-bold text-red-300 shrink-0">
                    TKD
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-none'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>

                  <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400 border-t border-slate-700/40 pt-1.5">
                    <span>{message.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeakMessage(message.id, message.text)}
                        className={`flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer ${
                          activeSpeechMsgId === message.id ? 'text-amber-400 font-bold' : ''
                        }`}
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{activeSpeechMsgId === message.id ? 'Stop Voice' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Coach Suggested Replies Pills */}
              {!isUser && message.suggestedReplies && message.suggestedReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                  {message.suggestedReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply)}
                      disabled={isLoading}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 px-3 py-1.5 rounded-full transition-all text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      🥋 {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            </div>
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl rounded-bl-none border border-slate-700/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-slate-300 ml-1">Master Coach is formulating your training response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Two-Way Conversational Mode: Coach Speaking Status Indicator */}
      {isCoachSpeaking && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-t border-emerald-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-5 h-5">
              <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping absolute"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 relative"></span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
              <span>🥋 Master Coach Speaking... (Answering aloud)</span>
              <div className="flex items-end gap-1 h-3.5 px-1 py-0.5 bg-slate-950 rounded border border-slate-800">
                <span className="w-1 rounded-sm bg-emerald-400 h-full animate-bounce" />
                <span className="w-1 rounded-sm bg-emerald-400 h-3/4 animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 rounded-sm bg-amber-400 h-full animate-bounce [animation-delay:0.3s]" />
                <span className="w-1 rounded-sm bg-red-400 h-1/2 animate-bounce [animation-delay:0.45s]" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setIsCoachSpeaking(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
          >
            <Square className="w-3 h-3 fill-current text-amber-400" />
            <span>Mute Coach</span>
          </button>
        </div>
      )}

      {/* Web Speech API Live Status Indicator Bar (When user is recording/speaking) */}
      {isListening && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-t border-red-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-5 h-5">
              <span className={`w-4 h-4 rounded-full absolute ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-red-500 animate-pulse'}`}></span>
              <span className={`w-3 h-3 rounded-full relative ${isSpeaking ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                {isSpeaking ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>User Speaking... (Web Speech API Active)</span>
                  </span>
                ) : (
                  <span className="text-red-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-spin" />
                    <span>Listening... Speak into your microphone</span>
                  </span>
                )}
              </div>

              <div className="flex items-end gap-1 h-3.5 px-1 py-0.5 bg-slate-950 rounded border border-slate-800">
                <span className={`w-1 rounded-sm bg-emerald-400 transition-all ${isSpeaking ? 'h-full animate-bounce' : 'h-1'}`} />
                <span className={`w-1 rounded-sm bg-emerald-400 transition-all [animation-delay:0.15s] ${isSpeaking ? 'h-3/4 animate-bounce' : 'h-1'}`} />
                <span className={`w-1 rounded-sm bg-amber-400 transition-all [animation-delay:0.3s] ${isSpeaking ? 'h-full animate-bounce' : 'h-1'}`} />
                <span className={`w-1 rounded-sm bg-red-400 transition-all [animation-delay:0.45s] ${isSpeaking ? 'h-2/3 animate-bounce' : 'h-1'}`} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceRecording}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Mic</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Interim Transcript Bubble */}
      {isListening && interimTranscript && (
        <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-2 text-xs flex items-center gap-2 text-amber-300 italic animate-in fade-in">
          <span className="text-slate-400 font-normal not-italic">Hearing:</span>
          <span>"{interimTranscript}"</span>
        </div>
      )}

      {/* Speech Recognition Error Banner */}
      {speechError && (
        <div className="bg-red-950/90 border-t border-red-700 px-4 py-2.5 flex items-start justify-between gap-3 text-xs text-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Microphone Status: </span>
              <span>{speechError}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={startListening}
            className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-[11px] font-bold shrink-0 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Unsupported Browser Warning */}
      {!isSpeechSupported && (
        <div className="bg-amber-950/70 border-t border-amber-800/80 px-4 py-2 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Web Speech API is not supported in this browser. Please type your message or switch to Chrome/Edge.</span>
        </div>
      )}

      {/* Input Box & Voice Toggle Controls */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Web Speech API Microphone Toggle Button */}
          <button
            type="button"
            onClick={handleToggleVoiceRecording}
            disabled={isLoading || !isSpeechSupported}
            className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center relative ${
              isListening
                ? isSpeaking
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/50 shadow-lg shadow-emerald-900/60 animate-pulse'
                  : 'bg-red-600 text-white ring-4 ring-red-500/50 shadow-lg shadow-red-900/60 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-red-500/50'
            }`}
            title={
              isListening
                ? 'Microphone Active: Click to Stop Recording'
                : 'Enable Microphone (2-Way Voice Conversation)'
            }
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-red-400" />
            )}

            {isListening && isSpeaking && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping"></span>
            )}
          </button>

          {/* Text input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? isSpeaking
                    ? 'Transcribing speech in real-time...'
                    : 'Listening... (Speak your question to Coach)'
                  : isCoachSpeaking
                  ? 'Coach is speaking aloud...'
                  : t.chat.placeholder
              }
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold px-4 sm:px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-red-950/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">{t.chat.send}</span>
          </button>
        </form>

        {/* Quick action shortcuts & Live Voice status indicator */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kukkiwon-aligned syllabus • Student: {profile.name} ({profile.belt})</span>
          </div>

          <div className="flex items-center gap-2">
            {twoWayVoiceMode && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                <Headphones className="w-3 h-3" />
                <span>Two-Way Voice Mode</span>
              </span>
            )}

            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isListening
                    ? isSpeaking
                      ? 'bg-emerald-400 animate-ping'
                      : 'bg-red-400 animate-pulse'
                    : isCoachSpeaking
                    ? 'bg-amber-400 animate-bounce'
                    : 'bg-slate-600'
                }`}
              />
              <span
                className={
                  isListening
                    ? isSpeaking
                      ? 'text-emerald-400 font-bold'
                      : 'text-red-300 font-medium'
                    : isCoachSpeaking
                    ? 'text-amber-400 font-semibold'
                    : 'text-slate-500'
                }
              >
                {isListening
                  ? isSpeaking
                    ? 'Speaking Detected'
                    : 'Mic Active'
                  : isCoachSpeaking
                  ? 'Coach Speaking'
                  : 'Web Speech API Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
