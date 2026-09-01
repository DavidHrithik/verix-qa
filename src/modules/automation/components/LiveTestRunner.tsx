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
  List,
  ShieldAlert,
  HardDrive,
  FileSpreadsheet,
  RotateCcw,
  Check,
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
  BddScenario,
} from '../types';
import { mockFailureScenarios } from '../services/automationMockData';
import { exportHealingReport } from '../services/reportExportService';

interface LiveTestRunnerProps {
  script: AutomationScriptExtended;
  isRunning: boolean;
  isBatchRunning?: boolean;
  activeScenarioIdx?: number;
  completedScenarioKeys?: string[];
  currentStepIndex: number;
  steps: SimulationStep[];
  logs: ExecutionLogItem[];
  runStatus: 'idle' | 'running' | 'passed' | 'failed' | 'healed';
  isHealedRun: boolean;
  activeFailure?: FailureScenario;
  onStartExecution: (forceHealed?: boolean, customFailure?: FailureScenario, scenarioIdx?: number) => void;
  onStartBatchSuite?: () => void;
  onSelectScenario?: (idx: number) => void;
  onAbortExecution: () => void;
  onOpenSelfHealingDiff: () => void;
}

export const LiveTestRunner: React.FC<LiveTestRunnerProps> = ({
  script,
  isRunning,
  isBatchRunning = false,
  activeScenarioIdx: controlledScenarioIdx,
  completedScenarioKeys = [],
  currentStepIndex,
  steps,
  logs,
  runStatus,
  isHealedRun,
  activeFailure,
  onStartExecution,
  onStartBatchSuite,
  onSelectScenario,
  onAbortExecution,
  onOpenSelfHealingDiff,
}) => {
  const [viewMode, setViewMode] = useState<AutomationViewMode>('business_bdd');
  const [isTerminalExpanded, setIsTerminalExpanded] = useState<boolean>(false);
  const [internalScenarioIdx, setInternalScenarioIdx] = useState<number>(0);
  const [simulateDrift, setSimulateDrift] = useState<boolean>(
    script.failureScenario !== undefined || script.status === 'Flaky' || script.lastRunStatus === 'Failed'
  );
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const subScenarios = script.subScenarios || [];
  const currentScenarioIdx = controlledScenarioIdx !== undefined ? controlledScenarioIdx : internalScenarioIdx;
  const currentScenario = subScenarios[currentScenarioIdx];
  const activeTestCaseKey = currentScenario ? currentScenario.testCaseKey : script.testCaseKey;

  // Active steps to display
  const displaySteps = steps.length > 0 ? steps : (currentScenario ? currentScenario.steps : script.steps);

  useEffect(() => {
    setSimulateDrift(
      script.failureScenario !== undefined || script.status === 'Flaky' || script.lastRunStatus === 'Failed'
    );
    setInternalScenarioIdx(0);
  }, [script.id]);

  useEffect(() => {
    if (isTerminalExpanded && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isTerminalExpanded]);

  const handleSelectScenario = (idx: number) => {
    if (isRunning) return;
    setInternalScenarioIdx(idx);
    if (onSelectScenario) onSelectScenario(idx);
  };

  const handleTriggerSingleRun = () => {
    if (currentScenarioIdx !== 0 || !simulateDrift) {
      // Clean pass for other scenarios or when drift is unchecked
      onStartExecution(true, undefined, currentScenarioIdx);
    } else {
      // Run Scenario 1 with drift simulation
      const failure =
        script.failureScenario ||
        (script.storyKey.includes('DBANK')
          ? mockFailureScenarios.mfa_button_drift
          : mockFailureScenarios.member_export_toggle_drift);
      onStartExecution(false, failure, currentScenarioIdx);
    }
  };

  const passedCount = displaySteps.filter((s) => s.status === 'passed' || s.status === 'healed').length;
  const progressPercent = displaySteps.length > 0 ? Math.round((passedCount / displaySteps.length) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Multi-Scenario Tab Bar (When Feature has multiple scenarios) */}
      {subScenarios.length > 0 && (
        <div
          className="card"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Feature Scenarios ({subScenarios.length}):
            </span>
            {subScenarios.map((scen, idx) => {
              const isSelected = idx === currentScenarioIdx;
              const isCompleted = completedScenarioKeys.includes(scen.testCaseKey);
              const isCurrentlyExecuting = isRunning && isSelected;

              return (
                <button
                  key={scen.id}
                  disabled={isRunning}
                  onClick={() => handleSelectScenario(idx)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    border: '1px solid',
                    backgroundColor: isSelected
                      ? 'var(--accent-primary-light)'
                      : isCompleted
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'var(--bg-surface-hover)',
                    borderColor: isSelected
                      ? 'var(--accent-primary)'
                      : isCompleted
                      ? 'var(--status-passed)'
                      : 'var(--border-subtle)',
                    color: isSelected
                      ? 'var(--accent-primary)'
                      : isCompleted
                      ? 'var(--status-passed)'
                      : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {isCompleted ? (
                    <Check size={12} style={{ color: 'var(--status-passed)' }} />
                  ) : isCurrentlyExecuting ? (
                    <RotateCw size={12} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                  ) : null}
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{scen.testCaseKey}</span>
                  <span>• {scen.vectorType}</span>
                </button>
              );
            })}
          </div>

          <Badge variant={completedScenarioKeys.length === subScenarios.length && completedScenarioKeys.length > 0 ? 'passed' : 'default'}>
            {completedScenarioKeys.length > 0
              ? `${completedScenarioKeys.length}/${subScenarios.length} Scenarios Passed`
              : `${subScenarios.length} Scenarios Defined`}
          </Badge>
        </div>
      )}

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
            <span className="badge badge-primary">{activeTestCaseKey}</span>

            {/* AI Engine Status Badge */}
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                fontSize: '11px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={11} /> AI Self-Healing Engine Active
            </span>

            {/* In-Runner Simulate UI Drift Toggle (Only on Scenario 1) */}
            {currentScenarioIdx === 0 && !isBatchRunning && (
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-surface-hover)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
                title="Toggle selector drift simulation on Scenario 1 to demonstrate AI auto-recovery"
              >
                <input
                  type="checkbox"
                  checked={simulateDrift}
                  disabled={isRunning}
                  onChange={(e) => setSimulateDrift(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                />
                <span>Simulate UI Drift (AI Demo)</span>
              </label>
            )}
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {currentScenario ? currentScenario.title : script.featureTitle || script.storyTitle}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          {isRunning ? (
            <Button variant="danger" size="md" leftIcon={<Square size={14} />} onClick={onAbortExecution}>
              Stop Execution
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Play size={14} />}
                onClick={handleTriggerSingleRun}
              >
                {currentScenarioIdx === 0 && simulateDrift ? 'Run & Diagnose (AI Demo)' : `Run Scenario (${activeTestCaseKey})`}
              </Button>

              {subScenarios.length > 1 && (
                <Button
                  variant="ai"
                  size="md"
                  leftIcon={<Zap size={14} />}
                  onClick={() => {
                    if (onStartBatchSuite) onStartBatchSuite();
                    else onStartExecution(true, undefined, 0);
                  }}
                  title="Execute all 5 scenarios sequentially"
                >
                  Run Entire Suite (5 Scenarios)
                </Button>
              )}
            </>
          )}

          {/* View Mode Toggle: BDD vs SDET */}
          <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('business_bdd')}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: viewMode === 'business_bdd' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: viewMode === 'business_bdd' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FileText size={12} /> BDD Mode
            </button>
            <button
              onClick={() => setViewMode('technical_sdet')}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: viewMode === 'technical_sdet' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: viewMode === 'technical_sdet' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Code2 size={12} /> SDET View
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {isBatchRunning
                ? `Batch Suite Progress (Running Scenario ${currentScenarioIdx + 1}/${subScenarios.length}: ${activeTestCaseKey})`
                : `Execution Progress (${passedCount} of ${displaySteps.length} Steps)`}
            </span>
            {runStatus === 'running' && (
              <span className="badge badge-warning animate-pulse">Running {activeTestCaseKey}</span>
            )}
            {runStatus === 'passed' && (
              <span className="badge badge-passed">100% Passed</span>
            )}
            {runStatus === 'healed' && (
              <span className="badge badge-ai">✨ AI Self-Healed & Verified</span>
            )}
            {runStatus === 'failed' && (
              <span className="badge badge-failed">Locator Drift Intercepted</span>
            )}
          </div>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {progressPercent}%
          </span>
        </div>

        <ProgressBar value={progressPercent} variant={runStatus === 'failed' ? 'danger' : runStatus === 'healed' ? 'ai' : 'primary'} />
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

      {/* Suite Passed Scorecard Banner (When batch run completes) */}
      {runStatus === 'passed' && completedScenarioKeys.length > 1 && (
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
                🏆 Entire Feature Suite Passed: {completedScenarioKeys.length}/{subScenarios.length} Scenarios Verified (100% Pass Rate)
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Executed Happy Path, Security RBAC Gate, Boundary Stream, PII Masking, and Session Rollback with 0 errors.
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  Gherkin Step Checklist
                </span>
              </div>
              <span className="badge badge-default" style={{ fontSize: '10px' }}>
                {activeTestCaseKey} ({displaySteps.length} Steps)
              </span>
            </div>

            {/* Step list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
              {displaySteps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex && isRunning;
                const isFailed = step.status === 'failed';
                const isHealedStep = step.status === 'healed';
                const isPassed = step.status === 'passed';

                return (
                  <div
                    key={step.stepNumber}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCurrent
                        ? 'var(--accent-primary-light)'
                        : isFailed
                        ? 'rgba(239, 68, 68, 0.1)'
                        : isHealedStep
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'var(--bg-surface-hover)',
                      border: isCurrent
                        ? '1px solid var(--accent-primary)'
                        : isFailed
                        ? '1px solid var(--status-failed)'
                        : isHealedStep
                        ? '1px solid var(--status-passed)'
                        : '1px solid var(--border-subtle)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '11px', color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                          {step.keyword || 'Step'} {step.stepNumber}:
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-primary)' }}>
                          {step.title}
                        </span>
                      </div>

                      {isPassed && <span className="badge badge-passed" style={{ fontSize: '9px' }}>PASS</span>}
                      {isHealedStep && (
                        <span className="badge badge-ai" style={{ fontSize: '9px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Sparkles size={9} /> HEALED
                        </span>
                      )}
                      {isFailed && <span className="badge badge-failed" style={{ fontSize: '9px' }}>FAILED</span>}
                      {isCurrent && <span className="badge badge-warning animate-pulse" style={{ fontSize: '9px' }}>RUNNING</span>}
                      {step.status === 'pending' && <span className="badge badge-default" style={{ fontSize: '9px' }}>PENDING</span>}
                    </div>

                    {/* Step Action description */}
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                      {step.action}
                    </div>

                    {/* SDET Technical View Locator */}
                    {viewMode === 'technical_sdet' && (
                      <div
                        style={{
                          marginTop: '4px',
                          padding: '3px 6px',
                          borderRadius: '3px',
                          backgroundColor: '#0F172A',
                          color: '#94A3B8',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          wordBreak: 'break-all',
                        }}
                      >
                        <code>{isHealedStep && step.healedLocator ? step.healedLocator : step.locator}</code>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        }
        right={
          /* Live Browser Viewport */
          <SimulatedBrowserViewport
            currentStepIndex={currentStepIndex}
            steps={displaySteps}
            runStatus={runStatus}
            isHealed={isHealedRun}
            scriptName={script.name}
            activeTestCaseKey={activeTestCaseKey}
          />
        }
      />

      {/* Terminal / Live Execution Console Accordion */}
      <div
        className="card"
        style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          color: '#E2E8F0',
        }}
      >
        <div
          onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={15} style={{ color: '#38BDF8' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
              Execution Logs & Telemetry Console ({logs.length} entries)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isRunning && <span className="badge badge-warning animate-pulse" style={{ fontSize: '9px' }}>STREAMING</span>}
            {isTerminalExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </div>

        {isTerminalExpanded && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              backgroundColor: '#020617',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #1E293B',
              maxHeight: '220px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.6,
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#64748B' }}>Logs will stream here when execution begins...</div>
            ) : (
              logs.map((log) => {
                const color =
                  log.level === 'error'
                    ? '#F87171'
                    : log.level === 'success' || log.level === 'ai'
                    ? '#34D399'
                    : log.level === 'warn'
                    ? '#FBBF24'
                    : log.level === 'action'
                    ? '#38BDF8'
                    : '#94A3B8';

                return (
                  <div key={log.id} style={{ color, wordBreak: 'break-all' }}>
                    <span style={{ color: '#64748B' }}>[{log.timestamp}]</span> <strong>[{log.level.toUpperCase()}]</strong> {log.message}
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
