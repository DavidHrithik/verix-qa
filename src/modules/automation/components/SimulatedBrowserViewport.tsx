import React from 'react';
import {
  Globe,
  Lock,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Send,
  Smartphone,
  Hospital,
  UserCheck,
  Download,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { SimulationStep } from '../types';

interface SimulatedBrowserViewportProps {
  currentStepIndex: number;
  steps: SimulationStep[];
  runStatus: 'idle' | 'running' | 'passed' | 'failed' | 'healed';
  isHealed: boolean;
  scriptName: string;
}

export const SimulatedBrowserViewport: React.FC<SimulatedBrowserViewportProps> = ({
  currentStepIndex,
  steps,
  runStatus,
  isHealed,
  scriptName,
}) => {
  const isMemberPolicyCloud204 = scriptName.includes('CLOUD') || scriptName.includes('204') || scriptName.includes('Policy') || scriptName.includes('Export') || scriptName.includes('Admin');
  const isWireTransfer = scriptName.includes('wire') || scriptName.includes('mfa') || scriptName.includes('DBANK104');
  const activeStep = steps[currentStepIndex];
  const isStepFailed = activeStep && activeStep.status === 'failed';

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '400px',
      }}
    >
      {/* Browser Chrome Header */}
      <div
        style={{
          backgroundColor: '#0F172A',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>

        {/* URL Bar */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#1E293B',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94A3B8',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Lock size={12} style={{ color: '#10B981' }} />
          <span style={{ color: '#E2E8F0' }}>
            {isMemberPolicyCloud204 ? 'https://admin.cloud.enterprise.internal' : 'https://qa-sandbox.dbank.verix.io'}
          </span>
          <span style={{ color: '#64748B' }}>
            {isMemberPolicyCloud204 ? '/member-policies/data-export' : '/transfers/wire'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '11px' }}>
          <span className="badge badge-default" style={{ fontSize: '10px', padding: '1px 5px' }}>
            Chrome • 1280x720
          </span>
        </div>
      </div>

      {/* Browser Viewport Content */}
      <div
        style={{
          flex: 1,
          padding: '1.25rem',
          backgroundColor: 'var(--bg-app)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isMemberPolicyCloud204 ? (
          /* Cloud Admin Console: Member Policy View (CLOUD-204) */
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    Cloud Admin Console: Policy Utility
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Role: CloudAdmin • User: adminUser</div>
                </div>
              </div>
              <span className="badge badge-passed">Cloud Connected</span>
            </div>

            {/* Member Selector Dropdown Preview */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                Selected Team Member
              </label>
              <div
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentStepIndex >= 1 ? 'var(--bg-surface-hover)' : 'var(--bg-app)',
                  border: currentStepIndex === 1 ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <UserCheck size={14} style={{ color: 'var(--status-passed)' }} />
                <span>Sarah Jenkins (Data Analyst - Finance)</span>
              </div>
            </div>

            {/* Permission Toggles List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: 'var(--text-xs)' }}>
              {/* Target Toggle Switch (Step 3 Target) */}
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isStepFailed
                    ? 'var(--status-failed-bg)'
                    : isHealed
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'var(--bg-surface-hover)',
                  border: isStepFailed
                    ? '2px dashed var(--status-failed)'
                    : isHealed
                    ? '2px solid var(--status-passed)'
                    : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Enable member to export data to local storage
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Policy Toggle: CLOUD-204 • Data Export Governance
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: isStepFailed ? 'var(--status-failed)' : isHealed ? 'var(--status-passed)' : '#38BDF8',
                    fontWeight: 700,
                  }}
                >
                  <span>{currentStepIndex >= 3 ? 'OFF' : 'ON'}</span>
                  {currentStepIndex >= 3 ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
                </div>

                {/* Failed locator tag */}
                {isStepFailed && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-9px',
                      right: '10px',
                      backgroundColor: 'var(--status-failed)',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}
                  >
                    ❌ SELECTOR NOT FOUND: By.id("toggle-export-data")
                  </div>
                )}

                {/* Healed locator tag */}
                {isHealed && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-9px',
                      right: '10px',
                      backgroundColor: 'var(--status-passed)',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}
                  >
                    ✅ REPAIRED: [data-testid="member-export-toggle"]
                  </div>
                )}
              </div>

              {/* Other normal toggles */}
              <div
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Enable cloud backup synchronization</span>
                <span style={{ color: 'var(--status-passed)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ON <ToggleRight size={20} />
                </span>
              </div>

              <div
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Enable audit logging for sensitive assets</span>
                <span style={{ color: 'var(--status-passed)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ON <ToggleRight size={20} />
                </span>
              </div>
            </div>
          </div>
        ) : isWireTransfer ? (
          /* Wire Transfer Simulated Web App View */
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                International Wire Transfer
              </div>
              <span className="badge badge-passed">Verified Tier-3</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-xs)' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Transfer Amount (USD)
                </label>
                <div style={{ padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-hover)', fontWeight: 600 }}>
                  $5,000.00 USD
                </div>
              </div>

              {/* MFA Modal Overlay */}
              {currentStepIndex >= 1 && (
                <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                    <Smartphone size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>MFA Biometric & OTP Challenge</span>
                  </div>
                  <button
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: 'var(--text-xs)',
                      backgroundColor: isStepFailed ? 'var(--status-failed-bg)' : isHealed ? 'var(--status-passed-bg)' : 'var(--accent-primary)',
                      color: isStepFailed ? 'var(--status-failed)' : isHealed ? 'var(--status-passed)' : '#FFFFFF',
                      border: isStepFailed ? '2px dashed var(--status-failed)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    Verify & Confirm Transfer
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Cards View */
          <div style={{ width: '100%', maxWidth: '460px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
              <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Virtual Cards Manager</span>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: 'var(--text-xs)' }}>
              Virtual Card VISA-4091: Status {isHealed ? 'LOCKED (FROZEN)' : 'ACTIVE'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
