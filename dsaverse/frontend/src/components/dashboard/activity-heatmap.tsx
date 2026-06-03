"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { HeatmapItem } from "@/types/progress";

interface ActivityHeatmapProps {
  data: HeatmapItem[];
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const weeksToShow = 24;
  const daysInWeek = 7;

  // Build grid coordinate mappings
  const gridCells = useMemo(() => {
    const cells = [];
    const today = new Date();
    
    // Set to Saturday of the current week to align grid columns neatly
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const totalDays = weeksToShow * daysInWeek;
    
    // Create activity count maps for fast access
    const activityMap = new Map<string, number>();
    data.forEach((item) => {
      activityMap.set(item.date, item.count);
    });

    for (let i = totalDays - 1; i >= 0; i--) {
      const cellDate = new Date(endOfWeek);
      cellDate.setDate(endOfWeek.getDate() - i);
      
      const dateString = cellDate.toISOString().split("T")[0];
      const count = activityMap.get(dateString) || 0;
      
      cells.push({
        date: dateString,
        count,
        dayOfWeek: cellDate.getDay(),
      });
    }

    // Split cells into columns representing weeks
    const columns = [];
    for (let w = 0; w < weeksToShow; w++) {
      columns.push(cells.slice(w * daysInWeek, (w + 1) * daysInWeek));
    }
    return columns;
  }, [data]);

  // Color mappings based on solve count
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-zinc-900 border border-zinc-950";
    if (count <= 1) return "bg-emerald-950/80 border border-emerald-900/40";
    if (count <= 3) return "bg-emerald-800/80 border border-emerald-700/40";
    if (count <= 5) return "bg-emerald-600 border border-emerald-500/50";
    return "bg-emerald-400 border border-emerald-300";
  };

  return (
    <Card className="border-zinc-900 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300 col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
          Practice Consistency Heatmap
        </CardTitle>
        <CalendarDays size={16} className="text-emerald-400" />
      </CardHeader>
      <CardContent className="py-2">
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-[3px] min-w-max py-2">
            {/* Week Columns */}
            {gridCells.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dIndex) => (
                  <div
                    key={dIndex}
                    title={`${day.date}: ${day.count} solved`}
                    className={`h-3 w-3 rounded-[2px] transition-all hover:scale-125 cursor-pointer ${getColorClass(
                      day.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-xs text-zinc-500 mt-2 border-t border-zinc-900 pt-3">
          <span>Last 24 Weeks</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="h-2.5 w-2.5 rounded-[1px] bg-zinc-900" />
            <div className="h-2.5 w-2.5 rounded-[1px] bg-emerald-950" />
            <div className="h-2.5 w-2.5 rounded-[1px] bg-emerald-800" />
            <div className="h-2.5 w-2.5 rounded-[1px] bg-emerald-600" />
            <div className="h-2.5 w-2.5 rounded-[1px] bg-emerald-400" />
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
