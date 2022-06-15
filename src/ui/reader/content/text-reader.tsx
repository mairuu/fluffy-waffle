import { createStyles } from '@mantine/core';

import { useReaderTextContext } from '../reader-context';
import { ChapterTitle } from './chapter-title';
import { NextChapter } from './next-chapter';

const useStyles = createStyles({
  root: {
    display: 'flex',
  },
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: '18px 36px',

    '& figure': {
      display: 'flex',
      justifyContent: 'center',
      margin: '16px 24px',
    },

    '& img': {
      maxWidth: '100%',
      width: 'auto !important',
      height: 'auto !important',
    },
  },

  content: {
    fontSize: 18,
  },
});

export const TextReader = () => {
  const { content } = useReaderTextContext();
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <ChapterTitle />

        <div
          className={classes.content}
          dangerouslySetInnerHTML={{
            __html: content.content,
          }}
        />

        <NextChapter />
      </div>
    </div>
  );
};
