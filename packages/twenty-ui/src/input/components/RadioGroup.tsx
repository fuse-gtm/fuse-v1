import React from 'react';

import { type RadioProps } from './Radio';
import { themeCssVariables } from '@ui/theme-constants';

type RadioGroupProps = React.PropsWithChildren & {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  'aria-label'?: string;
};

export const RadioGroup = ({
  value,
  onChange,
  onValueChange,
  children,
  'aria-label': ariaLabel,
}: RadioGroupProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  return (
    <div role="radiogroup" aria-label={ariaLabel}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioProps>(child)) {
          return React.cloneElement(child, {
            style: { marginBottom: themeCssVariables.spacing[2] },
            checked: child.props.value === value,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </div>
  );
};
