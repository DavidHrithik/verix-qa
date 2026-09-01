/**
 * QA COPILOT — SHARED DOMAIN DATA TYPES & CONTRACTS
 * 
 * These contracts establish the shared foundational data interfaces.
 * Module developers should import from this file or extend them locally within their module's types/ folder.
 */

// ==========================================
// 1. Projects & Users
// ==========================================

export interface ProjectMember {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarInitials: string;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g. "DBANK", "ECOM", "INSR"
  description: string;
  activeSprint?: string;
  membersCount: number;
  members?: ProjectMember[];
  totalStories: number;
  totalTestCases: number;
  healthScore: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'QA Lead' | 'QA Engineer' | 'SDET' | 'Product Owner' | 'Developer';
  avatarUrl?: string;
  assignedProjectIds: string[];
}

// ==========================================
// 2. User Stories & Requirements
// ==========================================

export type StoryStatus = 'Backlog' | 'In Analysis' | 'Ready for QA' | 'In Testing' | 'Done';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface UserStory {
  id: string;
  projectId: string;
  key: string; // e.g. "DBANK-104"
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: StoryStatus;
  priority: PriorityLevel;
  assignee?: User;
  coverageStatus: 'Uncovered' | 'Partial' | 'Full';
  testCaseCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. Coverage Items (Dev ↔ QA Coverage Bridge)
// ==========================================

export type CoverageType = 'Smoke' | 'Functional' | 'Edge/Risk' | 'Regression' | 'Security';

export interface CoverageItem {
  id: string;
  projectId: string;
  storyId: string;
  featureName: string;
  devSmokeCoverage: number; // 0 - 100%
  qaCoverage: number; // 0 - 100%
  edgeRiskScore: 'Low' | 'Medium' | 'High';
  automationStatus: 'Manual Only' | 'Automated' | 'In Progress';
  riskGaps: string[];
  lastAssessedAt: string;
}

// ==========================================
// 4. Test Cases & Test Steps
// ==========================================

export type TestCaseType = 'Manual' | 'Automated' | 'Performance' | 'Security' | 'API';
export type TestCaseStatus = 'Draft' | 'Approved' | 'Deprecated' | 'Ready';

export interface TestStep {
  stepNumber: number;
  action: string;
  expectedResult: string;
  dataInput?: string;
  isAiExpanded?: boolean;
}

export interface TestCase {
  id: string;
  projectId: string;
  storyId?: string;
  key: string; // e.g. "TC-302"
  title: string;
  preconditions?: string;
  steps: TestStep[];
  type: TestCaseType;
  priority: PriorityLevel;
  status: TestCaseStatus;
  isAiGenerated: boolean;
  aiConfidence?: number; // 0 - 100
  tags: string[];
  lastExecutionStatus?: 'Passed' | 'Failed' | 'Blocked' | 'Skipped';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. Automation & Self-Healing Scripts
// ==========================================

export type AutomationFramework = 'Playwright' | 'Cypress' | 'Selenium' | 'Appium' | 'RestAssured';

export interface AutomationScript {
  id: string;
  projectId: string;
  testCaseId: string;
  name: string;
  framework: AutomationFramework;
  repoPath: string;
  status: 'Active' | 'Flaky' | 'Broken' | 'Healed';
  lastRunStatus: 'Passed' | 'Failed' | 'Running';
  selfHealingLogs?: {
    healedAt: string;
    oldSelector: string;
    newSelector: string;
    confidence: number;
  }[];
  lastExecutedAt: string;
}

// ==========================================
// 6. QA Task Allocation & Tasks
// ==========================================

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed' | 'Blocked';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'Test Execution' | 'Test Design' | 'Automation Scripting' | 'Bug Verification' | 'Env Setup';
  status: TaskStatus;
  priority: PriorityLevel;
  assignee?: User;
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  createdAt: string;
}

// ==========================================
// 7. Test Executions & Runs
// ==========================================

export interface TestExecution {
  id: string;
  projectId: string;
  runName: string;
  suiteType: 'Smoke' | 'Regression' | 'Nightly' | 'Sprint QA';
  executedBy: User | 'Automated Pipeline';
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  durationSeconds: number;
  status: 'Completed' | 'In Progress' | 'Aborted';
  startedAt: string;
  completedAt?: string;
}

// ==========================================
// 8. Navigation & UI System Types
// ==========================================

export type ThemeMode = 'light' | 'dark';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  description?: string;
  moduleKey?: string;
}
