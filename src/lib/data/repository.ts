import {
  Career,
  College,
  ConsultantDomain,
  ConsultantProfile,
  ConsultationBooking,
  QuizResult,
  Review,
  StudentProfile,
  User,
  VerificationStatus,
} from '@/types';
import { SEED_CAREERS, SEED_COLLEGES, SEED_CONSULTANTS, SEED_USERS } from './seedData';
import { prisma } from '@/lib/prisma';
import { cacheGetOrSet, cacheDelete } from '@/lib/redis';

// Global in-memory mutable store for zero-config graceful degradation
interface DataStore {
  users: (User & { password?: string })[];
  profiles: Map<string, StudentProfile>;
  careers: Career[];
  colleges: College[];
  consultants: ConsultantProfile[];
  reviews: Review[];
  bookings: ConsultationBooking[];
  quizAttempts: (QuizResult & { userId?: string })[];
}

declare global {
  // eslint-disable-next-line no-var
  var __CAREER_GUD_STORE__: DataStore | undefined;
}

function getStore(): DataStore {
  if (!global.__CAREER_GUD_STORE__) {
    const initialProfiles = new Map<string, StudentProfile>();
    initialProfiles.set('user_student_1', {
      userId: 'user_student_1',
      currentClass: 'CLASS_10',
      currentStream: null,
      board: 'CBSE',
      academicScores: {
        tenthPercentage: 84.5,
        subjectMarks: { Mathematics: 82, Science: 86, English: 88, SocialScience: 82 },
      },
      interests: ['Artificial Intelligence', 'Robotics', 'Space Sciences'],
      strengths: ['Analytical Logic', 'Curiosity', 'Persistence'],
      savedCareers: ['ai-ml-engineer', 'commercial-pilot'],
      savedColleges: ['iit-bombay', 'bits-pilani'],
    });

    const initialReviews: Review[] = [
      {
        id: 'rev_1',
        userId: 'user_student_1',
        userName: 'Aarav Patel',
        userRole: 'STUDENT',
        targetType: 'COLLEGE',
        targetId: 'col_iit_bombay',
        rating: 5,
        title: 'Unmatched peer group and coding culture',
        comment:
          'The research facilities and hackathon ecosystem at IIT Bombay are second to none in India. Placement statistics speak for themselves.',
        createdAt: '2025-01-20T14:22:00Z',
      },
      {
        id: 'rev_2',
        userId: 'user_student_1',
        userName: 'Aarav Patel',
        userRole: 'STUDENT',
        targetType: 'CAREER',
        targetId: 'car_ai_ml_engineer',
        rating: 5,
        title: 'Challenging but rewarding future trajectory',
        comment:
          'High barrier to entry with linear algebra and calculus, but the intellectual freedom and demand in India are unmatched.',
        createdAt: '2025-01-22T09:15:00Z',
      },
    ];

    const initialBookings: ConsultationBooking[] = [
      {
        id: 'book_1',
        studentId: 'user_student_1',
        studentName: 'Aarav Patel',
        studentEmail: 'student@career-gud.in',
        consultantId: 'cons_1',
        consultantName: 'Dr. Ananya Sharma',
        domain: 'MEDICAL',
        requestedDate: '2025-03-20',
        timeSlot: '17:00 - 18:00 IST',
        status: 'CONFIRMED',
        studentNotes:
          'Need honest advice on whether to take PCMB or pure PCM. I love robotics but family is encouraging NEET.',
        sharedProfileSummary: {
          currentClass: 'Class 10',
          tenthScore: 84.5,
          topInterests: ['Artificial Intelligence', 'Robotics'],
          topStrengths: ['Analytical Logic', 'Curiosity'],
        },
        createdAt: '2025-01-25T11:00:00Z',
      },
    ];

    global.__CAREER_GUD_STORE__ = {
      users: [...SEED_USERS],
      profiles: initialProfiles,
      careers: [...SEED_CAREERS],
      colleges: [...SEED_COLLEGES],
      consultants: [...SEED_CONSULTANTS],
      reviews: initialReviews,
      bookings: initialBookings,
      quizAttempts: [],
    };
  }

  return global.__CAREER_GUD_STORE__;
}

