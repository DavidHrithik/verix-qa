import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Users, FileCode2, Layers,
  Activity, Calendar, X, CheckCircle2, Building2,
  Pencil, Save, UserPlus, Trash2, ChevronRight, Mail, Check
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { Project, ProjectMember } from '../../../types';
import { mockStories, mockTestCases } from '../../../mock';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const roleColors: Record<string, string> = {
  'QA Lead': '#6366F1',
  'QA Engineer': '#0EA5E9',
  'SDET': '#8B5CF6',
  'Product Owner': '#F59E0B',
  'Developer': '#22C55E',
};

const AvatarBubble: React.FC<{ initials: string; role: string; title?: string; size?: number }> = ({
  initials,
  role,
  title,
  size = 32
}) => (
  <div
    title={title}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: roleColors[role] ?? '#64748B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size >= 32 ? '11px' : '9px',
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
      border: '2px solid var(--bg-surface)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      cursor: 'default',
    }}
  >
    {initials}
  </div>
);

/* ─── Member Edit Modal ─────────────────────────────────────────────────────── */

interface MemberModalProps {
  isOpen: boolean;
  projectName: string;
  members: ProjectMember[];
  onClose: () => void;
  onSave: (members: ProjectMember[]) => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ isOpen, projectName, members: initial, onClose, onSave }) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New member form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('QA Engineer');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMembers(initial.map(m => ({ ...m })));
      setEditingId(null);
      setNewName('');
      setNewRole('QA Engineer');
      setNewEmail('');
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'QA';

  const handleAddMember = () => {
    if (!newName.trim()) return;
    const initials = getInitials(newName);
    const email = newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@acme.com`;

    setMembers(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: newName.trim(),
        role: newRole,
        email,
        avatarInitials: initials,
      }
    ]);
    setNewName('');
    setNewEmail('');
    setNewRole('QA Engineer');
  };

  const handleUpdateMemberField = (id: string, field: keyof ProjectMember, value: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const updated = { ...m, [field]: value };
        if (field === 'name') {
          updated.avatarInitials = getInitials(value);
        }
        return updated;
      })
    );
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(x => x.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '560px',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-default)',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(14,165,233,0.4)'
            }}>
              <Users size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                Team Members & Details
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{projectName} • {members.length} Members</div>
            </div>
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

        {/* Member List with Inline Edit */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '1.5rem 0' }}>
              No members assigned yet. Add member details below.
            </div>
          ) : (
            members.map((m) => {
              const isEditing = editingId === m.id;

              if (isEditing) {
                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--bg-surface-hover)',
                      border: '1px solid var(--accent-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.875rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                      boxShadow: '0 0 10px rgba(99,102,241,0.15)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <AvatarBubble initials={m.avatarInitials} role={m.role} />
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</label>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => handleUpdateMemberField(m.id, 'name', e.target.value)}
                            style={{
                              background: 'var(--bg-input)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.35rem 0.5rem',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Role</label>
                          <select
                            value={m.role}
                            onChange={(e) => handleUpdateMemberField(m.id, 'role', e.target.value)}
                            style={{
                              background: 'var(--bg-input)',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.35rem 0.5rem',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          >
                            {Object.keys(roleColors).map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</label>
                        <input
                          type="email"
                          value={m.email || ''}
                          placeholder="e.g. name@acme.com"
                          onChange={(e) => handleUpdateMemberField(m.id, 'email', e.target.value)}
                          style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.35rem 0.5rem',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        style={{ marginTop: '14px', height: '28px', padding: '0 8px' }}
                        leftIcon={<Check size={12} />}
                        onClick={() => setEditingId(null)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem',
                    background: 'var(--bg-surface-hover)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AvatarBubble initials={m.avatarInitials} role={m.role} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {m.name}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: `${roleColors[m.role] ?? '#64748B'}20`,
                          color: roleColors[m.role] ?? '#64748B',
                          fontWeight: 600,
                          border: `1px solid ${roleColors[m.role] ?? '#64748B'}40`
                        }}>
                          {m.role}
                        </span>
                      </div>
                      {m.email && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                          <Mail size={11} /> {m.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <button
                      onClick={() => setEditingId(m.id)}
                      title="Edit member details"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '5px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => removeMember(m.id)}
                      title="Remove member"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '5px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add New Member Section */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--border-default)',
          background: 'rgba(99,102,241,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Add New Team Member
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>Full Name *</label>
              <input
                type="text"
                value={newName}
                placeholder="e.g. Sarah Connor"
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddMember(); }}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.65rem',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.65rem',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {Object.keys(roleColors).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>Email Address</label>
              <input
                type="email"
                value={newEmail}
                placeholder="e.g. sarah.c@acme.com"
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddMember(); }}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.65rem',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              onClick={handleAddMember}
              style={{
                background: 'linear-gradient(135deg, #6366F1, #0EA5E9)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.85rem',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                height: '34px',
                whiteSpace: 'nowrap'
              }}
            >
              <UserPlus size={14} /> Add Member
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--bg-surface-hover)'
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save size={14} />}
            onClick={() => {
              onSave(members);
              onClose();
            }}
          >
            Save Team Changes
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

/* ─── Project Info Modal (Add + Edit) ──────────────────────────────────────── */

type ModalMode = 'add' | 'edit';

interface ProjectModalProps {
  isOpen: boolean;
  mode: ModalMode;
  project?: Project;
  onClose: () => void;
  onAdd: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit: (id: string, changes: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, mode, project, onClose, onAdd, onEdit }) => {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({ name: '', key: '', description: '', activeSprint: '', membersCount: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && isEdit && project) {
      setForm({
        name: project.name,
        key: project.key,
        description: project.description,
        activeSprint: project.activeSprint ?? '',
        membersCount: project.membersCount
      });
      setErrors({});
    } else if (isOpen && !isEdit) {
      setForm({ name: '', key: '', description: '', activeSprint: '', membersCount: 1 });
      setErrors({});
    }
  }, [isOpen, mode, project]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Project name is required';
    if (!form.key.trim()) e.key = 'Project key is required';
    else if (!/^[A-Z0-9]{2,6}$/.test(form.key.toUpperCase())) e.key = '2–6 uppercase letters/digits (e.g. SNC)';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (isEdit && project) {
      onEdit(project.id, {
        name: form.name.trim(),
        key: form.key.toUpperCase().trim(),
        description: form.description.trim(),
        activeSprint: form.activeSprint.trim() || project.activeSprint,
        membersCount: form.membersCount
      });
    } else {
      onAdd({
        name: form.name.trim(),
        key: form.key.toUpperCase().trim(),
        description: form.description.trim(),
        activeSprint: form.activeSprint.trim() || 'Sprint 1',
        membersCount: form.membersCount,
        totalStories: 0,
        totalTestCases: 0,
        healthScore: 0,
        members: []
      });
    }
    onClose();
  };

  const inp = (hasErr: boolean): React.CSSProperties => ({
    background: 'var(--bg-input)',
    border: `1px solid ${hasErr ? '#F87171' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '0.5rem 0.75rem',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  });

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-default)',
          background: isEdit
            ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: isEdit ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'linear-gradient(135deg, #6366F1, #0EA5E9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isEdit ? '0 0 12px rgba(245,158,11,0.4)' : '0 0 12px rgba(99,102,241,0.4)'
            }}>
              {isEdit ? <Pencil size={16} color="#fff" /> : <Building2 size={18} color="#fff" />}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                {isEdit ? `Edit — ${project?.name}` : 'Add New Team'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {isEdit ? 'Update project workspace details' : 'Create a new project workspace'}
              </div>
            </div>
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

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>Project Name *</label>
            <input
              type="text"
              value={form.name}
              placeholder="e.g. Acme Cloud Platform"
              onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
              style={inp(!!errors.name)}
            />
            {errors.name && <span style={{ fontSize: '11px', color: '#F87171' }}>{errors.name}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>Project Key *</label>
              <input
                type="text"
                value={form.key}
                placeholder="e.g. SNC"
                maxLength={6}
                onChange={(e) => { setForm(f => ({ ...f, key: e.target.value.toUpperCase() })); setErrors(er => ({ ...er, key: '' })); }}
                style={inp(!!errors.key)}
              />
              {errors.key && <span style={{ fontSize: '11px', color: '#F87171' }}>{errors.key}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>Active Sprint</label>
              <input
                type="text"
                value={form.activeSprint}
                placeholder="e.g. Sprint 1 (Kickoff)"
                onChange={(e) => setForm(f => ({ ...f, activeSprint: e.target.value }))}
                style={inp(false)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>Description *</label>
            <textarea
              value={form.description}
              placeholder="Describe the project scope..."
              onChange={(e) => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: '' })); }}
              rows={3}
              style={{ ...inp(!!errors.description), resize: 'vertical', fontFamily: 'inherit' }}
            />
            {errors.description && <span style={{ fontSize: '11px', color: '#F87171' }}>{errors.description}</span>}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--bg-surface-hover)'
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={isEdit ? <Save size={14} /> : <Plus size={14} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Save Changes' : 'Create Workspace'}
          </Button>
        </div>
      </div>
    </div>
  );
  return createPortal(content, document.body);
};

