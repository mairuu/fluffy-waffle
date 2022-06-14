import type { ProjectType } from '~/core/types';

export type BrowseItem = {
  id: number;
  title: string;
  provider: string;
  date: string;
  thumbnailUrl: string;
};

export type BrowseProject = {
  arrival: BrowseItem[];
  random: BrowseItem[];
  latest: BrowseItem[];
};

export type Project = {
  info: ProjectInfo;
  chapters: ChapterInfo[];
};

export type ProjectInfo = {
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

export type ChapterInfo = {
  id: number;
  no: string;
  name: string;
  readAt: number;
  provider: string;
  createDate: number;
};

export type ProjectGenre = string;

export type ProjectMedia = string;

export type ProjectContributor = {
  profileUrl: string;
  displayName: string;
};

export type FavoriteProject = {
  id: number;
  type: ProjectType;
  title: string;
  dateAdded: number;
  thumbnailUrl: string;
};

export type ChapterContent = ChapterImageContent | ChapterTextContent;

export type ChapterImageContent = {
  contentType: 'image';
  content: {
    src: string;
    width: number;
    height: number;
  }[];
};

export type ChapterTextContent = {
  contentType: 'text';
  content: string;
};

export type Activity = {
  id: number;
  title: string;
  readAt: number;
  chapterId: number;
  chapterNo: string;
  thumbnailUrl: string;
};
