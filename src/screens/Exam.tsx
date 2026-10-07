import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flag, LayoutGrid, Lightbulb, Timer, X } from "lucide-react";
import { MobileContainer } from "../components/layout/MobileContainer";
import { AppHeader } from "../components/navigation/AppHeader";
import { LivingCard } from "../components/ui/LivingCard";
import { TapButton } from "../components/ui/TapButton";
import { ConfirmSheet } from "../components/ui/ConfirmSheet";
import { SUBJECTS, formatClock, type ExamMode, type Question } from "../lib/store";

interface Props {
  questions: Question[];
  mode: ExamMode;
  name: string;
  onFinish: (answers: (number | null)[], flagged: boolean[], elapsedSec: number) => void;
  onExit: () => void;
}

const LETTERS = ["A", "B", "C", "D", "E"];
const SIM_SECONDS = 90 * 60;

export const ExamScreen: React.FC<Props> = ({ questions, mode, name, onFinish, onExit }) => {
  const total = questions.length;
  const isSim = mode === "simulasi";
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(() => Array(total).fill(false));
  const [left, setLeft] = useState(SIM_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [askSubmit, setAskSubmit] = useState(false);
  const [askExit, setAskExit] = useState(false);
  const done = useRef(false);

  const finish = (a: (number | null)[], f: boolean[], e: number) => {
    if (done.current) return;
    done.current = true;
    onFinish(a, f, e);
  };

  useEffect(() => {
    if (!isSim) {
      const t = setInterval(() => setElapsed((s) => s + 1), 1000);
      return () => clearInterval(t);
    }
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setTimeout(() => {
            const e = SIM_SECONDS;
            finish(answersRef.current, flaggedRef.current, e);
          }, 50);
          return 0;
        }
        return s - 1;
      });
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSim]);

  const answersRef = useRef(answers);
  const flaggedRef = useRef(flagged);
  answersRef.current = answers;
  flaggedRef.current = flagged;

  if (total === 0) {
    return (
      <MobileContainer hasBottomNav={false}>
        <AppHeader title="Soal belum siap" onBack={onExit} />
        <main className="flex-1 p-4">
          <LivingCard variant="glow">
            <h2 className="font-display font-bold text-slate-900 dark:text-white">Bank soal lagi dimuat…</h2>
            <p className="text-sm text-slate-500 mt-1">Balik dulu, coba lagi sebentar.</p>
            <TapButton className="mt-3" onClick={onExit}>Kembali ke Beranda</TapButton>
          </LivingCard>
        </main>
      </MobileContainer>
    );
  }

  const q = questions[idx];
  const picked = answers[idx];
  const revealed = !isSim && picked !== null; // latihan: bahas langsung
  const answeredCount = answers.filter((a) => a !== null).length;
  const flaggedCount = flagged.filter(Boolean).length;
  const urgent = isSim && left < 5 * 60;

  const choose = (opt: number) => {
    if (isSim || answers[idx] === null) {
      setAnswers((prev) => {
        const next = [...prev];
        next[idx] = opt;
        return next;
      });
    }
  };

  const go = (d: number) => setIdx((i) => Math.min(Math.max(i + d, 0), total - 1));

  const optStyle = (opt: number): string => {
    const base = "border-slate-300 dark:border-slate-700";
    if (picked === opt) {
      if (!revealed) return "border-emerald-500 bg-emerald-500/10";
      if (opt === q.answer) return "border-emerald-500 bg-emerald-500/15";
      return "border-rose-500 bg-rose-500/10";
    }
    if (revealed && opt === q.answer) return "border-emerald-500 bg-emerald-500/10";
    return base;
  };

  return (
    <MobileContainer hasBottomNav={false}>
      <AppHeader
        title={isSim ? "Simulasi TKA" : `Latihan ${SUBJECTS[q.subject].label}`}
        subtitle={`${name} • Soal ${idx + 1}/${total}`}
        onBack={() => setAskExit(true)}
        rightAction={
          <div className={`flex items-center gap-1.5 px-2.5 h-11 rounded-xl border text-sm font-bold tabular-nums
            ${urgent ? "border-rose-500/50 text-rose-500 bg-rose-500/10 animate-pulse"
              : "border-slate-300/70 text-slate-700 dark:border-slate-700 dark:text-slate-200"}`}>
            <Timer className="w-4 h-4" />
            {formatClock(isSim ? left : elapsed)}
          </div>
        }
      />
      {/* progress */}
      <div className="h-1 bg-slate-200 dark:bg-slate-800">
        <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
          animate={{ width: `${((idx + 1) / total) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 28 }} />
      </div>

      <main className="flex-1 p-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div key={q.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}>
            <LivingCard>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300`}>
                  {SUBJECTS[q.subject].short}
                </span>
                <span className="text-[11px] text-slate-500">{q.topic}</span>
                {flagged[idx] && (
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <Flag className="w-3 h-3" /> Ragu
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-[15px] leading-relaxed whitespace-pre-line text-slate-900 dark:text-slate-100">{q.question}</p>
            </LivingCard>

            <div className="mt-3 space-y-2">
              {q.options.map((opt, o) => (
                <motion.button key={o} whileTap={{ scale: 0.98 }} onClick={() => choose(o)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-colors cursor-pointer bg-white dark:bg-slate-900/70 ${optStyle(o)}`}>
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0
                    ${picked === o ? "bg-emerald-500 text-white dark:text-slate-950" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {LETTERS[o]}
                  </span>
                  <span className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{opt}</span>
                </motion.button>
              ))}
            </div>

            {revealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <LivingCard variant={picked === q.answer ? "glow" : "default"} className="mt-3 border-2">
                  <p className={`flex items-center gap-1.5 text-sm font-bold ${picked === q.answer ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                    <Lightbulb className="w-4 h-4" />
                    {picked === q.answer ? "Mantul, bener!" : `Kurang tepat — kunci: ${LETTERS[q.answer]}`}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{q.explanation}</p>
                </LivingCard>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* nav bawah */}
        <div className="flex items-center gap-2 pt-1">
          <TapButton variant="secondary" onClick={() => go(-1)} disabled={idx === 0} aria-label="Soal sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </TapButton>
          <TapButton variant={flagged[idx] ? "danger" : "outline"} onClick={() =>
            setFlagged((prev) => { const n = [...prev]; n[idx] = !n[idx]; return n; })
          } aria-label="Tandai ragu-ragu" title="Tandai ragu-ragu">
            <Flag className="w-4 h-4" /> {flagged[idx] ? "Ragu" : "Tandai"}
          </TapButton>
          <TapButton variant="secondary" onClick={() => setShowMap(true)} aria-label="Peta nomor">
            <LayoutGrid className="w-4 h-4" /> {answeredCount}/{total}
          </TapButton>
          {idx < total - 1 ? (
            <TapButton className="flex-1" onClick={() => go(1)}>
              Lanjut <ChevronRight className="w-4 h-4" />
            </TapButton>
          ) : (
            <TapButton className="flex-1" onClick={() => setAskSubmit(true)}>Kumpulkan</TapButton>
          )}
        </div>
      </main>

      {/* Peta nomor */}
      <AnimatePresence>
        {showMap && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowMap(false)} />
            <motion.div initial={{ y: 160 }} animate={{ y: 0 }} exit={{ y: 160 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative w-full max-w-md rounded-t-3xl p-5 pb-8 border-t bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-slate-900 dark:text-white">Peta Nomor</h3>
                <button onClick={() => setShowMap(false)} aria-label="Tutup peta"
                  className="p-2 min-w-[44px] min-h-[44px] rounded-xl text-slate-500 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="mt-1 flex gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Dijawab</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded border-2 border-dashed border-slate-400" /> Kosong</span>
                <span className="flex items-center gap-1"><Flag className="w-3 h-3 text-amber-500" /> Ragu</span>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {questions.map((qq, i) => (
                  <motion.button key={qq.id} whileTap={{ scale: 0.9 }}
                    onClick={() => { setIdx(i); setShowMap(false); }}
                    className={`relative h-11 rounded-xl text-sm font-bold border-2 cursor-pointer
                      ${i === idx ? "border-sky-500" : "border-transparent"}
                      ${answers[i] !== null ? "bg-emerald-500 text-white dark:text-slate-950" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {i + 1}
                    {flagged[i] && <Flag className="absolute top-0.5 right-0.5 w-3 h-3 text-amber-400" />}
                  </motion.button>
                ))}
              </div>
              <TapButton fullWidth className="mt-4" onClick={() => { setShowMap(false); setAskSubmit(true); }}>
                Kumpulkan jawaban
              </TapButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmSheet open={askSubmit} title="Kumpulkan jawaban?"
        message={`${answeredCount}/${total} dijawab${flaggedCount ? `, ${flaggedCount} ragu-ragu` : ""}${total - answeredCount ? `, ${total - answeredCount} kosong (dianggap salah)` : ""}. Yakin kumpul sekarang?`}
        confirmLabel="Ya, kumpulkan"
        onConfirm={() => finish(answers, flagged, isSim ? SIM_SECONDS - left : elapsed)}
        onClose={() => setAskSubmit(false)} />

      <ConfirmSheet open={askExit} danger title="Keluar? Nilai hangus"
        message="Progres ujian ini hilang dan nggak masuk riwayat. Yakin keluar?"
        confirmLabel="Ya, keluar" onConfirm={onExit} onClose={() => setAskExit(false)} />
    </MobileContainer>
  );
};
