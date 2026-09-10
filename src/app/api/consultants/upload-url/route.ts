import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
  ]),
  fileSize: z.number().max(10 * 1024 * 1024).optional(), // 10MB limit
  domain: z.enum(['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to upload credentials' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const parsed = UploadRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid upload request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { filename, contentType, domain } = parsed.data;

    // Sanitize filename to prevent directory traversal or malicious characters
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();

    const uniqueKey = `proofs/${token.id}/${domain || 'general'}-${Date.now()}-${sanitizedFilename}`;

    // Target Supabase Storage bucket: "consultant-proofs"
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let uploadUrl = `/api/consultants/upload-direct?key=${encodeURIComponent(uniqueKey)}`;
    const fileUrl = `${supabaseUrl || 'https://storage.career-gud.in'}/storage/v1/object/public/consultant-proofs/${uniqueKey}`;

    // If Supabase Storage credentials exist, generate direct signed upload URL
    if (supabaseUrl && supabaseKey) {
      try {
        const signRes = await fetch(
          `${supabaseUrl}/storage/v1/object/upload/sign/consultant-proofs/${uniqueKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
            },
            body: JSON.stringify({ expiresIn: 900 }), // 15 mins
          }
        );

        if (signRes.ok) {
          const signData = await signRes.json();
          if (signData?.url) {
            uploadUrl = `${supabaseUrl}/storage/v1${signData.url}`;
          }
        }
      } catch (signErr) {
        console.warn('Supabase presigned URL generation fallback:', signErr);
      }
    }

    return NextResponse.json({
      uploadUrl,
      fileUrl,
      fileKey: uniqueKey,
      contentType,
      maxSizeBytes: 10 * 1024 * 1024,
      expiresInSeconds: 900,
    });
  } catch (err) {
    console.error('API /api/consultants/upload-url error:', err);
    return NextResponse.json(
      { error: 'Failed to generate presigned upload URL' },
      { status: 500 }
    );
  }
}
