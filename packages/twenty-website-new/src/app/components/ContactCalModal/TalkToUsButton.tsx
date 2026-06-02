'use client';

import {
  BaseButton,
  buttonBaseStyles,
} from '@/design-system/components/Button/BaseButton';
import { FUSE_CONTACT_URL } from '@/lib/fuse-destinations';
import { styled } from '@linaria/react';

const StyledTrigger = styled.a`
  ${buttonBaseStyles}
`;

type TalkToUsButtonProps = {
  color: 'primary' | 'secondary';
  label: string;
  variant: 'contained' | 'outlined';
};

export function TalkToUsButton({ color, label, variant }: TalkToUsButtonProps) {
  return (
    <StyledTrigger
      data-color={color}
      data-variant={variant}
      href={FUSE_CONTACT_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <BaseButton color={color} label={label} variant={variant} />
    </StyledTrigger>
  );
}
