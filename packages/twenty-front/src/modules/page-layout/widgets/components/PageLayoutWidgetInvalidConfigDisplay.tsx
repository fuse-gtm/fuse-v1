import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { AppTooltip, Status } from 'twenty-ui/display';

const StyledInvalidConfigContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const PageLayoutWidgetInvalidConfigDisplay = () => {
  const text = t`Invalid Configuration`;
  const tooltipContent = t`Invalid configuration. Click edit to configure this widget.`;

  return (
    <StyledInvalidConfigContainer>
      <AppTooltip content={tooltipContent} place="top">
        <div>
          <Status color="red" text={text} />
        </div>
      </AppTooltip>
    </StyledInvalidConfigContainer>
  );
};
