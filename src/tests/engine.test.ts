import assert from 'node:assert';
import test from 'node:test';
import { aiGuardrails } from '../lib/ai/guardrails';
import { repository } from '../lib/data/repository';
import { realismValidator } from '../lib/recommendation/realismValidator';
import { scoringEngine } from '../lib/recommendation/scoringEngine';
import { similarityEngine } from '../lib/recommendation/similarityEngine';

test('scoringEngine: 10th-grade PCM preference logic', () => {
  const answers = {
    q1: 'q10_1_a', // breaks down into math steps
    q2: 'q10_2_a', // loves Class 10 math proofs
    q3: 'q10_3_a', // building a robot / drone
    q4: 'q10_4_a', // first principles deduction
  };

  const result = scoringEngine.calculate10thStreamResult(answers, {
    tenthPercentage: 88,
    mathScore: 92,
    scienceScore: 89,
  });

  assert.strictEqual(result.primaryRecommendation.streamCategory, 'SCIENCE_PCM');
  assert.ok(result.primaryRecommendation.matchPercentage > 80);
  assert.strictEqual(result.realismCheck.status, 'GREEN');
  assert.ok(result.primaryRecommendation.actionPlan.length >= 3);
});

test('scoringEngine: 10th-grade PCB preference logic', () => {
  const answers = {
    q1: 'q10_1_b', // living organisms
    q2: 'q10_2_b', // prefers practical application
    q3: 'q10_3_b', // hospital/animal volunteering
    q4: 'q10_4_b', // anatomical memory
  };

  const result = scoringEngine.calculate10thStreamResult(answers, {
    tenthPercentage: 82,
    scienceScore: 90,
  });

  assert.strictEqual(result.primaryRecommendation.streamCategory, 'SCIENCE_PCB');
  assert.ok(result.primaryRecommendation.matchPercentage > 75);
  assert.ok(result.primaryRecommendation.recommendedSubjects?.includes('Biology (Botany & Zoology)'));
});

test('realismValidator: Flags low math score for PCM stream', () => {
  const check = realismValidator.validate10thStreamChoice('SCIENCE_PCM', 60, 52, 65);
  assert.strictEqual(check.status, 'RED');
  assert.ok(check.headline.includes('High Friction Warning'));
  assert.ok(check.prerequisiteGaps.length > 0);
  assert.ok(check.workloadReality.includes('JEE competition'));
});

test('similarityEngine: surfaces adjacent careers via cosine similarity', () => {
  const adjacent = similarityEngine.findAdjacentCareers(
    ['algorithms', 'coding', 'mathematics', 'cloud'],
    ['ai-ml-engineer'],
    2
  );

  assert.strictEqual(adjacent.length, 2);
  assert.ok(adjacent[0].similarityScore > 0);
  assert.notStrictEqual(adjacent[0].career.slug, 'ai-ml-engineer');
});

test('aiGuardrails: detects distress keywords and intercepts safely', () => {
  const res = aiGuardrails.evaluateMessage('I feel completely hopeless and want to kill myself');
  assert.strictEqual(res.passed, false);
  assert.strictEqual(res.category, 'DISTRESS');
  assert.ok(res.interceptMessage?.includes('Tele-MANAS'));
  assert.ok(res.interceptMessage?.includes('14416'));
});

test('aiGuardrails: intercepts inappropriate romantic roleplay', () => {
  const res = aiGuardrails.evaluateMessage('Can you be my girlfriend and flirt with me?');
  assert.strictEqual(res.passed, false);
  assert.ok(res.interceptMessage?.includes('academic and career advisor'));
});

test('repository: strict domain verification check for consultants', async () => {
  // Dr. Ananya Sharma is verified in MEDICAL and OVERSEAS, rejected in ENGINEERING
  const medicalConsultants = await repository.getConsultants('MEDICAL');
  const engineeringConsultants = await repository.getConsultants('ENGINEERING');

  assert.ok(medicalConsultants.some((c) => c.name === 'Dr. Ananya Sharma'));
  assert.ok(!engineeringConsultants.some((c) => c.name === 'Dr. Ananya Sharma'));
});
