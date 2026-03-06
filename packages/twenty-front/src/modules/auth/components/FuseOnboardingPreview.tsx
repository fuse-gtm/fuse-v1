import styled from '@emotion/styled';
import { Trans } from '@lingui/react/macro';

const StyledPreviewContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(10)};
  width: 100%;
`;

const StyledWelcomeText = styled.div`
  max-width: 360px;
  text-align: center;
`;

const StyledWelcomeTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const StyledWelcomeDescription = styled.p`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.md};
  line-height: 1.6;
  margin: 0;
`;

const StyledDashboardSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledSkeletonRow = styled.div<{ width?: string; height?: string }>`
  background: ${({ theme }) => theme.background.transparent.lighter};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  height: ${({ height }) => height ?? '12px'};
  width: ${({ width }) => width ?? '100%'};
`;

const StyledSkeletonCard = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StyledSkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledSkeletonAvatar = styled.div`
  background: ${({ theme }) => theme.background.transparent.light};
  border-radius: ${({ theme }) => theme.border.radius.rounded};
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
