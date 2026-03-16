import { Worker } from "bullmq";
import dotenv from "dotenv";
import fs from "fs";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Document } from "@langchain/core/documents";

import { ENV } from "../lib/env.js";

dotenv.config();

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    try {
      console.log("JOB RECEIVED:", job.data);

      const data = job.data;

      if (!data?.path) {
        throw new Error("PDF path missing");
      }

      if (!fs.existsSync(data.path)) {
        throw new Error(`File not found: ${data.path}`);
      }

      // Load PDF
      const loader = new PDFLoader(data.path);
      const docs = await loader.load();

      console.log(`Loaded ${docs.length} pages`);

      // Clean each page
      const cleanDocs = docs
        .map((doc) => ({
          ...doc,
          pageContent: doc.pageContent
            .normalize("NFKC")
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            .replace(/[^\x20-\x7E]/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        }))
        .filter((doc) => doc.pageContent.length > 50);

      console.log(`Clean pages: ${cleanDocs.length}`);

      // Embeddings
      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "gemini-embedding-001",
        apiKey: ENV.GEMINI_API_KEY,
      });

      const testVector = await embeddings.embedQuery("hello");
      console.log("Embedding dimension:", testVector.length);

      // Qdrant client
      const client = new QdrantClient({
        url: "http://localhost:6333",
      });

      // Create collection if missing
      try {
        await client.getCollection("pdf-docs-testing");
      } catch {
        await client.createCollection("pdf-docs-testing", {
          vectors: {
            size: testVector.length,
            distance: "Cosine",
          },
        });

        console.log("Collection created");
      }

      // Insert full pages
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          client,
          collectionName: "pdf-docs-testing",
        }
      );

      for (let i = 0; i < cleanDocs.length; i += 5) {
        const batch = cleanDocs.slice(i, i + 5);

        try {
          await vectorStore.addDocuments(batch);
          console.log(`Inserted pages ${i + 1} to ${i + batch.length}`);
        } catch {
          console.log(`Failed batch starting ${i + 1}`);
        }
      }

      // Cleanup uploaded file
      fs.unlinkSync(data.path);

      console.log("Uploaded file deleted");
    } catch (error) {
      console.error("Worker error:", error);
      throw error;
    }
  },
  {
    concurrency: 5,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});
