import { Box } from '@mantine/core';
import { useChapterNavigation } from '../hooks';

export const NextChapter = () => {
  const { goToNextChapter } = useChapterNavigation();

  if (!goToNextChapter) return null;

  return (
    <Box<'div'>
      onMouseDown={() => {
        goToNextChapter();
      }}
      sx={(theme) => ({
        minHeight: '5rem',
        minWidth: '80%',
        maxWidth: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '.1rem .4rem',
        opacity: 0.5,
        margin: '4rem auto 2rem auto',

        border:
          theme.colorScheme === 'dark'
            ? `2px dashed rgba(255,255,255,.4)`
            : `2px dashed rgba(128,128,128,.6)`,
        cursor: 'pointer',

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? 'rgba(255,255,255,.1)'
              : 'rgba(128,128,128,.1)',
          opacity: 0.7,
        },
      })}
    >
      Next Chapter
    </Box>
  );
};
