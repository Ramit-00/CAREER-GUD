'use client';

import { sanitizeSafeUrl } from '@/lib/utils/urlSanitizer';
import { ChatMessage } from '@/types';
import {
  ArrowUpRight,
  Compass,
  Maximize2,
  Send,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const SUGGESTED_QUESTIONS = [
  'Should I pick PCM, PCB or Commerce after 10th?',
  'What is the real future & salary of Computer Science in India?',
  'Is NEET-UG realistic if my 10th Science is 78%?',
  'What does a Chartered Accountant (CA) earn in India?',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content:
        "Hello! I am your CAREER-GUD AI Career Counselor. I'm here to give you realistic, evidence-based guidance on 10th/12th streams, college admissions, and career futures in India. Ask me anything!",
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
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight <= 100;
  };

  useEffect(() => {
    if (!isOpen) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (chatContainerRef.current && (isNearBottomRef.current || loading)) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, isOpen, loading]);

  const handleSendMessage = async (text?: string) => {
    const messageContent = text || inputValue.trim();
    if (!messageContent || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    isNearBottomRef.current = true;
    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInputValue('');
    setLoading(true);

    try {
      const safeHistory = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome_1' && m.id !== 'init_msg' && !m.id.startsWith('bot_err_') && m.content.trim().length > 0)
        .slice(-20)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, 8000),
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
        throw new Error(errorData.error || `Chat API returned status ${res.status}`);
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
            err?.message && !err.message.includes('status')
              ? `Note: ${err.message}. Please feel free to try again or browse our [Careers Directory](/careers).`
              : "I ran into a temporary hiccup connecting to the counselor service. Feel free to browse our [Careers Directory](/careers) or [Stream Quizzes](/quiz/post-10th) while I reconnect!",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-2xl bg-[#0B2A4A] px-5 py-3.5 text-white shadow-xl hover:bg-[#071C33] transition-all border-2 border-amber-400/40"
        >
          <Compass className="h-5 w-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-black tracking-wide">Academic Counselor</span>
        </button>
      )}

      {/* Expanded chat dialog */}
      {isOpen && (
        <div className="flex h-[560px] w-[360px] sm:w-[420px] flex-col rounded-2xl border-2 border-slate-300 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 bg-slate-100 px-4 py-3 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B2A4A] text-white shadow-xs">
                <Compass className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0B2A4A] flex items-center gap-1.5">
                  Academic Counseling
                  <span className="rounded-md border border-amber-300 bg-[#FFF8EE] px-1.5 py-0.5 text-[10px] font-black text-[#D96B00]">
                    NIRF Grounded
                  </span>
                </h3>
                <p className="text-[11px] text-slate-700 font-semibold">Grounded Secondary Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                title="Open full page console"
                className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-200"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm leading-relaxed"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#0B2A4A] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-slate-100 text-slate-950 border border-slate-200 rounded-bl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Citations block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-1.5 flex flex-col gap-1 max-w-[85%]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                      Grounded References:
                    </span>
                    {msg.citations.map((c, idx) => (
                      <Link
                        key={idx}
                        href={sanitizeSafeUrl(c.link)}
                        className="flex items-center justify-between gap-2 rounded-lg border-2 border-slate-200 bg-white p-2 text-xs hover:bg-slate-100 hover:border-slate-300 transition shadow-xs"
                      >
                        <span className="font-bold text-[#0B2A4A] truncate">
                          {c.title}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#D96B00] shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-2.5 text-slate-800 text-xs font-semibold">
                <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-[#0B2A4A] border-t-transparent rounded-full" />
                <span>Consulting verified regulatory datasets...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts (visible if conversation is short) */}
          {messages.length <= 2 && (
            <div className="border-t-2 border-slate-200 bg-slate-50 p-2.5">
              <span className="block px-1 text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">
                Suggested inquiries:
              </span>
              <div className="flex flex-col gap-1">
                {SUGGESTED_QUESTIONS.slice(0, 2).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-left text-xs font-semibold text-slate-800 hover:text-[#0B2A4A] rounded p-1 hover:bg-slate-200 transition truncate"
                  >
                    • {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="border-t-2 border-slate-200 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={3000}
                placeholder="Ask regarding streams, cutoffs, or programs..."
                className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none shadow-xs"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B2A4A] text-white hover:bg-[#071C33] disabled:opacity-40 transition shadow-xs"
              >
                <Send className="h-4 w-4 text-amber-400" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
