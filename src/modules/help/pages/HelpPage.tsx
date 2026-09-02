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

      <Section title="4. Technical Architecture — End-to-End AI QA Flow" subtitle="How Verix connects Jira stories to executed, AI-healed automation scripts">
        <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Verix is a <strong>full-stack AI QA platform</strong> that creates an unbroken chain from a product requirement to a passing, auditable automated test. In the production architecture, each step below is powered by a real service. In the current prototype, all AI steps are simulated with high-fidelity mock responses.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Step 1 */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>1</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>User Story (Jira)</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>Product Owner writes Acceptance Criteria in Jira. Verix ingests via REST API.</p>
                  <div style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Example: "DBANK-104: User can export member data with toggle"
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--ai-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--ai-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>2</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>AI AC → Test Case Synthesis</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>Gemini API reads ACs and generates Positive, Negative, Boundary, Edge & OWASP test cases.</p>
                  <div style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    TC-201 (Happy Path) | TC-202 (403 Forbidden) | TC-203 (Volume) | TC-204 (PII Masking)
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--accent-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>3</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>BDD Script Generation</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>Verix auto-generates Gherkin .feature files + Playwright Page Object Model classes.</p>
                  <div style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    CLOUD204_Data_Export_Policy.feature + MemberPermissionsPage.java
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--warning-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--warning-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>4</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>Playwright CI Executor</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>Scripts run in Azure DevOps pipeline. Live step telemetry streams back to Verix via WebSocket.</p>
                  <div style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Chromium 127 | Headless | Viewport 1280x720 | Timeout 30s
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--success-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--success-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>5</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>AI Self-Healing Engine</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>On locator failure, Gemini Vision scans DOM diff and proposes healed selectors with confidence scoring.</p>
                  <div style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Broken: #toggle-export-data → Healed: [data-testid="member-export-toggle"] (98% confidence)
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>6</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>ExtentReport PDF Export</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>Full audit-quality BDD report with step screenshots, pass/fail status, and AI healing log.</p>
                  <div style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    DBANK_104_AI_Healing_Audit.pdf (embedded evidence for compliance)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card title="Tech Stack & Integrations">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {['React + TypeScript', 'Vite', 'Google Gemini API', 'Playwright', 'Azure DevOps', 'Azure Static Web Apps', 'Jira REST API', 'Azure Cosmos DB', 'BDD / Gherkin', 'ExtentReports 5.1'].map((tech) => (
              <span key={tech} style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', backgroundColor: 'var(--bg-app)', fontSize: '11px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                {tech}
              </span>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
};
