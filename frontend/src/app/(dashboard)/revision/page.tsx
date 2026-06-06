"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRevision } from "@/hooks/use-revision";
import { FlashcardViewer } from "@/components/revision/flashcard-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  RotateCcw, 
  BookOpen, 
  Brain, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  History, 
  ArrowLeft,
  Flame,
  Star,
  Check,
  ChevronRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function RevisionPage() {
  const { 
    useDueReviews, 
    useDecks, 
    useCards, 
    useSubmitQuestionReview, 
    useSubmitCardReview, 
    useSyncSession,
    useGenerateFlashcards
  } = useRevision();

  const dueReviewsQuery = useDueReviews();
  const decksQuery = useDecks();

  const [activeSession, setActiveSession] = useState<"questions" | "cards" | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [gradingQuestionId, setGradingQuestionId] = useState<number | null>(null);

  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const generateFlashcardsMutation = useGenerateFlashcards();

  const handleGenerateFlashcards = (topic: string) => {
    if (!topic.trim()) {
      toast.error("Please enter a valid topic name.");
      return;
    }
    setIsGenerating(true);
    generateFlashcardsMutation.mutate(topic, {
      onSuccess: () => {
        toast.success(`Dynamic AI Flashcards generated for ${topic}! 🎉`);
        setIsGenerating(false);
        setAiTopic("");
        decksQuery.refetch();
      },
      onError: (err) => {
        toast.error("Failed to generate AI flashcards. Make sure the backend is active.");
        setIsGenerating(false);
      }
    });
  };

  // Fetch cards if deck session is active
  const cardsQuery = useCards(selectedDeckId);

  const submitQuestionReviewMutation = useSubmitQuestionReview();
  const submitCardReviewMutation = useSubmitCardReview();
  const syncSessionMutation = useSyncSession();

  // Loading state
  const isLoading = dueReviewsQuery.isLoading || decksQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 bg-zinc-900/60" />
          <Skeleton className="h-4 w-96 bg-zinc-900/60 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[180px] rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[180px] rounded-2xl bg-zinc-900/60" />
        </div>
        <Skeleton className="h-[250px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  // Error boundary page fallback
  if (dueReviewsQuery.error || decksQuery.error || !dueReviewsQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load revision scheduler</h3>
        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
          Please check your connection and ensure the backend development server is active.
        </p>
        <Button
          onClick={() => { dueReviewsQuery.refetch(); decksQuery.refetch(); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
        >
          <RotateCcw size={16} className="mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const { dueQuestionsCount, dueCardsCount, dueQuestions, dueCards } = dueReviewsQuery.data;
  const decks = decksQuery.data || [];

  const handleCardReviewSubmit = (cardId: number, rating: number) => {
    submitCardReviewMutation.mutate({ cardId, rating }, {
      onSuccess: () => {
        toast.success("Response recorded!");
      },
      onError: () => {
        toast.error("Failed to record response. Please try again.");
      }
    });
  };

  const handleQuestionReviewSubmit = (questionId: number, rating: number) => {
    submitQuestionReviewMutation.mutate({ questionId, rating }, {
      onSuccess: () => {
        toast.success("Revision progress updated!");
        setGradingQuestionId(null);
      },
      onError: () => {
        toast.error("Failed to update revision progress.");
      }
    });
  };

  const handleSessionComplete = (reviewedCount: number) => {
    syncSessionMutation.mutate({ 
      cardsReviewed: activeSession === "cards" ? reviewedCount : 0, 
      questionsReviewed: activeSession === "questions" ? reviewedCount : 0 
    });
    toast.success("Session completed and synced! Great job! 🎉");
    setActiveSession(null);
    setSelectedDeckId(null);
    dueReviewsQuery.refetch();
  };

  // RENDER INTERACTIVE SLIDESHOW SESSION
  if (activeSession === "cards") {
    const activeCards = selectedDeckId 
      ? cardsQuery.data || [] 
      : dueCards.map(dc => ({ id: dc.id, deckId: dc.deckId, front: dc.front, back: dc.back }));

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => { setActiveSession(null); setSelectedDeckId(null); }}
          className="text-zinc-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-2" />
          Exit Session
        </Button>

        {cardsQuery.isLoading && activeSession === "cards" && selectedDeckId ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-t-emerald-500 border-zinc-800 animate-spin" />
            <span className="text-sm text-zinc-400 mt-4 font-semibold">Assembling flashcard deck...</span>
          </div>
        ) : (
          <FlashcardViewer 
            cards={activeCards}
            onReviewSubmit={handleCardReviewSubmit}
            onSessionComplete={handleSessionComplete}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Spaced Repetition Center
          <Brain className="h-6 w-6 text-emerald-400" />
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Based on the SuperMemo SM-2 algorithm. Solve and score questions to schedule optimal review dates.
        </p>
      </div>

      {/* 2. Due items overview row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* due questions card */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-800 transition-colors flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-400" />
              Coding Revisions
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Questions that need coding practice to retain memory pathways
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{dueQuestionsCount}</span>
              <span className="text-sm font-semibold text-zinc-500">due today</span>
            </div>
            {dueQuestionsCount > 0 ? (
              <Button 
                onClick={() => toast.info("Please pick a question from the due list below to practice and grade.")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
              >
                Launch Coding Review
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <div className="text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/30 rounded-lg p-3 flex items-center gap-2">
                <Check className="h-4 w-4" /> All coding revisions clear! Awesome consistency!
              </div>
            )}
          </CardContent>
        </Card>

        {/* due flashcards card */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-800 transition-colors flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-emerald-400 animate-pulse" />
              Active Flashcards
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Quick theoretical recall reviews on complexities and basics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{dueCardsCount}</span>
              <span className="text-sm font-semibold text-zinc-500">due today</span>
            </div>
            {dueCardsCount > 0 ? (
              <Button 
                onClick={() => setActiveSession("cards")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold cursor-pointer"
              >
                Start Flashcard Session
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <div className="text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/30 rounded-lg p-3 flex items-center gap-2">
                <Check className="h-4 w-4" /> All core flashcards reviewed. Keep it up!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. due questions listing */}
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            Due Coding Questions
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Click to solve, then rate your recall efficiency below to schedule the next review slot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dueQuestions && dueQuestions.length > 0 ? (
            <div className="space-y-4">
              {dueQuestions.map((q) => (
                <div 
                  key={q.id}
                  className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/questions/${q.slug}`}
                        className="font-bold text-white hover:text-emerald-400 hover:underline flex items-center gap-1 group"
                      >
                        {q.title}
                        <ArrowLeft className="h-3.5 w-3.5 rotate-135 opacity-0 group-hover:opacity-100 transition-all text-emerald-400" />
                      </Link>
                      <Badge className={
                        q.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        q.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }>
                        {q.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Previous repetitions: {q.repetitions} • Retained interval: {q.intervalDays} {q.intervalDays === 1 ? "day" : "days"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    {gradingQuestionId === q.id ? (
                      <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-lg border border-zinc-800">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Button
                            key={num}
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuestionReviewSubmit(q.id, num)}
                            className="h-8 w-8 hover:bg-zinc-800 text-zinc-300 font-bold hover:text-white rounded-md cursor-pointer"
                          >
                            {num}
                          </Button>
                        ))}
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setGradingQuestionId(null)}
                          className="text-xs text-zinc-500 font-semibold px-2 cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Link href={`/questions/${q.slug}`}>
                          <Button 
                            variant="secondary"
                            size="sm"
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold cursor-pointer"
                          >
                            Solve Challenge
                          </Button>
                        </Link>
                        <Button
                          onClick={() => setGradingQuestionId(q.id)}
                          size="sm"
                          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-zinc-950 font-bold cursor-pointer"
                        >
                          Grade Recall
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles size={32} className="text-emerald-400 animate-bounce mb-2" />
              <h4 className="font-bold text-white">All scheduled questions reviewed!</h4>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">
                No due coding questions found today. Practice more questions from the library and they will auto-schedule!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Flashcards Generator card */}
      <Card className="border-zinc-900 bg-gradient-to-br from-indigo-950/20 via-zinc-950/40 to-emerald-950/10 backdrop-blur-md hover:border-zinc-800 transition-all p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              Dynamic AI Flashcard Generator
            </h3>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Struggling with a specific DSA pattern? Enter any topic (e.g., <code className="text-emerald-400">Sliding Window</code>, <code className="text-indigo-400">Backtracking</code>, <code className="text-amber-400">Segment Trees</code>) and our AI Placement Coach will generate a high-fidelity spaced-repetition deck automatically.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto sm:max-w-md shrink-0">
            <input
              type="text"
              placeholder="e.g. Dynamic Programming..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              disabled={isGenerating}
              className="bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-zinc-600 flex-1 sm:w-64"
            />
            <Button
              onClick={() => handleGenerateFlashcards(aiTopic)}
              disabled={isGenerating || !aiTopic.trim()}
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold cursor-pointer transition-all duration-300 shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 shrink-0 animate-shimmer"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate AI Deck
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick select chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs text-zinc-500 font-medium">Quick suggestions:</span>
          {["Backtracking", "Dynamic Programming", "Sliding Window", "Trie Data Structure", "KMP Algorithm"].map((t) => (
            <button
              key={t}
              onClick={() => setAiTopic(t)}
              disabled={isGenerating}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* 4. Flashcard decks listing */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Concept Flashcard Decks
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Choose a subject area to practice theory definitions, runtime patterns, and space limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <motion.div
              key={deck.id}
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold">
                      {deck.cardCount} Cards
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white mt-2">
                    {deck.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-500 text-xs line-clamp-2">
                    {deck.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    onClick={() => { setSelectedDeckId(deck.id); setActiveSession("cards"); }}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 font-bold text-xs cursor-pointer"
                  >
                    Study Deck
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
