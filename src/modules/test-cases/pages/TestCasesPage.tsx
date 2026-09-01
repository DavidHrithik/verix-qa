import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Sparkles,
  Plus,
  Check,
  X,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Tag,
  Layers,
  Eye,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table, Column } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { AIGeneratedBadge } from '../../../components/ai';
import { Alert } from '../../../components/feedback/Alert';
import { Modal } from '../../../components/ui/Modal';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockTestCases } from '../../../mock';
import { TestCase } from '../../../types';

const STORAGE_KEY_TEST_CASES = 'verix_test_cases_v3';

export const TestCasesPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [testCases, setTestCases] = useState<TestCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEST_CASES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with mockTestCases to ensure newly added baseline cases exist
          const mergedMap = new Map<string, TestCase>();
          mockTestCases.forEach((tc) => mergedMap.set(tc.key, tc));
          parsed.forEach((tc) => mergedMap.set(tc.key, tc));
          return Array.from(mergedMap.values());
        }
      }
    } catch (e) {
      console.warn('Failed to load test cases from storage', e);
    }
    return mockTestCases;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEST_CASES, JSON.stringify(testCases));
    } catch (e) {
      console.warn('Failed to save test cases to storage', e);
    }
  }, [testCases]);

  // Filters & State
  const [search, setSearch] = useState('');
  const [storyFilter, setStoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  // Filter test cases for active workspace
  const projectTestCases = testCases.filter((tc: TestCase) => {
    const isProjectMatch = tc.projectId === activeProject.id || !tc.projectId || activeProject.id === 'proj-1';
    if (!isProjectMatch) return false;

    const matchesSearch =
      tc.key.toLowerCase().includes(search.toLowerCase()) ||
      tc.title.toLowerCase().includes(search.toLowerCase()) ||
      tc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStory =
      storyFilter === 'All' ||
      (storyFilter === 'AUTH-101' && (tc.key.startsWith('TC-10') || tc.storyId?.includes('auth'))) ||
      (storyFilter === 'CLOUD-204' && (tc.key.startsWith('TC-20') || tc.storyId?.includes('cloud'))) ||
      (storyFilter === 'DBANK-104' && (tc.key.startsWith('TC-30') || tc.storyId?.includes('dbank-104'))) ||
      (storyFilter === 'DBANK-108' && (tc.key.startsWith('TC-40') || tc.storyId?.includes('dbank-108')));

    const matchesPriority = priorityFilter === 'All' || tc.priority === priorityFilter;

    return matchesSearch && matchesStory && matchesPriority;
  });

  const columns: Column<TestCase>[] = [
    {
      key: 'key',
      header: 'Test ID',
      width: '110px',
      render: (tc: TestCase) => (
        <span
          onClick={() => setSelectedTestCase(tc)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {tc.key}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Test Scenario & Steps',
      render: (tc: TestCase) => (
        <div style={{ cursor: 'pointer' }} onClick={() => setSelectedTestCase(tc)}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{tc.title}</span>
            {tc.isAiGenerated && <AIGeneratedBadge confidence={tc.aiConfidence || 96} />}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>{tc.steps.length} Steps defined</span>
            <span>•</span>
            {tc.tags.map((t, idx) => (
              <span key={idx} style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                #{t}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '120px',
      render: (tc: TestCase) => <span className="badge badge-default">{tc.type}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '110px',
      render: (tc: TestCase) => {
        const variant = tc.priority === 'Critical' ? 'failed' : tc.priority === 'High' ? 'warning' : 'default';
        return <Badge variant={variant}>{tc.priority}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (tc: TestCase) => <span className="badge badge-passed">{tc.status}</span>,
    },
    {
      key: 'lastExecutionStatus',
      header: 'Last Run',
      width: '110px',
      render: (tc: TestCase) => {
        const variant = tc.lastExecutionStatus === 'Passed' ? 'passed' : tc.lastExecutionStatus === 'Failed' ? 'failed' : 'default';
        return <Badge variant={variant}>{tc.lastExecutionStatus || 'Untested'}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '90px',
      render: (tc: TestCase) => (
        <Button size="sm" variant="secondary" leftIcon={<Eye size={12} />} onClick={() => setSelectedTestCase(tc)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Test Cases & Suites"
        description={`Standard and AI synthesized multi-vector test cases for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Test Cases' }]}
        badge={<span className="badge badge-default">{projectTestCases.length} Tests</span>}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => showToast('Add Test Case', 'Opening manual test case modal', 'info')}
            >
              Add Manual Case
            </Button>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.25rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '380px' }}>
          <Input
            isSearch
            placeholder="Search test cases by ID, scenario, or tag..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        {/* Story Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Story:</span>
          <select
            value={storyFilter}
            onChange={(e) => setStoryFilter(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.65rem',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none',
            }}
          >
            <option value="All">All User Stories</option>
            <option value="AUTH-101">AUTH-101 (Registration Portal)</option>
            <option value="CLOUD-204">CLOUD-204 (Data Export Governance)</option>
            <option value="DBANK-104">DBANK-104 (Wire Transfer MFA)</option>
            <option value="DBANK-108">DBANK-108 (Virtual Cards)</option>
          </select>
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
              outline: 'none',
            }}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      <Table<TestCase>
        columns={columns}
        data={projectTestCases}
        keyExtractor={(tc: TestCase) => tc.id}
      />

      {/* Test Case Inspection Modal */}
      {selectedTestCase && (
        <Modal
          isOpen={!!selectedTestCase}
          onClose={() => setSelectedTestCase(null)}
          title={`Test Case Details: ${selectedTestCase.key}`}
          maxWidth="720px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Meta */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--accent-primary)' }}>
                  {selectedTestCase.key}
                </span>
                <span className="badge badge-default">{selectedTestCase.type}</span>
                <Badge variant={selectedTestCase.priority === 'Critical' ? 'failed' : selectedTestCase.priority === 'High' ? 'warning' : 'default'}>
                  {selectedTestCase.priority}
                </Badge>
                {selectedTestCase.isAiGenerated && <AIGeneratedBadge confidence={selectedTestCase.aiConfidence || 96} />}
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                {selectedTestCase.title}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {selectedTestCase.tags.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    color: '#38BDF8',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Test Steps List */}
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Gherkin Execution Steps ({selectedTestCase.steps.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedTestCase.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-hover)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '11px', color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                        Step {st.stepNumber}:
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                        {st.action}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                      <strong>Expected Result:</strong> {st.expectedResult}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
