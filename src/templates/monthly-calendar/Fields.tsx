import { TextField } from '../../components/fields/TextField';
import type { FieldsProps } from '../types';
import { asArray, asString } from '../shared/cardParts';
import groupStyles from '../shared/groupStyles.module.css';

/* Monthly Calendar form fields.
   Mirrors buildMonthlyCalendarFields (Story 2 only — Story 1 Overview was
   removed per Phase 4b spec). Single card with header + event list. */

type EventRow = {
  info_pill: string;
  date_start: string;
  date_end: string;
  month_label: string;
  title: string;
  sub: string;
};

const BLANK_EVENT: EventRow = {
  info_pill: '',
  date_start: '',
  date_end: '',
  month_label: '',
  title: '',
  sub: '',
};

export function MonthlyCalendarFields({ card, onPatch }: FieldsProps) {
  const eventsRaw = asArray<Record<string, unknown>>(card.events);
  const events: EventRow[] = eventsRaw.map((e) => ({
    info_pill: asString(e.info_pill),
    date_start: asString(e.date_start),
    date_end: asString(e.date_end),
    month_label: asString(e.month_label),
    title: asString(e.title),
    sub: asString(e.sub),
  }));

  const updateEvent = (idx: number, patch: Partial<EventRow>) => {
    const next = events.map((e) => ({ ...e }));
    const existing = next[idx] ?? { ...BLANK_EVENT };
    next[idx] = { ...existing, ...patch };
    onPatch({ events: next });
  };

  const removeEvent = (idx: number) => {
    if (events.length <= 1) return;
    const next = events.slice();
    next.splice(idx, 1);
    onPatch({ events: next });
  };

  const addEvent = () => {
    if (events.length >= 15) return;
    onPatch({ events: [...events, { ...BLANK_EVENT }] });
  };

  return (
    <>
      <Group title="Header" hint="Info pill, title, subtitle">
        <TextField
          label="Info pill text"
          value={asString(card.info_pill)}
          onChange={(v) => onPatch({ info_pill: v })}
          placeholder="JUNE 2026"
        />
        <TextField
          label="Title"
          value={asString(card.title)}
          onChange={(v) => onPatch({ title: v })}
          placeholder="What is happening this month"
        />
        <TextField
          label="Subtitle"
          value={asString(card.subtitle)}
          onChange={(v) => onPatch({ subtitle: v })}
          placeholder="Workshops, expert series, and live events."
        />
      </Group>

      <Group
        title="Events"
        hint="One card per event. Date supports single day (e.g. 14) or range (e.g. 08-12)."
      >
        <div style={{ display: 'grid', gap: 10 }}>
          {events.map((ev, idx) => (
            <EventEditor
              key={idx}
              index={idx}
              event={ev}
              canRemove={events.length > 1}
              onUpdate={(patch) => updateEvent(idx, patch)}
              onRemove={() => removeEvent(idx)}
            />
          ))}
          {events.length < 15 ? (
            <button
              type="button"
              onClick={addEvent}
              style={{
                padding: '8px 12px',
                border: '1px dashed var(--border)',
                background: '#fff',
                borderRadius: 6,
                cursor: 'pointer',
                color: 'var(--text-2)',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
            >
              + Add event
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Max 15 events per card.
            </div>
          )}
        </div>
      </Group>
    </>
  );
}

function EventEditor({
  index,
  event,
  canRemove,
  onUpdate,
  onRemove,
}: {
  index: number;
  event: EventRow;
  canRemove: boolean;
  onUpdate: (patch: Partial<EventRow>) => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 10,
        background: '#fff',
        display: 'grid',
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-2)',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--p-stat-bg, #E0F2FE)',
            color: 'var(--p-cta, #0369A1)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {index + 1}
        </div>
        <div style={{ flex: 1 }}>Event {index + 1}</div>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove event ${index + 1}`}
            style={{
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-3)',
              fontSize: 16,
              padding: '2px 6px',
            }}
          >
            ×
          </button>
        ) : null}
      </div>
      <TextField
        label="Info pill"
        value={event.info_pill}
        onChange={(v) => onUpdate({ info_pill: v })}
        placeholder="WORKSHOP"
      />
      <div className={groupStyles.cols3}>
        <TextField
          label="Date start"
          value={event.date_start}
          onChange={(v) => onUpdate({ date_start: v })}
          placeholder="08"
        />
        <TextField
          label="Date end"
          value={event.date_end}
          onChange={(v) => onUpdate({ date_end: v })}
          placeholder="Leave blank for single day"
        />
        <TextField
          label="Month"
          value={event.month_label}
          onChange={(v) => onUpdate({ month_label: v })}
          placeholder="JUN"
        />
      </div>
      <TextField
        label="Title"
        value={event.title}
        onChange={(v) => onUpdate({ title: v })}
        placeholder="Event title. e.g. Kids Camp Begins"
      />
      <TextField
        label="Sub line"
        value={event.sub}
        onChange={(v) => onUpdate({ sub: v })}
        placeholder="Short description. e.g. 10-days program for ages 6-12"
      />
    </div>
  );
}

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={groupStyles.group}>
      <div className={groupStyles.head}>
        <div className={groupStyles.title}>{title}</div>
        {hint ? <div className={groupStyles.hint}>{hint}</div> : null}
      </div>
      <div className={groupStyles.body}>{children}</div>
    </div>
  );
}
