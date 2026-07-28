import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://llm-lab.vercel.app"),
  title: {
    default: "LLM Lab — Interactive Inference Learning Platform",
    template: "%s | LLM Lab"
  },
  description: "An interactive, visual learning platform designed to demystify Large Language Models (LLMs) and teach the mechanics of text generation, tokenization, and attention.",
  keywords: ["LLM", "Large Language Models", "AI", "Inference", "Machine Learning", "Tokenization", "Transformers", "Education"],
  authors: [{ name: "Sourav Garodia", url: "https://garodia.me" }],
  creator: "Sourav Garodia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://llm-lab.vercel.app",
    title: "LLM Lab — Interactive Inference Learning Platform",
    description: "An interactive, visual learning platform designed to demystify Large Language Models (LLMs).",
    siteName: "LLM Lab",
    images: [
      {
        url: "/llllablogo.png",
        width: 800,
        height: 600,
        alt: "LLM Lab Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Lab — Interactive Inference Learning Platform",
    description: "An interactive, visual learning platform designed to demystify Large Language Models (LLMs).",
    images: ["/llllablogo.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <footer className="w-full py-8 mt-auto border-t bg-card text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            © 2026 Developed By <a href="https://garodia.me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold transition-all hover:text-red-500">Sourav Garodia</a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}