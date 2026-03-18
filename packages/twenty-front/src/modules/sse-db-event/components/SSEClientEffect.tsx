import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { useHandleSseClientConnectionRetry } from '@/sse-db-event/hooks/useHandleSseClientConnectionRetry';
import { activeQueryListenersState } from '@/sse-db-event/states/activeQueryListenersState';
import { sseClientState } from '@/sse-db-event/states/sseClientState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyArray } from '@sniptt/guards';
import { createClient } from 'graphql-sse';
import { useCallback, useEffect } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { useStore } from 'jotai';

export const SSEClientEffect = () => {
  const store = useStore();
  const isLoggedIn = useIsLogged();
  const [sseClient, setSseClient] = useAtomState(sseClientState);
  const tokenPair = useAtomStateValue(tokenPairState);
  const hasAccessToken = isDefined(
    tokenPair?.accessOrWorkspaceAgnosticToken?.token,
  );

  const handleSSEClientConnected = useCallback(() => {
    const currentActiveQueryListeners = store.get(
      activeQueryListenersState.atom,
    );

    if (isNonEmptyArray(currentActiveQueryListeners)) {
      store.set(activeQueryListenersState.atom, []);
    }
  }, [store]);

  const { handleSseClientConnectionRetry } =
    useHandleSseClientConnectionRetry();

  useEffect(() => {
    if (isLoggedIn && hasAccessToken && !isDefined(sseClient)) {
      const newSseClient = createClient({
        url: `${REACT_APP_SERVER_BASE_URL}/metadata`,
        headers: () => {
          const currentTokenPair = store.get(tokenPairState.atom);
          const token = currentTokenPair?.accessOrWorkspaceAgnosticToken?.token;

          return {
            Authorization: token ? `Bearer ${token}` : '',
          };
        },
        on: {
          connected: handleSSEClientConnected,
        },
        retryAttempts: Infinity,
        retry: (retryCount: number) =>
          handleSseClientConnectionRetry(retryCount),
      });

      setSseClient(newSseClient);
    }
  }, [
    handleSSEClientConnected,
    hasAccessToken,
    isLoggedIn,
    setSseClient,
    sseClient,
    store,
    tokenPair,
    handleSseClientConnectionRetry,
  ]);

  return null;
};
