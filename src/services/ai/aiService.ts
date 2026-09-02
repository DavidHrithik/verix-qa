/**
 * AI Service — Unified dual-mode interface.
 *
 * Checks if VITE_GEMINI_API_KEY is set:
 *   - If YES  → calls Gemini 1.5 Flash (Real AI mode)
 *   - If NO   → falls back to the local template engine (Local mode)
 *   - On error → catches, logs, and falls back silently
 *
 * All features in the app call this service, never Gemini or templates directly.
 */

import { UserStory, TestCase, AutomationFramework } from '../../types';
import { isGeminiConfigured, callGemini } from './geminiClient';
import { buildTestCasePrompt, buildScriptPrompt } from './prompts';
import { generateMultiVectorTestCases, GeneratedTestCaseItem } from '../../modules/user-stories/services/testGenerationService';
import { synthesizeAutomationScript, ScriptGenerationParams } from '../../modules/automation/services/scriptGenerationService';
import { AutomationScriptExtended } from '../../modules/automation/types';

export type AiMode = 'real' | 'local';

export interface AiTestCaseResult {
  cases: GeneratedTestCaseItem[];
  mode: AiMode;
  error?: string;
}

export interface AiScriptResult {
  script: AutomationScriptExtended;
  mode: AiMode;
  error?: string;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export const isAiEnabled = (): boolean => isGeminiConfigured();

export const getAiMode = (): AiMode => (isGeminiConfigured() ? 'real' : 'local');

// ─── Test Case Generation ─────────────────────────────────────────────────────

export const generateTestCases = async (story: UserStory): Promise<AiTestCaseResult> => {
  if (isGeminiConfigured()) {
    try {
      const prompt = buildTestCasePrompt(story);
      const response = await callGemini<{ testCases: any[] }>(prompt);

      const now = new Date().toISOString();
      const cases: GeneratedTestCaseItem[] = response.testCases.map((tc, idx) => ({
        id: `${story.id}-ai-tc-${idx + 1}`,
        projectId: story.projectId,
        storyId: story.id,
        key: tc.key ?? `TC-AI-${idx + 1}`,
        title: tc.title ?? `AI Test Case ${idx + 1}`,
        type: 'Automated' as const,
        priority: (tc.priority ?? 'High') as 'Critical' | 'High' | 'Medium',
        status: 'Approved' as const,
        isAiGenerated: true,
        aiConfidence: 97,
        tags: tc.tags ?? ['AI', 'Generated'],
        lastExecutionStatus: undefined,
        vectorType: (tc.vectorType ?? 'Functional / Happy Path') as GeneratedTestCaseItem['vectorType'],
        targetAC: tc.targetAC ?? story.acceptanceCriteria[idx] ?? '',
        steps: (tc.steps ?? []).map((s: any) => ({
          stepNumber: s.stepNumber,
          action: s.action,
          expectedResult: s.expectedResult,
        })),
        createdAt: now,
        updatedAt: now,
      }));

      return { cases, mode: 'real' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown AI error';
      console.warn('[AI Service] Gemini call failed, falling back to local engine:', msg);
      // Graceful fallback
      return {
        cases: generateMultiVectorTestCases(story),
        mode: 'local',
        error: msg,
      };
    }
  }

  // Local template fallback
  return {
    cases: generateMultiVectorTestCases(story),
    mode: 'local',
  };
};

// ─── Automation Script Generation ─────────────────────────────────────────────

export const generateAutomationScript = async (params: ScriptGenerationParams): Promise<AiScriptResult> => {
  const { story, testCase, framework } = params;

  if (isGeminiConfigured()) {
    try {
      const prompt = buildScriptPrompt(story, testCase, framework);
      const response = await callGemini<{
        gherkinContent: string;
        pageObjectClass: string;
        featureTags: string[];
        summary: string;
      }>(prompt);

      // Merge AI content into the base script structure (keeps all metadata fields)
      const baseScript = synthesizeAutomationScript(params);

      return {
        script: {
          ...baseScript,
          gherkinContent: response.gherkinContent ?? baseScript.gherkinContent,
          pageObjectClass: response.pageObjectClass ?? baseScript.pageObjectClass,
          featureTags: response.featureTags ?? baseScript.featureTags,
          code: response.gherkinContent ?? baseScript.code,
          originalCode: response.gherkinContent ?? baseScript.originalCode,
        },
        mode: 'real',
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown AI error';
      console.warn('[AI Service] Gemini script call failed, falling back to local engine:', msg);
      return {
        script: synthesizeAutomationScript(params),
        mode: 'local',
        error: msg,
      };
    }
  }

  return {
    script: synthesizeAutomationScript(params),
    mode: 'local',
  };
};
