import styles from './BulletListField.module.css';

/**
 * Editable list of bullet strings — add/remove rows.
 * Mirrors the .bullet-row pattern in 10-comms-cms.html (used for
 * "Bullet points" / "Today's focus" sections).
 */
export type BulletListFieldProps = {
  label: string;
  value: ReadonlyArray<string>;
  onChange: (next: string[]) => void;
  addLabel?: string;
  placeholder?: string;
  /** Minimum rows that must remain (remove button disabled at this count). */
  minRows?: number;
};

export function BulletListField({
  label,
  value,
  onChange,
  addLabel = '+ Add bullet',
  placeholder,
  minRows = 1,
}: BulletListFieldProps) {
  const rows = value.length === 0 ? [''] : [...value];

  const updateRow = (index: number, next: string) => {
    const copy = rows.slice();
    copy[index] = next;
    onChange(copy);
  };

  const removeRow = (index: number) => {
    if (rows.length <= minRows) return;
    const copy = rows.slice();
    copy.splice(index, 1);
    onChange(copy);
  };

  const addRow = () => {
    onChange([...rows, '']);
  };

  return (
    <div className={styles.field}>
      <div className={styles.label}>{label}</div>
      <div className={styles.list}>
        {rows.map((row, idx) => (
          <div className={styles.row} key={idx}>
            <input
              type="text"
              className={styles.input}
              value={row}
              onChange={(e) => updateRow(idx, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeRow(idx)}
              disabled={rows.length <= minRows}
              aria-label={`Remove bullet ${idx + 1}`}
              title="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={addRow}>
        {addLabel}
      </button>
    </div>
  );
}
