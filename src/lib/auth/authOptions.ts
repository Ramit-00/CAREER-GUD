import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'student@career-gud.in' },
        password: { label: 'Password', type: 'password' },
        adminSecretKey: { label: 'Admin Security Key', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Strictly query Supabase PostgreSQL database via Prisma
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { consultantProfile: true },
        });

        // 2. If the user does not exist in database, reject authentication
        if (!user) {
          throw new Error('No account found with this email. Please create an account first.');
        }

        // 3. High-security check for Administrator role with timing-safe comparison
        if (user.role === 'ADMIN') {
          const expectedSecret = process.env.ADMIN_SECRET_KEY;
          if (!expectedSecret || !credentials.adminSecretKey) {
            throw new Error(
              'Unauthorized: Administrative logins must be executed through the secure Admin Portal with a valid Master Security Key.'
            );
          }
          const expectedBuf = Buffer.from(expectedSecret);
          const actualBuf = Buffer.from(credentials.adminSecretKey);
          if (
            expectedBuf.length !== actualBuf.length ||
            !crypto.timingSafeEqual(expectedBuf, actualBuf)
          ) {
            throw new Error(
              'Unauthorized: Administrative logins must be executed through the secure Admin Portal with a valid Master Security Key.'
            );
          }

          // Admin password is authenticated directly against process.env.ADMIN_PASSWORD (never stored in database)
          const expectedAdminPassword = process.env.ADMIN_PASSWORD;
          if (!expectedAdminPassword || !credentials.password) {
            throw new Error('Incorrect admin credentials. Please verify your password.');
          }
          const expPassBuf = Buffer.from(expectedAdminPassword);
          const actPassBuf = Buffer.from(credentials.password);
          if (
            expPassBuf.length !== actPassBuf.length ||
            !crypto.timingSafeEqual(expPassBuf, actPassBuf)
          ) {
            throw new Error('Incorrect admin credentials. Please verify your password.');
          }
        } else {
          // 4. Secure password comparison via bcrypt for standard users (students, consultants)
          let passwordValid = false;
          if (user.passwordHash) {
            passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);
          }

          if (!passwordValid) {
            throw new Error('Incorrect password. Please verify your credentials.');
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          verificationStatus: user.consultantProfile?.verificationStatus || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const normalizedEmail = user.email.toLowerCase().trim();
          let dbUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          // Block OAuth logins into administrative accounts
          if (dbUser && dbUser.role === 'ADMIN') {
            console.warn(`Blocked Google OAuth login attempt for administrative account: ${normalizedEmail}`);
            return '/admin/portal-login?error=OAuthNotAllowedForAdmin';
          }

          // Check if this action was explicitly initiated from /register
          let isRegisterAction = false;
          try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            isRegisterAction = cookieStore.get('auth_action')?.value === 'register';
          } catch {
            isRegisterAction = false;
          }

          // STRICT CHECK: If user does NOT exist in the database
          if (!dbUser) {
            // If the user did NOT explicitly initiate account registration, BLOCK SIGN-IN!
            if (!isRegisterAction) {
              return `/register?error=NoAccountFound&email=${encodeURIComponent(normalizedEmail)}`;
            }

            // ONLY if initiated from /register: create the new student account in Supabase
            dbUser = await prisma.user.create({
              data: {
                name: user.name || 'Student',
                email: normalizedEmail,
                role: 'STUDENT',
                image: user.image || undefined,
              },
            });

            // Initialize default student profile
            await prisma.studentProfile.create({
              data: {
                userId: dbUser.id,
                currentClass: 'CLASS_10',
                board: 'CBSE',
                interests: [],
                strengths: [],
                savedCareers: [],
                savedColleges: [],
              },
            });
          }

          (user as unknown as { id: string; role: string }).id = dbUser.id;
          (user as unknown as { id: string; role: string }).role = dbUser.role;
        } catch (err) {
          console.error('Error in Google OAuth sign-in flow:', err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role || 'STUDENT';
        token.verificationStatus = (
          user as unknown as { verificationStatus?: string }
        ).verificationStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: string }).role = (token.role as string) || 'STUDENT';
        (session.user as unknown as { verificationStatus?: string }).verificationStatus =
          token.verificationStatus as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: getJwtSecret(),
};
