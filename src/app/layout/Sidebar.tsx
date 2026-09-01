import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  ShieldCheck,
  FileCode2,
  Wand2,
  Cpu,
  CheckSquare,
  FolderGit2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProject } from '../../app/providers/ProjectProvider';
import { mockStories, mockTestCases, mockTasks } from '../../mock';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { projects, activeProject } = useProject();

  const activeStoriesCount = mockStories.filter(s => s.projectId === activeProject.id).length;
  const activeTestCasesCount = mockTestCases.filter(t => t.projectId === activeProject.id).length;
  const activeTasksCount = mockTasks.filter(t => t.projectId === activeProject.id).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban, badge: String(projects.length) },
    { label: 'User Stories', path: '/user-stories', icon: Layers, badge: String(activeStoriesCount) },
    { label: 'Coverage Bridge', path: '/coverage', icon: ShieldCheck },
    { label: 'Test Cases', path: '/test-cases', icon: FileCode2, badge: String(activeTestCasesCount) },
    { label: 'Test Step AI', path: '/test-steps', icon: Wand2, isAi: true },
    { label: 'Automation', path: '/automation', icon: Cpu, badge: 'Active' },
    { label: 'Task Tracker', path: '/tasks', icon: CheckSquare, badge: String(activeTasksCount) },
    { label: 'Test Repository', path: '/repository', icon: FolderGit2 },
  ];

  const bottomItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help & Docs', path: '/help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 'var(--z-drawer)',
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: isMobileOpen ? 'calc(var(--z-drawer) + 1)' : 'var(--z-sticky)',
          transition: 'width var(--transition-normal)',
          flexShrink: 0,
          color: 'var(--text-sidebar)',
          userSelect: 'none'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0' : '0 1.25rem',
            borderBottom: '1px solid var(--border-sidebar)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            {/* Verix Logo Mark */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(140deg, #6366F1 0%, #0EA5E9 60%, #38BDF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 4px 16px rgba(99,102,241,0.45)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Shine overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
                borderRadius: '10px 10px 0 0'
              }} />
              <span style={{
                fontFamily: '\'Inter\', sans-serif',
                fontWeight: 800,
                fontSize: '17px',
                color: '#FFFFFF',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                position: 'relative',
                zIndex: 1
              }}>V</span>
            </div>

            {!isCollapsed && (
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #BAE6FD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <span>Verix</span>
                  <span style={{
                    fontSize: '9px',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.25)',
                    color: '#A5B4FC',
                    fontWeight: 700,
                    border: '1px solid rgba(99,102,241,0.35)',
                    WebkitTextFillColor: '#A5B4FC',
                    letterSpacing: '0.04em'
                  }}>
                    BETA
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', letterSpacing: '0.01em', marginTop: '1px' }}>AI Testing Workspace</div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="btn-icon"
              style={{ color: 'var(--text-sidebar)', padding: '4px' }}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
        >
          {isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <button
                onClick={onToggleCollapse}
                className="btn-icon"
                style={{ color: 'var(--text-sidebar)', padding: '6px' }}
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#64748B',
              padding: '0.5rem 0.5rem 0.25rem 0.5rem'
            }}>
              Workspace
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: isCollapsed ? '0.625rem 0' : '0.625rem 0.75rem',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#FFFFFF' : 'var(--text-sidebar)',
                  backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--transition-fast)',
                  position: 'relative'
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      style={{
                        color: isActive ? '#38BDF8' : item.isAi ? '#A78BFA' : 'inherit',
                        flexShrink: 0
                      }}
                    />
                    {!isCollapsed && (
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.isAi && (
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '1px 5px', 
                        borderRadius: '4px', 
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))', 
                        color: '#C084FC',
                        fontWeight: 600,
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      }}>
                        AI
                      </span>
                    )}
                    {!isCollapsed && item.badge && !item.isAi && (
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '1px 6px', 
                        borderRadius: 'var(--radius-full)', 
                        background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)', 
                        color: isActive ? '#38BDF8' : '#94A3B8',
                        fontWeight: 600
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div
          style={{
            padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 0.75rem',
            borderTop: '1px solid var(--border-sidebar)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
        >
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: isCollapsed ? '0.5rem 0' : '0.5rem 0.75rem',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#FFFFFF' : 'var(--text-sidebar)',
                  backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon size={16} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};
