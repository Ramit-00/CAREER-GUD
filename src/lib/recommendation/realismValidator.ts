import { QuizResult, StreamType } from '@/types';

export const realismValidator = {
  validate10thStreamChoice(
    stream: StreamType,
    tenthPercentage?: number,
    mathScore?: number,
    scienceScore?: number
  ): QuizResult['realismCheck'] {
    const gaps: string[] = [];

    // Check PCM requirements
    if (stream === 'SCIENCE_PCM') {
      if (mathScore !== undefined && mathScore < 65) {
        gaps.push(
          `Class 10 Mathematics score (${mathScore}%) is below the recommended 70% threshold. Class 11 Trigonometry & Calculus move at 4x the speed and depth of Class 10.`
        );
      }
      if (tenthPercentage !== undefined && tenthPercentage < 65) {
        gaps.push(
          `Overall 10th performance (${tenthPercentage}%) suggests vulnerability to academic burnout under the rigorous 6-hour daily self-study cycle required for PCM + JEE.`
        );
      }

      if (gaps.length > 0) {
        return {
          status: 'RED',
          headline: 'High Friction Warning: Bridge Preparation Required',
          description:
            'Taking Science PCM with your current mathematics baseline will cause significant academic friction. We advise realistic honesty: consider dedicated bridge tutoring in Algebra and Coordinate Geometry before Class 11 begins, or strongly evaluate Commerce with Maths or Arts as viable high-growth alternatives.',
          prerequisiteGaps: gaps,
          workloadReality:
            'JEE competition involves ~14.2 lakh aspirants competing for ~17,385 IIT seats (1.2% selection rate). Private coaching alone will not bridge a weak arithmetic foundation.',
          recommendedPivot: 'Commerce with Mathematics or Applied Technology (BCA track)',
        };
      }

      if (mathScore !== undefined && mathScore < 78) {
        return {
          status: 'AMBER',
          headline: 'Manageable Stretch with Focused Effort',
          description:
            'You have sufficient aptitude for PCM, but will need deliberate consistency from Day 1 of Class 11. Avoid falling behind in the first 3 months of Mechanics and Complex Numbers.',
          prerequisiteGaps: ['Consistent daily numerical practice required to prevent backlog.'],
          workloadReality:
            'Expect 3 to 4 hours of daily homework and coaching assignments in addition to regular school hours.',
        };
      }

      return {
        status: 'GREEN',
        headline: 'Strong Academic & Aptitude Alignment',
        description:
          'Your quantitative and analytical foundation is well aligned with the demands of Science Non-Medical.',
        prerequisiteGaps: [],
        workloadReality:
          'High workload, but sustainable given your foundational comfort with abstract problem solving.',
      };
    }

    // Check PCB requirements
    if (stream === 'SCIENCE_PCB') {
      if (scienceScore !== undefined && scienceScore < 65) {
        gaps.push(
          `Class 10 Science score (${scienceScore}%) indicates possible struggles with detailed NCERT retention and experimental theory.`
        );
      }

      if (gaps.length > 0) {
        return {
          status: 'AMBER',
          headline: 'Retention & Workload Reality Check',
          description:
            'Medical stream requires memorizing thousands of biological terms, anatomical diagrams, and taxonomic classifications, in addition to mastering competitive Physics for NEET-UG.',
          prerequisiteGaps: gaps,
          workloadReality:
            'Over 23 lakh students appear for NEET-UG competing for ~55,000 government MBBS seats. Private medical college fees often exceed ₹60 Lakhs - ₹1.2 Crore.',
          recommendedPivot: 'Biotechnology, Allied Health Sciences, or Clinical Psychology',
        };
      }

      return {
        status: 'GREEN',
        headline: 'Good Biological Affinity',
        description:
          'Your interest profile and academic foundation indicate strong potential for Medical and Healthcare sciences.',
        prerequisiteGaps: [],
        workloadReality:
          'Be prepared for a long gestation period: 5.5 years of MBBS followed by 3 years of MD/MS residency.',
      };
    }

    // Check PCMB
    if (stream === 'SCIENCE_PCMB') {
      return {
        status: 'AMBER',
        headline: 'Double Competitive Load Warning',
        description:
          'PCMB keeps every door open, but carries the heaviest academic workload in the Indian higher secondary system. Many students struggle to balance NEET biology revisions with JEE calculus problem sets.',
        prerequisiteGaps: ['Requires exceptional time management and mental stamina.'],
        workloadReality:
          '50 to 65 hours of combined school, coaching, and self-study every week.',
        recommendedPivot: 'Pick either PCM or PCB by mid-Class 11 to avoid double burnout.',
      };
    }

    // Commerce or Arts
    return {
      status: 'GREEN',
      headline: 'Balanced Academic Fit',
      description:
        'This stream offers excellent compounding career upside with manageable work-life balance during the higher secondary years.',
      prerequisiteGaps: [],
      workloadReality:
        'Moderate to high workload depending on whether you take professional tracks like CA Foundation or CLAT alongside school.',
    };
  },

  validate12thEngineeringPathway(twelfthPercentage?: number, mathScore?: number): QuizResult['realismCheck'] {
    if (mathScore !== undefined && mathScore < 60) {
      return {
        status: 'AMBER',
        headline: 'Branch Selection Advisory',
        description:
          'Tier-1 engineering entrance exams require deep calculus and algebraic fluency. If JEE rank is outside top 30,000, consider premier state universities, BCA + MCA, or modern private universities (BITS, VIT, Manipal) with focused practical coding curricula.',
        prerequisiteGaps: ['Foundational math gap for pure algorithmic engineering'],
        workloadReality:
          'Software hiring is increasingly skill-first: practical GitHub projects, open-source contributions, and algorithmic problem-solving matter more than degree brand alone.',
      };
    }

    return {
      status: 'GREEN',
      headline: 'Strong Technical Pathway Alignment',
      description: 'Your mathematical aptitude supports advanced engineering and software systems curricula.',
      prerequisiteGaps: [],
      workloadReality: 'Rigorous 4-year engineering curriculum with semester lab projects and technical internships.',
    };
  },

  validate12thMedicalPathway(twelfthPercentage?: number, bioScore?: number): QuizResult['realismCheck'] {
    return {
      status: 'AMBER',
      headline: 'NEET-UG Realistic Benchmarks',
      description:
        'Government medical college cutoff in India typically requires scoring 610+ out of 720 in NEET-UG (approx. 99th percentile). Always maintain a parallel backup strategy in BDS, BVSc, Pharmacy, or B.Sc Biotechnology to prevent taking multiple stressful drop years.',
      prerequisiteGaps: ['High competition density at 600-650 NEET score band'],
      workloadReality: 'Extensive 8 to 10-year training commitment to achieve independent specialist consultant status.',
    };
  },
};
