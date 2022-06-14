import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import type { NekoPage } from '~/pages/_app';

const ReaderView = dynamic(() => import('~/ui/reader/reader-view'), { ssr: false });

const ChapterPage: NekoPage = () => {
  const route = useRouter();
  if (!route.isReady) return null;

  const { pid, cid } = route.query as { pid: string; cid: string };
  const projectId = parseInt(pid);
  const chapterId = parseInt(cid);

  return <ReaderView chapterId={chapterId} projectId={projectId} />;
};

export default ChapterPage;
