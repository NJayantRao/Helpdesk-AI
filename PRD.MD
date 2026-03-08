# PRD — AI-Powered Intelligent University ERP + Multilingual Helpdesk

---

# 1. Product Overview

**Product Name:** AI-Powered Intelligent University ERP  
**Version:** 1.0.0  
**Product Type:** University ERP + AI Retrieval Platform

AI-Powered Intelligent University ERP is a modular university management platform that combines traditional ERP workflows with Retrieval-Augmented Generation (RAG)-based AI assistance. The system is designed to support university members by providing structured academic data access, placement intelligence, personalized dashboards, and multilingual AI-driven helpdesk support.

The platform separates structured database queries from semantic document retrieval:

- Structured academic and administrative data are served from relational databases.
- Unstructured institutional knowledge is retrieved using vector search and LLM-based contextual answering.

The goal is to reduce departmental workload, improve information accessibility, and provide 24×7 multilingual support across university departments.

---

# 2. Target Audience

The product is designed for university members.

## Primary Users

- Students
- Faculty
- Administrative Staff
- Placement Cell Coordinators
- Department Administrators

## Secondary Users

- Admission Cell
- Examination Cell
- Hostel Administration
- Academic Office

## User Context

The system supports both authenticated and public users:

### Public Users

Can access:

- admission information
- general university FAQs
- public notices

### Authenticated Users

Can access:

- personalized dashboard
- academic records
- placement preparation tools
- internal AI helpdesk

---

# 3. Features

---

## 3.1 User Management

- **User Registration:** Account creation by authorized university control system
- **User Login:** Secure authentication using JWT
- **Role-Based Access Control:** Student, Faculty, Admin roles
- **Language Preference:** Multilingual interaction preference storage
- **Session Management:** Secure token-based sessions

---

## 3.2 Student Dashboard

- Personalized dashboard after login
- Semester overview
- CGPA display
- Academic notifications
- Department notices
- Placement eligibility summary

---

## 3.3 Multilingual AI Helpdesk (RAG Based)

- Natural language query answering
- Supports multilingual university queries
- Department-based document retrieval
- Semantic search across institutional documents
- Context-aware answers using Gemini

### Query Categories

- Admissions
- Academics
- Examination
- Hostel
- Placements
- Campus Services

### AI Query Routing

Structured queries:

- CGPA
- Marks
- Semester data

Unstructured queries:

- Circulars
- Placement documents
- Syllabus
- Notices

---

## 3.4 CGPA Maintainer + Trend Analyzer

- Semester-wise SGPA tracking
- CGPA history
- Performance trend analysis
- Trend labeling

### Trend Labels

- Improving
- Stable
- Declining

---

## 3.5 Target Company Placement System

- Company eligibility listing
- Target company selection
- Preparation tracking
- Placement document retrieval

### Placement Support

- JD upload
- Eligibility circulars
- Interview resources
- Previous preparation materials

---

## 3.6 Faculty Upload System

Faculty can upload:

- Academic notices
- Exam circulars
- Syllabus documents
- Result files
- Placement materials

---

## 3.7 Notification System

- Academic notifications
- Placement alerts
- Department announcements
- Personalized updates

---

## 3.8 Public Chatbot

Public chatbot available on landing page for:

- Admission FAQ
- General university information
- Basic placement information

---

## 3.9 Authenticated Chatbot

Dashboard chatbot for:

- Personalized academic queries
- Placement-specific retrieval
- Internal notices

---

# 4. Permission Table

---

## 4.1 User Roles

- `admin` - Full system access
- `faculty` - Departmental document and academic content management
- `student` - Dashboard and AI query access

---

## 4.2 Permission Matrix

