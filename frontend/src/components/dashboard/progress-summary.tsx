"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";
import { ProgressSummaryInfo } from "@/types/progress";

interface ProgressSummaryProps {
  summary: ProgressSummaryInfo;
}

export default function ProgressSummary({ summary }: ProgressSummaryProps) {
  const { totalSolved, easySolved, mediumSolved, hardSolved } = summary;

  // Let's assume baseline benchmarks for the total targets in the current tier
  const easyTarget = 150;
  const mediumTarget = 250;
  const hardTarget = 100;
  const totalTarget = easyTarget + mediumTarget + hardTarget;

  const easyPercent = easyTarget > 0 ? (easySolved / easyTarget) * 100 : 0;
  const mediumPercent = mediumTarget > 0 ? (mediumSolved / mediumTarget) * 100 : 0;
  const hardPercent = hardTarget > 0 ? (hardSolved / hardTarget) * 100 : 0;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-border/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Topic Progress
        </CardTitle>
        <Award size={18} className="text-emerald-400" />
      </CardHeader>
      <CardContent className="space-y-5 py-2">
        {/* Metric Overview */}
        <div>
          <div className="text-4xl font-extrabold text-foreground flex items-baseline gap-1">
            {totalSolved}
            <span className="text-sm font-semibold text-muted-foreground">solved</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total unique coding accomplishments</p>
        </div>

        {/* Row Mappings */}
        <div className="space-y-3">
          {/* Easy Row */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-400">Easy</span>
              <span className="text-muted-foreground">{easySolved} / {easyTarget}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(easyPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Medium Row */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-amber-400">Medium</span>
              <span className="text-muted-foreground">{mediumSolved} / {mediumTarget}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(mediumPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Hard Row */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-rose-500">Hard</span>
              <span className="text-muted-foreground">{hardSolved} / {hardTarget}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(hardPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
