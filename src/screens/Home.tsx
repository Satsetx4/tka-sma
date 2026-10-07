import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, ChevronRight, History, Home, Timer, Trophy, User, Medal } from "lucide-react";
import { MobileContainer } from "../components/layout/MobileContainer";
import { AppHeader } from "../components/navigation/AppHeader";
import { MobileBottomNav } from "../components/navigation/MobileBottomNav";
import { LivingCard } from "../components/ui/LivingCard";
import { TapButton } from "../components/ui/TapButton";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { CountUp } from "../components/ui/CountUp";
import { SUBJECTS, SUBJECT_IDS, store, useTheme, type ExamMode } from "../lib/store";

interface Props {
  onStart: (mode: ExamMode, name: string) => void;
  onHistory: () => void;
  onHome: () => void;
}

const spring = { type: "spring" as const, stiffness: 340, damping: 28 };

export const HomeScreen: React.FC<Props> = ({ onStart, onHistory, onHome }) => {
  const { theme, toggle } = useTheme();
  const [name, setName] = useState(() => store.profile.load().name);
  const attempts = store.attempts.load();
  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0);
  const simCount = attempts.filter((a) => a.mode === "simulasi").length;

  const start = (mode: ExamMode) => {
    const clean = name.trim();
    store.profile.save({ name: clean });
    onStart(mode, clean || "Pejuang TKA");
  };

  return (
    <MobileContainer>
      <ScrollProgress />
      <AppHeader
        title="TKA SMA"
        subtitle="Latihan & Simulasi • Kelas 12"
        rightAction={<ThemeToggle theme={theme} onToggle={toggle} />}
      />
      <main className="flex-1 p-4 space-y-4">
        {/* Hero cockpit */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <LivingCard variant="glow" className="relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
            <div className="absolute -right-2 -bottom-10 w-28 h-28 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Cockpit Ujian Presisi
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight mt-1 text-slate-900 dark:text-white">
              Gas latihan TKA,<br />nilai auto ke-track.
            </h2>
            <p className="text-sm mt-1.5 text-slate-600 dark:text-slate-400">
              3 mapel wajib • 60 soal + pembahasan • timer simulasi 90 menit. Tanpa login.
            </p>
            {/* Nama */}
            <label htmlFor="nama" className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5" /> Nama kamu (buat nandain nilai)
            </label>
            <input
              id="nama" value={name} onChange={(e) => setName(e.target.value)} maxLength={30}
              placeholder="cth: Ard"
              className="mt-1.5 w-full h-11 px-3.5 rounded-xl text-sm outline-none border bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
            />
          </LivingCard>
        </motion.div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 gap-3">
          {(
            [
              { mode: "latihan" as ExamMode, icon: BookOpenCheck, title: "Latihan per Mapel", desc: "20 soal / mapel • kunci + bahas langsung tiap jawab", cta: "Pilih mapel & gas" },
              { mode: "simulasi" as ExamMode, icon: Timer, title: "Simulasi Full TKA", desc: "60 soal campur 3 mapel • countdown 90:00 • peta nomor", cta: "Masuk ruang simulasi" },
            ]
          ).map((m, i) => (
            <motion.div key={m.mode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.08 + i * 0.07 }}>
              <LivingCard isInteractive onClick={() => start(m.mode)}>
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0">
                    <m.icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-slate-900 dark:text-white">{m.title}</h3>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">{m.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 text-slate-400" />
                </div>
              </LivingCard>
            </motion.div>
          ))}
        </div>

        {/* Mapel strip */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.22 }}>
          <LivingCard>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">3 Mapel Wajib</p>
            <div className="mt-2.5 space-y-2.5">
              {SUBJECT_IDS.map((id) => (
                <div key={id} className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${SUBJECTS[id].dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{SUBJECTS[id].label}</p>
                    <p className="text-[11px] truncate text-slate-500">{SUBJECTS[id].desc}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400">20 soal</span>
                </div>
              ))}
            </div>
          </LivingCard>
        </motion.div>

        {/* Statistik */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.28 }}>
          <LivingCard variant="glass">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white"><CountUp to={attempts.length} /></p>
                <p className="text-[11px] text-slate-500">Percobaan</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400"><CountUp to={best} /></p>
                <p className="text-[11px] text-slate-500">Skor terbaik</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white"><CountUp to={simCount} /></p>
                <p className="text-[11px] text-slate-500">Simulasi</p>
              </div>
            </div>
            {attempts.length > 0 && (
              <TapButton variant="outline" fullWidth className="mt-3" onClick={onHistory}>
                <History className="w-4 h-4" /> Lihat riwayat nilai
              </TapButton>
            )}
            {best >= 85 && (
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Medal className="w-4 h-4" /> Udah level siap tempur TKA beneran!
              </p>
            )}
            {attempts.length === 0 && (
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Trophy className="w-4 h-4" /> Belum ada nilai — gas latihan pertamamu.
              </p>
            )}
          </LivingCard>
        </motion.div>
      </main>
      <MobileBottomNav
        items={[
          { id: "home", label: "Beranda", icon: Home },
          { id: "history", label: "Riwayat", icon: History },
        ]}
        activeId="home"
        onChange={(id) => (id === "history" ? onHistory() : onHome())}
      />
    </MobileContainer>
  );
};
