import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';

type OnboardingProgressBarProps = {
  totalSteps: number;
  currentStep: number;
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledBarContainer = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
`;

const StyledSegment = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${({ isActive, isCompleted }) =>
    isCompleted || isActive
      ? themeCssVariables.color.blue
      : themeCssVariables.background.quaternary};
  opacity: ${({ isActive }) => (isActive ? 0.7 : 1)};
  transition: background 0.2s ease, opacity 0.2s ease;
`;

const StyledStepCounter = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  white-space: nowrap;
  user-select: none;
`;

export const OnboardingProgressBar = ({
  totalSteps,
  currentStep,
}: OnboardingProgressBarProps) => {
  return (
    <StyledContainer role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={totalSteps}>
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
