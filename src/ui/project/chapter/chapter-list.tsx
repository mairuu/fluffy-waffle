import {
  ActionIcon,
  createStyles,
  Group,
  Pagination,
  Skeleton,
  Text,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons';

import type { ChapterInfo, ProjectInfo } from '~/domain/models';
import { ChapterListItem } from './chapter-list-item';
import {
  Order,
  ITEM_PER_PAGE,
  useChapterListPresentator,
} from './chapter-list-presentator';

const ITEM_GAP = 8;
const ESTIMATE_ITEM_HEIGHT = 57;

const useStyles = createStyles({
  root: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    gap: 16,
  },
  item_container: {
    margin: '0 -16px',
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: ITEM_GAP,
    minHeight: ESTIMATE_ITEM_HEIGHT * ITEM_PER_PAGE + ITEM_GAP * ITEM_PER_PAGE - 1,
  },
});

type ChapterListProps = {
  loaded?: boolean;
  project?: ProjectInfo;
  chapters?: ChapterInfo[] | null;
};

export const ChapterList = (props: ChapterListProps) => {
  const { chapters, project, loaded } = props;
  const { classes } = useStyles();
  const { order, length, totals, activePage, setPage, toggleOrder } =
    useChapterListPresentator({ chapters });

  const pid = project?.id;
  const items = [];

  if (chapters && loaded) {
    const mapItem = (chapter: ChapterInfo, i: number) => {
      return (
        <ChapterListItem key={i} chapter={chapter} to={`/p/${pid}/${chapter.id}`} />
      );
    };

    if (order === Order.ASC) {
      const from = (activePage - 1) * ITEM_PER_PAGE;
      const to = Math.min(from + ITEM_PER_PAGE, length);

      for (let i = from; i < to; i++) {
        const e = chapters[i];
        items.push(mapItem(e, i));
      }
    }

    if (order === Order.DESC) {
      const from = length - (activePage - 1) * ITEM_PER_PAGE - 1;
      const to = Math.max(from - ITEM_PER_PAGE + 1, 0);

      for (let i = from; i >= to; i--) {
        const e = chapters[i];
        items.push(mapItem(e, i));
      }
    }
  } else if (!loaded) {
    // ...
  }

  return (
    <div className={classes.root}>
      <Group position="apart">
        {loaded ? (
          <Text weight={600}>{countChapter(length)}</Text>
        ) : (
          <Skeleton height={16} width={96} />
        )}
        <ActionIcon onClick={toggleOrder}>
          {order === Order.ASC ? <IconSortAscending /> : <IconSortDescending />}
        </ActionIcon>
      </Group>

      <div className={classes.item_container}>{items}</div>

      <Pagination
        ml="auto"
        mr="auto"
        color="dark"
        radius="xl"
        total={totals}
        page={activePage}
        onChange={setPage}
        withControls={false}
      />
    </div>
  );
};

function countChapter(no: string | number) {
  const i = parseInt(no as any);
  return `${i} chapter${i > 1 ? 's' : ''}`;
}
