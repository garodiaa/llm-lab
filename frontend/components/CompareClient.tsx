"use client";

import { useEffect, useState } from "react";
import { GitCompare, Loader2, SearchCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { compareModels, getModels } from "@/lib/api";
import { fallbackModels } from "@/lib/modelCatalog";
import type { CompareResponse, GenerationParameters } from "@/types/api";

const parameters: GenerationParameters = {
  temperature: 0.8,
  top_p: 0.9,
  top_k: 40,
  max_new_tokens: 72,
  repetition_penalty: 1.05,
  do_sample: true
};

export function CompareClient() {
  const [prompt, setPrompt] = useState("Why does temperature affect model output?");
  const [models, setModels] = useState(fallbackModels);
  const [selected, setSelected] = useState(["tiny-lab", "balanced-lab"]);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getModels()
      .then(({ models: apiModels }) => {
        if (cancelled || apiModels.length === 0) {
          return;
        }

        setModels(apiModels);
        setSelected((current) => current.filter((id) => apiModels.some((model) => model.id === id)));
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

  async function runComparison() {
    setLoading(true);
    setError(null);
    try {
      setResult(await compareModels(prompt, selected, parameters));
    } catch {
      setError("The comparison API is unavailable. Start the backend and retry.");
    } finally {
      setLoading(false);
    }
  }

  function toggleModel(modelId: string) {
    setSelected((current) =>
      current.includes(modelId) ? current.filter((id) => id !== modelId) : [...current, modelId]
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(350px,400px)_1fr]">
      {/* Left Panel: Controls */}
      <div className="relative overflow-hidden rounded-3xl border bg-card transition-all duration-500 hover:shadow-2xl hover:border-primary/50 group flex flex-col h-auto lg:h-[calc(100vh-6rem)] lg:min-h-[700px]">
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 md:px-8 md:pt-8 bg-card/80 backdrop-blur-md z-10 border-b">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Comparison Setup</CardTitle>
                <CardDescription className="mt-1">Select profiles and provide a shared prompt.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/30 shrink-0 whitespace-nowrap">{selected.length} selected</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="compare-prompt" className="text-base font-semibold">Shared Prompt</Label>
              <Textarea id="compare-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} className="resize-none min-h-[120px] rounded-xl bg-background/50 focus-visible:ring-primary/50" />
              <p className="text-xs text-muted-foreground mt-2">The same prompt is sent to every selected model profile.</p>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-semibold">Model Profiles</Label>
              <div className="grid gap-3">
                {models.map((model) => (
                  <label className={`flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer ${selected.includes(model.id) ? 'bg-primary/5 border-primary/50 shadow-sm' : 'bg-background/50 hover:border-primary/30'}`} key={model.id}>
                    <input
                      checked={selected.includes(model.id)}
                      className="mt-1 h-4 w-4 accent-primary rounded cursor-pointer"
                      onChange={() => toggleModel(model.id)}
                      type="checkbox"
                    />
                    <span>
                      <span className="block text-sm font-bold text-foreground">{model.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{model.size} - {model.description}</span>
                    </span>
                  </label>
                ))}
                {modelsLoading ? <Skeleton className="h-16 w-full rounded-xl" /> : null}
              </div>
            </div>
          </CardContent>

          <div className="p-6 pt-4 md:p-8 md:pt-4 border-t bg-card/80 backdrop-blur-md z-10">
            <div className="w-full relative inline-flex rounded-full transition-shadow duration-300 hover:shadow-lg hover:shadow-red-500/25">
              <span className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                <span className="absolute -inset-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,rgb(239,68,68)_0deg,rgb(239,68,68)_40deg,transparent_60deg)]" />
              </span>
              <Button 
                className="w-full h-14 relative z-10 m-[2px] rounded-full px-8 text-base font-semibold border-0 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-100" 
                disabled={loading || selected.length === 0 || prompt.trim().length === 0} 
                onClick={runComparison} 
                type="button"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" aria-hidden="true" /> : <GitCompare className="mr-2 h-5 w-5" aria-hidden="true" />}
                Compare profiles
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Panel: Workspace */}
      <div className="relative overflow-hidden rounded-3xl border bg-card transition-all duration-500 hover:shadow-2xl hover:border-primary/50 group flex flex-col h-auto lg:h-[calc(100vh-6rem)] lg:min-h-[700px]">
        <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
          <CardHeader className="px-6 pt-6 pb-4 md:px-8 md:pt-8 bg-card/80 backdrop-blur-md z-10 border-b">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">Comparison Results</CardTitle>
                <CardDescription className="mt-1">Review responses and compare token metrics side by side.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                 <GitCompare className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
            {error ? <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive mb-6">{error}</p> : null}
            {loading ? <ComparisonSkeleton /> : null}
            {!loading && result ? (
              <div className="space-y-8 flex flex-col min-h-full">
                <div className="grid gap-4 xl:grid-cols-3 shrink-0">
                  {result.results.map((item) => (
                    <Card key={item.model_id} className="rounded-2xl border bg-background/50 transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/30">
                      <CardHeader className="px-5 pt-5 pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-base font-bold text-foreground">{item.model_name}</CardTitle>
                            <CardDescription className="mt-1 text-xs">{item.model_size}</CardDescription>
                          </div>
                          <Badge variant="outline" className="rounded-md bg-background shadow-sm text-[10px] uppercase tracking-wider">{item.model_id}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <p className="min-h-[120px] rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed text-foreground shadow-inner">{item.output}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="shrink-0 w-full overflow-hidden">
                  <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="font-bold text-foreground">Model</TableHead>
                      <TableHead className="font-bold text-foreground">Size</TableHead>
                      <TableHead className="font-bold text-foreground">Time</TableHead>
                      <TableHead className="font-bold text-foreground">Tokens</TableHead>
                      <TableHead className="font-bold text-foreground">Speed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.results.map((item) => (
                      <TableRow key={item.model_id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-semibold">{item.model_name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.model_size}</TableCell>
                        <TableCell className="font-medium">{item.metrics.generation_time_ms} ms</TableCell>
                        <TableCell className="font-medium">{item.metrics.generated_tokens}</TableCell>
                        <TableCell className="font-medium text-primary">{item.metrics.tokens_per_second}/s</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>

                <div className="rounded-2xl border bg-primary/5 p-6 mt-auto border-primary/20">
                  <p className="text-base font-bold text-foreground flex items-center gap-2">
                    <SearchCheck className="h-5 w-5 text-primary" />
                    Reflection
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.reflection}</p>
                </div>
              </div>
            ) : null}
            {!loading && !result ? (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-background/30 p-8 text-center h-full flex flex-col justify-center items-center group/empty hover:border-primary/40 transition-colors">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-700"></div>
                   <GitCompare className="relative mx-auto h-12 w-12 text-primary opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all duration-500" aria-hidden="true" />
                </div>
                <p className="mt-6 text-lg font-bold text-foreground">No comparison yet</p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground max-w-sm mx-auto">Choose at least one model profile and run the shared prompt to see side-by-side results.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ComparisonSkeleton() {
  return (
    <div className="space-y-8 flex flex-col h-full animate-pulse">
      <div className="grid gap-4 xl:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border bg-background/50 p-5 h-64">
            <div className="flex justify-between mb-4">
              <div className="h-5 bg-muted rounded w-1/2"></div>
              <div className="h-5 bg-muted rounded w-1/4"></div>
            </div>
            <div className="h-32 bg-muted/50 rounded-xl w-full mt-4"></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-card h-32">
         <div className="h-10 bg-muted/30 border-b"></div>
         <div className="h-10 border-b mx-4 mt-2 bg-muted/10"></div>
      </div>
      <div className="rounded-2xl border bg-primary/5 p-6 mt-auto">
        <div className="h-5 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    </div>
  );
}