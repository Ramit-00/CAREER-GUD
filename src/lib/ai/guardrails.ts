export interface GuardrailCheckResult {
  passed: boolean;
  interceptMessage?: string;
  category?: 'DISTRESS' | 'OFF_TOPIC_ROMANTIC' | 'MEDICAL_ADVICE';
}

const DISTRESS_PATTERNS = [
  /\b(kill myself|suicide|end my life|want to die|hurt myself|self harm|hopeless|depressed to death)\b/i,
  /\b(no reason to live|giving up on life|hate myself completely)\b/i,
];

const INAPPROPRIATE_PATTERNS = [
  /\b(be my girlfriend|be my boyfriend|flirt with me|kiss me|love you intimately|sexy)\b/i,
  /\b(roleplay romance|dating advice)\b/i,
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

    return { passed: true };
  },
};
