import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  Menu,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  User as UserIcon,
  LogOut,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useProject } from '../providers/ProjectProvider';
import { useCommandPalette } from '../providers/CommandPaletteProvider';
import { useToast } from '../providers/ToastProvider';
import { currentUser } from '../../mock';
import { isAiEnabled } from '../../services/ai';

interface TopNavbarProps {
  onOpenMobileMenu: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { projects, activeProject, setActiveProjectId } = useProject();
  const { openPalette } = useCommandPalette();
  const { showToast } = useToast();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(e.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentUserData = currentUser;
  const aiLive = isAiEnabled();

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        gap: '1rem'
      }}
    >
      {/* Left Area: Mobile toggle + Project Selector + Active Sprint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn-icon"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Project Selector Dropdown */}
        <div style={{ position: 'relative' }} ref={projectDropdownRef}>
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.4rem 0.75rem',
              backgroundColor: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            aria-haspopup="true"
            aria-expanded={isProjectDropdownOpen}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700
              }}
            >
              {activeProject.key.substring(0, 2)}
            </div>
            <span>{activeProject.name}</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {isProjectDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '260px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 'var(--z-dropdown)',
                padding: '0.5rem'
              }}
            >
              <div style={{ padding: '0.25rem 0.5rem 0.5rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                SELECT QA PROJECT
              </div>
              {projects.map((proj) => {
                const isSelected = proj.id === activeProject.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      setIsProjectDropdownOpen(false);
                      showToast('Project Switched', `Active context changed to ${proj.name}`, 'info');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.625rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                      marginBottom: '2px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{proj.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{proj.key} • {proj.totalTestCases} Tests</div>
                    </div>
                    {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sprint Tag */}
        {activeProject.activeSprint && (
          <span className="badge badge-default" style={{ display: 'none' }} id="sprint-tag">
            {activeProject.activeSprint}
          </span>
        )}
      </div>

      {/* Middle Area: Global Search & Command Bar */}
      <div style={{ flex: 1, maxWidth: '440px' }}>
        <button
          onClick={openPalette}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 0.875rem',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={15} />
            <span>Search tests, stories, tasks...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        </button>
      </div>

      {/* Right Area: AI Status + Theme Switch + Notifications + User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* AI Status Pill */}
        <div
          title={aiLive ? 'Gemini AI is active — generating real test cases' : 'No API key set — using local template engine'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.625rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: aiLive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(251, 191, 36, 0.12)',
            border: `1px solid ${aiLive ? 'rgba(34, 197, 94, 0.35)' : 'rgba(251, 191, 36, 0.35)'}`,
            fontSize: '11px',
            fontWeight: 700,
            color: aiLive ? '#22C55E' : '#F59E0B',
            letterSpacing: '0.02em',
            cursor: 'default',
            userSelect: 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: aiLive ? '#22C55E' : '#F59E0B',
            boxShadow: aiLive ? '0 0 6px #22C55E' : '0 0 6px #F59E0B',
            animation: aiLive ? 'pulse 2s infinite' : 'none',
          }} />
          {aiLive ? 'AI Live' : 'Local Mode'}
        </div>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
        >
          {theme === 'dark' ? (
            <Sun size={18} style={{ color: '#FBBF24' }} />
          ) : (
            <Moon size={18} style={{ color: '#64748B' }} />
          )}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="btn-icon"
            style={{ position: 'relative', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-primary)'
              }}
            />
          </button>

          {isNotificationOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 'var(--z-dropdown)',
                padding: '0.75rem',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  Recent QA Activity
                </span>
                <span className="badge badge-primary" style={{ fontSize: '10px' }}>4 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  padding: '1.5rem 0.5rem',
                  textAlign: 'center',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                }}>
                  No recent activity yet. Generate test cases or create a story to get started.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid transparent',
              cursor: 'pointer'
            }}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-primary-light)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              AM
            </div>
            <div style={{ textAlign: 'left', display: 'none' }} id="user-info-text">
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{currentUser.role}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {isProfileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '220px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 'var(--z-dropdown)',
                padding: '0.5rem'
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {currentUser.email}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setIsProfileOpen(false);
                  showToast('Profile Settings', 'Opening user profile settings', 'info');
                }}
              >
                <Sliders size={14} />
                <span>Preferences</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--status-failed)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setIsProfileOpen(false);
                  showToast('Session', 'Signed in as Mock Dev Alex Morgan', 'info');
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
