"use client";

import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicRadarProps {
  topics: {
    topicName: string;
    accuracy: number;
  }[];
}

export function TopicRadar({ topics }: TopicRadarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard fallback data representing core DSA categories if topics list is small
  const defaultData = [
    { subject: "Dynamic Programming", A: 15, fullMark: 100 },
    { subject: "Graphs", A: 26, fullMark: 100 },
    { subject: "Arrays & Strings", A: 85, fullMark: 100 },
    { subject: "Trees & Maps", A: 65, fullMark: 100 },
    { subject: "Recursion & Backtracking", A: 48, fullMark: 100 },
    { subject: "Greedy", A: 72, fullMark: 100 },
  ];

  const chartData = topics && topics.length >= 3
    ? topics.map(t => ({ subject: t.topicName, A: Math.round(t.accuracy), fullMark: 100 }))
    : defaultData;

  if (!mounted) {
    return (
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Topic Competency</CardTitle>
          <CardDescription className="text-zinc-500">Accuracy rate across major DSA domains</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-t-emerald-500 border-zinc-800 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-800 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Topic Competency</CardTitle>
        <CardDescription className="text-zinc-500">Accuracy rate across major DSA domains</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Radar
              name="Accuracy %"
              dataKey="A"
              stroke="#6366f1"
              fill="#10b981"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
