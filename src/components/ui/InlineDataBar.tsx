import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface InlineDataBarProps {
  label: string
  sublabel?: string
  value: number // Nilai aktual
  max: number // Nilai maksimal pembanding (misal total anggaran)
  formatValue?: (val: number) => string
  color?: "emerald" | "indigo" | "amber" | "rose" | "auto"
  showPercentage?: boolean
  className?: string
}

/**
 * InlineDataBar (Table Data Bar / Sparkbar)
 * Batang mini proporsional untuk membandingkan alokasi anggaran atau data secara instan.
 * Dilengkapi animasi in-view (mengisi halus saat di-scroll masuk layar).
 */
export const InlineDataBar: React.FC<InlineDataBarProps> = ({
  label,
  sublabel,
  value,
  max,
  formatValue = (v) => v.toLocaleString("id-ID"),
  color = "emerald",
  showPercentage = true,
  className,
}) => {
  const percentage = Math.min(Math.round((value / (max || 1)) * 100), 100)

  // Resolving color (auto: warning/danger if budget exceeds 80% or 95%)
  const resolvedColor =
    color === "auto"
      ? percentage > 90
        ? "rose"
        : percentage > 70
        ? "amber"
        : "emerald"
      : color

  const colorVariants = {
    emerald: {
      bar: "bg-emerald-400",
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
    },
    indigo: {
      bar: "bg-indigo-400",
      bg: "bg-indigo-500/15",
      text: "text-indigo-400",
    },
    amber: {
      bar: "bg-amber-400",
      bg: "bg-amber-500/15",
      text: "text-amber-400",
    },
    rose: {
      bar: "bg-rose-400",
      bg: "bg-rose-500/15",
      text: "text-rose-400",
    },
  }

  const activeTheme = colorVariants[resolvedColor]

  return (
    <div className={cn("w-full space-y-1.5 py-1", className)}>
      {/* Top Text Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-medium text-slate-200 truncate">{label}</span>
          {sublabel && (
            <span className="text-[11px] text-slate-500 truncate">
              {sublabel}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 shrink-0">
          <span className="font-semibold text-slate-100">
            {formatValue(value)}
          </span>
          {showPercentage && (
            <span className={cn("text-[11px] font-medium", activeTheme.text)}>
              {percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Mini Progress Track & Animated Bar */}
      <div className="relative w-full h-2 bg-slate-800/90 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.8,
          }}
          className={cn("h-full rounded-full", activeTheme.bar)}
        />
      </div>
    </div>
  )
}
