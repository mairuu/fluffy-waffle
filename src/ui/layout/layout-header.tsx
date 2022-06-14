import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  createStyles,
  Header,
  ActionIcon,
  Container,
  Burger,
  Transition,
  Paper,
  useMantineTheme,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { IconBrandGithub } from '@tabler/icons';

import { Brand, IconBrandNekopost } from './brand';
import { ThemeToggler } from './theme-toggler';

type LayoutHeaderProps = {
  blend?: boolean;
  tabs?: React.ReactNode;
  links: { link: string; label: string; icon: React.ReactNode }[];
};

export const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    height: HEADER_HEIGHT,

    willChange: 'background-color border-bottom',

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  links: {
    gap: 6,
    display: 'flex',

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  icons: {
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.fn.smallerThan('xs')]: {
      '& [data-external-link="true"]': { display: 'none' },
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'flex',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    alignItems: 'center',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    '& > svg': { display: 'none' },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: 14,
      '& > svg': { display: 'initial', paddingRight: 8, width: 28, height: 28 },
    },
  },

  linkActive: {
    pointerEvents: 'none',

    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export const LayoutHeader = ({ blend, links, tabs }: LayoutHeaderProps) => {
  const theme = useMantineTheme();
  const ref = useRef<HTMLDivElement>(null);

  const [opened, toggleOpened] = useBooleanToggle(false);

  const { classes, cx } = useStyles();
  const { pathname } = useRouter();

  useEffect(() => {
    const bgColor = theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white;

    const borderColor =
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2];

    const bg = hexToRgb(bgColor);
    const target = ref.current;

    if (!blend || !target || !bg) {
      return;
    }

    if (opened) {
      return target.style.setProperty('background-color', bgColor);
    }

    const listener = () => {
      const opacity = window.scrollY / 288;

      target.style.setProperty(
        'border-bottom',
        `1px solid ${opacity >= 1 ? borderColor : 'transparent'}`
      );

      target.style.setProperty(
        'background-color',
        `rgb(${bg.r}, ${bg.g}, ${bg.b}, ${opacity})`
      );
    };

    listener();
    window.addEventListener('scroll', listener, { passive: true });

    return () => {
      target.style.removeProperty('background-color');
      target.style.removeProperty('border-color');
      window.removeEventListener('scroll', listener);
    };
  }, [blend, opened, theme]);

  const items = links.map((link) => (
    <Link key={link.label} href={link.link}>
      <a className={cx(classes.link, pathname === link.link && classes.linkActive)}>
        {link.icon}
        {link.label}
      </a>
    </Link>
  ));

  return (
    <Header ref={ref} height={HEADER_HEIGHT + (tabs ? 40 : 0)}>
      <Container className={classes.inner}>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          size="sm"
          m={0}
          className={classes.burger}
        />

        <div className={classes.links}>{items}</div>

        <Transition transition="pop-top-left" duration={200} mounted={opened}>
          {(style) => (
            <Paper
              style={style}
              className={classes.dropdown}
              onClick={() => toggleOpened(false)}
            >
              {items}
            </Paper>
          )}
        </Transition>

        <Link href="/browse" shallow>
          <a style={{ height: 30 }}>
            <Brand />
          </a>
        </Link>

        <div className={classes.icons}>
          <ActionIcon
            component="a"
            href="https://www.nekopost.net/"
            size="lg"
            data-external-link
          >
            <IconBrandNekopost />
          </ActionIcon>

          <ActionIcon size="lg" data-external-link>
            <IconBrandGithub size={18} />
          </ActionIcon>

          <ThemeToggler />
        </div>
      </Container>
      {tabs && <Container>{tabs}</Container>}
    </Header>
  );
};

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
