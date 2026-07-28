import { VisualizerClient } from "@/components/VisualizerClient";

import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Inference Visualizer' };

export default function VisualizerPage() {
  return (
    <div className="page-shell space-y-8">
      <VisualizerClient />
    </div>
  );
}
