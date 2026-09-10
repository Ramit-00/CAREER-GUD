export type NationalExam = 'JEE_MAIN' | 'NEET_UG' | 'CUET_UG' | 'CLAT' | 'IPMAT';

export type IndianCategory = 'OPEN' | 'OBC_NCL' | 'EWS' | 'SC' | 'ST' | 'PWD';

export interface InstitutionCutoffBenchmark {
  institution: string;
  program: string;
  type: 'IIT' | 'NIT' | 'IIIT' | 'AIIMS' | 'GMC' | 'NLU' | 'CENTRAL_UNIV' | 'IIM';
  location: string;
  closingRanks: Record<IndianCategory, number>;
  verifiedYear: number;
  counselingBody: 'JoSAA' | 'MCC' | 'CSAB' | 'Consortium of NLUs' | 'DU Admissions' | 'IIM Admissions';
}

export interface RankEstimateResult {
  exam: NationalExam;
  scoreOrPercentile: number;
  category: IndianCategory;
  state: string;
  estimatedAllIndiaRank: {
    min: number;
    max: number;
    midpoint: number;
  };
  estimatedCategoryRank: {
    min: number;
    max: number;
    midpoint: number;
  };
  percentileEquivalent: number;
  eligibleInstitutions: Array<{
    institution: string;
    program: string;
    type: string;
    location: string;
    admissionProbability: 'HIGH' | 'MODERATE' | 'STRETCH';
    previousClosingRank: number;
    counselingBody: string;
  }>;
  guidanceNote: string;
}

