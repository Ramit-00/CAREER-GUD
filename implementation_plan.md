# CAREER-GUD: Vercel Serverless Deployment Readiness & Feature Innovation Plan

This implementation plan translates the directives from [`CAREER_GUD_COMPREHENSIVE_ARCHITECTURAL_AUDIT_AND_ROADMAP.md`](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/CAREER_GUD_COMPREHENSIVE_ARCHITECTURAL_AUDIT_AND_ROADMAP.md) into concrete, phased architectural changes. 

> [!IMPORTANT]
> **Zero Production Deployment**: In accordance with instructions, this project will **not be deployed to Vercel during this process**. We are strictly making the codebase **100% Vercel-deployment-ready**, resolving architectural flaws, eliminating vulnerabilities, adding high-impact features, and verifying with automated test suites and production builds locally.

---

## User Review Required

> [!NOTE]
> **External Services & Keys Configuration**:
> 1. **Upstash Redis (Rate Limiting)**: We will implement distributed rate limiting supporting Upstash Redis via REST (`UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`). To ensure zero friction, we will include a seamless fallback to the in-memory sliding-window rate limiter if these keys are not set in `.env`. If you have Upstash credentials, you can provide them at any time; otherwise, local development will continue working smoothly.
> 2. **Google Gemini API Key**: The platform currently uses `GEMINI_API_KEY`. We will update model references from the invalid `'gemini-3.5-flash-lite'` to the official `'gemini-2.5-flash'` (with fallback to `'gemini-1.5-flash'`).
> 3. **Database Migration**: Schema additions include indexes, double-booking constraints, and a `meetingUrl` column. We will synchronize the database using `npx prisma db push` without losing any existing student or admin data.

---

## Proposed Changes

### Phase 1: Database & Persistence Layer Hardening (Vercel Serverless Statelessness)

#### [MODIFY] [schema.prisma](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/prisma/schema.prisma)
- Add database indexes on foreign keys and search filters:
  - `Program(collegeId)`
  - `ChatSession(userId)`
  - `ChatMessage(sessionId, createdAt)`
  - `User(role, createdAt)`
  - `StudentProfile(currentClass, currentStream)`
  - `ConsultantProfile(verificationStatus)`
- Add a composite index on `ConsultationBooking(consultantId, requestedDate, timeSlot)` to prevent double booking.
- Add `meetingUrl String?` to `ConsultationBooking` to store Jitsi video room links.
- Execute `npx prisma db push` and `npx prisma generate`.

#### [MODIFY] [prisma.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/lib/prisma.ts)
- Attach Prisma to `globalThis` unconditionally (`globalForPrisma.prisma = prisma;` in all environments) to reuse client instances during warm container execution on Vercel and prevent connection pool exhaustion.
- Add descriptive error logging for connection pool timeouts (`P2024`).

#### [MODIFY] [repository.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/lib/data/repository.ts)
- Eliminate the in-memory mutation split-brain defect:
  - Refactor `createBooking`, `updateBookingStatus`, `getBookings` to query/mutate `prisma.consultationBooking`.
  - Refactor `saveQuizAttempt`, `getQuizAttempts` to query/mutate `prisma.quizAttempt`.
  - Refactor `addReview`, `getReviews` to query/mutate `prisma.review`.
  - Refactor `applyForConsultant` to mutate `prisma.consultantProfile` and `prisma.consultantDomainVerification`.
  - Retain seed data exclusively as initial database seeding scripts or catalog read-fallbacks when the database is offline.

---

### Phase 2: Security & Edge Middleware Hardening

