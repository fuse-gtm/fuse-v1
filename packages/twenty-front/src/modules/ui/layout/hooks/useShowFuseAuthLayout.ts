import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

// Returns true for routes that should use the Fuse two-panel auth layout
// instead of the default AuthModal
export const useShowFuseAuthLayout = () => {
  const location = useLocation();

  return useMemo(() => {
    if (
      isMatchingLocation(location, AppPath.SignInUp) ||
      isMatchingLocation(location, AppPath.Invite) ||
      isMatchingLocation(location, AppPath.CreateWorkspace) ||
      isMatchingLocation(location, AppPath.CreateProfile) ||
      isMatchingLocation(location, AppPath.SyncEmails) ||
      isMatchingLocation(location, AppPath.InviteTeam) ||
      isMatchingLocation(location, AppPath.CheckInbox)
    ) {
      return true;
    }

    return false;
  }, [location]);
};
