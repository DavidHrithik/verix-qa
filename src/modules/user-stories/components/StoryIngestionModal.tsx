import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Layers,
  Trash2,
  ArrowRight,
  ExternalLink,
  Table as TableIcon
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { UserStory, PriorityLevel } from '../../../types';
import { useProject } from '../../../app/providers/ProjectProvider';

type IngestionTab = 'jira' | 'excel' | 'manual';

interface StoryIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStories: (stories: UserStory[]) => void;
}

// Sample Jira issues available for 1-click sync per project
const SAMPLE_JIRA_DATA: Record<string, Array<{
  key: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: PriorityLevel;
  storyPoints: number;
  jiraStatus: string;
}>> = {
  'proj-1': [
    {
      key: 'SNC-104',
      title: 'Telemetry Anomaly Real-Time Quarantine & Notification Webhook',
      description: 'As a biomedical cloud operator, I want the system to isolate corrupted device telemetry streams automatically.',
      acceptanceCriteria: [
        'Flag payloads with variance > 3 sigma in sensor voltage',
        'Trigger PagerDuty webhook alert within 1 second of detection',
        'Quarantine raw data partition for audit investigation'
      ],
      priority: 'Critical',
      storyPoints: 5,
      jiraStatus: 'Ready for Sprint'
    },
    {
      key: 'SNC-105',
      title: 'Clinical Audit Trail Multi-Region Redundancy & Data Encryption',
      description: 'Ensure all compliance audit events replicate across EU-West and US-East regions with zero packet drop.',
      acceptanceCriteria: [
        'Dual-region asynchronous replication lag under 200ms',
        'Zero cleartext storage of surgeon identifiers',
        'SHA-256 integrity verification upon batch export'
      ],
      priority: 'High',
      storyPoints: 8,
      jiraStatus: 'In Backlog'
    },
    {
      key: 'SNC-106',
      title: 'Automated Device Certificate Expiry Alerting (30-Day Warning)',
      description: 'Notify hospital biomedical IT administrators 30 days before TLS device certificates expire.',
      acceptanceCriteria: [
        'Daily cron job checking certificate validity window',
        'Dispatch automated email with rotation instructions',
        'Display amber warning badge on device fleet overview'
      ],
      priority: 'Medium',
      storyPoints: 3,
      jiraStatus: 'Ready for Sprint'
    }
  ],
  'proj-2': [
    {
      key: 'SNA-104',
      title: 'Emergency E-Stop Hardware Signal Routing to Tablet UI',
      description: 'As an orthopedic surgeon, I want the tablet screen to flash instant emergency stop confirmation when the physical button is pressed.',
      acceptanceCriteria: [
        'Hardware interrupt received on tablet within 10ms',
        'Full-screen high-contrast red safety override overlay displayed',
        'Robotic joint actuators lock immediately'
      ],
      priority: 'Critical',
      storyPoints: 5,
      jiraStatus: 'Ready for Sprint'
    },
    {
      key: 'SNA-105',
      title: 'Bone Resection Depth Feedback & Real-Time Audio Chime',
      description: 'Provide progressive audio pitch feedback to the surgeon as resection target depth is approached.',
      acceptanceCriteria: [
        'Audio pitch increases exponentially within final 1.0mm of cut',
        'Visual depth gauge indicator updates at 60 FPS',
        'Dual confirmation tone on reaching exact planned depth'
      ],
      priority: 'High',
      storyPoints: 8,
      jiraStatus: 'Ready for Sprint'
    }
  ]
};

