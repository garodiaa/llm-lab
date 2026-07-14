import type { ReactNode } from "react";

type EducationalCardProps = {
  title: string;
  tone?: "info" | "tip" | "warning" | "challenge";
  children: ReactNode;
};

const toneClasses = {
  info: "border-teal/30 bg-teal/5",
  tip: "border-amber/30 bg-amber/5",
  warning: "border-rose/30 bg-rose/5",
  challenge: "border-ink/20 bg-white"
};

export function EducationalCard({ title, tone = "info", children }: EducationalCardProps) {
  return (
    <section className={`rounded-lg border p-5 shadow-soft ${toneClasses[tone]}`}>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-ink/70">{children}</div>
    </section>
  );
}
