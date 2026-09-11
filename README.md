# 🎓 CAREER-GUD — AI-Powered Career & Academic Guidance Platform

> **Realistic, Evidence-Based Educational Intelligence for Indian Students (Class 10 & 12)**

---

## 📌 1. Project Overview

In India, students make life-altering academic decisions at two high-pressure junctures:
1. **After Class 10**: Choosing between **Science: Non-Medical (PCM)**, **Science: Medical (PCB)**, **Science: Both (PCMB)**, **Commerce (with/without Maths)**, or **Arts/Humanities**.
2. **After Class 12 (+2)**: Selecting a university degree (**B.Tech, MBBS, B.Arch, CA, Law, Design, Pilot training**), navigating entrance exams (**JEE, NEET, CUET, CLAT**), and understanding long-term job security in an AI-driven economy.

Most Indian students make these choices under societal influence or coaching institute marketing hype, leading to burnout, wasted drop years, and career regret. 

**CAREER-GUD** solves this by uniting:
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
- **Zero-Config Fallback Engine**: Thread-safe in-memory repository layer with 30+ careers, 20+ colleges, verified mentors, and student assessment profiles (runs instantly even with blank `.env` keys!)
- **AI / LLM Integration**:
  - **Primary**: Google Gemini API (`@google/genai` / Gemini 2.5 Flash)
  - **Secondary**: Anthropic Claude & OpenAI
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

## 🛡️ 4. Role-Based Access Control (RBAC)

CAREER-GUD enforces strict role-based access control for three user personas:

- **Students**: Complete diagnostic stream/degree quizzes, bookmark careers and colleges, customize academic profiles, and book 1-on-1 verified mentorship sessions.
- **Consultants / Mentors**: Apply with domain expertise and proof documents, review verification status, and manage student consultation requests via the Consultant Dashboard.
- **Administrators**: Dedicated multi-factor protected audit hub to verify consultant credentials domain-by-domain, inspect student records, and analyze platform-wide trends.

> 🔒 **Security Notice**:
> Default or administrative credentials should **never** be exposed in public documentation or repositories. Administrator portal access requires both valid administrator credentials and the configured `ADMIN_SECRET_KEY` via `/admin/portal-login`.

---

## 🔐 5. Environment Variables (`.env.example`)

Refer to the included [`.env.example`](.env.example) template for environment setup. All values are kept blank by default for security:

```env
# Server
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# PostgreSQL Database (Supabase / Neon / PostgreSQL)
DATABASE_URL=
DIRECT_URL=

# NextAuth Authentication
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
ADMIN_SECRET_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Gemini API (AI Counselor)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Cache & Edge Rate Limiting (Upstash Redis REST API)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> **Note on Graceful Degradation:**
> - If `DATABASE_URL` is empty, the platform automatically runs using its high-performance in-memory repository pre-seeded with NIRF colleges, 30+ careers, and mentors.
> - If `GEMINI_API_KEY` is empty, the AI Chatbot runs the built-in Grounded Heuristic Counselor without crashing.
> - All environment credentials in `.env` are strictly protected and never committed to version control.

---

## 🗺️ 6. Core Application Routes

- `/` — Landing Page with Decision Gates, Manifesto, Careers, Colleges, and Pathways
- `/quiz/post-10th` — Class 10 Stream Discovery Quiz with marks calibration, radar chart & reality check
- `/quiz/post-12th` — Class 12 Degree & Exam Matcher with prerequisite validation
- `/careers` — 30+ Indian Careers Directory with AI Automation Exposure meters & INR salary bands
- `/careers/[slug]` — Deep-dive Career Profile, Roadmap, Day in the life, and adjacent similarities
- `/colleges` — NIRF Indian Colleges Directory (IITs, AIIMS, SRCC, NLSIU, BITS) with placement stats
- `/colleges/[slug]` — College Profile with degree programs, fees per year, and student reviews
- `/tools` — Central Decision Intelligence & Calculators Directory
- `/tools/rank-estimator` — Indian Entrance Cutoff & Category Rank Estimator (JEE, NEET, CUET, CLAT, IPMAT)
- `/tools/roi-calculator` — Higher Education Degree ROI, CSIS Moratorium Waiver & Loan EMI Calculator
- `/tools/stream-pivot` — NEP 2020 Stream Switch & Alternate Trajectory Simulator
- `/tools/drop-year` — Drop Year Statistical Diagnostic & Burnout Evaluation
- `/consultants` — Verified Mentors Directory (filtered strictly by verified domain)
- `/consultants/[id]` — Consultant Booking Page with assessment profile sharing & Jitsi video links
- `/consultants/apply` — Consultant Application Page with direct-to-storage credential uploads
- `/consultant/dashboard` — Private portal for mentors to review student session requests
- `/consultant/pending` — Status portal for consultants awaiting administrative approval
- `/admin/portal-login` — Multi-factor administrator authentication gateway
- `/admin/hub` — Unified Administrator Verification Hub for advisor approvals
- `/admin/overview` — Administrative analytics and student directory
- `/chat` — Dedicated 24/7 AI Career Counselor with RAG citations, transcript export, and persistence
- `/dashboard` — Student Personal Dashboard (Milestone Tracker, history, bookmarks, bookings)

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
- `aiGuardrails`: Distress detection (Tele-MANAS redirect), romantic roleplay interception, and prompt injection defense
- `repository`: Strict domain verification enforcement for consultants
- `security`: Password hashing, admin auth, input sanitization, and session boundaries
- `rankEstimator`: JoSAA and NEET rank calculations across categories
- `roiCalculator`: Degree break-even horizon and CSIS interest subsidy calculations

To build for production:

```bash
npm run build
```
