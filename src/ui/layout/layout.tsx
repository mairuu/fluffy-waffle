import { AppShell } from '@mantine/core';
import { IconBrowser, IconHeart, IconHistory } from '@tabler/icons';
import { LayoutHeader } from './layout-header';

export type LayoutProps = {
  withTransparentHeader?: boolean;
  tabs?: React.ReactNode;
  children: React.ReactNode;
};

const headerLinks = [
  { label: 'Browse', link: '/browse', icon: <IconBrowser /> },
  { label: 'Favorite', link: '/favorite', icon: <IconHeart /> },
  { label: 'History', link: '/history', icon: <IconHistory /> },
];

export const Layout = (props: LayoutProps) => {
  const { children, tabs, withTransparentHeader } = props;

  return (
    <AppShell
      fixed
      styles={(theme) => ({
        main: {
          paddingTop: 'calc(var(--mantine-header-height, 0px) + 16px)',
          paddingRight: 'calc(var(--mantine-aside-width, 0px) + 0px)',
          paddingBottom: ' calc(var(--mantine-footer-height, 0px) + 16px)',
          paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 0px)',

          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
      header={
        <LayoutHeader tabs={tabs} links={headerLinks} blend={withTransparentHeader} />
      }
    >
      {children}
    </AppShell>
  );
};
