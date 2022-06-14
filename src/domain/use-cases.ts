import { Container } from 'typedi';

import { projectTypes } from '~/core/types';
import { RepositoryImpl } from '~/data/repository-impl';

import type { ProjectType } from '~/core/types';
import type { ProjectInfo } from './models';
import { firstValueFrom } from 'rxjs';

const repo = Container.get(RepositoryImpl);

export function getProjectUseCase(projectId: number) {
  if (typeof projectId !== 'number') throw new TypeError();
  return repo.getProject(projectId);
}

export function putProjectInfoUseCase(info: ProjectInfo) {
  return firstValueFrom(repo.putProjectInfo(info));
}

export function getBrowseProject(projectType: ProjectType) {
  if (!projectTypes.includes(projectType)) throw new TypeError();
  return repo.getBrowse(projectType);
}

export const getFavoritesUseCase = (type: ProjectType) => {
  if (!projectTypes.includes(type)) throw new TypeError();
  return repo.getFavoriteProject(type);
};

export const getChapterContentUseCase = (projectId: number, chapterId: number) => {
  if (typeof projectId !== 'number' || typeof chapterId !== 'number')
    throw new TypeError();

  return repo.getChapterContent(projectId, chapterId);
};

export const pushActivityUseCase = (activityId: number, chapterId: number) => {
  if (typeof activityId !== 'number' || typeof chapterId !== 'number')
    throw new TypeError();

  return firstValueFrom(repo.pushActivity(activityId, chapterId));
};

export const popActivityUseCase = (activityId: number) => {
  if (typeof activityId !== 'number') throw new TypeError();

  return firstValueFrom(repo.popActivity(activityId));
};

export const getActivitiesUseCase = (page = 1) => {
  if (page < 1) throw new TypeError();
  return repo.getActivities(page);
};
