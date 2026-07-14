import Link from "next/link";
import { ArrowRight, Gauge, GitCompare, Layers3, LineChart, Route, SlidersHorizontal, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DotPattern from "@/components/ui/dot-pattern-1";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/stat-card";
import { AnimatedList } from "@/components/shadcn-space/animated-list/animated-list-01";
const labs = [
  {
    href: "/playground",
    icon: SlidersHorizontal,
    title: "Parameter Playground",
    text: "Tune sampling controls and connect metrics with model behavior."
  },
  {
    href: "/compare",
    icon: GitCompare,
    title: "Model Comparison",
    text: "Run one prompt against multiple model profiles with clean side-by-side results."
  },
  {
    href: "/visualizer",
    icon: Workflow,
    title: "Inference Visualizer",
    text: "Inspect prompt flow from tokens to tensors, IDs, masks, and decoded text."
  }
];

const loop = ["Explain", "Visualize", "Experiment", "Reflect"];

export default function HomePage() {
  return (
    <div className="page-shell space-y-10">
      <section className="relative border bg-card p-6 md:p-8 lg:p-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <DotPattern width={6} height={6} className="fill-muted-foreground/20 dark:fill-muted-foreground/15" />
        </div>
        <div className="corner-marker -left-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -left-1.5" />
        <div className="corner-marker -right-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -right-1.5" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="w-full">
            <Badge className="rounded-md border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
              AI inference education workspace
            </Badge>
            <h1 className="mt-6 text-5xl font-bold leading-[0.98] tracking-tight text-foreground md:text-7xl w-full">
              Learn LLM inference without the mystery.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A grey, black, white, and orange workspace for experimenting with prompts, comparing model profiles, and inspecting every stage of generation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="w-fit h-fit relative inline-flex rounded-md transition-shadow duration-300 hover:shadow-md">
                <span className="absolute inset-0 rounded-md pointer-events-none overflow-hidden">
                  <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,white_0deg,white_40deg,transparent_60deg)]" />
                </span>
                <Button asChild size="lg" className="relative z-10 m-[1px] border-0 hover:shadow-none">
                  <Link href="/playground">
                    Open playground <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="w-fit h-fit relative inline-flex rounded-md transition-shadow duration-300 hover:shadow-md">
                <span className="absolute inset-0 rounded-md pointer-events-none overflow-hidden">
                  <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,hsl(var(--primary))_0deg,hsl(var(--primary))_40deg,transparent_60deg)]" />
                </span>
                <Button asChild size="lg" variant="outline" className="relative z-10 m-[1px] bg-background hover:bg-background border-0 hover:shadow-none">
                  <Link href="/visualizer">Inspect pipeline</Link>
                </Button>
              </div>
            </div>
          </div>

          <Card className="border-foreground/10 bg-background/95">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Inference run</CardTitle>
                  <CardDescription>Mock backend profile for local learning sessions.</CardDescription>
                </div>
                <Badge variant="success" className="rounded-md">Healthy</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric label="Latency" value="218 ms" />
                <MiniMetric label="Tokens" value="42" />
                <MiniMetric label="Device" value="mock-cpu" />
              </div>
              <Separator />
              <div className="min-h-[310px]">
                <AnimatedList className="w-full gap-3">
                  {loop.map((item, index) => (
                    <div className="flex items-center gap-3 w-full rounded-lg border bg-card p-3" key={item}>
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{item}</p>
                        <p className="text-xs text-muted-foreground">Learning step embedded into every page.</p>
                      </div>
                    </div>
                  ))}
                </AnimatedList>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Core labs" value="3" detail="Playground, comparison, and pipeline inspection." icon={<Layers3 className="h-5 w-5" />} />
        <StatCard label="API endpoints" value="5" detail="Generate, compare, visualize, models, and health." icon={<Route className="h-5 w-5" />} />
        <StatCard label="Learning mode" value="4-step" detail="Explain, visualize, experiment, and reflect." icon={<LineChart className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {labs.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href} className="group block">
              <Card className="h-full hover:-translate-y-0.5">
                <CardHeader>
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg border bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                    Launch lab <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <Card>
        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-foreground text-background">
              <Gauge className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Built for experimentation, not chat.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Results, metrics, and explanations stay close together so beginners can connect every output with the inference step that produced it.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/learn">Browse concepts</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}