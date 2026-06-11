import { useId } from 'react';

import styles from './SelectField.module.css';

export type SelectOption = {
  value: string;
  label: string;
};

/**
 * Label + native select. Mirrors .select-fld in 10-comms-cms.html.
 */
export type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: ReadonlyArray<SelectOption>;
  helperText?: string;
  id?: string;
};

export function SelectField({
  label,
  value,
  onChange,
  options,
  helperText,
  id,
}: SelectFieldProps) {
  const reactId = useId();
  const inputId = id ?? reactId;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <select
        id={inputId}
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText !== undefined && helperText.length > 0 ? (
        <div className={styles.help}>{helperText}</div>
      ) : null}
    </div>
  );
}
