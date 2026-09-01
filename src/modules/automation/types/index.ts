import { AutomationScript, AutomationFramework, UserStory, TestCase, TestStep } from '../../../types';

export type ScriptExecutionStatus = 'Passed' | 'Failed' | 'Running' | 'Untested' | 'Healed';
export type AutomationViewMode = 'business_bdd' | 'technical_sdet';
export type GherkinKeyword = 'Given' | 'When' | 'Then' | 'And' | 'But';

export interface SelectorCandidate {
  selector: string;
  strategy: 'data-testid' | 'semantic-text' | 'aria-role' | 'css-path' | 'xpath';
  confidence: number; // 0 to 100
  isRecommended: boolean;
  rationale: string;
}

export type FailureScenarioType =
  | 'locator_drift'
  | 'element_not_found'
  | 'timeout'
  | 'text_mismatch'
  | 'api_mismatch';

export interface FailureScenario {
  id: string;
  type: FailureScenarioType;
  title: string;
  description: string;
  failedStepIndex: number;
  brokenLocator: string;
  healedLocator: string;
  failureMessage: string;
  plainEnglishExplanation: string;
  rootCauseAnalysis: string;
  candidates: SelectorCandidate[];
  domSnapshotBefore: string;
  domSnapshotAfter: string;
}

export interface SimulationStep {
  stepNumber: number;
  keyword?: GherkinKeyword;
  title: string;
  action: string;
  locator: string;
  expectedResult: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'healed';
  durationMs: number;
  errorLog?: string;
  healedLocator?: string;
  uiTargetName?: string;
}

export interface AutomationScriptExtended extends AutomationScript {
  storyKey: string;
  storyTitle: string;
  testCaseKey: string;
  testCaseTitle: string;
  featureTitle?: string;
  featureTags?: string[];
  folderCategory?: string;
  gherkinContent?: string;
  pageObjectClass?: string;
  healedPageObjectClass?: string;
  code: string;
  originalCode?: string;
  healedCode?: string;
  healedAt?: string;
  executionCount: number;
  lastExecutionDuration: number;
  steps: SimulationStep[];
  failureScenario?: FailureScenario;
}

export interface SelfHealingProposal {
  id: string;
  scriptId: string;
  scriptName: string;
  testCaseKey: string;
  storyKey: string;
  featureTitle: string;
  failureScenario: FailureScenario;
  brokenCode: string;
  healedCode: string;
  confidence: number;
  plainEnglishSummary: string;
  aiExplanation: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface ExecutionLogItem {
  id: string;
  timestamp: string;
  level: 'info' | 'action' | 'assert' | 'warn' | 'error' | 'success' | 'ai';
  message: string;
  stepNumber?: number;
}
