"use client";

import { useState } from "react";
import { Loader2, Workflow } from "lucide-react";
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
    <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <input
          className="focus-ring rounded-lg border border-line bg-white p-3 text-sm"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-teal disabled:opacity-60"
          disabled={loading || prompt.trim().length === 0}
          onClick={runVisualization}
          type="button"
        >
          {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Workflow size={18} aria-hidden="true" />}
          Visualize
        </button>
      </div>
      {error ? <p className="mt-4 rounded-lg border border-rose/30 bg-rose/5 p-4 text-sm text-rose">{error}</p> : null}
      {result ? (
        <div className="mt-6 grid gap-4">
          {result.steps.map((step, index) => (
            <article className="rounded-lg border border-line bg-white p-4" key={step.name}>
              <p className="text-xs font-semibold uppercase text-teal">Step {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{step.name}</h2>
              <p className="mt-3 rounded-lg bg-paper p-3 font-mono text-sm text-ink">{step.value}</p>
              <p className="mt-3 text-sm leading-6 text-ink/70">{step.explanation}</p>
              {step.code ? <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-3 text-sm text-paper">{step.code}</pre> : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-ink/65">Visualize a prompt to inspect tokenization, IDs, tensor shape, attention mask, and decoding.</p>
      )}
    </section>
  );
}
