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
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { AutomationScriptExtended } from '../types';
import { exportHealingReport } from '../services/reportExportService';

interface ScriptCatalogProps {
  scripts: AutomationScriptExtended[];
  activeScriptId: string;
  onSelectScript: (script: AutomationScriptExtended, targetTab?: 'studio' | 'runner' | 'healing-diff') => void;
  onOpenSynthesizer: () => void;
  onExecuteScript: (script: AutomationScriptExtended) => void;
}

export const ScriptCatalog: React.FC<ScriptCatalogProps> = ({
  scripts,
  activeScriptId,
  onSelectScript,
  onOpenSynthesizer,
  onExecuteScript,
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
            const isFailed = script.lastRunStatus === 'Failed';

            return (
              <div
                key={script.id}
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  boxShadow: isSelected ? '0 0 0 1px var(--accent-primary)' : 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Download size={13} />}
                      onClick={() => exportHealingReport(script)}
                      title="Download Audit Report"
                    >
                      Report
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
