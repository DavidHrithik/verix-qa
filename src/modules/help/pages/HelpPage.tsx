import React from 'react';
import {
  BookOpen,
  Sparkles,
  FileCode2,
  PlayCircle,
  Zap,
  FileOutput,
  ArrowDown,
  Clock,
  Database,
  Globe,
  GitBranch,
  Cpu,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Section } from '../../../components/layout/Section';

export const HelpPage: React.FC = () => {
  const pipelineSteps = [
    {
      step: '1',
      icon: <BookOpen size={20} />,
      title: 'Write a User Story',
      subtitle: 'Input: Jira / Manual',
      desc: 'A Product Owner writes a user story with Acceptance Criteria (e.g. "User can export member data with a toggle"). Verix pulls this in from Jira via REST API, or you can enter it manually.',
      output: 'Output: Story with ACs stored in Verix',
      time: '~1 min',
      color: '#818CF8',
    },
    {
      step: '2',
      icon: <Sparkles size={20} />,
      title: 'AI Generates Test Cases',
      subtitle: 'Powered by: Enterprise AI Engine',
      desc: 'Verix sends the Acceptance Criteria to the connected AI model. It reads them and automatically writes a full set of test cases — covering Happy Path, Edge Cases, Security (OWASP), Boundary, and Negative scenarios.',
      output: 'Output: 6–12 structured test cases with steps',
      time: '~2 min',
      color: '#10B981',
    },
    {
      step: '3',
      icon: <FileCode2 size={20} />,
      title: 'Auto-Generate Automation Script',
      subtitle: 'Format: BDD Gherkin + Playwright',
      desc: 'For each test case, Verix generates a ready-to-run Gherkin .feature file (Given/When/Then) and a Playwright Page Object Model class. No manual scripting needed — the AI writes the code.',
      output: 'Output: .feature file + Playwright POM class',
      time: '~30 sec',
      color: '#38BDF8',
    },
    {
      step: '4',
      icon: <PlayCircle size={20} />,
      title: 'Run Tests in CI Pipeline',
      subtitle: 'Runner: Playwright via Azure DevOps / GitHub Actions',
      desc: 'The generated scripts are executed in a CI pipeline (Azure DevOps or GitHub Actions). Verix shows live step-by-step results as the tests run — pass, fail, or each individual step.',
      output: 'Output: Live test results with pass/fail per step',
      time: '~3–8 min',
      color: '#F59E0B',
    },
    {
      step: '5',
      icon: <Zap size={20} />,
      title: 'AI Self-Healing on Failure',
      subtitle: 'Engine: Vision & DOM Semantic Reasoning',
      desc: 'If a test fails because a UI element moved or was renamed (e.g. a button ID changed), the AI Self-Healing Engine automatically detects the broken locator, scans the current page DOM, and suggests the fixed selector with a confidence score.',
      output: 'Output: Healed selector with 91%+ success rate',
      time: '~28 sec',
      color: '#EF4444',
    },
    {
      step: '6',
      icon: <FileOutput size={20} />,
      title: 'Export Audit Report (PDF)',
      subtitle: 'Format: ExtentReports BDD PDF',
      desc: 'Once tests pass, Verix generates a full audit-quality PDF report including: every test step, screenshots, pass/fail status, AI healing events, and timestamps. This report is suitable for compliance reviews (21 CFR Part 11).',
      output: 'Output: Downloadable PDF audit report',
      time: '~10 sec',
      color: '#A78BFA',
    },
  ];

  const techStack = [
    { layer: 'Frontend', tech: 'React + TypeScript + Vite', desc: 'The web app you are looking at right now', color: '#38BDF8' },
    { layer: 'AI Engine', tech: 'Universal Enterprise AI Engine', desc: 'Reads stories → writes test cases → heals broken locators', color: '#10B981' },
    { layer: 'Test Runner', tech: 'Playwright', desc: 'Runs the generated scripts in a real browser (Chromium)', color: '#F59E0B' },
    { layer: 'CI/CD', tech: 'Azure DevOps / GitHub Actions', desc: 'Automatically runs tests on every code change', color: '#818CF8' },
    { layer: 'Database', tech: 'Azure Cosmos DB', desc: 'Stores all test artifacts, audit logs, and AI healing history', color: '#EF4444' },
    { layer: 'Hosting', tech: 'Azure Static Web Apps', desc: 'Where the Verix app itself lives in production', color: '#A78BFA' },
    { layer: 'Story Source', tech: 'Jira REST API', desc: 'Pulls in user stories and acceptance criteria automatically', color: '#0052CC' },
    { layer: 'Reports', tech: 'ExtentReports 5.1', desc: 'Generates the compliance-grade PDF audit reports', color: '#10B981' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
      <PageHeader
        title="How Verix Works — Architecture Guide"
        description="A plain-language walkthrough of the full AI QA pipeline, from writing a user story to a passing automated test with a compliance report."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Help & Docs' }]}
        badge={<span className="badge badge-primary">Verix v1.0</span>}
      />

      {/* ======== THE PIPELINE ======== */}
      <Section
        title="1. End-to-End AI QA Pipeline"
        subtitle="6 steps from a user story to a passing, auditable automated test — most of it handled automatically by AI"
      >
        {/* Intro banner */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>The big idea:</strong> Verix connects every dot between a product requirement and a green CI test. Traditionally,
          going from a user story to a running automated test takes a QA engineer <strong>4+ hours</strong>. With Verix, the same workflow takes <strong>under 15 minutes</strong> — because the AI does the heavy lifting at every step.
        </div>

        {/* Step cards with connector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {pipelineSteps.map((item, i) => (
            <div key={i}>
              {/* Step card */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${item.color}30`,
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                {/* Step number circle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${item.color}18`,
                      border: `2px solid ${item.color}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        Step {item.step}: {item.title}
                      </span>
                      <span style={{ marginLeft: '0.6rem', fontSize: '11px', color: item.color, fontWeight: 600 }}>
                        {item.subtitle}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <Clock size={11} />
                      {item.time}
                    </div>
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 0.5rem 0' }}>
                    {item.desc}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: item.color,
                      backgroundColor: `${item.color}10`,
                      padding: '2px 10px',
                      borderRadius: '999px',
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    ✓ {item.output}
                  </div>
                </div>
              </div>

              {/* Connector arrow between steps */}
              {i < pipelineSteps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', color: 'var(--text-muted)' }}>
                  <ArrowDown size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total time summary */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              ⚡ Total end-to-end time: <span style={{ color: '#10B981' }}>~12–15 minutes</span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
              vs. traditional manual QA: 4–6 hours per story. That's a <strong>73% time saving</strong>.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Story → Tests', time: '~2 min' },
              { label: 'Tests → Scripts', time: '~30 sec' },
              { label: 'CI Execution', time: '~8 min' },
              { label: 'Self-Healing', time: '~28 sec' },
              { label: 'PDF Report', time: '~10 sec' },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16,185,129,0.10)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#10B981',
                }}
              >
                {t.label}: {t.time}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ======== MODULE STRUCTURE ======== */}
      <Section title="2. Module Architecture" subtitle="How the app is structured internally — each feature is an isolated module">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'User Stories', path: '/user-stories', desc: 'Import from Jira, Excel, or create manually. Each story has ACs and triggers AI test generation.', icon: <BookOpen size={16} />, color: '#818CF8' },
            { name: 'Test Cases', path: '/test-cases', desc: 'View, search and filter all AI-generated and manual test cases across projects.', icon: <FileCode2 size={16} />, color: '#10B981' },
            { name: 'Automation', path: '/automation', desc: 'Generate Gherkin scripts, run them live, watch AI self-heal failing locators.', icon: <PlayCircle size={16} />, color: '#38BDF8' },
            { name: 'Dashboard', path: '/', desc: 'Executive overview — coverage metrics, pass rates, AI impact stats, sprint burndown.', icon: <Cpu size={16} />, color: '#F59E0B' },
            { name: 'Task Tracker', path: '/tasks', desc: 'Sprint QA task management — assign, track and complete testing workload.', icon: <GitBranch size={16} />, color: '#A78BFA' },
            { name: 'Settings', path: '/settings', desc: 'Configure AI models, Jira/CI integrations, compliance posture, and deployment roadmap.', icon: <Database size={16} />, color: '#EF4444' },
          ].map((mod, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${mod.color}25`,
                borderTop: `3px solid ${mod.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: mod.color }}>{mod.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{mod.name}</span>
                <code style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{mod.path}</code>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {mod.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Module folder structure */}
        <div style={{ marginTop: '1rem' }}>
          <Card>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Every module lives in its own folder under <code>src/modules/</code>. Team members work inside their own folder — no merge conflicts.
            </p>
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.7,
                color: 'var(--text-primary)',
              }}
            >
              src/modules/your-module/<br />
              ├── components/ &nbsp;# UI elements specific to this feature<br />
              ├── pages/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# The full page that renders at the route<br />
              ├── hooks/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# State management and data logic<br />
              ├── services/ &nbsp;&nbsp;# API calls and AI prompt orchestration<br />
              ├── types/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# TypeScript interfaces for this module<br />
              └── index.ts &nbsp;&nbsp;&nbsp;# Clean export — other modules import from here
            </div>
          </Card>
        </div>
      </Section>

      {/* ======== TECH STACK ======== */}
      <Section title="3. Technology Stack" subtitle="What each tool does in plain language">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {techStack.map((t, i) => (
            <div
              key={i}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: t.color,
                  flexShrink: 0,
                  marginTop: '5px',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.layer}</span>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{t.tech}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
