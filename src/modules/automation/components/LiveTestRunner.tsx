import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Square,
  RotateCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Code2,
  FileText,
  Activity,
  Download,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { SplitPane } from '../../../components/ui/SplitPane';
import { SimulatedBrowserViewport } from './SimulatedBrowserViewport';
import {
  AutomationScriptExtended,
  ExecutionLogItem,
  SimulationStep,
  FailureScenario,
  AutomationViewMode,
} from '../types';
import { mockFailureScenarios } from '../services/automationMockData';
import { exportHealingReport } from '../services/reportExportService';

interface LiveTestRunnerProps {
  script: AutomationScriptExtended;
  isRunning: boolean;
  currentStepIndex: number;
  steps: SimulationStep[];
  logs: ExecutionLogItem[];
  runStatus: 'idle' | 'running' | 'passed' | 'failed' | 'healed';
  isHealedRun: boolean;
  activeFailure?: FailureScenario;
  onStartExecution: (forceHealed?: boolean, customFailure?: FailureScenario) => void;
  onAbortExecution: () => void;
  onOpenSelfHealingDiff: () => void;
}

export const LiveTestRunner: React.FC<LiveTestRunnerProps> = ({
  script,
  isRunning,
  currentStepIndex,
  steps,
  logs,
  runStatus,
  isHealedRun,
  activeFailure,
  onStartExecution,
  onAbortExecution,
  onOpenSelfHealingDiff,
}) => {
  const [viewMode, setViewMode] = useState<AutomationViewMode>('business_bdd');
  const [isTerminalExpanded, setIsTerminalExpanded] = useState<boolean>(false);
  const [simulateDrift, setSimulateDrift] = useState<boolean>(
    script.failureScenario !== undefined || script.status === 'Flaky' || script.lastRunStatus === 'Failed'
  );
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSimulateDrift(
      script.failureScenario !== undefined || script.status === 'Flaky' || script.lastRunStatus === 'Failed'
    );
  }, [script.id]);

  useEffect(() => {
    if (isTerminalExpanded && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isTerminalExpanded]);

  const handleTriggerRun = () => {
    if (!simulateDrift) {
      // Clean green execution
      onStartExecution(true, undefined);
    } else {
      // Execute with locator drift simulation to demonstrate AI healing
      const failure =
        script.failureScenario ||
        (script.storyKey.includes('DBANK')
          ? mockFailureScenarios.mfa_button_drift
          : mockFailureScenarios.member_export_toggle_drift);
      onStartExecution(false, failure);
    }
  };

  const passedCount = steps.filter((s) => s.status === 'passed' || s.status === 'healed').length;
  const progressPercent = steps.length > 0 ? Math.round((passedCount / steps.length) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Runner Header Bar */}
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
            <span className="badge badge-default">BDD Cucumber</span>
            <span className="badge badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> AI Self-Healing Engine Active
            </span>
            {isHealedRun && (
              <span className="badge badge-passed" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={11} /> Verified Healed Run
              </span>
            )}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Feature: <strong style={{ color: 'var(--text-primary)' }}>{script.featureTitle || script.storyTitle}</strong>
          </div>
        </div>

        {/* View Mode Toggle & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Dual View Mode Toggle */}
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
              onClick={() => setViewMode('business_bdd')}
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
                backgroundColor: viewMode === 'business_bdd' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'business_bdd' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <FileText size={12} />
              <span>Business (BDD)</span>
            </button>
            <button
              onClick={() => setViewMode('technical_sdet')}
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
                backgroundColor: viewMode === 'technical_sdet' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'technical_sdet' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <Code2 size={12} />
              <span>Technical (POM)</span>
            </button>
          </div>

          {/* Quick Demo Simulator Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-app)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={simulateDrift}
              onChange={(e) => setSimulateDrift(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <span>Simulate UI Drift (AI Demo)</span>
          </label>

          {isRunning ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Square size={13} />}
              onClick={onAbortExecution}
            >
              Abort Run
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Play size={13} />}
              onClick={handleTriggerRun}
            >
              {runStatus === 'idle' ? 'Run Scenario' : 'Re-Run Scenario'}
            </Button>
          )}

          {runStatus === 'failed' && (
            <Button
              variant="ai"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={onOpenSelfHealingDiff}
            >
              AI Root Cause & Self-Heal
            </Button>
          )}
        </div>
      </div>

      {/* Failure Detection Alert Banner */}
      {runStatus === 'failed' && (
        <div
          className="animate-fade-in"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--status-failed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--status-failed)' }}>
                Step Failed: {activeFailure?.title || 'DOM Locator Mutation Drift Detected'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {activeFailure?.plainEnglishExplanation || 'A selector ID or CSS class changed in the target application. AI Self-Healing Engine is ready to repair the Page Object locator.'}
              </div>
            </div>
          </div>
          <Button variant="ai" size="sm" leftIcon={<Sparkles size={14} />} onClick={onOpenSelfHealingDiff}>
            Inspect Diff & Patch
          </Button>
        </div>
      )}

      {/* Healed Success Verification Banner */}
      {runStatus === 'healed' && (
        <div
          className="animate-fade-in"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-passed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--status-passed)' }}>
                All Steps Verified & Passed (AI Self-Healed)
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                The repaired locator has been verified against the target environment. The Page Object Model has been automatically patched in the repository.
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={13} />}
            onClick={() => exportHealingReport(script)}
          >
            Download Audit Report
          </Button>
        </div>
      )}

      {/* Main Split: Human-Readable Gherkin Step Checklist & Simulated Browser */}
      <SplitPane
        leftWidth="440px"
        left={
          <div className="card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                Scenario Steps ({passedCount}/{steps.length})
              </div>
              <Badge variant={runStatus === 'passed' || runStatus === 'healed' ? 'passed' : runStatus === 'failed' ? 'failed' : 'default'}>
                {runStatus.toUpperCase()}
              </Badge>
            </div>

            <ProgressBar value={progressPercent} variant={runStatus === 'failed' ? 'danger' : 'primary'} showLabel />

            {/* Human-Readable BDD Step Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', overflowY: 'auto', flex: 1 }}>
              {steps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPassed = step.status === 'passed';
                const isFailed = step.status === 'failed';
                const isStepHealed = step.status === 'healed';
                const isStepRunning = step.status === 'running';

                let kwBadgeColor = '#60A5FA';
                if (step.keyword === 'Given') kwBadgeColor = '#A78BFA';
                if (step.keyword === 'When') kwBadgeColor = '#38BDF8';
                if (step.keyword === 'Then') kwBadgeColor = '#34D399';

                return (
                  <div
                    key={step.stepNumber}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isFailed
                        ? 'var(--status-failed-bg)'
                        : isCurrent
                        ? 'var(--accent-primary-light)'
                        : isPassed
                        ? 'var(--bg-surface)'
                        : 'var(--bg-surface-hover)',
                      border: `1px solid ${
                        isFailed
                          ? 'var(--status-failed)'
                          : isCurrent
                          ? 'var(--accent-primary)'
                          : 'var(--border-subtle)'
                      }`,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {step.keyword && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: kwBadgeColor,
                              padding: '1px 5px',
                              borderRadius: '3px',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            {step.keyword}
                          </span>
                        )}
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: isFailed ? 'var(--status-failed)' : 'var(--text-primary)' }}>
                          {step.title.replace(/^(Given|When|Then|And)\s+/, '')}
                        </span>
                      </div>

                      {isStepRunning && <span className="status-dot status-dot-running" />}
                      {isPassed && <CheckCircle2 size={14} style={{ color: 'var(--status-passed)' }} />}
                      {isFailed && <AlertTriangle size={14} style={{ color: 'var(--status-failed)' }} />}
                      {isStepHealed && <Sparkles size={14} style={{ color: 'var(--ai-primary)' }} />}
                    </div>

                    {/* Show technical details ONLY if SDET View is toggled */}
                    {viewMode === 'technical_sdet' && (
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Locator: <code style={{ color: isFailed ? 'var(--status-failed)' : isStepHealed ? 'var(--status-passed)' : 'var(--accent-primary)' }}>{step.healedLocator && isHealedRun ? step.healedLocator : step.locator}</code>
                      </div>
                    )}

                    {step.errorLog && isFailed && (
                      <div
                        style={{
                          marginTop: '6px',
                          padding: '4px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: 'var(--status-failed)',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {step.errorLog}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        }
        right={
          <SimulatedBrowserViewport
            currentStepIndex={currentStepIndex}
            steps={steps}
            runStatus={runStatus}
            isHealed={isHealedRun || runStatus === 'healed'}
            scriptName={script.name}
          />
        }
      />

      {/* Collapsible Clean Terminal Console */}
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#090D16',
          border: '1px solid #1E293B',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <button
          onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            backgroundColor: '#0F172A',
            border: 'none',
            borderBottom: isTerminalExpanded ? '1px solid #1E293B' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            color: '#94A3B8',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={14} style={{ color: '#38BDF8' }} />
            <span>Execution Terminal Console ({logs.length} log lines)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {isTerminalExpanded ? 'Collapse Terminal' : 'Expand Terminal'}
            </span>
            {isTerminalExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </button>

        {isTerminalExpanded && (
          <div
            style={{
              padding: '0.875rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.6,
              maxHeight: '220px',
              overflowY: 'auto',
              color: '#E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#64748B', fontStyle: 'italic' }}>
                Terminal idle. Click 'Run Scenario' to start.
              </div>
            ) : (
              logs.map((log) => {
                let color = '#94A3B8';
                if (log.level === 'action') color = '#38BDF8';
                if (log.level === 'assert') color = '#A78BFA';
                if (log.level === 'warn') color = '#FBBF24';
                if (log.level === 'error') color = '#F87171';
                if (log.level === 'success') color = '#34D399';
                if (log.level === 'ai') color = '#C084FC';

                return (
                  <div key={log.id} style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ color: '#475569', flexShrink: 0 }}>[{log.timestamp}]</span>
                    <span style={{ color, wordBreak: 'break-word' }}>{log.message}</span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
