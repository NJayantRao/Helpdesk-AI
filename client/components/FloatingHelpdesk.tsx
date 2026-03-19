"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { useVoiceChat, VoiceState } from "@/hooks/useVoiceChat";

// ── Config ─────────────────────────────────────────────────────────────────

const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧", bcp47: "en-IN" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", bcp47: "hi-IN" },
  { code: "or", label: "ଓଡ଼ିଆ", flag: "🇮🇳", bcp47: "or-IN" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳", bcp47: "bn-IN" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", bcp47: "te-IN" },
];

const CHIPS = [
  "How do I apply?",
  "Fee structure",
  "Placement stats",
  "CGPA calculation",
  "Mess menu",
  "Hostel info",
];

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

// ── Markdown renderer ──────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/<li>/g, "<ul class='list-disc ml-4 space-y-0.5 my-1'><li>")
    .replace(/<\/li>/g, "</li></ul>")
    .replace(/\n{2,}/g, "<br/>");
}

// ── Voice mic button with state-based animations ───────────────────────────

function VoiceMicButton({
  voiceState,
  onToggle,
}: {
  voiceState: VoiceState;
  onToggle: () => void;
}) {
  const isRecording = voiceState === "recording";
  const isProcessing = voiceState === "processing";
  const isPlaying = voiceState === "playing";
  const isError = voiceState === "error";

  return (
    <button
      onClick={onToggle}
      title={
        isRecording
          ? "Tap to send"
          : isPlaying
            ? "Tap to stop"
            : isError
              ? "Error — tap to retry"
              : "Voice input"
      }
      style={{ position: "relative" }}
      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 select-none
        ${
          isRecording
            ? "bg-red-500 shadow-lg shadow-red-500/40"
            : isProcessing
              ? "bg-indigo-500"
              : isPlaying
                ? "bg-emerald-500"
                : isError
                  ? "bg-red-400"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
        }`}
    >
      {/* Recording: pulsing red ring */}
      {isRecording && (
        <>
          <span
            className="absolute inset-0 rounded-xl bg-red-500 opacity-40"
            style={{ animation: "voiceRing 1.2s ease-out infinite" }}
          />
          <span
            className="absolute inset-0 rounded-xl bg-red-500 opacity-20"
            style={{
              animation: "voiceRing 1.2s ease-out infinite",
              animationDelay: "0.4s",
            }}
          />
        </>
      )}

      {/* Processing: spinning ring */}
      {isProcessing && (
        <span
          className="absolute inset-[-3px] rounded-xl border-2 border-indigo-400 border-t-transparent"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      )}

      {/* Icon */}
      {isRecording ? (
        // Square stop icon
        <span className="w-3 h-3 bg-white rounded-sm" />
      ) : isProcessing ? (
        // Three bouncing dots
        <span className="flex gap-[3px] items-end h-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-white"
              style={{
                height: "6px",
                animation: "voiceBar 0.7s ease-in-out infinite alternate",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </span>
      ) : isPlaying ? (
        // Soundwave bars
        <span className="flex gap-[2px] items-end h-3.5">
          {[3, 5, 8, 5, 3].map((h, i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-white"
              style={{
                height: `${h}px`,
                animation: "voiceBar 0.5s ease-in-out infinite alternate",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </span>
      ) : isError ? (
        <span className="text-white text-[10px] font-bold">!</span>
      ) : (
        // Default mic SVG
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      )}
    </button>
  );
}

// ── Waveform shown while voice is recording or playing ────────────────────

function VoiceWaveform({ active }: { active: boolean }) {
  const heights = [3, 6, 9, 7, 11, 7, 9, 6, 3];
  return (
    <div className="flex items-center gap-[3px] h-4">
      {heights.map((h, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: "2px",
            height: active ? `${h}px` : "3px",
            backgroundColor: active ? "#60a5fa" : "#374151",
            transition: "height 0.3s ease",
            animation: active
              ? `voiceBar ${0.5 + i * 0.06}s ease-in-out infinite alternate`
              : "none",
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Voice overlay shown while recording / processing / playing ────────────

function VoiceOverlay({
  voiceState,
  transcript,
  agentResponse,
  onCancel,
}: {
  voiceState: VoiceState;
  transcript: string;
  agentResponse: string;
  onCancel: () => void;
}) {
  if (voiceState === "idle") return null;

  const label =
    voiceState === "recording"
      ? "Listening…"
      : voiceState === "processing"
        ? "Thinking…"
        : voiceState === "playing"
          ? "Speaking…"
          : "Error";

  const labelColor =
    voiceState === "recording"
      ? "text-red-400"
      : voiceState === "processing"
        ? "text-indigo-400"
        : voiceState === "playing"
          ? "text-emerald-400"
          : "text-red-400";

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-[22px]"
      style={{ animation: "fadeUp 0.2s ease both" }}
    >
      {/* Orb */}
      <div className="relative w-20 h-20 mb-5">
        {/* Outer ring pulse */}
        {(voiceState === "recording" || voiceState === "playing") && (
          <>
            <span
              className="absolute inset-[-8px] rounded-full border border-blue-300/40"
              style={{ animation: "voiceRing 1.5s ease-out infinite" }}
            />
            <span
              className="absolute inset-[-8px] rounded-full border border-blue-300/20"
              style={{
                animation: "voiceRing 1.5s ease-out infinite",
                animationDelay: "0.5s",
              }}
            />
          </>
        )}
        {/* Orb itself */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 32% 30%, #93c5fd 0%, #3b82f6 35%, #1d4ed8 65%, #1e1b4b 100%)",
            animation:
              voiceState === "playing"
                ? "glowBreathe 2s ease-in-out infinite"
                : "none",
          }}
        >
          {/* Waveform inside orb */}
          <div className="flex items-center gap-[3px]">
            {[4, 7, 11, 9, 13, 9, 11, 7, 4].map((h, i) => (
              <span
                key={i}
                className="rounded-full bg-white/80"
                style={{
                  width: "2px",
                  height:
                    voiceState === "recording" || voiceState === "playing"
                      ? `${h}px`
                      : "3px",
                  transition: "height 0.3s ease",
                  animation:
                    voiceState === "recording" || voiceState === "playing"
                      ? `voiceBar ${0.45 + i * 0.06}s ease-in-out infinite alternate`
                      : "none",
                  animationDelay: `${i * 0.07}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status label */}
      <p className={`text-sm font-semibold mb-1 ${labelColor}`}>{label}</p>

      {/* Transcript pill */}
      {transcript && (
        <p className="text-xs text-slate-500 max-w-[220px] text-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
          "{transcript}"
        </p>
      )}

      {/* Processing dots */}
      {voiceState === "processing" && (
        <div className="flex gap-1.5 mb-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
              style={{
                animation: "voiceDot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Cancel */}
      {voiceState !== "error" && (
        <button
          onClick={onCancel}
          className="mt-3 text-[11px] text-slate-400 hover:text-slate-600 transition-colors px-3 py-1 rounded-lg hover:bg-slate-100"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

// ── Keyframes injected once ────────────────────────────────────────────────

const VOICE_STYLES = `
  @keyframes voiceRing  { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
  @keyframes voiceBar   { from { transform: scaleY(0.4); } to { transform: scaleY(1.4); } }
  @keyframes voiceDot   { 0%,100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
  @keyframes fadeUp     { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes glowBreathe{ 0%,100% { box-shadow: 0 0 20px 4px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 40px 12px rgba(59,130,246,0.5); } }
  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes shake      { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
`;

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
        "Hi! I'm the UniERP Assistant 👋 Ask me about admissions, fees, exams, hostel, or placements. You can also use the mic to speak!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  // ── Voice integration ──────────────────────────────────────────────────
  const curLangObj = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  const { voiceState, transcript, agentResponse, toggleVoice, cancelVoice } =
    useVoiceChat({
      language: curLangObj.bcp47,
      onResult: ({ transcript: t, agentResponse: a }) => {
        // Add both user transcript and bot response as chat messages
        if (t) {
          setMsgs((p) => [
            ...p,
            { id: String(idRef.current++), role: "user", content: t },
          ]);
        }
        if (a) {
          setMsgs((p) => [
            ...p,
            { id: String(idRef.current++), role: "bot", content: a },
          ]);
        }
      },
      onError: (msg) => {
        setMsgs((p) => [
          ...p,
          { id: String(idRef.current++), role: "bot", content: `⚠️ ${msg}` },
        ]);
      },
    });

  const isVoiceActive = voiceState !== "idle";

  // ── Scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  // ── Open/close animation ───────────────────────────────────────────────
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

  // ── Text send ──────────────────────────────────────────────────────────
  const send = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg || typing || isVoiceActive) return;

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
          err?.response?.data?.message || err?.message || "Network error.";
        setMsgs((p) => [
          ...p,
          { id: String(idRef.current++), role: "bot", content: errMsg },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [input, lang, typing, isVoiceActive]
  );

  function changeLang(code: string) {
    setLang(code);
    localStorage.setItem("helpdesk_lang", code);
    setLangOpen(false);
  }

  const curLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <>
      <style>{VOICE_STYLES}</style>

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
          {/* Voice overlay — covers panel when voice is active */}
          <VoiceOverlay
            voiceState={voiceState}
            transcript={transcript}
            agentResponse={agentResponse}
            onCancel={cancelVoice}
          />

          {/* Header */}
          <div
            className="shrink-0 px-4 pt-5 pb-0"
            style={{
              background:
                "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #2563eb 100%)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Orb — pulses when voice is active */}
                <div
                  className="w-12 h-12 rounded-full shrink-0 transition-all duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 30%, #93c5fd 0%, #3b82f6 35%, #1d4ed8 65%, #1e1b4b 100%)",
                    animation: isVoiceActive
                      ? "glowBreathe 2s ease-in-out infinite"
                      : "none",
                  }}
                />
                <div>
                  <div className="text-white font-bold text-[15px] leading-snug">
                    UniERP Assistant
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {/* Status dot — changes colour by voice state */}
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-300
                      ${
                        voiceState === "recording"
                          ? "bg-red-400"
                          : voiceState === "processing"
                            ? "bg-indigo-300"
                            : voiceState === "playing"
                              ? "bg-emerald-300"
                              : "bg-emerald-400"
                      }`}
                      style={{
                        animation: isVoiceActive
                          ? "voiceDot 1.2s ease-in-out infinite"
                          : "none",
                      }}
                    />
                    <span className="text-white/55 text-[12px]">
                      {voiceState === "recording"
                        ? "Listening…"
                        : voiceState === "processing"
                          ? "Thinking…"
                          : voiceState === "playing"
                            ? "Speaking…"
                            : "Online · Multilingual AI"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lang + close */}
              <div className="flex items-center gap-2">
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
                  disabled={isVoiceActive}
                  className={`shrink-0 text-[12px] font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all
                    ${isVoiceActive ? "opacity-40 cursor-not-allowed" : ""}`}
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

          {/* Input bar */}
          <div className="px-4 pb-4 pt-3 shrink-0 border-t border-slate-100 bg-white">
            {/* Voice transcript preview */}
            {voiceState === "recording" && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <span
                  className="w-2 h-2 bg-red-500 rounded-full"
                  style={{ animation: "voiceDot 1s ease-in-out infinite" }}
                />
                <span className="text-[11px] text-red-500 font-medium">
                  {transcript
                    ? `"${transcript}"`
                    : `Listening in ${curLang.label}…`}
                </span>
              </div>
            )}

            <div
              className="flex items-center gap-2 bg-slate-50 border-[1.5px] border-slate-200 focus-within:border-blue-400 rounded-2xl px-3.5 py-2 transition-colors"
              style={{
                animation: voiceState === "error" ? "shake 0.4s ease" : "none",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={isVoiceActive}
                placeholder={
                  isVoiceActive
                    ? "Voice mode active…"
                    : "Ask anything about NIST…"
                }
                className="flex-1 text-[13px] text-slate-800 bg-transparent border-none outline-none placeholder-slate-400 caret-blue-600 disabled:opacity-50"
              />

              {/* Waveform — shown while recording */}
              {voiceState === "recording" && <VoiceWaveform active />}

              {/* Voice mic button */}
              <VoiceMicButton voiceState={voiceState} onToggle={toggleVoice} />

              {/* Send button */}
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing || isVoiceActive}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0
                  ${input.trim() && !typing && !isVoiceActive ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
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
