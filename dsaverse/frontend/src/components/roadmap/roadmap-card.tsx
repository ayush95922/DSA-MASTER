"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { RoadmapSummary } from "@/types/roadmap";
import { useRoadmaps } from "@/hooks/use-roadmaps";

interface RoadmapCardProps {
  roadmap: RoadmapSummary;
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const { enroll, isEnrolling } = useRoadmaps();

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    enroll(roadmap.slug);
  };

  return (
    <Card className="border-zinc-900 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-between h-full group">
      <div>
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded">
              {roadmap.type}
            </span>
          </div>
          <Compass size={18} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <div>
            <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              {roadmap.title}
            </CardTitle>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
              {roadmap.description}
            </p>
          </div>

          {/* Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-950/60 text-indigo-400 border-indigo-900/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              {roadmap.difficulty}
            </Badge>
            <Badge className="bg-amber-950/60 text-amber-400 border-amber-900/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              {roadmap.estimatedDuration}
            </Badge>
            {roadmap.prerequisites && (
              <Badge variant="outline" className="border-zinc-800 text-zinc-500 text-[9px] font-bold truncate max-w-[120px]">
                Pre: {roadmap.prerequisites}
              </Badge>
            )}
          </div>

          {/* Progress Section */}
          {roadmap.enrolled ? (
            <div className="space-y-2 border-t border-zinc-900 pt-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-500">Progress</span>
                <span className="text-emerald-400">{roadmap.progressPercentage}% completed</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
                <span>{roadmap.completedNodes} completed</span>
                <span>{roadmap.totalNodes} total topics</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 border-t border-zinc-900 pt-3">
              <BookOpen size={12} />
              <span>Includes {roadmap.totalNodes} core structured topics</span>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-6 pt-0 mt-4">
        {roadmap.enrolled ? (
          <Button
            asChild
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-emerald-500 hover:border-emerald-500 hover:text-zinc-950 text-zinc-100 font-bold transition-all"
          >
            <Link href={`/roadmaps/${roadmap.slug}`}>
              Resume Learning Path
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
        ) : (
          <Button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold transition-all"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              "Enroll In Roadmap"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
