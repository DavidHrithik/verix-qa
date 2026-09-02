import React, { useState } from 'react';
import { Settings, Sun, Moon, Sparkles, Sliders, Shield, Bell, Check, Layers, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Tabs } from '../../../components/ui/Tabs';
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
    { id: 'regulatory', label: 'Regulatory & Compliance' },
    { id: 'roadmap', label: 'Path to Production' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings & Workspace Preferences"
        description="Configure theme styling, AI engine provider keys, and team test environment defaults."
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
                  gap: '0.75rem'
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
                  gap: '0.75rem'
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
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Connected to workspace: acme-bank.atlassian.net</div>
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

      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px' }}>
          <Card 
            title="Path to Production — 12-Month Roadmap"
            subtitle="Verix transitions from a fully functional prototype to a production-grade, S&N-integrated QA platform"
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Verix transitions from a fully functional prototype to a production-grade, S&N-integrated QA platform in three structured phases. The current prototype validates all core concepts — AI test generation, self-healing automation, BDD execution, and PDF reporting. Production deployment connects real data sources (Jira, Playwright, Azure), implements regulatory validation lifecycle, and completes the S&N integration.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* NOW Phase */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Check size={18} style={{ color: 'var(--success-primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>NOW — Prototype (Hackathon Demo)</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  React + TypeScript + Vite · Fully functional UI · All AI features simulated · Published on GitHub · 0 build errors
                </div>
                <span className="badge" style={{ backgroundColor: 'var(--success-surface)', color: 'var(--success-primary)' }}>Complete</span>
              </div>

              {/* Phase 1 */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--ai-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Layers size={18} style={{ color: 'var(--ai-primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Phase 1 — Deploy & Connect (Month 1–3)</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  Owner: Platform Engineering + QA Lead<br/>
                  • Deploy Verix on Azure Static Web Apps (S&N tenant)<br/>
                  • Connect real Jira Cloud REST API to sync live user stories<br/>
                  • Wire up Azure Active Directory SSO for S&N employee login<br/>
                  • Configure role-based access (QA Lead, SDET, Product Owner, Read-Only)<br/>
                  • Establish baseline audit log in Azure Cosmos DB
                </div>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '11px', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>Month 1–3</span>
              </div>

              {/* Phase 2 */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--accent-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-secondary)' }} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Phase 2 — AI Integration (Month 3–6)</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  Owner: AI/ML Team + SDET Team<br/>
                  • Integrate Google Gemini API (or Azure OpenAI) for live AC → Test Case synthesis<br/>
                  • Connect real Playwright test runner via Azure DevOps pipeline webhook<br/>
                  • Build real DOM snapshot capture pipeline for live self-healing analysis<br/>
                  • Implement AI confidence scoring with real LLM token output<br/>
                  • Create execution history storage in Azure SQL Database
                </div>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '11px', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>Month 3–6</span>
              </div>

              {/* Phase 3 */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--warning-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Shield size={18} style={{ color: 'var(--warning-primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Phase 3 — Enterprise & Compliance (Month 6–12)</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  Owner: Security + Compliance Team<br/>
                  • Multi-tenant architecture for partner organizations<br/>
                  • SOC 2 Type II audit readiness (encryption at rest, audit logging)<br/>
                  • SAML/SCIM identity federation with corporate directory<br/>
                  • Advanced audit trail for regulatory compliance (test evidence chain)<br/>
                  • Scaled architecture (99.9% SLA, 50+ parallel test executors)
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'regulatory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px' }}>
          <Card 
            title="Regulatory Compliance & Data Governance"
            subtitle="Security posture, data privacy, and compliance framework"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--success-primary)' }} />
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Data Encryption</div>
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                  <li>TLS 1.3 for all transport</li>
                  <li>AES-256 encryption at rest</li>
                  <li>HTTPS-only API endpoints</li>
                  <li>Secrets in AWS Secrets Manager</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Access & Authentication</div>
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                  <li>SAML 2.0 for enterprise SSO</li>
                  <li>JWT token with refresh rotation</li>
                  <li>Role-based access control (RBAC)</li>
                  <li>MFA support for sensitive operations</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--warning-primary)' }} />
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Audit & Compliance</div>
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                  <li>SOC 2 Type II ready</li>
                  <li>GDPR/CCPA data handling</li>
                  <li>Immutable audit logs</li>
                  <li>90-day retention policy</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--accent-secondary)' }} />
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Data Protection</div>
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                  <li>PII masking in logs</li>
                  <li>Automatic data deletion on request</li>
                  <li>Disaster recovery (RTO: 4hrs)</li>
                  <li>Daily automated backups</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
