import React from 'react';

export type StatusType = 'passed' | 'failed' | 'warning' | 'info' | 'neutral' | 'active' | 'flaky' | 'healed';

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showDot = true,
}) => {
  const getDotClass = () => {
    switch (status) {
      case 'passed':
      case 'active':
      case 'healed':
        return 'status-dot-passed';
      case 'failed':
        return 'status-dot-failed';
      case 'warning':
      case 'flaky':
        return 'status-dot-warning';
      case 'info':
        return 'status-dot-info';
      case 'neutral':
      default:
        return 'status-dot-neutral';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'passed':
      case 'active':
      case 'healed':
        return 'var(--status-passed-text)';
      case 'failed':
        return 'var(--status-failed-text)';
      case 'warning':
      case 'flaky':
        return 'var(--status-warning-text)';
      case 'info':
        return 'var(--status-info-text)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: 'var(--text-xs)', fontWeight: 500 }}>
      {showDot && <span className={`status-dot ${getDotClass()}`} />}
      {label && <span style={{ color: getTextColor() }}>{label}</span>}
    </div>
  );
};
