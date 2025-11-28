import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion } from "framer-motion"
import { cn } from "@ace-ielts/core"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string
  animated?: boolean
}

/**
 * Progress bar component built on Radix UI
 * Supports custom indicator colors and animations
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorColor, animated = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-neutral-border",
      className
    )}
    {...props}
  >
    {animated ? (
      <motion.div
        className="h-full w-full flex-1 rounded-full"
        style={{ 
          backgroundColor: indicatorColor || "#0E7569",
          originX: 0
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: (value || 0) / 100 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
    ) : (
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full transition-all duration-500 ease-out"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: indicatorColor || "#0E7569"
        }}
      />
    )}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

