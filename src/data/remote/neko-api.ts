import { Service } from 'typedi';
import { fromFetch } from 'rxjs/fetch';
import type { Observable } from 'rxjs';

import type { ProjectType } from '~/core/types';
import type { BrowseProjectDto, ChapterContentDto, ProjectDto } from './entities';

@Service()
export class NekoAPI {
  //
  getProject(projectId: number): Observable<ProjectDto> {
    return fromFetch<ProjectDto>(`/api/p/${projectId}`, {
      selector: (response) => response.json(),
    });
  }

  getBrowse(type: ProjectType): Observable<BrowseProjectDto> {
    return fromFetch<BrowseProjectDto>(`/api/b/${type}`, {
      selector: (response) => response.json(),
    });
  }

  getChapterContent(projectId: number, chapterId: number) {
    return fromFetch<ChapterContentDto>(`/api/p/${projectId}/${chapterId}`, {
      selector: (response) => response.json(),
    });
  }
}
