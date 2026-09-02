import React, { useState } from 'react';
import {
  Play,
  FileCode,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Terminal,
  FileText,
  Download,
  Trash2,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { AutomationScriptExtended } from '../types';
import { exportHealingReport } from '../services/reportExportService';

// ── Stability Score Gauge ────────────────────────────────────────────────────
const getStabilityColor = (score: number) => {
  if (score >= 90) return { fill: '#22c55e', track: 'rgba(34,197,94,0.15)', label: 'Stable' };
  if (score >= 60) return { fill: '#f59e0b', track: 'rgba(245,158,11,0.15)', label: 'Unstable' };
  return { fill: '#ef4444', track: 'rgba(239,68,68,0.15)', label: 'Flaky' };
};

const StabilityGauge: React.FC<{ score: number; size?: number }> = ({ score, size = 46 }) => {
  const { fill, track, label } = getStabilityColor(score);
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75; // 270° sweep
  const offset = arc - (score / 100) * arc;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }} title={`Stability: ${score}% — ${label}`}>
      <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={track} strokeWidth={5}
          strokeDasharray={`${arc} ${circ - arc}`}
          strokeLinecap="round"
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={fill} strokeWidth={5}
          strokeDasharray={`${arc} ${circ - arc}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: fill, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  );
};

// ── Run History Sparkline ─────────────────────────────────────────────────────
const RunSparkline: React.FC<{ history?: { passed: boolean }[] }> = ({ history }) => {
  if (!history || history.length === 0) return null;
  const last = history.slice(-10);
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }} title="Recent run history (oldest → newest)">
      {last.map((r, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: r.passed ? 14 : 8,
            borderRadius: 2,
            backgroundColor: r.passed ? '#22c55e' : '#ef4444',
            opacity: 0.7 + (i / last.length) * 0.3,
            transition: 'height 0.3s ease',
          }}
        />
      ))}
    </div>
  );
};

interface ScriptCatalogProps {
  scripts: AutomationScriptExtended[];
  activeScriptId: string;
  onSelectScript: (script: AutomationScriptExtended, targetTab?: 'studio' | 'runner' | 'healing-diff') => void;
  onOpenSynthesizer: () => void;
  onExecuteScript: (script: AutomationScriptExtended) => void;
  onDeleteScript?: (scriptId: string) => void;
}

export const ScriptCatalog: React.FC<ScriptCatalogProps> = ({
  scripts,
  activeScriptId,
  onSelectScript,
  onOpenSynthesizer,
  onExecuteScript,
  onDeleteScript,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(scripts.map((s) => s.folderCategory || 'Core Suites')))];

  const filteredScripts = scripts.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.storyKey.toLowerCase().includes(search.toLowerCase()) ||
      (s.featureTitle && s.featureTitle.toLowerCase().includes(search.toLowerCase())) ||
      s.storyTitle.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === 'All' || (s.folderCategory || 'Core Suites') === categoryFilter;

    return matchSearch && matchCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* Control & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <div style={{ width: '100%', maxWidth: '340px' }}>
            <Input
              isSearch
              placeholder="Search BDD features, tags, or keys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid',
                  whiteSpace: 'nowrap',
                  backgroundColor: categoryFilter === cat ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
                  borderColor: categoryFilter === cat ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  color: categoryFilter === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="ai"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={onOpenSynthesizer}
          >
            Synthesize New Feature
          </Button>
        </div>
      </div>

      {/* Feature Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredScripts.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <FileCode size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
              No BDD features found
            </div>
          </div>
        ) : (
          filteredScripts.map((script) => {
            const isSelected = script.id === activeScriptId;
            const isHealed = script.status === 'Healed' || (script.selfHealingLogs && script.selfHealingLogs.length > 0);

            return (
              <div
                key={script.id}
                onClick={() => onSelectScript(script, 'studio')}
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: isSelected ? '4px solid var(--accent-primary)' : '4px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {/* Feature Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={15} style={{ color: '#38BDF8' }} />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {script.name}
                      </span>
                    </div>

                    <span className="badge badge-default" style={{ fontSize: '10px' }}>
                      {script.folderCategory || 'Feature Suite'}
                    </span>

                    {isSelected && (
                      <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        Selected
                      </span>
                    )}

                    {isHealed && (
                      <span className="badge badge-ai" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Sparkles size={10} /> AI Healed
                      </span>
                    )}
                  </div>

                  {/* Feature Title / Business Description */}
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.35rem', lineHeight: 1.4 }}>
                    {script.featureTitle || script.storyTitle}
                  </div>

                  {/* Tags Preview */}
                  {script.featureTags && script.featureTags.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      {script.featureTags.slice(0, 5).map((t, i) => (
                        <span key={i} style={{ fontSize: '10px', color: '#C084FC', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Path: <code style={{ color: 'var(--text-secondary)' }}>{script.repoPath}</code> • {script.steps.length} Gherkin Steps Defined
                  </div>
                </div>

                {/* Status Telemetry */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Stability Score Gauge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <StabilityGauge score={script.stabilityScore ?? 100} />
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>STABILITY</div>
                    <RunSparkline history={script.runHistory} />
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '2px' }}>
                      {script.lastRunStatus === 'Passed' ? (
                        <Badge variant="passed">Passed</Badge>
                      ) : script.lastRunStatus === 'Failed' ? (
                        <Badge variant="failed">Failed (Drift)</Badge>
                      ) : (
                        <Badge variant="default">Untested</Badge>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Executed {script.executionCount} times
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Download size={13} />}
                      onClick={() => exportHealingReport(script, 'extent-pdf')}
                      title="Open & Download ExtentReport.pdf with Embedded Screenshots"
                    >
                      ExtentReport.pdf
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<FileText size={13} />}
                      onClick={() => onSelectScript(script, 'studio')}
                    >
                      View Feature
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Play size={13} />}
                      onClick={() => {
                        onSelectScript(script, 'runner');
                        onExecuteScript(script);
                      }}
                    >
                      Run Scenario
                    </Button>

                    {/* Delete Script Button */}
                    {onDeleteScript && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete scenario "${script.name}" from catalog?`)) {
                            onDeleteScript(script.id);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.35rem 0.5rem',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--status-failed)';
                          e.currentTarget.style.borderColor = 'var(--status-failed)';
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Delete Scenario from Catalog"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
