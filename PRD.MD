# PRD — AI-Powered Intelligent University ERP + Multilingual Helpdesk

**Version:** 1.0.0  
**Product Type:** University ERP + AI Retrieval Platform  
**Last Updated:** March 2026

---

## 1. Product Overview

AI-Powered Intelligent University ERP is a modular university management platform that combines traditional ERP workflows with Retrieval-Augmented Generation (RAG)-based AI assistance. The system supports university members by providing structured academic data access, personalized dashboards, and multilingual AI-driven helpdesk support.

The platform separates structured database queries from semantic document retrieval:

- Structured academic and administrative data are served from relational databases.
- Unstructured institutional knowledge is retrieved using vector search and LLM-based contextual answering.

The goal is to reduce administrative workload, improve information accessibility, and provide 24×7 multilingual support across university departments.

---

## 2. Target Audience

### Primary Users

- Students
- Administrative Staff (Admin)
- Department Administrators

### Secondary Users

- Admission Cell
- Examination Cell
- Hostel Administration
- Academic Office

### User Context

The system supports both authenticated and public users.

**Public Users** can access:
- Admission information
- General university FAQs
- Public notices

**Authenticated Users** can access:
- Personalized dashboard
- Academic records
- Internal AI helpdesk

---

## 3. Features

### 3.1 User Management

- **User Registration:** Account creation by authorized university control system
- **User Login:** Secure authentication using JWT
- **Role-Based Access Control:** System, Admin, Student roles
- **Language Preference:** Multilingual interaction preference stored per user; passed as a parameter to AI service to determine response language
- **Session Management:** Secure token-based sessions
- **Logout:** Client-side JWT discard; token blacklisting via server-side store to be considered in future iterations

---

### 3.2 Student Dashboard

- Personalized dashboard post login
- Semester overview
- CGPA display
- Academic notifications
- Department notices

---

### 3.3 Multilingual AI Helpdesk (RAG Based)

- Natural language query answering
- Multilingual university query support
- Department-based document retrieval
- Semantic search across institutional documents
- Context-aware answers via Gemini API

#### Query Categories

- Admissions
- Academics
- Examination
- Hostel
- Campus Services

#### AI Query Routing

Routing between structured and unstructured paths is handled by a **rule-based classifier** in the Node.js backend, which inspects keywords and query intent before dispatching:

**Structured path** (Node.js → PostgreSQL):
- CGPA queries
- Marks and results
- Semester data

**Unstructured path** (Node.js → RAG Service → Qdrant → Gemini):
- Circulars
- Syllabus documents
- Notices and policies

#### Rate Limiting & Fallback

- AI helpdesk queries are rate-limited per authenticated user (configurable threshold)
- Public chatbot queries are rate-limited per IP address
- If Gemini API is unavailable, a graceful fallback message is returned; no partial or hallucinated responses are served

---

### 3.4 CGPA Maintainer + Trend Analyzer

- Semester-wise SGPA tracking
- CGPA history
- Performance trend analysis
- Trend labeling: **Improving**, **Stable**, **Declining**

---

### 3.5 Document Management

Admin users can upload and manage institutional documents which are ingested into the vector store for RAG retrieval.

**Supported document types:**
- Academic notices
- Exam circulars
- Syllabus documents
- Result files

**Document lifecycle:**
- On upload, documents are chunked and embedded into Qdrant
- On deletion, associated vector embeddings are removed from Qdrant to prevent stale retrieval
- Re-upload of the same document triggers a re-indexing flow (old vectors purged, new vectors inserted)

---

### 3.6 Public Chatbot

Available on the landing page for unauthenticated users:

- Admission FAQ
- General university information
- IP-based rate limiting applied to prevent abuse

---

### 3.7 Authenticated Chatbot

Dashboard chatbot for logged-in users:

- Personalized academic queries
- Internal notices and circulars
- User's language preference applied to AI responses

---

## 4. Permission Table

### 4.1 User Roles

| Role | Description |
|------|-------------|
| `system` | Superuser. Full privileges across all system operations. Reserved for infrastructure/operations. |
| `admin` | University staff. Manages academic content, documents, users, and data. |
| `student` | Enrolled student. Dashboard, academic records, and AI helpdesk access. |

> **Note:** The Faculty role has been removed. All document upload and management responsibilities previously attributed to Faculty are now handled by Admin.

---

### 4.2 Permission Matrix

| Feature | System | Admin | Student |
|---------|--------|-------|---------|
| Create User | ✓ | ✓ | ✗ |
| Manage Departments | ✓ | ✓ | ✗ |
| Upload Academic Documents | ✓ | ✓ | ✗ |
| Upload Results | ✓ | ✓ | ✗ |
| View Results | ✓ | ✓ | ✓ |
| View Dashboard | ✓ | ✓ | ✓ |
| Ask AI Helpdesk Queries | ✓ | ✓ | ✓ |
| Access Personalized Chatbot | ✓ | ✓ | ✓ |
| Manage Documents | ✓ | ✓ | ✗ |
| View Public Chatbot | ✓ | ✓ | ✓ |
| Manage Users | ✓ | ✗ | ✗ |
| System Configuration | ✓ | ✗ | ✗ |

