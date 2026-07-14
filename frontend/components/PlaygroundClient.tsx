"use client";

import { useEffect, useState } from "react";
import { Loader2, Play } from "lucide-react";
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
      .catch(() => undefined);

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
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
        <label className="text-sm font-semibold text-ink" htmlFor="prompt">
          Prompt
        </label>
        <textarea
          className="focus-ring mt-2 min-h-36 w-full rounded-lg border border-line bg-white p-3 text-sm leading-6"
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />

        <label className="mt-5 block text-sm font-semibold text-ink" htmlFor="model">
          Model
        </label>
        <select
          className="focus-ring mt-2 w-full rounded-lg border border-line bg-white p-3 text-sm"
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
        {selectedModel ? (
          <p className="mt-2 text-xs leading-5 text-ink/60">
            {selectedModel.size} - {selectedModel.description}
          </p>
        ) : null}

        <div className="mt-5 grid gap-4">
          <Slider label="Temperature" value={parameters.temperature} min={0} max={1.5} step={0.1} onChange={(value) => updateParameter("temperature", value)} />
          <Slider label="Top P" value={parameters.top_p} min={0.1} max={1} step={0.05} onChange={(value) => updateParameter("top_p", value)} />
          <Slider label="Top K" value={parameters.top_k} min={1} max={100} step={1} onChange={(value) => updateParameter("top_k", value)} />
          <Slider label="Max New Tokens" value={parameters.max_new_tokens} min={16} max={256} step={8} onChange={(value) => updateParameter("max_new_tokens", value)} />
          <Slider label="Repetition Penalty" value={parameters.repetition_penalty} min={1} max={1.4} step={0.01} onChange={(value) => updateParameter("repetition_penalty", value)} />
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm font-medium">
          <input
            checked={parameters.do_sample}
            onChange={(event) => updateParameter("do_sample", event.target.checked)}
            type="checkbox"
          />
          Enable sampling
        </label>

        <button
          className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || prompt.trim().length === 0}
          onClick={runGeneration}
          type="button"
        >
          {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          Generate
        </button>
      </section>

      <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">Generated output</h2>
        {error ? <p className="mt-4 rounded-lg border border-rose/30 bg-rose/5 p-4 text-sm text-rose">{error}</p> : null}
        {result ? (
          <div className="mt-4 space-y-5">
            <p className="rounded-lg border border-line bg-white p-4 leading-7">{result.output}</p>
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Time" value={`${result.metrics.generation_time_ms} ms`} />
              <Metric label="Tokens" value={String(result.metrics.generated_tokens)} />
              <Metric label="Speed" value={`${result.metrics.tokens_per_second}/s`} />
              <Metric label="Device" value={result.metrics.device} />
            </div>
            <div className="rounded-lg border border-teal/30 bg-teal/5 p-4">
              <h3 className="font-semibold text-ink">Why it changed</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">{result.explanation}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-ink/65">Run a prompt to see generated text, metrics, and a parameter reflection.</p>
        )}
      </section>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-medium text-ink">
        {label}
        <span>{value}</span>
      </span>
      <input
        className="mt-2 w-full accent-teal"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-3">
      <p className="text-xs font-semibold uppercase text-ink/55">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}