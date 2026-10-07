import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  ReceiptText,
  Sliders,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Plus,
  X,
  Smartphone,
} from "lucide-react"

import { MobileContainer } from "./components/layout/MobileContainer"
import { AppHeader } from "./components/navigation/AppHeader"
import { MobileBottomNav, type NavItem } from "./components/navigation/MobileBottomNav"
import { TapButton } from "./components/ui/TapButton"
import { LivingCard } from "./components/ui/LivingCard"
import { InlineDataBar } from "./components/ui/InlineDataBar"
import { ScrollProgress } from "./components/ui/ScrollProgress"

// Data mock anggaran & alur demo
const BUDGET_ITEMS = [
  {
    id: "infra",
    title: "Server & Supabase Cloud",
    category: "Infrastruktur",
    used: 4800000,
    max: 6000000,
    color: "emerald" as const,
    notes: "Database Postgres, Auth, dan CDN hosting untuk 5 web app.",
  },
  {
    id: "ads",
    title: "Digital Growth & Ads",
    category: "Pemasaran",
    used: 7200000,
    max: 8000000,
    color: "amber" as const,
    notes: "Kampanye user acquisition dan Google/Meta ads.",
  },
  {
    id: "tools",
    title: "AI Tools & API Tokens",
    category: "Operasional",
    used: 2100000,
    max: 5000000,
    color: "indigo" as const,
    notes: "Gemini API, Claude, and background agent orchestrations.",
  },
  {
    id: "misc",
    title: "Domain & SSL Certificate",
    category: "Lainnya",
    used: 1750000,
    max: 2000000,
    color: "rose" as const,
    notes: "Pembelian domain .com & proteksi DNS cloud.",
  },
]

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Anggaran", icon: LayoutDashboard },
  { id: "activity", label: "Aktivitas", icon: ReceiptText, badge: "3" },
  { id: "settings", label: "Profil & Info", icon: Sliders },
]

