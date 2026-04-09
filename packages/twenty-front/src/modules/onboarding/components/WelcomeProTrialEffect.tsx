import { currentUserState } from '@/auth/states/currentUserState';
import { WELCOME_PRO_TRIAL_MODAL_ID } from '@/onboarding/components/WelcomeProTrialModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useEffect, useState } from 'react';
import { OnboardingStatus } from '~/generated-metadata/graphql';

// Shows the Welcome Pro Trial modal once per session after onboarding completes.
// Uses sessionStorage to prevent re-showing within the same browser session.
export const WelcomeProTrialEffect = () => {
  const currentUser = useAtomStateValue(currentUserState);
  const { openModal } = useModal();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (hasOpened) {
      return;
    }

    const isOnboardingComplete =
      currentUser?.onboardingStatus === OnboardingStatus.COMPLETED;
    const hasSeenModal =
      sessionStorage.getItem('fuse-welcome-modal-seen') === 'true';

    if (isOnboardingComplete && !hasSeenModal) {
      setHasOpened(true);

      // Small delay to let the dashboard render first.
      const timer = setTimeout(() => {
        openModal(WELCOME_PRO_TRIAL_MODAL_ID);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentUser?.onboardingStatus, hasOpened, openModal]);

  return null;
};
