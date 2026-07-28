import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle, FlaskConical } from "lucide-react";

const toneConfig = {
  info: { label: "Concept", icon: Info, color: "text-primary", bg: "bg-primary/5", border: "hover:border-primary/40", shadow: "hover:shadow-primary/10" },
  tip: { label: "Tip", icon: Lightbulb, color: "text-green-500", bg: "bg-green-500/5", border: "hover:border-green-500/40", shadow: "hover:shadow-green-500/10" },
  warning: { label: "Watch", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5", border: "hover:border-amber-500/40", shadow: "hover:shadow-amber-500/10" },
  challenge: { label: "Try", icon: FlaskConical, color: "text-purple-500", bg: "bg-purple-500/5", border: "hover:border-purple-500/40", shadow: "hover:shadow-purple-500/10" }
};

type EducationalCardProps = {
  title: string;
  tone?: "info" | "tip" | "warning" | "challenge";
  index?: number;
  hideIcon?: boolean;
  children: ReactNode;
};

export function EducationalCard({ title, tone = "info", index, hideIcon, children }: EducationalCardProps) {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <div className={`group relative overflow-hidden rounded-3xl border bg-card/40 backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${config.border} ${config.shadow} flex flex-col h-full`}>
      {!hideIcon && (
        <div className={`absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.02] group-hover:opacity-[0.08] transition-all ${config.color} group-hover:scale-110 duration-700 origin-center pointer-events-none select-none z-0`}>
          {index !== undefined ? (
            <span className="text-[12rem] font-serif italic font-bold opacity-50 leading-none">{index}</span>
          ) : (
            <Icon className="w-32 h-32 md:w-48 md:h-48" />
          )}
        </div>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        {!hideIcon && (
          <div className="mb-6">
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${config.bg} ${config.color} border border-current/10 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
              {index !== undefined ? (
                <span className="font-serif italic font-bold text-2xl">{index}</span>
              ) : (
                <Icon className="w-7 h-7" />
              )}
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-foreground/90">{title}</h3>
        <div className="mt-3 text-base leading-relaxed text-muted-foreground flex-1">{children}</div>
      </div>
    </div>
  );
}