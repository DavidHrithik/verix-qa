import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 32 : 24;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        gap: '0.75rem',
        color: 'var(--text-secondary)'
      }}
    >
      <Loader2 size={iconSize} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{label}</span>
    </div>
  );
};
