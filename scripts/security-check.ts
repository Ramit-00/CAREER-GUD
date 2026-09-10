import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface SecurityCheckResult {
  category: string;
  name: string;
  passed: boolean;
  message?: string;
}

const results: SecurityCheckResult[] = [];

function recordCheck(category: string, name: string, passed: boolean, message?: string) {
  results.push({ category, name, passed, message });
  const symbol = passed ? '✅' : '❌';
  console.log(`${symbol} [${category}] ${name}${message ? ` - ${message}` : ''}`);
}

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Gitignore & Secret File Checks
function checkGitIgnore() {
  const gitignorePath = path.join(ROOT_DIR, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    recordCheck('SECRETS', '.gitignore exists', false, '.gitignore file is missing');
    return;
  }
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  const hasEnv = content.includes('.env');
  const hasEnvLocal = content.includes('.env*.local') || content.includes('.env.local');

  recordCheck('SECRETS', '.gitignore ignores .env', hasEnv, hasEnv ? 'Correctly ignores .env' : 'Missing .env in .gitignore');
  recordCheck('SECRETS', '.gitignore ignores .env.local', hasEnvLocal, hasEnvLocal ? 'Correctly ignores .env*.local' : 'Missing .env*.local in .gitignore');

  try {
    const trackedFiles = execSync('git ls-files', { cwd: ROOT_DIR, encoding: 'utf-8' }).split('\n');
    const trackedEnv = trackedFiles.some((f) => f.trim() === '.env' || f.trim() === '.env.local');
    recordCheck('SECRETS', 'No .env files tracked in git', !trackedEnv, trackedEnv ? 'CRITICAL: .env or .env.local is tracked in git!' : 'Zero .env files tracked in git');
  } catch (err) {
    recordCheck('SECRETS', 'Git tracking check', false, String(err));
  }
}

// 2. Sensitive Credential & Pattern Scan in Codebase
function checkHardcodedSecrets() {
  const SENSITIVE_PATTERNS = [
    { name: 'Private Admin Test Email', pattern: /testadmin35709@gmail\.com/i },
    { name: 'Google API Key', pattern: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'Hardcoded Admin Password Assignment', pattern: /ADMIN_PASSWORD\s*=\s*['"][^'"]+['"]/ },
    { name: 'Direct Database Password in Source', pattern: /postgres:\/\/[^:]+:[^@]+@/i },
    { name: 'Stripe Secret Key', pattern: /sk_live_[0-9a-zA-Z]{24}/ },
  ];

  try {
    const trackedFiles = execSync('git ls-files', { cwd: ROOT_DIR, encoding: 'utf-8' })
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f && !f.endsWith('.png') && !f.endsWith('.jpg') && !f.endsWith('.ico') && !f.endsWith('.svg'));

    let violations = 0;
    for (const relFile of trackedFiles) {
      const fullPath = path.join(ROOT_DIR, relFile);
      if (!fs.existsSync(fullPath)) continue;
      // Skip this script itself so patterns inside regex don't trigger false positive
      if (relFile === 'scripts/security-check.ts') continue;

      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      for (const { name, pattern } of SENSITIVE_PATTERNS) {
        if (pattern.test(fileContent)) {
          recordCheck('SECRETS', `No ${name} in ${relFile}`, false, `Pattern matched in file`);
          violations++;
        }
      }
    }

    if (violations === 0) {
      recordCheck('SECRETS', 'Hardcoded secrets scan across all tracked files', true, '0 secret violations detected');
    }
  } catch (err) {
    recordCheck('SECRETS', 'Secret pattern scanner', false, String(err));
  }
}

// 3. Security Headers Check in Next Config
function checkSecurityHeaders() {
  const nextConfigPath = path.join(ROOT_DIR, 'next.config.ts');
  if (!fs.existsSync(nextConfigPath)) {
    recordCheck('HEADERS', 'next.config.ts exists', false, 'Missing next.config.ts');
    return;
  }
  const content = fs.readFileSync(nextConfigPath, 'utf-8');
  const requiredHeaders = [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ];

  for (const header of requiredHeaders) {
    const hasHeader = content.includes(header);
    recordCheck('HEADERS', `Header: ${header}`, hasHeader, hasHeader ? 'Configured' : 'Missing header');
  }
}

