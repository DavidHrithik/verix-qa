import React, { useState } from 'react';
import { Layers, Plus, Sparkles, Filter, Search, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table, Column } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { StatusIndicator } from '../../../components/ui/StatusIndicator';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockStories } from '../../../mock';
import { UserStory } from '../../../types';

// =========================================================================
// MODULE: User Stories & Requirements Management
// Owner: TBD (Team Member A)
// Description: Ingestion of Jira / ADO stories, acceptance criteria parsing,
// and automated requirement decomposition for QA validation.
// =========================================================================

export const UserStoriesPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const filteredStories = mockStories.filter(
    (s: UserStory) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.key.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<UserStory>[] = [
    {
      key: 'key',
      header: 'Story Key',
      width: '120px',
      render: (story: UserStory) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
          {story.key}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Requirement Title & Scope',
      render: (story: UserStory) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story.title}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
            {story.acceptanceCriteria.length} Acceptance Criteria defined
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '110px',
      render: (story: UserStory) => {
        const variant = story.priority === 'Critical' ? 'failed' : story.priority === 'High' ? 'warning' : 'default';
        return <Badge variant={variant}>{story.priority}</Badge>;
      },
    },
    {
      key: 'coverageStatus',
      header: 'Coverage Status',
      width: '140px',
      render: (story: UserStory) => {
        const variant = story.coverageStatus === 'Full' ? 'passed' : story.coverageStatus === 'Partial' ? 'warning' : 'failed';
        return <Badge variant={variant}>{story.coverageStatus}</Badge>;
      },
    },
    {
      key: 'testCaseCount',
      header: 'Test Cases',
      width: '110px',
      render: (story: UserStory) => (
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
          {story.testCaseCount} tests
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '140px',
      render: (story: UserStory) => (
        <Button
          size="sm"
          variant="ai"
          leftIcon={<Sparkles size={13} />}
          onClick={() => showToast('AI Test Generator', `Synthesizing test suite for ${story.key}`, 'info')}
        >
          Gen Tests
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User Stories & Requirements"
        description={`Requirement backlog and acceptance criteria mapping for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'User Stories' }]}
        badge={<span className="badge badge-default">{filteredStories.length} Stories</span>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => showToast('Create Story', 'Opening story creator modal', 'info')}
          >
            Import / Create Story
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Module Boundary: User Stories">
          This module is ready for team implementation. Code should be isolated inside{' '}
          <code>src/modules/user-stories/</code>. See developer documentation for extension points.
        </Alert>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '360px' }}>
          <Input
            isSearch
            placeholder="Search stories by key or title..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" size="md" leftIcon={<Filter size={14} />}>
          Filter
        </Button>
      </div>

      {/* Stories Table */}
      <Table<UserStory>
        columns={columns}
        data={filteredStories}
        keyExtractor={(s: UserStory) => s.id}
      />
    </div>
  );
};
