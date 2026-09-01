import React, { useState } from 'react';
import {
  FileCode,
  Play,
  Sparkles,
  Copy,
  Check,
  Code2,
  FileText,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SplitPane } from '../../../components/ui/SplitPane';
import { GherkinFeatureViewer } from './GherkinFeatureViewer';
import { AutomationFeatureTree } from './AutomationFeatureTree';
import { AutomationScriptExtended, AutomationViewMode } from '../types';

interface ScriptCodeStudioProps {
  script: AutomationScriptExtended;
  allScripts: AutomationScriptExtended[];
  onSelectScript: (script: AutomationScriptExtended) => void;
  onExecute: (script: AutomationScriptExtended) => void;
  onOpenSelfHealing: () => void;
}

export const ScriptCodeStudio: React.FC<ScriptCodeStudioProps> = ({
  script,
  allScripts,
  onSelectScript,
  onExecute,
  onOpenSelfHealing,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewFormat, setViewFormat] = useState<'feature' | 'pom'>('feature');

  const handleCopy = () => {
    const textToCopy = viewFormat === 'feature' ? (script.gherkinContent || script.code) : (script.pageObjectClass || script.code);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHealed = script.status === 'Healed' || (script.selfHealingLogs && script.selfHealingLogs.length > 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Studio Header Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {script.name}
            </span>
            <span className="badge badge-default">Cucumber BDD</span>
            {isHealed && <span className="badge badge-ai">✨ Self-Healed</span>}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Path: <code>{script.repoPath}</code> • Feature: <strong style={{ color: 'var(--text-primary)' }}>{script.featureTitle || script.storyTitle}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Format Toggle: Feature File vs Page Object Model */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-app)',
              padding: '2px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewFormat('feature')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: viewFormat === 'feature' ? 'var(--accent-primary)' : 'transparent',
                color: viewFormat === 'feature' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <FileText size={12} />
              <span>Gherkin (.feature)</span>
            </button>
            <button
              onClick={() => setViewFormat('pom')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: viewFormat === 'pom' ? 'var(--accent-primary)' : 'transparent',
                color: viewFormat === 'pom' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <Code2 size={12} />
              <span>Page Object (Java / TS)</span>
            </button>
          </div>

          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>

          {isHealed && (
            <Button size="sm" variant="secondary" leftIcon={<Sparkles size={13} />} onClick={onOpenSelfHealing}>
              Healing Diff
            </Button>
          )}

          <Button size="sm" variant="primary" leftIcon={<Play size={13} />} onClick={() => onExecute(script)}>
            Run Scenario
          </Button>
        </div>
      </div>

      {/* Main SplitPane: Project Tree Explorer on Left, Formatted Viewer on Right */}
      <SplitPane
        leftWidth="320px"
        left={
          <AutomationFeatureTree
            scripts={allScripts}
            activeScriptId={script.id}
            onSelectScript={onSelectScript}
          />
        }
        right={
          viewFormat === 'feature' ? (
            <GherkinFeatureViewer content={script.gherkinContent || script.code} />
          ) : (
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid #1E293B',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.6,
                overflowX: 'auto',
                color: '#E2E8F0',
                height: '100%',
                minHeight: '400px',
              }}
            >
              <div style={{ color: '#64748B', marginBottom: '0.75rem', fontSize: '11px', borderBottom: '1px solid #1E293B', paddingBottom: '0.5rem' }}>
                // Underlying Page Object Model glue code connecting Gherkin step actions to DOM locators
              </div>
              <pre style={{ margin: 0 }}>{script.pageObjectClass || script.code}</pre>
            </div>
          )
        }
      />
    </div>
  );
};
