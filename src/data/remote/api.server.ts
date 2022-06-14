import { toProjectType } from '~/core/utils';
import type { ProjectType } from '~/core/types';
import type { BrowseItem, BrowseProject } from '~/domain/models';

import {
  getThumbnailUrl,
  getCoverUrl,
  getAvatarUrl,
  getPageUrl,
} from '../source/source';
import type { ChapterContentDto, ProjectDto, ProjectInfoDto } from './entities';

const enpoints = {
  getArrival: (type: string) =>
    `https://api.osemocphoto.com/frontAPI/getProjectByCriteria/x/n/x/x/${type}/4`,
  getRandom: (type: string) =>
    `https://api.osemocphoto.com/frontAPI/getProjectByCriteria/x/r/x/x/${type}/4`,
  getLatest: (type: string, page = 0) =>
    `https://api.osemocphoto.com/frontAPI/getLatestChapter/${type}/${page}`,
  getProject: (id: string) =>
    `https://api.osemocphoto.com/frontAPI/getProjectInfo/${id}`,
  getChapter: (pid: string, cid: string) =>
    `https://www.osemocphoto.com/collectManga/${pid}/${cid}/${pid}_${cid}.json`,
};

const _cache = new Map<string, { staleAt: number; content: BrowseProject }>();

export async function getBrowse(projectType: ProjectType): Promise<any> {
  const now = Date.now();
  const key = projectType[0];

  const __cache = _cache.get(key);
  if (__cache && __cache.staleAt > now) return __cache.content;

  const [arrival, random, latest] = await Promise.all([
    (await fetch(enpoints.getArrival(key))).json(),
    (await fetch(enpoints.getRandom(key))).json(),
    (await fetch(enpoints.getLatest(key))).json(),
  ]);

  const data = {
    arrival: arrival?.listProject?.map(toBrowseProjectItem).slice(0, 4 * 1) || [],
    random: random?.listProject?.map(toBrowseProjectItem).slice(0, 4 * 1) || [],
    latest: latest?.listChapter?.map(toBrowseProjectItem).slice(0, 4 * 3) || [],
  };

  _cache.set(key, { content: data, staleAt: now + 1000 * 60 * 5 });

  return data;
}

export function toBrowseProjectItem({
  projectId,
  projectName,
  imageVersion,
  providerName,
  createDate,
  updateDate,
}: Record<string, string>): BrowseItem {
  return {
    id: parseInt(projectId),
    title: projectName,
    date: createDate || updateDate,
    provider: providerName,
    thumbnailUrl: getThumbnailUrl(projectId, imageVersion),
  };
}

export async function getProject(projectId: string): Promise<ProjectDto> {
  const i = await (await fetch(enpoints.getProject(projectId))).json();

  const _info = i.projectInfo;
  const _cate: any[] = i.listCate || [];
  const _prov: any[] = i.listProvider || [];
  const _chps: any[] = i.listChapter || [];
  const _medi: any[] = i.listMedia || [];

  const genres = _cate.map(({ cateName }) => cateName);

  const medias = _medi.map(({ fileName }) => getCoverUrl(projectId, fileName));

  const contributors = _prov.map(({ userId, displayName }) => ({
    id: userId,
    profileUrl: getAvatarUrl(userId),
    displayName,
  }));

  const info: ProjectInfoDto = {
    id: parseInt(projectId),
    artist: _info.artistName,
    author: _info.authorName,
    type: toProjectType(_info.projectType),
    synopsis: _info.info,
    title: _info.projectName,
    views: parseInt(_info.views),
    releaseDate: new Date(_info.releaseDate).valueOf(),

    thumbnailUrl: getThumbnailUrl(projectId, _info.imageVersion),
    genres,
    medias,
    contributors,
  };

  const chapters = _chps
    .map(({ chapterId, chapterNo, chapterName, createDate, providerName }) => ({
      id: parseInt(chapterId),
      no: chapterNo,
      name: chapterName,
      provider: providerName,
      createDate: new Date(createDate).valueOf(),
    }))
    .reverse();

  return { info, chapters };
}

export async function getChapterContent(
  projectId: string,
  chapterId: string
): Promise<ChapterContentDto> {
  if (
    !projectId ||
    typeof projectId !== 'string' ||
    !chapterId ||
    typeof chapterId !== 'string'
  )
    throw TypeError();

  const data = await (await fetch(enpoints.getChapter(projectId, chapterId))).json();

  const contentType: 'image' | 'text' = data.pageItem ? 'image' : 'text';

  const content =
    contentType === 'image'
      ? data.pageItem?.map(mapPageItem)
      : data.novelContent || data.pageText || '';

  function mapPageItem(page: any) {
    const filename = page.fileName || page.pageName;

    return {
      src: getPageUrl(projectId, chapterId, filename),
      width: page.width,
      height: page.height,
    };
  }

  return { contentType, content };
}
