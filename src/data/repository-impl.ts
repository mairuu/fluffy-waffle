import { Service } from 'typedi';
import {
  catchError,
  concat,
  firstValueFrom,
  map,
  mergeMap,
  of,
  switchMap,
  zip,
} from 'rxjs';
import type { Observable } from 'rxjs';

import { DTOMapper } from './remote/entities';
import { DAOMapper } from './local/entities';
import { Resource } from '~/core/utils';

import type { ProjectType } from '~/core/types';
import type { IRepository } from '~/domain/repository';
import type { ChapterContent, Project, ProjectInfo } from '~/domain/models';
import type { ChapterInfoDto } from './remote/entities';
import type { ChapterInfoEntity } from './local/entities';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NekoAPI } from './remote/neko-api';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NekoDAO } from './local/neko-dao';

@Service()
export class RepositoryImpl implements IRepository {
  //
  constructor(private dao: NekoDAO, private api: NekoAPI) {}

  private syncProject = mergeMap(async (project: Project) => {
    const promise = firstValueFrom;
    const dao = this.dao;
    const projectId = project.info.id;

    const old = await promise(dao.getProject(projectId));
    project.info.favorite = old?.favorite || false;
    project.info.lastUpdate = Date.now();

    const updateProjectJob = promise(dao.putProject(project.info, true));

    const local = await promise(dao.getChapters(projectId));
    const localLookup = new Map<number, ChapterInfoEntity>();
    local.forEach((chapter) => localLookup.set(chapter.id, chapter));

    const remote = project.chapters;
    const remoteLookup = new Map<number, ChapterInfoDto>();
    remote.forEach((chapter) => remoteLookup.set(chapter.id, chapter));

    const toAdd = remote
      .filter((chapter) => !localLookup.has(chapter.id))
      .map<ChapterInfoEntity>((info) => ({ ...info, projectId }));

    const toDelete = local
      .filter((chapter) => !remoteLookup.has(chapter.id))
      .map((info) => info.id);

    const updateJob = toAdd.length && promise(dao.putChapters(toAdd, true));
    const deleteJob = toDelete.length && promise(dao.deleteChapters(toDelete, true));

    await Promise.all([updateProjectJob, updateJob, deleteJob]);
  });

  private fetchAndSyncProject(projectId: number) {
    return this.api.getProject(projectId).pipe(
      map(DTOMapper.toProject),
      this.syncProject,
      switchMap(() => this.getLocalProject(projectId))
    );
  }

  private resouce<T>(observable: Observable<T>): Observable<Resource<T>> {
    return observable.pipe(
      map((result) => new Resource.Success(result)),
      catchError((err) => of(new Resource.Error(null, err?.message)))
    );
  }

  private getLocalProject(projectId: number) {
    return zip(this.dao.getProject(projectId), this.dao.getChapters(projectId)).pipe(
      map(([info, chapters]) =>
        info
          ? {
              info: DAOMapper.toProjectInfo(info),
              chapters: chapters.map(DTOMapper.toChapterInfo),
            }
          : undefined
      )
    );
  }

  getProject(projectId: number) {
    const project$ = this.getLocalProject(projectId).pipe(
      switchMap((project) =>
        // revalidate in 3 minutes
        project && project?.info?.lastUpdate + 1000 * 60 * 3 > Date.now()
          ? of(project)
          : concat(of(project), this.fetchAndSyncProject(projectId))
      )
    );

    return this.resouce(project$);
  }

  putProjectInfo(info: ProjectInfo) {
    return this.dao.putProject(info);
  }

  getBrowse(projectType: ProjectType) {
    return this.resouce(this.api.getBrowse(projectType));
  }

  getFavoriteProject(type: ProjectType) {
    return this.dao.getFavorites(type).pipe(map((e) => new Resource.Success(e)));
  }

  popActivity(activityId: number) {
    return this.dao.popActivity(activityId);
  }

  pushActivity(activityId: number, chapterId: number) {
    return this.dao.pushActivity({ activityId, chapterId });
  }

  getActivities(page: number) {
    return this.resouce(this.dao.getActivities(page));
  }

  getChapterContent(
    projectId: number,
    chapterId: number
  ): Observable<Resource<ChapterContent>> {
    return this.resouce(this.api.getChapterContent(projectId, chapterId));
  }
}
