import React from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-zinc-100 antialiased">
      {/* Dynamic glow backdrops */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
      >
        <MoveLeft size={16} />
        Back to home
      </Link>

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-3xl font-extrabold tracking-wider text-transparent">
              DSAverse
            </span>
          </Link>
          <p className="mt-2 text-sm text-zinc-400">
            The AI-powered DSA & placement preparation platform
          </p>
        </div>

        {/* Card wrapper */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
