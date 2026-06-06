"use client";

import React, { useState } from "react";
import { EditorialDetail } from "@/types/question";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, LineChart, Code2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface EditorialViewerProps {
  editorial: EditorialDetail | null;
  title: string;
}

export default function EditorialViewer({ editorial, title }: EditorialViewerProps) {
  const [activeLang, setActiveLang] = useState<"java" | "python" | "cpp">("java");
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!editorial) {
    return (
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-8 text-center text-zinc-500 text-sm">
        <BookOpen className="h-8 w-8 mx-auto mb-2 stroke-zinc-650" />
        No solutions editorial written for &quot;{title}&quot; yet. Try solving it on your own!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Solution Overview */}
      {editorial.overview && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-2">
            <BookOpen size={16} className="text-emerald-400" />
            Solution Overview
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {editorial.overview}
          </p>
        </div>
      )}

      {/* 2. Approaches Mapping */}
      <div className="space-y-8">
        {editorial.approaches.map((app, index) => {
          const selectedCode =
            activeLang === "java"
              ? app.javaCode
              : activeLang === "python"
              ? app.pythonCode
              : app.cppCode;

          return (
            <div
              key={index}
              className="space-y-4 border-t border-zinc-900 pt-8 first:border-none first:pt-0"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded">
                    {app.type}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    Approach {index + 1}: {app.title}
                  </h4>
                </div>

                {/* Complexities */}
                <div className="flex gap-3 shrink-0">
                  <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-center text-xs">
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Time</span>
                    <code className="text-emerald-400 font-bold">{app.timeComplexity}</code>
                  </div>
                  <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-center text-xs">
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Space</span>
                    <code className="text-emerald-400 font-bold">{app.spaceComplexity}</code>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {app.description}
              </p>

              {/* Code blocks */}
              {selectedCode && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden mt-4">
                  {/* Language switch bar */}
                  <div className="flex justify-between items-center bg-zinc-900/60 px-4 py-2 border-b border-zinc-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveLang("java")}
                        className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                          activeLang === "java"
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Java
                      </button>
                      <button
                        onClick={() => setActiveLang("python")}
                        className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                          activeLang === "python"
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Python
                      </button>
                      <button
                        onClick={() => setActiveLang("cpp")}
                        className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                          activeLang === "cpp"
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        C++
                      </button>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(selectedCode)}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Copy code"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Fenced Code Renders */}
                  <pre className="p-4 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed scrollbar-none max-h-[400px]">
                    <code>{selectedCode}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
