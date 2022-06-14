import dynamic from 'next/dynamic';
import type { NekoPage } from '~/pages/_app';

import { Layout } from '~/ui/layout/layout';

const HistoryView = dynamic(() => import('~/ui/history/history-view'), { ssr: false });

const HistoryPage: NekoPage = () => {
  return <HistoryView />;
};

HistoryPage.getLayout = (page) => <Layout>{page}</Layout>;

export default HistoryPage;
