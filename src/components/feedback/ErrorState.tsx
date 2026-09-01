import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching or processing module data.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--status-failed-bg)',
        border: '1px solid var(--status-failed-border)',
        borderRadius: 'var(--radius-lg)',
        gap: '0.75rem'
      }}
    >
      <div style={{ color: 'var(--status-failed)', marginBottom: '0.25rem' }}>
        <AlertOctagon size={36} />
      </div>
      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--status-failed-text)' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: '420px' }}>
        {message}
      </p>
      {onRetry && (
        <div style={{ marginTop: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RotateCcw size={14} />}>
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
};
