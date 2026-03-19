import express from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { runAgentTurn, ChatMessage } from "../services/agent.js";
import { retrieveContext } from "../services/rag.js";

const router = express.Router();

// ─── Session store ──────────────────────────────────────────────────────────
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

// ─── Optional auth ──────────────────────────────────────────────────────────
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

// ─── Classify error → friendly client message ──────────────────────────────
// Never expose raw API errors, quota details, or stack traces to the client.
function getFriendlyError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);

  if (
    raw.includes("429") ||
    raw.includes("Too Many Requests") ||
    raw.includes("quota")
  ) {
    return {
      status: 429,
      message:
        "The AI assistant is temporarily busy. Please wait a moment and try again.",
    };
  }

  if (raw.includes("401") || raw.includes("403") || raw.includes("API_KEY")) {
    return {
      status: 503,
      message: "AI service is temporarily unavailable. Please try again later.",
    };
  }

  if (
    raw.includes("ECONNREFUSED") ||
    raw.includes("fetch failed") ||
    raw.includes("network")
  ) {
    return {
      status: 503,
      message:
        "Unable to reach the AI service right now. Please check your connection and try again.",
    };
  }

  // Generic fallback — never leak internal details
  return {
    status: 500,
    message: "Something went wrong. Please try again in a moment.",
  };
}

// ─── POST /api/v1/chatbot/ ──────────────────────────────────────────────────
router.post("/", optionalAuth, async (req: any, res: any) => {
  try {
    const { message, language = "english" } = req.body as {
      message: string;
      language?: string;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "message is required." });
    }

    const isAuthenticated = !!req.user;
    const sessionKey = isAuthenticated
      ? (req.user.id as string)
      : `public:${req.ip}`;
    const history = getOrCreateHistory(sessionKey);
    const cookieHeader = req.headers.cookie ?? "";

    const ragContext = await retrieveContext(message.trim());
    console.log(
      `[Chatbot] RAG=${ragContext.length}c lang=${language} msg="${message.slice(0, 60)}"`
    );

    const output = await runAgentTurn(message.trim(), history, {
      cookie: cookieHeader,
      userRole: isAuthenticated ? (req.user.role as string) : "PUBLIC",
      ragContext,
      isAuthenticated,
      responseLanguage: language.toLowerCase().trim(),
      isVoiceInput: false,
    });

    return res.status(200).json({
      success: true,
      message: "Response generated.",
      data: { output, authenticated: isAuthenticated, language },
    });
  } catch (err: unknown) {
    // Log full error server-side for debugging
    console.error("[Chatbot] Error:", err instanceof Error ? err.message : err);

    // Send only a safe friendly message to the client
    const { status, message } = getFriendlyError(err);
    return res.status(status).json({ success: false, message });
  }
});

// ─── DELETE /api/v1/chatbot/chat ────────────────────────────────────────────
router.delete("/chat", optionalAuth, (req: any, res: any) => {
  const sessionKey = req.user ? (req.user.id as string) : `public:${req.ip}`;
  sessions.delete(sessionKey);
  lastActive.delete(sessionKey);
  return res
    .status(200)
    .json({ success: true, message: "Conversation cleared." });
});

// ─── GET /api/v1/chatbot/history ────────────────────────────────────────────
router.get("/history", authMiddleware, (req: any, res: any) => {
  const history = sessions.get(req.user.id as string) ?? [];
  return res.status(200).json({
    success: true,
    data: { turns: history.length / 2, history },
  });
});

export { router as chatbotRouter };