| Feature                          | Admin | Student |
| -------------------------------- | ----- | ------- |
| Create User                      | ✓     | ✗       |
| Manage Departments               | ✓     | ✗       |
| Upload Academic Documents        | ✓     | ✗       |
| Upload Placement Documents       | ✓     | ✗       |
| Upload Results                   | ✓     | ✗       |
| View Results                     | ✓     | ✓       |
| View Dashboard                   | ✓     | ✓       |
| Ask AI Helpdesk Queries          | ✓     | ✓       |
| Access Personalized Chatbot      | ✓     | ✓       |
| Manage Notifications             | ✓     | ✗       |
| Target Company Selection         | ✗     | ✓       |
| View Placement Eligibility       | ✓     | ✓       |
| Manage Placement Companies       | ✓     | ✗       |
| Manage Documents                 | ✓     | ✗       |
| View Public Chatbot              | ✓     | ✓       |

---

# 5. Routes

---

## 5.1 Authentication Routes

**Authentication Routes** (`/api/v1/auth/`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - Logout secured user
- `GET /current-user` - Get current authenticated user
- `POST /change-password` - Change password

---

## 5.2 User Routes

**User Routes** (`/api/v1/users/`)

- `GET /profile` - User profile
- `PATCH /profile` - Update profile
- `GET /notifications` - User notifications

---

## 5.3 Student Routes

**Student Routes** (`/api/v1/students/`)

- `GET /dashboard` - Student dashboard
- `GET /cgpa` - Current CGPA
- `GET /cgpa/history` - CGPA trend history
- `GET /results` - Semester results
- `GET /target-companies` - Selected companies
- `POST /target-companies` - Add target company

---

## 5.4 Faculty Routes

**Faculty Routes** (`/api/v1/faculty/`)

- `POST /upload-document` - Upload departmental document
- `POST /upload-result` - Upload result data
- `POST /upload-placement-doc` - Upload placement file
- `GET /department-documents` - Department document list

---

## 5.5 Company Routes

**Placement Routes** (`/api/v1/companies/`)

- `GET /` - List companies
- `GET /:id` - Company details
- `POST /` - Add company
- `PATCH /:id` - Update company
- `DELETE /:id` - Delete company

---

## 5.6 AI Helpdesk Routes

**AI Routes** (`/api/v1/ai/`)

- `POST /query` - Ask AI helpdesk query
- `POST /public-query` - Public chatbot query
- `GET /query-history` - User query history

---

## 5.7 Document Routes

**Document Routes** (`/api/v1/documents/`)

- `POST /upload` - Upload document
- `GET /` - List documents
- `GET /:id` - Document details
- `DELETE /:id` - Remove document

---

## 5.8 Notification Routes

**Notification Routes** (`/api/v1/notifications/`)

- `GET /` - Fetch notifications
- `PATCH /:id/read` - Mark notification read

---

# 6. Core Architecture

---

## Structured Query Path

Used for:

- CGPA
- Marks
- Results
- User data

Flow:

Frontend → Node.js → PostgreSQL → Response

---

## Semantic Query Path (RAG)

Used for:

- Placement docs
- Notices
- Circulars
- Policies

Flow:

Frontend → Node.js → Python FastAPI → Vector DB → Gemini → Response

---

# 7. Technology Stack

---

## Frontend

- Next.js
- Tailwind CSS

---

## Backend

- Node.js
- Express.js

---

## Relational Database

- PostgreSQL

---

## AI Service

- Python
- FastAPI
- Pydantic

---

## RAG Layer

- LangChain
- Sentence Transformers
- Gemini API

---

## Vector Database

- Qdrant

---

## Document Processing

- PDF-PARSE

---

## Security

- JWT Authentication

---

## Deployment

- Vercel
- Render

---

# 8. Conclusion

AI-Powered Intelligent University ERP is designed as a modular university system where traditional ERP operations and AI retrieval coexist in a unified product.

The platform enables:

- structured academic data access
- intelligent semantic document retrieval
- multilingual support
- placement intelligence
- scalable departmental knowledge contribution

The architecture is designed MVP-first, with clean extensibility toward future university-scale deployment.

The combination of relational systems and RAG makes the product both operationally useful and technically modern.

---