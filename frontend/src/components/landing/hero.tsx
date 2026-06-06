"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function Hero() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-48 md:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px] z-0" />
      <div className="absolute top-[25%] left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px] z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
        {/* Banner Announcement */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md mb-6 animate-pulse">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          Now Live: AI Mock Interview Spaced Repetition
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-none">
          Master Data Structures &{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            Clear Placements
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
          DSAverse is the ultimate AI-powered preparation companion. Experience structured roadmaps, intelligent spaced-repetition, real-time code analysis, and company-targeted mock prep in one beautiful platform.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            asChild
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-8 py-6 rounded-xl text-base shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
          >
            <Link href={isAuthenticated ? "/dashboard" : "/register"} className="flex items-center gap-2">
              Start Free Journey
              <ArrowRight size={18} />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 bg-zinc-900/40 backdrop-blur-sm px-8 py-6 rounded-xl text-base hover:scale-[1.02] transition-all"
          >
            <Link href="#features" className="flex items-center gap-2">
              <Play size={16} fill="currentColor" />
              Watch Demo
            </Link>
          </Button>
        </div>

        {/* Highlights */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-500" /> Free 150 Core Questions
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-500" /> Interactive Spaced Repetition
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-500" /> AI Feedback Loop
          </span>
        </div>

        {/* Visual Mockup */}
        <div className="mt-20 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 shadow-2xl backdrop-blur-md max-w-5xl mx-auto overflow-hidden">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden relative aspect-[16/9] flex flex-col">
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="text-xs font-semibold text-zinc-500">DSAverse Learning Dashboard</div>
              <div className="w-12"></div>
            </div>

            {/* Dashboard Contents Simulation */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Analytics Sidebar */}
              <div className="rounded-xl bg-zinc-900/50 p-4 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Your Daily Streak</div>
                  <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1">
                    18 <span className="text-xs font-semibold text-emerald-400">days active</span>
                  </div>
                </div>
                <div className="mt-4 flex-1 flex flex-col justify-end">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Topic Completion</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-300 font-semibold mb-1">
                        <span>Arrays & Hashing</span>
                        <span>80%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-[80%] bg-emerald-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-zinc-300 font-semibold mb-1">
                        <span>Dynamic Programming</span>
                        <span>45%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-indigo-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spaced Repetition Panel */}
              <div className="md:col-span-2 rounded-xl bg-zinc-900/50 p-4 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Spaced Repetition Queue</div>
                  <h3 className="text-lg font-bold text-white mt-1">3 Questions due for review today</h3>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Merge K Sorted Lists</h4>
                      <span className="text-[10px] bg-red-950/60 border border-red-800/80 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Hard</span>
                    </div>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs h-8">
                      Solve Now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Longest Substring Without Repeating Characters</h4>
                      <span className="text-[10px] bg-amber-950/60 border border-amber-800/80 text-amber-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Medium</span>
                    </div>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs h-8">
                      Solve Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
