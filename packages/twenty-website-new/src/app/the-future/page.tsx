import { FusePageShell } from '@/app/_components/FusePageShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Future | Fuse',
  description:
    'Why partner-led teams need AI-native systems for discovery, scoring, and engagement.',
};

export default function TheFuturePage() {
  return (
    <FusePageShell
      eyebrow="The future"
      title="The partner system cannot stay passive."
      body="AI only gets useful when the system knows who matters, why they matter, and what should happen next. Fuse is built for that operating model: discover, score, engage, and learn."
    />
  );
}
