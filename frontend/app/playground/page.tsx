import { EducationalCard } from "@/components/EducationalCard";
import { PlaygroundClient } from "@/components/PlaygroundClient";
import { SectionHeader } from "@/components/SectionHeader";

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <SectionHeader
        eyebrow="Experiment"
        title="Generation playground"
        description="Adjust sampling parameters and inspect how they influence generated text, latency, token count, and the explanation beside the result."
      />
      <div className="mt-8">
        <PlaygroundClient />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <EducationalCard title="Temperature">
          Higher values make the sampler more willing to pick surprising tokens. Lower values make output more predictable.
        </EducationalCard>
        <EducationalCard title="Top P" tone="tip">
          Top-p keeps the smallest set of likely tokens whose probability mass reaches the chosen threshold.
        </EducationalCard>
        <EducationalCard title="Top K" tone="challenge">
          Top-k limits each choice to a fixed number of likely next tokens before sampling happens.
        </EducationalCard>
      </div>
    </div>
  );
}
