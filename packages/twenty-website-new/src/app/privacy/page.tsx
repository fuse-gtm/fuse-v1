import { FusePageShell } from '@/app/_components/FusePageShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy | Fuse',
  description: 'Privacy notes for the Fuse website.',
};

export default function PrivacyPage() {
  return (
    <FusePageShell
      eyebrow="Privacy"
      title="We keep the website simple while the product matures."
      body="This launch route is here so the Fuse site has the right public surface. The full legal policy should be finalized before production promotion."
    />
  );
}
