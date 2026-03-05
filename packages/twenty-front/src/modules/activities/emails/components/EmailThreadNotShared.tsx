import { useContext } from 'react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { AppTooltip, IconLock, TooltipDelay } from 'twenty-ui/display';
import { ThemeContext } from 'twenty-ui/theme';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { MessageChannelVisibility } from '~/generated/graphql';

const StyledContainer = styled.div<{ isCompact?: boolean }>`
  align-items: center;
  display: flex;
  flex: ${({ isCompact }) => (isCompact ? '0 0 auto' : '1 0 0')};
  gap: ${themeCssVariables.spacing[1]};
  height: 20px;
  margin-left: auto;
  width: ${({ isCompact }) => (isCompact ? 'auto' : '100%')};
  min-width: ${themeCssVariables.spacing[21]};
  padding: ${themeCssVariables.spacing[0]} ${themeCssVariables.spacing[1]};

  border-radius: 4px;
  border: 1px solid ${themeCssVariables.border.color.light};
  background: ${themeCssVariables.background.transparent.lighter};

  color: ${themeCssVariables.font.color.tertiary};
  font-weight: ${themeCssVariables.font.weight.regular};
  font-size: ${themeCssVariables.font.size.sm};
  flex: 1;
`;

type EmailThreadNotSharedProps = {
  visibility: MessageChannelVisibility;
};

export const EmailThreadNotShared = ({
  visibility,
}: EmailThreadNotSharedProps) => {
  const { t } = useLingui();
  const { theme } = useContext(ThemeContext);
  const isCompact = visibility === MessageChannelVisibility.SUBJECT;

  return (
    <AppTooltip
      content={t`Only the subject is shared`}
      delay={TooltipDelay.mediumDelay}
      noArrow
      place="bottom"
      hidden={visibility !== MessageChannelVisibility.SUBJECT}
    >
      <StyledContainer isCompact={isCompact}>
        <IconLock size={theme.icon.size.sm} />
        {t`Not shared`}
      </StyledContainer>
    </AppTooltip>
  );
};
