import { SectionHeader } from "@/components/SectionHeader";
import { VisualizerClient } from "@/components/VisualizerClient";

export default function VisualizerPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <SectionHeader
        eyebrow="Inspect"
        title="Follow the inference pipeline step by step."
        description="Start with text, then inspect tokens, token IDs, tensors, attention masks, model output IDs, and decoded text."
      />
      <div className="mt-8">
        <VisualizerClient />
      </div>
    </div>
  );
}
