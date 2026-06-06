"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What makes DSAverse different from LeetCode or GeeksforGeeks?",
    answer: "Unlike standard repository lists, DSAverse is a highly personalized preparation suite. We integrate structured learning roadmaps with an active spaced-repetition scheduler (SM-2 based) that dynamically feeds you review topics. We also calculate precise placement company readiness scores so you know exactly when you're ready to clear interviews.",
  },
  {
    question: "How does the Spaced Repetition queue work?",
    answer: "Whenever you solve or attempt a question, you log your ease of solving (e.g. struggled, solved with hint, solved optimally). Our algorithms compute your next optimal review date. A list of due questions appears daily on your dashboard. Re-solving them at these calculated intervals locks them into your long-term muscle memory.",
  },
  {
    question: "Can I prepare for a specific company like Google or Amazon?",
    answer: "Yes! Placement PRO unlocks targeted prep modules. You can select specific tech giants, view which DSA topics they weight heavily, align your schedule to their typical timelines, and watch your Readiness Gauge rise as you solve their highly-frequent questions.",
  },
  {
    question: "Can I use DSAverse for free?",
    answer: "Absolutely. Our Free Core plan gives you complete access to standard roadmaps, all core structural theory guides, and 150 essential DSA practice questions covering basic to advanced patterns. No credit card is required to sign up.",
  },
  {
    question: "Is there an AI code assistant?",
    answer: "Yes! The platform houses an integrated AI Editorial assistant. If you're stuck, the assistant can provide incremental, spoiler-free hints, analyze the time & space complexity of your approach, and guide you towards optimal solutions.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">FAQ</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-3">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Have questions about the platform or how it works? We&apos;ve got answers.
          </p>
        </div>

        {/* Accordions */}
        <Accordion type="single" className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-zinc-900 bg-zinc-900/10 rounded-xl px-6 py-2 transition-all hover:border-zinc-800"
            >
              <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 hover:no-underline text-base md:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-sm md:text-base leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
