"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircleMore, SendHorizontal, X } from "lucide-react";

import type { SupportMode } from "@/lib/support-chat-data";
import {
  getSupportQuickPrompts,
  getSupportReply,
  getSupportWelcomeMessage,
} from "@/lib/support-chat-data";
import { cn } from "@/lib/utils";

type SupportChatWidgetProps = {
  mode: SupportMode;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  href?: string;
  hrefLabel?: string;
};

function createWelcomeMessage(mode: SupportMode): ChatMessage {
  return {
    id: `welcome-${mode}`,
    role: "assistant",
    text: getSupportWelcomeMessage(mode),
  };
}

export function SupportChatWidget({ mode }: SupportChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(mode),
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const quickPrompts = getSupportQuickPrompts(mode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function submitQuestion(rawQuestion: string) {
    const trimmedQuestion = rawQuestion.trim();

    if (!trimmedQuestion) {
      return;
    }

    const reply = getSupportReply(mode, trimmedQuestion);

    setMessages((current) => [
      ...current,
      {
        id: `user-${current.length + 1}`,
        role: "user",
        text: trimmedQuestion,
      },
      {
        id: `assistant-${current.length + 2}`,
        role: "assistant",
        text: reply.answer,
        href: reply.href,
        hrefLabel: reply.hrefLabel,
      },
    ]);
    setQuery("");
    setIsOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion(query);
  }

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-24 right-4 z-[60] w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-[30px] border border-white/80 bg-[rgba(255,255,255,0.94)] shadow-[0_28px_80px_-28px_rgba(15,23,42,0.48)] backdrop-blur-xl sm:right-6">
          <div className="bg-[linear-gradient(135deg,#0f172a,#1d4ed8_58%,#60a5fa)] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/12 p-2.5 text-white">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
                    Support
                  </p>
                  <p className="text-lg font-semibold">Ask a quick question</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/18"
                aria-label="Close support chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[24rem] space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.42)]",
                    message.role === "user"
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200/80 bg-slate-50 text-slate-700"
                  )}
                >
                  <p>{message.text}</p>
                  {message.href && message.hrefLabel ? (
                    <Link
                      href={message.href}
                      className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-950"
                    >
                      {message.hrefLabel}
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200/80 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitQuestion(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-950 hover:bg-white hover:text-slate-950"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type your question..."
                aria-label="Ask a support question"
                className="min-w-0 flex-1"
              />
              <button
                type="submit"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800"
                aria-label="Send support question"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#0f172a,#1d4ed8_58%,#60a5fa)] px-4 py-3 text-sm font-semibold text-white shadow-[0_24px_56px_-24px_rgba(29,78,216,0.8)] transition hover:translate-y-[-1px] sm:bottom-6 sm:right-6"
        aria-label={isOpen ? "Hide support chat" : "Open support chat"}
      >
        <MessageCircleMore className="h-5 w-5" />
        <span className="hidden sm:inline">Help</span>
      </button>
    </>
  );
}
