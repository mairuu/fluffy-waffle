import type { Observable } from 'rxjs';

import type { ProjectType } from '~/core/types';
import type { Resource } from '~/core/utils';
import type {
  Activity,
  BrowseProject,
  ChapterContent,
  FavoriteProject,
  Project,
  ProjectInfo,
} from './models';

export interface IRepository {
  //
  getProject(projectId: number): Observable<Resource<Project | undefined>>;

  putProjectInfo(project: ProjectInfo): void;

  getBrowse(projectType: ProjectType): Observable<Resource<BrowseProject>>;

  getFavoriteProject(type: ProjectType): Observable<Resource<FavoriteProject[]>>;

  getChapterContent(
    projectId: number,
    chapterId: number
  ): Observable<Resource<ChapterContent>>;

  popActivity(activityId: number): Observable<void>;

  pushActivity(activityId: number, chapterId: number): Observable<void>;

  getActivities(page: number): Observable<Resource<Activity[]>>;
}
