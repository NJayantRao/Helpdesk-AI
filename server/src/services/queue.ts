import { Request, Response } from "express";
import { Queue } from "bullmq";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ENV } from "../lib/env.js";
import { redisConnection } from "../utils/constants.js";

const myQueue = new Queue("file-upload-queue", { connection: redisConnection });

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: ENV.GEMINI_API_KEY,
});

export const uploadPdfController = async (req: Request, res: Response) => {
  try {
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    await myQueue.add("file-uploading-ready", {
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    });

    return res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      filePath: req.file.path,
    });
  } catch (error) {
    console.error("Upload controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const chatController = async (req: Request, res: Response) => {
  try {
    console.log("Incoming request:", req.query);

    const client = new QdrantClient({
      url: ENV.QDRANT_URL,
      apiKey: ENV.QDRANT_API_KEY,
    });

    console.log("Qdrant client connected");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: ENV.GEMINI_API_KEY,
    });

    console.log("Embeddings initialized");

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        client,
        collectionName: "pdf-docs-testing",
      }
    );

    console.log("Vector store connected");

    const userQuery =
      typeof req.query.message === "string" ? req.query.message : "";

    console.log("User query:", userQuery);

    if (!userQuery) {
      return res.status(400).json({
        success: false,
        message: "Query missing",
      });
    }
    const info = await client.getCollection("pdf-docs-testing");
    console.log("Collection info:", info);
    const retriever = vectorStore.asRetriever(1);

    console.log("Retriever created");

    const result = await retriever.invoke(userQuery);

    console.log("Retriever result:", result);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "No matching docs found",
      });
    }

    const context = result.map((doc) => doc.pageContent).join("\n");

    console.log("Context length:", context.length);

    const SYSTEM_PROMPT = `
You are a helpful AI assistant.
Answer only from provided PDF context.

CONTEXT:
${context}
`;

    console.log("Sending to Gemini");

    const response = await model.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(userQuery),
    ]);

    console.log("Gemini response:", response.content);

    return res.json({
      success: true,
      response: response.content,
      result,
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Chat failed",
      error,
    });
  }
};