export function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedItem, setSelectedItem] = useState<typeof BUDGET_ITEMS[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Format Rupiah
  const formatIDR = (val: number) => {
    return `Rp ${(val / 1000).toLocaleString("id-ID")}k`
  }

  return (
    <MobileContainer hasBottomNav={!selectedItem}>
      {/* Scroll Progress Bar at very top */}
      <ScrollProgress />

      {/* Header Utama atau Sub-Menu Header */}
      {selectedItem ? (
        <AppHeader
          title={selectedItem.title}
          subtitle={`Detail Anggaran • ${selectedItem.category}`}
          onBack={() => setSelectedItem(null)}
          backLabel="Kembali"
          rightAction={
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/30">
              Aktif
            </span>
          }
        />
      ) : (
        <AppHeader
          title={
            activeTab === "dashboard"
              ? "Dashboard Anggaran"
              : activeTab === "activity"
              ? "Riwayat Aktivitas"
              : "Standar Vibe Coder"
          }
          subtitle="Ard • Living & Tactile UI"
          rightAction={
            <TapButton
              size="sm"
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
              iconLeft={<Plus className="w-4 h-4 text-emerald-400" />}
            >
              Tambah
            </TapButton>
          }
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* JIKA MEMBUKA SUB-MENU / DETAIL ITEM */}
          {selectedItem ? (
            <motion.div
              key="detail-screen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <LivingCard variant="glow" className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                      {selectedItem.category}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {selectedItem.title}
                    </h2>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    ID: {selectedItem.id}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedItem.notes}
                </p>

                <div className="pt-2 border-t border-slate-800">
                  <InlineDataBar
                    label="Realisasi Penggunaan"
                    value={selectedItem.used}
                    max={selectedItem.max}
                    formatValue={formatIDR}
                    color={selectedItem.color}
                  />
                </div>
              </LivingCard>

              <LivingCard className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-200">
                  Navigasi Anti-Tersesat:
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Perhatikan tombol <strong>&larr; Kembali</strong> di pojok kiri atas. 
                  Pengguna tidak akan pernah bingung bagaimana cara kembali ke layar utama!
                </p>
                <div className="pt-2">
                  <TapButton
                    fullWidth
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                  >
                    Kembali ke Halaman Utama
                  </TapButton>
                </div>
              </LivingCard>
            </motion.div>
          ) : activeTab === "dashboard" ? (
            /* TAB 1: DASHBOARD ANGGARAN */
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Summary Card */}
              <LivingCard variant="glass" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Total Anggaran Terpakai
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" /> Sehat
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black tracking-tight text-white">
                    Rp 15.850k
                  </span>
                  <span className="text-xs text-slate-400">dari Rp 21.000k</span>
                </div>

                {/* Overall Progress Bar */}
                <div className="pt-1">
                  <InlineDataBar
                    label="Alokasi Keseluruhan"
                    value={15850000}
                    max={21000000}
                    formatValue={formatIDR}
                    color="emerald"
                  />
                </div>
              </LivingCard>

              {/* Section Header */}
              <div className="flex items-center justify-between pt-1">
                <h2 className="text-sm font-semibold text-slate-200">
                  Perbandingan Pos Anggaran
                </h2>
                <span className="text-[11px] text-slate-400">Ketuk untuk detail</span>
              </div>

              {/* List Item dengan Inline Data Bars & Taktil Click */}
              <div className="space-y-2.5">
                {BUDGET_ITEMS.map((item) => (
                  <LivingCard
                    key={item.id}
                    isInteractive
                    onClick={() => setSelectedItem(item)}
                    className="flex flex-col gap-2 p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-sm font-medium text-slate-100 truncate">
                          {item.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>

                    {/* Inline Data Bar Component */}
                    <InlineDataBar
                      label={item.category}
                      value={item.used}
                      max={item.max}
                      formatValue={formatIDR}
                      color={item.color}
                    />
                  </LivingCard>
                ))}
              </div>
            </motion.div>
          ) : activeTab === "activity" ? (
            /* TAB 2: AKTIVITAS */
            <motion.div
              key="activity-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="p-1">
                <h2 className="text-sm font-semibold text-slate-200">
                  Aktivitas Terkini
                </h2>
                <p className="text-xs text-slate-400">
                  Respons taktil saat menyentuh baris aktivitas.
                </p>
              </div>

              {[
                { title: "Pembayaran Supabase Pro", time: "2 jam yang lalu", amount: "-Rp 390k" },
                { title: "Top-up API Quota", time: "Kemarin", amount: "-Rp 750k" },
                { title: "Domain renewal ard.dev", time: "3 hari lalu", amount: "-Rp 210k" },
              ].map((act, i) => (
                <LivingCard key={i} isInteractive className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{act.title}</p>
                    <p className="text-xs text-slate-500">{act.time}</p>
                  </div>
                  <span className="text-xs font-semibold text-rose-400">
                    {act.amount}
                  </span>
                </LivingCard>
              ))}
            </motion.div>
          ) : (
            /* TAB 3: PROFIL & INFO STANDAR */
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3.5"
            >
              <LivingCard variant="glow" className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-white">Profil Ard Aktif</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Boilerplate ini sudah menerapkan aturan: <strong>Mobile-First</strong>, <strong>Living & Tactile UI</strong>, <strong>Navigasi Anti-Tersesat</strong>, dan <strong>Lean PRD</strong>.
                </p>
              </LivingCard>

              <LivingCard className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-200">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Tes di Layar Ponsel
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buka browser HP-mu pada WiFi yang sama, lalu akses alamat IP lokal dari terminal Vite (misal: <code>http://192.168.x.x:5173</code>).
                </p>
              </LivingCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Navigation (hanya jika bukan di sub-menu) */}
      {!selectedItem && (
        <MobileBottomNav
          items={NAV_ITEMS}
          activeId={activeTab}
          onChange={(tab) => {
            setSelectedItem(null)
            setActiveTab(tab)
          }}
        />
      )}

      {/* Modal Dialog / Bottom Sheet Contoh */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet Box */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative z-10 w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Tambah Pos Anggaran</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Ini adalah contoh lembar aksi cepat (*action sheet*) dengan tombol keluar `X` dan backdrop tap yang tidak membingungkan pengguna.
              </p>

              <div className="pt-2 flex gap-2">
                <TapButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </TapButton>
                <TapButton
                  variant="primary"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Simpan Data
                </TapButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MobileContainer>
  )
}

export default App
