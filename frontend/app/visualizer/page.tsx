import { SectionHeader } from "@/components/SectionHeader";
import { VisualizerClient } from "@/components/VisualizerClient";

export default function VisualizerPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeader
        eyebrow="Inspect"
        title="Trace the inference pipeline."
        description="Follow a prompt as it becomes tokens, IDs, tensors, attention masks, generated IDs, and decoded output."
      />
      <VisualizerClient />
    </div>
  );
}