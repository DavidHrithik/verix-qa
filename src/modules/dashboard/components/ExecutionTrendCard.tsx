import React from 'react';
import { Card } from '../../../components/layout/Card';
import { PlayCircle, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { mockExecutions } from '../../../mock';

export const ExecutionTrendCard: React.FC = () => {
  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlayCircle size={18} style={{ color: 'var(--status-passed)' }} />
          <span>Recent Execution Runs</span>
        </div>
      }
      subtitle="Execution results and telemetry across automated and sprint suites"
      actions={<span className="badge badge-default">Live Stream</span>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {mockExecutions.map((exec) => {
          const passPercent = Math.round((exec.passed / exec.totalTests) * 100);
          return (
            <div
              key={exec.id}
              style={{
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {exec.runName}
                </div>
                <span className="badge badge-passed" style={{ fontSize: '11px' }}>
                  {exec.status}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--status-passed-text)' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--status-passed)' }} /> {exec.passed} Passed
                </span>
                {exec.failed > 0 ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--status-failed-text)' }}>
                    <XCircle size={13} style={{ color: 'var(--status-failed)' }} /> {exec.failed} Failed
                  </span>
                ) : null}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} /> {exec.durationSeconds}s
                </span>
              </div>

              {/* Mini visual split bar */}
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-active)', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${passPercent}%`, backgroundColor: 'var(--status-passed)' }} />
                {exec.failed > 0 && (
                  <div style={{ width: `${(exec.failed / exec.totalTests) * 100}%`, backgroundColor: 'var(--status-failed)' }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
