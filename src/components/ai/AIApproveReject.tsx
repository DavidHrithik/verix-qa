import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AIApproveRejectProps {
  onApprove: () => void;
  onReject: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
  disabled?: boolean;
}

export const AIApproveReject: React.FC<AIApproveRejectProps> = ({
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  approveLabel = 'Approve & Save',
  rejectLabel = 'Discard',
  disabled = false,
}) => {
  return (
    <div className="ai-action-controls">
      <Button
        size="sm"
        variant="secondary"
        onClick={onReject}
        disabled={disabled || isApproving || isRejecting}
        isLoading={isRejecting}
        leftIcon={<X size={14} />}
      >
        {rejectLabel}
      </Button>
      <Button
        size="sm"
        variant="primary"
        onClick={onApprove}
        disabled={disabled || isApproving || isRejecting}
        isLoading={isApproving}
        leftIcon={<Check size={14} />}
        style={{
          backgroundColor: 'var(--status-passed)',
          borderColor: 'var(--status-passed)',
          color: '#FFFFFF'
        }}
      >
        {approveLabel}
      </Button>
    </div>
  );
};