#### [MODIFY] [middleware.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/middleware.ts)
- Upgrade rate limiter:
  - Support Upstash Redis via REST (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`) for distributed Edge PoP rate limiting.
  - Provide an automatic in-memory sliding-window fallback if Upstash environment variables are absent.
- Fix route matcher and rules:
  - Explicitly include `'/api/reviews'` in `config.matcher` and `RATE_RULES` (closing the unrated review vulnerability).
- Add session-aware rate limits for new tools endpoints.

#### [MODIFY] [authOptions.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/lib/auth/authOptions.ts)
- Refresh token claims when `trigger === 'update'` in the NextAuth `jwt` callback, allowing dynamic advisor verification status and profile updates without requiring logout/login.
- Wrap Google OAuth user registration in `prisma.$transaction`.
- Set explicit session duration `maxAge = 7 * 24 * 60 * 60` (7 days).

---

### Phase 3: Route Handlers & Serverless Execution Hardening

#### [MODIFY] [bookings/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/consultants/bookings/route.ts)
- **Fix Critical BOLA / IDOR Bug**: Replace line 155 (`target.consultantId !== token.id`) with `target.consultant.userId === token.id || token.role === 'ADMIN'`.
- Query single booking directly via `prisma.consultationBooking.findUnique` instead of loading all bookings into memory.
- Enable student self-cancellation: allow `target.studentId === token.id && status === 'CANCELLED'`.
- Auto-generate secure private Jitsi Meet room link (`https://meet.jit.si/career-gud-session-${booking.id}`) and store in `meetingUrl` upon confirmation.

#### [MODIFY] [chat/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/chat/route.ts) & [provider.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/lib/ai/provider.ts)
- Add `export const maxDuration = 60;` for Vercel serverless execution.
- Update Gemini model from invalid `'gemini-3.5-flash-lite'` to `'gemini-2.5-flash'` with fallback to `'gemini-1.5-flash'`.
- Add streaming support via Web `ReadableStream` (SSE format) with fallback to JSON for legacy clients.
- Enforce message bounds: max 2,000 characters per message and max 10 conversation history turns.
- In `guardrails.ts`: add Indian PII masking (redacting 10-digit mobile numbers `^[6-9]\d{9}$` and 12-digit Aadhaar numbers).

#### [MODIFY] [apply/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/consultants/apply/route.ts)
- Save consultant applications and domain verifications directly to PostgreSQL using `prisma.$transaction`.

#### [MODIFY] [students/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/admin/students/route.ts)
- Implement true serverless pagination using `page`, `limit`, and `prisma.user.count()`, returning `{ students, pagination: { total, page, limit, totalPages } }`.

#### [MODIFY] [analytics/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/admin/analytics/route.ts)
- Replace in-memory queries with Prisma count aggregates (`prisma.career.count()`, `prisma.college.count()`).
- Add Vercel Edge caching headers (`Cache-Control: s-maxage=300, stale-while-revalidate=600`).

#### [MODIFY] [bookmarks/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/bookmarks/route.ts)
- Make `UserBookmark` in Supabase PostgreSQL the atomic single source of truth inside `prisma.$transaction`.

#### [MODIFY] [reviews/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/reviews/route.ts)
- Persist reviews directly to `prisma.review`. Add pagination support and check if reviewer has an existing verified consultation.

#### [MODIFY] [quiz/submit/route.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/api/quiz/submit/route.ts)
- Persist quiz submissions directly to `prisma.quizAttempt`.

---

### Phase 4: High-Impact Feature Innovations Implementation

#### [NEW] [rankData.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/lib/data/rankData.ts)
- Historical JoSAA, MCC, CLAT, CUET, and IPMAT cutoff benchmarks across categories:
  - **OPEN**, **OBC-NCL**, **EWS**, **SC**, **ST**, **PwD** and Home State quotas.
  - Percentile to AIR algorithms for JEE Main, NEET-UG, CUET, CLAT, IPMAT.

#### [NEW] [rank-estimator/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/tools/rank-estimator/page.tsx)
- **Feature 1: Indian Entrance Cutoff & Category Rank Estimator**:
  - Interactive calculator allowing students to select their exam, enter marks/percentile, category, and state.
  - Renders estimated AIR, category rank, and eligible institutions (IITs, NITs, AIIMS, GMCs, NLUs, DU).

#### [NEW] [ParentReportModal.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/components/common/ParentReportModal.tsx)
- **Feature 2: 2-Page "Parent Academic Dossier" (PDF & WhatsApp 1-Click Export)**:
  - Clean, print-styled 2-page academic report with national seal, aptitude radar chart, entrance exam reality statistics, AI automation exposure, and **5 Data-Backed Parent Discussion Prompts**.
  - 1-Click "Share with Parents via WhatsApp" button generating formatted message.
  - Integrated into `/quiz/post-10th`, `/quiz/post-12th`, and `/dashboard`.

#### [NEW] [roi-calculator/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/tools/roi-calculator/page.tsx)
- **Feature 3: Higher Education ROI & Education Loan EMI Calculator**:
  - Total degree investment vs NIRF verified median salary.
  - Break-even horizon (years to recover costs), Central Sector Interest Subsidy Scheme (CSIS) eligibility, and direct link to Ministry of Finance Vidyalakshmi Portal.

#### [NEW] [stream-pivot/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/tools/stream-pivot/page.tsx)
- **Feature 4: NEP 2020 Stream Switch & Pivot Simulator**:
  - Interactive simulator for Class 11/12 students experiencing burnout:
    - PCB to Economics/B.Com via CUET.
    - Arts/Commerce to Commercial Pilot via NIOS On-Demand Physics & Maths.
    - 5-year IPMAT at IIMs without JEE.

#### [NEW] [drop-year/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/tools/drop-year/page.tsx)
- **Feature 5: "Drop Year" Statistical Reality & Risk Diagnostic**:
  - Evaluates baseline gap, test stamina, syllabus completion, and computes statistical improvement odds vs plateau risks, recommending partial drop strategies.

#### [NEW] [tools/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/tools/page.tsx)
- Central Intelligence & Tools Hub organizing the 4 calculators and simulators into an intuitive grid.

#### [MODIFY] [Navbar.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/components/layout/Navbar.tsx)
- Add "Tools & Calculators" dropdown or navigation item linking to `/tools`, `/tools/rank-estimator`, `/tools/roi-calculator`, etc.

#### [MODIFY] [Video Consultation & Calendar Integration](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/consultants/[id]/page.tsx)
- **Feature 6: Mentor Availability & Instant Video Meet Rooms**:
  - Replace `window.alert()` with non-blocking toast.
  - On booking confirmation, display the Jitsi Meet room link and provide a **"Download .ics Calendar Invite"** button.
  - Display "Join Video Session" button on Student Dashboard (`/dashboard`) and Consultant Dashboard (`/consultant/dashboard`) for confirmed sessions.

---

### Phase 5: Frontend Experience & Alert Removal

#### [MODIFY] [post-10th/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/quiz/post-10th/page.tsx) & [post-12th/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/quiz/post-12th/page.tsx)
- Remove all `window.alert()` calls; replace with inline toast feedback.
- Save in-progress quiz answers to `sessionStorage` (`career_gud_draft_quiz`) so page refresh does not erase student work.
- Deep-link recommendations directly to `/careers?stream=...` and `/consultants?domain=...`.
- Add "Download Parent Dossier" button on results screen.

#### [MODIFY] [colleges/[slug]/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/colleges/[slug]/page.tsx), [careers/[slug]/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/careers/[slug]/page.tsx), [apply/page.tsx](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/app/consultants/apply/page.tsx)
- Replace remaining `window.alert()` instances with inline toast notifications.

#### [MODIFY] [next.config.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/next.config.ts)
- Add Vercel Edge caching configuration headers for public catalog routes.
- Add Supabase Storage remote patterns for profile avatars.

---

### Phase 6: Automated Testing & Verification Gate

#### [NEW] [serverless-features.test.ts](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/src/tests/serverless-features.test.ts)
- Automated unit test suite verifying:
  - BOLA / IDOR fix in bookings (verified consultants can update bookings; unauthorized users blocked).
  - Rank estimator calculations across OPEN and OBC-NCL categories.
  - ROI & Education loan calculator calculations.
  - Guardrail PII redaction of Indian phone numbers and Aadhaar numbers.

#### [MODIFY] [package.json](file:///c:/Users/ramit/Documents/antigravity/silly-maxwell/package.json)
- Add `"postinstall": "prisma generate"` to ensure Prisma Client is always generated on serverless builds.
- Include `serverless-features.test.ts` in `"test"` script.

---

## Verification Plan

### Automated Verification
1. **Prisma Synchronization**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
2. **Security & Regression Test Suite**:
   ```bash
   npm test
   ```
   (Must pass all 26+ tests across `engine.test.ts`, `auth-security.test.ts`, and `serverless-features.test.ts`).
3. **18-Point Security Audit**:
   ```bash
   npm run security:check
   ```
4. **Full Production Build Verification**:
   ```bash
   npm run build
   ```
5. **Combined Verification Gate**:
   ```bash
   npm run verify
   ```

### Manual Verification
1. Test Rank Estimator at `http://localhost:3000/tools/rank-estimator` with JEE Main (98 percentile, OBC-NCL) and NEET-UG (640 marks).
2. Test ROI Calculator at `http://localhost:3000/tools/roi-calculator` with standard private engineering college inputs.
3. Test Stream Pivot Simulator at `http://localhost:3000/tools/stream-pivot`.
4. Test Post-10th Quiz, verify non-blocking toast, draft saving, and open the "Parent Academic Dossier" modal to verify print preview and WhatsApp share format.
5. Test Booking confirmation flow, verify Jitsi video link generation and `.ics` calendar download.
