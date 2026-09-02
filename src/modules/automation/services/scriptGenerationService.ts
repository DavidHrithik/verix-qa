import { UserStory, TestCase, AutomationFramework } from '../../../types';
import { AutomationScriptExtended, SimulationStep } from '../types';
import { mockFailureScenarios } from './automationMockData';

export interface ScriptGenerationParams {
  story: UserStory;
  testCase?: TestCase;
  framework: AutomationFramework;
  includeFailureDemo?: boolean;
}

export const synthesizeAutomationScript = (params: ScriptGenerationParams): AutomationScriptExtended => {
  const { story, testCase, framework, includeFailureDemo } = params;

  const tcKey = testCase?.key || `TC-${Math.floor(Math.random() * 800 + 100)}`;
  const tcTitle = testCase?.title || `${story.title} - Automated Verification`;
  const sanitizedSlug = story.key.toUpperCase() + '_' + tcTitle.replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 24);
  
  const scriptName = `${sanitizedSlug}.feature`;
  const repoPath = `src/test/resources/features/${story.key}/${scriptName}`;

  // Generate Simulation Steps based on testCase steps or story criteria
  let steps: SimulationStep[] = [];
  if (testCase && testCase.steps && testCase.steps.length > 0) {
    steps = testCase.steps.map((st, idx) => {
      const kw = idx === 0 ? 'Given' : idx === testCase.steps.length - 1 ? 'Then' : 'When';
      return {
        stepNumber: idx + 1,
        keyword: kw,
        title: `${kw} ${st.action}`,
        action: st.action,
        locator: `page.locator('[data-step="${idx + 1}"]')`,
        expectedResult: st.expectedResult,
        status: 'pending',
        durationMs: 0,
        uiTargetName: `Step [${idx + 1}]`
      };
    });
  } else {
    // Generate from Acceptance Criteria
    steps = story.acceptanceCriteria.map((ac, idx) => {
      const kw = idx === 0 ? 'Given' : idx === story.acceptanceCriteria.length - 1 ? 'Then' : 'When';
      return {
        stepNumber: idx + 1,
        keyword: kw,
        title: `${kw} ${ac}`,
        action: `Execute action for criteria: ${ac}`,
        locator: `page.locator('[data-criteria="${idx + 1}"]')`,
        expectedResult: `Criterion '${ac}' verified`,
        status: 'pending',
        durationMs: 0,
        uiTargetName: `Criteria [${idx + 1}]`
      };
    });
  }

  // If failure demo is toggled, attach failure scenario
  const failureScenario = includeFailureDemo ? mockFailureScenarios.member_export_toggle_drift : undefined;
  if (failureScenario && steps.length > 1) {
    const targetIdx = Math.min(failureScenario.failedStepIndex, steps.length - 1);
    steps[targetIdx].locator = failureScenario.brokenLocator;
    steps[targetIdx].healedLocator = failureScenario.healedLocator;
    steps[targetIdx].errorLog = failureScenario.failureMessage;
  }

  // Generate Cucumber Gherkin Feature content
  const featureTags = [`@${story.key}`, `@${story.priority.toLowerCase()}`, `@e2e`, `@run`];
  const gherkinContent = `${featureTags.join(' ')}
Feature: ${story.key} - ${story.title}

  Scenario Outline: <Testcase> - ${tcTitle}
${steps.map((st) => `    ${st.keyword} ${st.action}`).join('\n')}

  Examples:
    | Testcase | userRole | environment |
    | ${tcKey} | StandardUser | QA_Cloud |`;

  const pageObjectClass = `// Page Object Model: ${sanitizedSlug}Page.java
package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ${sanitizedSlug}Page {
  private WebDriver driver;

  // Locators
  private By primaryAction = By.cssSelector("[data-testid='primary-action']");
  private By statusIndicator = By.cssSelector(".status-badge");

  public ${sanitizedSlug}Page(WebDriver driver) {
    this.driver = driver;
  }

  public void executeAction() {
    driver.findElement(primaryAction).click();
  }
}`;

  return {
    id: `auto-gen-${Date.now()}`,
    projectId: story.projectId,
    testCaseId: testCase?.id || `tc-${Date.now()}`,
    storyKey: story.key,
    storyTitle: story.title,
    testCaseKey: tcKey,
    testCaseTitle: tcTitle,
    featureTitle: `${story.key} - ${story.title}`,
    featureTags,
    folderCategory: story.key,
    name: scriptName,
    framework,
    repoPath,
    status: failureScenario ? 'Flaky' : 'Active',
    lastRunStatus: 'Passed',
    lastExecutedAt: new Date().toISOString(),
    executionCount: 0,
    lastExecutionDuration: 0,
    stabilityScore: 100,
    runHistory: [],
    steps,
    failureScenario,
    gherkinContent,
    pageObjectClass,
    code: gherkinContent,
    originalCode: gherkinContent,
    healedCode: gherkinContent,
  };
};
