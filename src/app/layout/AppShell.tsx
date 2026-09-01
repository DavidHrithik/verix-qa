import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <TopNavbar onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem',
            maxWidth: 'var(--content-max-width)',
            width: '100%',
            margin: '0 auto'
          }}
        >
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer
          style={{
            padding: '1rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Verix Base Framework • Hackathon Build</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="status-dot status-dot-passed" /> System Status: Normal
            </span>
          </div>
          <div>
            <span>Press <kbd>⌘</kbd><kbd>K</kbd> for Command Palette</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
