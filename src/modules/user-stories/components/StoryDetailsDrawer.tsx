import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  ExternalLink,
  ShieldAlert,
  Clock,
  User as UserIcon,
  Trash2,
  ChevronRight,
  FileCode2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { UserStory } from '../../../types';
import { useToast } from '../../../app/providers/ToastProvider';

interface StoryDetailsDrawerProps {
  story: UserStory | null;
  onClose: () => void;
  onDeleteStory: (id: string) => void;
}

export const StoryDetailsDrawer: React.FC<StoryDetailsDrawerProps> = ({
  story,
  onClose,
  onDeleteStory,
}) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!story) return null;

  const sourceBadge = () => {
    switch (story.source) {
      case 'jira':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0EA5E9', background: 'rgba(14,165,233,0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
            <ExternalLink size={11} /> Jira Synced
          </span>
        );
      case 'excel':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#22C55E', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
            <FileSpreadsheet size={11} /> Excel Imported
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
            Manual Entry
          </span>
        );
    }
  };

  const drawerContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-2xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-hover)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)' }}>
              {story.key}
            </span>
            {sourceBadge()}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0 }}>
              {story.title}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem', alignItems: 'center' }}>
              <Badge variant={story.priority === 'Critical' ? 'failed' : story.priority === 'High' ? 'warning' : 'default'}>
                {story.priority} Priority
              </Badge>
              <Badge variant={story.coverageStatus === 'Full' ? 'passed' : story.coverageStatus === 'Partial' ? 'warning' : 'failed'}>
                {story.coverageStatus} Coverage
              </Badge>
              {story.storyPoints && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {story.storyPoints} Story Points
                </span>
              )}
            </div>
          </div>

          {/* Description statement */}
          <div
            style={{
              background: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
              User Story Statement
            </div>
            {story.description}
          </div>

          {/* Acceptance Criteria Checklist */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Acceptance Criteria ({story.acceptanceCriteria.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {story.acceptanceCriteria.map((ac, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.4
                  }}
                >
                  <CheckCircle2 size={15} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{ac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI QA Test Generation Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(14,165,233,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                AI Test Case Generator
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Automatically generate positive, negative, and edge-case test suites for this requirement using Gemini AI.
            </p>
            <Button
              variant="ai"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={() => {
                onClose();
                navigate('/test-cases');
                showToast('AI Generation', `Synthesizing test scenarios for ${story.key}`, 'info');
              }}
            >
              Synthesize Test Suite
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            style={{ color: '#EF4444' }}
            leftIcon={<Trash2 size={13} />}
            onClick={() => {
              onDeleteStory(story.id);
              onClose();
              showToast('Story Removed', `${story.key} deleted from backlog`, 'info');
            }}
          >
            Delete Story
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
