"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";
import { TopicSummaryInfo } from "@/types/topic";

interface TopicCardProps {
  topic: TopicSummaryInfo;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const percentage =
    topic.totalQuestions > 0
      ? Math.round((topic.solvedQuestions / topic.totalQuestions) * 100)
      : 0;

  return (
    <Link href={`/topics/${topic.slug}`} className="block group">
      <Card className="border-zinc-900 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 h-full flex flex-col justify-between p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              {topic.name}
            </h4>
            <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {topic.description}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-2 mt-4 border-t border-zinc-900/60 pt-4">
          <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
            <span>{topic.solvedQuestions} / {topic.totalQuestions} solved</span>
            <span className="text-emerald-400">{percentage}%</span>
          </div>
          <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
