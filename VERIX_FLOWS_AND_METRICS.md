# Verix — System Architecture, QA Flows & Health Engine

Welcome to the **Verix** System Specification and Workflow Guide. This document records all end-to-end user flows, the QA Health calculation model, team management workflows, and how each independent module interacts across the platform.

---

## 1. QA Health Score Engine & Metrics

The **QA Health Score** (e.g. `91% — Excellent`) is Verix’s real-time quality readiness index. It measures whether a project workspace is stable, covered, and safe to ship.

### A. Mathematical Formula
$$\text{QA Health Score} = 0.35(\text{Coverage}) + 0.30(\text{Pass Rate}) + 0.20(\text{Automation}) + 0.15(\text{Risk Mitigation})$$

### B. Weight Breakdown & Source Modules

| Pillar | Weight | Metric & Description | Source Module |
|---|:---:|---|---|
| **Story Coverage** | **35%** | Percentage of active User Stories that have linked, verified test cases (`Full` vs `Uncovered`). | **Module 2 (Coverage)** & **Module 1 (User Stories)** |
| **Pipeline Pass Rate** | **30%** | Percentage of test cases passing in the latest CI/CD execution run (`passed / total`). | **Module 7 (Repository)** & **Dashboard** |
| **Automation Ratio** | **20%** | Proportion of regression test suites automated via Playwright/Cypress vs manual runs. | **Module 5 (Automation)** |
| **Risk Mitigation** | **15%** | Reduction in critical defects and unhandled edge case gaps. | **Module 2 (Coverage)** |

### C. Health Status Thresholds

* 🟢 **90% – 100% (Excellent)**: High test coverage, passing regression pipeline, low risk gaps. Safe for production deployment.
* 🟡 **75% – 89% (Good)**: Minor coverage gaps or non-critical flakiness. Ready with review.
* 🔴 **< 75% (Needs Attention)**: Untested user stories, failing smoke gate, or critical risk items.
* ⚪ **0% (Not Started / New Workspace)**: Initial state for newly created workspaces awaiting test cases.

---

## 2. 🗂️ Core Module: Projects & Workspace Portfolio (`/projects`)

