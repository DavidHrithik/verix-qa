import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  FileCode2,
  PlayCircle,
  Percent,
  Cpu,
  CheckSquare,
  Sparkles,
  PlusCircle,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Section } from '../../../components/layout/Section';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/feedback/Alert';
import { MetricCard } from '../components/MetricCard';
import { CoverageBarChart } from '../components/CoverageBarChart';
import { ExecutionTrendCard } from '../components/ExecutionTrendCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockDashboardMetrics, mockStories, mockTestCases, mockTasks } from '../../../mock';

export const DashboardPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const activeStories = mockStories.filter((s) => s.projectId === activeProject.id);
  const activeTestCases = mockTestCases.filter((t) => t.projectId === activeProject.id);
  const activeTasks = mockTasks.filter((t) => t.projectId === activeProject.id);

  const storiesCount = activeStories.length > 0 ? activeStories.length : activeProject.totalStories;
  const testCasesCount = activeTestCases.length > 0 ? activeTestCases.length : activeProject.totalTestCases;
  const tasksCount = activeTasks.length > 0 ? activeTasks.length : mockDashboardMetrics.openTasksCount;

  const automatedTestsCount = activeTestCases.filter((tc) => tc.type === 'Automated').length;
  const autoPercent = testCasesCount > 0 ? Math.round((automatedTestsCount / testCasesCount) * 100) : 75;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="QA Executive Dashboard"
        description={`Live test telemetry, multi-layer coverage analysis, and AI activity for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        badge={<span className="badge badge-primary">Sprint Active</span>}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<PlusCircle size={14} />}
              onClick={() => {
                navigate('/user-stories');
                showToast('Story Workspace', 'Navigate to User Stories to create new requirement', 'info');
              }}
            >
              New Story
            </Button>
            <Button
              variant="ai"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={() => {
                navigate('/test-cases');
                showToast('AI Generation', 'Starting AI Test Case Assistant for active sprint', 'info');
              }}
            >
              Generate AI Tests
            </Button>
          </>
        }
      />

      {/* Demo / Sample Data Notice Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Alert variant="info" title="Hackathon UI Foundation & Demonstration">
          This dashboard displays live quality telemetry for <strong>{activeProject.name}</strong>. Data seamlessly reflects active sprint requirements and test suites.
        </Alert>
      </div>

      {/* Top Metric Cards */}
      <Section title="Key Quality Indicators" subtitle={`Aggregated metrics for ${activeProject.name} (${activeProject.activeSprint || 'Current Sprint'})`}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <MetricCard
            title="User Stories"
            value={storiesCount}
            change={`Active in ${activeProject.key}`}
            changeType="neutral"
            icon={<Layers size={18} />}
            subtitle="100% analyzed"
          />
          <MetricCard
            title="Total Test Cases"
            value={testCasesCount}
            change={`${automatedTestsCount} automated`}
            changeType="positive"
            icon={<FileCode2 size={18} />}
            subtitle={`${autoPercent}% automated`}
          />
          <MetricCard
            title="Tests Executed"
            value={testCasesCount * 2}
            change="Today"
            changeType="positive"
            icon={<PlayCircle size={18} />}
            subtitle="All runs passing"
          />
          <MetricCard
            title="Pass Rate"
            value="100%"
            change="0 failing tests"
            changeType="positive"
            icon={<Percent size={18} />}
            subtitle="Target: >=90%"
          />
          <MetricCard
            title="Automation Coverage"
            value={`${autoPercent}%`}
            change={`${automatedTestsCount} of ${testCasesCount} scripts`}
            changeType="positive"
            icon={<Cpu size={18} />}
            subtitle="Playwright + Unit"
          />
          <MetricCard
            title="Open QA Tasks"
            value={tasksCount}
            change={`${activeProject.membersCount} engineers`}
            changeType="neutral"
            icon={<CheckSquare size={18} />}
            subtitle="Active sprint tasks"
          />
        </div>
      </Section>

      {/* Middle Grid: Coverage Matrix & Execution Trends */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        <CoverageBarChart />
        <ExecutionTrendCard />
      </div>

      {/* Bottom Grid: Activity Feed & Module Jump Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <ActivityFeed />

        {/* Quick Launchpad to Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Verix Module Hub</div>
              <span className="badge badge-default">6 Modules</span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Jump straight into any independent workspace module to design tests, view coverage, or heal scripts.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'Coverage Bridge', path: '/coverage', desc: 'Map Dev Smoke & QA Functional Gaps' },
                { name: 'AI Test Case Generator', path: '/test-cases', desc: 'Synthesize comprehensive tests from User Stories' },
                { name: 'Self-Healing Automation', path: '/automation', desc: 'AI DOM repair for flaky Playwright scripts' },
                { name: 'QA Task Tracker', path: '/tasks', desc: 'Sprint task allocation and burndown' },
              ].map((mod, i) => (
                <div
                  key={i}
                  onClick={() => navigate(mod.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-active)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                >
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {mod.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mod.desc}</div>
                  </div>
                  <ArrowUpRight size={16} style={{ color: 'var(--accent-primary)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
