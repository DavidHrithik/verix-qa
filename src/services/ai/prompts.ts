/**
 * AI Prompt Templates
 * All prompts return strict JSON — no prose.
 */
import { UserStory, AutomationFramework } from '../../types';
import { TestCase } from '../../types';

// ─── Test Case Generation ─────────────────────────────────────────────────────

export const buildTestCasePrompt = (story: UserStory): string => `
You are a senior QA engineer generating structured test cases for a software story.

STORY:
  Key: ${story.key}
  Title: ${story.title}
  Description: ${story.description}
  Acceptance Criteria:
${story.acceptanceCriteria.map((ac, i) => `    ${i + 1}. ${ac}`).join('\n')}

TASK:
Generate one test case per acceptance criterion. Each test case must be:
- Derived directly from the specific acceptance criterion it covers.
- Categorized by one of these vector types: "Functional / Happy Path", "Security / RBAC Gate", "Boundary / Threshold", "Edge Case / PII Governance", or "Resilience / Recovery".
- Include 3–5 concrete, executable BDD-style steps.

RESPONSE FORMAT — return ONLY valid JSON, no markdown, no prose:
{
  "testCases": [
    {
      "key": "TC-101",
      "title": "string — clear, test-case title starting with Verify...",
      "type": "Automated",
      "priority": "Critical | High | Medium",
      "tags": ["string"],
      "vectorType": "Functional / Happy Path | Security / RBAC Gate | Boundary / Threshold | Edge Case / PII Governance | Resilience / Recovery",
      "targetAC": "The exact acceptance criterion this test covers",
      "steps": [
        { "stepNumber": 1, "action": "string", "expectedResult": "string" }
      ]
    }
  ]
}

Rules:
- Generate exactly ${story.acceptanceCriteria.length} test cases (one per AC).
- Key numbering: use ${story.key.replace(/\D/g, '') || '100'} as the base, increment per test case.
- Steps must be deterministic and specific, not generic placeholders.
- Respond ONLY with the JSON object above. Nothing else.
`;

// ─── Automation Script Generation ─────────────────────────────────────────────

export const buildScriptPrompt = (story: UserStory, testCase: TestCase | undefined, framework: AutomationFramework): string => `
You are an expert test automation engineer generating a ${framework} automation script.

STORY: ${story.key} — ${story.title}
TEST CASE: ${testCase?.key ?? 'N/A'} — ${testCase?.title ?? story.title}
FRAMEWORK: ${framework}

TEST STEPS:
${(testCase?.steps ?? story.acceptanceCriteria.map((ac, i) => ({ stepNumber: i + 1, action: ac, expectedResult: 'Criterion verified' }))).map(s => `  ${s.stepNumber}. Action: ${s.action} | Expected: ${s.expectedResult}`).join('\n')}

TASK:
Generate a ${framework} automation script in Gherkin/BDD format.

RESPONSE FORMAT — return ONLY valid JSON, no markdown:
{
  "gherkinContent": "string — complete Gherkin feature file text",
  "pageObjectClass": "string — relevant Page Object Model class",
  "featureTags": ["string"],
  "summary": "string — one sentence describing what the script tests"
}

Rules:
- Use standard ${framework} conventions.
- Steps must map directly to the test steps provided.
- Feature file must be syntactically valid Gherkin.
- Respond ONLY with the JSON object. No prose.
`;
