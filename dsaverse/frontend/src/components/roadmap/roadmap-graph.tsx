"use client";

import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  MarkerType,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { CheckCircle2, Circle, Lock, Play } from "lucide-react";
import { RoadmapNodeInfo } from "@/types/roadmap";

interface RoadmapGraphProps {
  nodes: RoadmapNodeInfo[];
  slug: string;
  onSelectNode: (node: RoadmapNodeInfo) => void;
  isEnrolled: boolean;
  localSolvedMap?: Record<string, boolean>;
  solvedQuestionSlugs?: Set<string>;
}

// 1. Get Topic Difficulty based on standard DSA placement learning curve
const getTopicDifficulty = (title: string): "EASY" | "MEDIUM" | "HARD" => {
  const t = title.toLowerCase();
  if (t.includes("basics") || t.includes("arrays") || t.includes("strings") || t.includes("hashing")) {
    return "EASY";
  }
  if (
    t.includes("pointer") ||
    t.includes("window") ||
    t.includes("search") ||
    t.includes("list") ||
    t.includes("stack") ||
    t.includes("queue") ||
    t.includes("tree") ||
    t.includes("bst") ||
    t.includes("heap")
  ) {
    return "MEDIUM";
  }
  return "HARD";
};

// 2. Custom Node Component rendering premium dark glassmorphism cards
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DSARoadmapNode({ data }: { data: any }) {
  const node = data.node;
  const status = data.status;
  const solvedCount = data.solvedCount;
  const totalCount = data.totalCount;
  const difficulty = data.difficulty;

  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";
  const isUnlocked = status === "UNLOCKED";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isLocked = status === "LOCKED";

  // Difficulty badge styling
  const diffColors = {
    EASY: "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40",
    MEDIUM: "bg-amber-950/60 text-amber-400 border border-amber-900/40",
    HARD: "bg-rose-950/60 text-rose-400 border border-rose-900/40",
  }[difficulty as "EASY" | "MEDIUM" | "HARD"] || "bg-zinc-800 text-zinc-400";

  return (
    <div
      className={`relative w-[280px] rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 select-none ${
        isCompleted
          ? "border-emerald-500/80 bg-emerald-950/15 text-emerald-300 shadow-emerald-950/40 hover:border-emerald-400"
          : isInProgress
          ? "border-amber-500/80 bg-amber-950/15 text-amber-300 shadow-amber-950/40 hover:border-amber-400"
          : isUnlocked
          ? "border-indigo-500 bg-zinc-900/90 text-white shadow-indigo-950/40 hover:border-indigo-400 hover:bg-zinc-900"
          : "border-zinc-800/40 bg-zinc-950/70 text-zinc-650 opacity-60 hover:opacity-85"
      }`}
    >
      {/* Target handle for incoming prerequisite connections */}
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !w-2 !h-2 !border-none" />
      {/* Source handle for outgoing prerequisite connections */}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !w-2 !h-2 !border-none" />

      <div className="space-y-3">
        {/* Header: Title and Status indicator */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="text-sm font-black truncate tracking-tight text-zinc-100">{node.title}</h4>
            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${diffColors}`}>
              {difficulty}
            </span>
          </div>

          <div className="shrink-0 mt-0.5">
            {isCompleted ? (
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 size={12} />
              </div>
            ) : isInProgress ? (
              <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-amber-400 animate-pulse">
                <Play size={10} fill="currentColor" className="ml-0.5" />
              </div>
            ) : isUnlocked ? (
              <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-indigo-400">
                <Circle size={10} />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-600">
                <Lock size={10} />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Question Solved Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span>Questions</span>
            <span>{solvedCount} / {totalCount}</span>
          </div>
          <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-emerald-500"
                  : isInProgress
                  ? "bg-amber-500"
                  : isUnlocked
                  ? "bg-indigo-500"
                  : "bg-zinc-800"
              }`}
              style={{ width: `${totalCount > 0 ? (solvedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  dsaNode: DSARoadmapNode,
};

// 3. Dagre Auto-Layout calculator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set ranksep to 110 to give nodes breathing room, nodesep to 65 for clean separation
  dagreGraph.setGraph({ rankdir: direction, ranksep: 110, nodesep: 65 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 280, height: 96 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - 140, // width / 2
        y: nodeWithPosition.y - 48,  // height / 2
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function RoadmapGraph({
  nodes,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  slug,
  onSelectNode,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEnrolled,
  localSolvedMap = {},
  solvedQuestionSlugs = new Set(),
}: RoadmapGraphProps) {
  // Map nodes by ID for fast parent completion lookup
  const nodeMap = useMemo(() => {
    const map = new Map<number, RoadmapNodeInfo>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Determine state of each node based on parent dependencies
  const nodeStates = useMemo(() => {
    const states = new Map<number, "COMPLETED" | "ACTIVE" | "LOCKED">();

    nodes.forEach((node) => {
      if (node.completed) {
        states.set(node.id, "COMPLETED");
        return;
      }

      // Available if all parent dependencies are completed
      const allDepsDone = node.dependencyIds.every((depId) => {
        const parent = nodeMap.get(depId);
        return parent ? parent.completed : true;
      });

      states.set(node.id, allDepsDone ? "ACTIVE" : "LOCKED");
    });

    return states;
  }, [nodes, nodeMap]);

  // Calculate layouted nodes and edges dynamically
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const rfNodes = nodes.map((node) => {
      const totalCount = node.practiceQuestions?.length || 0;
      const solvedCount = node.practiceQuestions?.filter((q) => {
        if (localSolvedMap[q.slug] !== undefined) {
          return localSolvedMap[q.slug];
        }
        return solvedQuestionSlugs.has(q.slug);
      }).length || 0;

      const difficulty = getTopicDifficulty(node.title);
      
      // Determine dynamic state
      const state = nodeStates.get(node.id);
      let status = "LOCKED";
      if (state === "COMPLETED") {
        status = "COMPLETED";
      } else if (state === "ACTIVE") {
        status = solvedCount > 0 ? "IN_PROGRESS" : "UNLOCKED";
      }

      return {
        id: node.id.toString(),
        type: "dsaNode",
        data: {
          node,
          status,
          solvedCount,
          totalCount,
          difficulty,
        },
        position: { x: 0, y: 0 },
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rfEdges: any[] = [];
    nodes.forEach((node) => {
      node.dependencyIds.forEach((depId) => {
        const parentNode = nodes.find((n) => n.id === depId);
        if (!parentNode) return;

        const parentCompleted = parentNode.completed;
        const childCompleted = node.completed;
        const isCompleted = parentCompleted && childCompleted;

        rfEdges.push({
          id: `e-${depId}-${node.id}`,
          source: depId.toString(),
          target: node.id.toString(),
          type: "smoothstep",
          // Animate connection line if parent is complete but child isn't (active learning flow)
          animated: parentCompleted && !childCompleted,
          style: {
            stroke: isCompleted ? "#10b981" : parentCompleted ? "#6366f1" : "#27272a",
            strokeWidth: isCompleted ? 3 : 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: isCompleted ? "#10b981" : parentCompleted ? "#6366f1" : "#27272a",
          },
        });
      });
    });

    const layout = getLayoutedElements(rfNodes, rfEdges);
    return { layoutedNodes: layout.nodes, layoutedEdges: layout.edges };
  }, [nodes, localSolvedMap, solvedQuestionSlugs, nodeStates]);

  // Handle node selection click
  const onNodeClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event: React.MouseEvent, node: any) => {
      onSelectNode(node.data.node);
    },
    [onSelectNode]
  );

  return (
    <div className="relative w-full h-[650px] overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm shadow-2xl">
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={1.5}
        className="w-full h-full"
      >
        {/* Modern dark dots grid background */}
        <Background color="#27272a" gap={18} size={1} />
        
        {/* Customized dark controls */}
        <Controls className="!bg-zinc-950 !border-zinc-800 !text-zinc-400 [&>button]:!bg-zinc-950 [&>button]:!border-zinc-850 [&>button]:!text-zinc-400 [&>button:hover]:!bg-zinc-900 [&>button:hover]:!text-zinc-200" />
        
        {/* Custom MiniMap overlay styled for glassmorphic theme */}
        <MiniMap
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeColor={(n: any) => {
            const status = n.data?.status;
            if (status === "COMPLETED") return "#10b981";
            if (status === "IN_PROGRESS") return "#f59e0b";
            if (status === "UNLOCKED") return "#6366f1";
            return "#27272a";
          }}
          maskColor="rgba(9, 9, 11, 0.75)"
          className="!bg-zinc-950 !border-zinc-800 !rounded-xl"
        />
      </ReactFlow>
    </div>
  );
}
