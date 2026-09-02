export interface AIHealerContext {
  brokenLocator: string;
  failureMessage: string;
  domSnapshotBefore: string;
  domSnapshotAfter: string;
  framework: string;
  stepTitle: string;
  storyKey: string;
}

export interface AIHealingResult {
  rootCause: string;
  plainEnglish: string;
  failureType: 'locator_drift' | 'element_not_found' | 'timeout' | 'text_mismatch';
  confidence: number;
  candidates: {
    selector: string;
    strategy: 'data-testid' | 'semantic-text' | 'aria-role' | 'css-path' | 'xpath';
    confidence: number;
    isRecommended: boolean;
    rationale: string;
  }[];
  fiveWhys: {
    why: number;
    question: string;
    answer?: string;
    supported: boolean;
  }[];
}

export const callAzureAIHealer = async (
  context: AIHealerContext,
  config: { endpoint: string; apiKey: string; deploymentName: string; apiVersion: string }
): Promise<AIHealingResult> => {
  const {
    brokenLocator,
    failureMessage,
    domSnapshotBefore,
    domSnapshotAfter,
    framework,
  } = context;

  const prompt = `You are a Senior Test Automation Engineer specializing in UI locator repair.
A ${framework} test failed. Analyze the DOM change and provide a healing solution.

## Broken Locator: ${brokenLocator}
## Error: ${failureMessage}
## DOM BEFORE (when test passed):
${domSnapshotBefore}

## DOM AFTER (why it fails now):
${domSnapshotAfter}

Respond ONLY in valid JSON matching this structure:
{
  "rootCause": "technical explanation",
  "plainEnglish": "simple 2-sentence explanation",
  "failureType": "locator_drift | element_not_found | timeout | text_mismatch",
  "confidence": 0-100,
  "candidates": [
    {
      "selector": "exact healed selector",
      "strategy": "data-testid | semantic-text | aria-role | css-path | xpath",
      "confidence": 0-100,
      "isRecommended": true/false,
      "rationale": "why this is stable or not"
    }
  ],
  "fiveWhys": [
    { "why": 1, "question": "...", "answer": "...", "supported": true }
  ]
}

Rules: Provide 3 candidates ranked by stability (data-testid first if available). Stop fiveWhys when unsupported.`;

  const url = `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${config.apiVersion}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Azure AI API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Azure AI API returned empty content');
  }

  return JSON.parse(content) as AIHealingResult;
};
