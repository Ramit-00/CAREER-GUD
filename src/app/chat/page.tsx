'use client';

import { ChatMessage } from '@/types';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Compass,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
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
      content: `### Welcome to CARRER-GUD's AI Career Counselor

I am grounded directly in verified Indian educational data, NIRF college placement metrics, and future career outlooks.

**How I can guide you today:**
1. **Class 10 Stream Decider**: Evaluating **PCM vs. PCB vs. Commerce vs. Arts** based on your realistic marks.
2. **Class 12 Degree Navigator**: Comparing **B.Tech, MBBS, CA, Law (CLAT), Design (UCEED), and Commercial Flying**.
3. **Future AI Automation Exposure**: Real-world impact of AI on programming, medical diagnostics, finance, and creative industries in India.
4. **Honest Reality Checks**: Transparent facts on entrance exam competition ratios (JEE, NEET, CUET, CLAT).

Tell me about your current class, your marks, or what career field you are curious about!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        citations: data.citations,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
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
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Academic & Career Counselor
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                RAG Grounded
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Evidence-based • Indian System • Strictly Academic
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>

            {/* Citations List */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2.5 flex flex-col gap-1.5 max-w-[85%]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Grounded Platform Citations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {msg.citations.map((c, i) => (
                    <Link
                      key={i}
                      href={c.link || '#'}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400 shadow-sm"
                    >
                      <span>{c.title}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-4 text-xs text-slate-500 shadow-sm dark:bg-slate-900 dark:border-slate-800 w-fit">
            <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full" />
            <span>Consulting knowledge base and synthesizing Indian entrance statistics...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="pb-3">
          <span className="text-[11px] font-bold uppercase text-slate-400 mb-2 block">
            Suggested topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition"
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
            placeholder="Ask anything regarding 10th/12th streams, exams, cutoff percentiles, or career futures..."
            className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-5 pr-14 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-md"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="absolute right-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