// 4. Rate Limiting & Middleware Configuration Check
function checkMiddlewareSecurity() {
  const middlewarePath = path.join(ROOT_DIR, 'src', 'middleware.ts');
  if (!fs.existsSync(middlewarePath)) {
    recordCheck('RATE_LIMIT', 'middleware.ts exists', false, 'Missing middleware.ts');
    return;
  }
  const content = fs.readFileSync(middlewarePath, 'utf-8');
  const requiredEndpoints = [
    '/api/chat',
    '/api/auth/register',
    '/api/consultants/bookings',
    '/api/reviews',
  ];

  for (const endpoint of requiredEndpoints) {
    const hasEndpoint = content.includes(`'${endpoint}'`) || content.includes(`"${endpoint}"`);
    recordCheck('RATE_LIMIT', `Rate limit rule for ${endpoint}`, hasEndpoint, hasEndpoint ? 'Enforced' : 'Missing rate rule');
  }

  const hasChatMatcher = content.includes("'/api/chat'");
  recordCheck('RATE_LIMIT', 'Middleware matcher includes exact /api/chat', hasChatMatcher, hasChatMatcher ? 'Matched' : 'Missing /api/chat in config.matcher');
}

// 5. AI Guardrails & Prompt Injection Protection
function checkAIGuardrails() {
  const guardrailsPath = path.join(ROOT_DIR, 'src', 'lib', 'ai', 'guardrails.ts');
  if (!fs.existsSync(guardrailsPath)) {
    recordCheck('AI_SECURITY', 'guardrails.ts exists', false, 'Missing guardrails.ts');
    return;
  }
  const content = fs.readFileSync(guardrailsPath, 'utf-8');
  const hasPromptInjectionPatterns = content.includes('PROMPT_INJECTION_PATTERNS');
  const hasEvaluateConversation = content.includes('evaluateConversation');

  recordCheck('AI_SECURITY', 'Prompt injection patterns configured', hasPromptInjectionPatterns, hasPromptInjectionPatterns ? 'Active' : 'Missing injection regex');
  recordCheck('AI_SECURITY', 'Multi-turn conversation evaluation enabled', hasEvaluateConversation, hasEvaluateConversation ? 'Active' : 'Missing evaluateConversation');
}

// 6. Dependencies Vulnerability Audit
function checkDependencyVulnerabilities() {
  try {
    const auditOutput = execSync('npm audit --audit-level=high --json', { cwd: ROOT_DIR, encoding: 'utf-8' });
    const auditJson = JSON.parse(auditOutput);
    const vulnerabilities = auditJson.metadata?.vulnerabilities || {};
    const high = vulnerabilities.high || 0;
    const critical = vulnerabilities.critical || 0;
    const totalSevere = high + critical;

    recordCheck(
      'DEPENDENCIES',
      'High/Critical Dependency Vulnerabilities',
      totalSevere === 0,
      totalSevere === 0 ? '0 high or critical vulnerabilities' : `Found ${high} high, ${critical} critical`
    );
  } catch (err: any) {
    // If npm audit exits with non-zero when vulnerabilities exist, parse stdout
    try {
      if (err.stdout) {
        const auditJson = JSON.parse(err.stdout);
        const vulnerabilities = auditJson.metadata?.vulnerabilities || {};
        const high = vulnerabilities.high || 0;
        const critical = vulnerabilities.critical || 0;
        recordCheck('DEPENDENCIES', 'High/Critical Dependency Vulnerabilities', false, `Found ${high} high, ${critical} critical`);
        return;
      }
    } catch {
      // ignore json parse error
    }
    recordCheck('DEPENDENCIES', 'npm audit check', false, String(err.message || err));
  }
}

// Execute all checks
console.log('\n=========================================');
console.log('🔒 CAREER-GUD PLATFORM SECURITY AUDIT CHECK');
console.log('=========================================\n');

checkGitIgnore();
checkHardcodedSecrets();
checkSecurityHeaders();
checkMiddlewareSecurity();
checkAIGuardrails();
checkDependencyVulnerabilities();

console.log('\n-----------------------------------------');
const failed = results.filter((r) => !r.passed);
if (failed.length > 0) {
  console.error(`\n❌ SECURITY AUDIT FAILED: ${failed.length} issue(s) detected!`);
  for (const f of failed) {
    console.error(` - [${f.category}] ${f.name}: ${f.message}`);
  }
  process.exit(1);
} else {
  console.log(`\n🎉 ALL ${results.length} SECURITY VERIFICATIONS PASSED CLEANLY!`);
  process.exit(0);
}
