import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledPill = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.light};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.secondary};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
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
