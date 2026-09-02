/**
 * DataProvider — Centralized state management for all QA domain data.
 *
 * Persists to localStorage under 'verix_data_*' keys.
 * On first load, seeds from mock/index.ts seed arrays.
 * All features read and write through this context — no local states or mock imports.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserStory, TestCase, Task, TestExecution } from '../../types';
import { seedStories, seedTestCases, seedTasks } from '../../mock';

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const KEYS = {
  stories:    'verix_data_stories',
  testCases:  'verix_data_test_cases',
  tasks:      'verix_data_tasks',
  executions: 'verix_data_executions',
};

const load = <T,>(key: string, seed: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as T[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return seed;
};

const persist = <T,>(key: string, data: T[]) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
};

// ─── Context Shape ─────────────────────────────────────────────────────────────
interface DataContextValue {
  // Raw arrays
  stories:    UserStory[];
  testCases:  TestCase[];
  tasks:      Task[];
  executions: TestExecution[];

  // Per-project selectors
  storiesForProject:   (projectId: string) => UserStory[];
  testCasesForProject: (projectId: string) => TestCase[];
  tasksForProject:     (projectId: string) => Task[];
  testCasesForStory:   (storyId: string)   => TestCase[];

  // CRUD — User Stories
  addStory:    (story: UserStory)    => void;
  updateStory: (story: UserStory)    => void;
  deleteStory: (id: string)          => void;

  // CRUD — Test Cases
  addTestCases:   (cases: TestCase[]) => void;
  updateTestCase: (tc: TestCase)      => void;
  deleteTestCase: (id: string)        => void;

  // CRUD — Tasks
  addTask:    (task: Task)    => void;
  updateTask: (task: Task)    => void;
  deleteTask: (id: string)    => void;

  // CRUD — Executions
  addExecution: (exec: TestExecution) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stories,    setStories]    = useState<UserStory[]>(() => load(KEYS.stories,    seedStories));
  const [testCases,  setTestCases]  = useState<TestCase[]>(() => load(KEYS.testCases,   seedTestCases));
  const [tasks,      setTasks]      = useState<Task[]>(() => load(KEYS.tasks,            seedTasks));
  const [executions, setExecutions] = useState<TestExecution[]>(() => load(KEYS.executions, []));

  useEffect(() => persist(KEYS.stories,    stories),    [stories]);
  useEffect(() => persist(KEYS.testCases,  testCases),  [testCases]);
  useEffect(() => persist(KEYS.tasks,      tasks),      [tasks]);
  useEffect(() => persist(KEYS.executions, executions), [executions]);

  // ── Selectors ────────────────────────────────────────────────────────────────
  const storiesForProject   = useCallback((pid: string) => stories.filter(s => s.projectId === pid),    [stories]);
  const testCasesForProject = useCallback((pid: string) => testCases.filter(tc => tc.projectId === pid), [testCases]);
  const tasksForProject     = useCallback((pid: string) => tasks.filter(t => t.projectId === pid),       [tasks]);
  const testCasesForStory   = useCallback((sid: string) => testCases.filter(tc => tc.storyId === sid),   [testCases]);

  // ── Story CRUD ───────────────────────────────────────────────────────────────
  const addStory    = useCallback((s: UserStory)  => setStories(prev => [...prev, s]),                                     []);
  const updateStory = useCallback((s: UserStory)  => setStories(prev => prev.map(x => x.id === s.id ? s : x)),            []);
  const deleteStory = useCallback((id: string)    => setStories(prev => prev.filter(x => x.id !== id)),                   []);

  // ── Test Case CRUD ────────────────────────────────────────────────────────────
  const addTestCases  = useCallback((cases: TestCase[]) => setTestCases(prev => {
    const map = new Map(prev.map(tc => [tc.id, tc]));
    cases.forEach(tc => map.set(tc.id, tc));
    return Array.from(map.values());
  }), []);
  const updateTestCase = useCallback((tc: TestCase) => setTestCases(prev => prev.map(x => x.id === tc.id ? tc : x)), []);
  const deleteTestCase = useCallback((id: string)   => setTestCases(prev => prev.filter(x => x.id !== id)),          []);

  // ── Task CRUD ─────────────────────────────────────────────────────────────────
  const addTask    = useCallback((t: Task)   => setTasks(prev => [...prev, t]),                              []);
  const updateTask = useCallback((t: Task)   => setTasks(prev => prev.map(x => x.id === t.id ? t : x)),    []);
  const deleteTask = useCallback((id: string) => setTasks(prev => prev.filter(x => x.id !== id)),           []);

  // ── Execution CRUD ────────────────────────────────────────────────────────────
  const addExecution = useCallback((e: TestExecution) => setExecutions(prev => [...prev, e]), []);

  return (
    <DataContext.Provider value={{
      stories, testCases, tasks, executions,
      storiesForProject, testCasesForProject, tasksForProject, testCasesForStory,
      addStory, updateStory, deleteStory,
      addTestCases, updateTestCase, deleteTestCase,
      addTask, updateTask, deleteTask,
      addExecution,
    }}>
      {children}
    </DataContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
};
