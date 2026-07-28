import Link from "next/link";
import { ArrowRight, Gauge, GitCompare, Layers3, LineChart, Route, SlidersHorizontal, Workflow } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DotPattern from "@/components/ui/dot-pattern-1";
import { Features } from "@/components/ui/features-8";

const labs = [
  {
    href: "/playground",
    icon: SlidersHorizontal,
    title: "Parameter Playground",
    text: "Tune sampling controls and connect metrics with model behavior.",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    href: "/compare",
    icon: GitCompare,
    title: "Model Comparison",
    text: "Run one prompt against multiple model profiles with clean side-by-side results.",
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    href: "/visualizer",
    icon: Workflow,
    title: "Inference Visualizer",
    text: "Inspect prompt flow from tokens to tensors, IDs, masks, and decoded text.",
    color: "from-orange-500/20 to-red-500/10",
  }
];

const steps = [
  { title: "Explain", text: "Understand the core concepts of NLP and language models." },
  { title: "Visualize", text: "See the neural pathways and token representations in real-time." },
  { title: "Experiment", text: "Tweak parameters and observe changes in the model's output." },
  { title: "Reflect", text: "Connect the dots between the input and the generated response." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full border-b bg-card min-h-[70vh] flex overflow-hidden">
        <EvervaultBackground className="w-full flex-grow">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <DotPattern width={24} height={24} className="fill-muted-foreground/10 dark:fill-muted-foreground/5" />
          </div>
          
          <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto px-6 py-20 md:py-32">
            <Badge className="rounded-full border-primary/30 bg-primary/10 px-4 py-1.5 text-primary text-sm backdrop-blur-md" variant="outline">
              Demystifying Neural Pathways
            </Badge>
            <h1 className="mt-8 text-4xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent md:text-5xl lg:text-6xl drop-shadow-xl pb-2">
              Uncover the Context of <br className="hidden md:block" /> LLMs & NLP
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl drop-shadow-md font-medium">
              A specialized workspace for experimenting with prompts, observing model behavior, and understanding the complex inner workings of language models down to the token.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4 pointer-events-auto">
              <div className="w-fit h-fit relative inline-flex rounded-full transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/25">
                <span className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                  <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,hsl(var(--primary))_0deg,hsl(var(--primary))_40deg,transparent_60deg)]" />
                </span>
                <Button asChild size="lg" className="relative z-10 m-[2px] rounded-full px-8 py-6 text-base font-semibold border-0 hover:shadow-none bg-foreground text-background hover:bg-foreground/90 transition-colors">
                  <Link href="/playground">
                    Open Playground <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="w-fit h-fit relative inline-flex rounded-full transition-shadow duration-300 hover:shadow-lg hover:shadow-red-500/25">
                <span className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                  <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,rgb(239,68,68)_0deg,rgb(239,68,68)_40deg,transparent_60deg)]" />
                </span>
                <Button asChild size="lg" variant="outline" className="relative z-10 m-[2px] rounded-full px-8 py-6 text-base font-semibold bg-background/80 backdrop-blur-xl border-0 hover:bg-background/90 transition-all">
                  <Link href="/visualizer">Inspect Pipeline</Link>
                </Button>
              </div>
            </div>
          </div>
        </EvervaultBackground>
      </section>

      <div className="page-shell space-y-24 md:space-y-32">
        {/* Learning Mode Steps */}
        <section className="relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              The <span className="relative inline-flex items-center justify-center px-4 py-2 mx-1">
                <span className="relative z-10 text-primary">4-Step</span>
                <svg className="absolute inset-0 size-full text-primary/30 -z-10 scale-[1.3] -rotate-2" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor" />
                </svg>
              </span> <br className="hidden md:block lg:hidden" /> Learning Loop
            </h2>
            <p className="mt-6 text-muted-foreground text-xl leading-relaxed max-w-lg mx-auto">
              An interactive methodology embedded into every lab to accelerate your understanding of inference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto relative px-4 sm:px-8">
            {steps.map((step, index) => (
                <div key={step.title} className="group relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                  <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-[0.03] font-bold text-7xl md:text-8xl group-hover:opacity-10 transition-all text-primary group-hover:scale-110 duration-500 origin-center pointer-events-none select-none z-0">
                    0{index + 1}
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mt-1 text-base">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </section>

        {/* Core Labs */}
        <section>
          <div className="mb-12 flex flex-col items-center text-center gap-6">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Core Labs</h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl">Dive deep into the mechanics of generation with our specialized tools.</p>
            </div>
            <div className="flex justify-center gap-4">
               <div className="flex items-center gap-2 text-sm font-medium border rounded-full px-4 py-2 bg-background shadow-sm">
                 <Layers3 className="h-4 w-4 text-primary" />
                 3 Labs
               </div>
               <div className="flex items-center gap-2 text-sm font-medium border rounded-full px-4 py-2 bg-background shadow-sm">
                 <Route className="h-4 w-4 text-primary" />
                 5 API Endpoints
               </div>
            </div>
          </div>

          <div className="mt-8">
            <Features />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl border bg-foreground text-background">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 md:p-20">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-background/10 backdrop-blur-md border border-background/20 mb-8">
              <Gauge className="h-8 w-8 text-background" aria-hidden="true" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Built for experimentation, not chat.</h2>
            <p className="max-w-2xl text-lg md:text-xl text-background/80 leading-relaxed mb-10">
              Results, metrics, and explanations stay close together so beginners can connect every output directly with the inference step that produced it.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-10 py-6 text-lg font-bold hover:scale-105 transition-transform">
              <Link href="/learn">Browse Concepts</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}