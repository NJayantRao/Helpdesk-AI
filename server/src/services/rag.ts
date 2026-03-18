import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ENV } from "../lib/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const qdrant = new QdrantClient({
  url: ENV.QDRANT_URL,
  apiKey: ENV.QDRANT_API_KEY,
});

const COLLECTION = process.env.QDRANT_COLLECTION || "nist_docs";
const TOP_K = 4;
const MIN_SCORE = 0.12;

async function embedQuery(text: string): Promise<number[]> {
  // ↓ Correct model name — "embedding-001" is the stable Gemini embedding model
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function retrieveContext(query: string): Promise<string> {
  try {
    const vector = await embedQuery(query);

    const results = await qdrant.search(COLLECTION, {
      vector,
      limit: TOP_K,
      score_threshold: MIN_SCORE,
      with_payload: true,
    });

    if (!results || results.length === 0) {
      console.log(`[RAG] No results for: "${query.slice(0, 60)}"`);
      return "";
    }

    const chunks = results.map((r, i) => {
      const content = (r.payload?.content as string) || "";
      const source = (r.payload?.metadata as any)?.source || "unknown";
      console.log(
        `[RAG] Hit ${i + 1}: score=${r.score?.toFixed(3)} source=${source}`
      );
      return content.trim();
    });

    return chunks.filter(Boolean).join("\n\n---\n\n");
  } catch (err: unknown) {
    console.error(
      "[RAG] Retrieval error:",
      err instanceof Error ? err.message : err
    );
    return "";
  }
}
