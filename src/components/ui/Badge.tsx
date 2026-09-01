import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'passed' | 'success' | 'failed' | 'error' | 'warning' | 'info' | 'ai';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  icon,
  className = '',
  onClick,
}) => {
  const variantClass = variant === 'ai' ? 'badge-ai' : `badge-${variant}`;

  return (
    <span
      className={`badge ${variantClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
