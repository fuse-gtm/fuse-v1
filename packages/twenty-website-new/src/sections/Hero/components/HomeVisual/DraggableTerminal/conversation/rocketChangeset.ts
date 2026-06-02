// Static diff summary displayed after the assistant populates the cached Fuse
// partner-search demo. Matches the shape of an IDE / Claude Code changeset.

export type FileChange = {
  path: string;
  added: number;
  removed: number;
};

export const ROCKET_CHANGESET: ReadonlyArray<FileChange> = [
  { path: 'src/app/(home)/page.tsx', added: 214, removed: 42 },
  {
    path: 'src/sections/Hero/components/HomeVisual/DraggableTerminal/DraggableTerminal.tsx',
    added: 32,
    removed: 7,
  },
  {
    path: 'src/sections/Hero/components/HomeVisual/DraggableTerminal/TerminalPromptBox.tsx',
    added: 18,
    removed: 8,
  },
  {
    path: 'src/sections/Hero/components/HomeVisual/HomeVisual.tsx',
    added: 8,
    removed: 0,
  },
  {
    path: 'src/app/resources/[partnerType]/page.tsx',
    added: 64,
    removed: 16,
  },
];

export const CHANGESET_TOTALS = ROCKET_CHANGESET.reduce(
  (acc, file) => ({
    added: acc.added + file.added,
    removed: acc.removed + file.removed,
  }),
  { added: 0, removed: 0 },
);
