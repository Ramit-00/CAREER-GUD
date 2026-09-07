import { SEED_CAREERS, SEED_COLLEGES } from '../data/seedData';

export interface RagRetrievalResult {
  groundingContext: string;
  citations: Array<{
    type: 'CAREER' | 'COLLEGE' | 'EXAM' | 'STREAM';
    title: string;
    link?: string;
    snippet?: string;
  }>;
}

export const ragRetriever = {
  retrieveContext(query: string): RagRetrievalResult {
    const q = query.toLowerCase();
    const matchedCareers = SEED_CAREERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.slug.includes(q) ||
        c.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
        c.streamCategory.toLowerCase().includes(q) ||
        (q.includes('doctor') && c.slug === 'mbbs-doctor') ||
        (q.includes('engineer') && (c.slug === 'ai-ml-engineer' || c.slug === 'fullstack-software-engineer')) ||
        (q.includes('pilot') && c.slug === 'commercial-pilot') ||
        (q.includes('law') && c.slug === 'corporate-lawyer') ||
        (q.includes('ca') && c.slug === 'chartered-accountant') ||
        (q.includes('salary') && c.slug === 'ai-ml-engineer')
    ).slice(0, 3);

    const matchedColleges = SEED_COLLEGES.filter(
      (col) =>
        col.name.toLowerCase().includes(q) ||
        col.shortName.toLowerCase().includes(q) ||
        col.city.toLowerCase().includes(q) ||
        col.state.toLowerCase().includes(q) ||
        col.programs.some((p) => p.name.toLowerCase().includes(q)) ||
        (q.includes('iit') && col.shortName.includes('IIT')) ||
        (q.includes('medical') && col.shortName.includes('AIIMS'))
    ).slice(0, 2);

    const citations: RagRetrievalResult['citations'] = [];
    const contextBlocks: string[] = [];

    matchedCareers.forEach((c) => {
      citations.push({
        type: 'CAREER',
        title: c.title,
        link: `/careers/${c.slug}`,
        snippet: `${c.streamLabel} | Avg Salary: ${c.outlook.avgSalaryRangeINR.entry} - ${c.outlook.avgSalaryRangeINR.senior} | Automation Exposure: ${c.outlook.automationRiskLabel}`,
      });

      contextBlocks.push(`
[CAREER PROFILE: ${c.title} (Slug: ${c.slug})]
- Stream Requirement: ${c.eligibility.streamRequirement}
- Mandatory Subjects: ${c.eligibility.mandatorySubjects.join(', ')}
- Entrance Exams: ${c.eligibility.topEntranceExams.join(', ')}
- Degrees: ${c.eligibility.typicalDegrees.join(', ')}
- Future Outlook: ${c.outlook.demandTrendLabel}, Automation Risk Score: ${c.outlook.automationRiskScore} (${c.outlook.automationRiskLabel})
- Salary Range in India: Entry: ${c.outlook.avgSalaryRangeINR.entry}, Mid: ${c.outlook.avgSalaryRangeINR.mid}, Senior: ${c.outlook.avgSalaryRangeINR.senior}
- Real Growth Notes: ${c.outlook.growthNotes}
`);
    });

    matchedColleges.forEach((col) => {
      citations.push({
        type: 'COLLEGE',
        title: col.name,
        link: `/colleges/${col.slug}`,
        snippet: `NIRF #${col.nirfRank ?? 'N/A'} | Avg Package: ${col.placementStats.avgPackageINR} | Top Recruiters: ${col.placementStats.topRecruiters.slice(0, 3).join(', ')}`,
      });

      contextBlocks.push(`
[COLLEGE PROFILE: ${col.name} (${col.shortName})]
- Location: ${col.city}, ${col.state} | Type: ${col.type} | NIRF Rank: ${col.nirfRank ?? 'N/A'}
- Placement Avg Package: ${col.placementStats.avgPackageINR}, Highest: ${col.placementStats.highestPackageINR}
- Top Recruiters: ${col.placementStats.topRecruiters.join(', ')}
- Programs: ${col.programs.map((p) => `${p.name} (Fees: ${p.feesPerYearINR}, Exams: ${p.entranceExams.join(', ')})`).join('; ')}
`);
    });

    return {
      groundingContext: contextBlocks.join('\n\n'),
      citations,
    };
  },
};
