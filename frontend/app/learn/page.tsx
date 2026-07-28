import { BookOpen, BrainCircuit, Boxes, Code2, MessageSquareText, Network, Shuffle, Sparkles, Zap, KeyRound } from "lucide-react";
import { EducationalCard } from "@/components/EducationalCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EvervaultBackground } from "@/components/ui/evervault-card";
import { CircleScribble } from "@/components/ui/circle-scribble";
import Link from "next/link";

const topics = [
  {
    title: "What is an LLM?",
    icon: BrainCircuit,
    content: (
      <div className="space-y-4">
        <p>
          At its core, a Large Language Model (LLM) is an incredibly complex pattern-matching engine. It does not "think" or "know" facts in the human sense. Instead, it predicts the <strong className="text-foreground">most statistically probable next token</strong> based on the massive amounts of text it digested during training.
        </p>
        <p>
          Imagine playing autocomplete on your phone, but scaled up to billions of parameters. By seeing a sequence of tokens, the neural network calculates a probability distribution across its entire vocabulary to determine what comes next.
        </p>
      </div>
    )
  },
  {
    title: "What is tokenization?",
    icon: Boxes,
    content: (
      <div className="space-y-4">
        <p>
          Models cannot read raw letters or strings. Before text enters the model, a <strong>Tokenizer</strong> chops it into smaller chunks called tokens. A token might be a single character, a prefix, or a whole word.
        </p>
        <p>
          Most modern models use Byte-Pair Encoding (BPE), which merges frequently occurring characters into single tokens to save space. Notably, spaces are often attached to the beginning of words (like the <code className="bg-muted px-1.5 py-0.5 rounded text-primary">Ġ</code> token in GPT-2) so the model knows where words begin and end.
        </p>
      </div>
    )
  },
  {
    title: "What are token IDs?",
    icon: Code2,
    content: (
      <div className="space-y-4">
        <p>
          Once the text is chopped into tokens, each unique token is mapped to an integer called a <strong>Token ID</strong>. This mapping is defined by the model's fixed Vocabulary.
        </p>
        <p>
          For example, the token <code>" hello"</code> might map to ID <code>31414</code>. These IDs are then packed into mathematical grids called PyTorch Tensors. If we batch multiple prompts together, shorter sequences are padded with a special padding token (often ID <code>50256</code>) so the tensor remains a perfect rectangle.
        </p>
      </div>
    )
  },
  {
    title: "What is attention?",
    icon: Network,
    content: (
      <div className="space-y-4">
        <p>
          The secret sauce of modern LLMs is the <strong>Self-Attention Mechanism</strong>. As the model processes a sequence of tokens, attention allows it to weigh the importance of every single token against every other token in the context window.
        </p>
        <p>
          This is how a model resolves ambiguity. If it reads "The bank of the river", attention heavily connects "bank" to "river", ignoring the financial definition of "bank". We also use an <strong>Attention Mask</strong> (1s and 0s) to tell the model to ignore artificial padding tokens.
        </p>
      </div>
    )
  },
  {
    title: "What is sampling?",
    icon: Shuffle,
    content: (
      <div className="space-y-4">
        <p>
          When the model predicts the next token, it produces a list of probabilities (logits). <strong>Sampling</strong> is the algorithm used to pick the winning token.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
          <li><strong>Temperature:</strong> Controls randomness. Higher values flatten the probabilities, making unexpected tokens more likely.</li>
          <li><strong>Top-K:</strong> Restricts the choice to only the top K most likely tokens, cutting off the long tail of weird words.</li>
          <li><strong>Top-P:</strong> Restricts the choice to a dynamic pool of tokens whose combined probability reaches P (e.g. 0.9).</li>
        </ul>
      </div>
    )
  },
  {
    title: "What is decoding?",
    icon: MessageSquareText,
    content: (
      <div className="space-y-4">
        <p>
          Once a token ID is sampled, the generation loop isn't finished. That ID must be appended to the input sequence, and the entire sequence is fed back into the model to predict the <em>next</em> token. This is why it's called <strong>autoregressive</strong> generation.
        </p>
        <p>
          Simultaneously, the new ID is passed back through the Tokenizer in reverse—a process called <strong>Decoding</strong>—to translate the number back into human-readable text on your screen.
        </p>
      </div>
    )
  }
];

import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Learn' };

export default function LearnPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <EvervaultBackground className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 bg-background/50 backdrop-blur-md border-primary/20 text-primary font-medium">
            Knowledge Base
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15]">
            Build <span className="relative inline-flex items-center justify-center px-4 py-2 mx-1">
              <span className="relative z-10 text-primary">intuition</span>
              <svg className="absolute inset-0 size-full text-primary/30 -z-10 scale-[1.3] -rotate-2" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor" />
              </svg>
            </span> before <br className="hidden md:block" />
            diving deeper.
          </h1>
          <p className="mt-8 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            A comprehensive reference for the concepts that appear throughout the lab. Written for beginners, designed for deep understanding.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-24">
        
        {/* Quick Start Guide */}
        <section>
          <Card className="rounded-3xl border-primary/20 bg-card overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
            <CardContent className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[1fr_1.5fr] lg:items-center">
              <div>
                <Badge className="rounded-md mb-4 bg-primary text-primary-foreground">Recommended Path</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Read a concept, then test it immediately.</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Each idea here maps directly to a workflow in the Playground, Compare, or Visualizer page. The absolute fastest way to build an intuitive understanding of AI is to move seamlessly between reading an explanation and running an experiment.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["1", "Start", "Read a short concept here."],
                  ["2", "Run", "Try it out in a lab."],
                  ["3", "Reflect", "Connect the result to the math."]
                ].map(([number, title, text]) => (
                  <div className="rounded-2xl border bg-background/80 backdrop-blur-md p-6 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/30" key={number}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary mb-4">{number}</span>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Topics Grid */}
        <section>
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Core Concepts</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">The fundamental building blocks of Large Language Models.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <EducationalCard key={topic.title} title={topic.title} tone="info" hideIcon={true}>
                {topic.content}
              </EducationalCard>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="pt-8 border-t">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Experimentation Rules</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <EducationalCard title="Keep it small" tone="tip">
              Short prompts (1-2 words) make the pipeline vastly easier to inspect when learning tokenization, tensor shapes, and attention masks.
            </EducationalCard>
            <EducationalCard title="Isolate variables" tone="challenge">
              When comparing models, change exactly one generation parameter at a time so the difference in output has a clear, identifiable cause.
            </EducationalCard>
            <EducationalCard title="Inspect the trace" tone="warning">
              When an output feels mysterious, don't guess. Use the <Link href="/visualizer" className="text-primary hover:underline font-medium">Visualizer</Link> to trace the exact tensor shapes and probability logits.
            </EducationalCard>
          </div>
        </section>
      </div>
    </div>
  );
}
