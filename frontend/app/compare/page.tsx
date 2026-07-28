import { CompareClient } from "@/components/CompareClient";

import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Compare Models' };

export default function ComparePage() {
  return (
    <div className="page-shell space-y-8">
      <CompareClient />
    </div>
  );
}
