"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceSnapshot } from "@/types/analytics";

interface ProgressChartProps {
  history: PerformanceSnapshot[];
}

export function ProgressChart({ history }: ProgressChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedData = history.map((h) => {
    try {
      const dateObj = new Date(h.date);
      const label = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        ...h,
        displayDate: label,
      };
    } catch {
      return {
        ...h,
        displayDate: h.date,
      };
    }
  });

  if (!mounted) {
    return (
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Solving Consistency</CardTitle>
          <CardDescription className="text-zinc-500">Historical performance trends over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-t-emerald-500 border-zinc-800 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-800 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Solving Consistency</CardTitle>
        <CardDescription className="text-zinc-500">Historical performance trends over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEasy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
            />
            <Area
              type="monotone"
              dataKey="easySolved"
              name="Easy"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEasy)"
            />
            <Area
              type="monotone"
              dataKey="mediumSolved"
              name="Medium"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMedium)"
            />
            <Area
              type="monotone"
              dataKey="hardSolved"
              name="Hard"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHard)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
