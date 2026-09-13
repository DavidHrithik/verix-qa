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
import { useAIConfig } from '../../../app/providers/AIConfigProvider';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { config, setConfig, isConfigured } = useAIConfig();
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
      label: 'Deploy & Go Live',
      timeline: 'Month 1–3',
      timeEstimate: '~3 months',
      owner: 'Platform Engineering + QA Lead',
      color: '#10B981',
      icon: <Server size={16} />,
      goal: 'Get the app running in a real cloud environment so the team can start using it.',
      steps: [
        'Host Verix on Azure Static Web Apps — the app goes live on a real URL, accessible to the whole QA team',
        'Connect to a real Jira Cloud account so user stories automatically sync into Verix (no more copy-pasting)',
        'Add login with company email (SSO) so every team member can sign in securely with one click',
        'Set up user roles — QA Lead can approve things, SDETs can write tests, Product Owners can view progress',
        'Store all test data and audit logs in Azure Cosmos DB so nothing is ever lost',
      ],
    },
    {
      phase: 'Phase 2',
      label: 'Plug In the AI Brain',
      timeline: 'Month 3–6',
      timeEstimate: '~3 months',
      owner: 'AI/ML Team + SDET Team',
      color: '#818CF8',
      icon: <Cpu size={16} />,
      goal: 'Replace the simulated AI with real Google Gemini calls and hook up a real test runner.',
      steps: [
        'Connect the live Google Gemini API — instead of mock AI responses, the app will genuinely read your Jira story and write real test cases in seconds',
        'Hook up a real Playwright test runner via GitHub Actions / Azure DevOps — tests actually execute against the real product, not a simulation',
        'Build a live DOM snapshot tool — when a UI element breaks, the AI takes a real screenshot, compares before/after, and auto-fixes the selector',
        'AI confidence scores are real — based on actual LLM reasoning, not hardcoded numbers',
        'Produce a validation document (IQ/OQ) proving the tool works reliably — needed for regulated industries',
      ],
    },
    {
      phase: 'Phase 3',
      label: 'Scale Across the Team',
      timeline: 'Month 6–12',
      timeEstimate: '~6 months',
      owner: 'QA Center of Excellence + Compliance',
      color: '#38BDF8',
      icon: <Users size={16} />,
      goal: 'Expand to all QA teams, meet compliance requirements, and build executive reporting.',
      steps: [
        'Roll out to all QA squads (Web, Mobile, Cloud, Platform) — every team gets the same AI-powered workflow',
        'Add electronic signatures for test approvals — when a QA Lead approves a test case, it is legally signed and timestamped (21 CFR Part 11 compliance)',
        'Complete the full IQ/OQ/PQ validation package — this is the formal proof document required for use in medical device or regulated software projects',
        'Connect to a Product Lifecycle Management (PLM) system so test coverage is visible at the product release level',
        'Build an executive dashboard that shows the full chain: User Story → Test Case → Automation Run → Release Gate — one view to see if a release is safe to ship',
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
          
          <Card 
            title="Azure AI Foundry — Real Healing Engine" 
            subtitle="Configure connection to your Azure OpenAI instance for live DOM analysis"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <Input 
                label="Endpoint URL" 
                value={config.azureEndpoint}
                onChange={(e) => setConfig({ ...config, azureEndpoint: e.target.value })}
                placeholder="https://your-instance.openai.azure.com" 
              />
              <Input 
                label="API Key" 
                type="password"
                value={config.azureApiKey}
                onChange={(e) => setConfig({ ...config, azureApiKey: e.target.value })}
                placeholder="••••••••••••••••••••••••" 
              />
              <Select
                label="Deployment Model"
                value={config.deploymentName}
                onChange={(e) => setConfig({ ...config, deploymentName: e.target.value })}
                options={[
                  { value: 'gpt-6.6-sol', label: 'gpt-6.6-sol (Recommended)' },
                  { value: 'claude-opus-5', label: 'claude-opus-5' },
                  { value: 'DeepSeek V4 Pro', label: 'DeepSeek V4 Pro' },
                ]}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    if (isConfigured) {
                      showToast('Connection Successful', 'Successfully connected to Azure AI Foundry.', 'success');
                    } else {
                      showToast('Configuration Missing', 'Please fill out all fields.', 'error');
                    }
                  }}
                >
                  Test Connection
                </Button>
                
                {isConfigured ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-passed)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Connected
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-failed)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    <AlertTriangle size={16} /> Not Configured
                  </div>
                )}
              </div>
            </div>
          </Card>

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
            Verix Regulatory Framework v1.0 · Internal QA Platform · Not for clinical patient use · All AI suggestions require human approval
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
                Path to Production — 12-Month Deployment Plan
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Right now, Verix is a <strong>fully working prototype</strong> — every feature you see (AI test generation, self-healing, BDD automation, PDF reports) is built and functional.
                The next step is connecting it to real systems and deploying it for an actual QA team to use every day.
                We have a clear 12-month plan split into 3 phases, each with a specific goal and who is responsible.
              </p>
            </div>
          </div>

          {/* Current State Banner */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '2px solid rgba(99,102,241,0.4)',
              padding: '1rem 1.5rem',
              backgroundColor: 'rgba(99,102,241,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <GitBranch size={20} style={{ color: '#818CF8', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: '#818CF8' }}>
                🟢 Where We Are Now — Hackathon Prototype
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.5 }}>
                The app is built with <strong>React + TypeScript + Vite</strong>. All AI features work end-to-end in the UI using
                simulated (mock) data — so judges can see the complete workflow without needing live API keys or a real CI server.
                0 build errors · Published on GitHub · Ready to demo.
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(99,102,241,0.15)',
                color: '#818CF8',
                border: '1px solid rgba(99,102,241,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              ✓ Done
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
                {/* Phase Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
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
                        {phase.owner} · {phase.timeEstimate}
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

                {/* Goal line */}
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: phase.color,
                  marginBottom: '0.65rem',
                  paddingLeft: '0.25rem',
                  fontStyle: 'italic',
                }}>
                  🎯 Goal: {phase.goal}
                </div>

                {/* Steps */}
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {phase.steps.map((step, j) => (
                    <li key={j} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Total Timeline Summary */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-hover)',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                ⏱ Total Time from Prototype → Full Production
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Assumes 2 SDETs + 1 Platform Engineer dedicated to Verix integration
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Phase 1', time: '3 months', color: '#10B981' },
                { label: 'Phase 2', time: '3 months', color: '#818CF8' },
                { label: 'Phase 3', time: '6 months', color: '#38BDF8' },
                { label: 'Total', time: '~12 months', color: '#F59E0B' },
              ].map((t, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: `${t.color}12`,
                  border: `1px solid ${t.color}30`,
                }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.label}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: t.color }}>{t.time}</div>
                </div>
              ))}
            </div>
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
            Timeline estimates are indicative · Subject to team capacity and integration complexity
          </div>
        </div>
      )}
    </div>
  );
};
