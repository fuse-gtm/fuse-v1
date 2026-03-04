import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useReadWorkspaceUrlFromCurrentLocation } from '@/domain-manager/hooks/useReadWorkspaceUrlFromCurrentLocation';
import { useLastAuthenticatedWorkspaceDomain } from '@/domain-manager/hooks/useLastAuthenticatedWorkspaceDomain';
import { useRedirectToWorkspaceDomain } from '@/domain-manager/hooks/useRedirectToWorkspaceDomain';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { lastAuthenticatedWorkspaceDomainState } from '@/domain-manager/states/lastAuthenticatedWorkspaceDomainState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useEffect, useCallback } from 'react';

import { useInitializeQueryParamState } from '@/app/hooks/useInitializeQueryParamState';
import { useGetPublicWorkspaceDataByDomain } from '@/domain-manager/hooks/useGetPublicWorkspaceDataByDomain';
import { useIsCurrentLocationOnDefaultDomain } from '@/domain-manager/hooks/useIsCurrentLocationOnDefaultDomain';
import { isDefined } from 'twenty-shared/utils';
import { type WorkspaceUrls } from '~/generated-metadata/graphql';
import { getWorkspaceUrl } from '~/utils/getWorkspaceUrl';

export const WorkspaceProviderEffect = () => {
  const { data: getPublicWorkspaceData } = useGetPublicWorkspaceDataByDomain();

  const lastAuthenticatedWorkspaceDomain = useAtomStateValue(
    lastAuthenticatedWorkspaceDomainState,
  );

  const { redirectToWorkspaceDomain } = useRedirectToWorkspaceDomain();
  const { isDefaultDomain } = useIsCurrentLocationOnDefaultDomain();

  const { currentLocationHostname } = useReadWorkspaceUrlFromCurrentLocation();

  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  const { initializeQueryParamState } = useInitializeQueryParamState();
  const { setLastAuthenticateWorkspaceDomain } =
    useLastAuthenticatedWorkspaceDomain();
  const domainConfiguration = useAtomStateValue(domainConfigurationState);

  const isValidWorkspaceUrl = useCallback((workspaceUrl: string) => {
    const frontDomain = domainConfiguration.frontDomain?.toLowerCase().trim();

    if (!frontDomain) {
      return false;
    }

    const requiredHostSuffix = `.${frontDomain}`;

    try {
      const parsedWorkspaceUrl = new URL(workspaceUrl);
      const hostname = parsedWorkspaceUrl.hostname.toLowerCase();
      const hasSubdomainOnFrontDomain =
        hostname.length > requiredHostSuffix.length &&
        hostname.endsWith(requiredHostSuffix);

      return (
        ['https:', 'http:'].includes(parsedWorkspaceUrl.protocol) &&
        !hostname.includes('..') &&
        parsedWorkspaceUrl.username === '' &&
        parsedWorkspaceUrl.password === '' &&
        hasSubdomainOnFrontDomain
      );
    } catch {
      return false;
    }
  }, [domainConfiguration.frontDomain]);

  const isWorkspaceHostnameMatchCurrentLocationHostname = useCallback(
    (workspaceUrls: WorkspaceUrls) => {
      const { hostname } = new URL(getWorkspaceUrl(workspaceUrls));
      return hostname === currentLocationHostname;
    },
    [currentLocationHostname],
  );

  useEffect(() => {
    if (
      isMultiWorkspaceEnabled &&
      isDefined(getPublicWorkspaceData) &&
      !isWorkspaceHostnameMatchCurrentLocationHostname(
        getPublicWorkspaceData.workspaceUrls,
      )
    ) {
      redirectToWorkspaceDomain(
        getWorkspaceUrl(getPublicWorkspaceData.workspaceUrls),
      );
    }
  }, [
    isMultiWorkspaceEnabled,
    redirectToWorkspaceDomain,
    getPublicWorkspaceData,
    currentLocationHostname,
    isWorkspaceHostnameMatchCurrentLocationHostname,
  ]);

  useEffect(() => {
    if (!domainConfiguration.frontDomain) {
      return;
    }

    if (
      isMultiWorkspaceEnabled &&
      isDefaultDomain &&
      isDefined(lastAuthenticatedWorkspaceDomain) &&
      'workspaceUrl' in lastAuthenticatedWorkspaceDomain &&
      isDefined(lastAuthenticatedWorkspaceDomain?.workspaceUrl)
    ) {
      if (!isValidWorkspaceUrl(lastAuthenticatedWorkspaceDomain.workspaceUrl)) {
        setLastAuthenticateWorkspaceDomain(null);

        return;
      }

      initializeQueryParamState();
      redirectToWorkspaceDomain(lastAuthenticatedWorkspaceDomain.workspaceUrl);
    }
  }, [
    isMultiWorkspaceEnabled,
    isDefaultDomain,
    lastAuthenticatedWorkspaceDomain,
    redirectToWorkspaceDomain,
    initializeQueryParamState,
    setLastAuthenticateWorkspaceDomain,
    isValidWorkspaceUrl,
    domainConfiguration.frontDomain,
  ]);

  return <></>;
};
