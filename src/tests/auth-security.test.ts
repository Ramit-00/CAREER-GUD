import assert from 'node:assert';
import test from 'node:test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test('security: non-existent email is rejected during authentication', async () => {
  const fakeEmail = 'completely-fake-user-not-in-db@career-gud.in';
  const user = await prisma.user.findUnique({
    where: { email: fakeEmail },
  });

  assert.strictEqual(user, null, 'User must not exist in database');
});

test('security: bcrypt password hashing verification works properly', async () => {
  const plainPassword = 'StudentSecret123!';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  const isWrongMatch = await bcrypt.compare('WrongPassword456!', hashedPassword);

  assert.strictEqual(isMatch, true, 'Correct password must match hash');
  assert.strictEqual(isWrongMatch, false, 'Incorrect password must be rejected');
});

test('security: admin account exists in database and password is decoupled to .env', async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const admin = await prisma.user.findFirst({
    where: {
      role: 'ADMIN',
      ...(adminEmail ? { email: adminEmail } : {}),
    },
  });

  assert.ok(admin, 'Admin account must exist in database');
  assert.strictEqual(admin.role, 'ADMIN');
  assert.strictEqual(admin.passwordHash, null, 'Admin password must not be stored in database');

  const adminPassword = process.env.ADMIN_PASSWORD;
  assert.ok(adminPassword, 'ADMIN_PASSWORD must be configured in environment');
  assert.ok(adminPassword.length >= 8, 'ADMIN_PASSWORD must be at least 8 characters');
});

test('security: admin secret key environment variable is configured', () => {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  assert.ok(secretKey, 'ADMIN_SECRET_KEY must be set in environment');
  assert.ok(secretKey.length >= 16, 'ADMIN_SECRET_KEY must be sufficiently complex');
});

test('security: unverified consultant starts in PENDING status', async () => {
  const testAdvisorEmail = `test-advisor-${Date.now()}@career-gud.in`;
  const hashedPassword = await bcrypt.hash('AdvisorPass123!', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Test Unverified Advisor',
      email: testAdvisorEmail,
      passwordHash: hashedPassword,
      role: 'CONSULTANT',
    },
  });

  const profile = await prisma.consultantProfile.create({
    data: {
      userId: user.id,
      headline: 'Candidate Counselor',
      bio: 'Testing pending status gate',
      experienceYears: 4,
      highestEducation: 'M.Ed',
      almaMater: 'Delhi University',
      currentRole: 'Counselor',
      phone: '+91 99999 88888',
      feePerSessionINR: 800,
      verificationStatus: 'PENDING',
    },
  });

  const verif = await prisma.consultantDomainVerification.create({
    data: {
      consultantId: profile.id,
      domain: 'COMMERCE',
      status: 'PENDING',
      proofDescription: 'Pending audit verification proof document',
    },
  });

  assert.strictEqual(profile.verificationStatus, 'PENDING');
  assert.strictEqual(verif.status, 'PENDING');

  // Verify that querying only verified consultants does NOT include this applicant
  const verifiedConsultants = await prisma.consultantProfile.findMany({
    where: {
      verifications: {
        some: { status: 'VERIFIED' },
      },
    },
  });

  const foundPending = verifiedConsultants.some((c) => c.id === profile.id);
  assert.strictEqual(foundPending, false, 'Pending consultant must NOT appear in verified list');

  // Now simulate Admin approval
  await prisma.consultantDomainVerification.update({
    where: {
      consultantId_domain: {
        consultantId: profile.id,
        domain: 'COMMERCE',
      },
    },
    data: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
    },
  });

  await prisma.consultantProfile.update({
    where: { id: profile.id },
    data: { verificationStatus: 'VERIFIED' },
  });

  // Check verified list again
  const approvedConsultants = await prisma.consultantProfile.findMany({
    where: {
      verifications: {
        some: { status: 'VERIFIED' },
      },
    },
  });

  const foundApproved = approvedConsultants.some((c) => c.id === profile.id);
  assert.strictEqual(foundApproved, true, 'Approved consultant MUST appear in verified list');

  // Clean up test records
  await prisma.consultantDomainVerification.deleteMany({ where: { consultantId: profile.id } });
  await prisma.consultantProfile.delete({ where: { id: profile.id } });
  await prisma.user.delete({ where: { id: user.id } });
});

test('security: Credentials authorize() rejects uncreated accounts', async () => {
  const { authOptions } = await import('../lib/auth/authOptions');
  const credentialsProvider = authOptions.providers.find((p: any) => p.id === 'credentials') as any;
  assert.ok(credentialsProvider, 'Credentials provider must exist in authOptions');

  const authorizeFn = credentialsProvider.options?.authorize || credentialsProvider.authorize;
  assert.ok(authorizeFn, 'authorize function must exist');

  await assert.rejects(
    async () => {
      await authorizeFn({
        email: 'unregistered-student@nowhere.com',
        password: 'Password123!',
      });
    },
    {
      message: 'No account found with this email. Please create an account first.',
    },
    'Must throw No account found error for unregistered emails'
  );
});

