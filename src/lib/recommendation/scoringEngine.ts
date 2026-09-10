import { QuizResult, StreamType } from '@/types';
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

    // If student has explicit academic marks, blend them safely into the aptitude score
    const safeMath =
      typeof userProfile?.mathScore === 'number' &&
      Number.isFinite(userProfile.mathScore) &&
      userProfile.mathScore >= 0 &&
      userProfile.mathScore <= 100
        ? userProfile.mathScore
        : undefined;

    const safeScience =
      typeof userProfile?.scienceScore === 'number' &&
      Number.isFinite(userProfile.scienceScore) &&
      userProfile.scienceScore >= 0 &&
      userProfile.scienceScore <= 100
        ? userProfile.scienceScore
        : undefined;

    if (safeMath !== undefined) {
      if (safeMath >= 80) {
        scores.SCIENCE_PCM += 4;
        scores.COMMERCE_MATHS += 3;
      } else if (safeMath < 60) {
        scores.COMMERCE_NO_MATHS += 3;
        scores.ARTS += 3;
      }
    }

    if (safeScience !== undefined) {
      if (safeScience >= 80) {
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
    const trajectory = answers.targetTrajectory || answers.q12_pref || 'CORE';

    // -------------------------------------------------------------
    // CROSS-STREAM: Management & Executive Leadership (IPMAT / IIMs)
    // Available to PCM, PCB, Commerce, and Arts
    // -------------------------------------------------------------
    if (trajectory === 'MANAGEMENT_LEADERSHIP') {
      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'COMMERCE_12TH',
        scores: { ManagementStrategy: 48, QuantitativeFinance: 42, CorporateLeadership: 38 },
        primaryRecommendation: {
          id: 'integrated-management-ipmat',
          title: '5-Year Integrated Program in Management (IPM at IIMs)',
          matchPercentage: 94,
          streamCategory: 'COMMERCE',
          whyItFits:
            stream.startsWith('SCIENCE')
              ? 'Seamlessly bridges your analytical secondary foundation with elite corporate management, product strategy, and executive finance at premier IIMs without the uncertainty of post-graduate CAT.'
              : 'Direct fast-track into premier IIM executive leadership, strategic consulting, and corporate finance right after Class 12.',
          recommendedDegrees: [
            '5-Year Integrated BBA + MBA (IIM Indore, Rohtak, Ranchi)',
            'BMS / BBA in Finance & Business Analytics',
            'B.Sc Economics & Data Analytics',
          ],
          topExams: ['IPMAT', 'JIPMAT', 'CUET-UG'],
          actionPlan: [
            'Prepare rigorously for IPMAT Quantitative Ability (MCQ + Short Answer) and Verbal Reading Comprehension.',
            'Maintain 80%+ Class 12 aggregate to comfortably meet IIM interview screening cutoffs.',
            'Build communication, current affairs, and business awareness for the Personal Interview (PI) round.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'investment-banker',
            title: 'Investment Banking & Corporate Finance (B.Com Hons / BMS)',
            matchPercentage: 86,
            whyItFits: 'High-compensation capital markets, portfolio advisory, and fintech trajectory.',
          },
          {
            id: stream.startsWith('SCIENCE') ? 'ai-ml-engineer' : 'chartered-accountant',
            title: stream.startsWith('SCIENCE') ? 'B.Tech in Computer Science & Product Tech' : 'Chartered Accountancy (CA)',
            matchPercentage: 80,
            whyItFits: stream.startsWith('SCIENCE') ? 'High-growth technical foundation to pair with future MBA leadership.' : 'Statutory audit and accounting certification.',
          },
        ],
        realismCheck: {
          status: 'GREEN',
          headline: 'High-Strategic Advantage (Cross-Stream Mobility)',
          description:
            'Indian IIMs actively reward educational diversity. Secondary science graduates with strong communication skills hold an advantage in management consulting and quantitative product strategy.',
          prerequisiteGaps: [],
          workloadReality:
            'IPMAT tests high-speed arithmetic and verbal nuance. IIM Indore admits ~150 candidates from ~30,000 aspirants (~0.5% acceptance rate).',
        },
        createdAt: new Date().toISOString(),
      };
    }

    // -------------------------------------------------------------
    // CROSS-STREAM: Corporate Law & Legal Policy (CLAT / NLUs)
    // Available to PCM, PCB, Commerce, and Arts
    // -------------------------------------------------------------
    if (trajectory === 'CORPORATE_LAW') {
      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'ARTS_12TH',
        scores: { LegalReasoning: 47, CriticalReading: 43, StatutoryLogic: 39 },
        primaryRecommendation: {
          id: 'corporate-lawyer',
          title: '5-Year Integrated B.A. LL.B. / B.B.A. LL.B. (Hons) at NLUs',
          matchPercentage: 93,
          streamCategory: 'ARTS',
          whyItFits:
            stream === 'SCIENCE_PCM'
              ? 'Your quantitative discipline provides a unique competitive edge in Cyber Law, Intellectual Property (IP/Patent) litigation, FinTech regulations, and Corporate Mergers & Acquisitions.'
              : stream === 'SCIENCE_PCB'
              ? 'Exceptional synergy for Pharmaceutical Patent Law, Medical Negligence Litigation, Bio-ethics, and Health Regulatory Policy.'
              : 'Ideal match for articulate analytical thinkers passionate about constitutional logic, corporate advisory, and legal advocacy.',
          recommendedDegrees: [
            '5-Year B.A. LL.B. (Hons) - NLSIU Bengaluru / NALSAR',
            '5-Year B.B.A. LL.B. (Hons) - Corporate & Commercial Law',
            'B.Sc. LL.B. (Hons) - Cyber Forensics & IP Law',
          ],
          topExams: ['CLAT', 'AILET'],
          actionPlan: [
            'Master reading comprehension speed and analytical reasoning: CLAT is heavily passage-based (120 questions in 120 minutes).',
            'Follow national legal developments, supreme court landmark judgments, and constitutional amendments.',
            'Aim for All India Rank under 350 to secure admission into Tier-1 NLUs (NLSIU Bengaluru, NALSAR Hyderabad, WBNUJS Kolkata).',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'integrated-management-ipmat',
            title: 'Integrated Corporate Management (IPMAT)',
            matchPercentage: 85,
            whyItFits: 'Alternative high-prestige corporate pathway with strong overlap in critical reasoning.',
          },
        ],
        realismCheck: {
          status: 'GREEN',
          headline: 'High-Demand Professional Discipline',
          description:
            'Top tier National Law University graduates command ₹16 - 22 LPA starting packages at Tier-1 corporate law firms (Shardul Amarchand Mangaldas, Trilegal, AZB & Partners).',
          prerequisiteGaps: [],
          workloadReality:
            'CLAT tests reading comprehension speed and deductive stamina. ~65,000 candidates compete for ~3,200 NLU seats nationwide.',
        },
        createdAt: new Date().toISOString(),
      };
    }

    // -------------------------------------------------------------
    // CROSS-STREAM: Design & Creative Technology (UCEED / NID)
    // Available to PCM, PCB, Commerce, and Arts
    // -------------------------------------------------------------
    if (trajectory === 'DESIGN_INNOVATION') {
      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'NON_MEDICAL_12TH',
        scores: { VisualSpatial: 46, HumanComputerInteraction: 44, CreativeInnovation: 40 },
        primaryRecommendation: {
          id: 'industrial-product-designer',
          title: 'Bachelor of Design (B.Des) at IIT Bombay / Delhi / NID',
          matchPercentage: 92,
          streamCategory: 'SCIENCE_PCM',
          whyItFits:
            'Bridges mathematical logic with spatial visualization and creative human-centered innovation. Leads into high-demand product design, digital UI/UX leadership, and automotive design.',
          recommendedDegrees: [
            'B.Des in Industrial & Interaction Design (IIT Bombay IDC, IIT Delhi, IIT Guwahati)',
            'B.Des in Digital Product Design (NID Ahmedabad)',
            'B.Des in Human-Computer Interaction',
          ],
          topExams: ['UCEED', 'NID DAT'],
          actionPlan: [
            'Practice perspective sketching, environmental observation, and spatial design visualization for UCEED Part B.',
            'Solve past UCEED Part A papers focusing on analytical visualization, optical patterns, and design problem solving.',
            'Curate a creative portfolio showcasing user problem-solving projects.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'ai-ml-engineer',
            title: 'Creative Tech & Human-Centered Computing (B.Tech)',
            matchPercentage: 84,
            whyItFits: 'Technical front-end architecture and interactive generative AI tools.',
          },
        ],
        realismCheck: {
          status: 'GREEN',
          headline: 'High-Growth Tech-Design Discipline',
          description:
            'Technology companies heavily recruit IIT and NID B.Des graduates for Product Design and UX leadership with starting packages comparable to computer science engineering.',
          prerequisiteGaps: [],
          workloadReality:
            'UCEED has ~205 total seats across participating IITs from ~15,000 candidates (~1.4% acceptance rate).',
        },
        createdAt: new Date().toISOString(),
      };
    }

    // -------------------------------------------------------------
    // STREAM: SCIENCE_PCB (Medical / Biology)
    // -------------------------------------------------------------
    if (stream === 'SCIENCE_PCB') {
      const bioScore = marks?.subjects?.Biology ?? 75;

      // Check if student wants Non-Clinical / Research / Biotech
      if (trajectory === 'BIOTECH_HEALTH_ADMIN' || trajectory === 'RESEARCH_SCIENCE') {
        return {
          id: `quiz_12_${Date.now()}`,
          quizType: 'MEDICAL_12TH',
          scores: { BiotechnologyGenomics: 48, HealthcareAdministration: 44, PharmaceuticalScience: 38 },
          primaryRecommendation: {
            id: 'biomedical-researcher',
            title: 'BS-MS in Biotechnology, Genomics & Bioinformatics',
            matchPercentage: 95,
            streamCategory: 'SCIENCE_PCB',
            whyItFits:
              'Allows you to advance life sciences, genetic therapeutics, mRNA vaccines, and computational biology in premier research laboratories without the clinical emergency stress, mandatory hospital night duties, or 10-year residency timeline of MBBS.',
            recommendedDegrees: [
              '5-Year BS-MS Dual Degree in Biological Sciences (IISERs / IISc)',
              'B.Tech / B.Sc (Hons) Biotechnology & Genetic Engineering',
              'Master of Hospital Administration (MHA at AIIMS / TISS)',
              'B.Pharm / Pharm.D in Clinical Pharmacology',
            ],
            topExams: ['IISER IAT', 'CUET-UG', 'NEST'],
            actionPlan: [
              'Target the IISER Aptitude Test (IAT) for BS-MS admissions across 7 premier Indian Institutes of Science Education & Research.',
              'Build foundation in basic Python or R programming for high-demand Bioinformatics and Genomic data science roles.',
              'Explore Master of Hospital Administration (MHA) at TISS or AIIMS if interested in the multi-crore Indian healthcare management industry.',
            ],
          },
          secondaryRecommendations: [
            {
              id: 'hospital-administrator',
              title: 'Hospital & Healthcare Systems Administration',
              matchPercentage: 88,
              whyItFits: 'Direct leadership of clinical facilities, health insurance networks, and health-tech startups without requiring an MBBS.',
            },
            {
              id: 'integrated-management-ipmat',
              title: 'Corporate Leadership & Health Consulting (IPMAT)',
              matchPercentage: 82,
              whyItFits: 'Leverage life sciences domain knowledge for pharmaceutical strategy and healthcare consulting.',
            },
          ],
          realismCheck: {
            status: 'GREEN',
            headline: 'High-Resilience Alternative to NEET-UG',
            description:
              'Biotechnology and Healthcare Management offer predictable 4-5 year graduation timelines, global research mobility, and corporate careers without the extreme 40:1 rejection ratio of government medical seats.',
            prerequisiteGaps: [],
            workloadReality:
              'IISER IAT tests fundamental conceptual understanding across Biology, Chemistry, and Physics.',
          },
          createdAt: new Date().toISOString(),
        };
      }

      // Default PCB: Core Clinical Medicine (MBBS)
      const realismCheck = realismValidator.validate12thMedicalPathway(marks?.twelfthPercentage, bioScore);

      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'MEDICAL_12TH',
        scores: { ClinicalMedicine: 46, PatientDiagnosis: 42, SurgicalEndurance: 38 },
        primaryRecommendation: {
          id: 'mbbs-doctor',
          title: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
          matchPercentage: 94,
          streamCategory: 'SCIENCE_PCB',
          whyItFits:
            'Matches your clinical diagnostic inclination, patient-care empathy, and commitment to human life sciences through the statutory medical curriculum.',
          recommendedDegrees: ['MBBS (4.5 Years + 1 Year Rotatory Internship)', 'BDS (Dental Surgery)', 'BAMS (Ayurvedic Medicine)'],
          topExams: ['NEET-UG'],
          actionPlan: [
            'Assess whether your current mock NEET score is consistently above the 630+ mark threshold required for government medical seats.',
            'Maintain realistic backup admissions in Allied Health, Biotechnology (IISER IAT), or B.Pharm if NEET rank falls outside government cutoffs.',
            'Prepare for a 10-year marathon: MBBS (5.5 years) followed by compulsory rural bond and NEET-PG / NEXT for MD/MS specialization.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'biomedical-researcher',
            title: 'Biomedical & Genomic Research (BS-MS via IISER IAT)',
            matchPercentage: 88,
            whyItFits: 'High-prestige alternative for biology lovers who prefer laboratory breakthroughs over emergency room clinical stress.',
          },
          {
            id: 'integrated-management-ipmat',
            title: 'Cross-Stream: Healthcare Management & Strategy (IPMAT)',
            matchPercentage: 80,
            whyItFits: 'Direct pathway to corporate hospital operations and pharmaceutical consulting.',
          },
        ],
        realismCheck,
        createdAt: new Date().toISOString(),
      };
    }

    // -------------------------------------------------------------
    // STREAM: COMMERCE (Maths / Non-Maths)
    // -------------------------------------------------------------
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
          whyItFits:
            'Your structured attention to detail and affinity for accounting principles make CA an exceptionally high-prestige, statutory certification.',
          recommendedDegrees: ['B.Com (Hons)', 'Chartered Accountancy (ICAI)', 'CFA (Chartered Financial Analyst)'],
          topExams: ['CA Foundation', 'CUET-UG'],
          actionPlan: [
            'Register for CA Foundation with ICAI immediately after Class 12 board examinations.',
            'Aim for 98+ percentile in CUET to secure premier Delhi University colleges like SRCC, Hansraj, or Hindu College.',
            'Plan for CA Intermediate and the mandatory 2-year articleship training at an audited accounting firm.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'integrated-management-ipmat',
            title: '5-Year Integrated Management (IPMAT at IIMs)',
            matchPercentage: 89,
            whyItFits: 'Fast-track corporate leadership and strategy consulting directly from Class 12.',
          },
          {
            id: 'corporate-lawyer',
            title: 'Corporate & Commercial Law (CLAT via NLUs)',
            matchPercentage: 84,
            whyItFits: 'Specialization in corporate governance, tax law, insolvency, and private equity deals.',
          },
        ],
        realismCheck: {
          status: 'GREEN',
          headline: 'Strong Academic & Strategic Alignment',
          description:
            'Commerce pathways provide flexible exit routes with steady compounding career growth in corporate India.',
          prerequisiteGaps: [],
          workloadReality:
            'CA articleship involves rigorous 2-year full-time corporate audit training alongside academic exam preparation.',
        },
        createdAt: new Date().toISOString(),
      };
    }

    // -------------------------------------------------------------
    // STREAM: ARTS / HUMANITIES
    // -------------------------------------------------------------
    if (stream === 'ARTS') {
      return {
        id: `quiz_12_${Date.now()}`,
        quizType: 'ARTS_12TH',
        scores: { LegalPolicy: 46, PublicGovernance: 43, EconomicsSocialImpact: 39 },
        primaryRecommendation: {
          id: 'corporate-lawyer',
          title: '5-Year Integrated Law (B.A. LL.B. Hons at NLUs)',
          matchPercentage: 94,
          streamCategory: 'ARTS',
          whyItFits:
            'Your strong verbal reasoning, critical comprehension, and interest in institutional governance make premier National Law Universities an exceptional match.',
          recommendedDegrees: ['5-Year B.A. LL.B. (Hons)', 'B.A. (Hons) in Economics / Political Science', 'B.Des (Design)'],
          topExams: ['CLAT', 'AILET', 'CUET-UG'],
          actionPlan: [
            'Prepare rigorously for CLAT: prioritize reading speed, critical reasoning, and current affairs analysis.',
            'Target CUET-UG for flagship social science and economics programs at Delhi University, JNU, and Ashoka.',
            'Build analytical writing and debate portfolios for moot court competitions.',
          ],
        },
        secondaryRecommendations: [
          {
            id: 'integrated-management-ipmat',
            title: 'Management & Public Policy (IPMAT at IIMs)',
            matchPercentage: 87,
            whyItFits: 'Humanities students with quantitative aptitude excel in public policy consulting and corporate HR.',
          },
        ],
        realismCheck: {
          status: 'GREEN',
          headline: 'High Institutional Trajectory',
          description:
            'Law and policy programs from Tier-1 institutions offer high career mobility in corporate law, international NGOs, and public policy think tanks.',
          prerequisiteGaps: [],
          workloadReality:
            'CLAT tests reading stamina and deductive logic over 120 passage-based questions.',
        },
        createdAt: new Date().toISOString(),
      };
    }

    // -------------------------------------------------------------
    // DEFAULT STREAM: SCIENCE_PCM (Non-Medical / Engineering)
    // -------------------------------------------------------------
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
        whyItFits:
          'Your high score in computational reasoning and logical architecture aligns seamlessly with modern software & artificial intelligence engineering.',
        recommendedDegrees: ['B.Tech Computer Science', 'B.Tech Artificial Intelligence', 'B.Tech Data Science'],
        topExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
        actionPlan: [
          'Target consistent 99+ percentile in JEE Main for top NIT Computer Science seats.',
          'Start coding early in Python/C++ to build a strong algorithmic foundation before college.',
          'Explore BITSAT and premier state engineering exams as high-quality parallel options to JEE.',
        ],
      },
      secondaryRecommendations: [
        {
          id: 'integrated-management-ipmat',
          title: 'Cross-Stream: 5-Year Integrated Management (IPMAT at IIMs)',
          matchPercentage: 90,
          whyItFits: 'Skip routine B.Tech if you aspire directly to tech-management, corporate leadership, and investment finance.',
        },
        {
          id: 'industrial-product-designer',
          title: 'Cross-Stream: Industrial & Digital Design (UCEED at IITs)',
          matchPercentage: 86,
          whyItFits: 'Combine spatial logic with digital UX/UI product leadership at IIT Bombay IDC.',
        },
        {
          id: 'corporate-lawyer',
          title: 'Cross-Stream: Corporate & Cyber Patent Law (CLAT)',
          matchPercentage: 81,
          whyItFits: 'High-earning patent litigation and legal advisory for technology enterprises.',
        },
      ],
      realismCheck,
      createdAt: new Date().toISOString(),
    };
  },
};
