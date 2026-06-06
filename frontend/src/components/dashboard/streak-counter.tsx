"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, ShieldAlert } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export default function StreakCounter({
  currentStreak,
  longestStreak,
  lastActiveDate,
}: StreakCounterProps) {
  // Check if active today
  const isActiveToday = lastActiveDate
    ? new Date(lastActiveDate).toDateString() === new Date().toDateString()
    : false;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-border/80 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Active Streak
        </CardTitle>
        <Flame
          size={18}
          className={`transition-all ${
            currentStreak > 0
              ? "text-orange-500 fill-orange-500 animate-bounce"
              : "text-muted-foreground"
          }`}
        />
      </CardHeader>
      <CardContent className="space-y-4 py-2">
        {/* Streak Metrics */}
        <div>
          <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
            {currentStreak}
            <span className="text-sm font-semibold text-muted-foreground">days streak</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentStreak > 0 ? (
              <span className="text-orange-400 font-semibold">
                Your flame is active! Solve questions daily to protect it.
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground">
                <ShieldAlert size={12} />
                Streak inactive. Solve one question to ignite.
              </span>
            )}
          </p>
        </div>

        {/* Longest Streak Summary */}
        <div className="flex justify-between items-center text-xs border-t border-border pt-3">
          <span className="text-muted-foreground font-medium">All-time Personal Best</span>
          <span className="text-foreground font-bold bg-muted px-2 py-0.5 rounded border border-border">
            {longestStreak} days
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
