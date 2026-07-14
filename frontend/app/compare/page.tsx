import { CompareClient } from "@/components/CompareClient";
import { SectionHeader } from "@/components/SectionHeader";

export default function ComparePage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeader
        eyebrow="Compare"
        title="Evaluate model behavior side by side."
        description="Run one prompt through multiple model profiles, review their responses, and compare size, speed, and token metrics in a clean dashboard view."
      />
      <CompareClient />
    </div>
  );
}