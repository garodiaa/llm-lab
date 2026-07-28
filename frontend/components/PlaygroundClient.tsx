"use client";

import { useEffect, useState } from "react";
import { Loader2, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Generation failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  function updateParameter(key: keyof GenerationParameters, value: number | boolean) {
    setParameters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(400px,500px)_1fr]">
      {/* Left Panel: Controls */}
      <div className="relative overflow-hidden rounded-3xl border bg-card transition-all duration-500 hover:shadow-2xl hover:border-primary/50 group flex flex-col h-auto lg:h-[calc(100vh-10rem)] lg:min-h-[700px]">
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 md:px-8 md:pt-8 bg-card/80 backdrop-blur-md z-10 border-b">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Prompt & Controls</CardTitle>
                <CardDescription className="mt-1">Tune decoding behavior and observe how the explanation changes.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/30">Live</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="prompt" className="text-base font-semibold">Prompt</Label>
              <Textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} className="resize-none min-h-[100px] rounded-xl bg-background/50 focus-visible:ring-primary/50" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="model" className="text-base font-semibold">Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger id="model" className="w-full h-11 rounded-xl bg-background/50 focus:ring-primary/50">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className={"data-[state=open]:!zoom-in-0 origin-center duration-400 rounded-xl"}>
                  {models.map((model) => (
                    <SelectItem value={model.id} key={model.id} className="rounded-lg">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {modelsLoading ? (
                <Skeleton className="h-4 w-44 rounded-full" />
              ) : selectedModel ? (
                <p className="text-xs leading-5 text-muted-foreground pl-1">
                  {selectedModel.size} - {selectedModel.description}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <Slider label="Temperature" description="Controls randomness: Lower values make output more deterministic, higher values make it more creative." value={parameters.temperature} min={0} max={1.5} step={0.1} onChange={(value) => updateParameter("temperature", value)} />
              <Slider label="Max Tokens" description="The maximum number of tokens to generate in the output." value={parameters.max_new_tokens} min={16} max={256} step={8} onChange={(value) => updateParameter("max_new_tokens", value)} />
              <Slider label="Top P" description="Nucleus sampling: Only considers tokens comprising the top P probability mass." value={parameters.top_p} min={0.1} max={1} step={0.05} onChange={(value) => updateParameter("top_p", value)} />
              <Slider label="Top K" description="Limits the next token selection to the K most probable tokens." value={parameters.top_k} min={1} max={100} step={1} onChange={(value) => updateParameter("top_k", value)} />
              <div className="sm:col-span-2">
                <Slider label="Rep Penalty" description="Penalizes new tokens based on their appearance in the generated text." value={parameters.repetition_penalty} min={1} max={1.4} step={0.01} onChange={(value) => updateParameter("repetition_penalty", value)} />
              </div>
            </div>

            <label className="flex items-center justify-between rounded-xl border bg-background/50 p-4 text-sm font-medium hover:border-primary/30 transition-colors cursor-pointer">
              <span>
                Enable sampling
                <span className="block text-xs font-normal text-muted-foreground mt-0.5">Allows less deterministic token choices.</span>
              </span>
              <input
                checked={parameters.do_sample}
                className="h-4 w-4 accent-primary rounded cursor-pointer"
                onChange={(event) => updateParameter("do_sample", event.target.checked)}
                type="checkbox"
              />
            </label>
          </CardContent>

          <div className="p-6 pt-4 md:p-8 md:pt-4 border-t bg-card/80 backdrop-blur-md z-10">
            <div className="w-full relative inline-flex rounded-full transition-shadow duration-300 hover:shadow-lg hover:shadow-red-500/25">
              <span className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,rgb(239,68,68)_0deg,rgb(239,68,68)_40deg,transparent_60deg)]" />
              </span>
              <Button 
                className="w-full h-14 relative z-10 m-[2px] rounded-full px-8 text-base font-semibold border-0 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-100" 
                disabled={loading || prompt.trim().length === 0} 
                onClick={runGeneration} 
                type="button"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" aria-hidden="true" /> : <Play className="mr-2 h-5 w-5" aria-hidden="true" />}
                Generate response
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Panel: Workspace */}
      <div className="relative overflow-hidden rounded-3xl border bg-card transition-all duration-500 hover:shadow-2xl hover:border-primary/50 group flex flex-col h-auto lg:h-[calc(100vh-10rem)] lg:min-h-[700px]">
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
          <CardHeader className="px-6 pt-6 pb-4 md:px-8 md:pt-8 bg-card/80 backdrop-blur-md z-10 border-b">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Result Workspace</CardTitle>
                <CardDescription className="mt-1">Generated output, runtime metrics, and a beginner-friendly reflection.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                 <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
            {error ? <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive mb-6">{error}</p> : null}
            {loading ? <LoadingState /> : null}
            {!loading && result ? (
              <div className="space-y-6 flex flex-col h-full">
                <div className="rounded-2xl border bg-background/50 p-6 text-base leading-relaxed text-foreground min-h-[160px] shadow-inner">
                  {result.output}
                </div>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  <Metric label="Time" value={`${result.metrics.generation_time_ms} ms`} />
                  <Metric label="Tokens" value={String(result.metrics.generated_tokens)} />
                  <Metric label="Speed" value={`${result.metrics.tokens_per_second}/s`} />
                  <Metric label="Model" value={selectedModel?.hf_model_id || selectedModel?.name || modelId} />
                </div>
                <div className="rounded-2xl border bg-primary/5 p-6 mt-auto border-primary/20">
                  <p className="text-base font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Why it changed
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
                </div>
              </div>
            ) : null}
            {!loading && !result ? (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-background/30 p-8 text-center h-full flex flex-col justify-center items-center group/empty hover:border-primary/40 transition-colors">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-700"></div>
                   <Sparkles className="relative mx-auto h-12 w-12 text-primary opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all duration-500" aria-hidden="true" />
                </div>
                <p className="mt-6 text-lg font-bold text-foreground">No generation yet</p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground max-w-sm mx-auto">Run a prompt to populate this workspace with output, metrics, and interpretation.</p>
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
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {label}
          </p>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-primary transition-colors outline-none">
                  <InfoIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 py-3 px-4 text-pretty rounded-xl shadow-xl border-primary/20" side="top">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="size-4 text-primary" />
                    <p className="text-sm font-bold text-foreground">{label}</p>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-sm font-bold text-primary flex items-center bg-primary/10 px-2 py-0.5 rounded-md">
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
        className="cursor-pointer"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background/50 p-4 transition-colors hover:bg-card hover:border-primary/30">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 flex flex-col h-full animate-pulse">
      <div className="rounded-2xl border bg-background/50 p-6 min-h-[160px]">
        <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl border bg-background/50 p-4 h-20">
             <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
             <div className="h-6 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-primary/5 p-6 mt-auto">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-4/5"></div>
      </div>
    </div>
  );
}