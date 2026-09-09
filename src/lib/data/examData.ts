export interface NationalExam {
  id: string;
  name: string;
  fullName: string;
  conductingBody: string;
  officialWebsite: string;
  wikipediaUrl: string;
  streamEligibility: string;
  openToAllStreams: boolean;
  purposeAndDegrees: string;
  formatAndFrequency: string;
  annualAspirants: string;
  selectionRatioReality: string;
  keyInstitutions: string[];
  summary: string;
}

export const EXAM_REGISTRY: Record<string, NationalExam> = {
  'JEE Main': {
    id: 'jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination (Main)',
    conductingBody: 'National Testing Agency (NTA)',
    officialWebsite: 'https://jeemain.nta.nic.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Joint_Entrance_Examination',
    streamEligibility: 'Class 12 with Physics, Mathematics, and Chemistry/Computer Science.',
    openToAllStreams: false,
    purposeAndDegrees: 'Admissions to B.Tech, B.E., B.Arch, and B.Planning at 31 NITs, 26 IIITs, and Centrally Funded Technical Institutes (CFTIs); serves as the preliminary screening qualifier for JEE Advanced.',
    formatAndFrequency: 'Computer Based Test (CBT), held in two sessions annually (January & April). Total 300 marks.',
    annualAspirants: '~14.2 Lakh unique candidates registered annually.',
    selectionRatioReality: 'Top ~2.5 lakh candidates qualify for JEE Advanced. Top 30,000 secure core computer science or electronics seats across Tier-1 NITs/IIITs (~2.1% practical success rate).',
    keyInstitutions: ['NIT Trichy', 'NIT Surathkal', 'IIIT Hyderabad', 'IIIT Allahabad', 'DTU Delhi', 'NSUT Delhi'],
    summary: 'The primary gateway examination for engineering education in India, benchmarking quantitative problem solving, speed, and analytical endurance in Physics, Chemistry, and Mathematics.',
  },
  'JEE Advanced': {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination (Advanced)',
    conductingBody: 'Joint Admission Board (JAB) / Rotational IIT (e.g. IIT Madras/IIT Delhi)',
    officialWebsite: 'https://jeeadv.ac.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Joint_Entrance_Examination_%E2%80%93_Advanced',
    streamEligibility: 'Class 12 PCM + Qualified among top 2,50,000 candidates in JEE Main.',
    openToAllStreams: false,
    purposeAndDegrees: 'Sole entrance examination for undergraduate B.Tech, BS, Dual Degree, and Integrated M.Tech programs across all 23 Indian Institutes of Technology (IITs).',
    formatAndFrequency: 'Computer Based Test (CBT), consisting of two mandatory 3-hour papers on the same day. Conducted once a year (May/June).',
    annualAspirants: '~1.8 Lakh qualified candidates appear.',
    selectionRatioReality: '~17,385 total seats across all 23 IITs. Computer Science at Top 7 old IITs requires an All India Rank within the top 600 (~0.3% of test takers).',
    keyInstitutions: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur', 'IIT Roorkee', 'IIT Guwahati'],
    summary: 'Globally recognized for extreme problem-solving depth, testing multi-concept analytical reasoning rather than formulaic rote reproduction.',
  },
  'NEET-UG': {
    id: 'neet-ug',
    name: 'NEET-UG',
    fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    conductingBody: 'National Testing Agency (NTA)',
    officialWebsite: 'https://neet.nta.nic.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Eligibility_cum_Entrance_Test_(Undergraduate)',
    streamEligibility: 'Class 12 with Physics, Chemistry, Biology/Biotechnology, and English (minimum 50% aggregate for General category).',
    openToAllStreams: false,
    purposeAndDegrees: 'Single nationwide entrance test for MBBS, BDS, BAMS, BHMS, BUMS, and BSMS programs in all medical and dental colleges across India, including AIIMS and JIPMER.',
    formatAndFrequency: 'Pen and paper (OMR) test conducted once annually (May). 720 total marks across Physics, Chemistry, and Biology (Botany + Zoology).',
    annualAspirants: '~24 Lakh candidates registered annually.',
    selectionRatioReality: '~55,000 government medical college (GMC) MBBS seats nationwide. Securing a subsidized government seat requires scoring 630+ out of 720 (top 2.3% of candidates).',
    keyInstitutions: ['AIIMS New Delhi', 'CMC Vellore', 'JIPMER Puducherry', 'KGMU Lucknow', 'Maulana Azad Medical College (MAMC)'],
    summary: 'The statutory entrance test for modern medicine and clinical dentistry in India, demanding meticulous NCERT retention and rapid, error-free recall.',
  },
  'IPMAT': {
    id: 'ipmat',
    name: 'IPMAT',
    fullName: 'Integrated Program in Management Aptitude Test',
    conductingBody: 'Indian Institute of Management Indore (IIM Indore)',
    officialWebsite: 'https://www.iimidr.ac.in/academic-programmes/ipm/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Indian_Institute_of_Management_Indore#Integrated_Program_in_Management_(IPM)',
    streamEligibility: 'Class 12 in ANY stream (Science PCM/PCB, Commerce, Arts/Humanities) with minimum 60% aggregate.',
    openToAllStreams: true,
    purposeAndDegrees: 'Direct entry after Class 12 into a prestigious 5-Year Integrated Program in Management (BBA + MBA) at IIM Indore, IIM Rohtak, and IIM Ranchi without needing to appear for CAT later.',
    formatAndFrequency: 'Computer Based Test (CBT) covering Quantitative Ability (Multiple Choice & Short Answer) and Verbal Ability. Followed by Personal Interview (PI).',
    annualAspirants: '~30,000 candidates appear.',
    selectionRatioReality: '~150 seats at IIM Indore. Exceptional cross-stream vehicle for students with strong logical aptitude who want premier corporate leadership careers.',
    keyInstitutions: ['IIM Indore', 'IIM Rohtak', 'IIM Ranchi', 'Nirma University', 'IIFT Kakinada'],
    summary: 'A premier alternative for ambitious Class 12 students across all streams (including PCM and PCB) to secure an IIM MBA without the uncertainty of post-graduation CAT competitive exams.',
  },
  'CLAT': {
    id: 'clat',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    conductingBody: 'Consortium of National Law Universities (NLUs)',
    officialWebsite: 'https://consortiumofnlus.ac.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Common_Law_Admission_Test',
    streamEligibility: 'Class 12 in ANY discipline (Science PCM/PCB, Commerce, Humanities) with minimum 45% marks.',
    openToAllStreams: true,
    purposeAndDegrees: 'Admissions to 5-Year Integrated Law Programs (B.A. LL.B. Hons, B.B.A. LL.B. Hons, B.Sc. LL.B. Hons) at 24 National Law Universities across India.',
    formatAndFrequency: 'Pen-and-paper test held once annually in December. 120 comprehension-based questions testing English, Current Affairs/GK, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.',
    annualAspirants: '~65,000 candidates appear.',
    selectionRatioReality: '~3,200 total seats across all 24 NLUs. Top 3 NLUs (NLSIU Bengaluru, NALSAR Hyderabad, WBNUJS Kolkata) require an All India Rank within the top 350.',
    keyInstitutions: ['NLSIU Bengaluru', 'NALSAR Hyderabad', 'WBNUJS Kolkata', 'NLU Jodhpur', 'GNLU Gandhinagar'],
    summary: 'The premier legal aptitude test in India. Ideal for articulate thinkers, debate enthusiasts, and analytical minds from any educational stream seeking lucrative corporate law or judicial careers.',
  },
  'UCEED': {
    id: 'uceed',
    name: 'UCEED',
    fullName: 'Undergraduate Common Entrance Examination for Design',
    conductingBody: 'Indian Institute of Technology Bombay (IIT Bombay)',
    officialWebsite: 'https://www.uceed.iitb.ac.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Undergraduate_Common_Entrance_Examination_for_Design',
    streamEligibility: 'Class 12 in ANY stream for B.Des at IIT Guwahati/DMJ Jabalpur; Class 12 PCM required specifically for B.Des at IIT Bombay, IIT Delhi, and IIT Hyderabad.',
    openToAllStreams: true,
    purposeAndDegrees: 'Admissions to the Bachelor of Design (B.Des) program at premier IITs (Bombay, Delhi, Guwahati, Hyderabad, Roorkee) and IIITDM Jabalpur.',
    formatAndFrequency: 'Computer-based (Part A: Visualization, spatial ability, design observation) + Pen-and-paper drawing (Part B: Hand sketching and perspective). Held in January.',
    annualAspirants: '~15,000 candidates.',
    selectionRatioReality: '~205 total seats across IIT design departments. High prestige with immediate placement into technology product design, automotive design, and UX design.',
    keyInstitutions: ['IIT Bombay Industrial Design Centre (IDC)', 'IIT Delhi', 'IIT Guwahati', 'IIT Hyderabad', 'IIITDM Jabalpur'],
    summary: 'A top cross-stream pathway for creative thinkers who bridge engineering logic, spatial visualization, human psychology, and digital product experience.',
  },
  'BITSAT': {
    id: 'bitsat',
    name: 'BITSAT',
    fullName: 'BITS Admission Test',
    conductingBody: 'Birla Institute of Technology and Science (BITS Pilani)',
    officialWebsite: 'https://www.bitsadmission.com/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/BITSAT',
    streamEligibility: 'Class 12 PCM with minimum 75% aggregate in Physics, Chemistry, and Mathematics (and at least 60% in each individual subject).',
    openToAllStreams: false,
    purposeAndDegrees: 'Admissions to integrated first-degree programs (B.E., M.Sc. Dual Degree) across BITS Pilani (Pilani, Goa, and Hyderabad campuses).',
    formatAndFrequency: 'Computer-based test (CBT) with 130 questions across Physics, Chemistry, Mathematics, English Proficiency, and Logical Reasoning. Conducted in two sessions (May & June).',
    annualAspirants: '~3 Lakh candidates appear.',
    selectionRatioReality: '~3,000 total seats across campuses. BITS Pilani Computer Science typically requires a 320+/390 cutoff score, matching the prestige of Top 7 IITs with zero reservation quotas.',
    keyInstitutions: ['BITS Pilani (Main Campus)', 'BITS Pilani Goa Campus', 'BITS Pilani Hyderabad Campus'],
    summary: 'One of the most competitive private engineering entrance examinations in Asia, renowned for testing raw processing speed and accuracy.',
  },
  'CUET-UG': {
    id: 'cuet-ug',
    name: 'CUET-UG',
    fullName: 'Common University Entrance Test (Undergraduate)',
    conductingBody: 'National Testing Agency (NTA)',
    officialWebsite: 'https://cuetug.ntaonline.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Common_University_Entrance_Test',
    streamEligibility: 'Class 12 passed or appearing in any stream (subject mappings determined by chosen degree requirements).',
    openToAllStreams: true,
    purposeAndDegrees: 'Single window admission test for undergraduate degree programs (BA Hons, B.Com Hons, B.Sc Hons, BBA, BMS) across 45+ Central Universities and 200+ participating institutions.',
    formatAndFrequency: 'Hybrid / Computer Based Test across Language tests, Domain-specific subjects, and General Aptitude test. Held in May/June.',
    annualAspirants: '~14 Lakh applicants.',
    selectionRatioReality: 'Flagship programs like B.Com (Hons) and B.A. Economics (Hons) at SRCC, St. Stephen’s, Hindu, and Lady Shri Ram College require 99+ percentile scores.',
    keyInstitutions: ['Shri Ram College of Commerce (SRCC)', 'St. Stephen’s College Delhi', 'Hindu College', 'JNU New Delhi', 'BHU Varanasi'],
    summary: 'The universal benchmark for non-engineering and non-medical admissions, unifying central university admissions under a standardized percentile metric.',
  },
  'CA Foundation': {
    id: 'ca-foundation',
    name: 'CA Foundation',
    fullName: 'Chartered Accountancy Foundation Examination',
    conductingBody: 'Institute of Chartered Accountants of India (ICAI)',
    officialWebsite: 'https://www.icai.org/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Institute_of_Chartered_Accountants_of_India#Chartered_Accountant_Course',
    streamEligibility: 'Class 12 in ANY stream (Commerce, Science, or Arts). Mathematics is helpful but not statutory.',
    openToAllStreams: true,
    purposeAndDegrees: 'Entry-level examination for the professional Chartered Accountancy (CA) qualification regulated by the Parliament of India under the CA Act, 1949.',
    formatAndFrequency: 'Conducted thrice annually (January, May/June, September). 4 papers: Accounting, Business Laws, Quantitative Aptitude, and Business Economics.',
    annualAspirants: '~1.2 Lakh candidates appear per cycle.',
    selectionRatioReality: 'Passing rate is typically ~18% to 25% (requires 40% per subject and 50% aggregate). Open to all streams with dedication to statutory finance and taxation.',
    keyInstitutions: ['Institute of Chartered Accountants of India (ICAI - Statutory Body)'],
    summary: 'The statutory credential required to audit public and private corporations, practice corporate taxation, and advise financial institutions in India.',
  },
  'NDA': {
    id: 'nda',
    name: 'NDA & NA Exam',
    fullName: 'National Defence Academy & Naval Academy Examination',
    conductingBody: 'Union Public Service Commission (UPSC)',
    officialWebsite: 'https://upsc.gov.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Defence_Academy_(India)',
    streamEligibility: 'Army Wing: Class 12 in ANY stream. Air Force & Naval Wings: Class 12 with Physics and Mathematics (PCM). Age: 16.5 to 19.5 years.',
    openToAllStreams: true,
    purposeAndDegrees: 'Selection of commissioned officers for the Indian Army, Indian Navy, and Indian Air Force. Cadets graduate with a B.Tech / B.Sc / B.A. degree from JNU while receiving elite military training.',
    formatAndFrequency: 'Conducted twice a year (NDA-I in April, NDA-II in September). Written test (Maths 300 marks + General Ability 600 marks) followed by the 5-day Services Selection Board (SSB) Interview.',
    annualAspirants: '~5 to 6 Lakh candidates appear.',
    selectionRatioReality: '~400 cadet seats per course. Requires high fitness, officer-like qualities (OLQs), and mental fortitude (~0.1% final selection rate).',
    keyInstitutions: ['National Defence Academy (Khadakwasla, Pune)', 'Indian Naval Academy (Ezhimala)'],
    summary: 'The premier joint military academy in India, commissioning disciplined leaders directly into the Armed Forces with full government sponsorship.',
  },
  'NATA': {
    id: 'nata',
    name: 'NATA',
    fullName: 'National Aptitude Test in Architecture',
    conductingBody: 'Council of Architecture (COA)',
    officialWebsite: 'https://www.nata.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Aptitude_Test_in_Architecture',
    streamEligibility: 'Class 12 with Physics and Mathematics as mandatory subjects, or 10+3 Diploma with Mathematics.',
    openToAllStreams: false,
    purposeAndDegrees: 'Mandatory qualifying examination for admission to the 5-Year Bachelor of Architecture (B.Arch) degree program in all recognized architecture schools across India.',
    formatAndFrequency: 'Computer-based and drawing assessment conducted in multiple phases between April and July each year.',
    annualAspirants: '~50,000 candidates.',
    selectionRatioReality: 'Qualifying score required for state university and private architectural institutions; Tier-1 seats require strong portfolio and board-exam composite score.',
    keyInstitutions: ['CEPT University Ahmedabad', 'Sir J.J. College of Architecture Mumbai', 'School of Planning and Architecture (SPA Delhi/Bhopal/Vijayawada)'],
    summary: 'Tests architectural drawing aptitude, spatial ability, perspective geometry, and visual perception alongside basic engineering mathematics.',
  },
  'IISER IAT': {
    id: 'iiser-iat',
    name: 'IISER IAT',
    fullName: 'IISER Aptitude Test',
    conductingBody: 'Joint Admissions Committee for IISERs',
    officialWebsite: 'https://iiseradmission.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Indian_Institutes_of_Science_Education_and_Research',
    streamEligibility: 'Class 12 with at least three subjects among Biology, Chemistry, Mathematics, and Physics (PCM, PCB, or PCMB).',
    openToAllStreams: false,
    purposeAndDegrees: 'Primary admission channel for 5-Year BS-MS Dual Degree programs in Biological, Chemical, Physical, Geological, and Mathematical Sciences at 7 IISERs, IISc Bangalore, and IIT Madras.',
    formatAndFrequency: 'Computer Based Test with 60 questions equally divided across Biology, Chemistry, Mathematics, and Physics. Held in June.',
    annualAspirants: '~1.5 Lakh applicants.',
    selectionRatioReality: '~1,900 seats across all IISER campuses. Ideal for students passionate about genuine scientific discovery, computational biology, and research careers over routine jobs.',
    keyInstitutions: ['IISc Bangalore', 'IISER Pune', 'IISER Kolkata', 'IISER Mohali', 'IISER Bhopal', 'IISER Thiruvananthapuram'],
    summary: 'A world-class pathway for PCM and PCB students who want to become research scientists, biotechnology innovators, and academic pioneers in pure sciences.',
  },
  'NID DAT': {
    id: 'nid-dat',
    name: 'NID DAT',
    fullName: 'National Institute of Design - Design Aptitude Test',
    conductingBody: 'National Institute of Design (NID)',
    officialWebsite: 'https://admissions.nid.edu/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Institute_of_Design',
    streamEligibility: 'Class 12 in ANY stream (Science, Commerce, Arts, Humanities).',
    openToAllStreams: true,
    purposeAndDegrees: 'Admissions to the 4-Year Bachelor of Design (B.Des) program across NID Ahmedabad and its regional campuses.',
    formatAndFrequency: 'Two-tier exam: DAT Prelims (written/objective design aptitude) in January, followed by DAT Mains (hands-on studio test and material handling) in April/May.',
    annualAspirants: '~30,000 candidates.',
    selectionRatioReality: '~425 total B.Des seats across all NID campuses (~1.4% acceptance rate). Premier institute for industrial, communication, and digital design.',
    keyInstitutions: ['NID Ahmedabad', 'NID Gandhinagar', 'NID Bengaluru', 'NID Haryana', 'NID Madhya Pradesh'],
    summary: 'India’s apex design institution, offering cross-stream students direct entry into global creative leadership, automotive styling, and human-computer interaction.',
  },
  'CAT': {
    id: 'cat',
    name: 'CAT',
    fullName: 'Common Admission Test',
    conductingBody: 'Indian Institutes of Management (Rotational IIM)',
    officialWebsite: 'https://iimcat.ac.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Common_Admission_Test',
    streamEligibility: 'Bachelor’s degree in ANY discipline (B.Tech, MBBS, B.Com, B.A., B.Sc) with minimum 50% marks.',
    openToAllStreams: true,
    purposeAndDegrees: 'Postgraduate admissions to MBA / PGDM programs at all 21 IIMs, FMS Delhi, SPJIMR Mumbai, and top Indian business schools.',
    formatAndFrequency: 'Computer Based Test held annually in November. Three sections: Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), and Quantitative Ability (QA).',
    annualAspirants: '~3.3 Lakh candidates.',
    selectionRatioReality: 'Securing an interview call from IIM Ahmedabad, Bangalore, or Calcutta typically requires a 99.5+ percentile score alongside a strong academic profile.',
    keyInstitutions: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'FMS Delhi', 'IIM Lucknow', 'XLRI Jamshedpur'],
    summary: 'The definitive postgraduate corporate leadership test in India, allowing engineering, medical, and humanities graduates to pivot into high-compensation executive careers.',
  },
  'GATE': {
    id: 'gate',
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    conductingBody: 'IITs and IISc on behalf of National Coordination Board (NCB) - GATE',
    officialWebsite: 'https://gate.iitb.ac.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Graduate_Aptitude_Test_in_Engineering',
    streamEligibility: 'Bachelor’s degree in Engineering, Technology, Architecture, or Master’s degree in Science.',
    openToAllStreams: false,
    purposeAndDegrees: 'Master of Technology (M.Tech) admissions at IITs/IISc, research fellowships, and recruitment into top Maharatna/Navratna Public Sector Undertakings (PSUs: ONGC, IOCL, NTPC, BHEL, ISRO).',
    formatAndFrequency: 'Computer Based Test in February across 30 engineering and scientific subjects.',
    annualAspirants: '~8.5 Lakh candidates.',
    selectionRatioReality: 'Top 500 ranks in Computer Science, Mechanical, and Electrical secure direct PSU appointments with ₹18+ LPA starting packages and government benefits.',
    keyInstitutions: ['IISc Bangalore', 'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur'],
    summary: 'The benchmark postgraduate engineering assessment in India, combining pathways to deep research and guaranteed public sector leadership.',
  },
  'UPSC CSE': {
    id: 'upsc-cse',
    name: 'UPSC CSE',
    fullName: 'Civil Services Examination',
    conductingBody: 'Union Public Service Commission (UPSC)',
    officialWebsite: 'https://upsc.gov.in/',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Civil_Services_Examination',
    streamEligibility: 'Graduation degree in ANY discipline (B.Tech, MBBS, B.Com, B.A., B.Sc) from a recognized university. Age 21 to 32.',
    openToAllStreams: true,
    purposeAndDegrees: 'Recruitment of executive administrative officers for the Government of India into the Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and IRS.',
    formatAndFrequency: 'Three-stage annual examination: Prelims (General Studies + CSAT), Mains (9 descriptive papers), and Personality Test / Interview.',
    annualAspirants: '~11 to 13 Lakh applicants.',
    selectionRatioReality: '~1,000 final selections annually across all central services (~0.09% success rate).',
    keyInstitutions: ['Lal Bahadur Shastri National Academy of Administration (LBSNAA Mussoorie)', 'Sardar Vallabhbhai Patel National Police Academy (SVPNPA Hyderabad)'],
    summary: 'The highest administrative examination in India, offering incomparable societal influence, governance authority, and public service impact.',
  },
};

