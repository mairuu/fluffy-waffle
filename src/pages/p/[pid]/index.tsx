import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import type { NekoPage } from '~/pages/_app';
import { Layout } from '~/ui/layout/layout';

const ProjectView = dynamic(() => import('~/ui/project/project-view'), { ssr: false });

const ProjectPage: NekoPage = () => {
  const router = useRouter();
  const pid = router.query.pid as string;

  if (pid === undefined || !router.isReady) return null;

  return <ProjectView projectId={parseInt(pid)} />;
};

ProjectPage.getLayout = (page) => <Layout withTransparentHeader>{page}</Layout>;

export default ProjectPage;
