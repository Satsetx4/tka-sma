import React from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  badge?: string | number
}

interface MobileBottomNavProps {
  items: NavItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

/**
 * MobileBottomNav (Persistent 1-Tap Home & Thumb Navigation)
 * Menampilkan tab navigasi bawah dengan animasi pill slider mengalir (layoutId)
 * dan area sentuh empuk yang nyaman dioperasikan satu tangan.
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  activeId,
  onChange,
  className,
}) => {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 py-2 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 shadow-lg shadow-black/40",
        className
      )}
    >
      <ul className="flex items-center justify-around gap-1 p-0 m-0 list-none">
        {items.map((item) => {
          const isActive = activeId === item.id
          const Icon = item.icon

          return (
            <li key={item.id} className="flex-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange(item.id)}
                className={cn(
                  "relative w-full py-2 px-1 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition-colors focus:outline-none",
                  isActive ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active Pill Indicator (Fluid Transition) */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActivePill"
                    className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="relative z-10 text-[11px] tracking-tight">
                  {item.label}
                </span>
              </motion.button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
