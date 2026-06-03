"use client";

import React from "react";
import { TheoryInfo } from "@/types/topic";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, LineChart, Cpu } from "lucide-react";

interface TheoryViewerProps {
  theory: TheoryInfo | null;
  name: string;
}

export default function TheoryViewer({ theory, name }: TheoryViewerProps) {
  if (!theory) {
    return (
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-8 text-center text-zinc-500 text-sm">
        <BookOpen className="h-8 w-8 mx-auto mb-2 stroke-zinc-650" />
        No theory guides currently uploaded for {name}. Practice questions directly below!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Overview */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-2">
          <BookOpen size={16} className="text-emerald-400" />
          Overview
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {theory.overview}
        </p>
      </div>

      {/* 2. Complexity Analysis Cards */}
      {theory.complexityAnalysis && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-2">
            <LineChart size={16} className="text-indigo-400" />
            Complexity Reference
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Time Complexity Card */}
            <Card className="border-zinc-900 bg-zinc-900/20 p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-950/60 border border-indigo-900/30 text-indigo-400 flex items-center justify-center shrink-0">
                <Cpu size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Time Complexity</h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-mono whitespace-pre-line">
                  {theory.complexityAnalysis.split("\n")[0] || "O(1) average"}
                </p>
              </div>
            </Card>

            {/* Space Complexity Card */}
            <Card className="border-zinc-900 bg-zinc-900/20 p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Cpu size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Space Complexity</h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-mono whitespace-pre-line">
                  {theory.complexityAnalysis.split("\n")[1] || "O(N) auxiliary"}
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 3. Detailed Sections */}
      {theory.sections.length > 0 && (
        <div className="space-y-6 pt-4">
          {theory.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-base font-bold text-white border-b border-zinc-900/40 pb-2">
                {index + 1}. {section.title}
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-900/5 p-4 rounded-xl border border-zinc-900/40 font-sans">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
