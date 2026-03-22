# 🎓 AI-Powered Intelligent University ERP

A modular university ERP system with a multilingual AI helpdesk 🤖, student dashboard 📊, CGPA analytics 📈, and placement intelligence 💼.  
The platform combines relational university data with Retrieval-Augmented Generation (RAG) 🧠 for semantic, document-based query answering 📚.

---

## 🚀 Overview

The **AI-Powered Intelligent University ERP (NIS)** is a modern, full-stack platform designed to simplify and enhance university operations through the integration of Artificial Intelligence 🤖 and intuitive user interfaces.

The system provides a unified solution for students and administrators by combining traditional ERP functionalities with advanced AI capabilities such as **Retrieval-Augmented Generation (RAG)** 🧠 and **agent-based reasoning**. Users can interact with the system using natural language (text or voice 🎤), enabling quick access to information like attendance, results, documents, and placement details without navigating complex dashboards.

At its core, the platform bridges two worlds:

- 📊 **Structured ERP Data** — real-time access to academic and administrative records
- 📚 **Unstructured Knowledge** — intelligent querying over university documents (PDFs, notices)

Additionally, the system supports **multilingual interaction 🌍**, making it accessible to a diverse user base, and incorporates a **voice-first experience 🔊** for seamless communication.

With a modular architecture, scalable backend, and AI-driven intelligence, NIS transforms traditional ERP systems into a **smart, interactive, and accessible digital assistant for universities**.

---

## ⭐ Key Features

### 🤖 AI-Powered Helpdesk

- Multilingual conversational assistant (text + voice 🎤)
- Natural language query understanding
- Context-aware responses using AI

---

### 🧠 Retrieval-Augmented Generation (RAG)

- Semantic search over university documents 📚
- Accurate answers from PDFs, notices, and guidelines
- Reduces hallucination with context injection

---

### 🔗 Real-Time ERP Integration

- Fetch live student data:
  - Attendance 📊
  - Results 📈
  - Notifications 🔔
- Direct backend API interaction via AI agent

---

### 🎤 Voice Interaction System

- Speech-to-Text (STT) for voice input
- Text-to-Speech (TTS) for natural responses 🔊
- Supports multilingual voice experience 🌍

---

### 🔐 Authentication & Authorization

- Secure login system with JWT
- Role-based access (Student / Admin)
- Protected APIs and routes

---

### 📊 Student Dashboard

- CGPA analytics and performance tracking
- Attendance and result visualization
- Centralized academic data access

---

### 🧩 Admin Panel

- Document upload (PDFs, notices) 📄
- Result and data management
- Notification broadcasting

---

### ⚙️ Asynchronous Processing

- Queue-based document ingestion (BullMQ)
- Background processing for scalability
- Efficient handling of large files

---

### 🗄️ Data & Storage Management

- PostgreSQL database for structured data
- Cloudinary for file storage ☁️
- Vector database (Qdrant) for embeddings

---

### 🚀 Scalable Architecture

- Modular backend (Express + TypeScript)
- API-driven design
- Easy to extend and maintain

---

## 🧰 Tech Stack

### 🎨 Frontend

- ⚛️ **React (via Next.js)** — Component-based UI development
- ▲ **Next.js** — Full-stack React framework (routing, SSR, API integration)
- 🎨 **Tailwind CSS** — Utility-first styling for modern UI
- 🌐 **Axios** — API communication between client and server
- 🎤 **Browser APIs**
  - MediaRecorder — audio capture
  - Web Speech API — client-side speech recognition

---

### ⚙️ Backend

- 🟢 **Node.js** — JavaScript runtime for scalable server-side logic
- 🚂 **Express.js (v5)** — REST API framework
- 🔐 **JWT Authentication** — Secure user sessions (httpOnly cookies)
- 📦 **Multer** — File and audio upload handling
- 📬 **BullMQ** — Queue system for background jobs

---

### 🗄️ Database & Storage

- 🐘 **PostgreSQL** — Relational database for ERP data
- 🔷 **Prisma ORM** — Type-safe database access
- ☁️ **Cloudinary** — Media and document storage (PDF/images CDN)

---

### 🧠 AI & Machine Learning

- ✨ **Gemini (Google AI)** — Core reasoning engine (AI agent)
- 🔍 **Gemini Embedding Model** — Text → vector embeddings
- 📊 **Qdrant** — Vector database for semantic search (RAG)
- 🎧 **Whisper (via Hugging Face / fal.ai)** — Speech-to-Text fallback
- 🔊 **ElevenLabs** — Text-to-Speech (natural voice output)

---

### ☁️ Cloud & Infrastructure

- 🚀 **Vercel** — Frontend deployment
- 🧱 **Render** — Backend deployment
- ⚡ **Upstash Redis** — Queue backend + rate limiting
- 🐳 **Docker** — Containerization and environment consistency

