import { NextRequest, NextResponse } from "next/server";
import { hf } from "@/lib/hf-client";
import { getModel } from "@/lib/model-catalog.server";

type GenerationParameters = {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_new_tokens?: number;
  repetition_penalty?: number;
  do_sample?: boolean;
};

type CompareBody = {
  prompt: string;
  model_ids?: string[];
  parameters?: GenerationParameters;
};

async function generateForModel(
  prompt: string,
  modelId: string,
  parameters: GenerationParameters
) {
  const modelInfo = getModel(modelId);
  const hfModelId = modelInfo.hf_model_id;

  const params = {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    max_new_tokens: 80,
    repetition_penalty: 1.05,
    do_sample: true,
    ...parameters,
  };

  const startTime = performance.now();

  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: hfModelId,
      messages: [{ role: "user", content: prompt }],
      max_tokens: params.max_new_tokens,
      temperature: params.do_sample ? params.temperature : 0.01,
      top_p: params.do_sample ? params.top_p : undefined,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || err.error || `HTTP ${response.status}`);
  }

  const result = await response.json();

  const endTime = performance.now();
  const generationTimeMs = Math.round(endTime - startTime);
  const generatedText = result.choices[0]?.message?.content ?? "";
  const usage = result.usage;
  const generatedTokens = usage?.completion_tokens
    ?? Math.max(1, Math.round(generatedText.length / 4));
  const tokensPerSecond =
    generationTimeMs > 0
      ? Math.round((generatedTokens / (generationTimeMs / 1000)) * 100) / 100
      : 0;

  const explanation =
    `Generated using ${modelInfo.name} (${hfModelId}) via Hugging Face Inference API. ` +
    `Temperature ${params.temperature} and top-p ${params.top_p} shaped the sampling. ` +
    `A max token limit of ${params.max_new_tokens} capped the response.`;

  return {
    model_id: modelId,
    model_name: modelInfo.name,
    model_size: modelInfo.size,
    output: generatedText,
    explanation,
    metrics: {
      generation_time_ms: generationTimeMs,
      generated_tokens: generatedTokens,
      tokens_per_second: tokensPerSecond,
      device: "hf-inference-api",
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompareBody;
    const {
      prompt,
      model_ids = ["tiny-lab", "balanced-lab"],
      parameters = {},
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Run all models in parallel for faster comparison
    const results = await Promise.all(
      model_ids.map((modelId) => generateForModel(prompt, modelId, parameters))
    );

    return NextResponse.json({
      prompt,
      results,
      reflection:
        "Different models change speed, wording, and apparent creativity because each uses " +
        "different internal weights and architectures, even with the same parameters.",
    });
  } catch (error) {
    console.error("Compare error:", error);
    const message =
      error instanceof Error ? error.message : "Comparison failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
