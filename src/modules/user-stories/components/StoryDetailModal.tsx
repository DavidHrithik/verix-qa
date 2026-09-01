import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
  Clock,
  User,
  ArrowRight,
  ListChecks,
  CheckCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { UserStory, TestCase } from '../../../types';
import { mockTestCases } from '../../../mock';

interface StoryDetailModalProps {
  story: UserStory | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateTests: (story: UserStory) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  isOpen,
  onClose,
  onGenerateTests,
}) => {
  if (!story) return null;

  const linkedTestCases = mockTestCases.filter((tc) => tc.storyId === story.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Story Requirement: ${story.key}`}
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Coverage Status: <Badge variant={story.coverageStatus === 'Full' ? 'passed' : 'warning'}>{story.coverageStatus}</Badge>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ai"
              size="md"
              leftIcon={<Sparkles size={14} />}
              onClick={() => {
                onClose();
                onGenerateTests(story);
              }}
            >
              Generate All Test Vectors
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Story Title & Meta Bar */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 'var(--text-md)',
                  color: 'var(--accent-primary)',
                }}
              >
                {story.key}
              </span>
              <Badge variant={story.priority === 'Critical' ? 'failed' : story.priority === 'High' ? 'warning' : 'default'}>
                {story.priority} Priority
              </Badge>
              <Badge variant="passed">{story.status}</Badge>
            </div>

            {story.assignee && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <User size={13} />
                <span>Assignee: <strong>{story.assignee.name}</strong></span>
              </div>
            )}
          </div>

          <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {story.title}
          </div>

          {story.description && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-hover)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            >
              "{story.description}"
            </div>
          )}
        </div>

        {/* Acceptance Criteria Checklist */}
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListChecks size={16} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                Acceptance Criteria ({story.acceptanceCriteria.length})
              </span>
            </div>
            <span className="badge badge-default" style={{ fontSize: '10px' }}>
              Standard Given/When/Then Scope
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {story.acceptanceCriteria.map((criterion, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  fontSize: 'var(--text-xs)',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '10px',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)', marginRight: '6px' }}>
                    AC-{idx + 1}:
                  </span>
                  {criterion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Test Cases Breakdown */}
        <div className="card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={16} style={{ color: '#10B981' }} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                Linked Test Cases ({linkedTestCases.length > 0 ? linkedTestCases.length : story.testCaseCount})
              </span>
            </div>
            <Badge variant="passed">
              {linkedTestCases.length > 0 ? `${linkedTestCases.length} Verified` : `${story.testCaseCount} Synthesized`}
            </Badge>
          </div>

          {linkedTestCases.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {linkedTestCases.map((tc) => (
                <div
                  key={tc.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px', color: 'var(--accent-primary)' }}>
                      {tc.key}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tc.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                    <Badge variant={tc.priority === 'Critical' ? 'failed' : 'warning'}>{tc.priority}</Badge>
                    <Badge variant="passed">{tc.lastExecutionStatus || 'Passed'}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Click <strong>"Generate All Test Vectors"</strong> below to synthesize functional, boundary, and security test cases.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
