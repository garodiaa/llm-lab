export type GenerationParameters = {
  temperature: number;
  top_p: number;
  top_k: number;
  max_new_tokens: number;
  repetition_penalty: number;
  do_sample: boolean;
};

export type ModelInfo = {
  id: string;
  name: string;
  size: string;
  description: string;
  default: boolean;
};

export type GenerateResponse = {
  model_id: string;
  output: string;
  explanation: string;
  metrics: {
    generation_time_ms: number;
    generated_tokens: number;
    tokens_per_second: number;
    device: string;
  };
};

export type CompareResponse = {
  prompt: string;
  results: Array<GenerateResponse & { model_name: string; model_size: string }>;
  reflection: string;
};

export type VisualizeStep = {
  name: string;
  value: string;
  explanation: string;
  code?: string;
};

export type VisualizeResponse = {
  prompt: string;
  steps: VisualizeStep[];
};
