"use client";
 
import React, { useState } from "react";
import { useCompanies } from "@/hooks/use-companies";
import CompanyCard from "@/components/company/company-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Search, SlidersHorizontal, Trash2, HelpCircle } from "lucide-react";

export default function CompaniesPage() {
  const { useCompaniesList } = useCompanies();
  const { data: companies, isLoading, error, refetch } = useCompaniesList();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  const resetFilters = () => {
    setSearchQuery("");
    setTierFilter("ALL");
    setDifficultyFilter("ALL");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-72 bg-zinc-900 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
        </div>
      </div>
    );
  }

  if (error || !companies || companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Unable to load companies</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please check your connection and ensure the backend development server is active and populated.
        </p>
        <Button onClick={() => refetch()} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
          <RotateCcw size={16} className="mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  // Filter companies
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.mostAskedTopics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === "ALL" || company.tier === tierFilter;

    // Difficulty fallback logic matching backend cards
    const diff = company.difficulty || (company.tier === "TIER_1" ? "Hard" : company.tier === "TIER_2" ? "Medium" : "Easy");
    const matchesDifficulty = difficultyFilter === "ALL" || diff.toUpperCase() === difficultyFilter.toUpperCase();

    return matchesSearch && matchesTier && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Company Prep Targets
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore typified interview processes, structured timeline guides, and readiness scores for elite global targets.
        </p>
      </div>

      {/* Advanced Interactive Filters Panel */}
      <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold uppercase tracking-wider border-b border-zinc-900 pb-3">
          <SlidersHorizontal size={14} className="text-emerald-400" />
          Filter Preparation Hubs
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <div className="relative md:col-span-6">
            <Search size={15} className="absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search companies by name, description, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Tier filter */}
          <div className="md:col-span-3">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 px-4 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Company Tiers</option>
              <option value="TIER_1">FAANG / Elite Tier</option>
              <option value="TIER_2">Top Startup Tier</option>
              <option value="TIER_3">Global Enterprise Tier</option>
            </select>
          </div>

          {/* Difficulty filter */}
          <div className="md:col-span-3">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 px-4 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy Difficulty</option>
              <option value="MEDIUM">Medium Difficulty</option>
              <option value="HARD">Hard Difficulty</option>
            </select>
          </div>
        </div>

        {/* Filters state description & clear button */}
        {(searchQuery || tierFilter !== "ALL" || difficultyFilter !== "ALL") && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-[10px] font-semibold text-zinc-500">
              Showing {filteredCompanies.length} of {companies.length} targets matching current filters.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 size={12} />
              Reset Active Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid mapping */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl py-16 text-center max-w-xl mx-auto space-y-4">
          <HelpCircle size={36} className="text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No company matches found</h4>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Try adjusting your search terms or relaxing the Tier and Difficulty filters.
          </p>
          <Button onClick={resetFilters} className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs rounded-xl py-2 px-4">
            Reset search criteria
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
