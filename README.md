# 🎓 CARRER-GUD — AI-Powered Career & Academic Guidance Platform

> **Realistic, Evidence-Based Educational Intelligence for Indian Students (Class 10 & 12)**

---

## 📌 1. Project Overview

In India, students make life-altering academic decisions at two high-pressure junctures:
1. **After Class 10**: Choosing between **Science: Non-Medical (PCM)**, **Science: Medical (PCB)**, **Science: Both (PCMB)**, **Commerce (with/without Maths)**, or **Arts/Humanities**.
2. **After Class 12 (+2)**: Selecting a university degree (**B.Tech, MBBS, B.Arch, CA, Law, Design, Pilot training**), navigating entrance exams (**JEE, NEET, CUET, CLAT**), and understanding long-term job security in an AI-driven economy.

Most Indian students make these choices under societal influence or coaching institute marketing hype, leading to burnout, wasted drop years, and career regret. 

**CARRER-GUD** solves this by uniting:
- **Diagnostic Aptitude & Stream Scoring Engines**
- **Core Operating Principle: "Be Realistic, Not Idealistic"** (checking marks vs aspirations, coaching intensity, and drop-year risks)
- **RAG-Grounded AI Career Counselor** (retrieving verified Indian entrance cutoffs, NIRF placement metrics, and automation exposure indices)
- **Verified Human Consultant Marketplace** (strictly filtered by verified domain — a commerce mentor cannot advise on MBBS surgery)
- **Interactive Career Pathway Visualizer** (connecting Class 10 → Stream → Exam → Degree → Career)

---

## 🏗️ 2. Architecture & Tech Stack

This project is built natively with **Next.js (App Router)** integrating the frontend interfaces, backend API routes, and server-side evaluation engines into a unified full-stack application.

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Authentication**: NextAuth.js (Auth.js) with Google OAuth, Credentials with bcrypt, and 1-Click Demo accounts
- **Database Layer**: Prisma ORM with PostgreSQL + `pgvector` ready schema
- **Zero-Config Fallback Engine**: Thread-safe in-memory repository layer with 30+ careers, 20+ colleges, verified mentors, and student assessment profiles (runs instantly with blank `.env.local` keys!)
- **AI / LLM Integration**:
  - **Primary**: Anthropic Claude API (`@anthropic-ai/sdk`)
  - **Secondary**: OpenAI (`gpt-4o` / `gpt-4o-mini`)
  - **Fallback**: Intelligent Local Heuristic Counselor engine that delivers realistic, grounded answers with citations even when API keys are blank.

---

## ⚡ 3. Quick Start (Zero Setup Required!)

The application is pre-configured with complete sample datasets and runs immediately out of the box:

```bash
# 1. Clone or navigate to the directory
cd silly-maxwell

# 2. Run automated test suite
npm run test

# 3. Start local Next.js development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 4. Fast 1-Click Demo Accounts

On the `/login` page, you can click any of the 1-click test buttons to test different roles:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Student** | `student@carrer-gud.in` | `password123` | Stream quizzes, profile signals, bookmarking, booking mentors |
| **Consultant** | `consultant@carrer-gud.in` | `password123` | Consultant Portal (`/consultant/dashboard`), view student bookings |
| **Admin** | `admin@carrer-gud.in` | `password123` | Admin Audit Portal (`/admin/verify-consultants`), Analytics |

---

## 🔐 5. Environment Variables (`.env.local`)

All keys in `.env.local` are initially blank as requested. You can fill them in whenever you are ready:

```env
# Server
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# PostgreSQL Database (Supabase, Neon, Railway, or local Postgres)
DATABASE_URL=
DIRECT_URL=

# NextAuth Authentication
AUTH_SECRET=carrer-gud-dev-secret-replace-in-production-random-key-32b
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=carrer-gud-dev-secret-replace-in-production-random-key-32b

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI LLM Provider Keys
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
LLM_MODEL=

# Cloud Storage & Email (Optional)
S3_BUCKET_NAME=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=
EMAIL_API_KEY=
EMAIL_FROM=
```

> **Note on Graceful Degradation:**
> If `DATABASE_URL` is empty, the platform automatically switches to its high-performance in-memory repository with pre-seeded IITs, AIIMS, NIRF colleges, 30+ careers, and mentors.
> If `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` is empty, the AI Chatbot runs the built-in Grounded Heuristic Counselor without crashing.

---

## 🗺️ 6. Core Application Routes

- `/` — Landing Page with Decision Gates, Manifesto, Careers, Colleges, and Pathways
- `/quiz/post-10th` — Class 10 Stream Discovery Quiz with marks calibration, radar chart & reality check
- `/quiz/post-12th` — Class 12 Degree & Exam Matcher with prerequisite validation
- `/careers` — 30+ Indian Careers Directory with AI Automation Exposure meters & INR salary bands
- `/careers/[slug]` — Deep-dive Career Profile, Roadmap, Day in the life, and adjacent similarities
- `/colleges` — NIRF Indian Colleges Directory (IITs, AIIMS, SRCC, NLSIU, BITS) with placement stats
- `/colleges/[slug]` — College Profile with degree programs, fees per year, and student reviews
- `/consultants` — Verified Mentors Directory (filtered strictly by verified domain)
- `/consultants/[id]` — Consultant Booking Page with assessment profile sharing
- `/consultants/apply` — Consultant Application Page with domain credential proofs
- `/consultant/dashboard` — Private portal for mentors to review student session requests
- `/admin/verify-consultants` — Administrative portal to approve/reject mentor domains
- `/admin/overview` — Administrative analytics dashboard
- `/chat` — Dedicated 24/7 AI Career Counselor with RAG citations
- `/dashboard` — Student Personal Dashboard (history, bookmarks, bookings)

---

## 🧪 7. Verification & Automated Tests

To execute the test suite:

```bash
npm run test
```

This verifies:
- `scoringEngine`: 10th & 12th weighted scoring algorithms
- `realismValidator`: Red/Amber alert generation for low-math/science scores
- `similarityEngine`: Vector cosine similarity matching adjacent careers
- `aiGuardrails`: Distress detection (Tele-MANAS redirect) and romantic roleplay interception
- `repository`: Strict domain verification enforcement for consultants

To build for production:

```bash
npm run build
```
