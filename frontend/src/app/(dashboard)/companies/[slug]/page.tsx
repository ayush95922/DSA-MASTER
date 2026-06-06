"use client";

import React, { use, useState } from "react";
import { useCompanies } from "@/hooks/use-companies";
import { useQuestions } from "@/hooks/use-questions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  RotateCcw, 
  ArrowLeft, 
  Award, 
  Calendar, 
  ChevronRight, 
  Activity, 
  BookOpen, 
  Star, 
  FileText, 
  MessageSquare, 
  Bookmark,
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Search,
  ExternalLink,
  Video,
  GraduationCap,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CompanyDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { useCompanyDetail } = useCompanies();
  const { useToggleBookmark, useUpdateNote, useSubmitAttempt } = useQuestions();
  
  const { data: company, isLoading, error, refetch } = useCompanyDetail(slug);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [activeNoteQuestion, setActiveNoteQuestion] = useState<{ slug: string; title: string; content: string } | null>(null);

  const toggleBookmarkMutation = useToggleBookmark(slug);
  const updateNoteMutation = useUpdateNote(slug);
  const submitAttemptMutation = useSubmitAttempt();

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "TIER_1":
        return "FAANG / Elite Tier";
      case "TIER_2":
        return "Top Startup Tier";
      default:
        return "Global Enterprise Tier";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case "EASY":
        return "bg-emerald-950/40 border-emerald-900/30 text-emerald-400";
      case "MEDIUM":
        return "bg-amber-950/40 border-amber-900/30 text-amber-400";
      default:
        return "bg-rose-950/40 border-rose-900/30 text-rose-400";
    }
  };

  const handleToggleSolved = (qSlug: string, isCurrentlySolved: boolean) => {
    const nextSolved = !isCurrentlySolved;
    submitAttemptMutation.mutate({
      slug: qSlug,
      payload: {
        submittedCode: "// Completed via Company preparation Sheet checklist",
        language: "JAVA",
        status: nextSolved ? "SOLVED" : "ATTEMPTED"
      }
    }, {
      onSuccess: () => {
        toast.success(nextSolved ? "Question marked as solved!" : "Question marked as unsolved.");
      },
      onError: () => {
        toast.error("Failed to update solve status.");
      }
    });
  };

  const handleToggleBookmark = (qSlug: string) => {
    toggleBookmarkMutation.mutate(qSlug);
  };

  const handleSaveNote = () => {
    if (!activeNoteQuestion) return;
    updateNoteMutation.mutate({ content: activeNoteQuestion.content, qSlug: activeNoteQuestion.slug }, {
      onSuccess: () => {
        setActiveNoteQuestion(null);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-4 w-24 bg-zinc-900" />
          <Skeleton className="h-8 w-64 bg-zinc-900 mt-4" />
          <Skeleton className="h-4 w-96 bg-zinc-900 mt-2" />
        </div>
        <Skeleton className="h-[450px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load company preparation details</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please check your connection and ensure the backend development server is active.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="border-zinc-800 text-zinc-300">
            <Link href="/companies">Back to targets</Link>
          </Button>
          <Button onClick={() => refetch()} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
            <RotateCcw size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Filter questions
  const filteredQuestions = company.questions?.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "ALL" || q.difficulty.toUpperCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to tech targets
        </Link>
      </div>

      {/* Detail Header Panel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-zinc-900 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-950/60 border border-rose-900/40 text-rose-400 px-2 py-0.5 rounded">
              {getTierLabel(company.tier)}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {company.logo && (
              <img src={company.logo} alt={company.name} className="h-10 w-10 object-contain rounded-lg shrink-0 bg-zinc-900 p-1 border border-zinc-800" />
            )}
            {company.name} Preparation Hub
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">{company.description}</p>
        </div>

        {/* Circular Readiness Gauge */}
        <div className="shrink-0 w-full lg:w-auto flex items-center justify-center">
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 px-6 py-4 min-w-[250px] justify-between shadow-xl backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wide">Readiness Score</span>
              <span className="text-lg font-black text-white">{company.readinessPercentage}% ready</span>
              <span className="text-[10px] text-zinc-400 block">Based on solved questions</span>
            </div>
            
            {/* SVG Circle */}
            <div className="relative flex items-center justify-center h-16 w-16 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-zinc-850 fill-transparent"
                  strokeWidth="4.5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-emerald-400 fill-transparent transition-all duration-500"
                  strokeWidth="4.5"
                  strokeDasharray="163.3"
                  strokeDashoffset={163.3 - (163.3 * company.readinessPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-white">{company.readinessPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-950 border border-zinc-900 p-1 rounded-xl flex overflow-x-auto justify-start md:justify-center scrollbar-none gap-2">
          <TabsTrigger value="overview" className="rounded-lg font-bold text-xs uppercase px-4 py-2">
            Overview
          </TabsTrigger>
          <TabsTrigger value="questions" className="rounded-lg font-bold text-xs uppercase px-4 py-2">
            Questions Bank ({company.questions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="rounded-lg font-bold text-xs uppercase px-4 py-2">
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="experiences" className="rounded-lg font-bold text-xs uppercase px-4 py-2">
            Experiences
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg font-bold text-xs uppercase px-4 py-2">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Round focuses */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Activity size={16} className="text-indigo-400" />
                Typical Interview Rounds Focus
              </h3>
              <div className="relative border-l border-zinc-900 pl-6 ml-3 space-y-8 py-2">
                {company.interviewRounds?.map((round, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 border-[3px] border-zinc-950" />
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        Round {index + 1}: {round.name}
                      </h4>
                      <Badge className="bg-indigo-950/40 text-indigo-400 border-indigo-900/30 font-semibold px-2 py-0.5 rounded text-[10px]">
                        Focus: {round.focus}
                      </Badge>
                      <p className="text-xs text-zinc-400 leading-relaxed">{round.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Calendar size={16} className="text-emerald-400" />
                Recommended Preparation Timeline
              </h3>
              <div className="space-y-4">
                {company.preparationTimeline?.map((item, index) => (
                  <Card key={index} className="border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition-colors">
                    <CardContent className="p-5 flex gap-4">
                      <div className="h-12 w-12 rounded-lg bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 leading-none">Week</span>
                        <span className="text-lg font-black leading-none mt-1">{item.weekNumber}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{item.focusArea}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
              <HelpCircle size={16} className="text-rose-400" />
              Frequently Asked Questions (FAQs)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.faqs?.map((faq, index) => (
                <Card key={index} className="border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition-colors">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-sm font-bold text-zinc-100 flex items-start gap-2">
                      <span className="text-emerald-400 font-extrabold shrink-0">Q.</span>
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <p className="text-xs text-zinc-400 leading-relaxed pl-6">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 2. QUESTIONS TAB */}
        <TabsContent value="questions" className="space-y-6 outline-none">
          <Card className="border-zinc-900 bg-zinc-950/20">
            <CardHeader className="p-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-white">Curated Preparation Question Bank</CardTitle>
                <CardDescription className="text-xs text-zinc-400">Tackle targeted, historically high-frequency interview coding challenges.</CardDescription>
              </div>

              {/* Filters search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search questions or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 rounded-lg py-2 px-3 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </CardHeader>

            {/* Questions Table */}
            <CardContent className="p-0 overflow-x-auto">
              {filteredQuestions.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 text-sm">
                  No questions match your filter criteria. Try updating search queries.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-950/60 border-zinc-900">
                    <TableRow className="border-zinc-900 hover:bg-transparent">
                      <TableHead className="w-12 text-center text-zinc-500 font-bold uppercase text-[10px]">Solved</TableHead>
                      <TableHead className="text-zinc-500 font-bold uppercase text-[10px]">Question Name</TableHead>
                      <TableHead className="text-zinc-500 font-bold uppercase text-[10px]">Difficulty</TableHead>
                      <TableHead className="text-zinc-500 font-bold uppercase text-[10px]">Topic</TableHead>
                      <TableHead className="text-zinc-500 font-bold uppercase text-[10px]">Pattern</TableHead>
                      <TableHead className="text-zinc-500 font-bold uppercase text-[10px]">Frequency</TableHead>
                      <TableHead className="text-zinc-500 font-bold uppercase text-[10px] text-center">Resources</TableHead>
                      <TableHead className="w-24 text-zinc-500 font-bold uppercase text-[10px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((q) => (
                      <TableRow key={q.id} className="border-zinc-900 hover:bg-zinc-900/20">
                        {/* Solved check */}
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleSolved(q.slug, q.solved)}
                            className="focus:outline-none"
                          >
                            {q.solved ? (
                              <CheckCircle className="h-5 w-5 text-emerald-400 fill-emerald-500/10 cursor-pointer" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-zinc-800 hover:border-zinc-400 cursor-pointer transition-colors" />
                            )}
                          </button>
                        </TableCell>

                        {/* Title link */}
                        <TableCell className="font-bold text-zinc-100 text-xs">
                          <Link href={`/questions/${q.slug}`} className="hover:text-emerald-400 transition-colors">
                            {q.title}
                          </Link>
                        </TableCell>

                        {/* Difficulty */}
                        <TableCell>
                          <Badge className={`${getDifficultyColor(q.difficulty)} border px-2 py-0.5 rounded font-black text-[10px] uppercase shrink-0`}>
                            {q.difficulty}
                          </Badge>
                        </TableCell>

                        {/* Topic */}
                        <TableCell>
                          <Badge variant="outline" className="border-zinc-900 bg-zinc-950 text-zinc-400 font-bold text-[10px]">
                            {q.topic}
                          </Badge>
                        </TableCell>

                        {/* Pattern */}
                        <TableCell className="text-xs text-zinc-400 font-medium">
                          {q.pattern}
                        </TableCell>

                        {/* Frequency */}
                        <TableCell>
                          <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-950/20 border border-amber-900/30 px-2 py-0.5 rounded">
                            {q.frequency}
                          </span>
                        </TableCell>

                        {/* External links */}
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-2">
                            {q.leetcodeUrl && (
                              <a href={q.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-orange-500 transition-colors">
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {q.geeksforgeeksUrl && (
                              <a href={q.geeksforgeeksUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-500 transition-colors">
                                <GraduationCap size={15} />
                              </a>
                            )}

                          </div>
                        </TableCell>

                        {/* Bookmark / Notes */}
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-3">
                            {/* Bookmark button */}
                            <button
                              onClick={() => handleToggleBookmark(q.slug)}
                              className="focus:outline-none"
                            >
                              <Star
                                size={15}
                                className={q.bookmarked ? "text-amber-400 fill-amber-400" : "text-zinc-500 hover:text-amber-400 transition-colors"}
                              />
                            </button>

                            {/* Note button */}
                            <button
                              onClick={() => setActiveNoteQuestion({ slug: q.slug, title: q.title, content: q.notes })}
                              className="focus:outline-none relative"
                            >
                              <MessageSquare
                                size={15}
                                className={q.notes ? "text-indigo-400 fill-indigo-400/10" : "text-zinc-500 hover:text-indigo-400 transition-colors"}
                              />
                              {q.notes && <span className="absolute -top-1.5 -right-1.5 h-1.5 w-1.5 bg-indigo-500 rounded-full" />}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. ROADMAP TAB */}
        <TabsContent value="roadmap" className="space-y-6 outline-none">
          <Card className="border-zinc-900 bg-zinc-950/20">
            <CardHeader className="p-6 border-b border-zinc-900">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                Target Preparation Roadmap: {company.name} Focus
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                A custom timeline designed to navigate arrays, string indexing, and mathematical concepts required by {company.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {company.companyRoadmap?.map((week, index) => (
                  <Card key={index} className="border-zinc-900 bg-zinc-900/10 relative hover:border-indigo-900/40 transition-colors">
                    <div className="absolute top-4 right-4 text-xs font-black text-zinc-700">W{week.weekNumber}</div>
                    <CardHeader className="p-5 pb-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Stage {week.weekNumber}</span>
                      <CardTitle className="text-sm font-bold text-white mt-1">{week.topics}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="text-xs text-zinc-400 leading-relaxed mt-2">{week.focus}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. EXPERIENCES TAB */}
        <TabsContent value="experiences" className="space-y-6 outline-none">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-teal-400" />
              Shared Interview Experiences & rounds Questions
            </h3>
            <div className="space-y-6">
              {company.interviewExperiences?.map((exp, index) => (
                <Card key={index} className="border-zinc-900 bg-zinc-900/10 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-4 mb-4">
                    <div>
                      <h4 className="text-base font-bold text-white">{exp.title}</h4>
                      <span className="text-xs text-zinc-500 mt-1 block">Rounds: {exp.rounds}</span>
                    </div>
                    <Badge className="bg-teal-950/40 border-teal-900/30 text-teal-400 font-bold px-3 py-1 rounded text-xs uppercase">
                      Difficulty: {exp.difficulty}
                    </Badge>
                  </div>
                  
                  {/* Questions asked */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Questions Asked:</h5>
                    <ul className="list-disc pl-5 space-y-2">
                      {exp.questionsAsked.map((qText, qIdx) => (
                        <li key={qIdx} className="text-xs text-zinc-300 leading-relaxed font-medium">
                          {qText}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  {exp.tips && (
                    <div className="mt-5 p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 leading-relaxed flex items-start gap-3">
                      <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">Candidate Prep Tips:</span>
                        {exp.tips}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 5. ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topic weights */}
            <Card className="border-zinc-900 bg-zinc-950/20">
              <CardHeader className="p-6 border-b border-zinc-900">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-400" />
                  Interview Topic Importance Weightage
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">Analysis of historical questions frequency weightages asked in recruitment tests.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {Object.entries(company.topicWeightages || {}).map(([topic, weight]) => (
                  <div key={topic} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-300">{topic}</span>
                      <span className="text-indigo-400">{weight}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                        style={{ width: `${weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Solved checklist status */}
            <Card className="border-zinc-900 bg-zinc-950/20">
              <CardHeader className="p-6 border-b border-zinc-900">
                <CardTitle className="text-base font-bold text-white">Target Readiness Status Report</CardTitle>
                <CardDescription className="text-xs text-zinc-400">Tracks how many company prep targets you have cleared.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-black text-white">{company.readinessPercentage}%</span>
                  <p className="text-xs text-zinc-500 uppercase font-black tracking-wide mt-1">Ready for {company.name}</p>
                </div>
                <div className="w-full border border-zinc-900 bg-zinc-900/10 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">Target company:</span>
                    <span className="text-white font-extrabold">{company.name}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">Difficulty Bracket:</span>
                    <span className="text-emerald-400 font-extrabold uppercase">{getTierLabel(company.tier)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">Total Curated Questions:</span>
                    <span className="text-white font-extrabold">{company.questions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">Status solved:</span>
                    <span className="text-emerald-400 font-extrabold">
                      {company.questions?.filter(q => q.solved).length || 0} solved
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Note Dialog Popup */}
      <Dialog open={activeNoteQuestion !== null} onOpenChange={(open) => !open && setActiveNoteQuestion(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-100 max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Edit Study Notes: {activeNoteQuestion?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Write your study notes, solutions draft, or complexity analysis here..."
              value={activeNoteQuestion?.content || ""}
              onChange={(e) => {
                if (activeNoteQuestion) {
                  setActiveNoteQuestion({ ...activeNoteQuestion, content: e.target.value });
                }
              }}
              rows={6}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs focus:ring-emerald-500 rounded-xl"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveNoteQuestion(null)}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              disabled={updateNoteMutation.isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
            >
              {updateNoteMutation.isPending ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
