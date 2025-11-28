/**
 * Framer Motion wrapper components for consistent animations
 * Following project guidelines to use Framer Motion for all animations
 */

import React from "react"
import { motion, type HTMLMotionProps, type Variants } from "framer-motion"

// Animation variants for reuse across components
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

// Stagger children animation for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

/**
 * Animated container that reveals children with stagger effect
 */
interface MotionContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  delay?: number
}

export function MotionContainer({ 
  children, 
  delay = 0,
  className,
  ...props 
}: MotionContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Individual animated item for use within MotionContainer
 */
interface MotionItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
}

export function MotionItem({ children, className, ...props }: MotionItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade in animation wrapper
 */
interface MotionFadeProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  delay?: number
}

export function MotionFade({ children, delay = 0, className, ...props }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Scale in animation wrapper for cards and modals
 */
interface MotionScaleProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  delay?: number
}

export function MotionScale({ children, delay = 0, className, ...props }: MotionScaleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hover animation wrapper for interactive elements
 */
interface MotionHoverProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
}

export function MotionHover({ children, className, ...props }: MotionHoverProps) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animated number counter
 */
interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedNumber({ value, duration = 1, className }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      setDisplayValue(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span className={className}>{displayValue.toLocaleString()}</span>
}

// Re-export motion for direct use
export { motion }

