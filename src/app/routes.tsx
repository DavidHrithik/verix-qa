import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { DashboardPage } from '../modules/dashboard';
import { ProjectsPage } from '../modules/projects';
import { UserStoriesPage } from '../modules/user-stories';
import { TestCasesPage } from '../modules/test-cases';
import { AutomationPage } from '../modules/automation';
import { TaskTrackerPage } from '../modules/task-tracker';
import { SettingsPage } from '../modules/settings';
import { HelpPage } from '../modules/help';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/user-stories" element={<UserStoriesPage />} />
        <Route path="/test-cases" element={<TestCasesPage />} />
        <Route path="/automation" element={<AutomationPage />} />
        <Route path="/tasks" element={<TaskTrackerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        
        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.5rem' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                The requested module route does not exist.
              </p>
              <a href="/dashboard" className="btn btn-primary">
                Return to QA Dashboard
              </a>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};
