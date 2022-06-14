import { Service } from 'typedi';
import { switchMap, BehaviorSubject, tap, from } from 'rxjs';
import type { Observable } from 'rxjs';

import type { ProjectType } from '~/core/types';
import { openDatabase } from './database';
import type { NekoDB } from './database';
import type {
  ActityEntity,
  ChapterInfoEntity,
  FavoriteProjectEntity,
  ProjectInfoEntity,
} from './entities';
import type {
  ChapterQuery,
  FavoriteQuery,
  ProjectQuery,
  ActivityQuery,
} from './quries';

@Service()
export class NekoDAO
  implements ProjectQuery, ChapterQuery, FavoriteQuery, ActivityQuery
{
  private _db = openDatabase();
  private _mut$ = new BehaviorSubject<void>(undefined);
  private _channel = new BroadcastChannel('neko_mutation');

  constructor() {
    this._channel.onmessage = () => this._mut$.next();
  }

  private query<T>(queryFn: (db: NekoDB) => Promise<T>): Observable<T> {
    return this._mut$.pipe(switchMap(async () => queryFn(await this._db)));
  }

  private mutation<T>(
    mutationFn: (db: NekoDB) => Promise<T>,
    supress?: boolean
  ): Observable<T> {
    return from(this._db).pipe(
      switchMap(mutationFn),
      tap(() => !supress && this.notify())
    );
  }

  private notify() {
    this._mut$.next();
    this._channel.postMessage(undefined);
  }

  getProject(projectId: number): Observable<ProjectInfoEntity | undefined> {
    return this.query((db) => db.get('projects', projectId));
  }

  putProject(project: ProjectInfoEntity, supress?: boolean): Observable<number> {
    return this.mutation((db) => {
      if (project.favorite) {
        db.add('favorites', {
          dateAdded: Date.now(),
          id: project.id,
          type: project.type,
          title: project.title,
          thumbnailUrl: project.thumbnailUrl,
        }).catch(() => {});
      } else {
        db.delete('favorites', project.id).catch(() => {});
      }

      return db.put('projects', project);
    }, supress);
  }

  deleteProject(projectId: number, supress?: boolean): Observable<void> {
    return this.mutation((db) => db.delete('projects', projectId), supress);
  }

  getChapters(projectId: number): Observable<ChapterInfoEntity[]> {
    return this.query((db) => db.getAllFromIndex('chapters', 'projectId', projectId));
  }

  putChapters(chapters: ChapterInfoEntity[], supress?: boolean): Observable<number[]> {
    return this.mutation(async (db) => {
      const tx = db.transaction('chapters', 'readwrite');
      const store = tx.store;
      const ids = chapters.map((chapter) => store.put(chapter));

      await tx.done;
      return Promise.all(ids);
    }, supress);
  }

  deleteChapters(chapterIds: number[], supress?: boolean): Observable<void> {
    return this.mutation(async (db) => {
      const tx = db.transaction('chapters', 'readwrite');
      const store = tx.store;
      chapterIds.map((chapterId) => store.delete(chapterId));
      await tx.done;
    }, supress);
  }

  getFavorites(type: ProjectType): Observable<FavoriteProjectEntity[]> {
    return this.query(async (db) => {
      let cursor = await db
          .transaction('favorites')
          .store.index('dateAdded')
          .openCursor(
            IDBKeyRange.bound([type, 0], [type, Number.MAX_SAFE_INTEGER]),
            'prev'
          ),
        i = 0;

      const items: FavoriteProjectEntity[] = [];

      while (cursor && i++ < 24) {
        items.push(cursor.value);
        cursor = await cursor.continue();
      }

      return items;
    });
  }

  pushActivity(
    {
      activityId,
      chapterId,
    }: {
      activityId: number;
      chapterId: number;
    },
    suppress?: boolean
  ) {
    return this.mutation(async (db) => {
      const tx = db.transaction(['activities', 'chapters', 'projects'], 'readwrite');
      const activityStore = tx.objectStore('activities');
      const chapterStore = tx.objectStore('chapters');
      const projectStore = tx.objectStore('projects');

      let activity = await activityStore.get(activityId);
      if (!activity) {
        const project = await projectStore.get(activityId);
        if (!project) return;

        activity = {
          id: project.id,
          title: project.title,
          readAt: -1,
          chapterId: -1,
          chapterNo: '',
          thumbnailUrl: project.thumbnailUrl,
        };
      }

      const chapter = await chapterStore.get(chapterId);
      if (!chapter) return;

      chapter.readAt = Date.now();
      activity.chapterNo = chapter.no;
      activity.chapterId = chapter.id;
      activity.readAt = chapter.readAt;

      await Promise.all([chapterStore.put(chapter), activityStore.put(activity)]);
    }, suppress);
  }

  popActivity(activityId: number, suppress?: boolean) {
    return this.mutation(async (db) => {
      const tx = db.transaction(['activities', 'chapters'], 'readwrite');
      const activityStore = tx.objectStore('activities');
      const chapterStore = tx.objectStore('chapters');

      const activity = await activityStore.get(activityId);
      if (!activity) return;

      const chapter = await chapterStore.get(activity.chapterId);
      if (!chapter) return;

      chapter.readAt = -1;
      await chapterStore.put(chapter);

      const next = await chapterStore
        .index('readAt')
        .openCursor(
          IDBKeyRange.bound([activityId, 0], [activityId, Number.MAX_SAFE_INTEGER]),
          'prev'
        );

      if (!next || next.value.readAt === -1) {
        await activityStore.delete(activity.id);
      } else {
        activity.chapterNo = next.value.no;
        activity.chapterId = next.value.id;
        activity.readAt = next.value.readAt;

        await activityStore.put(activity);
      }
    }, suppress);
  }

  getActivities(page: number) {
    return this.query(async (db) => {
      let cursor = await db
          .transaction('activities')
          .store.index('readAt')
          .openCursor(null, 'prev'),
        i = 0;

      const items: ActityEntity[] = [];

      while (cursor && i++ < 36 * page) {
        items.push(cursor.value);
        cursor = await cursor.continue();
      }

      return items;
    });
  }
}
