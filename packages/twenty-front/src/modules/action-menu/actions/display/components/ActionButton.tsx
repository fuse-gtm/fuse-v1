import { type ActionDisplayProps } from '@/action-menu/actions/display/components/ActionDisplay';
import { getActionLabel } from '@/action-menu/utils/getActionLabel';
import { isDefined } from 'twenty-shared/utils';
import { AppTooltip, TooltipDelay, TooltipPosition } from 'twenty-ui/display';
import { Button, IconButton } from 'twenty-ui/input';

export const ActionButton = ({
  action,
  onClick,
  to,
}: {
  action: ActionDisplayProps;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  to?: string;
}) => {
  const label = getActionLabel(action.label);

  const shortLabel = isDefined(action.shortLabel)
    ? getActionLabel(action.shortLabel)
    : undefined;

  const buttonAccent = action.isPrimaryCTA ? 'blue' : 'default';

  return (
    <>
      {action.shortLabel ? (
        <Button
          Icon={action.Icon}
          size="small"
          variant="secondary"
          accent={buttonAccent}
          to={to}
          onClick={onClick}
          title={shortLabel}
          ariaLabel={label}
        />
      ) : (
        <AppTooltip
          content={label}
          delay={TooltipDelay.longDelay}
          place={TooltipPosition.Bottom}
          offset={5}
          noArrow
        >
          <div key={action.key}>
            <IconButton
              Icon={action.Icon}
              size="small"
              variant="secondary"
              accent={buttonAccent}
              to={to}
              onClick={onClick}
              ariaLabel={label}
            />
          </div>
        </AppTooltip>
      )}
    </>
  );
};
