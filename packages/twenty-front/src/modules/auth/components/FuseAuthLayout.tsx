import { FuseAuthStepIndicator } from '@/auth/components/FuseAuthStepIndicator';
import { styled } from '@linaria/react';
import React from 'react';
import { AnimatedEaseIn } from 'twenty-ui/utilities';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  background: ${themeCssVariables.background.primary};
  display: flex;
  height: 100dvh;
  width: 100%;
`;

const StyledLeftPanel = styled.div`
  display: flex;
  flex: 1 1 50%;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[10]} ${themeCssVariables.spacing[16]};

  @media (max-width: 768px) {
    flex: 1 1 100%;
    padding: ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[4]};
  }
`;

const StyledRightPanel = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-left: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  flex: 1 1 50%;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledFormContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 auto;
  max-width: 420px;
  width: 100%;
`;

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${themeCssVariables.spacing[10]};
`;

const StyledLogoContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledLogoImg = styled.img`
  height: 24px;
  width: auto;
`;

const StyledTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledSubtitle = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
  margin-bottom: ${themeCssVariables.spacing[8]};
`;

const StyledContent = styled.div`
  flex: 1;
`;

const StyledFooter = styled.div`
  margin-top: auto;
  padding-top: ${themeCssVariables.spacing[6]};
`;

type FuseAuthLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  previewContent?: React.ReactNode;
  footer?: React.ReactNode;
};

export const FuseAuthLayout = ({
  children,
  title,
  subtitle,
  stepNumber,
  totalSteps = 5,
  previewContent,
  footer,
}: FuseAuthLayoutProps) => {
  return (
    <StyledContainer>
      <StyledLeftPanel>
        <StyledFormContainer>
          <StyledHeader>
            <StyledLogoContainer>
              <StyledLogoImg src="/icons/fuse-logo.svg" alt="Fuse" />
            </StyledLogoContainer>
            {stepNumber !== undefined && (
              <FuseAuthStepIndicator
                currentStep={stepNumber}
                totalSteps={totalSteps}
              />
            )}
          </StyledHeader>
          <AnimatedEaseIn>
            {title && <StyledTitle>{title}</StyledTitle>}
            {subtitle && <StyledSubtitle>{subtitle}</StyledSubtitle>}
          </AnimatedEaseIn>
          <StyledContent>{children}</StyledContent>
          {footer !== undefined && footer !== null && (
            <StyledFooter>{footer}</StyledFooter>
          )}
        </StyledFormContainer>
      </StyledLeftPanel>
      {previewContent !== undefined && previewContent !== null && (
        <StyledRightPanel>{previewContent}</StyledRightPanel>
      )}
    </StyledContainer>
  );
};
