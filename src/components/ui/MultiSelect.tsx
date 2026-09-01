import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { SelectOption } from './Select';

export interface MultiSelectProps {
  label?: string;
  hint?: string;
  options: SelectOption[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  hint,
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeTag = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className="form-group" ref={dropdownRef}>
      {label && <label className="form-label">{label}</label>}
      <div
        className="input-text"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.35rem',
          minHeight: '38px',
          cursor: 'pointer',
          paddingRight: '2rem',
          position: 'relative'
        }}
      >
        {value.length === 0 ? (
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{placeholder}</span>
        ) : (
          value.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <span
                key={v}
                className="badge badge-default"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {opt ? opt.label : v}
                <X
                  size={12}
                  onClick={(e) => removeTag(v, e)}
                  style={{ cursor: 'pointer' }}
                />
              </span>
            );
          })
        )}
        <ChevronDown
          size={16}
          style={{
            position: 'absolute',
            right: '0.75rem',
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--transition-fast)'
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            marginTop: '4px',
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 'var(--z-dropdown)',
            padding: '0.35rem'
          }}
        >
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: isSelected ? 500 : 400
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
              </div>
            );
          })}
        </div>
      )}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
};
