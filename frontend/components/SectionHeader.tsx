import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/shadcn-space/animated-text/animated-text-06";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex-1 w-full max-w-full">
        <TextReveal
          as="h1"
          text={title}
          mode="word"
          blur="4px"
          y={10}
          className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl w-full block"
        />
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}