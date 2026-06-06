"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FiltersState {
  search: string;
  difficulty: string;
  status: string;
}

interface QuestionFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

export default function QuestionFilters({
  filters,
  onFiltersChange,
}: QuestionFiltersProps) {
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleDifficultyChange = (val: string | null) => {
    if (val === null) return;
    onFiltersChange({ ...filters, difficulty: val === "ALL" ? "" : val });
  };

  const handleStatusChange = (val: string | null) => {
    if (val === null) return;
    onFiltersChange({ ...filters, status: val === "ALL" ? "" : val });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-zinc-900 bg-zinc-900/10 p-4 rounded-xl">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search by challenge name..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500"
        />
      </div>

      {/* 2. Difficulty Filter */}
      <Select
        defaultValue={filters.difficulty || "ALL"}
        onValueChange={handleDifficultyChange}
      >
        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:ring-emerald-500">
          <SelectValue placeholder="Filter by Difficulty" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
          <SelectItem value="ALL">All Difficulties</SelectItem>
          <SelectItem value="EASY">Easy</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HARD">Hard</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Status Filter */}
      <Select
        defaultValue={filters.status || "ALL"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:ring-emerald-500">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="SOLVED">Solved</SelectItem>
          <SelectItem value="ATTEMPTED">Attempted</SelectItem>
          <SelectItem value="UNATTEMPTED">Unattempted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
