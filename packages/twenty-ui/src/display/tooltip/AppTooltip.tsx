import { styled } from '@linaria/react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { type ReactNode } from 'react';
import { themeCssVariables } from '@ui/theme-constants';

export enum TooltipPosition {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom',
}

export enum TooltipDelay {
  noDelay = '0ms',
  shortDelay = '300ms',
  mediumDelay = '500ms',
  longDelay = '1000ms',
}

const StyledTooltipContent = styled(RadixTooltip.Content)`
  backdrop-filter: ${themeCssVariables.blur.strong};
  background-color: ${themeCssVariables.color.transparent.gray11};
  border-radius: ${themeCssVariables.border.radius.sm};

  box-shadow: ${themeCssVariables.boxShadow.light};
  color: ${themeCssVariables.grayScale.gray1};

  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};

  max-width: 40%;
  overflow: visible;

  padding: ${themeCssVariables.spacing[2]};

  word-break: break-word;

  z-index: ${themeCssVariables.lastLayerZIndex};
`;

const StyledTooltipArrow = styled(RadixTooltip.Arrow)`
  fill: ${themeCssVariables.color.transparent.gray11};
`;

const getDelayMs = (delay: TooltipDelay): number => {
  switch (delay) {
    case TooltipDelay.noDelay:
      return 0;
    case TooltipDelay.shortDelay:
      return 300;
    case TooltipDelay.mediumDelay:
      return 500;
    case TooltipDelay.longDelay:
      return 1000;
  }
};

export type AppTooltipProps = {
  className?: string;
  content?: ReactNode;
  children: ReactNode;
  offset?: number;
  noArrow?: boolean;
  hidden?: boolean;
  place?: TooltipPosition | string;
  delay?: TooltipDelay;
  width?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const AppTooltip = ({
  className,
  content,
  children,
  offset = 5,
  noArrow = false,
  hidden = false,
  place = TooltipPosition.Bottom,
  delay = TooltipDelay.mediumDelay,
  width,
  isOpen,
  onOpenChange,
}: AppTooltipProps) => {
  const side = place as RadixTooltip.TooltipContentProps['side'];
  const delayMs = getDelayMs(delay);

  const isControlled = isOpen !== undefined;

  return (
    <RadixTooltip.Provider delayDuration={delayMs}>
      <RadixTooltip.Root
        open={hidden ? false : isControlled ? isOpen : undefined}
        onOpenChange={onOpenChange}
        delayDuration={delayMs}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <StyledTooltipContent
            className={className}
            side={side}
            sideOffset={offset}
            style={width ? { maxWidth: width } : undefined}
          >
            {content}
            {!noArrow && <StyledTooltipArrow />}
          </StyledTooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
