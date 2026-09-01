import React from 'react';

interface GherkinFeatureViewerProps {
  content: string;
  className?: string;
}

export const GherkinFeatureViewer: React.FC<GherkinFeatureViewerProps> = ({ content, className = '' }) => {
  const lines = content.split('\n');

  const formatLine = (line: string, index: number) => {
    const trimmed = line.trim();

    // Tags line (e.g. @ADM402 @admin @cloud)
    if (trimmed.startsWith('@')) {
      const tags = trimmed.split(' ').map((tag, i) => (
        <span key={i} style={{ color: '#C084FC', fontWeight: 600, marginRight: '6px' }}>
          {tag}
        </span>
      ));
      return <div key={index} style={{ paddingLeft: line.length - line.trimStart().length + 'ch' }}>{tags}</div>;
    }

    // Feature keyword
    if (trimmed.startsWith('Feature:')) {
      const rest = line.substring(line.indexOf('Feature:') + 8);
      return (
        <div key={index} style={{ marginTop: '4px', marginBottom: '8px' }}>
          <strong style={{ color: '#38BDF8', fontWeight: 700 }}>Feature:</strong>
          <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{rest}</span>
        </div>
      );
    }

    // Scenario / Scenario Outline
    if (trimmed.startsWith('Scenario:') || trimmed.startsWith('Scenario Outline:')) {
      const isOutline = trimmed.startsWith('Scenario Outline:');
      const kw = isOutline ? 'Scenario Outline:' : 'Scenario:';
      const rest = line.substring(line.indexOf(kw) + kw.length);
      return (
        <div key={index} style={{ marginTop: '8px', marginBottom: '4px', paddingLeft: '1rem' }}>
          <strong style={{ color: '#38BDF8', fontWeight: 700 }}>{kw}</strong>
          <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{rest}</span>
        </div>
      );
    }

    // Gherkin Step Keywords (Given, When, Then, And, But)
    const stepMatch = line.match(/^(\s*)(Given|When|Then|And|But)\s+(.*)$/);
    if (stepMatch) {
      const [, indent, keyword, stepText] = stepMatch;

      // Highlight parameter variables like "<adminUserRole>" and quoted text '"Enable..."'
      const formattedStep = stepText.split(/(<[^>]+>|"[^"]*")/g).map((part, pIdx) => {
        if (part.startsWith('<') && part.endsWith('>')) {
          return (
            <span key={pIdx} style={{ color: '#FBBF24', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {part}
            </span>
          );
        }
        if (part.startsWith('"') && part.endsWith('"')) {
          return (
            <span key={pIdx} style={{ color: '#34D399', fontWeight: 500 }}>
              {part}
            </span>
          );
        }
        return <span key={pIdx}>{part}</span>;
      });

      let kwColor = '#60A5FA';
      if (keyword === 'Given') kwColor = '#A78BFA';
      if (keyword === 'When') kwColor = '#38BDF8';
      if (keyword === 'Then') kwColor = '#34D399';
      if (keyword === 'And') kwColor = '#94A3B8';

      return (
        <div key={index} style={{ paddingLeft: '2rem', lineHeight: 1.7 }}>
          <strong style={{ color: kwColor, width: '48px', display: 'inline-block' }}>{keyword}</strong>
          <span style={{ color: '#CBD5E1' }}>{formattedStep}</span>
        </div>
      );
    }

    // Examples section
    if (trimmed.startsWith('Examples:')) {
      return (
        <div key={index} style={{ marginTop: '8px', paddingLeft: '1.5rem' }}>
          <strong style={{ color: '#F472B6', fontWeight: 700 }}>Examples:</strong>
        </div>
      );
    }

    // Table rows (e.g. | Testcase | adminUserRole | ...)
    if (trimmed.startsWith('|')) {
      const isHeader = index > 0 && lines[index - 1].trim().startsWith('Examples:');
      return (
        <div
          key={index}
          style={{
            paddingLeft: '2.5rem',
            fontFamily: 'var(--font-mono)',
            color: isHeader ? '#93C5FD' : '#94A3B8',
            fontWeight: isHeader ? 700 : 400,
            lineHeight: 1.6,
          }}
        >
          {line}
        </div>
      );
    }

    return (
      <div key={index} style={{ paddingLeft: '1rem', color: '#64748B' }}>
        {line}
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#0B1120',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid #1E293B',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: 1.6,
        overflowX: 'auto',
        color: '#E2E8F0',
      }}
    >
      {lines.map((line, i) => formatLine(line, i))}
    </div>
  );
};
