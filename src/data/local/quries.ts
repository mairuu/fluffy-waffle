import type { Observable } from 'rxjs';
import type { ProjectType } from '~/core/types';

import type {
  ChapterInfoEntity,
  FavoriteProjectEntity,
  ProjectInfoEntity,
} from './entities';

export interface ProjectQuery {
  //
  getProject(projectId: number): Observable<ProjectInfoEntity | undefined>;
  putProject(project: ProjectInfoEntity): Observable<number>;
  deleteProject(projectId: number): Observable<void>;
}

export interface ChapterQuery {
  //
  getChapters(projectId: number): Observable<ChapterInfoEntity[]>;
  putChapters(chapters: ChapterInfoEntity[]): Observable<number[]>;
  deleteChapters(chapterIds: number[]): Observable<void>;
}

export interface FavoriteQuery {
  //
  getFavorites(type: ProjectType): Observable<FavoriteProjectEntity[]>;
}

export interface ActivityQuery {
  //
  pushActivity(args: { activityId: number; chapterId: number }): Observable<void>;

  popActivity(activityId: number): Observable<void>;
}
