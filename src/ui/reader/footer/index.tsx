import { Group, ActionIcon } from '@mantine/core';
import { IconCaretLeft, IconCaretRight } from '@tabler/icons';

import { useChapterNavigation } from '../hooks';
import { _Footer as Footer } from './_footer';

export const ReaderFooter = () => {
  const { goToNextChapter, goToPrevChapter } = useChapterNavigation();

  return (
    <Footer>
      <Group
        sx={(theme) => ({
          marginLeft: 'auto',
          [theme.fn.largerThan('md')]: {
            marginRight: 'auto',
          },
        })}
      >
        <ActionIcon
          size="xl"
          onClick={goToPrevChapter}
          style={{
            pointerEvents: goToPrevChapter ? 'initial' : 'none',
            filter: goToPrevChapter ? 'none' : 'grayscale(0.5) opacity(0.5)',
          }}
        >
          <IconCaretLeft fill="currentcolor" />
        </ActionIcon>

        <ActionIcon
          size="xl"
          onClick={goToNextChapter}
          style={{
            pointerEvents: goToNextChapter ? 'initial' : 'none',
            filter: goToNextChapter ? 'none' : 'grayscale(0.5) opacity(0.5)',
          }}
        >
          <IconCaretRight fill="currentcolor" />
        </ActionIcon>
      </Group>
    </Footer>
  );
};
