import type { NekoPage } from './_app';

import { Layout } from '~/ui/layout/layout';

const HomePage: NekoPage = () => {
  return null;
};

HomePage.getLayout = (page) => <Layout>{page}</Layout>;

export default HomePage;
