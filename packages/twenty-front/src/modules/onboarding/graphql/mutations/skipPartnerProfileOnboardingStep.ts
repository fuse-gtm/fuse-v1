import { gql } from '@apollo/client';

export const SKIP_PARTNER_PROFILE_ONBOARDING_STEP = gql`
  mutation SkipPartnerProfileOnboardingStep {
    skipPartnerProfileOnboardingStep {
      success
    }
  }
`;
