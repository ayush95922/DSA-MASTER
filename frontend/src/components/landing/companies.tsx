import React from "react";

const companies = [
  { name: "Google", desc: "120+ Placed", shadow: "hover:shadow-red-500/10" },
  { name: "Microsoft", desc: "180+ Placed", shadow: "hover:shadow-blue-500/10" },
  { name: "Meta", desc: "95+ Placed", shadow: "hover:shadow-indigo-500/10" },
  { name: "Amazon", desc: "240+ Placed", shadow: "hover:shadow-amber-500/10" },
  { name: "Netflix", desc: "40+ Placed", shadow: "hover:shadow-rose-500/10" },
  { name: "Uber", desc: "70+ Placed", shadow: "hover:shadow-emerald-500/10" },
];

export default function Companies() {
  return (
    <section className="py-16 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-8">
          Our Alumni Work At Top Global Tech Giants
        </h3>

        {/* Company Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-900 bg-zinc-900/15 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/30 ${company.shadow} hover:shadow-md cursor-default`}
            >
              <span className="text-lg font-black tracking-tight text-white/70 hover:text-white transition-colors">
                {company.name}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 mt-2 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/30">
                {company.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
