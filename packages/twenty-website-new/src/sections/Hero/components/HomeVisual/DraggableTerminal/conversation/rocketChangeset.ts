// Static summary data retained for the hidden review panel. The visible
// landing-page demo uses product-facing result summaries instead.

export type FileChange = {
  path: string;
  added: number;
  removed: number;
};

export const ROCKET_CHANGESET: ReadonlyArray<FileChange> = [
  { path: 'Company results', added: 4, removed: 0 },
  {
    path: 'Person results',
    added: 4,
    removed: 0,
  },
  {
    path: 'Evidence signals',
    added: 4,
    removed: 0,
  },
  {
    path: 'Next moves',
    added: 4,
    removed: 0,
  },
  {
    path: 'Saved search',
    added: 1,
    removed: 0,
  },
];

export const CHANGESET_TOTALS = ROCKET_CHANGESET.reduce(
  (acc, file) => ({
    added: acc.added + file.added,
    removed: acc.removed + file.removed,
  }),
  { added: 0, removed: 0 },
);
