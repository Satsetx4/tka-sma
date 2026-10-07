import React from "react"
import { cn } from "../../lib/utils"

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
  hasBottomNav?: boolean
}

/**
 * MobileContainer
 * Menjamin web app berfokus pada layar mobile (max-w-md),
 * berpusat di tengah pada layar desktop dengan border elegan.
 */
export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className,
  hasBottomNav = true,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-emerald-500/30 selection:text-emerald-300">
      <div
        className={cn(
          "w-full max-w-md min-h-screen flex flex-col bg-slate-900/90 relative border-x border-slate-800/80 shadow-2xl shadow-black/50",
          hasBottomNav && "pb-24",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
