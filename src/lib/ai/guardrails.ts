export interface GuardrailCheckResult {
  passed: boolean;
  interceptMessage?: string;
  category?: 'DISTRESS' | 'OFF_TOPIC_ROMANTIC' | 'MEDICAL_ADVICE' | 'PROMPT_INJECTION';
}

const DISTRESS_PATTERNS = [
  /\b(kill myself|suicide|end my life|want to die|hurt myself|self harm|hopeless|depressed to death)\b/i,
  /\b(no reason to live|giving up on life|hate myself completely)\b/i,
];

const INAPPROPRIATE_PATTERNS = [
  /\b(be my girlfriend|be my boyfriend|flirt with me|kiss me|love you intimately|sexy)\b/i,
  /\b(roleplay romance|dating advice)\b/i,
];

const PROMPT_INJECTION_PATTERNS = [
  /\b(ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules|commands))\b/i,
  /\b(you\s+are\s+now\s+(in\s+)?(dan|developer\s+mode|unfiltered|jailbreak))\b/i,
  /\b(reveal|print|show|output|leak|expose)\s+(your\s+)?(system\s+prompt|hidden\s+prompt|instructions\s+verbatim|secret\s+key|api\s+key|env|environment\s+variables)\b/i,
  /\b(override\s+(all\s+)?system\s+(rules|prompts|instructions))\b/i,
  /\b(disregard\s+(all\s+)?(guidelines|guardrails|safety\s+filters))\b/i,
  /\b(act\s+as\s+(an\s+)?unrestricted|simulate\s+jailbroken)\b/i,
];

export const aiGuardrails = {
  evaluateMessage(message: string): GuardrailCheckResult {
    // 1. Check for emotional distress / self-harm signals
    for (const pattern of DISTRESS_PATTERNS) {
      if (pattern.test(message)) {
        return {
          passed: false,
          category: 'DISTRESS',
          interceptMessage:
            "I hear that you are going through a very heavy and overwhelming time, and your wellbeing is far more important than any exam, score, or career choice. Please know that you are not alone. Please reach out right now to a parent, teacher, or trusted adult. You can also contact Tele-MANAS (India's free 24/7 national mental health helpline) by calling 14416 or 1800-891-4416, or AASRA at +91-9820466726. People care about you and want to help.",
        };
      }
    }

    // 2. Check for inappropriate personal/romantic roleplay
    for (const pattern of INAPPROPRIATE_PATTERNS) {
      if (pattern.test(message)) {
        return {
          passed: false,
          category: 'OFF_TOPIC_ROMANTIC',
          interceptMessage:
            "I am CAREER-GUD's academic and career advisor. I'm here specifically to guide you on Class 10/12 streams, degrees, college selection, and career futures in India. Let's redirect our conversation to your education and career goals!",
        };
      }
    }

    // 3. Check for prompt injection, jailbreak, and system instruction bypass
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(message)) {
        return {
          passed: false,
          category: 'PROMPT_INJECTION',
          interceptMessage:
            "I am CAREER-GUD's dedicated academic and career advisor. I cannot override my safety instructions or disclose internal system configuration. How can I assist you with stream choices, degrees, entrance exams, or career planning today?",
        };
      }
    }

    return { passed: true };
  },

  evaluateConversation(messages: Array<{ role: string; content: string }>): GuardrailCheckResult {
    // Evaluate all user messages in reverse chronological order
    const userMessages = messages.filter((m) => m.role === 'user').reverse();
    for (const msg of userMessages) {
      const result = this.evaluateMessage(msg.content);
      if (!result.passed) {
        return result;
      }
    }
    return { passed: true };
  },

  sanitizePII(text: string): string {
    if (!text) return text;
    return text
      // Redact 12-digit Indian Aadhaar card numbers (with or without spaces/hyphens)
      .replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '[AADHAAR_REDACTED]')
      // Redact 10-digit Indian mobile numbers starting with 6, 7, 8, 9
      .replace(/(?:(?:\+?91|0)?[ -]?)(\b[6-9]\d{9}\b)/g, '[PHONE_REDACTED]')
      // Redact personal email addresses
      .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[EMAIL_REDACTED]');
  },
};
