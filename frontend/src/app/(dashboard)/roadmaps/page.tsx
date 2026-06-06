"use client";

import React, { useState, useMemo } from "react";
import { useRoadmaps } from "@/hooks/use-roadmaps";
import { useQuestions } from "@/hooks/use-questions";
import RoadmapGraph from "@/components/roadmap/roadmap-graph";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Compass, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Play, 
  Star, 
  FileText, 
  BookOpen, 
  Flame, 
  Clock, 
  GraduationCap, 
  ChevronRight, 
  ExternalLink,
  Layers,
  Heart,
  Check
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RoadmapNodeInfo } from "@/types/roadmap";

export default function RoadmapsPage() {
  const slug = "placement-dsa-roadmap";
  const { useRoadmapDetail, enroll, completeNode, isEnrolling } = useRoadmaps();
  const { useQuestionsList } = useQuestions();
  
  const { data: roadmap, isLoading, error, refetch } = useRoadmapDetail(slug);
  const { data: globalQuestions } = useQuestionsList();

  // Selected node for resource drawer
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeInfo | null>(null);

  // Local state to keep track of solved status dynamically for instant updates
  const [localSolvedMap, setLocalSolvedMap] = useState<Record<string, boolean>>({});

  // Memoize global solved question slugs
  const solvedQuestionSlugs = useMemo(() => {
    if (!globalQuestions) return new Set<string>();
    return new Set(
      globalQuestions
        .filter((q) => q.status === "SOLVED")
        .map((q) => q.slug)
    );
  }, [globalQuestions]);

  // Handle solved question toggle in UI
  const handleSolvedChange = (questionSlug: string, solved: boolean) => {
    setLocalSolvedMap(prev => ({
      ...prev,
      [questionSlug]: solved
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-4 w-24 bg-zinc-900" />
          <Skeleton className="h-8 w-64 bg-zinc-900 mt-4" />
          <Skeleton className="h-4 w-96 bg-zinc-900 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Skeleton className="lg:col-span-3 h-[500px] w-full rounded-2xl bg-zinc-900/60" />
          <Skeleton className="lg:col-span-1 h-[500px] w-full rounded-2xl bg-zinc-900/60" />
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load roadmap details</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please check your connection and ensure the backend development server is active.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="border-zinc-800 text-zinc-300">
            <Link href="/">Back to Dashboard</Link>
          </Button>
          <Button onClick={() => refetch()} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
            <RotateCcw size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    enroll(roadmap.slug);
  };

  const handleSelectNode = (node: RoadmapNodeInfo) => {
    setSelectedNode(node);
  };

  const handleMarkNodeCompleted = (nodeId: number) => {
    completeNode(nodeId, roadmap.slug);
    toast.success("Topic progress checked off!");
    // Update local node state immediately
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({
        ...selectedNode,
        completed: true
      });
    }
  };

  const completedCount = roadmap.nodes.filter((n) => n.completed).length;
  const totalCount = roadmap.nodes.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 1. Solved Questions (sum of solved questions inside enrolled nodes)
  const totalRoadmapQuestions = roadmap.nodes.reduce(
    (sum, node) => sum + (node.practiceQuestions?.length || 0), 
    0
  );

  const solvedRoadmapQuestions = roadmap.nodes.reduce((sum, node) => {
    const solvedInNode = node.practiceQuestions?.filter((q) => {
      // check local map first, then global slugs
      if (localSolvedMap[q.slug] !== undefined) {
        return localSolvedMap[q.slug];
      }
      return solvedQuestionSlugs.has(q.slug);
    }).length || 0;
    return sum + solvedInNode;
  }, 0);

  // 2. Current Topic (first incomplete node in the path)
  const currentTopic = [...roadmap.nodes]
    .sort((a, b) => a.nodeOrder - b.nodeOrder)
    .find((n) => !n.completed);

  // 3. Next Recommended (first incomplete node whose dependencies are all completed)
  const nextRecommended = [...roadmap.nodes]
    .sort((a, b) => a.nodeOrder - b.nodeOrder)
    .find((n) => {
      if (n.completed) return false;
      return n.dependencyIds.every((depId) => {
        const depNode = roadmap.nodes.find((node) => node.id === depId);
        return depNode ? depNode.completed : true;
      });
    });

  // 4. Estimated Time Remaining (calculated dynamically)
  const estimatedMinsRemaining = (totalCount - completedCount) * 45;
  const formatTime = (mins: number) => {
    if (mins <= 0) return "0 mins";
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}h ${remainingMins}m remaining`;
    }
    return `${remainingMins} mins remaining`;
  };

  // Simple Markdown renderer for theory notes
  const renderMarkdown = (text: string | null) => {
    if (!text) return <p className="text-zinc-500 text-xs italic">No content available.</p>;
    return (
      <div className="space-y-4 text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
        {text.split("\n").map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-sm font-extrabold text-white mt-4 mb-2 flex items-center gap-1.5 border-b border-zinc-900 pb-1">
                <Layers className="text-indigo-400" size={12} />
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("#### ")) {
            return (
              <h4 key={idx} className="text-xs font-bold text-zinc-200 mt-3 mb-1">
                {line.replace("#### ", "")}
              </h4>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={idx} className="ml-4 list-disc text-zinc-300 my-1">
                {line.replace("- ", "")}
              </li>
            );
          }
          if (line.startsWith("|") && line.includes("---")) {
            return null; // skip divider
          }
          if (line.startsWith("|")) {
            const cells = line.split("|").filter((c) => c.trim() !== "");
            return (
              <div key={idx} className="flex border-b border-zinc-900/60 py-1.5 text-[11px]">
                {cells.map((cell, cidx) => (
                  <span key={cidx} className="flex-1 text-zinc-400 font-mono">
                    {cell.trim()}
                  </span>
                ))}
              </div>
            );
          }
          return <p key={idx} className="my-1.5">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>

      {/* Detail Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 px-2 py-0.5 rounded">
              {roadmap.type}
            </span>
            {roadmap.enrolled && completionPercent === 100 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded">
                <Trophy size={10} /> Completed
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {roadmap.title}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">{roadmap.description}</p>
        </div>

        {/* Action Widgets */}
        <div className="shrink-0 w-full md:w-auto">
          {roadmap.enrolled ? (
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 min-w-[220px] space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-500">Overall Progress</span>
                <span className="text-emerald-400">{completionPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
                <span>{completedCount} completed</span>
                <span>{totalCount} topics</span>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-8 py-6 rounded-xl text-base shadow-lg shadow-emerald-500/20"
            >
              Enroll In Path
            </Button>
          )}
        </div>
      </div>

      {/* Alert Notice if not enrolled */}
      {!roadmap.enrolled && (
        <div className="rounded-xl border border-indigo-955/60 bg-indigo-955/15 p-4 text-sm text-indigo-300 flex items-start gap-3 backdrop-blur-sm">
          <Compass size={18} className="text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white mb-0.5">Roadmap View Only</span>
            You must enroll in this learning roadmap to activate progress checks, register code submissions, and feed the spaced repetition learning pipelines.
          </div>
        </div>
      )}

      {/* Overhauled Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Side: Interactive Path Graph */}
        <div className="xl:col-span-3 space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            Interactive Study Path Graph
          </h3>
          <RoadmapGraph
            nodes={roadmap.nodes}
            slug={roadmap.slug}
            onSelectNode={handleSelectNode}
            isEnrolled={roadmap.enrolled}
            localSolvedMap={localSolvedMap}
            solvedQuestionSlugs={solvedQuestionSlugs}
          />
        </div>

        {/* Right Side: Detailed Statistics Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Path Insights
          </h3>

          {/* Stats Analytics Widget */}
          <Card className="bg-zinc-950 border-zinc-900 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-zinc-900 bg-zinc-900/10 py-4">
              <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="text-amber-500" size={14} />
                Progress Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              {/* Completed Topics Ratio */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-500">Completed Topics</span>
                  <span className="text-white">{completedCount} / {totalCount}</span>
                </div>
                <Progress value={completionPercent} className="h-1 bg-zinc-900" />
              </div>

              {/* Solved Questions Ratio */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-500">Solved Questions</span>
                  <span className="text-emerald-400">{solvedRoadmapQuestions} / {totalRoadmapQuestions}</span>
                </div>
                <Progress 
                  value={totalRoadmapQuestions > 0 ? (solvedRoadmapQuestions / totalRoadmapQuestions) * 100 : 0} 
                  className="h-1 bg-zinc-900 [&>div]:bg-emerald-500" 
                />
              </div>

              {/* Time Remaining */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-900/60">
                <Clock className="text-indigo-400" size={16} />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block leading-none">Est. Time Remaining</span>
                  <span className="text-xs font-bold text-zinc-200">{formatTime(estimatedMinsRemaining)}</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Learning Focus Widget */}
          <Card className="bg-zinc-950 border-zinc-900 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-zinc-900 bg-zinc-900/10 py-4">
              <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="text-indigo-400" size={14} />
                Active Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Current Topic */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block leading-none">Current Topic</span>
                {currentTopic ? (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs font-bold text-zinc-200 truncate">{currentTopic.title}</span>
                    <Button 
                      onClick={() => handleSelectNode(currentTopic)} 
                      size="sm" 
                      className="h-6 text-[10px] bg-indigo-500 hover:bg-indigo-650 text-white font-bold"
                    >
                      Study
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 font-semibold block pt-1">Path Completed! 🎉</span>
                )}
              </div>

              {/* Next Recommended */}
              <div className="pt-3 border-t border-zinc-900/60 space-y-1">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block leading-none">Next Recommended</span>
                {nextRecommended ? (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs font-bold text-zinc-300 truncate">{nextRecommended.title}</span>
                    <Badge variant="outline" className="border-zinc-800 text-[9px] bg-zinc-950 text-zinc-500">
                      Step {nextRecommended.nodeOrder}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500 block pt-1">No pending recommendations.</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Path Details Card */}
          <Card className="bg-zinc-950 border-zinc-900 shadow-xl overflow-hidden text-xs">
            <CardHeader className="border-b border-zinc-900 bg-zinc-900/10 py-4">
              <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="text-emerald-400" size={14} />
                Path Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Difficulty & Duration Badges */}
              <div className="flex gap-2">
                <Badge className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                  (roadmap.difficulty || "MEDIUM").toUpperCase() === "BEGINNER" 
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                    : (roadmap.difficulty || "MEDIUM").toUpperCase() === "MEDIUM"
                    ? "bg-amber-950/60 text-amber-400 border border-amber-900/30"
                    : "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                }`}>
                  {roadmap.difficulty || "MEDIUM"}
                </Badge>
                <Badge className="bg-zinc-900 border border-zinc-800/80 text-[10px] px-2 py-0.5 text-zinc-400">
                  {roadmap.estimatedDuration}
                </Badge>
              </div>

              {/* Prerequisites */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block leading-none">Prerequisites</span>
                <p className="text-zinc-400 leading-normal pt-1">{roadmap.prerequisites || "None."}</p>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-1 pt-2 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block leading-none">Learning Outcomes</span>
                <ul className="space-y-1.5 pt-1.5">
                  {roadmap.learningOutcomes?.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-zinc-400 leading-normal">
                      <ChevronRight size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* OVERHAULED SHADCN SLIDING DRAWER SHEET */}
      <Sheet open={selectedNode !== null} onOpenChange={(open) => !open && setSelectedNode(null)}>
        {selectedNode && (
          <SheetContent className="w-full sm:max-w-2xl bg-zinc-950 border-l border-zinc-900 text-white overflow-y-auto z-[100] p-6 scrollbar-none flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Sheet Header */}
              <SheetHeader className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded-full">
                    Step {selectedNode.nodeOrder}
                  </span>
                  {selectedNode.completed && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} /> Completed
                    </span>
                  )}
                </div>
                <SheetTitle className="text-lg font-black tracking-tight text-white leading-tight">
                  {selectedNode.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-zinc-400 font-medium leading-relaxed">
                  {selectedNode.description}
                </SheetDescription>
              </SheetHeader>

              {/* Resource Tabs Container */}
              <Tabs defaultValue="theory" className="w-full pt-2">
                <TabsList className="grid grid-cols-4 bg-zinc-900/40 p-1 border border-zinc-900 rounded-xl mb-4">
                  <TabsTrigger value="theory" className="text-[11px] font-bold py-1.5 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                    Theory
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="text-[11px] font-bold py-1.5 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                    Practice
                  </TabsTrigger>
                  <TabsTrigger value="revision" className="text-[11px] font-bold py-1.5 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                    Revision
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="text-[11px] font-bold py-1.5 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                    Guides
                  </TabsTrigger>
                </TabsList>

                {/* Theory Tab */}
                <TabsContent value="theory" className="space-y-4 focus:outline-none">
                  {renderMarkdown(selectedNode.theoryPage)}
                  
                  {selectedNode.cheatSheet && (
                    <Card className="bg-zinc-950 border-zinc-900 overflow-hidden shadow-lg mt-6">
                      <CardHeader className="bg-zinc-900/20 py-3.5 border-b border-zinc-900">
                        <CardTitle className="text-xs font-black uppercase tracking-wider text-white">
                          Quick-Access Cheat Sheet
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {renderMarkdown(selectedNode.cheatSheet)}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Practice Tab */}
                <TabsContent value="practice" className="space-y-4 focus:outline-none">
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">
                    Node Curated Question List
                  </span>

                  {selectedNode.practiceQuestions && selectedNode.practiceQuestions.length > 0 ? (
                    <div className="space-y-3">
                      {selectedNode.practiceQuestions.map((q) => {
                        const isSolved = localSolvedMap[q.slug] !== undefined 
                          ? localSolvedMap[q.slug]
                          : solvedQuestionSlugs.has(q.slug);
                          
                        return (
                          <RoadmapQuestionRow 
                            key={q.slug} 
                            question={q} 
                            isSolved={isSolved}
                            onSolvedChange={handleSolvedChange}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-500 text-xs border border-zinc-900 rounded-2xl bg-zinc-900/10">
                      No curated practice questions for this topic.
                    </div>
                  )}
                </TabsContent>

                {/* Revision Tab */}
                <TabsContent value="revision" className="space-y-6 focus:outline-none">
                  {selectedNode.revisionNotes && (
                    <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl">
                      <h4 className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2 leading-none">
                        Topic Core Revision Notes
                      </h4>
                      {renderMarkdown(selectedNode.revisionNotes)}
                    </div>
                  )}

                  {/* Flashcards flip cards */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">
                      Interactive Flashcards Flip Cards
                    </span>
                    {selectedNode.flashcards && selectedNode.flashcards.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedNode.flashcards.map((card, idx) => (
                          <FlashcardItem key={idx} card={card} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-zinc-500 text-xs border border-zinc-900 rounded-2xl bg-zinc-900/10">
                        No flashcards available for this topic.
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Guides Tab */}
                <TabsContent value="guides" className="space-y-4 focus:outline-none">
                  {/* Leetcode practice lists */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Leetcode Curated Links
                    </h4>
                    {selectedNode.leetcodeProblems && selectedNode.leetcodeProblems.length > 0 ? (
                      <div className="space-y-2">
                        {selectedNode.leetcodeProblems.map((link, idx) => (
                          <a 
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:border-emerald-900/50 hover:bg-zinc-900/40 transition-all text-xs font-bold text-zinc-200 hover:text-white"
                          >
                            <span>{link.title}</span>
                            <ExternalLink size={12} className="text-emerald-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-xs italic">No Leetcode problems linked.</p>
                    )}
                  </div>

                  {/* GeeksforGeeks links */}
                  <div className="space-y-3 pt-3 border-t border-zinc-900/60">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      GeeksforGeeks Guides
                    </h4>
                    {selectedNode.geeksforgeeksLinks && selectedNode.geeksforgeeksLinks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedNode.geeksforgeeksLinks.map((link, idx) => (
                          <a 
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all text-xs font-bold text-zinc-200 hover:text-white"
                          >
                            <span>{link.title}</span>
                            <ExternalLink size={12} className="text-zinc-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-xs italic">No GeeksforGeeks guides linked.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Bottom complete checkoff button */}
            <div className="mt-8 pt-4 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-3">
              {roadmap.enrolled ? (
                selectedNode.completed ? (
                  <div className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 rounded-xl text-xs font-bold">
                    <CheckCircle2 size={16} /> Topic Checked Off as Completed
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleMarkNodeCompleted(selectedNode.id)}
                    className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                  >
                    <Check size={16} strokeWidth={3} />
                    Mark Topic as Completed
                  </Button>
                )
              ) : (
                <div className="w-full flex items-start gap-2.5 p-3.5 bg-indigo-950/25 text-indigo-300 border border-indigo-900/30 rounded-xl text-xs">
                  <Compass size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    You must <strong>enroll</strong> in this roadmap path to activate progress logs and check off study topics.
                  </span>
                </div>
              )}
            </div>

          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}

// Flashcard Item component with 3D Flip Effects
function FlashcardItem({ card }: { card: { front: string; back: string } }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      className="group relative h-36 w-full cursor-pointer [perspective:1000px]"
    >
      <div 
        className={`absolute inset-0 h-full w-full rounded-xl border border-zinc-900 bg-zinc-950/80 p-5 shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full rounded-xl p-5 flex flex-col justify-between [backface-visibility:hidden]">
          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 leading-none">Question</span>
          <p className="text-xs font-bold text-white leading-snug">{card.front}</p>
          <span className="text-[9px] text-zinc-500 font-bold leading-none">Click to flip & view answer</span>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 h-full w-full rounded-xl p-5 bg-zinc-900/30 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] border-indigo-900/40">
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 leading-none">Answer</span>
          <p className="text-xs font-medium text-zinc-200 leading-snug">{card.back}</p>
          <span className="text-[9px] text-zinc-500 font-bold leading-none">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}

// Dynamic Question Row Row for Hooks Conformity
interface RoadmapQuestionRowProps {
  question: any;
  isSolved: boolean;
  onSolvedChange: (slug: string, solved: boolean) => void;
}

function RoadmapQuestionRow({ question, isSolved, onSolvedChange }: RoadmapQuestionRowProps) {
  const { useToggleBookmark, useUpdateNote, useSubmitAttempt } = useQuestions();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const toggleBookmarkMutation = useToggleBookmark(question.slug);
  const updateNoteMutation = useUpdateNote(question.slug);
  const submitAttemptMutation = useSubmitAttempt(question.slug);

  const handleToggleSolved = () => {
    const nextSolved = !isSolved;
    submitAttemptMutation.mutate({
      submittedCode: "// Completed via Roadmap preparation checklist",
      language: "JAVA",
      status: nextSolved ? "SOLVED" : "ATTEMPTED"
    }, {
      onSuccess: () => {
        onSolvedChange(question.slug, nextSolved);
        toast.success(nextSolved ? "Question marked as solved!" : "Question marked as unsolved.");
      },
      onError: () => {
        toast.error("Failed to update solve status.");
      }
    });
  };

  const handleToggleBookmark = () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    toggleBookmarkMutation.mutate(undefined, {
      onSuccess: (data) => {
        setIsBookmarked(data);
        toast.success(data ? "Added bookmark!" : "Removed bookmark.");
      },
      onError: () => {
        setIsBookmarked(!nextBookmarked);
        toast.error("Failed to toggle bookmark.");
      }
    });
  };

  const handleSaveNote = () => {
    updateNoteMutation.mutate(noteContent, {
      onSuccess: () => {
        toast.success("Notes saved successfully!");
        setShowNotes(false);
      },
      onError: () => {
        toast.error("Failed to save study notes.");
      }
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toUpperCase()) {
      case "EASY":
        return "text-emerald-400 bg-emerald-950/20 border-emerald-900/20";
      case "MEDIUM":
        return "text-amber-400 bg-amber-950/20 border-amber-900/20";
      default:
        return "text-rose-400 bg-rose-950/20 border-rose-900/20";
    }
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-4 space-y-3 hover:border-zinc-800 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-white leading-none">{question.title}</h4>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold">Topic: {question.topic}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Solved checkcircle */}
          <button 
            onClick={handleToggleSolved}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSolved 
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20" 
                : "border-zinc-850 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
            title={isSolved ? "Mark Unsolved" : "Mark Solved"}
          >
            {isSolved ? <CheckCircle2 size={13} /> : <Circle size={13} />}
          </button>

          {/* Bookmark star */}
          <button 
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked 
                ? "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20" 
                : "border-zinc-850 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
            title="Bookmark Question"
          >
            <Star size={13} fill={isBookmarked ? "currentColor" : "none"} />
          </button>

          {/* Notes filetext */}
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showNotes || noteContent
                ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/20" 
                : "border-zinc-850 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
            title="Study Notes"
          >
            <FileText size={13} />
          </button>
        </div>
      </div>

      {/* Quick External Links */}
      <div className="flex flex-wrap items-center gap-2">
        {question.leetcodeUrl && (
          <a 
            href={question.leetcodeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850/80 px-2 py-0.5 rounded transition-colors"
          >
            LeetCode
            <ExternalLink size={8} />
          </a>
        )}
        {question.gfgUrl && (
          <a 
            href={question.gfgUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850/80 px-2 py-0.5 rounded transition-colors"
          >
            GeeksforGeeks
            <ExternalLink size={8} />
          </a>
        )}
        {question.hackerrankUrl && (
          <a 
            href={question.hackerrankUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850/80 px-2 py-0.5 rounded transition-colors"
          >
            HackerRank
            <ExternalLink size={8} />
          </a>
        )}

      </div>

      {/* Quick Notes Box */}
      {showNotes && (
        <div className="space-y-2 pt-2 border-t border-zinc-900/60">
          <textarea
            placeholder="Write study notes or reminders here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full h-16 bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          />
          <div className="flex justify-end gap-1.5">
            <Button 
              onClick={() => setShowNotes(false)} 
              variant="outline" 
              className="h-6 text-[9px] px-2.5 border-zinc-850 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNote} 
              disabled={updateNoteMutation.isPending}
              className="h-6 text-[9px] px-2.5 bg-indigo-500 hover:bg-indigo-650 text-white font-bold"
            >
              {updateNoteMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
