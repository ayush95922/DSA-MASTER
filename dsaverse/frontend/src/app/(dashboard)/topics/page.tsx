"use client";

import React from "react";
import { useTopics } from "@/hooks/use-topics";
import TopicCard from "@/components/topic/topic-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, BookOpen } from "lucide-react";

export default function TopicsPage() {
  const { useCategoriesList } = useTopics();
  const { data: categories, isLoading, error, refetch } = useCategoriesList();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-72 bg-zinc-900 mt-2" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-6 w-36 bg-zinc-900" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
            <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
            <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
            <Skeleton className="h-[150px] w-full rounded-2xl bg-zinc-900/60" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to load DSA categories</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please check your connection and ensure the backend development server is active.
        </p>
        <Button onClick={() => refetch()} className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
          <RotateCcw size={16} className="mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Data Structures & Algorithms
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore theory guides and practice sets categorized logically by core structures.
        </p>
      </div>

      {/* Categories Mapping */}
      {categories?.map((category) => (
        <div key={category.id} className="space-y-4 border-t border-zinc-900/80 pt-8 first:border-none first:pt-0">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400" />
              {category.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
