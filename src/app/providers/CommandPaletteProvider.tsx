import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Layers, 
  ShieldCheck, 
  FileCode2, 
  Wand2, 
  Cpu, 
  CheckSquare, 
  FolderGit2, 
  Settings, 
  PlusCircle, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { useToast } from './ToastProvider';

interface CommandPaletteContextType {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export const CommandPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const openPalette = () => setIsOpen(true);
  const closePalette = () => {
    setIsOpen(false);
    setSearchQuery('');
  };
  const togglePalette = () => setIsOpen((prev) => !prev);

  // Global Keyboard listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      } else if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const quickLinks = [
    { label: 'Go to QA Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Go to User Stories', path: '/user-stories', icon: Layers, category: 'Navigation' },
    { label: 'Go to Coverage Bridge', path: '/coverage', icon: ShieldCheck, category: 'Navigation' },
    { label: 'Go to Test Cases', path: '/test-cases', icon: FileCode2, category: 'Navigation' },
    { label: 'Go to Test Step AI', path: '/test-steps', icon: Wand2, category: 'Navigation' },
    { label: 'Go to Automation & Healing', path: '/automation', icon: Cpu, category: 'Navigation' },
    { label: 'Go to QA Tasks', path: '/tasks', icon: CheckSquare, category: 'Navigation' },
    { label: 'Go to Test Repository', path: '/repository', icon: FolderGit2, category: 'Navigation' },
    { label: 'Go to Settings', path: '/settings', icon: Settings, category: 'Navigation' },
  ];

  const quickActions = [
    { 
      label: 'AI: Generate Test Cases for Story', 
      icon: Sparkles, 
      category: 'AI Action',
      action: () => {
        navigate('/test-cases');
        showToast('AI Generator Action', 'Selected AI Test Case Generation module', 'info');
      }
    },
    { 
      label: 'Create New User Story', 
      icon: PlusCircle, 
      category: 'Story',
      action: () => {
        navigate('/user-stories');
        showToast('New Story Action', 'Opening User Stories workspace', 'info');
      }
    },
    { 
      label: 'Trigger Smoke Suite Gate', 
      icon: Cpu, 
      category: 'Automation',
      action: () => {
        navigate('/automation');
        showToast('Automation Triggered', 'Smoke validation pipeline dispatched', 'success');
      }
    },
  ];

  const filteredLinks = quickLinks.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActions = quickActions.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLink = (path: string) => {
    navigate(path);
    closePalette();
  };

  const handleSelectAction = (action: () => void) => {
    action();
    closePalette();
  };

  return (
    <CommandPaletteContext.Provider value={{ isOpen, openPalette, closePalette, togglePalette }}>
      {children}
      {isOpen && (
        <div className="modal-overlay" onClick={closePalette} style={{ zIndex: 'var(--z-command-palette)' }}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '620px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command Palette"
            aria-modal="true"
          >
            {/* Search Input Bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.875rem 1.25rem', 
              borderBottom: '1px solid var(--border-subtle)',
              gap: '0.75rem'
            }}>
              <Search size={20} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a command or search modules..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-primary)'
                }}
              />
              <kbd>ESC</kbd>
              <button onClick={closePalette} className="btn-icon" aria-label="Close command palette">
                <X size={16} />
              </button>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
              {filteredActions.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ 
                    padding: '0.35rem 0.75rem', 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 600, 
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Quick Actions & AI
                  </div>
                  {filteredActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectAction(action.action)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.625rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'background var(--transition-fast)',
                          gap: '0.75rem'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--ai-bg-subtle)',
                            color: 'var(--ai-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Icon size={16} />
                          </div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {action.label}
                          </span>
                        </div>
                        <span className="badge badge-primary" style={{ fontSize: '11px' }}>Action</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div>
                <div style={{ 
                  padding: '0.35rem 0.75rem', 
                  fontSize: 'var(--text-xs)', 
                  fontWeight: 600, 
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Modules & Navigation
                </div>
                {filteredLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectLink(link.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        gap: '0.75rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface-hover)',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={16} />
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {link.label}
                        </span>
                      </div>
                      <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  );
                })}
              </div>

              {filteredActions.length === 0 && filteredLinks.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  No matching commands or modules found.
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 1.25rem',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)'
            }}>
              <span>Tip: Press <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>↵</kbd> to select</span>
              <span>Verix v0.1</span>
            </div>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  );
};

export const useCommandPalette = (): CommandPaletteContextType => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
  }
  return context;
};
