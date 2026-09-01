import React from 'react';
import { HelpCircle, BookOpen, Layers, Terminal, Sparkles, ShieldCheck, Code, Check } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Section } from '../../../components/layout/Section';
import { Badge } from '../../../components/ui/Badge';
import { Alert } from '../../../components/feedback/Alert';

export const HelpPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <PageHeader
        title="Developer Guide & Architecture"
        description="Core architecture overview, module boundaries, design system conventions, and team development guidelines."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Help & Docs' }]}
        badge={<span className="badge badge-primary">Team Boilerplate v0.1</span>}
      />

      <Section title="1. Isolated Module Architecture" subtitle="How team members build independently without merge conflicts">
        <Card>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Every Verix feature belongs to its own dedicated module folder under <code>src/modules/&lt;feature-name&gt;/</code>.
          </p>
          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              lineHeight: 1.6,
              color: 'var(--text-primary)'
            }}
          >
            src/modules/your-module/<br />
            ├── components/ &nbsp;&nbsp;# Module-specific UI elements<br />
            ├── pages/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Full route page views<br />
            ├── hooks/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Custom hooks and state<br />
            ├── services/ &nbsp;&nbsp;# API & AI prompt calls<br />
            ├── types/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Module domain interfaces<br />
            └── index.ts &nbsp;&nbsp;&nbsp;# Clean external export
          </div>
        </Card>
      </Section>

      <Section title="2. Shared UI Component Library" subtitle="Reuse existing components instead of duplicating styles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Card title="Design System UI">
            <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><code>Button</code> (primary, secondary, ghost, danger, ai)</li>
              <li><code>Input</code>, <code>Textarea</code>, <code>Select</code>, <code>MultiSelect</code></li>
              <li><code>Table</code> (with sort & pagination)</li>
              <li><code>Modal</code>, <code>Drawer</code>, <code>ConfirmDialog</code></li>
              <li><code>Badge</code>, <code>StatusIndicator</code>, <code>ProgressBar</code></li>
            </ul>
          </Card>

          <Card title="AI Intelligence UI">
            <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><code>AIActionButton</code> (Gradient glow with loader)</li>
              <li><code>AIGeneratedBadge</code> (Confidence indicator)</li>
              <li><code>AILoadingState</code> (Pulsating sparkle)</li>
              <li><code>AIResultContainer</code> (Structured preview)</li>
              <li><code>AIApproveReject</code> (One-click decision controls)</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section title="3. Quick Commands & Keybindings">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Open Command Palette</span>
            <div><kbd>⌘</kbd> <kbd>K</kbd> / <kbd>Ctrl</kbd> <kbd>K</kbd></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Toggle Color Theme</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Top Navbar Sun / Moon Icon</span>
          </div>
        </Card>
      </Section>
    </div>
  );
};