export const repository = {
  // Careers
  async getCareers(filter?: { stream?: string; search?: string }): Promise<Career[]> {
    const allCareers = await cacheGetOrSet(
      'cache:careers:all',
      async () => {
        const store = getStore();
        return store.careers;
      },
      1800
    );

    let list = allCareers;

    if (filter?.stream && filter.stream !== 'ALL') {
      list = list.filter((c) => c.streamCategory === filter.stream);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async getCareerBySlug(slug: string): Promise<Career | null> {
    return cacheGetOrSet(
      `cache:career:${slug}`,
      async () => {
        const store = getStore();
        return store.careers.find((c) => c.slug === slug) || null;
      },
      1800
    );
  },

  // Colleges
  async getColleges(filter?: { state?: string; type?: string; search?: string }): Promise<College[]> {
    const allColleges = await cacheGetOrSet(
      'cache:colleges:all',
      async () => {
        const store = getStore();
        return store.colleges;
      },
      1800
    );

    let list = allColleges;

    if (filter?.state && filter.state !== 'ALL') {
      list = list.filter((c) => c.state === filter.state);
    }

    if (filter?.type && filter.type !== 'ALL') {
      list = list.filter((c) => c.type === filter.type);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.programs.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async getCollegeBySlug(slug: string): Promise<College | null> {
    return cacheGetOrSet(
      `cache:college:${slug}`,
      async () => {
        const store = getStore();
        return store.colleges.find((c) => c.slug === slug) || null;
      },
      1800
    );
  },

  // Reviews - Database persistence with Redis read caching & in-memory fallback
  async getReviews(targetType: 'COLLEGE' | 'CAREER', targetId: string): Promise<Review[]> {
    return cacheGetOrSet(
      `cache:reviews:${targetType}:${targetId}`,
      async () => {
        const store = getStore();
        try {
          const dbReviews = await prisma.review.findMany({
            where: { targetType, targetId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
          });

          if (dbReviews && dbReviews.length > 0) {
            return dbReviews.map((r) => ({
              id: r.id,
              userId: r.userId,
              userName: r.user.name,
              userRole: r.user.role as any,
              targetType: r.targetType as 'COLLEGE' | 'CAREER',
              targetId: r.targetId,
              rating: r.rating,
              title: r.title,
              comment: r.comment,
              createdAt: r.createdAt.toISOString(),
            }));
          }
        } catch (err) {
          console.warn('Database getReviews fallback:', err);
        }

        return store.reviews.filter((r) => r.targetType === targetType && r.targetId === targetId);
      },
      300
    );
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const store = getStore();

    // Prevent duplicate reviews by the same user in memory
    const existingIndex = store.reviews.findIndex(
      (r) => r.userId === review.userId && r.targetType === review.targetType && r.targetId === review.targetId
    );
    if (existingIndex !== -1) {
      throw new Error('User has already reviewed this target.');
    }

    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.reviews.unshift(newReview);

    try {
      const created = await prisma.review.create({
        data: {
          userId: review.userId,
          targetType: review.targetType,
          targetId: review.targetId,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
        },
        include: { user: true },
      });
      newReview.id = created.id;
      newReview.createdAt = created.createdAt.toISOString();
    } catch (err) {
      console.warn('Database addReview fallback:', err);
    }

    // Update target aggregate rating
    if (review.targetType === 'COLLEGE') {
      const col = store.colleges.find((c) => c.id === review.targetId || c.slug === review.targetId);
      if (col) {
        const allColReviews = store.reviews.filter((r) => r.targetId === col.id || r.targetId === col.slug);
        const avg = allColReviews.reduce((sum, r) => sum + r.rating, 0) / allColReviews.length;
        col.avgRating = Number(avg.toFixed(2));
        col.reviewCount = allColReviews.length;
      }
      // Evict Redis caches
      cacheDelete([
        'cache:colleges:all',
        `cache:college:${review.targetId}`,
        `cache:reviews:COLLEGE:${review.targetId}`,
      ]).catch(() => {});
    } else {
      const car = store.careers.find((c) => c.id === review.targetId || c.slug === review.targetId);
      if (car) {
        const allCarReviews = store.reviews.filter((r) => r.targetId === car.id || r.targetId === car.slug);
        const avg = allCarReviews.reduce((sum, r) => sum + r.rating, 0) / allCarReviews.length;
        car.avgRating = Number(avg.toFixed(2));
        car.reviewCount = allCarReviews.length;
      }
      // Evict Redis caches
      cacheDelete([
        'cache:careers:all',
        `cache:career:${review.targetId}`,
        `cache:reviews:CAREER:${review.targetId}`,
      ]).catch(() => {});
    }

    return newReview;
  },

  // Consultants
  async getConsultants(domainFilter?: ConsultantDomain): Promise<ConsultantProfile[]> {
    const store = getStore();
    if (!domainFilter) {
      return store.consultants;
    }

    // STRICT CHECK: Only return consultants who are VERIFIED for this specific domain!
    return store.consultants.filter((c) =>
      c.domainVerifications.some((v) => v.domain === domainFilter && v.status === 'VERIFIED')
    );
  },

  async getConsultantById(id: string): Promise<ConsultantProfile | null> {
    const store = getStore();
    return store.consultants.find((c) => c.id === id || c.userId === id) || null;
  },

  async applyForConsultant(
    data: Omit<ConsultantProfile, 'id' | 'rating' | 'reviewCount'>
  ): Promise<ConsultantProfile> {
    const store = getStore();
    const newProfile: ConsultantProfile = {
      ...data,
      id: `cons_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    store.consultants.push(newProfile);

    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: data.userId }, { email: data.email }] },
      });

      if (user) {
        const profile = await prisma.consultantProfile.upsert({
          where: { userId: user.id },
          update: {
            headline: data.headline,
            bio: data.bio,
            experienceYears: data.experienceYears,
            highestEducation: data.highestEducation,
            almaMater: data.almaMater,
            currentRole: data.currentRole,
            phone: data.phone,
            linkedinUrl: data.linkedinUrl,
            feePerSessionINR: data.feePerSessionINR,
          },
          create: {
            userId: user.id,
            headline: data.headline,
            bio: data.bio,
            experienceYears: data.experienceYears,
            highestEducation: data.highestEducation,
            almaMater: data.almaMater,
            currentRole: data.currentRole,
            phone: data.phone,
            linkedinUrl: data.linkedinUrl,
            feePerSessionINR: data.feePerSessionINR,
            verificationStatus: 'PENDING',
          },
        });
        newProfile.id = profile.id;

        if (data.domainVerifications && data.domainVerifications.length > 0) {
          for (const dv of data.domainVerifications) {
            await prisma.consultantDomainVerification.upsert({
              where: {
                consultantId_domain: {
                  consultantId: profile.id,
                  domain: dv.domain as any,
                },
              },
              update: {
                proofDescription: dv.proofDescription,
                proofDocumentUrl: dv.proofDocumentUrl,
              },
              create: {
                consultantId: profile.id,
                domain: dv.domain as any,
                proofDescription: dv.proofDescription,
                proofDocumentUrl: dv.proofDocumentUrl,
                status: 'PENDING',
              },
            });
          }
        }
      }
    } catch (err) {
      console.warn('Database applyForConsultant fallback:', err);
    }

    return newProfile;
  },

  async verifyConsultantDomain(
    consultantId: string,
    domain: ConsultantDomain,
    status: VerificationStatus,
    adminNotes?: string
  ): Promise<boolean> {
    const store = getStore();
    const consultant = store.consultants.find((c) => c.id === consultantId || c.userId === consultantId);
    if (!consultant) return false;

    const existingVerification = consultant.domainVerifications.find((v) => v.domain === domain);
    if (existingVerification) {
      existingVerification.status = status;
      existingVerification.adminNotes = adminNotes;
      if (status === 'VERIFIED') {
        existingVerification.verifiedAt = new Date().toISOString();
      }
    } else {
      consultant.domainVerifications.push({
        domain,
        status,
        proofDescription: 'Admin manual update',
        verifiedAt: status === 'VERIFIED' ? new Date().toISOString() : undefined,
        adminNotes,
      });
    }

    return true;
  },

  // Bookings - Database persistence with in-memory fallback for Vercel statelessness
  async createBooking(
    booking: Omit<ConsultationBooking, 'id' | 'createdAt'> & { meetingUrl?: string }
  ): Promise<ConsultationBooking> {
    const store = getStore();
    const newBooking: ConsultationBooking = {
      ...booking,
      id: `book_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.bookings.unshift(newBooking);

    try {
      // Find consultant by profile id or user id
      const dbConsultant = await prisma.consultantProfile.findFirst({
        where: {
          OR: [{ id: booking.consultantId }, { userId: booking.consultantId }],
        },
      });

      if (dbConsultant) {
        const meetingUrl =
          booking.meetingUrl ||
          `https://meet.jit.si/career-gud-session-${newBooking.id}`;

        const created = await prisma.consultationBooking.create({
          data: {
            studentId: booking.studentId,
            consultantId: dbConsultant.id,
            domain: booking.domain as any,
            requestedDate: new Date(booking.requestedDate),
            timeSlot: booking.timeSlot,
            status: (booking.status as any) || 'REQUESTED',
            studentNotes: booking.studentNotes || '',
            sharedProfileSummary: (booking.sharedProfileSummary as any) || undefined,
            meetingUrl,
          },
        });
        newBooking.id = created.id;
        newBooking.createdAt = created.createdAt.toISOString();
        (newBooking as any).meetingUrl = created.meetingUrl;
      }
    } catch (err) {
      console.warn('Database booking persistence fallback:', err);
    }

    return newBooking;
  },

  async getBookings(filter?: { studentId?: string; consultantId?: string }): Promise<ConsultationBooking[]> {
    const store = getStore();
    try {
      const whereClause: any = {};
      if (filter?.studentId) whereClause.studentId = filter.studentId;
      if (filter?.consultantId) {
        whereClause.OR = [
          { consultantId: filter.consultantId },
          { consultant: { userId: filter.consultantId } },
        ];
      }

      const dbBookings = await prisma.consultationBooking.findMany({
        where: whereClause,
        include: {
          student: true,
          consultant: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbBookings && dbBookings.length > 0) {
        return dbBookings.map((b) => ({
          id: b.id,
          studentId: b.studentId,
          studentName: b.student.name,
          studentEmail: b.student.email,
          consultantId: b.consultantId,
          consultantName: b.consultant.user.name,
          domain: b.domain as ConsultantDomain,
          requestedDate: b.requestedDate.toISOString().split('T')[0],
          timeSlot: b.timeSlot,
          status: b.status as ConsultationBooking['status'],
          studentNotes: b.studentNotes,
          sharedProfileSummary: b.sharedProfileSummary as any,
          meetingUrl: b.meetingUrl || `https://meet.jit.si/career-gud-session-${b.id}`,
          createdAt: b.createdAt.toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Database getBookings fallback:', err);
    }

    let list = store.bookings;
    if (filter?.studentId) {
      list = list.filter((b) => b.studentId === filter.studentId);
    }
    if (filter?.consultantId) {
      list = list.filter((b) => b.consultantId === filter.consultantId);
    }
    return list;
  },

  async updateBookingStatus(
    bookingId: string,
    status: ConsultationBooking['status'],
    meetingUrl?: string
  ): Promise<ConsultationBooking | null> {
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = status;
      if (meetingUrl) (booking as any).meetingUrl = meetingUrl;
    }

    try {
      const updated = await prisma.consultationBooking.update({
        where: { id: bookingId },
        data: {
          status: status as any,
          ...(meetingUrl ? { meetingUrl } : {}),
        },
        include: {
          student: true,
          consultant: { include: { user: true } },
        },
      });

      return {
        id: updated.id,
        studentId: updated.studentId,
        studentName: updated.student.name,
        studentEmail: updated.student.email,
        consultantId: updated.consultantId,
        consultantName: updated.consultant.user.name,
        domain: updated.domain as ConsultantDomain,
        requestedDate: updated.requestedDate.toISOString().split('T')[0],
        timeSlot: updated.timeSlot,
        status: updated.status as ConsultationBooking['status'],
        studentNotes: updated.studentNotes,
        sharedProfileSummary: updated.sharedProfileSummary as any,
        meetingUrl: updated.meetingUrl || `https://meet.jit.si/career-gud-session-${updated.id}`,
        createdAt: updated.createdAt.toISOString(),
      };
    } catch (err) {
      console.warn('Database updateBookingStatus fallback:', err);
    }

    return booking || null;
  },

  // Quiz Attempts - Database persistence with in-memory fallback
  async saveQuizAttempt(attempt: QuizResult & { userId?: string }): Promise<void> {
    const store = getStore();
    store.quizAttempts.unshift(attempt);

    if (attempt.userId) {
      try {
        await prisma.quizAttempt.create({
          data: {
            userId: attempt.userId,
            quizType: (attempt as any).quizType || 'ASSESSMENT',
            answers: (attempt as any).answers || {},
            scores: (attempt as any).scores || {},
            recommendations: attempt.primaryRecommendation as any,
            realismAnalysis: attempt.realismCheck as any,
          },
        });
      } catch (err) {
        console.warn('Database saveQuizAttempt fallback:', err);
      }
    }
  },

  async getQuizAttempts(userId: string): Promise<QuizResult[]> {
    const store = getStore();
    try {
      const dbAttempts = await prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (dbAttempts && dbAttempts.length > 0) {
        return dbAttempts.map((a) => ({
          id: a.id,
          quizType: a.quizType as any,
          primaryRecommendation: a.recommendations as any,
          secondaryRecommendations: [],
          realismCheck: a.realismAnalysis as any,
          answers: a.answers as any,
          scores: a.scores as any,
          createdAt: a.createdAt.toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Database getQuizAttempts fallback:', err);
    }

    return store.quizAttempts.filter((a) => a.userId === userId);
  },

  // Users & Profiles
  async getUserByEmail(email: string): Promise<(User & { password?: string }) | null> {
    const store = getStore();
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(user: Omit<User, 'id' | 'createdAt'> & { password?: string }): Promise<User> {
    const store = getStore();
    const newUser: User & { password?: string } = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    return newUser;
  },

  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    const store = getStore();
    return store.profiles.get(userId) || null;
  },

  async upsertStudentProfile(profile: StudentProfile): Promise<StudentProfile> {
    const store = getStore();
    store.profiles.set(profile.userId, profile);
    return profile;
  },

  async toggleSavedItem(
    userId: string,
    type: 'CAREER' | 'COLLEGE',
    itemSlug: string
  ): Promise<{ saved: boolean }> {
    const store = getStore();
    let prof = store.profiles.get(userId);
    if (!prof) {
      prof = {
        userId,
        currentClass: 'CLASS_10',
        academicScores: {},
        interests: [],
        strengths: [],
        savedCareers: [],
        savedColleges: [],
      };
      store.profiles.set(userId, prof);
    }

    const targetList = type === 'CAREER' ? (prof.savedCareers ??= []) : (prof.savedColleges ??= []);
    const idx = targetList.indexOf(itemSlug);
    let isSaved = false;

    if (idx >= 0) {
      targetList.splice(idx, 1);
      isSaved = false;
    } else {
      targetList.push(itemSlug);
      isSaved = true;
    }

    return { saved: isSaved };
  },
};
