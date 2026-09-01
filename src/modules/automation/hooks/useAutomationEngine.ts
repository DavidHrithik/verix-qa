import { useState, useRef, useEffect, useCallback } from 'react';
import {
  AutomationScriptExtended,
  ExecutionLogItem,
  SimulationStep,
  SelfHealingProposal,
  FailureScenario,
  BddScenario,
} from '../types';
import { initialAutomationScripts, mockFailureScenarios } from '../services/automationMockData';
import {
  createInitialExecutionLogs,
  generateStepLogs,
} from '../services/runnerSimulationService';
import { useToast } from '../../../app/providers/ToastProvider';

export type AutomationTab = 'catalog' | 'synthesizer' | 'studio' | 'runner' | 'healing-diff';
const STORAGE_KEY_AUTOMATION = 'verix_automation_scripts_v4';

export const useAutomationEngine = () => {
  const { showToast } = useToast();

  const [scripts, setScripts] = useState<AutomationScriptExtended[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTOMATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load automation scripts from storage', e);
    }
    return initialAutomationScripts;
  });

  // Save scripts to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTOMATION, JSON.stringify(scripts));
    } catch (e) {
      console.warn('Failed to save automation scripts to storage', e);
    }
  }, [scripts]);

  const [activeScriptId, setActiveScriptId] = useState<string>(initialAutomationScripts[0].id);
  const [activeTab, setActiveTab] = useState<AutomationTab>('catalog');

  // Runner state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [completedScenarioKeys, setCompletedScenarioKeys] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [activeSteps, setActiveSteps] = useState<SimulationStep[]>([]);
  const [logs, setLogs] = useState<ExecutionLogItem[]>([]);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'passed' | 'failed' | 'healed'>('idle');
  const [activeFailure, setActiveFailure] = useState<FailureScenario | undefined>(undefined);
  const [isHealedRun, setIsHealedRun] = useState<boolean>(false);
  const [executionSpeed, setExecutionSpeed] = useState<number>(850); // ms per step

  // Self-Healing Proposal State
  const [healingProposal, setHealingProposal] = useState<SelfHealingProposal | null>(null);

  const runnerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeScript = scripts.find((s) => s.id === activeScriptId) || scripts[0];

  // Initialize active steps when script changes
  useEffect(() => {
    if (activeScript) {
      const sub = activeScript.subScenarios;
      const initialStepList = (sub && sub.length > 0) ? sub[0].steps : activeScript.steps;
      setActiveSteps(initialStepList.map((st) => ({ ...st, status: 'pending' })));
      setActiveFailure(activeScript.failureScenario);
      setActiveScenarioIdx(0);
      setCompletedScenarioKeys([]);
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
    const sub = script.subScenarios;
    const initialStepList = (sub && sub.length > 0) ? sub[0].steps : script.steps;
    setActiveSteps(initialStepList.map((st) => ({ ...st, status: 'pending' })));
    setActiveFailure(script.failureScenario);
    setRunStatus('idle');
    setCurrentStepIndex(-1);
    setActiveScenarioIdx(0);
    setCompletedScenarioKeys([]);
    setLogs([]);
    setActiveTab(targetTab);
  }, []);

  const addScript = useCallback((newScript: AutomationScriptExtended, overwriteExisting: boolean = true) => {
    setScripts((prev) => {
      const existingIdx = prev.findIndex((s) => s.storyKey === newScript.storyKey || s.name === newScript.name);
      if (overwriteExisting && existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = newScript;
        return updated;
      }
      return [newScript, ...prev];
    });
    selectScript(newScript, 'studio');
    showToast('Script Ready', `Configured ${newScript.name} in automation catalog`, 'success');
  }, [selectScript, showToast]);

  const deleteScript = useCallback((scriptId: string) => {
    setScripts((prev) => {
      const remaining = prev.filter((s) => s.id !== scriptId);
      if (activeScriptId === scriptId && remaining.length > 0) {
        selectScript(remaining[0], 'catalog');
      }
      return remaining;
    });
    showToast('Scenario Deleted', 'Removed scenario from automation catalog', 'info');
  }, [activeScriptId, selectScript, showToast]);

  // Start Execution for a single scenario
  const startExecution = useCallback(
    (scriptToRun?: AutomationScriptExtended, forceHealed: boolean = false, customFailure?: FailureScenario, scenarioIdx: number = 0) => {
      const script = scriptToRun || activeScript;
      if (!script) return;

      if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);

      setIsRunning(true);
      setIsBatchRunning(false);
      setRunStatus('running');
      setIsHealedRun(forceHealed);
      setCurrentStepIndex(0);
      setActiveScenarioIdx(scenarioIdx);
      setActiveTab('runner');

      const failureToUse = forceHealed ? undefined : customFailure !== undefined ? customFailure : (scenarioIdx === 0 ? script.failureScenario : undefined);
      setActiveFailure(failureToUse);

      const targetSub = script.subScenarios && script.subScenarios[scenarioIdx];
      const stepSource = targetSub ? targetSub.steps : script.steps;

      const initialSteps: SimulationStep[] = stepSource.map((st) => ({
        ...st,
        status: 'pending',
      }));
      setActiveSteps(initialSteps);

      const scenName = targetSub ? targetSub.title : script.name;
      const initialLogs = createInitialExecutionLogs(scenName, script.framework);
      setLogs(initialLogs);

      // Recursive execution loop
      const runStep = (stepIdx: number, currentStepList: SimulationStep[], accumulatedLogs: ExecutionLogItem[]) => {
        if (stepIdx >= currentStepList.length) {
          // Scenario completed successfully!
          setIsRunning(false);
          const finalStatus = forceHealed ? 'healed' : 'passed';
          setRunStatus(finalStatus);
          const targetKey = targetSub ? targetSub.testCaseKey : script.testCaseKey;
          setCompletedScenarioKeys([targetKey]);

          // Update script metrics in catalog
          setScripts((prev) =>
            prev.map((s) =>
              s.id === script.id
                ? {
                    ...s,
                    lastRunStatus: 'Passed',
                    status: forceHealed ? 'Healed' : 'Active',
                    failureScenario: undefined,
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
              message: `[VERIX-RUNNER] 🎉 Scenario ${targetKey} PASSED with 0 errors. All ${currentStepList.length} assertions verified!`,
            },
          ]);

          showToast(
            forceHealed ? 'Self-Healing Verified' : 'Scenario Passed',
            `Executed ${targetKey} with 100% pass rate`,
            'success'
          );
          return;
        }

        setCurrentStepIndex(stepIdx);

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

  // Start Batch Execution across ALL scenarios in feature
  const startBatchSuiteExecution = useCallback(
    (scriptToRun?: AutomationScriptExtended) => {
      const script = scriptToRun || activeScript;
      if (!script) return;

      const subList = script.subScenarios && script.subScenarios.length > 0 ? script.subScenarios : [
        {
          id: 'scen-single',
          testCaseKey: script.testCaseKey,
          title: script.testCaseTitle,
          vectorType: 'Functional / Happy Path',
          steps: script.steps,
        } as BddScenario
      ];

      if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);

      setIsRunning(true);
      setIsBatchRunning(true);
      setRunStatus('running');
      setIsHealedRun(false);
      setActiveTab('runner');
      setCompletedScenarioKeys([]);

      const initialLogs = createInitialExecutionLogs(`Suite: ${script.name} (${subList.length} Scenarios)`, script.framework);
      setLogs(initialLogs);

      const runScenarioAt = (scenIdx: number, doneKeys: string[], currentLogs: ExecutionLogItem[]) => {
        if (scenIdx >= subList.length) {
          // ALL SCENARIOS COMPLETE!
          setIsRunning(false);
          setIsBatchRunning(false);
          setRunStatus('passed');
          setCompletedScenarioKeys(doneKeys);

          const finishTs = new Date().toISOString().split('T')[1].slice(0, 12);
          setLogs((prev) => [
            ...prev,
            {
              id: `log-batch-end-${Date.now()}`,
              timestamp: finishTs,
              level: 'success',
              message: `[VERIX-RUNNER] 🏆 SUITE COMPLETE: ${subList.length}/${subList.length} Scenarios Passed (100% Pass Rate, 0 Errors).`,
            },
          ]);

          setScripts((prev) =>
            prev.map((s) =>
              s.id === script.id
                ? {
                    ...s,
                    lastRunStatus: 'Passed',
                    status: 'Active',
                    executionCount: s.executionCount + 1,
                    lastExecutedAt: new Date().toISOString(),
                  }
                : s
            )
          );

          showToast('Suite Complete', `All ${subList.length} scenarios executed and verified passed!`, 'success');
          return;
        }

        const scen = subList[scenIdx];
        setActiveScenarioIdx(scenIdx);

        const scenSteps: SimulationStep[] = scen.steps.map((st) => ({
          ...st,
          status: 'pending',
        }));
        setActiveSteps(scenSteps);

        const scenStartTs = new Date().toISOString().split('T')[1].slice(0, 12);
        const updatedLogs: ExecutionLogItem[] = [
          ...currentLogs,
          {
            id: `log-scen-${scenIdx}-${Date.now()}`,
            timestamp: scenStartTs,
            level: 'info',
            message: `[SUITE] ▶ Executing Scenario ${scenIdx + 1}/${subList.length}: ${scen.testCaseKey} (${scen.vectorType})`,
          },
        ];
        setLogs(updatedLogs);

        const isFirstScenario = scenIdx === 0;
        const scenFailure = isFirstScenario ? (activeFailure || script.failureScenario) : undefined;

        // Step by step runner inside scenario
        const runScenStep = (stepIdx: number, activeStepList: SimulationStep[], scenAccumLogs: ExecutionLogItem[]) => {
          if (stepIdx >= activeStepList.length) {
            // This scenario finished!
            const newDoneKeys = [...doneKeys, scen.testCaseKey];
            setCompletedScenarioKeys(newDoneKeys);

            const scenEndTs = new Date().toISOString().split('T')[1].slice(0, 12);
            const afterScenLogs: ExecutionLogItem[] = [
              ...scenAccumLogs,
              {
                id: `log-scen-done-${scenIdx}-${Date.now()}`,
                timestamp: scenEndTs,
                level: 'success',
                message: `[SUITE] ✓ Scenario ${scen.testCaseKey} PASSED (${activeStepList.length} steps verified).`,
              },
            ];
            setLogs(afterScenLogs);

            // Pause slightly before starting next scenario
            runnerTimeoutRef.current = setTimeout(() => {
              runScenarioAt(scenIdx + 1, newDoneKeys, afterScenLogs);
            }, 600);
            return;
          }

          setCurrentStepIndex(stepIdx);

          const runningSteps = activeStepList.map((st, i) =>
            i === stepIdx ? { ...st, status: 'running' as const } : st
          );
          setActiveSteps(runningSteps);

          const currentStep = runningSteps[stepIdx];

          runnerTimeoutRef.current = setTimeout(() => {
            const { logs: stepLogs, passed } = generateStepLogs(currentStep, !scenFailure, scenFailure);
            const combinedLogs = [...scenAccumLogs, ...stepLogs];
            setLogs(combinedLogs);

            if (!passed) {
              // Drift caught during batch execution!
              const failedSteps = runningSteps.map((st, i) =>
                i === stepIdx ? { ...st, status: 'failed' as const } : st
              );
              setActiveSteps(failedSteps);
              setIsRunning(false);
              setIsBatchRunning(false);
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
              if (scenFailure) {
                const proposal: SelfHealingProposal = {
                  id: `heal-prop-${Date.now()}`,
                  scriptId: script.id,
                  scriptName: script.name,
                  testCaseKey: script.testCaseKey,
                  storyKey: script.storyKey,
                  featureTitle: script.featureTitle || script.storyTitle,
                  failureScenario: scenFailure,
                  brokenCode: script.originalCode || script.code,
                  healedCode: script.healedCode || script.code.replace(scenFailure.brokenLocator, scenFailure.healedLocator),
                  confidence: scenFailure.candidates[0]?.confidence || 98,
                  plainEnglishSummary: scenFailure.plainEnglishExplanation,
                  aiExplanation: scenFailure.rootCauseAnalysis,
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

            const passedSteps = runningSteps.map((st, i) =>
              i === stepIdx ? { ...st, status: 'passed' as const } : st
            );
            setActiveSteps(passedSteps);

            runScenStep(stepIdx + 1, passedSteps, combinedLogs);
          }, 650);
        };

        runScenStep(0, scenSteps, updatedLogs);
      };

      runScenarioAt(0, [], initialLogs);
    },
    [activeScript, showToast]
  );

  const abortExecution = useCallback(() => {
    if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
    setIsRunning(false);
    setIsBatchRunning(false);
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
      status: 'Active',
      lastRunStatus: 'Passed',
      healedAt: new Date().toISOString(),
      pageObjectClass: targetScript.healedPageObjectClass || targetScript.pageObjectClass,
      code: healingProposal.healedCode,
      healedCode: healingProposal.healedCode,
      failureScenario: undefined,
      steps: targetScript.steps.map((st) => ({
        ...st,
        status: 'passed',
        healedLocator: st.healedLocator || (st.status === 'failed' ? healingProposal.failureScenario.healedLocator : undefined),
      })),
    };

    setScripts((prev) => prev.map((s) => (s.id === updatedScript.id ? updatedScript : s)));
    setHealingProposal((prev) => (prev ? { ...prev, status: 'approved' } : null));

    showToast(
      'Self-Healing Patch Applied',
      `Patched Page Object selector with ${healingProposal.confidence}% confidence`,
      'success'
    );

    // Re-run the script with verified healed state
    setTimeout(() => {
      startExecution(updatedScript, true, undefined, 0);
    }, 400);
  }, [healingProposal, scripts, activeScript, showToast, startExecution]);

  // ⚡ Inject UI Drift (Break Locator for Live Demo)
  const injectDrift = useCallback((scriptId?: string) => {
    const targetId = scriptId || activeScriptId;
    const failure = mockFailureScenarios.member_export_toggle_drift;

    setScripts((prev) =>
      prev.map((s) => {
        if (s.id === targetId || s.storyKey === 'CLOUD-204') {
          return {
            ...s,
            status: 'Flaky',
            lastRunStatus: 'Failed',
            failureScenario: failure,
            healedAt: undefined,
            steps: s.steps.map((st, idx) => ({
              ...st,
              status: idx === 2 ? 'failed' : 'pending',
            })),
          };
        }
        return s;
      })
    );

    setActiveFailure(failure);
    setIsHealedRun(false);
    setRunStatus('idle');
    setCurrentStepIndex(-1);
    setActiveScenarioIdx(0);
    setCompletedScenarioKeys([]);
    setHealingProposal(null);

    showToast(
      '⚡ UI Drift Injected',
      'Locator By.id("toggle-export-data") is now armed to fail at Step 3. Click "Run Scenario" to demonstrate AI Self-Healing.',
      'info'
    );
  }, [activeScriptId, showToast]);

  // 🔄 Reset Demo Baseline (Restore Clean State)
  const resetDemo = useCallback(() => {
    if (runnerTimeoutRef.current) clearTimeout(runnerTimeoutRef.current);
    setScripts(initialAutomationScripts);
    setActiveScriptId(initialAutomationScripts[0].id);
    setActiveSteps(initialAutomationScripts[0].steps.map((st) => ({ ...st, status: 'pending' })));
    setActiveFailure(initialAutomationScripts[0].failureScenario);
    setRunStatus('idle');
    setIsRunning(false);
    setIsBatchRunning(false);
    setCurrentStepIndex(-1);
    setActiveScenarioIdx(0);
    setCompletedScenarioKeys([]);
    setHealingProposal(null);
    setLogs([]);
    showToast('🔄 Demo Reset', 'All automation scenarios and metrics restored to baseline.', 'success');
  }, [showToast]);

  // 🎛️ Manually Change Locator in Code Studio
  const setCustomLocator = useCallback((locatorType: 'broken_id' | 'healed_testid' | 'custom_role') => {
    if (locatorType === 'broken_id') {
      injectDrift();
    } else {
      setScripts((prev) =>
        prev.map((s) => {
          if (s.id === activeScriptId || s.storyKey === 'CLOUD-204') {
            return {
              ...s,
              status: 'Active',
              lastRunStatus: 'Passed',
              failureScenario: undefined,
              healedAt: new Date().toISOString(),
            };
          }
          return s;
        })
      );
      setActiveFailure(undefined);
      setIsHealedRun(true);
      showToast('Locator Updated', `Switched Page Object selector to ${locatorType === 'healed_testid' ? 'data-testid' : 'semantic aria-role'}`, 'success');
    }
  }, [activeScriptId, injectDrift, showToast]);

  const rejectSelfHealing = useCallback(() => {
    setHealingProposal((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    showToast('Proposal Rejected', 'Kept original Page Object selector without changes', 'info');
  }, [showToast]);

  return {
    scripts,
    activeScript,
    activeScriptId,
    activeTab,
    isRunning,
    isBatchRunning,
    activeScenarioIdx,
    completedScenarioKeys,
    currentStepIndex,
    activeSteps,
    logs,
    runStatus,
    activeFailure,
    isHealedRun,
    healingProposal,
    executionSpeed,
    setActiveTab,
    setActiveScenarioIdx,
    setExecutionSpeed,
    selectScript,
    addScript,
    deleteScript,
    startExecution,
    startBatchSuiteExecution,
    abortExecution,
    approveSelfHealing,
    rejectSelfHealing,
    injectDrift,
    resetDemo,
    setCustomLocator,
  };
};
