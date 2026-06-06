import React from "react";

const stats = [
  { value: "250K+", label: "Active Members", desc: "Practicing algorithms daily" },
  { value: "10M+", label: "Submissions Evaluated", desc: "Optimizing space & time" },
  { value: "98.4%", label: "Placement Rate", desc: "Graduates clearing top-tier interviews" },
  { value: "500+", label: "Tech Partners", desc: "Actively hiring from our ranks" },
];

export default function Stats() {
  return (
    <section className="relative py-16 border-t border-zinc-900 bg-zinc-950 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px] z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent inline-block">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-zinc-300">
                {stat.label}
              </div>
              <p className="text-xs text-zinc-500 max-w-[200px] mx-auto">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
