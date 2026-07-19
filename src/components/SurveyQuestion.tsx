import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveyQuestionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  step: number;
  totalSteps: number;
}

function SurveyQuestion({ title, description, children, className, step, totalSteps }: SurveyQuestionProps) {
  return (
    <Card className={cn("w-full max-w-xl mx-auto border-border/50 shadow-lg", className)}>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg font-semibold">{title}</CardTitle>
          <span class="text-xs text-muted-foreground font-medium tabular-nums">{step + 1}/{totalSteps}</span>
        </div>
        {description && <p class="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent class="space-y-4">{children}</CardContent>
    </Card>
  );
}

export { SurveyQuestion };
