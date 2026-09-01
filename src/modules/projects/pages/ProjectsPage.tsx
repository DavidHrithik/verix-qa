import React from 'react';
import { FolderKanban, Plus, ExternalLink, Users, FileCode2, Layers } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { Project } from '../../../types';

export const ProjectsPage: React.FC = () => {
  const { projects, activeProject, setActiveProjectId } = useProject();
  const { showToast } = useToast();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="QA Projects Portfolio"
        description="Active software testing repositories, project workspaces, and quality health scores."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
        badge={<span className="badge badge-default">{projects.length} Workspaces</span>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => showToast('New Project', 'Opening project onboarding modal', 'info')}
          >
            New Project Workspace
          </Button>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {projects.map((proj: Project) => {
          const isActive = proj.id === activeProject.id;
          return (
            <Card
              key={proj.id}
              isHoverable
              style={{
                borderColor: isActive ? 'var(--accent-primary)' : undefined,
                boxShadow: isActive ? 'var(--shadow-md)' : undefined
              }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-surface-hover)',
                        color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      {proj.key.substring(0, 2)}
                    </div>
                    <span>{proj.name}</span>
                  </div>
                  {isActive && <Badge variant="primary">Active Context</Badge>}
                </div>
              }
              subtitle={proj.description}
              footer={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Layers size={13} /> {proj.totalStories} Stories
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FileCode2 size={13} /> {proj.totalTestCases} Tests
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={isActive ? 'secondary' : 'primary'}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      showToast('Context Switched', `Switched active workspace to ${proj.name}`, 'success');
                    }}
                  >
                    {isActive ? 'Current' : 'Select'}
                  </Button>
                </div>
              }
            >
              <div style={{ margin: '1rem 0' }}>
                <ProgressBar
                  value={proj.healthScore}
                  variant={proj.healthScore >= 90 ? 'success' : 'primary'}
                  showLabel
                  label="QA Health Score"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
