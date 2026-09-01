import React from 'react';
import {
  HelpCircle,
  BookOpen,
  Layers,
  Terminal,
  Sparkles,
  ShieldCheck,
  Code,
  Check,
  ArrowRight,
  Database,
  Globe,
  GitBranch,
  Cpu,
  FileCode2,
  PlayCircle,
  FileOutput,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Section } from '../../../components/layout/Section';
import { Badge } from '../../../components/ui/Badge';
import { Alert } from '../../../components/feedback/Alert';

export const HelpPage: React.FC = () => {
  const archFlow = [
    {
      step: '1',
      icon: <BookOpen size={16} />,
      title: 'User Story (Jira)',
      desc: 'Product Owner writes Acceptance Criteria in Jira. Verix ingests via REST API.',
      color: '#818CF8',
    },
    {
      step: '2',
      icon: <Sparkles size={16} />,
      title: 'AI AC → Test Case Synthesis',
      desc: 'Gemini API reads ACs and generates Positive, Negative, Boundary, Edge & OWASP test cases.',
      color: '#10B981',
    },
    {
      step: '3',
      icon: <FileCode2 size={16} />,
      title: 'BDD Script Generation',
      desc: 'Verix auto-generates Gherkin .feature files + Playwright Page Object Model classes.',
      color: '#38BDF8',
    },
    {
      step: '4',
      icon: <PlayCircle size={16} />,
      title: 'Playwright CI Executor',
      desc: 'Scripts run in Azure DevOps pipeline. Live step telemetry streams back to Verix.',
      color: '#F59E0B',
    },
    {
      step: '5',
      icon: <Zap size={16} />,
      title: 'AI Self-Healing Engine',
      desc: 'On locator failure, Gemini Vision scans DOM diff and proposes healed selector.',
      color: '#EF4444',
    },
    {
      step: '6',
      icon: <FileOutput size={16} />,
      title: 'ExtentReport PDF Export',
      desc: 'Full audit-quality BDD report with step screenshots, pass/fail status, and AI healing log.',
      color: '#A78BFA',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
      <PageHeader
        title="Developer Guide & Architecture"
        description="Core architecture overview, AI integration flow, module boundaries, design system conventions, and team development guidelines."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Help & Docs' }]}
        badge={<span className="badge badge-primary">Verix v1.0</span>}
      />

      {/* ======== TECHNICAL ARCHITECTURE ======== */}
      <Section title="1. Technical Architecture — End-to-End AI QA Flow" subtitle="How Verix connects Jira stories to executed, AI-healed automation scripts">
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            padding: '1.5rem',
            marginBottom: '1.25rem',
          }}
        >
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Verix is a <strong>full-stack AI QA platform</strong> that creates an unbroken chain from a product requirement
            to a passing, auditable automated test. In the production architecture, each step below is powered by
            a real service. In the current prototype, all AI steps are simulated with high-fidelity mock responses.
          </p>

          {/* Flow Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {archFlow.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: `${item.color}20`,
                    border: `2px solid ${item.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0,
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
                {i < archFlow.length - 1 && (
                  <div style={{ marginTop: '32px', marginLeft: '-1rem', color: 'var(--text-muted)' }}>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { label: 'React + TypeScript', color: '#38BDF8' },
              { label: 'Vite', color: '#818CF8' },
              { label: 'Google Gemini API', color: '#10B981' },
              { label: 'Playwright', color: '#F59E0B' },
              { label: 'Azure DevOps', color: '#38BDF8' },
              { label: 'Azure Static Web Apps', color: '#818CF8' },
              { label: 'Jira REST API', color: '#10B981' },
              { label: 'Azure Cosmos DB', color: '#EF4444' },
              { label: 'BDD / Gherkin', color: '#A78BFA' },
              { label: 'ExtentReports 5.1', color: '#F59E0B' },
            ].map((tech, i) => (
              <span
                key={i}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: `${tech.color}15`,
                  color: tech.color,
                  border: `1px solid ${tech.color}30`,
                }}
              >
                {tech.label}
              </span>
            ))}
          </div>
        </div>

        {/* Architecture ASCII/Visual */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ color: '#818CF8', fontWeight: 700, marginBottom: '0.5rem' }}>// Verix Production Architecture</div>
          <div>
            <span style={{ color: '#10B981' }}>Jira REST API</span>
            <span style={{ color: 'var(--text-muted)' }}> ──► </span>
            <span style={{ color: '#38BDF8' }}>Verix Story Ingestion</span>
            <span style={{ color: 'var(--text-muted)' }}> ──► </span>
            <span style={{ color: '#818CF8' }}>Gemini AI (AC→TC)</span>
          </div>
          <div style={{ marginLeft: '3.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>└──► </span>
            <span style={{ color: '#F59E0B' }}>Gherkin + POM Generator</span>
            <span style={{ color: 'var(--text-muted)' }}> ──► </span>
            <span style={{ color: '#EF4444' }}>Playwright CI Runner</span>
          </div>
          <div style={{ marginLeft: '7rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>└──► </span>
            <span style={{ color: '#A78BFA' }}>AI Self-Healing Engine</span>
            <span style={{ color: 'var(--text-muted)' }}> ──► </span>
            <span style={{ color: '#10B981' }}>ExtentReport PDF + Audit Log</span>
          </div>
          <div style={{ marginLeft: '10.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>└──► </span>
            <span style={{ color: '#38BDF8' }}>Azure Cosmos DB (21 CFR 11)</span>
          </div>
        </div>
      </Section>

      {/* ======== MODULE ARCHITECTURE ======== */}
      <Section title="2. Isolated Module Architecture" subtitle="How team members build independently without merge conflicts">
        <Card>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Every Verix feature belongs to its own dedicated module folder under <code>src/modules/&lt;feature-name&gt;/</code>.
          </p>
          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
            }}
          >
            src/modules/your-module/<br />
            ├── components/ &nbsp;&nbsp;# Module-specific UI elements<br />
            ├── pages/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Full route page views<br />
            ├── hooks/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Custom hooks and state<br />
            ├── services/ &nbsp;&nbsp;# API & AI prompt calls<br />
            ├── types/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Module domain interfaces<br />
            └── index.ts &nbsp;&nbsp;&nbsp;# Clean external export
          </div>
        </Card>
      </Section>

      {/* ======== SHARED COMPONENT LIBRARY ======== */}
      <Section title="3. Shared UI Component Library" subtitle="Reuse existing components instead of duplicating styles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Card title="Design System UI">
            <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><code>Button</code> (primary, secondary, ghost, danger, ai)</li>
              <li><code>Input</code>, <code>Textarea</code>, <code>Select</code>, <code>MultiSelect</code></li>
              <li><code>Table</code> (with sort & pagination)</li>
              <li><code>Modal</code>, <code>Drawer</code>, <code>ConfirmDialog</code></li>
              <li><code>Badge</code>, <code>StatusIndicator</code>, <code>ProgressBar</code></li>
            </ul>
          </Card>

          <Card title="AI Intelligence UI">
            <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><code>AIActionButton</code> (Gradient glow with loader)</li>
              <li><code>AIGeneratedBadge</code> (Confidence indicator)</li>
              <li><code>AILoadingState</code> (Pulsating sparkle)</li>
              <li><code>AIResultContainer</code> (Structured preview)</li>
              <li><code>AIApproveReject</code> (One-click decision controls)</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* ======== QUICK COMMANDS ======== */}
      <Section title="4. Quick Commands & Keybindings">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Open Command Palette</span>
            <div><kbd>⌘</kbd> <kbd>K</kbd> / <kbd>Ctrl</kbd> <kbd>K</kbd></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Toggle Color Theme</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Top Navbar Sun / Moon Icon</span>
          </div>
        </Card>
      </Section>
    </div>
  );
};
