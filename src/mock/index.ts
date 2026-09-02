/**
 * SEED DATA — Minimal initial data loaded by DataProvider on first run.
 * Once written to localStorage, this file is never read again.
 * Do NOT add fake computed values here — keep it honest.
 */
import { Project, User, UserStory, TestCase, Task } from '../types';

// ─── Projects (used by ProjectProvider as seed) ───────────────────────────────
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Acme Cloud Platform',
    key: 'ACP',
    description: 'Cloud platform QA — remote diagnostics and device telemetry validation.',
    activeSprint: 'Sprint 12 (Q3 Release)',
    membersCount: 5,
    members: [
      { id: 'acp-1', name: 'Alex M.', email: 'alex.m@acme.com', role: 'QA Lead', avatarInitials: 'AM' },
      { id: 'acp-2', name: 'Priya S.',   email: 'priya.s@acme.com',   role: 'QA Engineer', avatarInitials: 'PS' },
      { id: 'acp-3', name: 'Arun M.',    email: 'arun.m@acme.com',    role: 'SDET', avatarInitials: 'AM' },
      { id: 'acp-4', name: 'Nisha R.',   email: 'nisha.r@acme.com',   role: 'QA Engineer', avatarInitials: 'NR' },
      { id: 'acp-5', name: 'James K.',   email: 'james.k@acme.com',   role: 'Developer', avatarInitials: 'JK' },
    ],
    totalStories: 0,
    totalTestCases: 0,
    healthScore: 0,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-08-30T14:30:00Z',
  },
  {
    id: 'proj-2',
    name: 'Acme Mobile App',
    key: 'AMA',
    description: 'Mobile App QA — testing, test cases, and defects for the mobile platform.',
    activeSprint: 'Sprint 7 (Mobile MVP)',
    membersCount: 4,
    members: [
      { id: 'ama-1', name: 'Kiran T.', email: 'kiran.t@acme.com', role: 'QA Lead', avatarInitials: 'KT' },
      { id: 'ama-2', name: 'Sara L.',  email: 'sara.l@acme.com',  role: 'SDET', avatarInitials: 'SL' },
      { id: 'ama-3', name: 'Sam K.', email: 'sam.k@acme.com', role: 'QA Engineer', avatarInitials: 'SK' },
      { id: 'ama-4', name: 'Meera V.', email: 'meera.v@acme.com', role: 'Product Owner', avatarInitials: 'MV' },
    ],
    totalStories: 0,
    totalTestCases: 0,
    healthScore: 0,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-08-28T11:20:00Z',
  },
];

// ─── Current user (used by TopNavbar) ─────────────────────────────────────────
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex M.',
  email: 'alex.m@acme.com',
  role: 'QA Executive',
  avatarInitials: 'AM',
  assignedProjectIds: ['proj-1', 'proj-2'],
};

// ─── Seed Stories (loaded once into DataProvider) ─────────────────────────────
export const seedStories: UserStory[] = [
  {
    id: 'story-cloud-204',
    projectId: 'proj-1',
    key: 'CLOUD-204',
    title: 'Workspace Admin Data Export & PII Masking Governance Policy',
    description: 'Configure member data export permissions and privacy masking toggles to enforce zero-trust data compliance.',
    acceptanceCriteria: [
      'Admin can select any team member from the workspace member dropdown',
      'The policy toggle defaults to OFF and requires explicit admin activation',
      'An automated audit log entry must be recorded on every toggle change',
      'Policy setting persists across sessions and reflects immediately in the member portal',
    ],
    status: 'Ready for QA',
    priority: 'Critical',
    coverageStatus: 'Full',
    testCaseCount: 0,
    source: 'manual',
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-08-30T15:00:00Z',
  },
  {
    id: 'story-auth-101',
    projectId: 'proj-1',
    key: 'AUTH-101',
    title: 'Customer Registration & Account Provisioning Portal',
    description: 'New customers create a secure Verix account using the registration portal to access the cloud QA workspace.',
    acceptanceCriteria: [
      'Submitting with valid Full Name, business Email, matching password creates account with 201 success',
      'Invalid email or mismatched password shows inline errors and blocks submission',
      'Password minimum 8 characters enforced; 7-char attempt rejected with helper error',
      'Duplicate email submission returns 409 Conflict with login redirect link',
      'Full Name sanitizes HTML/script tags to prevent XSS injection',
    ],
    status: 'Ready for QA',
    priority: 'High',
    coverageStatus: 'Partial',
    testCaseCount: 0,
    source: 'manual',
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-08-31T14:00:00Z',
  },
  {
    id: 'story-ama-101',
    projectId: 'proj-2',
    key: 'AMA-101',
    title: 'Mobile App Device Pairing',
    description: 'Mobile App establishes low-latency Bluetooth/WiFi link to the paired device.',
    acceptanceCriteria: [
      'Pairing handshake completes under 1.5 seconds with zero packet loss',
      'Visual indicator on tablet showing signal strength',
      'Auto-lock UI if connection drops during operation',
    ],
    status: 'In Testing',
    priority: 'Critical',
    coverageStatus: 'Uncovered',
    testCaseCount: 0,
    source: 'manual',
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-28T15:00:00Z',
  },
];

