import { ModalStatefulWrapper } from '@/ui/layout/modal/components/ModalStatefulWrapper';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export const WELCOME_PRO_TRIAL_MODAL_ID = 'welcome-pro-trial';

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledBadge = styled.span`
  background: ${themeCssVariables.color.blue10};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.color.blue};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
`;

const StyledTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledDescription = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.6;
  margin: 0;
  max-width: 360px;
`;

const StyledFeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  list-style: none;
  margin: 0;
  max-width: 320px;
  padding: 0;
  width: 100%;
`;

const StyledFeatureItem = styled.li`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[3]};
  text-align: left;
`;

const StyledCheckmark = styled.span`
  color: ${themeCssVariables.color.green};
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.md};
`;

const StyledButtonContainer = styled.div`
  max-width: 280px;
  width: 100%;
`;

export const WelcomeProTrialModal = () => {
  const { t } = useLingui();
  const { closeModal } = useModal();

  const handleStart = () => {
    sessionStorage.setItem('fuse-welcome-modal-seen', 'true');
    closeModal(WELCOME_PRO_TRIAL_MODAL_ID);
  };

  return (
    <ModalStatefulWrapper
      modalInstanceId={WELCOME_PRO_TRIAL_MODAL_ID}
      size="small"
      padding="none"
      isClosable
      onClose={handleStart}
    >
      <StyledContent>
        <StyledBadge>{t`14-day Pro trial`}</StyledBadge>
        <StyledTitle>{t`Welcome to Fuse Pro`}</StyledTitle>
        <StyledDescription>
          {t`Your workspace is ready. Explore the full power of Fuse with a 14-day Pro trial — no credit card required.`}
        </StyledDescription>
        <StyledFeatureList>
          <StyledFeatureItem>
            <StyledCheckmark>✓</StyledCheckmark>
            {t`Partner discovery with AI-powered search`}
          </StyledFeatureItem>
          <StyledFeatureItem>
            <StyledCheckmark>✓</StyledCheckmark>
            {t`Co-sell and referral handoff tracking`}
          </StyledFeatureItem>
          <StyledFeatureItem>
            <StyledCheckmark>✓</StyledCheckmark>
            {t`Partner pipeline attribution reports`}
          </StyledFeatureItem>
          <StyledFeatureItem>
            <StyledCheckmark>✓</StyledCheckmark>
            {t`Unlimited team members`}
          </StyledFeatureItem>
        </StyledFeatureList>
        <StyledButtonContainer>
          <MainButton
            title={t`Start exploring`}
            onClick={handleStart}
            fullWidth
          />
        </StyledButtonContainer>
      </StyledContent>
    </ModalStatefulWrapper>
  );
};
