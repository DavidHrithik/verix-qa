import { useState, useRef, useEffect, useCallback } from 'react';
import {
  AutomationScriptExtended,
  ExecutionLogItem,
  SimulationStep,
  SelfHealingProposal,
  FailureScenario,
} from '../types';
import { initialAutomationScripts } from '../services/automationMockData';
import {
  createInitialExecutionLogs,
  generateStepLogs,
} from '../services/runnerSimulationService';
import { useToast } from '../../../app/providers/ToastProvider';

export type AutomationTab = 'catalog' | 'synthesizer' | 'studio' | 'runner' | 'healing-diff';

export const useAutomationEngine = () => {
  const { showToast } = useToast();

  const [scripts, setScripts] = useState<AutomationScriptExtended[]>(initialAutomationScripts);
  const [activeScriptId, setActiveScriptId] = useState<string>(initialAutomationScripts[0].id);
  const [activeTab, setActiveTab] = useState<AutomationTab>('catalog');

  // Runner state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [activeSteps, setActiveSteps] = useState<SimulationStep[]>([]);
  const [logs, setLogs] = useState<ExecutionLogItem[]>([]);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'passed' | 'failed' | 'healed'>('idle');
  const [activeFailure, setActiveFailure] = useState<FailureScenario | undefined>(undefined);
  const [isHealedRun, setIsHealedRun] = useState<boolean>(false);
  const [executionSpeed, setExecutionSpeed] = useState<number>(1000); // ms per step

  // Self-Healing Proposal State
  const [healingProposal, setHealingProposal] = useState<SelfHealingProposal | null>(null);

  const runnerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeScript = scripts.find((s) => s.id === activeScriptId) || scripts[0];

  // Initialize active steps when script changes
  useEffect(() => {
    if (activeScript) {
      setActiveSteps(activeScript.steps.map((st) => ({ ...st, status: 'pending' })));
      setActiveFailure(activeScript.failureScenario);
    }
  }, [activeScriptId]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
    };
  }, []);

  const selectScript = useCallback((script: AutomationScriptExtended, targetTab: AutomationTab = 'studio') => {
    setActiveScriptId(script.id);
    setActiveSteps(script.steps.map((st) => ({ ...st, status: 'pending' })));
    setActiveFailure(script.failureScenario);
    setRunStatus('idle');
    setCurrentStepIndex(-1);
    setLogs([]);
    setActiveTab(targetTab);
  }, []);

  const addScript = useCallback((newScript: AutomationScriptExtended) => {
    setScripts((prev) => [newScript, ...prev]);
    selectScript(newScript, 'studio');
    showToast('Script Created', `Saved ${newScript.name} to automation repository`, 'success');
  }, [selectScript, showToast]);

  // Start Execution
  const startExecution = useCallback(
    (scriptToRun?: AutomationScriptExtended, forceHealed: boolean = false, customFailure?: FailureScenario) => {
      const script = scriptToRun || activeScript;
      if (!script) return;

      if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);

      setIsRunning(true);
      setRunStatus('running');
      setIsHealedRun(forceHealed);
      setCurrentStepIndex(0);
      setActiveTab('runner');

      const failureToUse = forceHealed ? undefined : customFailure !== undefined ? customFailure : script.failureScenario;
      setActiveFailure(failureToUse);

      const initialSteps: SimulationStep[] = script.steps.map((st) => ({
        ...st,
        status: 'pending',
      }));
      setActiveSteps(initialSteps);

      const initialLogs = createInitialExecutionLogs(script.name, script.framework);
      setLogs(initialLogs);

      // Recursive execution loop
      const runStep = (stepIdx: number, currentStepList: SimulationStep[], accumulatedLogs: ExecutionLogItem[]) => {
        if (stepIdx >= currentStepList.length) {
          // All steps completed successfully!
          setIsRunning(false);
          const finalStatus = forceHealed ? 'healed' : 'passed';
          setRunStatus(finalStatus);

          // Update script metrics in catalog
          setScripts((prev) =>
            prev.map((s) =>
              s.id === script.id
                ? {
                    ...s,
                    lastRunStatus: 'Passed',
                    status: forceHealed ? 'Healed' : s.status,
                    executionCount: s.executionCount + 1,
                    lastExecutedAt: new Date().toISOString(),
                    steps: currentStepList.map((st) => ({ ...st, status: 'passed' })),
                  }
                : s
            )
          );

          const finishTs = new Date().toISOString().split('T')[1].slice(0, 12);
          setLogs((prev) => [
            ...prev,
            {
              id: `log-end-${Date.now()}`,
              timestamp: finishTs,
              level: 'success',
              message: `[VERIX-RUNNER] 🎉 Suite execution COMPLETED with 0 errors. All ${currentStepList.length} assertions verified passed!`,
            },
          ]);

          showToast(
            forceHealed ? 'Self-Healing Verified' : 'Suite Passed',
            `Executed ${script.name} with 100% pass rate`,
            'success'
          );
          return;
        }

        setCurrentStepIndex(stepIdx);

        // Mark current step as running
        const runningSteps = currentStepList.map((st, i) =>
          i === stepIdx ? { ...st, status: 'running' as const } : st
        );
        setActiveSteps(runningSteps);

        const currentStep = runningSteps[stepIdx];

        runnerTimeoutRef.current = setTimeout(() => {
          const { logs: stepLogs, passed } = generateStepLogs(currentStep, forceHealed, failureToUse);
          const newAccumulatedLogs = [...accumulatedLogs, ...stepLogs];
          setLogs(newAccumulatedLogs);

          if (!passed) {
            // STEP FAILED!
            const failedSteps = runningSteps.map((st, i) =>
              i === stepIdx ? { ...st, status: 'failed' as const } : st
            );
            setActiveSteps(failedSteps);
            setIsRunning(false);
            setRunStatus('failed');

            // Update script status in catalog
            setScripts((prev) =>
              prev.map((s) =>
                s.id === script.id
                  ? {
                      ...s,
                      lastRunStatus: 'Failed',
                      status: 'Flaky',
                      executionCount: s.executionCount + 1,
                      lastExecutedAt: new Date().toISOString(),
                    }
                  : s
              )
            );

            // Construct Self-Healing Proposal automatically
            if (failureToUse) {
              const proposal: SelfHealingProposal = {
                id: `heal-prop-${Date.now()}`,
                scriptId: script.id,
                scriptName: script.name,
                testCaseKey: script.testCaseKey,
                storyKey: script.storyKey,
                featureTitle: script.featureTitle || script.storyTitle,
                failureScenario: failureToUse,
                brokenCode: script.originalCode || script.code,
                healedCode: script.healedCode || script.code.replace(failureToUse.brokenLocator, failureToUse.healedLocator),
                confidence: failureToUse.candidates[0]?.confidence || 98,
                plainEnglishSummary: failureToUse.plainEnglishExplanation,
                aiExplanation: failureToUse.rootCauseAnalysis,
                status: 'pending',
                timestamp: new Date().toISOString(),
              };
              setHealingProposal(proposal);
            }

            showToast(
              'Test Failed at Step ' + (stepIdx + 1),
              `Selector drift detected on ${currentStep.title}. AI Root Cause Analysis ready.`,
              'error'
            );
            return;
          }

          // Step passed, mark step and proceed to next
          const passedSteps = runningSteps.map((st, i) =>
            i === stepIdx ? { ...st, status: 'passed' as const } : st
          );
          setActiveSteps(passedSteps);

          runStep(stepIdx + 1, passedSteps, newAccumulatedLogs);
        }, executionSpeed);
      };

      runStep(0, initialSteps, initialLogs);
    },
    [activeScript, executionSpeed, showToast]
  );

  const abortExecution = useCallback(() => {
    if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
    setIsRunning(false);
    setRunStatus('idle');
    showToast('Execution Aborted', 'Test runner stopped by user', 'info');
  }, [showToast]);

  // Approve Self-Healing Proposal
  const approveSelfHealing = useCallback(() => {
    if (!healingProposal) return;

    const targetScript = scripts.find((s) => s.id === healingProposal.scriptId) || activeScript;
    if (!targetScript) return;

    // Apply patch to script in memory
    const updatedScript: AutomationScriptExtended = {
      ...targetScript,
      code: healingProposal.healedCode,
      status: 'Healed',
      lastRunStatus: 'Running',
      healedAt: new Date().toISOString(),
      failureScenario: undefined, // Cleared failure
      selfHealingLogs: [
        ...(targetScript.selfHealingLogs || []),
        {
          healedAt: new Date().toISOString(),
          oldSelector: healingProposal.failureScenario.brokenLocator,
          newSelector: healingProposal.failureScenario.healedLocator,
          confidence: healingProposal.confidence,
        },
      ],
      steps: targetScript.steps.map((st, idx) =>
        idx === healingProposal.failureScenario.failedStepIndex
          ? { ...st, locator: healingProposal.failureScenario.healedLocator, status: 'healed' }
          : st
      ),
    };

    setScripts((prev) => prev.map((s) => (s.id === updatedScript.id ? updatedScript : s)));
    setHealingProposal((prev) => (prev ? { ...prev, status: 'approved' } : null));

    showToast('Healing Patch Approved', 'Patched script code in repository. Initiating verification re-run...', 'success');

    // Automatically trigger verified re-run
    setTimeout(() => {
      startExecution(updatedScript, true, undefined);
    }, 600);
  }, [healingProposal, scripts, activeScript, startExecution, showToast]);

  // Reject Self-Healing Proposal
  const rejectSelfHealing = useCallback(() => {
    if (!healingProposal) return;
    setHealingProposal((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    showToast('Proposal Discarded', 'No code changes applied to script', 'info');
  }, [healingProposal, showToast]);

  return {
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
    executionSpeed,
    healingProposal,
    setExecutionSpeed,
    selectScript,
    addScript,
    startExecution,
    abortExecution,
    approveSelfHealing,
    rejectSelfHealing,
    setActiveTab,
  };
};
