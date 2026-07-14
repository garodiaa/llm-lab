import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  className?: string;
};

export function StatCard({ label, value, detail, icon, className }: StatCardProps) {
  return (
    <div className={cn("relative border bg-card p-5 h-full transition-shadow duration-200 hover:shadow-md", className)}>
      <div className="corner-marker -left-1.5 -top-1.5" />
      <div className="corner-marker -bottom-1.5 -left-1.5" />
      <div className="corner-marker -right-1.5 -top-1.5" />
      <div className="corner-marker -bottom-1.5 -right-1.5" />
      
      <div className="relative z-10 flex items-start gap-4 h-full">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
      </div>
    </div>
  );
}