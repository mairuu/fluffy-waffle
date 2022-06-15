import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';

import { putProjectInfoUseCase } from '~/domain/use-cases';
import { useProject } from '~/ui/shared/hooks';
import type { Project, ProjectInfo } from '~/domain/models';

function favoriteController(info?: ProjectInfo) {
  const toggleFavorite = () => {
    if (!info) return;

    const _info = { ...info };
    _info.favorite = !_info.favorite;

    putProjectInfoUseCase(_info);
  };

  return {
    label: info ? (info.favorite ? 'Remove from favorite' : 'Add to favorite') : '',
    click: toggleFavorite,
  };
}

function nextChapterController(
  project: Project | null | undefined,
  router: NextRouter
) {
  const { chapters, info } = project || {};
  let next = chapters?.[0];

  if (!chapters || !info)
    return {
      label: '',
    };

  for (let i = chapters.length - 1; i >= 0; --i)
    if (chapters[i].readAt !== -1) {
      next = chapters[i + 1] || chapters[i];
      break;
    }

  if (!next)
    return {
      label: '',
    };

  const click = () => {
    router.push(`/p/${info.id}/${next?.id}`, undefined, { shallow: true });
  };

  if (next === chapters[chapters.length - 1])
    return {
      label: 'Read the latest chapter',
      click,
    };

  if (next === chapters[0])
    return {
      label: 'Start reading',
      click,
    };

  return {
    click,
    label: 'Continue reading',
    icon: next?.no,
  };
}

export const useProjectPresentator = (projectId: number) => {
  const { project, isError, isLoading } = useProject(projectId);
  const router = useRouter();

  return {
    project,
    isError,
    isLoading,

    favorite: favoriteController(project?.info),
    next: nextChapterController(project, router),
  };
};
