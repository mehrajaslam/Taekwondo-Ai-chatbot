import React, { useState } from 'react';
import { Shield, MapPin, Award, Users, CheckCircle, Mail, Phone, Calendar, HeartHandshake, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { ACADEMY_DATA } from '../data/taekwondoData';

interface AcademyShowcaseProps {
  language: Language;
  onEnrollInquiry: (message: string) => void;
}

export const AcademyShowcase: React.FC<AcademyShowcaseProps> = ({
  language,
  onEnrollInquiry,
}) => {
  const t = translations[language];

  const [studentInquiryName, setStudentInquiryName] = useState('');
  const [studentInquiryAge, setStudentInquiryAge] = useState('');
  const [studentClubChoice, setStudentClubChoice] = useState<'world_strikers' | 'pakistan'>('world_strikers');
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInquiryName.trim()) return;

    setInquirySent(true);
    onEnrollInquiry(
      `Hello Head Coach Mr. Ali Rizwan and Team! I would like to inquire about enrolling ${studentInquiryName} (Age: ${
        studentInquiryAge || 'N/A'
      }) at ${
        studentClubChoice === 'world_strikers'
          ? 'World Strikers Taekwondo Academy in Al Khobar, Saudi Arabia'
          : 'Pakistan Taekwondo Club'
      }. What is the training schedule, dobok uniform requirement, and belt grading system?`
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner: Twin Academy Alliance */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-300">
            <span>🇵🇰 & 🇸🇦 International Martial Arts Alliance</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Pakistan Taekwondo Club & World Strikers Academy
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Uniting two elite martial arts organizations dedicated to World Taekwondo (WT) and Kukkiwon standards. Inspiring children, youth, and adult champions with Olympic sparring, traditional Poomsae, self-defense, and moral fortitude.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Al Khobar, Eastern Province, Saudi Arabia</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
              <Shield className="w-4 h-4 text-red-400" />
              <span>Kukkiwon-Aligned Dan Grading (1st-9th Dan)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Photo Showcase: Coach Ms. Shumaila Nazeer at World Strikers Academy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Dojang In Action • World Strikers Taekwondo Academy, Al Khobar
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Official Academy Certificate Presentation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Photo */}
          <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl relative group">
            <img
              src="/assets/aistudio/world_strikers_11jpg_6dfbd321.jpg"
              alt="Coach Ms. Shumaila Nazeer awarding Junior Yellow Belt Test Certificate at World Strikers Taekwondo Academy"
              className="w-full h-auto object-cover max-h-[500px] transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                World Strikers TKD Academy - Junior Yellow Belt Test Certificate
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Coach Ms. Shumaila Nazeer presenting the official certificate and yellow belt to an accomplished student at World Strikers Academy in Al Khobar, Saudi Arabia, joined by fellow student peer in red belt.
              </p>
            </div>
          </div>

          {/* Details & Commentary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Building Confidence & Real Martial Achievement
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                At World Strikers Taekwondo Academy, belt promotions are not just tests; they are milestone celebrations of character, discipline, and persevering effort. Under Coach Ms. Shumaila Nazeer and the leadership of Head of Team Mr. Ali Rizwan, young students learn the meaning of hard work and respect.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>Structured curriculum aligned strictly with Kukkiwon guidelines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Padded Olympic-standard training mats and electronic chest gear</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Inclusive classes for tiny tigers, juniors, girls, boys, and adults</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-900/40 rounded-xl p-4 text-xs text-emerald-300">
              "Every black belt was once a white belt who refused to give up."
              <div className="text-[10px] text-slate-400 mt-1">— Pakistan Taekwondo Club & World Strikers Academy Motto</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Coaching Team */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            {t.academy.ourTeam}
          </h3>
          <p className="text-xs text-slate-400">
            Meet the instructors guiding your martial arts journey across Pakistan and Saudi Arabia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACADEMY_DATA.team.map((coach, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-sm text-amber-300">
                    🥋
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">{coach.name}</h4>
                  <div className="text-xs font-semibold text-red-400 leading-snug mt-0.5">
                    {coach.role}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {coach.bio}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-slate-800 pt-3">
                {coach.credentials.map((cred, cIdx) => (
                  <div key={cIdx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Academy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* World Strikers Academy, Al Khobar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <span>🇸🇦 Saudi Arabia Hub</span>
          </div>
          <h3 className="text-xl font-black text-white">{ACADEMY_DATA.worldStrikers.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {ACADEMY_DATA.worldStrikers.description}
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Programs Offered</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
              {ACADEMY_DATA.worldStrikers.trainingPrograms.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pakistan Taekwondo Club */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <span>🇵🇰 Pakistan Heritage</span>
          </div>
          <h3 className="text-xl font-black text-white">{ACADEMY_DATA.pakistanClub.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {ACADEMY_DATA.pakistanClub.mission}
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialties & Honors</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
              {ACADEMY_DATA.pakistanClub.specialties.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Student Enrollment & Trial Class Inquiry Card */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 inline-flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            Join Our Dojang Family
          </span>
          <h3 className="text-2xl font-black text-white">
            Ready to Begin Your Taekwondo Journey?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Submit your information below to inquire about classes at World Strikers Taekwondo Academy (Al Khobar, KSA) or Pakistan Taekwondo Club. Our coaching team will prepare your trial session.
          </p>

          <form onSubmit={handleInquirySubmit} className="mt-6 space-y-3 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentInquiryName}
                  onChange={(e) => setStudentInquiryName(e.target.value)}
                  placeholder="e.g. Dena Sadiq or Ali"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Age / Category
                </label>
                <input
                  type="text"
                  value={studentInquiryAge}
                  onChange={(e) => setStudentInquiryAge(e.target.value)}
                  placeholder="e.g. 8 years (Junior) or Adult"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Preferred Academy
                </label>
                <select
                  value={studentClubChoice}
                  onChange={(e) => setStudentClubChoice(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="world_strikers">World Strikers Academy (Al Khobar)</option>
                  <option value="pakistan">Pakistan Taekwondo Club</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl text-xs shadow-lg shadow-red-950/50 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Send Enrollment Inquiry to AI Coach & Team</span>
              </button>
            </div>

            {inquirySent && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl text-center">
                ✓ Inquiry registered! Coach has received your request in the AI Coach Chat tab.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
