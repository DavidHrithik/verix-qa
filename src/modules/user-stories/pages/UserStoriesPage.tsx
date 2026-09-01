import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  PlusCircle,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table, Column } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockStories } from '../../../mock';
import { UserStory, PriorityLevel } from '../../../types';
import { StoryIngestionModal, IngestionTab } from '../components/StoryIngestionModal';
import { StoryDetailsDrawer } from '../components/StoryDetailsDrawer';

const STORAGE_KEY_STORIES = 'verix_stories_v2';

export const JiraIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M11.53 2c0 5.257 4.26 9.519 9.517 9.519h.953V2h-10.47z" fill="#0052CC"/>
    <path d="M6.287 7.243c0 5.257 4.26 9.519 9.517 9.519h.953V7.243H6.287z" fill="#2684FF"/>
    <path d="M1.043 12.486c0 5.257 4.26 9.519 9.517 9.519h.953v-9.519H1.043z" fill="#0052CC"/>
  </svg>
);

export const UserStoriesPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // All stories across projects with persistence
  const [allStories, setAllStories] = useState<UserStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load stories from localStorage:', e);
    }
    return mockStories;
  });

  // Save stories to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(allStories));
    } catch (e) {
      console.warn('Failed to save stories to localStorage:', e);
    }
  }, [allStories]);

  // Modal & Drawer State
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [ingestionTab, setIngestionTab] = useState<IngestionTab>('jira');
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const openIngestion = (tab: IngestionTab) => {
    setIngestionTab(tab);
    setIsIngestionOpen(true);
  };

  // Filter for active workspace
  const projectStories = allStories.filter((s: UserStory) => s.projectId === activeProject.id);

  const filteredStories = projectStories.filter((s: UserStory) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.key.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = priorityFilter === 'All' || s.priority === priorityFilter;
    const matchesSource = sourceFilter === 'All' || (s.source || 'manual') === sourceFilter.toLowerCase();

    return matchesSearch && matchesPriority && matchesSource;
  });

  // Handlers
  const handleImportStories = (newStories: UserStory[]) => {
    setAllStories((prev) => [...newStories, ...prev]);
    showToast(
      'Requirements Ingested',
      `Successfully added ${newStories.length} user ${newStories.length === 1 ? 'story' : 'stories'} to ${activeProject.name}`,
      'success'
    );
  };

  const handleDeleteStory = (id: string) => {
    setAllStories((prev) => prev.filter((s) => s.id !== id));
  };

  const sourceBadge = (source?: string) => {
    switch (source) {
      case 'jira':
        return (
          <span
            style={{
              fontSize: '10px',
              color: '#0052CC',
              background: 'rgba(0,82,204,0.1)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <JiraIcon size={10} /> Jira
          </span>
        );
      case 'excel':
        return (
          <span
            style={{
              fontSize: '10px',
              color: '#107C41',
              background: 'rgba(16,124,65,0.1)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <FileSpreadsheet size={9} /> Excel
          </span>
        );
      default:
        return (
          <span
            style={{
              fontSize: '10px',
              color: '#8B5CF6',
              background: 'rgba(139,92,246,0.1)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600
            }}
          >
            Manual
          </span>
        );
    }
  };

  const columns: Column<UserStory>[] = [
    {
      key: 'key',
      header: 'Story Key',
      width: '120px',
      render: (story: UserStory) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span
            onClick={() => setSelectedStory(story)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {story.key}
          </span>
          {sourceBadge(story.source)}
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Requirement Title & Scope',
      render: (story: UserStory) => (
        <div
          onClick={() => setSelectedStory(story)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story.title}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
            {story.acceptanceCriteria.length} Acceptance Criteria defined {story.storyPoints ? `• ${story.storyPoints} pts` : ''}
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
          onClick={(e) => {
            e.stopPropagation();
            navigate('/test-cases');
            showToast('AI Test Generator', `Synthesizing test suite for ${story.key}`, 'info');
          }}
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
        badge={<span className="badge badge-default">{projectStories.length} Stories</span>}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Dedicated Jira Import Button */}
            <button
              onClick={() => openIngestion('jira')}
              style={{
                background: 'linear-gradient(135deg, #0052CC 0%, #2684FF 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,82,204,0.3)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,82,204,0.3)';
              }}
            >
              <JiraIcon size={16} />
              <span>Import from Jira</span>
            </button>

            {/* Upload Excel Button */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileSpreadsheet size={14} color="#107C41" />}
              onClick={() => openIngestion('excel')}
            >
              Upload Excel
            </Button>

            {/* Manual New Story Button */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => openIngestion('manual')}
            >
              New Story
            </Button>
          </div>
        }
      />

      {/* Demo Guidance Notice */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Unified Requirement Ingestion Engine">
          Import user stories directly from <strong>Atlassian Jira</strong>, upload bulk clinical requirements via <strong>Excel / CSV Template</strong>, or create manual stories with dynamic Acceptance Criteria.
        </Alert>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.25rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '380px' }}>
          <Input
            isSearch
            placeholder="Search stories by key, title, or scope..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.65rem',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none'
            }}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Source Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.65rem',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none'
            }}
          >
            <option value="All">All Sources</option>
            <option value="Jira">Jira Synced</option>
            <option value="Excel">Excel Uploaded</option>
            <option value="Manual">Manual Entry</option>
          </select>
        </div>
      </div>

      {/* Stories Table */}
      <Table<UserStory>
        columns={columns}
        data={filteredStories}
        keyExtractor={(s: UserStory) => s.id}
      />

      {/* Ingestion Modal (Jira, Excel, Manual) */}
      <StoryIngestionModal
        isOpen={isIngestionOpen}
        initialTab={ingestionTab}
        onClose={() => setIsIngestionOpen(false)}
        onImportStories={handleImportStories}
      />

      {/* Story Details Drawer */}
      <StoryDetailsDrawer
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onDeleteStory={handleDeleteStory}
      />
    </div>
  );
};
