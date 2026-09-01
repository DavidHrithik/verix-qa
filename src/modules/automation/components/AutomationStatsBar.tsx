import React from 'react';
import { Cpu, PlayCircle, ShieldCheck, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AutomationScriptExtended } from '../types';

interface AutomationStatsBarProps {
  scripts: AutomationScriptExtended[];
}

export const AutomationStatsBar: React.FC<AutomationStatsBarProps> = ({ scripts }) => {
  const totalScripts = scripts.length;
  const passedScripts = scripts.filter((s) => s.lastRunStatus === 'Passed').length;
  const healedScripts = scripts.filter((s) => s.status === 'Healed' || (s.selfHealingLogs && s.selfHealingLogs.length > 0)).length;
  const flakyScripts = scripts.filter((s) => s.status === 'Flaky' || s.lastRunStatus === 'Failed').length;
  const passRate = totalScripts > 0 ? Math.round((passedScripts / totalScripts) * 100) : 100;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
    >
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Cpu size={20} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>
            Automated Suites
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {totalScripts}
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-passed-bg)',
            color: 'var(--status-passed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={20} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>
            Pass Rate
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--status-passed)' }}>
            {passRate}%
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(99, 102, 241, 0.05) 100%)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            color: 'var(--ai-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={20} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ai-primary)', fontWeight: 600 }}>
            AI Healed Selectors
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ai-primary)' }}>
            {healedScripts} Repaired
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-warning-bg)',
            color: 'var(--status-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={20} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>
            Flaky / At Risk
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--status-warning)' }}>
            {flakyScripts}
          </div>
        </div>
      </div>
    </div>
  );
};
