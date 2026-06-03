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
    <Card className="border-zinc-900 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
          Daily Goal
        </CardTitle>
        <Target size={16} className="text-emerald-400" />
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 py-2">
        {/* Metric Details */}
        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
            {completed}
            <span className="text-sm font-semibold text-zinc-500">/ {target} solved</span>
          </div>
          <p className="text-xs text-zinc-400">
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
              className="stroke-zinc-800 fill-transparent"
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
          <span className="absolute text-sm font-black text-white">{percentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
