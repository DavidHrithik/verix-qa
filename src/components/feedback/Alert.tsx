import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--status-passed)', flexShrink: 0 }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: 'var(--status-failed)', flexShrink: 0 }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: 'var(--status-warning)', flexShrink: 0 }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: 'var(--status-info)', flexShrink: 0 }} />;
    }
  };

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      {getIcon()}
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.2rem' }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="btn-icon"
          style={{ padding: '2px', alignSelf: 'flex-start' }}
          aria-label="Dismiss alert"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
