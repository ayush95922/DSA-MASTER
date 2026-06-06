"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Send, 
  User, 
  Sparkles, 
  Bot, 
  Settings, 
  BookOpen, 
  Flame, 
  Code, 
  Compass, 
  AlertCircle 
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useTopics } from "@/hooks/use-topics";
import { useRoadmaps } from "@/hooks/use-roadmaps";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

const promptChips = [
  "Explain recursion stack overflows",
  "How does a Segment Tree divide intervals?",
  "Dijkstra vs. Bellman-Ford shortest paths",
  "Compare two-pointers vs. hashing",
];

const generateMessageId = () => {
  return `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const tutorModes = [
  { 
    id: "THEORY", 
    name: "Theory Mode", 
    desc: "Deep concepts, derivations, and real-world analogies", 
    accent: "text-violet-400 bg-violet-950/60 border-violet-900/30" 
  },
  { 
    id: "PROBLEM_SOLVING", 
    name: "Problem Solving Mode", 
    desc: "Interactive, step-by-step guidance & conceptual hints", 
    accent: "text-emerald-400 bg-emerald-950/60 border-emerald-900/30" 
  },
  { 
    id: "INTERVIEW", 
    name: "Interview Mode", 
    desc: "Rigorous technical mock interviewer from a top-tier tech company", 
    accent: "text-indigo-400 bg-indigo-950/60 border-indigo-900/30" 
  },
  { 
    id: "REVISION", 
    name: "Revision Mode", 
    desc: "Compressed active recall cheat sheets & bug checklists", 
    accent: "text-amber-400 bg-amber-950/60 border-amber-900/30" 
  },
  { 
    id: "DEBUGGING", 
    name: "Debugging Mode", 
    desc: "Spot infinite loops, off-by-one errors, and trace states", 
    accent: "text-rose-400 bg-rose-950/60 border-rose-900/30" 
  },
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Context Awareness State
  const [selectedMode, setSelectedMode] = useState<string>("THEORY");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedRoadmapNode, setSelectedRoadmapNode] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  // AI Health State
  const [aiHealth, setAiHealth] = useState<"ONLINE" | "OFFLINE" | "LOADING">("LOADING");
  const [aiHealthMessage, setAiHealthMessage] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Data hooks
  const { useCategoriesList } = useTopics();
  const { data: categories } = useCategoriesList();
  const allTopics = categories ? categories.flatMap((cat) => cat.topics) : [];

  const { useRoadmapDetail } = useRoadmaps();
  const { data: roadmapDetail } = useRoadmapDetail("placement-dsa-roadmap");
  const roadmapNodes = roadmapDetail?.nodes || [];

  // Query health status on mount
  useEffect(() => {
    const checkAIHealth = async () => {
      try {
        const response = await apiClient.get("/ai/tutor/health");
        if (response.data?.data?.status === "ONLINE") {
          setAiHealth("ONLINE");
        } else {
          setAiHealth("OFFLINE");
          setAiHealthMessage(response.data?.data?.message || "AI Tutor configuration is missing.");
        }
      } catch (err: any) {
        setAiHealth("OFFLINE");
        setAiHealthMessage("Failed to reach backend AI health check system.");
      }
    };

    checkAIHealth();
  }, []);

  // Initialize welcome message on mount
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: "welcome",
          sender: "coach",
          text: "Hello! I am your **AI Placement Coach**. I can help you solve complex DSA challenges, analyze complexities, or optimize recursive call stacks!\n\nSet your active **Coaching Mode** and **Context Attributes** in the sidebar control panel, and let's master DSA together. What concept or problem are we exploring today?",
          timestamp: new Date(),
        },
      ]);
    }, 0);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || aiHealth === "OFFLINE") return;

    const userMsg: Message = {
      id: generateMessageId(),
      sender: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSending(true);

    try {
      const history = messages
        .filter((msg) => msg.id !== "welcome" && !msg.text.includes("⚠️ **AI Tutor Configuration"))
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          text: msg.text
        }));

      const response = await apiClient.post("/ai/tutor/chat", { 
        message: text,
        mode: selectedMode,
        currentTopic: selectedTopic,
        currentRoadmapNode: selectedRoadmapNode,
        currentQuestion: selectedQuestion,
        difficultyLevel: selectedDifficulty,
        history: history
      });
      
      const coachMsg: Message = {
        id: generateMessageId(),
        sender: "coach",
        text: response.data.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.message || "Failed to connect to AI Coach.";
      toast.error(errMsg);
      
      const errorMsg: Message = {
        id: generateMessageId(),
        sender: "coach",
        text: `⚠️ **AI Tutor Configuration or Runtime Error**\n\n**Reason:** ${errMsg}\n\n*Please ensure that your Gemini API key is configured either in the backend system environment variables (GEMINI_API_KEY) or inside your 'application.yml' properties.*`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const currentModeInfo = tutorModes.find((m) => m.id === selectedMode) || tutorModes[0];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header bar */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            AI Placement Coach
            <Brain className="h-6 w-6 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Receive step-by-step guidance on complex algorithms, complexities, or mock interviews.
          </p>
        </div>
      </div>

      {/* Main Grid: Control Panel Sidebar + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 h-full overflow-hidden">
        {/* Left Side: Control Panel (Context Sidebar) */}
        <div className="lg:col-span-4 col-span-12 flex flex-col gap-5 overflow-y-auto pr-1">
          {/* Coaching Mode Selection */}
          <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md shrink-0">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-xs font-bold text-zinc-200 flex items-center gap-2 uppercase tracking-widest">
                <Settings size={14} className="text-emerald-400 animate-spin-slow" />
                Coaching Mode
              </CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                Choose how the AI tutor should interact with you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pb-4 px-4">
              {tutorModes.map((m) => {
                const isActive = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isActive
                        ? "bg-zinc-900/60 border-zinc-800 ring-1 ring-zinc-700/20"
                        : "bg-transparent border-transparent hover:border-zinc-900 hover:bg-zinc-900/20"
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 p-1.5 rounded-lg border ${
                      isActive ? m.accent : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    }`}>
                      {m.id === "THEORY" && <BookOpen size={14} />}
                      {m.id === "PROBLEM_SOLVING" && <Sparkles size={14} />}
                      {m.id === "INTERVIEW" && <User size={14} />}
                      {m.id === "REVISION" && <Flame size={14} />}
                      {m.id === "DEBUGGING" && <Code size={14} />}
                    </div>
                    <div>
                      <h4 className={`font-bold ${isActive ? "text-white" : "text-zinc-300"}`}>
                        {m.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Context Awareness Attributes */}
          <Card className="border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-xs font-bold text-zinc-200 flex items-center gap-2 uppercase tracking-widest">
                <Compass size={14} className="text-emerald-400" />
                Context Awareness
              </CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                Provide background context so your coach answers with situational intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pb-4 px-4">
              {/* Dynamic Topic Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Active DSA Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">-- None / General DSA --</option>
                  {allTopics.map((topic: any) => (
                    <option key={topic.id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Roadmap Node Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Active Roadmap Node
                </label>
                <select
                  value={selectedRoadmapNode}
                  onChange={(e) => setSelectedRoadmapNode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">-- None / General Roadmap --</option>
                  {roadmapNodes.map((node: any) => (
                    <option key={node.id} value={node.title}>
                      {node.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Context Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Current Question Context
                </label>
                <input
                  type="text"
                  placeholder="e.g., Two Sum, Binary Tree LCA"
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">-- None --</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Chat Window Card */}
        <div className="lg:col-span-8 col-span-12 flex flex-col h-full overflow-hidden">
          <Card className="flex-1 flex flex-col border-zinc-900 bg-zinc-950/40 backdrop-blur-md overflow-hidden h-full">
            {/* AI Service Status Banner */}
            <div className="shrink-0 px-6 py-2.5 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 font-bold ${
                  aiHealth === "ONLINE" ? "text-emerald-400" : "text-rose-500"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    aiHealth === "ONLINE" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                  }`} />
                  <span>AI Service: {aiHealth === "ONLINE" ? "Online" : aiHealth === "OFFLINE" ? "Offline" : "Checking Status..."}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <span>Active Mode:</span>
                <div className={`flex items-center gap-1 font-bold ${currentModeInfo.accent.split(" ")[0]}`}>
                  {selectedMode === "THEORY" && <BookOpen size={13} />}
                  {selectedMode === "PROBLEM_SOLVING" && <Sparkles size={13} />}
                  {selectedMode === "INTERVIEW" && <User size={13} />}
                  {selectedMode === "REVISION" && <Flame size={13} />}
                  {selectedMode === "DEBUGGING" && <Code size={13} />}
                  <span>{currentModeInfo.name}</span>
                </div>
              </div>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Show Configuration Setup Instructions in feed if offline */}
              {aiHealth === "OFFLINE" && (
                <div className="p-4 rounded-xl border border-rose-950/40 bg-rose-950/5 text-xs text-zinc-300 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-400">
                    <AlertCircle size={16} />
                    <span>AI Coaching Engine is currently Offline</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {aiHealthMessage} Setup instructions:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-zinc-400 leading-relaxed">
                    <li>Obtain a free/pro Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Google AI Studio</a>.</li>
                    <li>Create a copy of <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">.env.example</code> as <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">.env</code> in the project root directory.</li>
                    <li>Add your key: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-white font-mono">GEMINI_API_KEY=YOUR_KEY_HERE</code></li>
                    <li>Restart your backend application. The status indicator will transition to <span className="text-emerald-400 font-bold">Online</span> and chat options will be fully unlocked.</li>
                  </ol>
                </div>
              )}

              {messages.map((msg) => {
                const isCoach = msg.sender === "coach";
                const isError = msg.text.includes("⚠️ **AI Tutor Configuration");

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${
                      isCoach ? "mr-auto" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isCoach
                          ? isError
                            ? "bg-rose-950/60 border-rose-900/30 text-rose-400"
                            : "bg-emerald-950/60 border-emerald-900/30 text-emerald-400"
                          : "bg-indigo-950/60 border-indigo-900/30 text-indigo-400"
                      }`}
                    >
                      {isCoach ? isError ? <AlertCircle size={16} /> : <Bot size={16} /> : <User size={16} />}
                    </div>

                    {/* Bubble */}
                    <div className="space-y-1">
                      <div
                        className={`rounded-xl px-4 py-2.5 text-xs leading-relaxed border ${
                          isCoach
                            ? isError
                              ? "bg-rose-950/10 border-rose-950/40 text-rose-200"
                              : "bg-zinc-900/20 border-zinc-900 text-zinc-200"
                            : "bg-indigo-950/15 border-indigo-900/20 text-zinc-200"
                        }`}
                      >
                        <p className="whitespace-pre-line font-sans">
                          {msg.text}
                        </p>
                      </div>
                      <span className="text-[9px] text-zinc-650 block text-right px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isSending && (
                <div className="flex gap-3 max-w-3xl mr-auto">
                  <div className="h-8 w-8 rounded-lg bg-emerald-950/60 border border-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input & quick actions area */}
            <div className="shrink-0 p-4 border-t border-zinc-900 bg-zinc-950/60 space-y-3">
              {/* Quick chips */}
              <div className="flex flex-wrap gap-1.5">
                {promptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    disabled={isSending || aiHealth === "OFFLINE"}
                    onClick={() => handleSend(chip)}
                    className="text-[9px] font-bold bg-zinc-900/80 border border-zinc-850 text-zinc-450 hover:text-white hover:border-zinc-700 px-2.5 py-1 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Text input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className="flex gap-2.5"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    aiHealth === "OFFLINE"
                      ? "AI Service is Offline. Please configure the GEMINI_API_KEY to start tutoring."
                      : "Ask me to explain any algorithm, analyze dynamic transitions, or debug code..."
                  }
                  disabled={isSending || aiHealth === "OFFLINE"}
                  className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                />
                <Button
                  type="submit"
                  disabled={isSending || !inputText.trim() || aiHealth === "OFFLINE"}
                  className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-4 py-5 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={14} />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
