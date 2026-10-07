"use client";

// Port Home Next.js (P0.4) — parity UX dengan prototipe Vite (src/screens/Home.tsx).
// Hero + input nama + kartu mode + strip mapel + statistik + bedah per mapel.
// Tombol yang butuh rute/bank soal SENGAJA non-fungsional (disabled + tooltip):
// navigasi ujian, skoring, dan bank soal adalah wewenang Fase 6 — file ini TIDAK
// mengimpor QUESTIONS dan TIDAK menulis logika ujian/skoring.
import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  ChevronRight,
  History,
  Home as HomeIcon,
  Medal,
  Timer,
  Trophy,
  User,
} from "lucide-react";
import { MobileContainer } from "../components/layout/MobileContainer";
import { AppHeader } from "../components/navigation/AppHeader";
import { MobileBottomNav } from "../components/navigation/MobileBottomNav";
import { LivingCard } from "../components/ui/LivingCard";
import { TapButton } from "../components/ui/TapButton";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { CountUp } from "../components/ui/CountUp";
import { InlineDataBar } from "../components/ui/InlineDataBar";
import { useTheme } from "../components/theme/theme-provider";
import {
  SUBJECTS,
  SUBJECT_IDS,
  gradeOf,
  scoreOf,
  store,
  type Attempt,
  type ExamMode,
} from "../lib/store";

const spring = { type: "spring" as const, stiffness: 340, damping: 28 };

const MODES: { mode: ExamMode; icon: typeof BookOpenCheck; title: string; desc: string; cta: string }[] = [
  {
    mode: "latihan",
    icon: BookOpenCheck,
    title: "Latihan per Mapel",
    desc: "20 soal / mapel • kunci + bahas langsung tiap jawab",
    cta: "Pilih mapel & gas",
  },
  {
    mode: "simulasi",
    icon: Timer,
    title: "Simulasi Full TKA",
    desc: "60 soal campur 3 mapel • countdown 90:00 • peta nomor",
    cta: "Masuk ruang simulasi",
  },
];

// Tooltip baku untuk interaksi yang sengaja non-fungsional di P0.4.
const SOON_TITLE = "Segera hadir — navigasi ujian dibuka di fase berikutnya";

/* ---- Cermin baca localStorage yang aman-hidrasi ----
   Prerender server + hydration memakai snapshot kosong (cocok dengan HTML
   server), data perangkat dibaca setelahnya — tanpa setState di dalam efek. */

// TODO-P6: attempts SEMENTARA dari localStorage tka-sma:attempts:v1 — diganti Neon.
let cacheAttemptsJson: string | null = null;
let cacheAttempts: Attempt[] = [];
function bacaAttempts(): Attempt[] {
  const daftar = store.attempts.load();
  const json = JSON.stringify(daftar);
  if (json !== cacheAttemptsJson) {
    cacheAttemptsJson = json;
    cacheAttempts = daftar;
  }
  return cacheAttempts;
}
// Snapshot server stabil (referensi cache) — wajib agar React tidak
// menganggap snapshot berubah tiap render (infinite loop).
const SNAPSHOT_KOSONG_ATTEMPTS: Attempt[] = [];
function snapshotKosongAttempts(): Attempt[] {
  return SNAPSHOT_KOSONG_ATTEMPTS;
}

let cacheNama = "";
function bacaNamaTersimpan(): string {
  const nama = store.profile.load().name;
  if (nama !== cacheNama) cacheNama = nama;
  return cacheNama;
}
function snapshotKosongNama(): string {
  return "";
}

function langgananPerubahan(beriTahu: () => void): () => void {
  window.addEventListener("storage", beriTahu);
  return () => window.removeEventListener("storage", beriTahu);
}

