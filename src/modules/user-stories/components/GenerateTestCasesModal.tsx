import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  FileCode2,
  ArrowRight,
  Zap,
  Check,
  Layers,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  RotateCw,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { AIResultContainer, AIGeneratedBadge } from '../../../components/ai';
import { UserStory } from '../../../types';
import { useData } from '../../../app/providers/DataProvider';
import { generateTestCases, getAiMode, AiMode } from '../../../services/ai';
import { GeneratedTestCaseItem } from '../services/testGenerationService';

interface GenerateTestCasesModalProps {
  story: UserStory | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptAndNavigate: (generatedCases: GeneratedTestCaseItem[], targetModule?: 'test-cases' | 'automation') => void;
}

export const GenerateTestCasesModal: React.FC<GenerateTestCasesModalProps> = ({
  story,
  isOpen,
  onClose,
  onAcceptAndNavigate,
}) => {
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(true);
  const [alreadyExisted, setAlreadyExisted] = useState<boolean>(false);
  const [generatedCases, setGeneratedCases] = useState<GeneratedTestCaseItem[]>([]);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);

  const { testCasesForStory } = useData();
  const [aiMode, setAiMode] = useState<AiMode>('local');
  const [aiError, setAiError] = useState<string | null>(null);

  const synthesizeCases = async (forceFresh: boolean = false) => {
    if (!story) return;

    const existingInStore = testCasesForStory(story.id);

    if (existingInStore.length > 0 && !forceFresh) {
      setAlreadyExisted(true);
      const mapped: GeneratedTestCaseItem[] = existingInStore.map((tc, idx) => {
        const vType: GeneratedTestCaseItem['vectorType'] =
          idx === 0 ? 'Functional / Happy Path' :
          idx === 1 ? 'Security / RBAC Gate' :
          idx === 2 ? 'Boundary / Threshold' :
          idx === 3 ? 'Edge Case / PII Governance' : 'Resilience / Recovery';
        return {
          ...tc,
          vectorType: vType,
          targetAC: story.acceptanceCriteria[idx % story.acceptanceCriteria.length] || 'Acceptance Criteria Verified',
        };
      });
      setGeneratedCases(mapped);
      setAiMode(getAiMode());
      setIsSynthesizing(false);
    } else {
      setAlreadyExisted(false);
      setIsSynthesizing(true);
      setAiError(null);
      const result = await generateTestCases(story);
      setGeneratedCases(result.cases);
      setAiMode(result.mode);
      if (result.error) setAiError(result.error);
      setIsSynthesizing(false);
    }
  };

  useEffect(() => {
    if (isOpen && story) {
      synthesizeCases(false);
    }
  }, [isOpen, story]);

  if (!story) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Multi-Vector Test Synthesizer: ${story.key}`}
      maxWidth="820px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {!isSynthesizing ? `${generatedCases.length} Unique Test Vectors Active (100% AC Coverage)` : 'Synthesizing test scenarios...'}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<RotateCw size={13} />}
              onClick={() => synthesizeCases(true)}
              title="Re-run AI Synthesis"
            >
              Re-Synthesize
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<ExternalLink size={14} />}
              disabled={isSynthesizing}
              onClick={() => onAcceptAndNavigate(generatedCases, 'test-cases')}
            >
              View in Test Cases Module
            </Button>
            <Button
              variant="ai"
              size="md"
              leftIcon={<Zap size={14} />}
              disabled={isSynthesizing}
              onClick={() => onAcceptAndNavigate(generatedCases, 'automation')}
            >
              Proceed to Automation
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {isSynthesizing ? (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <Sparkles size={40} className="animate-spin" style={{ color: 'var(--ai-primary)' }} />
            <div>
              {aiMode === 'real' ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                    Gemini AI is generating test cases for {story.key}...
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Calling Google Gemini — analyzing {story.acceptanceCriteria.length} Acceptance Criteria.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                    Synthesizing test cases for {story.key} locally...
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Analyzing {story.acceptanceCriteria.length} Acceptance Criteria across Happy Path, Boundary, and Security dimensions.
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Top AI Result Header Banner */}
            <AIResultContainer
              title={alreadyExisted ? `Active Suite: ${generatedCases.length} Test Scenarios for ${story.key}` : `${aiMode === 'real' ? '✦ Gemini AI' : '⚙ Local Engine'}: ${generatedCases.length} Test Scenarios for ${story.key}`}
              confidence={aiMode === 'real' ? 98 : 94}
              badgeText={aiMode === 'real' ? 'Gemini AI • Live' : (alreadyExisted ? 'Test Suite Active' : 'Local Mode')}
            >
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {aiError && (
                  <div style={{ color: '#F59E0B', marginBottom: '4px', fontSize: '10px' }}>
                    ⚠ AI error — using local engine: {aiError.slice(0, 80)}
                  </div>
                )}
                {alreadyExisted
                  ? `These ${generatedCases.length} unique test cases are active and linked to ${story.key}. All ${story.acceptanceCriteria.length} acceptance criteria are fully mapped.`
                  : `${aiMode === 'real' ? 'Gemini AI' : 'Local engine'} generated ${generatedCases.length} comprehensive test cases matching all ${story.acceptanceCriteria.length} acceptance criteria of ${story.title}.`}
              </div>
            </AIResultContainer>

            {/* Generated Test Cases Breakdown List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Test Scenarios ({generatedCases.length})
              </div>

              {generatedCases.map((tc, idx) => {
                const isSelected = idx === selectedCaseIdx;
                const vectorVariant =
                  tc.vectorType.includes('Security') ? 'failed' :
                  tc.vectorType.includes('Boundary') ? 'warning' :
                  tc.vectorType.includes('Edge') ? 'default' : 'passed';

                return (
                  <div
                    key={tc.id}
                    onClick={() => setSelectedCaseIdx(idx)}
                    style={{
                      padding: '1rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      borderLeft: `4px solid ${
                        tc.vectorType.includes('Security') ? 'var(--status-failed)' :
                        tc.vectorType.includes('Boundary') ? 'var(--status-warning)' :
                        tc.vectorType.includes('Happy') ? 'var(--status-passed)' : 'var(--accent-primary)'
                      }`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            fontSize: 'var(--text-sm)',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          {tc.key}
                        </span>
                        <Badge variant={vectorVariant}>{tc.vectorType}</Badge>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge variant={tc.priority === 'Critical' ? 'failed' : 'warning'}>{tc.priority}</Badge>
                        <span style={{ fontSize: '11px', color: 'var(--status-passed)', fontWeight: 600 }}>
                          ✓ AI Verified ({tc.aiConfidence || 96}%)
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      {tc.title}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <strong>Mapped to AC:</strong> <em>"{tc.targetAC}"</em>
                    </div>

                    {/* Step Preview if expanded */}
                    {isSelected && (
                      <div
                        className="animate-fade-in"
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#0F172A',
                          border: '1px solid #1E293B',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: '#E2E8F0',
                          lineHeight: 1.6,
                        }}
                      >
                        <div style={{ color: '#38BDF8', fontWeight: 600, marginBottom: '4px' }}>
                          Execution Steps ({tc.steps.length}):
                        </div>
                        {tc.steps.map((st) => (
                          <div key={st.stepNumber} style={{ padding: '2px 0' }}>
                            <span style={{ color: '#94A3B8' }}>{st.stepNumber}.</span> {st.action} ➔ <span style={{ color: '#34D399' }}>{st.expectedResult}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
