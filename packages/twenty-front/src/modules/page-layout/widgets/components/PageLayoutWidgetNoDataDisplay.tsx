import { useCurrentWidget } from '@/page-layout/widgets/hooks/useCurrentWidget';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { AppTooltip, Status } from 'twenty-ui/display';
import { WidgetType } from '~/generated-metadata/graphql';

const StyledNoDataContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;
export const PageLayoutWidgetNoDataDisplay = () => {
  const widget = useCurrentWidget();

  const text = widget.type === WidgetType.IFRAME ? t`Invalid URL` : t`No Data`;
  const tooltipContent =
    widget.type === WidgetType.IFRAME
      ? t`Invalid URL. Click edit to configure this widget.`
      : t`No data available. Click edit to configure this widget.`;

  return (
    <StyledNoDataContainer>
      <AppTooltip content={tooltipContent} place="top">
        <div>
          <Status color="red" text={text} />
        </div>
      </AppTooltip>
    </StyledNoDataContainer>
  );
};
