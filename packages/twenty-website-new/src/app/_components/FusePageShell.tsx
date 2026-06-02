import { MENU_DATA } from '@/app/_constants';
import { LinkButton } from '@/design-system/components';
import { FUSE_SIGN_UP_URL } from '@/lib/fuse-destinations';
import { Menu } from '@/sections/Menu/components';
import { theme } from '@/theme';
import { styled } from '@linaria/react';
import type { ReactNode } from 'react';

const PAGE_BACKGROUND_COLOR = '#F5F1EA';

const Page = styled.div`
  background: ${PAGE_BACKGROUND_COLOR};
  min-height: 100%;
`;

const Main = styled.main`
  display: grid;
  gap: ${theme.spacing(10)};
  margin: 0 auto;
  max-width: 1180px;
  padding: ${theme.spacing(16)} ${theme.spacing(5)};

  @media (min-width: ${theme.breakpoints.md}px) {
    padding: ${theme.spacing(22)} ${theme.spacing(10)};
  }
`;

const Header = styled.header`
  display: grid;
  gap: ${theme.spacing(5)};
  max-width: 860px;
`;

const Eyebrow = styled.p`
  color: ${theme.colors.highlight[100]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-family: ${theme.font.family.sans};
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: ${theme.font.weight.light};
  line-height: 0.95;
`;

const Body = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-size: clamp(1.1rem, 1.7vw, 1.4rem);
  line-height: 1.55;
  max-width: 720px;
`;

const Content = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};
`;

type FusePageShellProps = {
  body: string;
  children?: ReactNode;
  eyebrow: string;
  title: string;
};

export function FusePageShell({
  body,
  children,
  eyebrow,
  title,
}: FusePageShellProps) {
  return (
    <Page>
      <Menu.Root
        backgroundColor={PAGE_BACKGROUND_COLOR}
        scheme="primary"
        navItems={MENU_DATA.navItems}
        socialLinks={MENU_DATA.socialLinks}
      >
        <Menu.Logo scheme="primary" />
        <Menu.Nav scheme="primary" navItems={MENU_DATA.navItems} />
        <Menu.Social scheme="primary" socialLinks={MENU_DATA.socialLinks} />
        <Menu.Cta scheme="primary" />
      </Menu.Root>
      <Main>
        <Header>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Title>{title}</Title>
          <Body>{body}</Body>
          <LinkButton
            color="secondary"
            href={FUSE_SIGN_UP_URL}
            label="Get started"
            type="anchor"
            variant="contained"
          />
        </Header>
        {children ? <Content>{children}</Content> : null}
      </Main>
    </Page>
  );
}
