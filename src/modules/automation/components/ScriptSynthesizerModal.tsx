import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  FileCode2,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Code2,
  Check,
  Zap,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import { AIActionButton, AIGeneratedBadge, AIResultContainer } from '../../../components/ai';
import { GherkinFeatureViewer } from './GherkinFeatureViewer';
import { mockStories, mockTestCases } from '../../../mock';
import { UserStory, TestCase, AutomationFramework } from '../../../types';
import { synthesizeAutomationScript } from '../services/scriptGenerationService';
import { AutomationScriptExtended } from '../types';

interface ScriptSynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScriptGenerated: (script: AutomationScriptExtended) => void;
}

export const ScriptSynthesizerModal: React.FC<ScriptSynthesizerModalProps> = ({
  isOpen,
  onClose,
  onScriptGenerated,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(mockStories[0].id);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(mockTestCases[0].id);
  const [framework, setFramework] = useState<AutomationFramework>('Playwright');
  const [includeFailureSimulation, setIncludeFailureSimulation] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewScript, setPreviewScript] = useState<AutomationScriptExtended | null>(null);

  const selectedStory = mockStories.find((s) => s.id === selectedStoryId) || mockStories[0];
  const relatedTestCases = mockTestCases.filter((tc) => tc.storyId === selectedStory.id || !tc.storyId);
  const selectedTestCase = relatedTestCases.find((tc) => tc.id === selectedTestCaseId) || relatedTestCases[0];

  const handleSynthesize = () => {
    setIsGenerating(true);
    setPreviewScript(null);

    setTimeout(() => {
      const generated = synthesizeAutomationScript({
        story: selectedStory,
        testCase: selectedTestCase,
        framework,
        includeFailureDemo: includeFailureSimulation,
      });

      setPreviewScript(generated);
      setIsGenerating(false);
    }, 1100);
  };

  const handleSaveAndOpen = () => {
    if (previewScript) {
      onScriptGenerated(previewScript);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Synthesize BDD Automation Feature"
      maxWidth="720px"
      footer={
        previewScript ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Ready to execute in Scenario Runner
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" size="md" onClick={() => setPreviewScript(null)}>
                Modify Inputs
              </Button>
              <Button variant="primary" size="md" leftIcon={<Zap size={14} />} onClick={handleSaveAndOpen}>
                Accept & Launch Runner
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <AIActionButton size="md" isLoading={isGenerating} onClick={handleSynthesize}>
              Synthesize BDD Scenario
            </AIActionButton>
          </div>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {!previewScript ? (
          <>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Select a User Story requirement. Verix AI will synthesize a human-readable <strong>BDD Cucumber Feature (`.feature`)</strong> and its paired Page Object Model.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* User Story Picker */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Target User Story
                </label>
                <Select
                  value={selectedStoryId}
                  onChange={(e) => {
                    setSelectedStoryId(e.target.value);
                    const matchingCases = mockTestCases.filter((tc) => tc.storyId === e.target.value);
                    if (matchingCases.length > 0) setSelectedTestCaseId(matchingCases[0].id);
                  }}
                  options={mockStories.map((s) => ({
                    value: s.id,
                    label: `${s.key}: ${s.title}`,
                  }))}
                />
              </div>

              {/* Framework Selector */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Execution Engine
                </label>
                <Select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as AutomationFramework)}
                  options={[
                    { value: 'Playwright', label: 'Cucumber + Playwright (TypeScript)' },
                    { value: 'Cypress', label: 'Cucumber + Cypress (JavaScript)' },
                    { value: 'Selenium', label: 'Cucumber + Selenium (Java)' },
                  ]}
                />
              </div>
            </div>

            {/* Test Case Selection */}
            {relatedTestCases.length > 0 && (
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Linked Test Scenario
                </label>
                <Select
                  value={selectedTestCaseId}
                  onChange={(e) => setSelectedTestCaseId(e.target.value)}
                  options={relatedTestCases.map((tc) => ({
                    value: tc.id,
                    label: `${tc.key}: ${tc.title}`,
                  }))}
                />
              </div>
            )}

            {/* Story Context Preview Card */}
            <div
              style={{
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedStory.key} Acceptance Criteria ({selectedStory.acceptanceCriteria.length})
                </span>
                <Badge variant={selectedStory.priority === 'Critical' ? 'failed' : 'warning'}>
                  {selectedStory.priority} Priority
                </Badge>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                {selectedStory.acceptanceCriteria.map((ac, idx) => (
                  <li key={idx} style={{ marginBottom: '2px' }}>
                    {ac}
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure injection toggle */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <ShieldAlert size={18} style={{ color: 'var(--status-warning)' }} />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Simulate UI Selector Drift (For Self-Healing Demo)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Injects a legacy locator into the Page Object to demonstrate AI auto-repair.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeFailureSimulation}
                onChange={(e) => setIncludeFailureSimulation(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
              />
            </div>
          </>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AIResultContainer
              title={`Synthesized Feature: ${previewScript.name}`}
              confidence={96}
              badgeText="BDD Synthesizer"
            >
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{previewScript.storyKey}</span>
                <span className="badge badge-default">{previewScript.testCaseKey}</span>
                <span className="badge badge-passed">{previewScript.steps.length} Gherkin Steps</span>
                {includeFailureSimulation && (
                  <span className="badge badge-warning">Simulated Selector Drift Injected</span>
                )}
              </div>

              {/* Formatted Gherkin preview */}
              <GherkinFeatureViewer content={previewScript.gherkinContent || previewScript.code} />
            </AIResultContainer>
          </div>
        )}
      </div>
    </Modal>
  );
};
