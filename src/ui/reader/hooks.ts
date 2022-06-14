import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { createStyles, keyframes } from '@mantine/core';

import { useReaderContext } from './reader-context';

export function useChapterNavigation() {
  const route = useRouter();
  const { project, currentChapter } = useReaderContext();

  return useMemo(() => {
    if (!project || !currentChapter || !project.chapters) return {};

    const currentIndex = project.chapters.findIndex(
      (chapter) => chapter.id === currentChapter.id
    );
    const nextChapter = project.chapters[currentIndex + 1];
    const prevChapter = project.chapters[currentIndex - 1];

    const goToPrevChapter = prevChapter ? () => goToChapter(prevChapter) : undefined;

    const goToNextChapter = nextChapter ? () => goToChapter(nextChapter) : undefined;

    function goToChapter(chapter: typeof nextChapter) {
      if (!project) return;

      const path = `/p/${project.info.id}/${chapter.id}`;
      route.push(path, undefined, { shallow: true });
    }

    return { goToChapter, goToPrevChapter, goToNextChapter };
  }, [currentChapter, project, route]);
}

export const useReaderNavHidden = () => {
  const ctx = useReaderContext();

  const [hidden, setHidden] = useState(ctx.navHidden$.value);

  useEffect(() => {
    const sub = ctx.navHidden$.subscribe(setHidden);
    return () => sub.unsubscribe();
  }, [ctx.navHidden$]);

  return hidden;
};

const navIn = keyframes({
  from: { opacity: 0, visibility: 'hidden' },
  to: { opacity: 1, visibility: 'visible' },
});

const navOut = keyframes({
  from: { opacity: 1, visibility: 'visible' },
  to: { opacity: 0, visibility: 'hidden' },
});

export const useNavStyles = createStyles((_, hidden: boolean) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: 12,
    padding: '0 12px',

    animationName: hidden ? navOut : navIn,
    animationDuration: '100ms',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'forwards',
  },
}));
