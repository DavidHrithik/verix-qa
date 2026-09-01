import React, { useState } from 'react';
import { Settings, Sun, Moon, Sparkles, Sliders, Shield, Bell, Check } from 'lucide-react';
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
    </div>
  );
};