export const HISTORICAL_BENCHMARKS: InstitutionCutoffBenchmark[] = [
  // Engineering - NITs / IIITs (JEE Main)
  {
    institution: 'NIT Trichy',
    program: 'B.Tech Computer Science & Engineering',
    type: 'NIT',
    location: 'Tamil Nadu',
    closingRanks: { OPEN: 1510, OBC_NCL: 2450, EWS: 2100, SC: 8900, ST: 14200, PWD: 120 },
    verifiedYear: 2024,
    counselingBody: 'JoSAA',
  },
  {
    institution: 'NIT Surathkal (Karnataka)',
    program: 'B.Tech Artificial Intelligence & Data',
    type: 'NIT',
    location: 'Karnataka',
    closingRanks: { OPEN: 2850, OBC_NCL: 4100, EWS: 3800, SC: 14500, ST: 22000, PWD: 210 },
    verifiedYear: 2024,
    counselingBody: 'JoSAA',
  },
  {
    institution: 'NIT Warangal',
    program: 'B.Tech Electronics & Communication',
    type: 'NIT',
    location: 'Telangana',
    closingRanks: { OPEN: 5200, OBC_NCL: 7600, EWS: 6900, SC: 23000, ST: 36000, PWD: 340 },
    verifiedYear: 2024,
    counselingBody: 'JoSAA',
  },
  {
    institution: 'IIIT Hyderabad',
    program: 'B.Tech Computer Science',
    type: 'IIIT',
    location: 'Telangana',
    closingRanks: { OPEN: 1680, OBC_NCL: 2800, EWS: 2400, SC: 11000, ST: 19000, PWD: 150 },
    verifiedYear: 2024,
    counselingBody: 'CSAB',
  },
  {
    institution: 'NIT Rourkela',
    program: 'B.Tech Mechanical Engineering',
    type: 'NIT',
    location: 'Odisha',
    closingRanks: { OPEN: 17400, OBC_NCL: 25500, EWS: 23000, SC: 68000, ST: 98000, PWD: 980 },
    verifiedYear: 2024,
    counselingBody: 'JoSAA',
  },
  {
    institution: 'MNIT Jaipur',
    program: 'B.Tech Electrical Engineering',
    type: 'NIT',
    location: 'Rajasthan',
    closingRanks: { OPEN: 14200, OBC_NCL: 21000, EWS: 19500, SC: 58000, ST: 84000, PWD: 810 },
    verifiedYear: 2024,
    counselingBody: 'JoSAA',
  },

  // Medical - AIIMS & Top GMCs (NEET-UG)
  {
    institution: 'AIIMS New Delhi',
    program: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
    type: 'AIIMS',
    location: 'Delhi',
    closingRanks: { OPEN: 57, OBC_NCL: 245, EWS: 220, SC: 980, ST: 1650, PWD: 15 },
    verifiedYear: 2024,
    counselingBody: 'MCC',
  },
  {
    institution: 'Maulana Azad Medical College (MAMC)',
    program: 'MBBS',
    type: 'GMC',
    location: 'Delhi',
    closingRanks: { OPEN: 89, OBC_NCL: 390, EWS: 340, SC: 1600, ST: 3200, PWD: 35 },
    verifiedYear: 2024,
    counselingBody: 'MCC',
  },
  {
    institution: 'AIIMS Rishikesh',
    program: 'MBBS',
    type: 'AIIMS',
    location: 'Uttarakhand',
    closingRanks: { OPEN: 780, OBC_NCL: 1650, EWS: 1400, SC: 8900, ST: 16400, PWD: 95 },
    verifiedYear: 2024,
    counselingBody: 'MCC',
  },
  {
    institution: 'King George Medical University (KGMU)',
    program: 'MBBS',
    type: 'GMC',
    location: 'Uttar Pradesh',
    closingRanks: { OPEN: 1250, OBC_NCL: 2300, EWS: 2100, SC: 14200, ST: 27000, PWD: 180 },
    verifiedYear: 2024,
    counselingBody: 'MCC',
  },
  {
    institution: 'Government Medical College (GMC) Chandigarh',
    program: 'MBBS',
    type: 'GMC',
    location: 'Chandigarh',
    closingRanks: { OPEN: 680, OBC_NCL: 1450, EWS: 1200, SC: 7800, ST: 15000, PWD: 75 },
    verifiedYear: 2024,
    counselingBody: 'MCC',
  },

  // Law - National Law Universities (CLAT)
  {
    institution: 'NLSIU Bengaluru',
    program: 'B.A. LL.B. (Hons.)',
    type: 'NLU',
    location: 'Karnataka',
    closingRanks: { OPEN: 114, OBC_NCL: 780, EWS: 590, SC: 2400, ST: 4200, PWD: 45 },
    verifiedYear: 2024,
    counselingBody: 'Consortium of NLUs',
  },
  {
    institution: 'NALSAR Hyderabad',
    program: 'B.A. LL.B. (Hons.)',
    type: 'NLU',
    location: 'Telangana',
    closingRanks: { OPEN: 185, OBC_NCL: 1150, EWS: 890, SC: 3600, ST: 6800, PWD: 65 },
    verifiedYear: 2024,
    counselingBody: 'Consortium of NLUs',
  },
  {
    institution: 'WBNUJS Kolkata',
    program: 'B.A. LL.B. (Hons.) / B.Sc. LL.B.',
    type: 'NLU',
    location: 'West Bengal',
    closingRanks: { OPEN: 280, OBC_NCL: 1650, EWS: 1350, SC: 5200, ST: 9400, PWD: 95 },
    verifiedYear: 2024,
    counselingBody: 'Consortium of NLUs',
  },
  {
    institution: 'NLU Jodhpur',
    program: 'B.B.A. LL.B. (Corporate Law Track)',
    type: 'NLU',
    location: 'Rajasthan',
    closingRanks: { OPEN: 390, OBC_NCL: 2200, EWS: 1800, SC: 6900, ST: 12500, PWD: 120 },
    verifiedYear: 2024,
    counselingBody: 'Consortium of NLUs',
  },

  // Central Universities - Commerce & Humanities (CUET)
  {
    institution: 'Shri Ram College of Commerce (SRCC), DU',
    program: 'B.Com (Hons.) / B.A. (Hons.) Economics',
    type: 'CENTRAL_UNIV',
    location: 'Delhi',
    closingRanks: { OPEN: 780, OBC_NCL: 2400, EWS: 1950, SC: 8800, ST: 15200, PWD: 140 },
    verifiedYear: 2024,
    counselingBody: 'DU Admissions',
  },
  {
    institution: "St. Stephen's College, DU",
    program: 'B.A. (Hons.) Economics / History',
    type: 'CENTRAL_UNIV',
    location: 'Delhi',
    closingRanks: { OPEN: 450, OBC_NCL: 1800, EWS: 1400, SC: 6400, ST: 11800, PWD: 85 },
    verifiedYear: 2024,
    counselingBody: 'DU Admissions',
  },
  {
    institution: 'Hindu College, DU',
    program: 'B.Sc. (Hons.) Statistics / Physics',
    type: 'CENTRAL_UNIV',
    location: 'Delhi',
    closingRanks: { OPEN: 950, OBC_NCL: 2900, EWS: 2400, SC: 9800, ST: 16800, PWD: 160 },
    verifiedYear: 2024,
    counselingBody: 'DU Admissions',
  },

  // Integrated Management - IIMs (IPMAT)
  {
    institution: 'IIM Indore',
    program: 'Integrated Programme in Management (IPM - 5 Year BBA+MBA)',
    type: 'IIM',
    location: 'Madhya Pradesh',
    closingRanks: { OPEN: 150, OBC_NCL: 520, EWS: 420, SC: 1600, ST: 2800, PWD: 30 },
    verifiedYear: 2024,
    counselingBody: 'IIM Admissions',
  },
  {
    institution: 'IIM Rohtak',
    program: 'Integrated Programme in Management (IPM - 5 Year)',
    type: 'IIM',
    location: 'Haryana',
    closingRanks: { OPEN: 280, OBC_NCL: 890, EWS: 720, SC: 2600, ST: 4400, PWD: 55 },
    verifiedYear: 2024,
    counselingBody: 'IIM Admissions',
  },
  {
    institution: 'IIM Ranchi',
    program: 'Integrated Programme in Management (IPM - 5 Year)',
    type: 'IIM',
    location: 'Jharkhand',
    closingRanks: { OPEN: 420, OBC_NCL: 1250, EWS: 1050, SC: 3800, ST: 6200, PWD: 80 },
    verifiedYear: 2024,
    counselingBody: 'IIM Admissions',
  },
];

