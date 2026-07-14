"use client";

import { useEffect, useState } from "react";
import { Loader2, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ShineBorder } from "@/components/ui/shine-border";
import { Slider as ShadcnSlider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import NumberFlow from "@number-flow/react";
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
      <div className="relative border bg-card p-6 md:p-8 lg:p-10 w-full h-full flex flex-col transition-shadow duration-200 hover:shadow-md">
        <div className="corner-marker -left-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -left-1.5" />
        <div className="corner-marker -right-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -right-1.5" />
        
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Prompt and controls</CardTitle>
                <CardDescription>Tune decoding behavior and observe how the explanation changes.</CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-md">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 flex-1 px-0 pb-0">
            <div className="space-y-3">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} className="resize-none min-h-[100px]" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="model">Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger id="model" className="w-full h-11">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className={"data-[state=open]:!zoom-in-0 origin-center duration-400"}>
                  {models.map((model) => (
                    <SelectItem value={model.id} key={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {modelsLoading ? (
                <Skeleton className="h-4 w-44" />
              ) : selectedModel ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  {selectedModel.size} - {selectedModel.description}
                </p>
              ) : null}
            </div>

            <div className="grid gap-7">
              <Slider label="Temperature" description="Controls randomness: Lower values make output more deterministic, higher values make it more creative." value={parameters.temperature} min={0} max={1.5} step={0.1} onChange={(value) => updateParameter("temperature", value)} />
              <Slider label="Top P" description="Nucleus sampling: Only considers tokens comprising the top P probability mass." value={parameters.top_p} min={0.1} max={1} step={0.05} onChange={(value) => updateParameter("top_p", value)} />
              <Slider label="Top K" description="Limits the next token selection to the K most probable tokens." value={parameters.top_k} min={1} max={100} step={1} onChange={(value) => updateParameter("top_k", value)} />
              <Slider label="Max Tokens" description="The maximum number of tokens to generate in the output." value={parameters.max_new_tokens} min={16} max={256} step={8} onChange={(value) => updateParameter("max_new_tokens", value)} />
              <Slider label="Rep Penalty" description="Penalizes new tokens based on their appearance in the generated text." value={parameters.repetition_penalty} min={1} max={1.4} step={0.01} onChange={(value) => updateParameter("repetition_penalty", value)} />
            </div>

            <label className="flex items-center justify-between rounded-lg border bg-muted/30 p-4 text-sm font-medium mt-4">
              <span>
                Enable sampling
                <span className="block text-xs font-normal text-muted-foreground mt-0.5">Allows less deterministic token choices.</span>
              </span>
              <input
                checked={parameters.do_sample}
                className="h-4 w-4 accent-primary"
                onChange={(event) => updateParameter("do_sample", event.target.checked)}
                type="checkbox"
              />
            </label>

            <Button className="w-full h-12 mt-auto text-md" disabled={loading || prompt.trim().length === 0} onClick={runGeneration} type="button">
              {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Play aria-hidden="true" />}
              Generate response
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="relative border bg-card p-6 md:p-8 lg:p-10 w-full h-full flex flex-col transition-shadow duration-200 hover:shadow-md">
        <div className="corner-marker -left-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -left-1.5" />
        <div className="corner-marker -right-1.5 -top-1.5" />
        <div className="corner-marker -bottom-1.5 -right-1.5" />
        
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Result workspace</CardTitle>
                <CardDescription>Generated output, runtime metrics, and a beginner-friendly reflection.</CardDescription>
              </div>
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 px-0 pb-0">
            {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive mb-6">{error}</p> : null}
            {loading ? <LoadingState /> : null}
            {!loading && result ? (
              <div className="space-y-6">
                <div className="rounded-lg border bg-muted/25 p-5 text-sm leading-7 text-foreground min-h-[120px]">
                  {result.output}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Time" value={`${result.metrics.generation_time_ms} ms`} />
                  <Metric label="Tokens" value={String(result.metrics.generated_tokens)} />
                  <Metric label="Speed" value={`${result.metrics.tokens_per_second}/s`} />
                  <Metric label="Device" value={result.metrics.device} />
                </div>
                <div className="rounded-lg border bg-card p-5 mt-auto">
                  <p className="text-sm font-semibold">Why it changed</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.explanation}</p>
                </div>
              </div>
            ) : null}
            {!loading && !result ? (
              <div className="rounded-lg border border-dashed p-8 text-center h-full flex flex-col justify-center items-center">
                <Sparkles className="mx-auto h-8 w-8 text-primary opacity-50" aria-hidden="true" />
                <p className="mt-4 font-medium">No generation yet</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground max-w-sm mx-auto">Run a prompt to populate this workspace with output, metrics, and interpretation.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Slider({ label, description, value, min, max, step, onChange }: { label: string; description: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium tracking-tight text-foreground">
            {label}
          </p>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground outline-none">
                  <InfoIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 py-3 text-pretty" side="top">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="size-4" />
                    <p className="text-sm font-medium">{label}</p>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-sm font-medium text-muted-foreground flex items-center">
          <NumberFlow
            value={value}
            format={{ minimumFractionDigits: step < 1 ? 2 : 0, maximumFractionDigits: 2 }}
          />
        </div>
      </div>
      <ShadcnSlider
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
    </div>
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