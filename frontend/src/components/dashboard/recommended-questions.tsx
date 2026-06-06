"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, Lock } from "lucide-react";
import { RecommendedQuestionInfo } from "@/types/progress";

interface RecommendedQuestionsProps {
  questions: RecommendedQuestionInfo[];
}

export default function RecommendedQuestions({ questions }: RecommendedQuestionsProps) {
  const getDifficultyStyles = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-950/60 border-emerald-800/80 text-emerald-400";
      case "MEDIUM":
        return "bg-amber-950/60 border-amber-800/80 text-amber-400";
      case "HARD":
        return "bg-rose-950/60 border-rose-800/80 text-rose-400";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-border/80 transition-all duration-300 col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Recommended Prep Questions
        </CardTitle>
        <Sparkles size={16} className="text-emerald-400" />
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm">
            <Compass className="h-8 w-8 mb-2 stroke-muted-foreground" />
            No recommendations currently. Solve more to let AI learn your weak topics!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-border/80 hover:bg-accent transition-all group"
              >
                <div>
                  {/* Badge Row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyStyles(
                        q.difficulty
                      )}`}
                    >
                      {q.difficulty}
                    </span>
                    {q.premium && (
                      <span className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded">
                        <Lock size={10} /> PRO
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[40px]">
                    {q.title}
                  </h4>
                </div>

                <div className="mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-muted border border-border hover:bg-emerald-500 hover:border-emerald-500 hover:text-primary-foreground text-foreground font-bold transition-all text-xs"
                  >
                    <Link href={`/questions/${q.slug}`}>Solve Challenge</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
