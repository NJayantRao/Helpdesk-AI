"use client";
import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui";
import { mockUser } from "@/lib/utils";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Clock,
  RotateCcw,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  sources?: string[];
}

const SUGGESTED = [
  "What is my current CGPA?",
  "When are mid-semester exams?",
  "Show me the CS Semester 4 syllabus",
  "What are the hostel rules?",
  "When is the TCS campus drive?",
  "What documents are needed for scholarship?",
];

const AI_RESPONSES: [RegExp, string, string[]][] = [
  [
    /cgpa|grade|marks/i,
    "Your current CGPA is **8.5** (as of Semester 3). Your trend is **Improving** — your SGPA has gone from 8.2 → 8.5 → 8.8 across the last three semesters. Keep it up! 🎉",
    ["Student Academic Records", "Semester Results Database"],
  ],
  [
    /mid.?sem|exam|test/i,
    "Mid-semester exams for **Semester 4** are scheduled to begin on **March 20, 2026**. The complete timetable has been uploaded to the Documents section. Hall tickets will be issued one week before the exam.",
    ["Mid-Sem Exam Circular 2026", "Academic Calendar 2025-26"],
  ],
  [
    /syllabus|cs.*4|semester.*4/i,
    "The **CS Semester 4 Syllabus** is available in the Documents section. It covers: Advanced Algorithms, Computer Networks, Software Engineering, Theory of Computation, and Web Technologies. Total: 20 credits.",
    ["CS Semester 4 Syllabus", "Academic Office Records"],
  ],
  [
    /hostel|accommodation/i,
    "NIST provides separate hostels for boys and girls. Key rules: no visitors after 9 PM, mess timings 7–9 AM / 12–2 PM / 7–9 PM, Wi-Fi available 24×7, laundry facility available. Contact hostel@nist.edu for room allotment.",
    ["Hostel Rules & Regulations 2026"],
  ],
  [
    /tcs|campus.*drive|placement|recruit/i,
    "**TCS** will visit campus on **April 5, 2026**. Eligibility: CGPA ≥ 7.5, no active backlogs. Roles: Software Engineer, Business Analyst. Apply via the Placement Cell portal before March 30.",
    ["Campus Placement Policy 2026", "Placement Cell Circular"],
  ],
  [
    /scholarship|document/i,
    "For merit scholarship, you need: latest marksheet, CGPA certificate, Aadhaar copy, bank account details, and parent income proof. Submit to the Admin Office before **March 25, 2026**. You are currently eligible based on your CGPA.",
    ["Scholarship Guidelines 2026", "Academic Records"],
  ],
];

function getAIResponse(query: string): { content: string; sources: string[] } {
  for (const [pattern, response, sources] of AI_RESPONSES) {
    if (pattern.test(query)) return { content: response, sources };
  }
  return {
    content:
      "I've searched through the university knowledge base but couldn't find a specific match for your query. Could you rephrase or be more specific? You can ask about exams, syllabus, hostel, placements, CGPA, scholarships, or any academic matter.",
    sources: [],
  };
}

function formatContent(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const LANGUAGES = ["English", "Hindi", "Odia", "Telugu", "Bengali"];

export default function HelpdeskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hello! I'm your AI university assistant powered by RAG. I can answer questions about academics, exams, hostel, placements, and more — grounded in official university documents. How can I help you today? 🎓",
      time: "Now",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lang, setLang] = useState("English");
  const [queryCount, setQueryCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const RATE_LIMIT = 20;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text?: string) {
    const msg = (text || input).trim();
    if (!msg || typing || queryCount >= RATE_LIMIT) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: msg, time: now },
    ]);
    setInput("");
    setTyping(true);
    setQueryCount((q) => q + 1);
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      setTyping(false);
      const { content, sources } = getAIResponse(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sources,
        },
      ]);
    }, delay);
  }

  function clearChat() {
    setMessages([
      {
        id: "0",
        role: "assistant",
        content: "Chat cleared. How can I help you? 😊",
        time: "Now",
        sources: [],
      },
    ]);
    setQueryCount(0);
  }

  return (
    <DashboardLayout>
      <div className="flex gap-5 h-[calc(100vh-120px)] animate-fade-in">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Card className="p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Bot size={18} className="text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  UniERP AI Assistant
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div className="text-xs text-slate-400">
                  RAG-powered · Gemini API · University Documents
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 px-3 py-1.5 bg-slate-100 rounded-lg">
                <Clock size={12} />
                {queryCount}/{RATE_LIMIT} queries
              </div>
              <button
                onClick={clearChat}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                title="Clear chat"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </Card>

          {/* Messages */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-3 animate-slide-up",
                    m.role === "user" && "justify-end"
                  )}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-indigo-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%]",
                      m.role === "user" ? "items-end" : "items-start",
                      "flex flex-col gap-1.5"
                    )}
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "chat-bubble-user"
                          : "chat-bubble-ai"
                      }
                    >
                      <span
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatContent(m.content),
                        }}
                      />
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-medium"
                          >
                            <Sparkles size={9} /> {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-300 px-1">
                      {m.time}
                    </span>
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-indigo-600" />
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="flex gap-1 items-center py-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                          style={{
                            animation: `typing 1.2s infinite ease-in-out ${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 px-4 py-3.5">
              {queryCount >= RATE_LIMIT && (
                <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-2">
                  Daily query limit reached. Resets at midnight.
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={queryCount >= RATE_LIMIT}
                  placeholder="Ask about exams, syllabus, hostel, placements..."
                  className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || typing || queryCount >= RATE_LIMIT}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="hidden xl:flex flex-col w-64 gap-4">
          {/* Language Selector */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={14} className="text-indigo-600" />
              <span className="text-xs font-semibold text-slate-700">
                Response Language
              </span>
            </div>
            <div className="space-y-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                    lang === l
                      ? "bg-indigo-600 text-white font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </Card>

          {/* Suggested Questions */}
          <Card className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-slate-700">
                Suggested Questions
              </span>
            </div>
            <div className="space-y-1.5">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>

          {/* Info */}
          <Card className="p-4">
            <div className="text-xs text-slate-500 leading-relaxed">
              <div className="font-semibold text-slate-700 mb-1.5">
                How it works
              </div>
              Responses are grounded in official university documents using RAG
              (Retrieval-Augmented Generation). Sources are shown below each
              answer.
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
