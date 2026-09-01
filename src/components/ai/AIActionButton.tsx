import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { ButtonSize } from '../ui/Button';

export interface AIActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  isLoading?: boolean;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

export const AIActionButton: React.FC<AIActionButtonProps> = ({
  label = 'AI Generate',
  isLoading = false,
  size = 'md',
  icon = <Sparkles size={16} />,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <button
      className={`btn btn-ai ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : icon}
      <span>{children || label}</span>
    </button>
  );
};
