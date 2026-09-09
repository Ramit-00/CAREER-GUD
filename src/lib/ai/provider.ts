import { aiGuardrails } from './guardrails';
import { ragRetriever } from './rag';

export interface ChatCompletionRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  userProfile?: {
    currentClass?: string;
    stream?: string;
    tenthScore?: number;
    twelfthScore?: number;
    interests?: string[];
  };
}

export interface ChatCompletionResponse {
  reply: string;
  citations: Array<{
    type: 'CAREER' | 'COLLEGE' | 'EXAM' | 'STREAM';
    title: string;
    link?: string;
    snippet?: string;
  }>;
  provider: 'gemini' | 'anthropic' | 'openai' | 'local_heuristic';
}

export const aiProvider = {
  async generateResponse(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Sanitize client-provided messages: strictly enforce user/assistant roles
    const safeMessages = (req.messages || [])
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content).slice(0, 3000),
      }));

    const lastUserMessage = [...safeMessages].reverse().find((m) => m.role === 'user')?.content || '';

    // Step 1: Safety & Guardrails evaluation
    const guardrailResult = aiGuardrails.evaluateMessage(lastUserMessage);
    if (!guardrailResult.passed && guardrailResult.interceptMessage) {
      return {
        reply: guardrailResult.interceptMessage,
        citations: [],
        provider: 'local_heuristic',
      };
    }

    // Step 2: RAG Context Retrieval
    const ragResult = ragRetriever.retrieveContext(lastUserMessage);

    // Step 3: Check for Google Gemini API Key
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.trim().length > 0) {
      const candidateModels = [
        process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        'gemini-3.5-flash-lite',
      ];

      const systemPrompt = `You are CAREER-GUD's senior academic & career counselor for Indian high school & college students.
CORE PRINCIPLE: "Be Realistic, Not Idealistic".
- Never give generic blind encouragement. If a student's marks or goals face extreme competitive friction (e.g., wanting JEE Advanced with low 10th marks), explain what bridge effort it genuinely takes.
- Ground your answers in the following verified platform knowledge base:
${ragResult.groundingContext}
- Never hallucinate non-existent Indian colleges or fake salary figures.
- Emphasize trade-offs, entrance exams (JEE, NEET, CUET, CLAT), and 5-10 year career outlooks (including AI automation exposure).
- Maintain an encouraging yet grounded, protective tone for young students.`;

      for (const model of candidateModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': geminiKey.trim(),
              },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: safeMessages.map((m) => ({
                  role: m.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: m.content }],
                })),
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 1200,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return {
                reply,
                citations: ragResult.citations,
                provider: 'gemini',
              };
            }
          }
        } catch (err) {
          console.warn(`Gemini model ${model} request failed:`, err);
        }
      }
    }

    // Step 4: Check for Anthropic API Key
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey && anthropicKey.trim().length > 0) {
      try {
        const systemPrompt = `You are CAREER-GUD's senior career counselor for Indian high school & college students.
CORE PRINCIPLE: "Be Realistic, Not Idealistic".
- Never give generic blind encouragement. If a student's marks or goals face extreme competitive friction (e.g., wanting JEE Advanced with low 10th marks), explain what bridge effort it genuinely takes.
- Ground your answers in the following verified platform knowledge base:
${ragResult.groundingContext}
- Never hallucinate non-existent Indian colleges or fake salary figures.
- Emphasize trade-offs, entrance exams (JEE, NEET, CUET, CLAT), and 5-10 year career outlooks (including AI automation exposure).
- Maintain an encouraging yet grounded, protective tone for young students.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: process.env.LLM_MODEL || 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            system: systemPrompt,
            messages: safeMessages.map((m) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.content?.[0]?.text;
          if (reply) {
            return {
              reply,
              citations: ragResult.citations,
              provider: 'anthropic',
            };
          }
        }
      } catch (err) {
        console.warn('Anthropic API request failed, falling back to local counselor engine:', err);
      }
    }

    // Step 4: Check for OpenAI API Key
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.trim().length > 0) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: process.env.LLM_MODEL || 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are CAREER-GUD's AI Career Counselor for Indian students. Be realistic, not idealistic. Ground facts in: ${ragResult.groundingContext}`,
              },
              ...safeMessages,
            ],
            temperature: 0.6,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return {
              reply,
              citations: ragResult.citations,
              provider: 'openai',
            };
          }
        }
      } catch (err) {
        console.warn('OpenAI API request failed, falling back to local counselor engine:', err);
      }
    }

    // Step 5: Local Heuristic Counselor Engine (Zero-key graceful degradation)
    const reply = generateLocalHeuristicCounselorReply(lastUserMessage, ragResult.groundingContext, req.userProfile);

    return {
      reply,
      citations: ragResult.citations,
      provider: 'local_heuristic',
    };
  },
};

