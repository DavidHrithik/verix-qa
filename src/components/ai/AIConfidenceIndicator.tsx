import React from 'react';

export interface AIConfidenceIndicatorProps {
  score: number; // 0 to 100
  showLabel?: boolean;
}

export const AIConfidenceIndicator: React.FC<AIConfidenceIndicatorProps> = ({
  score,
  showLabel = true,
}) => {
  const getQualityColor = () => {
    if (score >= 90) return 'var(--status-passed)';
    if (score >= 70) return 'var(--status-warning)';
    return 'var(--status-failed)';
  };

  return (
    <div className="ai-confidence-meter" title={`Confidence: ${score}%`}>
      {showLabel && (
        <span style={{ color: 'var(--text-secondary)' }}>
          Confidence: <strong style={{ color: getQualityColor() }}>{score}%</strong>
        </span>
      )}
      <div className="ai-confidence-bar">
        <div
          className="ai-confidence-fill"
          style={{
            width: `${Math.min(100, Math.max(0, score))}%`,
            backgroundColor: getQualityColor(),
            background: `linear-gradient(90deg, #6366F1, ${getQualityColor()})`
          }}
        />
      </div>
    </div>
  );
};