---

## 5. Routes

### 5.1 Authentication Routes

Base: `/api/v1/auth/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/logout` | Logout authenticated user |
| POST | `/forgot-password` | Forgot password |
| POST | `/reset-password` | Reset password |

---

### 5.2 Student Routes

Base: `/api/v1/students/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Student dashboard data |
| PUT | `/change-password` | Change password |
| GET | `/cgpa` | Current CGPA |
| GET | `/cgpa/history` | CGPA trend history |
| GET | `/results` | Semester results |
| GET | `/notifications` | Get user notifications |

---

### 5.4 Admin Routes

Base: `/api/v1/admin/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-documents` | Upload departmental document |
| POST | `/upload-result` | Upload result data |
| GET | `/upload-documents` | List department documents |
| GET | `/users` | List all users |

---

### 5.5 AI Helpdesk Routes

Base: `/api/v1/ai/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/query` | Ask authenticated AI helpdesk query |
| POST | `/public-query` | Public chatbot query (rate limited by IP) |
| GET | `/query-history` | Retrieve user's query history |

---

### 5.6 Document Routes

Base: `/api/v1/documents/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload and index document |
| GET | `/` | List all documents |
| GET | `/:id` | Get document details |
| DELETE | `/:id` | Remove document and purge vectors |

---

## 6. Core Architecture

### Structured Query Path

Used for CGPA, marks, results, and user data.

```
Frontend (Next.js) → Node.js API → PostgreSQL → Response
```

### Semantic Query Path (RAG)

Used for notices, circulars, syllabus, and policies.

```
Frontend (Next.js) → Node.js API → RAG Module → Qdrant → Gemini API → Response
```

> **Note:** The RAG module is currently embedded within the Node.js backend. Migration to a standalone Python/FastAPI microservice is planned post-MVP (see Section 8).

---

## 7. Technology Stack

### Frontend
- Next.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Relational Database
- PostgreSQL

### RAG Layer (embedded in Node.js for MVP)
- LangChain.js
- Sentence Transformers (via API)
- Gemini API

### Vector Database
- Qdrant

### Document Processing
- pdf-parse
- text-splitter

### Security
- JWT Authentication
- IP-based rate limiting (public routes)

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 8. Future Scope

### 8.1 AI Service Migration to Python

As AI workloads grow, the RAG module will be extracted from Node.js and migrated to a dedicated Python microservice.

**Planned stack:**
- Python + FastAPI
- Pydantic for schema validation
- LangChain (Python)
- Sentence Transformers

**Migration flow (post-MVP):**

```
Node.js → HTTP → Python FastAPI → Qdrant → Gemini → Response
```

---

### 8.2 Placement Intelligence System

Full placement module to be built as a standalone feature set after core ERP is stable.

**Planned features:**
- Company eligibility listing based on CGPA thresholds
- Target company selection by students
- Placement document retrieval (JDs, interview resources, past materials)
- Preparation progress tracking
- Placement eligibility summary on dashboard

**Planned routes** (`/api/v1/companies/`, `/api/v1/students/placement/`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/companies` | List placement companies |
| GET | `/companies/:id` | Company details |
| POST | `/companies` | Add company (Admin) |
| PATCH | `/companies/:id` | Update company (Admin) |
| DELETE | `/companies/:id` | Remove company (Admin) |
| GET | `/students/target-companies` | Student's selected companies |
| POST | `/students/target-companies` | Add target company |

**Planned permission additions:**

| Feature | Admin | Student |
|---------|-------|---------|
| Manage Placement Companies | ✓ | ✗ |
| Upload Placement Documents | ✓ | ✗ |
| Target Company Selection | ✗ | ✓ |
| View Placement Eligibility | ✓ | ✓ |

---

### 8.3 Token Blacklisting for Logout

Implement server-side token revocation using Redis to support secure logout across distributed sessions.

---

### 8.4 Admin Audit Logs

Track document uploads, user creation, and system changes by Admin and System users for accountability.

> **Deferred:** Audit logging is out of MVP scope. To be picked up after core ERP and Placement Intelligence are stable.

---

## 9. Conclusion

AI-Powered Intelligent University ERP is designed as a modular university system where traditional ERP operations and AI retrieval coexist in a unified product.

The platform delivers:

- Structured academic data access via relational database queries
- Intelligent semantic document retrieval via an embedded RAG pipeline
- Multilingual support through user language preferences passed to Gemini
- A clean, extensible architecture with a clear migration path to microservices

The MVP is Node.js + Next.js first, with Python AI service migration and the Placement Intelligence module planned as the next major development phases.