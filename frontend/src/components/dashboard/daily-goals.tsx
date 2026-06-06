"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy } from "lucide-react";

interface DailyGoalsProps {
  completed: number;
  target: number;
}

export default function DailyGoals({ completed, target }: DailyGoalsProps) {
  const percentage = target > 0 ? Math.min(Math.round((completed / target) * 100), 100) : 0;
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-border/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Daily Goal
        </CardTitle>
        <Target size={16} className="text-emerald-400" />
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 py-2">
        {/* Metric Details */}
        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
            {completed}
            <span className="text-sm font-semibold text-muted-foreground">/ {target} solved</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {percentage >= 100 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Trophy size={12} />
                Daily goal achieved!
              </span>
            ) : (
              <span>Solve {target - completed} more to keep streak</span>
            )}
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center h-20 w-20">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r="36"
              className="stroke-muted fill-transparent"
              strokeWidth="6"
            />
            {/* Active arc */}
            <circle
              cx="40"
              cy="40"
              r="36"
              className="stroke-emerald-400 fill-transparent transition-all duration-500 ease-out"
              strokeWidth="6"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-sm font-black text-foreground">{percentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
