import type { NextApiRequest, NextApiResponse } from 'next';
import type { ProjectType } from '~/core/types';
import { projectTypes } from '~/core/types';
import { getBrowse } from '~/data/remote/api.server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=59, stale-while-revalidate=119');

  const { type } = req.query as { type: ProjectType };

  if (!projectTypes.includes(type)) res.status(404).end();

  try {
    const result = await getBrowse(type);
    res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }

  res.status(404).end();
}