/* ─── Projects Page ─────────────────────────────────────────────────────────── */

export const ProjectsPage: React.FC = () => {
  const { projects, activeProject, setActiveProjectId, addProject, updateProject } = useProject();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberProject, setMemberProject] = useState<Project | undefined>(undefined);

  const openAdd = () => { setModalMode('add'); setEditingProject(undefined); setModalOpen(true); };
  const openEdit = (proj: Project) => { setModalMode('edit'); setEditingProject(proj); setModalOpen(true); };
  const openMembers = (proj: Project) => { setMemberProject(proj); setMemberModalOpen(true); };

  const handleAdd = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const p = addProject(data);
    showToast('Team Added', `"${p.name}" workspace created successfully`, 'success');
  };

  const handleEdit = (id: string, changes: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    updateProject(id, changes);
    showToast('Project Updated', 'Changes saved successfully', 'success');
  };

  const handleSaveMembers = (members: ProjectMember[]) => {
    if (!memberProject) return;
    updateProject(memberProject.id, { members, membersCount: members.length });
    showToast('Team Saved', `${members.length} member(s) updated`, 'success');
  };

  const healthColor = (s: number) => s >= 90 ? '#22C55E' : s >= 75 ? '#F59E0B' : '#EF4444';
  const healthLabel = (s: number) => s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s > 0 ? 'Needs Attention' : 'Not Started';

  const statCard = (
    icon: React.ReactNode,
    value: number,
    label: string,
    onClick?: () => void
  ) => (
    <div
      onClick={onClick}
      title={onClick ? `Go to ${label}` : undefined}
      style={{
        background: 'var(--bg-surface-hover)',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.625rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid transparent',
        transition: 'all 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!onClick) return;
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--accent-primary)';
        el.style.background = 'rgba(99,102,241,0.08)';
      }}
      onMouseLeave={(e) => {
        if (!onClick) return;
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'transparent';
        el.style.background = 'var(--bg-surface-hover)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '11px' }}>
          {icon} {label}
        </div>
        {onClick && <ChevronRight size={11} style={{ color: 'var(--text-muted)' }} />}
      </div>
      <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="QA Projects"
        description="All active team workspaces. Select a project to set it as your active QA context across all modules."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
        badge={<span className="badge badge-default">{projects.length} Teams</span>}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>
            Add Team
          </Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {projects.map((proj: Project) => {
          const isActive = proj.id === activeProject.id;
          const isNew = proj.totalTestCases === 0 && proj.totalStories === 0;
          const memberList = proj.members ?? [];

          return (
            <Card
              key={proj.id}
              isHoverable
              style={{
                borderColor: isActive ? 'var(--accent-primary)' : undefined,
                boxShadow: isActive ? '0 0 0 1px var(--accent-primary), var(--shadow-md)' : undefined,
                position: 'relative',
                overflow: 'hidden'
              }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isActive
                        ? 'linear-gradient(135deg, #6366F1, #0EA5E9)'
                        : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(14,165,233,0.15))',
                      color: isActive ? '#FFFFFF' : 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      boxShadow: isActive ? '0 2px 10px rgba(99,102,241,0.4)' : undefined,
                      flexShrink: 0
                    }}>
                      {proj.key.substring(0, 3)}
                    </div>
                    <span style={{ fontWeight: 700 }}>{proj.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    {isActive && <Badge variant="primary">Active</Badge>}
                    {isNew && <Badge variant="default">New</Badge>}
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(proj); }}
                      title="Edit project"
                      style={{
                        background: 'var(--bg-surface-hover)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '4px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.15s',
                        marginLeft: '0.25rem',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.12)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,158,11,0.4)';
                        (e.currentTarget as HTMLButtonElement).style.color = '#F59E0B';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface-hover)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                      }}
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>
              }
              subtitle={proj.description}
            >
              {/* Sprint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Calendar size={12} />
                <span>{proj.activeSprint}</span>
              </div>

              {/* Stats Row — Stories & Tests are dynamically calculated & clickable */}
              {(() => {
                const projectStories = mockStories.filter(s => s.projectId === proj.id);
                const projectTestCases = mockTestCases.filter(t => t.projectId === proj.id);
                const storiesCount = projectStories.length > 0 ? projectStories.length : proj.totalStories;
                const testCasesCount = projectTestCases.length > 0 ? projectTestCases.length : proj.totalTestCases;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                    {statCard(<Users size={13} />, memberList.length > 0 ? memberList.length : proj.membersCount, 'Members', () => openMembers(proj))}
                    {statCard(<Layers size={13} />, storiesCount, 'Stories', () => {
                      setActiveProjectId(proj.id);
                      navigate('/user-stories');
                    })}
                    {statCard(<FileCode2 size={13} />, testCasesCount, 'Tests', () => {
                      setActiveProjectId(proj.id);
                      navigate('/test-cases');
                    })}
                  </div>
                );
              })()}

              {/* Team Members Section */}
              <div style={{
                background: 'var(--bg-surface-hover)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Team ({memberList.length})
                  </span>
                  <button
                    onClick={() => openMembers(proj)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--accent-primary)',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '2px 4px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <Pencil size={11} /> Edit Details
                  </button>
                </div>

                {memberList.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {memberList.slice(0, 4).map((m) => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <AvatarBubble initials={m.avatarInitials} role={m.role} size={28} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.name}
                            </span>
                            <span style={{ fontSize: '10px', color: roleColors[m.role] ?? '#64748B' }}>
                              • {m.role}
                            </span>
                          </div>
                          {m.email && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.email}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {memberList.length > 4 && (
                      <button
                        onClick={() => openMembers(proj)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--accent-primary)',
                          fontSize: '11px',
                          textAlign: 'left',
                          padding: '2px 0',
                          fontWeight: 500
                        }}
                      >
                        +{memberList.length - 4} more member details
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openMembers(proj)}
                    style={{
                      background: 'none',
                      border: '1px dashed var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      padding: '0.5rem',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem'
                    }}
                  >
                    <UserPlus size={13} /> Add team member details
                  </button>
                )}
              </div>

              {/* Health */}
              {proj.healthScore > 0 ? (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.375rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Activity size={12} /> QA Health
                    </span>
                    <span style={{ fontWeight: 700, color: healthColor(proj.healthScore) }}>
                      {proj.healthScore}% — {healthLabel(proj.healthScore)}
                    </span>
                  </div>
                  <ProgressBar value={proj.healthScore} variant={proj.healthScore >= 90 ? 'success' : proj.healthScore >= 75 ? 'primary' : 'warning'} />
                </div>
              ) : (
                <div style={{
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px dashed rgba(99,102,241,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.625rem 0.75rem',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  marginBottom: '1rem'
                }}>
                  <CheckCircle2 size={13} color="#6366F1" />
                  Workspace ready — start adding test cases to track health
                </div>
              )}

              {/* Select Button */}
              <Button
                size="sm"
                variant={isActive ? 'secondary' : 'primary'}
                style={{ width: '100%' }}
                onClick={() => {
                  setActiveProjectId(proj.id);
                  showToast('Workspace Switched', `Now working in "${proj.name}"`, 'success');
                }}
              >
                {isActive ? '✓ Current Workspace' : 'Set as Active Workspace'}
              </Button>
            </Card>
          );
        })}

        {/* Ghost Add Card */}
        <div
          onClick={openAdd}
          style={{
            border: '2px dashed var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            color: 'var(--text-muted)',
            minHeight: '200px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-primary)';
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.04)';
            (e.currentTarget as HTMLDivElement).style.color = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)';
            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            (e.currentTarget as HTMLDivElement).style.color = 'var(--text-muted)';
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px dashed currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={22} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Add New Team</div>
            <div style={{ fontSize: '12px', marginTop: '0.25rem', opacity: 0.7 }}>Create a new project workspace</div>
          </div>
        </div>
      </div>

      <ProjectModal isOpen={modalOpen} mode={modalMode} project={editingProject} onClose={() => setModalOpen(false)} onAdd={handleAdd} onEdit={handleEdit} />
      <MemberModal isOpen={memberModalOpen} projectName={memberProject?.name ?? ''} members={memberProject?.members ?? []} onClose={() => setMemberModalOpen(false)} onSave={handleSaveMembers} />
    </div>
  );
};
