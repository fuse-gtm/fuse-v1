'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import type { PartnerProgramId } from '@/app/partners/_constants/partner-application-modal';
import { FUSE_PARTNER_APPLICATION_URL } from '@/lib/fuse-destinations';

type PartnerApplicationModalContextValue = {
  openPartnerApplicationModal: (programId?: PartnerProgramId) => void;
};

const PartnerApplicationModalContext =
  createContext<PartnerApplicationModalContextValue | null>(null);

export function usePartnerApplicationModal() {
  const value = useContext(PartnerApplicationModalContext);
  if (!value) {
    throw new Error(
      'usePartnerApplicationModal must be used within PartnerApplicationModalRoot',
    );
  }
  return value;
}

export function PartnerApplicationModalRoot({
  children,
}: {
  children: ReactNode;
}) {
  const openPartnerApplicationModal = useCallback(
    (_programId?: PartnerProgramId) => {
      window.location.assign(FUSE_PARTNER_APPLICATION_URL);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ openPartnerApplicationModal }),
    [openPartnerApplicationModal],
  );

  return (
    <PartnerApplicationModalContext.Provider value={contextValue}>
      {children}
    </PartnerApplicationModalContext.Provider>
  );
}