test('security: Admin authentication requires ADMIN_PASSWORD from .env and valid master secret key', async () => {
  const { authOptions } = await import('../lib/auth/authOptions');
  const credentialsProvider = authOptions.providers.find((p: any) => p.id === 'credentials') as any;
  const authorizeFn = credentialsProvider.options?.authorize || credentialsProvider.authorize;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'dummy_password';
  const secretKey = process.env.ADMIN_SECRET_KEY || 'dummy_key';

  // 1. Wrong password must be rejected
  await assert.rejects(
    async () => {
      await authorizeFn({
        email: adminEmail,
        password: 'wrong_password_attempt',
        adminSecretKey: secretKey,
      });
    },
    {
      message: 'Incorrect admin credentials. Please verify your password.',
    }
  );

  // 2. Missing/wrong secret key must be rejected
  await assert.rejects(
    async () => {
      await authorizeFn({
        email: adminEmail,
        password: adminPass,
        adminSecretKey: 'wrong_key',
      });
    },
    {
      message:
        'Unauthorized: Administrative logins must be executed through the secure Admin Portal with a valid Master Security Key.',
    }
  );

  // 3. Correct credentials from environment must succeed
  const authUser = await authorizeFn({
    email: adminEmail,
    password: adminPass,
    adminSecretKey: secretKey,
  });

  assert.ok(authUser, 'Admin must authenticate successfully');
  assert.strictEqual(authUser.role, 'ADMIN');
});

test('security: Google OAuth signIn callback blocks uncreated accounts when not registering', async () => {
  const { authOptions } = await import('../lib/auth/authOptions');
  const signInCallback = authOptions.callbacks?.signIn;
  assert.ok(signInCallback, 'signIn callback must exist');

  const randomUnregisteredEmail = `unregistered-${Date.now()}@gmail.com`;

  // Simulate Google sign-in attempt from /login
  const result = await (signInCallback as any)({
    user: { email: randomUnregisteredEmail, name: 'Random User' },
    account: { provider: 'google' },
  });

  assert.strictEqual(
    typeof result,
    'string',
    'Sign in must return a redirect URL when account does not exist'
  );
  assert.ok(
    (result as string).includes('/register?error=NoAccountFound'),
    'Redirect URL must send user to /register with NoAccountFound error'
  );

  // Verify the user was NOT created in the database
  const user = await prisma.user.findUnique({
    where: { email: randomUnregisteredEmail },
  });
  assert.strictEqual(user, null, 'Unregistered user must NOT be provisioned in database during login');
});

test('student: dynamic profile customization with custom marks and aboutMe in Supabase', async () => {
  const testStudentEmail = `test-student-${Date.now()}@career-gud.in`;
  const student = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: testStudentEmail,
      role: 'STUDENT',
    },
  });

  const profile = await prisma.studentProfile.create({
    data: {
      userId: student.id,
      aboutMe: 'Aspiring Aerospace Engineer aiming for IIT Bombay and ISRO internships.',
      currentClass: 'CLASS_12',
      board: 'ICSE / ISC',
      currentStream: 'SCIENCE_PCM',
      tenthPercentage: 94.6,
      twelfthPercentage: 91.2,
      previousClassPercentage: 93.0,
      interests: ['Aerodynamics', 'Orbital Mechanics', 'Robotics'],
      strengths: ['Calculus', 'Physics Problem Solving'],
    },
  });

  assert.ok(profile.id, 'Profile must be created in Supabase');
  assert.strictEqual(profile.aboutMe, 'Aspiring Aerospace Engineer aiming for IIT Bombay and ISRO internships.');
  assert.strictEqual(profile.tenthPercentage, 94.6);
  assert.strictEqual(profile.twelfthPercentage, 91.2);
  assert.strictEqual(profile.board, 'ICSE / ISC');
  assert.strictEqual(profile.currentClass, 'CLASS_12');

  // Verify read query via Prisma
  const fetched = await prisma.user.findUnique({
    where: { id: student.id },
    include: { studentProfile: true },
  });

  assert.strictEqual(fetched?.studentProfile?.tenthPercentage, 94.6);
  assert.strictEqual(fetched?.studentProfile?.aboutMe, 'Aspiring Aerospace Engineer aiming for IIT Bombay and ISRO internships.');

  // Clean up
  await prisma.studentProfile.delete({ where: { id: profile.id } });
  await prisma.user.delete({ where: { id: student.id } });
});

test('admin: admin can query all registered students and their academic records from Supabase', async () => {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { studentProfile: true, _count: { select: { quizAttempts: true, studentBookings: true } } },
  });

  assert.ok(Array.isArray(students), 'Admin query must return an array of students');
});

