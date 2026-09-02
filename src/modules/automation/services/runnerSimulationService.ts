import { ExecutionLogItem, SimulationStep, FailureScenario, RunHistoryEntry } from '../types';

const RUN_HISTORY_MAX = 20; // rolling window

/**
 * Returns a 0–100 stability score based on the rolling run history.
 * 100 = perfectly stable, 0 = never passes.
 * Recency-weighted: more recent runs carry slightly more weight.
 */
export const computeStabilityScore = (history: RunHistoryEntry[]): number => {
  if (!history || history.length === 0) return 100;
  const total = history.length;
  let weightedPassed = 0;
  let totalWeight = 0;
  history.forEach((entry, idx) => {
    const weight = 1 + idx; // older entries lower weight, newer entries higher
    totalWeight += weight;
    if (entry.passed) weightedPassed += weight;
  });
  return Math.round((weightedPassed / totalWeight) * 100);
};

/**
 * Appends a new run result to the rolling history (capped at RUN_HISTORY_MAX).
 */
export const appendRunHistory = (
  existing: RunHistoryEntry[] = [],
  passed: boolean,
  durationMs?: number
): RunHistoryEntry[] => {
  const entry: RunHistoryEntry = {
    runAt: new Date().toISOString(),
    passed,
    durationMs,
  };
  const updated = [...existing, entry];
  return updated.slice(-RUN_HISTORY_MAX);
};

export interface StepExecutionResult {
  step: SimulationStep;
  logs: ExecutionLogItem[];
  isFailure: boolean;
}

export const createInitialExecutionLogs = (scriptName: string, framework: string): ExecutionLogItem[] => {
  const ts = () => new Date().toISOString().split('T')[1].slice(0, 12);
  return [
    {
      id: `log-${Date.now()}-1`,
      timestamp: ts(),
      level: 'info',
      message: `[VERIX-RUNNER] Initializing ${framework} test engine worker #1 (Chromium 124.0.6367.29)...`,
    },
    {
      id: `log-${Date.now()}-2`,
      timestamp: ts(),
      level: 'info',
      message: `[TEST-ENV] Launching Headless Browser context with viewport: 1280x720 (DPR 1.0)`,
    },
    {
      id: `log-${Date.now()}-3`,
      timestamp: ts(),
      level: 'action',
      message: `[SUITE] Executing test script: ${scriptName}`,
    },
    {
      id: `log-${Date.now()}-4`,
      timestamp: ts(),
      level: 'info',
      message: `[HOOK] beforeEach: Injected QA authentication token 'verix_auth_token'`,
    },
  ];
};

export const generateStepLogs = (
  step: SimulationStep,
  isHealed: boolean,
  failureScenario?: FailureScenario
): { logs: ExecutionLogItem[]; passed: boolean } => {
  const ts = () => new Date().toISOString().split('T')[1].slice(0, 12);
  const logs: ExecutionLogItem[] = [];

  logs.push({
    id: `log-${Date.now()}-a`,
    timestamp: ts(),
    level: 'action',
    message: `[STEP ${step.stepNumber}] Action: ${step.action}`,
    stepNumber: step.stepNumber,
  });

  const activeLocator = isHealed && step.healedLocator ? step.healedLocator : step.locator;

  logs.push({
    id: `log-${Date.now()}-b`,
    timestamp: ts(),
    level: 'info',
    message: `[LOCATOR] Querying DOM for selector: ${activeLocator}`,
    stepNumber: step.stepNumber,
  });

  if (!isHealed && failureScenario && step.stepNumber === (failureScenario.failedStepIndex + 1)) {
    // Simulate Failure
    logs.push({
      id: `log-${Date.now()}-c`,
      timestamp: ts(),
      level: 'warn',
      message: `[LOCATOR-RETRY] Target element not found on first pass. Retrying with exponential backoff (attempt 1/3)...`,
      stepNumber: step.stepNumber,
    });
    logs.push({
      id: `log-${Date.now()}-d`,
      timestamp: ts(),
      level: 'warn',
      message: `[LOCATOR-RETRY] Target element not found on second pass. Retrying (attempt 2/3)...`,
      stepNumber: step.stepNumber,
    });
    logs.push({
      id: `log-${Date.now()}-e`,
      timestamp: ts(),
      level: 'error',
      message: `[FATAL ERROR] ${failureScenario.failureMessage}`,
      stepNumber: step.stepNumber,
    });
    logs.push({
      id: `log-${Date.now()}-f`,
      timestamp: ts(),
      level: 'ai',
      message: `[AI-MONITOR] Live anomaly detected at Step ${step.stepNumber}: Selector drift suspected in active DOM tree.`,
      stepNumber: step.stepNumber,
    });
    return { logs, passed: false };
  }

  // Passing Step
  if (isHealed && step.healedLocator) {
    logs.push({
      id: `log-${Date.now()}-h`,
      timestamp: ts(),
      level: 'ai',
      message: `[AI-SELF-HEALED] Resolved element using dynamically repaired locator: ${step.healedLocator}`,
      stepNumber: step.stepNumber,
    });
  }

  logs.push({
    id: `log-${Date.now()}-c`,
    timestamp: ts(),
    level: 'assert',
    message: `[ASSERTION-OK] Expected result verified: ${step.expectedResult}`,
    stepNumber: step.stepNumber,
  });

  logs.push({
    id: `log-${Date.now()}-d`,
    timestamp: ts(),
    level: 'success',
    message: `[STEP ${step.stepNumber}-PASS] Step completed in ${step.durationMs || 350}ms.`,
    stepNumber: step.stepNumber,
  });

  return { logs, passed: true };
};
