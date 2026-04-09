import { styled } from '@linaria/react';
import { Trans } from '@lingui/react/macro';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledPreviewContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: ${themeCssVariables.spacing[10]};
  width: 100%;
`;

const StyledWelcomeText = styled.div`
  max-width: 360px;
  text-align: center;
`;

const StyledWelcomeTitle = styled.h2`
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledWelcomeDescription = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.6;
  margin: 0;
`;

const StyledDashboardSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledSkeletonRow = styled.div<{ width?: string; height?: string }>`
  background: ${themeCssVariables.background.transparent.lighter};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: ${({ height }) => height ?? '12px'};
  width: ${({ width }) => width ?? '100%'};
`;

const StyledSkeletonCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledSkeletonAvatar = styled.div`
  background: ${themeCssVariables.background.transparent.light};
  border-radius: ${themeCssVariables.border.radius.rounded};
  flex-shrink: 0;
  height: 32px;
  width: 32px;
`;

export type FuseOnboardingPreviewVariant =
  | 'welcome'
  | 'profile'
  | 'workspace'
  | 'sync'
  | 'partner-profile'
  | 'invite';

type FuseOnboardingPreviewProps = {
  variant: FuseOnboardingPreviewVariant;
};

const WelcomePreview = () => (
  <StyledWelcomeText>
    <StyledWelcomeTitle>
      <Trans>Welcome to Fuse</Trans>
    </StyledWelcomeTitle>
    <StyledWelcomeDescription>
      <Trans>
        The partnerships operating system for modern GTM teams. Manage partner
        discovery, co-sell motions, and attribution — all in one place.
      </Trans>
    </StyledWelcomeDescription>
  </StyledWelcomeText>
);

const DashboardSkeletonPreview = () => (
  <StyledDashboardSkeleton>
    <StyledSkeletonCard>
      <StyledSkeletonHeader>
        <StyledSkeletonAvatar />
        <div style={{ flex: 1 }}>
          <StyledSkeletonRow width="40%" height="10px" />
          <div style={{ height: 6 }} />
          <StyledSkeletonRow width="60%" height="8px" />
        </div>
      </StyledSkeletonHeader>
      <StyledSkeletonRow />
      <StyledSkeletonRow width="80%" />
      <StyledSkeletonRow width="55%" />
    </StyledSkeletonCard>
    <StyledSkeletonCard>
      <StyledSkeletonHeader>
        <StyledSkeletonAvatar />
        <div style={{ flex: 1 }}>
          <StyledSkeletonRow width="35%" height="10px" />
          <div style={{ height: 6 }} />
          <StyledSkeletonRow width="50%" height="8px" />
        </div>
      </StyledSkeletonHeader>
      <StyledSkeletonRow />
      <StyledSkeletonRow width="70%" />
    </StyledSkeletonCard>
    <StyledSkeletonCard>
      <StyledSkeletonRow width="45%" height="10px" />
      <div style={{ height: 4 }} />
      <StyledSkeletonRow />
      <StyledSkeletonRow width="65%" />
      <StyledSkeletonRow width="40%" />
    </StyledSkeletonCard>
  </StyledDashboardSkeleton>
);

export const FuseOnboardingPreview = ({
  variant,
}: FuseOnboardingPreviewProps) => {
  return (
    <StyledPreviewContainer>
      {variant === 'welcome' ? (
        <WelcomePreview />
      ) : (
        <DashboardSkeletonPreview />
      )}
    </StyledPreviewContainer>
  );
};
