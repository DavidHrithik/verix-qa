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
import { mockDashboardMetrics } from '../../../mock';

export const DashboardPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
          This dashboard displays realistic sample telemetry for architecture and layout preview. Individual business modules will attach their live data streams in upcoming sprint milestones.
        </Alert>
      </div>

      {/* Top Metric Cards */}
      <Section title="Key Quality Indicators" subtitle="Aggregated metrics for current active release sprint">
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
            value={activeProject.totalStories}
            change="+4 this sprint"
            changeType="neutral"
            icon={<Layers size={18} />}
            subtitle="100% analyzed"
          />
          <MetricCard
            title="Total Test Cases"
            value={activeProject.totalTestCases}
            change="+28 generated"
            changeType="positive"
            icon={<FileCode2 size={18} />}
            subtitle="76% automated"
          />
          <MetricCard
            title="Tests Executed"
            value={mockDashboardMetrics.testsExecutedToday}
            change="Today"
            changeType="positive"
            icon={<PlayCircle size={18} />}
            subtitle="2 automated runs"
          />
          <MetricCard
            title="Pass Rate"
            value={`${mockDashboardMetrics.passRatePercentage}%`}
            change="+2.4% vs last run"
            changeType="positive"
            icon={<Percent size={18} />}
            subtitle="Target: >=90%"
          />
          <MetricCard
            title="Automation Coverage"
            value={`${mockDashboardMetrics.automationCoveragePercentage}%`}
            change="155 scripts"
            changeType="positive"
            icon={<Cpu size={18} />}
            subtitle="Playwright + Cypress"
          />
          <MetricCard
            title="Open QA Tasks"
            value={mockDashboardMetrics.openTasksCount}
            change="3 in review"
            changeType="neutral"
            icon={<CheckSquare size={18} />}
            subtitle="4 engineers active"
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
