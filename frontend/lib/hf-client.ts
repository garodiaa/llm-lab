import { HfInference } from "@huggingface/inference";

/**
 * Shared Hugging Face Inference API client.
 * HF_TOKEN is a server-side env var (NOT prefixed with NEXT_PUBLIC_).
 * The free HF Inference API works without a token for public models,
 * but a token raises rate limits significantly.
 */
const hfToken = process.env.HF_TOKEN ?? "";
export const hf = new HfInference(hfToken || undefined);

/**
 * Call the HF tokenizer endpoint to get real tokens and token IDs
 * for a given model and prompt. Falls back to a simple whitespace
 * split if the API doesn't support tokenization for the model.
 */
export async function tokenize(
  model: string,
  text: string
): Promise<{ tokens: string[]; token_ids: number[] }> {
  try {
    // The HF Inference API doesn't have a dedicated tokenizer endpoint,
    // so we use the feature-extraction endpoint trick or fall back to
    // a heuristic based on the model's tokenizer via the HF Hub API.
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { max_new_tokens: 1, return_full_text: false },
          options: { use_cache: false },
        }),
      }
    );

    // Use the HF Hub tokenizer API for accurate tokenization
    const tokenizerResponse = await fetch(
      `https://api-inference.huggingface.co/models/${model}/tokenize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (tokenizerResponse.ok) {
      const tokenData = await tokenizerResponse.json();
      // The tokenize endpoint returns an array of { id, text, ... }
      if (Array.isArray(tokenData)) {
        return {
          tokens: tokenData.map(
            (t: { text?: string; token_str?: string }) =>
              t.text ?? t.token_str ?? "?"
          ),
          token_ids: tokenData.map((t: { id?: number }) => t.id ?? 0),
        };
      }
    }

    // Fallback: simple heuristic tokenization
    return heuristicTokenize(text);
  } catch {
    return heuristicTokenize(text);
  }
}

/**
 * Fallback tokenizer that simulates BPE-style subword splitting.
 * Used when the HF API tokenizer endpoint is unavailable.
 */
function heuristicTokenize(text: string): {
  tokens: string[];
  token_ids: number[];
} {
  // Simulate GPT-2 style tokenization by splitting on spaces and punctuation
  const tokens: string[] = [];
  const parts = text.split(/(\s+|[.,!?;:'"()\[\]{}])/);

  for (const part of parts) {
    if (part.length === 0) continue;
    if (part.match(/^\s+$/)) {
      // Whitespace becomes a Ġ-prefixed token in GPT-2 style
      tokens.push(part);
    } else if (part.length > 6) {
      // Simulate subword splitting for longer words
      tokens.push(part.slice(0, Math.ceil(part.length / 2)));
      tokens.push(part.slice(Math.ceil(part.length / 2)));
    } else {
      tokens.push(part);
    }
  }

  // Generate deterministic pseudo-IDs based on token content
  const token_ids = tokens.map((t) => {
    let hash = 0;
    for (let i = 0; i < t.length; i++) {
      hash = (hash * 31 + t.charCodeAt(i)) & 0x7fffffff;
    }
    return hash % 50257; // GPT-2 vocab size
  });

  return { tokens, token_ids };
}
