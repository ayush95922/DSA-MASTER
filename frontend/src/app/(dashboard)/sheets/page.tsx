"use client";

import React, { useState, useMemo } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { CURATED_SHEETS, SheetMetadata } from "@/lib/curated-sheets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  RotateCcw,
  CheckCircle,
  Circle,
  HelpCircle,
  Lock,
  Layers,
  Flame,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function SheetsPage() {
  const { useQuestionsList } = useQuestions();
  const { data: allQuestions, isLoading, error, refetch } = useQuestionsList();

  const [activeSheetKey, setActiveSheetKey] = useState<string>("blind-75");

  const currentSheet = useMemo(() => {
    return CURATED_SHEETS[activeSheetKey];
  }, [activeSheetKey]);

  // Map sheet slugs to full questions fetched from database
  const sheetQuestions = useMemo(() => {
    if (!allQuestions || !currentSheet) return [];
    
    // Create lookup map of questions by slug
    const questionMap = new Map();
    allQuestions.forEach(q => {
      // Map both standard slug and lower-cased title/slug to match curated sheet definitions
      questionMap.set(q.slug.toLowerCase(), q);
      // Fallback fallback: map containing duplicate arrays-problem-1 style
      if (q.title.toLowerCase().includes("contains duplicate")) questionMap.set("contains-duplicate", q);
      if (q.title.toLowerCase().includes("two sum")) questionMap.set("two-sum", q);
      if (q.title.toLowerCase().includes("valid anagram")) questionMap.set("valid-anagram", q);
      if (q.title.toLowerCase().includes("product of array except self")) questionMap.set("product-of-array-except-self", q);
      if (q.title.toLowerCase().includes("maximum subarray")) questionMap.set("maximum-subarray", q);
      if (q.title.toLowerCase().includes("rotate array")) questionMap.set("rotate-array", q);
      if (q.title.toLowerCase().includes("merge intervals")) questionMap.set("merge-intervals", q);
      if (q.title.toLowerCase().includes("next permutation")) questionMap.set("next-permutation", q);
      if (q.title.toLowerCase().includes("unique paths")) questionMap.set("unique-paths", q);
    });

    return currentSheet.slugs.map(slug => {
      const q = questionMap.get(slug.toLowerCase());
      if (q) return q;
      
      // Dynamic fallback matching based on slug terms
      const matching = allQuestions.find(dbQ => {
        const dbSlug = dbQ.slug.toLowerCase();
        return dbSlug.includes(slug.toLowerCase()) || slug.toLowerCase().includes(dbSlug);
      });
      
      if (matching) return matching;
 
      // Safe mock fallback so the question page does not break
      return {
        id: Math.random(),
        title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        slug: slug,
        difficulty: slug.includes("merge") || slug.includes("median") ? "HARD" : slug.includes("three") || slug.includes("product") ? "MEDIUM" : "EASY",
        points: 20,
        premium: false,
        status: "UNATTEMPTED",
        externalLinks: [
          { platformName: "LEETCODE", url: `https://leetcode.com/problems/${slug}/` }
        ]
      };
    });
  }, [allQuestions, currentSheet]);

  const progress = useMemo(() => {
    if (sheetQuestions.length === 0) return { solved: 0, total: 0, percentage: 0 };
    const solved = sheetQuestions.filter(q => q.status === "SOLVED").length;
    const total = sheetQuestions.length;
    const percentage = Math.round((solved / total) * 100);
    return { solved, total, percentage };
  }, [sheetQuestions]);

  // Group questions by their inferred categories/patterns
  const groupedQuestions = useMemo(() => {
    const groups: Record<string, typeof sheetQuestions> = {};
    sheetQuestions.forEach(q => {
      let groupName = "Other Core Concepts";
      const title = q.title.toLowerCase();
      
      if (title.includes("sum") || title.includes("duplicate") || title.includes("anagram") || title.includes("product") || title.includes("subarray") || title.includes("matrix") || title.includes("interval") || title.includes("permutation") || title.includes("rotate")) {
        groupName = "Arrays & Hashing";
      } else if (title.includes("palindrome") || title.includes("string") || title.includes("substring") || title.includes("character")) {
        groupName = "Strings & Text Processing";
      } else if (title.includes("list") || title.includes("node") || title.includes("lru") || title.includes("cache")) {
        groupName = "Linked Lists";
      } else if (title.includes("parenthes") || title.includes("stack") || title.includes("temperature") || title.includes("fleet") || title.includes("histogram")) {
        groupName = "Stacks & Monotonic Ranges";
      } else if (title.includes("search") || title.includes("binary") || title.includes("koko") || title.includes("matrix")) {
        groupName = "Searching & Sorting";
      } else if (title.includes("tree") || title.includes("bst") || title.includes("ancestor") || title.includes("depth") || title.includes("serialize") || title.includes("invert")) {
        groupName = "Binary Trees & BST";
      } else if (title.includes("island") || title.includes("graph") || title.includes("course") || title.includes("ladder") || title.includes("network") || title.includes("path")) {
        groupName = "Graphs & Dynamic Searches";
      } else if (title.includes("climb") || title.includes("coin") || title.includes("robber") || title.includes("ways") || title.includes("jump") || title.includes("subsequence") || title.includes("path")) {
        groupName = "Dynamic Programming";
      }
      
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(q);
    });
    return groups;
  }, [sheetQuestions]);

  const getDifficultyBadgeClass = (diff: string) => {
    switch (diff.toUpperCase()) {
      case "EASY":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-900/30";
      case "MEDIUM":
        return "text-amber-400 bg-amber-950/40 border-amber-900/30";
      case "HARD":
        return "text-rose-500 bg-rose-950/40 border-rose-900/30";
      default:
        return "text-zinc-400 bg-zinc-900";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "SOLVED":
        return <CheckCircle size={16} className="text-emerald-400 shrink-0" />;
      case "ATTEMPTED":
        return <HelpCircle size={16} className="text-amber-400 shrink-0" />;
      default:
        return <Circle size={16} className="text-zinc-700 shrink-0" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-72 bg-zinc-900 mt-2" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load curated sheets</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please check your connection and ensure the backend development server is active.
        </p>
        <Button onClick={() => refetch()} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
          <RotateCcw size={16} className="mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Curated DSA Sheets
            <Flame className="h-6 w-6 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Master the most critical questions sorted by top SDEs to conquer elite coding assessments.
          </p>
        </div>

        {/* Dynamic Sheet Tabs */}
        <div className="flex gap-3 bg-zinc-900 border border-zinc-800 p-1 rounded-xl shrink-0">
          <Button
            size="sm"
            onClick={() => setActiveSheetKey("blind-75")}
            className={`rounded-lg font-bold text-xs h-9 px-4 cursor-pointer transition-all ${
              activeSheetKey === "blind-75"
                ? "bg-emerald-500 text-zinc-950 font-extrabold shadow-lg shadow-emerald-500/10"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Blind 75
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveSheetKey("neetcode-150")}
            className={`rounded-lg font-bold text-xs h-9 px-4 cursor-pointer transition-all ${
              activeSheetKey === "neetcode-150"
                ? "bg-emerald-500 text-zinc-950 font-extrabold shadow-lg shadow-emerald-500/10"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            NeetCode 150
          </Button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md p-5 flex gap-4 items-center">
          <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sheet Progress</h4>
            <p className="text-base font-black text-white mt-0.5">
              {progress.solved} / {progress.total} Solved
            </p>
          </div>
        </Card>

        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md p-5 flex gap-4 items-center md:col-span-2">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-500">Completion Gauge</span>
              <span className="text-emerald-400">{progress.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/20">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Grouped Questions Directory */}
      <div className="space-y-10 pt-4">
        {Object.entries(groupedQuestions).map(([groupName, questions]) => (
          <div key={groupName} className="space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-zinc-900 pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              {groupName} ({questions.length})
            </h3>

            <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-900/40 border-b border-zinc-900">
                  <TableRow className="border-b border-zinc-900 hover:bg-transparent">
                    <TableHead className="w-12 text-zinc-400 font-bold">Status</TableHead>
                    <TableHead className="text-zinc-400 font-bold">Challenge Name</TableHead>
                    <TableHead className="w-28 text-zinc-400 font-bold">Difficulty</TableHead>
                    <TableHead className="w-20 text-zinc-400 font-bold">Points</TableHead>
                    <TableHead className="w-24 text-right text-zinc-400 font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q, idx) => (
                    <TableRow
                      key={`${q.slug || q.id}-${idx}`}
                      className="border-b border-zinc-900/60 hover:bg-zinc-900/10 transition-colors"
                    >
                      <TableCell className="py-3">{getStatusIcon(q.status)}</TableCell>
                      <TableCell className="font-bold py-3">
                        <Link
                          href={`/questions/${q.slug}`}
                          className="text-white hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                        >
                          {q.title}
                          {q.premium && (
                            <span className="flex items-center gap-0.5 text-[8px] font-black uppercase bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-1 rounded shrink-0">
                              <Lock size={6} /> PRO
                            </span>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyBadgeClass(
                            q.difficulty
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-350 font-semibold py-3 text-sm">{q.points}</TableCell>
                      <TableCell className="text-right py-3">
                        <Button
                          asChild
                          size="sm"
                          className="bg-zinc-900 border border-zinc-800 hover:bg-emerald-500 hover:border-emerald-500 hover:text-zinc-950 text-zinc-200 font-bold transition-all text-xs h-7 px-3 cursor-pointer"
                        >
                          <Link href={`/questions/${q.slug}`}>Solve</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
