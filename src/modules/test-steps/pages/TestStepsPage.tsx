import React, { useState } from 'react';
import { Wand2, Sparkles, Plus, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SplitPane } from '../../../components/ui/SplitPane';
import { AIGeneratedBadge, AIResultContainer, AIApproveReject } from '../../../components/ai';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockTestCases } from '../../../mock';
import { TestCase, TestStep } from '../../../types';

// =========================================================================
// MODULE 3: AI Test Step Expander
// Owner: TBD (Team Member D)
// Description: Takes high-level brief test descriptions and expands them into
// step-by-step deterministic reproduction steps, UI assertion checkpoints, and data fixtures.
// =========================================================================

export const TestStepsPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase>(mockTestCases[0]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Test Step Expander"
        description={`Deconstruct brief manual test scenarios into step-by-step deterministic reproduction flows with AI assistance.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Test Step AI' }]}
        badge={<span className="badge badge-ai">Step Synthesizer</span>}
        actions={
          <Button
            variant="ai"
            size="sm"
            leftIcon={<Wand2 size={14} />}
            onClick={() => showToast('AI Step Expander', `Expanding steps for ${selectedTestCase.key}`, 'info')}
          >
            Auto-Expand Steps
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Module Boundary: AI Test Step Expander">
          // MODULE 3: AI Test Step Expander implementation goes here.
          <br />
          Owner: TBD. Modular files live inside <code>src/modules/test-steps/</code>.
        </Alert>
      </div>

      <SplitPane
        leftWidth="340px"
        left={
          <Card title="Select Test Scenario" subtitle="Choose a case to inspect or expand">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mockTestCases.map((tc: TestCase) => {
                const isSelected = tc.id === selectedTestCase.id;
                return (
                  <div
                    key={tc.id}
                    onClick={() => setSelectedTestCase(tc)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-surface-hover)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        {tc.key}
                      </span>
                      {tc.isAiGenerated && <AIGeneratedBadge />}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {tc.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        }
        right={
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{selectedTestCase.key}: Detailed Execution Steps</span>
              </div>
            }
            subtitle={`${selectedTestCase.steps.length} deterministic execution steps defined`}
            actions={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={13} />}
                onClick={() => showToast('Step Added', 'New step block inserted', 'info')}
              >
                Add Step
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedTestCase.steps.map((step: TestStep) => (
                <div
                  key={step.stepNumber}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--accent-primary)' }}>
                      STEP {step.stepNumber}
                    </span>
                    {step.isAiExpanded && <AIGeneratedBadge label="AI Expanded" />}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    <strong>Action:</strong> {step.action}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CornerDownRight size={13} style={{ color: 'var(--status-passed)' }} />
                    <span><strong>Expected:</strong> {step.expectedResult}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        }
      />
    </div>
  );
};
