"use client";

import { useState } from "react";
import { ArrowDown, Code2, Loader2, Workflow, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { visualizeInference } from "@/lib/api";
import type { VisualizeResponse } from "@/types/api";

export function VisualizerClient() {
  const [prompt, setPrompt] = useState("The cat sat on the mat.");
  const [prompt2, setPrompt2] = useState("The cat");
  const [result, setResult] = useState<VisualizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runVisualization() {
    setLoading(true);
    setError(null);
    try {
      setResult(await visualizeInference(prompt, "tiny-lab", prompt2.trim() || undefined));
    } catch {
      setError("The visualization API is unavailable. Start the backend and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="relative overflow-hidden rounded-3xl border bg-card transition-all duration-500 hover:shadow-2xl hover:border-primary/50 group flex flex-col">
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 md:px-8 md:pt-8 bg-card/80 backdrop-blur-md z-10 border-b">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Pipeline Input</CardTitle>
                <CardDescription className="mt-1">Enter a short prompt (or two!) and inspect how they become model-ready data.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/30">Trace</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="visualizer-prompt" className="text-base font-semibold">Prompt 1</Label>
                <Input id="visualizer-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} className="h-14 rounded-xl bg-background/50 focus-visible:ring-primary/50 text-base" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="visualizer-prompt2" className="text-base font-semibold text-muted-foreground">Prompt 2 (Optional Batch)</Label>
                <Input id="visualizer-prompt2" value={prompt2} onChange={(event) => setPrompt2(event.target.value)} placeholder="Add another string to teach padding..." className="h-14 rounded-xl bg-background/50 focus-visible:ring-primary/50 text-base" />
              </div>
            </div>
            
            <div className="w-full md:w-auto relative inline-flex rounded-full transition-shadow duration-300 hover:shadow-lg hover:shadow-red-500/25">
              <span className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,rgb(239,68,68)_0deg,rgb(239,68,68)_40deg,transparent_60deg)]" />
              </span>
              <Button 
                className="w-full md:w-auto h-14 relative z-10 m-[2px] rounded-full px-10 text-base font-semibold border-0 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-100" 
                disabled={loading || prompt.trim().length === 0} 
                onClick={runVisualization} 
                type="button"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" aria-hidden="true" /> : <Workflow className="mr-2 h-5 w-5" aria-hidden="true" />}
                Visualize flow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {error ? <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</p> : null}
      {loading ? <PipelineSkeleton /> : null}
      
      {!loading && result ? (
        <div className="flex flex-col gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {result.steps.map((step, index) => (
            <div key={step.name} className="flex flex-col gap-6 md:gap-8 items-center w-full">
              <div className="relative overflow-hidden rounded-3xl border bg-card w-full transition-all duration-500 hover:shadow-xl hover:border-primary/50 group">
                <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
                  <CardHeader className="px-6 pt-6 pb-4 md:px-8 md:pt-8 bg-card/80 backdrop-blur-md z-10 border-b">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                            {index + 1}
                          </div>
                          <CardTitle className="text-xl font-bold">{step.name}</CardTitle>
                        </div>
                        <CardDescription className="text-base">{step.explanation}</CardDescription>
                      </div>
                      {step.code ? (
                        <Badge variant="outline" className="w-fit shrink-0 whitespace-nowrap gap-1.5 rounded-full px-3 py-1 bg-background/50 border-primary/20 text-primary shadow-sm">
                          <Code2 className="h-4 w-4" aria-hidden="true" />
                          Code Context
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 md:p-8 flex-1 bg-background/30">
                    <div className="rounded-2xl border bg-muted/20 p-6 font-mono text-sm leading-relaxed text-foreground shadow-inner whitespace-pre-wrap break-all">
                      {step.value}
                    </div>
                    {step.code ? (
                      <div className="relative rounded-2xl overflow-hidden border bg-slate-950 dark:bg-slate-900">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
                        <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-100">
                          {step.code}
                        </pre>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
              {index < result.steps.length - 1 ? (
                <div className="flex justify-center text-primary/30 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-full scale-150"></div>
                  <ArrowDown className="relative h-8 w-8 animate-bounce" aria-hidden="true" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      
      {!loading && !result ? (
        <div className="relative border border-dashed border-primary/20 bg-card rounded-3xl w-full h-full p-12 lg:p-24 flex flex-col text-center transition-shadow duration-200 hover:shadow-xl hover:border-primary/40 group/empty">
          <Card className="border-0 shadow-none bg-transparent h-full flex flex-col justify-center">
            <CardContent className="p-0">
              <div className="relative mx-auto w-fit">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-[2] opacity-0 group-hover/empty:opacity-100 transition-opacity duration-700"></div>
                 <Workflow className="relative mx-auto h-16 w-16 text-primary opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all duration-500" aria-hidden="true" />
              </div>
              <p className="mt-8 text-2xl font-bold text-foreground">Pipeline waiting</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-lg mx-auto">Run a prompt to see it automatically broken down into tokenization, tensor manipulation, and decoding steps.</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-8 items-center w-full">
          <div className="rounded-3xl border bg-card w-full h-64 overflow-hidden">
             <div className="h-20 bg-muted/30 border-b p-6 flex justify-between">
                <div className="h-6 bg-muted rounded w-1/3"></div>
             </div>
             <div className="p-6">
                <div className="h-24 bg-background/50 rounded-2xl w-full"></div>
             </div>
          </div>
          {i < 3 && (
            <div className="flex justify-center">
              <ArrowDown className="h-8 w-8 text-muted" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}