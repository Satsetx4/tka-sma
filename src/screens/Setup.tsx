import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, Check, Timer } from "lucide-react";
import { MobileContainer } from "../components/layout/MobileContainer";
import { AppHeader } from "../components/navigation/AppHeader";
import { LivingCard } from "../components/ui/LivingCard";
import { TapButton } from "../components/ui/TapButton";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { SUBJECTS, SUBJECT_IDS, useTheme, type ExamMode, type SubjectId } from "../lib/store";

interface Props {
  mode: ExamMode;
  name: string;
  onBack: () => void;
  onBegin: (subjects: SubjectId[]) => void;
}

export const SetupScreen: React.FC<Props> = ({ mode, name, onBack, onBegin }) => {
  const { theme, toggle } = useTheme();
  const [picked, setPicked] = useState<SubjectId>("matematika");
  const isLatihan = mode === "latihan";

  return (
    <MobileContainer hasBottomNav={false}>
      <AppHeader
        title={isLatihan ? "Latihan per Mapel" : "Simulasi Full TKA"}
        subtitle={`${name} • ${isLatihan ? "pilih 1 mapel" : "3 mapel campur"}`}
        onBack={onBack}
        rightAction={<ThemeToggle theme={theme} onToggle={toggle} />}
      />
      <main className="flex-1 p-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 340, damping: 28 }}>
          <LivingCard variant="glow">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500">
                {isLatihan ? <BookOpenCheck className="w-5 h-5" /> : <Timer className="w-5 h-5" />}
              </span>
              <div>
                <h2 className="font-display font-bold text-slate-900 dark:text-white">
                  {isLatihan ? "20 soal • bahas langsung" : "60 soal • 90 menit"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isLatihan
                    ? "Tiap jawab langsung keluar benar/salah + pembahasan."
                    : "Countdown jalan, ada peta nomor + tandai ragu-ragu. Waktu habis = auto kumpul."}
                </p>
              </div>
            </div>
          </LivingCard>
        </motion.div>

        {isLatihan ? (
          <div className="space-y-3">
            {SUBJECT_IDS.map((id, i) => {
              const active = picked === id;
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}>
                  <LivingCard isInteractive onClick={() => setPicked(id)} variant={active ? "glow" : "default"}
                    className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${SUBJECTS[id].dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">{SUBJECTS[id].label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{SUBJECTS[id].desc}</p>
                    </div>
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 ${active ? "border-emerald-500 bg-emerald-500 text-white dark:text-slate-950" : "border-slate-300 dark:border-slate-600 text-transparent"}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                    </span>
                  </LivingCard>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {SUBJECT_IDS.map((id, i) => (
              <motion.div key={id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}>
                <LivingCard className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${SUBJECTS[id].dot}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{SUBJECTS[id].label}</p>
                    <p className="text-xs text-slate-500">20 soal acak posisi</p>
                  </div>
                </LivingCard>
              </motion.div>
            ))}
          </div>
        )}

        <TapButton size="lg" fullWidth onClick={() => onBegin(isLatihan ? [picked] : [...SUBJECT_IDS])}>
          {isLatihan ? `Gas latihan ${SUBJECTS[picked].label}` : "Masuk ruang simulasi"}
        </TapButton>
        <p className="text-center text-[11px] text-slate-500">Soal diacak tiap mulai • keluar tengah jalan = hangus</p>
      </main>
    </MobileContainer>
  );
};
