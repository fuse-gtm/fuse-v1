import { isDefined } from 'twenty-shared/utils';

import {
  type CurrentUser,
  currentUserState,
} from '@/auth/states/currentUserState';
import {
  type CurrentWorkspace,
  currentWorkspaceState,
} from '@/auth/states/currentWorkspaceState';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';

import { useCallback } from 'react';
import {
  FeatureFlagKey,
  OnboardingStatus,
  PermissionFlagType,
} from '~/generated-metadata/graphql';
import { useStore } from 'jotai';

type GetNextOnboardingStatusArgs = {
  currentUser: CurrentUser | null;
  currentWorkspace: CurrentWorkspace | null;
  calendarBookingPageId: string | null;
  isAccountSyncEnabled: boolean;
  isPartnerOsEnabled: boolean;
};

const getNextOnboardingStatus = ({
  currentUser,
  currentWorkspace,
  calendarBookingPageId,
  isAccountSyncEnabled,
  isPartnerOsEnabled,
}: GetNextOnboardingStatusArgs) => {
  if (currentUser?.onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION) {
    return OnboardingStatus.PROFILE_CREATION;
  }

  if (currentUser?.onboardingStatus === OnboardingStatus.PROFILE_CREATION) {
    if (isPartnerOsEnabled) {
      return OnboardingStatus.PARTNER_PROFILE;
    }
    if (currentWorkspace?.workspaceMembersCount === 1) {
      if (isAccountSyncEnabled) {
        return OnboardingStatus.SYNC_EMAIL;
      }
      return OnboardingStatus.INVITE_TEAM;
    }
    return OnboardingStatus.COMPLETED;
  }

  if (currentUser?.onboardingStatus === OnboardingStatus.PARTNER_PROFILE) {
    if (currentWorkspace?.workspaceMembersCount === 1) {
      if (isAccountSyncEnabled) {
        return OnboardingStatus.SYNC_EMAIL;
      }
      return OnboardingStatus.INVITE_TEAM;
    }
    return OnboardingStatus.COMPLETED;
  }

  if (
    currentUser?.onboardingStatus === OnboardingStatus.SYNC_EMAIL &&
    currentWorkspace?.workspaceMembersCount === 1
  ) {
    return OnboardingStatus.INVITE_TEAM;
  }
  if (currentUser?.onboardingStatus === OnboardingStatus.INVITE_TEAM) {
    return isDefined(calendarBookingPageId)
      ? OnboardingStatus.BOOK_ONBOARDING
      : OnboardingStatus.COMPLETED;
  }
  if (currentUser?.onboardingStatus === OnboardingStatus.BOOK_ONBOARDING) {
    return OnboardingStatus.COMPLETED;
  }
  return OnboardingStatus.COMPLETED;
};

export const useSetNextOnboardingStatus = () => {
  const store = useStore();
  const currentUser = useAtomStateValue(currentUserState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const calendarBookingPageId = useAtomStateValue(calendarBookingPageIdState);
  const permissionMap = usePermissionFlagMap();
  const isAccountSyncEnabled =
    permissionMap[PermissionFlagType.CONNECTED_ACCOUNTS];
  const isPartnerOsEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_PARTNER_OS_ENABLED,
  );

  return useCallback(() => {
    const nextOnboardingStatus = getNextOnboardingStatus({
      currentUser,
      currentWorkspace,
      calendarBookingPageId,
      isAccountSyncEnabled,
      isPartnerOsEnabled,
    });
    store.set(currentUserState.atom, (current) => {
      if (isDefined(current)) {
        return {
          ...current,
          onboardingStatus: nextOnboardingStatus,
        };
      }
      return current;
    });
  }, [
    currentUser,
    currentWorkspace,
    calendarBookingPageId,
    isAccountSyncEnabled,
    isPartnerOsEnabled,
    store,
  ]);
};