---

### 🔄 System Architecture Concepts

- 🧠 **RAG (Retrieval-Augmented Generation)** — Document-based AI responses
- 🔁 **Agent-Based Loop** — Decision-making AI with tool/API calling
- 📡 **REST APIs** — Communication between services
- ⚙️ **Asynchronous Processing** — Queue-based background jobs

---

### 🌍 Additional Capabilities

- 🌐 **Multilingual Support** — EN, HI, OR, BN, TE
- 🎤 **Voice-First Interaction** — End-to-end speech pipeline
- 📈 **Real-Time Data Handling** — Live ERP integration

---

## 🧰 Tech Stack

### 🎨 Frontend

- ⚛️ **React (via Next.js)** — Component-based UI development
- ▲ **Next.js** — Full-stack React framework (routing, SSR, API integration)
- 🎨 **Tailwind CSS** — Utility-first styling for modern UI
- 🌐 **Axios** — API communication between client and server
- 🎤 **Browser APIs**
  - MediaRecorder — audio capture
  - Web Speech API — client-side speech recognition

---

### ⚙️ Backend

- 🟢 **Node.js** — JavaScript runtime for scalable server-side logic
- 🚂 **Express.js (v5)** — REST API framework
- 🔐 **JWT Authentication** — Secure user sessions (httpOnly cookies)
- 📦 **Multer** — File and audio upload handling
- 📬 **BullMQ** — Queue system for background jobs

---

### 🗄️ Database & Storage

- 🐘 **PostgreSQL** — Relational database for ERP data
- 🔷 **Prisma ORM** — Type-safe database access
- ☁️ **Cloudinary** — Media and document storage (PDF/images CDN)

---

### 🧠 AI & Machine Learning

- ✨ **Gemini (Google AI)** — Core reasoning engine (AI agent)
- 🔍 **Gemini Embedding Model** — Text → vector embeddings
- 📊 **Qdrant** — Vector database for semantic search (RAG)
- 🎧 **Whisper (via Hugging Face / fal.ai)** — Speech-to-Text fallback
- 🔊 **ElevenLabs** — Text-to-Speech (natural voice output)

---

### ☁️ Cloud & Infrastructure

- 🚀 **Vercel** — Frontend deployment
- 🧱 **Render** — Backend deployment
- ⚡ **Upstash Redis** — Queue backend + rate limiting
- 🐳 **Docker** — Containerization and environment consistency

---

### 🔄 System Architecture Concepts

- 🧠 **RAG (Retrieval-Augmented Generation)** — Document-based AI responses
- 🔁 **Agent-Based Loop** — Decision-making AI with tool/API calling
- 📡 **REST APIs** — Communication between services
- ⚙️ **Asynchronous Processing** — Queue-based background jobs

---

### 🌍 Additional Capabilities

- 🌐 **Multilingual Support** — EN, HI, OR, BN, TE
- 🎤 **Voice-First Interaction** — End-to-end speech pipeline
- 📈 **Real-Time Data Handling** — Live ERP integration

---

## ⚙️ Setup Instructions

Follow the steps below to run the project locally:

---

### 📦 1. Clone the Repository

```bash
git clone https://github.com/NJayantRao/Helpdesk-AI.git
cd Helpdesk-AI
```

### 📁 2. Install Dependencies

#### 🔹 Client-side Setup

Create a `.env` file inside the **client/** directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Then install dependencies:

```bash
cd client
npm install
npm run dev
```

```md
🚀 App running at: http://localhost:3000
```

---

#### 🔹 Server-side Setup

- Create a `.env` file inside the **server/** directory.
- Use the provided `.env.sample` file as a reference:
- Copy the configuration into your `.env` file.
- Replace all placeholder values (`<...>`) with your actual credentials and API keys.

Then install dependencies:

```bash
cd ../server
npm install
npx prisma migrate dev # Database migration
npm run generate # Generate prisma client
npm run dev
```

```md
🚀 App running at: http://localhost:5000
```

## 🚀 Future Enhancements

- 🌍 **Enhanced Multilingual Support**
  - Improve support for regional languages (Odia, Bengali, Telugu)
  - Integrate better Indic-specific STT and TTS models

- ⚡ **Latency Optimization**
  - Reduce response time in STT, AI processing, and TTS
  - Implement streaming responses and caching mechanisms

- 📴 **Self-Hosted AI Models**
  - Deploy local STT, TTS, and embedding models
  - Reduce dependency on external APIs and improve privacy

- 📚 **Improved Knowledge Base**
  - Auto-sync university data and documents
  - Smarter indexing and retrieval for better RAG performance

---

## 🤝 CONTRIBUTING

Contributions are welcome and appreciated!  
To maintain consistency and code quality, please follow our contribution guidelines:

👉 [View Contributing Guide](./CONTRIBUTING.md)

## 📜 LICENSE

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
