import React from "react";
import { Compass, Calendar, BarChart3, Building, BrainCircuit, Sparkles } from "lucide-react";

const features = [
  {
    icon: Compass,
    title: "Guided Interactive Roadmaps",
    description: "Follow structural trees designed by lead FAANG architects. Progress logically from basic arrays to advanced graph theory without ever feeling lost.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Calendar,
    title: "Spaced Repetition Scheduler",
    description: "Leverage a customized SuperMemo-2 (SM-2) algorithm. The platform automates exactly when you should re-solve forgotten questions to build long-term muscle memory.",
    color: "from-indigo-400 to-purple-500",
  },
  {
    icon: Building,
    title: "Company-Targeted Preparation",
    description: "Target top tech giants (Google, Amazon, Meta, Microsoft, Uber). Get instant access to company frequency weights, process timelines, and readiness gauge scoring.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: BrainCircuit,
    title: "AI Editorial Assistant",
    description: "Stuck on a tricky edge case? Get instant, context-aware AI hints, structural refactoring advice, and optimal time-space complexity walkthroughs in real-time.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Detailed Progress Analytics",
    description: "Visualize your strengths and weaknesses through automated radar maps, difficulty breakdown metrics, completion heatmaps, and accuracy rate trackers.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Placement Readiness Gauge",
    description: "Calculate your readiness percentage based on solved questions, interview weight frequency, average completion time, and historical placement conversion odds.",
    color: "from-emerald-400 to-indigo-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Core Features</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl mt-3">
            Engineered For Consistent Placement Success
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Ditch disorganized sheet grids. DSAverse integrates comprehensive analytics, spaced repetition practice, and advanced targeted dashboards for unparalleled focus.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-zinc-900 bg-zinc-900/25 p-6 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 overflow-hidden"
              >
                {/* Glow backdrop on hover */}
                <div className={`absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] blur-xl transition-all duration-300`} />

                {/* Icon wrapper */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-[1px]`}>
                  <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-zinc-950 text-white group-hover:text-emerald-400 transition-colors">
                    <Icon size={22} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
