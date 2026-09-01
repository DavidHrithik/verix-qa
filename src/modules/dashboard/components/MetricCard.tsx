import React from 'react';
import { Card } from '../../../components/layout/Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  subtitle,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'var(--status-passed)';
      case 'negative':
        return 'var(--status-failed)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <Card isHoverable style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-hover)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {change && (
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: getChangeColor() }}>
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {subtitle}
        </div>
      )}
    </Card>
  );
};
