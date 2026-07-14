"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-10 w-full grow overflow-hidden rounded-xl border border-border bg-muted shadow-[0_1px_2px_0px_rgba(0,0,0,0.1)] ring-1 ring-background ring-inset">
      <SliderPrimitive.Range className="absolute h-full mx-0.5 overflow-hidden rounded-lg border border-border bg-foreground shadow-sm" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-7 w-1.5 rounded-xl border-0 bg-muted shadow-sm cursor-ew-resize ring-0 outline-none transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
