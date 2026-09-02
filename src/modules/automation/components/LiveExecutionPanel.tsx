import React, { useState } from 'react';
import { Play, Terminal, Image as ImageIcon, Code2, AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';

export const LiveExecutionPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('Go to https://demoqa.com/text-box and fill out the Full Name with "AI Agent", Email with "agent@test.com", and click Submit.');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    code: string;
    stdout: string;
    stderr: string;
    screenshot: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setIsExecuting(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, headless: false }) // Using headed mode for demo
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute script');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>AI Autonomous Agent Executer</span>
        </div>
      }
      subtitle="Provide a prompt. The AI will write the Playwright code and execute it locally."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Prompt Input */}
        <div>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
            Agent Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-hover)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="e.g. Go to demoqa.com and click..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            onClick={handleExecute} 
            disabled={isExecuting || !prompt.trim()}
            leftIcon={isExecuting ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            variant="ai"
          >
            {isExecuting ? 'Agent is Working...' : 'Run Agent Live'}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontWeight: 600, marginBottom: '0.5rem' }}>
              <AlertTriangle size={16} /> Agent Error
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{error}</div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {result.success ? (
                <CheckCircle2 size={20} style={{ color: 'var(--status-passed)' }} />
              ) : (
                <XCircle size={20} style={{ color: 'var(--status-failed)' }} />
              )}
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {result.success ? 'Execution Successful' : 'Execution Failed'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              {/* Generated Code */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  <Code2 size={14} /> Generated Playwright Code
                </div>
                <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#1E1E1E', color: '#D4D4D4', fontSize: '11px', overflowX: 'auto', maxHeight: '300px' }}>
                  {result.code}
                </pre>
              </div>

              {/* Execution Logs */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  <Terminal size={14} /> Terminal Output
                </div>
                <div style={{ backgroundColor: '#000', padding: '1rem', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {result.stdout && <pre style={{ margin: 0, color: '#A3BE8C', fontSize: '11px', whiteSpace: 'pre-wrap' }}>{result.stdout}</pre>}
                  {result.stderr && <pre style={{ margin: 0, color: '#BF616A', fontSize: '11px', whiteSpace: 'pre-wrap' }}>{result.stderr}</pre>}
                </div>
              </div>
            </div>

            {/* Screenshot */}
            {result.screenshot && (
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  <ImageIcon size={14} /> Final Browser State
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={result.screenshot} 
                    alt="Playwright Execution Result" 
                    style={{ maxWidth: '100%', border: '1px solid var(--border-subtle)', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  />
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </Card>
  );
};
