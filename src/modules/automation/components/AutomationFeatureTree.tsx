import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AutomationScriptExtended } from '../types';

interface AutomationFeatureTreeProps {
  scripts: AutomationScriptExtended[];
  activeScriptId: string;
  onSelectScript: (script: AutomationScriptExtended) => void;
}

export const AutomationFeatureTree: React.FC<AutomationFeatureTreeProps> = ({
  scripts,
  activeScriptId,
  onSelectScript,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'prime-cloud-automation-ui': true,
    'src/test/resources/features': true,
    'Cloud Governance': true,
    'Admin & Permissions': true,
    'Payments & Transfers': true,
    'Cards & Limits': true,
  });

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  // Group scripts by folder category
  const categories: Record<string, AutomationScriptExtended[]> = {};
  scripts.forEach((script) => {
    const cat = script.folderCategory || 'Core Suites';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(script);
  });

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Tree Header */}
      <div
        style={{
          padding: '0.65rem 0.875rem',
          backgroundColor: 'var(--bg-surface-hover)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Layers size={14} style={{ color: 'var(--accent-primary)' }} />
        <span>Automation Project Hierarchy</span>
      </div>

      {/* Tree View */}
      <div
        style={{
          padding: '0.5rem',
          overflowY: 'auto',
          flex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {/* Root Project Item */}
        <div
          onClick={() => toggleFolder('prime-cloud-automation-ui')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontWeight: 600,
          }}
        >
          {expandedFolders['prime-cloud-automation-ui'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <FolderOpen size={14} style={{ color: '#38BDF8' }} />
          <span>prime-cloud-automation-ui</span>
        </div>

        {expandedFolders['prime-cloud-automation-ui'] && (
          <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Features folder */}
            <div
              onClick={() => toggleFolder('src/test/resources/features')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              {expandedFolders['src/test/resources/features'] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <Folder size={14} style={{ color: '#FBBF24' }} />
              <span>features/</span>
            </div>

            {expandedFolders['src/test/resources/features'] && (
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {Object.entries(categories).map(([category, catScripts]) => {
                  const isCatOpen = expandedFolders[category] !== false;
                  return (
                    <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div
                        onClick={() => toggleFolder(category)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {isCatOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        <Folder size={13} style={{ color: '#94A3B8' }} />
                        <span>{category}</span>
                      </div>

                      {isCatOpen && (
                        <div style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          {catScripts.map((script) => {
                            const isSelected = script.id === activeScriptId;
                            const isFailed = script.lastRunStatus === 'Failed';
                            const isHealed = script.status === 'Healed' || (script.selfHealingLogs && script.selfHealingLogs.length > 0);

                            return (
                              <div
                                key={script.id}
                                onClick={() => onSelectScript(script)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: 'pointer',
                                  backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                                  fontWeight: isSelected ? 600 : 400,
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                                  <FileCode size={13} style={{ color: isSelected ? 'var(--accent-primary)' : '#38BDF8', flexShrink: 0 }} />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {script.name}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                  {isHealed && <Sparkles size={11} style={{ color: 'var(--ai-primary)' }} />}
                                  {isFailed && <AlertTriangle size={11} style={{ color: 'var(--status-failed)' }} />}
                                  {!isFailed && !isHealed && <CheckCircle2 size={11} style={{ color: 'var(--status-passed)' }} />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
