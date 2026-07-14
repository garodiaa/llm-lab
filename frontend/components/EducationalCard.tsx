import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card>
      <CardHeader className="pb-3">
        <Badge variant={tone === "warning" ? "destructive" : "secondary"} className="w-fit rounded-md">
          {toneLabels[tone]}
        </Badge>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{children}</CardDescription>
      </CardContent>
    </Card>
  );
}