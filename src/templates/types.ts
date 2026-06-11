import type { ComponentType } from 'react';

/* Shared prop shapes for per-template field and card components.
   The registry uses these as the value type so individual templates
   can stay strictly typed without leaking template-specific shapes
   into the editor shell. */

export type FieldsProps = {
  card: Record<string, unknown>;
  cardIndex: number;
  variation?: string;
  onPatch: (patch: Record<string, unknown>) => void;
};

export type CardProps = {
  card: Record<string, unknown>;
  cardIndex: number;
  variation?: string;
};

export type TemplateFieldsComponent = ComponentType<FieldsProps>;
export type TemplateCardComponent = ComponentType<CardProps>;
