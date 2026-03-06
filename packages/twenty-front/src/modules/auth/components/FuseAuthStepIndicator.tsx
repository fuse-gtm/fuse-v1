import styled from '@emotion/styled';

const StyledPill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.border.radius.pill};
  background: ${({ theme }) => theme.background.transparent.light};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.secondary};
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
