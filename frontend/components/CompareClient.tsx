"use client";

import { useEffect, useState } from "react";
import { GitCompare, Loader2, SearchCheck } from "lucide-react";
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Comparison setup</CardTitle>
              <CardDescription>Run one prompt through selected profiles and compare output behavior.</CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit rounded-md">{selected.length} selected</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-2">
            <Label htmlFor="compare-prompt">Shared prompt</Label>
            <Textarea id="compare-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            <p className="text-xs text-muted-foreground">The same prompt is sent to every selected model profile.</p>
          </div>
          <div className="space-y-3">
            <Label>Model profiles</Label>
            <div className="grid gap-3">
              {models.map((model) => (
                <label className="flex items-start gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/40" key={model.id}>
                  <input
                    checked={selected.includes(model.id)}
                    className="mt-1 h-4 w-4 accent-primary"
                    onChange={() => toggleModel(model.id)}
                    type="checkbox"
                  />
                  <span>
                    <span className="block text-sm font-medium">{model.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{model.size} - {model.description}</span>
                  </span>
                </label>
              ))}
              {modelsLoading ? <Skeleton className="h-16 w-full" /> : null}
            </div>
            <Button
              className="w-full"
              disabled={loading || selected.length === 0 || prompt.trim().length === 0}
              onClick={runComparison}
              type="button"
            >
              {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <GitCompare aria-hidden="true" />}
              Compare profiles
            </Button>
          </div>
        </CardContent>
      </Card>

      {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</p> : null}
      {loading ? <ComparisonSkeleton /> : null}
      {!loading && result ? (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-3">
            {result.results.map((item) => (
              <Card key={item.model_id} className="hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">{item.model_name}</CardTitle>
                      <CardDescription>{item.model_size}</CardDescription>
                    </div>
                    <Badge variant="outline" className="rounded-md">{item.metrics.device}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="min-h-32 rounded-lg border bg-muted/25 p-4 text-sm leading-7">{item.output}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Speed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.results.map((item) => (
                <TableRow key={item.model_id}>
                  <TableCell className="font-medium">{item.model_name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.model_size}</TableCell>
                  <TableCell>{item.metrics.generation_time_ms} ms</TableCell>
                  <TableCell>{item.metrics.generated_tokens}</TableCell>
                  <TableCell>{item.metrics.tokens_per_second}/s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border bg-primary/10 text-primary">
                <SearchCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium">Reflection</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.reflection}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
      {!loading && !result ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <GitCompare className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
            <p className="mt-4 font-medium">No comparison yet</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose at least one model profile and run the shared prompt.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ComparisonSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  );
}