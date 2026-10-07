import React from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "../../lib/utils"

interface ScrollProgressProps {
  className?: string
}

/**
 * ScrollProgress
 * Bar tipis di bagian atas layar yang menunjukkan kedalaman scroll pengguna.
 */
export const ScrollProgress: React.FC<ScrollProgressProps> = ({ className }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 origin-left z-50 pointer-events-none",
        className
      )}
    />
  )
}
