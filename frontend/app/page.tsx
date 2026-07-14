import Link from "next/link";
import { ArrowRight, GitCompare, SlidersHorizontal, Workflow } from "lucide-react";
import { EducationalCard } from "@/components/EducationalCard";
import { SectionHeader } from "@/components/SectionHeader";

const roadmap = [
  {
    href: "/playground",
    icon: SlidersHorizontal,
    title: "Tune generation",
    text: "Change temperature, top-p, top-k, and token limits while watching the explanation update."
  },
  {
    href: "/compare",
    icon: GitCompare,
    title: "Compare models",
    text: "Run one prompt through multiple model profiles and inspect why responses differ."
  },
  {
    href: "/visualizer",
    icon: Workflow,
    title: "Inspect inference",
    text: "Walk from prompt text to tokens, IDs, tensors, masks, generated IDs, and decoded output."
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <SectionHeader
          eyebrow="Interactive learning lab"
          title="Understand what happens inside LLM inference."
          description="LLM Lab turns model generation into a visible process. Start with a prompt, adjust parameters, compare outputs, and inspect the pipeline step by step."
        />
        <EducationalCard title="Learning loop" tone="challenge">
          <div className="grid gap-3 sm:grid-cols-2">
            {["Explain", "Visualize", "Experiment", "Reflect"].map((step) => (
              <div className="rounded-lg border border-line bg-panel p-4" key={step}>
                <p className="font-semibold text-ink">{step}</p>
                <p className="mt-1 text-ink/65">Each feature helps beginners build intuition, not just produce text.</p>
              </div>
            ))}
          </div>
        </EducationalCard>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {roadmap.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              className="group rounded-lg border border-line bg-panel p-5 shadow-soft transition hover:border-teal"
              href={item.href}
              key={item.href}
            >
              <Icon className="text-teal" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                Open lab <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
