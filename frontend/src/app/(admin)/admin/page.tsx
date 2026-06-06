"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  Settings, 
  UploadCloud, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RotateCcw,
  Sparkles,
  Play,
  FileCode,
  Brain
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";

export default function AdminPage() {
  const { useAdminStats, useUpdateSetting, useBulkImport } = useAdmin();

  const statsQuery = useAdminStats();
  const updateSettingMutation = useUpdateSetting();
  const bulkImportMutation = useBulkImport();

  const [jsonInput, setJsonInput] = useState("");
  const [importFileName, setImportFileName] = useState("batch_questions.json");
  const [editSettingKey, setEditSettingKey] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState("");
  const [aiStatus, setAiStatus] = useState<{ status: string; message: string } | null>(null);

  useEffect(() => {
    const fetchAIHealth = async () => {
      try {
        const res = await apiClient.get("/ai/tutor/health");
        setAiStatus(res.data?.data);
      } catch {
        setAiStatus({ status: "OFFLINE", message: "Failed to connect to backend AI health check system." });
      }
    };
    fetchAIHealth();
  }, []);

  const sampleTemplate = [
    {
      title: "Binary Tree Level Order Traversal",
      slug: "binary-tree-level-order-traversal",
      difficulty: "MEDIUM",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
      constraints: "The number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000",
      inputFormat: "Root of binary tree represented in sequence.",
      outputFormat: "List of lists containing integer node values."
    },
    {
      title: "Fibonacci Number",
      slug: "fibonacci-number",
      difficulty: "EASY",
      description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
      constraints: "0 <= n <= 30",
      inputFormat: "Integer n",
      outputFormat: "Fibonacci sum value"
    }
  ];

  if (statsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 bg-zinc-900/60" />
          <Skeleton className="h-4 w-96 bg-zinc-900/60 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Skeleton className="h-[120px] rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[120px] rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[120px] rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[120px] rounded-2xl bg-zinc-900/60" />
          <Skeleton className="h-[120px] rounded-2xl bg-zinc-900/60" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  if (statsQuery.error || !statsQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-xl font-bold text-white">Failed to connect to Admin service</h3>
        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
          Please check your database connectivity and ensure the backend is active.
        </p>
        <Button
          onClick={() => statsQuery.refetch()}
          className="bg-rose-500 hover:bg-rose-600 text-zinc-950 font-bold"
        >
          <RotateCcw size={16} className="mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const { totalUsers, totalQuestions, totalTopics, totalRoadmaps, totalAttempts, settings, recentImports } = statsQuery.data;

  const handleUpdateSetting = (key: string) => {
    updateSettingMutation.mutate(
      { key, value: editSettingValue },
      {
        onSuccess: () => {
          toast.success(`System setting '${key}' updated successfully!`);
          setEditSettingKey(null);
        },
        onError: () => {
          toast.error("Failed to update system setting.");
        }
      }
    );
  };

  const handleLoadTemplate = () => {
    setJsonInput(JSON.stringify(sampleTemplate, null, 2));
    toast.success("JSON Import Template loaded!");
  };

  const handleExecuteImport = () => {
    if (!jsonInput.trim()) {
      toast.error("JSON payload cannot be empty!");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        toast.error("JSON payload must be a root array of question elements!");
        return;
      }

      bulkImportMutation.mutate(
        { fileName: importFileName, questions: parsed },
        {
          onSuccess: () => {
            toast.success("Bulk question import completed successfully! 🎉");
            setJsonInput("");
            statsQuery.refetch();
          },
          onError: (err: any) => {
            toast.error("Bulk question import failed. Please verify syntax.");
          }
        }
      );

    } catch (e: any) {
      toast.error(`Invalid JSON syntax: ${e.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Administrator Command Center
          <Sparkles className="h-6 w-6 text-rose-500 animate-pulse" />
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor users counts, configure system state parameters, and execute batch uploads.
        </p>
      </div>

      {/* AI Tutor Health Alert Banner / Info */}
      {aiStatus && (
        <Card className={`border-zinc-900 bg-zinc-950/40 backdrop-blur-md overflow-hidden border-l-4 ${
          aiStatus.status === "ONLINE" ? "border-l-emerald-500" : "border-l-rose-500"
        }`}>
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="text-xs font-bold text-zinc-200 flex items-center justify-between uppercase tracking-widest">
              <span className="flex items-center gap-2 font-black">
                <Brain className={`h-4.5 w-4.5 ${
                  aiStatus.status === "ONLINE" ? "text-emerald-400" : "text-rose-500"
                }`} />
                AI Tutor Status: {aiStatus.status === "ONLINE" ? "Online" : "Offline"}
              </span>
              <Badge className={
                aiStatus.status === "ONLINE" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
              }>
                {aiStatus.status}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {aiStatus.message}
            </CardDescription>
          </CardHeader>
          {aiStatus.status === "OFFLINE" && (
            <CardContent className="pb-4 pt-0 px-5 text-xs text-zinc-400 border-t border-zinc-900/40 mt-2 bg-rose-950/5">
              <div className="space-y-2 mt-3">
                <p className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-rose-400" />
                  AI Placement Coach Configuration & Setup Guide
                </p>
                <p className="text-[11px] text-zinc-555 leading-relaxed">
                  The AI Tutor is currently offline because the required <code className="bg-zinc-900 px-1 rounded text-white font-mono">GEMINI_API_KEY</code> environment variable or Spring configuration is not found on the backend. Follow these steps to activate:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-[11px] text-zinc-400 leading-relaxed">
                  <li>Obtain a free or pro Gemini API Key from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Google AI Studio console</a>.</li>
                  <li>Create a copy of <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">.env.example</code> as <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">.env</code> in your root project folder.</li>
                  <li>Set your key in the file: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-white font-mono">GEMINI_API_KEY=YOUR_API_KEY_HERE</code>.</li>
                  <li>Alternatively, set the key on your OS terminal session or run the backend with: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-white font-mono">mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dapp.gemini.api-key=YOUR_API_KEY</code>.</li>
                  <li>Restart the backend server. The AI Placement Coach will automatically detect the configuration and go Online.</li>
                </ol>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 1. Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {/* Total Users */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Users</CardTitle>
            <Users className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalUsers}</div>
          </CardContent>
        </Card>

        {/* Total Questions */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalQuestions}</div>
          </CardContent>
        </Card>

        {/* Total Topics */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalTopics}</div>
          </CardContent>
        </Card>

        {/* Total Roadmaps */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Roadmaps</CardTitle>
            <Compass className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalRoadmaps}</div>
          </CardContent>
        </Card>

        {/* Total Attempts */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Submissions</CardTitle>
            <Settings className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalAttempts}</div>
          </CardContent>
        </Card>
      </div>

      {/* 2. settings config + bulk importer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Settings panel */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-400 animate-spin-slow" />
              System Config Settings
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Configure global system flags, maintenance statuses, and registration allowances.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            {settings && settings.length > 0 ? (
              settings.map((setting) => (
                <div 
                  key={setting.key} 
                  className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-white text-sm">{setting.key}</h4>
                    <p className="text-xs text-zinc-500">{setting.description}</p>
                    <div className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/20 inline-block">
                      Value: {setting.value}
                    </div>
                  </div>

                  <div>
                    {editSettingKey === setting.key ? (
                      <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-900">
                        <Input
                          value={editSettingValue}
                          onChange={(e) => setEditSettingValue(e.target.value)}
                          className="h-8 w-24 border-zinc-900 bg-zinc-900 text-xs text-white"
                          placeholder="value"
                        />
                        <Button 
                          onClick={() => handleUpdateSetting(setting.key)}
                          size="sm"
                          className="h-8 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs cursor-pointer"
                        >
                          Save
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => setEditSettingKey(null)}
                          className="h-8 text-zinc-500 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setEditSettingKey(setting.key);
                          setEditSettingValue(setting.value);
                        }}
                        variant="secondary"
                        size="sm"
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer"
                      >
                        Modify
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-500">No system settings initialized.</div>
            )}
          </CardContent>
        </Card>

        {/* Bulk importer panel */}
        <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-emerald-400" />
              JSON Question Importer
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Bulk populate coding questions directly into PostgreSQL via JSON schema uploads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Import Filename</span>
                  <Input 
                    value={importFileName}
                    onChange={(e) => setImportFileName(e.target.value)}
                    className="border-zinc-900 bg-zinc-900/50 mt-1 text-white text-xs"
                    placeholder="batch_questions.json"
                  />
                </div>
                <div className="self-end">
                  <Button 
                    onClick={handleLoadTemplate}
                    variant="outline"
                    className="border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500 hover:text-zinc-950 text-indigo-400 font-bold text-xs flex items-center gap-1 cursor-pointer h-9 mt-1"
                  >
                    <FileCode size={14} />
                    Load Template
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[160px] mt-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">JSON Payload Array</span>
                <Textarea 
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="flex-1 border-zinc-900 bg-zinc-900/50 mt-1 text-white font-mono text-xs leading-relaxed resize-none p-3 h-full"
                  placeholder="[ { ... }, { ... } ]"
                />
              </div>
            </div>

            <Button
              onClick={handleExecuteImport}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              <Play size={16} />
              Execute Question Import
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 3. recent imports list */}
      <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-400" />
            Batch Import Audits
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Realtime processing audit logs tracking parsed lines, successes, and exceptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentImports && recentImports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 uppercase font-black tracking-wider">
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Imported By</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Processed Count</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Errors / Logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50 text-zinc-300">
                  {recentImports.map((imp) => (
                    <tr key={imp.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white max-w-[150px] truncate">{imp.fileName}</td>
                      <td className="py-3.5 px-4 font-semibold">{imp.importedBy}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge className={
                          imp.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          imp.status === "FAILED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }>
                          {imp.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black">{imp.recordsProcessed}</td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-500">{new Date(imp.createdAt).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-zinc-500 max-w-[200px] truncate font-mono">
                        {imp.errors || "All systems green"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 text-sm">
              <UploadCloud size={32} className="text-zinc-600 mb-2" />
              No content imports recorded yet. Try importing the sample template!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
