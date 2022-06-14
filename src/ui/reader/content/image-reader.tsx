import { createStyles } from '@mantine/core';
import Image from 'next/image';

import { NextChapter } from './next-chapter';
import { useReaderImageContext } from '../reader-context';
import { ChapterTitle } from './chapter-title';

const useStyles = createStyles({
  root: { display: 'flex', flexFlow: 'column' },

  page: {
    minHeight: '20vh',
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'center',
  },

  image: {
    maxWidth: '100%',
  },
});

export const ImageReader = () => {
  const { content } = useReaderImageContext();
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.page}>
        <ChapterTitle />
      </div>

      {content.content.map((e, i) => (
        <div key={i} className={classes.page}>
          <Image
            alt=""
            width={e.width}
            height={e.height}
            unoptimized
            className={classes.image}
            layout="intrinsic"
            lazyBoundary="800px 0px"
            src={e.src}
          />
        </div>
      ))}

      <NextChapter />
    </div>
  );
};
