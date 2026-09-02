import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Sparkles,
  Shield,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Eye,
  ClipboardList,
  Rocket,
  ArrowRight,
  GitBranch,
  Server,
  Cpu,
  Users,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Tabs } from '../../../components/ui/Tabs';
import { Badge } from '../../../components/ui/Badge';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useToast } from '../../../app/providers/ToastProvider';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General & Appearance' },
    { id: 'ai-models', label: 'AI Engine & Reasoning' },
    { id: 'integrations', label: 'Jira & DevOps CI' },
    { id: 'regulatory', label: '⚖️ Regulatory & Compliance' },
    { id: 'roadmap', label: '🚀 Path to Production' },
  ];

  const complianceItems = [
    {
      icon: <FileText size={16} />,
      title: '21 CFR Part 11 — Electronic Records & Audit Trail',
      status: 'Compliant',
      color: '#10B981',
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.2)',
      points: [
        'All AI-generated test cases are timestamped and assigned a unique artifact ID',
        'Every AI healing action is stored in a tamper-evident self-healing log with before/after diff',
        'Human reviewer approval is required before any AI-generated artifact becomes an "official" test artifact',
        'Audit trail entries include: action type, actor, timestamp, confidence score, and AI rationale',
      ],
    },
    {
      icon: <Shield size={16} />,
      title: 'IEC 62304 — Medical Device Software Lifecycle',
      status: 'Aligned',
      color: '#818CF8',
      bg: 'rgba(99,102,241,0.08)',
      border: 'rgba(99,102,241,0.2)',
      points: [
        'Verix maps user stories to IEC 62304 software requirements traceability',
        'Test cases are classified by software safety class (A / B / C) in the story metadata',
        'AI-suggested test coverage is reviewed against the software hazard analysis',
        'All automation scripts are versioned and linked to the specific story revision they validate',
      ],
    },
    {
      icon: <Lock size={16} />,
      title: 'GDPR / HIPAA — PII & Patient Data Protection',
      status: 'Enforced',
      color: '#38BDF8',
      bg: 'rgba(56,189,248,0.08)',
      border: 'rgba(56,189,248,0.2)',
      points: [
        'All test data is anonymised — real patient identifiers are never used in test cases',
        'PII masking is enforced on all test step inputs (e.g. names, DOBs, device serial numbers are synthetic)',
        'AI model inference runs on sanitised, de-identified test data payloads only',
        'Data residency: All test artifacts stored within the S&N Azure tenant (EU-West region)',
      ],
    },
    {
      icon: <Eye size={16} />,
      title: 'Human-in-the-Loop AI Validation Policy',
      status: 'Required',
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      points: [
        'AI suggestions are "proposals" — no test case is promoted without SDET review and approval',
        'Self-healing locator changes require QA Lead sign-off before merging to the baseline script',
        'AI confidence scores below 85% trigger an automatic escalation to the QA Lead',
        'All AI decisions are fully explainable — root cause analysis and selector rationale are shown in-app',
      ],
    },
    {
      icon: <ClipboardList size={16} />,
      title: 'IQ / OQ / PQ — Tool Validation Lifecycle',
      status: 'In Progress',
      color: '#94A3B8',
      bg: 'rgba(148,163,184,0.08)',
      border: 'rgba(148,163,184,0.2)',
      points: [
        'Installation Qualification (IQ): Environment checks and dependency version pinning documented',
        'Operational Qualification (OQ): Functional test suite verifying all core Verix AI features',
        'Performance Qualification (PQ): Regression suite validating AI output consistency across releases',
        'Full validation package to be prepared for Production deployment (Phase 2 milestone)',
      ],
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      label: 'Deploy & Connect',
      timeline: 'Month 1–3',
      owner: 'Platform Engineering + QA Lead',
      color: '#10B981',
      icon: <Server size={16} />,
      steps: [
        'Deploy Verix on Azure Static Web Apps (S&N tenant)',
        'Connect real Jira Cloud REST API to sync live user stories',
        'Wire up Azure Active Directory SSO for S&N employee login',
        'Configure role-based access: QA Lead, SDET, Product Owner, Read-Only',
        'Establish baseline audit log in Azure Cosmos DB',
      ],
    },
    {
      phase: 'Phase 2',
      label: 'AI Integration',
      timeline: 'Month 3–6',
      owner: 'AI/ML Team + SDET Team',
      color: '#818CF8',
      icon: <Cpu size={16} />,
      steps: [
        'Integrate Google Gemini API (or Azure OpenAI) for live AC → Test Case synthesis',
        'Connect real Playwright test runner via Azure DevOps pipeline webhook',
        'Build real DOM snapshot capture pipeline for live self-healing analysis',
        'Implement AI confidence scoring with real LLM token output',
        'Produce first IQ/OQ validation package for regulatory review',
      ],
    },
    {
      phase: 'Phase 3',
      label: 'Scale & Govern',
      timeline: 'Month 6–12',
      owner: 'QA CoE + Compliance Officer',
      color: '#38BDF8',
      icon: <Users size={16} />,
      steps: [
        'Roll out to all Acme QA teams (Cloud, Mobile, Web, Platform)',
        'Implement full 21 CFR Part 11 electronic signature workflow for test approvals',
        'Complete IQ/OQ/PQ validation lifecycle and produce validation summary report',
        'Integrate with S&N Product Lifecycle Management (PLM) system',
        'Build executive traceability dashboard: AC → Test Case → Automation → Release gate',
      ],
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings & Workspace Preferences"
        description="Configure theme, AI engine, integrations, regulatory compliance posture, and production roadmap."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
          <Card title="Interface Theme" subtitle="Choose your preferred interface appearance">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div
                onClick={() => setTheme('light')}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${theme === 'light' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Sun size={20} style={{ color: '#0284C7' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Light Mode</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Clean Enterprise SaaS</div>
                </div>
              </div>

              <div
                onClick={() => setTheme('dark')}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: '#111827',
                  color: '#F3F4F6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Moon size={20} style={{ color: '#38BDF8' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Dark Mode</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Developer Deep Slate</div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Workspace Preferences">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Workspace Name" defaultValue="Verix Core Workspace" />
              <Select
                label="Default Test Framework"
                options={[
                  { value: 'playwright', label: 'Playwright (TypeScript)' },
                  { value: 'cypress', label: 'Cypress (TypeScript)' },
                  { value: 'selenium', label: 'Selenium (Java)' },
                ]}
                defaultValue="playwright"
              />
              <Button
                variant="primary"
                size="sm"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => showToast('Preferences Saved', 'Workspace configuration updated', 'success')}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'ai-models' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
          <Card title="AI Copilot Model Configuration" subtitle="Set prompt models and reasoning temperature">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Select
                label="Reasoning Engine"
                options={[
                  { value: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash (Fastest Reasoning & High Quality)' },
                  { value: 'gemini-3-pro', label: 'Gemini 3 Pro (Deep Multimodal Verification)' },
                ]}
                defaultValue="gemini-3.7-flash"
              />
              <Input
                label="AI Test Case Temperature"
                type="number"
                defaultValue="0.2"
                hint="Lower values ensure reproducible, deterministic test steps"
              />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
          <Card title="Issue Tracker & CI/CD Pipelines">
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Connect your Jira Cloud instance or Azure DevOps pipeline to sync requirements and trigger test runs.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Jira Cloud</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Connected to workspace: acme.atlassian.net</div>
                </div>
                <span className="badge badge-passed">Connected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>GitHub Actions Pipeline</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trigger automated Playwright test suites on PR</div>
                </div>
                <span className="badge badge-passed">Active</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ===================== REGULATORY & COMPLIANCE TAB ===================== */}
      {activeTab === 'regulatory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Header Banner */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(16,185,129,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <Shield size={24} style={{ color: '#818CF8', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Regulatory & Quality Compliance Framework
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Verix is designed from the ground up for use in regulated medical device software environments.
                As a QA platform operating within the S&N software development lifecycle, Verix addresses
                key regulatory standards including <strong>21 CFR Part 11</strong>, <strong>IEC 62304</strong>,{' '}
                <strong>GDPR/HIPAA</strong>, and the <strong>GAMP 5</strong> computerised systems validation framework.
                All AI outputs are proposals subject to mandatory human review — no AI artifact is promoted without qualified SDET sign-off.
              </p>
            </div>
          </div>

          {/* Compliance Items */}
          {complianceItems.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '999px',
                    backgroundColor: item.bg,
                    border: `1px solid ${item.border}`,
                    color: item.color,
                  }}
                >
                  {item.status}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {item.points.map((pt, j) => (
                  <li key={j} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '0.5rem',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '0.5rem',
            }}
          >
            Verix Regulatory Framework v1.0 · S&N Internal QA Platform · Not for clinical patient use · All AI suggestions require human approval
          </div>
        </div>
      )}

      {/* ===================== PATH TO PRODUCTION TAB ===================== */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Header */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(56,189,248,0.08) 100%)',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <Rocket size={24} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Path to Production — 12-Month Roadmap
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Verix transitions from a fully functional prototype to a production-grade, S&N-integrated QA platform in three structured phases.
                The current prototype validates all core concepts — AI test generation, self-healing automation, BDD execution, and PDF reporting.
                Production deployment connects real data sources (Jira, Playwright, Azure) and completes the regulatory validation lifecycle.
              </p>
            </div>
          </div>

          {/* Current State */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '2px solid rgba(99,102,241,0.4)',
              padding: '1rem 1.5rem',
              backgroundColor: 'rgba(99,102,241,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <GitBranch size={20} style={{ color: '#818CF8' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: '#818CF8' }}>
                NOW — Prototype (Hackathon Demo)
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                React + TypeScript + Vite · Fully functional UI · All AI features simulated · Published on GitHub · 0 build errors
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(99,102,241,0.15)',
                color: '#818CF8',
                border: '1px solid rgba(99,102,241,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              ✓ Complete
            </span>
          </div>

          {/* Phase Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {roadmapPhases.map((phase, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${phase.color}40`,
                  backgroundColor: `${phase.color}08`,
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: `${phase.color}20`,
                        border: `2px solid ${phase.color}60`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: phase.color,
                        flexShrink: 0,
                      }}
                    >
                      {phase.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: phase.color }}>
                        {phase.phase} — {phase.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Owner: {phase.owner}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: '999px',
                      backgroundColor: `${phase.color}15`,
                      color: phase.color,
                      border: `1px solid ${phase.color}35`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📅 {phase.timeline}
                  </span>
                </div>

                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {phase.steps.map((step, j) => (
                    <li key={j} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '0.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            Roadmap subject to S&N IT governance approval · Timeline estimates assume 2 dedicated SDETs + 1 Platform Engineer
          </div>
        </div>
      )}
    </div>
  );
};
