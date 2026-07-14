import { EducationalCard } from "@/components/EducationalCard";
import { SectionHeader } from "@/components/SectionHeader";

const topics = [
  ["What is an LLM?", "A language model predicts likely next tokens from patterns learned during training."],
  ["What is tokenization?", "Tokenization splits text into pieces the model vocabulary can represent."],
  ["What are token IDs?", "IDs are numeric vocabulary indexes that let text become tensors."],
  ["What is sampling?", "Sampling chooses the next token from model probabilities, often shaped by temperature, top-p, and top-k."],
  ["What is decoding?", "Decoding converts generated token IDs back into readable text."]
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <SectionHeader
        eyebrow="Learn"
        title="Short explanations for the core ideas."
        description="Use this section as a lightweight reference while experimenting in the lab pages."
      />
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {topics.map(([title, text]) => (
          <EducationalCard key={title} title={title}>
            {text}
          </EducationalCard>
        ))}
      </section>
    </div>
  );
}
