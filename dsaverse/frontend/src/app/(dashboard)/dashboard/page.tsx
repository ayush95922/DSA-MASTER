"use client";

import React from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import DailyGoals from "@/components/dashboard/daily-goals";
import StreakCounter from "@/components/dashboard/streak-counter";
import ProgressSummary from "@/components/dashboard/progress-summary";
import ActivityHeatmap from "@/components/dashboard/activity-heatmap";
import RecommendedQuestions from "@/components/dashboard/recommended-questions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  // Loading skeleton layout
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Top cards skeleton row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[120px] w-full rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[120px] w-full rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[120px] w-full rounded-2xl bg-zinc-900/60" />
        </div>
        {/* Heatmap card skeleton */}
        <Skeleton className="h-[200px] w-full rounded-2xl bg-zinc-900/60" />
        {/* Recommendations skeleton */}
        <Skeleton className="h-[250px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  // Error boundary page fallback
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load dashboard metrics</h3>
        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
          Please check your connection and ensure the backend development server is active.
        </p>
        <Button
          onClick={() => refetch()}
          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
        >
          <RotateCcw size={16} className="mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const { dailyGoal, streak, progressSummary, heatmap, recommendedQuestions } = data!;

  return (
    <div className="space-y-6">
      {/* 1. Header Welcome Bar */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Welcome back, Learner!
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Here is your coding progress snapshot for today. Let&apos;s clear some challenges!
        </p>
      </div>

      {/* 2. Top Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DailyGoals completed={dailyGoal.completed} target={dailyGoal.target} />
        <StreakCounter
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          lastActiveDate={streak.lastActiveDate}
        />
        <ProgressSummary summary={progressSummary} />
      </div>

      {/* 3. Heatmap Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActivityHeatmap data={heatmap} />
      </div>

      {/* 4. Recommended Questions Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecommendedQuestions questions={recommendedQuestions} />
      </div>
    </div>
  );
}
