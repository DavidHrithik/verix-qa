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
      <div>{children}</div>
    </div>
  );
};
