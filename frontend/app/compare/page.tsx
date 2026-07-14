import { CompareClient } from "@/components/CompareClient";
import { SectionHeader } from "@/components/SectionHeader";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <SectionHeader
        eyebrow="Compare"
        title="Run one prompt through multiple model profiles."
        description="Compare outputs, timing, size, and token counts side by side, then read a reflection about why the responses may diverge."
      />
      <div className="mt-8">
        <CompareClient />
      </div>
    </div>
  );
}
