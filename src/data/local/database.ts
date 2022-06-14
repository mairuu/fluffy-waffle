import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase, OpenDBCallbacks } from 'idb';

import type { ProjectType } from '~/core/types';
import type {
  ActityEntity,
  ChapterInfoEntity,
  FavoriteProjectEntity,
  ProjectInfoEntity,
} from './entities';

export type NekoDB = IDBPDatabase<NekoDBSchema>;

export interface NekoDBSchema extends DBSchema {
  projects: {
    key: number;
    value: ProjectInfoEntity;
  };

  chapters: {
    key: number;
    value: ChapterInfoEntity;
    indexes: {
      projectId: number;
      readAt: [number, number];
    };
  };

  favorites: {
    value: FavoriteProjectEntity;
    key: number;
    indexes: {
      dateAdded: [ProjectType, number];
    };
  };

  activities: {
    value: ActityEntity;
    key: number;
    indexes: {
      readAt: number;
    };
  };
}

const DB_NAME = 'NEKO_DB';
const DB_VERSION = 1;

export function openDatabase(): Promise<NekoDB> {
  type Callback = OpenDBCallbacks<NekoDBSchema>;

  const upgrade: Callback['upgrade'] = (db, oldVersion) => {
    switch (oldVersion) {
      case 0:
        {
          const store = db.createObjectStore('projects', { keyPath: 'id' });
        }
        {
          const store = db.createObjectStore('chapters', { keyPath: 'id' });
          store.createIndex('projectId', 'projectId');
          store.createIndex('readAt', ['projectId', 'readAt']);
        }
        {
          const store = db.createObjectStore('favorites', { keyPath: 'id' });
          store.createIndex('dateAdded', ['type', 'dateAdded']);
        }
        {
          const store = db.createObjectStore('activities', { keyPath: 'id' });
          store.createIndex('readAt', 'readAt');
        }
    }
  };

  return openDB(DB_NAME, DB_VERSION, { upgrade });
}
