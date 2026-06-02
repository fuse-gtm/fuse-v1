'use client';

import {
  BaseButton,
  buttonBaseStyles,
} from '@/design-system/components/Button/BaseButton';
import { FUSE_PARTNER_APPLICATION_URL } from '@/lib/fuse-destinations';
import { styled } from '@linaria/react';

const StyledTrigger = styled.a`
  ${buttonBaseStyles}
`;

type BecomePartnerButtonProps = {
  color?: 'primary' | 'secondary';
  label?: string;
  variant?: 'contained' | 'outlined';
};

export function BecomePartnerButton({
  color = 'secondary',
  label = 'Become a partner',
  variant = 'contained',
}: BecomePartnerButtonProps) {
  return (
    <StyledTrigger
      data-color={color}
      data-variant={variant}
      href={FUSE_PARTNER_APPLICATION_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <BaseButton color={color} label={label} variant={variant} />
    </StyledTrigger>
  );
}
