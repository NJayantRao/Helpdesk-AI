// ─────────────────────────────────────────────────────────────────────────────
// PATCH for src/services/agent.ts
//
// Two changes only — no other lines touched:
//
// 1. Add two optional fields to AgentContext interface
// 2. Update buildSystemInstruction to inject language + voice context
// ─────────────────────────────────────────────────────────────────────────────

import { SYSTEM_PROMPT } from "./prompt.js";

// ── CHANGE 1: Update AgentContext interface (was) ────────────────────────────
//
// export interface AgentContext {
//   cookie: string;
//   userRole: string;
//   ragContext?: string;
//   isAuthenticated: boolean;
// }
//
// ── Replace with: ─────────────────────────────────────────────────────────────

export interface AgentContext {
  cookie: string;
  userRole: string;
  ragContext?: string;
  isAuthenticated: boolean;
  // New: injected by voice route so agent knows to reply in user's language
  responseLanguage?: string; // e.g. "hindi", "odia", "bengali", "telugu", "english"
  isVoiceInput?: boolean; // true when request came from mic (not text)
}

// ── CHANGE 2: Replace buildSystemInstruction (was) ───────────────────────────
//
// function buildSystemInstruction(ctx: AgentContext): string {
//   let instruction = SYSTEM_PROMPT;
//   if (!ctx.isAuthenticated) {
//     instruction += PUBLIC_MODE_ADDON;
//   } else {
//     instruction += `\n\nSYSTEM INJECTED CONTEXT:\nUser Role: ${ctx.userRole}\n`;
//   }
//   if (ctx.ragContext?.trim()) {
//     instruction += `\nKNOWLEDGE BASE CONTEXT (use for CATEGORY A queries):\n${ctx.ragContext}\n`;
//   }
//   return instruction;
// }
//
// ── Replace with: ─────────────────────────────────────────────────────────────

function buildSystemInstruction(ctx: AgentContext): string {
  let instruction = SYSTEM_PROMPT;

  if (!ctx.isAuthenticated) {
    instruction += PUBLIC_MODE_ADDON;
  } else {
    instruction += `\n\nSYSTEM INJECTED CONTEXT:\nUser Role: ${ctx.userRole}\n`;
  }

  if (ctx.ragContext?.trim()) {
    instruction += `\nKNOWLEDGE BASE CONTEXT (use for CATEGORY A queries):\n${ctx.ragContext}\n`;
  }

  // ── Language instruction ───────────────────────────────────────────────────
  // Injected when user has selected a non-English language.
  // Agent MUST reply in that language regardless of what language the query was in.
  if (ctx.responseLanguage && ctx.responseLanguage !== "english") {
    instruction += `
════════════════════════════════════════
LANGUAGE DIRECTIVE (MANDATORY)
════════════════════════════════════════
The user's preferred language is: ${ctx.responseLanguage.toUpperCase()}
You MUST write your entire "output" value in ${ctx.responseLanguage}.
This applies to ALL responses — knowledge answers, tool results, error messages.
Do NOT switch to English unless the user explicitly asks.
Keep JSON structure (type, function, input keys) in English — only the "output" string value must be in ${ctx.responseLanguage}.
`;
  }

  // ── Voice mode instruction ─────────────────────────────────────────────────
  // When input came from speech, the agent should keep replies concise and
  // natural-sounding since they will be converted to speech by ElevenLabs.
  if (ctx.isVoiceInput) {
    instruction += `
════════════════════════════════════════
VOICE MODE DIRECTIVE
════════════════════════════════════════
This query was spoken by the user (voice input via microphone).
Your "output" will be converted to speech by a TTS engine.
Follow these rules strictly:
- Write in natural spoken language, NOT in a document/list format.
- Do NOT use markdown: no **, no bullet points (- or *), no numbered lists.
- Do NOT use special characters or symbols that sound unnatural when read aloud.
- Keep the response concise: 2–4 sentences maximum.
- Use full sentences. Prefer "and" over newlines.
- Numbers: write as words where natural (e.g. "eighty-five thousand" not "85,000").
- If listing items, use "firstly… secondly… and finally…" style, not bullets.
`;
  }

  return instruction;
}
