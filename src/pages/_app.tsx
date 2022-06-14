import Head from 'next/head';
import { useState } from 'react';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import { getCookie, setCookies } from 'cookies-next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import type { ColorScheme } from '@mantine/core';

import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NekoPage<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type NekoAppProps = AppProps & {
  colorScheme: ColorScheme;
  Component: NekoPage;
};

export default function App(props: NekoAppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>NekoNext</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});
