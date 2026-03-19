import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { runAgentTurn, ChatMessage } from "../services/agent.js";
import { retrieveContext } from "../services/rag.js";
import { speechToText } from "../services/stt.js";
import { textToSpeech } from "../services/tts.js";

const router = express.Router();

// ── Audio upload — memory storage (no disk write) ──────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ── BCP-47 → human language name for agent directive ──────────────────────
const LANG_HUMAN: Record<string, string> = {
  "en-IN": "english",
  "hi-IN": "hindi",
  "or-IN": "odia",
  "bn-IN": "bengali",
  "te-IN": "telugu",
  "ta-IN": "tamil",
};

// ── Session store (separate namespace from text /chat sessions) ────────────
const sessions = new Map<string, ChatMessage[]>();
const lastActive = new Map<string, number>();
const SESSION_TTL_MS = 30 * 60 * 1000;

setInterval(
  () => {
    const now = Date.now();
    for (const [key, ts] of lastActive) {
      if (now - ts > SESSION_TTL_MS) {
        sessions.delete(key);
        lastActive.delete(key);
      }
    }
  },
  10 * 60 * 1000
);

function getOrCreateHistory(key: string): ChatMessage[] {
  if (!sessions.has(key)) sessions.set(key, []);
  lastActive.set(key, Date.now());
  return sessions.get(key)!;
}

// ── Optional auth (same as chatbot.routes.ts) ──────────────────────────────
function optionalAuth(req: any, _res: any, next: any) {
  try {
    const token =
      req?.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (token) {
      req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as Record<
        string,
        unknown
      >;
    }
  } catch {
    req.user = undefined;
  }
  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/voice/chat
//
// Multipart body:
//   audio       — audio blob from browser MediaRecorder (webm/opus)
//   lang        — BCP-47 code e.g. "hi-IN", "or-IN", "en-IN"  (optional)
//   transcript  — pre-computed transcript from Web Speech API  (optional)
//
// Response: audio/mpeg  (MP3 from ElevenLabs)
// Response headers:
//   X-Transcript      — what Whisper / Web Speech heard
//   X-Agent-Response  — text the agent replied before TTS
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  "/chat",
  optionalAuth,
  upload.single("audio"),
  async (req: any, res: any) => {
    try {
      // ── 1. Validate ────────────────────────────────────────────────────────
      if (!req.file?.buffer?.length) {
        return res
          .status(400)
          .json({ success: false, message: "No audio uploaded." });
      }

      const langCode: string = (req.body.lang as string) || "en-IN";
      const humanLang = LANG_HUMAN[langCode] ?? "english";

      // ── 2. STT — two-tier approach ─────────────────────────────────────────
      //
      // TIER 1: Browser Web Speech API transcript (arrives as `transcript` field)
      //   - Zero latency — already computed client-side while recording
      //   - Works great for English; decent for Hindi, Bengali, Telugu
      //   - May be empty on Firefox or when user denied mic permission prompt
      //
      // TIER 2: HuggingFace Whisper large-v3 via fal-ai (server-side)
      //   - Fallback when browser STT is empty or unavailable
      //   - Superior accuracy for Odia, lesser-resourced Indic languages
      //   - langCode hint makes it faster (skips auto-detection)
      //
      let transcript: string = (req.body.transcript as string)?.trim() ?? "";

      if (!transcript) {
        console.log("[Voice] No browser transcript — running Whisper STT");
        transcript = await speechToText(req.file.buffer, langCode);
      } else {
        console.log(
          `[Voice] Using browser transcript: "${transcript.slice(0, 60)}"`
        );
      }

      if (!transcript) {
        return res.status(422).json({
          success: false,
          message:
            "Could not transcribe audio. Please speak clearly and try again.",
        });
      }

      // ── 3. RAG + Agent (identical pipeline to /chat text route) ───────────
      const isAuthenticated = !!req.user;
      const sessionKey = isAuthenticated
        ? `voice:${req.user.id as string}`
        : `voice:public:${req.ip}`;
      const history = getOrCreateHistory(sessionKey);
      const cookieHeader = req.headers.cookie ?? "";

      console.log(`[Voice] Running RAG for: "${transcript.slice(0, 60)}"`);
      const ragContext = await retrieveContext(transcript);

      console.log(`[Voice] RAG: ${ragContext.length} chars. Running agent…`);
      const agentText = await runAgentTurn(transcript, history, {
        cookie: cookieHeader,
        userRole: isAuthenticated ? (req.user.role as string) : "PUBLIC",
        ragContext,
        isAuthenticated,
        // ← NEW: tell agent to reply in user's language + keep it speech-friendly
        responseLanguage: humanLang,
        isVoiceInput: true,
      });

      console.log(`[Voice] Agent text: "${agentText.slice(0, 100)}"`);

      // ── 4. TTS — ElevenLabs multilingual v2 ───────────────────────────────
      const mp3Buffer = await textToSpeech(agentText);

      // ── 5. Send MP3 + metadata headers ────────────────────────────────────
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": String(mp3Buffer.length),
        "X-Transcript": encodeURIComponent(transcript),
        "X-Agent-Response": encodeURIComponent(agentText),
      });
      return res.status(200).send(mp3Buffer);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Voice processing failed.";
      console.error("[Voice] Error:", msg);
      return res.status(500).json({ success: false, message: msg });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/voice/chat — clear voice session history
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/chat", optionalAuth, (req: any, res: any) => {
  const sessionKey = req.user
    ? `voice:${req.user.id as string}`
    : `voice:public:${req.ip}`;
  sessions.delete(sessionKey);
  lastActive.delete(sessionKey);
  return res
    .status(200)
    .json({ success: true, message: "Voice session cleared." });
});

export { router as voiceRouter };
