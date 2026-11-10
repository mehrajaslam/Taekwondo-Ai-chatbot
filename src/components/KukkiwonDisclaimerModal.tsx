import React from 'react';
import { ShieldCheck, AlertCircle, X, ExternalLink, Award } from 'lucide-react';
import { Language } from '../types';

interface KukkiwonDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const KukkiwonDisclaimerModal: React.FC<KukkiwonDisclaimerModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-200 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Official Kukkiwon Dan Promotion Policy
            </h3>
            <p className="text-xs text-amber-400 font-semibold">
              Pakistan Taekwondo Club & World Strikers Taekwondo Academy
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <p>
            <strong className="text-white">1. Educational & Preparation Purpose:</strong> This AI Taekwondo Assistant is engineered to instruct students in Kukkiwon-aligned syllabus from 10th Geup (White Belt) to 9th Dan (Grandmaster), covering Poomsae step counts, Kyorugi Olympic rules, Korean terminology, and theoretical oral examinations.
          </p>
          <p>
            <strong className="text-white">2. No Direct Certificate Issuance:</strong> Under World Taekwondo (WT) and World Taekwondo Headquarters (Kukkiwon) regulations, official Dan/Poom and Geup certificates are <span className="text-amber-300 font-bold underline">exclusively awarded</span> through formal testing conducted by certified Dan examiners and registered master instructors.
          </p>
          <p>
            <strong className="text-white">3. Authorized Examiners:</strong> In-person physical assessments, breaking tests (Gyeokpa), full contact sparring with PSS sensors, and physical Poomsae scrutiny must be conducted under Head of Team Mr. Ali Rizwan, Mr. Muhammad Faizan, Mr. Nauman, and Ms. Shumaila Nazeer or authorized Kukkiwon board panels.
          </p>
          <p>
            <strong className="text-white">4. Physical Training Safety:</strong> Always ensure you have adequate clearance and protective martial arts flooring before executing kicks, spins, or jumping movements.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-red-950/40 cursor-pointer transition-all"
          >
            I Understand & Agree (Charyot! Gyeongnye!)
          </button>
        </div>
      </div>
    </div>
  );
};
