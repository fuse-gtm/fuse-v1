import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';

type OnboardingProgressBarProps = {
  totalSteps: number;
  currentStep: number;
};

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  margin-bottom: ${themeCssVariables.spacing[6]};
  width: 100%;
`;

const StyledBarContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 4px;
`;

const StyledSegment = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  background: ${({ isActive, isCompleted }) =>
    isCompleted || isActive
      ? themeCssVariables.color.blue
      : themeCssVariables.background.quaternary};
  border-radius: 2px;
  flex: 1;
  height: 4px;
  opacity: ${({ isActive }) => (isActive ? 0.7 : 1)};
  transition:
    background 0.2s ease,
    opacity 0.2s ease;
`;

const StyledStepCounter = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  user-select: none;
  white-space: nowrap;
`;

export const OnboardingProgressBar = ({
  totalSteps,
  currentStep,
}: OnboardingProgressBarProps) => {
  return (
    <StyledContainer
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemax={totalSteps}
    >
      <StyledBarContainer>
        {Array.from({ length: totalSteps }, (_, index) => (
          <StyledSegment
            key={index}
            isCompleted={index < currentStep}
            isActive={index === currentStep}
          />
        ))}
      </StyledBarContainer>
      <StyledStepCounter>
        {currentStep + 1}/{totalSteps}
      </StyledStepCounter>
    </StyledContainer>
  );
};
