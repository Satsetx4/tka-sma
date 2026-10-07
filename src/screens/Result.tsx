import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Lightbulb, Repeat, XCircle } from "lucide-react";
import { MobileContainer } from "../components/layout/MobileContainer";
import { AppHeader } from "../components/navigation/AppHeader";
import { LivingCard } from "../components/ui/LivingCard";
import { TapButton } from "../components/ui/TapButton";
import { InlineDataBar } from "../components/ui/InlineDataBar";
import { CountUp } from "../components/ui/CountUp";
import { SUBJECTS, formatClock, gradeOf, type Attempt, type Question } from "../lib/store";

interface Props {
  attempt: Attempt;
  questions: Question[];
  answers: (number | null)[];
  onRetry: () => void;
  onHome: () => void;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export const ResultScreen: React.FC<Props> = ({ attempt, questions, answers, onRetry, onHome }) => {
  const [filter, setFilter] = useState<"semua" | "salah">("semua");
  const grade = gradeOf(attempt.score);
  const wrongIdx = questions.map((q, i) => (answers[i] !== q.answer ? i : -1)).filter((i) => i >= 0);
  const shown = filter === "salah" ? wrongIdx : questions.map((_, i) => i);
  const subjColor = (id: string) =>
    id === "matematika" ? "emerald" as const : id === "bindo" ? "amber" as const : "sky" as const;

  return (
    <MobileContainer hasBottomNav={false}>
      <AppHeader
        title={attempt.mode === "simulasi" ? "Hasil Simulasi" : "Hasil Latihan"}
        subtitle={`${attempt.name} • ${new Date(attempt.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
        onBack={onHome} backLabel="Beranda"
      />
      <main className="flex-1 p-4 space-y-4">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
          <LivingCard variant="glow" className="text-center relative overflow-hidden">
            <div className="absolute left-1/2 -top-14 -translate-x-1/2 w-52 h-28 bg-emerald-500/20 blur-3xl pointer-events-none" />
            <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">{grade.label}</p>
            <p className="font-display font-bold leading-none tabular-nums text-6xl text-slate-900 dark:text-white">
              <CountUp to={attempt.score} />
            </p>
            <p className="text-xs mt-1 text-slate-500">{grade.hint}</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg font-semibold bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {attempt.correct}/{attempt.total} benar
              </span>
              <span className="px-2.5 py-1 rounded-lg font-semibold bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {formatClock(attempt.durationSec)}
              </span>
              <span className="px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {attempt.mode === "simulasi" ? "Simulasi" : "Latihan"}
              </span>
            </div>
          </LivingCard>
        </motion.div>

        <LivingCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bedah per mapel</p>
          <div className="mt-1">
            {Object.entries(attempt.perSubject).map(([sid, s]) => (
              <InlineDataBar key={sid} label={SUBJECTS[sid as keyof typeof SUBJECTS]?.label ?? sid}
                sublabel={`${s.correct}/${s.total} benar`} value={s.correct} max={s.total} color={subjColor(sid)} />
            ))}
          </div>
        </LivingCard>

        <div className="flex gap-2">
          <TapButton size="lg" fullWidth onClick={onRetry}>
            <Repeat className="w-4 h-4" /> Ulangi
          </TapButton>
          <TapButton size="lg" fullWidth variant="secondary" onClick={onHome}>
            <Home className="w-4 h-4" /> Beranda
          </TapButton>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Pembahasan</h3>
            <div className="flex p-1 rounded-xl gap-1 bg-slate-200/70 dark:bg-slate-800/80">
              {(["semua", "salah"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`relative px-3 h-9 min-h-[36px] rounded-lg text-xs font-semibold cursor-pointer ${filter === f ? "text-white dark:text-slate-950" : "text-slate-500"}`}>
                  {filter === f && (
                    <motion.span layoutId="reviewFilter" className="absolute inset-0 bg-emerald-600 dark:bg-emerald-500 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10">{f === "semua" ? `Semua (${questions.length})` : `Salah (${wrongIdx.length})`}</span>
                </button>
              ))}
            </div>
          </div>

          {filter === "salah" && wrongIdx.length === 0 && (
            <LivingCard variant="glow" className="mt-3 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="mt-1.5 font-semibold text-slate-900 dark:text-white">Sempurna, nggak ada yang salah!</p>
            </LivingCard>
          )}

          <div className="mt-3 space-y-3">
            {shown.map((qi, n) => {
              const q = questions[qi];
              const user = answers[qi];
              const ok = user === q.answer;
              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.25 }}>
                  <LivingCard className={`border-2 ${ok ? "border-emerald-500/30" : "border-rose-500/30"}`}>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-bold text-slate-500">#{filter === "semua" ? qi + 1 : n + 1}</span>
                      <span className="text-slate-500">{SUBJECTS[q.subject].label} • {q.topic}</span>
                      <span className={`ml-auto flex items-center gap-1 font-bold ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                        {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {ok ? "Benar" : user === null ? "Kosong" : "Salah"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-slate-900 dark:text-slate-100">{q.question}</p>
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((opt, o) => {
                        const isKey = o === q.answer;
                        const isUserWrong = o === user && !ok;
                        return (
                          <div key={o} className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-[13px] leading-relaxed
                            ${isKey ? "bg-emerald-500/12 text-slate-900 dark:text-slate-100 font-medium" : isUserWrong ? "bg-rose-500/12 text-slate-800 dark:text-slate-200 line-through" : "text-slate-500 dark:text-slate-400"}`}>
                            <span className="font-bold shrink-0">{LETTERS[o]}.</span>
                            <span>{opt}</span>
                            {isKey && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0 mt-0.5 text-emerald-500" />}
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      {q.explanation}
                    </p>
                  </LivingCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        <TapButton variant="secondary" fullWidth onClick={onHome}>
          <Home className="w-4 h-4" /> Kembali ke Beranda
        </TapButton>
      </main>
    </MobileContainer>
  );
};
