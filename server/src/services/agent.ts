import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompt.js";
import { dispatchTool } from "./tools.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface AgentContext {
  cookie: string;
  userRole: string;
  ragContext?: string;
  isAuthenticated: boolean;
}

const PUBLIC_MODE_ADDON = `
CURRENT SESSION: UNAUTHENTICATED (PUBLIC MODE)
════════════════════════════════════════════════
- NO tools are available in this session.
- You MUST answer CATEGORY A (knowledge/RAG) queries only.
- If the user asks for personal data respond with:
  {"type":"output","output":"Please log in to access your personal ERP data."}
- Never attempt an ACTION in this mode. PLAN → OUTPUT only.
`;

// ─── Extract the LAST valid JSON object from a response ────────────────────
function extractLastJSON(raw: string): Record<string, unknown> {
  const cleaned = raw
    .replace(/^```json\s*/gm, "")
    .replace(/^```\s*/gm, "")
    .replace(/```\s*$/gm, "")
    .trim();

  const objects: string[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === '"') {
      i++;
      while (i < cleaned.length) {
        if (cleaned[i] === "\\") {
          i++;
        } else if (cleaned[i] === '"') break;
        i++;
      }
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push(cleaned.slice(start, i + 1));
        start = -1;
      }
    }
  }

  if (objects.length === 0) {
    throw new Error("No JSON object found in response");
  }

  const last = objects[objects.length - 1];
  const parsed = JSON.parse(last || "{}");
  if (objects.length > 1) {
    console.warn(
      `[Agent] Model emitted ${objects.length} JSON objects in one turn. ` +
        `Discarded: ${objects
          .slice(0, -1)
          .map((o) => {
            try {
              return JSON.parse(o).type;
            } catch {
              return "?";
            }
          })
          .join(", ")} → using: ${parsed.type}`
    );
  }

  return parsed;
}

// ─── Core agentic loop ─────────────────────────────────────────────────────
export async function runAgentTurn(
  userQuery: string,
  history: ChatMessage[],
  ctx: AgentContext
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: buildSystemInstruction(ctx),
    // ↓ Increase token limit — long responses like full weekly menus were
    //   being cut off mid-JSON, causing extractLastJSON to fail.
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.2, // lower = more deterministic JSON output
    },
  });

  const chatSession = model.startChat({ history });
  history.push({ role: "user", parts: [{ text: userQuery }] });

  let currentMessage = userQuery;
  let finalOutput = "I encountered an unexpected error. Please try again.";
  let iterations = 0;
  const MAX_ITER = 8;

  while (iterations < MAX_ITER) {
    iterations++;

    const result = await chatSession.sendMessage(currentMessage);
    const rawResponse = result.response.text().trim();

    history.push({ role: "model", parts: [{ text: rawResponse }] });

    console.log(`[Agent iter ${iterations}] Raw:`, rawResponse.slice(0, 300));

    if (!rawResponse) {
      console.warn("[Agent] Empty response from model.");
      break;
    }

    let parsed: {
      type: string;
      plan?: string;
      function?: string;
      input?: Record<string, string>;
      output?: string;
    };

    try {
      parsed = extractLastJSON(rawResponse) as typeof parsed;
    } catch (err) {
      console.error(
        "[Agent] Could not extract JSON:",
        rawResponse.slice(0, 300)
      );
      finalOutput = "Sorry, I had trouble processing that. Please try again.";
      break;
    }

    // ── PLAN ────────────────────────────────────────────────────────────────
    if (parsed.type === "plan") {
      console.log("[Agent] PLAN:", parsed.plan);
      currentMessage = "Proceed.";
      history.push({ role: "user", parts: [{ text: currentMessage }] });
      continue;
    }

    // ── ACTION ──────────────────────────────────────────────────────────────
    if (parsed.type === "action") {
      if (!ctx.isAuthenticated) {
        console.warn("[Agent] ACTION blocked — unauthenticated session.");
        finalOutput = "Please log in to access your personal ERP data.";
        break;
      }

      const toolName = parsed.function!;
      const toolInput = parsed.input || {};
      console.log(`[Agent] ACTION: ${toolName}`, toolInput);

      let toolResult: unknown;
      try {
        toolResult = await dispatchTool(
          toolName,
          toolInput,
          ctx.cookie,
          ctx.userRole
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Agent] Tool error (${toolName}):`, msg);
        toolResult = { error: "TOOL_FAILED", message: msg };
      }

      console.log(
        `[Agent] OBSERVATION:`,
        JSON.stringify(toolResult).slice(0, 200)
      );

      const observation = JSON.stringify({
        type: "observation",
        observation: toolResult,
      });

      currentMessage = observation;
      history.push({ role: "user", parts: [{ text: currentMessage }] });
      continue;
    }

    // ── OUTPUT ──────────────────────────────────────────────────────────────
    if (parsed.type === "output") {
      finalOutput = parsed.output ?? "Done.";
      console.log("[Agent] OUTPUT:", finalOutput.slice(0, 100));
      break;
    }

    console.warn("[Agent] Unknown response type:", parsed.type);
    finalOutput = "Sorry, something went wrong. Please try again.";
    break;
  }

  if (iterations >= MAX_ITER) {
    console.warn("[Agent] Hit max iterations.");
    finalOutput =
      "I took too long to process that. Please try a simpler query.";
  }

  return finalOutput;
}

// ─── Build system instruction ──────────────────────────────────────────────
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

  return instruction;
}
