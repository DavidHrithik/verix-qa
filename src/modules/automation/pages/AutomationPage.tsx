import React, { useState } from 'react';
import {
  Cpu,
  Play,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Terminal,
  FileCode2,
  Code2,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/ui/Button';
import { Tabs, TabItem } from '../../../components/ui/Tabs';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';

import { useAutomationEngine, AutomationTab } from '../hooks/useAutomationEngine';
import { AutomationStatsBar } from '../components/AutomationStatsBar';
import { ScriptCatalog } from '../components/ScriptCatalog';
import { ScriptSynthesizerModal } from '../components/ScriptSynthesizerModal';
import { ScriptCodeStudio } from '../components/ScriptCodeStudio';
import { LiveTestRunner } from '../components/LiveTestRunner';
import { SelfHealingDiffStudio } from '../components/SelfHealingDiffStudio';
import { AutomationScriptExtended } from '../types';

export const AutomationPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState<boolean>(false);

  const {
    scripts,
    activeScript,
    activeScriptId,
    activeTab,
    isRunning,
    currentStepIndex,
    activeSteps,
    logs,
    runStatus,
    activeFailure,
    isHealedRun,
    healingProposal,
    selectScript,
    addScript,
    deleteScript,
    startExecution,
    abortExecution,
    approveSelfHealing,
    rejectSelfHealing,
    setActiveTab,
  } = useAutomationEngine();

  const handleScriptGenerated = (newScript: AutomationScriptExtended) => {
    addScript(newScript);
    // Switch to runner immediately
    setTimeout(() => {
      startExecution(newScript);
    }, 400);
  };

  const tabs: TabItem[] = [
    {
      id: 'catalog',
      label: 'Script Catalog',
      count: scripts.length,
      icon: <Layers size={14} />,
    },
    {
      id: 'runner',
      label: 'Live Test Runner',
      count: isRunning ? 'RUNNING' : runStatus === 'failed' ? 'FAILED' : runStatus === 'healed' ? 'PASSED' : undefined,
      icon: <Play size={14} />,
    },
    {
      id: 'healing-diff',
      label: 'AI Self-Healing Diff',
      count: healingProposal ? 'PROPOSAL' : undefined,
      icon: <Sparkles size={14} style={{ color: 'var(--ai-primary)' }} />,
    },
    {
      id: 'studio',
      label: 'Code Studio',
      icon: <Code2 size={14} />,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Self-Healing Automation & Runner"
        description="Automated test execution with AI-powered locator self-healing and instant failure recovery."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Automation' }]}
        badge={
          <span className="badge badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> AI Healing Engine Online
          </span>
        }
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Play size={13} />}
              onClick={() => {
                setActiveTab('runner');
                startExecution(activeScript);
              }}
            >
              Run Active Suite
            </Button>
            <Button
              variant="ai"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={() => setIsSynthesizerOpen(true)}
            >
              Synthesize From Story
            </Button>
          </div>
        }
      />

      {/* Workflow Navigation Banner */}
      <div
        className="card"
        style={{
          padding: '0.75rem 1.25rem',
          marginBottom: '1.25rem',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: 'var(--text-xs)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--accent-primary)' }}>End-to-End Workflow:</span>
          <span>1. User Story</span>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <span>2. Synthesize Script</span>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <span>3. Run & Detect Drift</span>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <span>4. AI Root Cause & Diff</span>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <span style={{ color: 'var(--status-passed)' }}>5. Re-run & Verified Pass</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsSynthesizerOpen(true)}
            className="btn btn-ghost"
            style={{ fontSize: '11px', padding: '2px 6px', color: 'var(--accent-primary)' }}
          >
            Quick Synthesize
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Bar */}
      <AutomationStatsBar scripts={scripts} />

      {/* Main Tabs Navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as AutomationTab)}
        />
      </div>

      {/* Tab Panels */}
      {activeTab === 'catalog' && (
        <ScriptCatalog
          scripts={scripts}
          activeScriptId={activeScriptId}
          onSelectScript={(script, targetTab) => selectScript(script, targetTab || 'studio')}
          onOpenSynthesizer={() => setIsSynthesizerOpen(true)}
          onExecuteScript={(script) => {
            setActiveTab('runner');
            startExecution(script);
          }}
          onDeleteScript={deleteScript}
        />
      )}

      {activeTab === 'runner' && (
        <LiveTestRunner
          script={activeScript}
          isRunning={isRunning}
          currentStepIndex={currentStepIndex}
          steps={activeSteps}
          logs={logs}
          runStatus={runStatus}
          isHealedRun={isHealedRun}
          activeFailure={activeFailure}
          onStartExecution={(forceHealed) => startExecution(activeScript, forceHealed)}
          onAbortExecution={abortExecution}
          onOpenSelfHealingDiff={() => setActiveTab('healing-diff')}
        />
      )}

      {activeTab === 'healing-diff' && (
        <SelfHealingDiffStudio
          proposal={healingProposal}
          onApprove={approveSelfHealing}
          onReject={rejectSelfHealing}
          onCancel={() => setActiveTab('runner')}
        />
      )}

      {activeTab === 'studio' && (
        <ScriptCodeStudio
          script={activeScript}
          allScripts={scripts}
          onSelectScript={(s) => selectScript(s, 'studio')}
          onExecute={(script) => {
            setActiveTab('runner');
            startExecution(script);
          }}
          onOpenSelfHealing={() => setActiveTab('healing-diff')}
        />
      )}

      {/* Modal for AI Script Synthesis */}
      <ScriptSynthesizerModal
        isOpen={isSynthesizerOpen}
        onClose={() => setIsSynthesizerOpen(false)}
        onScriptGenerated={handleScriptGenerated}
      />
    </div>
  );
};
