import { ChatWidget } from '@/components/chat/ChatWidget';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/providers/AuthProvider';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'CAREER-GUD | AI Career Guidance & Stream Selection Platform for Indian Students',
  description:
    'Realistic, evidence-based academic counseling for Class 10 & 12 students in India. Discover streams (PCM, PCB, Commerce, Arts), explore 30+ future career outlooks with AI automation risk, and connect with verified domain consultants.',
  keywords: [
    'career guidance India',
    'class 10 stream selection',
    'pcm vs pcb',
    'commerce with maths',
    'jee vs neet',
    'career counselor',
    'college directory NIRF',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <AuthProvider>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ChatWidget />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
