import { AppShell } from '@mantine/core';

import { ReaderContent } from './content';
import { ReaderFooter } from './footer';
import { ReaderHeader } from './header';
import { ReaderProvider } from './reader-context';

export type ReaderViewProps = {
  chapterId: number;
  projectId: number;
};

export const ReaderView = (props: ReaderViewProps) => {
  return (
    <ReaderProvider {...props}>
      <AppShell
        fixed
        styles={(theme) => ({
          main: {
            paddingTop: 'calc(var(--mantine-header-height, 0px) + 16px)',
            paddingRight: 'calc(var(--mantine-aside-width, 0px) + 0px)',
            paddingBottom: ' calc(var(--mantine-footer-height, 0px) + 16px)',
            paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 0px)',

            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
        header={<ReaderHeader />}
        footer={<ReaderFooter />}
      >
        <ReaderContent />
      </AppShell>
    </ReaderProvider>
  );
};

export default ReaderView;
