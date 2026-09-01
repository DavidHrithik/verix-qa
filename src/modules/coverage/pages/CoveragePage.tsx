import React from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Table, Column } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockCoverageItems } from '../../../mock';
import { CoverageItem } from '../../../types';

// =========================================================================
// MODULE 2: Development ↔ QA Coverage Bridge
// Owner: TBD (Team Member B)
// Description: Intelligent alignment between developer unit/smoke tests and QA
// functional coverage, identifying untested edge scenarios and risk blindspots.
// =========================================================================

export const CoveragePage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const columns: Column<CoverageItem>[] = [
    {
      key: 'featureName',
      header: 'Feature Scope',
      render: (item: CoverageItem) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.featureName}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Story ID: {item.storyId}
          </div>
        </div>
      ),
    },
    {
      key: 'devSmokeCoverage',
      header: 'Dev Smoke Gate',
      width: '180px',
      render: (item: CoverageItem) => (
        <ProgressBar
          value={item.devSmokeCoverage}
          variant={item.devSmokeCoverage >= 80 ? 'success' : 'warning'}
          showLabel
        />
      ),
    },
    {
      key: 'qaCoverage',
      header: 'QA Functional Matrix',
      width: '180px',
      render: (item: CoverageItem) => (
        <ProgressBar
          value={item.qaCoverage}
          variant={item.qaCoverage >= 80 ? 'primary' : 'warning'}
          showLabel
        />
      ),
    },
    {
      key: 'edgeRiskScore',
      header: 'Risk Exposure',
      width: '120px',
      render: (item: CoverageItem) => {
        const variant = item.edgeRiskScore === 'High' ? 'failed' : item.edgeRiskScore === 'Medium' ? 'warning' : 'passed';
        return <Badge variant={variant}>{item.edgeRiskScore} Risk</Badge>;
      },
    },
    {
      key: 'riskGaps',
      header: 'Identified Risk Gaps',
      render: (item: CoverageItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {item.riskGaps.map((gap: string, i: number) => (
            <span key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              • {gap}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Bridge Action',
      width: '140px',
      render: (item: CoverageItem) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => showToast('Coverage Bridge', `Analyzing risk gap for ${item.featureName}`, 'info')}
        >
          View Matrix
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Development ↔ QA Coverage Bridge"
        description={`Bi-directional coverage traceability between developer smoke tests and QA functional test suites for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Coverage Bridge' }]}
        badge={<span className="badge badge-primary">Traceability Active</span>}
        actions={
          <Button
            variant="ai"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={() => showToast('AI Coverage Analysis', 'Auditing repository code commits for coverage blindspots', 'info')}
          >
            AI Gap Analysis
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Module Boundary: Coverage Bridge">
          // MODULE 2: Development ↔ QA Coverage Bridge implementation goes here.
          <br />
          Owner: TBD. Modular files live inside <code>src/modules/coverage/</code>.
        </Alert>
      </div>

      <Table<CoverageItem>
        columns={columns}
        data={mockCoverageItems}
        keyExtractor={(item: CoverageItem) => item.id}
      />
    </div>
  );
};
