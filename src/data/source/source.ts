export enum ProxyTarget {
  Thumbnail,
  Cover,
  Avatar,
  Page,
}

export type ProxyTargetArgMap = {
  /**
   * [projectId, imageVersion]
   */
  [ProxyTarget.Thumbnail]: [string, string];
  /**
   * [projectId, filename]
   */
  [ProxyTarget.Cover]: [string, string];
  /**
   * [userId]
   */
  [ProxyTarget.Avatar]: [string];
  /**
   * [projectId, chapterId, filename]
   */
  [ProxyTarget.Page]: [string, string, string];
};

export function getThumbnailUrl(projectId: string, imageVersion: string) {
  return `/api/asset/${ProxyTarget.Thumbnail}/${projectId}/${imageVersion}`;
}

export function getCoverUrl(projectId: string, filename: string) {
  return `/api/asset/${ProxyTarget.Cover}/${projectId}/${filename}`;
}

export function getAvatarUrl(userId: string) {
  return `/api/asset/${ProxyTarget.Avatar}/${userId}`;
}

export function getPageUrl(projectId: string, chapterId: string, filename: string) {
  return `/api/asset/${ProxyTarget.Page}/${projectId}/${chapterId}/${filename}`;
}
