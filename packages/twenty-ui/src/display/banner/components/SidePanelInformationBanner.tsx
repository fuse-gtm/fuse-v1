import { styled } from '@linaria/react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from '@ui/theme-constants';
import {
  IconAlertTriangle,
  IconInfoCircle,
} from '../../icon/components/TablerIcons';
import { AppTooltip } from '../../tooltip/AppTooltip';

const StyledBanner = styled.div`
  align-items: center;
  background-color: ${themeCssVariables.accent.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  box-sizing: border-box;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]};
  width: 100%;
`;

const StyledIconContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.color.blue};
  display: flex;
  flex-shrink: 0;
  height: 16px;
  justify-content: center;
  width: 16px;
`;

const StyledMessage = styled.p`
  color: ${themeCssVariables.color.blue};
  flex-grow: 1;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-style: normal;
  font-weight: ${themeCssVariables.font.weight.medium};
  line-height: 1.4;
  margin: 0;
  min-width: 0;
`;

export type SidePanelInformationBannerProps = {
  message: string;
  className?: string;
  variant?: 'default' | 'warning';
  tooltipMessage?: string;
};

export const SidePanelInformationBanner = ({
  message,
  className,
  variant = 'default',
  tooltipMessage,
}: SidePanelInformationBannerProps) => {
  const bannerContent = (
    <StyledBanner className={className}>
      <StyledIconContainer>
        {variant === 'default' ? (
          <IconInfoCircle size={16} />
        ) : (
          <IconAlertTriangle size={16} />
        )}
      </StyledIconContainer>
      <StyledMessage>{message}</StyledMessage>
    </StyledBanner>
  );

  if (isDefined(tooltipMessage)) {
    return (
      <AppTooltip content={tooltipMessage} place="bottom">
        {bannerContent}
      </AppTooltip>
    );
  }

  return bannerContent;
};
