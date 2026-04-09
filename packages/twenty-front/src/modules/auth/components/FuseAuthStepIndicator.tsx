import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledPill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
  border-radius: ${themeCssVariables.border.radius.pill};
  background: ${themeCssVariables.background.transparent.light};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.secondary};
`;

type FuseAuthStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export const FuseAuthStepIndicator = ({
  currentStep,
  totalSteps,
}: FuseAuthStepIndicatorProps) => {
  return (
    <StyledPill>
      {currentStep}/{totalSteps}
    </StyledPill>
  );
};
