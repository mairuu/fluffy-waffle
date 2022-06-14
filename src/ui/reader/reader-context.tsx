import { createContext, useContext, useEffect, useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import type {
  ChapterContent,
  ChapterImageContent,
  ChapterInfo,
  ChapterTextContent,
  Project,
} from '~/domain/models';
import { pushActivityUseCase } from '~/domain/use-cases';
import { useChapterContent, useProject } from '../shared/hooks';

export interface ReaderContextValue {
  currentChapter?: ChapterInfo | null;
  project?: Project | null;
  content?: ChapterContent | null;
  navHidden$: BehaviorSubject<boolean>;
}

type Retrieved<T extends object> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export function isRetrieved<T extends ReaderContextValue>(ctx: T): ctx is Retrieved<T> {
  return !!ctx.project;
}

const context = createContext<ReaderContextValue>(null as any);

export const useReaderContext = () => useContext(context);

export const useReaderTextContext = useReaderContext as () => Retrieved<
  ReaderContextValue & { content: ChapterTextContent }
>;

export const useReaderImageContext = useReaderContext as () => Retrieved<
  ReaderContextValue & { content: ChapterImageContent }
>;

export const ReaderProvider = ({
  chapterId,
  projectId,
  children,
}: {
  chapterId: number;
  projectId: number;
  children?: React.ReactNode;
}) => {
  const { project } = useProject(projectId);
  const { chapterContent } = useChapterContent(projectId, chapterId);

  const value = useMemo<ReaderContextValue>(() => {
    const navHidden$ = new BehaviorSubject(false);

    const currentChapter = project?.chapters?.find(
      (chapter) => chapter.id === chapterId
    );

    return {
      project,
      currentChapter,
      content: chapterContent as any,
      navHidden$,
    };
  }, [chapterContent, chapterId, project]);

  useEffect(() => {
    if (project?.info.id && value.currentChapter?.id)
      pushActivityUseCase(project.info.id, value.currentChapter.id);
  }, [project?.info.id, value.currentChapter?.id]);

  useEffect(() => {
    const li = () => {
      if (!value.navHidden$.value) value.navHidden$.next(true);
      else if (window.scrollY === 0 && value.navHidden$.value)
        value.navHidden$.next(false);
    };

    window.addEventListener('scroll', li, { passive: true });
    return () => window.removeEventListener('scroll', li);
  }, [value.navHidden$]);

  return <context.Provider value={value}>{children}</context.Provider>;
};
