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
    const store = getStore();
    let list = store.careers;

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
    const store = getStore();
    return store.careers.find((c) => c.slug === slug) || null;
  },

  // Colleges
  async getColleges(filter?: { state?: string; type?: string; search?: string }): Promise<College[]> {
    const store = getStore();
    let list = store.colleges;

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
    const store = getStore();
    return store.colleges.find((c) => c.slug === slug) || null;
  },

  // Reviews
  async getReviews(targetType: 'COLLEGE' | 'CAREER', targetId: string): Promise<Review[]> {
    const store = getStore();
    return store.reviews.filter((r) => r.targetType === targetType && r.targetId === targetId);
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const store = getStore();

    // Prevent duplicate reviews by the same user
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

    // Update target aggregate rating
    if (review.targetType === 'COLLEGE') {
      const col = store.colleges.find((c) => c.id === review.targetId || c.slug === review.targetId);
      if (col) {
        const allColReviews = store.reviews.filter((r) => r.targetId === col.id || r.targetId === col.slug);
        const avg = allColReviews.reduce((sum, r) => sum + r.rating, 0) / allColReviews.length;
        col.avgRating = Number(avg.toFixed(2));
        col.reviewCount = allColReviews.length;
      }
    } else {
      const car = store.careers.find((c) => c.id === review.targetId || c.slug === review.targetId);
      if (car) {
        const allCarReviews = store.reviews.filter((r) => r.targetId === car.id || r.targetId === car.slug);
        const avg = allCarReviews.reduce((sum, r) => sum + r.rating, 0) / allCarReviews.length;
        car.avgRating = Number(avg.toFixed(2));
        car.reviewCount = allCarReviews.length;
      }
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

  // Bookings
  async createBooking(booking: Omit<ConsultationBooking, 'id' | 'createdAt'>): Promise<ConsultationBooking> {
    const store = getStore();
    const newBooking: ConsultationBooking = {
      ...booking,
      id: `book_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.bookings.unshift(newBooking);
    return newBooking;
  },

  async getBookings(filter?: { studentId?: string; consultantId?: string }): Promise<ConsultationBooking[]> {
    const store = getStore();
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
    status: ConsultationBooking['status']
  ): Promise<ConsultationBooking | null> {
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;
    booking.status = status;
    return booking;
  },

  // Quiz Attempts
  async saveQuizAttempt(attempt: QuizResult & { userId?: string }): Promise<void> {
    const store = getStore();
    store.quizAttempts.unshift(attempt);
  },

  async getQuizAttempts(userId: string): Promise<QuizResult[]> {
    const store = getStore();
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
