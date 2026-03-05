import { StyledHeaderDropdownButton } from '@/ui/layout/dropdown/components/StyledHeaderDropdownButton';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { type Nullable } from 'twenty-shared/types';
import { Tag } from 'twenty-ui/components';
import { AppTooltip, TooltipDelay } from 'twenty-ui/display';

const StyledTag = styled(Tag)`
  width: 100%;
`;

const StyledHeader = styled(StyledHeaderDropdownButton)`
  padding: 0;
`;

export const RecordBoardColumnHeaderAggregateDropdownButton = ({
  dropdownId,
  value,
  tooltip,
}: {
  dropdownId: string;
  value?: Nullable<string | number>;
  tooltip?: Nullable<string>;
}) => {
  const isDropdownOpen = useAtomComponentStateValue(
    isDropdownOpenComponentState,
    dropdownId,
  );

  return (
    <AppTooltip
      content={tooltip ?? ''}
      noArrow
      place="right"
      delay={TooltipDelay.mediumDelay}
      hidden={isDropdownOpen}
    >
      <StyledHeader isUnfolded={isDropdownOpen}>
        <StyledTag
          text={value ? value.toString() : '-'}
          color="transparent"
          weight="regular"
        />
      </StyledHeader>
    </AppTooltip>
  );
};
