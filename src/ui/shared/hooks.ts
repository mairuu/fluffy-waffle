import { useState, useEffect } from 'react';

import { Resource } from '~/core/utils';
import type { ChapterContent, Project } from '~/domain/models';
import { getChapterContentUseCase, getProjectUseCase } from '~/domain/use-cases';

export const useProject = (projectId: number) => {
  const [resouce, setResouce] = useState<Resource<Project | undefined> | undefined>(
    undefined
  );

  useEffect(() => {
    setResouce(undefined);
    const sub = getProjectUseCase(projectId).subscribe(setResouce);
    return () => sub.unsubscribe();
  }, [projectId]);

  return {
    isError: Resource.isError(resouce),
    isLoading: Resource.isLoading(resouce),
    project: resouce?.data,
  };
};

export const useChapterContent = (projectId: number, chapterId: number) => {
  const [resouce, setResouce] = useState<
    Resource<ChapterContent | undefined> | undefined
  >(undefined);

  useEffect(() => {
    setResouce(undefined);
    const sub = getChapterContentUseCase(projectId, chapterId).subscribe(setResouce);
    return () => sub.unsubscribe();
  }, [chapterId, projectId]);

  return {
    isError: Resource.isError(resouce),
    isLoading: Resource.isLoading(resouce),
    chapterContent: resouce?.data,
  };
};
