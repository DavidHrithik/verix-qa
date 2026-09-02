import React from 'react';
import { Cpu, PlayCircle, ShieldCheck, Sparkles, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { AutomationScriptExtended } from '../types';
import { computeStabilityScore } from '../services/runnerSimulationService';

interface AutomationStatsBarProps {
  scripts: AutomationScriptExtended[];
}

export const AutomationStatsBar: React.FC<AutomationStatsBarProps> = ({ scripts }) => {
  const totalScripts = scripts.length;
  const passedScripts = scripts.filter((s) => s.lastRunStatus === 'Passed').length;
  const healedScripts = scripts.filter((s) => s.status === 'Healed' || (s.selfHealingLogs && s.selfHealingLogs.length > 0)).length;
  const flakyScripts = scripts.filter((s) => s.status === 'Flaky' || s.lastRunStatus === 'Failed').length;
  const passRate = totalScripts > 0 ? Math.round((passedScripts / totalScripts) * 100) : 100;

  // Average stability score across all scripts
  const avgStability = totalScripts > 0
    ? Math.round(
        scripts.reduce((sum, s) => {
          const score = s.stabilityScore !== undefined
            ? s.stabilityScore
            : computeStabilityScore(s.runHistory || []);
          return sum + score;
        }, 0) / totalScripts
      )
    : 100;

  const stabilityColor =
    avgStability >= 90 ? '#22c55e' : avgStability >= 60 ? '#f59e0b' : '#ef4444';
  const stabilityLabel =
    avgStability >= 90 ? 'Healthy' : avgStability >= 60 ? 'At Risk' : 'Critical';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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

      {/* Flaky / At Risk */}
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

      {/* Suite Stability Score */}
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          backgroundColor: 'var(--bg-surface)',
          border: `1px solid ${stabilityColor}30`,
          background: `linear-gradient(135deg, var(--bg-surface) 0%, ${stabilityColor}08 100%)`,
        }}
      >
        {/* Mini circular gauge */}
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          {(() => {
            const r = 17;
            const circ = 2 * Math.PI * r;
            const arc = circ * 0.75;
            const offset = arc - (avgStability / 100) * arc;
            return (
              <svg width={40} height={40} style={{ transform: 'rotate(135deg)' }}>
                <circle cx={20} cy={20} r={r} fill="none" stroke={`${stabilityColor}25`} strokeWidth={5}
                  strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round" />
                <circle cx={20} cy={20} r={r} fill="none" stroke={stabilityColor} strokeWidth={5}
                  strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={offset}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              </svg>
            );
          })()}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: stabilityColor }}>{avgStability}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: stabilityColor, fontWeight: 600 }}>
            Suite Stability
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: stabilityColor }}>
            {stabilityLabel}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
            {flakyScripts} flaky · {healedScripts} healed
          </div>
        </div>
      </div>
    </div>
  );
};
