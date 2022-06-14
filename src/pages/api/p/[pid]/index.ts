import type { NextApiRequest, NextApiResponse } from 'next';
import { getProject } from '~/data/remote/api.server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=59, stale-while-revalidate=119');

  const { pid } = req.query as { pid: string };

  try {
    const result = await getProject(pid);
    res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }

  res.status(404).end();
}

// 11510
