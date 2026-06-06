"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const plans = [
  {
    name: "Full Premium Suite",
    price: "$0",
    period: "forever",
    description: "Access all learning roadmaps, company guides, spaced repetition revisions, and solutions for free.",
    features: [
      "All 500+ Practice & Company Questions",
      "Automated Spaced Repetition Queue & Flashcards",
      "FAANG Prep Weights & Weekly Timelines",
      "Full Multi-Language Optimal Solutions (Java, Python, C++)",
      "Advanced Radar Analytics & Activity heatmaps",
      "Topological Learning Roadmaps & Progress tracking",
      "Access to all future features and updates",
    ],
    cta: "Start Practicing Now",
    href: "/register",
    featured: true,
  },
];

export default function Pricing() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section id="pricing" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pricing Plans</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl mt-3">
            100% Free Algorithmic Masterclass
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            No payments, no hidden lock walls. Explore advanced features, FAANG prep timelines, and optimal solutions completely free.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? "border-emerald-500 bg-zinc-900/60 shadow-xl shadow-emerald-500/5 backdrop-blur-md"
                  : "border-zinc-900 bg-zinc-900/20"
              }`}
            >
              {plan.featured && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-zinc-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm text-zinc-400">/{plan.period}</span>
                </div>

                <hr className="my-6 border-zinc-800" />

                <ul className="space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  className={`w-full font-bold py-6 rounded-xl text-base ${
                    plan.featured
                      ? "bg-emerald-500 hover:bg-emerald-600 text-zinc-950"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                  }`}
                >
                  <Link href={isAuthenticated ? "/dashboard" : plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
