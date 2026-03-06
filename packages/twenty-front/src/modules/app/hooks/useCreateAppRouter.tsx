import { AppRouterProviders } from '@/app/components/AppRouterProviders';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { VerifyLoginTokenEffect } from '@/auth/components/VerifyLoginTokenEffect';

import { VerifyEmailEffect } from '@/auth/components/VerifyEmailEffect';
import indexAppPath from '@/navigation/utils/indexAppPath';
import { BlankLayout } from '@/ui/layout/page/components/BlankLayout';
import { DefaultLayout } from '@/ui/layout/page/components/DefaultLayout';
import { AppPath } from 'twenty-shared/types';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { Authorize } from '~/pages/auth/Authorize';
import { PasswordReset } from '~/pages/auth/PasswordReset';
import { FuseCheckInbox } from '~/pages/auth/FuseCheckInbox';
import { FuseSignInUp } from '~/pages/auth/FuseSignInUp';
import { NotFound } from '~/pages/not-found/NotFound';
import { RecordIndexPage } from '~/pages/object-record/RecordIndexPage';
import { RecordShowPage } from '~/pages/object-record/RecordShowPage';
import { BookCall } from '~/pages/onboarding/BookCall';
import { BookCallDecision } from '~/pages/onboarding/BookCallDecision';
import { ChooseYourPlan } from '~/pages/onboarding/ChooseYourPlan';
import { FuseCreateProfile } from '~/pages/onboarding/FuseCreateProfile';
import { FuseCreateWorkspace } from '~/pages/onboarding/FuseCreateWorkspace';
import { FuseInviteTeam } from '~/pages/onboarding/FuseInviteTeam';
import { FuseSyncEmails } from '~/pages/onboarding/FuseSyncEmails';
import { PartnerProfile } from '~/pages/onboarding/PartnerProfile';
import { PaymentSuccess } from '~/pages/onboarding/PaymentSuccess';

export const useCreateAppRouter = (
  isFunctionSettingsEnabled?: boolean,
  isAdminPageEnabled?: boolean,
) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<AppRouterProviders />}
        // To switch state to `loading` temporarily to enable us
        // to set scroll position before the page is rendered
        loader={async () => Promise.resolve(null)}
      >
        <Route element={<DefaultLayout />}>
          <Route path={AppPath.Verify} element={<VerifyLoginTokenEffect />} />
          <Route path={AppPath.VerifyEmail} element={<VerifyEmailEffect />} />
          <Route path={AppPath.SignInUp} element={<FuseSignInUp />} />
          <Route path={AppPath.Invite} element={<FuseSignInUp />} />
          <Route path={AppPath.CheckInbox} element={<FuseCheckInbox />} />
          <Route path={AppPath.ResetPassword} element={<PasswordReset />} />
          <Route
            path={AppPath.CreateWorkspace}
            element={<FuseCreateWorkspace />}
          />
          <Route path={AppPath.CreateProfile} element={<FuseCreateProfile />} />
          <Route path={AppPath.PartnerProfile} element={<PartnerProfile />} />
          <Route path={AppPath.SyncEmails} element={<FuseSyncEmails />} />
          <Route path={AppPath.InviteTeam} element={<FuseInviteTeam />} />
          <Route path={AppPath.PlanRequired} element={<ChooseYourPlan />} />
          <Route
            path={AppPath.PlanRequiredSuccess}
            element={<PaymentSuccess />}
          />
          <Route
            path={AppPath.BookCallDecision}
            element={<BookCallDecision />}
          />
          <Route path={AppPath.BookCall} element={<BookCall />} />
          <Route path={indexAppPath.getIndexAppPath()} element={<></>} />
          <Route path={AppPath.RecordIndexPage} element={<RecordIndexPage />} />
          <Route path={AppPath.RecordShowPage} element={<RecordShowPage />} />
          <Route
            path={AppPath.SettingsCatchAll}
            element={
              <SettingsRoutes
                isFunctionSettingsEnabled={isFunctionSettingsEnabled}
                isAdminPageEnabled={isAdminPageEnabled}
              />
            }
          />
          <Route path={AppPath.NotFoundWildcard} element={<NotFound />} />
        </Route>
        <Route element={<BlankLayout />}>
          <Route path={AppPath.Authorize} element={<Authorize />} />
        </Route>
      </Route>,
    ),
  );
