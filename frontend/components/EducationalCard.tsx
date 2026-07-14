import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShineBorder } from "@/components/ui/shine-border";

const toneLabels = {
  info: "Concept",
  tip: "Tip",
  warning: "Watch",
  challenge: "Try"
};

type EducationalCardProps = {
  title: string;
  tone?: "info" | "tip" | "warning" | "challenge";
  children: ReactNode;
};

export function EducationalCard({ title, tone = "info", children }: EducationalCardProps) {
  return (
    <div className="relative border bg-card w-full h-full transition-shadow duration-200 hover:shadow-md">
      <div className="corner-marker -left-1.5 -top-1.5" />
      <div className="corner-marker -bottom-1.5 -left-1.5" />
      <div className="corner-marker -right-1.5 -top-1.5" />
      <div className="corner-marker -bottom-1.5 -right-1.5" />
      <Card className="border-0 shadow-none bg-transparent h-full">
        <CardHeader className="pb-3">
          <Badge variant={tone === "warning" ? "destructive" : "secondary"} className="w-fit rounded-md px-2 py-1 text-xs">
            {toneLabels[tone]}
          </Badge>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">{children}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}