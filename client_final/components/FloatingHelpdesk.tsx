"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Language config ────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", bcp47: "en-IN" },
  { code: "hi", label: "Hindi", flag: "🇮🇳", bcp47: "hi-IN" },
  { code: "or", label: "Odia", flag: "🪷", bcp47: "or-IN" },
  { code: "bn", label: "Bengali", flag: "🇧🇩", bcp47: "bn-IN" },
  { code: "te", label: "Telugu", flag: "🔵", bcp47: "te-IN" },
  { code: "ta", label: "Tamil", flag: "🟡", bcp47: "ta-IN" },
];

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Bot avatar ─────────────────────────────────────────────────────────────

function BotAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const icon = size === "sm" ? 13 : 16;
  return (
    <div
      className={`${dim} rounded-full bg-indigo-100 flex items-center justify-center shrink-0`}
    >
      <Sparkles size={icon} className="text-indigo-600" />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function FloatingHelpdesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("en");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Read language from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("helpdesk_lang") || "en";
    setLanguage(saved);
  }, []);

  // Speech API setup
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      recognitionRef.current = rec;
    }
  }, []);

  // Update recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      const lang = LANGUAGES.find((l) => l.code === language);
      recognitionRef.current.lang = lang?.bcp47 || "en-IN";
    }
  }, [language]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Close lang menu on outside click
  useEffect(() => {
    if (!langMenuOpen) return;
    function handler(e: MouseEvent) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langMenuOpen]);

  // ── Send ──────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm currently in demo mode. Full AI integration with your university data is coming soon! 🎓",
          timestamp: new Date(),
        },
      ]);
      // TODO: Replace with real AI API call
    }, 1500);
  }, [input]);

  // ── Voice ─────────────────────────────────────────────────────────────────

  function toggleMic() {
    if (!speechSupported || !recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    recognitionRef.current.onresult = (event: any) => {
      const results = Array.from(event.results as SpeechRecognitionResultList);

      const transcript = results.map((r) => r[0].transcript).join("");

      setInput(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current.start();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  function changeLanguage(code: string) {
    setLanguage(code);
    localStorage.setItem("helpdesk_lang", code);
    setLangMenuOpen(false);
  }

  const currentLang =
    LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
  const hasMessages = messages.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 flex flex-col",
          "w-[390px] h-[560px]",
          "max-sm:w-[calc(100vw-2rem)] max-sm:right-4 max-sm:bottom-20",
          "bg-white border border-slate-200 rounded-2xl overflow-hidden",
          "shadow-2xl shadow-slate-200/60",
          "transition-all duration-200 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">
                AI Helpdesk
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-white/70">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen((v) => !v);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-all"
              >
                <span className="text-base leading-none">
                  {currentLang.flag}
                </span>
                <span className="text-[11px] font-semibold text-white uppercase">
                  {currentLang.code}
                </span>
                <ChevronDown size={11} className="text-white/70" />
              </button>

              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 z-50 animate-slide-up">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all hover:bg-slate-50",
                        language === lang.code
                          ? "text-indigo-600 font-semibold bg-indigo-50/50"
                          : "text-slate-700"
                      )}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.label}</span>
                      {language === lang.code && (
                        <Check size={13} className="text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-all"
            >
              <X size={16} className="text-white/80 hover:text-white" />
            </button>
          </div>
        </div>

        {/* ── Messages ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50">
          {/* Static welcome */}
          <div className="flex gap-2.5 items-start">
            <BotAvatar size="sm" />
            <div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 shadow-sm max-w-[85%]">
                Hi! I&apos;m your UniERP assistant 👋 Ask me anything about your
                courses, results, attendance, or campus info.
              </div>
              <p className="text-[10px] text-slate-400 ml-0.5 mt-0.5">
                Just now
              </p>
            </div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5 items-start",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              {msg.role === "assistant" && <BotAvatar size="sm" />}
              <div>
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm shadow-sm max-w-[85%]",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>
                <p
                  className={cn(
                    "text-[10px] text-slate-400 mt-0.5",
                    msg.role === "user" ? "text-right text-white/60" : ""
                  )}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-start">
              <BotAvatar size="sm" />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Bar ───────────────────────────────── */}
        <div className="border-t border-slate-100 bg-white p-3 shrink-0">
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 px-1 mb-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-500 font-medium">
                Listening in {currentLang.label}...
              </span>
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Ask anything..."
              className={cn(
                "flex-1 resize-none min-h-[40px] max-h-[120px]",
                "px-3.5 py-2.5 text-sm",
                "border border-slate-200 rounded-xl",
                "bg-slate-50 placeholder:text-slate-400",
                "outline-none focus:border-indigo-400 focus:bg-white",
                "focus:ring-2 focus:ring-indigo-100 transition-all"
              )}
            />

            {speechSupported && (
              <button
                onClick={toggleMic}
                title="Voice input"
                className={cn(
                  "w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all",
                  isRecording
                    ? "bg-red-100 text-red-500 animate-pulse"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                )}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            <button
              onClick={sendMessage}
              disabled={!input.trim() && !isRecording}
              title="Send message"
              className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Trigger Button ──────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle AI Helpdesk"
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full",
          "bg-indigo-600 shadow-lg shadow-indigo-200",
          "hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300",
          "hover:-translate-y-0.5",
          "flex items-center justify-center",
          "transition-all duration-200 relative"
        )}
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <MessageSquare size={22} className="text-white" />
        )}

        {/* Unread dot */}
        {hasMessages && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
