"use client";

import { useEffect, useState } from "react";
import { Loader2, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { generateText, getModels } from "@/lib/api";
import { fallbackModels, getDefaultModelId } from "@/lib/modelCatalog";
import type { GenerateResponse, GenerationParameters } from "@/types/api";

const defaultParameters: GenerationParameters = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  max_new_tokens: 80,
  repetition_penalty: 1.05,
  do_sample: true
};

export function PlaygroundClient() {
  const [prompt, setPrompt] = useState("Explain tokenization with a kitchen analogy.");
  const [modelId, setModelId] = useState("tiny-lab");
  const [models, setModels] = useState(fallbackModels);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [parameters, setParameters] = useState(defaultParameters);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selectedModel = models.find((model) => model.id === modelId);

  useEffect(() => {
    let cancelled = false;

    getModels()
      .then(({ models: apiModels }) => {
        if (cancelled || apiModels.length === 0) {
          return;
        }

        setModels(apiModels);
        setModelId((current) =>
          apiModels.some((model) => model.id === current) ? current : getDefaultModelId(apiModels)
        );
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setModelsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function runGeneration() {
    setLoading(true);
    setError(null);
    try {
      setResult(await generateText(prompt, modelId, parameters));
    } catch {
      setError("The backend is not responding yet. Start FastAPI on localhost:8000 and try again.");
    } finally {
      setLoading(false);
    }
  }

  function updateParameter(key: keyof GenerationParameters, value: number | boolean) {
    setParameters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Prompt and controls</CardTitle>
              <CardDescription>Tune decoding behavior and observe how the explanation changes.</CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-md">Live</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <select
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id="model"
              value={modelId}
              onChange={(event) => setModelId(event.target.value)}
            >
              {models.map((model) => (
                <option value={model.id} key={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {modelsLoading ? (
              <Skeleton className="h-4 w-44" />
            ) : selectedModel ? (
              <p className="text-xs leading-5 text-muted-foreground">
                {selectedModel.size} - {selectedModel.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5">
            <Slider label="Temperature" value={parameters.temperature} min={0} max={1.5} step={0.1} onChange={(value) => updateParameter("temperature", value)} />
            <Slider label="Top P" value={parameters.top_p} min={0.1} max={1} step={0.05} onChange={(value) => updateParameter("top_p", value)} />
            <Slider label="Top K" value={parameters.top_k} min={1} max={100} step={1} onChange={(value) => updateParameter("top_k", value)} />
            <Slider label="Max New Tokens" value={parameters.max_new_tokens} min={16} max={256} step={8} onChange={(value) => updateParameter("max_new_tokens", value)} />
            <Slider label="Repetition Penalty" value={parameters.repetition_penalty} min={1} max={1.4} step={0.01} onChange={(value) => updateParameter("repetition_penalty", value)} />
          </div>

          <label className="flex items-center justify-between rounded-lg border bg-muted/30 p-4 text-sm font-medium">
            <span>
              Enable sampling
              <span className="block text-xs font-normal text-muted-foreground">Allows less deterministic token choices.</span>
            </span>
            <input
              checked={parameters.do_sample}
              className="h-4 w-4 accent-primary"
              onChange={(event) => updateParameter("do_sample", event.target.checked)}
              type="checkbox"
            />
          </label>

          <Button className="w-full" disabled={loading || prompt.trim().length === 0} onClick={runGeneration} type="button">
            {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Play aria-hidden="true" />}
            Generate response
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Result workspace</CardTitle>
              <CardDescription>Generated output, runtime metrics, and a beginner-friendly reflection.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</p> : null}
          {loading ? <LoadingState /> : null}
          {!loading && result ? (
            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/25 p-5 text-sm leading-7 text-foreground">
                {result.output}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Time" value={`${result.metrics.generation_time_ms} ms`} />
                <Metric label="Tokens" value={String(result.metrics.generated_tokens)} />
                <Metric label="Speed" value={`${result.metrics.tokens_per_second}/s`} />
                <Metric label="Device" value={result.metrics.device} />
              </div>
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm font-semibold">Why it changed</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.explanation}</p>
              </div>
            </div>
          ) : null}
          {!loading && !result ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
              <p className="mt-4 font-medium">No generation yet</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Run a prompt to populate this workspace with output, metrics, and interpretation.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between text-sm font-medium">
        {label}
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{value}</span>
      </span>
      <input className="w-full accent-primary" max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-3 sm:grid-cols-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}