"use client";

import { useEffect, useState } from "react";
import { GitCompare, Loader2 } from "lucide-react";
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
      .catch(() => undefined);

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
    <div className="rounded-lg border border-line bg-panel p-5 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <textarea
          className="focus-ring min-h-28 rounded-lg border border-line bg-white p-3 text-sm leading-6"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div className="rounded-lg border border-line bg-white p-4">
          <p className="text-sm font-semibold text-ink">Models</p>
          <div className="mt-3 grid gap-3">
            {models.map((model) => (
              <label className="flex items-start gap-2 text-sm" key={model.id}>
                <input
                  checked={selected.includes(model.id)}
                  className="mt-1"
                  onChange={() => toggleModel(model.id)}
                  type="checkbox"
                />
                <span>
                  <span className="block font-medium text-ink">{model.name}</span>
                  <span className="block text-xs leading-5 text-ink/60">{model.size}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading || selected.length === 0 || prompt.trim().length === 0}
        onClick={runComparison}
        type="button"
      >
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <GitCompare size={18} aria-hidden="true" />}
        Compare
      </button>

      {error ? <p className="mt-4 rounded-lg border border-rose/30 bg-rose/5 p-4 text-sm text-rose">{error}</p> : null}
      {result ? (
        <div className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.results.map((item) => (
              <article className="rounded-lg border border-line bg-white p-4" key={item.model_id}>
                <p className="text-sm font-semibold text-teal">{item.model_name}</p>
                <p className="mt-1 text-xs uppercase text-ink/50">{item.model_size}</p>
                <p className="mt-4 min-h-28 text-sm leading-6 text-ink/75">{item.output}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-ink/65">
                  <span>{item.metrics.generation_time_ms} ms</span>
                  <span>{item.metrics.generated_tokens} tokens</span>
                  <span>{item.metrics.tokens_per_second}/s</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 rounded-lg border border-amber/30 bg-amber/5 p-4 text-sm leading-6 text-ink/70">{result.reflection}</p>
        </div>
      ) : null}
    </div>
  );
}