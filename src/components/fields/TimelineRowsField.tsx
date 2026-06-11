import styles from './TimelineRowsField.module.css';

/**
 * Editable list of {number, title, body} rows.
 * Mirrors the .item-card numbered-timeline pattern in 10-comms-cms.html.
 * `number` is editable so callers can override the auto sequence (e.g.
 * a day-1 / day-3 / day-7 timeline rather than 1 / 2 / 3).
 */
export type TimelineRow = {
  number: string;
  title: string;
  body: string;
};

export type TimelineRowsFieldProps = {
  label: string;
  value: ReadonlyArray<TimelineRow>;
  onChange: (next: TimelineRow[]) => void;
  addLabel?: string;
  minRows?: number;
};

const BLANK_ROW: TimelineRow = { number: '', title: '', body: '' };

export function TimelineRowsField({
  label,
  value,
  onChange,
  addLabel = '+ Add row',
  minRows = 1,
}: TimelineRowsFieldProps) {
  const rows = value.length === 0 ? [{ ...BLANK_ROW }] : value.map((r) => ({ ...r }));

  const updateRow = (index: number, patch: Partial<TimelineRow>) => {
    const copy = rows.map((r) => ({ ...r }));
    const existing = copy[index] ?? { ...BLANK_ROW };
    copy[index] = { ...existing, ...patch };
    onChange(copy);
  };

  const removeRow = (index: number) => {
    if (rows.length <= minRows) return;
    const copy = rows.map((r) => ({ ...r }));
    copy.splice(index, 1);
    onChange(copy);
  };

  const addRow = () => {
    onChange([...rows, { ...BLANK_ROW, number: String(rows.length + 1) }]);
  };

  return (
    <div className={styles.field}>
      <div className={styles.label}>{label}</div>
      <div className={styles.list}>
        {rows.map((row, idx) => (
          <div className={styles.item} key={idx}>
            <div className={styles.itemHead}>
              <div className={styles.num}>{row.number || idx + 1}</div>
              <div className={styles.itemTitle}>{row.title || `Row ${idx + 1}`}</div>
              <div className={styles.itemSpacer} />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeRow(idx)}
                disabled={rows.length <= minRows}
                aria-label={`Remove row ${idx + 1}`}
                title="Remove"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className={styles.itemBody}>
              <div className={styles.subField}>
                <div className={styles.subLabel}>Number / label</div>
                <input
                  type="text"
                  className={styles.input}
                  value={row.number}
                  onChange={(e) => updateRow(idx, { number: e.target.value })}
                  placeholder={String(idx + 1)}
                />
              </div>
              <div className={styles.subField}>
                <div className={styles.subLabel}>Title</div>
                <input
                  type="text"
                  className={styles.input}
                  value={row.title}
                  onChange={(e) => updateRow(idx, { title: e.target.value })}
                  placeholder="Row title"
                />
              </div>
              <div className={styles.subField}>
                <div className={styles.subLabel}>Body</div>
                <textarea
                  className={styles.textarea}
                  value={row.body}
                  onChange={(e) => updateRow(idx, { body: e.target.value })}
                  placeholder="Description"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={addRow}>
        {addLabel}
      </button>
    </div>
  );
}
