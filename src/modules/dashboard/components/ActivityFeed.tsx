import React from 'react';
import { Card } from '../../../components/layout/Card';
import { Activity, Sparkles, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mockDashboardMetrics } from '../../../mock';

export const ActivityFeed: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ai_generation':
        return <Sparkles size={14} style={{ color: 'var(--ai-primary)' }} />;
      case 'self_healing':
        return <Cpu size={14} style={{ color: '#38BDF8' }} />;
      case 'coverage':
        return <ShieldCheck size={14} style={{ color: 'var(--accent-primary)' }} />;
      case 'execution':
      default:
        return <CheckCircle2 size={14} style={{ color: 'var(--status-passed)' }} />;
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Real-Time QA Intelligence Stream</span>
        </div>
      }
      subtitle="Audit log of AI actions, test runs, and test repository changes"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mockDashboardMetrics.recentActivity.map((act) => (
          <div
            key={act.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-hover)',
              fontSize: 'var(--text-xs)'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              {getIcon(act.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                {act.title}
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '3px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Initiated by <strong>{act.user}</strong></span>
                <span>{act.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
