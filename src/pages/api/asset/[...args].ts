import type { NextApiRequest, NextApiResponse } from 'next';
import type { RequestOptions } from 'https';
import https from 'https';

import type { ProxyTargetArgMap } from '~/data/source/source';
import { ProxyTarget } from '~/data/source/source';

export default async function handler(
  clientReq: NextApiRequest,
  clientRes: NextApiResponse
) {
  return new Promise((resolve) => {
    const options = getRequestOptions(clientReq.query.args as string[]);

    if (!options) {
      clientRes.status(404).end();
      return resolve(undefined);
    }

    const proxy = https.get(
      {
        ...options,
        method: clientReq.method,
        headers: { ...clientReq.headers, ...options.headers },
      },
      (res) => {
        delete res.headers.cookie;
        clientRes.writeHead(res.statusCode!, res.headers);
        res.pipe(clientRes, { end: true });
      }
    );

    clientReq.pipe(proxy, { end: true });
  });
}

type Map = ProxyTargetArgMap;

export function getRequestOptions(params: string[]): RequestOptions | undefined {
  const [type, ...args] = params;

  let path;

  switch (parseInt(type)) {
    case ProxyTarget.Thumbnail: {
      if (args.length !== 2) break;
      const [projectId, imageVersion] = args as Map[ProxyTarget.Thumbnail];

      path = `/collectManga/${projectId}/${projectId}_cover.jpg?${imageVersion}`;
      break;
    }

    case ProxyTarget.Cover: {
      if (args.length !== 2) break;
      const [projectId, filename] = args as Map[ProxyTarget.Cover];

      path = `/collectManga/${projectId}/media/${filename}`;
      break;
    }

    case ProxyTarget.Avatar: {
      if (args.length !== 1) return;
      const [userId] = args as Map[ProxyTarget.Avatar];

      path = `/avatar/avatar_${userId}.jpg`;
      break;
    }

    case ProxyTarget.Page: {
      if (args.length !== 3) return;
      const [projectId, chapterId, filename] = args as Map[ProxyTarget.Page];

      path = `/collectManga/${projectId}/${chapterId}/${filename}`;
      break;
    }
  }

  if (!path) return;

  return {
    path,
    host: 'www.osemocphoto.com',
    headers: {
      host: 'www.osemocphoto.com',
      referer: 'https://www.nekopost.net/',
    },
  };
}
