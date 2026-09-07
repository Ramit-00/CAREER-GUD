# 🛡️ CARRER-GUD — Security & Guardrail Architecture

CARRER-GUD handles academic assessments, career decision metrics, and mentorship data for high school students (Class 10 and Class 12), many of whom are minors. The following security practices are enforced across the platform:

---

## 1. Authentication & Role-Based Access Control (RBAC)

- **Authentication Providers**: NextAuth.js (Auth.js) supporting Google OAuth (OAuth 2.0) and Credentials Provider with `bcryptjs`.
- **JWT Protection**: Sessions are stateless and signed with `NEXTAUTH_SECRET`. Tokens embed user ID and verified role (`STUDENT`, `CONSULTANT`, `ADMIN`).
- **Route Protection Middleware**:
  - `/admin/*` routes strictly require `role === 'ADMIN'`.
  - `/consultant/dashboard/*` strictly requires `role === 'CONSULTANT'` or `role === 'ADMIN'`.
  - `/dashboard/*` requires an authenticated session.
  - Unauthorized requests are redirected to `/login` with an explicit callback return URL.

---

## 2. Minor Safety & AI Chatbot Guardrails

Because many users are 15-18 year olds:
- **Strict Scope Enforcement**: The AI counselor is strictly constrained to academic guidance, stream selection, university cutoffs, and career outlooks.
- **Distress Interception**: The AI guardrail engine scans every incoming user message for emotional distress or self-harm keywords. Upon detection, it immediately intercepts the request with a supportive message redirecting the student to trusted adults and official 24/7 helplines:
  - **Tele-MANAS** (Ministry of Health, Govt. of India): `14416` / `1800-891-4416`
  - **AASRA**: `+91-9820466726`
- **Inappropriate Roleplay Prohibition**: Romance, dating, or intimate roleplay is rejected immediately.
- **Anti-Hallucination Grounding (RAG)**: The chatbot retrieves verified platform knowledge base chunks before answering questions regarding entrance cutoffs, college fees, or salaries.

---

## 3. Rate Limiting & Denial-of-Service Defense

- **In-Memory Sliding Window**: Sensitive API routes (specifically `/api/chat` and `/api/auth/*`) are guarded by an IP-based sliding window rate limiter in `src/middleware.ts` to protect LLM API costs and prevent brute-force attacks.

---

## 4. Input Validation & Data Sanitization

- **Zod Schemas**: Every API route (`/api/quiz/submit`, `/api/reviews`, `/api/consultants/apply`, `/api/consultants/bookings`, `/api/chat`, `/api/users/me`) validates the incoming request payload with strict Zod schemas before database execution.
- **SQL / NoSQL Injection Prevention**: Prisma ORM executes parameterized queries for PostgreSQL, preventing SQL injection vulnerabilities.

---

## 5. Consultant Per-Domain Verification Security

- A consultant's credentials are verified **per domain** (`MEDICAL`, `ENGINEERING`, `COMMERCE`, `ARTS`, `OVERSEAS`).
- A consultant verified in Commerce can never appear in Medical student searches. The matching query enforces `v.status === 'VERIFIED'` for the specific domain requested.

---

## 6. Secret Hygiene

- No production passwords, database URIs, OAuth client secrets, or AI API keys are committed to source control.
- `.env*` files are strictly included in `.gitignore`, with `.env.example` committed with blank values as a reference template.
