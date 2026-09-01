import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isSearch?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  startIcon,
  endIcon,
  isSearch = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {isSearch && !startIcon && (
          <Search size={16} className="search-icon" style={{ left: '0.75rem', position: 'absolute', color: 'var(--text-muted)' }} />
        )}
        {startIcon && (
          <div style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)', display: 'flex' }}>
            {startIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`input-text ${error ? 'input-error' : ''} ${className}`}
          style={{
            paddingLeft: isSearch || startIcon ? '2.25rem' : undefined,
            paddingRight: endIcon ? '2.25rem' : undefined,
            borderColor: error ? 'var(--status-failed)' : undefined
          }}
          {...props}
        />
        {endIcon && (
          <div style={{ position: 'absolute', right: '0.75rem', color: 'var(--text-muted)', display: 'flex' }}>
            {endIcon}
          </div>
        )}
      </div>
      {error ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-failed)' }}>{error}</span>
      ) : hint ? (
        <span className="form-hint">{hint}</span>
      ) : null}
    </div>
  );
};
