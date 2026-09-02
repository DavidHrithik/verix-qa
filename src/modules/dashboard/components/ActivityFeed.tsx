import React from 'react';
import { Card } from '../../../components/layout/Card';
import { Activity } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
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
      <div style={{
        padding: '2rem 1rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-xs)',
        lineHeight: 1.6,
      }}>
        <Activity size={28} style={{ marginBottom: '0.75rem', opacity: 0.35 }} />
        <div>No activity yet.</div>
        <div>Generate test cases, run automation, or create a user story to see events here.</div>
      </div>
    </Card>
  );
};
