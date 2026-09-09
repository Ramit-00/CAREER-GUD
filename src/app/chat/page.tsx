'use client';

import { sanitizeSafeUrl } from '@/lib/utils/urlSanitizer';
import { ChatMessage } from '@/types';
import {
  ArrowUpRight,
  Compass,
  Send,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const SUGGESTED_QUESTIONS = [
  'Should I take PCM or PCB for Class 11? My 10th Math is 84% and Science is 88%.',
  'What is the real career future and salary of Computer Science vs AI Engineering in India?',
  'Can I do MBBS without taking Biology in +2?',
  'What are the entrance exams and average packages for SRCC B.Com (Hons)?',
  'How hard is the CA examination compared to B.Tech?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: `### Welcome to CAREER-GUD's AI Career Counselor

I am grounded directly in verified Indian educational data, NIRF college placement metrics, and future career outlooks.

**How I can guide you today:**
1. **Class 10 Stream Decider**: Evaluating **PCM vs. PCB vs. Commerce vs. Arts** based on your realistic marks.
2. **Class 12 Degree Navigator**: Comparing **B.Tech, MBBS, CA, Law (CLAT), Design (UCEED), and Commercial Flying**.
3. **Future AI Automation Exposure**: Real-world impact of AI on programming, medical diagnostics, finance, and creative industries in India.
4. **Honest Reality Checks**: Transparent facts on entrance exam competition ratios (JEE, NEET, CUET, CLAT).

Tell me about your current class, your marks, or what career field you are curious about!`,
      timestamp: '2025-01-01T00:00:00.000Z',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isNearBottomRef = useRef(true);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight <= 120;
  };

  useEffect(() => {
    // Prevent auto-scrolling on initial mount so users always start at the top
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only scroll inner container if user is already near bottom or waiting on loading
    if (chatContainerRef.current && (isNearBottomRef.current || loading)) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    isNearBottomRef.current = true;
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      // Exclude static UI greeting and error notices; send last 15 messages max
      const safeHistory = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome_1' && !m.id.startsWith('bot_err_') && m.content.trim().length > 0)
        .slice(-15)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, 5000),
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: safeHistory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status ${res.status}`);
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        citations: data.citations,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content:
            "I ran into a temporary connection issue with the counseling provider. Please try sending your query again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `reset_${Date.now()}`,
        role: 'assistant',
        content: 'Conversation reset. What academic or career question would you like to explore?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2A4A] text-white shadow-xs">
            <Compass className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#0B2A4A] dark:text-white flex items-center gap-2">
              Academic & Secondary Counseling Console
              <span className="rounded-lg border border-amber-300 bg-[#FFF8EE] px-2.5 py-0.5 text-xs font-black text-[#D96B00] dark:bg-blue-950 dark:text-blue-200">
                NIRF & Statutory Grounded
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Evidence-based analytics • Indian Secondary Education System • Objective Counseling
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition shadow-xs"
        >
          <Trash2 className="h-4 w-4 text-slate-500" />
          <span>Clear Console</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-6 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0B2A4A] text-white rounded-br-none shadow-xs font-medium'
                  : 'bg-white border-2 border-slate-200 text-slate-950 rounded-bl-none shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 font-normal'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>

            {/* Citations List */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2.5 flex flex-col gap-1.5 max-w-[85%]">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Institutional Citations & Knowledge Base:
                </span>
                <div className="flex flex-wrap gap-2">
                  {msg.citations.map((c, i) => (
                    <Link
                      key={i}
                      href={sanitizeSafeUrl(c.link)}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-[#FFF8EE] px-3 py-1.5 text-xs font-black text-[#D96B00] hover:bg-[#FFF2DE] dark:border-blue-900 dark:bg-blue-950/80 dark:text-blue-200 shadow-2xs"
                    >
                      <span>{c.title}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#D96B00] dark:text-blue-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 rounded-xl bg-white border-2 border-slate-200 p-4 text-xs sm:text-sm font-bold text-slate-800 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 w-fit">
            <span className="animate-spin inline-block h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span>Consulting statutory databases and entrance statistics...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 block">
            Suggested inquiry topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="rounded-xl border-2 border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 hover:border-[#0B2A4A] hover:text-[#0B2A4A] hover:bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-blue-500 transition shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={3000}
            placeholder="Inquire regarding stream choices, prerequisite checks, cutoffs, or career outlooks..."
            className="w-full rounded-xl border-2 border-slate-300 bg-white py-3.5 pl-4 pr-14 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="absolute right-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B2A4A] text-white hover:bg-[#071C33] disabled:opacity-40 transition shadow-xs"
          >
            <Send className="h-4 w-4 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
