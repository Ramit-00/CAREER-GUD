import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// In Vercel serverless environments, warm lambda containers freeze/thaw.
// Assigning prisma to globalForPrisma unconditionally prevents multiple client
// instances from spawning and exhausting the Supabase connection pool.
globalForPrisma.prisma = prisma;
