/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ProjectType } from '~/core/types';
import type {
  ProjectGenre,
  ProjectMedia,
  ProjectContributor,
  ProjectInfo,
  ChapterInfo,
  Project,
} from '~/domain/models';

export type ProjectInfoEntity = {
  id: number;
  type: ProjectType;
  title: string;

  views: number;
  artist: string;
  author: string;
  favorite: boolean;
  synopsis: string;
  releaseDate: number;
  thumbnailUrl: string;

  genres: ProjectGenre[];
  medias: ProjectMedia[];
  contributors: ProjectContributor[];

  lastUpdate: number;
};

export type ChapterInfoEntity = {
  id: number;
  no: string;
  name: string;
  provider: string;
  createDate: number;

  readAt: number;
  projectId: number;
};

export type FavoriteProjectEntity = {
  id: number;
  type: ProjectType;
  title: string;
  dateAdded: number;
  thumbnailUrl: string;
};

export type ActityEntity = {
  id: number;
  title: string;
  readAt: number;
  chapterId: number;
  chapterNo: string;
  thumbnailUrl: string;
};

export class DAOMapper {
  static toProjectInfo(info: ProjectInfoEntity): ProjectInfo {
    return info;
  }

  static toChapterInfo(info: ChapterInfoEntity): ChapterInfo {
    const { projectId, ...c } = info;
    return c;
  }

  static toProject({
    info,
    chapters,
  }: {
    info: ProjectInfoEntity;
    chapters: ChapterInfoEntity[];
  }): Project {
    return {
      info: DAOMapper.toProjectInfo(info),
      chapters: chapters.map(DAOMapper.toChapterInfo),
    };
  }

  static toFavoriteProjectInfo(info: FavoriteProjectEntity) {
    return info;
  }
}
