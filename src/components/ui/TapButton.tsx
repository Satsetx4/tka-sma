import React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export interface TapButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

/**
 * TapButton (Tactile & Living Button)
 * Tombol dengan respons taktil pegas membal (scale 0.97) saat disentuh,
 * ukuran tap target jempol (minimal 44px untuk ukuran default), dan anti-dead-flat.
 */
export const TapButton: React.FC<TapButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer"

  const sizeStyles = {
    sm: "h-9 px-3 text-xs gap-1.5",
    md: "h-11 px-4 text-sm gap-2 min-h-[44px]", // Min 44px tap target
    lg: "h-13 px-6 text-base gap-2.5 min-h-[48px]",
  }

  const variantStyles = {
    primary:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:bg-emerald-600 shadow-md shadow-emerald-500/20 font-semibold",
    secondary:
      "bg-slate-800 text-slate-100 hover:bg-slate-700/80 active:bg-slate-800 border border-slate-700/60 shadow-sm",
    outline:
      "bg-transparent text-slate-200 hover:bg-slate-800/60 active:bg-slate-800 border border-slate-700/80",
    ghost:
      "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50 active:bg-slate-800/80",
    danger:
      "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 active:bg-rose-500/30 border border-rose-500/30",
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="shrink-0">{iconLeft}</span>}
          {children}
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  )
}