function generateLocalHeuristicCounselorReply(
  userQuery: string,
  _groundingContext?: string,
  _profile?: ChatCompletionRequest['userProfile']
): string {
  const q = userQuery.toLowerCase();

  if (q.includes('10th') || q.includes('stream') || q.includes('pcm') || q.includes('pcb') || q.includes('commerce') || q.includes('arts')) {
    return `### Realistic Stream Guidance for Class 10:

In the Indian educational board system (CBSE/ICSE/State), choosing your +1/+2 stream is one of your most foundational decisions. Here is an honest, evidence-based breakdown:

1. **Science: Non-Medical (PCM - Physics, Chemistry, Maths)**:
   - **Prerequisite Reality**: If your 10th Math score is above 75-80%, you have a good baseline. Be aware that Class 11 coordinate geometry, calculus, and rotational mechanics move at 4x the speed of Class 10.
   - **Pathways**: Opens B.Tech (Computer Science, Electronics, Mechanical), B.Arch (Architecture), Commercial Pilot training (CPL), and NDA (Air Force/Navy).

2. **Science: Medical (PCB - Physics, Chemistry, Biology)**:
   - **Prerequisite Reality**: Over 23 lakh students compete for ~55,000 government MBBS seats in NEET-UG (approx. 2.4% selection rate). Physics is notoriously the rank-deciding paper.
   - **Pathways**: MBBS, BDS, BAMS, Veterinary Science, Clinical Research, and Biotechnology.

3. **Commerce (with or without Maths)**:
   - **Prerequisite Reality**: If you aim for top-tier Investment Banking, SRCC, or Actuarial Science, taking Mathematics alongside Accountancy & Economics is strongly recommended.
   - **Pathways**: Chartered Accountancy (CA), B.Com (Hons), CFA, Management Consulting, and Integrated MBA (IPM).

4. **Arts & Humanities**:
   - **Prerequisite Reality**: Excellent for students who excel in analytical reading, policy, and critical writing.
   - **Pathways**: Corporate Law (via CLAT for National Law Universities), UX & Digital Product Design (via UCEED/NID), Civil Services (UPSC), and Clinical Psychology.

> **Advice**: Take our **[Post-10th Stream Discovery Quiz](/quiz/post-10th)** to get a personalized score radar and reality-check analysis tailored to your exact marks!`;
  }

  if (q.includes('computer science') || q.includes('btech') || q.includes('software') || q.includes('ai') || q.includes('engineer')) {
    return `### Software & AI Engineering: Reality & 5-10 Year Outlook in India

Computer Science remains India's most sought-after engineering discipline, but the landscape is shifting dramatically due to AI automation:

- **What CS Students Do Day-to-Day**:
  Beyond basic syntax, modern software engineering involves distributed backend architecture, cloud scalability (AWS/GCP), API security, and machine learning pipeline optimization.
- **AI Automation Risk (38% Exposure)**:
  Routine boilerplate coding (basic HTML/CSS or standard CRUD endpoints) is being automated by AI coding assistants. However, **system design, cloud resilience, data architecture, and domain logic are thriving**.
- **Salary Trajectory in India**:
  - **Entry (0-2 Yrs)**: ₹6 - 15 LPA (Tier-1 campus placements can reach ₹20 - 45 LPA).
  - **Mid-Level (3-6 Yrs)**: ₹18 - 35 LPA.
  - **Senior / Lead (7+ Yrs)**: ₹45 - 90+ LPA.
- **Top Indian Entrance Exams**:
  - **JEE Main & JEE Advanced** (for IITs, NITs, IIITs)
  - **BITSAT** (BITS Pilani, Goa, Hyderabad)
  - **VITEEE, MET, State CETs**

Explore the full profile on our **[AI & Machine Learning Engineer Profile](/careers/ai-ml-engineer)** or **[IIT Bombay CSE Program](/colleges/iit-bombay)**!`;
  }

  if (q.includes('doctor') || q.includes('mbbs') || q.includes('medical') || q.includes('neet') || q.includes('biology')) {
    return `### Medical (MBBS) & Healthcare Pathway: Honest Facts

Becoming a doctor in India carries immense prestige, but students must enter with full awareness of the timeline and competition:

- **The NEET-UG Reality**:
  - Over 23 lakh students appear annually for ~1.05 lakh total seats (of which only ~55,000 are in government medical colleges).
  - Scoring below 610/720 makes securing a government seat difficult in the General category.
  - Private medical college management seats cost between ₹65 Lakhs and ₹1.2 Crore.
- **Timeline & Gestation**:
  - 4.5 Years academic MBBS + 1 Year compulsory rotatory internship.
  - Followed by NEET-PG / NEXT for 3 years of MD/MS specialty residency. Total time to establish independent practice is typically 8 to 10 years.
- **Automation Exposure (8% - Negligible)**:
  Clinical judgment, diagnostic intuition, emergency triage, and surgical dexterity cannot be replaced by AI.
- **Alternative High-Reward Biology Pathways**:
  If clinical hospital rounds are not for you, explore **Biomedical & Genomic Research (BS-MS at IISER)**, **Bioinformatics**, or **Clinical Psychology**.`;
  }

  if (q.includes('ca') || q.includes('chartered accountant') || q.includes('investment banking') || q.includes('finance')) {
    return `### Commerce, Chartered Accountancy & Finance: What You Need to Know

Commerce is often misunderstood as a "backup option", but in reality, it powers some of the highest-paying and most influential careers in corporate India:

- **Chartered Accountant (CA)**:
  - Governed by ICAI; statutory monopoly on auditing company financial statements.
  - Pass rates for CA Final range from 8% to 18%. It requires exceptional self-discipline during the mandatory 2-year corporate articleship.
  - Average campus placement package: ₹8 - 14 LPA; top rankers reach ₹22+ LPA.
- **Investment Banking & Corporate Finance**:
  - Highly lucrative (Entry: ₹14 - 25 LPA; Senior: ₹1 - 3+ Cr PA with performance bonuses).
  - Requires strong quantitative modeling (DCF, valuations) and stamina for 70+ hour workweeks during deal execution.
  - Key feeders: SRCC, IIM Indore (IPM), IIT + IIM dual backgrounds.`;
  }

  // Default intelligent counseling response
  return `### Hello! I am your CAREER-GUD Academic & Career Counselor.

I am here to give you honest, realistic guidance on academic decisions in India without sugarcoating the challenges.

**Here are key things we can explore together:**
1. **Class 10 Stream Decision**: Comparing **PCM vs. PCB vs. Commerce vs. Arts** based on your natural aptitude and realistic math/science comfort.
2. **Class 12 Degree Selection**: Evaluating **B.Tech, MBBS, B.Arch, CA, Law (CLAT), Design (UCEED), and Pilot training**.
3. **Future Outlook & Automation Risk**: Real salary ranges in INR, day-to-day work realities, and how AI is impacting specific careers.
4. **Entrance Exam Realities**: Realistic cutoff percentiles for **JEE, NEET, CUET, CLAT, and IPMAT**.

Tell me a bit about your current class, your favourite or most challenging subjects, and what careers you are curious about!`;
}
