import React from 'react';
import { Sparkles } from 'lucide-react';

export interface AILoadingStateProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AILoadingState: React.FC<AILoadingStateProps> = ({
  title = 'AI Copilot is reasoning...',
  subtitle = 'Analyzing acceptance criteria and synthesizing edge cases',
  className = '',
}) => {
  return (
    <div className={`ai-loading-state ${className}`}>
      <div className="ai-sparkle-glow">
        <Sparkles size={24} />
      </div>
      <div>
        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {title}
        </h4>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <span className="badge badge-default" style={{ fontSize: '11px' }}>Context Window: Active</span>
        <span className="badge badge-primary" style={{ fontSize: '11px' }}>Reasoning Model: v2.4</span>
      </div>
    </div>
  );
};
