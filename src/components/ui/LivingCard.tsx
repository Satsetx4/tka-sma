import React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface LivingCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  variant?: "default" | "glass" | "bordered" | "glow"
  isInteractive?: boolean
  className?: string
}

/**
 * LivingCard (Visual Depth & Anti-Dead-Flat)
 * Kartu berdimensi dengan border 1px halus, soft ambient shadow,
 * dan respon terangkat halus saat disentuh atau diarahkan kursor.
 */
export const LivingCard: React.FC<LivingCardProps> = ({
  children,
  variant = "default",
  isInteractive = false,
  className,
  ...props
}) => {
  const variantStyles = {
    default:
      "bg-slate-900/90 border border-slate-800/80 shadow-md shadow-black/20",
    glass:
      "bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-lg shadow-black/20",
    bordered:
      "bg-transparent border border-slate-800 hover:border-slate-700",
    glow:
      "bg-slate-900/80 border border-emerald-500/30 shadow-lg shadow-emerald-500/10",
  }

  return (
    <motion.div
      whileHover={isInteractive ? { y: -2, transition: { duration: 0.2 } } : undefined}
      whileTap={isInteractive ? { scale: 0.985 } : undefined}
      className={cn(
        "rounded-2xl p-4 transition-all duration-200",
        variantStyles[variant],
        isInteractive && "cursor-pointer active:bg-slate-850",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
