import React, { useState } from 'react';
import { FileCode2, Sparkles, Plus, Check, X, Filter } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Table, Column } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { AIActionButton, AIGeneratedBadge, AIResultContainer, AIConfidenceIndicator, AIApproveReject } from '../../../components/ai';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockTestCases } from '../../../mock';
import { TestCase } from '../../../types';

// =========================================================================
// MODULE 1 (or 3): AI Test Case Generator
// Owner: TBD (Team Member C)
// Description: Multi-turn prompt engine for synthesizing structured test cases,
// boundary checks, negative edge-scenarios, and Gherkin definitions from stories.
// =========================================================================

export const TestCasesPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const [showAiPreview, setShowAiPreview] = useState(false);

  const columns: Column<TestCase>[] = [
    {
      key: 'key',
      header: 'Test ID',
      width: '100px',
      render: (tc: TestCase) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
          {tc.key}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Test Scenario & Steps',
      render: (tc: TestCase) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{tc.title}</span>
            {tc.isAiGenerated && <AIGeneratedBadge confidence={tc.aiConfidence} />}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
            {tc.steps.length} Steps defined • {tc.tags.join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '120px',
      render: (tc: TestCase) => <span className="badge badge-default">{tc.type}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '100px',
      render: (tc: TestCase) => {
        const variant = tc.priority === 'Critical' ? 'failed' : tc.priority === 'High' ? 'warning' : 'default';
        return <Badge variant={variant}>{tc.priority}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (tc: TestCase) => <span className="badge badge-passed">{tc.status}</span>,
    },
    {
      key: 'lastExecutionStatus',
      header: 'Last Run',
      width: '110px',
      render: (tc: TestCase) => {
        const variant = tc.lastExecutionStatus === 'Passed' ? 'passed' : tc.lastExecutionStatus === 'Failed' ? 'failed' : 'default';
        return <Badge variant={variant}>{tc.lastExecutionStatus || 'Untested'}</Badge>;
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Test Cases & Suites"
        description={`Standard and AI synthesized test case definitions for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Test Cases' }]}
        badge={<span className="badge badge-default">{mockTestCases.length} Tests</span>}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => showToast('Create Test Case', 'Opening manual test editor modal', 'info')}
            >
              Add Manual Case
            </Button>
            <AIActionButton
              size="sm"
              onClick={() => setShowAiPreview(!showAiPreview)}
            >
              {showAiPreview ? 'Hide AI Preview' : 'AI Generate Tests'}
            </AIActionButton>
          </>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Module Boundary: AI Test Case Generator">
          // MODULE 1: AI Test Case Generator implementation goes here.
          <br />
          Owner: TBD. Modular files live inside <code>src/modules/test-cases/</code>.
        </Alert>
      </div>

      {/* AI Demonstration Container */}
      {showAiPreview && (
        <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in">
          <AIResultContainer
            title="AI Test Synthesis: DBANK-104 International Wire Transfer"
            confidence={96}
            badgeText="Gemini Flash QA Agent"
            headerActions={
              <AIApproveReject
                onApprove={() => {
                  setShowAiPreview(false);
                  showToast('Test Cases Approved', 'Synthesized test scenarios saved to repository', 'success');
                }}
                onReject={() => {
                  setShowAiPreview(false);
                  showToast('Discarded', 'AI synthesized drafts removed', 'info');
                }}
              />
            }
          >
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p>
                Synthesized <strong>4 high-priority boundary scenarios</strong> covering FX rate jitter, session invalidation during OTP prompt, and IBAN format regex edge cases.
              </p>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <code>
                  Scenario: High-value wire triggering SMS MFA timeout<br />
                  Given user initiates wire transfer &gt; $1,000 USD<br />
                  When the 60-second OTP challenge countdown expires<br />
                  Then secure token should invalidate and provide 'Resend Code' fallback
                </code>
              </div>
            </div>
          </AIResultContainer>
        </div>
      )}

      <Table<TestCase>
        columns={columns}
        data={mockTestCases}
        keyExtractor={(tc: TestCase) => tc.id}
      />
    </div>
  );
};
