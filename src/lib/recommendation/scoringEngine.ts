import { QuizResult, QuizType, StreamType } from '@/types';
import { realismValidator } from './realismValidator';

interface ScoreAccumulator {
  SCIENCE_PCM: number;
  SCIENCE_PCB: number;
  SCIENCE_PCMB: number;
  COMMERCE_MATHS: number;
  COMMERCE_NO_MATHS: number;
  ARTS: number;
  VOCATIONAL: number;
}

export const scoringEngine = {
  calculate10thStreamResult(
    answers: Record<string, string>, // questionId -> selectedOptionId
    userProfile?: {
      tenthPercentage?: number;
      mathScore?: number;
      scienceScore?: number;
      englishScore?: number;
      socialScienceScore?: number;
      interests?: string[];
      strengths?: string[];
    }
  ): QuizResult {
    const scores: ScoreAccumulator = {
      SCIENCE_PCM: 0,
      SCIENCE_PCB: 0,
      SCIENCE_PCMB: 0,
      COMMERCE_MATHS: 0,
      COMMERCE_NO_MATHS: 0,
      ARTS: 0,
      VOCATIONAL: 0,
    };

    // Calculate raw points from answers
    Object.entries(answers).forEach(([, optId]) => {
      if (optId.includes('_a')) {
        scores.SCIENCE_PCM += 4;
        scores.COMMERCE_MATHS += 2;
        scores.VOCATIONAL += 1;
      } else if (optId.includes('_b')) {
        scores.SCIENCE_PCB += 5;
        scores.SCIENCE_PCMB += 3;
      } else if (optId.includes('_c')) {
        scores.COMMERCE_MATHS += 4;
        scores.COMMERCE_NO_MATHS += 4;
      } else if (optId.includes('_d')) {
        scores.ARTS += 5;
        scores.VOCATIONAL += 1;
      }
    });

    // If student has explicit academic marks, blend them into the aptitude score
    if (userProfile?.mathScore !== undefined) {
      if (userProfile.mathScore >= 80) {
        scores.SCIENCE_PCM += 4;
        scores.COMMERCE_MATHS += 3;
      } else if (userProfile.mathScore < 60) {
        scores.COMMERCE_NO_MATHS += 3;
        scores.ARTS += 3;
      }
    }

    if (userProfile?.scienceScore !== undefined) {
      if (userProfile.scienceScore >= 80) {
        scores.SCIENCE_PCB += 3;
        scores.SCIENCE_PCM += 3;
      }
    }

    // Determine highest scoring streams
    const sortedStreams = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topStream = sortedStreams[0][0] as StreamType;
    const secondStream = sortedStreams[1][0] as StreamType;

    const maxScore = Math.max(...Object.values(scores), 1);
    const topMatchPct = Math.min(Math.round((sortedStreams[0][1] / (maxScore * 1.1)) * 100), 96);
    const secondMatchPct = Math.min(Math.round((sortedStreams[1][1] / (maxScore * 1.1)) * 100), 88);

    // Stream meta details
    const streamMeta: Record<
      StreamType,
      {
        title: string;
        why: string;
        subjects: string[];
        degrees: string[];
        exams: string[];
        actionPlan: string[];
      }
    > = {
      SCIENCE_PCM: {
        title: 'Science: Non-Medical (Physics, Chemistry, Mathematics)',
        why: 'Your answers indicate high quantitative intuition, mechanical logic, and a preference for deductive problem solving over heavy rote memorization.',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science / Physical Education'],
        degrees: ['B.Tech / B.E. (Computer Science, Electronics, Mechanical)', 'B.Arch (Architecture)', 'BS-MS Dual Degree in Physics/Maths', 'Commercial Pilot Training (CPL)'],
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'NATA', 'NDA (Air Force & Navy)'],
        actionPlan: [
          'Strengthen Class 10 trigonometry, coordinate geometry, and algebraic fundamentals before starting Class 11.',
          'Adopt daily habit of solving 15-20 challenging analytical numericals rather than passive reading.',
          'Start investigating the syllabus differences between Board Exams and competitive JEE patterns.',
        ],
      },
      SCIENCE_PCB: {
        title: 'Science: Medical (Physics, Chemistry, Biology)',
        why: 'You show deep fascination with living organisms, anatomy, and human physiology, combined with strong observational and diagrammatic memory.',
        subjects: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'English', 'Psychology / Physical Education'],
        degrees: ['MBBS (Medicine & Surgery)', 'BDS (Dental Surgery)', 'BAMS / BHMS (Ayurvedic/Homeopathic)', 'B.Sc Biotechnology / Genetics', 'BVSc (Veterinary Sciences)'],
        exams: ['NEET-UG (National Eligibility cum Entrance Test)', 'IISER IAT', 'CUET-UG (Biochemistry/Biotech)'],
        actionPlan: [
          'Master NCERT Class 10 Biology line-by-line; medical entrance tests in India are 90%+ anchored in NCERT depth.',
          'Recognize early that Physics is the main rank-decider in NEET-UG; build foundational kinematics and mechanics early.',
          'Develop patience and emotional stamina for a 5.5-year clinical degree and intensive clinical residency.',
        ],
      },
      SCIENCE_PCMB: {
        title: 'Science: Both (PCMB - Physics, Chemistry, Maths & Biology)',
        why: 'You possess balanced curiosity across physical and life sciences and want to maintain maximum flexibility for interdisciplinary frontiers like Bioinformatics and Biomedical Engineering.',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
        degrees: ['Bioinformatics & Computational Genomics', 'Biomedical Engineering', 'B.Tech Biotechnology', 'MBBS or B.Tech (Dual Eligibility)'],
        exams: ['NEET-UG', 'JEE Main', 'IISER IAT', 'NEST'],
        actionPlan: [
          'Reality Check: PCMB demands roughly 40% more study hours per week than standard 3-subject streams.',
          'Create a strict daily study timetable balancing numerical calculus with biological taxonomies.',
          'By the midpoint of Class 11, review mock scores to decide whether to focus your primary competitive energy on JEE or NEET.',
        ],
      },
      COMMERCE_MATHS: {
        title: 'Commerce with Mathematics',
        why: 'You show keen commercial awareness, curiosity about financial markets and business models, coupled with the mathematical comfort needed for high-tier corporate finance.',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
        degrees: ['B.Com (Honours)', 'Bachelor of Management Studies (BMS / BBA)', 'CA (Chartered Accountancy)', 'CFA / Financial Risk Management', 'Integrated MBA (IPM)'],
        exams: ['CUET-UG', 'IPMAT (IIM Indore/Rohtak)', 'CA Foundation (ICAI)'],
        actionPlan: [
          'Read financial news daily (The Economic Times or Mint) to understand inflation, interest rates, and startup business models.',
          'Practice structured bookkeeping ledger principles; precision is key.',
          'Start solving aptitude reasoning questions for IPMAT and CUET quantitative sections.',
        ],
      },
      COMMERCE_NO_MATHS: {
        title: 'Commerce (Informatics / Entrepreneurship)',
        why: 'You gravitate toward business operations, marketing, organizational management, and trade, without wanting the pressure of advanced differential calculus.',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Informatics Practices / Entrepreneurship', 'English'],
        degrees: ['B.Com (General)', 'BBA (Marketing / HR)', 'CA / CS (Company Secretary)', 'Bachelor of Event / Hotel Management'],
        exams: ['CUET-UG', 'SET (Symbiosis)', 'NPAT', 'CS Executive Entrance'],
        actionPlan: [
          'Focus on business case studies and commercial economics.',
          'Explore digital marketing, communication, and spreadsheet analytics skills.',
          'Evaluate Company Secretary (CS) and corporate governance pathways.',
        ],
      },
      ARTS: {
        title: 'Arts & Humanities',
        why: 'You possess rich linguistic expression, critical socio-political thinking, and curiosity about history, human psychology, design, or law.',
        subjects: ['Political Science', 'History / Sociology', 'Psychology', 'Economics / Fine Arts', 'English Core / Elective'],
        degrees: ['BA (Honours) in Political Science / Psychology / Economics', 'BA LLB (5-Year Integrated Corporate Law)', 'B.Des (Product / UX Design)', 'Journalism & Mass Media'],
        exams: ['CLAT (Law)', 'CUET-UG', 'UCEED / NID DAT (Design)', 'UPSC CSE (Long-term aspiration)'],
        actionPlan: [
          'Cultivate extensive long-form reading habits; read editorial opinions across diverse political viewpoints.',
          'Build strong argumentation and debate skills; participate in Model United Nations (MUN) and youth parliaments.',
          'If targeting premier National Law Universities, start daily reading comprehension and logical reasoning drills.',
        ],
      },
      VOCATIONAL: {
        title: 'Vocational & Applied Technology Stream',
        why: 'You prefer hands-on execution, practical trades, applied design, and tangible industry skills over dry theoretical examinations.',
        subjects: ['Information Technology', 'Applied Multimedia', 'Electronics Technology', 'Travel & Tourism', 'English'],
        degrees: ['B.Voc (Bachelor of Vocation)', 'Diploma to Degree Engineering', 'Digital Media & Animation'],
        exams: ['State Polytechnic Entrance Exams', 'CUET Vocational Tracks'],
        actionPlan: [
          'Build a tangible portfolio of projects (code, design, digital content, or electronic assemblies).',
          'Seek out early industrial internships and skill-certification bootcamps.',
        ],
      },
    };

    const topInfo = streamMeta[topStream] || streamMeta.SCIENCE_PCM;
    const secondInfo = streamMeta[secondStream] || streamMeta.COMMERCE_MATHS;

    // Run realism validation check
    const realismCheck = realismValidator.validate10thStreamChoice(
      topStream,
      userProfile?.tenthPercentage,
      userProfile?.mathScore,
      userProfile?.scienceScore
    );

    return {
      id: `quiz_res_${Date.now()}`,
      quizType: 'STREAM_10TH',
      scores: scores as unknown as Record<string, number>,
      primaryRecommendation: {
        id: topStream,
        title: topInfo.title,
        streamCategory: topStream,
        matchPercentage: topMatchPct,
        whyItFits: topInfo.why,
        recommendedSubjects: topInfo.subjects,
        recommendedDegrees: topInfo.degrees,
        topExams: topInfo.exams,
        actionPlan: topInfo.actionPlan,
      },
      secondaryRecommendations: [
        {
          id: secondStream,
          title: secondInfo.title,
          matchPercentage: secondMatchPct,
          whyItFits: secondInfo.why,
        },
      ],
      realismCheck,
      createdAt: new Date().toISOString(),
    };
  },

  calculate12thDegreeResult(
    stream: StreamType,
    answers: Record<string, string>,
    marks?: { twelfthPercentage?: number; subjects?: Record<string, number> }
  ): QuizResult {
    // Degree mappings per stream
    if (stream === 'SCIENCE_PCB') {
      const bioScore = marks?.subjects?.Biology ?? 75;
      const realismCheck = realismValidator.validate12thMedicalPathway(marks?.twelfthPercentage, bioScore);

      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'MEDICAL_12TH',
        scores: { ClinicalMedicine: 42, ResearchGenetics: 35, HealthcareManagement: 28 },
        primaryRecommendation: {
          id: 'mbbs-doctor',
          title: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
          matchPercentage: 94,
          streamCategory: 'SCIENCE_PCB',
          whyItFits: 'Matches your clinical diagnostic inclination, patient-care empathy, and commitment to human life sciences.',
          recommendedDegrees: ['MBBS', 'BDS', 'B.Sc Cardiovascular Technology'],
          topExams: ['NEET-UG'],
          actionPlan: [
            'Assess whether your current mock NEET score is above the 600+ threshold needed for government medical seats.',
            'Maintain realistic backup admissions in Allied Health, Biotechnology, or BAMS if NEET rank falls short.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'biomedical-researcher',
            title: 'Biomedical & Genomic Research (BS-MS)',
            matchPercentage: 86,
            whyItFits: 'Great fit for high interest in biology with preference for research labs over hospital emergency rooms.',
          },
        ],
        realismCheck,
        createdAt: new Date().toISOString(),
      };
    }

    if (stream === 'COMMERCE_MATHS' || stream === 'COMMERCE_NO_MATHS') {
      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'COMMERCE_12TH',
        scores: { StatutoryAccounting: 45, InvestmentBanking: 38, CorporateManagement: 32 },
        primaryRecommendation: {
          id: 'chartered-accountant',
          title: 'Chartered Accountancy (CA) alongside B.Com (Hons)',
          matchPercentage: 92,
          streamCategory: 'COMMERCE',
          whyItFits: 'Your structured attention to detail and affinity for accounting principles make CA an exceptionally high-prestige match.',
          recommendedDegrees: ['B.Com (Hons)', 'Chartered Accountancy (ICAI)', 'CFA'],
          topExams: ['CA Foundation', 'CUET-UG'],
          actionPlan: [
            'Register for CA Foundation with ICAI immediately after Class 12 board examinations.',
            'Aim for top CUET percentile to secure DU colleges like SRCC, Hansraj, or Hindu College.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'investment-banker',
            title: 'Investment Banking & Corporate Finance',
            matchPercentage: 84,
            whyItFits: 'High-growth capital market trajectory with high compensation potential.',
          },
        ],
        realismCheck: {
          status: 'GREEN',
          headline: 'Strong Academic & Strategic Alignment',
          description: 'Commerce pathways provide flexible exit routes with steady compounding career growth in India.',
          prerequisiteGaps: [],
          workloadReality: 'CA articleship involves rigorous 3-year full-time corporate audit training.',
        },
        createdAt: new Date().toISOString(),
      };
    }

    // Default to PCM Engineering & Technology
    const mathScore = marks?.subjects?.Mathematics ?? 75;
    const realismCheck = realismValidator.validate12thEngineeringPathway(marks?.twelfthPercentage, mathScore);

    return {
      id: `quiz_12_${Date.now()}`,
      quizType: 'NON_MEDICAL_12TH',
      scores: { ComputerScience: 48, ElectronicsAI: 40, MechanicalAerospace: 30 },
      primaryRecommendation: {
        id: 'ai-ml-engineer',
        title: 'B.Tech in Computer Science / AI & Machine Learning',
        matchPercentage: 95,
        streamCategory: 'SCIENCE_PCM',
        whyItFits: 'Your high score in computational reasoning and logical architecture aligns seamlessly with modern software & AI engineering.',
        recommendedDegrees: ['B.Tech Computer Science', 'B.Tech Artificial Intelligence', 'B.Tech Data Science'],
        topExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
        actionPlan: [
          'Target consistent 99+ percentile in JEE Main for top NIT Computer Science seats.',
          'Start coding early in Python/C++ to build a strong algorithmic foundation before college.',
        ],
      },
      secondaryRecommendations: [
        {
          id: 'cloud-devops-architect',
          title: 'Cloud Infrastructure & Distributed Systems',
          matchPercentage: 88,
          whyItFits: 'High-resilience engineering discipline in enterprise tech.',
        },
        {
          id: 'commercial-pilot',
          title: 'Commercial Airline Pilot Training',
          matchPercentage: 80,
          whyItFits: 'Thriving Indian aviation sector with rewarding lifestyle for disciplined individuals.',
        },
      ],
      realismCheck,
      createdAt: new Date().toISOString(),
    };
  },
};
