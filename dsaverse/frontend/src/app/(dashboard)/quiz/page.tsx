"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Clock, CheckCircle2, XCircle, Award, RefreshCw, Layers } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
}

export default function QuizPage() {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [status, setStatus] = useState<"setup" | "loading" | "active" | "completed">("setup");
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);

  const handleComplete = () => {
    setStatus("completed");
  };

  // Timer loop
  useEffect(() => {
    if (status !== "active" || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, status]);

  // Auto-submit on timeout
  useEffect(() => {
    if (status === "active" && timeLeft === 0) {
      setTimeout(() => {
        handleComplete();
      }, 0);
      toast.warning("Time limit exceeded! Auto-submitting responses.");
    }
  }, [timeLeft, status]);

  const handleGenerate = async () => {
    setStatus("loading");
    try {
      const response = await apiClient.post(`/ai/quiz/generate?topic=${topic}&difficulty=${difficulty}`);
      setQuizQuestions(response.data.data);
      setSelectedAnswers(new Array(response.data.data.length).fill(""));
      setCurrentIdx(0);
      setTimeLeft(300); // 5 minutes limit
      setStatus("active");
      toast.success("Quiz created! Good luck!");
    } catch {
      toast.error("Failed to generate quiz questions.");
      setStatus("setup");
    }
  };

  const handleSelectOption = (optionLetter: string) => {
    setSelectedAnswers(prev => {
      const copy = [...prev];
      copy[currentIdx] = optionLetter;
      return copy;
    });
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const score = useMemo(() => {
    if (status !== "completed") return 0;
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOption) {
        correct++;
      }
    });
    return correct;
  }, [selectedAnswers, quizQuestions, status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. SETUP INTERFACE
  if (status === "setup") {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 justify-center">
            AI Placement Quiz
            <Brain className="h-6 w-6 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1 text-center">
            Generate custom multiple-choice assessments dynamically to test your algorithmic limits.
          </p>
        </div>

        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold text-white">Quiz Settings</CardTitle>
            <CardDescription className="text-zinc-500">Pick a subject area and target difficulty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-0 pb-0">
            {/* Topic selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Arrays">Arrays & Hashing</option>
                <option value="Strings">Strings & Substrings</option>
                <option value="Linked Lists">Linked Lists</option>
                <option value="Stacks">Stacks & Queues</option>
                <option value="Sorting & Searching">Sorting & Searching</option>
                <option value="Binary Trees">Binary Trees & BST</option>
                <option value="Graphs">Graphs & Networks</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
                <option value="Segment Trees">Segment & Fenwick Trees</option>
              </select>
            </div>

            {/* Difficulty selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {["EASY", "MEDIUM", "HARD"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`border px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      difficulty === diff
                        ? "bg-emerald-500 border-emerald-500 text-zinc-950 font-extrabold"
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Trigger */}
            <Button
              onClick={handleGenerate}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black py-6 rounded-xl text-sm cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              Start Placement Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. LOADING STATE
  if (status === "loading") {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12 flex flex-col items-center justify-center text-center">
        <div className="h-14 w-14 rounded-2xl bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 flex items-center justify-center animate-spin mb-4">
          <RefreshCw size={24} />
        </div>
        <h3 className="text-lg font-bold text-white">Generating Quiz Questions...</h3>
        <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
          I am asking our AI coach to assemble exactly 5 tailored MCQs with detailed explanations. Please hold tight!
        </p>
      </div>
    );
  }

  // 3. ACTIVE QUIZ WIZARD
  if (status === "active") {
    const q = quizQuestions[currentIdx];
    const isFirst = currentIdx === 0;
    const isLast = currentIdx === quizQuestions.length - 1;
    const currentSelected = selectedAnswers[currentIdx];

    const letters = ["A", "B", "C", "D"];

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Timer & progress header */}
        <div className="flex justify-between items-center bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <Layers size={14} className="text-indigo-400" />
            Question {currentIdx + 1} of {quizQuestions.length}
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 text-sm font-black font-mono">
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question card */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md p-6 space-y-6">
          <h2 className="text-base md:text-lg font-extrabold text-white leading-relaxed">
            {q.questionText}
          </h2>

          {/* Options mapping */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const letter = letters[idx];
              const isSelected = currentSelected === letter;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(letter)}
                  className={`w-full flex items-center gap-4 border text-left px-5 py-4 rounded-xl text-sm transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-zinc-900/20 border-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-900/40"
                  }`}
                >
                  <span className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border text-xs font-black transition-all ${
                    isSelected
                      ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}>
                    {letter}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between items-center border-t border-zinc-900 pt-6">
            <Button
              disabled={isFirst}
              onClick={handlePrev}
              variant="outline"
              className="border-zinc-800 text-zinc-300 hover:text-white cursor-pointer disabled:opacity-30"
            >
              Previous
            </Button>

            {isLast ? (
              <Button
                onClick={handleComplete}
                disabled={selectedAnswers.includes("")}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black px-6 cursor-pointer disabled:opacity-40"
              >
                Submit Answers
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 font-bold cursor-pointer"
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // 4. SCORECARD & DETAILED REVIEWS
  if (status === "completed") {
    const successPercentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Score banner */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0 animate-bounce">
            <Award size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">Quiz Successfully Completed!</h2>
            <p className="text-xs text-zinc-500">Topic: {topic} • Difficulty: {difficulty}</p>
          </div>
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-5xl font-black text-white">{successPercentage}%</span>
            <span className="text-sm text-zinc-550 font-semibold">score</span>
          </div>
          <p className="text-sm text-zinc-400 font-medium">
            You got **{score} out of 5** correct.
          </p>
          <Button
            onClick={() => setStatus("setup")}
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold px-6 cursor-pointer"
          >
            Take Another Quiz
          </Button>
        </Card>

        {/* Detailed Solutions Review */}
        <div className="space-y-6">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-zinc-900 pb-2">
            Detailed Explanation Review
          </h3>

          <div className="space-y-6">
            {quizQuestions.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.correctOption;

              return (
                <Card key={idx} className={`border p-5 space-y-4 ${
                  isCorrect ? "bg-emerald-950/5 border-emerald-950/60" : "bg-rose-950/5 border-rose-950/60"
                }`}>
                  {/* Status header */}
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span className="text-emerald-400">Correct Answer</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-rose-500" />
                        <span className="text-rose-500">Incorrect Answer</span>
                      </>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white leading-relaxed">{q.questionText}</h4>

                  {/* Options review */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const letter = ["A", "B", "C", "D"][oIdx];
                      const isUser = userAnswer === letter;
                      const isCorrectOpt = q.correctOption === letter;

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-lg border flex gap-2 items-center ${
                            isCorrectOpt
                              ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400 font-bold"
                              : isUser
                              ? "bg-rose-950/40 border-rose-900/50 text-rose-400 font-bold"
                              : "bg-zinc-900/20 border-zinc-900/80 text-zinc-400"
                          }`}
                        >
                          <span className={`h-5 w-5 rounded flex items-center justify-center shrink-0 font-bold text-[10px] ${
                            isCorrectOpt ? "bg-emerald-400 text-zinc-950" : "bg-zinc-900 border border-zinc-800"
                          }`}>
                            {letter}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation text */}
                  <div className="text-xs text-zinc-400 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/80 leading-relaxed font-sans">
                    <span className="font-extrabold text-white block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
