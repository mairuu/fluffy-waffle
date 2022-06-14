import Head from 'next/head';
import { Text } from '@mantine/core';
import { IconList } from '@tabler/icons';

import { ThemeToggler } from '~/ui/layout/theme-toggler';
import { useReaderContext } from '../reader-context';
import { _Header as Header } from './_header';
import Link from 'next/link';

export const ReaderHeader = () => {
  const { project, currentChapter } = useReaderContext();

  if (!project || !currentChapter) return null;

  return (
    <>
      <Head>
        <title>
          {project.info?.title} - {currentChapter.name}
        </title>
      </Head>

      <Header>
        <Link href={`/p/${project.info.id}`}>
          <a
            style={{
              flexShrink: 0,
              color: 'currentcolor',
              display: 'inline-flex',
            }}
          >
            <IconList size={24} />
          </a>
        </Link>

        <Text component="h2" lineClamp={1} sx={{ flexGrow: 1 }}>
          Ch.{currentChapter.no} - {currentChapter.name}
        </Text>

        <ThemeToggler />
      </Header>
    </>
  );
};
