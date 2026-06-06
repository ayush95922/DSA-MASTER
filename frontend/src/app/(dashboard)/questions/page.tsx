"use client";

import React, { useState, useMemo } from "react";
import { useQuestions } from "@/hooks/use-questions";
import QuestionFilters from "@/components/question/question-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import Link from "next/link";

export default function QuestionsPage() {
  const { useQuestionsList } = useQuestions();
  const { data: questions, isLoading, error, refetch } = useQuestionsList();

  // Local filter states
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    status: "",
  });

  // Client side search/filtering of the retrieved question array
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    return questions.filter((q) => {
      const matchSearch = q.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchDifficulty = !filters.difficulty || q.difficulty === filters.difficulty;
      const matchStatus = !filters.status || q.status === filters.status;
      return matchSearch && matchDifficulty && matchStatus;
    });
  }, [questions, filters]);

  const getDifficultyBadgeClass = (diff: "EASY" | "MEDIUM" | "HARD") => {
    switch (diff) {
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

  const getStatusIcon = (status: "SOLVED" | "ATTEMPTED" | "UNATTEMPTED") => {
    switch (status) {
      case "SOLVED":
        return <CheckCircle size={16} className="text-emerald-400" />;
      case "ATTEMPTED":
        return <HelpCircle size={16} className="text-amber-400" />;
      default:
        return <Circle size={16} className="text-zinc-650" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-72 bg-zinc-900 mt-2" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load questions library</h3>
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Practice Library
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Sharpen your skills on fundamental arrays to advanced graphs. Filter easily to target specific levels.
        </p>
      </div>

      {/* Filter widgets */}
      <QuestionFilters filters={filters} onFiltersChange={setFilters} />

      {/* Questions list Table */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 overflow-hidden">
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
            {filteredQuestions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500 text-sm">
                  No challenges matched your search filters. Try loosening your terms!
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((q) => (
                <TableRow
                  key={q.id}
                  className="border-b border-zinc-900/60 hover:bg-zinc-900/10 transition-colors"
                >
                  <TableCell className="py-4">{getStatusIcon(q.status)}</TableCell>
                  <TableCell className="font-bold py-4">
                    <Link
                      href={`/questions/${q.slug}`}
                      className="text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
                    >
                      {q.title}
                      {q.premium && (
                        <span className="flex items-center gap-0.5 text-[9px] font-black uppercase bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-1.5 py-0.5 rounded shrink-0">
                          <Lock size={8} /> PRO
                        </span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getDifficultyBadgeClass(
                        q.difficulty
                      )}`}
                    >
                      {q.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300 font-semibold py-4">{q.points}</TableCell>
                  <TableCell className="text-right py-4">
                    <Button
                      asChild
                      size="sm"
                      className="bg-zinc-900 border border-zinc-800 hover:bg-emerald-500 hover:border-emerald-500 hover:text-zinc-950 text-zinc-200 font-bold transition-all text-xs h-8"
                    >
                      <Link href={`/questions/${q.slug}`}>Solve</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
