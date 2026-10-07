import React, { useState } from "react";
import { motion } from "framer-motion";
import { History, Home, Timer, BookOpenCheck, Trash2, Trophy } from "lucide-react";
import { MobileContainer } from "../components/layout/MobileContainer";
import { AppHeader } from "../components/navigation/AppHeader";
import { MobileBottomNav } from "../components/navigation/MobileBottomNav";
import { LivingCard } from "../components/ui/LivingCard";
import { TapButton } from "../components/ui/TapButton";
import { ConfirmSheet } from "../components/ui/ConfirmSheet";
import { SUBJECTS, formatClock, store } from "../lib/store";

interface Props {
  onHome: () => void;
  onHistory: () => void;
}

export const HistoryScreen: React.FC<Props> = ({ onHome, onHistory }) => {
  const [items, setItems] = useState(() => store.attempts.load());
  const [askClear, setAskClear] = useState(false);
  const best = items.reduce((m, a) => Math.max(m, a.score), 0);

  const clear = () => {
    store.attempts.clear();
    setItems([]);
    setAskClear(false);
  };

  return (
    <MobileContainer>
      <AppHeader title="Riwayat Nilai" subtitle={items.length ? `${items.length} percobaan tersimpan di HP` : "Belum ada percobaan"}
        onBack={onHome} backLabel="Beranda"
        rightAction={items.length > 0 ? (
          <button onClick={() => setAskClear(true)} aria-label="Hapus riwayat"
            className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-rose-500 cursor-pointer hover:bg-rose-500/10">
            <Trash2 className="w-5 h-5" />
          </button>
        ) : undefined} />
      <main className="flex-1 p-4 space-y-3">
        {items.length === 0 ? (
          <LivingCard variant="glow" className="text-center py-8">
            <History className="w-10 h-10 mx-auto text-slate-400" />
            <h2 className="mt-2 font-display font-bold text-slate-900 dark:text-white">Riwayat masih kosong</h2>
            <p className="mt-1 text-sm text-slate-500">Gas latihan pertama, nilaimu ke-track otomatis di sini.</p>
            <TapButton className="mt-4" onClick={onHome}>
              <Home className="w-4 h-4" /> Ke Beranda
            </TapButton>
          </LivingCard>
        ) : (
          <>
            <LivingCard variant="glass">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Skor terbaikmu <span className="font-display font-bold text-lg text-slate-900 dark:text-white">{best}</span>
                </p>
              </div>
            </LivingCard>
            {items.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}>
                <LivingCard>
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl shrink-0 ${a.mode === "simulasi" ? "bg-sky-500/15 text-sky-500" : "bg-emerald-500/15 text-emerald-500"}`}>
                      {a.mode === "simulasi" ? <Timer className="w-4 h-4" /> : <BookOpenCheck className="w-4 h-4" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                        {a.mode === "simulasi" ? "Simulasi Full" : "Latihan"} • {a.correct}/{a.total} benar
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(a.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        {" • "}{a.name}{" • "}{formatClock(a.durationSec)}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {Object.entries(a.perSubject).map(([sid, s]) => `${SUBJECTS[sid as keyof typeof SUBJECTS]?.short ?? sid} ${s.correct}/${s.total}`).join("  •  ")}
                      </p>
                    </div>
                    <span className={`font-display text-2xl font-bold shrink-0 tabular-nums ${a.score >= 70 ? "text-emerald-600 dark:text-emerald-400" : a.score >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                      {a.score}
                    </span>
                  </div>
                </LivingCard>
              </motion.div>
            ))}
          </>
        )}
      </main>
      <MobileBottomNav
        items={[
          { id: "home", label: "Beranda", icon: Home },
          { id: "history", label: "Riwayat", icon: History },
        ]}
        activeId="history"
        onChange={(id) => (id === "home" ? onHome() : onHistory())}
      />
      <ConfirmSheet open={askClear} danger title="Hapus semua riwayat?"
        message="50 nilai terakhir yang tersimpan di HP ini hilang permanen. Yakin?"
        confirmLabel="Ya, hapus" onConfirm={clear} onClose={() => setAskClear(false)} />
    </MobileContainer>
  );
};
