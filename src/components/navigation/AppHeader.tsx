import React from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { cn } from "../../lib/utils"

interface AppHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  backLabel?: string
  rightAction?: React.ReactNode
  className?: string
}

/**
 * AppHeader (Navigasi Anti-Tersesat)
 * Menyediakan wayfinding jelas dan tombol kembali eksplisit di pojok kiri atas
 * dengan ukuran area sentuh jempol (minimal 44x44px).
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = "Kembali",
  rightAction,
  className,
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full px-4 py-3 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between transition-all",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="flex items-center gap-1.5 p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 active:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            aria-label={backLabel}
            title={backLabel}
          >
            <ArrowLeft className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">
              {backLabel}
            </span>
          </motion.button>
        )}

        <div className="flex flex-col min-w-0">
          <h1 className="text-base font-semibold text-slate-100 truncate tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center gap-2 shrink-0">{rightAction}</div>
      )}
    </header>
  )
}
