/**
 * Server-side model catalog.
 * Mirrors backend/models/catalog.py for use in Next.js API routes.
 */

export type ServerModelInfo = {
  id: string;
  name: string;
  hf_model_id: string;
  size: string;
  description: string;
  default: boolean;
};

export const MODEL_CATALOG: ServerModelInfo[] = [
  {
    id: "tiny-lab",
    name: "Tiny Lab Model",
    hf_model_id: "Qwen/Qwen2.5-7B-Instruct",
    size: "7B parameters",
    description:
      "Fast profile for teaching token flow and latency tradeoffs.",
    default: true,
  },
  {
    id: "balanced-lab",
    name: "Balanced Lab Model",
    hf_model_id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    size: "32B parameters",
    description:
      "Middle profile with steadier wording and moderate latency.",
    default: false,
  },
  {
    id: "creative-lab",
    name: "Creative Lab Model",
    hf_model_id: "Qwen/Qwen2.5-72B-Instruct",
    size: "72B parameters",
    description:
      "Exploratory profile that emphasizes sampling differences.",
    default: false,
  },
];

export function getModel(modelId: string): ServerModelInfo {
  return MODEL_CATALOG.find((m) => m.id === modelId) ?? MODEL_CATALOG[0];
}
