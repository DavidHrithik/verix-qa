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
  UserPlus,
  Mail,
  KeyRound,
  Shield,
  Check,
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
  const isRegistration =
    scriptName.toLowerCase().includes('auth') ||
    scriptName.toLowerCase().includes('register') ||
    scriptName.toLowerCase().includes('signup') ||
    activeTestCaseKey.startsWith('TC-10') ||
    activeTestCaseKey.startsWith('TC-50');

  const isMemberPolicyCloud204 =
    !isRegistration &&
    (scriptName.includes('CLOUD') ||
      scriptName.includes('204') ||
      scriptName.includes('Policy') ||
      scriptName.includes('Export') ||
      scriptName.includes('Admin') ||
      activeTestCaseKey.startsWith('TC-20'));

  const isWireTransfer = scriptName.includes('wire') || scriptName.includes('mfa') || scriptName.includes('DBANK104');
  const activeStep = steps[currentStepIndex];
  const isStepFailed = activeStep && activeStep.status === 'failed';

  const getUrl = () => {
    if (isRegistration) {
      if (activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502') return '/auth/register?error=validation';
      if (activeTestCaseKey === 'TC-103' || activeTestCaseKey === 'TC-503') return '/auth/register?boundary=password-min';
      if (activeTestCaseKey === 'TC-104' || activeTestCaseKey === 'TC-504') return '/auth/register?error=duplicate-409';
      if (activeTestCaseKey === 'TC-105' || activeTestCaseKey === 'TC-505') return '/auth/register?sanitize=xss-filter';
      return '/auth/register';
    }
    if (activeTestCaseKey === 'TC-202') return '/member-portal/unauthorized-export';
    if (activeTestCaseKey === 'TC-203') return '/data-pipeline/heavy-stream';
    if (activeTestCaseKey === 'TC-204') return '/compliance/pii-masking-audit';
    if (activeTestCaseKey === 'TC-205') return '/session-monitor/rollback';
    if (isMemberPolicyCloud204) return '/member-policies/data-export';
    return '/transfers/wire';
  };

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
            backgroundColor: '#020617',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 10px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #1E293B',
          }}
        >
          <Lock size={11} style={{ color: '#10B981' }} />
          <span>https://{isRegistration ? 'auth.verix.io' : isMemberPolicyCloud204 ? 'admin.cloud.enterprise.internal' : 'qa-sandbox.dbank.verix.io'}</span>
          <span style={{ color: '#38BDF8' }}>{getUrl()}</span>
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
          overflowY: 'auto',
        }}
      >
        {/* ========================================================================= */}
        {/* REGISTRATION PORTAL SYSTEM UNDER TEST (AUTH-101 / TC-101..TC-105)        */}
        {/* ========================================================================= */}
        {isRegistration ? (
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                }}
              >
                <UserPlus size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                Create your Verix QA Account
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Interactive Registration Portal (AUTH-101)
              </div>
            </div>

            {/* TC-101 / TC-501: Happy Path Success Screen */}
            {(activeTestCaseKey === 'TC-101' || activeTestCaseKey === 'TC-501') && currentStepIndex >= 2 ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--status-passed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--status-passed)' }}>
                  Account Created Successfully!
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Welcome, <strong>Alex Morgan</strong>! An activation email has been dispatched to <code>alex.morgan@company.com</code>.
                </div>
                <div style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-hover)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  HTTP 201 Created • User Provisioned • AC-1 Verified ✓
                </div>
              </div>
            ) : (
              /* Live Registration Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* TC-104: 409 Duplicate Email Alert */}
                {(activeTestCaseKey === 'TC-104' || activeTestCaseKey === 'TC-504') && currentStepIndex >= 1 && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: 'var(--status-warning)',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>409 Conflict:</strong> Email <code>alex.morgan@company.com</code> is already registered. <a href="#login" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Log in instead →</a>
                    </span>
                  </div>
                )}

                {/* TC-105: XSS Sanitization Badge */}
                {(activeTestCaseKey === 'TC-105' || activeTestCaseKey === 'TC-505') && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: '#A78BFA',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Shield size={14} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>OWASP XSS Filter Active:</strong> HTML script tags stripped and entity-escaped safely.
                    </span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      activeTestCaseKey === 'TC-105' || activeTestCaseKey === 'TC-505'
                        ? "<script>alert('xss')</script>Alex Morgan"
                        : currentStepIndex >= 1
                        ? 'Alex Morgan'
                        : ''
                    }
                    placeholder="e.g. Alex Morgan"
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  />
                  {(activeTestCaseKey === 'TC-105' || activeTestCaseKey === 'TC-505') && (
                    <span style={{ fontSize: '10px', color: '#10B981', marginTop: '2px', display: 'block' }}>
                      Sanitized output: <code>Alex Morgan</code> (0% vulnerability)
                    </span>
                  )}
                </div>

                {/* Work Email */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                    Business Email
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                        ? 'invalid-user@'
                        : currentStepIndex >= 1
                        ? 'alex.morgan@company.com'
                        : ''
                    }
                    placeholder="name@company.com"
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border:
                        activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                          ? '1px solid var(--status-failed)'
                          : '1px solid var(--border-default)',
                      color:
                        activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                          ? 'var(--status-failed)'
                          : 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  />
                  {(activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502') && (
                    <span style={{ fontSize: '10px', color: 'var(--status-failed)', marginTop: '2px', display: 'block' }}>
                      ⚠️ Please enter a valid email format (e.g. name@company.com)
                    </span>
                  )}
                </div>

                {/* Password with Boundary Meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Password</label>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Min 8 chars</span>
                  </div>
                  <input
                    type="password"
                    readOnly
                    value={
                      activeTestCaseKey === 'TC-103' || activeTestCaseKey === 'TC-503'
                        ? 'Pass12!'
                        : currentStepIndex >= 1
                        ? 'SecurePass2026!'
                        : ''
                    }
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border:
                        activeTestCaseKey === 'TC-103' || activeTestCaseKey === 'TC-503'
                          ? '1px solid #F59E0B'
                          : '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  />
                  {(activeTestCaseKey === 'TC-103' || activeTestCaseKey === 'TC-503') && (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#F59E0B' }}>
                        <span>⚠️ 7/8 characters (1 char below minimum limit)</span>
                        <span>Boundary Check</span>
                      </div>
                      <div style={{ height: '4px', borderRadius: '2px', backgroundColor: '#1E293B', marginTop: '2px' }}>
                        <div style={{ height: '100%', width: '87.5%', backgroundColor: '#F59E0B' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    readOnly
                    value={
                      activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                        ? 'Mismatch999!'
                        : currentStepIndex >= 1
                        ? 'SecurePass2026!'
                        : ''
                    }
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border:
                        activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                          ? '1px solid var(--status-failed)'
                          : '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  />
                  {(activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502') && (
                    <span style={{ fontSize: '10px', color: 'var(--status-failed)', marginTop: '2px', display: 'block' }}>
                      ⚠️ Passwords do not match
                    </span>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <input
                    type="checkbox"
                    readOnly
                    checked={currentStepIndex >= 1}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    I agree to the Verix Terms of Service & Privacy Policy
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  disabled
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor:
                      activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                        ? 'var(--bg-surface-hover)'
                        : 'var(--accent-primary)',
                    color:
                      activeTestCaseKey === 'TC-102' || activeTestCaseKey === 'TC-502'
                        ? 'var(--text-muted)'
                        : '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 'var(--text-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <UserPlus size={14} />
                  <span>Create Verix Account</span>
                </button>
              </div>
            )}
          </div>
        ) : isMemberPolicyCloud204 ? (
          /* ========================================================================= */
          /* CLOUD-204 ADMIN CONSOLE SYSTEM UNDER TEST                                 */
          /* ========================================================================= */
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
            /* TC-205: Session Rollback View */
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
                    Session Recovery & Safe Rollback
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fault-Tolerant State Machine</div>
                </div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: '11px', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-passed)', marginBottom: '4px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Temporary files safely purged
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-passed)', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Reconnect token issued with zero corrupted artifacts
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--status-passed)', fontWeight: 600, textAlign: 'center' }}>
                ✓ Safe Rollback Protocol Verified Under Session Disconnect
              </div>
            </div>
          ) : (
            /* TC-201: Standard Happy Path / Drift Target Switch */
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Hospital size={18} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    Cloud Policy Management
                  </span>
                </div>
                <span className="badge badge-passed" style={{ fontSize: '10px' }}>
                  v3.4.0 Live
                </span>
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
                      Repaired with `[data-testid='member-export-toggle']`
                    </div>
                  )}
                </div>

                {/* Secondary permission toggle */}
                <div
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                      Allow scheduled offline database synchronization
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Background Sync Agent</div>
                  </div>
                  <ToggleRight size={22} style={{ color: '#10B981' }} />
                </div>
              </div>
            </div>
          )
        ) : (
          /* Wire Transfer Portal fallback */
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  Digital Banking Wire Transfer
                </span>
              </div>
              <span className="badge badge-passed" style={{ fontSize: '10px' }}>
                Sandbox Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-xs)' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Recipient Account</label>
                <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                  DE89 3704 0044 0532 0130 00
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Amount (USD)</label>
                <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontWeight: 700, color: 'var(--status-passed)' }}>
                  $ 12,500.00
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '11px' }}>
                <div style={{ fontWeight: 600, color: '#38BDF8', marginBottom: '2px' }}>High-Value Transfer Triggered</div>
                <div style={{ color: 'var(--text-secondary)' }}>Threshold &gt; $5,000 mandates biometric multi-factor challenge.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
