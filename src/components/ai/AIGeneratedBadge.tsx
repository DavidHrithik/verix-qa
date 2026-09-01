import React from 'react';
import { Sparkles } from 'lucide-react';

export interface AIGeneratedBadgeProps {
  label?: string;
  confidence?: number;
  className?: string;
}

export const AIGeneratedBadge: React.FC<AIGeneratedBadgeProps> = ({
  label = 'AI Generated',
  confidence,
  className = '',
}) => {
  return (
    <span className={`badge-ai ${className}`}>
      <Sparkles size={12} />
      <span>{label}</span>
      {confidence !== undefined && (
        <span style={{ opacity: 0.85, fontWeight: 700 }}>({confidence}%)</span>
      )}
    </span>
  );
};
