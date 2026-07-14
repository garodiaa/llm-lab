import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Lab",
  description: "Interactive lessons for understanding LLM inference."
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" },
  { href: "/compare", label: "Compare" },
  { href: "/visualizer", label: "Visualizer" },
  { href: "/learn", label: "Learn" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-line bg-panel/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-paper">
                <FlaskConical aria-hidden="true" size={22} />
              </span>
              <span>
                <span className="block text-lg font-semibold">LLM Lab</span>
                <span className="block text-sm text-ink/65">Inference, made inspectable</span>
              </span>
            </Link>
            <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink/75 transition hover:border-teal hover:text-teal"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
