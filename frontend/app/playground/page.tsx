import { EducationalCard } from "@/components/EducationalCard";
import { PlaygroundClient } from "@/components/PlaygroundClient";

import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Playground' };

export default function PlaygroundPage() {
  return (
    <div className="page-shell space-y-8">
      <PlaygroundClient />
      <div className="grid gap-4 md:grid-cols-3">
        <EducationalCard title="Temperature">Higher values make the sampler more willing to pick surprising tokens. Lower values make output more predictable.</EducationalCard>
        <EducationalCard title="Top P" tone="tip">Top-p keeps the smallest likely token set whose probability mass reaches the chosen threshold.</EducationalCard>
        <EducationalCard title="Top K" tone="challenge">Top-k limits each choice to a fixed number of likely next tokens before sampling happens.</EducationalCard>
      </div>
    </div>
  );
}
