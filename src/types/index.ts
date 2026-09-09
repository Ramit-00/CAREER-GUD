export type Role = 'STUDENT' | 'CONSULTANT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
  createdAt: string;
}

export type ClassLevel = 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12' | 'POST_12' | 'UNDERGRAD';

export type StreamType =
  | 'SCIENCE_PCM'
  | 'SCIENCE_PCB'
  | 'SCIENCE_PCMB'
  | 'COMMERCE_MATHS'
  | 'COMMERCE_NO_MATHS'
  | 'ARTS'
  | 'VOCATIONAL';

export interface StudentProfile {
  userId: string;
  currentClass: ClassLevel;
  currentStream?: StreamType | null;
  board?: string; // CBSE, ICSE, State Board
  academicScores: {
    tenthPercentage?: number;
    twelfthPercentage?: number;
    subjectMarks?: Record<string, number>;
  };
  interests: string[];
  strengths: string[];
  budgetMaxINR?: number;
  preferredLocations?: string[];
  savedCareers?: string[]; // career IDs or slugs
  savedColleges?: string[]; // college IDs or slugs
}

export type QuizType =
  | 'STREAM_10TH'
  | 'MEDICAL_12TH'
  | 'NON_MEDICAL_12TH'
  | 'COMMERCE_12TH'
  | 'ARTS_12TH'
  | 'BOTH_12TH';

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  category: string;
  options: {
    id: string;
    text: string;
    subtext?: string;
    categoryWeights: Record<string, number>;
  }[];
}

export interface QuizResult {
  id: string;
  quizType: QuizType;
  scores: Record<string, number>;
  primaryRecommendation: {
    id: string;
    title: string;
    matchPercentage: number;
    streamCategory: string;
    whyItFits: string;
    recommendedSubjects?: string[];
    recommendedDegrees?: string[];
    topExams?: string[];
    actionPlan: string[];
  };
  secondaryRecommendations: Array<{
    id: string;
    title: string;
    matchPercentage: number;
    whyItFits: string;
  }>;
  realismCheck: {
    status: 'GREEN' | 'AMBER' | 'RED';
    headline: string;
    description: string;
    prerequisiteGaps: string[];
    workloadReality: string;
    recommendedPivot?: string;
  };
  createdAt: string;
}

export type QuizAttempt = QuizResult & { userId?: string };

export interface Career {
  id: string;
  slug: string;
  title: string;
  streamCategory: 'SCIENCE_PCM' | 'SCIENCE_PCB' | 'COMMERCE' | 'ARTS' | 'MULTIDISCIPLINARY';
  streamLabel: string;
  description: string;
  dayInTheLife: string;
  requiredSkills: string[];
  eligibility: {
    streamRequirement: string;
    mandatorySubjects: string[];
    minimumPercentageGuide: string;
    topEntranceExams: string[];
    typicalDegrees: string[];
  };
  outlook: {
    demandTrend: 'RISING' | 'STABLE' | 'DECLINING';
    demandTrendLabel: string;
    automationRiskScore: number; // 0.0 to 1.0
    automationRiskLabel: string;
    avgSalaryRangeINR: {
      entry: string;
      mid: string;
      senior: string;
    };
    growthNotes: string;
    regionalDemandNotes: string;
  };
  pathwaySteps: Array<{
    stage: string;
    description: string;
  }>;
  relatedCareers: string[];
  avgRating: number;
  reviewCount: number;
}

export interface CourseModule {
  id: string;
  name: string;
  semester: number;
  description: string;
  skillsGained: string[];
}

export interface Program {
  id: string;
  collegeId: string;
  name: string;
  degreeLevel: 'DIPLOMA' | 'UNDERGRAD' | 'POSTGRAD';
  durationYears: number;
  eligibility: string;
  feesPerYearINR: string;
  seatsAvailable: number;
  entranceExams: string[];
  relatedCareers: string[];
  courses: CourseModule[];
}

export interface College {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: 'GOVERNMENT' | 'PRIVATE' | 'DEEMED';
  state: string;
  city: string;
  address: string;
  nirfRank?: number;
  accreditation: string[];
  establishedYear: number;
  website: string;
  campusSizeAcres?: number;
  facilities: string[];
  placementStats: {
    avgPackageINR: string;
    highestPackageINR: string;
    placementPercentage: number;
    topRecruiters: string[];
  };
  programs: Program[];
  avgRating: number;
  reviewCount: number;
  image: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  targetType: 'COLLEGE' | 'CAREER';
  targetId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export type ConsultantDomain = 'MEDICAL' | 'ENGINEERING' | 'COMMERCE' | 'ARTS' | 'OVERSEAS';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface ConsultantDomainVerification {
  domain: ConsultantDomain;
  status: VerificationStatus;
  proofDescription: string;
  proofDocumentUrl?: string;
  verifiedAt?: string;
  adminNotes?: string;
}

export interface ConsultantProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  headline: string;
  bio: string;
  experienceYears: number;
  highestEducation: string;
  almaMater: string;
  currentRole: string;
  phone?: string;
  linkedinUrl?: string;
  feePerSessionINR: number;
  rating: number;
  reviewCount: number;
  avatarUrl?: string;
  verificationStatus?: VerificationStatus;
  domainVerifications: ConsultantDomainVerification[];
}

export interface ConsultationBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  consultantId: string;
  consultantName: string;
  domain: ConsultantDomain;
  requestedDate: string;
  timeSlot: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  studentNotes: string;
  sharedProfileSummary?: {
    currentClass: string;
    stream?: string;
    tenthScore?: number;
    twelfthScore?: number;
    topInterests: string[];
    topStrengths: string[];
  };
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{
    type: 'CAREER' | 'COLLEGE' | 'EXAM' | 'STREAM';
    title: string;
    link?: string;
    snippet?: string;
  }>;
  timestamp: string;
}
