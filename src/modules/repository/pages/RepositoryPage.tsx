import React from 'react';
import { FolderGit2, Folder, FileText, Plus, Search, Tag, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SplitPane } from '../../../components/ui/SplitPane';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockTestCases } from '../../../mock';
import { TestCase } from '../../../types';

// =========================================================================
// MODULE: Test Repository & Suite Hierarchy
// Owner: TBD (Team Member G)
// Description: Centralized repository folder hierarchy, tag management,
// and cross-project test asset reuse.
// =========================================================================

export const RepositoryPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const folders = [
    { name: 'Core Banking Flow', count: 42, icon: Folder },
    { name: 'Payments & Transfers', count: 68, icon: Folder },
    { name: 'Security & Auth', count: 34, icon: Folder },
    { name: 'Cards & Limits', count: 28, icon: Folder },
    { name: 'Compliance & Audit', count: 26, icon: Folder },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Centralized Test Repository"
        description={`Organized repository tree, suite hierarchies, and test assets for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Test Repository' }]}
        badge={<span className="badge badge-default">198 Total Assets</span>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => showToast('New Folder', 'Creating new test repository folder', 'info')}
          >
            New Suite / Folder
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Module Boundary: Test Repository">
          // MODULE: Test Repository implementation goes here.
          <br />
          Owner: TBD. Modular files live inside <code>src/modules/repository/</code>.
        </Alert>
      </div>

      <SplitPane
        leftWidth="300px"
        left={
          <Card title="Suites & Folders" subtitle="Repository tree hierarchy">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {folders.map((folder, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: i === 1 ? 'var(--accent-primary-light)' : 'transparent',
                    color: i === 1 ? 'var(--accent-primary)' : 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => showToast('Folder Selected', `Browsing ${folder.name}`, 'info')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-sm)' }}>
                    <Folder size={16} />
                    <span>{folder.name}</span>
                  </div>
                  <span className="badge badge-default" style={{ fontSize: '11px' }}>{folder.count}</span>
                </div>
              ))}
            </div>
          </Card>
        }
        right={
          <Card
            title="Payments & Transfers Suite"
            subtitle="68 test cases across international wire and ACH flows"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockTestCases.map((tc: TestCase) => (
                <div
                  key={tc.id}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        {tc.key}
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {tc.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Tags: {tc.tags.join(', ')}
                    </div>
                  </div>
                  <Badge variant={tc.type === 'Automated' ? 'primary' : 'default'}>{tc.type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        }
      />
    </div>
  );
};
