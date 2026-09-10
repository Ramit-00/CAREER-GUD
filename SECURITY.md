# 🛡️ CAREER-GUD — Security & Guardrail Architecture

CAREER-GUD handles academic assessments, career decision metrics, and mentorship data for high school students (Class 10 and Class 12), many of whom are minors. The following security practices are enforced across the platform:

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
- **Anti-Hallucination Grounding (RAG)**: The chatbot retrieves verified platform knowledge base chunks inside `<verified_institutional_data>` XML delimiters before answering questions regarding entrance cutoffs, college fees, or salaries.
- **Prompt Injection & Jailbreak Defense**: Multi-pattern regex engine (`PROMPT_INJECTION_PATTERNS`) scans conversation histories for instruction override attempts, DAN/Developer mode activations, or attempts to leak system prompts and keys, returning safe, counselor-aligned intercepts.

---

## 3. Rate Limiting & Denial-of-Service Defense

- **Session-Aware Sliding Window**: Sensitive API routes (`/api/chat`, `/api/auth/*`, `/api/consultants/bookings`, `/api/reviews`) are guarded by rate limiting in `src/middleware.ts`.
- **Anti-Spoofing IP Resolution**: Inspects verified reverse-proxy headers (`x-real-ip`, `cf-connecting-ip`, client entry of `x-forwarded-for`).
- **Session-Based Rate Limiting**: Authenticated users are bound to `user:${userId}` instead of IP, neutralizing proxy-rotation bypasses.
- **Tiered Endpoint Protection**:
  - `/api/chat`: 10 req/min for anonymous callers (preventing token exhaustion/DDoS), 30 req/min for logged-in students and advisors.
  - `/api/consultants/bookings`: 15 req/min POST limit preventing booking spam and race conditions.

---

## 4. Input Validation & Data Sanitization

- **Zod Schemas**: Every API route validates the incoming request payload with strict Zod schemas before database execution.
- **Stored XSS Neutralization**: User-contributed profile fields (`name`, `aboutMe`, `board`, `interests`, `strengths`) have HTML markup stripped before database persistence.
- **Mathematical Scoring Integrity**: Academic scores (`mathScore`, `scienceScore`, etc.) undergo finite-number and boundary validation (`0` to `100`), preventing `NaN` comparison bypasses in stream matching algorithms.
- **SQL Injection Prevention**: Prisma ORM executes parameterized queries for PostgreSQL, preventing SQL injection vulnerabilities.

---

## 5. Consultant Per-Domain Verification Security

- A consultant's credentials are verified **per domain** (`MEDICAL`, `ENGINEERING`, `COMMERCE`, `ARTS`, `OVERSEAS`).
- A consultant verified in Commerce can never appear in Medical student searches. The matching query enforces `v.status === 'VERIFIED'` for the specific domain requested.

---

## 6. Secret Hygiene & Authentication Hardening

- **Decoupled Admin Password**: Administrative passwords are never persisted to the database and are compared directly from `.env` using constant-time buffers (`crypto.timingSafeEqual`).
- **Zero Secrets in Git**: No production passwords, database URIs, OAuth client secrets, or AI API keys are committed to source control.
- **Gitignore Strictness**: `.env*` files are strictly included in `.gitignore`, with `.env.example` committed with blank values as a reference template.

---

## 7. Automated Pre-Commit Security Gate

To guarantee security policies are enforced permanently:
- **`scripts/security-check.ts`**: Runs 18 automated security verifications covering secret scanning, `.gitignore` validation, security headers (`CSP`, `HSTS`, `X-Frame-Options`), rate limit coverage, AI guardrails, and `npm audit`.
- **`.githooks/pre-commit`**: Automatically runs before every `git commit`. Commits containing hardcoded secrets or unignored environment files are rejected at the source.

