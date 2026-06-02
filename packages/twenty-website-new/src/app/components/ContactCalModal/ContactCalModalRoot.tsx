'use client';

import { FUSE_CONTACT_URL } from '@/lib/fuse-destinations';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

type ContactCalModalContextValue = {
  openContactCalModal: () => void;
};

const ContactCalModalContext =
  createContext<ContactCalModalContextValue | null>(null);

export function useContactCalModal() {
  const value = useContext(ContactCalModalContext);
  if (!value) {
    throw new Error(
      'useContactCalModal must be used within ContactCalModalRoot',
    );
  }
  return value;
}

export function ContactCalModalRoot({ children }: { children: ReactNode }) {
  const openContactCalModal = useCallback(() => {
    window.location.assign(FUSE_CONTACT_URL);
  }, []);

  const contextValue = useMemo(
    () => ({ openContactCalModal }),
    [openContactCalModal],
  );

  return (
    <ContactCalModalContext.Provider value={contextValue}>
      {children}
    </ContactCalModalContext.Provider>
  );
}
