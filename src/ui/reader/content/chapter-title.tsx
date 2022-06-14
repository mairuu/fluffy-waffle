import { createStyles, Title, Text } from '@mantine/core';
import Link from 'next/link';

import { useReaderContext } from '../reader-context';

const useStyles = createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexFlow: 'column',
    maxWidth: 960,
    padding: '1rem',
    margin: 'auto',
  },

  link: {
    color: 'currentcolor',
    textDecoration: 'none',
  },
});

export const ChapterTitle = () => {
  const { classes } = useStyles();
  const { currentChapter, project } = useReaderContext();

  return (
    <div className={classes.root}>
      <Link href={`/p/${project?.info.id}`}>
        <a className={classes.link}>
          <Title order={2}>{project?.info?.title}</Title>
        </a>
      </Link>
      <Text color="gray" mt="sm">
        Chaper {currentChapter?.no} - {currentChapter?.provider}
      </Text>
    </div>
  );
};
