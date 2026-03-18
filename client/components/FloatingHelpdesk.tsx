"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { MessageCircle, X, Send, Mic, MicOff, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

// ── Config ─────────────────────────────────────────────────────────────────

const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "or", label: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const CHIPS = [
  "How do I apply?",
  "Fee structure",
  "Placement stats",
  "CGPA calculation",
  "Mess menu",
  "Hostel info",
];

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

// ── Markdown helper ────────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/<li>/g, "<ul class='list-disc ml-4 space-y-0.5 my-1'><li>")
    .replace(/<\/li>/g, "</li></ul>")
    .replace(/\n{2,}/g, "<br/>");
}

// ── Main UI ────────────────────────────────────────────────────────────────

function HelpdeskUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    {
      id: "0",
      role: "bot",
      content:
        "Hi! I'm the UniERP Assistant 👋 Ask me about admissions, fees, exams, hostel, placements, or anything about NIST.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const idRef = useRef(1);

  // Restore language
  useEffect(() => {
    const saved = localStorage.getItem("helpdesk_lang");
    if (saved) setLang(saved);
  }, []);

  // Speech recognition
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setSpeechSupported(true);
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    recognitionRef.current = rec;
  }, []);

  // Update recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      const bcp47: Record<string, string> = {
        en: "en-IN",
        hi: "hi-IN",
        or: "or-IN",
        bn: "bn-IN",
        te: "te-IN",
      };
      recognitionRef.current.lang = bcp47[lang] ?? "en-IN";
    }
  }, [lang]);

  // Scroll to bottom
  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  // Open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setHasUnread(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true))
      );
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Send ────────────────────────────────────────────────────────────────

  const send = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg || typing) return;

      setMsgs((p) => [
        ...p,
        { id: String(idRef.current++), role: "user", content: msg },
      ]);
      setInput("");
      setTyping(true);

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/chat`,
          { message: msg, language: lang },
          { withCredentials: true }
        );
        const output: string = data?.data?.output ?? "";
        if (output) {
          setMsgs((p) => [
            ...p,
            { id: String(idRef.current++), role: "bot", content: output },
          ]);
        }
      } catch (err: any) {
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Network error. Please try again.";
        setMsgs((p) => [
          ...p,
          { id: String(idRef.current++), role: "bot", content: errMsg },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [input, lang, typing]
  );

  // ── Voice ───────────────────────────────────────────────────────────────

  function toggleMic() {
    if (!speechSupported || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recognitionRef.current.onresult = (e: any) => {
      const transcript = Array.from(e.results as SpeechRecognitionResultList)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.start();
  }

  function changeLang(code: string) {
    setLang(code);
    localStorage.setItem("helpdesk_lang", code);
    setLangOpen(false);
  }

  const curLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <>
      {/* ── Chat Panel ── */}
      {isMounted && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "16px",
            zIndex: 99999,
            maxHeight: "calc(100vh - 110px)",
            width: "min(390px, calc(100vw - 32px))",
          }}
          className={`flex flex-col bg-white rounded-[22px] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-900/15 transition-all duration-200 origin-bottom-right
            ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          {/* Header */}
          <div
            className="shrink-0 px-4 pt-5 pb-0"
            style={{
              background:
                "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #2563eb 100%)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              {/* Orb + name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 30%, #93c5fd 0%, #3b82f6 35%, #1d4ed8 65%, #1e1b4b 100%)",
                  }}
                />
                <div>
                  <div className="text-white font-bold text-[15px] leading-snug">
                    UniERP Assistant
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/55 text-[12px]">
                      Online · Multilingual AI
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Lang picker */}
                <div className="relative">
                  <button
                    onClick={() => setLangOpen((v) => !v)}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all"
                  >
                    <span className="text-[13px]">{curLang.flag}</span>
                    {curLang.label}
                    <ChevronDown
                      size={9}
                      className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {langOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]"
                      style={{ zIndex: 100000 }}
                    >
                      {LANGS.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => changeLang(l.code)}
                          className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-2.5 transition-colors
                            ${l.code === lang ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
                        >
                          <span className="text-[15px]">{l.flag}</span>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Quick chips */}
            <div
              className="flex gap-2 overflow-x-auto pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {CHIPS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="shrink-0 text-[12px] font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-white"
            style={{ minHeight: 180, maxHeight: 300 }}
          >
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 items-end ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.role === "bot" && (
                  <div
                    className="w-7 h-7 rounded-full shrink-0 mb-0.5"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 30%,#93c5fd,#1d4ed8)",
                    }}
                  />
                )}
                <div
                  className={`max-w-[78%] text-[13px] leading-relaxed px-3.5 py-2.5
                  ${
                    m.role === "bot"
                      ? "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm rounded-tr-2xl rounded-b-2xl"
                      : "bg-slate-900 text-white rounded-tr-sm rounded-tl-2xl rounded-b-2xl"
                  }`}
                >
                  {m.role === "bot" ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(m.content),
                      }}
                    />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 30%,#93c5fd,#1d4ed8)",
                  }}
                />
                <div className="bg-slate-50 border border-slate-100 rounded-tl-sm rounded-tr-2xl rounded-b-2xl px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-3 shrink-0 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 bg-slate-50 border-[1.5px] border-slate-200 focus-within:border-blue-400 rounded-2xl px-3.5 py-2 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything about NIST…"
                className="flex-1 text-[13px] text-slate-800 bg-transparent border-none outline-none placeholder-slate-400 caret-blue-600"
              />
              {speechSupported && (
                <button
                  onClick={toggleMic}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0
                    ${listening ? "bg-red-100 text-red-500" : "bg-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  {listening ? <MicOff size={13} /> : <Mic size={13} />}
                </button>
              )}
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0
                  ${input.trim() && !typing ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
              >
                <Send size={12} />
              </button>
            </div>
            <p className="text-center mt-2 text-[10px] text-slate-300">
              UniERP AI · Verify important info with staff
            </p>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open AI Helpdesk"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "16px",
          zIndex: 99999,
        }}
        className={`w-14 h-14 rounded-[18px] flex items-center justify-center relative
          transition-all duration-200 hover:-translate-y-1 active:scale-95
          ${
            isOpen
              ? "bg-slate-700 shadow-xl shadow-slate-900/30"
              : "bg-blue-700 shadow-xl shadow-blue-800/40 hover:shadow-blue-600/50 hover:shadow-2xl"
          }`}
      >
        <div
          className="absolute transition-all duration-200"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen
              ? "scale(.5) rotate(-70deg)"
              : "scale(1) rotate(0deg)",
          }}
        >
          <MessageCircle size={22} color="#fff" />
        </div>
        <div
          className="absolute transition-all duration-200"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen
              ? "scale(1) rotate(0deg)"
              : "scale(.5) rotate(70deg)",
          }}
        >
          <X size={22} color="#fff" />
        </div>
        {hasUnread && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
            1
          </span>
        )}
      </button>
    </>
  );
}

// ── Portal wrapper ─────────────────────────────────────────────────────────

export default function FloatingHelpdesk() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(<HelpdeskUI />, document.body);
}
