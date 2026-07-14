"use client";

import { useState } from "react";
import { ArrowDown, Code2, Loader2, Workflow } from "lucide-react";
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
  const [result, setResult] = useState<VisualizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runVisualization() {
    setLoading(true);
    setError(null);
    try {
      setResult(await visualizeInference(prompt, "tiny-lab"));
    } catch {
      setError("The visualization API is unavailable. Start the backend and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative border bg-card w-full h-full p-6 flex flex-col transition-shadow duration-200 hover:shadow-md">
        <div className="corner-marker -left-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -left-1.5" />
        <div className="corner-marker -right-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -right-1.5" />
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Pipeline input</CardTitle>
            <CardDescription>Enter a short prompt and inspect how it becomes model-ready data.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end px-0 pb-0">
            <div className="space-y-2">
              <Label htmlFor="visualizer-prompt">Prompt</Label>
              <Input id="visualizer-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            </div>
            <Button disabled={loading || prompt.trim().length === 0} onClick={runVisualization} type="button">
              {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Workflow aria-hidden="true" />}
              Visualize flow
            </Button>
          </CardContent>
        </Card>
      </div>

      {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</p> : null}
      {loading ? <PipelineSkeleton /> : null}
      {!loading && result ? (
        <div className="grid gap-4">
          {result.steps.map((step, index) => (
            <div key={step.name} className="grid gap-3">
              <div className="relative border bg-card w-full h-full p-6 flex flex-col transition-shadow duration-200 hover:shadow-md">
                <div className="corner-marker -left-1.5 -top-1.5" />
                <div className="corner-marker -bottom-1.5 -left-1.5" />
                <div className="corner-marker -right-1.5 -top-1.5" />
                <div className="corner-marker -bottom-1.5 -right-1.5" />
                <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-3 rounded-md">Step {index + 1}</Badge>
                        <CardTitle>{step.name}</CardTitle>
                        <CardDescription>{step.explanation}</CardDescription>
                      </div>
                      {step.code ? (
                        <Badge variant="outline" className="w-fit gap-1.5 rounded-md">
                          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Code
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 px-0 pb-0 flex-1">
                    <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-6 text-foreground">
                      {step.value}
                    </div>
                    {step.code ? (
                      <pre className="overflow-x-auto rounded-lg border bg-slate-950 p-4 text-sm leading-6 text-slate-100 dark:bg-slate-900">
                        {step.code}
                      </pre>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
              {index < result.steps.length - 1 ? (
                <div className="flex justify-center text-muted-foreground">
                  <ArrowDown className="h-5 w-5" aria-hidden="true" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {!loading && !result ? (
        <div className="relative border border-dashed bg-card w-full h-full p-8 flex flex-col text-center transition-shadow duration-200 hover:shadow-md">
          <div className="corner-marker -left-1.5 -top-1.5" />
          <div className="corner-marker -bottom-1.5 -left-1.5" />
          <div className="corner-marker -right-1.5 -top-1.5" />
          <div className="corner-marker -bottom-1.5 -right-1.5" />
          <Card className="border-0 shadow-none bg-transparent h-full flex flex-col justify-center">
            <CardContent className="p-0">
              <Workflow className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
              <p className="mt-4 font-medium">Pipeline waiting</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Run a prompt to see tokenization, token IDs, tensors, masks, generated IDs, and decoded text.</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}