export const StoryIngestionModal: React.FC<StoryIngestionModalProps> = ({
  isOpen,
  onClose,
  onImportStories,
}) => {
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState<IngestionTab>('jira');

  // --- Jira Tab State ---
  const [jiraDomain, setJiraDomain] = useState('smith-nephew.atlassian.net');
  const [jiraProjectKey, setJiraProjectKey] = useState(activeProject.key);
  const [isJiraFetched, setIsJiraFetched] = useState(false);
  const [selectedJiraKeys, setSelectedJiraKeys] = useState<string[]>([]);
  const [isJiraLoading, setIsJiraLoading] = useState(false);

  // --- Excel Tab State ---
  const [excelText, setExcelText] = useState('');
  const [parsedRows, setParsedRows] = useState<Array<{
    key: string;
    title: string;
    description: string;
    acceptanceCriteria: string[];
    priority: PriorityLevel;
    storyPoints: number;
    isValid: boolean;
  }>>([]);
  const [excelFileName, setExcelFileName] = useState('');

  // --- Manual Entry State ---
  const [manualKey, setManualKey] = useState(`${activeProject.key}-10${Math.floor(Math.random() * 90 + 10)}`);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualPriority, setManualPriority] = useState<PriorityLevel>('High');
  const [manualPoints, setManualPoints] = useState(5);
  const [manualAC, setManualAC] = useState<string[]>([
    'Verify primary user flow completes with valid inputs',
    'Verify error notification on invalid payload'
  ]);
  const [newAcItem, setNewAcItem] = useState('');

  if (!isOpen) return null;

  const currentJiraSample = SAMPLE_JIRA_DATA[activeProject.id] || SAMPLE_JIRA_DATA['proj-1'];

  // --- Jira Actions ---
  const handleFetchJira = () => {
    setIsJiraLoading(true);
    setTimeout(() => {
      setIsJiraLoading(false);
      setIsJiraFetched(true);
      setSelectedJiraKeys(currentJiraSample.map(j => j.key));
    }, 600);
  };

  const handleImportJira = () => {
    const toImport = currentJiraSample.filter(j => selectedJiraKeys.includes(j.key));
    const now = new Date().toISOString();
    const newStories: UserStory[] = toImport.map(j => ({
      id: `story-jira-${Date.now()}-${j.key}`,
      projectId: activeProject.id,
      key: j.key,
      title: j.title,
      description: j.description,
      acceptanceCriteria: j.acceptanceCriteria,
      status: 'Ready for QA',
      priority: j.priority,
      coverageStatus: 'Uncovered',
      testCaseCount: 0,
      source: 'jira',
      storyPoints: j.storyPoints,
      jiraKey: j.key,
      createdAt: now,
      updatedAt: now,
    }));
    onImportStories(newStories);
    onClose();
  };

  // --- Excel Actions ---
  const handleDownloadTemplate = () => {
    const csvContent =
      'Story Key,Title,Description,Acceptance Criteria (semicolon separated),Priority,Story Points\n' +
      `${activeProject.key}-104,"Telemetry Data Ingestion","Stream biomedical metrics from connected implants","Verify AES-256 payload;Enforce 50ms latency;Export audit log",Critical,5\n` +
      `${activeProject.key}-105,"Surgeon Sterile Touch Mode","Touch sensitivity under surgical gloves","Pinch to zoom;Splatter rejection;Haptic confirmation",High,8\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `verix_${activeProject.key.toLowerCase()}_stories_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSampleExcel = () => {
    const sample =
      `${activeProject.key}-104,Automated Device Calibration Telemetry,Verify implant telemetry calibration stream,Zero packet loss over 60s;Trigger alerts on drift > 0.5mm,Critical,5\n` +
      `${activeProject.key}-105,Surgeon Touch Preference Profile Storage,Store sterile touchscreen sensitivity per doctor profile,Persistent cloud profile sync;Auto-switch on badge scan,Medium,3`;
    setExcelText(sample);
    setExcelFileName('sample_clinical_stories.csv');
    parseCsv(sample);
  };

  const parseCsv = (text: string) => {
    const lines = text.trim().split('\n');
    const parsed: Array<{
      key: string;
      title: string;
      description: string;
      acceptanceCriteria: string[];
      priority: PriorityLevel;
      storyPoints: number;
      isValid: boolean;
    }> = [];

    lines.forEach((line, idx) => {
      // skip header if present
      if (line.toLowerCase().includes('story key') || line.toLowerCase().includes('title')) return;
      const parts = line.split(',');
      if (parts.length >= 2) {
        const key = parts[0]?.replace(/"/g, '').trim() || `${activeProject.key}-${100 + idx}`;
        const title = parts[1]?.replace(/"/g, '').trim() || 'Untitled Requirement';
        const description = parts[2]?.replace(/"/g, '').trim() || 'Imported via Excel template.';
        const acRaw = parts[3]?.replace(/"/g, '').trim() || 'Verify acceptance criteria';
        const acceptanceCriteria = acRaw.split(';').map(s => s.trim()).filter(Boolean);
        const priorityRaw = parts[4]?.replace(/"/g, '').trim() || 'High';
        const priority: PriorityLevel = ['Critical', 'High', 'Medium', 'Low'].includes(priorityRaw)
          ? (priorityRaw as PriorityLevel)
          : 'High';
        const points = Number(parts[5]?.replace(/"/g, '').trim()) || 5;

        parsed.push({
          key,
          title,
          description,
          acceptanceCriteria: acceptanceCriteria.length ? acceptanceCriteria : ['Verify functional requirement criteria'],
          priority,
          storyPoints: points,
          isValid: Boolean(key && title)
        });
      }
    });

    setParsedRows(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setExcelText(content);
      parseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleImportExcel = () => {
    const now = new Date().toISOString();
    const newStories: UserStory[] = parsedRows
      .filter(r => r.isValid)
      .map((r, idx) => ({
        id: `story-excel-${Date.now()}-${idx}`,
        projectId: activeProject.id,
        key: r.key,
        title: r.title,
        description: r.description,
        acceptanceCriteria: r.acceptanceCriteria,
        status: 'Ready for QA',
        priority: r.priority,
        coverageStatus: 'Uncovered',
        testCaseCount: 0,
        source: 'excel',
        storyPoints: r.storyPoints,
        createdAt: now,
        updatedAt: now,
      }));
    onImportStories(newStories);
    onClose();
  };

  // --- Manual Actions ---
  const handleAddAc = () => {
    if (!newAcItem.trim()) return;
    setManualAC([...manualAC, newAcItem.trim()]);
    setNewAcItem('');
  };

  const handleRemoveAc = (index: number) => {
    setManualAC(manualAC.filter((_, i) => i !== index));
  };

  const handleCreateManual = () => {
    if (!manualTitle.trim()) return;
    const now = new Date().toISOString();
    const newStory: UserStory = {
      id: `story-manual-${Date.now()}`,
      projectId: activeProject.id,
      key: manualKey.trim().toUpperCase(),
      title: manualTitle.trim(),
      description: manualDesc.trim() || 'Created via Verix Manual Entry form.',
      acceptanceCriteria: manualAC.length > 0 ? manualAC : ['Verify primary functional acceptance criteria'],
      status: 'Ready for QA',
      priority: manualPriority,
      coverageStatus: 'Uncovered',
      testCaseCount: 0,
      source: 'manual',
      storyPoints: manualPoints,
      createdAt: now,
      updatedAt: now,
    };
    onImportStories([newStory]);
    onClose();
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '680px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366F1, #0EA5E9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(99,102,241,0.4)'
              }}
            >
              <Layers size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
                Import / Create User Stories
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Target Workspace: <strong>{activeProject.name}</strong> ({activeProject.key})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-surface-hover)'
          }}
        >
          {[
            { id: 'jira', label: 'Jira Integration', icon: <ExternalLink size={14} />, badge: 'Live API' },
            { id: 'excel', label: 'Excel Template', icon: <FileSpreadsheet size={14} />, badge: 'CSV / XLSX' },
            { id: 'manual', label: 'Manual Entry', icon: <Plus size={14} />, badge: 'Direct' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as IngestionTab)}
              style={{
                padding: '0.875rem 1rem',
                border: 'none',
                background: activeTab === t.id ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderBottom: activeTab === t.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* ========================================================================= */}
          {/* TAB 1: JIRA INTEGRATION */}
          {/* ========================================================================= */}
          {activeTab === 'jira' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <CheckCircle2 size={16} color="#6366F1" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  Connected to Atlassian Jira Cloud instance. Stories with acceptance criteria, priority, and story points will be synced directly into Verix.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Jira Instance URL</label>
                  <input
                    type="text"
                    value={jiraDomain}
                    onChange={(e) => setJiraDomain(e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.45rem 0.65rem',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Jira Project Key</label>
                  <input
                    type="text"
                    value={jiraProjectKey}
                    onChange={(e) => setJiraProjectKey(e.target.value.toUpperCase())}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.45rem 0.65rem',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {!isJiraFetched ? (
                <div
                  style={{
                    border: '1px dashed var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(99,102,241,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)'
                    }}
                  >
                    <Layers size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      Query Jira Backlog & Active Sprints
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Fetch all unassigned or ready-for-QA requirements from project {jiraProjectKey}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={handleFetchJira}
                    disabled={isJiraLoading}
                  >
                    {isJiraLoading ? 'Querying Jira API...' : 'Fetch Jira Requirements'}
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {currentJiraSample.length} Jira Tickets Found ({selectedJiraKeys.length} selected)
                    </span>
                    <button
                      onClick={() => {
                        setSelectedJiraKeys(
                          selectedJiraKeys.length === currentJiraSample.length
                            ? []
                            : currentJiraSample.map(j => j.key)
                        );
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-primary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {selectedJiraKeys.length === currentJiraSample.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {currentJiraSample.map(j => {
                      const isSelected = selectedJiraKeys.includes(j.key);
                      return (
                        <div
                          key={j.key}
                          onClick={() => {
                            setSelectedJiraKeys(
                              isSelected ? selectedJiraKeys.filter(k => k !== j.key) : [...selectedJiraKeys, j.key]
                            );
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                            background: isSelected ? 'rgba(99,102,241,0.06)' : 'var(--bg-surface-hover)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            transition: 'all 0.15s'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ marginTop: '3px', accentColor: 'var(--accent-primary)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', color: 'var(--accent-primary)' }}>
                                {j.key}
                              </span>
                              <Badge variant={j.priority === 'Critical' ? 'failed' : 'warning'}>
                                {j.priority}
                              </Badge>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                {j.storyPoints} Story Pts • {j.jiraStatus}
                              </span>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                              {j.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {j.acceptanceCriteria.length} Acceptance Criteria defined
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EXCEL / CSV TEMPLATE UPLOAD */}
          {/* ========================================================================= */}
          {activeTab === 'excel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Template Download Notice */}
              <div
                style={{
                  background: 'rgba(14,165,233,0.06)',
                  border: '1px solid rgba(14,165,233,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileSpreadsheet size={18} color="#0EA5E9" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
                      Standard Verix Story Template
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Columns: Story Key, Title, Description, Acceptance Criteria, Priority, Story Points
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download size={13} />}
                  onClick={handleDownloadTemplate}
                >
                  Download .CSV
                </Button>
              </div>

              {/* Upload Dropzone */}
              <div
                style={{
                  border: '2px dashed var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-surface-hover)',
                  position: 'relative'
                }}
              >
                <Upload size={24} color="var(--accent-primary)" />
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  Upload Excel or CSV File
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {excelFileName ? `Loaded: ${excelFileName}` : 'Drag & drop .csv or .xlsx file here, or click to browse'}
                </div>
                <input
                  type="file"
                  accept=".csv,.txt,.xlsx"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Or Quick Load Sample */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleLoadSampleExcel}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Sparkles size={12} /> Load Sample S&N Excel Rows
                </button>
              </div>

              {/* Parsed Preview Table */}
              {parsedRows.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Parsed {parsedRows.length} Stories from File
                  </div>
                  <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                          <th style={{ padding: '6px 10px', color: 'var(--text-muted)' }}>Key</th>
                          <th style={{ padding: '6px 10px', color: 'var(--text-muted)' }}>Title</th>
                          <th style={{ padding: '6px 10px', color: 'var(--text-muted)' }}>Priority</th>
                          <th style={{ padding: '6px 10px', color: 'var(--text-muted)' }}>Criteria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                              {r.key}
                            </td>
                            <td style={{ padding: '6px 10px', fontWeight: 500, color: 'var(--text-primary)' }}>
                              {r.title}
                            </td>
                            <td style={{ padding: '6px 10px' }}>
                              <Badge variant={r.priority === 'Critical' ? 'failed' : 'warning'}>{r.priority}</Badge>
                            </td>
                            <td style={{ padding: '6px 10px', color: 'var(--text-muted)' }}>
                              {r.acceptanceCriteria.length} AC
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MANUAL ENTRY */}
          {/* ========================================================================= */}
          {activeTab === 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Story Key *</label>
                  <input
                    type="text"
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value.toUpperCase())}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.45rem 0.65rem',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Priority</label>
                    <select
                      value={manualPriority}
                      onChange={(e) => setManualPriority(e.target.value as PriorityLevel)}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.45rem 0.65rem',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        outline: 'none'
                      }}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Story Points</label>
                    <input
                      type="number"
                      value={manualPoints}
                      min={1}
                      max={21}
                      onChange={(e) => setManualPoints(Number(e.target.value))}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.45rem 0.65rem',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Requirement Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Real-Time Robotic Joint Brake Trigger"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.65rem',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>User Story Statement</label>
                <textarea
                  rows={2}
                  placeholder="As a [role], I want [capability], so that [business value]..."
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.65rem',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Acceptance Criteria Builder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Acceptance Criteria ({manualAC.length})
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', maxHeight: '140px', overflowY: 'auto' }}>
                  {manualAC.map((ac, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 700, width: '16px' }}>
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={ac}
                        onChange={(e) => {
                          const updated = [...manualAC];
                          updated[idx] = e.target.value;
                          setManualAC(updated);
                        }}
                        style={{
                          flex: 1,
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.35rem 0.5rem',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleRemoveAc(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: '3px'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new AC row */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input
                    type="text"
                    placeholder="Add new acceptance criteria point..."
                    value={newAcItem}
                    onChange={(e) => setNewAcItem(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddAc(); }}
                    style={{
                      flex: 1,
                      background: 'var(--bg-input)',
                      border: '1px dashed var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.35rem 0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Button size="sm" variant="secondary" onClick={handleAddAc}>
                    Add AC
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-hover)'
          }}
        >
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          {activeTab === 'jira' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ExternalLink size={14} />}
              onClick={handleImportJira}
              disabled={selectedJiraKeys.length === 0}
            >
              Import {selectedJiraKeys.length} Stories from Jira
            </Button>
          )}

          {activeTab === 'excel' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileSpreadsheet size={14} />}
              onClick={handleImportExcel}
              disabled={parsedRows.length === 0}
            >
              Import {parsedRows.length} Stories from Excel
            </Button>
          )}

          {activeTab === 'manual' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={handleCreateManual}
              disabled={!manualTitle.trim()}
            >
              Create User Story
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
