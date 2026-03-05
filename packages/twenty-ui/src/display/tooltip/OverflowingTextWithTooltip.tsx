import { styled } from '@linaria/react';
import { type ReactNode, useRef, useState } from 'react';

import { isNonEmptyString } from '@sniptt/guards';
import { THEME_COMMON } from '@ui/theme';
import { isDefined } from 'twenty-shared/utils';
import { AppTooltip, TooltipDelay } from './AppTooltip';

const spacing4 = THEME_COMMON.spacing(4);

const StyledOverflowingMultilineText = styled.div<{
  isContentOverflowing: boolean;
  size: 'large' | 'small';
  displayedMaxRows: number;
}>`
  cursor: ${({ isContentOverflowing }) =>
    isContentOverflowing ? 'pointer' : 'inherit'};
  font-family: inherit;
  font-size: inherit;

  font-weight: inherit;
  max-width: 100%;
  overflow: hidden;
  text-decoration: inherit;

  text-overflow: ellipsis;
  height: ${({ size }) => (size === 'large' ? spacing4 : 'auto')};

  -webkit-line-clamp: ${({ displayedMaxRows }) =>
    displayedMaxRows ? displayedMaxRows.toString() : '1'};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: pre-wrap;
`;

const StyledOverflowingText = styled.div<{
  isContentOverflowing: boolean;
  size: 'large' | 'small';
}>`
  cursor: ${({ isContentOverflowing }) =>
    isContentOverflowing ? 'pointer' : 'inherit'};
  font-family: inherit;
  font-size: inherit;

  font-weight: inherit;
  max-width: 100%;
  text-decoration: inherit;

  text-overflow: ellipsis;
  overflow: hidden;
  height: ${({ size }) => (size === 'large' ? spacing4 : 'auto')};

  white-space: nowrap;
`;

const StyledPre = styled.pre`
  font-family: inherit;
  white-space: pre-wrap;
`;

type OverflowingTextWithTooltipProps = {
  size?: 'large' | 'small';
  isTooltipMultiline?: boolean;
  displayedMaxRows?: number;
  tooltipDelay?: TooltipDelay;
} & (
  | {
      text: string | null | undefined;
      tooltipContent?: never;
    }
  | {
      text: Exclude<ReactNode, string | null | undefined>;
      tooltipContent: string;
    }
);

export const OverflowingTextWithTooltip = ({
  size = 'small',
  text,
  isTooltipMultiline,
  displayedMaxRows,
  tooltipContent,
  tooltipDelay = TooltipDelay.mediumDelay,
}: OverflowingTextWithTooltipProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const isOverflowing = textRef.current
        ? textRef.current?.scrollHeight > textRef.current?.clientHeight ||
          textRef.current.scrollWidth > textRef.current.clientWidth
        : false;

      setIsTitleOverflowing(isOverflowing);
    } else {
      setIsTitleOverflowing(false);
    }
  };

  const tooltipText = isNonEmptyString(tooltipContent)
    ? tooltipContent
    : isNonEmptyString(text)
      ? text
      : null;

  const tooltipBody =
    isDefined(tooltipText) && isTooltipMultiline ? (
      <StyledPre>{tooltipText}</StyledPre>
    ) : (
      tooltipText
    );

  const textElement = isDefined(displayedMaxRows) ? (
    <StyledOverflowingMultilineText
      data-testid="tooltip"
      isContentOverflowing={isTitleOverflowing}
      size={size}
      displayedMaxRows={displayedMaxRows}
      ref={textRef}
    >
      {text}
    </StyledOverflowingMultilineText>
  ) : (
    <StyledOverflowingText
      data-testid="tooltip"
      isContentOverflowing={isTitleOverflowing}
      size={size}
      ref={textRef}
    >
      {text}
    </StyledOverflowingText>
  );

  if (!isDefined(tooltipText)) {
    return textElement;
  }

  return (
    <AppTooltip
      content={tooltipBody}
      offset={5}
      noArrow
      place="bottom"
      delay={tooltipDelay}
      isOpen={isTitleOverflowing}
      onOpenChange={handleOpenChange}
    >
      {textElement}
    </AppTooltip>
  );
};
