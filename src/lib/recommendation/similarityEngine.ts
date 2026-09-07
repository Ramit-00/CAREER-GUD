import { Career } from '@/types';
import { SEED_CAREERS } from '../data/seedData';

// Vocabulary of interest and skill dimensions
const FEATURE_VOCABULARY = [
  'mathematics',
  'coding',
  'algorithms',
  'biology',
  'medicine',
  'anatomy',
  'business',
  'finance',
  'accounting',
  'law',
  'governance',
  'design',
  'creativity',
  'psychology',
  'aviation',
  'physics',
  'writing',
  'research',
  'public_speaking',
  'systems',
];

function vectorizeText(tokens: string[]): number[] {
  const lowerTokens = tokens.map((t) => t.toLowerCase());
  return FEATURE_VOCABULARY.map((feat) => {
    let count = 0;
    lowerTokens.forEach((tok) => {
      if (tok.includes(feat) || feat.includes(tok)) {
        count += 1;
      }
    });
    return count;
  });
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const similarityEngine = {
  findAdjacentCareers(
    studentInterests: string[],
    excludeCareerSlugs: string[] = [],
    limit = 3
  ): Array<{ career: Career; similarityScore: number }> {
    if (!studentInterests || studentInterests.length === 0) {
      return SEED_CAREERS.filter((c) => !excludeCareerSlugs.includes(c.slug))
        .slice(0, limit)
        .map((c) => ({ career: c, similarityScore: 0.85 }));
    }

    const studentVector = vectorizeText(studentInterests);

    const scored = SEED_CAREERS.filter((c) => !excludeCareerSlugs.includes(c.slug)).map((career) => {
      const careerTokens = [
        ...career.requiredSkills,
        career.streamCategory,
        career.title,
        career.description,
      ];
      const careerVector = vectorizeText(careerTokens);
      const similarity = cosineSimilarity(studentVector, careerVector);

      return {
        career,
        similarityScore: similarity > 0 ? Number((similarity * 100).toFixed(1)) : 68.5,
      };
    });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  },
};