The **Projects Portfolio Module** is the foundational workspace registry of Verix. It manages active team contexts, project metadata, member rosters, and health telemetry.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROJECTS PORTFOLIO                              │
│                                                                        │
│  ┌─────────────────────────┐             ┌──────────────────────────┐  │
│  │   Acme Cloud          │             │   Acme Anakin          │  │
│  │   Key: SNC • Sprint 12  │             │   Key: SNA • Sprint 7    │  │
│  │                         │             │                          │  │
│  │  [5 Members] [38 Story] │             │  [4 Members] [24 Story]  │  │
│  │  [174 Tests] [91% QA]   │             │  [118 Tests] [87% QA]    │  │
│  │                         │             │                          │  │
│  │  👥 Team Details (Edit) │             │  👥 Team Details (Edit)  │  │
│  └─────────────────────────┘             └──────────────────────────┘  │
│                                                                        │
│  [+ Add New Team Workspace]                                            │
└────────────────────────────────────────────────────────────────────────┘
```

### A. Core Features & Capabilities

1. **Active Workspace Context Engine**:
   - Selecting any project sets it as the active context across the entire application.
   - Synchronizes globally with `ProjectProvider` and updates the **Top Navigation Bar** with the active project's **Active Sprint** badge (e.g. `Sprint 12 (Q3 Release)`).

2. **Project Workspace Lifecycle (Add & Edit)**:
   - **Add Team Modal**: Onboard new QA workspaces with:
     - **Project Name** (e.g. `Acme Cloud`)
     - **Project Key** (e.g. `SNC` — 2–6 alphanumeric characters)
     - **Active Sprint** (e.g. `Sprint 12 (Q3 Release)`)
     - **Team Description** (Scope, platform, and QA objectives)
   - **Edit Project Details**: Click the **✏️ Pencil** icon on any card to update sprint names, scopes, or keys.

3. **Comprehensive Team Member Management**:
   - Each project maintains a structured roster of engineers and stakeholders.
   - **Member Fields**:
     - `name`: Full Name (e.g. `Alex M.`, auto-generates monogram initials)
     - `role`: Role assignment with color-coded tokens (`QA Lead`, `QA Engineer`, `SDET`, `Product Owner`, `Developer`)
     - `email`: Work email address (e.g. `alex.m@acme-corp.com`)
     - `avatarInitials`: 2-letter uppercase initials
   - **Inline Member Editor**: Click **"Edit Details ✏️"** or click on the **Members** stat card to expand inline field editing, remove members, or add new teammates.

4. **Drill-Down Interactive Navigation**:
   - Click on the **Stories** stat card $\rightarrow$ auto-selects project and navigates to `/user-stories`.
   - Click on the **Tests** stat card $\rightarrow$ auto-selects project and navigates to `/test-cases`.
   - Click on the **Members** stat card $\rightarrow$ opens the **Team Member Details Modal**.

5. **QA Health Score Tracking**:
   - Live visual health score progress bar reflecting the composite readiness rating.

### B. Data Model & Interfaces

```typescript
export interface ProjectMember {
  id: string;
  name: string;
  email?: string;
  role: 'QA Lead' | 'QA Engineer' | 'SDET' | 'Product Owner' | 'Developer';
  avatarInitials: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
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
```

---

## 3. End-to-End QA Copilot Module Flows

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────┐
│  User Stories   │ ────> │ Coverage Bridge │ ────> │ AI Test Generation  │
│  (Jira / ADO)   │       │ (Gap Detection) │       │ (Acceptance Specs)  │
└─────────────────┘       └─────────────────┘       └─────────────────────┘
         │                                                     │
         ▼                                                     ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────┐
│  Task Tracker   │ <──── │ Test Repository │ <──── │   Test Step AI      │
│ (QA Allocation) │       │ (Suite Tree)    │       │ (Edge Expansions)   │
└─────────────────┘       └─────────────────┘       └─────────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   Automation    │
                          │ (Self-Healing)  │
                          └─────────────────┘
```

### Module 1: User Stories & Requirements Management (`/user-stories`)
* **Dual Ingestion Channels**:
  * **Option A — Jira Live Sync**: Queries Jira Cloud projects (e.g. `SNC`, `SNA`) and open sprints to batch-import user stories with story points, priority, and acceptance criteria.
  * **Option B — Excel / CSV Template Ingestion**: Downloadable standardized `.csv` template with live client-side row parsing, preview validation table, and 1-click batch import.
  * **Option C — Manual Entry**: Interactive form with dynamic Acceptance Criteria checklist builder (add/remove bullet points).
* **Story Details Inspection Drawer**: Click any story row to view full acceptance criteria checklist, linked QA test generation action, and source badges (`Jira`, `Excel`, `Manual`).
* **Dynamic Search & Filtering**: Multi-dimensional filtering across Story Key, Scope text, Priority (`Critical`, `High`, `Medium`, `Low`), and Source.

### Module 2: Dev ↔ QA Coverage Bridge (`/coverage`)
* Compares developer unit/smoke test coverage against QA behavioral test cases.
* Flags **Risk Gaps** (e.g., race conditions, network latency spikes, offline recovery).
* Computes feature-level risk scores.

### Module 3: AI Test Case Generator (`/test-cases`)
* Analyzes user stories and acceptance criteria.
* Generates step-by-step test cases with AI Confidence Scores (e.g. `96% Confidence`).
* Provides human-in-the-loop review (`Approve & Add to Suite` vs `Discard`).

### Module 4: AI Test Step Expander (`/test-steps`)
* Takes high-level test outlines and auto-expands edge cases, negative assertions, and validation parameters.
* Flags expanded steps with `AI-Expanded` tags for auditability.

### Module 5: Self-Healing Automation (`/automation`)
* Manages Playwright and Cypress test execution runs.
* Self-Healing engine detects altered DOM selectors/IDs during pipeline runs and dynamically resolves them without breaking builds.

### Module 6: QA Task Allocation (`/tasks`)
* Kanban and sprint board for QA task allocation (`Test Design`, `Automation Scripting`, `Execution`, `Bug Retest`).
* Tracks estimated vs logged hours per QA engineer.

### Module 7: Test Repository (`/repository`)
* Centralized directory tree of automated suites, regression suites, and smoke gates.
* Exportable test artifacts in JSON, CSV, and Markdown formats.

---

## 4. Git Collaboration & Team Development Standard

Each module owner works in an isolated branch:

| Module | Assigned Route | Recommended Branch |
|---|---|---|
| Projects & Shell | `/projects`, AppShell | `main` |
| User Stories | `/user-stories` | `feature/user-stories` |
| Coverage Bridge | `/coverage` | `feature/coverage` |
| AI Test Cases | `/test-cases` | `feature/test-cases` |
| Test Step AI | `/test-steps` | `feature/test-steps` |
| Automation Runner | `/automation` | `feature/automation` |
| QA Task Tracker | `/tasks` | `feature/task-tracker` |
| Test Repository | `/repository` | `feature/test-repository` |

### Development Commands
```bash
# Clone & install
git clone https://github.com/your-org/verix-qa.git
cd verix-qa
npm install

# Start development server
npm run dev

# Run typecheck & build validation
npm run build
```
