import { useId } from 'react';

import styles from './TextArea.module.css';

/**
 * Label + textarea + optional helper text. Controlled component.
 * Mirrors .field > label + .textarea in 10-comms-cms.html.
 */
export type TextAreaProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  helperText?: string;
  rows?: number;
  id?: string;
};

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  rows = 3,
  id,
}: TextAreaProps) {
  const reactId = useId();
  const inputId = id ?? reactId;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      {helperText !== undefined && helperText.length > 0 ? (
        <div className={styles.help}>{helperText}</div>
      ) : null}
    </div>
  );
}
