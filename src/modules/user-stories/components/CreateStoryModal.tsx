import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { AIActionButton, AIResultContainer } from '../../../components/ai';
import { UserStory, PriorityLevel } from '../../../types';
import { mockUsers } from '../../../mock';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: UserStory) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onStoryCreated,
}) => {
  const [tab, setTab] = useState<'ai' | 'manual'>('ai');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Form State
  const [storyKey, setStoryKey] = useState(`CLOUD-${Math.floor(Math.random() * 800 + 205)}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [criteriaList, setCriteriaList] = useState<string[]>([
    'Admin can configure policy toggles via the workspace settings',
    'Persist setting across user login sessions and API calls',
    'Record an audit log entry in the security compliance ledger',
  ]);
  const [newCriteriaText, setNewCriteriaText] = useState('');

  const handleAddCriteria = () => {
    if (!newCriteriaText.trim()) return;
    setCriteriaList([...criteriaList, newCriteriaText.trim()]);
    setNewCriteriaText('');
  };

  const handleRemoveCriteria = (index: number) => {
    setCriteriaList(criteriaList.filter((_, i) => i !== index));
  };

  const handleSynthesizeFromAI = () => {
    if (!aiPrompt.trim()) return;
    setIsSynthesizing(true);

    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      let genTitle = aiPrompt;
      let genNarrative = `As an authenticated user, I want to ${aiPrompt.toLowerCase()} so that I can ensure reliable and secure workflows.`;
      let genCriteria = [
        `Validate all user input and permissions before triggering action`,
        `Enforce role-based access control and security logging`,
        `Display instant UI status feedback with error recovery states`,
        `Persist state across application reload and API synchronization`,
      ];

      if (promptLower.includes('sso') || promptLower.includes('okta') || promptLower.includes('login')) {
        genTitle = 'Single Sign-On (SSO) Authentication with Okta SAML 2.0';
        genNarrative = 'As an Enterprise Team Member, I want to log in via Okta SSO with automated session provisioning and MFA fallback.';
        genCriteria = [
          'Support SAML 2.0 assertion flow from enterprise identity provider',
          'Automate user just-in-time (JIT) role assignment upon first login',
          'Enforce 2FA challenge when logging in from unrecognized IP range',
          'Terminate session cleanly across identity provider and local tokens on logout',
        ];
      } else if (promptLower.includes('audit') || promptLower.includes('log') || promptLower.includes('compliance')) {
        genTitle = 'Automated Security Event & Audit Trail Logging';
        genNarrative = 'As a Compliance Officer, I want immutable event logs for all administrative permission changes and data export requests.';
        genCriteria = [
          'Record timestamp, user role, IP address, and changed fields in audit ledger',
          'Support export of security logs in JSON and CSV format',
          'Enforce 90-day retention lock with tamper-evident checksums',
        ];
      }

      setTitle(genTitle);
      setDescription(genNarrative);
      setCriteriaList(genCriteria);
      setIsSynthesizing(false);
      setTab('manual'); // Switch to review form
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newStory: UserStory = {
      id: `story-${Date.now()}`,
      projectId: 'proj-1',
      key: storyKey,
      title: title.trim(),
      description: description.trim() || `As a user, I want to ${title.toLowerCase()}`,
      acceptanceCriteria: criteriaList.length > 0 ? criteriaList : ['Default verification criteria'],
      status: 'Ready for QA',
      priority,
      assignee: mockUsers[0],
      coverageStatus: 'Uncovered',
      testCaseCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onStoryCreated(newStory);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create or Import User Story"
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setTab('ai')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid var(--border-subtle)',
                backgroundColor: tab === 'ai' ? 'var(--accent-primary-light)' : 'transparent',
                color: tab === 'ai' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} />
              <span>AI Synthesizer</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('manual')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid var(--border-subtle)',
                backgroundColor: tab === 'manual' ? 'var(--accent-primary-light)' : 'transparent',
                color: tab === 'manual' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FileText size={12} />
              <span>Story Form</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            {tab === 'manual' ? (
              <Button variant="primary" size="md" leftIcon={<Plus size={14} />} onClick={handleSubmit}>
                Save User Story
              </Button>
            ) : (
              <AIActionButton
                size="md"
                isLoading={isSynthesizing}
                disabled={!aiPrompt.trim()}
                onClick={handleSynthesizeFromAI}
              >
                Synthesize Story
              </AIActionButton>
            )}
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tab === 'ai' ? (
          /* AI Story Synthesizer Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Enter a brief requirement prompt or paste a raw Jira requirement. Verix AI will structure the user story narrative and generate formal Acceptance Criteria.
            </p>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                Requirement Prompt / Feature Description
              </label>
              <textarea
                rows={3}
                className="input"
                placeholder="e.g. Single Sign-On with Okta SAML 2.0 and automated role mapping..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                style={{ resize: 'vertical', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick templates:</span>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '11px', padding: '2px 6px' }}
                onClick={() => setAiPrompt('Single Sign-On (SSO) with Okta and MFA challenge')}
              >
                + Okta SSO Login
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '11px', padding: '2px 6px' }}
                onClick={() => setAiPrompt('Automated Security Event & Audit Trail Logging')}
              >
                + Security Audit Trail
              </button>
            </div>
          </div>
        ) : (
          /* Manual Story Form Tab */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Story Key
                </label>
                <Input value={storyKey} onChange={(e) => setStoryKey(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Story Title
                </label>
                <Input
                  placeholder="e.g. Workspace Admin Data Export & PII Masking..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Priority
                </label>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  options={[
                    { value: 'Critical', label: 'Critical' },
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' },
                  ]}
                />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                  Assignee
                </label>
                <div style={{ padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-hover)', fontSize: 'var(--text-xs)' }}>
                  {mockUsers[0].name} ({mockUsers[0].role})
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                User Story Narrative (As a... I want to... so that...)
              </label>
              <textarea
                rows={2}
                className="input"
                placeholder="As an Organization Admin, I want to..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical', width: '100%' }}
              />
            </div>

            {/* Acceptance Criteria List Builder */}
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
                Acceptance Criteria ({criteriaList.length})
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                {criteriaList.map((crit, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-hover)',
                      fontSize: 'var(--text-xs)',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>• {crit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCriteria(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-failed)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Criteria Input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input
                  placeholder="Type new acceptance criterion..."
                  value={newCriteriaText}
                  onChange={(e) => setNewCriteriaText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCriteria();
                    }
                  }}
                />
                <Button type="button" size="sm" variant="secondary" onClick={handleAddCriteria}>
                  Add
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