export default function HomePage() {
  const { theme, toggle } = useTheme();
  // Data perangkat via external store: prerender + hydration memakai snapshot
  // kosong (cocok dengan HTML server), lalu sinkron tanpa setState di efek.
  const attempts = useSyncExternalStore(
    langgananPerubahan,
    bacaAttempts,
    snapshotKosongAttempts,
  );
  const namaTersimpan = useSyncExternalStore(
    langgananPerubahan,
    bacaNamaTersimpan,
    snapshotKosongNama,
  );
  // Draf ketikan (derivasi saat render; disimpan ke perangkat tiap berubah).
  const [draft, setDraft] = useState<string | null>(null);
  const name = draft ?? namaTersimpan;

  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0);
  const simCount = attempts.filter((a) => a.mode === "simulasi").length;
  const grade = gradeOf(best);

  // Bedah per mapel: agregat tampilan dari attempt tersimpan (bukan skoring ujian).
  const perSubject = SUBJECT_IDS.map((id) => {
    let correct = 0;
    let total = 0;
    for (const a of attempts) {
      const s = a.perSubject[id];
      if (s) {
        correct += s.correct;
        total += s.total;
      }
    }
    return { id, correct, total, pct: scoreOf(correct, total) };
  });

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
            <h1 className="font-display text-2xl font-bold leading-tight mt-1 text-slate-900 dark:text-white">
              Gas latihan TKA,<br />nilai auto ke-track.
            </h1>
            <p className="text-sm mt-1.5 text-slate-600 dark:text-slate-400">
              3 mapel wajib • 60 soal + pembahasan • timer simulasi 90 menit. Tanpa login.
            </p>
            {/* Nama — tersimpan di perangkat */}
            <label htmlFor="nama" className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5" /> Nama kamu (buat nandain nilai)
            </label>
            <input
              id="nama" value={name} maxLength={30}
              placeholder="cth: Ard"
              onChange={(e) => {
                setDraft(e.target.value);
                store.profile.save({ name: e.target.value.trim() });
              }}
              className="mt-1.5 w-full h-11 px-3.5 rounded-xl text-sm outline-none border bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
            />
          </LivingCard>
        </motion.div>

        {/* Kartu mode — tombol SENGAJA non-fungsional sampai rute ujian ada (Fase 6) */}
        <div className="grid grid-cols-1 gap-3">
          {MODES.map((m, i) => (
            <motion.div key={m.mode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.08 + i * 0.07 }}>
              <LivingCard title={SOON_TITLE}>
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
                <TapButton variant="secondary" fullWidth disabled title={SOON_TITLE} className="mt-3">
                  {m.cta} • Segera hadir
                </TapButton>
              </LivingCard>
            </motion.div>
          ))}
        </div>

        {/* Strip mapel */}
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
              <TapButton variant="outline" fullWidth disabled title={SOON_TITLE} className="mt-3">
                <History className="w-4 h-4" /> Lihat riwayat nilai • Segera hadir
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

        {/* Bedah per mapel + grade label */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.34 }}>
          <LivingCard variant="bordered">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bedah per Mapel</p>
            {attempts.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">
                Belum ada data — kerjakan latihan dulu, bedah skormu muncul di sini.
              </p>
            ) : (
              <div className="mt-1">
                {perSubject.map((s) => (
                  <InlineDataBar
                    key={s.id}
                    label={SUBJECTS[s.id].label}
                    sublabel={s.total > 0 ? `${s.correct}/${s.total} benar • ${gradeOf(s.pct).label}` : "Belum ada data"}
                    value={s.correct}
                    max={Math.max(s.total, 1)}
                  />
                ))}
                <p className="mt-2 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
                  Grade kamu: {grade.label} — {grade.hint}
                </p>
              </div>
            )}
          </LivingCard>
        </motion.div>
      </main>
      <MobileBottomNav
        items={[
          { id: "home", label: "Beranda", icon: HomeIcon },
          { id: "history", label: "Riwayat", icon: History },
        ]}
        activeId="home"
        // TODO-Fase-6: tab Riwayat baru navigasi setelah rute /riwayat ada; kini sengaja no-op.
        onChange={() => undefined}
      />
    </MobileContainer>
  );
}
