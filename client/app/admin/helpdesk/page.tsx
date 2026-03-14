"use client";
import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui";
import { mockAdminUser } from "@/lib/utils";
import {
  Bot,
  Send,
  User,
  Sparkles,
  BarChart3,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  sources?: string[];
}

const ADMIN_RESPONSES: [RegExp, string, string[]][] = [
  [
    /student.*cgpa|cgpa.*student/i,
    "The average CGPA across all departments is **8.2**. Computer Science leads with **8.5**, followed by ECE at **8.1**. 12 students currently have CGPA below 6.0 and may need academic counseling.",
    ["Student Academic Records", "Department Analytics"],
  ],
  [
    /document|upload/i,
    "There are currently **6 documents** indexed in the Qdrant vector store. The last upload was the Mid-Sem Exam Circular on March 10, 2026. You can upload new documents from the Documents section.",
    ["Document Management System"],
  ],
  [
    /placement|recruit/i,
    "**3 companies** are scheduled to visit this semester: TCS (Apr 5), Infosys (Apr 12), Wipro (Mar 20). 142 students are currently eligible for placement (CGPA ≥ 6.5).",
    ["Placement Cell Records", "Campus Placement Policy 2026"],
  ],
  [
    /exam|result/i,
    "Mid-semester exams are scheduled from March 20, 2026. Semester 3 results are already published. 4 students have pending result disputes — check the Exam Cell dashboard.",
    ["Exam Cell Records", "Academic Calendar 2025-26"],
  ],
];

function getResponse(query: string): { content: string; sources: string[] } {
  for (const [pattern, response, sources] of ADMIN_RESPONSES) {
    if (pattern.test(query)) return { content: response, sources };
  }
  return {
    content:
      "I can help with student analytics, document status, placement data, exam schedules, and more. Please be more specific.",
    sources: [],
  };
}

function formatContent(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const QUICK = [
  "What is the average CGPA?",
  "How many documents are indexed?",
  "Upcoming placement drives",
  "Exam schedule status",
];

const STATS = [
  {
    icon: MessageSquare,
    label: "Queries today",
    value: "124",
    color: "indigo",
  },
  {
    icon: BarChart3,
    label: "Avg response time",
    value: "1.2s",
    color: "emerald",
  },
  {
    icon: TrendingUp,
    label: "Satisfaction rate",
    value: "94%",
    color: "amber",
  },
];

export default function AdminHelpdeskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hello Admin! I'm your AI assistant. I can provide analytics on students, documents, placements, and AI helpdesk usage. How can I help?",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text?: string) {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: (++messageIdRef.current).toString(),
        role: "user",
        content: msg,
        time: now,
      },
    ]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const { content, sources } = getResponse(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: (++messageIdRef.current).toString(),
          role: "assistant",
          content,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sources,
        },
      ]);
    }, 1500);
  }

  return (
    <DashboardLayout user={mockAdminUser}>
      <div className="space-y-5 animate-fade-in">
        <div>
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            AI Helpdesk
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin view — analytics & system queries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <Card key={s.label} className="p-4 flex items-center gap-3">
              <div
                className={`w-9 h-9 bg-${s.color}-50 rounded-xl flex items-center justify-center`}
              >
                <s.icon size={16} className={`text-${s.color}-600`} />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {s.value}
                </div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Chat */}
        <Card className="flex flex-col" style={{ height: "480px" }}>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2.5 animate-slide-up",
                  m.role === "user" && "justify-end"
                )}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} className="text-indigo-600" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[70%] flex flex-col gap-1.5",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={
                      m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    }
                  >
                    <span
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatContent(m.content),
                      }}
                    />
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.sources.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-medium"
                        >
                          <Sparkles size={9} />
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <User size={13} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot size={13} className="text-indigo-600" />
                </div>
                <div className="chat-bubble-ai">
                  <div className="flex gap-1 py-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                        style={{
                          animation: `typing 1.2s infinite ${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex gap-2 mb-2 overflow-x-auto">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] whitespace-nowrap px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about students, documents, placements..."
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
