"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DifficultyPieProps {
  easy: number;
  medium: number;
  hard: number;
}

export function DifficultyPie({ easy, medium, hard }: DifficultyPieProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = easy + medium + hard;
  
  const data = [
    { name: "Easy", value: easy, color: "#10b981", percent: total > 0 ? ((easy / total) * 100).toFixed(1) : "0" },
    { name: "Medium", value: medium, color: "#f59e0b", percent: total > 0 ? ((medium / total) * 100).toFixed(1) : "0" },
    { name: "Hard", value: hard, color: "#f43f5e", percent: total > 0 ? ((hard / total) * 100).toFixed(1) : "0" },
  ];

  if (!mounted) {
    return (
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Difficulty Distribution</CardTitle>
          <CardDescription className="text-zinc-500">Solved question ratios</CardDescription>
        </CardHeader>
        <CardContent className="h-[260px] flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-t-emerald-500 border-zinc-800 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-800 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Difficulty Distribution</CardTitle>
        <CardDescription className="text-zinc-500">Solved question ratios</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative h-[200px] w-[200px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{total}</span>
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Solved</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/30 border border-zinc-900/50 hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-semibold text-zinc-300">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-white">{item.value}</span>
                <span className="text-xs text-zinc-500 ml-2">({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
