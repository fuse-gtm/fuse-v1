import { LinkButton } from '@/design-system/components';
import { FUSE_SIGN_IN_URL, FUSE_SIGN_UP_URL } from '@/lib/fuse-destinations';
import type { MenuScheme } from '@/sections/Menu/types';
import { theme } from '@/theme';
import { styled } from '@linaria/react';

const CtaContainer = styled.div`
  display: none;

  @media (min-width: ${theme.breakpoints.md}px) {
    align-items: center;
    column-gap: ${theme.spacing(2)};
    display: grid;
    grid-auto-flow: column;
  }
`;

type CtaProps = {
  scheme: MenuScheme;
};

export function Cta({ scheme }: CtaProps) {
  const buttonColor = scheme === 'primary' ? 'secondary' : 'primary';

  return (
    <CtaContainer>
      <LinkButton
        color={buttonColor}
        href={FUSE_SIGN_IN_URL}
        label="Log in"
        size="small"
        type="anchor"
        variant="outlined"
      />
      <LinkButton
        color={buttonColor}
        href={FUSE_SIGN_UP_URL}
        label="Get started"
        size="small"
        type="anchor"
        variant="contained"
      />
    </CtaContainer>
  );
}
