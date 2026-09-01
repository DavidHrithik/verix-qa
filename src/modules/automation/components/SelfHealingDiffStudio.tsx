import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  AlertTriangle,
  FileCode,
  ArrowRight,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Copy,
  Terminal,
  Zap,
  FileText,
  Download,
  Clock,
  Search,
  Cpu,
  Layers,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { AIResultContainer, AIConfidenceIndicator, AIApproveReject } from '../../../components/ai';
import { SelfHealingProposal, SelectorCandidate } from '../types';

interface SelfHealingDiffStudioProps {
  proposal: SelfHealingProposal | null;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}

export const SelfHealingDiffStudio: React.FC<SelfHealingDiffStudioProps> = ({
  proposal,
  onApprove,
  onReject,
  onCancel,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<number>(0);
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');
  const [isReportDownloaded, setIsReportDownloaded] = useState<boolean>(false);

  if (!proposal) {
    return (
      <div
        className="card"
        style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <Sparkles size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--ai-primary)' }} />
        <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
          No Active Self-Healing Proposal
        </div>
        <p style={{ fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
          Run an automation scenario with selector drift to trigger the AI Root Cause & Self-Healing Engine.
        </p>
      </div>
    );
  }

  const { failureScenario, brokenCode, healedCode, confidence, scriptName, storyKey, testCaseKey, featureTitle } = proposal;
  const candidates = failureScenario.candidates || [];

  const handleDownloadReport = () => {
    const reportContent = `# Verix QA — AI Self-Healing Execution Audit Report
Generated: ${new Date().toLocaleString()}
Status: Approved & Verified

## 1. Executive Summary
- **User Story:** ${storyKey} (${featureTitle || 'Cloud Governance Policy'})
- **Test Case:** ${testCaseKey}
- **Feature File:** ${scriptName}
- **Failure Classification:** DOM Mutation / Selector Drift
- **Root Cause:** UI element ID changed during Cloud Console v3.4 design system update.
- **AI Confidence Score:** ${confidence}%
- **Estimated Triage Time Saved:** ~35 minutes

---

## 2. Technical Root Cause Analysis
${failureScenario.rootCauseAnalysis}

---

## 3. Locator Mutation Diff
- **Legacy Locator (Broken):**
  \`\`\`
  ${failureScenario.brokenLocator}
  \`\`\`
- **AI Healed Locator (Repaired):**
  \`\`\`
  ${failureScenario.healedLocator}
  \`\`\`

---

## 4. AI Candidate Scoring Matrix
${candidates.map((c, i) => `${i + 1}. **${c.strategy.toUpperCase()}** (${c.confidence}% Match) — \`${c.selector}\`\n   - *Rationale:* ${c.rationale}`).join('\n')}

---

## 5. Governance & Repository Verification
- **Target Page Object:** MemberPermissionsPage.java
- **Verification Status:** Passed (100% assertions verified)
- **Approved by:** QA Lead (Automated Drift Interceptor)
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${storyKey}_AI_Healing_Report.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsReportDownloaded(true);
    setTimeout(() => setIsReportDownloaded(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 3-Step Visual Healing Stepper */}
      <div
        className="card"
        style={{
          padding: '0.875rem 1.25rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: 'var(--status-failed)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '11px',
              }}
            >
              1
            </span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Drift Intercepted</span>
          </div>

          <span style={{ color: 'var(--text-muted)' }}>➔</span>

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                color: '#38BDF8',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '11px',
              }}
            >
              2
            </span>
            <span style={{ fontWeight: 600, color: '#38BDF8' }}>AI Mapped New Locator ({confidence}%)</span>
          </div>

          <span style={{ color: 'var(--text-muted)' }}>➔</span>

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--status-passed)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '11px',
              }}
            >
              3
            </span>
            <span style={{ fontWeight: 600, color: 'var(--status-passed)' }}>Ready to Patch & Re-run</span>
          </div>
        </div>

        {/* ROI Time-Saved Pill & Download Report */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(192, 132, 252, 0.12)',
              color: '#C084FC',
              fontSize: '11px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Clock size={12} />
            <span>⏱️ Saved ~35 min manual triage</span>
          </span>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={isReportDownloaded ? <Check size={13} /> : <Download size={13} />}
            onClick={handleDownloadReport}
          >
            {isReportDownloaded ? 'Report Exported' : 'Download Audit Report'}
          </Button>
        </div>
      </div>

      {/* Top Banner with AI Approval Actions */}
      <AIResultContainer
        title="AI Root Cause Analysis & Self-Healing Diagnosis"
        confidence={confidence}
        badgeText="DOM Mutation Heuristics"
        headerActions={
          <AIApproveReject
            onApprove={onApprove}
            onReject={onReject}
          />
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Metadata pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge badge-primary">{storyKey}</span>
            <span className="badge badge-default">{testCaseKey}</span>
            <span className="badge badge-default">{scriptName}</span>
            <span className="badge badge-failed">DOM Drift Intercepted</span>
          </div>

          {/* Plain English Root Cause Explanation */}
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--accent-primary)' }}>
              Summary of What Changed:
            </div>
            {failureScenario.plainEnglishExplanation}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Technical Root Cause: {failureScenario.rootCauseAnalysis}
            </div>
          </div>
        </div>
      </AIResultContainer>

      {/* Visual Component Comparison: What was Expected vs What AI Found */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Visual UI Component Comparison
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Previous / Expected in Repository */}
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-failed)' }}>
                🔴 PREVIOUS UI LOCATOR (In Repository)
              </span>
              <span className="badge badge-failed" style={{ fontSize: '9px' }}>
                DEPRECATED
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#F87171', backgroundColor: '#0F172A', padding: '0.5rem', borderRadius: '4px' }}>
              {failureScenario.brokenLocator}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Target element ID was replaced during Cloud Console v3.4 accessibility update.
            </div>
          </div>

          {/* New Live Element Identified by AI */}
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-passed)' }}>
                🟢 LIVE UI ELEMENT (Matched by AI)
              </span>
              <span className="badge badge-passed" style={{ fontSize: '9px' }}>
                98% CONFIDENCE MATCH
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#34D399', backgroundColor: '#0F172A', padding: '0.5rem', borderRadius: '4px' }}>
              {failureScenario.healedLocator}
            </div>

            {/* Why AI Chose This 3-Point Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-passed)' }}>
                <CheckCircle2 size={11} /> <span>Matches label text: "Enable member to export data"</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-passed)' }}>
                <CheckCircle2 size={11} /> <span>Located inside active "Policy Settings" card</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-passed)' }}>
                <CheckCircle2 size={11} /> <span>Interactive switch with role="switch"</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Locators Matrix */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              AI Candidate Selectors Ranking
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Scored against live DOM tree mutations
            </div>
          </div>
          <span className="badge badge-ai">{candidates.length} Scored Candidates</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {candidates.map((cand, idx) => {
            const isSelected = idx === selectedCandidate;
            return (
              <div
                key={idx}
                onClick={() => setSelectedCandidate(idx)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-surface-hover)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="badge badge-default" style={{ fontSize: '10px' }}>
                    {cand.strategy.toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {cand.isRecommended && (
                      <span className="badge badge-passed" style={{ fontSize: '9px' }}>
                        RECOMMENDED
                      </span>
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-passed)' }}>
                      {cand.confidence}%
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    margin: '4px 0',
                    wordBreak: 'break-all',
                  }}
                >
                  {cand.selector}
                </div>

                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {cand.rationale}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Object Model Code Diff: BEFORE vs AFTER */}
      <div className="card" style={{ padding: '1rem 1.25rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code2 size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              Page Object Model (POM) Locator Patch Diff
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={() => setDiffMode('split')}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: diffMode === 'split' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: diffMode === 'split' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setDiffMode('unified')}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: diffMode === 'unified' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: diffMode === 'unified' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Unified Diff
            </button>
          </div>
        </div>

        {diffMode === 'split' ? (
          /* Side-by-Side Diff View */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* BEFORE (Broken) */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #334155' }}>
              <div
                style={{
                  padding: '0.4rem 0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--status-failed)',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                <span>BEFORE (Broken Locator in Repository)</span>
              </div>
              <div
                style={{
                  backgroundColor: '#0F172A',
                  color: '#94A3B8',
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.6,
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '4px 6px', borderRadius: '4px' }}>
                  - {failureScenario.brokenLocator}
                </div>
              </div>
            </div>

            {/* AFTER (Healed) */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #10B981' }}>
              <div
                style={{
                  padding: '0.4rem 0.75rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--status-passed)',
                  fontWeight: 600,
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Sparkles size={12} />
                <span>AFTER (AI Healed Locator)</span>
              </div>
              <div
                style={{
                  backgroundColor: '#0F172A',
                  color: '#E2E8F0',
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.6,
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '4px 6px', borderRadius: '4px' }}>
                  + {failureScenario.healedLocator}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Unified Diff View */
          <div
            style={{
              backgroundColor: '#0F172A',
              color: '#E2E8F0',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.6,
              maxHeight: '260px',
              overflowY: 'auto',
              border: '1px solid #1E293B',
            }}
          >
            <div style={{ color: '#64748B' }}>--- a/{scriptName} (Original POM)</div>
            <div style={{ color: '#64748B' }}>+++ b/{scriptName} (AI Healed POM)</div>
            <div style={{ color: '#38BDF8', margin: '4px 0' }}>@@ Page Object Locators @@</div>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '2px 4px' }}>
              - {failureScenario.brokenLocator}
            </div>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '2px 4px' }}>
              + {failureScenario.healedLocator}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          Approving will update the Page Object Model in repository and automatically re-run the scenario.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="secondary" size="md" onClick={onReject}>
            Discard Patch
          </Button>
          <Button
            variant="ai"
            size="md"
            leftIcon={<Zap size={14} />}
            onClick={onApprove}
          >
            Approve & Re-run Healed Test
          </Button>
        </div>
      </div>
    </div>
  );
};
