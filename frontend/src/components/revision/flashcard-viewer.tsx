"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, HelpCircle, Eye, RefreshCw, CheckCircle2 } from "lucide-react";
import { Flashcard } from "@/types/revision";

interface FlashcardViewerProps {
  cards: Flashcard[];
  onReviewSubmit: (cardId: number, rating: number) => void;
  onSessionComplete: (reviewedCount: number) => void;
}

export function FlashcardViewer({ cards, onReviewSubmit, onSessionComplete }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    // Reset state on new card deck trigger
    setTimeout(() => {
      setCurrentIndex(0);
      setIsFlipped(false);
      setReviewedCount(0);
    }, 0);
  }, [cards]);

  const hasCards = cards && cards.length > 0;
  const currentCard = hasCards ? cards[currentIndex] : null;

  const handleRating = useCallback((rating: number) => {
    if (!currentCard) return;
    onReviewSubmit(currentCard.id, rating);
    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);

    // Proceed to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onSessionComplete(reviewedCount + 1);
    }
  }, [currentCard, onReviewSubmit, currentIndex, cards.length, onSessionComplete, reviewedCount]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!hasCards) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped && ["1", "2", "3", "4", "5"].includes(e.key)) {
        handleRating(parseInt(e.key));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, hasCards, handleRating]);

  if (!hasCards) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-950/40 rounded-2xl border border-zinc-900">
        <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white">All caught up!</h3>
        <p className="text-sm text-zinc-500 mt-2 max-w-sm">
          No flashcards are due for review. Check back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Track */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Progress: {currentIndex + 1} of {cards.length}
        </span>
        <div className="h-2 w-48 bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        className="relative h-[280px] w-full cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full preserve-3d duration-700 relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 80 }}
        >
          {/* Card Front Side */}
          <Card className="absolute inset-0 backface-hidden border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between p-6 hover:border-zinc-800 transition-all shadow-xl shadow-black/10">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                Concept Question
              </span>
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
            </div>
            
            <div className="flex-1 flex items-center justify-center py-4">
              <p className="text-lg md:text-xl font-bold text-white text-center leading-relaxed max-w-lg">
                {currentCard?.front}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-bold">
              <Eye className="h-3.5 w-3.5" />
              Click Card or Press Space to Reveal Answer
            </div>
          </Card>

          {/* Card Back Side */}
          <Card 
            className="absolute inset-0 backface-hidden border-zinc-900 bg-zinc-950/60 backdrop-blur-md flex flex-col justify-between p-6 shadow-xl shadow-black/20"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Answer Explanation
              </span>
              <RefreshCw className="h-4 w-4 text-indigo-400" />
            </div>
            
            <div className="flex-1 flex items-center justify-center py-4 overflow-y-auto max-h-[140px] pr-2">
              <p className="text-sm md:text-base font-semibold text-zinc-200 text-center whitespace-pre-line leading-relaxed max-w-lg">
                {currentCard?.back}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-zinc-600 text-xs font-bold">
              Click again to flip back
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Spaced repetition scoring buttons */}
      <AnimatePresence mode="wait">
        {isFlipped ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 bg-zinc-900/20 p-6 rounded-2xl border border-zinc-900/60"
          >
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
              How well did you recall this concept?
            </span>
            <div className="grid grid-cols-5 gap-2 w-full max-w-md">
              <Button
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleRating(1); }}
                className="border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-zinc-950 font-bold flex flex-col items-center py-2 h-auto text-rose-400 transition-all cursor-pointer"
              >
                <span className="text-base font-black">1</span>
                <span className="text-[9px] uppercase tracking-wider">Forgot</span>
              </Button>
              <Button
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleRating(2); }}
                className="border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-zinc-950 font-bold flex flex-col items-center py-2 h-auto text-rose-400 transition-all cursor-pointer"
              >
                <span className="text-base font-black">2</span>
                <span className="text-[9px] uppercase tracking-wider">Hard</span>
              </Button>
              <Button
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleRating(3); }}
                className="border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:text-zinc-950 font-bold flex flex-col items-center py-2 h-auto text-amber-400 transition-all cursor-pointer"
              >
                <span className="text-base font-black">3</span>
                <span className="text-[9px] uppercase tracking-wider">Good</span>
              </Button>
              <Button
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleRating(4); }}
                className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-zinc-950 font-bold flex flex-col items-center py-2 h-auto text-emerald-400 transition-all cursor-pointer"
              >
                <span className="text-base font-black">4</span>
                <span className="text-[9px] uppercase tracking-wider">Easy</span>
              </Button>
              <Button
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleRating(5); }}
                className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-zinc-950 font-bold flex flex-col items-center py-2 h-auto text-emerald-400 transition-all cursor-pointer"
              >
                <span className="text-base font-black">5</span>
                <span className="text-[9px] uppercase tracking-wider">Perfect</span>
              </Button>
            </div>
            <p className="text-[10px] text-zinc-500 font-semibold mt-1">
              Shortcuts: Use keys <kbd className="px-1 bg-zinc-900 border border-zinc-800 rounded">1</kbd> to <kbd className="px-1 bg-zinc-900 border border-zinc-800 rounded">5</kbd> for quick scores
            </p>
          </motion.div>
        ) : (
          <div className="h-[96px] flex items-center justify-center bg-zinc-900/10 rounded-2xl border border-dashed border-zinc-900/60 text-zinc-500 text-sm font-semibold">
            Reveal the answer card to grade your recall accuracy
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
