import { BLOCKED_EMAIL_DOMAINS } from '@/onboarding/constants/BlockedEmailDomains';
import { useLingui } from '@lingui/react/macro';
import { useCallback } from 'react';

type FuseEmailValidationResult = {
  isValid: boolean;
  error: string | null;
};

export const useFuseEmailValidation = () => {
  const { t } = useLingui();

  const validateEmail = useCallback(
    (email: string): FuseEmailValidationResult => {
      if (!email || !email.includes('@')) {
        return { isValid: false, error: null };
      }

      const domain = email.split('@')[1]?.toLowerCase();

      if (!domain) {
        return { isValid: false, error: null };
      }

      if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
        return {
          isValid: false,
          error: t`Please retry with a company email`,
        };
      }

      return { isValid: true, error: null };
    },
    [t],
  );

  return { validateEmail };
};
