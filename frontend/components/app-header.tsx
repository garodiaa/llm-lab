"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/playground", label: "Playground" },
  { href: "/compare", label: "Compare" },
  { href: "/visualizer", label: "Visualizer" },
  { href: "/learn", label: "Learn" }
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-40 shrink-0 overflow-hidden">
            <Image src="/llllablogo.png" alt="LLM Lab Logo" fill className="object-contain object-left dark:hidden" />
            <Image src="/llmlablogodark.png" alt="LLM Lab Logo" fill className="hidden object-contain object-left dark:block" />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-foreground text-background hover:bg-foreground hover:text-background"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden gap-1.5 rounded-md border-primary/20 bg-primary/10 px-3 py-1.5 text-primary lg:inline-flex">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Mock backend online
          </Badge>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="outline" aria-label="Open navigation">
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>LLM Lab</SheetTitle>
                <SheetDescription>Navigate the inference learning workspace.</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      className={cn(
                        "rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        active && "bg-foreground text-background hover:bg-foreground hover:text-background"
                      )}
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}