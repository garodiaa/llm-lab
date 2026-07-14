import { BookOpen, BrainCircuit, Boxes, Code2, MessageSquareText, Network, Shuffle, Sparkles } from "lucide-react";
import { EducationalCard } from "@/components/EducationalCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const topics = [
  { title: "What is an LLM?", text: "A language model predicts likely next tokens from patterns learned during training.", icon: BrainCircuit },
  { title: "What is tokenization?", text: "Tokenization splits text into pieces the model vocabulary can represent.", icon: Boxes },
  { title: "What are token IDs?", text: "IDs are numeric vocabulary indexes that let text become tensors.", icon: Code2 },
  { title: "What is attention?", text: "Attention helps the model weigh relationships between tokens while processing context.", icon: Network },
  { title: "What is sampling?", text: "Sampling chooses the next token from probabilities shaped by temperature, top-p, and top-k.", icon: Shuffle },
  { title: "What is decoding?", text: "Decoding converts generated token IDs back into readable text.", icon: MessageSquareText }
];

export default function LearnPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeader
        eyebrow="Learn"
        title="Build intuition before diving deeper."
        description="A compact reference for the concepts that appear throughout the lab, written for beginners and designed for quick scanning."
      />

      <Card>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Badge className="rounded-md" variant="secondary">Recommended path</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Read a concept, then test it immediately.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Each idea here maps directly to a workflow in the Playground, Compare, or Visualizer page. The fastest way to learn is to move between explanation and experiment.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Start", "Read a short concept."],
              ["2", "Run", "Try it in a lab."],
              ["3", "Reflect", "Connect result to mechanism."]
            ].map(([number, title, text]) => (
              <div className="rounded-lg border bg-background p-4" key={number}>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">{number}</span>
                <p className="mt-4 font-medium">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.title} className="hover:-translate-y-0.5">
              <CardHeader>
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg border bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{topic.title}</CardTitle>
                <CardDescription>{topic.text}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <EducationalCard title="Keep it small" tone="tip">Short prompts make the pipeline easier to inspect while learning tokenization and IDs.</EducationalCard>
        <EducationalCard title="Compare one variable" tone="challenge">Change one parameter at a time so the output difference has a clear cause.</EducationalCard>
        <EducationalCard title="Use the visualizer" tone="info">When an output feels mysterious, inspect the prompt flow to reconnect text with model inputs.</EducationalCard>
      </section>

      <Card>
        <CardContent className="flex items-start gap-4 p-6">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Learning-first rule</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Whenever LLM Lab shows a result, it should also explain why the result happened. This keeps the product focused on understanding, not just generation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}