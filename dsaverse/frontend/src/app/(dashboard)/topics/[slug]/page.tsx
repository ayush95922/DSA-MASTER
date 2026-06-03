"use client";

import React, { use } from "react";
import { useTopics } from "@/hooks/use-topics";
import TheoryViewer from "@/components/topic/theory-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowLeft,
  BookOpen,
  Layers,
  CheckCircle,
  Circle,
  HelpCircle,
  Lock,
  Code2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TopicDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { useTopicDetail } = useTopics();
  const { data: topic, isLoading, error, refetch } = useTopicDetail(slug);

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
        return <CheckCircle size={16} className="text-emerald-400" />;
      case "ATTEMPTED":
        return <HelpCircle size={16} className="text-amber-400" />;
      default:
        return <Circle size={16} className="text-zinc-600" />;
    }
  };

  const getPlatformStyle = (platform: string) => {
    switch (platform.toUpperCase()) {
      case "LEETCODE":
        return "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 hover:border-amber-500/30";
      case "GEEKSFORGEEKS":
        return "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 hover:border-emerald-500/30";
      case "HACKERRANK":
        return "border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400 hover:border-sky-500/30";
      default:
        return "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300";
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform.toUpperCase()) {
      case "LEETCODE":
        return "LeetCode";
      case "GEEKSFORGEEKS":
        return "GeeksforGeeks";
      case "HACKERRANK":
        return "HackerRank";
      default:
        return platform;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-4 w-24 bg-zinc-900" />
          <Skeleton className="h-8 w-64 bg-zinc-900 mt-4" />
          <Skeleton className="h-4 w-96 bg-zinc-900 mt-2" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load topic details</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please check your connection and ensure the backend development server is active.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="border-zinc-800 text-zinc-300">
            <Link href="/topics">Back to topics</Link>
          </Button>
          <Button onClick={() => refetch()} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
            <RotateCcw size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to topics directory
        </Link>
      </div>

      {/* Topic Title & Description */}
      <div className="border-b border-zinc-900 pb-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          {topic.name}
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          {topic.description}
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="theory"
            className="rounded-lg font-bold text-sm flex items-center gap-1.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950"
          >
            <BookOpen size={14} />
            Theory Guide
          </TabsTrigger>
          <TabsTrigger
            value="problems"
            className="rounded-lg font-bold text-sm flex items-center gap-1.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950"
          >
            <Code2 size={14} />
            Practice Problems ({topic.questions?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="subtopics"
            className="rounded-lg font-bold text-sm flex items-center gap-1.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950"
          >
            <Layers size={14} />
            Subtopics ({topic.subtopics.length})
          </TabsTrigger>
        </TabsList>

        {/* Theory Tab Panel */}
        <TabsContent value="theory" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
          <TheoryViewer theory={topic.theory} name={topic.name} />
        </TabsContent>

        {/* Practice Problems Tab Panel */}
        <TabsContent value="problems" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
          {!topic.questions || topic.questions.length === 0 ? (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-8 text-center text-zinc-550 text-sm">
              <Code2 className="h-8 w-8 mx-auto mb-2 stroke-zinc-700" />
              No practice questions mapped for {topic.name} yet.
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-900/40 border-b border-zinc-900">
                  <TableRow className="border-b border-zinc-900 hover:bg-transparent">
                    <TableHead className="w-12 text-zinc-400 font-bold">Status</TableHead>
                    <TableHead className="text-zinc-400 font-bold">Problem Name</TableHead>
                    <TableHead className="w-64 text-zinc-400 font-bold">Practice Links</TableHead>
                    <TableHead className="w-28 text-zinc-400 font-bold">Difficulty</TableHead>
                    <TableHead className="w-20 text-zinc-400 font-bold">Points</TableHead>
                    <TableHead className="w-24 text-right text-zinc-400 font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topic.questions.map((q) => (
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
                        <div className="flex flex-wrap gap-2">
                          {q.externalLinks && q.externalLinks.length > 0 ? (
                            q.externalLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[10px] font-bold border rounded px-2.5 py-1 transition-all ${getPlatformStyle(
                                  link.platformName
                                )}`}
                              >
                                {getPlatformLabel(link.platformName)}
                                <ExternalLink size={10} />
                              </a>
                            ))
                          ) : (
                            <span className="text-xs text-zinc-600">-</span>
                          )}
                        </div>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Subtopics Tab Panel */}
        <TabsContent value="subtopics" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
          {topic.subtopics.length === 0 ? (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-8 text-center text-zinc-500 text-sm">
              <Layers className="h-8 w-8 mx-auto mb-2 stroke-zinc-650" />
              No subtopics listed for {topic.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topic.subtopics.map((sub, index) => (
                <Card key={index} className="border-zinc-900 bg-zinc-900/30 p-5 hover:border-zinc-800 transition-all">
                  <CardContent className="p-0 space-y-3">
                    <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{sub.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
