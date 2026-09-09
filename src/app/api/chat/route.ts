import { aiProvider } from '@/lib/ai/provider';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(3000),
});

const ChatBodySchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(25),
  userProfile: z
    .object({
      currentClass: z.string().optional(),
      stream: z.string().optional(),
      tenthScore: z.number().optional(),
      twelfthScore: z.number().optional(),
      interests: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = ChatBodySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid message request payload', details: parsed.error.format() }, { status: 400 });
    }

    const response = await aiProvider.generateResponse(parsed.data);

    return NextResponse.json(response);
  } catch (error) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process career counselor request' },
      { status: 500 }
    );
  }
}