export function calculateEstimatedRank(
  exam: NationalExam,
  scoreOrPercentile: number,
  category: IndianCategory = 'OPEN',
  state: string = 'All India'
): RankEstimateResult {
  let airMid = 50000;
  let percentile = 80;
  let totalCandidates = 1400000;

  switch (exam) {
    case 'JEE_MAIN': {
      totalCandidates = 1420000;
      percentile = Math.min(99.999, Math.max(1, scoreOrPercentile));
      airMid = Math.max(1, Math.round(((100 - percentile) / 100) * totalCandidates));
      break;
    }
    case 'NEET_UG': {
      totalCandidates = 2400000;
      const score = Math.min(720, Math.max(0, scoreOrPercentile));
      if (score >= 710) airMid = 50;
      else if (score >= 700) airMid = 300;
      else if (score >= 680) airMid = 1800;
      else if (score >= 650) airMid = 6500;
      else if (score >= 620) airMid = 18000;
      else if (score >= 580) airMid = 38000;
      else if (score >= 500) airMid = 98000;
      else airMid = Math.round(150000 + (500 - score) * 1200);
      percentile = Math.max(1, Math.min(99.99, 100 - (airMid / totalCandidates) * 100));
      break;
    }
    case 'CLAT': {
      totalCandidates = 65000;
      const score = Math.min(120, Math.max(0, scoreOrPercentile));
      if (score >= 105) airMid = 80;
      else if (score >= 95) airMid = 350;
      else if (score >= 85) airMid = 1100;
      else if (score >= 75) airMid = 2800;
      else if (score >= 65) airMid = 6200;
      else airMid = Math.round(8000 + (65 - score) * 450);
      percentile = Math.max(1, Math.min(99.99, 100 - (airMid / totalCandidates) * 100));
      break;
    }
    case 'CUET_UG': {
      totalCandidates = 1350000;
      percentile = Math.min(99.99, Math.max(1, scoreOrPercentile));
      airMid = Math.max(1, Math.round(((100 - percentile) / 100) * totalCandidates));
      break;
    }
    case 'IPMAT': {
      totalCandidates = 38000;
      percentile = Math.min(99.99, Math.max(1, scoreOrPercentile));
      airMid = Math.max(1, Math.round(((100 - percentile) / 100) * totalCandidates));
      break;
    }
  }

  const categoryRatios: Record<IndianCategory, number> = {
    OPEN: 1.0,
    OBC_NCL: 0.27,
    EWS: 0.10,
    SC: 0.15,
    ST: 0.075,
    PWD: 0.015,
  };

  const catRatio = categoryRatios[category] || 1.0;
  const categoryRankMid = Math.max(1, Math.round(airMid * catRatio));

  const minAir = Math.max(1, Math.round(airMid * 0.92));
  const maxAir = Math.round(airMid * 1.08);

  const minCat = Math.max(1, Math.round(categoryRankMid * 0.9));
  const maxCat = Math.round(categoryRankMid * 1.1);

  const relevantBenchmarks = HISTORICAL_BENCHMARKS.filter((b) => {
    if (exam === 'JEE_MAIN') return b.type === 'NIT' || b.type === 'IIIT';
    if (exam === 'NEET_UG') return b.type === 'AIIMS' || b.type === 'GMC';
    if (exam === 'CLAT') return b.type === 'NLU';
    if (exam === 'CUET_UG') return b.type === 'CENTRAL_UNIV';
    if (exam === 'IPMAT') return b.type === 'IIM';
    return false;
  });

  const eligibleInstitutions = relevantBenchmarks.map((b) => {
    const cutoff = b.closingRanks[category] || b.closingRanks.OPEN;
    let probability: 'HIGH' | 'MODERATE' | 'STRETCH' = 'STRETCH';

    const effectiveRank = category === 'OPEN' ? airMid : categoryRankMid;

    if (effectiveRank <= cutoff * 0.8) {
      probability = 'HIGH';
    } else if (effectiveRank <= cutoff * 1.08) {
      probability = 'MODERATE';
    } else {
      probability = 'STRETCH';
    }

    return {
      institution: b.institution,
      program: b.program,
      type: b.type,
      location: b.location,
      admissionProbability: probability,
      previousClosingRank: cutoff,
      counselingBody: b.counselingBody,
    };
  }).sort((a, b) => {
    const score = { HIGH: 1, MODERATE: 2, STRETCH: 3 };
    return score[a.admissionProbability] - score[b.admissionProbability];
  });

  let guidanceNote = '';
  if (airMid < 5000) {
    guidanceNote = `Outstanding academic percentile. You are positioned in the top ${((airMid / totalCandidates) * 100).toFixed(2)}% of the country, eligible for tier-1 national flagship branches through central counseling (${eligibleInstitutions[0]?.counselingBody || 'JoSAA'}).`;
  } else if (airMid < 30000) {
    guidanceNote = `Competitive standing. Strong prospects for core branches in top-tier institutions and premier branches in regional state institutions under Home State / Category quotas.`;
  } else {
    guidanceNote = `Moderate competitive range. Consider backup state entrance tests (MHT-CET, KCET, WBJEE, COMEDK), dual-degree paths, or evaluating viable stream pivots under NEP 2020.`;
  }

  return {
    exam,
    scoreOrPercentile,
    category,
    state,
    estimatedAllIndiaRank: {
      min: minAir,
      max: maxAir,
      midpoint: airMid,
    },
    estimatedCategoryRank: {
      min: minCat,
      max: maxCat,
      midpoint: categoryRankMid,
    },
    percentileEquivalent: Number(percentile.toFixed(2)),
    eligibleInstitutions,
    guidanceNote,
  };
}
