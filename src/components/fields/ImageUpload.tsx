import { useId, useRef, useState, type DragEvent } from 'react';

import styles from './ImageUpload.module.css';

/**
 * Drag-drop image upload with URL-paste tab.
 * Mirrors the .upload-dz pattern in 10-comms-cms.html — same FileReader
 * data-URL path, same dragover visual cue, same filled thumbnail with
 * hover replace overlay.
 *
 * `value` is the image source (data URL from a local file upload OR an
 * http(s) URL pasted in). `onChange(null)` removes the image.
 */
export type ImageUploadProps = {
  label: string;
  value: string | null;
  onChange: (next: string | null, meta?: { name?: string; size?: number }) => void;
  hint?: string;
  /** File name to display in meta row when value came from a local file. */
  metaName?: string;
  /** File size in bytes for meta row. */
  metaSize?: number;
};

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function ImageUpload({
  label,
  value,
  onChange,
  hint = 'Click to upload or drag a file here.',
  metaName,
  metaSize,
}: ImageUploadProps) {
  const reactId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlDraft, setUrlDraft] = useState('');

  const readFile = (file: File) => {
    if (!/^image\//.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onChange(result, { name: file.name, size: file.size });
      }
    };
    reader.readAsDataURL(file);
  };

  const onPick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    // reset so picking the same file again still fires onChange
    e.target.value = '';
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const onUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlDraft.trim();
    if (trimmed.length > 0) {
      onChange(trimmed);
      setUrlDraft('');
    }
  };

  const hasValue = value !== null && value !== '';
  const isDataUrl = hasValue && value !== null && value.startsWith('data:');

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={reactId}>
        {label}
      </label>

      {!hasValue ? (
        <>
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'upload'}
              className={`${styles.tab} ${activeTab === 'upload' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'url'}
              className={`${styles.tab} ${activeTab === 'url' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('url')}
            >
              Paste URL
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div
              id={reactId}
              role="button"
              tabIndex={0}
              className={`${styles.empty} ${isDragOver ? styles.dragover : ''}`}
              onClick={onPick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPick();
                }
              }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <svg
                className={styles.upIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M12 4v12M6 10l6-6 6 6M4 20h16" />
              </svg>
              <div>{hint}</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <form className={styles.urlRow} onSubmit={onUrlSubmit}>
              <input
                type="url"
                className={styles.urlInput}
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://…"
              />
              <button type="submit" className={styles.tab + ' ' + styles.tabActive}>
                Use URL
              </button>
            </form>
          )}
        </>
      ) : (
        <>
          <div
            className={styles.filled}
            onClick={onPick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className={styles.thumb}>
              {isDataUrl || /^https?:/i.test(value ?? '') ? (
                <img src={value ?? ''} alt="" />
              ) : (
                <div className={styles.thumbFallback}>{value}</div>
              )}
              <div className={styles.replaceOverlay}>Replace</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className={styles.meta}>
            {metaName !== undefined && metaName.length > 0 ? (
              <span className={styles.metaName}>{metaName}</span>
            ) : null}
            {metaName && metaSize !== undefined ? (
              <span className={styles.metaDot}> · </span>
            ) : null}
            {metaSize !== undefined ? <span>{formatFileSize(metaSize)}</span> : null}
            <button
              type="button"
              className={styles.remove}
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
}
