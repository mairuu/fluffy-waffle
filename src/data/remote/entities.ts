import type {
  BrowseProject,
  ChapterImageContent,
  ChapterInfo,
  ChapterTextContent,
  Project,
  ProjectInfo,
} from '~/domain/models';

export type ProjectDto = {
  info: ProjectInfoDto;
  chapters: ChapterInfoDto[];
};

export type ChapterInfoDto = Omit<ChapterInfo, 'readAt'>;

export type ProjectInfoDto = Omit<ProjectInfo, 'favorite' | 'lastUpdate'>;

export type BrowseProjectDto = BrowseProject;

export type ChapterContentDto = ChapterImageContentDto | ChapterTextContentDto;
export type ChapterImageContentDto = ChapterImageContent;
export type ChapterTextContentDto = ChapterTextContent;

export class DTOMapper {
  static toProject(project: ProjectDto): Project {
    return {
      info: DTOMapper.toProjectInfo(project.info),
      chapters: project.chapters.map(DTOMapper.toChapterInfo),
    };
  }

  static toProjectInfo(info: ProjectInfoDto): ProjectInfo {
    return { favorite: false, lastUpdate: -1, ...info };
  }

  static toChapterInfo(info: ChapterInfoDto): ChapterInfo {
    return { readAt: -1, ...info };
  }
}
