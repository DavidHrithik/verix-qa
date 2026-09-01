import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Sparkles, Filter, Search, CheckCircle2, Clock, Eye, FileText, CheckCircle } from 'lucide-react';
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
import { mockStories, mockTestCases } from '../../../mock';
import { UserStory, TestCase } from '../../../types';
import { CreateStoryModal } from '../components/CreateStoryModal';
import { StoryDetailModal } from '../components/StoryDetailModal';
import { GenerateTestCasesModal } from '../components/GenerateTestCasesModal';
import { GeneratedTestCaseItem } from '../services/testGenerationService';

export const UserStoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const [stories, setStories] = useState<UserStory[]>(mockStories);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStoryForDetail, setSelectedStoryForDetail] = useState<UserStory | null>(null);
  const [selectedStoryForGenTests, setSelectedStoryForGenTests] = useState<UserStory | null>(null);

  const handleStoryCreated = (newStory: UserStory) => {
    setStories((prev) => [newStory, ...prev]);
    showToast('Story Created', `Saved ${newStory.key}: ${newStory.title}`, 'success');
  };

  const handleOpenGenTests = (story: UserStory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedStoryForGenTests(story);
  };

  const handleAcceptGeneratedCases = (generatedCases: GeneratedTestCaseItem[], targetModule: 'test-cases' | 'automation' = 'test-cases') => {
    if (selectedStoryForGenTests) {
      // Update story state in backlog
      setStories((prev) =>
        prev.map((s) =>
          s.id === selectedStoryForGenTests.id
            ? {
                ...s,
                coverageStatus: 'Full',
                testCaseCount: Math.max(s.testCaseCount, generatedCases.length),
              }
            : s
        )
      );

      // Append generated test cases to in-memory mockTestCases if not already present
      generatedCases.forEach((gc) => {
        const exists = mockTestCases.some((tc) => tc.id === gc.id || tc.key === gc.key);
        if (!exists) {
          mockTestCases.unshift(gc);
        }
      });

      showToast(
        'Test Cases Synthesized',
        `Generated ${generatedCases.length} multi-vector test cases (${generatedCases.map((c) => c.key).join(', ')}) covering all Acceptance Criteria.`,
        'success'
      );

      setSelectedStoryForGenTests(null);

      if (targetModule === 'test-cases') {
        navigate('/test-cases');
      } else if (targetModule === 'automation') {
        navigate('/automation');
      }
    }
  };

  const filteredStories = stories.filter(
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
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
          onClick={() => setSelectedStoryForDetail(story)}
        >
          {story.key}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Requirement Title & Scope',
      render: (story: UserStory) => (
        <div style={{ cursor: 'pointer' }} onClick={() => setSelectedStoryForDetail(story)}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story.title}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{story.acceptanceCriteria.length} Acceptance Criteria defined</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• (Click to view details)</span>
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
      render: (story: UserStory) => {
        const uniqueCount = Array.from(
          new Map(mockTestCases.filter((tc) => tc.storyId === story.id).map((tc) => [tc.key, tc])).values()
        ).length;
        const count = uniqueCount > 0 ? uniqueCount : story.testCaseCount;
        return (
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {count} tests
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (story: UserStory) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Eye size={13} />}
            onClick={() => setSelectedStoryForDetail(story)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ai"
            leftIcon={<Sparkles size={13} />}
            onClick={(e) => handleOpenGenTests(story, e)}
          >
            Gen Tests
          </Button>
        </div>
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
            onClick={() => setIsCreateModalOpen(true)}
          >
            Import / Create Story
          </Button>
        }
      />

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

      {/* Interactive Modal for Creating / Importing Stories */}
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* Interactive Story Detail Modal */}
      <StoryDetailModal
        story={selectedStoryForDetail}
        isOpen={!!selectedStoryForDetail}
        onClose={() => setSelectedStoryForDetail(null)}
        onGenerateTests={(story) => {
          setSelectedStoryForDetail(null);
          setSelectedStoryForGenTests(story);
        }}
      />

      {/* AI Multi-Vector Test Cases Generation Modal */}
      <GenerateTestCasesModal
        story={selectedStoryForGenTests}
        isOpen={!!selectedStoryForGenTests}
        onClose={() => setSelectedStoryForGenTests(null)}
        onAcceptAndNavigate={handleAcceptGeneratedCases}
      />
    </div>
  );
};
