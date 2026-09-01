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
  ShieldAlert,
  HardDrive,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { SimulationStep } from '../types';

interface SimulatedBrowserViewportProps {
  currentStepIndex: number;
  steps: SimulationStep[];
  runStatus: 'idle' | 'running' | 'passed' | 'failed' | 'healed';
  isHealed: boolean;
  scriptName: string;
  activeTestCaseKey?: string;
}

export const SimulatedBrowserViewport: React.FC<SimulatedBrowserViewportProps> = ({
  currentStepIndex,
  steps,
  runStatus,
  isHealed,
  scriptName,
  activeTestCaseKey = 'TC-201',
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
            {activeTestCaseKey === 'TC-202'
              ? '/member-portal/unauthorized-export'
              : activeTestCaseKey === 'TC-203'
              ? '/data-pipeline/heavy-stream'
              : activeTestCaseKey === 'TC-204'
              ? '/compliance/pii-masking-audit'
              : activeTestCaseKey === 'TC-205'
              ? '/session-monitor/rollback'
              : isMemberPolicyCloud204
              ? '/member-policies/data-export'
              : '/transfers/wire'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '11px' }}>
          <span className="badge badge-default" style={{ fontSize: '10px', padding: '1px 5px' }}>
            Chrome • {activeTestCaseKey}
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
          activeTestCaseKey === 'TC-202' ? (
            /* TC-202: 403 Forbidden Security Alert View */
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--status-failed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <ShieldAlert size={28} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--status-failed)', marginBottom: '4px' }}>
                403 Access Forbidden: Zero-Trust Policy
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                User <strong>"Devin Chen (Member)"</strong> lacks administrative export privileges. This action has been blocked and logged in the security ledger.
              </p>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-hover)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Assertion Verified: HTTP 403 Forbidden Gate Enforced
              </div>
            </div>
          ) : activeTestCaseKey === 'TC-203' ? (
            /* TC-203: 50MB Stream Boundary Check */
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <HardDrive size={20} style={{ color: 'var(--status-warning)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    High-Volume Telemetry Export Pipeline
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Payload: 75.4 MB (500,000 telemetry rows)</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Asynchronous Chunk Streaming</span>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>100% Streamed</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#1E293B', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', backgroundColor: '#10B981' }} />
                </div>
              </div>

              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--status-passed)', fontSize: '11px', textAlign: 'center', fontWeight: 600 }}>
                ✓ Threshold Verified: Chunked Stream Active (Zero Memory Leak)
              </div>
            </div>
          ) : activeTestCaseKey === 'TC-204' ? (
            /* TC-204: PII Masking Verification */
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <FileSpreadsheet size={20} style={{ color: '#C084FC' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    PII Data Masking Governance Audit
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Algorithm: SHA-256 Hex Hash Masking</div>
                </div>
              </div>

              <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem', fontSize: '11px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-surface-hover)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '4px 8px' }}>User</th>
                      <th style={{ padding: '4px 8px' }}>Masked SSN/PII Token</th>
                      <th style={{ padding: '4px 8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '4px 8px', fontWeight: 600 }}>Sarah J. 👩‍💻</td>
                      <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', color: '#34D399' }}>9f86d081884c7d6...</td>
                      <td style={{ padding: '4px 8px', color: '#10B981' }}>Masked ✓</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '4px 8px', fontWeight: 600 }}>Arun M. 👨‍⚕️</td>
                      <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', color: '#34D399' }}>5e884898da28047...</td>
                      <td style={{ padding: '4px 8px', color: '#10B981' }}>Masked ✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--status-passed)', fontWeight: 600, textAlign: 'center' }}>
                ✓ Zero Unmasked PII Exposed in Export Output
              </div>
            </div>
          ) : activeTestCaseKey === 'TC-205' ? (
            /* TC-205: Session Timeout Rollback Monitor */
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <RotateCcw size={20} style={{ color: '#38BDF8' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    Session Resilience & State Rollback
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Simulated Network Disconnect at 45% Stream</div>
                </div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                • WebSocket interrupt detected<br />
                • Temporary staging tables purged<br />
                • Session returned to clean idle state without orphaned locks
              </div>

              <div style={{ fontSize: '11px', color: 'var(--status-passed)', fontWeight: 600, textAlign: 'center' }}>
                ✓ System Resilience Verified (Zero State Corruption)
              </div>
            </div>
          ) : (
            /* Default: TC-201 Cloud Admin Console: Member Policy View */
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
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <AlertCircle size={10} />
                      Target locator `#toggle-export-data` Not Found
                    </div>
                  )}

                  {isHealed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-9px',
                        right: '10px',
                        backgroundColor: 'var(--status-passed)',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Sparkles size={10} />
                      AI Healed: `[data-testid="member-export-toggle"]`
                    </div>
                  )}
                </div>

                {/* Second Toggle */}
                <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Enable cloud backup synchronization</span>
                  <ToggleRight size={20} style={{ color: '#38BDF8' }} />
                </div>

                {/* Third Toggle */}
                <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Enable audit logging for sensitive assets</span>
                  <ToggleRight size={20} style={{ color: '#38BDF8' }} />
                </div>
              </div>
            </div>
          )
        ) : (
          /* Default: Wire Transfer View */
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
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
              <span className="badge badge-passed">Verified Sandbox</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-xs)' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Recipient IBAN</label>
                <div style={{ padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-hover)', fontFamily: 'var(--font-mono)' }}>
                  GB82 WEST 1234 5678 9012 34
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Amount (USD)</label>
                <div style={{ padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-hover)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  $ 5,000.00 USD
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
