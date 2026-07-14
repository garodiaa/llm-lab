import type { ModelInfo } from "@/types/api";

export const fallbackModels: ModelInfo[] = [
  {
    id: "tiny-lab",
    name: "Tiny Lab Model",
    size: "125M parameters",
    description: "Fast profile for teaching token flow and latency tradeoffs.",
    default: true
  },
  {
    id: "balanced-lab",
    name: "Balanced Lab Model",
    size: "350M parameters",
    description: "Middle profile with steadier wording and moderate latency.",
    default: false
  },
  {
    id: "creative-lab",
    name: "Creative Lab Model",
    size: "760M parameters",
    description: "Exploratory profile that emphasizes sampling differences.",
    default: false
  }
];

export function getDefaultModelId(models: ModelInfo[]) {
  return models.find((model) => model.default)?.id ?? models[0]?.id ?? "tiny-lab";
}
