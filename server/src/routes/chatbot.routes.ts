import express from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { runAgentTurn, ChatMessage } from "../services/agent.js";
import { retrieveContext } from "../services/rag.js";

const router = express.Router();

// ─── Session store ─────────────────────────────────────────────────────────
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

// ─── Optional auth ─────────────────────────────────────────────────────────
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

// ─── POST /api/v1/chatbot/chat ─────────────────────────────────────────────
router.post("/", optionalAuth, async (req: any, res: any) => {
  try {
    const { message } = req.body as { message: string };

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

    // ── Always retrieve RAG context server-side ─────────────────────────
    // Query Qdrant with the user's message → get relevant document chunks.
    // This runs for EVERY request so the agent always has context available.
    // If Qdrant is unavailable it returns "" gracefully and the agent falls
    // back to its own knowledge.
    const ragContext = await retrieveContext(message.trim());

    console.log(
      `[Chatbot] RAG retrieved ${ragContext.length} chars for: "${message.slice(0, 60)}"`
    );

    const output = await runAgentTurn(message.trim(), history, {
      cookie: cookieHeader,
      userRole: isAuthenticated ? (req.user.role as string) : "PUBLIC",
      ragContext, // always injected — never empty unless Qdrant has nothing
      isAuthenticated,
    });

    return res.status(200).json({
      success: true,
      message: "Response generated.",
      data: { output, authenticated: isAuthenticated },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error.";
    console.error("[Chatbot] Error:", msg);
    return res.status(500).json({ success: false, message: msg });
  }
});

// ─── DELETE /api/v1/chatbot/chat ───────────────────────────────────────────
router.delete("/chat", optionalAuth, (req: any, res: any) => {
  const sessionKey = req.user ? (req.user.id as string) : `public:${req.ip}`;
  sessions.delete(sessionKey);
  lastActive.delete(sessionKey);
  return res
    .status(200)
    .json({ success: true, message: "Conversation cleared." });
});

// ─── GET /api/v1/chatbot/history ───────────────────────────────────────────
router.get("/history", authMiddleware, (req: any, res: any) => {
  const history = sessions.get(req.user.id as string) ?? [];
  return res.status(200).json({
    success: true,
    data: { turns: history.length / 2, history },
  });
});

export { router as chatbotRouter };
