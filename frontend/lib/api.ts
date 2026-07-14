import type {
  CompareResponse,
  GenerateResponse,
  GenerationParameters,
  ModelInfo,
  VisualizeResponse
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getModels() {
  return request<{ models: ModelInfo[] }>("/models");
}

export function generateText(prompt: string, modelId: string, parameters: GenerationParameters) {
  return request<GenerateResponse>("/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, model_id: modelId, parameters })
  });
}

export function compareModels(prompt: string, modelIds: string[], parameters: GenerationParameters) {
  return request<CompareResponse>("/compare", {
    method: "POST",
    body: JSON.stringify({ prompt, model_ids: modelIds, parameters })
  });
}

export function visualizeInference(prompt: string, modelId: string) {
  return request<VisualizeResponse>("/visualize", {
    method: "POST",
    body: JSON.stringify({ prompt, model_id: modelId })
  });
}
