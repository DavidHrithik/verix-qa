import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ai' | 'gradient';
  showLabel?: boolean;
  label?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  label,
  height = 8,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const getFillColor = () => {
    switch (variant) {
      case 'success':
        return 'var(--status-passed)';
      case 'warning':
        return 'var(--status-warning)';
      case 'danger':
        return 'var(--status-failed)';
      case 'ai':
        return 'linear-gradient(90deg, var(--ai-gradient-from), var(--ai-gradient-to))';
      case 'gradient':
        return 'linear-gradient(90deg, #38BDF8, #818CF8, #C084FC)';
      case 'primary':
      default:
        return 'var(--accent-primary)';
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span>{label || 'Progress'}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percentage}%</span>
        </div>
      )}
      <div className="progress-bar-track" style={{ height: `${height}px` }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            background: getFillColor()
          }}
        />
      </div>
    </div>
  );
};
