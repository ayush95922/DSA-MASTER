"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Building2, ChevronRight, HelpCircle } from "lucide-react";
import { CompanySummary } from "@/types/company";

interface CompanyCardProps {
  company: CompanySummary;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const getTierBadgeStyles = (tier: string) => {
    switch (tier) {
      case "TIER_1":
        return "bg-rose-950/60 border-rose-900/40 text-rose-400";
      case "TIER_2":
        return "bg-amber-950/60 border-amber-900/40 text-amber-400";
      default:
        return "bg-zinc-900 border-zinc-800 text-zinc-400";
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "TIER_1":
        return "FAANG / Elite";
      case "TIER_2":
        return "Top Startup";
      default:
        return "Global Enterprise";
    }
  };

  const getDifficultyBadgeStyles = (difficulty: string | undefined) => {
    switch (difficulty?.toUpperCase()) {
      case "HARD":
        return "bg-rose-950/60 border-rose-900/40 text-rose-400";
      case "MEDIUM":
        return "bg-amber-950/60 border-amber-900/40 text-amber-400";
      default:
        return "bg-emerald-950/60 border-emerald-900/40 text-emerald-400";
    }
  };

  const difficulty = company.difficulty || (company.tier === "TIER_1" ? "Hard" : company.tier === "TIER_2" ? "Medium" : "Easy");
  const questionsCount = company.questionsCount || 0;

  return (
    <Link href={`/companies/${company.slug}`} className="block group h-full">
      <Card className="border-zinc-900 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 h-full flex flex-col justify-between p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getTierBadgeStyles(
                  company.tier
                )}`}
              >
                {getTierLabel(company.tier)}
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyBadgeStyles(
                  difficulty
                )}`}
              >
                {difficulty}
              </span>
            </div>
            <Building2 size={16} className="text-zinc-500 group-hover:text-emerald-400 transition-colors shrink-0" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              {company.name}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mt-2 line-clamp-2">
              {company.description}
            </p>
          </div>

          {/* Stats & Topics */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <HelpCircle size={14} className="text-zinc-500" />
              <span><strong className="text-zinc-200">{questionsCount}</strong> Curated Questions</span>
            </div>

            {company.mostAskedTopics && company.mostAskedTopics.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-500 block">Most Asked Topics</span>
                <div className="flex flex-wrap gap-1">
                  {company.mostAskedTopics.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="text-[9px] font-bold bg-zinc-850 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800/50"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Progress & Button */}
        <div className="space-y-4 mt-5 border-t border-zinc-900/60 pt-4 shrink-0">
          {/* Readiness Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
              <span>Readiness Score</span>
              <span className="text-emerald-400">{company.readinessPercentage}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${company.readinessPercentage}%` }}
              />
            </div>
          </div>

          {/* Open Prep Hub Button */}
          <div className="w-full bg-zinc-800/60 group-hover:bg-emerald-500 group-hover:text-zinc-950 text-zinc-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 border border-zinc-800 group-hover:border-emerald-500 shadow-md">
            Open Preparation Hub
            <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
