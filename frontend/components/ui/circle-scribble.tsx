import { cn } from "@/lib/utils";

interface CircleScribbleProps {
  className?: string;
}

export function CircleScribble({
  className,
}: CircleScribbleProps) {
  return (
    <svg
      viewBox="0 0 260 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-0 h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <path
        d="M20 55
        C22 12 238 8 242 54
        C238 98 22 100 20 55Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M12 58
        C16 20 246 18 248 55
        C244 93 18 96 12 58Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
