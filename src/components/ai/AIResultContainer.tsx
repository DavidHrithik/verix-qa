import React from 'react';
import { Sparkles } from 'lucide-react';
import { AIConfidenceIndicator } from './AIConfidenceIndicator';

export interface AIResultContainerProps {
  title?: string;
  confidence?: number;
  badgeText?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AIResultContainer: React.FC<AIResultContainerProps> = ({
  title = 'AI Generated Insight',
  confidence,
  badgeText = 'Copilot Output',
  headerActions,
  children,
  className = '',
}) => {
  return (
    <div className={`ai-result-container ${className}`}>
      <div className="ai-result-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="ai-result-title">
            <Sparkles size={16} />
            <span>{title}</span>
          </div>
          {badgeText && <span className="badge-ai">{badgeText}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {confidence !== undefined && <AIConfidenceIndicator score={confidence} />}
          {headerActions}
        </div>
      </div>
      <div style={{ position: 'relative', paddingBottom: '16px' }}>
        {children}
        {/* AI Watermark Footer */}
        <div 
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            fontSize: '10px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: 0.7,
            userSelect: 'none',
            pointerEvents: 'none',
            fontWeight: 500,
          }}
        >
          <Sparkles size={11} style={{ color: 'var(--ai-primary)' }} />
          Powered by Azure AI Foundry
        </div>
      </div>
    </div>
  );
};
