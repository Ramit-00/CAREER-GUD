'use client';

import { ChatMessage } from '@/types';
import {
  ArrowUpRight,
  Bot,
  ExternalLink,
  Maximize2,
  MessageSquare,
  Send,
  Sparkles,
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
        "Hello! I am your CARRER-GUD AI Career Counselor. I'm here to give you realistic, evidence-based guidance on 10th/12th streams, college admissions, and career futures in India. Ask me anything!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text?: string) => {
    const messageContent = text || inputValue.trim();
    if (!messageContent || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInputValue('');
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

      if (!res.ok) {
        throw new Error('Chat API returned an error');
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
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content:
            "I ran into a temporary hiccup connecting to the counselor service. Feel free to browse our [Careers Directory](/careers) or [Stream Quizzes](/quiz/post-10th) while I reconnect!",
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
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 px-5 py-3.5 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
            </span>
          </div>
          <span className="text-sm font-semibold tracking-wide">Ask Career AI</span>
        </button>
      )}

      {/* Expanded chat dialog */}
      {isOpen && (
        <div className="flex h-[560px] w-[380px] sm:w-[420px] flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-teal-50/40 px-4 py-3.5 rounded-t-3xl dark:border-slate-800 dark:from-slate-900 dark:to-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  AI Career Counselor
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                    RAG Grounded
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">Realistic • Indian System</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                title="Open full page chat"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Citations block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 max-w-[85%]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Grounded Citations:
                    </span>
                    {msg.citations.map((c, idx) => (
                      <Link
                        key={idx}
                        href={c.link || '#'}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800/80 transition"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {c.title}
                          </span>
                          {c.snippet && (
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {c.snippet}
                            </span>
                          )}
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-slate-500 text-xs dark:bg-slate-800">
                <span className="animate-spin inline-block h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full" />
                <span>Consulting knowledge base & verifying career outlooks...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (visible if conversation is short) */}
          {messages.length <= 2 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="block px-2 text-[10px] font-semibold uppercase text-slate-400 mb-1">
                Suggested questions:
              </span>
              <div className="flex flex-col gap-1">
                {SUGGESTED_QUESTIONS.slice(0, 2).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-left text-xs text-slate-700 hover:text-indigo-600 dark:text-slate-300 rounded-lg p-1.5 hover:bg-white dark:hover:bg-slate-800 transition truncate"
                  >
                    👉 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
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
                placeholder="Ask about 10th/12th streams, exams, salaries..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
