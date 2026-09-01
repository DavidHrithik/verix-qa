import React from 'react';
import { Card } from '../../../components/layout/Card';
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const CoverageBarChart: React.FC = () => {
  const coverageLayers = [
    { label: 'Development Smoke Tests', percentage: 100, count: '36 / 36 Passing', color: 'var(--status-passed)' },
    { label: 'QA Functional Coverage', percentage: 86, count: '171 / 198 Scenarios', color: 'var(--accent-primary)' },
    { label: 'AI Edge & Risk Scenarios', percentage: 72, count: '48 Identified Risks', color: 'var(--ai-primary)' },
    { label: 'Automated CI/CD Regression', percentage: 78, count: '155 Automated', color: '#0EA5E9' },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Multi-Layer Coverage Matrix</span>
        </div>
      }
      subtitle="Comprehensive coverage alignment across development, manual QA, and AI synthesized tests"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: 'var(--text-xs)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Aggregate Health Index: <strong>92 / 100</strong></span>
          <span className="badge badge-passed">Target Met</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginTop: '0.5rem' }}>
        {coverageLayers.map((layer, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{layer.label}</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {layer.count} (<strong style={{ color: layer.color }}>{layer.percentage}%</strong>)
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${layer.percentage}%`,
                  height: '100%',
                  backgroundColor: layer.color,
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.6s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
