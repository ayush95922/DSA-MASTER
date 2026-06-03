import React from "react";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Stats from "@/components/landing/stats";
import Companies from "@/components/landing/companies";
import Pricing from "@/components/landing/pricing";
import FAQ from "@/components/landing/faq";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100 antialiased overflow-x-hidden">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Contents */}
      <main className="flex-grow">
        <Hero />
        <Companies />
        <Features />
        <Stats />
        <Pricing />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

