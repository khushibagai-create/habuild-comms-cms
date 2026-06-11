import { useId } from 'react';

import styles from './TextField.module.css';

/**
 * Label + text input + optional helper text. Controlled component.
 * Mirrors .field > label + .input in 10-comms-cms.html.
 */
export type TextFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  helperText?: string;
  type?: 'text' | 'url' | 'email' | 'date' | 'time';
  id?: string;
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  type = 'text',
  id,
}: TextFieldProps) {
  const reactId = useId();
  const inputId = id ?? reactId;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {helperText !== undefined && helperText.length > 0 ? (
        <div className={styles.help}>{helperText}</div>
      ) : null}
    </div>
  );
}