// ─── Seed Test Cases ──────────────────────────────────────────────────────────
export const seedTestCases: TestCase[] = [
  {
    id: 'tc-101',
    projectId: 'proj-1',
    storyId: 'story-auth-101',
    key: 'TC-101',
    title: 'Verify primary positive registration flow with valid Full Name, Email, and matching Password',
    type: 'Automated',
    priority: 'High',
    status: 'Approved',
    isAiGenerated: true,
    aiConfidence: 98,
    tags: ['Auth', 'Registration', 'Happy-Path'],
    lastExecutionStatus: 'Passed',
    steps: [
      { stepNumber: 1, action: 'User navigates to registration portal', expectedResult: 'Registration form loaded in clean state' },
      { stepNumber: 2, action: 'User submits valid name, business email, and matching password', expectedResult: 'Inputs validated with 0 errors' },
      { stepNumber: 3, action: 'System provisions account with 201 Created', expectedResult: 'Welcome screen displayed' },
    ],
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-08-31T11:00:00Z',
  },
  {
    id: 'tc-102',
    projectId: 'proj-1',
    storyId: 'story-auth-101',
    key: 'TC-102',
    title: 'Verify inline validation errors on invalid email or mismatched password',
    type: 'Automated',
    priority: 'Critical',
    status: 'Approved',
    isAiGenerated: true,
    aiConfidence: 96,
    tags: ['Auth', 'Negative-Path', 'Input-Validation'],
    lastExecutionStatus: 'Passed',
    steps: [
      { stepNumber: 1, action: 'User enters invalid email format and mismatched password', expectedResult: 'Form populated with invalid payload' },
      { stepNumber: 2, action: 'User clicks submit button', expectedResult: 'Client validation intercepts form submit' },
      { stepNumber: 3, action: 'System displays inline red field errors', expectedResult: 'Submission blocked and field error displayed' },
    ],
    createdAt: '2026-08-28T10:30:00Z',
    updatedAt: '2026-08-31T11:30:00Z',
  },
  {
    id: 'tc-201',
    projectId: 'proj-1',
    storyId: 'story-cloud-204',
    key: 'TC-201',
    title: 'Verify Workspace Admin can enable data export toggle for team member',
    type: 'Automated',
    priority: 'Critical',
    status: 'Approved',
    isAiGenerated: true,
    aiConfidence: 98,
    tags: ['Admin', 'Security', 'Compliance'],
    lastExecutionStatus: 'Passed',
    steps: [
      { stepNumber: 1, action: 'Admin logs in and opens Policy Utility', expectedResult: 'Admin Console permissions dashboard loaded' },
      { stepNumber: 2, action: 'Admin selects a team member from the dropdown', expectedResult: 'Member permissions panel populated' },
      { stepNumber: 3, action: 'Admin toggles export permission ON', expectedResult: 'Toggle state changes and audit log entry recorded' },
    ],
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-08-30T11:00:00Z',
  },
  {
    id: 'tc-401',
    projectId: 'proj-2',
    storyId: 'story-ama-101',
    key: 'AMA-TC-101',
    title: 'Verify Mobile App Bluetooth pairing latency < 1.5s',
    type: 'Automated',
    priority: 'Critical',
    status: 'Approved',
    isAiGenerated: false,
    tags: ['Mobile', 'App', 'Latency'],
    lastExecutionStatus: 'Passed',
    steps: [
      { stepNumber: 1, action: 'Power on paired device', expectedResult: 'BLE advertisement beacon emitted' },
      { stepNumber: 2, action: 'Tap Pair on mobile UI', expectedResult: 'Pairing handshake completes in under 1.5s' },
    ],
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-28T14:00:00Z',
  },
];

// ─── Seed Tasks ───────────────────────────────────────────────────────────────
export const seedTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Author regression suite for CLOUD-204 Data Export',
    description: 'Cover edge cases including policy toggle race condition and concurrent admin sessions.',
    type: 'Test Design',
    status: 'In Progress',
    priority: 'Critical',
    estimatedHours: 8,
    loggedHours: 3.5,
    dueDate: '2026-09-05',
    createdAt: '2026-08-30T09:00:00Z',
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Review AUTH-101 step expansions and update expected results',
    description: 'Verify AI-expanded test steps for accuracy and update assertion criteria.',
    type: 'Test Execution',
    status: 'To Do',
    priority: 'High',
    estimatedHours: 4,
    loggedHours: 0,
    dueDate: '2026-09-06',
    createdAt: '2026-08-31T10:00:00Z',
  },
  {
    id: 'task-3',
    projectId: 'proj-2',
    title: 'Execute AMA-101 pairing latency test on physical device',
    description: 'Run pairing latency benchmark on mobile app with paired device in lab.',
    type: 'Test Execution',
    status: 'To Do',
    priority: 'Critical',
    estimatedHours: 6,
    loggedHours: 0,
    dueDate: '2026-09-07',
    createdAt: '2026-08-31T11:00:00Z',
  },
];

// ─── Legacy exports (kept for components not yet migrated — remove gradually) ──
/** @deprecated Use useData() from DataProvider instead */
export const mockTestCases = seedTestCases;
/** @deprecated Use useData() from DataProvider instead */
export const mockStories = seedStories;
/** @deprecated Use useData() from DataProvider instead */
export const mockTasks = seedTasks;
/** @deprecated Use useData() from DataProvider instead */
export const mockUsers = [currentUser];
/** @deprecated Removed — no fake metrics */
export const mockDashboardMetrics = { recentActivity: [] as { id: string; title: string; user: string; time: string }[] };
/** @deprecated Removed — computed from real data */
export const mockExecutions = [] as import('../types').TestExecution[];
/** @deprecated Computed from stories + test cases */
export const mockCoverageItems = [] as import('../types').CoverageItem[];