test('admin hub: admin can approve and verify an advisor application in Supabase', async () => {
  const testAdvisorEmail = `admin-hub-test-${Date.now()}@career-gud.in`;
  const hashedPassword = await bcrypt.hash('AdvisorPass123!', 10);

  const advisorUser = await prisma.user.create({
    data: {
      name: 'Dr. Hub Review Candidate',
      email: testAdvisorEmail,
      passwordHash: hashedPassword,
      role: 'CONSULTANT',
    },
  });

  const profile = await prisma.consultantProfile.create({
    data: {
      userId: advisorUser.id,
      headline: 'Candidate for Verification',
      bio: 'Testing Admin Hub verification pipeline',
      experienceYears: 7,
      highestEducation: 'Ph.D in Psychology',
      almaMater: 'NIMHANS',
      currentRole: 'Senior Counselor',
      phone: '+91 91111 22222',
      feePerSessionINR: 1500,
      verificationStatus: 'PENDING',
    },
  });

  assert.strictEqual(profile.verificationStatus, 'PENDING', 'Initial status must be PENDING');

  // Admin Hub Approves Application:
  const updatedProfile = await prisma.consultantProfile.update({
    where: { id: profile.id },
    data: { verificationStatus: 'VERIFIED' },
  });

  assert.strictEqual(updatedProfile.verificationStatus, 'VERIFIED', 'Status must now be VERIFIED');

  // Clean up
  await prisma.consultantProfile.delete({ where: { id: profile.id } });
  await prisma.user.delete({ where: { id: advisorUser.id } });
});

test('bookmarks: student can save career to Supabase PostgreSQL and query it', async () => {
  const testStudentEmail = `bookmark-student-${Date.now()}@career-gud.in`;
  const hashedPassword = await bcrypt.hash('Student123!', 10);

  const student = await prisma.user.create({
    data: {
      name: 'Bookmark Testing Student',
      email: testStudentEmail,
      passwordHash: hashedPassword,
      role: 'STUDENT',
      studentProfile: {
        create: {
          currentClass: 'CLASS_12',
          savedCareers: ['fullstack-software-engineer'],
          savedColleges: ['iit-bombay'],
        },
      },
      bookmarks: {
        create: [
          {
            itemType: 'CAREER',
            itemSlug: 'fullstack-software-engineer',
            title: 'Full Stack Software Engineer',
            subtitle: 'Science (PCM)',
          },
          {
            itemType: 'COLLEGE',
            itemSlug: 'iit-bombay',
            title: 'IIT Bombay',
            subtitle: 'Mumbai, Maharashtra',
          },
        ],
      },
    },
    include: {
      studentProfile: true,
      bookmarks: true,
    },
  });

  assert.ok(student.id, 'Student must be created in Supabase');
  assert.strictEqual(student.bookmarks.length, 2, 'Must have 2 bookmarks in Supabase');
  assert.strictEqual(student.studentProfile?.savedCareers[0], 'fullstack-software-engineer');
  assert.strictEqual(student.studentProfile?.savedColleges[0], 'iit-bombay');

  // Verify direct Supabase query
  const queriedBookmarks = await prisma.userBookmark.findMany({
    where: { userId: student.id },
  });

  const careerBookmark = queriedBookmarks.find((b) => b.itemType === 'CAREER');
  assert.ok(careerBookmark, 'Career bookmark must exist');
  assert.strictEqual(careerBookmark.itemSlug, 'fullstack-software-engineer');
  assert.strictEqual(careerBookmark.title, 'Full Stack Software Engineer');

  // Test unsave / delete bookmark in Supabase
  await prisma.userBookmark.delete({
    where: { id: careerBookmark.id },
  });

  const remaining = await prisma.userBookmark.findMany({
    where: { userId: student.id },
  });
  assert.strictEqual(remaining.length, 1, 'Only college bookmark must remain after unsaving career');
  assert.strictEqual(remaining[0].itemType, 'COLLEGE');

  // Clean up
  await prisma.userBookmark.deleteMany({ where: { userId: student.id } });
  await prisma.studentProfile.deleteMany({ where: { userId: student.id } });
  await prisma.user.delete({ where: { id: student.id } });
});

test('bookmarks: any user role (admin/advisor) can save and query bookmarks in Supabase', async () => {
  const testAdvisorEmail = `advisor-bookmark-${Date.now()}@career-gud.in`;
  const advisor = await prisma.user.create({
    data: {
      name: 'Advisor Bookmark Tester',
      email: testAdvisorEmail,
      role: 'CONSULTANT',
      bookmarks: {
        create: {
          itemType: 'CAREER',
          itemSlug: 'ai-ml-engineer',
          title: 'AI and Machine Learning Engineer',
          subtitle: 'Science (PCM)',
        },
      },
    },
    include: { bookmarks: true },
  });

  assert.strictEqual(advisor.bookmarks.length, 1);
  assert.strictEqual(advisor.bookmarks[0].itemSlug, 'ai-ml-engineer');

  // Clean up
  await prisma.userBookmark.deleteMany({ where: { userId: advisor.id } });
  await prisma.user.delete({ where: { id: advisor.id } });
});



