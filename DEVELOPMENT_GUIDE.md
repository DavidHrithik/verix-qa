# Verix — Team Developer Guide & Architecture Standards

Welcome to the **Verix** repository. This guide explains how to build your assigned QA module independently without causing merge conflicts or breaking the core application.

---

## 1. Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Run Locally
```bash
# Navigate to the workspace directory
cd verix-qa

# Install dependencies (already initialized)
npm install

# Start Vite live development server
npm run dev
```

### Build & Typecheck
```bash
npm run build
```

---

## 2. Directory Structure & Module Boundaries

To ensure 5+ developers can work remotely in parallel without git conflicts, **all business logic must stay strictly inside your module directory**:

```
src/
├── app/                      # CORE: AppShell, Navbar, Sidebar, Routing, Providers
├── components/               # SHARED: Reusable Design System UI & AI components
│   ├── ui/                   # Buttons, Inputs, Tables, Modals, Badges, Tabs
│   ├── ai/                   # AIActionButton, AIGeneratedBadge, AIApproveReject
│   ├── feedback/             # Toast, Alert, Skeleton, EmptyState, ErrorState
│   └── layout/               # PageHeader, Section, Card, SplitPane
├── modules/                  # INDEPENDENT TEAM MODULES
│   ├── dashboard/            # QA Overview & Telemetry Matrix
│   ├── user-stories/         # Module 1: Jira/ADO Requirement Ingestion & Parsing
│   ├── coverage/             # Module 2: Development ↔ QA Coverage Bridge
│   ├── test-cases/           # Module 3: AI Test Case Generator
│   ├── test-steps/           # Module 4: AI Test Step Expander
│   ├── automation/           # Module 5: Self-Healing Automation & Runner
│   ├── task-tracker/         # Module 6: QA Task Allocation & Sprint Board
│   ├── repository/           # Module 7: Centralized Test Repository Tree
│   └── settings/             # User & Workspace Configuration
├── mock/                     # SHARED: Centralized Mock Datasets & Fixtures
├── types/                    # SHARED: Common Domain Contracts & Interfaces
└── styles/                   # SHARED: Design Tokens (tokens.css, globals.css, components.css, ai.css)
```

---

## 3. How to Work on Your Assigned Module

Each module has its own isolated sub-folder under `src/modules/<your-module>/`.

### Module Folder Anatomy:
```
src/modules/your-module/
├── components/      # Private UI components used only by your module
├── pages/           # Main Page views (e.g. YourModulePage.tsx)
├── hooks/           # Module custom hooks (e.g. useTestCaseGen.ts)
├── services/        # API calls or AI prompt pipelines
├── types/           # Private interfaces specific to your module
└── index.ts         # Export only what needs to be mounted in routes.tsx
```

> [!IMPORTANT]
> **Rule of Thumb**: You should almost never need to modify another developer's folder under `src/modules/`.

---

## 4. How to Use the Shared Design System

Do **NOT** write ad-hoc button or table CSS from scratch. Use the pre-built components from `@/components`:

### A. Buttons & Actions
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" leftIcon={<Plus size={16} />}>Create</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Options</Button>
```

### B. AI Elements & Controls
```tsx
import { 
  AIActionButton, 
  AIGeneratedBadge, 
  AIResultContainer, 
  AIConfidenceIndicator, 
  AIApproveReject 
} from '@/components/ai';

<AIActionButton onClick={handleGenerate} isLoading={isGenerating}>
  Generate AI Tests
</AIActionButton>

<AIGeneratedBadge confidence={96} />

<AIResultContainer title="AI Generated Test Suite" confidence={94}>
  <div>Generated step contents...</div>
  <AIApproveReject onApprove={handleSave} onReject={handleDiscard} />
</AIResultContainer>
```

### C. Tables & Data
```tsx
import { Table, Column } from '@/components/ui/Table';

const columns: Column<MyDataType>[] = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'title', header: 'Title', sortable: true },
  { key: 'status', header: 'Status', render: (item) => <Badge variant="passed">{item.status}</Badge> }
];

<Table columns={columns} data={dataList} keyExtractor={(item) => item.id} />
```

### D. User Feedback & Notifications
```tsx
import { useToast } from '@/app/providers/ToastProvider';

const { showToast } = useToast();
showToast('Tests Generated', '6 new edge test cases added to suite', 'success');
```

---

## 5. Adding or Modifying Routes

Routes are mapped centrally in `src/app/routes.tsx`.

When adding a sub-route to your module:
1. Export your Page from `src/modules/<your-module>/index.ts`.
2. Import it in `src/app/routes.tsx` and attach it under the `<Route element={<AppShell />}>` wrapper.

---

## 6. Centralized Mock Data & Types

- **Shared Types**: Add cross-module contracts to `src/types/index.ts`.
- **Mock Data**: Place realistic fixtures in `src/mock/index.ts`. Modules can import these until backend API endpoints are connected.

---

## 7. Quality Checklist Before Pull Requests

1. `npm run build` passes with **zero** TypeScript compilation errors.
2. Interface looks consistent in **both Light and Dark modes** (toggle via top navbar).
3. No hardcoded hex colors — use CSS variables like `var(--text-primary)`, `var(--bg-surface)`, etc.
4. No direct mutations to other team members' module directories.