/**
 * Helper to find an exam from registry by exact or fuzzy name
 */
export function getExamByName(name: string): NationalExam | null {
  if (!name) return null;
  const trimmed = name.trim();

  // Exact match
  if (EXAM_REGISTRY[trimmed]) {
    return EXAM_REGISTRY[trimmed];
  }

  // Common aliases
  const aliases: Record<string, string> = {
    'jee': 'JEE Main',
    'jee-main': 'JEE Main',
    'jee advanced': 'JEE Advanced',
    'jee-advanced': 'JEE Advanced',
    'neet': 'NEET-UG',
    'neet ug': 'NEET-UG',
    'neet-ug': 'NEET-UG',
    'ipm': 'IPMAT',
    'ipmat indore': 'IPMAT',
    'clat': 'CLAT',
    'uceed': 'UCEED',
    'bits': 'BITSAT',
    'bitsat': 'BITSAT',
    'cuet': 'CUET-UG',
    'cuet-ug': 'CUET-UG',
    'ca': 'CA Foundation',
    'ca foundation': 'CA Foundation',
    'nda': 'NDA',
    'nata': 'NATA',
    'iiser': 'IISER IAT',
    'iiser iat': 'IISER IAT',
    'nid': 'NID DAT',
    'nid dat': 'NID DAT',
    'cat': 'CAT',
    'gate': 'GATE',
    'upsc': 'UPSC CSE',
    'upsc cse': 'UPSC CSE',
  };

  const lower = trimmed.toLowerCase();
  if (aliases[lower]) {
    return EXAM_REGISTRY[aliases[lower]] || null;
  }

  // Substring match
  for (const [key, exam] of Object.entries(EXAM_REGISTRY)) {
    if (key.toLowerCase().includes(lower) || exam.fullName.toLowerCase().includes(lower)) {
      return exam;
    }
  }

  return null;
}
